// File: kobklein/web/src/app/distributor/layout.tsx

"use client";

import { AuthGuard } from "@/components/auth/auth-guard";

export default function DistributorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard 
      allowedRoles={['distributor', 'admin', 'super_admin']} 
      requireEmailVerification={true}
    >
      {children}
    </AuthGuard>
  );
}