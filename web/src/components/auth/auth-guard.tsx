/ File: kobklein/web/src/components/auth/auth-guard.tsx

"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import type { UserRole } from "@/lib/types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireEmailVerification?: boolean;
  redirectOnUnauthorized?: boolean;
}

export function AuthGuard({
  children,
  allowedRoles,
  requireEmailVerification = false,
  redirectOnUnauthorized = true,
}: AuthGuardProps) {
  const { 
    isAuthenticated, 
    isLoading, 
    hasRole, 
    user, 
    redirectToLogin, 
    redirectToDashboard 
  } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      if (redirectOnUnauthorized) {
        redirectToLogin(window.location.pathname);
      }
      return;
    }

    // Check email verification
    if (requireEmailVerification && !user?.emailVerified) {
      // Could redirect to email verification page
      return;
    }

    // Check role permissions
    if (allowedRoles && !hasRole(allowedRoles)) {
      if (redirectOnUnauthorized) {
        redirectToDashboard();
      }
      return;
    }
  }, [
    isLoading,
    isAuthenticated,
    user?.emailVerified,
    hasRole,
    allowedRoles,
    requireEmailVerification,
    redirectOnUnauthorized,
    redirectToLogin,
    redirectToDashboard,
  ]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Don't render if not authenticated/authorized and redirect is enabled
  if (redirectOnUnauthorized) {
    if (!isAuthenticated) return null;
    if (requireEmailVerification && !user?.emailVerified) return null;
    if (allowedRoles && !hasRole(allowedRoles)) return null;
  }

  return <>{children}</>;
}