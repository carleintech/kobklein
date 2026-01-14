import { CreditCard } from "lucide-react";
import { Metadata } from "next";

import SupabaseProtectedRoute from "@/components/auth/SupabaseProtectedRoute";
import { QuickActions } from "@/components/dashboards/client/quick-actions";
// import { RecentTransactions } from "@/components/dashboards/client/recent-transactions";
import { WalletOverview } from "@/components/dashboards/client/wallet-overview";
import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { UserRole } from "@/types/auth";

export const metadata: Metadata = {
  title: "Dashboard | KobKlein Client",
  description: "Manage your KobKlein wallet and transactions",
};

interface ClientDashboardProps {
  params: {
    locale: string;
  };
}

// Mock data - replace with real data fetching
const mockWalletData = {
  balance: {
    htg: 15420.5,
    usd: 125.75,
  },
  monthlyChange: {
    amount: 2340.25,
    percentage: 18.2,
    isPositive: true,
  },
  lastTransaction: {
    amount: 500.0,
    type: "received" as const,
    date: "Today, 2:30 PM",
  },
};

const mockTransactions = [
  {
    id: "1",
    type: "received" as const,
    amount: 500.0,
    currency: "HTG" as const,
    description: "Refill from Marie (Diaspora)",
    date: "2025-01-13T14:30:00Z",
    status: "completed" as const,
    sender: "Marie Dubois",
  },
  {
    id: "2",
    type: "sent" as const,
    amount: 150.0,
    currency: "HTG" as const,
    description: "Payment to Ti Jan Market",
    date: "2025-01-13T10:15:00Z",
    status: "completed" as const,
    recipient: "Ti Jan Market",
  },
  {
    id: "3",
    type: "refill" as const,
    amount: 1000.0,
    currency: "HTG" as const,
    description: "Card refill at distributor",
    date: "2025-01-12T16:45:00Z",
    status: "completed" as const,
  },
  {
    id: "4",
    type: "sent" as const,
    amount: 75.0,
    currency: "HTG" as const,
    description: "Transport payment",
    date: "2025-01-12T08:20:00Z",
    status: "completed" as const,
    recipient: "Tap Tap Express",
  },
  {
    id: "5",
    type: "received" as const,
    amount: 25.0,
    currency: "USD" as const,
    description: "Payment from Jean for dinner",
    date: "2025-01-11T19:30:00Z",
    status: "completed" as const,
    sender: "Jean Baptiste",
  },
];

// Create locale-aware navigation
const getClientNavigation = (locale: string) => [
  {
    label: "Dashboard",
    href: `/${locale}/dashboard/client`,
    icon: "Home" as const,
    isActive: true,
  },
  {
    label: "Transactions",
    href: `/${locale}/dashboard/client/transactions`,
    icon: "History" as const,
  },
  {
    label: "Pay",
    href: `/${locale}/dashboard/client/pay`,
    icon: "CreditCard" as const,
  },
  {
    label: "Receive",
    href: `/${locale}/dashboard/client/receive`,
    icon: "Receipt" as const,
  },
  {
    label: "Exchange",
    href: `/${locale}/dashboard/client/exchange`,
    icon: "ArrowLeftRight" as const,
  },
  {
    label: "Help",
    href: `/${locale}/dashboard/client/help`,
    icon: "HelpCircle" as const,
  },
];

export default function ClientDashboard({ params }: ClientDashboardProps) {
  const clientNavigation = getClientNavigation(params.locale);

  return (
    <SupabaseProtectedRoute allowedRoles={[UserRole.INDIVIDUAL]}>
      <DashboardLayout
        title="Dashboard"
        userRole={UserRole.INDIVIDUAL}
        navigation={clientNavigation}
        walletBalance={mockWalletData.balance}
        notifications={3}
      >
        <div className="space-y-6">
          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-kobklein-accent to-blue-600 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
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

            {/* Right Column - Recent Transactions */}
            <div className="lg:col-span-1">
              {/* <RecentTransactions transactions={mockTransactions} /> */}
              <div className="p-6 text-center text-muted-foreground">
                Recent Transactions (temporarily disabled)
              </div>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card Security Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium">Card Active</span>
              </div>
              <p className="text-green-600 text-sm mt-1">
                Your KobKlein card is active and ready to use
              </p>
            </div>

            {/* Monthly Spending */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-blue-500" />
                <span className="text-blue-700 font-medium">
                  Monthly Spending
                </span>
              </div>
              <p className="text-blue-600 text-sm mt-1">
                HTG 3,240 spent this month
              </p>
            </div>

            {/* Savings Goal */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="text-purple-700 font-medium">
                  Savings Goal
                </span>
              </div>
              <p className="text-purple-600 text-sm mt-1">
                68% towards HTG 25,000 goal
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </SupabaseProtectedRoute>
  );
}
