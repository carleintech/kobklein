// Form validation utilities for KobKlein

import { z } from "zod";
import { VALIDATION_RULES } from "./constants";
import { validatePhoneNumber } from "./utils";

// ===== BASE VALIDATORS =====
export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(1, "Email is required");

export const passwordSchema = z
  .string()
  .min(
    VALIDATION_RULES.password.minLength,
    `Password must be at least ${VALIDATION_RULES.password.minLength} characters`
  )
  .max(
    VALIDATION_RULES.password.maxLength,
    `Password must be no more than ${VALIDATION_RULES.password.maxLength} characters`
  )
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number");

export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .refine(
    (phone) => validatePhoneNumber(phone),
    "Please enter a valid phone number"
  );

export const amountSchema = z
  .number()
  .min(
    VALIDATION_RULES.amounts.min,
    `Minimum amount is ${VALIDATION_RULES.amounts.min} HTG`
  )
  .max(
    VALIDATION_RULES.amounts.max,
    `Maximum amount is ${VALIDATION_RULES.amounts.max} HTG`
  );

// ===== AUTH SCHEMAS =====
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["client", "merchant", "distributor", "diaspora"]),
    country: z.string().min(2, "Please select your country"),
    language: z.enum(["en", "fr", "ht", "es"]),
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, "You must agree to the terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// ===== TRANSACTION SCHEMAS =====
export const sendMoneySchema = z.object({
  recipientPhone: phoneSchema,
  amount: amountSchema,
  note: z.string().max(200, "Note must be less than 200 characters").optional(),
  pin: z
    .string()
    .min(4, "PIN must be at least 4 digits")
    .max(6, "PIN must be no more than 6 digits"),
});

export const refillSchema = z.object({
  amount: amountSchema,
  recipientPhone: phoneSchema.optional(),
  note: z.string().max(200, "Note must be less than 200 characters").optional(),
});

export const withdrawSchema = z.object({
  amount: amountSchema,
  distributorId: z.string().min(1, "Please select a distributor"),
  pin: z.string().min(4, "PIN must be at least 4 digits"),
});

// ===== PROFILE SCHEMAS =====
export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: phoneSchema,
  language: z.enum(["en", "fr", "ht", "es"]),
  country: z.string().min(2, "Please select your country"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const changePinSchema = z
  .object({
    currentPin: z.string().min(4, "Current PIN is required"),
    newPin: z
      .string()
      .min(4, "PIN must be at least 4 digits")
      .max(6, "PIN must be no more than 6 digits"),
    confirmPin: z.string().min(4, "Please confirm your new PIN"),
  })
  .refine((data) => data.newPin === data.confirmPin, {
    message: "PINs don't match",
    path: ["confirmPin"],
  });

// ===== MERCHANT SCHEMAS =====
export const merchantRegistrationSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  businessType: z.string().min(1, "Please select business type"),
  businessAddress: z
    .string()
    .min(10, "Please provide complete business address"),
  businessPhone: phoneSchema,
  merchantCategory: z.string().min(1, "Please select merchant category"),
});

export const merchantPayoutSchema = z.object({
  amount: amountSchema,
  distributorId: z.string().min(1, "Please select a distributor"),
  pin: z.string().min(4, "PIN is required"),
});

// ===== DISTRIBUTOR SCHEMAS =====
export const distributorOnboardingSchema = z.object({
  zone: z.string().min(1, "Please select your zone"),
  distributorLevel: z.enum(["basic", "premium", "gold"]),
  initialInventory: z.number().min(10, "Minimum inventory is 10 cards"),
});

export const cardActivationSchema = z.object({
  cardUID: z.string().min(8, "Invalid card UID"),
  clientPhone: phoneSchema,
  clientFirstName: z.string().min(2, "First name is required"),
  clientLastName: z.string().min(2, "Last name is required"),
  initialAmount: z
    .number()
    .min(0, "Initial amount cannot be negative")
    .optional(),
});

// ===== DIASPORA SCHEMAS =====
export const beneficiarySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: phoneSchema,
  relationship: z.string().min(1, "Please specify relationship"),
  walletId: z.string().min(1, "Wallet ID is required").optional(),
});

export const autoRefillSchema = z.object({
  isEnabled: z.boolean(),
  amount: amountSchema,
  frequency: z.enum(["weekly", "monthly"]),
  dayOfWeek: z.number().min(0).max(6).optional(),
  dayOfMonth: z.number().min(1).max(31).optional(),
  beneficiaryId: z.string().min(1, "Please select a beneficiary"),
});

// ===== ADMIN SCHEMAS =====
export const adminUserUpdateSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  isActive: z.boolean(),
  role: z.enum(["client", "merchant", "distributor", "diaspora", "admin"]),
  isVerified: z.boolean(),
});

export const systemConfigSchema = z.object({
  exchangeRate: z.number().positive("Exchange rate must be positive"),
  transactionFees: z.object({
    diasporaRefill: z.number().min(0, "Fee cannot be negative"),
    merchantPayout: z.number().min(0, "Fee cannot be negative"),
  }),
  systemMaintenance: z.boolean(),
});

// ===== EXPORT TYPES =====
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type SendMoneyFormData = z.infer<typeof sendMoneySchema>;
export type RefillFormData = z.infer<typeof refillSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type MerchantRegistrationFormData = z.infer<
  typeof merchantRegistrationSchema
>;
export type BeneficiaryFormData = z.infer<typeof beneficiarySchema>;
export type AutoRefillFormData = z.infer<typeof autoRefillSchema>;
