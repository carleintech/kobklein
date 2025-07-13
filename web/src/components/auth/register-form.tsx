"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Building, Loader2, Check } from "lucide-react";

import { Button } from "@/components/ui/enhanced-button";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { FormField, KobKleinInput } from "@/components/ui/form-field";
import { ErrorMessage } from "@/components/ui/error-message";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { registerSchema, type RegisterFormData } from "@/lib/validators";
import { useToast } from "@/lib/toast";
import { ROUTES, USER_ROLES } from "@/lib/constants";
import { registerUser } from "@/lib/auth";

interface RegisterFormProps {
  callbackUrl?: string;
}

export function RegisterForm({ callbackUrl }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
      role: "client",
      location: "",
      businessName: "",
      businessType: "",
    },
  });

  const selectedRole = form.watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await registerUser(data);

      if (result.success) {
        toast.registrationSuccess(data.email);
        router.push(callbackUrl || '/auth/verify-email');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = async () => {
    // Validate current step fields
    const fieldsToValidate = step === 1 
      ? ["email", "password", "confirmPassword"] 
      : ["firstName", "lastName", "phone", "role"];
    
    const isValid = await form.trigger(fieldsToValidate as any);
    
    if (isValid) {
      setStep(2);
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "client":
        return "Individual user for personal wallet and payments";
      case "merchant":
        return "Business owner accepting payments from customers";
      case "distributor":
        return "Agent managing refills and onboarding users";
      case "diaspora":
        return "Send money to family and friends in Haiti";
      default:
        return "";
    }
  };

  return (
    <KobKleinCard className="w-full max-w-lg mx-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Join KobKlein</h1>
          <p className="text-muted-foreground">
            Create your account to get started
          </p>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-kobklein-accent text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > 1 ? <Check className="h-4 w-4" /> : '1'}
            </div>
            <div className={`w-12 h-1 ${step >= 2 ? 'bg-kobklein-accent' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-kobklein-accent text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {step === 1 ? 'Account Security' : 'Personal Information'}
          </div>
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
          {step === 1 && (
            <>
              {/* Email Field */}
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

              {/* Password Field */}
              <FormField
                label="Password"
                error={form.formState.errors.password?.message}
                required
                hint="Must be at least 8 characters with numbers and letters"
              >
                <KobKleinInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                  {...form.register("password")}
                />
              </FormField>

              {/* Confirm Password Field */}
              <FormField
                label="Confirm Password"
                error={form.formState.errors.confirmPassword?.message}
                required
              >
                <KobKleinInput
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                  {...form.register("confirmPassword")}
                />
              </FormField>

              {/* Next Button */}
              <Button
                type="button"
                variant="kobklein"
                size="lg"
                className="w-full"
                onClick={handleNextStep}
                disabled={isLoading}
              >
                Continue
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  error={form.formState.errors.firstName?.message}
                  required
                >
                  <KobKleinInput
                    placeholder="First name"
                    leftIcon={<User className="h-4 w-4" />}
                    {...form.register("firstName")}
                  />
                </FormField>

                <FormField
                  label="Last Name"
                  error={form.formState.errors.lastName?.message}
                  required
                >
                  <KobKleinInput
                    placeholder="Last name"
                    leftIcon={<User className="h-4 w-4" />}
                    {...form.register("lastName")}
                  />
                </FormField>
              </div>

              {/* Phone Field */}
              <FormField
                label="Phone Number"
                error={form.formState.errors.phone?.message}
                required
                hint="Include country code (e.g., +509 for Haiti)"
              >
                <KobKleinInput
                  type="tel"
                  placeholder="+509 1234 5678"
                  leftIcon={<Phone className="h-4 w-4" />}
                  {...form.register("phone")}
                />
              </FormField>

              {/* Role Selection */}
              <FormField
                label="Account Type"
                error={form.formState.errors.role?.message}
                required
                hint={getRoleDescription(selectedRole)}
              >
                <Select
                  value={selectedRole}
                  onValueChange={(value) => form.setValue("role", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Client (Individual)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="merchant">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4" />
                        <span>Merchant (Business)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="distributor">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>Distributor (Agent)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="diaspora">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Diaspora (Sender)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              {/* Location Field */}
              <FormField
                label="Location"
                error={form.formState.errors.location?.message}
                required
                hint={selectedRole === "diaspora" ? "Your current country/city" : "Your location in Haiti"}
              >
                <KobKleinInput
                  placeholder={selectedRole === "diaspora" ? "e.g., Miami, FL" : "e.g., Port-au-Prince"}
                  leftIcon={<MapPin className="h-4 w-4" />}
                  {...form.register("location")}
                />
              </FormField>

              {/* Business Fields (for Merchant/Distributor) */}
              {(selectedRole === "merchant" || selectedRole === "distributor") && (
                <>
                  <FormField
                    label="Business Name"
                    error={form.formState.errors.businessName?.message}
                    required
                  >
                    <KobKleinInput
                      placeholder="Enter your business name"
                      leftIcon={<Building className="h-4 w-4" />}
                      {...form.register("businessName")}
                    />
                  </FormField>

                  <FormField
                    label="Business Type"
                    error={form.formState.errors.businessType?.message}
                    required
                  >
                    <KobKleinInput
                      placeholder="e.g., Restaurant, Shop, Services"
                      leftIcon={<Building className="h-4 w-4" />}
                      {...form.register("businessType")}
                    />
                  </FormField>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  Back
                </Button>
                
                <Button
                  type="submit"
                  variant="kobklein"
                  size="lg"
                  className="flex-1"
                  loading={isLoading}
                  loadingText="Creating Account..."
                >
                  Create Account
                </Button>
              </div>
            </>
          )}
        </form>

        {/* Login Link */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <a
            href={ROUTES.public.login}
            className="text-kobklein-accent hover:underline font-medium"
          >
            Sign in
          </a>
        </div>
      </div>
    </KobKleinCard>
  );
}