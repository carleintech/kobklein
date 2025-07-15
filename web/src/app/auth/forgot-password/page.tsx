// File: kobklein/web/src/app/auth/forgot-password/page.tsx
import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset Password | KobKlein",
  description: "Reset your KobKlein account password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kobklein-primary via-kobklein-primary/90 to-kobklein-secondary px-4">
      <div className="w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}