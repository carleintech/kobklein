// File: kobklein/web/src/app/merchant/transactions/page.tsx

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
import { MerchantTransactions } from "@/components/dashboards/merchant/merchant-transactions";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const metadata: Metadata = {
  title: "Transactions | KobKlein Merchant",
  description: "View and manage your transaction history",
};

// Mock data with more transactions for the full transaction page
const mockAllTransactions = [
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
  {
    id: 'TXN_007',
    amount: 320.00,
    currency: 'HTG' as const,
    customer: {
      name: 'Emma Thompson',
      phone: '+1 555 987 6543',
    },
    method: 'qr' as const,
    status: 'completed' as const,
    date: '2025-01-12T18:20:00Z',
    note: 'Dinner for two',
    fee: 6.40,
    netAmount: 313.60,
  },
  {
    id: 'TXN_008',
    amount: 85.00,
    currency: 'HTG' as const,
    customer: {
      name: 'Michel Pierre',
      cardId: 'KK002468',
    },
    method: 'nfc' as const,
    status: 'completed' as const,
    date: '2025-01-12T16:10:00Z',
    fee: 1.70,
    netAmount: 83.30,
  },
  {
    id: 'TXN_009',
    amount: 150.00,
    currency: 'HTG' as const,
    customer: {
      phone: '+509 3579 2468',
    },
    method: 'manual' as const,
    status: 'refunded' as const,
    date: '2025-01-12T14:30:00Z',
    note: 'Customer complaint - food quality',
    fee: 0,
    netAmount: -150.00,
  },
  {
    id: 'TXN_010',
    amount: 275.00,
    currency: 'HTG' as const,
    customer: {
      name: 'Lisa Garcia',
      phone: '+1 555 246 8135',
    },
    method: 'qr' as const,
    status: 'completed' as const,
    date: '2025-01-12T13:15:00Z',
    fee: 5.50,
    netAmount: 269.50,
  },
];

const merchantNavigation = [
  {
    label: 'Dashboard',
    href: '/merchant/dashboard',
    icon: Home,
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
    isActive: true,
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

export default function MerchantTransactionsPage() {
  return (
    <ProtectedRoute allowedRoles={['merchant', 'admin', 'super_admin']}>
      <DashboardLayout
        title="Transaction History"
        userRole="merchant"
        navigation={merchantNavigation}
        walletBalance={{
          htg: 12450.75,
          usd: 102.25,
        }}
        notifications={5}
      >
        <div className="space-y-6">
          {/* Transaction Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium">Completed</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {mockAllTransactions.filter(t => t.status === 'completed').length}
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-yellow-700 font-medium">Pending</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {mockAllTransactions.filter(t => t.status === 'pending').length}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-700 font-medium">Failed</span>
              </div>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {mockAllTransactions.filter(t => t.status === 'failed').length}
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">Refunded</span>
              </div>
              <p className="text-2xl font-bold text-gray-600 mt-1">
                {mockAllTransactions.filter(t => t.status === 'refunded').length}
              </p>
            </div>
          </div>

          {/* Full Transaction List */}
          <MerchantTransactions transactions={mockAllTransactions} />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}