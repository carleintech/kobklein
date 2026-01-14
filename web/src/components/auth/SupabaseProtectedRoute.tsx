"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { RolePermissions, UserRole } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export default function SupabaseProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/signin",
}: ProtectedRouteProps) {
  const { user, loading, hydrated } = useAuth();
  const router = useRouter();

  // Prevent infinite redirect loop
  const hasRedirected = useRef(false);

  // CRITICAL DEBUG - track auth state
  console.log('[SupabaseProtectedRoute] RENDER', {
    user: user ? { email: user.email, role: user.role } : null,
    loading,
    hydrated,
    hasRedirected: hasRedirected.current,
    pathname: typeof window !== 'undefined' ? window.location.pathname : 'SSR'
  });

  useEffect(() => {
    console.log('[SupabaseProtectedRoute] useEffect RUNNING', {
      hydrated,
      loading,
      hasRedirected: hasRedirected.current,
      userExists: !!user,
      userEmail: user?.email
    });

    // 🚫 Skip if not yet hydrated - wait for Supabase to finish initializing
    if (!hydrated) {
      console.log('[SupabaseProtectedRoute] useEffect SKIPPED - waiting for hydration');
      return;
    }

    // 🚫 Skip if already redirected
    if (hasRedirected.current) {
      console.log('[SupabaseProtectedRoute] useEffect SKIPPED - already redirected');
      return;
    }

    // Not authenticated - redirect to signin ONCE
    if (!user) {
      console.log('[SupabaseProtectedRoute] REDIRECTING to signin (user not authenticated)');
      hasRedirected.current = true;
      router.replace(redirectTo);
      return;
    }

    console.log('[SupabaseProtectedRoute] User authenticated, proceeding with role check');
    
    // Check role-based access - redirect ONCE if not allowed
    const userRoleLower = String(user.role).toLowerCase();
    const allowedRolesLower = allowedRoles?.map(r => String(r).toLowerCase());
    const isAllowed = !allowedRoles || allowedRolesLower?.includes(userRoleLower);
    
    if (allowedRoles && !isAllowed) {
      hasRedirected.current = true;
      
      console.log(`[SupabaseProtectedRoute] REDIRECTING due to role mismatch for ${user.email}`);
      console.log(`  User role: "${user.role}" → Allowed roles:`, allowedRoles);

      // Redirect to appropriate dashboard based on user role
      const normalizedRole =
        user.role.toLowerCase() as keyof typeof RolePermissions;
      const userPermissions = RolePermissions[normalizedRole];

      if (userPermissions && userPermissions.routes.length > 0) {
        const defaultRoute = userPermissions.routes[0];
        router.replace(defaultRoute);
      } else {
        router.replace("/dashboard/individual");
      }
    }
  }, [user, loading, allowedRoles, router, redirectTo, hydrated]);

  // 🚫 Absolutely no auth decisions before hydration finishes
  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Initializing session...</p>
        </div>
      </div>
    );
  }

  // 🚫 Only show redirect UI AFTER loading finished and user is confirmed null
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  // Check role authorization - show placeholder while redirecting
  // Compare roles in lowercase to handle case variations
  const userRoleLower = String(user.role).toLowerCase();
  const allowedRolesLower = allowedRoles?.map(r => String(r).toLowerCase());
  const isAllowed = !allowedRoles || allowedRolesLower?.includes(userRoleLower);
  
  if (allowedRoles && !isAllowed) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }
  
  // DEBUG: Log successful authorization
  if (user && allowedRoles) {
    console.log(`[SupabaseProtectedRoute] Authorization SUCCESS for ${user.email}`);
    console.log(`  User role: "${user.role}" (normalized: "${userRoleLower}")`);
    console.log(`  Allowed roles:`, allowedRoles, `(normalized:`, allowedRolesLower, `)`);
  }
  
  // User is authenticated and authorized - render children
  return <>{children}</>;
}
