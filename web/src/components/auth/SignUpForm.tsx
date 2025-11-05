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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { HAITI_PHONE_PREFIX, HAITI_PHONE_REGEX, UserRole } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signUpSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z
      .string()
      .refine(
        (phone) => HAITI_PHONE_REGEX.test(phone),
        "Please enter a valid Haiti phone number (e.g., +509 1234 5678 or 509 1234 5678)"
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string(),
    role: z.nativeEnum(UserRole),
    businessName: z.string().optional(),
    language: z.enum(["en", "fr", "ht", "es"]).default("ht"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      // Business name required for merchants and distributors
      if ([UserRole.MERCHANT, UserRole.DISTRIBUTOR].includes(data.role)) {
        return data.businessName && data.businessName.length >= 2;
      }
      return true;
    },
    {
      message: "Business name is required for merchants and distributors",
      path: ["businessName"],
    }
  );

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register: registerUser } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "en";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      language: "ht",
      role: UserRole.CLIENT,
    },
  });

  const selectedRole = watch("role");

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // If starts with 509, add +
    if (digits.startsWith("509")) {
      return `+${digits}`;
    }

    // If doesn't start with +509, add it
    if (!digits.startsWith("509")) {
      return `${HAITI_PHONE_PREFIX}${digits}`;
    }

    return value;
  };

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setError("");
      setLoading(true);

      console.log("Starting registration process..."); // Debug logging

      const userData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: formatPhoneNumber(data.phoneNumber),
        role: data.role,
      };

      console.log("Submitting user data:", {
        ...userData,
        password: "[HIDDEN]",
      }); // Debug logging (hide password)

      await registerUser(userData);

      console.log("Registration successful, redirecting..."); // Debug logging
      // Redirect to client dashboard since backend assigns CLIENT role by default
      router.push(`/${locale}/dashboard/client`);
    } catch (error: any) {
      console.error("Registration error:", error); // Debug logging

      // Extract error code and message
      const errorCode = error?.code || error?.message || "unknown";
      setError(getErrorMessage(errorCode));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    console.error("Registration error code:", errorCode); // Debug logging

    switch (errorCode) {
      case "auth/email-already-in-use":
        return "An account with this email already exists. Try signing in instead.";
      case "auth/weak-password":
        return "Password is too weak. Use at least 8 characters with uppercase, lowercase, and numbers.";
      case "auth/invalid-email":
        return "Invalid email address format.";
      case "auth/operation-not-allowed":
        return "Account creation is currently disabled. Please contact support.";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait a few minutes before trying again.";
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection and try again.";
      default:
        return `Registration failed: ${
          errorCode || "Unknown error"
        }. Please try again or contact support.`;
    }
  };

  const roleDescriptions = {
    [UserRole.CLIENT]: "Individual users with payment cards",
    [UserRole.MERCHANT]: "Businesses accepting payments",
    [UserRole.DISTRIBUTOR]: "Card distribution partners",
    [UserRole.DIASPORA]: "International remittance users",
    [UserRole.ADMIN]: "Platform administrators",
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">K</span>
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Join KobKlein</CardTitle>
        <CardDescription className="text-center">
          Create your account for Haiti&apos;s digital payment future
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Jean"
                {...register("firstName")}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Baptiste"
                {...register("lastName")}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="jean@email.com"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              placeholder="e.g., +509 1234 5678 or 1234 5678"
              {...register("phoneNumber")}
              className={errors.phoneNumber ? "border-red-500" : ""}
            />
            <p className="text-xs text-gray-500">
              Enter your Haiti phone number with or without country code (+509)
            </p>
            {errors.phoneNumber && (
              <p className="text-sm text-red-600">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Account Type</Label>
            <Select
              onValueChange={(value) => setValue("role", value as UserRole)}
              defaultValue={UserRole.CLIENT}
            >
              <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roleDescriptions).map(([role, description]) => (
                  <SelectItem key={role} value={role}>
                    <div className="flex flex-col">
                      <span className="capitalize">
                        {role.replace("_", " ")}
                      </span>
                      <span className="text-xs text-gray-500">
                        {description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {[UserRole.MERCHANT, UserRole.DISTRIBUTOR].includes(selectedRole) && (
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                placeholder="Your business name"
                {...register("businessName")}
                className={errors.businessName ? "border-red-500" : ""}
              />
              {errors.businessName && (
                <p className="text-sm text-red-600">
                  {errors.businessName.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="language">Preferred Language</Label>
            <Select
              onValueChange={(value) =>
                setValue("language", value as "en" | "fr" | "ht" | "es")
              }
              defaultValue="ht"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ht">
                  Kreyòl Ayisyen (Haitian Creole)
                </SelectItem>
                <SelectItem value="fr">Français (French)</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español (Spanish)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                {...register("password")}
                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                className={
                  errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"
                }
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href={`/${locale}/auth/signin`}
                className="text-blue-600 hover:underline"
              >
                Sign in
              </Link>
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

