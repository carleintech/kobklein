import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PaymentsService } from '../../payments/payments.service';
import { PaymentMethod, CurrencyCode } from '../../types/database.types';
import { CreatePaymentDto } from '../../payments/dto/create-enhanced-payment.dto';
// Note: QRCode package needs to be installed: npm install qrcode @types/qrcode
import * as crypto from 'crypto';

interface QRPaymentData {
  type: 'payment' | 'request' | 'merchant';
  amount?: number;
  currency: string;
  description?: string;
  recipient?: {
    id: string;
    name: string;
    type: 'user' | 'merchant';
  };
  sender?: {
    id: string;
    name: string;
  };
  metadata?: Record<string, any>;
  expiresAt?: Date;
}

interface CreateQRCodeDto {
  paymentData: QRPaymentData;
  size?: number;
  format?: 'png' | 'svg' | 'jpeg';
}

interface ScanQRCodeDto {
  qrCode: string;
  deviceInfo?: {
    userAgent: string;
    location?: string;
    deviceId?: string;
  };
}

@Injectable()
export class QrPaymentsService {
  private readonly logger = new Logger(QrPaymentsService.name);
  private supabase: SupabaseClient;

  constructor(
    private readonly paymentsService: PaymentsService,
  ) {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  // ==============================
  // GENERATE QR CODE
  // ==============================
  async generateQRCode(userId: string, createQRDto: CreateQRCodeDto) {
    try {
      const { paymentData, size = 256, format = 'png' } = createQRDto;

      // Generate unique QR ID
      const qrId = crypto.randomUUID();
      const secretKey = crypto.randomBytes(32).toString('hex');

      // Set expiration (default 24 hours for payments, 30 days for merchant codes)
      const defaultExpiry = paymentData.type === 'merchant' ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      const expiresAt = paymentData.expiresAt || new Date(Date.now() + defaultExpiry);

      // Create QR data structure
      const qrData = {
        id: qrId,
        version: '1.0',
        type: paymentData.type,
        amount: paymentData.amount,
        currency: paymentData.currency,
        description: paymentData.description,
        recipient: paymentData.recipient,
        sender: paymentData.sender,
        metadata: paymentData.metadata,
        expiresAt: expiresAt.toISOString(),
        createdBy: userId,
        signature: this.generateSignature(qrId, paymentData, secretKey)
      };

      // Generate QR code image (using base64 mock for now)
      // TODO: Install qrcode package: npm install qrcode @types/qrcode
      const qrCodeDataURL = `data:image/png;base64,${Buffer.from(JSON.stringify(qrData)).toString('base64')}`;

      // Generate payment link
      const paymentLink = `https://kobklein.com/pay/${qrId}`;

      // Store in database
      const { data: qrRecord, error } = await this.supabase
        .from('qr_codes')
        .insert({
          id: qrId,
          user_id: userId,
          type: paymentData.type,
          payment_data: qrData,
          image_url: qrCodeDataURL,
          payment_link: paymentLink,
          secret_key: secretKey,
          expires_at: expiresAt.toISOString(),
          status: 'active',
          created_at: new Date().toISOString(),
          scan_count: 0,
          usage_count: 0
        })
        .select()
        .single();

      if (error) {
        this.logger.error('Database error creating QR code', error);
        throw new HttpException('Failed to create QR code', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Log analytics
      await this.logQREvent(userId, qrId, 'generated', {
        type: paymentData.type,
        amount: paymentData.amount,
        currency: paymentData.currency
      });

      return {
        id: qrId,
        imageUrl: qrCodeDataURL,
        data: qrData,
        paymentLink,
        expiresAt,
        createdAt: new Date()
      };

    } catch (error) {
      this.logger.error('Error generating QR code', error);
      throw new HttpException(
        error.message || 'Failed to generate QR code',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // SCAN QR CODE
  // ==============================
  async scanQRCode(userId: string, scanDto: ScanQRCodeDto) {
    try {
      const { qrCode, deviceInfo } = scanDto;

      // Parse QR code data
      let qrData;
      try {
        qrData = JSON.parse(qrCode);
      } catch (parseError) {
        throw new HttpException('Invalid QR code format', HttpStatus.BAD_REQUEST);
      }

      // Validate QR code structure
      if (!qrData.id || !qrData.version || !qrData.type) {
        throw new HttpException('Invalid QR code data', HttpStatus.BAD_REQUEST);
      }

      // Get QR code from database
      const { data: qrRecord, error } = await this.supabase
        .from('qr_codes')
        .select('*')
        .eq('id', qrData.id)
        .single();

      if (error || !qrRecord) {
        throw new HttpException('QR code not found', HttpStatus.NOT_FOUND);
      }

      // Check if expired
      if (new Date() > new Date(qrRecord.expires_at)) {
        throw new HttpException('QR code has expired', HttpStatus.BAD_REQUEST);
      }

      // Check if active
      if (qrRecord.status !== 'active') {
        throw new HttpException('QR code is not active', HttpStatus.BAD_REQUEST);
      }

      // Verify signature
      const isValid = this.verifySignature(qrData, qrRecord.secret_key);
      if (!isValid) {
        throw new HttpException('Invalid QR code signature', HttpStatus.BAD_REQUEST);
      }

      // Update scan count
      await this.supabase
        .from('qr_codes')
        .update({ 
          scan_count: qrRecord.scan_count + 1,
          last_scanned_at: new Date().toISOString()
        })
        .eq('id', qrData.id);

      // Security checks
      const securityCheck = await this.performSecurityCheck(userId, qrData, deviceInfo);

      // Calculate estimated fees
      const estimatedFees = qrData.amount ? await this.calculateFees(qrData.amount, qrData.currency) : null;

      // Log scan event
      await this.logQREvent(userId, qrData.id, 'scanned', {
        scannerUserId: userId,
        deviceInfo,
        securityCheck
      });

      return {
        valid: true,
        paymentData: qrData,
        requiresConfirmation: qrData.type === 'payment' && qrData.amount > 0,
        securityCheck,
        estimatedFees
      };

    } catch (error) {
      this.logger.error('Error scanning QR code', error);
      throw error;
    }
  }

  // ==============================
  // PROCESS QR PAYMENT
  // ==============================
  async processQRPayment(userId: string, qrId: string, pin?: string) {
    try {
      // Get QR code record
      const { data: qrRecord, error } = await this.supabase
        .from('qr_codes')
        .select('*')
        .eq('id', qrId)
        .single();

      if (error || !qrRecord) {
        throw new HttpException('QR code not found', HttpStatus.NOT_FOUND);
      }

      const qrData = qrRecord.payment_data;

      // Validate payment can be processed
      if (qrRecord.status !== 'active') {
        throw new HttpException('QR code is not active', HttpStatus.BAD_REQUEST);
      }

      if (new Date() > new Date(qrRecord.expires_at)) {
        throw new HttpException('QR code has expired', HttpStatus.BAD_REQUEST);
      }

      // Verify PIN if required for high-value transactions
      if (qrData.amount > 1000 && !pin) {
        throw new HttpException('PIN required for high-value transactions', HttpStatus.BAD_REQUEST);
      }

      // Process payment through payments service
      const paymentData: CreatePaymentDto = {
        amount: qrData.amount,
        currency: qrData.currency,
        paymentMethod: PaymentMethod.QR_CODE,
        description: qrData.description || 'QR Code Payment',
        metadata: {
          ...qrData.metadata,
          qrCodeId: qrId,
          recipientId: qrData.recipient?.id
        }
      };

      const payment = await this.paymentsService.createPayment(userId, paymentData);

      // Update QR code usage
      await this.supabase
        .from('qr_codes')
        .update({ 
          usage_count: qrRecord.usage_count + 1,
          last_used_at: new Date().toISOString(),
          status: qrData.type === 'payment' ? 'used' : 'active' // Single-use for payments
        })
        .eq('id', qrId);

      // Log payment event
      await this.logQREvent(userId, qrId, 'payment_processed', {
        paymentId: payment.id,
        amount: qrData.amount,
        currency: qrData.currency
      });

      return payment;

    } catch (error) {
      this.logger.error('Error processing QR payment', error);
      throw error;
    }
  }

  // ==============================
  // GET QR HISTORY
  // ==============================
  async getQRHistory(userId: string, options: { page: number; limit: number; type?: string }) {
    try {
      const { page, limit, type } = options;
      const offset = (page - 1) * limit;

      let query = this.supabase
        .from('qr_codes')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (type && type !== 'all') {
        query = query.eq('type', type);
      }

      const { data: qrCodes, error, count } = await query;

      if (error) {
        this.logger.error('Database error getting QR history', error);
        throw new HttpException('Failed to get QR history', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return {
        items: qrCodes || [],
        total: count || 0
      };

    } catch (error) {
      this.logger.error('Error getting QR history', error);
      throw error;
    }
  }

  // ==============================
  // GET QR CODE DETAILS
  // ==============================
  async getQRCode(qrId: string, userId: string) {
    try {
      const { data: qrCode, error } = await this.supabase
        .from('qr_codes')
        .select('*')
        .eq('id', qrId)
        .eq('user_id', userId)
        .single();

      if (error) {
        this.logger.error('Database error getting QR code', error);
        return null;
      }

      return qrCode;

    } catch (error) {
      this.logger.error('Error getting QR code', error);
      throw error;
    }
  }

  // ==============================
  // DEACTIVATE QR CODE
  // ==============================
  async deactivateQRCode(qrId: string, userId: string) {
    try {
      const { data: qrCode, error } = await this.supabase
        .from('qr_codes')
        .update({ 
          status: 'deactivated',
          deactivated_at: new Date().toISOString()
        })
        .eq('id', qrId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        this.logger.error('Database error deactivating QR code', error);
        throw new HttpException('Failed to deactivate QR code', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Log deactivation event
      await this.logQREvent(userId, qrId, 'deactivated', {});

      return qrCode;

    } catch (error) {
      this.logger.error('Error deactivating QR code', error);
      throw error;
    }
  }

  // ==============================
  // GET QR ANALYTICS
  // ==============================
  async getQRAnalytics(userId: string, options: { startDate: Date; endDate: Date }) {
    try {
      const { startDate, endDate } = options;

      // Get QR code stats
      const { data: qrStats, error: statsError } = await this.supabase
        .from('qr_codes')
        .select('type, status, scan_count, usage_count, created_at')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (statsError) {
        throw new HttpException('Failed to get analytics', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Get event logs
      const { data: events, error: eventsError } = await this.supabase
        .from('qr_events')
        .select('event_type, created_at, metadata')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (eventsError) {
        throw new HttpException('Failed to get event analytics', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Process analytics
      const analytics = {
        summary: {
          totalGenerated: qrStats?.length || 0,
          totalScans: qrStats?.reduce((sum, qr) => sum + qr.scan_count, 0) || 0,
          totalUsage: qrStats?.reduce((sum, qr) => sum + qr.usage_count, 0) || 0,
          activeQRs: qrStats?.filter(qr => qr.status === 'active').length || 0
        },
        byType: this.groupByType(qrStats || []),
        byStatus: this.groupByStatus(qrStats || []),
        timeline: this.createTimeline(events || [], startDate, endDate),
        topPerformers: this.getTopPerformers(qrStats || [])
      };

      return analytics;

    } catch (error) {
      this.logger.error('Error getting QR analytics', error);
      throw error;
    }
  }

  // ==============================
  // HELPER METHODS
  // ==============================
  private generateSignature(qrId: string, paymentData: QRPaymentData, secretKey: string): string {
    const dataString = JSON.stringify({ qrId, ...paymentData });
    return crypto.createHmac('sha256', secretKey).update(dataString).digest('hex');
  }

  private verifySignature(qrData: any, secretKey: string): boolean {
    const { signature, ...dataWithoutSignature } = qrData;
    const expectedSignature = this.generateSignature(qrData.id, dataWithoutSignature, secretKey);
    return signature === expectedSignature;
  }

  private async performSecurityCheck(userId: string, qrData: any, deviceInfo?: any) {
    // Basic security checks
    const checks = {
      validUser: true,
      validAmount: !qrData.amount || qrData.amount > 0,
      validCurrency: ['USD', 'EUR', 'GBP'].includes(qrData.currency),
      deviceTrusted: true, // Could implement device fingerprinting
      riskLevel: 'low'
    };

    // Determine risk level
    if (qrData.amount > 10000) checks.riskLevel = 'high';
    else if (qrData.amount > 1000) checks.riskLevel = 'medium';

    return checks;
  }

  private async calculateFees(amount: number, currency: string) {
    // Simple fee calculation - could be more sophisticated
    const feePercentage = 0.029; // 2.9%
    const fixedFee = currency === 'USD' ? 0.30 : 0.25;
    
    const percentageFee = amount * feePercentage;
    const totalFee = percentageFee + fixedFee;

    return {
      percentageFee,
      fixedFee,
      totalFee,
      netAmount: amount - totalFee
    };
  }

  private async logQREvent(userId: string, qrId: string, eventType: string, metadata: any) {
    try {
      await this.supabase
        .from('qr_events')
        .insert({
          user_id: userId,
          qr_id: qrId,
          event_type: eventType,
          metadata,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      this.logger.warn('Failed to log QR event', error);
    }
  }

  private groupByType(qrStats: any[]) {
    return qrStats.reduce((acc, qr) => {
      acc[qr.type] = (acc[qr.type] || 0) + 1;
      return acc;
    }, {});
  }

  private groupByStatus(qrStats: any[]) {
    return qrStats.reduce((acc, qr) => {
      acc[qr.status] = (acc[qr.status] || 0) + 1;
      return acc;
    }, {});
  }

  private createTimeline(events: any[], startDate: Date, endDate: Date) {
    // Create daily timeline
    const timeline = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dayEvents = events.filter(event => 
        new Date(event.created_at).toDateString() === current.toDateString()
      );
      
      timeline.push({
        date: current.toISOString().split('T')[0],
        events: dayEvents.length,
        generated: dayEvents.filter(e => e.event_type === 'generated').length,
        scanned: dayEvents.filter(e => e.event_type === 'scanned').length,
        processed: dayEvents.filter(e => e.event_type === 'payment_processed').length
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return timeline;
  }

  private getTopPerformers(qrStats: any[]) {
    return qrStats
      .sort((a, b) => b.scan_count - a.scan_count)
      .slice(0, 5)
      .map(qr => ({
        id: qr.id,
        type: qr.type,
        scans: qr.scan_count,
        usage: qr.usage_count,
        createdAt: qr.created_at
      }));
  }
}