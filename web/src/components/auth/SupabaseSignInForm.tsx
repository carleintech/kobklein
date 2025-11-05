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
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SupabaseSignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "en";

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

      const { error: signInError } = await signIn(data.email, data.password);

      if (signInError) {
        setError(getErrorMessage(signInError.message));
        return;
      }

      // Redirect to dashboard on successful sign in
      // Redirect to client dashboard since backend assigns CLIENT role by default
      router.push(`/${locale}/dashboard/client`);
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
      return "Invalid email or password";
    }
    if (errorMessage.includes("Email not confirmed")) {
      return "Please check your email and confirm your account";
    }
    if (errorMessage.includes("Too many requests")) {
      return "Too many failed attempts. Please try again later";
    }
    if (errorMessage.includes("User not found")) {
      return "No account found with this email address";
    }
    if (errorMessage.includes("Invalid email")) {
      return "Invalid email address";
    }
    return errorMessage || "An error occurred during sign in";
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">K</span>
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your KobKlein account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center space-y-2">
            <Link
              href={`/${locale}/auth/forgot-password`}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot your password?
            </Link>
            <div className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href={`/${locale}/auth/signup`}
                className="text-blue-600 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>

          {/* Demo accounts for testing */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Demo Accounts:
            </p>
            <div className="space-y-1 text-xs text-gray-600">
              <div>Admin: admin@kobklein.com / Admin123!</div>
              <div>Client: client@kobklein.com / Client123!</div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

