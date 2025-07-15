// File: kobklein/web/src/app/admin/dashboard/page.tsx

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
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin Dashboard | KobKlein",
  description: "KobKlein administrative control center",
};

// Mock real-time dashboard data
const mockDashboardStats = {
  platform: {
    totalUsers: 15847,
    activeToday: 2456,
    newThisWeek: 234,
    totalTransactions: 89342,
    transactionsToday: 1456,
    totalVolume: 45698234.50,
    volumeToday: 234567.89,
    systemStatus: 'healthy' as const,
  },
  users: {
    clients: 12456,
    merchants: 1234,
    distributors: 45,
    diaspora: 2112,
  },
  alerts: {
    critical: 3,
    high: 12,
    medium: 28,
    low: 45,
  },
  regions: [
    { name: 'Port-au-Prince', users: 8456, volume: 23456789.12, growth: 12.4 },
    { name: 'Cap-Haïtien', users: 2234, volume: 8934567.89, growth: 8.7 },
    { name: 'Pétion-Ville', users: 1890, volume: 7823456.78, growth: 15.2 },
    { name: 'Delmas', users: 1567, volume: 5678901.23, growth: 6.3 },
    { name: 'Other', users: 1700, volume: 4805519.48, growth: 9.8 },
  ],
  recentActivity: [
    {
      id: 'ACT_001',
      type: 'fraud_alert',
      description: 'High-value transaction flagged',
      user: 'USR_1234',
      amount: 75000.00,
      timestamp: '2025-01-13T16:45:00Z',
      status: 'open',
    },
    {
      id: 'ACT_002',
      type: 'new_merchant',
      description: 'Merchant approved and activated',
      user: 'MERCH_567',
      location: 'Delmas 31',
      timestamp: '2025-01-13T16:30:00Z',
      status: 'completed',
    },
    {
      id: 'ACT_003',
      type: 'system_alert',
      description: 'Card batch delivery completed',
      details: '500 cards delivered to Port-au-Prince',
      timestamp: '2025-01-13T16:15:00Z',
      status: 'completed',
    },
    {
      id: 'ACT_004',
      type: 'payout_request',
      description: 'Distributor payout requested',
      user: 'DIST_123',
      amount: 15000.00,
      timestamp: '2025-01-13T16:00:00Z',
      status: 'pending',
    },
  ],
};

const adminNavigation = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: Home,
    isActive: true,
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
    badge: mockDashboardStats.alerts.critical + mockDashboardStats.alerts.high,
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

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
      <DashboardLayout
        title="Admin Dashboard"
        userRole="admin"
        navigation={adminNavigation}
        notifications={15}
      >
        <div className="space-y-6">
          {/* System Status Banner */}
          <div className={`rounded-lg p-6 text-white ${
            mockDashboardStats.platform.systemStatus === 'healthy' 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600'
              : 'bg-gradient-to-r from-red-600 to-orange-600'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center space-x-2">
                  <CheckCircle2 className="h-6 w-6" />
                  <span>KobKlein System Status</span>
                </h2>
                <p className="opacity-90">
                  All systems operational • {mockDashboardStats.platform.activeToday.toLocaleString()} users active today
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <h3 className="text-2xl font-bold">{mockDashboardStats.platform.totalUsers.toLocaleString()}</h3>
                  <p className="text-xs text-green-600">+{mockDashboardStats.platform.newThisWeek} this week</p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transactions Today</p>
                  <h3 className="text-2xl font-bold">{mockDashboardStats.platform.transactionsToday.toLocaleString()}</h3>
                  <p className="text-xs text-muted-foreground">
                    {mockDashboardStats.platform.totalTransactions.toLocaleString()} total
                  </p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Volume Today</p>
                  <h3 className="text-xl font-bold">{formatCurrency(mockDashboardStats.platform.volumeToday, 'HTG')}</h3>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(mockDashboardStats.platform.totalVolume, 'HTG')} total
                  </p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Security Alerts</p>
                  <h3 className="text-2xl font-bold">
                    {mockDashboardStats.alerts.critical + mockDashboardStats.alerts.high}
                  </h3>
                  <div className="flex space-x-2 text-xs">
                    <span className="text-red-600">{mockDashboardStats.alerts.critical} critical</span>
                    <span className="text-orange-600">{mockDashboardStats.alerts.high} high</span>
                  </div>
                </div>
              </div>
            </KobKleinCard>
          </div>

          {/* User Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">User Distribution by Role</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Clients</span>
                  </div>
                  <span className="font-semibold">{mockDashboardStats.users.clients.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Diaspora</span>
                  </div>
                  <span className="font-semibold">{mockDashboardStats.users.diaspora.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Merchants</span>
                  </div>
                  <span className="font-semibold">{mockDashboardStats.users.merchants.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-sm">Distributors</span>
                  </div>
                  <span className="font-semibold">{mockDashboardStats.users.distributors}</span>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Regional Performance</h3>
              <div className="space-y-4">
                {mockDashboardStats.regions.map((region, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{region.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {region.users.toLocaleString()} users
                        </span>
                        <span className={`text-xs ${region.growth >= 10 ? 'text-green-600' : 'text-blue-600'}`}>
                          +{region.growth}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(region.users / mockDashboardStats.regions[0].users) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </KobKleinCard>
          </div>

          {/* Recent Activity */}
          <KobKleinCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent System Activity</h3>
              <button className="text-sm text-kobklein-accent hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {mockDashboardStats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'fraud_alert' ? 'bg-red-100' :
                    activity.type === 'new_merchant' ? 'bg-green-100' :
                    activity.type === 'system_alert' ? 'bg-blue-100' :
                    'bg-yellow-100'
                  }`}>
                    {activity.type === 'fraud_alert' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    {activity.type === 'new_merchant' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                    {activity.type === 'system_alert' && <Bell className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'payout_request' && <Clock className="h-4 w-4 text-yellow-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                      {activity.user && <span>User: {activity.user}</span>}
                      {activity.amount && <span>Amount: {formatCurrency(activity.amount, 'HTG')}</span>}
                      {activity.location && <span>Location: {activity.location}</span>}
                      {activity.details && <span>{activity.details}</span>}
                      <span>{formatDate(activity.timestamp)}</span>
                    </div>
                  </div>
                  <Badge 
                    variant="outline"
                    className={
                      activity.status === 'open' ? 'text-red-600 border-red-200' :
                      activity.status === 'pending' ? 'text-yellow-600 border-yellow-200' :
                      'text-green-600 border-green-200'
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </KobKleinCard>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-kobklein-primary to-kobklein-accent rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Manage Users</span>
              </button>
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <Shield className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Security Alerts</span>
              </button>
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <Bell className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Send Notification</span>
              </button>
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <BarChart3 className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">View Reports</span>
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}