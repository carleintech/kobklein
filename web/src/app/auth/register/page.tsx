// File: kobklein/web/src/app/auth/register/page.tsx

import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account | KobKlein",
  description: "Create your KobKlein account to get started",
};

interface RegisterPageProps {
  searchParams: {
    callbackUrl?: string;
  };
}

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kobklein-dark via-kobklein-primary to-kobklein-dark p-4">
      <div className="w-full max-w-lg">
        <RegisterForm callbackUrl={searchParams.callbackUrl} />
      </div>
    </div>
  );
}