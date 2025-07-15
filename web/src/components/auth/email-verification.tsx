// File: kobklein/web/src/components/auth/email-verification.tsx
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Mail, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { KobKleinCard } from "@/components/ui/card";
import { verifyEmail, sendVerificationEmail } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";

export function EmailVerification() {
  const [status, setStatus] = useState<"verifying" | "success" | "error" | "resend">("verifying");
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (token) {
      handleVerification(token);
    } else {
      setStatus("resend");
    }
  }, [token]);

  const handleVerification = async (token: string) => {
    try {
      const result = await verifyEmail(token);
      
      if (result.success) {
        setStatus("success");
      } else {
        setError("Invalid or expired verification token");
        setStatus("error");
      }
    } catch (error) {
      console.error("Email verification error:", error);
      setError(error instanceof Error ? error.message : "Verification failed");
      setStatus("error");
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError("Email address is required");
      return;
    }

    try {
      setIsResending(true);
      const result = await sendVerificationEmail(email);
      
      if (result.success) {
        setStatus("resend");
        setError("");
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      setError(error instanceof Error ? error.message : "Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <KobKleinCard className="w-full max-w-md mx-auto p-6">
      <div className="text-center space-y-6">
        {/* Verifying State */}
        {status === "verifying" && (
          <>
            <div className="w-16 h-16 mx-auto">
              <Loader2 className="w-16 h-16 text-kobklein-secondary animate-spin" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-kobklein-primary">Verifying Email</h2>
              <p className="text-muted-foreground mt-2">
                Please wait while we verify your email address...
              </p>
            </div>
          </>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-kobklein-primary">Email Verified!</h2>
              <p className="text-muted-foreground mt-2">
                Your email has been successfully verified. You can now sign in to your account.
              </p>
            </div>
            <Button
              onClick={() => window.location.href = ROUTES.public.login}
              className="w-full"
            >
              Continue to Login
            </Button>
          </>
        )}

        {/* Error State */}
        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-kobklein-primary">Verification Failed</h2>
              <p className="text-muted-foreground mt-2">{error}</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleResendVerification}
                disabled={isResending || !email}
                className="flex-1"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend Email"
                )}
              </Button>
              <Button
                onClick={() => window.location.href = ROUTES.public.login}
                className="flex-1"
              >
                Back to Login
              </Button>
            </div>
          </>
        )}

        {/* Resend State */}
        {status === "resend" && (
          <>
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-kobklein-primary">Verify Your Email</h2>
              <p className="text-muted-foreground mt-2">
                We've sent a verification link to your email address. Click the link to verify your account.
              </p>
              {email && (
                <p className="text-sm font-medium mt-2">{email}</p>
              )}
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <p className="text-sm text-amber-700">
                Didn't receive the email? Check your spam folder or click the button below to resend.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleResendVerification}
                disabled={isResending || !email}
                className="flex-1"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend Email"
                )}
              </Button>
              <Button
                onClick={() => window.location.href = ROUTES.public.login}
                className="flex-1"
              >
                Back to Login
              </Button>
            </div>
          </>
        )}
      </div>
    </KobKleinCard>
  );
}