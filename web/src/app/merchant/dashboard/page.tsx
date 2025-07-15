// File: kobklein/web/src/app/merchant/dashboard/page.tsx

import { Metadata } from "next";
import { 
  Home, 
  CreditCard, 
  BarChart3, 
  RefreshCw, 
  Settings,
  HelpCircle,
  History,
  Store,
  Users
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { SalesOverview } from "@/components/dashboards/merchant/sales-overview";
import { POSInterface } from "@/components/dashboards/merchant/pos-interface";
import { MerchantTransactions } from "@/components/dashboards/merchant/merchant-transactions";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const metadata: Metadata = {
  title: "Merchant Dashboard | KobKlein",
  description: "Manage your KobKlein merchant account and accept payments",
};

// Mock data - replace with real data fetching
const mockSalesData = {
  todaySales: {
    htg: 12450.75,
    usd: 102.25,
    transactions: 28,
    customers: 19,
  },
  weeklyChange: {
    revenue: 2340.50,
    percentage: 23.1,
    isPositive: true,
  },
  monthlyStats: {
    revenue: 45670.25,
    transactions: 342,
    averageTransaction: 133.54,
  },
};

const mockTransactions = [
  {
    id: 'TXN_001',
    amount: 450.00,
    currency: 'HTG' as const,
    customer: {
      name: 'Marie Dubois',
      phone: '+509 1234 5678',
      cardId: 'KK001234',
    },
    method: 'nfc' as const,
    status: 'completed' as const,
    date: '2025-01-13T16:30:00Z',
    note: 'Lunch order',
    fee: 9.00,
    netAmount: 441.00,
  },
  {
    id: 'TXN_002',
    amount: 125.00,
    currency: 'HTG' as const,
    customer: {
      phone: '+509 8765 4321',
    },
    method: 'qr' as const,
    status: 'completed' as const,
    date: '2025-01-13T15:45:00Z',
    fee: 2.50,
    netAmount: 122.50,
  },
  {
    id: 'TXN_003',
    amount: 75.00,
    currency: 'HTG' as const,
    customer: {
      name: 'Jean Baptiste',
      cardId: 'KK005678',
    },
    method: 'nfc' as const,
    status: 'pending' as const,
    date: '2025-01-13T15:20:00Z',
    fee: 1.50,
    netAmount: 73.50,
  },
  {
    id: 'TXN_004',
    amount: 220.00,
    currency: 'HTG' as const,
    customer: {
      name: 'Sarah Williams',
      phone: '+1 555 123 4567',
    },
    method: 'manual' as const,
    status: 'completed' as const,
    date: '2025-01-13T14:15:00Z',
    note: 'Special order - extra spicy',
    fee: 4.40,
    netAmount: 215.60,
  },
  {
    id: 'TXN_005',
    amount: 180.00,
    currency: 'HTG' as const,
    customer: {
      name: 'Paul Joseph',
      cardId: 'KK009876',
    },
    method: 'nfc' as const,
    status: 'failed' as const,
    date: '2025-01-13T13:30:00Z',
    fee: 0,
    netAmount: 0,
  },
  {
    id: 'TXN_006',
    amount: 95.00,
    currency: 'HTG' as const,
    customer: {
      phone: '+509 2468 1357',
    },
    method: 'qr' as const,
    status: 'completed' as const,
    date: '2025-01-13T12:45:00Z',
    fee: 1.90,
    netAmount: 93.10,
  },
];

const merchantNavigation = [
  {
    label: 'Dashboard',
    href: '/merchant/dashboard',
    icon: Home,
    isActive: true,
  },
  {
    label: 'Accept Payment',
    href: '/merchant/pos',
    icon: CreditCard,
    badge: 'Live',
  },
  {
    label: 'Transactions',
    href: '/merchant/transactions',
    icon: History,
  },
  {
    label: 'Analytics',
    href: '/merchant/analytics',
    icon: BarChart3,
  },
  {
    label: 'Customers',
    href: '/merchant/customers',
    icon: Users,
  },
  {
    label: 'Refill Wallet',
    href: '/merchant/refill',
    icon: RefreshCw,
  },
  {
    label: 'Store Settings',
    href: '/merchant/settings',
    icon: Store,
  },
  {
    label: 'Support',
    href: '/merchant/support',
    icon: HelpCircle,
  },
];

export default function MerchantDashboard() {
  return (
    <ProtectedRoute allowedRoles={['merchant', 'admin', 'super_admin']}>
      <DashboardLayout
        title="Merchant Dashboard"
        userRole="merchant"
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Good afternoon, Ti Jan Market!</h2>
                <p className="opacity-90">
                  You've processed {mockSalesData.todaySales.transactions} transactions today. 
                  Keep up the great work!
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Store className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Sales Overview */}
          <SalesOverview
            todaySales={mockSalesData.todaySales}
            weeklyChange={mockSalesData.weeklyChange}
            monthlyStats={mockSalesData.monthlyStats}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - POS Interface */}
            <div className="xl:col-span-1">
              <POSInterface />
            </div>

            {/* Right Column - Recent Transactions */}
            <div className="xl:col-span-2">
              <MerchantTransactions transactions={mockTransactions} />
            </div>
          </div>

          {/* Business Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Peak Hours */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <span className="text-blue-700 font-medium">Peak Hours</span>
              </div>
              <p className="text-blue-600 text-sm mt-1">
                Busiest: 12-2 PM (8 transactions)
              </p>
              <div className="mt-2 w-full bg-blue-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            {/* Popular Payment Method */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-purple-500" />
                <span className="text-purple-700 font-medium">Most Used</span>
              </div>
              <p className="text-purple-600 text-sm mt-1">
                NFC Tap: 68% of payments
              </p>
              <div className="mt-2 w-full bg-purple-100 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>

            {/* Average Transaction */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-amber-500 rounded-full"></div>
                <span className="text-amber-700 font-medium">Avg Transaction</span>
              </div>
              <p className="text-amber-600 text-sm mt-1">
                HTG {(mockSalesData.todaySales.htg / mockSalesData.todaySales.transactions).toFixed(0)} per sale
              </p>
              <p className="text-xs text-amber-600 mt-1">
                +15% vs last week
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <RefreshCw className="h-6 w-6 text-gray-600 mb-2" />
                <span className="text-sm font-medium">Request Refill</span>
              </button>
              
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <BarChart3 className="h-6 w-6 text-gray-600 mb-2" />
                <span className="text-sm font-medium">View Analytics</span>
              </button>
              
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-6 w-6 text-gray-600 mb-2" />
                <span className="text-sm font-medium">Customer List</span>
              </button>
              
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="h-6 w-6 text-gray-600 mb-2" />
                <span className="text-sm font-medium">Store Settings</span>
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}