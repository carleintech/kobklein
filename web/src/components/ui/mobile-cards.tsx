"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePWA } from "@/contexts/PWAContext";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Shield,
  TrendingDown,
  TrendingUp,
  WifiOff,
  Zap,
} from "lucide-react";
import React from "react";

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  loading?: boolean;
  error?: string;
  offline?: boolean;
}

export function MobileCard({
  children,
  className,
  interactive = false,
  loading = false,
  error,
  offline = false,
}: MobileCardProps) {
  const { isOffline } = usePWA();

  return (
    <Card
      className={cn(
        "pwa-card transition-all duration-200",
        interactive &&
          "hover:shadow-md active:scale-[0.98] cursor-pointer touch-feedback",
        (error || offline || isOffline) && "border-destructive/50",
        loading && "animate-pulse",
        className
      )}
    >
      {(error || offline || isOffline) && (
        <div className="absolute top-2 right-2">
          {isOffline ? (
            <WifiOff className="h-4 w-4 text-destructive" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          )}
        </div>
      )}
      {children}
    </Card>
  );
}

// Quick Action Card
interface QuickActionCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  onClick: () => void;
  disabled?: boolean;
  badge?: string | number;
  variant?: "default" | "primary" | "success" | "warning" | "destructive";
}

export function QuickActionCard({
  icon: Icon,
  title,
  description,
  onClick,
  disabled = false,
  badge,
  variant = "default",
}: QuickActionCardProps) {
  return (
    <MobileCard
      interactive
      className={cn(
        "relative overflow-hidden",
        variant === "primary" && "bg-primary/5 border-primary/20",
        variant === "success" && "bg-green-500/5 border-green-500/20",
        variant === "warning" && "bg-yellow-500/5 border-yellow-500/20",
        variant === "destructive" && "bg-destructive/5 border-destructive/20",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full h-full p-4 text-left"
      >
        <div className="flex items-center space-x-3">
          <div
            className={cn(
              "p-2 rounded-lg",
              variant === "primary" && "bg-primary text-primary-foreground",
              variant === "success" && "bg-green-500 text-white",
              variant === "warning" && "bg-yellow-500 text-white",
              variant === "destructive" &&
                "bg-destructive text-destructive-foreground",
              variant === "default" && "bg-accent text-accent-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{title}</h3>
            {description && (
              <p className="text-xs text-muted-foreground truncate">
                {description}
              </p>
            )}
          </div>

          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}

          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>
      </button>
    </MobileCard>
  );
}

// Balance Card
interface BalanceCardProps {
  title: string;
  amount: string;
  currency?: string;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
    period: string;
  };
  loading?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "outline";
  }>;
}

export function BalanceCard({
  title,
  amount,
  currency = "USD",
  change,
  loading,
  actions,
}: BalanceCardProps) {
  return (
    <MobileCard
      loading={loading}
      className="bg-gradient-to-r from-primary/10 to-accent/10"
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="space-y-1">
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="h-8 w-32 bg-muted rounded shimmer" />
            ) : (
              `${amount} ${currency}`
            )}
          </div>

          {change && !loading && (
            <div className="flex items-center space-x-1 text-sm">
              {change.trend === "up" && (
                <TrendingUp className="h-4 w-4 text-green-500" />
              )}
              {change.trend === "down" && (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span
                className={cn(
                  "font-medium",
                  change.trend === "up" && "text-green-500",
                  change.trend === "down" && "text-destructive",
                  change.trend === "neutral" && "text-muted-foreground"
                )}
              >
                {change.value}
              </span>
              <span className="text-muted-foreground">{change.period}</span>
            </div>
          )}
        </div>

        {actions && actions.length > 0 && (
          <div className="flex space-x-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                size="sm"
                variant={action.variant || "default"}
                onClick={action.onClick}
                className="flex-1"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </MobileCard>
  );
}

// Transaction Card
interface TransactionCardProps {
  id: string;
  type: "send" | "receive" | "topup" | "payment";
  amount: string;
  currency?: string;
  recipient?: string;
  description?: string;
  timestamp: Date;
  status: "pending" | "completed" | "failed" | "cancelled";
  onClick?: () => void;
}

export function TransactionCard({
  id,
  type,
  amount,
  currency = "USD",
  recipient,
  description,
  timestamp,
  status,
  onClick,
}: TransactionCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "cancelled":
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case "send":
        return <TrendingUp className="h-5 w-5 text-destructive rotate-45" />;
      case "receive":
        return <TrendingDown className="h-5 w-5 text-green-500 rotate-45" />;
      case "topup":
        return <Zap className="h-5 w-5 text-primary" />;
      case "payment":
        return <Shield className="h-5 w-5 text-accent" />;
    }
  };

  return (
    <MobileCard interactive={!!onClick}>
      <button
        onClick={onClick}
        disabled={!onClick}
        className="w-full p-4 text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-accent/10">{getTypeIcon()}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-sm truncate">
                  {recipient ||
                    (type === "send"
                      ? "Money Sent"
                      : type === "receive"
                      ? "Money Received"
                      : type === "topup"
                      ? "Account Top-up"
                      : "Payment")}
                </h3>
                {getStatusIcon()}
              </div>

              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground truncate">
                  {description || timestamp.toLocaleDateString()}
                </p>
                <span
                  className={cn(
                    "text-sm font-medium",
                    type === "send" ? "text-destructive" : "text-green-500"
                  )}
                >
                  {type === "send" ? "-" : "+"}
                  {amount} {currency}
                </span>
              </div>
            </div>
          </div>

          {onClick && (
            <ArrowRight className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
          )}
        </div>
      </button>
    </MobileCard>
  );
}

// Notification Card
interface NotificationCardProps {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "outline";
  }>;
  onMarkAsRead?: () => void;
  onDismiss?: () => void;
}

export function NotificationCard({
  id,
  title,
  message,
  type,
  timestamp,
  read = false,
  actions,
  onMarkAsRead,
  onDismiss,
}: NotificationCardProps) {
  const getTypeIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default:
        return <Shield className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <MobileCard
      className={cn("relative", !read && "border-l-4 border-l-primary")}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            {getTypeIcon()}

            <div className="flex-1 min-w-0">
              <h3
                className={cn("font-medium text-sm", !read && "font-semibold")}
              >
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{message}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {timestamp.toLocaleString()}
              </p>
            </div>
          </div>

          {(onMarkAsRead || onDismiss) && (
            <Button
              size="sm"
              variant="ghost"
              className="p-1 h-auto"
              onClick={onDismiss || onMarkAsRead}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
        </div>

        {actions && actions.length > 0 && (
          <div className="flex space-x-2 mt-4">
            {actions.map((action, index) => (
              <Button
                key={index}
                size="sm"
                variant={action.variant || "outline"}
                onClick={action.onClick}
                className="flex-1"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </MobileCard>
  );
}

