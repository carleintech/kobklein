// Form validation utilities for KobKlein

import { z } from 'zod';
import { VALIDATION_RULES } from './constants';
import { validatePhoneNumber } from './utils';

// ===== BASE VALIDATION SCHEMAS =====

// Email validation
const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(1, "Email is required");

// Password validation
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one lowercase letter, one uppercase letter, and one number"
  );

// Phone validation (Haitian format)
const phoneSchema = z
  .string()
  .regex(
    /^(\+509|509)?[2-9]\d{7}$/,
    "Please enter a valid Haitian phone number (e.g., +509 1234 5678)"
  );

// Name validation
const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes");

// ===== AUTHENTICATION SCHEMAS =====

// Login Schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
});

// Registration Schema
export const registerSchema = z.object({
  // Personal Information
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  
  // Role Selection
  role: z.enum(["client", "merchant", "distributor", "diaspora"], {
    required_error: "Please select your role",
  }),
  
  // Role-specific fields
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  region: z.string().optional(),
  
  // Diaspora-specific
  currentCountry: z.string().optional(),
  
  // Legal agreements
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
  acceptPrivacy: z.boolean().refine(val => val === true, {
    message: "You must accept the privacy policy",
  }),
  
  // Marketing consent (optional)
  acceptMarketing: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  // Merchant requires business name
  if (data.role === "merchant" && !data.businessName) {
    return false;
  }
  return true;
}, {
  message: "Business name is required for merchants",
  path: ["businessName"],
}).refine((data) => {
  // Diaspora requires current country
  if (data.role === "diaspora" && !data.currentCountry) {
    return false;
  }
  return true;
}, {
  message: "Current country is required for diaspora users",
  path: ["currentCountry"],
});

// Password Reset Schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Reset Password Schema
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Email Verification Schema
export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

// Change Password Schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Profile Update Schema
export const updateProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  location: z.string().min(1, "Location is required"),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
});

// ===== TYPE EXPORTS =====
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

// ===== ROLE DEFINITIONS =====
export const USER_ROLES = {
  client: {
    label: "Client",
    description: "Individual user for personal transactions",
    permissions: ["wallet:read", "transaction:create", "profile:update"],
  },
  merchant: {
    label: "Merchant",
    description: "Business owner accepting payments",
    permissions: ["wallet:read", "transaction:create", "transaction:receive", "profile:update", "business:manage"],
  },
  distributor: {
    label: "Distributor",
    description: "Community agent managing card distribution",
    permissions: ["wallet:read", "transaction:create", "user:onboard", "refill:process", "commission:view"],
  },
  diaspora: {
    label: "Diaspora",
    description: "Send money to family in Haiti",
    permissions: ["wallet:read", "remittance:send", "beneficiary:manage", "profile:update"],
  },
  admin: {
    label: "Administrator",
    description: "Platform administrator",
    permissions: ["*"],
  },
} as const;

// Country list for diaspora users
export const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "FR", name: "France" },
  { code: "DO", name: "Dominican Republic" },
  { code: "BR", name: "Brazil" },
  { code: "CL", name: "Chile" },
  { code: "MX", name: "Mexico" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "IT", name: "Italy" },
] as const;

// Business types for merchants
export const BUSINESS_TYPES = [
  "Restaurant/Food Service",
  "Retail Store",
  "Pharmacy",
  "Gas Station",
  "Market/Grocery",
  "Beauty Salon",
  "Mechanic/Auto Repair",
  "Electronics/Phone Repair",
  "Clothing Store",
  "Other",
] as const;

// Haitian regions for location
export const HAITIAN_REGIONS = [
  "Ouest (Port-au-Prince)",
  "Sud-Est (Jacmel)",
  "Nord (Cap-Haïtien)",
  "Nord-Est (Fort-Liberté)",
  "Nord-Ouest (Port-de-Paix)",
  "Artibonite (Gonaïves)",
  "Centre (Hinche)",
  "Sud (Les Cayes)",
  "Grand'Anse (Jérémie)",
  "Nippes (Miragoâne)",
] as const;