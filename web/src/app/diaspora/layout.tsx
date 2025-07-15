// File: kobklein/web/src/app/diaspora/layout.tsx

"use client";

import { AuthGuard } from "@/components/auth/auth-guard";

export default function DiasporaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard 
      allowedRoles={['diaspora', 'admin', 'super_admin']} 
      requireEmailVerification={true}
    >
      {children}
    </AuthGuard>
  );
}