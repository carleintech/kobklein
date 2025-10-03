// KobKlein Core Type Definitions

// Re-export Edge Functions types for easier imports
export {
  EDGE_FUNCTION_ENDPOINTS,
  EdgeFunctionError,
  type AuditLog,
  type BulkNotificationRequest,
  type CreatePaymentIntentRequest,
  type CreatePaymentIntentResponse,
  type SystemStats as EdgeSystemStats,
  // Edge Functions API Types
  type User as EdgeUser,
  type UserProfile as EdgeUserProfile,
  type NotificationPayload,
  type PaymentIntent,
  type SendNotificationRequest,
  type SystemReport,
  type TransferRequest,
  type TransferResponse,
  type WalletBalance,
  type WalletTransaction,
} from "./edge-functions";

// ===== USER TYPES =====
export type UserRole =
  | "client"
  | "merchant"
  | "distributor"
  | "diaspora"
  | "admin"
  | "super_admin";

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  profileImage?: string;
  language: Locale;
  country: string;
  timezone: string;
}

export interface Client extends User {
  role: "client";
  cardId?: string;
  walletBalance: number;
  linkedDistributor?: string;
}

export interface Merchant extends User {
  role: "merchant";
  businessName: string;
  businessType: string;
  businessAddress: string;
  businessPhone: string;
  cardId: string;
  walletBalance: number;
  commissionRate: number;
  linkedDistributor: string;
  isApproved: boolean;
  merchantCategory: string;
}

export interface Distributor extends User {
  role: "distributor";
  zone: string;
  cardInventory: number;
  totalClientsOnboarded: number;
  totalMerchantsOnboarded: number;
  commissionBalance: number;
  isApproved: boolean;
  distributorLevel: "basic" | "premium" | "gold";
}

export interface Diaspora extends User {
  role: "diaspora";
  linkedPaymentMethods: PaymentMethod[];
  beneficiaries: Beneficiary[];
  totalSent: number;
  autoRefillSettings?: AutoRefillSettings;
}

export interface Admin extends User {
  role: "admin" | "super_admin";
  permissions: AdminPermission[];
  department: string;
}

// ===== TRANSACTION TYPES =====
export type TransactionType =
  | "send"
  | "receive"
  | "refill"
  | "withdraw"
  | "payment"
  | "commission";
export type TransactionStatus =
  | "pending"
  | "completed"
  | "failed"
  | "cancelled";
export type PaymentMethod =
  | "card"
  | "nfc"
  | "qr"
  | "apple_pay"
  | "google_pay"
  | "bank_transfer";

export interface Transaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  currency: "HTG" | "USD";
  type: TransactionType;
  status: TransactionStatus;
  method: PaymentMethod;
  description?: string;
  fee: number;
  reference: string;
  createdAt: Date;
  completedAt?: Date;
  metadata?: Record<string, any>;
}

// ===== WALLET TYPES =====
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: "HTG";
  isLocked: boolean;
  lastTransactionAt?: Date;
  createdAt: Date;
}

// ===== CARD TYPES =====
export type CardType = "client" | "merchant" | "distributor";
export type CardStatus = "active" | "inactive" | "blocked" | "expired";

export interface Card {
  id: string;
  uid: string; // NFC UID
  type: CardType;
  status: CardStatus;
  userId?: string;
  issuedBy: string; // distributor ID
  issuedAt: Date;
  activatedAt?: Date;
  expiresAt?: Date;
  lastUsedAt?: Date;
}

// ===== PAYMENT & REFILL TYPES =====
export interface Beneficiary {
  id: string;
  name: string;
  phone: string;
  walletId: string;
  relationship: string;
  isVerified: boolean;
  addedAt: Date;
}

export interface AutoRefillSettings {
  isEnabled: boolean;
  amount: number;
  frequency: "weekly" | "monthly";
  dayOfWeek?: number;
  dayOfMonth?: number;
  beneficiaryId: string;
  nextRefillDate: Date;
}

export interface RefillRequest {
  id: string;
  fromUserId: string; // diaspora
  toUserId: string; // client/merchant
  amount: number;
  status: "pending" | "approved" | "rejected" | "completed";
  requestedAt: Date;
  processedAt?: Date;
  processedBy?: string; // distributor ID
  note?: string;
}

// ===== BUSINESS TYPES =====
export interface BusinessMetrics {
  totalUsers: number;
  totalTransactions: number;
  totalVolume: number;
  activeCards: number;
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  averageTransactionValue: number;
  topMerchants: Merchant[];
  topDistributors: Distributor[];
}

// ===== UI & COMPONENT TYPES =====
export type Locale = "en" | "fr" | "ht" | "es";

export interface NavigationItem {
  key: string;
  href: string;
  icon?: React.ComponentType<any>;
  label: string;
  roles: UserRole[];
}

export interface DashboardCard {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "increase" | "decrease";
  icon: React.ComponentType<any>;
  color: "primary" | "accent" | "success" | "warning" | "error";
}

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "textarea"
    | "phone";
  placeholder?: string;
  required?: boolean;
  validation?: any;
  options?: { value: string; label: string }[];
}

// ===== API TYPES =====
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ===== AUTH TYPES =====
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  country: string;
  language: Locale;
}

// ===== ADMIN TYPES =====
export interface AdminPermission {
  resource: string;
  actions: ("create" | "read" | "update" | "delete")[];
}

export interface SystemStats {
  totalUsers: number;
  totalTransactions: number;
  totalVolume: number;
  todayVolume: number;
  activeIssues: number;
  systemStatus: "operational" | "degraded" | "down";
}

// ===== NOTIFICATION TYPES =====
export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
  actionUrl?: string;
}

// ===== EXPORT ALL =====
export * from "./api";
export * from "./components";
export * from "./forms";
