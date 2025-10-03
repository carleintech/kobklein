"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/AuthContext";
import { RolePermissions, UserRole } from "@/types/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/auth/signin",
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      // Not authenticated
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // Check role-based access
      if (allowedRoles && !allowedRoles.includes(user.role as any)) {
        // Redirect to appropriate dashboard based on user role
        const userPermissions =
          RolePermissions[user.role as keyof typeof RolePermissions];
        const defaultRoute = userPermissions?.routes[0] || "/dashboard";
        router.push(defaultRoute);
        return;
      }

      // Check if current path is allowed for user role
      const userPermissions =
        RolePermissions[user.role as keyof typeof RolePermissions];
      const isAllowedPath = userPermissions?.routes.some((route: string) =>
        pathname.startsWith(route)
      );

      if (!isAllowedPath && pathname.startsWith("/dashboard")) {
        // Redirect to user's default dashboard
        const defaultRoute = userPermissions?.routes[0] || "/dashboard";
        router.push(defaultRoute);
      }
    }
  }, [user, isLoading, allowedRoles, router, pathname, redirectTo]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show nothing while redirecting
  if (!user) {
    return null;
  }

  // Check role access
  if (allowedRoles && !allowedRoles.includes(user.role as any)) {
    return null;
  }

  return <>{children}</>;
}

// Higher-order component for easy role-based protection
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: UserRole[]
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute allowedRoles={allowedRoles}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

