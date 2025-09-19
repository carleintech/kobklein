"use client";

import { useLocale, useTranslations } from "next-intl";
import * as React from "react";
import { cn, formatCurrency } from "../../lib/utils";

interface CurrencyDisplayProps {
  amount: number;
  currency?: "HTG" | "USD";
  className?: string;
  showSymbol?: boolean;
  size?: "sm" | "base" | "lg" | "xl" | "2xl";
  variant?: "default" | "muted" | "accent" | "success" | "warning" | "error";
}

export function CurrencyDisplay({
  amount,
  currency = "HTG",
  className,
  showSymbol = true,
  size = "base",
  variant = "default",
}: CurrencyDisplayProps) {
  const locale = useLocale();
  const t = useTranslations("currency");

  const sizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl font-bold",
  };

  const variantClasses = {
    default: "text-foreground",
    muted: "text-muted-foreground",
    accent: "text-kobklein-accent",
    success: "text-kobklein-success",
    warning: "text-kobklein-warning",
    error: "text-kobklein-error",
  };

  // Format the currency based on locale
  const formattedAmount = React.useMemo(() => {
    try {
      return formatCurrency(amount, currency, locale);
    } catch (error) {
      // Fallback formatting
      return `${amount.toLocaleString()} ${currency}`;
    }
  }, [amount, currency, locale]);

  return (
    <span
      className={cn(
        "font-medium tabular-nums",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      title={`${amount} ${currency === "HTG" ? t("gourdes") : "USD"}`}
    >
      {showSymbol ? formattedAmount : amount.toLocaleString()}
      {!showSymbol && (
        <span className="ml-1 text-sm opacity-75">
          {currency === "HTG" ? "G" : "$"}
        </span>
      )}
    </span>
  );
}

// Balance display component for wallets
interface BalanceDisplayProps {
  balance: number;
  className?: string;
  showCurrency?: boolean;
  size?: "sm" | "base" | "lg" | "xl" | "2xl";
}

export function BalanceDisplay({
  balance,
  className,
  showCurrency = true,
  size = "xl",
}: BalanceDisplayProps) {
  const t = useTranslations("currency");

  return (
    <div className={cn("text-center", className)}>
      {showCurrency && (
        <div className="text-sm text-muted-foreground mb-1">{t("balance")}</div>
      )}
      <CurrencyDisplay
        amount={balance}
        currency="HTG"
        size={size}
        variant="default"
        className="tracking-tight"
      />
    </div>
  );
}
