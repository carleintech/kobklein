// File: kobklein/web/src/app/auth/error/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KobKleinCard } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An error occurred during authentication.",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";
  
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kobklein-primary via-kobklein-primary/90 to-kobklein-secondary px-4">
      <KobKleinCard className="w-full max-w-md p-6">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          
          <div>
            <h1 className="text-xl font-bold text-kobklein-primary">Authentication Error</h1>
            <p className="text-muted-foreground mt-2">{errorMessage}</p>
          </div>

          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-sm text-red-700">
              Error code: <span className="font-mono">{error}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button
              onClick={() => window.location.href = ROUTES.public.home}
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </KobKleinCard>
    </div>
  );
}