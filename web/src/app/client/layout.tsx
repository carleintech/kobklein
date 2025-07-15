// File: kobklein/web/src/app/client/layout.tsx

"use client";

import { AuthGuard } from "@/components/auth/auth-guard";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={['client']} requireEmailVerification={true}>
      {children}
    </AuthGuard>
  );
}