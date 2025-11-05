"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { HAITI_PHONE_PREFIX, HAITI_PHONE_REGEX, UserRole } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Building,
  Check,
  ChevronLeft,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
        "Please enter a valid Haiti phone number (e.g., +509 1234 5678)"
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
    legalBusinessName: z.string().optional(),
    businessRegistrationNumber: z.string().optional(),
    businessAddress: z.string().optional(),
    language: z.enum(["en", "fr", "ht", "es"]).default("ht"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === UserRole.MERCHANT) {
        return data.businessName && data.businessName.length >= 2;
      }
      return true;
    },
    {
      message: "Business name is required for merchants",
      path: ["businessName"],
    }
  )
  .refine(
    (data) => {
      if (data.role === UserRole.DISTRIBUTOR) {
        return (
          data.legalBusinessName &&
          data.legalBusinessName.length >= 2 &&
          data.businessRegistrationNumber &&
          data.businessRegistrationNumber.length >= 2 &&
          data.businessAddress &&
          data.businessAddress.length >= 5
        );
      }
      return true;
    },
    {
      message:
        "Legal business name, registration number, and address are required for distributors",
      path: ["legalBusinessName"],
    }
  );

type SignUpFormData = z.infer<typeof signUpSchema>;

const steps = [
  { id: 1, title: "Personal Info", description: "Tell us about yourself" },
  { id: 2, title: "Account Setup", description: "Secure your account" },
  { id: 3, title: "User Type", description: "Choose your role" },
];

export default function ModernSignUpForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState<{
    country?: string;
    countryCode?: string;
    region?: string;
    timezone?: string;
    ipAddress?: string;
  }>({});
  const [locationLoading, setLocationLoading] = useState(true);

  const { register: registerUser } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "en";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      language: "ht",
      role: UserRole.INDIVIDUAL,
    },
  });

  const selectedRole = watch("role");
  const watchedFields = watch();

  // Detect user location on component mount
  useEffect(() => {
    detectLocation().catch((err) => {
      // Silently fail location detection
      console.error("Location detection failed:", err);
    });
  }, []);

  const detectLocation = async () => {
    try {
      setLocationLoading(true);

      // Try browser geolocation first (requires HTTPS and user permission)
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            await reverseGeocode(latitude, longitude).catch(() => {
              // If reverse geocoding fails, try IP fallback
              detectLocationByIP().catch(() => {
                // If IP detection also fails, use defaults
                setDefaultLocation();
              });
            });
          },
          async () => {
            // Geolocation failed or denied, fallback to IP-based detection
            await detectLocationByIP().catch(() => {
              setDefaultLocation();
            });
          },
          { timeout: 5000 }
        );
      } else {
        // Geolocation not supported, fallback to IP-based detection
        await detectLocationByIP().catch(() => {
          setDefaultLocation();
        });
      }
    } catch (error) {
      console.error("Location detection error:", error);
      setDefaultLocation();
    }
  };

  const setDefaultLocation = () => {
    // Default to Haiti if all else fails
    setLocationData({
      country: "HT",
      countryCode: "+509",
      region: "Ouest",
      timezone: "America/Port-au-Prince",
    });
    setLocationLoading(false);
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      // Use a free reverse geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        { signal: AbortSignal.timeout(5000) }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const countryCode = data.address?.country_code?.toUpperCase() || "HT";
      const country = getCountryCallingCode(countryCode);
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      setLocationData({
        country: countryCode,
        countryCode: country,
        region: data.address?.state || data.address?.region || "",
        timezone,
      });
      setLocationLoading(false);
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      throw error; // Let the caller handle the error
    }
  };

  const detectLocationByIP = async () => {
    try {
      // Use ipapi.co for IP-based geolocation (free tier: 1000 requests/day)
      const response = await fetch("https://ipapi.co/json/", {
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setLocationData({
        country: data.country_code || "HT",
        countryCode: data.country_calling_code || "+509",
        region: data.region || "",
        timezone:
          data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        ipAddress: data.ip,
      });
      setLocationLoading(false);
    } catch (error) {
      console.error("IP geolocation error:", error);
      throw error; // Let the caller handle the error
    }
  };

  const getCountryCallingCode = (countryCode: string): string => {
    const codes: Record<string, string> = {
      HT: "+509",
      US: "+1",
      CA: "+1",
      FR: "+33",
      GB: "+44",
      DE: "+49",
      IT: "+39",
      ES: "+34",
      BR: "+55",
      MX: "+52",
      // Add more as needed
    };
    return codes[countryCode] || "+509";
  };

  const formatPhoneNumber = (value: string) => {
    let cleaned = value.replace(/\D/g, "");
    if (cleaned.startsWith("509")) {
      cleaned = cleaned.substring(3);
    }
    if (cleaned.length <= 8) {
      cleaned = cleaned.replace(/(\d{4})(\d{0,4})/, "$1 $2").trim();
      return `${HAITI_PHONE_PREFIX} ${cleaned}`;
    }
    return value;
  };

  const onSubmit = async (data: SignUpFormData) => {
    setError("");
    setLoading(true);

    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phoneNumber,
        role: data.role,
        businessName: data.businessName,
        legalBusinessName: data.legalBusinessName,
        businessRegistrationNumber: data.businessRegistrationNumber,
        businessAddress: data.businessAddress,
        // Include location data
        country: locationData.country,
        countryCode: locationData.countryCode,
        region: locationData.region,
        timezone: locationData.timezone,
        ipAddress: locationData.ipAddress,
      });

      // Redirect to login after successful registration
      router.push(`/${locale}/auth/signin?registered=true`);
    } catch (error: any) {
      // Enhanced error messages for 409 conflicts
      let errorMessage = "Registration failed. Please try again.";

      if (error.message?.includes("email already exists")) {
        errorMessage =
          "An account with this email already exists. Please sign in or use a different email.";
      } else if (
        error.message?.includes("phone already exists") ||
        error.message?.includes("phone number already exists")
      ) {
        errorMessage =
          "An account with this phone number already exists. Please use a different phone number.";
      } else if (error.message?.includes("Business name is required")) {
        errorMessage = "Business name is required for Merchants.";
      } else if (error.message?.includes("Legal business name is required")) {
        errorMessage =
          "Legal business name, registration number, and address are required for Distributors.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): (keyof SignUpFormData)[] => {
    switch (step) {
      case 1:
        return ["firstName", "lastName", "phoneNumber"];
      case 2:
        return ["email", "password", "confirmPassword"];
      case 3:
        return ["role", "businessName"];
      default:
        return [];
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.INDIVIDUAL:
        return <User className="h-5 w-5" />;
      case UserRole.MERCHANT:
        return <Building className="h-5 w-5" />;
      case UserRole.DISTRIBUTOR:
        return <Globe className="h-5 w-5" />;
      case UserRole.DIASPORA:
        return <Globe className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.INDIVIDUAL:
        return "from-blue-500 to-cyan-500";
      case UserRole.MERCHANT:
        return "from-green-500 to-emerald-500";
      case UserRole.DISTRIBUTOR:
        return "from-purple-500 to-indigo-500";
      case UserRole.DIASPORA:
        return "from-orange-500 to-red-500";
      default:
        return "from-blue-500 to-cyan-500";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white">Join KobKlein</h2>
        <p className="text-blue-200">Create your account in 3 simple steps</p>

        {/* Location Detection Indicator */}
        {locationLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-2 text-sm text-blue-300"
          >
            <motion.div
              className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span>Detecting your location...</span>
          </motion.div>
        )}

        {!locationLoading && locationData.country && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-2 text-sm text-green-400"
          >
            <Globe className="h-4 w-4" />
            <span>
              Location detected: {locationData.country}{" "}
              {locationData.countryCode}
            </span>
          </motion.div>
        )}

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 pt-4">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              className="flex items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: step.id * 0.1 }}
            >
              <div
                className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                ${
                  step.id <= currentStep
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                    : "bg-white/10 text-blue-300"
                }
                transition-all duration-300
              `}
              >
                {step.id < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </div>
              {step.id < steps.length && (
                <div
                  className={`
                  w-12 h-0.5 mx-2
                  ${
                    step.id < currentStep
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                      : "bg-white/20"
                  }
                  transition-all duration-300
                `}
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

        <AnimatePresence mode="wait">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Personal Information
                </h3>
                <p className="text-blue-200 text-sm">Tell us about yourself</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    placeholder="First Name"
                    {...register("firstName")}
                    className={`
                      pl-12 h-14 bg-white/5 border-white/20 text-white placeholder:text-blue-300
                      rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-cyan-400/50
                      transition-all duration-300 focus:ring-0 focus:ring-offset-0
                      ${errors.firstName ? "border-red-400/50" : ""}
                    `}
                  />
                  {errors.firstName && (
                    <motion.p
                      className="text-red-400 text-sm mt-2 flex items-center space-x-1"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.firstName.message}</span>
                    </motion.p>
                  )}
                </div>

                {/* Last Name */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    placeholder="Last Name"
                    {...register("lastName")}
                    className={`
                      pl-12 h-14 bg-white/5 border-white/20 text-white placeholder:text-blue-300
                      rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-cyan-400/50
                      transition-all duration-300 focus:ring-0 focus:ring-offset-0
                      ${errors.lastName ? "border-red-400/50" : ""}
                    `}
                  />
                  {errors.lastName && (
                    <motion.p
                      className="text-red-400 text-sm mt-2 flex items-center space-x-1"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.lastName.message}</span>
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">
                  <Phone className="h-5 w-5" />
                </div>
                <Input
                  placeholder="+509 1234 5678"
                  {...register("phoneNumber")}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setValue("phoneNumber", formatted);
                  }}
                  className={`
                    pl-12 h-14 bg-white/5 border-white/20 text-white placeholder:text-blue-300
                    rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-cyan-400/50
                    transition-all duration-300 focus:ring-0 focus:ring-offset-0
                    ${errors.phoneNumber ? "border-red-400/50" : ""}
                  `}
                />
                {errors.phoneNumber && (
                  <motion.p
                    className="text-red-400 text-sm mt-2 flex items-center space-x-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.phoneNumber.message}</span>
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Account Setup */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Account Setup
                </h3>
                <p className="text-blue-200 text-sm">Secure your account</p>
              </div>

              {/* Email */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">
                  <Mail className="h-5 w-5" />
                </div>
                <Input
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

              {/* Password */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
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

              {/* Confirm Password */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  {...register("confirmPassword")}
                  className={`
                    pl-12 pr-12 h-14 bg-white/5 border-white/20 text-white placeholder:text-blue-300
                    rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-cyan-400/50
                    transition-all duration-300 focus:ring-0 focus:ring-offset-0
                    ${errors.confirmPassword ? "border-red-400/50" : ""}
                  `}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </motion.button>
                {errors.confirmPassword && (
                  <motion.p
                    className="text-red-400 text-sm mt-2 flex items-center space-x-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.confirmPassword.message}</span>
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: User Type */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Choose Your Role
                </h3>
                <p className="text-blue-200 text-sm">
                  Select how you'll use KobKlein
                </p>
              </div>

              {/* Role Selection */}
              <div className="space-y-4">
                {Object.values(UserRole)
                  .filter((role) => role !== UserRole.ADMIN)
                  .map((role) => (
                    <motion.div
                      key={role}
                      className={`
                      p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                      ${
                        selectedRole === role
                          ? "border-cyan-400/50 bg-white/10"
                          : "border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/8"
                      }
                    `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setValue("role", role)}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`
                        w-12 h-12 rounded-xl bg-gradient-to-r ${getRoleColor(
                          role
                        )}
                        flex items-center justify-center text-white
                      `}
                        >
                          {getRoleIcon(role)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold capitalize">
                            {role}
                          </h4>
                          <p className="text-blue-200 text-sm">
                            {role === UserRole.INDIVIDUAL &&
                              "Send and receive payments"}
                            {role === UserRole.MERCHANT &&
                              "Accept payments for your business"}
                            {role === UserRole.DISTRIBUTOR &&
                              "Manage network operations"}
                            {role === UserRole.DIASPORA &&
                              "International remittance services"}
                          </p>
                        </div>
                        <div
                          className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center
                        ${
                          selectedRole === role
                            ? "border-cyan-400 bg-cyan-400"
                            : "border-white/30"
                        }
                      `}
                        >
                          {selectedRole === role && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>

              {/* Business Name (for Merchant) */}
              {selectedRole === UserRole.MERCHANT && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">
                      <Building className="h-5 w-5" />
                    </div>
                    <Input
                      placeholder="Business Name"
                      {...register("businessName")}
                      className={`
                        pl-12 h-14 bg-white/5 border-white/20 text-white placeholder:text-blue-300
                        rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-cyan-400/50
                        transition-all duration-300 focus:ring-0 focus:ring-offset-0
                        ${errors.businessName ? "border-red-400/50" : ""}
                      `}
                    />
                    {errors.businessName && (
                      <motion.p
                        className="text-red-400 text-sm mt-2 flex items-center space-x-1"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                      >
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.businessName.message}</span>
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Distributor Business Fields */}
              {selectedRole === UserRole.DISTRIBUTOR && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* Legal Business Name */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">
                      <Building className="h-5 w-5" />
                    </div>
                    <Input
                      placeholder="Legal Business Name"
                      {...register("legalBusinessName")}
                      className={`
                        pl-12 h-14 bg-white/5 border-white/20 text-white placeholder:text-blue-300
                        rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-cyan-400/50
                        transition-all duration-300 focus:ring-0 focus:ring-offset-0
                        ${errors.legalBusinessName ? "border-red-400/50" : ""}
                      `}
                    />
                    {errors.legalBusinessName && (
                      <motion.p
                        className="text-red-400 text-sm mt-2 flex items-center space-x-1"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                      >
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.legalBusinessName.message}</span>
                      </motion.p>
                    )}
                  </div>

                  {/* Business Registration Number */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">
                      <Building className="h-5 w-5" />
                    </div>
                    <Input
                      placeholder="Business Registration Number"
                      {...register("businessRegistrationNumber")}
                      className={`
                        pl-12 h-14 bg-white/5 border-white/20 text-white placeholder:text-blue-300
                        rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-cyan-400/50
                        transition-all duration-300 focus:ring-0 focus:ring-offset-0
                        ${errors.businessRegistrationNumber ? "border-red-400/50" : ""}
                      `}
                    />
                    {errors.businessRegistrationNumber && (
                      <motion.p
                        className="text-red-400 text-sm mt-2 flex items-center space-x-1"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                      >
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.businessRegistrationNumber.message}</span>
                      </motion.p>
                    )}
                  </div>

                  {/* Business Address */}
                  <div className="relative">
                    <div className="absolute left-4 top-6 text-blue-300">
                      <Building className="h-5 w-5" />
                    </div>
                    <textarea
                      placeholder="Business Address"
                      {...register("businessAddress")}
                      rows={3}
                      className={`
                        w-full pl-12 pr-4 py-4 bg-white/5 border-white/20 text-white placeholder:text-blue-300
                        rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-cyan-400/50
                        transition-all duration-300 focus:ring-0 focus:ring-offset-0 border-2
                        ${errors.businessAddress ? "border-red-400/50" : ""}
                      `}
                    />
                    {errors.businessAddress && (
                      <motion.p
                        className="text-red-400 text-sm mt-2 flex items-center space-x-1"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                      >
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.businessAddress.message}</span>
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6">
          {currentStep > 1 ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                onClick={prevStep}
                variant="ghost"
                className="text-blue-300 hover:text-white hover:bg-white/10"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Back
              </Button>
            </motion.div>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                onClick={nextStep}
                className="
                  bg-gradient-to-r from-cyan-500 to-blue-500
                  hover:from-cyan-400 hover:to-blue-400 text-white font-semibold
                  px-8 h-12 rounded-xl transition-all duration-300 shadow-lg
                  hover:shadow-cyan-500/25 border-0 focus:ring-0 focus:ring-offset-0
                "
              >
                Next
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                disabled={loading}
                className="
                  bg-gradient-to-r from-cyan-500 to-blue-500
                  hover:from-cyan-400 hover:to-blue-400 text-white font-semibold
                  px-8 h-12 rounded-xl transition-all duration-300 shadow-lg
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
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Create Account</span>
                    <Check className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </motion.div>
          )}
        </div>

        {/* Sign In Link */}
        <motion.div
          className="text-center pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <span className="text-blue-200">
            Already have an account?{" "}
            <Link
              href={`/${locale}/auth/signin`}
              className="text-cyan-300 hover:text-white font-medium transition-colors"
            >
              Sign in
            </Link>
          </span>
        </motion.div>
      </form>
    </div>
  );
}
