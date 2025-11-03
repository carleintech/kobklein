import { PaymentMethod, PaymentProcessor, CurrencyCode } from '../../types/database.types';

// Simplified DTOs for compilation compatibility
export class CreatePaymentDto {
  amount: number;
  currency: CurrencyCode;
  paymentMethod: PaymentMethod;
  processor?: PaymentProcessor;
  description?: string;
  merchantReference?: string;
  returnUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, any>;
}

export class ProcessWebhookDto {
  processor: PaymentProcessor;
  eventType: string;
  payload: Record<string, any>;
  signature?: string;
  headers?: Record<string, string>;
}

export class PaymentCallbackDto {
  paymentId: string;
  status: string;
  processorReference?: string;
  processorResponse?: Record<string, any>;
}

export class RefundPaymentDto {
  amount?: number; // If not provided, full refund
  reason?: string;
  metadata?: Record<string, any>;
}

export class PaymentAnalyticsDto {
  startDate?: Date;
  endDate?: Date;
  groupBy?: 'hour' | 'day' | 'week' | 'month';
  processor?: PaymentProcessor;
  paymentMethod?: PaymentMethod;
  currency?: CurrencyCode;
  userId?: string;
}

export class FraudCheckDto {
  paymentId: string;
  ipAddress?: string;
  userAgent?: string;
  deviceFingerprint?: string;
  billingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}

export class PaymentRetryDto {
  paymentMethod?: PaymentMethod;
  processor?: PaymentProcessor;
  metadata?: Record<string, any>;
}

export class UpdatePaymentDto {
  description?: string;
  metadata?: Record<string, any>;
  merchantReference?: string;
}

export class PaymentSearchDto {
  userId?: string;
  status?: string;
  processor?: PaymentProcessor;
  paymentMethod?: PaymentMethod;
  currency?: CurrencyCode;
  minAmount?: number;
  maxAmount?: number;
  startDate?: Date;
  endDate?: Date;
  referenceId?: string;
  merchantReference?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'amount' | 'status';
  sortOrder?: 'asc' | 'desc';
}