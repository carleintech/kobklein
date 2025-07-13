// File: kobklein/web/src/app/auth/layout.tsx

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getDashboardRoute } from "@/lib/auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to their dashboard
    if (status === "authenticated" && session?.user?.role) {
      const dashboardUrl = getDashboardRoute(session.user.role);
      router.replace(dashboardUrl);
    }
  }, [session, status, router]);

  // Don't render auth forms if user is already logged in
  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kobklein-dark via-kobklein-primary to-kobklein-dark">
      {children}
    </div>
  );
}