// File: kobklein/web/src/app/admin/layout.tsx

"use client";

import { AuthGuard } from "@/components/auth/auth-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard 
      allowedRoles={['admin', 'super_admin']} 
      requireEmailVerification={true}
    >
      {children}
    </AuthGuard>
  );
}