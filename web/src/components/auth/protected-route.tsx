// File: kobklein/web/src/components/auth/protected-route.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRoles = [],
  fallback,
}: ProtectedRouteProps) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isLoading) return;

    if (auth.isUnauthenticated) {
      router.push("/auth/login");
      return;
    }

    if (requiredRoles.length > 0 && !auth.checkRole(requiredRoles)) {
      // Redirect to appropriate dashboard based on user role
      auth.redirectToDashboard();
      return;
    }
  }, [auth, router, requiredRoles]);

  if (auth.isLoading) {
    return fallback || <LoadingSpinner />;
  }

  if (auth.isUnauthenticated) {
    return fallback || <LoadingSpinner />;
  }

  if (requiredRoles.length > 0 && !auth.checkRole(requiredRoles)) {
    return fallback || <LoadingSpinner />;
  }

  return <>{children}</>;
}