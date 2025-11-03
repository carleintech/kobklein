import { UserRole } from "@/types/auth";

import { Metadata } from "next";
import { unstable_setRequestLocale } from "next-intl/server";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PaymentTestClient from "./PaymentTestClient";

export const metadata: Metadata = {
  title: "Payment Integration Test | KobKlein",
  description: "Test payment flows with backend integration",
};


export default function PaymentTestPage({ params }: { params: { locale: string } }) {
  unstable_setRequestLocale(params.locale);
  return (
    <ProtectedRoute
      allowedRoles={[
        UserRole.CLIENT,
        UserRole.MERCHANT,
        UserRole.DISTRIBUTOR,
        UserRole.DIASPORA,
        UserRole.ADMIN,
      ]}
    >
      <PaymentTestClient />
    </ProtectedRoute>
  );
}
  // Codacy CLI analysis required after file edit
