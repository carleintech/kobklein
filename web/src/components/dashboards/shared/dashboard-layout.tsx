"use client";

import { useAuth } from "@/contexts/SupabaseAuthContext";
import {
    Activity,
    ArrowLeftRight,
    BarChart3,
    Bell,
    CreditCard,
    Database,
    FileText,
    Globe,
    HelpCircle,
    History,
    Home,
    LogOut,
    MapPin,
    Menu,
    Package,
    Receipt,
    Send,
    Settings,
    Shield,
    Truck,
    User,
    Users,
    Wallet,
    X,
} from "lucide-react";
import { useState } from "react";

import { RoleBadge } from "@/components/auth/role-badge";
import { Button } from "@/components/ui/enhanced-button";
import {
    RealtimeTransactionNotification,
    WebSocketIndicator,
} from "@/components/ui/websocket-indicator";
import { formatCurrency } from "@/lib/utils";
import type { UserRole } from "@/types/auth";

// Icon mapping to prevent serialization issues
const iconMap = {
  Activity,
  ArrowLeftRight,
  BarChart3,
  Bell,
  CreditCard,
  Database,
  FileText,
  Globe,
  HelpCircle,
  History,
  Home,
  LogOut,
  MapPin,
  Menu,
  Package,
  Receipt,
  Send,
  Settings,
  Shield,
  Truck,
  User,
  Users,
  Wallet,
  X,
};

type IconName = keyof typeof iconMap;

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  userRole: UserRole;
  navigation: NavigationItem[];
  walletBalance?: {
    htg: number;
    usd: number;
  };
  notifications?: number;
}

interface NavigationItem {
  label: string;
  href: string;
  icon: IconName;
  isActive?: boolean;
  badge?: string | number;
}

export function DashboardLayout({
  children,
  title,
  userRole,
  navigation,
  walletBalance,
  notifications = 0,
}: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCurrencyToggle, setShowCurrencyToggle] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState<"HTG" | "USD">("HTG");

  const { user, signOut } = useAuth();

  const toggleCurrency = () => {
    setDisplayCurrency((prev) => (prev === "HTG" ? "USD" : "HTG"));
  };

  const getDisplayBalance = () => {
    if (!walletBalance) return null;

    const amount =
      displayCurrency === "HTG" ? walletBalance.htg : walletBalance.usd;
    return formatCurrency(amount, displayCurrency);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kobklein-dark via-slate-900 to-kobklein-primary">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-kobklein-dark/95 backdrop-blur-xl border-r border-white/10
        transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-kobklein-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-white font-bold text-xl">KobKlein</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-kobklein-accent rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.email || "User"}
                </p>
                <RoleBadge role={userRole} variant="outline" />
              </div>
            </div>

            {/* Wallet Balance */}
            {walletBalance && (
              <div className="mt-4 p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-4 w-4 text-kobklein-accent" />
                    <span className="text-gray-300 text-sm">Balance</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-gray-400 hover:text-white"
                    onClick={toggleCurrency}
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    {displayCurrency}
                  </Button>
                </div>
                <p className="text-white text-lg font-bold mt-1">
                  {getDisplayBalance()}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200
                    ${
                      item.isActive
                        ? "bg-kobklein-accent text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <a
              href="/settings"
              className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </a>
            <button
              onClick={signOut}
              className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-white"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-white">{title}</h1>
            </div>

            <div className="flex items-center space-x-3">
              {/* WebSocket Status */}
              <WebSocketIndicator showLabel={false} />

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative text-white">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {notifications > 9 ? "9+" : notifications}
                  </span>
                )}
              </Button>

              {/* User Menu (placeholder) */}
              <Button variant="ghost" size="sm" className="text-white">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>

      {/* Real-time notifications */}
      <RealtimeTransactionNotification />
    </div>
  );
}

