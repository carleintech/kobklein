// KobKlein Constants and Configuration

import type { Locale, UserRole } from "@/types";

// ===== APP CONSTANTS =====
export const APP_CONFIG = {
  name: "KobKlein",
  version: "1.0.0",
  description: "Bank-Free Payments. Powered by You.",
  url: "https://kobklein.com",
  supportEmail: "support@kobklein.com",
  supportPhone: "+1-555-KOBKLEIN",
} as const;

// ===== CURRENCY CONSTANTS =====
export const CURRENCIES = {
  HTG: {
    code: "HTG",
    symbol: "G",
    name: "Haitian Gourde",
    decimals: 2,
    exchangeRate: 132.5, // 1 USD = 132.50 HTG (example rate)
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    decimals: 2,
    exchangeRate: 1,
  },
} as const;

// ===== LOCALIZATION CONSTANTS =====
export const LOCALES: Record<
  Locale,
  { name: string; flag: string; rtl: boolean }
> = {
  en: { name: "English", flag: "🇺🇸", rtl: false },
  fr: { name: "Français", flag: "🇫🇷", rtl: false },
  ht: { name: "Kreyòl", flag: "🇭🇹", rtl: false },
  es: { name: "Español", flag: "🇪🇸", rtl: false },
};

export const DEFAULT_LOCALE: Locale = "en";

// ===== USER ROLE CONSTANTS =====
export const USER_ROLES: Record<
  UserRole,
  { name: string; color: string; permissions: string[] }
> = {
  client: {
    name: "Client",
    color: "blue",
    permissions: [
      "wallet:read",
      "wallet:send",
      "wallet:receive",
      "transactions:read",
    ],
  },
  merchant: {
    name: "Merchant",
    color: "green",
    permissions: [
      "wallet:read",
      "wallet:receive",
      "transactions:read",
      "pos:use",
      "payout:request",
    ],
  },
  distributor: {
    name: "Distributor",
    color: "purple",
    permissions: [
      "cards:issue",
      "refill:process",
      "users:onboard",
      "commission:view",
    ],
  },
  diaspora: {
    name: "Diaspora",
    color: "orange",
    permissions: [
      "refill:send",
      "beneficiaries:manage",
      "auto-refill:configure",
    ],
  },
  admin: {
    name: "Admin",
    color: "red",
    permissions: [
      "users:manage",
      "transactions:view",
      "reports:generate",
      "system:configure",
    ],
  },
  super_admin: {
    name: "Super Admin",
    color: "gray",
    permissions: ["*"], // All permissions
  },
};

// ===== TRANSACTION CONSTANTS =====
export const TRANSACTION_LIMITS = {
  client: {
    daily: 50000, // HTG
    monthly: 200000,
    perTransaction: 25000,
  },
  merchant: {
    daily: 500000,
    monthly: 2000000,
    perTransaction: 100000,
  },
  distributor: {
    daily: 1000000,
    monthly: 5000000,
    perTransaction: 500000,
  },
  diaspora: {
    daily: 150000, // HTG equivalent
    monthly: 600000,
    perTransaction: 50000,
  },
} as const;

export const TRANSACTION_FEES = {
  send: 0, // Free for local sends
  refill_local: 0, // Free from local distributors
  refill_diaspora: 264, // $2 USD = ~264 HTG
  withdraw: 0, // Free withdrawals
  pos_payment: 0, // Free POS payments
  merchant_payout: 0, // Free merchant payouts
} as const;

// ===== CARD CONSTANTS =====
export const CARD_PRICES = {
  client: 0, // Free basic card
  client_personalized: 1980, // $15 USD = ~1980 HTG
  merchant: 6600, // $50 USD = ~6600 HTG
  distributor: 9900, // $75 USD = ~9900 HTG (starter package)
} as const;

export const CARD_VALIDITY_YEARS = 3;

// ===== VALIDATION CONSTANTS =====
export const VALIDATION_RULES = {
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },
  phone: {
    haiti: /^(\+509|509)?[0-9]{8}$/,
    us: /^(\+1)?[0-9]{10}$/,
    international: /^\+[1-9]\d{1,14}$/,
  },
  amounts: {
    min: 1, // 1 HTG minimum
    max: 1000000, // 1M HTG maximum
  },
} as const;

// ===== ROUTE CONSTANTS =====
export const ROUTES = {
  public: {
    home: "/",
    about: "/about",
    contact: "/contact",
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
  },
  client: {
    dashboard: "/client/dashboard",
    transactions: "/client/transactions",
    pay: "/client/pay",
    receive: "/client/receive",
    settings: "/client/settings",
    help: "/client/help",
  },
  merchant: {
    dashboard: "/merchant/dashboard",
    transactions: "/merchant/transactions",
    receive: "/merchant/receive",
    refill: "/merchant/refill",
    products: "/merchant/products",
    settings: "/merchant/settings",
  },
  distributor: {
    dashboard: "/distributor/dashboard",
    refills: "/distributor/refills",
    addUser: "/distributor/add-user",
    commission: "/distributor/commission",
    zone: "/distributor/zone",
    settings: "/distributor/settings",
  },
  diaspora: {
    dashboard: "/diaspora/dashboard",
    recipients: "/diaspora/recipients",
    send: "/diaspora/send",
    history: "/diaspora/history",
    autoRefill: "/diaspora/auto-refill",
    settings: "/diaspora/settings",
  },
  admin: {
    dashboard: "/admin/dashboard",
    users: "/admin/users",
    transactions: "/admin/transactions",
    merchants: "/admin/merchants",
    distributors: "/admin/distributors",
    reports: "/admin/reports",
    settings: "/admin/settings",
  },
} as const;

// ===== API CONSTANTS =====
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
} as const;

// ===== ERROR MESSAGES =====
export const ERROR_MESSAGES = {
  network: "Network connection error. Please check your internet connection.",
  server: "Server error. Please try again later.",
  unauthorized: "You are not authorized to perform this action.",
  validation: "Please check your input and try again.",
  notFound: "The requested resource was not found.",
  timeout: "Request timed out. Please try again.",
  generic: "An unexpected error occurred. Please try again.",
} as const;

// ===== SUCCESS MESSAGES =====
export const SUCCESS_MESSAGES = {
  login: "Successfully logged in!",
  register: "Account created successfully!",
  transaction: "Transaction completed successfully!",
  refill: "Wallet refilled successfully!",
  profile: "Profile updated successfully!",
  cardActivated: "Card activated successfully!",
} as const;

// ===== DEVICE CONSTANTS =====
export const DEVICE_CONFIG = {
  mobile: {
    maxWidth: 768,
  },
  tablet: {
    minWidth: 769,
    maxWidth: 1024,
  },
  desktop: {
    minWidth: 1025,
  },
} as const;

// ===== FEATURE FLAGS =====
export const FEATURE_FLAGS = {
  enableOfflineMode: true,
  enableBiometricAuth: true,
  enableAutoRefill: true,
  enableMerchantProducts: false, // Coming soon
  enableVirtualCards: false, // Coming soon
  enableCryptoPayments: false, // Future feature
} as const;
