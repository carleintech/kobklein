"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOfflineStorage, usePWA } from "@/contexts/PWAContext";
import { cn } from "@/lib/utils";
import {
  Bell,
  CreditCard,
  Download,
  History,
  Home,
  Menu,
  RefreshCw,
  Scan,
  Send,
  User,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface MobileNavigationProps {
  user?: any;
}

export function MobileNavigation({ user }: MobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const {
    isInstallable,
    isInstalled,
    isOffline,
    showInstallPrompt,
    updateAvailable,
    acceptUpdate,
    connectionType,
    isSlowConnection,
  } = usePWA();

  const { getPendingTransactions } = useOfflineStorage();
  const [pendingCount, setPendingCount] = useState(0);

  // Check for pending transactions
  useEffect(() => {
    const checkPending = async () => {
      const pending = await getPendingTransactions();
      setPendingCount(pending.filter((t) => !t.synced).length);
    };

    checkPending();
    const interval = setInterval(checkPending, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, [getPendingTransactions]);

  // Show install banner on first visit
  useEffect(() => {
    if (
      isInstallable &&
      !isInstalled &&
      !localStorage.getItem("installBannerDismissed")
    ) {
      setShowInstallBanner(true);
    }
  }, [isInstallable, isInstalled]);

  const mainNavItems = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/send",
      icon: Send,
      label: "Send Money",
      active: pathname.includes("/send"),
    },
    {
      href: "/dashboard/scan",
      icon: Scan,
      label: "Scan QR",
      active: pathname.includes("/scan"),
    },
    {
      href: "/dashboard/cards",
      icon: CreditCard,
      label: "Cards",
      active: pathname.includes("/cards"),
    },
    {
      href: "/dashboard/history",
      icon: History,
      label: "History",
      active: pathname.includes("/history"),
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
  ];

  const secondaryNavItems = [
    {
      href: "/dashboard/profile",
      icon: User,
      label: "Profile",
      active: pathname.includes("/profile"),
    },
    {
      href: "/dashboard/notifications",
      icon: Bell,
      label: "Notifications",
      active: pathname.includes("/notifications"),
    },
  ];

  const handleInstallBannerDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem("installBannerDismissed", "true");
  };

  const handleInstallClick = async () => {
    await showInstallPrompt();
    setShowInstallBanner(false);
  };

  return (
    <>
      {/* Install Banner */}
      {showInstallBanner && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground p-3 shadow-lg">
          <div className="flex items-center justify-between max-w-sm mx-auto">
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span className="text-sm font-medium">Install KobKlein App</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleInstallClick}
                className="text-xs h-7"
              >
                Install
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleInstallBannerDismiss}
                className="text-xs h-7 text-primary-foreground/80 hover:text-primary-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Update Banner */}
      {updateAvailable && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white p-3 shadow-lg">
          <div className="flex items-center justify-between max-w-sm mx-auto">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5" />
              <span className="text-sm font-medium">Update Available</span>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={acceptUpdate}
              className="text-xs h-7"
            >
              Update
            </Button>
          </div>
        </div>
      )}
      {/* Top Navigation Bar */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b",
          showInstallBanner || updateAvailable ? "mt-12" : "mt-0"
        )}
      >
        <div className="flex items-center justify-between p-4 max-w-sm mx-auto">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                K
              </span>
            </div>
            <span className="font-bold text-lg">KobKlein</span>
          </Link>

          {/* Connection Status & Menu */}
          <div className="flex items-center space-x-2">
            {/* Connection Status */}
            <div className="flex items-center space-x-1">
              {isOffline ? (
                <WifiOff className="h-4 w-4 text-destructive" />
              ) : (
                <Wifi
                  className={cn(
                    "h-4 w-4",
                    isSlowConnection ? "text-yellow-500" : "text-green-500"
                  )}
                />
              )}
              {pendingCount > 0 && (
                <Badge variant="destructive" className="text-xs px-1 py-0 h-5">
                  {pendingCount}
                </Badge>
              )}
            </div>

            {/* Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b shadow-lg">
            <div className="max-w-sm mx-auto p-4 space-y-4">
              {/* User Info */}
              {user && (
                <div className="flex items-center space-x-3 pb-3 border-b">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {user.name || user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isOffline
                        ? "Offline Mode"
                        : `${connectionType.toUpperCase()} Connection`}
                    </p>
                  </div>
                </div>
              )}

              {/* Secondary Navigation */}
              <div className="space-y-2">
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                        item.active
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* PWA Actions */}
              {!isInstalled && isInstallable && (
                <Button
                  onClick={handleInstallClick}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Install App
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t">
        <div className="flex items-center justify-around py-2 max-w-sm mx-auto">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors relative",
                  item.active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 text-xs px-1 py-0 h-4 min-w-4"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      {/* Spacers for fixed navigation */}
      <div
        className={cn(
          "h-16", // Top spacer
          showInstallBanner || updateAvailable ? "mt-12" : ""
        )}
      />
      <div className="h-20" /> {/* Bottom spacer */}
    </>
  );
}

// Mobile-optimized loading spinner
export function MobileLoadingSpinner({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur">
      <div className="flex flex-col items-center space-y-4 p-6 bg-background rounded-lg shadow-lg border max-w-xs mx-4">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        <p className="text-sm font-medium text-center">{message}</p>
      </div>
    </div>
  );
}

// Mobile-optimized error boundary
export function MobileErrorFallback({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-sm w-full space-y-6 text-center">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-destructive">
            Something went wrong
          </h2>
          <p className="text-sm text-muted-foreground">
            The app encountered an error. You can try refreshing or go back to
            the dashboard.
          </p>
        </div>

        <div className="space-y-3">
          <Button onClick={resetError} className="w-full">
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/dashboard")}
            className="w-full"
          >
            Go to Dashboard
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              Error Details
            </summary>
            <pre className="mt-2 text-xs text-destructive whitespace-pre-wrap break-all">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

