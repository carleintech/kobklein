"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const fieldVariants = cva(
  "space-y-2",
  {
    variants: {
      variant: {
        default: "",
        inline: "flex items-center space-y-0 space-x-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface FormFieldProps
  extends VariantProps<typeof fieldVariants> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  description,
  error,
  required,
  variant,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn(fieldVariants({ variant }), className)}>
      {label && (
        <Label className={cn(
          "text-sm font-medium",
          error && "text-destructive",
          variant === "inline" && "min-w-24"
        )}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <div className="space-y-1">
        {children}
        
        {description && !error && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
        
        {error && (
          <p className="text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

// Enhanced Input with KobKlein styling
export interface KobKleinInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

export const KobKleinInput = React.forwardRef<HTMLInputElement, KobKleinInputProps>(
  ({ className, leftIcon, rightIcon, loading, ...props }, ref) => {
    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        
        <Input
          className={cn(
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            loading && "animate-pulse",
            "focus:ring-kobklein-accent focus:border-kobklein-accent",
            className
          )}
          ref={ref}
          disabled={loading}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

KobKleinInput.displayName = "KobKleinInput";

// Phone Input Component
interface PhoneInputProps extends Omit<KobKleinInputProps, 'type'> {
  country?: string;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ country = 'HT', ...props }, ref) => {
    const placeholder = country === 'HT' ? '+509 1234-5678' : '+1 (555) 123-4567';
    
    return (
      <KobKleinInput
        type="tel"
        placeholder={placeholder}
        {...props}
        ref={ref}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

// Currency Input Component
interface CurrencyInputProps extends Omit<KobKleinInputProps, 'type'> {
  currency?: 'HTG' | 'USD';
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ currency = 'HTG', ...props }, ref) => {
    const symbol = currency === 'HTG' ? 'G' : '$';
    
    return (
      <KobKleinInput
        type="number"
        step="0.01"
        min="0"
        rightIcon={<span className="text-sm font-medium">{symbol}</span>}
        {...props}
        ref={ref}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";