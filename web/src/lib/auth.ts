// File: kobklein/web/src/lib/auth.ts (complete updated version)

import { signIn, signOut } from "next-auth/react";
import type { RegisterFormData, LoginFormData } from "./validators";
import type { UserRole, UserProfile } from "./types";

// Auth API endpoints
const AUTH_API = {
  register: '/api/auth/register',
  verifyEmail: '/api/auth/verify-email',
  resendVerification: '/api/auth/resend-verification',
  resetPassword: '/api/auth/reset-password',
  updateProfile: '/api/auth/profile',
  getUserRole: '/api/auth/role',
} as const;

// Registration result type
export interface AuthResult {
  success: boolean;
  data?: any;
  error?: string;
}

// Register new user
export async function registerUser(data: RegisterFormData): Promise<AuthResult> {
  try {
    const response = await fetch(AUTH_API.register, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
        location: data.location,
        businessName: data.businessName,
        businessType: data.businessType,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Registration failed',
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'Network error. Please try again.',
    };
  }
}

// Login user
export async function loginUser(data: LoginFormData): Promise<AuthResult> {
  try {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      return {
        success: false,
        error: result.error === 'CredentialsSignin' 
          ? 'Invalid email or password' 
          : result.error,
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Login failed. Please try again.',
    };
  }
}

// Logout user
export async function logoutUser(): Promise<void> {
  try {
    await signOut({ callbackUrl: '/auth/login' });
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Get current user role
export async function getUserRole(): Promise<UserRole | null> {
  try {
    const response = await fetch(AUTH_API.getUserRole, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.role;
  } catch (error) {
    console.error('Get user role error:', error);
    return null;
  }
}

// Get user profile
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const response = await fetch(AUTH_API.updateProfile, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.profile;
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
}

// Verify email
export async function verifyEmail(token: string): Promise<AuthResult> {
  try {
    const response = await fetch(AUTH_API.verifyEmail, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Email verification failed',
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Email verification error:', error);
    return {
      success: false,
      error: 'Verification failed. Please try again.',
    };
  }
}

// Resend verification email
export async function resendVerificationEmail(email: string): Promise<AuthResult> {
  try {
    const response = await fetch(AUTH_API.resendVerification, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to resend verification email',
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Resend verification error:', error);
    return {
      success: false,
      error: 'Failed to resend email. Please try again.',
    };
  }
}

// Send password reset email
export async function sendPasswordResetEmail(email: string): Promise<AuthResult> {
  try {
    const response = await fetch(AUTH_API.resetPassword, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to send reset email',
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: 'Failed to send reset email. Please try again.',
    };
  }
}

// Reset password with token
export async function resetPassword(token: string, newPassword: string): Promise<AuthResult> {
  try {
    const response = await fetch(AUTH_API.resetPassword, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password: newPassword }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Password reset failed',
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: 'Password reset failed. Please try again.',
    };
  }
}

// Update user profile
export async function updateUserProfile(data: Partial<UserProfile>): Promise<AuthResult> {
  try {
    const response = await fetch(AUTH_API.updateProfile, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Profile update failed',
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      error: 'Profile update failed. Please try again.',
    };
  }
}

// Check if user has required role
export function hasRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

// Check if user has admin privileges
export function isAdmin(userRole: UserRole): boolean {
  return ['admin', 'super_admin'].includes(userRole);
}

// Check if user can access merchant features
export function canAccessMerchantFeatures(userRole: UserRole): boolean {
  return ['merchant', 'distributor', 'admin', 'super_admin'].includes(userRole);
}

// Check if user can access distributor features  
export function canAccessDistributorFeatures(userRole: UserRole): boolean {
  return ['distributor', 'admin', 'super_admin'].includes(userRole);
}

// Check if user can access diaspora features
export function canAccessDiasporaFeatures(userRole: UserRole): boolean {
  return ['diaspora', 'admin', 'super_admin'].includes(userRole);
}

// Get dashboard route for user role
export function getDashboardRoute(userRole: UserRole): string {
  switch (userRole) {
    case 'client':
      return '/client/dashboard';
    case 'merchant':
      return '/merchant/dashboard';
    case 'distributor':
      return '/distributor/dashboard';
    case 'diaspora':
      return '/diaspora/dashboard';
    case 'admin':
      return '/admin/dashboard';
    case 'super_admin':
      return '/admin/dashboard';
    case 'regional_manager':
      return '/admin/regional';
    case 'support_agent':
      return '/admin/support';
    default:
      return '/client/dashboard';
  }
}

// Validate session and redirect if needed
export async function validateSessionAndRedirect(): Promise<{
  isValid: boolean;
  redirectTo?: string;
  userRole?: UserRole;
}> {
  try {
    const userRole = await getUserRole();
    
    if (!userRole) {
      return {
        isValid: false,
        redirectTo: '/auth/login',
      };
    }

    return {
      isValid: true,
      userRole,
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return {
      isValid: false,
      redirectTo: '/auth/login',
    };
  }
}