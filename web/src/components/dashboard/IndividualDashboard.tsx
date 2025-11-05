"use client";

/**
 * Individual Dashboard Component
 * Dashboard for INDIVIDUAL user role
 * Uses the same layout and functionality as the client dashboard
 */

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { QuickActions } from "@/components/dashboards/client/quick-actions";
import { WalletOverview } from "@/components/dashboards/client/wallet-overview";
import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { UserRole } from "@/types/auth";
import { CreditCard } from "lucide-react";
import { useParams } from "next/navigation";

// Mock data - replace with real data fetching
const mockWalletData = {
  balance: {
    htg: 0,
    usd: 0,
  },
  monthlyChange: {
    amount: 0,
    percentage: 0,
    isPositive: true,
  },
  lastTransaction: {
    amount: 0,
    type: "received" as const,
    date: "No transactions yet",
  },
};

// Create locale-aware navigation
const getIndividualNavigation = (locale: string) => [
  {
    label: "Dashboard",
    href: `/${locale}/dashboard/individual`,
    icon: "Home" as const,
    isActive: true,
  },
  {
    label: "Transactions",
    href: `/${locale}/dashboard/individual/transactions`,
    icon: "History" as const,
  },
  {
    label: "Pay",
    href: `/${locale}/dashboard/individual/pay`,
    icon: "CreditCard" as const,
  },
  {
    label: "Receive",
    href: `/${locale}/dashboard/individual/receive`,
    icon: "Receipt" as const,
  },
  {
    label: "Exchange",
    href: `/${locale}/dashboard/individual/exchange`,
    icon: "ArrowLeftRight" as const,
  },
  {
    label: "Help",
    href: `/${locale}/dashboard/individual/help`,
    icon: "HelpCircle" as const,
  },
];

export default function IndividualDashboard() {
  const params = useParams();
  const locale = String(params?.locale || "en");
  const navigation = getIndividualNavigation(locale);

  return (
    <ProtectedRoute allowedRoles={[UserRole.INDIVIDUAL]}>
      <DashboardLayout
        title="Dashboard"
        userRole={UserRole.INDIVIDUAL}
        navigation={navigation}
        walletBalance={mockWalletData.balance}
        notifications={0}
      >
        <div className="space-y-6">
          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-kobklein-accent to-blue-600 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Welcome to KobKlein!</h2>
            <p className="opacity-90">
              Manage your digital wallet, make payments, and track your
              transactions with KobKlein.
            </p>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Wallet & Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Wallet Overview */}
              <WalletOverview
                fallbackBalance={mockWalletData.balance}
                fallbackMonthlyChange={mockWalletData.monthlyChange}
                fallbackLastTransaction={mockWalletData.lastTransaction}
              />

              {/* Quick Actions */}
              <QuickActions />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1">
              <div className="p-6 text-center text-muted-foreground">
                No recent transactions
              </div>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-blue-500" />
                <span className="text-blue-700 font-medium">Get Started</span>
              </div>
              <p className="text-blue-600 text-sm mt-1">
                Complete your profile to activate your wallet
              </p>
            </div>

            {/* Verification Status */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-yellow-700 font-medium">
                  Verification Pending
                </span>
              </div>
              <p className="text-yellow-600 text-sm mt-1">
                Complete KYC verification to unlock all features
              </p>
            </div>

            {/* Security */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium">
                  Secure Account
                </span>
              </div>
              <p className="text-green-600 text-sm mt-1">
                Your account is protected with bank-level security
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
