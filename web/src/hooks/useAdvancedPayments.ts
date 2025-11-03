/**
 * Advanced Payments React Hooks
 * Custom hooks for managing advanced payment functionality
 */

import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api-services';
import type { 
  QRPaymentData, 
  NFCSessionData, 
  PaymentRequestData, 
  MerchantQRData, 
  SecuritySettings,
  AnalyticsData 
} from '@/lib/advanced-payments-api';

// ===================================
// QR Payments Hook
// ===================================

export function useQRPayments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQR = useCallback(async (data: {
    amount?: number;
    currency: string;
    description?: string;
    type?: 'payment_request' | 'merchant_payment' | 'p2p_transfer';
    expiresIn?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.advancedPayments.qr.generateQRCode(data);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(typeof response.error === 'string' ? response.error : response.error?.message || 'Failed to generate QR');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const scanQR = useCallback(async (qrData: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.advancedPayments.qr.scanQRCode(qrData);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(typeof response.error === 'string' ? response.error : response.error?.message || 'Failed to scan QR');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const processPayment = useCallback(async (data: {
    qrId: string;
    amount?: number;
    pin?: string;
    biometricData?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.advancedPayments.qr.processPayment(data);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(typeof response.error === 'string' ? response.error : response.error?.message || 'Payment failed');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getHistory = useCallback(async (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.advancedPayments.qr.getHistory(params);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(typeof response.error === 'string' ? response.error : response.error?.message || 'Failed to fetch history');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    generateQR,
    scanQR,
    processPayment,
    getHistory,
    clearError: () => setError(null)
  };
}

// ===================================
// NFC Payments Hook
// ===================================

export function useNFCPayments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<NFCSessionData | null>(null);

  const startSession = useCallback(async (data: {
    amount: number;
    currency: string;
    description?: string;
    timeout?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.advancedPayments.nfc.startSession(data);
      if (response.success && response.data) {
        setCurrentSession(response.data);
        return response.data;
      }
      throw new Error(typeof response.error === 'string' ? response.error : response.error?.message || 'Failed to start NFC session');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const connectToSession = useCallback(async (sessionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.advancedPayments.nfc.connectToSession(sessionId);
      if (response.success && response.data) {
        setCurrentSession(response.data);
        return response.data;
      }
      throw new Error(typeof response.error === 'string' ? response.error : response.error?.message || 'Failed to connect to session');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const processTapToPay = useCallback(async (data: {
    sessionId: string;
    nfcData: string;
    pin?: string;
    biometricData?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.advancedPayments.nfc.processTapToPay(data);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(typeof response.error === 'string' ? response.error : response.error?.message || 'NFC payment failed');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelSession = useCallback(async (sessionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.advancedPayments.nfc.cancelSession(sessionId);
      if (response.success) {
        setCurrentSession(null);
        return response.data;
      }
      throw new Error(typeof response.error === 'string' ? response.error : response.error?.message || 'Failed to cancel session');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    currentSession,
    startSession,
    connectToSession,
    processTapToPay,
    cancelSession,
    clearError: () => setError(null)
  };
}

// ===================================
// Payment Requests Hook
// ===================================

export function usePaymentRequests() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<PaymentRequestData[]>([]);

  const createRequest = useCallback(async (data: {
    toUserId: string;
    amount: number;
    currency: string;
    description?: string;
    dueDate?: string;
    isRecurring?: boolean;
    recurringConfig?: PaymentRequestData['recurringConfig'];
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.advancedPayments.requests.createRequest(data);
      if (response.success && response.data) {
        setRequests(prev => [response.data!, ...prev]);
        return response.data;
      }
      throw new Error(typeof response.error === 'string' ? response.error : response.error?.message || 'Failed to create request');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRequests = useCallback(async (params?: {
    type?: 'sent' | 'received' | 'all';
    status?: 'pending' | 'paid' | 'expired' | 'cancelled';
    page?: number;
    limit?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.advancedPayments.requests.getRequests(params);
      if (response.success && response.data) {
        setRequests(response.data.requests);
        return response.data;
      }
      throw new Error(typeof response.error === 'string' ? response.error : response.error?.message || 'Failed to fetch requests');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const respondToRequest = useCallback(async (requestId: string, data: {
    action: 'pay' | 'decline';
    pin?: string;
    biometricData?: string;
    note?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.advancedPayments.requests.respondToRequest(requestId, data);
      if (response.success && response.data) {
        // Update local state
        setRequests(prev => prev.map(req => 
          req.requestId === requestId 
            ? { ...req, status: data.action === 'pay' ? 'paid' : 'cancelled' as const }
            : req
        ));
        return response.data;
      }
      throw new Error(typeof response.error === 'string' ? response.error : response.error?.message || 'Failed to respond to request');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    requests,
    createRequest,
    getRequests,
    respondToRequest,
    clearError: () => setError(null)
  };
}

// ===================================
// Merchant QR Hook
// ===================================

export function useMerchantQR() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCodes, setQrCodes] = useState<MerchantQRData[]>([]);

  const generateMerchantQR = useCallback(async (data: {
    amount?: number;
    currency: string;
    description?: string;
    isReusable?: boolean;
    expiresIn?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.advancedPayments.merchantQR.generateMerchantQR(data);
      if (response.success && response.data) {
        setQrCodes(prev => [response.data!, ...prev]);
        return response.data;
      }
      throw new Error(typeof response.error === 'string' ? response.error : response.error?.message || 'Failed to generate merchant QR');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const processPayment = useCallback(async (data: {
    qrId: string;
    amount?: number;
    tip?: number;
    pin?: string;
    biometricData?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.advancedPayments.merchantQR.processPayment(data);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(typeof response.error === 'string' ? response.error : response.error?.message || 'Payment processing failed');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDashboard = useCallback(async (timeRange: 'day' | 'week' | 'month' | 'year' = 'month') => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.advancedPayments.merchantQR.getDashboard(timeRange);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(typeof response.error === 'string' ? response.error : response.error?.message || 'Failed to load dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    qrCodes,
    generateMerchantQR,
    processPayment,
    getDashboard,
    clearError: () => setError(null)
  };
}

// ===================================
// Payment Security Hook
// ===================================

export function usePaymentSecurity() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<SecuritySettings | null>(null);

  const getSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.advancedPayments.security.getSettings();
      if (response.success && response.data) {
        setSettings(response.data);
        return response.data;
      }
      throw new Error(typeof response.error === 'string' ? response.error : response.error?.message || 'Failed to fetch settings');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<SecuritySettings>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.advancedPayments.security.updateSettings(newSettings);
      if (response.success && response.data) {
        setSettings(response.data);
        return response.data;
      }
      throw new Error(typeof response.error === 'string' ? response.error : response.error?.message || 'Failed to update settings');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggle2FA = useCallback(async (data: {
    enable: boolean;
    method?: 'sms' | 'email' | 'app';
    pin?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.advancedPayments.security.toggle2FA(data);
      if (response.success && response.data) {
        // Update local settings
        if (settings) {
          setSettings({ ...settings, twoFactorEnabled: data.enable });
        }
        return response.data;
      }
      throw new Error(typeof response.error === 'string' ? response.error : response.error?.message || 'Failed to toggle 2FA');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [settings]);

  const getFraudAlerts = useCallback(async (params?: {
    status?: 'active' | 'resolved' | 'dismissed';
    severity?: 'low' | 'medium' | 'high' | 'critical';
    page?: number;
    limit?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.advancedPayments.security.getFraudAlerts(params);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(typeof response.error === 'string' ? response.error : response.error?.message || 'Failed to fetch fraud alerts');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load settings on mount
  useEffect(() => {
    getSettings();
  }, [getSettings]);

  return {
    loading,
    error,
    settings,
    getSettings,
    updateSettings,
    toggle2FA,
    getFraudAlerts,
    clearError: () => setError(null)
  };
}

// ===================================
// Combined Analytics Hook
// ===================================

export function useAdvancedPaymentsAnalytics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOverallAnalytics = useCallback(async (timeRange: 'day' | 'week' | 'month' | 'year' = 'month') => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.advancedPayments.getOverallAnalytics(timeRange);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(typeof response.error === 'string' ? response.error : response.error?.message || 'Failed to fetch analytics');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getOverallAnalytics,
    clearError: () => setError(null)
  };
}