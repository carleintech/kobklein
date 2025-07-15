// File: kobklein/web/src/app/merchant/layout.tsx

"use client";

import { AuthGuard } from "@/components/auth/auth-guard";

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard 
      allowedRoles={['merchant', 'admin', 'super_admin']} 
      requireEmailVerification={true}
    >
      {children}
    </AuthGuard>
  );
}