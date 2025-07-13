// File: kobklein/web/src/hooks/useAuth.ts

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { UserRole } from "@/lib/types";
import { 
  logoutUser, 
  hasRole, 
  isAdmin, 
  canAccessMerchantFeatures,
  canAccessDistributorFeatures,
  canAccessDiasporaFeatures,
  getDashboardRoute
} from "@/lib/auth";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session?.user;
  const userRole = user?.role as UserRole;
  const isLoading = status === "loading";
  const isAuthenticated = !!session && status === "authenticated";

  // Role checking functions
  const checkRole = useCallback((allowedRoles: UserRole[]) => {
    if (!userRole) return false;
    return hasRole(userRole, allowedRoles);
  }, [userRole]);

  const checkAdmin = useCallback(() => {
    if (!userRole) return false;
    return isAdmin(userRole);
  }, [userRole]);

  const checkMerchantAccess = useCallback(() => {
    if (!userRole) return false;
    return canAccessMerchantFeatures(userRole);
  }, [userRole]);

  const checkDistributorAccess = useCallback(() => {
    if (!userRole) return false;
    return canAccessDistributorFeatures(userRole);
  }, [userRole]);

  const checkDiasporaAccess = useCallback(() => {
    if (!userRole) return false;
    return canAccessDiasporaFeatures(userRole);
  }, [userRole]);

  // Navigation functions
  const redirectToDashboard = useCallback(() => {
    if (userRole) {
      const dashboardUrl = getDashboardRoute(userRole);
      router.push(dashboardUrl);
    }
  }, [userRole, router]);

  const redirectToLogin = useCallback((callbackUrl?: string) => {
    const loginUrl = callbackUrl 
      ? `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : '/auth/login';
    router.push(loginUrl);
  }, [router]);

  const logout = useCallback(async () => {
    await logoutUser();
  }, []);

  // Require authentication hook
  const requireAuth = useCallback((allowedRoles?: UserRole[]) => {
    if (!isAuthenticated) {
      redirectToLogin();
      return false;
    }

    if (allowedRoles && !checkRole(allowedRoles)) {
      redirectToDashboard();
      return false;
    }

    return true;
  }, [isAuthenticated, checkRole, redirectToLogin, redirectToDashboard]);

  return {
    // Session data
    user,
    userRole,
    isLoading,
    isAuthenticated,
    
    // Role checking
    hasRole: checkRole,
    isAdmin: checkAdmin,
    canAccessMerchant: checkMerchantAccess,
    canAccessDistributor: checkDistributorAccess,
    canAccessDiaspora: checkDiasporaAccess,
    
    // Navigation
    redirectToDashboard,
    redirectToLogin,
    logout,
    requireAuth,
  };
}