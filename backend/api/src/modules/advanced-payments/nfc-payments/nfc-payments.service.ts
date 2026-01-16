import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PaymentsService } from '../../payments/payments.service';
import { PaymentMethod, CurrencyCode } from '../../../types/database.types';
import { CreatePaymentDto } from '../../payments/dto/create-enhanced-payment.dto';
import * as crypto from 'crypto';

interface NFCPaymentData {
  amount: number;
  currency: string;
  description?: string;
  merchantId?: string;
  merchantName?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  metadata?: Record<string, any>;
}

interface InitiateNFCDto {
  paymentData: NFCPaymentData;
  proximityDistance?: number;
  timeout?: number;
}

interface ProcessNFCDto {
  nfcData: string;
  deviceInfo?: {
    nfcCapabilities: string[];
    deviceId: string;
    userAgent: string;
  };
}

@Injectable()
export class NfcPaymentsService {
  private readonly logger = new Logger(NfcPaymentsService.name);
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
  // INITIATE NFC PAYMENT
  // ==============================
  async initiateNFCPayment(userId: string, initiateDto: InitiateNFCDto) {
    try {
      const { paymentData, proximityDistance = 5, timeout = 300 } = initiateDto;

      // Generate unique session ID
      const sessionId = crypto.randomUUID();
      const nfcToken = crypto.randomBytes(32).toString('hex');

      // Set expiration
      const expiresAt = new Date(Date.now() + timeout * 1000);

      // Create NFC data structure
      const nfcData = {
        sessionId,
        version: '1.0',
        type: 'nfc_payment',
        amount: paymentData.amount,
        currency: paymentData.currency,
        description: paymentData.description,
        merchantId: paymentData.merchantId,
        merchantName: paymentData.merchantName,
        location: paymentData.location,
        token: nfcToken,
        expiresAt: expiresAt.toISOString(),
        createdBy: userId,
        signature: this.generateNFCSignature(sessionId, paymentData, nfcToken)
      };

      // Store session in database
      const { data: session, error } = await this.supabase
        .from('nfc_sessions')
        .insert({
          id: sessionId,
          user_id: userId,
          payment_data: paymentData,
          nfc_data: nfcData,
          proximity_distance: proximityDistance,
          timeout,
          expires_at: expiresAt.toISOString(),
          status: 'active',
          created_at: new Date().toISOString(),
          nfc_token: nfcToken,
          tap_count: 0,
          confirmation_required: paymentData.amount > 100 // Require confirmation for amounts > 100
        })
        .select()
        .single();

      if (error) {
        this.logger.error('Database error creating NFC session', error);
        throw new HttpException('Failed to create NFC session', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Log initiation event
      await this.logNFCEvent(userId, sessionId, 'session_initiated', {
        amount: paymentData.amount,
        currency: paymentData.currency,
        merchantId: paymentData.merchantId
      });

      return {
        id: sessionId,
        nfcData: JSON.stringify(nfcData),
        proximityRequired: proximityDistance,
        timeout,
        expiresAt,
        status: 'active'
      };

    } catch (error) {
      this.logger.error('Error initiating NFC payment', error);
      throw error;
    }
  }

  // ==============================
  // PROCESS NFC PAYMENT
  // ==============================
  async processNFCPayment(userId: string, processDto: ProcessNFCDto) {
    try {
      const { nfcData, deviceInfo } = processDto;

      // Parse NFC data
      let parsedNFCData;
      try {
        parsedNFCData = JSON.parse(nfcData);
      } catch (parseError) {
        throw new HttpException('Invalid NFC data format', HttpStatus.BAD_REQUEST);
      }

      // Validate NFC data structure
      if (!parsedNFCData.sessionId || !parsedNFCData.version || !parsedNFCData.type) {
        throw new HttpException('Invalid NFC data structure', HttpStatus.BAD_REQUEST);
      }

      // Get session from database
      const { data: session, error } = await this.supabase
        .from('nfc_sessions')
        .select('*')
        .eq('id', parsedNFCData.sessionId)
        .single();

      if (error || !session) {
        throw new HttpException('NFC session not found', HttpStatus.NOT_FOUND);
      }

      // Check if expired
      if (new Date() > new Date(session.expires_at)) {
        await this.updateSessionStatus(parsedNFCData.sessionId, 'expired');
        throw new HttpException('NFC session has expired', HttpStatus.BAD_REQUEST);
      }

      // Check if still active
      if (session.status !== 'active') {
        throw new HttpException('NFC session is not active', HttpStatus.BAD_REQUEST);
      }

      // Verify signature
      const isValid = this.verifyNFCSignature(parsedNFCData, session.nfc_token);
      if (!isValid) {
        throw new HttpException('Invalid NFC signature', HttpStatus.BAD_REQUEST);
      }

      // Update tap count
      await this.supabase
        .from('nfc_sessions')
        .update({ 
          tap_count: session.tap_count + 1,
          last_tapped_at: new Date().toISOString()
        })
        .eq('id', parsedNFCData.sessionId);

      // Security checks
      const securityCheck = await this.performNFCSecurityCheck(userId, parsedNFCData, deviceInfo);

      // Log tap event
      await this.logNFCEvent(userId, parsedNFCData.sessionId, 'nfc_tapped', {
        tapCount: session.tap_count + 1,
        deviceInfo,
        securityCheck
      });

      // Check if confirmation is required
      if (session.confirmation_required) {
        await this.updateSessionStatus(parsedNFCData.sessionId, 'pending_confirmation');
        
        return {
          paymentId: null,
          status: 'pending_confirmation',
          amount: parsedNFCData.amount,
          currency: parsedNFCData.currency,
          merchant: {
            id: parsedNFCData.merchantId,
            name: parsedNFCData.merchantName
          },
          reference: parsedNFCData.sessionId,
          completedAt: null,
          requiresConfirmation: true
        };
      }

      // Process payment directly
      const payment = await this.processDirectNFCPayment(userId, session, parsedNFCData);

      return {
        paymentId: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        merchant: {
          id: parsedNFCData.merchantId,
          name: parsedNFCData.merchantName
        },
        reference: payment.referenceId,
        completedAt: payment.completedAt,
        requiresConfirmation: false
      };

    } catch (error) {
      this.logger.error('Error processing NFC payment', error);
      throw error;
    }
  }

  // ==============================
  // CONFIRM NFC PAYMENT
  // ==============================
  async confirmNFCPayment(userId: string, sessionId: string, auth: { pin?: string; biometric?: string }) {
    try {
      // Get session
      const { data: session, error } = await this.supabase
        .from('nfc_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      if (error || !session) {
        throw new HttpException('NFC session not found', HttpStatus.NOT_FOUND);
      }

      if (session.status !== 'pending_confirmation') {
        throw new HttpException('Session not pending confirmation', HttpStatus.BAD_REQUEST);
      }

      // Verify authentication (simplified - would integrate with auth service)
      if (session.payment_data.amount > 1000 && !auth.pin && !auth.biometric) {
        throw new HttpException('Authentication required for high-value transactions', HttpStatus.BAD_REQUEST);
      }

      // Process the payment
      const paymentData: CreatePaymentDto = {
        amount: session.payment_data.amount,
        currency: session.payment_data.currency as CurrencyCode,
        paymentMethod: PaymentMethod.NFC,
        description: session.payment_data.description || 'NFC Payment',
        metadata: {
          ...session.payment_data.metadata,
          nfcSessionId: sessionId,
          merchantId: session.payment_data.merchantId,
          location: session.payment_data.location
        }
      };

      const payment = await this.paymentsService.createPayment(userId, paymentData);

      // Update session status
      await this.updateSessionStatus(sessionId, 'completed');

      // Log confirmation event
      await this.logNFCEvent(userId, sessionId, 'payment_confirmed', {
        paymentId: payment.id,
        amount: payment.amount,
        authMethod: auth.biometric ? 'biometric' : 'pin'
      });

      return payment;

    } catch (error) {
      this.logger.error('Error confirming NFC payment', error);
      throw error;
    }
  }

  // ==============================
  // GET NFC SESSIONS
  // ==============================
  async getNFCSessions(userId: string, options: { page: number; limit: number; status?: string }) {
    try {
      const { page, limit, status } = options;
      const offset = (page - 1) * limit;

      let query = this.supabase
        .from('nfc_sessions')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data: sessions, error, count } = await query;

      if (error) {
        this.logger.error('Database error getting NFC sessions', error);
        throw new HttpException('Failed to get NFC sessions', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return {
        items: sessions || [],
        total: count || 0
      };

    } catch (error) {
      this.logger.error('Error getting NFC sessions', error);
      throw error;
    }
  }

  // ==============================
  // GET NFC SESSION DETAILS
  // ==============================
  async getNFCSession(sessionId: string, userId: string) {
    try {
      const { data: session, error } = await this.supabase
        .from('nfc_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      if (error) {
        this.logger.error('Database error getting NFC session', error);
        return null;
      }

      return session;

    } catch (error) {
      this.logger.error('Error getting NFC session', error);
      throw error;
    }
  }

  // ==============================
  // CANCEL NFC SESSION
  // ==============================
  async cancelNFCSession(sessionId: string, userId: string) {
    try {
      const { data: session, error } = await this.supabase
        .from('nfc_sessions')
        .update({ 
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) {
        this.logger.error('Database error cancelling NFC session', error);
        throw new HttpException('Failed to cancel NFC session', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Log cancellation event
      await this.logNFCEvent(userId, sessionId, 'session_cancelled', {});

      return session;

    } catch (error) {
      this.logger.error('Error cancelling NFC session', error);
      throw error;
    }
  }

  // ==============================
  // GET NFC ANALYTICS
  // ==============================
  async getNFCAnalytics(userId: string, options: { startDate: Date; endDate: Date }) {
    try {
      const { startDate, endDate } = options;

      // Get session stats
      const { data: sessions, error: sessionsError } = await this.supabase
        .from('nfc_sessions')
        .select('status, tap_count, payment_data, created_at')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (sessionsError) {
        throw new HttpException('Failed to get analytics', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Get event logs
      const { data: events, error: eventsError } = await this.supabase
        .from('nfc_events')
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
          totalSessions: sessions?.length || 0,
          completedSessions: sessions?.filter(s => s.status === 'completed').length || 0,
          totalTaps: sessions?.reduce((sum, s) => sum + s.tap_count, 0) || 0,
          successRate: sessions?.length ? (sessions.filter(s => s.status === 'completed').length / sessions.length) * 100 : 0
        },
        byStatus: this.groupByStatus(sessions || []),
        byMerchant: this.groupByMerchant(sessions || []),
        timeline: this.createNFCTimeline(events || [], startDate, endDate),
        usage: this.calculateUsageMetrics(sessions || [], events || [])
      };

      return analytics;

    } catch (error) {
      this.logger.error('Error getting NFC analytics', error);
      throw error;
    }
  }

  // ==============================
  // CHECK NFC CAPABILITIES
  // ==============================
  async checkNFCCapabilities(userAgent: string, deviceType?: string) {
    try {
      // Basic NFC capability detection based on user agent and device type
      const capabilities = {
        nfcSupported: false,
        webNfcSupported: false,
        ndefSupported: false,
        peerToPeerSupported: false,
        cardEmulationSupported: false,
        limitations: [] as string[]
      };

      // Check for Android devices (primary NFC support)
      if (userAgent.includes('Android')) {
        capabilities.nfcSupported = true;
        capabilities.webNfcSupported = userAgent.includes('Chrome') && !userAgent.includes('Samsung');
        capabilities.ndefSupported = true;
        capabilities.peerToPeerSupported = true;
        capabilities.cardEmulationSupported = true;
      }

      // iOS has limited NFC support
      if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        capabilities.nfcSupported = true;
        capabilities.ndefSupported = true; // Only in newer iOS versions
        capabilities.limitations.push('Limited to NDEF reading in Safari');
        capabilities.limitations.push('Requires user activation');
      }

      // Desktop browsers have no NFC support
      if (deviceType === 'desktop' || userAgent.includes('Windows') || userAgent.includes('Mac')) {
        capabilities.limitations.push('NFC not supported on desktop browsers');
      }

      return capabilities;

    } catch (error) {
      this.logger.error('Error checking NFC capabilities', error);
      throw error;
    }
  }

  // ==============================
  // GET NEARBY MERCHANTS
  // ==============================
  async getNearbyMerchants(location: { latitude: number; longitude: number }, radius: number) {
    try {
      // Query merchants within radius (simplified - would use PostGIS in production)
      const { data: merchants, error } = await this.supabase
        .from('merchants')
        .select('id, name, address, latitude, longitude, nfc_enabled, payment_methods')
        .eq('nfc_enabled', true)
        .eq('status', 'active');

      if (error) {
        throw new HttpException('Failed to get merchants', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Filter by distance (simplified calculation)
      const nearbyMerchants = merchants?.filter(merchant => {
        if (!merchant.latitude || !merchant.longitude) return false;
        
        const distance = this.calculateDistance(
          location.latitude, location.longitude,
          merchant.latitude, merchant.longitude
        );
        
        return distance <= radius;
      }).map(merchant => ({
        ...merchant,
        distance: this.calculateDistance(
          location.latitude, location.longitude,
          merchant.latitude, merchant.longitude
        )
      })).sort((a, b) => a.distance - b.distance);

      return nearbyMerchants || [];

    } catch (error) {
      this.logger.error('Error getting nearby merchants', error);
      throw error;
    }
  }

  // ==============================
  // HELPER METHODS
  // ==============================
  private generateNFCSignature(sessionId: string, paymentData: NFCPaymentData, token: string): string {
    const dataString = JSON.stringify({ sessionId, ...paymentData });
    return crypto.createHmac('sha256', token).update(dataString).digest('hex');
  }

  private verifyNFCSignature(nfcData: any, token: string): boolean {
    const { signature, ...dataWithoutSignature } = nfcData;
    const expectedSignature = this.generateNFCSignature(nfcData.sessionId, dataWithoutSignature, token);
    return signature === expectedSignature;
  }

  private async performNFCSecurityCheck(userId: string, nfcData: any, deviceInfo?: any) {
    return {
      validUser: true,
      validAmount: !nfcData.amount || nfcData.amount > 0,
      deviceTrusted: true,
      proximityVerified: true, // Would implement actual proximity verification
      riskLevel: nfcData.amount > 5000 ? 'high' : nfcData.amount > 1000 ? 'medium' : 'low'
    };
  }

  private async processDirectNFCPayment(userId: string, session: any, nfcData: any) {
    const paymentData: CreatePaymentDto = {
      amount: nfcData.amount,
      currency: nfcData.currency as CurrencyCode,
      paymentMethod: PaymentMethod.NFC,
      description: nfcData.description || 'NFC Payment',
      metadata: {
        nfcSessionId: session.id,
        merchantId: nfcData.merchantId,
        location: nfcData.location
      }
    };

    const payment = await this.paymentsService.createPayment(userId, paymentData);

    // Update session status
    await this.updateSessionStatus(session.id, 'completed');

    // Log payment event
    await this.logNFCEvent(userId, session.id, 'payment_processed', {
      paymentId: payment.id,
      amount: payment.amount
    });

    return payment;
  }

  private async updateSessionStatus(sessionId: string, status: string) {
    await this.supabase
      .from('nfc_sessions')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);
  }

  private async logNFCEvent(userId: string, sessionId: string, eventType: string, metadata: any) {
    try {
      await this.supabase
        .from('nfc_events')
        .insert({
          user_id: userId,
          session_id: sessionId,
          event_type: eventType,
          metadata,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      this.logger.warn('Failed to log NFC event', error);
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

  private groupByStatus(sessions: any[]) {
    return sessions.reduce((acc, session) => {
      acc[session.status] = (acc[session.status] || 0) + 1;
      return acc;
    }, {});
  }

  private groupByMerchant(sessions: any[]) {
    return sessions.reduce((acc, session) => {
      const merchantId = session.payment_data?.merchantId || 'unknown';
      if (!acc[merchantId]) acc[merchantId] = { count: 0, totalAmount: 0 };
      acc[merchantId].count++;
      acc[merchantId].totalAmount += session.payment_data?.amount || 0;
      return acc;
    }, {});
  }

  private createNFCTimeline(events: any[], startDate: Date, endDate: Date) {
    const timeline = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dayEvents = events.filter(event => 
        new Date(event.created_at).toDateString() === current.toDateString()
      );
      
      timeline.push({
        date: current.toISOString().split('T')[0],
        events: dayEvents.length,
        sessions: dayEvents.filter(e => e.event_type === 'session_initiated').length,
        taps: dayEvents.filter(e => e.event_type === 'nfc_tapped').length,
        payments: dayEvents.filter(e => e.event_type === 'payment_processed').length
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return timeline;
  }

  private calculateUsageMetrics(sessions: any[], events: any[]) {
    const totalTaps = sessions.reduce((sum, s) => sum + s.tap_count, 0);
    const uniqueMerchants = new Set(sessions.map(s => s.payment_data?.merchantId).filter(Boolean)).size;
    const averageSessionDuration = sessions.length > 0 ? 
      sessions.reduce((sum, s) => sum + (new Date(s.updated_at || s.created_at).getTime() - new Date(s.created_at).getTime()), 0) / sessions.length / 1000 : 0;

    return {
      totalTaps,
      uniqueMerchants,
      averageSessionDuration,
      tapToPaymentRatio: sessions.length > 0 ? totalTaps / sessions.length : 0
    };
  }
}