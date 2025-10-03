"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { RolePermissions } from "@/types/auth";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "en";

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(`/${locale}/auth/signin`);
        return;
      }

      // Redirect to role-specific dashboard
      const userPermissions = RolePermissions[user.role];
      const defaultRoute = userPermissions.routes[0];
      router.push(`/${locale}${defaultRoute}`);
    }
  }, [user, loading, router, locale]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
