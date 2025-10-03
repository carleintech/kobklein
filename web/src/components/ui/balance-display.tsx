"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "./enhanced-button";

interface BalanceDisplayProps {
  balance: number;
  currency?: 'HTG' | 'USD';
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  variant?: 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error';
  showCurrency?: boolean;
  allowToggle?: boolean;
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: 'text-lg',
  base: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
  '2xl': 'text-4xl font-bold'
};

const variantClasses = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  accent: 'text-kobklein-accent',
  success: 'text-kobklein-success',
  warning: 'text-kobklein-warning',
  error: 'text-kobklein-error'
};

export function BalanceDisplay({
  balance,
  currency = 'HTG',
  size = 'xl',
  variant = 'default',
  showCurrency = true,
  allowToggle = true,
  className,
  label = 'Balance'
}: BalanceDisplayProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  const formattedBalance = React.useMemo(() => {
    if (!isVisible) return '••••••';
    return formatCurrency(balance, currency, 'en-HT', showCurrency);
  }, [balance, currency, showCurrency, isVisible]);

  return (
    <div className={cn("text-center space-y-2", className)}>
      {label && (
        <div className="text-sm text-muted-foreground font-medium">
          {label}
        </div>
      )}
      
      <div className="flex items-center justify-center gap-3">
        <span 
          className={cn(
            "font-medium tabular-nums tracking-tight",
            sizeClasses[size],
            variantClasses[variant]
          )}
        >
          {formattedBalance}
        </span>
        
        {allowToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(!isVisible)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            {isVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      
      {currency === 'HTG' && balance > 0 && (
        <div className="text-xs text-muted-foreground">
          ≈ {formatCurrency(balance / 132.50, 'USD')}
        </div>
      )}
    </div>
  );
}
