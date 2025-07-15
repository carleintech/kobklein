// File: kobklein/web/src/lib/auth.ts
import { signIn, signOut, getSession } from "next-auth/react";
import { hash, compare } from "bcryptjs";
import type { 
  RegisterFormData, 
  LoginFormData, 
  ForgotPasswordFormData,
  ResetPasswordFormData 
} from "./validators";

// ===== MOCK DATA FOR DEVELOPMENT =====
// In production, this would come from your database

const MOCK_USERS: any[] = [
  {
    id: "user_1",
    email: "admin@kobklein.com",
    firstName: "Admin",
    lastName: "User",
    phone: "+509 1234 5678",
    role: "admin",
    location: "Port-au-Prince",
    passwordHash: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewHiJxer/YmZAiAm", // password: "admin123"
    isVerified: true,
    businessName: null,
    region: "Ouest",
    permissions: ["*"],
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "user_2", 
    email: "client@kobklein.com",
    firstName: "Jean",
    lastName: "Baptiste",
    phone: "+509 2345 6789",
    role: "client",
    location: "Port-au-Prince",
    passwordHash: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewHiJxer/YmZAiAm", // password: "client123"
    isVerified: true,
    businessName: null,
    region: "Ouest",
    permissions: ["wallet:read", "transaction:create"],
    createdAt: new Date("2024-01-02"),
  },
  {
    id: "user_3",
    email: "merchant@kobklein.com", 
    firstName: "Marie",
    lastName: "Dupont",
    phone: "+509 3456 7890",
    role: "merchant",
    location: "Cap-Haïtien",
    passwordHash: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewHiJxer/YmZAiAm", // password: "merchant123"
    isVerified: true,
    businessName: "Marie's Boutique",
    businessType: "Retail Store",
    region: "Nord",
    permissions: ["wallet:read", "transaction:create", "transaction:receive", "business:manage"],
    createdAt: new Date("2024-01-03"),
  },
  {
    id: "user_4",
    email: "distributor@kobklein.com",
    firstName: "Pierre",
    lastName: "Moïse",
    phone: "+509 4567 8901",
    role: "distributor",
    location: "Jacmel",
    passwordHash: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewHiJxer/YmZAiAm", // password: "distributor123"
    isVerified: true,
    businessName: null,
    region: "Sud-Est",
    permissions: ["wallet:read", "transaction:create", "user:onboard", "refill:process"],
    createdAt: new Date("2024-01-04"),
  },
  {
    id: "user_5",
    email: "diaspora@kobklein.com",
    firstName: "Anne",
    lastName: "Joseph",
    phone: "+1 305 123 4567",
    role: "diaspora",
    location: "Miami, FL",
    currentCountry: "US",
    passwordHash: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewHiJxer/YmZAiAm", // password: "diaspora123"
    isVerified: true,
    businessName: null,
    region: null,
    permissions: ["wallet:read", "remittance:send", "beneficiary:manage"],
    createdAt: new Date("2024-01-05"),
  },
];

// ===== MOCK AUTHENTICATION FUNCTIONS =====

/**
 * Register a new user (Mock implementation)
 */
export async function registerUser(data: RegisterFormData) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if email already exists
    const existingUser = MOCK_USERS.find(user => user.email.toLowerCase() === data.email.toLowerCase());
    if (existingUser) {
      throw new Error("An account with this email already exists");
    }

    // Hash password
    const hashedPassword = await hash(data.password, 12);
    
    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      email: data.email.toLowerCase(),
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role,
      location: data.location,
      passwordHash: hashedPassword,
      businessName: data.businessName,
      businessType: data.businessType,
      currentCountry: data.currentCountry,
      region: data.region,
      acceptTerms: data.acceptTerms,
      acceptPrivacy: data.acceptPrivacy,
      acceptMarketing: data.acceptMarketing,
      isVerified: false, // Would be true after email verification
      createdAt: new Date(),
      permissions: getDefaultPermissions(data.role),
    };

    // Add to mock database
    MOCK_USERS.push(newUser);
    
    return {
      success: true,
      message: "Registration successful! Please check your email to verify your account.",
      userId: newUser.id,
    };
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error(error instanceof Error ? error.message : "Registration failed");
  }
}

/**
 * Login user with NextAuth
 */
export async function loginUser(data: LoginFormData) {
  try {
    const result = await signIn("credentials", {
      email: data.email.toLowerCase(),
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error("Invalid email or password");
    }

    return {
      success: true,
      message: "Login successful!",
    };
  } catch (error) {
    console.error("Login error:", error);
    throw new Error(error instanceof Error ? error.message : "Login failed");
  }
}

/**
 * Logout user
 */
export async function logoutUser() {
  try {
    await signOut({ redirect: false });
    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error("Logout failed");
  }
}

/**
 * Get current user session
 */
export async function getCurrentUser() {
  try {
    const session = await getSession();
    return session?.user || null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

/**
 * Send password reset email (Mock implementation)
 */
export async function sendPasswordReset(data: ForgotPasswordFormData) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = MOCK_USERS.find(user => user.email.toLowerCase() === data.email.toLowerCase());
    
    if (!user) {
      // Don't reveal if email exists for security
      return {
        success: true,
        message: "If an account with this email exists, you will receive a password reset link.",
      };
    }

    // In a real app, this would send an actual email
    console.log(`Mock: Password reset email sent to ${data.email}`);

    return {
      success: true,
      message: "Password reset email sent! Please check your inbox.",
    };
  } catch (error) {
    console.error("Password reset error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to send reset email");
  }
}

/**
 * Reset password with token (Mock implementation)
 */
export async function resetPassword(data: ResetPasswordFormData) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would validate the token here
    // For now, we'll just accept any token that's not empty
    if (!data.token) {
      throw new Error("Invalid reset token");
    }

    const hashedPassword = await hash(data.password, 12);
    
    // Update password in mock database
    // In reality, you'd find the user by the token
    console.log(`Mock: Password updated for token ${data.token}`);

    return {
      success: true,
      message: "Password reset successful! You can now login with your new password.",
    };
  } catch (error) {
    console.error("Password reset error:", error);
    throw new Error(error instanceof Error ? error.message : "Password reset failed");
  }
}

/**
 * Send email verification (Mock implementation)
 */
export async function sendVerificationEmail(email: string) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`Mock: Verification email sent to ${email}`);

    return {
      success: true,
      message: "Verification email sent!",
    };
  } catch (error) {
    console.error("Send verification error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to send verification email");
  }
}

/**
 * Verify email with token (Mock implementation)
 */
export async function verifyEmail(token: string) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock verification - accept any non-empty token
    if (!token || token === "invalid") {
      throw new Error("Invalid or expired verification token");
    }

    // In a real app, you'd update the user's isVerified status
    console.log(`Mock: Email verified with token ${token}`);

    return {
      success: true,
      message: "Email verified successfully!",
    };
  } catch (error) {
    console.error("Email verification error:", error);
    throw new Error(error instanceof Error ? error.message : "Email verification failed");
  }
}

/**
 * Check if email exists (Mock implementation)
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const user = MOCK_USERS.find(user => user.email.toLowerCase() === email.toLowerCase());
    return !!user;
  } catch (error) {
    console.error("Check email error:", error);
    return false;
  }
}

/**
 * Get user by email (Mock implementation)
 */
export async function getUserByEmail(email: string) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const user = MOCK_USERS.find(user => user.email.toLowerCase() === email.toLowerCase());
    return user || null;
  } catch (error) {
    console.error("Get user by email error:", error);
    return null;
  }
}

/**
 * Get user by ID (Mock implementation)
 */
export async function getUserById(id: string) {
  try {
    const user = MOCK_USERS.find(user => user.id === id);
    return user || null;
  } catch (error) {
    console.error("Get user by ID error:", error);
    return null;
  }
}

/**
 * Hash password
 */
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

/**
 * Compare password
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword);
}

// ===== UTILITY FUNCTIONS =====

/**
 * Get default permissions for a role
 */
function getDefaultPermissions(role: string): string[] {
  const rolePermissions: Record<string, string[]> = {
    client: ["wallet:read", "transaction:create", "profile:update"],
    merchant: ["wallet:read", "transaction:create", "transaction:receive", "profile:update", "business:manage"],
    distributor: ["wallet:read", "transaction:create", "user:onboard", "refill:process", "commission:view"],
    diaspora: ["wallet:read", "remittance:send", "beneficiary:manage", "profile:update"],
    admin: ["*"],
    super_admin: ["*"],
  };

  return rolePermissions[role] || [];
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

/**
 * Check if user has required permission
 */
export function hasPermission(userRole: string, permission: string): boolean {
  // Admin and super_admin have all permissions
  if (userRole === "admin" || userRole === "super_admin") {
    return true;
  }

  const permissions = getDefaultPermissions(userRole);
  return permissions.includes(permission) || permissions.includes("*");
}

/**
 * Get dashboard route for user role
 */
export function getDashboardRoute(role: string): string {
  const dashboardRoutes: Record<string, string> = {
    client: "/client/dashboard",
    merchant: "/merchant/dashboard",
    distributor: "/distributor/dashboard",
    diaspora: "/diaspora/dashboard",
    admin: "/admin/dashboard",
    super_admin: "/super-admin/dashboard",
    regional_manager: "/regional-manager/dashboard",
    support_agent: "/support-agent/dashboard",
  };

  return dashboardRoutes[role] || "/client/dashboard";
}