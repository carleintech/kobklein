"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { RolePermissions, UserRole } from "@/types/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export default function SupabaseProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/auth/signin",
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // Check role-based access
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on user role
        const userPermissions = RolePermissions[user.role];
        if (userPermissions && userPermissions.routes.length > 0) {
          const defaultRoute = userPermissions.routes[0];
          router.push(defaultRoute);
        } else {
          router.push("/dashboard/client"); // fallback
        }
        return;
      }

      // Check if current path is allowed for user role
      const userPermissions = RolePermissions[user.role];
      if (userPermissions) {
        const isAllowedPath = userPermissions.routes.some((route) =>
          pathname.startsWith(route)
        );

        if (!isAllowedPath && pathname.startsWith("/dashboard")) {
          // Redirect to user's default dashboard
          const defaultRoute = userPermissions.routes[0];
          router.push(defaultRoute);
          return;
        }
      }
    }
  }, [user, loading, allowedRoles, pathname, router, redirectTo]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  // Check role authorization
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600">
            You don&apos;t have permission to access this page.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

