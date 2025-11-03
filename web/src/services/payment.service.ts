import { api } from '@/lib/api-client';

// Types
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  method: 'NFC' | 'QR_CODE' | 'CARD' | 'BANK_TRANSFER' | 'CASH' | 'APPLE_PAY' | 'GOOGLE_PAY';
  merchantId: string;
  customerId: string;
  reference: string;
  description?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRequest {
  amount: number;
  currency?: string;
  method: string;
  merchantId: string;
  description?: string;
  metadata?: any;
}

export interface QRCodeData {
  qrCode: string;
  paymentId: string;
  expiresAt: string;
}

export interface NFCPaymentData {
  cardUid: string;
  amount: number;
  merchantId: string;
  pin?: string;
}

// Payment Service
export const paymentService = {
  // Create payment
  async createPayment(data: PaymentRequest): Promise<Payment> {
    return api.post<Payment>('/payments', data);
  },

  // Get payment by ID
  async getPayment(paymentId: string): Promise<Payment> {
    return api.get<Payment>(`/payments/${paymentId}`);
  },

  // Get payment history
  async getPayments(params?: {
    page?: number;
    limit?: number;
    status?: string;
    method?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ payments: Payment[]; total: number; page: number; limit: number }> {
    return api.get('/payments', { params });
  },

  // Process NFC payment
  async processNFCPayment(data: NFCPaymentData): Promise<Payment> {
    return api.post<Payment>('/payments/nfc', data);
  },

  // Generate QR code for payment
  async generateQRCode(amount: number, merchantId: string): Promise<QRCodeData> {
    return api.post<QRCodeData>('/payments/qr-code/generate', { amount, merchantId });
  },

  // Process QR code payment
  async processQRPayment(qrCode: string, customerId: string): Promise<Payment> {
    return api.post<Payment>('/payments/qr-code/process', { qrCode, customerId });
  },

  // Cancel payment
  async cancelPayment(paymentId: string): Promise<Payment> {
    return api.post<Payment>(`/payments/${paymentId}/cancel`);
  },

  // Refund payment
  async refundPayment(paymentId: string, amount?: number, reason?: string): Promise<Payment> {
    return api.post<Payment>(`/payments/${paymentId}/refund`, { amount, reason });
  },

  // Get payment statistics
  async getStatistics(params?: {
    period?: 'day' | 'week' | 'month' | 'year';
    merchantId?: string;
  }): Promise<any> {
    return api.get('/payments/statistics', { params });
  },

  // Verify payment
  async verifyPayment(paymentId: string): Promise<{ verified: boolean; payment: Payment }> {
    return api.get(`/payments/${paymentId}/verify`);
  },
};
