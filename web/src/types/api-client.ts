/**
 * KobKlein API Client Configuration
 * Centralized API communication with TypeScript types and authentication
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface ApiRequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  requireAuth?: boolean;
  retries?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

// User-related types
export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role:
    | "client"
    | "merchant"
    | "distributor"
    | "diaspora"
    | "admin"
    | "super_admin"
    | "regional_manager"
    | "support_agent";
  status: "active" | "suspended" | "pending" | "blocked";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: {
    avatar?: string;
    address?: string;
    city?: string;
    country?: string;
    dateOfBirth?: string;
    idNumber?: string;
    isKycVerified?: boolean;
  };
  preferences?: {
    language: "en" | "fr" | "ht" | "es";
    currency: "HTG" | "USD";
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

// Wallet-related types
export interface Wallet {
  id: string;
  userId: string;
  balance: {
    htg: number;
    usd: number;
  };
  isActive: boolean;
  dailyLimit: {
    htg: number;
    usd: number;
  };
  monthlyLimit: {
    htg: number;
    usd: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Transaction-related types
export interface Transaction {
  id: string;
  type: "send" | "receive" | "refill" | "withdrawal" | "payment" | "refund";
  status: "pending" | "completed" | "failed" | "cancelled";
  amount: number;
  currency: "HTG" | "USD";
  fee: number;
  fromUserId?: string;
  toUserId?: string;
  description: string;
  reference: string;
  paymentMethod?: "nfc" | "qr_code" | "bank_transfer" | "cash" | "card";
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  fromUser?: Pick<User, "id" | "firstName" | "lastName" | "role">;
  toUser?: Pick<User, "id" | "firstName" | "lastName" | "role">;
}

// Payment-related types
export interface PaymentRequest {
  amount: number;
  currency: "HTG" | "USD";
  toUserId?: string;
  toPhone?: string;
  toEmail?: string;
  description: string;
  paymentMethod: "nfc" | "qr_code" | "bank_transfer";
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  transactionId: string;
  qrCode?: string;
  nfcData?: string;
  expiresAt?: string;
  status: "pending" | "processing" | "completed" | "failed";
}

// Merchant-related types
export interface MerchantStats {
  totalSales: {
    htg: number;
    usd: number;
  };
  dailySales: {
    htg: number;
    usd: number;
  };
  monthlySales: {
    htg: number;
    usd: number;
  };
  transactionCount: {
    today: number;
    month: number;
    total: number;
  };
  averageTransactionValue: {
    htg: number;
    usd: number;
  };
  commissionEarned: {
    htg: number;
    usd: number;
  };
  topCustomers: Array<{
    userId: string;
    name: string;
    totalSpent: number;
    currency: "HTG" | "USD";
  }>;
}

// Distributor-related types
export interface DistributorStats {
  territory: {
    name: string;
    activeUsers: number;
    totalUsers: number;
    merchants: number;
  };
  monthlyVolume: {
    htg: number;
    usd: number;
  };
  commission: {
    earned: number;
    pending: number;
    currency: "HTG" | "USD";
  };
  cardsSold: {
    total: number;
    active: number;
    thisMonth: number;
  };
  growth: {
    users: number;
    revenue: number;
    isPositive: boolean;
  };
}

// Card-related types
export interface KobKleinCard {
  id: string;
  uid: string;
  userId?: string;
  distributorId: string;
  status: "inactive" | "active" | "suspended" | "expired";
  isLinked: boolean;
  activatedAt?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: "transaction" | "security" | "system" | "promotion";
  title: string;
  message: string;
  isRead: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  metadata?: Record<string, any>;
  createdAt: string;
}

// Admin-related types
export interface SystemStats {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    byRole: Record<string, number>;
  };
  transactions: {
    total: number;
    volume: {
      htg: number;
      usd: number;
    };
    dailyAverage: number;
    successRate: number;
  };
  cards: {
    total: number;
    active: number;
    distributed: number;
    pending: number;
  };
  revenue: {
    total: {
      htg: number;
      usd: number;
    };
    fees: {
      htg: number;
      usd: number;
    };
    commissions: {
      htg: number;
      usd: number;
    };
  };
}

// API endpoint types
export interface ApiEndpoints {
  // Authentication
  auth: {
    login: "/auth/login";
    register: "/auth/register";
    refresh: "/auth/refresh";
    logout: "/auth/logout";
    verifyOtp: "/auth/verify-otp";
    resetPassword: "/auth/reset-password";
  };

  // Users
  users: {
    profile: "/users/profile";
    update: "/users/profile";
    preferences: "/users/preferences";
    kyc: "/users/kyc";
  };

  // Wallets
  wallets: {
    balance: "/wallets/balance";
    transactions: "/wallets/transactions";
    refill: "/wallets/refill";
    withdraw: "/wallets/withdraw";
    limits: "/wallets/limits";
  };

  // Payments
  payments: {
    send: "/payments/send";
    request: "/payments/request";
    process: "/payments/process";
    qr: "/payments/qr";
    nfc: "/payments/nfc";
    status: "/payments/status";
  };

  // Transactions
  transactions: {
    list: "/transactions";
    details: "/transactions/:id";
    history: "/transactions/history";
    export: "/transactions/export";
  };

  // Merchants
  merchants: {
    stats: "/merchants/stats";
    sales: "/merchants/sales";
    customers: "/merchants/customers";
    pos: "/merchants/pos";
  };

  // Distributors
  distributors: {
    stats: "/distributors/stats";
    territory: "/distributors/territory";
    cards: "/distributors/cards";
    users: "/distributors/users";
    commission: "/distributors/commission";
  };

  // Cards
  cards: {
    list: "/cards";
    activate: "/cards/activate";
    link: "/cards/link";
    status: "/cards/:id/status";
  };

  // Notifications
  notifications: {
    list: "/notifications";
    read: "/notifications/:id/read";
    markAllRead: "/notifications/read-all";
    preferences: "/notifications/preferences";
  };

  // Admin
  admin: {
    stats: "/admin/stats";
    users: "/admin/users";
    transactions: "/admin/transactions";
    system: "/admin/system";
    reports: "/admin/reports";
  };

  // WebSocket
  websocket: {
    connect: "/ws/connect";
    transactions: "/ws/transactions";
    notifications: "/ws/notifications";
  };
}

// Environment configuration
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  wsUrl: string;
  version: string;
}

// Request/Response interceptor types
export interface RequestInterceptor {
  onRequest?: (
    config: ApiRequestConfig
  ) => ApiRequestConfig | Promise<ApiRequestConfig>;
  onRequestError?: (error: any) => any;
}

export interface ResponseInterceptor {
  onResponse?: (response: ApiResponse) => ApiResponse | Promise<ApiResponse>;
  onResponseError?: (error: ApiError) => any;
}

// Pagination and filtering
export interface ListParams extends PaginationParams {
  search?: string;
  filters?: Record<string, any>;
  startDate?: string;
  endDate?: string;
}

export interface ListResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters?: Record<string, any>;
}

// WebSocket types
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
  id?: string;
}

export interface WebSocketConfig {
  url: string;
  protocols?: string[];
  reconnect?: boolean;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
}

// Cache types
export interface CacheConfig {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number;
  strategy?: "lru" | "fifo" | "lifo";
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Error handling
export class ApiClientError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}
