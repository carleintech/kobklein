// File: kobklein/web/src/lib/constants.ts

// ===== ROUTE CONSTANTS =====
export const ROUTES = {
  public: {
    home: "/",
    about: "/about",
    contact: "/contact",
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    verifyEmail: "/auth/verify-email",
    resetPassword: "/auth/reset-password",
    welcome: "/auth/welcome",
    error: "/auth/error",
    unauthorized: "/unauthorized",
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

// ===== CURRENCY CONSTANTS =====
export const CURRENCIES = {
  HTG: {
    symbol: "HTG",
    name: "Haitian Gourde",
    code: "HTG",
    symbol_native: "G",
    decimal_digits: 2,
  },
  USD: {
    symbol: "$",
    name: "US Dollar", 
    code: "USD",
    symbol_native: "$",
    decimal_digits: 2,
  },
} as const;

// ===== APP CONSTANTS =====
export const APP_CONFIG = {
  name: "KobKlein",
  description: "Cashless Payment Platform for Haiti",
  version: "1.0.0",
  supportEmail: "support@kobklein.com",
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp"],
} as const;

// ===== VALIDATION CONSTANTS =====
export const VALIDATION = {
  phone: {
    haiti: /^(\+509|509)?[2-9]\d{7}$/,
    us: /^(\+1)?[0-9]{10}$/,
    international: /^\+[1-9]\d{1,14}$/,
  },
  amounts: {
    min: 1, // 1 HTG minimum
    max: 1000000, // 1M HTG maximum
  },
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