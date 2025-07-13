// File: kobklein/web/src/components/auth/forgot-password-form.tsx

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/enhanced-button";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { FormField, KobKleinInput } from "@/components/ui/form-field";
import { ErrorMessage } from "@/components/ui/error-message";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validators";
import { sendPasswordResetEmail } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await sendPasswordResetEmail(data.email);

      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.error || 'Failed to send reset email');
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <KobKleinCard className="w-full max-w-md mx-auto">
        <div className="p-6 space-y-6 text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Check Your Email</h1>
            <p className="text-muted-foreground">
              We've sent a password reset link to your email address.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="kobklein"
              size="lg"
              className="w-full"
              onClick={() => setIsSuccess(false)}
            >
              Send Another Email
            </Button>
            
            <a
              href={ROUTES.public.login}
              className="block text-center text-sm text-kobklein-accent hover:underline"
            >
              Back to Sign In
            </a>
          </div>
        </div>
      </KobKleinCard>
    );
  }

  return (
    <KobKleinCard className="w-full max-w-md mx-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <ErrorMessage
            variant="destructive"
            description={error}
            dismissible
            onDismiss={() => setError(null)}
          />
        )}

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="Email Address"
            error={form.formState.errors.email?.message}
            required
          >
            <KobKleinInput
              type="email"
              placeholder="Enter your email"
              leftIcon={<Mail className="h-4 w-4" />}
              {...form.register("email")}
            />
          </FormField>

          <Button
            type="submit"
            variant="kobklein"
            size="lg"
            className="w-full"
            loading={isLoading}
            loadingText="Sending..."
          >
            Send Reset Link
          </Button>
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <a
            href={ROUTES.public.login}
            className="inline-flex items-center text-sm text-kobklein-accent hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Sign In
          </a>
        </div>
      </div>
    </KobKleinCard>
  );
}
