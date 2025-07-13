// File: kobklein/web/src/components/auth/email-verification.tsx

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Mail, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/enhanced-button";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { verifyEmail, resendVerificationEmail } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";

export function EmailVerification() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const searchParams = useSearchParams();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (token) {
      handleVerification(token);
    } else {
      setStatus('error');
    }
  }, [token]);

  const handleVerification = async (verificationToken: string) => {
    try {
      const result = await verifyEmail(verificationToken);
      
      if (result.success) {
        setStatus('success');
      } else {
        if (result.error?.includes('expired')) {
          setStatus('expired');
        } else {
          setStatus('error');
        }
      }
    } catch (error) {
      setStatus('error');
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    
    try {
      setIsResending(true);
      const result = await resendVerificationEmail(email);
      
      if (result.success) {
        setResendSuccess(true);
      }
    } catch (error) {
      console.error('Resend verification error:', error);
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center space-y-4">
            <LoadingSpinner size="lg" />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Verifying Email</h1>
              <p className="text-muted-foreground">
                Please wait while we verify your email address...
              </p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-green-600">Email Verified!</h1>
              <p className="text-muted-foreground">
                Your email has been successfully verified. You can now access all features.
              </p>
            </div>
            <Button
              variant="kobklein"
              size="lg"
              className="w-full"
              onClick={() => window.location.href = ROUTES.public.login}
            >
              Continue to Sign In
            </Button>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center space-y-6">
            <XCircle className="h-16 w-16 text-amber-500 mx-auto" />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-amber-600">Link Expired</h1>
              <p className="text-muted-foreground">
                This verification link has expired. Please request a new one.
              </p>
            </div>
            {email && (
              <div className="space-y-3">
                {resendSuccess ? (
                  <div className="text-green-600 text-sm">
                    ✓ New verification email sent!
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={handleResendVerification}
                    loading={isResending}
                    loadingText="Sending..."
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Send New Verification Email
                  </Button>
                )}
                <a
                  href={ROUTES.public.login}
                  className="block text-center text-sm text-kobklein-accent hover:underline"
                >
                  Back to Sign In
                </a>
              </div>
            )}
          </div>
        );

      case 'error':
      default:
        return (
          <div className="text-center space-y-6">
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-red-600">Verification Failed</h1>
              <p className="text-muted-foreground">
                There was an error verifying your email. The link may be invalid or expired.
              </p>
            </div>
            <div className="space-y-3">
              {email && !resendSuccess ? (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleResendVerification}
                  loading={isResending}
                  loadingText="Sending..."
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send New Verification Email
                </Button>
              ) : resendSuccess ? (
                <div className="text-green-600 text-sm">
                  ✓ New verification email sent to {email}!
                </div>
              ) : null}
              <a
                href={ROUTES.public.login}
                className="block text-center text-sm text-kobklein-accent hover:underline"
              >
                Back to Sign In
              </a>
            </div>
          </div>
        );
    }
  };

  return (
    <KobKleinCard className="w-full max-w-md mx-auto">
      <div className="p-6">
        {renderContent()}
      </div>
    </KobKleinCard>
  );
}