// File: kobklein/web/src/components/auth/auth-guard.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string | string[];
  requiredPermissions?: string | string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  requiredRoles,
  requiredPermissions,
  fallback,
  redirectTo = "/auth/login",
}: AuthGuardProps) {
  const auth = useAuth();

  useEffect(() => {
    // Redirect if not authenticated
    if (auth.isUnauthenticated) {
      auth.redirectToLogin();
      return;
    }

    // Check role requirements
    if (requiredRoles && !auth.checkRole(requiredRoles)) {
      auth.redirectToDashboard(); // Redirect to appropriate dashboard
      return;
    }

    // Check permission requirements
    if (requiredPermissions) {
      const permissions = Array.isArray(requiredPermissions) 
        ? requiredPermissions 
        : [requiredPermissions];
      
      const hasAllPermissions = permissions.every(permission => 
        auth.checkPermission(permission)
      );

      if (!hasAllPermissions) {
        auth.redirectToDashboard();
        return;
      }
    }
  }, [auth, requiredRoles, requiredPermissions]);

  // Show loading while checking authentication
  if (auth.isLoading) {
    return fallback || <LoadingSpinner />;
  }

  // Show fallback if not authenticated
  if (auth.isUnauthenticated) {
    return fallback || <LoadingSpinner />;
  }

  // Check role requirements
  if (requiredRoles && !auth.checkRole(requiredRoles)) {
    return fallback || <LoadingSpinner />;
  }

  // Check permission requirements
  if (requiredPermissions) {
    const permissions = Array.isArray(requiredPermissions) 
      ? requiredPermissions 
      : [requiredPermissions];
    
    const hasAllPermissions = permissions.every(permission => 
      auth.checkPermission(permission)
    );

    if (!hasAllPermissions) {
      return fallback || <LoadingSpinner />;
    }
  }

  return <>{children}</>;
}