/**
 * KobKlein API Service Layer
 * High-level API functions organized by feature domain
 */

import {
  ApiResponse,
  DistributorStats,
  KobKleinCard,
  ListParams,
  ListResponse,
  MerchantStats,
  Notification,
  PaymentRequest,
  PaymentResponse,
  SystemStats,
  Transaction,
  User,
  Wallet,
} from "@/types/api-client";
import { apiClient } from "./api-client";

/**
 * Authentication API
 */
export const authApi = {
  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<{ user: User; tokens: any }>> {
    return apiClient.post(
      "/auth/login",
      { email, password },
      { requireAuth: false }
    );
  },

  async register(userData: {
    email: string;
    password: string;
    phone: string;
    firstName: string;
    lastName: string;
    role: string;
  }): Promise<ApiResponse<{ user: User; tokens: any }>> {
    return apiClient.post("/auth/register", userData, { requireAuth: false });
  },

  async verifyOtp(
    phone: string,
    otp: string
  ): Promise<ApiResponse<{ verified: boolean }>> {
    return apiClient.post(
      "/auth/verify-otp",
      { phone, otp },
      { requireAuth: false }
    );
  },

  async resetPassword(email: string): Promise<ApiResponse<{ sent: boolean }>> {
    return apiClient.post(
      "/auth/reset-password",
      { email },
      { requireAuth: false }
    );
  },

  async refreshToken(): Promise<ApiResponse<any>> {
    return apiClient.post("/auth/refresh", {}, { requireAuth: false });
  },

  async logout(): Promise<ApiResponse<{ success: boolean }>> {
    const response = await apiClient.post("/auth/logout");
    if (response.success) {
      apiClient.clearAuth();
    }
    return response;
  },
};

/**
 * User API
 */
export const userApi = {
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get("/users/profile");
  },

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put("/users/profile", data);
  },

  async updatePreferences(
    preferences: User["preferences"]
  ): Promise<ApiResponse<User>> {
    return apiClient.patch("/users/preferences", preferences);
  },

  async uploadKycDocuments(
    documents: File[]
  ): Promise<ApiResponse<{ uploaded: boolean }>> {
    const formData = new FormData();
    documents.forEach((doc, index) => {
      formData.append(`document_${index}`, doc);
    });
    return apiClient.uploadFile("/users/kyc", documents[0], "documents", {
      documentCount: documents.length,
    });
  },

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<{ changed: boolean }>> {
    return apiClient.post("/users/change-password", {
      currentPassword,
      newPassword,
    });
  },
};

/**
 * Wallet API
 */
export const walletApi = {
  async getBalance(): Promise<ApiResponse<Wallet>> {
    return apiClient.get("/wallets/balance");
  },

  async getTransactions(
    params?: ListParams
  ): Promise<ApiResponse<ListResponse<Transaction>>> {
    return apiClient.get("/wallets/transactions", { params });
  },

  async refillWallet(
    amount: number,
    currency: "HTG" | "USD",
    paymentMethod: string
  ): Promise<ApiResponse<Transaction>> {
    return apiClient.post("/wallets/refill", {
      amount,
      currency,
      paymentMethod,
    });
  },

  async withdrawFunds(
    amount: number,
    currency: "HTG" | "USD",
    destination: string
  ): Promise<ApiResponse<Transaction>> {
    return apiClient.post("/wallets/withdraw", {
      amount,
      currency,
      destination,
    });
  },

  async getLimits(): Promise<ApiResponse<{ daily: any; monthly: any }>> {
    return apiClient.get("/wallets/limits");
  },

  async updateLimits(limits: {
    daily: any;
    monthly: any;
  }): Promise<ApiResponse<{ updated: boolean }>> {
    return apiClient.put("/wallets/limits", limits);
  },
};

/**
 * Payment API
 */
export const paymentApi = {
  async sendPayment(
    request: PaymentRequest
  ): Promise<ApiResponse<PaymentResponse>> {
    return apiClient.post("/payments/send", request);
  },

  async requestPayment(
    request: PaymentRequest
  ): Promise<ApiResponse<PaymentResponse>> {
    return apiClient.post("/payments/request", request);
  },

  async processNfcPayment(
    nfcData: string,
    amount: number,
    currency: "HTG" | "USD"
  ): Promise<ApiResponse<PaymentResponse>> {
    return apiClient.post("/payments/nfc", { nfcData, amount, currency });
  },

  async generateQrCode(
    amount: number,
    currency: "HTG" | "USD",
    description?: string
  ): Promise<ApiResponse<{ qrCode: string; expiresAt: string }>> {
    return apiClient.post("/payments/qr", { amount, currency, description });
  },

  async processQrPayment(
    qrData: string
  ): Promise<ApiResponse<PaymentResponse>> {
    return apiClient.post("/payments/qr/process", { qrData });
  },

  async getPaymentStatus(
    transactionId: string
  ): Promise<ApiResponse<Transaction>> {
    return apiClient.get(`/payments/status/${transactionId}`);
  },

  async cancelPayment(
    transactionId: string
  ): Promise<ApiResponse<{ cancelled: boolean }>> {
    return apiClient.post(`/payments/${transactionId}/cancel`);
  },
};

/**
 * Transaction API
 */
export const transactionApi = {
  async getTransactions(
    params?: ListParams
  ): Promise<ApiResponse<ListResponse<Transaction>>> {
    return apiClient.get("/transactions", { params });
  },

  async getTransactionDetails(id: string): Promise<ApiResponse<Transaction>> {
    return apiClient.get(`/transactions/${id}`);
  },

  async getTransactionHistory(
    params?: ListParams & { userId?: string }
  ): Promise<ApiResponse<ListResponse<Transaction>>> {
    return apiClient.get("/transactions/history", { params });
  },

  async exportTransactions(params?: {
    startDate?: string;
    endDate?: string;
    format?: "csv" | "pdf";
  }): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.post("/transactions/export", params);
  },

  async requestRefund(
    transactionId: string,
    reason: string,
    amount?: number
  ): Promise<ApiResponse<{ refundId: string }>> {
    return apiClient.post(`/transactions/${transactionId}/refund`, {
      reason,
      amount,
    });
  },
};

/**
 * Merchant API
 */
export const merchantApi = {
  async getStats(
    period?: "day" | "week" | "month" | "year"
  ): Promise<ApiResponse<MerchantStats>> {
    return apiClient.get("/merchants/stats", { params: { period } });
  },

  async getSales(
    params?: ListParams
  ): Promise<ApiResponse<ListResponse<Transaction>>> {
    return apiClient.get("/merchants/sales", { params });
  },

  async getCustomers(
    params?: ListParams
  ): Promise<ApiResponse<ListResponse<User>>> {
    return apiClient.get("/merchants/customers", { params });
  },

  async processPosPayment(
    amount: number,
    currency: "HTG" | "USD",
    customerId?: string
  ): Promise<ApiResponse<PaymentResponse>> {
    return apiClient.post("/merchants/pos/payment", {
      amount,
      currency,
      customerId,
    });
  },

  async getPayoutHistory(
    params?: ListParams
  ): Promise<ApiResponse<ListResponse<Transaction>>> {
    return apiClient.get("/merchants/payouts", { params });
  },

  async requestPayout(
    amount: number,
    currency: "HTG" | "USD"
  ): Promise<ApiResponse<{ payoutId: string }>> {
    return apiClient.post("/merchants/payout", { amount, currency });
  },
};

/**
 * Distributor API
 */
export const distributorApi = {
  async getStats(): Promise<ApiResponse<DistributorStats>> {
    return apiClient.get("/distributors/stats");
  },

  async getTerritoryUsers(
    params?: ListParams
  ): Promise<ApiResponse<ListResponse<User>>> {
    return apiClient.get("/distributors/territory/users", { params });
  },

  async getCards(
    params?: ListParams
  ): Promise<ApiResponse<ListResponse<KobKleinCard>>> {
    return apiClient.get("/distributors/cards", { params });
  },

  async activateCard(
    cardUid: string,
    userId: string
  ): Promise<ApiResponse<{ activated: boolean }>> {
    return apiClient.post("/distributors/cards/activate", { cardUid, userId });
  },

  async getCommissionHistory(
    params?: ListParams
  ): Promise<ApiResponse<ListResponse<Transaction>>> {
    return apiClient.get("/distributors/commission", { params });
  },

  async requestCommissionPayout(): Promise<ApiResponse<{ payoutId: string }>> {
    return apiClient.post("/distributors/commission/payout");
  },

  async manageUser(
    userId: string,
    action: "suspend" | "activate" | "block"
  ): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post(`/distributors/users/${userId}/${action}`);
  },
};

/**
 * Card API
 */
export const cardApi = {
  async getUserCards(): Promise<ApiResponse<KobKleinCard[]>> {
    return apiClient.get("/cards");
  },

  async linkCard(cardUid: string): Promise<ApiResponse<{ linked: boolean }>> {
    return apiClient.post("/cards/link", { cardUid });
  },

  async activateCard(
    cardUid: string
  ): Promise<ApiResponse<{ activated: boolean }>> {
    return apiClient.post("/cards/activate", { cardUid });
  },

  async getCardStatus(cardId: string): Promise<ApiResponse<KobKleinCard>> {
    return apiClient.get(`/cards/${cardId}/status`);
  },

  async suspendCard(
    cardId: string,
    reason: string
  ): Promise<ApiResponse<{ suspended: boolean }>> {
    return apiClient.post(`/cards/${cardId}/suspend`, { reason });
  },

  async reportCardLost(
    cardId: string
  ): Promise<ApiResponse<{ reported: boolean }>> {
    return apiClient.post(`/cards/${cardId}/report-lost`);
  },
};

/**
 * Notification API
 */
export const notificationApi = {
  async getNotifications(
    params?: ListParams
  ): Promise<ApiResponse<ListResponse<Notification>>> {
    return apiClient.get("/notifications", { params });
  },

  async markAsRead(
    notificationId: string
  ): Promise<ApiResponse<{ read: boolean }>> {
    return apiClient.post(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead(): Promise<ApiResponse<{ count: number }>> {
    return apiClient.post("/notifications/read-all");
  },

  async updatePreferences(
    preferences: any
  ): Promise<ApiResponse<{ updated: boolean }>> {
    return apiClient.put("/notifications/preferences", preferences);
  },

  async deleteNotification(
    notificationId: string
  ): Promise<ApiResponse<{ deleted: boolean }>> {
    return apiClient.delete(`/notifications/${notificationId}`);
  },
};

/**
 * Admin API
 */
export const adminApi = {
  async getSystemStats(): Promise<ApiResponse<SystemStats>> {
    return apiClient.get("/admin/stats");
  },

  async getUsers(
    params?: ListParams & { role?: string; status?: string }
  ): Promise<ApiResponse<ListResponse<User>>> {
    return apiClient.get("/admin/users", { params });
  },

  async getUserDetails(
    userId: string
  ): Promise<
    ApiResponse<User & { wallet: Wallet; transactions: Transaction[] }>
  > {
    return apiClient.get(`/admin/users/${userId}`);
  },

  async updateUserStatus(
    userId: string,
    status: User["status"]
  ): Promise<ApiResponse<{ updated: boolean }>> {
    return apiClient.patch(`/admin/users/${userId}/status`, { status });
  },

  async getTransactions(
    params?: ListParams
  ): Promise<ApiResponse<ListResponse<Transaction>>> {
    return apiClient.get("/admin/transactions", { params });
  },

  async getFraudAlerts(
    params?: ListParams
  ): Promise<ApiResponse<ListResponse<any>>> {
    return apiClient.get("/admin/fraud-alerts", { params });
  },

  async generateReport(
    type: "financial" | "user" | "transaction",
    params?: any
  ): Promise<ApiResponse<{ reportUrl: string }>> {
    return apiClient.post("/admin/reports", { type, params });
  },

  async getSystemHealth(): Promise<
    ApiResponse<{ status: string; services: any[] }>
  > {
    return apiClient.get("/admin/system/health");
  },

  async updateSystemSettings(
    settings: any
  ): Promise<ApiResponse<{ updated: boolean }>> {
    return apiClient.put("/admin/system/settings", settings);
  },
};

/**
 * WebSocket API
 */
export const websocketApi = {
  async connect(): Promise<WebSocket> {
    return apiClient.connectWebSocket();
  },

  disconnect(): void {
    apiClient.disconnectWebSocket();
  },

  sendMessage(type: string, data: any): void {
    apiClient.sendWebSocketMessage({
      type,
      data,
      timestamp: new Date().toISOString(),
    });
  },

  subscribeToTransactions(): void {
    this.sendMessage("subscribe", { channel: "transactions" });
  },

  subscribeToNotifications(): void {
    this.sendMessage("subscribe", { channel: "notifications" });
  },

  unsubscribe(channel: string): void {
    this.sendMessage("unsubscribe", { channel });
  },
};

/**
 * File Upload API
 */
export const uploadApi = {
  async uploadAvatar(file: File): Promise<ApiResponse<{ url: string }>> {
    return apiClient.uploadFile("/upload/avatar", file);
  },

  async uploadDocument(
    file: File,
    type: string
  ): Promise<ApiResponse<{ url: string; documentId: string }>> {
    return apiClient.uploadFile("/upload/document", file, "document", { type });
  },

  async uploadReceipt(
    file: File,
    transactionId: string
  ): Promise<ApiResponse<{ url: string }>> {
    return apiClient.uploadFile("/upload/receipt", file, "receipt", {
      transactionId,
    });
  },
};

/**
 * Advanced Payments API Import
 */
import { advancedPaymentsApi } from './advanced-payments-api';

// Export all APIs as a single object for convenience
export const api = {
  auth: authApi,
  user: userApi,
  wallet: walletApi,
  payment: paymentApi,
  transaction: transactionApi,
  merchant: merchantApi,
  distributor: distributorApi,
  card: cardApi,
  notification: notificationApi,
  admin: adminApi,
  websocket: websocketApi,
  upload: uploadApi,
  // Advanced Payment Systems
  advancedPayments: advancedPaymentsApi,
};

export default api;
