/**
 * Advanced Payments API Service
 * Connects frontend components to backend advanced payment endpoints
 */

import { apiClient } from './api-client';
import type { ApiResponse } from '@/types/api-client';

// ===================================
// Type Definitions
// ===================================

export interface QRPaymentData {
  type: 'payment_request' | 'merchant_payment' | 'p2p_transfer';
  amount?: number;
  currency: string;
  recipient: {
    id: string;
    name: string;
    type: 'user' | 'merchant';
  };
  description?: string;
  expiry?: string;
  nonce: string;
  signature?: string;
}

export interface NFCSessionData {
  sessionId: string;
  initiatorId: string;
  targetId?: string;
  amount: number;
  currency: string;
  status: 'initiated' | 'connected' | 'processing' | 'completed' | 'failed';
  expiresAt: string;
}

export interface PaymentRequestData {
  requestId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  currency: string;
  description?: string;
  dueDate?: string;
  isRecurring?: boolean;
  recurringConfig?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    endDate?: string;
    maxOccurrences?: number;
  };
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
}

export interface MerchantQRData {
  merchantId: string;
  qrId: string;
  amount?: number;
  currency: string;
  description?: string;
  expiresAt?: string;
  isReusable: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  transactionLimits: {
    daily: number;
    monthly: number;
    perTransaction: number;
  };
  trustedDevices: Array<{
    deviceId: string;
    deviceName: string;
    lastUsed: string;
    isActive: boolean;
  }>;
  fraudAlerts: boolean;
  locationVerification: boolean;
}

export interface AnalyticsData {
  totalTransactions: number;
  totalVolume: number;
  averageAmount: number;
  successRate: number;
  timeRange: string;
  breakdown: {
    byMethod: Record<string, number>;
    byStatus: Record<string, number>;
    byTimeOfDay: Record<string, number>;
  };
}

// ===================================
// QR Payments API
// ===================================

export const qrPaymentsApi = {
  /**
   * Generate a QR code for payment
   */
  async generateQRCode(data: {
    amount?: number;
    currency: string;
    description?: string;
    expiresIn?: number; // minutes
    type?: 'payment_request' | 'merchant_payment' | 'p2p_transfer';
  }): Promise<ApiResponse<{ qrCode: string; qrId: string; expiresAt: string }>> {
    return apiClient.post('/advanced-payments/qr-payments/generate', data);
  },

  /**
   * Scan and process a QR code
   */
  async scanQRCode(qrData: string): Promise<ApiResponse<QRPaymentData>> {
    return apiClient.post('/advanced-payments/qr-payments/scan', { qrData });
  },

  /**
   * Process a QR payment
   */
  async processPayment(data: {
    qrId: string;
    amount?: number;
    pin?: string;
    biometricData?: string;
  }): Promise<ApiResponse<{ transactionId: string; status: string }>> {
    return apiClient.post('/advanced-payments/qr-payments/process', data);
  },

  /**
   * Get QR payment history
   */
  async getHistory(params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<{ payments: QRPaymentData[]; total: number }>> {
    return apiClient.get('/advanced-payments/qr-payments/history', { params });
  },

  /**
   * Get QR payment analytics
   */
  async getAnalytics(timeRange: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<AnalyticsData>> {
    return apiClient.get(`/advanced-payments/qr-payments/analytics/${timeRange}`);
  },

  /**
   * Validate QR code before processing
   */
  async validateQR(qrId: string): Promise<ApiResponse<{ isValid: boolean; data: QRPaymentData }>> {
    return apiClient.get(`/advanced-payments/qr-payments/validate/${qrId}`);
  }
};

// ===================================
// NFC Payments API
// ===================================

export const nfcPaymentsApi = {
  /**
   * Start an NFC payment session
   */
  async startSession(data: {
    amount: number;
    currency: string;
    description?: string;
    timeout?: number; // seconds
  }): Promise<ApiResponse<NFCSessionData>> {
    return apiClient.post('/advanced-payments/nfc-payments/session', data);
  },

  /**
   * Connect to an existing NFC session
   */
  async connectToSession(sessionId: string): Promise<ApiResponse<NFCSessionData>> {
    return apiClient.post(`/advanced-payments/nfc-payments/connect/${sessionId}`);
  },

  /**
   * Process NFC tap-to-pay
   */
  async processTapToPay(data: {
    sessionId: string;
    nfcData: string;
    pin?: string;
    biometricData?: string;
  }): Promise<ApiResponse<{ transactionId: string; status: string }>> {
    return apiClient.post('/advanced-payments/nfc-payments/tap-to-pay', data);
  },

  /**
   * Get session status
   */
  async getSessionStatus(sessionId: string): Promise<ApiResponse<NFCSessionData>> {
    return apiClient.get(`/advanced-payments/nfc-payments/session/${sessionId}/status`);
  },

  /**
   * Cancel NFC session
   */
  async cancelSession(sessionId: string): Promise<ApiResponse<{ cancelled: boolean }>> {
    return apiClient.post(`/advanced-payments/nfc-payments/session/${sessionId}/cancel`);
  },

  /**
   * Get NFC payment history
   */
  async getHistory(params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<{ sessions: NFCSessionData[]; total: number }>> {
    return apiClient.get('/advanced-payments/nfc-payments/history', { params });
  },

  /**
   * Get NFC analytics
   */
  async getAnalytics(timeRange: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<AnalyticsData>> {
    return apiClient.get(`/advanced-payments/nfc-payments/analytics/${timeRange}`);
  }
};

// ===================================
// Payment Requests API
// ===================================

export const paymentRequestsApi = {
  /**
   * Create a payment request
   */
  async createRequest(data: {
    toUserId: string;
    amount: number;
    currency: string;
    description?: string;
    dueDate?: string;
    isRecurring?: boolean;
    recurringConfig?: PaymentRequestData['recurringConfig'];
  }): Promise<ApiResponse<PaymentRequestData>> {
    return apiClient.post('/advanced-payments/payment-requests/create', data);
  },

  /**
   * Get payment requests (sent and received)
   */
  async getRequests(params?: {
    type?: 'sent' | 'received' | 'all';
    status?: 'pending' | 'paid' | 'expired' | 'cancelled';
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ requests: PaymentRequestData[]; total: number }>> {
    return apiClient.get('/advanced-payments/payment-requests', { params });
  },

  /**
   * Respond to a payment request
   */
  async respondToRequest(requestId: string, data: {
    action: 'pay' | 'decline';
    pin?: string;
    biometricData?: string;
    note?: string;
  }): Promise<ApiResponse<{ transactionId?: string; status: string }>> {
    return apiClient.post(`/advanced-payments/payment-requests/${requestId}/respond`, data);
  },

  /**
   * Cancel a payment request
   */
  async cancelRequest(requestId: string): Promise<ApiResponse<{ cancelled: boolean }>> {
    return apiClient.post(`/advanced-payments/payment-requests/${requestId}/cancel`);
  },

  /**
   * Create bulk payment requests
   */
  async createBulkRequests(data: {
    recipients: Array<{
      userId: string;
      amount: number;
      description?: string;
    }>;
    currency: string;
    dueDate?: string;
  }): Promise<ApiResponse<{ requests: PaymentRequestData[]; successCount: number }>> {
    return apiClient.post('/advanced-payments/payment-requests/bulk', data);
  },

  /**
   * Get payment request details
   */
  async getRequestDetails(requestId: string): Promise<ApiResponse<PaymentRequestData>> {
    return apiClient.get(`/advanced-payments/payment-requests/${requestId}`);
  },

  /**
   * Update recurring payment settings
   */
  async updateRecurringSettings(requestId: string, config: PaymentRequestData['recurringConfig']): Promise<ApiResponse<{ updated: boolean }>> {
    return apiClient.put(`/advanced-payments/payment-requests/${requestId}/recurring`, config);
  }
};

// ===================================
// Merchant QR API
// ===================================

export const merchantQRApi = {
  /**
   * Generate merchant QR code
   */
  async generateMerchantQR(data: {
    amount?: number;
    currency: string;
    description?: string;
    isReusable?: boolean;
    expiresIn?: number; // minutes
  }): Promise<ApiResponse<MerchantQRData & { qrCode: string }>> {
    return apiClient.post('/advanced-payments/merchant-qr/generate', data);
  },

  /**
   * Process merchant QR payment
   */
  async processPayment(data: {
    qrId: string;
    amount?: number;
    tip?: number;
    pin?: string;
    biometricData?: string;
  }): Promise<ApiResponse<{ transactionId: string; receipt: any }>> {
    return apiClient.post('/advanced-payments/merchant-qr/process', data);
  },

  /**
   * Get merchant QR codes
   */
  async getMerchantQRs(params?: {
    status?: 'active' | 'expired' | 'disabled';
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ qrCodes: MerchantQRData[]; total: number }>> {
    return apiClient.get('/advanced-payments/merchant-qr', { params });
  },

  /**
   * Update merchant QR
   */
  async updateMerchantQR(qrId: string, data: {
    amount?: number;
    description?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<MerchantQRData>> {
    return apiClient.put(`/advanced-payments/merchant-qr/${qrId}`, data);
  },

  /**
   * Delete merchant QR
   */
  async deleteMerchantQR(qrId: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return apiClient.delete(`/advanced-payments/merchant-qr/${qrId}`);
  },

  /**
   * Get merchant transaction history
   */
  async getTransactionHistory(params?: {
    qrId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ transactions: any[]; total: number; summary: any }>> {
    return apiClient.get('/advanced-payments/merchant-qr/transactions', { params });
  },

  /**
   * Get merchant analytics dashboard
   */
  async getDashboard(timeRange: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<{
    totalSales: number;
    transactionCount: number;
    averageAmount: number;
    topPaymentMethods: any[];
    salesTrend: any[];
    recentTransactions: any[];
  }>> {
    return apiClient.get(`/advanced-payments/merchant-qr/dashboard/${timeRange}`);
  }
};

// ===================================
// Payment Security API
// ===================================

export const paymentSecurityApi = {
  /**
   * Get security settings
   */
  async getSettings(): Promise<ApiResponse<SecuritySettings>> {
    return apiClient.get('/advanced-payments/payment-security/settings');
  },

  /**
   * Update security settings
   */
  async updateSettings(settings: Partial<SecuritySettings>): Promise<ApiResponse<SecuritySettings>> {
    return apiClient.put('/advanced-payments/payment-security/settings', settings);
  },

  /**
   * Enable/disable two-factor authentication
   */
  async toggle2FA(data: {
    enable: boolean;
    method?: 'sms' | 'email' | 'app';
    pin?: string;
  }): Promise<ApiResponse<{ enabled: boolean; qrCode?: string }>> {
    return apiClient.post('/advanced-payments/payment-security/2fa', data);
  },

  /**
   * Verify 2FA token
   */
  async verify2FA(token: string): Promise<ApiResponse<{ verified: boolean }>> {
    return apiClient.post('/advanced-payments/payment-security/2fa/verify', { token });
  },

  /**
   * Setup biometric authentication
   */
  async setupBiometric(data: {
    type: 'fingerprint' | 'face' | 'voice';
    biometricData: string;
    pin: string;
  }): Promise<ApiResponse<{ enabled: boolean }>> {
    return apiClient.post('/advanced-payments/payment-security/biometric', data);
  },

  /**
   * Get trusted devices
   */
  async getTrustedDevices(): Promise<ApiResponse<SecuritySettings['trustedDevices']>> {
    return apiClient.get('/advanced-payments/payment-security/devices');
  },

  /**
   * Add trusted device
   */
  async addTrustedDevice(deviceData: {
    deviceName: string;
    deviceFingerprint: string;
    pin: string;
  }): Promise<ApiResponse<{ added: boolean; deviceId: string }>> {
    return apiClient.post('/advanced-payments/payment-security/devices', deviceData);
  },

  /**
   * Remove trusted device
   */
  async removeTrustedDevice(deviceId: string): Promise<ApiResponse<{ removed: boolean }>> {
    return apiClient.delete(`/advanced-payments/payment-security/devices/${deviceId}`);
  },

  /**
   * Get fraud alerts
   */
  async getFraudAlerts(params?: {
    status?: 'active' | 'resolved' | 'dismissed';
    severity?: 'low' | 'medium' | 'high' | 'critical';
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ alerts: any[]; total: number }>> {
    return apiClient.get('/advanced-payments/payment-security/fraud-alerts', { params });
  },

  /**
   * Dismiss fraud alert
   */
  async dismissFraudAlert(alertId: string): Promise<ApiResponse<{ dismissed: boolean }>> {
    return apiClient.post(`/advanced-payments/payment-security/fraud-alerts/${alertId}/dismiss`);
  },

  /**
   * Get security audit log
   */
  async getAuditLog(params?: {
    startDate?: string;
    endDate?: string;
    eventType?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ events: any[]; total: number }>> {
    return apiClient.get('/advanced-payments/payment-security/audit', { params });
  },

  /**
   * Update transaction limits
   */
  async updateLimits(limits: {
    daily?: number;
    monthly?: number;
    perTransaction?: number;
  }): Promise<ApiResponse<{ updated: boolean }>> {
    return apiClient.put('/advanced-payments/payment-security/limits', limits);
  },

  /**
   * Initiate security challenge
   */
  async initiateSecurityChallenge(type: 'pin' | '2fa' | 'biometric'): Promise<ApiResponse<{
    challengeId: string;
    method: string;
    expiresAt: string;
  }>> {
    return apiClient.post('/advanced-payments/payment-security/challenge', { type });
  },

  /**
   * Verify security challenge
   */
  async verifySecurityChallenge(challengeId: string, response: string): Promise<ApiResponse<{
    verified: boolean;
    token?: string;
  }>> {
    return apiClient.post(`/advanced-payments/payment-security/challenge/${challengeId}/verify`, { response });
  }
};

// ===================================
// Combined Advanced Payments API
// ===================================

export const advancedPaymentsApi = {
  qr: qrPaymentsApi,
  nfc: nfcPaymentsApi,
  requests: paymentRequestsApi,
  merchantQR: merchantQRApi,
  security: paymentSecurityApi,

  /**
   * Get overall advanced payments analytics
   */
  async getOverallAnalytics(timeRange: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<{
    qr: AnalyticsData;
    nfc: AnalyticsData;
    requests: AnalyticsData;
    merchantQR: AnalyticsData;
    combined: AnalyticsData;
  }>> {
    return apiClient.get(`/advanced-payments/analytics/${timeRange}`);
  },

  /**
   * Get payment method preferences
   */
  async getPaymentMethodPreferences(): Promise<ApiResponse<{
    preferredMethods: string[];
    usage: Record<string, number>;
    settings: Record<string, any>;
  }>> {
    return apiClient.get('/advanced-payments/preferences');
  },

  /**
   * Update payment method preferences
   */
  async updatePaymentMethodPreferences(preferences: {
    preferredMethods: string[];
    settings: Record<string, any>;
  }): Promise<ApiResponse<{ updated: boolean }>> {
    return apiClient.put('/advanced-payments/preferences', preferences);
  }
};

export default advancedPaymentsApi;