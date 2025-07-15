// File: kobklein/web/src/app/admin/transactions/page.tsx

import { Metadata } from "next";
import { 
  Home, 
  Users, 
  Activity, 
  Shield,
  DollarSign,
  BarChart3,
  Settings,
  HelpCircle,
  Bell,
  MapPin,
  CreditCard,
  Search,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Transaction Management | KobKlein Admin",
  description: "Monitor and manage all KobKlein transactions",
};

// Mock transaction data with comprehensive details
const mockTransactions = [
  {
    id: 'TXN_001',
    type: 'refill' as const,
    amount: 25000.00,
    currency: 'HTG',
    fee: 1250.00,
    netAmount: 23750.00,
    fromUser: {
      id: 'USR_DIA_001',
      name: 'Sarah Williams',
      role: 'diaspora',
      location: 'Miami, FL',
    },
    toUser: {
      id: 'USR_CLI_045',
      name: 'Marie Dubois',
      role: 'client',
      location: 'Port-au-Prince',
    },
    status: 'completed' as const,
    timestamp: '2025-01-13T16:45:00Z',
    method: 'apple_pay',
    reference: 'REF_2025_001',
    notes: 'Monthly family support',
    flags: [],
  },
  {
    id: 'TXN_002',
    type: 'payment' as const,
    amount: 1500.00,
    currency: 'HTG',
    fee: 0,
    netAmount: 1500.00,
    fromUser: {
      id: 'USR_CLI_045',
      name: 'Marie Dubois',
      role: 'client',
      location: 'Port-au-Prince',
    },
    toUser: {
      id: 'USR_MER_123',
      name: 'Ti Jan Market',
      role: 'merchant',
      location: 'Delmas 31',
    },
    status: 'completed' as const,
    timestamp: '2025-01-13T16:30:00Z',
    method: 'nfc_tap',
    reference: 'REF_2025_002',
    notes: 'Grocery purchase',
    flags: [],
  },
  {
    id: 'TXN_003',
    type: 'withdrawal' as const,
    amount: 5000.00,
    currency: 'HTG',
    fee: 250.00,
    netAmount: 4750.00,
    fromUser: {
      id: 'USR_MER_123',
      name: 'Ti Jan Market',
      role: 'merchant',
      location: 'Delmas 31',
    },
    toUser: {
      id: 'USR_DIS_067',
      name: 'Pierre Distributeur',
      role: 'distributor',
      location: 'Port-au-Prince Central',
    },
    status: 'pending' as const,
    timestamp: '2025-01-13T16:15:00Z',
    method: 'cash_out',
    reference: 'REF_2025_003',
    notes: 'Daily cash out request',
    flags: [],
  },
  {
    id: 'TXN_004',
    type: 'refill' as const,
    amount: 75000.00,
    currency: 'HTG',
    fee: 3750.00,
    netAmount: 71250.00,
    fromUser: {
      id: 'USR_DIA_002',
      name: 'Jean-Baptiste Rémy',
      role: 'diaspora',
      location: 'Boston, MA',
    },
    toUser: {
      id: 'USR_CLI_089',
      name: 'Michel Pierre',
      role: 'client',
      location: 'Cap-Haïtien',
    },
    status: 'flagged' as const,
    timestamp: '2025-01-13T16:00:00Z',
    method: 'credit_card',
    reference: 'REF_2025_004',
    notes: 'Large amount flagged for review',
    flags: ['high_amount', 'velocity_check'],
  },
  {
    id: 'TXN_005',
    type: 'transfer' as const,
    amount: 3200.00,
    currency: 'HTG',
    fee: 160.00,
    netAmount: 3040.00,
    fromUser: {
      id: 'USR_CLI_089',
      name: 'Michel Pierre',
      role: 'client',
      location: 'Cap-Haïtien',
    },
    toUser: {
      id: 'USR_CLI_156',
      name: 'Anne Morin',
      role: 'client',
      location: 'Cap-Haïtien',
    },
    status: 'completed' as const,
    timestamp: '2025-01-13T15:45:00Z',
    method: 'wallet_transfer',
    reference: 'REF_2025_005',
    notes: 'Family transfer',
    flags: [],
  },
  {
    id: 'TXN_006',
    type: 'commission' as const,
    amount: 2340.00,
    currency: 'HTG',
    fee: 0,
    netAmount: 2340.00,
    fromUser: {
      id: 'SYSTEM',
      name: 'KobKlein System',
      role: 'system',
      location: 'Automated',
    },
    toUser: {
      id: 'USR_DIS_067',
      name: 'Pierre Distributeur',
      role: 'distributor',
      location: 'Port-au-Prince Central',
    },
    status: 'completed' as const,
    timestamp: '2025-01-13T15:30:00Z',
    method: 'auto_credit',
    reference: 'REF_2025_006',
    notes: 'Weekly commission payout',
    flags: [],
  },
];

const transactionStats = {
  totalToday: 1456,
  volumeToday: 234567.89,
  avgTransaction: 161.08,
  completedRate: 98.7,
  flaggedToday: 23,
  feesCollected: 12456.78,
};

const adminNavigation = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: Home,
  },
  {
    label: 'User Management',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: 'Transactions',
    href: '/admin/transactions',
    icon: Activity,
    isActive: true,
  },
  {
    label: 'Fraud Monitor',
    href: '/admin/fraud',
    icon: Shield,
    badge: 18,
  },
  {
    label: 'Financial Reports',
    href: '/admin/reports',
    icon: DollarSign,
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    label: 'Distributors',
    href: '/admin/distributors',
    icon: MapPin,
  },
  {
    label: 'Card Management',
    href: '/admin/cards',
    icon: CreditCard,
  },
  {
    label: 'Notifications',
    href: '/admin/notifications',
    icon: Bell,
  },
  {
    label: 'System Settings',
    href: '/admin/settings',
    icon: Settings,
  },
  {
    label: 'Support',
    href: '/admin/support',
    icon: HelpCircle,
  },
];

export default function AdminTransactionsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
      <DashboardLayout
        title="Transaction Management"
        userRole="admin"
        navigation={adminNavigation}
        notifications={15}
      >
        <div className="space-y-6">
          {/* Transaction Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transactions Today</p>
                  <h3 className="text-2xl font-bold">{transactionStats.totalToday.toLocaleString()}</h3>
                  <p className="text-xs text-green-600">{transactionStats.completedRate}% completed</p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Volume Today</p>
                  <h3 className="text-xl font-bold">{formatCurrency(transactionStats.volumeToday, 'HTG')}</h3>
                  <p className="text-xs text-muted-foreground">
                    Avg: {formatCurrency(transactionStats.avgTransaction, 'HTG')}
                  </p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fees Collected</p>
                  <h3 className="text-xl font-bold">{formatCurrency(transactionStats.feesCollected, 'HTG')}</h3>
                  <p className="text-xs text-muted-foreground">
                    {((transactionStats.feesCollected / transactionStats.volumeToday) * 100).toFixed(1)}% rate
                  </p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Flagged Today</p>
                  <h3 className="text-2xl font-bold">{transactionStats.flaggedToday}</h3>
                  <p className="text-xs text-red-600">Requires review</p>
                </div>
              </div>
            </KobKleinCard>
          </div>

          {/* Transaction Filters and Controls */}
          <KobKleinCard className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                  />
                </div>
                
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent">
                  <option value="">All Types</option>
                  <option value="refill">Refills</option>
                  <option value="payment">Payments</option>
                  <option value="withdrawal">Withdrawals</option>
                  <option value="transfer">Transfers</option>
                  <option value="commission">Commissions</option>
                </select>

                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent">
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="flagged">Flagged</option>
                  <option value="failed">Failed</option>
                </select>

                <input
                  type="date"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                />
              </div>

              <div className="flex space-x-2">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Filter className="h-4 w-4" />
                  <span>More Filters</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-kobklein-accent text-white rounded-lg hover:bg-kobklein-accent/90 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </KobKleinCard>

          {/* Transactions Table */}
          <KobKleinCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Showing {mockTransactions.length} of 1,456 transactions</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Transaction</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">From</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">To</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Time</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-sm">{transaction.id}</p>
                          <p className="text-xs text-muted-foreground">{transaction.reference}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge 
                          variant="outline"
                          className={
                            transaction.type === 'refill' ? 'text-blue-600 border-blue-200' :
                            transaction.type === 'payment' ? 'text-green-600 border-green-200' :
                            transaction.type === 'withdrawal' ? 'text-orange-600 border-orange-200' :
                            transaction.type === 'transfer' ? 'text-purple-600 border-purple-200' :
                            'text-gray-600 border-gray-200'
                          }
                        >
                          {transaction.type}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm font-medium">{transaction.fromUser.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.fromUser.role} • {transaction.fromUser.location}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm font-medium">{transaction.toUser.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.toUser.role} • {transaction.toUser.location}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm font-bold">{formatCurrency(transaction.amount, transaction.currency)}</p>
                          {transaction.fee > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Fee: {formatCurrency(transaction.fee, transaction.currency)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className={
                              transaction.status === 'completed' ? 'text-green-600 border-green-200' :
                              transaction.status === 'pending' ? 'text-yellow-600 border-yellow-200' :
                              transaction.status === 'flagged' ? 'text-red-600 border-red-200' :
                              'text-gray-600 border-gray-200'
                            }
                          >
                            {transaction.status}
                          </Badge>
                          {transaction.flags.length > 0 && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm">{formatDate(transaction.timestamp, { includeTime: true })}</p>
                        <p className="text-xs text-muted-foreground">{transaction.method}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                            <Eye className="h-4 w-4" />
                          </button>
                          {transaction.status === 'flagged' && (
                            <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                              <AlertTriangle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing 1-{mockTransactions.length} of 1,456 transactions
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-kobklein-accent text-white rounded text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </KobKleinCard>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}