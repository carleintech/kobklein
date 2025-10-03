"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Camera,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Fingerprint,
  Search,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface TouchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  currency?: boolean;
  biometric?: boolean;
  onBiometricAuth?: () => Promise<boolean>;
}

export function TouchInput({
  label,
  error,
  hint,
  currency,
  biometric,
  onBiometricAuth,
  className,
  type = "text",
  ...props
}: TouchInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState<
    "idle" | "authenticating" | "success" | "error"
  >("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBiometricAuth = async () => {
    if (!onBiometricAuth) return;

    setBiometricStatus("authenticating");
    try {
      const success = await onBiometricAuth();
      setBiometricStatus(success ? "success" : "error");
      if (success && inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      setBiometricStatus("error");
    }
  };

  useEffect(() => {
    if (biometricStatus === "success" || biometricStatus === "error") {
      const timer = setTimeout(() => setBiometricStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [biometricStatus]);

  return (
    <div className="space-y-2">
      {label && (
        <Label
          htmlFor={props.id}
          className={cn(
            "text-sm font-medium transition-colors",
            error ? "text-destructive" : "text-foreground"
          )}
        >
          {label}
        </Label>
      )}

      <div className="relative">
        <Input
          ref={inputRef}
          type={type === "password" && showPassword ? "text" : type}
          className={cn(
            "h-12 text-base", // Larger touch target
            "transition-all duration-200",
            isFocused && "ring-2 ring-primary/20 border-primary",
            error && "border-destructive focus-visible:ring-destructive/20",
            currency && "pl-8",
            (type === "password" || biometric) && "pr-12",
            className
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />

        {/* Currency symbol */}
        {currency && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </div>
        )}

        {/* Password toggle */}
        {type === "password" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Biometric authentication */}
        {biometric && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0",
              biometricStatus === "success" && "text-green-500",
              biometricStatus === "error" && "text-destructive",
              biometricStatus === "authenticating" && "animate-pulse"
            )}
            onClick={handleBiometricAuth}
            disabled={biometricStatus === "authenticating"}
          >
            {biometricStatus === "success" ? (
              <Check className="h-4 w-4" />
            ) : biometricStatus === "error" ? (
              <X className="h-4 w-4" />
            ) : (
              <Fingerprint className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center space-x-1 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Hint */}
      {hint && !error && (
        <p className="text-sm text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

// Touch-optimized number pad for PIN/Amount entry
interface TouchNumberPadProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  currency?: boolean;
  onSubmit?: () => void;
  submitLabel?: string;
  biometric?: boolean;
  onBiometricAuth?: () => Promise<boolean>;
}

export function TouchNumberPad({
  value,
  onChange,
  maxLength = 6,
  currency = false,
  onSubmit,
  submitLabel = "Continue",
  biometric,
  onBiometricAuth,
}: TouchNumberPadProps) {
  const [biometricStatus, setBiometricStatus] = useState<
    "idle" | "authenticating" | "success" | "error"
  >("idle");

  const handleNumberPress = (num: string) => {
    if (value.length < maxLength) {
      onChange(value + num);
    }
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  const handleBiometricAuth = async () => {
    if (!onBiometricAuth) return;

    setBiometricStatus("authenticating");
    try {
      const success = await onBiometricAuth();
      setBiometricStatus(success ? "success" : "error");
      if (success && onSubmit) {
        onSubmit();
      }
    } catch (error) {
      setBiometricStatus("error");
    }

    setTimeout(() => setBiometricStatus("idle"), 2000);
  };

  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  return (
    <div className="space-y-6">
      {/* Display */}
      <div className="text-center space-y-2">
        <div className="flex justify-center items-center space-x-1">
          {Array.from({ length: maxLength }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-3 h-3 rounded-full border-2 transition-colors",
                i < value.length
                  ? "bg-primary border-primary"
                  : "border-muted-foreground/30"
              )}
            />
          ))}
        </div>
        {currency && (
          <p className="text-2xl font-bold">
            ${(parseInt(value || "0") / 100).toFixed(2)}
          </p>
        )}
      </div>

      {/* Number pad */}
      <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
        {numbers.map((num) => (
          <Button
            key={num}
            variant="outline"
            size="lg"
            className="h-14 text-xl font-semibold"
            onClick={() => handleNumberPress(num)}
          >
            {num}
          </Button>
        ))}

        {/* Backspace */}
        <Button
          variant="outline"
          size="lg"
          className="h-14"
          onClick={handleBackspace}
          disabled={value.length === 0}
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Submit or 0 */}
        {biometric ? (
          <Button
            variant="outline"
            size="lg"
            className={cn(
              "h-14",
              biometricStatus === "success" &&
                "border-green-500 text-green-500",
              biometricStatus === "error" &&
                "border-destructive text-destructive"
            )}
            onClick={handleBiometricAuth}
            disabled={
              biometricStatus === "authenticating" || value.length === 0
            }
          >
            {biometricStatus === "success" ? (
              <Check className="h-6 w-6" />
            ) : biometricStatus === "error" ? (
              <AlertCircle className="h-6 w-6" />
            ) : biometricStatus === "authenticating" ? (
              <div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Fingerprint className="h-6 w-6" />
            )}
          </Button>
        ) : (
          <Button
            size="lg"
            className="h-14"
            onClick={onSubmit}
            disabled={value.length === 0}
          >
            {submitLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

// Touch-optimized select dropdown
interface TouchSelectProps {
  options: { value: string; label: string; description?: string }[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

export function TouchSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  label,
  error,
}: TouchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="space-y-2">
      {label && (
        <Label
          className={cn(
            "text-sm font-medium",
            error ? "text-destructive" : "text-foreground"
          )}
        >
          {label}
        </Label>
      )}

      <div className="relative">
        <Button
          variant="outline"
          className={cn(
            "w-full h-12 justify-between text-left",
            error && "border-destructive",
            !selectedOption && "text-muted-foreground"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </Button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-lg shadow-lg max-h-80 overflow-hidden">
            {/* Search */}
            {options.length > 5 && (
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
              </div>
            )}

            {/* Options */}
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  className={cn(
                    "w-full text-left p-3 hover:bg-accent transition-colors",
                    "border-b last:border-b-0",
                    value === option.value && "bg-accent"
                  )}
                  onClick={() => {
                    onValueChange(option.value);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  <div className="space-y-1">
                    <p className="font-medium">{option.label}</p>
                    {option.description && (
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    )}
                  </div>
                </button>
              ))}

              {filteredOptions.length === 0 && (
                <div className="p-6 text-center text-muted-foreground">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}

        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-1 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// Touch-optimized file upload
interface TouchFileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
  description?: string;
  error?: string;
  maxSize?: number; // in MB
  camera?: boolean;
}

export function TouchFileUpload({
  onFileSelect,
  accept = "image/*",
  label,
  description,
  error,
  maxSize = 10,
  camera = true,
}: TouchFileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxSize * 1024 * 1024) {
        // Handle size error
        return;
      }
      onFileSelect(file);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "environment");
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute("capture");
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <Label
          className={cn(
            "text-sm font-medium",
            error ? "text-destructive" : "text-foreground"
          )}
        >
          {label}
        </Label>
      )}

      <div className="space-y-3">
        {/* Upload buttons */}
        <div className="grid grid-cols-2 gap-3">
          {camera && (
            <Button
              type="button"
              variant="outline"
              className="h-12 flex items-center space-x-2"
              onClick={handleCameraCapture}
            >
              <Camera className="h-5 w-5" />
              <span>Camera</span>
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            className="h-12 flex items-center space-x-2"
            onClick={handleFileSelect}
          >
            <Search className="h-5 w-5" />
            <span>Browse</span>
          </Button>
        </div>

        {/* Drag & drop area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25",
            error && "border-destructive"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) onFileSelect(file);
          }}
        >
          <p className="text-sm text-muted-foreground">
            Or drag and drop a file here
          </p>
        </div>
      </div>

      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {error && (
        <div className="flex items-center space-x-1 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

