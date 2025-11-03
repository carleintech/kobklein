/**
 * Database Types for KobKlein Platform
 * Auto-generated from Supabase schema
 */

// User and Authentication Types
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  SUPPORT = 'SUPPORT',
  COMPLIANCE = 'COMPLIANCE',
  MERCHANT = 'MERCHANT',
  AGENT = 'AGENT',
  CLIENT = 'CLIENT',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED',
  PENDING = 'PENDING',
}

export enum KycStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export enum KycTier {
  TIER_0 = 'TIER_0', // Basic account, limited functionality
  TIER_1 = 'TIER_1', // Basic KYC, increased limits
  TIER_2 = 'TIER_2', // Enhanced KYC, full functionality
  TIER_3 = 'TIER_3', // Premium KYC, highest limits
}

// Financial Types
export enum CurrencyCode {
  HTG = 'HTG', // Haitian Gourde
  USD = 'USD', // US Dollar
  EUR = 'EUR', // Euro
  CAD = 'CAD', // Canadian Dollar
}

export enum WalletStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  FROZEN = 'FROZEN',
  CLOSED = 'CLOSED',
}

export enum WalletType {
  PRIMARY = 'PRIMARY',
  SAVINGS = 'SAVINGS',
  BUSINESS = 'BUSINESS',
  ESCROW = 'ESCROW',
  MERCHANT = 'MERCHANT',
  AGENT = 'AGENT',
}

export enum WalletTransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  PAYMENT_CREDIT = 'PAYMENT_CREDIT',
  PAYMENT_DEBIT = 'PAYMENT_DEBIT',
  FEE_DEBIT = 'FEE_DEBIT',
  CASHBACK_CREDIT = 'CASHBACK_CREDIT',
  REFUND_CREDIT = 'REFUND_CREDIT',
  FREEZE = 'FREEZE',
  UNFREEZE = 'UNFREEZE',
  CURRENCY_EXCHANGE = 'CURRENCY_EXCHANGE',
  INTEREST_CREDIT = 'INTEREST_CREDIT',
}

export enum TransferStatus {
  INITIATED = 'INITIATED',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED',
}

export enum TransferType {
  P2P = 'P2P', // Person to Person
  B2C = 'B2C', // Business to Consumer
  C2B = 'C2B', // Consumer to Business
  REMITTANCE = 'REMITTANCE', // International remittance
  CASHOUT = 'CASHOUT', // Wallet to cash
  CASHIN = 'CASHIN', // Cash to wallet
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  FEE = 'FEE',
  CASHBACK = 'CASHBACK',
  TOP_UP = 'TOP_UP',
  CASH_OUT = 'CASH_OUT',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  INITIATED = 'INITIATED',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  DISPUTED = 'DISPUTED',
  CHARGEBACK = 'CHARGEBACK',
}

export enum PaymentProcessor {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  DIGICEL = 'DIGICEL',
  NATCOM = 'NATCOM',
  MONCASH = 'MONCASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  INTERNAL = 'INTERNAL',
  CRYPTO = 'CRYPTO',
}

export enum FraudRiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum WebhookStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED',
  IGNORED = 'IGNORED',
  RETRY = 'RETRY',
}

export enum PaymentMethod {
  WALLET = 'WALLET',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  MOBILE_MONEY = 'MOBILE_MONEY',
  DIGICEL_MONEY = 'DIGICEL_MONEY',
  NATCOM_MONEY = 'NATCOM_MONEY',
  MONCASH = 'MONCASH',
  BANK_CARD = 'BANK_CARD',
  ACH_TRANSFER = 'ACH_TRANSFER',
  WIRE_TRANSFER = 'WIRE_TRANSFER',
  PAYPAL = 'PAYPAL',
  APPLE_PAY = 'APPLE_PAY',
  GOOGLE_PAY = 'GOOGLE_PAY',
  CASH = 'CASH',
  QR_CODE = 'QR_CODE',
  NFC = 'NFC',
  CRYPTOCURRENCY = 'CRYPTOCURRENCY',
  REMITTANCE = 'REMITTANCE',
}

// Business Types
export enum BusinessType {
  RESTAURANT = 'RESTAURANT',
  RETAIL = 'RETAIL',
  SERVICE = 'SERVICE',
  GROCERY = 'GROCERY',
  PHARMACY = 'PHARMACY',
  GAS_STATION = 'GAS_STATION',
  HOTEL = 'HOTEL',
  TRANSPORT = 'TRANSPORT',
  EDUCATION = 'EDUCATION',
  HEALTHCARE = 'HEALTHCARE',
  OTHER = 'OTHER',
}

export enum BusinessStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  REJECTED = 'REJECTED',
}

// Audit and System Types
export enum ActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  TRANSFER = 'TRANSFER',
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  SUSPEND = 'SUSPEND',
  ACTIVATE = 'ACTIVATE',
  ROLE_CHANGE = 'ROLE_CHANGE',
  KYC_UPDATE = 'KYC_UPDATE',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  SETTINGS_UPDATE = 'SETTINGS_UPDATE',
}

export enum AuditCategory {
  AUTH = 'AUTH',
  FINANCIAL = 'FINANCIAL',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  BUSINESS = 'BUSINESS',
  COMPLIANCE = 'COMPLIANCE',
  SYSTEM = 'SYSTEM',
  SECURITY = 'SECURITY',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  READ = 'READ',
}

export enum NotificationType {
  TRANSACTION = 'TRANSACTION',
  SECURITY = 'SECURITY',
  PROMOTIONAL = 'PROMOTIONAL',
  KYC = 'KYC',
  SYSTEM = 'SYSTEM',
  PAYMENT = 'PAYMENT',
}

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

// Interface Types for API Responses
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  country: string;
  preferredCurrency: CurrencyCode;
  status: UserStatus;
  roles: UserRole[];
  primaryRole: UserRole;
  kycStatus: KycStatus;
  kycTier: KycTier;
  wallets: UserWalletSummary[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UserWalletSummary {
  id: string;
  currency: CurrencyCode;
  balance: number;
  availableBalance: number;
  status: WalletStatus;
  type: WalletType;
  isPrimary: boolean;
}

export interface TransactionInfo {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: CurrencyCode;
  description?: string;
  fromWalletId?: string;
  toWalletId?: string;
  paymentMethod?: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessInfo {
  id: string;
  name: string;
  type: BusinessType;
  status: BusinessStatus;
  ownerId: string;
  address?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

// Enhanced Wallet Response Types
export interface WalletInfo {
  id: string;
  userId: string;
  currency: CurrencyCode;
  balance: number;
  availableBalance: number;
  frozenBalance: number;
  status: WalletStatus;
  walletType: WalletType;
  dailyLimit: number;
  monthlyLimit: number;
  isPrimary: boolean;
  lastTransactionAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransactionInfo {
  id: string;
  walletId: string;
  userId: string;
  transactionType: WalletTransactionType;
  amount: number;
  currency: CurrencyCode;
  balanceBefore: number;
  balanceAfter: number;
  description?: string;
  referenceId?: string;
  paymentId?: string;
  transferId?: string;
  externalReference?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface WalletTransferInfo {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  currency: CurrencyCode;
  exchangeRate?: number;
  feeAmount?: number;
  totalAmount: number;
  transferType: TransferType;
  status: TransferStatus;
  description?: string;
  referenceId: string;
  externalReference?: string;
  scheduledAt?: string;
  completedAt?: string;
  failedReason?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface WalletAnalytics {
  totalBalance: Record<CurrencyCode, number>;
  totalTransactions: number;
  transactionVolume: Record<CurrencyCode, number>;
  byTransactionType: Record<WalletTransactionType, { count: number; amount: number }>;
  byMonth: {
    month: string;
    transactions: number;
    volume: Record<CurrencyCode, number>;
    inflow: Record<CurrencyCode, number>;
    outflow: Record<CurrencyCode, number>;
  }[];
  transferStats: {
    totalSent: Record<CurrencyCode, number>;
    totalReceived: Record<CurrencyCode, number>;
    p2pCount: number;
    averageTransferAmount: Record<CurrencyCode, number>;
  };
  topTransactionTypes: {
    type: WalletTransactionType;
    count: number;
    amount: Record<CurrencyCode, number>;
  }[];
}

export interface CurrencyConversion {
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
  rateSource: string;
  rateTimestamp: string;
}

// Request/Response Types
export interface AuthResponse {
  user: UserProfile;
  token: string;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
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

// JWT Token Claims
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  roles: UserRole[];
  primaryRole: UserRole;
  status: UserStatus;
  kycStatus: KycStatus;
  kycTier: KycTier;
  primaryWalletId?: string;
  country: string;
  preferredCurrency: CurrencyCode;
  iat: number;
  exp: number;
}

// Database Table Types (for Supabase integration)
export interface DatabaseUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  country: string;
  preferred_currency: CurrencyCode;
  status: UserStatus;
  email_verified_at?: string;
  phone_verified_at?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseUserRole {
  id: string;
  user_id: string;
  role: UserRole;
  granted_by: string;
  granted_at: string;
  expires_at?: string;
  created_at: string;
}

export interface DatabaseWallet {
  id: string;
  user_id: string;
  currency: CurrencyCode;
  balance: string; // Stored as DECIMAL in database
  available_balance: string; // Balance minus frozen/held amounts
  frozen_balance: string; // Frozen/held funds
  status: WalletStatus;
  wallet_type: WalletType;
  daily_limit: string; // Daily transaction limit
  monthly_limit: string; // Monthly transaction limit
  is_primary: boolean; // Primary wallet for currency
  last_transaction_at?: string;
  created_at: string;
  updated_at: string;
}

// Enhanced Wallet Transaction Interface
export interface DatabaseWalletTransaction {
  id: string;
  wallet_id: string;
  user_id: string;
  transaction_type: WalletTransactionType;
  amount: string; // Stored as DECIMAL
  currency: CurrencyCode;
  balance_before: string;
  balance_after: string;
  description?: string;
  reference_id?: string;
  payment_id?: string; // Link to payment record
  transfer_id?: string; // Link to transfer record
  external_reference?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// P2P Transfer Interface
export interface DatabaseWalletTransfer {
  id: string;
  from_user_id: string;
  to_user_id: string;
  from_wallet_id: string;
  to_wallet_id: string;
  amount: string; // Stored as DECIMAL
  currency: CurrencyCode;
  exchange_rate?: string; // If currency conversion involved
  fee_amount?: string;
  total_amount: string; // Amount + fees
  transfer_type: TransferType;
  status: TransferStatus;
  description?: string;
  reference_id: string;
  external_reference?: string;
  scheduled_at?: string; // For scheduled transfers
  completed_at?: string;
  failed_reason?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Wallet Balance History for Analytics
export interface DatabaseWalletBalanceHistory {
  id: string;
  wallet_id: string;
  user_id: string;
  currency: CurrencyCode;
  balance: string;
  available_balance: string;
  frozen_balance: string;
  transaction_id?: string;
  snapshot_reason: string; // 'transaction', 'daily_snapshot', 'freeze', etc.
  created_at: string;
}

// Currency Exchange Rate
export interface DatabaseCurrencyRate {
  id: string;
  base_currency: CurrencyCode;
  target_currency: CurrencyCode;
  rate: string; // Exchange rate as DECIMAL
  source: string; // Rate source (e.g., 'central_bank', 'market', 'manual')
  valid_from: string;
  valid_until?: string;
  created_at: string;
  updated_at: string;
}

// Wallet Limit Configuration
export interface DatabaseWalletLimit {
  id: string;
  user_id: string;
  wallet_id?: string; // Null for user-level limits
  currency: CurrencyCode;
  limit_type: 'DAILY' | 'MONTHLY' | 'TRANSACTION' | 'BALANCE';
  limit_amount: string;
  used_amount: string;
  reset_period: string; // 'daily', 'monthly', 'never'
  last_reset_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseTransaction {
  id: string;
  from_wallet_id?: string;
  to_wallet_id?: string;
  from_user_id?: string;
  to_user_id?: string;
  amount: string; // Stored as DECIMAL in database
  currency: CurrencyCode;
  transaction_type: TransactionType;
  status: TransactionStatus;
  description?: string;
  payment_method?: PaymentMethod;
  reference_id?: string;
  wallet_transaction_id?: string; // Link to wallet transaction
  payment_id?: string; // Link to payment record
  transfer_id?: string; // Link to P2P transfer
  fee_amount?: string;
  exchange_rate?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Enhanced Payment System Interfaces
export interface DatabasePayment {
  id: string;
  user_id: string;
  processor: PaymentProcessor;
  processor_payment_id?: string;
  amount: string; // Stored as DECIMAL
  currency: CurrencyCode;
  status: PaymentStatus;
  payment_method: PaymentMethod;
  description?: string;
  reference_id: string;
  merchant_reference?: string;
  fraud_score?: number;
  risk_level: FraudRiskLevel;
  expires_at?: string;
  completed_at?: string;
  failed_reason?: string;
  processor_response?: Record<string, any>;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DatabasePaymentWebhook {
  id: string;
  payment_id?: string;
  processor: PaymentProcessor;
  webhook_id?: string;
  event_type: string;
  status: WebhookStatus;
  payload: Record<string, any>;
  headers?: Record<string, string>;
  signature?: string;
  processed_at?: string;
  retry_count: number;
  max_retries: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabasePaymentAudit {
  id: string;
  payment_id: string;
  user_id?: string;
  action: string;
  old_status?: PaymentStatus;
  new_status?: PaymentStatus;
  reason?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface DatabaseFraudCheck {
  id: string;
  payment_id: string;
  user_id: string;
  check_type: string;
  score: number;
  risk_level: FraudRiskLevel;
  rules_triggered: string[];
  details?: Record<string, any>;
  blocked: boolean;
  created_at: string;
}

// Payment Processing Response Types
export interface PaymentInfo {
  id: string;
  userId: string;
  processor: PaymentProcessor;
  processorPaymentId?: string;
  amount: number;
  currency: CurrencyCode;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  description?: string;
  referenceId: string;
  merchantReference?: string;
  fraudScore?: number;
  riskLevel: FraudRiskLevel;
  expiresAt?: string;
  completedAt?: string;
  failedReason?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentAnalytics {
  totalAmount: number;
  totalCount: number;
  successRate: number;
  averageAmount: number;
  byStatus: Record<PaymentStatus, { count: number; amount: number }>;
  byMethod: Record<PaymentMethod, { count: number; amount: number }>;
  byProcessor: Record<PaymentProcessor, { count: number; amount: number }>;
  fraudStats: {
    totalChecked: number;
    blocked: number;
    riskDistribution: Record<FraudRiskLevel, number>;
  };
  timeSeriesData?: {
    date: string;
    amount: number;
    count: number;
  }[];
}

export interface WebhookInfo {
  id: string;
  paymentId?: string;
  processor: PaymentProcessor;
  eventType: string;
  status: WebhookStatus;
  retryCount: number;
  processedAt?: string;
  errorMessage?: string;
  createdAt: string;
}