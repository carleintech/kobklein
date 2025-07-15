// File: kobklein/web/src/app/auth/register/page.tsx
import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account | KobKlein",
  description: "Create your KobKlein account to get started",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kobklein-primary via-kobklein-primary/90 to-kobklein-secondary px-4 py-8">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}