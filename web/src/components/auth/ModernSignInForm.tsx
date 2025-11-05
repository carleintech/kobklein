"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
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

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
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
    setError("");
    setLoading(true);

    try {
      await login(data.email, data.password);
      // Redirect to client dashboard since backend assigns CLIENT role by default
      router.push(`/${locale}/dashboard/client`);
    } catch (error: any) {
      setError(
        error.message || "An unexpected error occurred. Please try again."
      );
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email address";
      case "auth/wrong-password":
        return "Incorrect password";
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/user-disabled":
        return "This account has been disabled";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later";
      default:
        return "An error occurred during sign in";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
        <p className="text-blue-200">Sign in to continue your journey</p>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {error && (
          <motion.div
            className="flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/20 p-4 rounded-xl backdrop-blur-sm"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        {/* Email Field */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">
              <Mail className="h-5 w-5" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={`
                pl-12 h-14 bg-white/5 border-white/20 text-white placeholder:text-blue-300
                rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-cyan-400/50
                transition-all duration-300 focus:ring-0 focus:ring-offset-0
                ${errors.email ? "border-red-400/50" : ""}
              `}
            />
            {errors.email && (
              <motion.p
                className="text-red-400 text-sm mt-2 flex items-center space-x-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <AlertCircle className="h-3 w-3" />
                <span>{errors.email.message}</span>
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Password Field */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">
              <Lock className="h-5 w-5" />
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password")}
              className={`
                pl-12 pr-12 h-14 bg-white/5 border-white/20 text-white placeholder:text-blue-300
                rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-cyan-400/50
                transition-all duration-300 focus:ring-0 focus:ring-offset-0
                ${errors.password ? "border-red-400/50" : ""}
              `}
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </motion.button>
            {errors.password && (
              <motion.p
                className="text-red-400 text-sm mt-2 flex items-center space-x-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <AlertCircle className="h-3 w-3" />
                <span>{errors.password.message}</span>
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Forgot Password Link */}
        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href={`/${locale}/auth/forgot-password`}
            className="text-sm text-cyan-300 hover:text-white transition-colors"
          >
            Forgot password?
          </Link>
        </motion.div>

        {/* Sign In Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              disabled={loading}
              className="
                w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-500
                hover:from-cyan-400 hover:to-blue-400 text-white font-semibold
                rounded-xl transition-all duration-300 shadow-lg
                hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed
                border-0 focus:ring-0 focus:ring-offset-0
              "
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </motion.div>
        </motion.div>

        {/* Sign Up Link */}
        <motion.div
          className="text-center pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <span className="text-blue-200">
            Don&apos;t have an account?{" "}
            <Link
              href={`/${locale}/auth/signup`}
              className="text-cyan-300 hover:text-white font-medium transition-colors"
            >
              Sign up
            </Link>
          </span>
        </motion.div>
      </motion.form>
    </div>
  );
}
