// Edge Functions API Types for KobKlein Frontend Integration

export interface User {
  id: string;
  email: string;
  role: "CLIENT" | "MERCHANT" | "DISTRIBUTOR" | "DIASPORA" | "ADMIN";
  isActive: boolean;
  verificationStatus?: "PENDING" | "VERIFIED" | "REJECTED";
  kycStatus?: "PENDING" | "APPROVED" | "REJECTED";
  notificationPreferences?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  documents?: {
    idType?: string;
    idNumber?: string;
    idExpiry?: string;
  };
  preferences?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Wallet Management Types
export interface WalletBalance {
  userId: string;
  currency: string;
  balance: number;
  reservedBalance: number;
  lastUpdated: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER" | "PAYMENT" | "REFUND";
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  description?: string;
  referenceId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface TransferRequest {
  toUserId: string;
  amount: number;
  currency?: string;
  description?: string;
}

export interface TransferResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// Payment Processing Types
export interface PaymentIntent {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED" | "CANCELLED";
  stripePaymentIntentId?: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface CreatePaymentIntentResponse {
  paymentIntent: {
    id: string;
    clientSecret: string;
    amount: number;
    currency: string;
    status: string;
  };
}

export interface RefundRequest {
  amount?: number;
  reason?: string;
}

export interface RefundResponse {
  success: boolean;
  refund?: any;
  error?: string;
}

// Notifications Types
export interface NotificationPayload {
  id: string;
  userId: string;
  type: "EMAIL" | "SMS" | "PUSH" | "IN_APP";
  title: string;
  message: string;
  data?: Record<string, any>;
  status: "PENDING" | "SENT" | "DELIVERED" | "FAILED" | "READ";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  scheduledAt?: string;
  sentAt?: string;
  readAt?: string;
  createdAt: string;
}

export interface SendNotificationRequest {
  recipientId?: string;
  type: NotificationPayload["type"];
  title: string;
  message: string;
  data?: Record<string, any>;
  priority?: NotificationPayload["priority"];
  scheduledAt?: string;
}

export interface BulkNotificationRequest {
  userIds: string[];
  type: NotificationPayload["type"];
  title: string;
  message: string;
  data?: Record<string, any>;
  priority?: NotificationPayload["priority"];
}

export interface BulkNotificationResponse {
  success: boolean;
  sent: number;
  failed: number;
}

// Admin Operations Types
export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  totalVolume: number;
  pendingPayments: number;
  activeMerchants: number;
  totalRevenue: number;
}

export interface UserUpdate {
  role?: User["role"];
  isActive?: boolean;
  verificationStatus?: User["verificationStatus"];
  kycStatus?: User["kycStatus"];
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user?: {
    email: string;
    role: string;
  };
}

export interface SystemReport {
  period: {
    start: string;
    end: string;
  };
  userGrowth: {
    totalNewUsers: number;
    byRole: Record<string, number>;
  };
  transactionVolume: {
    totalTransactions: number;
    totalVolume: number;
    byType: Record<string, number>;
  };
  paymentStatistics: {
    totalPayments: number;
    successfulPayments: number;
    failedPayments: number;
    totalRevenue: number;
  };
}

export interface GenerateReportRequest {
  startDate: string;
  endDate: string;
}

// API Response Wrappers
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Edge Function Endpoints
export const EDGE_FUNCTION_ENDPOINTS = {
  USER_MANAGEMENT: "/user-management",
  WALLET_MANAGEMENT: "/wallet-management",
  PAYMENT_PROCESSING: "/payment-processing",
  NOTIFICATIONS: "/notifications",
  ADMIN_OPERATIONS: "/admin-operations",
} as const;

// API Error Types
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

export class EdgeFunctionError extends Error {
  public readonly code?: string;
  public readonly details?: Record<string, any>;
  public readonly status?: number;

  constructor(
    message: string,
    code?: string,
    details?: Record<string, any>,
    status?: number
  ) {
    super(message);
    this.name = "EdgeFunctionError";
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

// Utility Types
export type UserRole = User["role"];
export type TransactionType = WalletTransaction["type"];
export type TransactionStatus = WalletTransaction["status"];
export type PaymentStatus = PaymentIntent["status"];
export type NotificationType = NotificationPayload["type"];
export type NotificationStatus = NotificationPayload["status"];
export type NotificationPriority = NotificationPayload["priority"];
