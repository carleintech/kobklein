"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle,
  X,
  RefreshCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./enhanced-button";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-red-200 bg-red-50 text-red-900 [&>svg]:text-red-600",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-900 [&>svg]:text-yellow-600",
        success: "border-green-200 bg-green-50 text-green-900 [&>svg]:text-green-600",
        info: "border-blue-200 bg-blue-50 text-blue-900 [&>svg]:text-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconMap = {
  destructive: AlertTriangle,
  warning: AlertCircle,
  success: CheckCircle,
  info: Info,
  default: Info,
};

export interface ErrorMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function ErrorMessage({
  className,
  variant = "destructive",
  title,
  description,
  action,
  dismissible,
  onDismiss,
  children,
  ...props
}: ErrorMessageProps) {
  const Icon = iconMap[variant || "default"];

  return (
    <div className={cn(alertVariants({ variant }), className)} {...props}>
      <div className="flex gap-3">
        <Icon className="h-5 w-5 flex-shrink-0" />
        
        <div className="flex-1 space-y-1">
          {title && (
            <h5 className="font-medium leading-none tracking-tight">
              {title}
            </h5>
          )}
          {description && (
            <div className="text-sm opacity-90">
              {description}
            </div>
          )}
          {children && (
            <div className="text-sm">
              {children}
            </div>
          )}
          
          {action && (
            <div className="mt-3">
              <Button
                size="sm"
                variant={variant === "destructive" ? "error" : "default"}
                onClick={action.onClick}
                leftIcon={<RefreshCcw className="h-3 w-3" />}
              >
                {action.label}
              </Button>
            </div>
          )}
        </div>
        
        {dismissible && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Specific error components
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorMessage
      variant="destructive"
      title="Connection Error"
      description="Unable to connect to KobKlein servers. Please check your internet connection."
      action={onRetry ? { label: "Retry", onClick: onRetry } : undefined}
    />
  );
}

export function NotFoundError({ message }: { message?: string }) {
  return (
    <ErrorMessage
      variant="warning"
      title="Not Found"
      description={message || "The requested resource could not be found."}
    />
  );
}

export function ValidationError({ errors }: { errors: string[] }) {
  return (
    <ErrorMessage
      variant="destructive"
      title="Validation Error"
    >
      <ul className="list-disc list-inside space-y-1">
        {errors.map((error, index) => (
          <li key={index} className="text-sm">
            {error}
          </li>
        ))}
      </ul>
    </ErrorMessage>
  );
}

export function SuccessMessage({ 
  title = "Success!", 
  description,
  onDismiss 
}: { 
  title?: string; 
  description?: string;
  onDismiss?: () => void;
}) {
  return (
    <ErrorMessage
      variant="success"
      title={title}
      description={description}
      dismissible={!!onDismiss}
      onDismiss={onDismiss}
    />
  );
}
