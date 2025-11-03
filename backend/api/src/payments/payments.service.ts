import { Injectable, Logger, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';
import { 
  PaymentMethod, 
  PaymentStatus, 
  PaymentProcessor, 
  CurrencyCode, 
  FraudRiskLevel,
  WebhookStatus,
  DatabasePayment,
  DatabasePaymentWebhook,
  DatabasePaymentAudit,
  DatabaseFraudCheck,
  PaymentInfo,
  PaymentAnalytics
} from '../types/database.types';
import {
  CreatePaymentDto,
  ProcessWebhookDto,
  PaymentCallbackDto,
  RefundPaymentDto,
  PaymentAnalyticsDto,
  FraudCheckDto,
  PaymentRetryDto,
  UpdatePaymentDto,
  PaymentSearchDto
} from './dto/create-enhanced-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private supabase: SupabaseClient;

  constructor(private readonly prisma: PrismaService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  // ==============================
  // CREATE PAYMENT
  // ==============================
  async createPayment(userId: string, dto: CreatePaymentDto): Promise<PaymentInfo> {
    try {
      this.logger.log(`Creating payment for user ${userId}`, { dto });

      // Generate unique reference
      const referenceId = this.generatePaymentReference();
      
      // Determine processor based on payment method
      const processor = dto.processor || this.determineProcessor(dto.paymentMethod);
      
      // Perform fraud check
      const fraudResult = await this.performFraudCheck(userId, dto);
      
      if (fraudResult.riskLevel === FraudRiskLevel.CRITICAL) {
        throw new BadRequestException('Payment blocked due to high fraud risk');
      }

      // Create payment record
      const paymentData: Omit<DatabasePayment, 'id' | 'created_at' | 'updated_at'> = {
        user_id: userId,
        processor,
        amount: dto.amount.toString(),
        currency: dto.currency,
        status: PaymentStatus.INITIATED,
        payment_method: dto.paymentMethod,
        description: dto.description,
        reference_id: referenceId,
        merchant_reference: dto.merchantReference,
        fraud_score: fraudResult.score,
        risk_level: fraudResult.riskLevel,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
        processor_response: null,
        metadata: {
          ...dto.metadata,
          returnUrl: dto.returnUrl,
          cancelUrl: dto.cancelUrl,
          userAgent: dto.metadata?.userAgent,
          ipAddress: dto.metadata?.ipAddress
        }
      };

      const { data: payment, error } = await this.supabase
        .from('payments')
        .insert(paymentData)
        .select('*')
        .single();

      if (error) {
        this.logger.error('Failed to create payment', error);
        throw new InternalServerErrorException('Failed to create payment');
      }

      // Log audit trail
      await this.createAuditLog(payment.id, userId, 'CREATE', null, PaymentStatus.INITIATED, 'Payment created');

      // Process payment based on processor
      const processedPayment = await this.processPaymentByProcessor(payment, dto);

      return this.mapDatabasePaymentToInfo(processedPayment);
    } catch (error) {
      this.logger.error('Error creating payment', error);
      throw error;
    }
  }

  // ==============================
  // PROCESS WEBHOOK
  // ==============================
  async processWebhook(dto: ProcessWebhookDto): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.log(`Processing webhook from ${dto.processor}`, { eventType: dto.eventType });

      // Create webhook record
      const webhookData: Omit<DatabasePaymentWebhook, 'id' | 'created_at' | 'updated_at'> = {
        payment_id: null, // Will be updated after processing
        processor: dto.processor,
        webhook_id: dto.payload.id || null,
        event_type: dto.eventType,
        status: WebhookStatus.PROCESSING,
        payload: dto.payload,
        headers: dto.headers,
        signature: dto.signature,
        processed_at: null,
        retry_count: 0,
        max_retries: 3,
        error_message: null
      };

      const { data: webhook, error } = await this.supabase
        .from('payment_webhooks')
        .insert(webhookData)
        .select('*')
        .single();

      if (error) {
        this.logger.error('Failed to create webhook record', error);
        throw new InternalServerErrorException('Failed to process webhook');
      }

      // Process webhook based on processor and event type
      const result = await this.handleWebhookByProcessor(webhook, dto);

      // Update webhook status
      await this.supabase
        .from('payment_webhooks')
        .update({
          status: WebhookStatus.PROCESSED,
          processed_at: new Date().toISOString()
        })
        .eq('id', webhook.id);

      return { success: true, message: 'Webhook processed successfully' };
    } catch (error) {
      this.logger.error('Error processing webhook', error);
      throw error;
    }
  }

  // ==============================
  // GET PAYMENT
  // ==============================
  async findPaymentById(id: string): Promise<PaymentInfo | null> {
    try {
      const { data, error } = await this.supabase
        .from('payments')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return null;
      }

      return this.mapDatabasePaymentToInfo(data);
    } catch (error) {
      this.logger.error('Error finding payment by ID', error);
      return null;
    }
  }

  async findPaymentByReference(referenceId: string): Promise<PaymentInfo | null> {
    try {
      const { data, error } = await this.supabase
        .from('payments')
        .select('*')
        .eq('reference_id', referenceId)
        .single();

      if (error || !data) {
        return null;
      }

      return this.mapDatabasePaymentToInfo(data);
    } catch (error) {
      this.logger.error('Error finding payment by reference', error);
      return null;
    }
  }

  // ==============================
  // SEARCH PAYMENTS
  // ==============================
  async searchPayments(dto: PaymentSearchDto): Promise<{ payments: PaymentInfo[]; total: number; pagination: any }> {
    try {
      let query = this.supabase.from('payments').select('*', { count: 'exact' });

      // Apply filters
      if (dto.userId) query = query.eq('user_id', dto.userId);
      if (dto.status) query = query.eq('status', dto.status);
      if (dto.processor) query = query.eq('processor', dto.processor);
      if (dto.paymentMethod) query = query.eq('payment_method', dto.paymentMethod);
      if (dto.currency) query = query.eq('currency', dto.currency);
      if (dto.referenceId) query = query.eq('reference_id', dto.referenceId);
      if (dto.merchantReference) query = query.eq('merchant_reference', dto.merchantReference);
      
      if (dto.minAmount && dto.maxAmount) {
        query = query.gte('amount', dto.minAmount.toString()).lte('amount', dto.maxAmount.toString());
      } else if (dto.minAmount) {
        query = query.gte('amount', dto.minAmount.toString());
      } else if (dto.maxAmount) {
        query = query.lte('amount', dto.maxAmount.toString());
      }

      if (dto.startDate && dto.endDate) {
        query = query.gte('created_at', dto.startDate.toISOString()).lte('created_at', dto.endDate.toISOString());
      } else if (dto.startDate) {
        query = query.gte('created_at', dto.startDate.toISOString());
      } else if (dto.endDate) {
        query = query.lte('created_at', dto.endDate.toISOString());
      }

      // Apply sorting
      const sortBy = dto.sortBy || 'created_at';
      const sortOrder = dto.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const page = dto.page || 1;
      const limit = dto.limit || 20;
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        this.logger.error('Error searching payments', error);
        throw new InternalServerErrorException('Failed to search payments');
      }

      const payments = (data || []).map(payment => this.mapDatabasePaymentToInfo(payment));

      return {
        payments,
        total: count || 0,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit),
          total: count || 0
        }
      };
    } catch (error) {
      this.logger.error('Error searching payments', error);
      throw error;
    }
  }

  // ==============================
  // UPDATE PAYMENT STATUS
  // ==============================
  async updatePaymentStatus(
    paymentId: string, 
    newStatus: PaymentStatus, 
    reason?: string,
    processorResponse?: Record<string, any>
  ): Promise<PaymentInfo> {
    try {
      // Get current payment
      const current = await this.findPaymentById(paymentId);
      if (!current) {
        throw new NotFoundException('Payment not found');
      }

      const updateData: Partial<DatabasePayment> = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (processorResponse) {
        updateData.processor_response = processorResponse;
      }

      if (newStatus === PaymentStatus.COMPLETED) {
        updateData.completed_at = new Date().toISOString();
      }

      if (newStatus === PaymentStatus.FAILED && reason) {
        updateData.failed_reason = reason;
      }

      const { data, error } = await this.supabase
        .from('payments')
        .update(updateData)
        .eq('id', paymentId)
        .select('*')
        .single();

      if (error) {
        this.logger.error('Failed to update payment status', error);
        throw new InternalServerErrorException('Failed to update payment status');
      }

      // Create audit log
      await this.createAuditLog(
        paymentId,
        current.userId,
        'STATUS_UPDATE',
        current.status,
        newStatus,
        reason || 'Status updated'
      );

      // Handle post-status update actions
      await this.handleStatusUpdateActions(data, current.status, newStatus);

      return this.mapDatabasePaymentToInfo(data);
    } catch (error) {
      this.logger.error('Error updating payment status', error);
      throw error;
    }
  }

  // ==============================
  // PAYMENT ANALYTICS
  // ==============================
  async getPaymentAnalytics(dto: PaymentAnalyticsDto): Promise<PaymentAnalytics> {
    try {
      let query = this.supabase.from('payments').select('*');

      // Apply filters
      if (dto.userId) query = query.eq('user_id', dto.userId);
      if (dto.processor) query = query.eq('processor', dto.processor);
      if (dto.paymentMethod) query = query.eq('payment_method', dto.paymentMethod);
      if (dto.currency) query = query.eq('currency', dto.currency);
      
      if (dto.startDate && dto.endDate) {
        query = query.gte('created_at', dto.startDate.toISOString()).lte('created_at', dto.endDate.toISOString());
      }

      const { data: payments, error } = await query;

      if (error) {
        throw new InternalServerErrorException('Failed to get payment analytics');
      }

      return this.calculateAnalytics(payments || [], dto);
    } catch (error) {
      this.logger.error('Error getting payment analytics', error);
      throw error;
    }
  }

  // ==============================
  // PRIVATE HELPER METHODS
  // ==============================
  private generatePaymentReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `PAY-${timestamp}-${random}`;
  }

  private determineProcessor(method: PaymentMethod): PaymentProcessor {
    switch (method) {
      case PaymentMethod.DIGICEL_MONEY:
        return PaymentProcessor.DIGICEL;
      case PaymentMethod.NATCOM_MONEY:
        return PaymentProcessor.NATCOM;
      case PaymentMethod.MONCASH:
        return PaymentProcessor.MONCASH;
      case PaymentMethod.CREDIT_CARD:
      case PaymentMethod.DEBIT_CARD:
        return PaymentProcessor.STRIPE;
      case PaymentMethod.PAYPAL:
        return PaymentProcessor.PAYPAL;
      case PaymentMethod.BANK_TRANSFER:
      case PaymentMethod.ACH_TRANSFER:
        return PaymentProcessor.BANK_TRANSFER;
      default:
        return PaymentProcessor.INTERNAL;
    }
  }

  private async performFraudCheck(userId: string, dto: CreatePaymentDto): Promise<{ score: number; riskLevel: FraudRiskLevel }> {
    // Simplified fraud check - in production, integrate with fraud detection service
    let score = 0;
    let riskLevel = FraudRiskLevel.LOW;

    // Basic checks
    if (dto.amount > 10000) score += 20; // Large amount
    if (dto.currency !== CurrencyCode.HTG) score += 10; // Foreign currency

    // Determine risk level
    if (score >= 70) riskLevel = FraudRiskLevel.CRITICAL;
    else if (score >= 50) riskLevel = FraudRiskLevel.HIGH;
    else if (score >= 30) riskLevel = FraudRiskLevel.MEDIUM;

    // Log fraud check
    const fraudData: Omit<DatabaseFraudCheck, 'id' | 'created_at'> = {
      payment_id: '', // Will be updated after payment creation
      user_id: userId,
      check_type: 'basic_rules',
      score,
      risk_level: riskLevel,
      rules_triggered: [],
      details: { amount: dto.amount, currency: dto.currency },
      blocked: riskLevel === FraudRiskLevel.CRITICAL
    };

    return { score, riskLevel };
  }

  private async processPaymentByProcessor(payment: DatabasePayment, dto: CreatePaymentDto): Promise<DatabasePayment> {
    // In production, integrate with actual payment processors
    // For now, simulate processing
    
    let updatedStatus = PaymentStatus.PENDING;
    let processorResponse = {};

    switch (payment.processor) {
      case PaymentProcessor.STRIPE:
        // Simulate Stripe processing
        updatedStatus = PaymentStatus.AUTHORIZED;
        processorResponse = { stripe_payment_intent: 'pi_mock_' + Date.now() };
        break;
      
      case PaymentProcessor.PAYPAL:
        // Simulate PayPal processing
        updatedStatus = PaymentStatus.PENDING;
        processorResponse = { paypal_order_id: 'PAYPAL_' + Date.now() };
        break;
      
      default:
        // Internal processing
        updatedStatus = PaymentStatus.PENDING;
    }

    // Update payment with processor response
    const { data, error } = await this.supabase
      .from('payments')
      .update({
        status: updatedStatus,
        processor_response: processorResponse,
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.id)
      .select('*')
      .single();

    if (error) {
      throw new InternalServerErrorException('Failed to update payment after processing');
    }

    return data;
  }

  private async handleWebhookByProcessor(webhook: DatabasePaymentWebhook, dto: ProcessWebhookDto): Promise<void> {
    // Handle webhooks based on processor type
    switch (dto.processor) {
      case PaymentProcessor.STRIPE:
        await this.handleStripeWebhook(webhook, dto);
        break;
      case PaymentProcessor.PAYPAL:
        await this.handlePayPalWebhook(webhook, dto);
        break;
      default:
        this.logger.warn(`Unhandled webhook processor: ${dto.processor}`);
    }
  }

  private async handleStripeWebhook(webhook: DatabasePaymentWebhook, dto: ProcessWebhookDto): Promise<void> {
    // Handle Stripe-specific webhook events
    const { eventType } = dto;
    
    switch (eventType) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        const paymentIntentId = dto.payload.id;
        await this.updatePaymentByProcessorId(paymentIntentId, PaymentStatus.COMPLETED);
        break;
      case 'payment_intent.payment_failed':
        // Handle failed payment
        await this.updatePaymentByProcessorId(dto.payload.id, PaymentStatus.FAILED);
        break;
    }
  }

  private async handlePayPalWebhook(webhook: DatabasePaymentWebhook, dto: ProcessWebhookDto): Promise<void> {
    // Handle PayPal-specific webhook events
    const { eventType } = dto;
    
    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await this.updatePaymentByProcessorId(dto.payload.id, PaymentStatus.COMPLETED);
        break;
      case 'PAYMENT.CAPTURE.DENIED':
        await this.updatePaymentByProcessorId(dto.payload.id, PaymentStatus.FAILED);
        break;
    }
  }

  private async updatePaymentByProcessorId(processorPaymentId: string, status: PaymentStatus): Promise<void> {
    const { error } = await this.supabase
      .from('payments')
      .update({ 
        status,
        updated_at: new Date().toISOString(),
        completed_at: status === PaymentStatus.COMPLETED ? new Date().toISOString() : null
      })
      .eq('processor_payment_id', processorPaymentId);

    if (error) {
      this.logger.error('Failed to update payment by processor ID', error);
    }
  }

  private async handleStatusUpdateActions(payment: DatabasePayment, oldStatus: PaymentStatus, newStatus: PaymentStatus): Promise<void> {
    // Handle actions based on status changes
    if (newStatus === PaymentStatus.COMPLETED && oldStatus !== PaymentStatus.COMPLETED) {
      // Credit user wallet
      // TODO: Integrate with WalletsService
      this.logger.log(`Payment completed: ${payment.id}, should credit wallet for user ${payment.user_id}`);
    }
  }

  private async createAuditLog(
    paymentId: string,
    userId: string,
    action: string,
    oldStatus?: PaymentStatus | null,
    newStatus?: PaymentStatus | null,
    reason?: string
  ): Promise<void> {
    const auditData: Omit<DatabasePaymentAudit, 'id' | 'created_at'> = {
      payment_id: paymentId,
      user_id: userId,
      action,
      old_status: oldStatus,
      new_status: newStatus,
      reason,
      ip_address: null, // TODO: Extract from request context
      user_agent: null, // TODO: Extract from request context
      metadata: {}
    };

    await this.supabase.from('payment_audit').insert(auditData);
  }

  private calculateAnalytics(payments: DatabasePayment[], dto: PaymentAnalyticsDto): PaymentAnalytics {
    const totalCount = payments.length;
    const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const completedPayments = payments.filter(p => p.status === PaymentStatus.COMPLETED);
    const successRate = totalCount > 0 ? (completedPayments.length / totalCount) * 100 : 0;
    const averageAmount = totalCount > 0 ? totalAmount / totalCount : 0;

    // Group by status
    const byStatus = payments.reduce((acc, payment) => {
      const status = payment.status;
      if (!acc[status]) acc[status] = { count: 0, amount: 0 };
      acc[status].count++;
      acc[status].amount += parseFloat(payment.amount);
      return acc;
    }, {} as Record<PaymentStatus, { count: number; amount: number }>);

    // Group by method
    const byMethod = payments.reduce((acc, payment) => {
      const method = payment.payment_method;
      if (!acc[method]) acc[method] = { count: 0, amount: 0 };
      acc[method].count++;
      acc[method].amount += parseFloat(payment.amount);
      return acc;
    }, {} as Record<PaymentMethod, { count: number; amount: number }>);

    // Group by processor
    const byProcessor = payments.reduce((acc, payment) => {
      const processor = payment.processor;
      if (!acc[processor]) acc[processor] = { count: 0, amount: 0 };
      acc[processor].count++;
      acc[processor].amount += parseFloat(payment.amount);
      return acc;
    }, {} as Record<PaymentProcessor, { count: number; amount: number }>);

    // Fraud stats
    const totalChecked = payments.filter(p => p.fraud_score !== null).length;
    const blocked = payments.filter(p => p.risk_level === FraudRiskLevel.CRITICAL).length;
    const riskDistribution = payments.reduce((acc, payment) => {
      const risk = payment.risk_level;
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    }, {} as Record<FraudRiskLevel, number>);

    return {
      totalAmount,
      totalCount,
      successRate,
      averageAmount,
      byStatus,
      byMethod,
      byProcessor,
      fraudStats: {
        totalChecked,
        blocked,
        riskDistribution
      }
    };
  }

  // ==============================
  // GET PAYMENT BY ID
  // ==============================
  async getPaymentById(paymentId: string): Promise<PaymentInfo | null> {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { id: paymentId }
      });
      
      if (!payment) {
        return null;
      }
      
      return this.mapDatabasePaymentToInfo(payment as any);
    } catch (error) {
      this.logger.error(`Failed to get payment by ID: ${paymentId}`, error);
      throw new InternalServerErrorException('Failed to retrieve payment');
    }
  }

  private mapDatabasePaymentToInfo(payment: DatabasePayment): PaymentInfo {
    return {
      id: payment.id,
      userId: payment.user_id,
      processor: payment.processor,
      processorPaymentId: payment.processor_payment_id,
      amount: parseFloat(payment.amount),
      currency: payment.currency,
      status: payment.status,
      paymentMethod: payment.payment_method,
      description: payment.description,
      referenceId: payment.reference_id,
      merchantReference: payment.merchant_reference,
      fraudScore: payment.fraud_score,
      riskLevel: payment.risk_level,
      expiresAt: payment.expires_at,
      completedAt: payment.completed_at,
      failedReason: payment.failed_reason,
      metadata: payment.metadata,
      createdAt: payment.created_at,
      updatedAt: payment.updated_at
    };
  }
}
