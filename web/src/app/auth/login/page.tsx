// File: kobklein/web/src/app/auth/login/page.tsx

import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In | KobKlein",
  description: "Sign in to your KobKlein account",
};

interface LoginPageProps {
  searchParams: {
    callbackUrl?: string;
    error?: string;
  };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kobklein-dark via-kobklein-primary to-kobklein-dark p-4">
      <div className="w-full max-w-md">
        <LoginForm callbackUrl={searchParams.callbackUrl} />
      </div>
    </div>
  );
}