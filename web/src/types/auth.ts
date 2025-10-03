// KobKlein User Role System
export enum UserRole {
  CLIENT = "client", // Individual users with cards
  MERCHANT = "merchant", // Businesses accepting payments
  DISTRIBUTOR = "distributor", // Card distribution partners
  DIASPORA = "diaspora", // International remittance users
  ADMIN = "admin", // Platform administrators
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

  // Role-specific fields
  businessName?: string; // For merchants and distributors
  businessId?: string; // For merchants and distributors
  cardNumber?: string; // For clients
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
  [UserRole.CLIENT]: {
    routes: ["/dashboard/client", "/cards", "/payments", "/history"],
    label: "Client Dashboard",
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

// Haiti-specific validation - More flexible for different user types
export const HAITI_PHONE_REGEX =
  /^(\+?509\s?[1-9]\d{3}\s?\d{4}|[1-9]\d{7}|\+?509[1-9]\d{7})$/;
export const HAITI_PHONE_PREFIX = "+509";
