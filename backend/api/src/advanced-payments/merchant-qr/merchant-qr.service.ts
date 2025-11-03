import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PaymentsService } from '../../payments/payments.service';
import { PaymentMethod, CurrencyCode } from '../../types/database.types';
import { CreatePaymentDto } from '../../payments/dto/create-enhanced-payment.dto';
import * as crypto from 'crypto';

interface CreateMerchantQRDto {
  merchantName: string;
  businessType?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  paymentMethods: string[];
  currency: string;
  fixedAmount?: number;
  variableAmountLimits?: {
    min: number;
    max: number;
  };
  description?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class MerchantQrService {
  private readonly logger = new Logger(MerchantQrService.name);
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
  // CREATE MERCHANT QR
  // ==============================
  async createMerchantQR(userId: string, createDto: CreateMerchantQRDto) {
    try {
      // Generate unique QR ID
      const qrId = crypto.randomUUID();
      const merchantCode = this.generateMerchantCode(createDto.merchantName);

      // Create merchant QR data structure
      const qrData = {
        id: qrId,
        type: 'merchant_qr',
        version: '1.0',
        merchantCode,
        merchantName: createDto.merchantName,
        businessType: createDto.businessType,
        location: createDto.location,
        paymentMethods: createDto.paymentMethods,
        currency: createDto.currency,
        fixedAmount: createDto.fixedAmount,
        variableAmountLimits: createDto.variableAmountLimits,
        description: createDto.description,
        merchantId: userId,
        createdAt: new Date().toISOString()
      };

      // Generate QR code image (using base64 mock for now)
      const qrCodeImage = `data:image/png;base64,${Buffer.from(JSON.stringify(qrData)).toString('base64')}`;

      // Store in database
      const { data: merchantQR, error } = await this.supabase
        .from('merchant_qr_codes')
        .insert({
          id: qrId,
          merchant_id: userId,
          merchant_code: merchantCode,
          merchant_name: createDto.merchantName,
          business_type: createDto.businessType,
          location: createDto.location,
          payment_methods: createDto.paymentMethods,
          currency: createDto.currency,
          fixed_amount: createDto.fixedAmount?.toString(),
          variable_amount_limits: createDto.variableAmountLimits,
          description: createDto.description,
          qr_data: qrData,
          qr_image: qrCodeImage,
          status: 'active',
          created_at: new Date().toISOString(),
          scan_count: 0,
          payment_count: 0,
          total_amount: '0',
          metadata: createDto.metadata || {}
        })
        .select()
        .single();

      if (error) {
        this.logger.error('Database error creating merchant QR', error);
        throw new HttpException('Failed to create merchant QR', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Log creation event
      await this.logMerchantQREvent(userId, qrId, 'qr_created', {
        merchantName: createDto.merchantName,
        businessType: createDto.businessType
      });

      return this.mapDatabaseMerchantQRToInfo(merchantQR);

    } catch (error) {
      this.logger.error('Error creating merchant QR', error);
      throw error;
    }
  }

  // ==============================
  // GET MERCHANT QRS
  // ==============================
  async getMerchantQRs(userId: string, options: { page: number; limit: number; status?: string }) {
    try {
      const { page, limit, status } = options;
      const offset = (page - 1) * limit;

      let query = this.supabase
        .from('merchant_qr_codes')
        .select('*', { count: 'exact' })
        .eq('merchant_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data: merchantQRs, error, count } = await query;

      if (error) {
        this.logger.error('Database error getting merchant QRs', error);
        throw new HttpException('Failed to get merchant QRs', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return {
        items: (merchantQRs || []).map(qr => this.mapDatabaseMerchantQRToInfo(qr)),
        total: count || 0
      };

    } catch (error) {
      this.logger.error('Error getting merchant QRs', error);
      throw error;
    }
  }

  // ==============================
  // GET MERCHANT QR DETAILS
  // ==============================
  async getMerchantQR(qrId: string, userId: string) {
    try {
      const { data: merchantQR, error } = await this.supabase
        .from('merchant_qr_codes')
        .select('*')
        .eq('id', qrId)
        .eq('merchant_id', userId)
        .single();

      if (error) {
        this.logger.error('Database error getting merchant QR', error);
        return null;
      }

      return merchantQR ? this.mapDatabaseMerchantQRToInfo(merchantQR) : null;

    } catch (error) {
      this.logger.error('Error getting merchant QR', error);
      throw error;
    }
  }

  // ==============================
  // UPDATE MERCHANT QR
  // ==============================
  async updateMerchantQR(qrId: string, userId: string, updateDto: Partial<CreateMerchantQRDto>) {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (updateDto.merchantName) updateData.merchant_name = updateDto.merchantName;
      if (updateDto.businessType) updateData.business_type = updateDto.businessType;
      if (updateDto.location) updateData.location = updateDto.location;
      if (updateDto.paymentMethods) updateData.payment_methods = updateDto.paymentMethods;
      if (updateDto.currency) updateData.currency = updateDto.currency;
      if (updateDto.fixedAmount !== undefined) updateData.fixed_amount = updateDto.fixedAmount?.toString();
      if (updateDto.variableAmountLimits) updateData.variable_amount_limits = updateDto.variableAmountLimits;
      if (updateDto.description !== undefined) updateData.description = updateDto.description;
      if (updateDto.metadata) updateData.metadata = updateDto.metadata;

      const { data: merchantQR, error } = await this.supabase
        .from('merchant_qr_codes')
        .update(updateData)
        .eq('id', qrId)
        .eq('merchant_id', userId)
        .select()
        .single();

      if (error) {
        this.logger.error('Database error updating merchant QR', error);
        throw new HttpException('Failed to update merchant QR', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Log update event
      await this.logMerchantQREvent(userId, qrId, 'qr_updated', updateDto);

      return this.mapDatabaseMerchantQRToInfo(merchantQR);

    } catch (error) {
      this.logger.error('Error updating merchant QR', error);
      throw error;
    }
  }

  // ==============================
  // DEACTIVATE MERCHANT QR
  // ==============================
  async deactivateMerchantQR(qrId: string, userId: string) {
    try {
      const { data: merchantQR, error } = await this.supabase
        .from('merchant_qr_codes')
        .update({
          status: 'inactive',
          deactivated_at: new Date().toISOString()
        })
        .eq('id', qrId)
        .eq('merchant_id', userId)
        .select()
        .single();

      if (error) {
        this.logger.error('Database error deactivating merchant QR', error);
        throw new HttpException('Failed to deactivate merchant QR', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Log deactivation event
      await this.logMerchantQREvent(userId, qrId, 'qr_deactivated', {});

      return this.mapDatabaseMerchantQRToInfo(merchantQR);

    } catch (error) {
      this.logger.error('Error deactivating merchant QR', error);
      throw error;
    }
  }

  // ==============================
  // GET MERCHANT QR ANALYTICS
  // ==============================
  async getMerchantQRAnalytics(qrId: string, userId: string, options: { startDate: Date; endDate: Date }) {
    try {
      const { startDate, endDate } = options;

      // Get QR code details
      const merchantQR = await this.getMerchantQR(qrId, userId);
      if (!merchantQR) {
        throw new HttpException('Merchant QR not found', HttpStatus.NOT_FOUND);
      }

      // Get transaction stats
      const { data: transactions, error: transError } = await this.supabase
        .from('merchant_qr_transactions')
        .select('amount, currency, status, payment_method, created_at')
        .eq('qr_id', qrId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (transError) {
        throw new HttpException('Failed to get transaction analytics', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Get scan events
      const { data: scans, error: scanError } = await this.supabase
        .from('merchant_qr_events')
        .select('event_type, created_at, metadata')
        .eq('qr_id', qrId)
        .eq('event_type', 'qr_scanned')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (scanError) {
        throw new HttpException('Failed to get scan analytics', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Process analytics
      const analytics = {
        summary: {
          totalScans: scans?.length || 0,
          totalTransactions: transactions?.length || 0,
          totalAmount: transactions?.reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0,
          conversionRate: scans?.length ? (transactions?.length || 0) / scans.length * 100 : 0
        },
        byPaymentMethod: this.groupTransactionsByPaymentMethod(transactions || []),
        byStatus: this.groupTransactionsByStatus(transactions || []),
        timeline: this.createMerchantQRTimeline(transactions || [], scans || [], startDate, endDate),
        topAmounts: this.getTopTransactionAmounts(transactions || [])
      };

      return analytics;

    } catch (error) {
      this.logger.error('Error getting merchant QR analytics', error);
      throw error;
    }
  }

  // ==============================
  // GET MERCHANT QR TRANSACTIONS
  // ==============================
  async getMerchantQRTransactions(qrId: string, userId: string, options: { page: number; limit: number }) {
    try {
      const { page, limit } = options;
      const offset = (page - 1) * limit;

      // Verify ownership
      const merchantQR = await this.getMerchantQR(qrId, userId);
      if (!merchantQR) {
        throw new HttpException('Merchant QR not found', HttpStatus.NOT_FOUND);
      }

      const { data: transactions, error, count } = await this.supabase
        .from('merchant_qr_transactions')
        .select('*', { count: 'exact' })
        .eq('qr_id', qrId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new HttpException('Failed to get transactions', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return {
        items: transactions || [],
        total: count || 0
      };

    } catch (error) {
      this.logger.error('Error getting merchant QR transactions', error);
      throw error;
    }
  }

  // ==============================
  // PROCESS MERCHANT QR PAYMENT
  // ==============================
  async processMerchantQRPayment(
    userId: string,
    qrId: string,
    paymentInfo: { amount: number; paymentMethod: string; description?: string }
  ) {
    try {
      // Get merchant QR details
      const { data: merchantQR, error } = await this.supabase
        .from('merchant_qr_codes')
        .select('*')
        .eq('id', qrId)
        .eq('status', 'active')
        .single();

      if (error || !merchantQR) {
        throw new HttpException('Merchant QR not found or inactive', HttpStatus.NOT_FOUND);
      }

      // Validate payment amount
      if (merchantQR.fixed_amount && parseFloat(merchantQR.fixed_amount) !== paymentInfo.amount) {
        throw new HttpException('Invalid payment amount for fixed-amount QR', HttpStatus.BAD_REQUEST);
      }

      if (merchantQR.variable_amount_limits) {
        const limits = merchantQR.variable_amount_limits;
        if (paymentInfo.amount < limits.min || paymentInfo.amount > limits.max) {
          throw new HttpException('Payment amount outside allowed limits', HttpStatus.BAD_REQUEST);
        }
      }

      // Validate payment method
      if (!merchantQR.payment_methods.includes(paymentInfo.paymentMethod)) {
        throw new HttpException('Payment method not supported by merchant', HttpStatus.BAD_REQUEST);
      }

      // Create payment
      const paymentData: CreatePaymentDto = {
        amount: paymentInfo.amount,
        currency: merchantQR.currency as CurrencyCode,
        paymentMethod: this.mapStringToPaymentMethod(paymentInfo.paymentMethod),
        description: paymentInfo.description || `Payment to ${merchantQR.merchant_name}`,
        metadata: {
          merchantQRId: qrId,
          merchantId: merchantQR.merchant_id,
          merchantName: merchantQR.merchant_name,
          businessType: merchantQR.business_type,
          location: merchantQR.location
        }
      };

      const payment = await this.paymentsService.createPayment(userId, paymentData);

      // Record transaction in merchant QR transactions
      await this.supabase
        .from('merchant_qr_transactions')
        .insert({
          qr_id: qrId,
          merchant_id: merchantQR.merchant_id,
          customer_id: userId,
          payment_id: payment.id,
          amount: paymentInfo.amount.toString(),
          currency: merchantQR.currency,
          payment_method: paymentInfo.paymentMethod,
          status: 'completed',
          description: paymentInfo.description,
          created_at: new Date().toISOString()
        });

      // Update merchant QR stats
      await this.updateMerchantQRStats(qrId, paymentInfo.amount);

      // Log payment event
      await this.logMerchantQREvent(userId, qrId, 'payment_processed', {
        paymentId: payment.id,
        amount: paymentInfo.amount,
        paymentMethod: paymentInfo.paymentMethod
      });

      return payment;

    } catch (error) {
      this.logger.error('Error processing merchant QR payment', error);
      throw error;
    }
  }

  // ==============================
  // GET PUBLIC MERCHANT INFO
  // ==============================
  async getPublicMerchantInfo(qrId: string) {
    try {
      const { data: merchantQR, error } = await this.supabase
        .from('merchant_qr_codes')
        .select('merchant_name, business_type, description, payment_methods, currency, fixed_amount, variable_amount_limits, location')
        .eq('id', qrId)
        .eq('status', 'active')
        .single();

      if (error) {
        this.logger.error('Database error getting public merchant info', error);
        return null;
      }

      // Log scan event (no user ID since it's public)
      await this.logMerchantQREvent(null, qrId, 'qr_scanned', {});

      // Update scan count
      await this.updateMerchantQRScanCount(qrId);

      return merchantQR;

    } catch (error) {
      this.logger.error('Error getting public merchant info', error);
      throw error;
    }
  }

  // ==============================
  // SEARCH NEARBY MERCHANTS
  // ==============================
  async searchNearbyMerchants(
    location: { latitude: number; longitude: number },
    radius: number,
    filters: { businessType?: string }
  ) {
    try {
      let query = this.supabase
        .from('merchant_qr_codes')
        .select('id, merchant_name, business_type, description, location, payment_methods, currency')
        .eq('status', 'active')
        .not('location', 'is', null);

      if (filters.businessType) {
        query = query.eq('business_type', filters.businessType);
      }

      const { data: merchants, error } = await query;

      if (error) {
        throw new HttpException('Failed to search merchants', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Filter by distance and sort by proximity
      const nearbyMerchants = merchants?.filter(merchant => {
        if (!merchant.location?.latitude || !merchant.location?.longitude) return false;
        
        const distance = this.calculateDistance(
          location.latitude, location.longitude,
          merchant.location.latitude, merchant.location.longitude
        );
        
        return distance <= radius;
      }).map(merchant => ({
        ...merchant,
        distance: this.calculateDistance(
          location.latitude, location.longitude,
          merchant.location.latitude, merchant.location.longitude
        )
      })).sort((a, b) => a.distance - b.distance);

      return nearbyMerchants || [];

    } catch (error) {
      this.logger.error('Error searching nearby merchants', error);
      throw error;
    }
  }

  // ==============================
  // GET MERCHANT DASHBOARD
  // ==============================
  async getMerchantDashboard(userId: string, period: string) {
    try {
      const days = this.periodToDays(period);
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const endDate = new Date();

      // Get merchant QR codes
      const { data: qrCodes, error: qrError } = await this.supabase
        .from('merchant_qr_codes')
        .select('id, merchant_name, scan_count, payment_count, total_amount, status')
        .eq('merchant_id', userId);

      if (qrError) {
        throw new HttpException('Failed to get QR codes', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Get recent transactions
      const { data: transactions, error: transError } = await this.supabase
        .from('merchant_qr_transactions')
        .select('*')
        .eq('merchant_id', userId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      if (transError) {
        throw new HttpException('Failed to get transactions', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Calculate dashboard metrics
      const dashboard = {
        summary: {
          totalQRCodes: qrCodes?.length || 0,
          activeQRCodes: qrCodes?.filter(qr => qr.status === 'active').length || 0,
          totalScans: qrCodes?.reduce((sum, qr) => sum + qr.scan_count, 0) || 0,
          totalPayments: qrCodes?.reduce((sum, qr) => sum + qr.payment_count, 0) || 0,
          totalRevenue: qrCodes?.reduce((sum, qr) => sum + parseFloat(qr.total_amount || '0'), 0) || 0,
          periodRevenue: transactions?.reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0
        },
        topQRCodes: qrCodes?.sort((a, b) => parseFloat(b.total_amount || '0') - parseFloat(a.total_amount || '0')).slice(0, 5) || [],
        recentTransactions: transactions || [],
        analytics: {
          conversionRate: this.calculateConversionRate(qrCodes || []),
          averageTransactionAmount: this.calculateAverageTransactionAmount(transactions || []),
          paymentMethodDistribution: this.getPaymentMethodDistribution(transactions || [])
        }
      };

      return dashboard;

    } catch (error) {
      this.logger.error('Error getting merchant dashboard', error);
      throw error;
    }
  }

  // ==============================
  // HELPER METHODS
  // ==============================
  private generateMerchantCode(merchantName: string): string {
    return merchantName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 6) + '_' + Date.now().toString().slice(-4);
  }

  private mapStringToPaymentMethod(method: string): PaymentMethod {
    const methodMap: Record<string, PaymentMethod> = {
      'wallet': PaymentMethod.WALLET,
      'credit_card': PaymentMethod.CREDIT_CARD,
      'debit_card': PaymentMethod.DEBIT_CARD,
      'mobile_money': PaymentMethod.MOBILE_MONEY,
      'digicel_money': PaymentMethod.DIGICEL_MONEY,
      'natcom_money': PaymentMethod.NATCOM_MONEY,
      'moncash': PaymentMethod.MONCASH,
      'paypal': PaymentMethod.PAYPAL,
      'qr_code': PaymentMethod.QR_CODE,
      'nfc': PaymentMethod.NFC
    };

    return methodMap[method] || PaymentMethod.WALLET;
  }

  private async updateMerchantQRStats(qrId: string, amount: number) {
    try {
      const { data: currentStats } = await this.supabase
        .from('merchant_qr_codes')
        .select('payment_count, total_amount')
        .eq('id', qrId)
        .single();

      if (currentStats) {
        await this.supabase
          .from('merchant_qr_codes')
          .update({
            payment_count: currentStats.payment_count + 1,
            total_amount: (parseFloat(currentStats.total_amount || '0') + amount).toString(),
            last_payment_at: new Date().toISOString()
          })
          .eq('id', qrId);
      }
    } catch (error) {
      this.logger.warn('Failed to update merchant QR stats', error);
    }
  }

  private async updateMerchantQRScanCount(qrId: string) {
    try {
      // Get current scan count and increment
      const { data: current } = await this.supabase
        .from('merchant_qr_codes')
        .select('scan_count')
        .eq('id', qrId)
        .single();

      await this.supabase
        .from('merchant_qr_codes')
        .update({
          scan_count: (current?.scan_count || 0) + 1,
          last_scanned_at: new Date().toISOString()
        })
        .eq('id', qrId);
    } catch (error) {
      this.logger.warn('Failed to update scan count', error);
    }
  }

  private async logMerchantQREvent(userId: string | null, qrId: string, eventType: string, metadata: any) {
    try {
      await this.supabase
        .from('merchant_qr_events')
        .insert({
          user_id: userId,
          qr_id: qrId,
          event_type: eventType,
          metadata,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      this.logger.warn('Failed to log merchant QR event', error);
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  private periodToDays(period: string): number {
    switch (period) {
      case '1d': return 1;
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      default: return 7;
    }
  }

  private groupTransactionsByPaymentMethod(transactions: any[]) {
    return transactions.reduce((acc, trans) => {
      acc[trans.payment_method] = (acc[trans.payment_method] || 0) + 1;
      return acc;
    }, {});
  }

  private groupTransactionsByStatus(transactions: any[]) {
    return transactions.reduce((acc, trans) => {
      acc[trans.status] = (acc[trans.status] || 0) + 1;
      return acc;
    }, {});
  }

  private createMerchantQRTimeline(transactions: any[], scans: any[], startDate: Date, endDate: Date) {
    const timeline = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dayTransactions = transactions.filter(t => 
        new Date(t.created_at).toDateString() === current.toDateString()
      );
      const dayScans = scans.filter(s => 
        new Date(s.created_at).toDateString() === current.toDateString()
      );
      
      timeline.push({
        date: current.toISOString().split('T')[0],
        scans: dayScans.length,
        transactions: dayTransactions.length,
        amount: dayTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0)
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return timeline;
  }

  private getTopTransactionAmounts(transactions: any[]) {
    return transactions
      .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
      .slice(0, 10)
      .map(t => ({
        amount: parseFloat(t.amount),
        currency: t.currency,
        paymentMethod: t.payment_method,
        createdAt: t.created_at
      }));
  }

  private calculateConversionRate(qrCodes: any[]): number {
    const totalScans = qrCodes.reduce((sum, qr) => sum + qr.scan_count, 0);
    const totalPayments = qrCodes.reduce((sum, qr) => sum + qr.payment_count, 0);
    return totalScans > 0 ? (totalPayments / totalScans) * 100 : 0;
  }

  private calculateAverageTransactionAmount(transactions: any[]): number {
    if (transactions.length === 0) return 0;
    const total = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    return total / transactions.length;
  }

  private getPaymentMethodDistribution(transactions: any[]) {
    return transactions.reduce((acc, trans) => {
      acc[trans.payment_method] = (acc[trans.payment_method] || 0) + 1;
      return acc;
    }, {});
  }

  private mapDatabaseMerchantQRToInfo(merchantQR: any) {
    return {
      id: merchantQR.id,
      merchantId: merchantQR.merchant_id,
      merchantCode: merchantQR.merchant_code,
      merchantName: merchantQR.merchant_name,
      businessType: merchantQR.business_type,
      location: merchantQR.location,
      paymentMethods: merchantQR.payment_methods,
      currency: merchantQR.currency,
      fixedAmount: merchantQR.fixed_amount ? parseFloat(merchantQR.fixed_amount) : null,
      variableAmountLimits: merchantQR.variable_amount_limits,
      description: merchantQR.description,
      status: merchantQR.status,
      qrImage: merchantQR.qr_image,
      scanCount: merchantQR.scan_count,
      paymentCount: merchantQR.payment_count,
      totalAmount: parseFloat(merchantQR.total_amount || '0'),
      createdAt: merchantQR.created_at,
      updatedAt: merchantQR.updated_at,
      metadata: merchantQR.metadata
    };
  }
}