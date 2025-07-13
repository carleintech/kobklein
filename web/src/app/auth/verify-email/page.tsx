// File: kobklein/web/src/app/auth/verify-email/page.tsx

import { Metadata } from "next";
import { EmailVerification } from "@/components/auth/email-verification";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const metadata: Metadata = {
  title: "Verify Email | KobKlein",
  description: "Verify your email address to complete registration",
};

function EmailVerificationContent() {
  return <EmailVerification />;
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kobklein-dark via-kobklein-primary to-kobklein-dark p-4">
      <div className="w-full max-w-md">
        <Suspense 
          fallback={
            <div className="flex items-center justify-center p-8">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          <EmailVerificationContent />
        </Suspense>
      </div>
    </div>
  );
}