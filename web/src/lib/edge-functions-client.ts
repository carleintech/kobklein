import {
  ApiResponse,
  AuditLog,
  BulkNotificationRequest,
  BulkNotificationResponse,
  CreatePaymentIntentRequest,
  CreatePaymentIntentResponse,
  EDGE_FUNCTION_ENDPOINTS,
  EdgeFunctionError,
  GenerateReportRequest,
  NotificationPayload,
  PaymentIntent,
  RefundRequest,
  RefundResponse,
  SendNotificationRequest,
  SystemReport,
  SystemStats,
  TransferRequest,
  TransferResponse,
  User,
  UserProfile,
  UserUpdate,
  WalletBalance,
  WalletTransaction,
} from "@/types/edge-functions";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export class EdgeFunctionsClient {
  private supabase: SupabaseClient;
  private baseUrl: string;

  constructor(supabaseUrl: string, supabaseAnonKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
    this.baseUrl = `${supabaseUrl}/functions/v1`;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const session = await this.supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (!token) {
        throw new EdgeFunctionError(
          "Authentication required",
          "AUTH_REQUIRED",
          {},
          401
        );
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        let errorDetails = {};

        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          errorDetails = errorData;
        } catch {
          // If we can't parse the error response, use the default message
        }

        throw new EdgeFunctionError(
          errorMessage,
          "HTTP_ERROR",
          errorDetails,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof EdgeFunctionError) {
        throw error;
      }

      throw new EdgeFunctionError(
        error instanceof Error ? error.message : "Unknown error occurred",
        "NETWORK_ERROR"
      );
    }
  }

  // User Management API
  async getUser(userId?: string): Promise<ApiResponse<User>> {
    const endpoint = userId
      ? `${EDGE_FUNCTION_ENDPOINTS.USER_MANAGEMENT}/${userId}`
      : EDGE_FUNCTION_ENDPOINTS.USER_MANAGEMENT;

    return this.makeRequest(endpoint);
  }

  async updateUser(
    userId: string,
    updates: Partial<User>
  ): Promise<ApiResponse<User>> {
    return this.makeRequest(
      `${EDGE_FUNCTION_ENDPOINTS.USER_MANAGEMENT}/${userId}`,
      {
        method: "PUT",
        body: JSON.stringify(updates),
      }
    );
  }

  async deactivateUser(
    userId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return this.makeRequest(
      `${EDGE_FUNCTION_ENDPOINTS.USER_MANAGEMENT}/${userId}`,
      {
        method: "DELETE",
      }
    );
  }

  async getUserProfile(userId?: string): Promise<ApiResponse<UserProfile>> {
    const endpoint = userId
      ? `${EDGE_FUNCTION_ENDPOINTS.USER_MANAGEMENT}/profile/${userId}`
      : `${EDGE_FUNCTION_ENDPOINTS.USER_MANAGEMENT}/profile`;

    return this.makeRequest(endpoint);
  }

  async updateUserProfile(
    userId: string,
    profile: Partial<UserProfile>
  ): Promise<ApiResponse<UserProfile>> {
    return this.makeRequest(
      `${EDGE_FUNCTION_ENDPOINTS.USER_MANAGEMENT}/profile/${userId}`,
      {
        method: "PUT",
        body: JSON.stringify(profile),
      }
    );
  }

  // Wallet Management API
  async getWalletBalance(
    userId?: string,
    currency: string = "USD"
  ): Promise<ApiResponse<{ balance: WalletBalance }>> {
    const params = new URLSearchParams();
    if (userId) params.append("user_id", userId);
    if (currency) params.append("currency", currency);

    return this.makeRequest(
      `${EDGE_FUNCTION_ENDPOINTS.WALLET_MANAGEMENT}/balance?${params}`
    );
  }

  async getTransactionHistory(
    userId?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<ApiResponse<{ transactions: WalletTransaction[] }>> {
    const params = new URLSearchParams();
    if (userId) params.append("user_id", userId);
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());

    return this.makeRequest(
      `${EDGE_FUNCTION_ENDPOINTS.WALLET_MANAGEMENT}/transactions?${params}`
    );
  }

  async createTransaction(transaction: {
    type: WalletTransaction["type"];
    amount: number;
    currency?: string;
    description?: string;
    referenceId?: string;
    metadata?: Record<string, any>;
    targetUserId?: string;
  }): Promise<ApiResponse<{ transaction: WalletTransaction }>> {
    return this.makeRequest(
      `${EDGE_FUNCTION_ENDPOINTS.WALLET_MANAGEMENT}/transactions`,
      {
        method: "POST",
        body: JSON.stringify(transaction),
      }
    );
  }

  async transferFunds(
    transfer: TransferRequest
  ): Promise<ApiResponse<TransferResponse>> {
    return this.makeRequest(
      `${EDGE_FUNCTION_ENDPOINTS.WALLET_MANAGEMENT}/transfer`,
      {
        method: "POST",
        body: JSON.stringify({
          to_user_id: transfer.toUserId,
          amount: transfer.amount,
          currency: transfer.currency,
          description: transfer.description,
        }),
      }
    );
  }

  // Payment Processing API
  async createPaymentIntent(
    request: CreatePaymentIntentRequest
  ): Promise<ApiResponse<CreatePaymentIntentResponse>> {
    return this.makeRequest(
      `${EDGE_FUNCTION_ENDPOINTS.PAYMENT_PROCESSING}/create-payment-intent`,
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );
  }

  async getPaymentHistory(
    userId?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<ApiResponse<{ payments: PaymentIntent[] }>> {
    const params = new URLSearchParams();
    if (userId) params.append("user_id", userId);
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());

    return this.makeRequest(
      `${EDGE_FUNCTION_ENDPOINTS.PAYMENT_PROCESSING}/payments?${params}`
    );
  }

  async processRefund(
    paymentId: string,
    refund: RefundRequest
  ): Promise<ApiResponse<RefundResponse>> {
    return this.makeRequest(
      `${EDGE_FUNCTION_ENDPOINTS.PAYMENT_PROCESSING}/refund/${paymentId}`,
      {
        method: "POST",
        body: JSON.stringify(refund),
      }
    );
  }

  // Notifications API
  async sendNotification(
    notification: SendNotificationRequest
  ): Promise<ApiResponse<{ notification: NotificationPayload }>> {
    return this.makeRequest(`${EDGE_FUNCTION_ENDPOINTS.NOTIFICATIONS}/send`, {
      method: "POST",
      body: JSON.stringify({
        recipient_id: notification.recipientId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        priority: notification.priority,
        scheduled_at: notification.scheduledAt,
      }),
    });
  }

  async sendBulkNotifications(
    request: BulkNotificationRequest
  ): Promise<ApiResponse<BulkNotificationResponse>> {
    return this.makeRequest(
      `${EDGE_FUNCTION_ENDPOINTS.NOTIFICATIONS}/bulk-send`,
      {
        method: "POST",
        body: JSON.stringify({
          user_ids: request.userIds,
          type: request.type,
          title: request.title,
          message: request.message,
          data: request.data,
          priority: request.priority,
        }),
      }
    );
  }

  async getNotifications(
    userId?: string,
    limit: number = 50,
    offset: number = 0,
    unreadOnly: boolean = false
  ): Promise<ApiResponse<{ notifications: NotificationPayload[] }>> {
    const params = new URLSearchParams();
    if (userId) params.append("user_id", userId);
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());
    if (unreadOnly) params.append("unread_only", "true");

    return this.makeRequest(
      `${EDGE_FUNCTION_ENDPOINTS.NOTIFICATIONS}/notifications?${params}`
    );
  }

  async markNotificationAsRead(
    notificationId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return this.makeRequest(
      `${EDGE_FUNCTION_ENDPOINTS.NOTIFICATIONS}/mark-read/${notificationId}`,
      {
        method: "PUT",
      }
    );
  }

  // Admin Operations API (Admin only)
  async getSystemStats(): Promise<ApiResponse<{ stats: SystemStats }>> {
    return this.makeRequest(
      `${EDGE_FUNCTION_ENDPOINTS.ADMIN_OPERATIONS}/stats`
    );
  }

  async getAllUsers(
    limit: number = 50,
    offset: number = 0,
    role?: string,
    isActive?: boolean
  ): Promise<ApiResponse<{ users: User[] }>> {
    const params = new URLSearchParams();
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());
    if (role) params.append("role", role);
    if (isActive !== undefined) params.append("is_active", isActive.toString());

    return this.makeRequest(
      `${EDGE_FUNCTION_ENDPOINTS.ADMIN_OPERATIONS}/users?${params}`
    );
  }

  async updateUserStatus(
    userId: string,
    updates: UserUpdate
  ): Promise<ApiResponse<{ success: boolean }>> {
    return this.makeRequest(
      `${EDGE_FUNCTION_ENDPOINTS.ADMIN_OPERATIONS}/users/${userId}/update`,
      {
        method: "PUT",
        body: JSON.stringify(updates),
      }
    );
  }

  async getAuditLogs(
    limit: number = 100,
    offset: number = 0,
    userId?: string,
    action?: string,
    resourceType?: string
  ): Promise<ApiResponse<{ auditLogs: AuditLog[] }>> {
    const params = new URLSearchParams();
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());
    if (userId) params.append("user_id", userId);
    if (action) params.append("action", action);
    if (resourceType) params.append("resource_type", resourceType);

    return this.makeRequest(
      `${EDGE_FUNCTION_ENDPOINTS.ADMIN_OPERATIONS}/audit-logs?${params}`
    );
  }

  async generateSystemReport(
    request: GenerateReportRequest
  ): Promise<ApiResponse<{ report: SystemReport }>> {
    return this.makeRequest(
      `${EDGE_FUNCTION_ENDPOINTS.ADMIN_OPERATIONS}/reports/generate`,
      {
        method: "POST",
        body: JSON.stringify({
          start_date: request.startDate,
          end_date: request.endDate,
        }),
      }
    );
  }
}

// Singleton instance
let edgeFunctionsClient: EdgeFunctionsClient | null = null;

export function getEdgeFunctionsClient(): EdgeFunctionsClient {
  if (!edgeFunctionsClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase configuration is missing");
    }

    edgeFunctionsClient = new EdgeFunctionsClient(supabaseUrl, supabaseAnonKey);
  }

  return edgeFunctionsClient;
}

// Export singleton instance for convenience
export const edgeAPI = {
  get client() {
    return getEdgeFunctionsClient();
  },
};
