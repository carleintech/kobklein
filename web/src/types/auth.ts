// KobKlein User Role System
export enum UserRole {
  INDIVIDUAL = "individual", // Individual users (previously CLIENT)
  MERCHANT = "merchant", // Businesses accepting payments
  DISTRIBUTOR = "distributor", // Card distribution partners
  DIASPORA = "diaspora", // International remittance users
  ADMIN = "admin", // Platform administrators (not available for public signup)
}

export interface UserProfile {
  uid: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;

  // Location data
  country?: string;
  countryCode?: string;
  region?: string;
  timezone?: string;
  ipAddress?: string;

  // Role-specific fields
  businessName?: string; // For merchants and distributors
  legalBusinessName?: string; // For distributors
  businessRegistrationNumber?: string; // For distributors
  businessAddress?: string; // For distributors
  businessId?: string; // For merchants and distributors
  cardNumber?: string; // For individuals
  distributorTerritory?: string; // For distributors
  remittanceCountry?: string; // For diaspora users

  // Account status
  isActive: boolean;
  isVerified: boolean;
  kycStatus: "pending" | "approved" | "rejected";

  // Preferences
  language: "en" | "fr" | "ht" | "es"; // English, French, Haitian Kreyòl, Spanish
  currency: "HTG" | "USD" | "EUR"; // Haitian Gourde, US Dollar, Euro
}

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: Partial<UserProfile>, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Route permissions for role-based access
export const RolePermissions = {
  [UserRole.INDIVIDUAL]: {
    routes: ["/dashboard/individual", "/cards", "/payments", "/history"],
    label: "Individual Dashboard",
  },
  [UserRole.MERCHANT]: {
    routes: ["/dashboard/merchant", "/pos", "/sales", "/analytics"],
    label: "Merchant Portal",
  },
  [UserRole.DISTRIBUTOR]: {
    routes: ["/dashboard/distributor", "/inventory", "/cards", "/territories"],
    label: "Distributor Hub",
  },
  [UserRole.DIASPORA]: {
    routes: ["/dashboard/diaspora", "/remittance", "/recipients", "/rates"],
    label: "Diaspora Connect",
  },
  [UserRole.ADMIN]: {
    routes: ["/dashboard/admin", "/users", "/system", "/reports"],
    label: "Admin Console",
  },
};

// Phone validation patterns for different countries
export const PHONE_PATTERNS = {
  HT: {
    regex: /^\+?509\s?[1-9]\d{7}$/,
    prefix: "+509",
    placeholder: "+509 1234 5678",
    example: "+509 3456 7890",
  },
  US: {
    regex: /^\+?1\s?\d{10}$/,
    prefix: "+1",
    placeholder: "+1 5551234567",
    example: "+1 5551234567",
  },
  INTERNATIONAL: {
    regex: /^\+[1-9]\d{1,14}$/,
    prefix: "+",
    placeholder: "+XX XXXXXXXXXX",
    example: "+33 612345678",
  },
};

// Haiti-specific validation - More flexible for different user types (kept for backward compatibility)
export const HAITI_PHONE_REGEX = /^\+?509\s?[1-9]\d{7}$/;
export const HAITI_PHONE_PREFIX = "+509";
