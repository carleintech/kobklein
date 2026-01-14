"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { getDashboardPathForRole } from "@/lib/postLoginRedirect";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signInSchema = z.object({
  emailOrUsername: z.string().min(3, "Email or username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SupabaseSignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { signIn, user: authUser } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "en";

  // ✅ State-driven redirect: navigate when authUser becomes available
  useEffect(() => {
    if (authUser) {
      const role = String(authUser.role).toLowerCase();
      const redirectPath = getDashboardPathForRole(role, String(locale));
      
      console.log("[Sign In] Auth user detected → redirecting to", redirectPath);
      router.replace(redirectPath);
    }
  }, [authUser, locale, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setError("");
      setLoading(true);

      // Check if input is email or username
      const isEmail = data.emailOrUsername.includes("@");
      let email = data.emailOrUsername;

      // If username, fetch email from database
      if (!isEmail) {
        const response = await fetch(
          `/api/auth/get-email-by-username?username=${encodeURIComponent(
            data.emailOrUsername
          )}`
        );
        if (response.ok) {
          const { email: userEmail } = await response.json();
          email = userEmail;
        } else {
          setError("Invalid username or password");
          return;
        }
      }

      const { error: signInError, user: signInUser } = await signIn(email, data.password);

      if (signInError) {
        setError(getErrorMessage(signInError.message));
        return;
      }

      // ✅ Authentication successful - do NOT route here
      // SupabaseProtectedRoute will handle redirection safely after session is fully hydrated
      console.log('[Sign In] Authentication successful - letting ProtectedRoute handle routing');
    } catch (error: any) {
      setError(
        getErrorMessage(error.message || "An unexpected error occurred")
      );
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorMessage: string) => {
    // Map Supabase error messages to user-friendly messages
    if (errorMessage.includes("Invalid login credentials")) {
      return "Invalid email/username or password";
    }
    if (errorMessage.includes("Email not confirmed")) {
      return "Please check your email and confirm your account";
    }
    if (errorMessage.includes("Too many requests")) {
      return "Too many failed attempts. Please try again in a few minutes";
    }
    if (errorMessage.includes("User not found")) {
      return "No account found with this email/username";
    }
    if (errorMessage.includes("Invalid email")) {
      return "Invalid email address";
    }
    return errorMessage || "An error occurred during sign in";
  };

  return (
    <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/95">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">K</span>
          </div>
        </div>
        <CardTitle className="text-2xl text-center font-bold">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center">
          Sign in to your KobKlein account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="emailOrUsername"
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Email or Username
            </Label>
            <Input
              id="emailOrUsername"
              placeholder="Enter your email or username"
              {...register("emailOrUsername")}
              className={errors.emailOrUsername ? "border-red-500" : ""}
              disabled={loading}
              autoComplete="username"
            />
            {errors.emailOrUsername && (
              <p className="text-sm text-red-600">
                {errors.emailOrUsername.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <Link
              href={`/${locale}/auth/forgot-password`}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Security Notice */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800">
              Your connection is secure. We use bank-level encryption to protect
              your data.
            </p>
          </div>

          <div className="text-center space-y-2 pt-2">
            <div className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href={`/${locale}/signup`}
                className="text-blue-600 hover:underline font-medium"
              >
                Create one now
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
