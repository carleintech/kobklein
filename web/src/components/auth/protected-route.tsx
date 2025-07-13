// File: kobklein/web/src/components/auth/protected-route.tsx

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { UserRole } from "@/lib/types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { getDashboardRoute } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireEmailVerification?: boolean;
  fallbackUrl?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles = [],
  requireEmailVerification = false,
  fallbackUrl,
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    // Check if user is authenticated
    if (!session?.user) {
      router.push('/auth/login');
      return;
    }

    const userRole = session.user.role as UserRole;
    
    // Check if email verification is required
    if (requireEmailVerification && !session.user.emailVerified) {
      setError("Please verify your email address to continue");
      setIsAuthorized(false);
      return;
    }

    // Check role permissions
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard instead of showing error
      const dashboardUrl = fallbackUrl || getDashboardRoute(userRole);
      router.push(dashboardUrl);
      return;
    }

    setIsAuthorized(true);
    setError(null);
  }, [session, status, router, allowedRoles, requireEmailVerification, fallbackUrl]);

  // Show loading while checking authentication
  if (status === "loading" || isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show error if not authorized
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <ErrorMessage
          variant="destructive"
          title="Access Denied"
          description={error || "You don't have permission to access this page"}
          action={{
            label: "Go to Dashboard",
            onClick: () => router.push(getDashboardRoute(session?.user?.role as UserRole)),
          }}
        />
      </div>
    );
  }

  return <>{children}</>;
}