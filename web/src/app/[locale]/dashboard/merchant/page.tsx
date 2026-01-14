import { BarChart3, CreditCard, Users } from "lucide-react";
import { Metadata } from "next";

import { MerchantTransactions } from "@/components/dashboards/merchant/merchant-transactions";
import { POSInterface } from "@/components/dashboards/merchant/pos-interface";
import { SalesOverview } from "@/components/dashboards/merchant/sales-overview";
import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { UserRole } from "@/types/auth";

export const metadata: Metadata = {
  title: "Merchant Dashboard | KobKlein",
  description: "Accept payments and manage your business with KobKlein",
};

// Mock data - replace with real data fetching
const mockSalesData = {
  todaySales: {
    htg: 8420.5,
    usd: 68.25,
    transactions: 24,
    customers: 18,
  },
  weeklyChange: {
    revenue: 1240.75,
    percentage: 12.4,
    isPositive: true,
  },
  monthlyStats: {
    revenue: 125420.5,
    transactions: 324,
    averageTransaction: 387.1,
  },
};

const mockMerchantTransactions = [
  {
    id: "1",
    type: "sale" as const,
    amount: 450.0,
    currency: "HTG" as const,
    description: "Grocery purchase",
    date: "2025-01-13T14:30:00Z",
    status: "completed" as const,
    customerName: "Jean Baptiste",
    customerPhone: "+509 1234 5678",
    paymentMethod: "nfc" as const,
    receiptNumber: "RCP001",
  },
  {
    id: "2",
    type: "sale" as const,
    amount: 150.0,
    currency: "HTG" as const,
    description: "Coffee and pastry",
    date: "2025-01-13T12:15:00Z",
    status: "completed" as const,
    customerName: "Marie Dubois",
    paymentMethod: "qr" as const,
    receiptNumber: "RCP002",
  },
  {
    id: "3",
    type: "sale" as const,
    amount: 75.0,
    currency: "HTG" as const,
    description: "Water bottle",
    date: "2025-01-13T11:45:00Z",
    status: "completed" as const,
    paymentMethod: "nfc" as const,
    receiptNumber: "RCP003",
  },
  {
    id: "4",
    type: "refund" as const,
    amount: 200.0,
    currency: "HTG" as const,
    description: "Returned item",
    date: "2025-01-13T10:20:00Z",
    status: "completed" as const,
    customerName: "Pierre Joseph",
    paymentMethod: "manual" as const,
    receiptNumber: "REF001",
  },
  {
    id: "5",
    type: "settlement" as const,
    amount: 5000.0,
    currency: "HTG" as const,
    description: "Daily settlement",
    date: "2025-01-12T18:00:00Z",
    status: "completed" as const,
    paymentMethod: "manual" as const,
  },
];

const merchantNavigation = [
  {
    label: "Dashboard",
    href: "/dashboard/merchant",
    icon: "Home" as const,
    isActive: true,
  },
  {
    label: "POS",
    href: "/dashboard/merchant/pos",
    icon: "CreditCard" as const,
  },
  {
    label: "Transactions",
    href: "/dashboard/merchant/transactions",
    icon: "Receipt" as const,
  },
  {
    label: "Analytics",
    href: "/dashboard/merchant/analytics",
    icon: "BarChart3" as const,
  },
  {
    label: "Customers",
    href: "/dashboard/merchant/customers",
    icon: "Users" as const,
  },
  {
    label: "Wallet",
    href: "/dashboard/merchant/wallet",
    icon: "Wallet" as const,
  },
  {
    label: "Settings",
    href: "/dashboard/merchant/settings",
    icon: "Settings" as const,
  },
  {
    label: "Help",
    href: "/dashboard/merchant/help",
    icon: "HelpCircle" as const,
  },
];

export default function MerchantDashboard() {
  return (
    <SupabaseProtectedRoute allowedRoles={[UserRole.MERCHANT]}>
      <DashboardLayout
        title="Merchant Dashboard"
        userRole={UserRole.MERCHANT}
        navigation={merchantNavigation}
        walletBalance={{
          htg: mockSalesData.todaySales.htg,
          usd: mockSalesData.todaySales.usd,
        }}
        notifications={5}
      >
        <div className="space-y-6">
          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">
              Welcome to your Business Dashboard!
            </h2>
            <p className="opacity-90">
              Accept payments, track sales, and manage your customers with
              KobKlein&apos;s merchant tools.
            </p>
          </div>

          {/* Sales Overview */}
          <SalesOverview
            todaySales={mockSalesData.todaySales}
            weeklyChange={mockSalesData.weeklyChange}
            monthlyStats={mockSalesData.monthlyStats}
          />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - POS Interface */}
            <div className="lg:col-span-1">
              <POSInterface />
            </div>

            {/* Right Column - Recent Transactions */}
            <div className="lg:col-span-2">
              <MerchantTransactions transactions={mockMerchantTransactions} />
            </div>
          </div>

          {/* Business Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Peak Hours */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span className="text-blue-700 font-medium">Peak Hours</span>
              </div>
              <p className="text-blue-600 text-sm mt-1">
                Most sales between 12PM - 2PM
              </p>
            </div>

            {/* Top Payment Method */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-purple-500" />
                <span className="text-purple-700 font-medium">
                  Popular Payment
                </span>
              </div>
              <p className="text-purple-600 text-sm mt-1">
                NFC Tap payments (67% of sales)
              </p>
            </div>

            {/* Customer Retention */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-green-500" />
                <span className="text-green-700 font-medium">
                  Customer Return
                </span>
              </div>
              <p className="text-green-600 text-sm mt-1">
                85% customer return rate this month
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </SupabaseProtectedRoute>
  );
}
