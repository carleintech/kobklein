// File: kobklein/web/src/app/admin/settings/page.tsx

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
  Save,
  Key,
  Globe,
  Smartphone,
  Mail,
  Database,
  Server,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Toggle
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useState } from "react";

export const metadata: Metadata = {
  title: "System Settings | KobKlein Admin",
  description: "Configure KobKlein system settings and preferences",
};

// Mock system settings data
const mockSystemSettings = {
  general: {
    platformName: 'KobKlein',
    platformDescription: 'Cashless, borderless digital payment ecosystem for Haiti',
    supportEmail: 'support@kobklein.com',
    maintenanceMode: false,
    debugMode: false,
    allowRegistrations: true,
    requireEmailVerification: true,
    sessionTimeout: 30, // minutes
  },
  security: {
    twoFactorRequired: false,
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15, // minutes
    jwtExpiration: 24, // hours
    encryptionLevel: 'AES-256',
    sslEnabled: true,
  },
  payment: {
    defaultCurrency: 'HTG',
    enableMultiCurrency: true,
    transactionFeeRate: 2.5, // percentage
    maxTransactionAmount: 100000, // HTG
    minTransactionAmount: 1, // HTG
    dailyTransactionLimit: 500000, // HTG
    enableOfflineTransactions: true,
    autoSyncInterval: 30, // seconds
  },
  notifications: {
    emailNotificationsEnabled: true,
    smsNotificationsEnabled: true,
    pushNotificationsEnabled: true,
    transactionAlerts: true,
    securityAlerts: true,
    maintenanceAlerts: true,
    marketingEmails: false,
  },
  api: {
    rateLimit: 1000, // requests per hour
    enableCors: true,
    allowedOrigins: ['https://kobklein.com', 'https://app.kobklein.com'],
    webhookUrl: 'https://api.kobklein.com/webhooks',
    apiVersion: 'v1',
    enableLogging: true,
  },
  integrations: {
    stripeEnabled: true,
    stripePublishableKey: 'pk_live_...',
    stripeSecretKey: '••••••••••••sk_live_...',
    twilioEnabled: true,
    twilioAccountSid: 'AC...',
    twilioAuthToken: '••••••••••••',
    firebaseEnabled: true,
    firebaseProjectId: 'kobklein-prod',
    awsEnabled: true,
    awsRegion: 'us-east-1',
  },
  backup: {
    autoBackupEnabled: true,
    backupFrequency: 'daily',
    retentionPeriod: 30, // days
    backupLocation: 'AWS S3',
    lastBackup: '2025-01-13T03:00:00Z',
    nextBackup: '2025-01-14T03:00:00Z',
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
    isActive: true,
  },
  {
    label: 'Support',
    href: '/admin/support',
    icon: HelpCircle,
  },
];

export default function AdminSettingsPage() {
  const [showSecrets, setShowSecrets] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState('general');

  const toggleSecretVisibility = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payment', label: 'Payment', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API', icon: Server },
    { id: 'integrations', label: 'Integrations', icon: Database },
    { id: 'backup', label: 'Backup', icon: Database },
  ];

  return (
    <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
      <DashboardLayout
        title="System Settings"
        userRole="admin"
        navigation={adminNavigation}
        notifications={15}
      >
        <div className="space-y-6">
          {/* Settings Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">System Configuration</h2>
              <p className="text-muted-foreground">Manage KobKlein platform settings and configurations</p>
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <AlertTriangle className="h-4 w-4" />
                <span>Maintenance Mode</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-kobklein-accent text-white rounded-lg hover:bg-kobklein-accent/90 transition-colors">
                <Save className="h-4 w-4" />
                <span>Save All Changes</span>
              </button>
            </div>
          </div>

          {/* Settings Navigation */}
          <KobKleinCard className="p-6">
            <div className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-kobklein-accent text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </KobKleinCard>

          {/* General Settings */}
          {activeTab === 'general' && (
            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-6">General Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Platform Name</label>
                    <input
                      type="text"
                      value={mockSystemSettings.general.platformName}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Support Email</label>
                    <input
                      type="email"
                      value={mockSystemSettings.general.supportEmail}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={mockSystemSettings.general.sessionTimeout}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Platform Description</label>
                    <textarea
                      value={mockSystemSettings.general.platformDescription}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Maintenance Mode</span>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={mockSystemSettings.general.maintenanceMode} className="rounded" />
                        <Badge variant={mockSystemSettings.general.maintenanceMode ? "destructive" : "outline"}>
                          {mockSystemSettings.general.maintenanceMode ? 'ON' : 'OFF'}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Allow New Registrations</span>
                      <input type="checkbox" checked={mockSystemSettings.general.allowRegistrations} className="rounded" />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Require Email Verification</span>
                      <input type="checkbox" checked={mockSystemSettings.general.requireEmailVerification} className="rounded" />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Debug Mode</span>
                      <input type="checkbox" checked={mockSystemSettings.general.debugMode} className="rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </KobKleinCard>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-6">Security Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Password Minimum Length</label>
                    <input
                      type="number"
                      value={mockSystemSettings.security.passwordMinLength}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Max Login Attempts</label>
                    <input
                      type="number"
                      value={mockSystemSettings.security.maxLoginAttempts}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Lockout Duration (minutes)</label>
                    <input
                      type="number"
                      value={mockSystemSettings.security.lockoutDuration}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">JWT Expiration (hours)</label>
                    <input
                      type="number"
                      value={mockSystemSettings.security.jwtExpiration}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-700">Security Status</span>
                    </div>
                    <div className="space-y-2 text-sm text-green-700">
                      <div className="flex justify-between">
                        <span>Encryption:</span>
                        <span className="font-medium">{mockSystemSettings.security.encryptionLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SSL/TLS:</span>
                        <span className="font-medium">{mockSystemSettings.security.sslEnabled ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Require 2FA for Admins</span>
                      <input type="checkbox" checked={mockSystemSettings.security.twoFactorRequired} className="rounded" />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Password Require Special Characters</span>
                      <input type="checkbox" checked={mockSystemSettings.security.passwordRequireSpecial} className="rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </KobKleinCard>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-6">Payment Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Default Currency</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent">
                      <option value="HTG">HTG - Haitian Gourde</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Transaction Fee Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={mockSystemSettings.payment.transactionFeeRate}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Max Transaction Amount (HTG)</label>
                    <input
                      type="number"
                      value={mockSystemSettings.payment.maxTransactionAmount}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Min Transaction Amount (HTG)</label>
                    <input
                      type="number"
                      value={mockSystemSettings.payment.minTransactionAmount}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Daily Transaction Limit (HTG)</label>
                    <input
                      type="number"
                      value={mockSystemSettings.payment.dailyTransactionLimit}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Auto Sync Interval (seconds)</label>
                    <input
                      type="number"
                      value={mockSystemSettings.payment.autoSyncInterval}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Enable Multi-Currency</span>
                      <input type="checkbox" checked={mockSystemSettings.payment.enableMultiCurrency} className="rounded" />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Enable Offline Transactions</span>
                      <input type="checkbox" checked={mockSystemSettings.payment.enableOfflineTransactions} className="rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </KobKleinCard>
          )}

          {/* Integrations Settings */}
          {activeTab === 'integrations' && (
            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-6">Third-party Integrations</h3>
              <div className="space-y-6">
                {/* Stripe Integration */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Stripe Payment Processing</h4>
                        <p className="text-sm text-muted-foreground">Handle diaspora payments and refills</p>
                      </div>
                    </div>
                    <Badge variant={mockSystemSettings.integrations.stripeEnabled ? "default" : "secondary"}>
                      {mockSystemSettings.integrations.stripeEnabled ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Publishable Key</label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={mockSystemSettings.integrations.stripePublishableKey}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                        />
                        <button className="p-2 text-gray-500 hover:text-gray-700">
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Secret Key</label>
                      <div className="flex space-x-2">
                        <input
                          type={showSecrets.stripe ? "text" : "password"}
                          value={mockSystemSettings.integrations.stripeSecretKey}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                        />
                        <button 
                          onClick={() => toggleSecretVisibility('stripe')}
                          className="p-2 text-gray-500 hover:text-gray-700"
                        >
                          {showSecrets.stripe ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Twilio Integration */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <Smartphone className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Twilio SMS Service</h4>
                        <p className="text-sm text-muted-foreground">Send SMS notifications and OTP codes</p>
                      </div>
                    </div>
                    <Badge variant={mockSystemSettings.integrations.twilioEnabled ? "default" : "secondary"}>
                      {mockSystemSettings.integrations.twilioEnabled ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Account SID</label>
                      <input
                        type="text"
                        value={mockSystemSettings.integrations.twilioAccountSid}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Auth Token</label>
                      <div className="flex space-x-2">
                        <input
                          type={showSecrets.twilio ? "text" : "password"}
                          value={mockSystemSettings.integrations.twilioAuthToken}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                        />
                        <button 
                          onClick={() => toggleSecretVisibility('twilio')}
                          className="p-2 text-gray-500 hover:text-gray-700"
                        >
                          {showSecrets.twilio ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Firebase Integration */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Database className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Firebase Backend</h4>
                        <p className="text-sm text-muted-foreground">Authentication, database, and real-time sync</p>
                      </div>
                    </div>
                    <Badge variant={mockSystemSettings.integrations.firebaseEnabled ? "default" : "secondary"}>
                      {mockSystemSettings.integrations.firebaseEnabled ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Project ID</label>
                    <input
                      type="text"
                      value={mockSystemSettings.integrations.firebaseProjectId}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </KobKleinCard>
          )}

          {/* System Status */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-700 mb-3">
              ✅ System Health Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-green-700">
              <div>
                <p className="font-medium mb-1">• Database Connection:</p>
                <p>Healthy and responsive</p>
              </div>
              <div>
                <p className="font-medium mb-1">• API Performance:</p>
                <p>Average 245ms response time</p>
              </div>
              <div>
                <p className="font-medium mb-1">• External Integrations:</p>
                <p>All services operational</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Security Status:</p>
                <p>No threats detected</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}