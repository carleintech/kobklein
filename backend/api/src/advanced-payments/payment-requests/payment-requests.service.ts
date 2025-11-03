import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PaymentsService } from '../../payments/payments.service';
import { PaymentMethod, CurrencyCode } from '../../types/database.types';
import { CreatePaymentDto } from '../../payments/dto/create-enhanced-payment.dto';
import * as crypto from 'crypto';

interface CreatePaymentRequestDto {
  recipientId?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  amount: number;
  currency: string;
  description?: string;
  dueDate?: Date;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    endDate?: Date;
    maxOccurrences?: number;
  };
  metadata?: Record<string, any>;
}

interface RespondToRequestDto {
  action: 'approve' | 'decline' | 'partial';
  amount?: number;
  message?: string;
  scheduleDate?: Date;
}

@Injectable()
export class PaymentRequestsService {
  private readonly logger = new Logger(PaymentRequestsService.name);
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
  // CREATE PAYMENT REQUEST
  // ==============================
  async createPaymentRequest(userId: string, createDto: CreatePaymentRequestDto) {
    try {
      // Generate unique request ID
      const requestId = crypto.randomUUID();
      
      // Set default due date if not provided (7 days)
      const dueDate = createDto.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      // Resolve recipient ID if email or phone provided
      let recipientId = createDto.recipientId;
      if (!recipientId && (createDto.recipientEmail || createDto.recipientPhone)) {
        recipientId = await this.resolveRecipientId(createDto.recipientEmail, createDto.recipientPhone);
      }

      // Create payment request record
      const { data: paymentRequest, error } = await this.supabase
        .from('payment_requests')
        .insert({
          id: requestId,
          requester_id: userId,
          recipient_id: recipientId,
          recipient_email: createDto.recipientEmail,
          recipient_phone: createDto.recipientPhone,
          amount: createDto.amount.toString(),
          currency: createDto.currency,
          description: createDto.description,
          due_date: dueDate.toISOString(),
          status: 'pending',
          recurring_config: createDto.recurring,
          is_recurring: !!createDto.recurring,
          metadata: createDto.metadata || {},
          created_at: new Date().toISOString(),
          attempts: 0,
          max_attempts: 3
        })
        .select()
        .single();

      if (error) {
        this.logger.error('Database error creating payment request', error);
        throw new HttpException('Failed to create payment request', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Create recurring schedule if needed
      if (createDto.recurring) {
        await this.createRecurringSchedule(requestId, createDto.recurring);
      }

      // Send notification to recipient
      await this.sendRequestNotification(paymentRequest);

      // Log creation event
      await this.logRequestEvent(userId, requestId, 'request_created', {
        amount: createDto.amount,
        currency: createDto.currency,
        recipientId
      });

      return this.mapDatabaseRequestToInfo(paymentRequest);

    } catch (error) {
      this.logger.error('Error creating payment request', error);
      throw error;
    }
  }

  // ==============================
  // GET PAYMENT REQUESTS
  // ==============================
  async getPaymentRequests(userId: string, type: 'sent' | 'received', options: { page: number; limit: number; status?: string }) {
    try {
      const { page, limit, status } = options;
      const offset = (page - 1) * limit;

      let query = this.supabase
        .from('payment_requests')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (type === 'sent') {
        query = query.eq('requester_id', userId);
      } else {
        query = query.eq('recipient_id', userId);
      }

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data: requests, error, count } = await query;

      if (error) {
        this.logger.error('Database error getting payment requests', error);
        throw new HttpException('Failed to get payment requests', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return {
        items: (requests || []).map(req => this.mapDatabaseRequestToInfo(req)),
        total: count || 0
      };

    } catch (error) {
      this.logger.error('Error getting payment requests', error);
      throw error;
    }
  }

  // ==============================
  // GET PAYMENT REQUEST BY ID
  // ==============================
  async getPaymentRequestById(requestId: string, userId: string) {
    try {
      const { data: paymentRequest, error } = await this.supabase
        .from('payment_requests')
        .select('*')
        .eq('id', requestId)
        .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)
        .single();

      if (error) {
        this.logger.error('Database error getting payment request', error);
        return null;
      }

      return paymentRequest ? this.mapDatabaseRequestToInfo(paymentRequest) : null;

    } catch (error) {
      this.logger.error('Error getting payment request by ID', error);
      throw error;
    }
  }

  // ==============================
  // RESPOND TO PAYMENT REQUEST
  // ==============================
  async respondToPaymentRequest(userId: string, requestId: string, respondDto: RespondToRequestDto) {
    try {
      const { action, amount, message, scheduleDate } = respondDto;

      // Get request details
      const { data: request, error: getError } = await this.supabase
        .from('payment_requests')
        .select('*')
        .eq('id', requestId)
        .eq('recipient_id', userId)
        .single();

      if (getError || !request) {
        throw new HttpException('Payment request not found', HttpStatus.NOT_FOUND);
      }

      if (request.status !== 'pending') {
        throw new HttpException('Payment request is not pending', HttpStatus.BAD_REQUEST);
      }

      // Update request status
      let newStatus = action === 'approve' ? 'approved' : action === 'decline' ? 'declined' : 'partially_approved';
      let actualAmount = action === 'partial' && amount ? amount : parseFloat(request.amount);

      const { data: updatedRequest, error: updateError } = await this.supabase
        .from('payment_requests')
        .update({
          status: newStatus,
          response_message: message,
          responded_at: new Date().toISOString(),
          actual_amount: actualAmount.toString(),
          scheduled_date: scheduleDate?.toISOString()
        })
        .eq('id', requestId)
        .select()
        .single();

      if (updateError) {
        this.logger.error('Database error updating payment request', updateError);
        throw new HttpException('Failed to update payment request', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // If approved, process the payment
      if (action === 'approve' || action === 'partial') {
        if (scheduleDate && scheduleDate > new Date()) {
          // Schedule payment for later
          await this.schedulePayment(requestId, userId, actualAmount, scheduleDate);
        } else {
          // Process payment immediately
          await this.processRequestPayment(userId, updatedRequest, actualAmount);
        }
      }

      // Log response event
      await this.logRequestEvent(userId, requestId, `request_${action}ed`, {
        originalAmount: parseFloat(request.amount),
        actualAmount,
        message
      });

      // Send notification to requester
      await this.sendResponseNotification(updatedRequest, action);

      return this.mapDatabaseRequestToInfo(updatedRequest);

    } catch (error) {
      this.logger.error('Error responding to payment request', error);
      throw error;
    }
  }

  // ==============================
  // CANCEL PAYMENT REQUEST
  // ==============================
  async cancelPaymentRequest(requestId: string, userId: string) {
    try {
      const { data: paymentRequest, error } = await this.supabase
        .from('payment_requests')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('requester_id', userId)
        .select()
        .single();

      if (error) {
        this.logger.error('Database error cancelling payment request', error);
        throw new HttpException('Failed to cancel payment request', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Log cancellation event
      await this.logRequestEvent(userId, requestId, 'request_cancelled', {});

      return this.mapDatabaseRequestToInfo(paymentRequest);

    } catch (error) {
      this.logger.error('Error cancelling payment request', error);
      throw error;
    }
  }

  // ==============================
  // RESEND PAYMENT REQUEST
  // ==============================
  async resendPaymentRequest(requestId: string, userId: string) {
    try {
      // Get request details
      const { data: request, error } = await this.supabase
        .from('payment_requests')
        .select('*')
        .eq('id', requestId)
        .eq('requester_id', userId)
        .single();

      if (error || !request) {
        throw new HttpException('Payment request not found', HttpStatus.NOT_FOUND);
      }

      if (request.status !== 'pending') {
        throw new HttpException('Can only resend pending requests', HttpStatus.BAD_REQUEST);
      }

      // Update attempts count
      const newAttempts = request.attempts + 1;
      if (newAttempts > request.max_attempts) {
        throw new HttpException('Maximum resend attempts reached', HttpStatus.BAD_REQUEST);
      }

      await this.supabase
        .from('payment_requests')
        .update({
          attempts: newAttempts,
          last_sent_at: new Date().toISOString()
        })
        .eq('id', requestId);

      // Send notification again
      await this.sendRequestNotification(request);

      // Log resend event
      await this.logRequestEvent(userId, requestId, 'request_resent', { attempts: newAttempts });

      return { attempts: newAttempts, maxAttempts: request.max_attempts };

    } catch (error) {
      this.logger.error('Error resending payment request', error);
      throw error;
    }
  }

  // ==============================
  // GET RECURRING REQUESTS
  // ==============================
  async getRecurringRequests(userId: string, type: string) {
    try {
      let query = this.supabase
        .from('payment_requests')
        .select('*')
        .eq('is_recurring', true)
        .eq('status', 'active');

      if (type === 'sent') {
        query = query.eq('requester_id', userId);
      } else if (type === 'received') {
        query = query.eq('recipient_id', userId);
      } else {
        query = query.or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);
      }

      const { data: requests, error } = await query;

      if (error) {
        throw new HttpException('Failed to get recurring requests', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return (requests || []).map(req => this.mapDatabaseRequestToInfo(req));

    } catch (error) {
      this.logger.error('Error getting recurring requests', error);
      throw error;
    }
  }

  // ==============================
  // UPDATE RECURRING REQUEST
  // ==============================
  async updateRecurringRequest(requestId: string, userId: string, updateDto: any) {
    try {
      const { data: recurringRequest, error } = await this.supabase
        .from('payment_requests')
        .update({
          recurring_config: {
            frequency: updateDto.frequency,
            endDate: updateDto.endDate,
            maxOccurrences: updateDto.maxOccurrences
          },
          status: updateDto.active === false ? 'inactive' : 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('requester_id', userId)
        .eq('is_recurring', true)
        .select()
        .single();

      if (error) {
        throw new HttpException('Failed to update recurring request', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return this.mapDatabaseRequestToInfo(recurringRequest);

    } catch (error) {
      this.logger.error('Error updating recurring request', error);
      throw error;
    }
  }

  // ==============================
  // GET REQUEST ANALYTICS
  // ==============================
  async getRequestAnalytics(userId: string, options: { startDate: Date; endDate: Date }) {
    try {
      const { startDate, endDate } = options;

      // Get request stats
      const { data: sentRequests, error: sentError } = await this.supabase
        .from('payment_requests')
        .select('status, amount, currency, created_at')
        .eq('requester_id', userId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      const { data: receivedRequests, error: receivedError } = await this.supabase
        .from('payment_requests')
        .select('status, amount, currency, created_at')
        .eq('recipient_id', userId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (sentError || receivedError) {
        throw new HttpException('Failed to get analytics', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Process analytics
      const analytics = {
        sent: this.processRequestStats(sentRequests || []),
        received: this.processRequestStats(receivedRequests || []),
        summary: {
          totalSent: sentRequests?.length || 0,
          totalReceived: receivedRequests?.length || 0,
          totalAmount: this.calculateTotalAmount([...(sentRequests || []), ...(receivedRequests || [])]),
          successRate: this.calculateSuccessRate([...(sentRequests || []), ...(receivedRequests || [])])
        },
        timeline: this.createRequestTimeline([...(sentRequests || []), ...(receivedRequests || [])], startDate, endDate)
      };

      return analytics;

    } catch (error) {
      this.logger.error('Error getting request analytics', error);
      throw error;
    }
  }

  // ==============================
  // CREATE BULK REQUESTS
  // ==============================
  async createBulkRequests(userId: string, requests: CreatePaymentRequestDto[]) {
    try {
      const results = {
        successful: [] as any[],
        failed: [] as any[]
      };

      for (const requestDto of requests) {
        try {
          const paymentRequest = await this.createPaymentRequest(userId, requestDto);
          results.successful.push(paymentRequest);
        } catch (error) {
          results.failed.push({
            request: requestDto,
            error: error.message
          });
        }
      }

      return results;

    } catch (error) {
      this.logger.error('Error creating bulk requests', error);
      throw error;
    }
  }

  // ==============================
  // HELPER METHODS
  // ==============================
  private async resolveRecipientId(email?: string, phone?: string): Promise<string | null> {
    if (!email && !phone) return null;

    let query = this.supabase.from('profiles').select('id');
    
    if (email) {
      query = query.eq('email', email);
    } else if (phone) {
      query = query.eq('phone', phone);
    }

    const { data, error } = await query.single();
    
    if (error || !data) return null;
    return data.id;
  }

  private async createRecurringSchedule(requestId: string, recurring: any) {
    // Create recurring schedule entries
    const scheduleEntries = [];
    const startDate = new Date();
    const endDate = recurring.endDate ? new Date(recurring.endDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    
    let currentDate = new Date(startDate);
    let occurrences = 0;
    
    while (currentDate <= endDate && (!recurring.maxOccurrences || occurrences < recurring.maxOccurrences)) {
      scheduleEntries.push({
        request_id: requestId,
        scheduled_date: currentDate.toISOString(),
        status: 'pending',
        occurrence_number: occurrences + 1
      });
      
      // Calculate next occurrence based on frequency
      switch (recurring.frequency) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case 'yearly':
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
      }
      
      occurrences++;
    }

    if (scheduleEntries.length > 0) {
      await this.supabase
        .from('recurring_schedules')
        .insert(scheduleEntries);
    }
  }

  private async processRequestPayment(userId: string, request: any, amount: number) {
    try {
      const paymentData: CreatePaymentDto = {
        amount,
        currency: request.currency as CurrencyCode,
        paymentMethod: PaymentMethod.WALLET,
        description: request.description || 'Payment Request',
        metadata: {
          requestId: request.id,
          requesterId: request.requester_id
        }
      };

      const payment = await this.paymentsService.createPayment(userId, paymentData);

      // Update request with payment ID
      await this.supabase
        .from('payment_requests')
        .update({
          payment_id: payment.id,
          processed_at: new Date().toISOString()
        })
        .eq('id', request.id);

      return payment;

    } catch (error) {
      this.logger.error('Error processing request payment', error);
      throw error;
    }
  }

  private async schedulePayment(requestId: string, userId: string, amount: number, scheduleDate: Date) {
    // Create scheduled payment entry
    await this.supabase
      .from('scheduled_payments')
      .insert({
        request_id: requestId,
        payer_id: userId,
        amount: amount.toString(),
        scheduled_date: scheduleDate.toISOString(),
        status: 'scheduled'
      });
  }

  private async sendRequestNotification(request: any) {
    // Send notification via email/SMS/push
    // This would integrate with notification service
    this.logger.log(`Sending notification for request ${request.id}`);
  }

  private async sendResponseNotification(request: any, action: string) {
    // Send response notification to requester
    this.logger.log(`Sending ${action} notification for request ${request.id}`);
  }

  private async logRequestEvent(userId: string, requestId: string, eventType: string, metadata: any) {
    try {
      await this.supabase
        .from('request_events')
        .insert({
          user_id: userId,
          request_id: requestId,
          event_type: eventType,
          metadata,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      this.logger.warn('Failed to log request event', error);
    }
  }

  private mapDatabaseRequestToInfo(request: any) {
    return {
      id: request.id,
      requesterId: request.requester_id,
      recipientId: request.recipient_id,
      recipientEmail: request.recipient_email,
      recipientPhone: request.recipient_phone,
      amount: parseFloat(request.amount),
      currency: request.currency,
      description: request.description,
      status: request.status,
      dueDate: request.due_date,
      isRecurring: request.is_recurring,
      recurringConfig: request.recurring_config,
      responseMessage: request.response_message,
      actualAmount: request.actual_amount ? parseFloat(request.actual_amount) : null,
      paymentId: request.payment_id,
      attempts: request.attempts,
      maxAttempts: request.max_attempts,
      createdAt: request.created_at,
      respondedAt: request.responded_at,
      processedAt: request.processed_at,
      metadata: request.metadata
    };
  }

  private processRequestStats(requests: any[]) {
    const total = requests.length;
    const byStatus = requests.reduce((acc, req) => {
      acc[req.status] = (acc[req.status] || 0) + 1;
      return acc;
    }, {});
    
    const totalAmount = requests.reduce((sum, req) => sum + parseFloat(req.amount), 0);
    
    return { total, byStatus, totalAmount };
  }

  private calculateTotalAmount(requests: any[]) {
    return requests.reduce((sum, req) => sum + parseFloat(req.amount), 0);
  }

  private calculateSuccessRate(requests: any[]) {
    if (requests.length === 0) return 0;
    const successful = requests.filter(req => req.status === 'approved' || req.status === 'partially_approved').length;
    return (successful / requests.length) * 100;
  }

  private createRequestTimeline(requests: any[], startDate: Date, endDate: Date) {
    const timeline = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dayRequests = requests.filter(req => 
        new Date(req.created_at).toDateString() === current.toDateString()
      );
      
      timeline.push({
        date: current.toISOString().split('T')[0],
        total: dayRequests.length,
        approved: dayRequests.filter(r => r.status === 'approved').length,
        declined: dayRequests.filter(r => r.status === 'declined').length,
        pending: dayRequests.filter(r => r.status === 'pending').length
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return timeline;
  }
}