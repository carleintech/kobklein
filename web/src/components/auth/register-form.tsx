// File: kobklein/web/src/components/auth/register-form.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Building,
  Globe,
  Loader2, 
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KobKleinCard } from "@/components/ui/card";
import { registerSchema, type RegisterFormData, USER_ROLES, COUNTRIES, BUSINESS_TYPES, HAITIAN_REGIONS } from "@/lib/validators";
import { registerUser } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";

type RegistrationStep = "role" | "personal" | "details" | "verification";

export function RegisterForm() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("role");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const selectedRole = watch("role");
  const email = watch("email");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError("");

      const result = await registerUser(data);
      
      if (result.success) {
        setSuccess(result.message);
        setCurrentStep("verification");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof RegisterFormData)[] = [];

    switch (currentStep) {
      case "role":
        fieldsToValidate = ["role"];
        break;
      case "personal":
        fieldsToValidate = ["firstName", "lastName", "email", "phone"];
        break;
      case "details":
        fieldsToValidate = ["password", "confirmPassword", "location"];
        if (selectedRole === "merchant") {
          fieldsToValidate.push("businessName", "businessType");
        }
        if (selectedRole === "diaspora") {
          fieldsToValidate.push("currentCountry");
        }
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      if (currentStep === "role") setCurrentStep("personal");
      else if (currentStep === "personal") setCurrentStep("details");
    }
  };

  const prevStep = () => {
    if (currentStep === "personal") setCurrentStep("role");
    else if (currentStep === "details") setCurrentStep("personal");
  };

  const getStepProgress = () => {
    const steps = ["role", "personal", "details"];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <KobKleinCard className="w-full max-w-md mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-kobklein-primary">Join KobKlein</h1>
          <p className="text-muted-foreground mt-2">
            Create your account to get started
          </p>
        </div>

        {/* Progress Bar */}
        {currentStep !== "verification" && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-kobklein-secondary h-2 rounded-full transition-all duration-300"
              style={{ width: `${getStepProgress()}%` }}
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-4 h-4" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-4 h-4" />
              <p className="text-sm font-medium">{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Step 1: Role Selection */}
          {currentStep === "role" && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-semibold">Choose Your Role</h2>
                <p className="text-sm text-muted-foreground">
                  Select how you'll use KobKlein
                </p>
              </div>

              <div className="space-y-3">
                {Object.entries(USER_ROLES).map(([value, role]) => (
                  <label
                    key={value}
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedRole === value
                        ? "border-kobklein-secondary bg-kobklein-secondary/5"
                        : "border-border hover:border-kobklein-secondary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      value={value}
                      {...register("role")}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{role.label}</h3>
                        {selectedRole === value && (
                          <CheckCircle2 className="w-5 h-5 text-kobklein-secondary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {role.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}

              <Button type="button" onClick={nextStep} className="w-full">
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === "personal" && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-semibold">Personal Information</h2>
                <p className="text-sm text-muted-foreground">
                  Tell us about yourself
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="firstName"
                      placeholder="Jean"
                      className="pl-10"
                      {...register("firstName")}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Baptiste"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="jean@example.com"
                    className="pl-10"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="phone"
                    placeholder="+509 1234 5678"
                    className="pl-10"
                    {...register("phone")}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button type="button" onClick={nextStep} className="flex-1">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Details & Security */}
          {currentStep === "details" && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-semibold">Security & Details</h2>
                <p className="text-sm text-muted-foreground">
                  Complete your profile
                </p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select onValueChange={(value) => setValue("location", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent>
                    {HAITIAN_REGIONS.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location.message}</p>
                )}
              </div>

              {/* Merchant-specific fields */}
              {selectedRole === "merchant" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="businessName"
                        placeholder="Your business name"
                        className="pl-10"
                        {...register("businessName")}
                      />
                    </div>
                    {errors.businessName && (
                      <p className="text-sm text-destructive">{errors.businessName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select onValueChange={(value) => setValue("businessType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.businessType && (
                      <p className="text-sm text-destructive">{errors.businessType.message}</p>
                    )}
                  </div>
                </>
              )}

              {/* Diaspora-specific fields */}
              {selectedRole === "diaspora" && (
                <div className="space-y-2">
                  <Label htmlFor="currentCountry">Current Country</Label>
                  <Select onValueChange={(value) => setValue("currentCountry", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your current country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.currentCountry && (
                    <p className="text-sm text-destructive">{errors.currentCountry.message}</p>
                  )}
                </div>
              )}

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="pl-10 pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox id="acceptTerms" {...register("acceptTerms")} />
                  <Label htmlFor="acceptTerms" className="text-sm leading-tight">
                    I agree to the{" "}
                    <a href="/terms" className="text-kobklein-accent hover:underline">
                      Terms of Service
                    </a>
                  </Label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
                )}

                <div className="flex items-start space-x-2">
                  <Checkbox id="acceptPrivacy" {...register("acceptPrivacy")} />
                  <Label htmlFor="acceptPrivacy" className="text-sm leading-tight">
                    I agree to the{" "}
                    <a href="/privacy" className="text-kobklein-accent hover:underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>
                {errors.acceptPrivacy && (
                  <p className="text-sm text-destructive">{errors.acceptPrivacy.message}</p>
                )}

                <div className="flex items-start space-x-2">
                  <Checkbox id="acceptMarketing" {...register("acceptMarketing")} />
                  <Label htmlFor="acceptMarketing" className="text-sm leading-tight">
                    I would like to receive marketing communications (optional)
                  </Label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Verification */}
          {currentStep === "verification" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Check Your Email</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  We've sent a verification link to{" "}
                  <span className="font-medium">{email}</span>
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  Click the link in the email to verify your account and start using KobKlein.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(ROUTES.public.login)}
                className="w-full"
              >
                Go to Login
              </Button>
            </div>
          )}
        </form>

        {/* Login Link */}
        {currentStep !== "verification" && (
          <div className="text-center text-sm">
            Already have an account?{" "}
            <a
              href={ROUTES.public.login}
              className="text-kobklein-accent hover:underline font-medium"
            >
              Sign in
            </a>
          </div>
        )}
      </div>
    </KobKleinCard>
  );
}