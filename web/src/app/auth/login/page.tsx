// File: kobklein/web/src/app/auth/login/page.tsx
import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In | KobKlein",
  description: "Sign in to your KobKlein account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kobklein-primary via-kobklein-primary/90 to-kobklein-secondary px-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}