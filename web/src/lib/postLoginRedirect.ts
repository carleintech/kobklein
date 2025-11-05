/**
 * Post-Login Redirect Helper
 * Determines the correct dashboard route based on user role
 */

import { UserRole } from "@/types/auth";

export function getDashboardPathForRole(
  role: UserRole | string,
  locale: string = "en"
): string {
  // Normalize locale
  const normalizedLocale = locale || "en";

  switch (role) {
    case UserRole.MERCHANT:
      return `/${normalizedLocale}/dashboard/merchant`;
    case UserRole.DISTRIBUTOR:
      return `/${normalizedLocale}/dashboard/distributor`;
    case UserRole.DIASPORA:
      return `/${normalizedLocale}/dashboard/diaspora`;
    case UserRole.ADMIN:
      return `/${normalizedLocale}/admin`;
    case UserRole.INDIVIDUAL:
    default:
      return `/${normalizedLocale}/dashboard/individual`;
  }
}

/**
 * Get the primary role from a user object
 */
export function getPrimaryRole(user: any): UserRole {
  // Check if user has a role or roles property
  if (user?.role) {
    return user.role as UserRole;
  }

  if (user?.roles && Array.isArray(user.roles) && user.roles.length > 0) {
    // Return the first role
    return user.roles[0] as UserRole;
  }

  // Default to INDIVIDUAL
  return UserRole.INDIVIDUAL;
}
