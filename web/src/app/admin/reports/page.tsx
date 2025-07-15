// File: kobklein/web/src/app/admin/reports/page.tsx

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
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  PieChart
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Financial Reports | KobKlein Admin",
  description: "Comprehensive financial reports and analytics",
};

// Mock financial report data
const mockFinancialData = {
  overview: {
    totalRevenue: 2456789.45,
    totalFees: 123456.78,
    totalVolume: 45698234.50,
    activeWallets: 15847,
    monthlyGrowth: 23.4,
    revenueGrowth: 18.7,
  },
  revenueStreams: [
    {
      source: 'Transaction Fees',
      amount: 89456.78,
      percentage: 42.3,
      change: 12.5,
    },
    {
      source: 'Diaspora Remittance Fees',
      amount: 67890.12,
      percentage: 32.1,
      change: 8.9,
    },
    {
      source: 'Card Sales',
      amount: 34567.89,
      percentage: 16.3,
      change: -2.1,
    },
    {
      source: 'Withdrawal Fees',
      amount: 19543.21,
      percentage: 9.3,
      change: 15.7,
    },
  ],
  monthlyData: [
    { month: 'Jul 2024', revenue: 145678.90, volume: 3456789.12, users: 12456 },
    { month: 'Aug 2024', revenue: 156789.01, volume: 3678901.23, users: 13234 },
    { month: 'Sep 2024', revenue: 167890.12, volume: 3890123.34, users: 13987 },
    { month: 'Oct 2024', revenue: 178901.23, volume: 4123456.45, users: 14567 },
    { month: 'Nov 2024', revenue: 189012.34, volume: 4356789.56, users: 15123 },
    { month: 'Dec 2024', revenue: 200123.45, volume: 4589012.67, users: 15689 },
    { month: 'Jan 2025', revenue: 211234.56, volume: 4821345.78, users: 15847 },
  ],
  regionPerformance: [
    {
      region: 'Port-au-Prince',
      revenue: 98765.43,
      volume: 2345678.90,
      users: 8456,
      growth: 15.2,
    },
    {
      region: 'Cap-Haïtien',
      revenue: 45678.90,
      volume: 1234567.89,
      users: 2234,
      growth: 12.8,
    },
    {
      region: 'Pétion-Ville',
      revenue: 34567.89,
      volume: 987654.32,
      users: 1890,
      growth: 18.6,
    },
    {
      region: 'Delmas',
      revenue: 23456.78,
      volume: 765432.10,
      users: 1567,
      growth: 9.4,
    },
    {
      region: 'Other',
      revenue: 8765.43,
      volume: 345678.90,
      users: 1700,
      growth: 7.1,
    },
  ],
  expenseBreakdown: [
    { category: 'Infrastructure', amount: 45678.90, percentage: 35.2 },
    { category: 'Staff Salaries', amount: 38901.23, percentage: 30.0 },
    { category: 'Marketing', amount: 19450.56, percentage: 15.0 },
    { category: 'Card Production', amount: 12967.04, percentage: 10.0 },
    { category: 'Legal & Compliance', amount: 9675.33, percentage: 7.5 },
    { category: 'Other', amount: 3252.67, percentage: 2.5 },
  ],
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
    isActive: true,
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

export default function AdminReportsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
      <DashboardLayout
        title="Financial Reports"
        userRole="admin"
        navigation={adminNavigation}
        notifications={15}
      >
        <div className="space-y-6">
          {/* Report Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Financial Reports</h2>
              <p className="text-muted-foreground">Comprehensive financial analytics and insights</p>
            </div>
            <div className="flex space-x-2">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent">
                <option value="monthly">Monthly View</option>
                <option value="quarterly">Quarterly View</option>
                <option value="yearly">Yearly View</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 bg-kobklein-accent text-white rounded-lg hover:bg-kobklein-accent/90 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export Reports</span>
              </button>
            </div>
          </div>

          {/* Key Financial Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <h3 className="text-xl font-bold">{formatCurrency(mockFinancialData.overview.totalRevenue, 'HTG')}</h3>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">+{mockFinancialData.overview.revenueGrowth}%</span>
                  </div>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transaction Volume</p>
                  <h3 className="text-xl font-bold">{formatCurrency(mockFinancialData.overview.totalVolume, 'HTG')}</h3>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">+{mockFinancialData.overview.monthlyGrowth}%</span>
                  </div>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <PieChart className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fee Collection</p>
                  <h3 className="text-xl font-bold">{formatCurrency(mockFinancialData.overview.totalFees, 'HTG')}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((mockFinancialData.overview.totalFees / mockFinancialData.overview.totalVolume) * 100).toFixed(2)}% rate
                  </p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Wallets</p>
                  <h3 className="text-2xl font-bold">{mockFinancialData.overview.activeWallets.toLocaleString()}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Monthly active users
                  </p>
                </div>
              </div>
            </KobKleinCard>
          </div>

          {/* Revenue Streams */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue Streams</h3>
              <div className="space-y-4">
                {mockFinancialData.revenueStreams.map((stream, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{stream.source}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold">{formatCurrency(stream.amount, 'HTG')}</span>
                        <span className={`text-xs ${stream.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stream.change >= 0 ? '+' : ''}{stream.change}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-kobklein-accent h-2 rounded-full" 
                        style={{ width: `${stream.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{stream.percentage}% of total revenue</span>
                    </div>
                  </div>
                ))}
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
              <div className="space-y-4">
                {mockFinancialData.expenseBreakdown.map((expense, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{expense.category}</span>
                      <span className="text-sm font-bold">{formatCurrency(expense.amount, 'HTG')}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-400 h-2 rounded-full" 
                        style={{ width: `${expense.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {expense.percentage}% of total expenses
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between font-semibold">
                  <span>Total Expenses</span>
                  <span>{formatCurrency(
                    mockFinancialData.expenseBreakdown.reduce((sum, exp) => sum + exp.amount, 0), 
                    'HTG'
                  )}</span>
                </div>
              </div>
            </KobKleinCard>
          </div>

          {/* Monthly Performance */}
          <KobKleinCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Performance Trend</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Month</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Revenue</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Volume</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Active Users</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {mockFinancialData.monthlyData.map((month, index) => {
                    const previousMonth = index > 0 ? mockFinancialData.monthlyData[index - 1] : null;
                    const revenueGrowth = previousMonth 
                      ? ((month.revenue - previousMonth.revenue) / previousMonth.revenue * 100)
                      : 0;
                    
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 font-medium">{month.month}</td>
                        <td className="py-4 px-4">{formatCurrency(month.revenue, 'HTG')}</td>
                        <td className="py-4 px-4">{formatCurrency(month.volume, 'HTG')}</td>
                        <td className="py-4 px-4">{month.users.toLocaleString()}</td>
                        <td className="py-4 px-4">
                          {index > 0 && (
                            <div className="flex items-center space-x-1">
                              {revenueGrowth >= 0 ? (
                                <TrendingUp className="h-3 w-3 text-green-600" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-600" />
                              )}
                              <span className={`text-xs ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </KobKleinCard>

          {/* Regional Performance */}
          <KobKleinCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Regional Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockFinancialData.regionPerformance.map((region, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{region.region}</h4>
                    <Badge 
                      variant="outline"
                      className={region.growth >= 15 ? 'text-green-600 border-green-200' : 'text-blue-600 border-blue-200'}
                    >
                      +{region.growth}%
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-medium">{formatCurrency(region.revenue, 'HTG')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volume:</span>
                      <span className="font-medium">{formatCurrency(region.volume, 'HTG')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Users:</span>
                      <span className="font-medium">{region.users.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </KobKleinCard>

          {/* Report Actions */}
          <div className="bg-gradient-to-r from-kobklein-primary to-kobklein-accent rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Generate Custom Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <FileText className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Monthly P&L</span>
              </button>
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <BarChart3 className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Revenue Analysis</span>
              </button>
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">User Growth</span>
              </button>
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <MapPin className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Regional Report</span>
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}