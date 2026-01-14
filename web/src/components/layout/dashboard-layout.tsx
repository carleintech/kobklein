"use client";

import { ErrorBoundary } from "@/components/ui/error-boundary";
import { usePWA } from "@/contexts/PWAContext";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { cn } from "@/lib/utils";
import React from "react";
import { MobileErrorFallback, MobileNavigation } from "./mobile-navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const { isInstalled } = usePWA();

  const ErrorFallback = ({
    error,
    reset,
  }: {
    error: Error;
    reset: () => void;
  }) => <MobileErrorFallback error={error} resetError={reset} />;

  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <div
        className={cn(
          "min-h-screen bg-background",
          isInstalled && "pt-safe-top pb-safe-bottom" // Account for safe areas on installed PWA
        )}
      >
        <MobileNavigation user={user} />

        {/* Main content with proper spacing for mobile navigation */}
        <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
}

// Mobile-optimized container for dashboard content
export function DashboardContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-6", className)}>{children}</div>;
}

// Mobile-optimized section component
export function DashboardSection({
  title,
  children,
  actions,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between">
          {title && (
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          )}
          {actions && <div>{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

// Mobile-optimized grid layout
export function DashboardGrid({
  children,
  cols = 2,
  className,
}: {
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        cols === 1 && "grid-cols-1",
        cols === 2 && "grid-cols-2",
        cols === 3 && "grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}
