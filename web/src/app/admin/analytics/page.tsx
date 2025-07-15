// File: kobklein/web/src/app/admin/analytics/page.tsx

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
  TrendingUp,
  TrendingDown,
  Eye,
  Clock,
  Smartphone,
  Globe,
  Zap
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Analytics Dashboard | KobKlein Admin",
  description: "Advanced analytics and business intelligence",
};

// Mock analytics data
const mockAnalyticsData = {
  userEngagement: {
    dailyActiveUsers: 2456,
    weeklyActiveUsers: 8934,
    monthlyActiveUsers: 15847,
    averageSessionDuration: 12.3, // minutes
    userRetentionRate: 73.5,
    churnRate: 4.2,
  },
  transactionMetrics: {
    peakHours: [
      { hour: '09:00', transactions: 156 },
      { hour: '12:00', transactions: 234 },
      { hour: '15:00', transactions: 189 },
      { hour: '18:00', transactions: 267 },
      { hour: '21:00', transactions: 198 },
    ],
    paymentMethods: [
      { method: 'NFC Tap', count: 4567, percentage: 45.2 },
      { method: 'QR Code', count: 3421, percentage: 33.8 },
      { method: 'Manual Entry', count: 1876, percentage: 18.5 },
      { method: 'Bulk Transfer', count: 253, percentage: 2.5 },
    ],
    averageTransactionSize: 567.89,
    transactionSuccessRate: 97.8,
  },
  userBehavior: {
    topFeatures: [
      { feature: 'Wallet Balance Check', usage: 89.4 },
      { feature: 'Send Money', usage: 76.2 },
      { feature: 'Transaction History', usage: 67.8 },
      { feature: 'Refill Wallet', usage: 54.3 },
      { feature: 'Settings', usage: 23.1 },
    ],
    deviceTypes: [
      { type: 'Android', users: 12456, percentage: 78.6 },
      { type: 'iOS', users: 2891, percentage: 18.2 },
      { type: 'Web', users: 500, percentage: 3.2 },
    ],
    userJourneyStats: {
      avgTimeToFirstTransaction: 2.3, // days
      avgTransactionsPerUser: 23.7,
      mostCommonUserPath: 'Register → Verify → Refill → Pay Merchant',
    },
  },
  geograficalData: {
    topCities: [
      { city: 'Port-au-Prince', users: 8456, transactions: 23456 },
      { city: 'Cap-Haïtien', users: 2234, transactions: 8934 },
      { city: 'Pétion-Ville', users: 1890, transactions: 7823 },
      { city: 'Delmas', users: 1567, transactions: 5678 },
      { city: 'Carrefour', users: 1234, transactions: 4567 },
    ],
    diasporaActivity: [
      { country: 'United States', users: 1245, volume: 456789.12 },
      { country: 'Canada', users: 456, volume: 234567.89 },
      { country: 'France', users: 234, volume: 123456.78 },
      { country: 'Dominican Republic', users: 123, volume: 89012.34 },
      { country: 'Other', users: 54, volume: 45678.90 },
    ],
  },
  performanceMetrics: {
    systemUptime: 99.94,
    averageResponseTime: 245, // milliseconds
    errorRate: 0.08,
    supportTickets: {
      open: 23,
      resolved: 156,
      avgResolutionTime: 4.2, // hours
    },
  },
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
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    isActive: true,
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

export default function AdminAnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
      <DashboardLayout
        title="Analytics Dashboard"
        userRole="admin"
        navigation={adminNavigation}
        notifications={15}
      >
        <div className="space-y-6">
          {/* Analytics Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Business Intelligence</h2>
              <p className="text-muted-foreground">Advanced analytics and user insights</p>
            </div>
            <div className="flex space-x-2">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent">
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button className="px-4 py-2 bg-kobklein-accent text-white rounded-lg hover:bg-kobklein-accent/90 transition-colors">
                Real-time View
              </button>
            </div>
          </div>

          {/* User Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Daily Active Users</p>
                  <h3 className="text-2xl font-bold">{mockAnalyticsData.userEngagement.dailyActiveUsers.toLocaleString()}</h3>
                  <p className="text-xs text-green-600">
                    {Math.round((mockAnalyticsData.userEngagement.dailyActiveUsers / mockAnalyticsData.userEngagement.monthlyActiveUsers) * 100)}% of MAU
                  </p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Session Duration</p>
                  <h3 className="text-2xl font-bold">{mockAnalyticsData.userEngagement.averageSessionDuration}m</h3>
                  <p className="text-xs text-muted-foreground">
                    Up from 10.8m last week
                  </p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User Retention</p>
                  <h3 className="text-2xl font-bold">{mockAnalyticsData.userEngagement.userRetentionRate}%</h3>
                  <p className="text-xs text-green-600">
                    +2.3% from last month
                  </p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <h3 className="text-2xl font-bold">{mockAnalyticsData.transactionMetrics.transactionSuccessRate}%</h3>
                  <p className="text-xs text-muted-foreground">
                    Transaction completion
                  </p>
                </div>
              </div>
            </KobKleinCard>
          </div>

          {/* Transaction Patterns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Peak Transaction Hours</h3>
              <div className="space-y-4">
                {mockAnalyticsData.transactionMetrics.peakHours.map((hour, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{hour.hour}</span>
                      <span className="text-sm font-bold">{hour.transactions} transactions</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-kobklein-accent h-2 rounded-full" 
                        style={{ width: `${(hour.transactions / 300) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Method Usage</h3>
              <div className="space-y-4">
                {mockAnalyticsData.transactionMetrics.paymentMethods.map((method, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{method.method}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold">{method.count.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">({method.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-purple-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${method.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </KobKleinCard>
          </div>

          {/* User Behavior Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Most Used Features</h3>
              <div className="space-y-4">
                {mockAnalyticsData.userBehavior.topFeatures.map((feature, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{feature.feature}</span>
                      <span className="text-sm font-bold">{feature.usage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-kobklein-primary to-kobklein-accent h-2 rounded-full" 
                        style={{ width: `${feature.usage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>
              <div className="space-y-4">
                {mockAnalyticsData.userBehavior.deviceTypes.map((device, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        device.type === 'Android' ? 'bg-green-100' :
                        device.type === 'iOS' ? 'bg-blue-100' :
                        'bg-purple-100'
                      }`}>
                        <Smartphone className={`h-4 w-4 ${
                          device.type === 'Android' ? 'text-green-600' :
                          device.type === 'iOS' ? 'text-blue-600' :
                          'text-purple-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{device.type}</p>
                        <p className="text-xs text-muted-foreground">{device.percentage}% of users</p>
                      </div>
                    </div>
                    <span className="font-bold">{device.users.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </KobKleinCard>
          </div>

          {/* Geographic Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top Cities in Haiti</h3>
              <div className="space-y-3">
                {mockAnalyticsData.geograficalData.topCities.map((city, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{city.city}</p>
                      <p className="text-xs text-muted-foreground">
                        {city.users.toLocaleString()} users • {city.transactions.toLocaleString()} transactions
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{((city.users / 15847) * 100).toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">of total users</p>
                    </div>
                  </div>
                ))}
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Diaspora Activity</h3>
              <div className="space-y-3">
                {mockAnalyticsData.geograficalData.diasporaActivity.map((country, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Globe className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{country.country}</p>
                        <p className="text-xs text-muted-foreground">{country.users} users</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatCurrency(country.volume, 'HTG')}</p>
                      <p className="text-xs text-muted-foreground">total volume</p>
                    </div>
                  </div>
                ))}
              </div>
            </KobKleinCard>
          </div>

          {/* System Performance */}
          <KobKleinCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">System Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">{mockAnalyticsData.performanceMetrics.systemUptime}%</p>
                <p className="text-sm text-muted-foreground">System Uptime</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-600">{mockAnalyticsData.performanceMetrics.averageResponseTime}ms</p>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-red-600">{mockAnalyticsData.performanceMetrics.errorRate}%</p>
                <p className="text-sm text-muted-foreground">Error Rate</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <HelpCircle className="h-6 w-6 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-orange-600">{mockAnalyticsData.performanceMetrics.supportTickets.avgResolutionTime}h</p>
                <p className="text-sm text-muted-foreground">Avg Resolution Time</p>
              </div>
            </div>
          </KobKleinCard>

          {/* User Journey Insights */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-indigo-700 mb-3">
              🔍 User Journey Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-indigo-700">
              <div>
                <p className="font-medium mb-1">• Time to First Transaction:</p>
                <p>{mockAnalyticsData.userBehavior.userJourneyStats.avgTimeToFirstTransaction} days average</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Transactions per User:</p>
                <p>{mockAnalyticsData.userBehavior.userJourneyStats.avgTransactionsPerUser} transactions average</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Most Common Path:</p>
                <p>{mockAnalyticsData.userBehavior.userJourneyStats.mostCommonUserPath}</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}