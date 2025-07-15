// File: kobklein/web/src/app/super-admin/dashboard/page.tsx

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
  Crown,
  Database,
  Server,
  Globe,
  Lock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  UserCheck,
  Building,
  Zap,
  Monitor,
  Cloud,
  HardDrive,
  Wifi,
  Battery,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  RefreshCw
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Super Admin Dashboard | KobKlein",
  description: "Ultimate system control and monitoring center",
};

// Mock super admin data
const mockSuperAdminData = {
  systemOverview: {
    totalRevenue: 12456789.45,
    totalUsers: 158473,
    totalTransactions: 2456789,
    systemUptime: 99.97,
    activeRegions: 8,
    adminUsers: 15,
    criticalAlerts: 2,
    pendingUpdates: 3,
  },
  platformMetrics: {
    dau: 25647, // Daily Active Users
    mau: 158473, // Monthly Active Users
    retention7d: 89.4,
    retention30d: 73.8,
    churnRate: 2.1,
    avgSessionDuration: 14.6, // minutes
  },
  infrastructure: {
    cpuUsage: 67.4,
    memoryUsage: 78.9,
    diskUsage: 45.2,
    networkLatency: 23.7, // ms
    errorRate: 0.03,
    requestsPerSecond: 1247,
    databaseConnections: 45,
    queuedJobs: 156,
  },
  regions: [
    {
      id: 'haiti-main',
      name: 'Haiti (Main)',
      status: 'healthy',
      users: 145678,
      uptime: 99.98,
      lastIncident: '2024-12-15',
      distributors: 38,
      merchants: 1205,
    },
    {
      id: 'usa-diaspora',
      name: 'USA (Diaspora)',
      status: 'healthy',
      users: 8954,
      uptime: 99.95,
      lastIncident: '2024-12-20',
      distributors: 0,
      merchants: 0,
    },
    {
      id: 'canada-diaspora',
      name: 'Canada (Diaspora)',
      status: 'healthy',
      users: 2341,
      uptime: 99.94,
      lastIncident: '2024-12-18',
      distributors: 0,
      merchants: 0,
    },
    {
      id: 'france-diaspora',
      name: 'France (Diaspora)',
      status: 'warning',
      users: 1500,
      uptime: 98.87,
      lastIncident: '2025-01-12',
      distributors: 0,
      merchants: 0,
    },
  ],
  adminTeam: [
    {
      id: 'ADMIN_001',
      name: 'Erickharlein Pierre',
      role: 'CEO / Founder',
      email: 'erick@kobklein.com',
      status: 'online',
      lastActive: '2025-01-13T16:45:00Z',
      permissions: ['full_access'],
      region: 'Global',
    },
    {
      id: 'ADMIN_002',
      name: 'Marie Technical',
      role: 'CTO',
      email: 'marie.tech@kobklein.com',
      status: 'online',
      lastActive: '2025-01-13T16:30:00Z',
      permissions: ['system_admin', 'dev_ops'],
      region: 'Global',
    },
    {
      id: 'ADMIN_003',
      name: 'Jean Finance',
      role: 'CFO',
      email: 'jean.finance@kobklein.com',
      status: 'away',
      lastActive: '2025-01-13T15:20:00Z',
      permissions: ['financial_admin'],
      region: 'Global',
    },
    {
      id: 'ADMIN_004',
      name: 'Sophie Operations',
      role: 'Operations Manager',
      email: 'sophie.ops@kobklein.com',
      status: 'online',
      lastActive: '2025-01-13T16:40:00Z',
      permissions: ['user_admin', 'support_admin'],
      region: 'Haiti',
    },
    {
      id: 'ADMIN_005',
      name: 'Pierre Security',
      role: 'Security Lead',
      email: 'pierre.security@kobklein.com',
      status: 'online',
      lastActive: '2025-01-13T16:50:00Z',
      permissions: ['security_admin', 'fraud_admin'],
      region: 'Global',
    },
  ],
  systemAlerts: [
    {
      id: 'ALERT_001',
      level: 'critical',
      title: 'Database Connection Pool Near Limit',
      description: 'Connection pool at 89% capacity. Consider scaling.',
      timestamp: '2025-01-13T16:45:00Z',
      source: 'Database Monitor',
      acknowledged: false,
    },
    {
      id: 'ALERT_002',
      level: 'critical',
      title: 'France Region API Errors Increasing',
      description: 'Error rate in France diaspora region increased to 2.4%',
      timestamp: '2025-01-13T16:30:00Z',
      source: 'Regional Monitor',
      acknowledged: false,
    },
    {
      id: 'ALERT_003',
      level: 'warning',
      title: 'High Memory Usage Detected',
      description: 'Memory usage on primary servers at 78.9%',
      timestamp: '2025-01-13T16:15:00Z',
      source: 'Infrastructure Monitor',
      acknowledged: true,
    },
    {
      id: 'ALERT_004',
      level: 'info',
      title: 'Scheduled Maintenance Reminder',
      description: 'Database maintenance scheduled for Jan 15, 2025',
      timestamp: '2025-01-13T14:00:00Z',
      source: 'Maintenance Scheduler',
      acknowledged: true,
    },
  ],
  recentActions: [
    {
      id: 'ACTION_001',
      admin: 'Erickharlein Pierre',
      action: 'Created new admin user',
      details: 'Added Sophie Operations as Operations Manager',
      timestamp: '2025-01-13T15:30:00Z',
      impact: 'user_management',
    },
    {
      id: 'ACTION_002',
      admin: 'Marie Technical',
      action: 'Updated system configuration',
      details: 'Increased API rate limits for diaspora regions',
      timestamp: '2025-01-13T14:45:00Z',
      impact: 'system_config',
    },
    {
      id: 'ACTION_003',
      admin: 'Pierre Security',
      action: 'Blocked suspicious IPs',
      details: 'Added 15 IPs to security blacklist',
      timestamp: '2025-01-13T13:20:00Z',
      impact: 'security',
    },
    {
      id: 'ACTION_004',
      admin: 'Jean Finance',
      action: 'Generated financial report',
      details: 'Created Q4 2024 investor report',
      timestamp: '2025-01-13T12:15:00Z',
      impact: 'reporting',
    },
  ],
};

const superAdminNavigation = [
  {
    label: 'System Overview',
    href: '/super-admin/dashboard',
    icon: Crown,
    isActive: true,
  },
  {
    label: 'Admin Management',
    href: '/super-admin/admins',
    icon: UserCheck,
  },
  {
    label: 'Regional Control',
    href: '/super-admin/regions',
    icon: Globe,
  },
  {
    label: 'Infrastructure',
    href: '/super-admin/infrastructure',
    icon: Server,
  },
  {
    label: 'Security Center',
    href: '/super-admin/security',
    icon: Shield,
    badge: mockSuperAdminData.systemOverview.criticalAlerts,
  },
  {
    label: 'Financial Control',
    href: '/super-admin/financial',
    icon: DollarSign,
  },
  {
    label: 'System Logs',
    href: '/super-admin/logs',
    icon: Database,
  },
  {
    label: 'Deployments',
    href: '/super-admin/deployments',
    icon: Upload,
  },
  {
    label: 'Global Settings',
    href: '/super-admin/settings',
    icon: Settings,
  },
];

export default function SuperAdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['super_admin']}>
      <DashboardLayout
        title="Super Admin Control Center"
        userRole="super_admin"
        navigation={superAdminNavigation}
        notifications={8}
      >
        <div className="space-y-6">
          {/* Super Admin Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center space-x-2">
                  <Crown className="h-6 w-6" />
                  <span>KobKlein System Command Center</span>
                </h2>
                <p className="opacity-90">
                  Ultimate control over the entire KobKlein ecosystem • {mockSuperAdminData.systemOverview.totalUsers.toLocaleString()} total users across {mockSuperAdminData.systemOverview.activeRegions} regions
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Crown className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Critical System Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">System Uptime</p>
                  <h3 className="text-2xl font-bold">{mockSuperAdminData.systemOverview.systemUptime}%</h3>
                  <p className="text-xs text-green-600">Excellent performance</p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <h3 className="text-xl font-bold">{formatCurrency(mockSuperAdminData.systemOverview.totalRevenue, 'HTG')}</h3>
                  <p className="text-xs text-blue-600">All time</p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Platform Users</p>
                  <h3 className="text-2xl font-bold">{mockSuperAdminData.systemOverview.totalUsers.toLocaleString()}</h3>
                  <p className="text-xs text-purple-600">Across all regions</p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Critical Alerts</p>
                  <h3 className="text-2xl font-bold">{mockSuperAdminData.systemOverview.criticalAlerts}</h3>
                  <p className="text-xs text-red-600">Require immediate attention</p>
                </div>
              </div>
            </KobKleinCard>
          </div>

          {/* Infrastructure Status */}
          <KobKleinCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Infrastructure Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Monitor className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold">CPU Usage</h4>
                <p className="text-2xl font-bold text-blue-600">{mockSuperAdminData.infrastructure.cpuUsage}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${mockSuperAdminData.infrastructure.cpuUsage}%` }}
                  />
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <HardDrive className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold">Memory Usage</h4>
                <p className="text-2xl font-bold text-green-600">{mockSuperAdminData.infrastructure.memoryUsage}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${mockSuperAdminData.infrastructure.memoryUsage}%` }}
                  />
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Database className="h-8 w-8 text-yellow-600" />
                </div>
                <h4 className="font-semibold">Disk Usage</h4>
                <p className="text-2xl font-bold text-yellow-600">{mockSuperAdminData.infrastructure.diskUsage}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${mockSuperAdminData.infrastructure.diskUsage}%` }}
                  />
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Wifi className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold">Network Latency</h4>
                <p className="text-2xl font-bold text-purple-600">{mockSuperAdminData.infrastructure.networkLatency}ms</p>
                <p className="text-xs text-muted-foreground mt-1">Average response time</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-muted-foreground">Requests/sec</p>
                <p className="text-lg font-bold">{mockSuperAdminData.infrastructure.requestsPerSecond.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-muted-foreground">Error Rate</p>
                <p className="text-lg font-bold">{mockSuperAdminData.infrastructure.errorRate}%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-muted-foreground">DB Connections</p>
                <p className="text-lg font-bold">{mockSuperAdminData.infrastructure.databaseConnections}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-muted-foreground">Queued Jobs</p>
                <p className="text-lg font-bold">{mockSuperAdminData.infrastructure.queuedJobs}</p>
              </div>
            </div>
          </KobKleinCard>

          {/* Regional Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Regional Operations</h3>
              <div className="space-y-4">
                {mockSuperAdminData.regions.map((region) => (
                  <div key={region.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{region.name}</h4>
                      <Badge 
                        variant="outline"
                        className={
                          region.status === 'healthy' ? 'text-green-600 border-green-200' :
                          region.status === 'warning' ? 'text-yellow-600 border-yellow-200' :
                          'text-red-600 border-red-200'
                        }
                      >
                        {region.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Users</p>
                        <p className="font-semibold">{region.users.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Uptime</p>
                        <p className="font-semibold">{region.uptime}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Distributors</p>
                        <p className="font-semibold">{region.distributors}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Merchants</p>
                        <p className="font-semibold">{region.merchants}</p>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-muted-foreground">
                      Last incident: {formatDate(region.lastIncident)}
                    </div>
                  </div>
                ))}
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Admin Team Status</h3>
              <div className="space-y-3">
                {mockSuperAdminData.adminTeam.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-kobklein-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {admin.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{admin.name}</p>
                        <p className="text-xs text-muted-foreground">{admin.role}</p>
                        <p className="text-xs text-muted-foreground">{admin.region}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="outline"
                        className={
                          admin.status === 'online' ? 'text-green-600 border-green-200' :
                          admin.status === 'away' ? 'text-yellow-600 border-yellow-200' :
                          'text-gray-600 border-gray-200'
                        }
                      >
                        {admin.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(admin.lastActive, { includeTime: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </KobKleinCard>
          </div>

          {/* Critical Alerts */}
          <KobKleinCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">System Alerts</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <AlertTriangle className="h-4 w-4" />
                <span>Acknowledge All</span>
              </button>
            </div>

            <div className="space-y-3">
              {mockSuperAdminData.systemAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`border rounded-lg p-4 ${
                    alert.level === 'critical' ? 'border-red-200 bg-red-50' :
                    alert.level === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                    'border-blue-200 bg-blue-50'
                  } ${alert.acknowledged ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        alert.level === 'critical' ? 'bg-red-100' :
                        alert.level === 'warning' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        <AlertTriangle className={`h-3 w-3 ${
                          alert.level === 'critical' ? 'text-red-600' :
                          alert.level === 'warning' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <span>Source: {alert.source}</span>
                          <span>{formatDate(alert.timestamp, { includeTime: true })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!alert.acknowledged && (
                        <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
                          Acknowledge
                        </button>
                      )}
                      <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </KobKleinCard>

          {/* Recent Admin Actions */}
          <KobKleinCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Admin Actions</h3>
            <div className="space-y-3">
              {mockSuperAdminData.recentActions.map((action) => (
                <div key={action.id} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    action.impact === 'security' ? 'bg-red-100' :
                    action.impact === 'system_config' ? 'bg-blue-100' :
                    action.impact === 'user_management' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    {action.impact === 'security' && <Shield className="h-4 w-4 text-red-600" />}
                    {action.impact === 'system_config' && <Settings className="h-4 w-4 text-blue-600" />}
                    {action.impact === 'user_management' && <Users className="h-4 w-4 text-green-600" />}
                    {action.impact === 'reporting' && <BarChart3 className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{action.action}</p>
                    <p className="text-sm text-muted-foreground">{action.details}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                      <span>By: {action.admin}</span>
                      <span>{formatDate(action.timestamp, { includeTime: true })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </KobKleinCard>

          {/* Emergency Controls */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">🚨 Emergency Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">System Maintenance</span>
              </button>
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <Lock className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Emergency Lockdown</span>
              </button>
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <Database className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Force Backup</span>
              </button>
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <RefreshCw className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">System Restart</span>
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}