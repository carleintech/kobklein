// File: kobklein/web/src/app/admin/notifications/page.tsx

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
  Send,
  MessageSquare,
  Mail,
  Smartphone,
  Globe,
  Calendar,
  Target,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Notifications Management | KobKlein Admin",
  description: "Manage and send notifications to KobKlein users",
};

// Mock notifications data
const mockNotificationsData = {
  stats: {
    totalSent: 156789,
    deliveryRate: 94.8,
    openRate: 67.3,
    clickRate: 23.7,
    pendingNotifications: 45,
    scheduledNotifications: 12,
  },
  recentCampaigns: [
    {
      id: 'NOTIF_001',
      title: 'Security Update Available',
      message: 'New security features are now available for your KobKlein account. Update your app to stay protected.',
      type: 'security' as const,
      channel: 'push' as const,
      targetAudience: 'all_users',
      status: 'sent' as const,
      sentAt: '2025-01-13T16:30:00Z',
      recipients: 15847,
      delivered: 15023,
      opened: 10567,
      clicked: 3456,
      priority: 'high' as const,
    },
    {
      id: 'NOTIF_002',
      title: 'New Card Types Available',
      message: 'Check out our new merchant cards with enhanced features. Perfect for growing your business!',
      type: 'promotional' as const,
      channel: 'email' as const,
      targetAudience: 'merchants',
      status: 'sent' as const,
      sentAt: '2025-01-13T14:15:00Z',
      recipients: 1234,
      delivered: 1201,
      opened: 867,
      clicked: 234,
      priority: 'medium' as const,
    },
    {
      id: 'NOTIF_003',
      title: 'Maintenance Scheduled',
      message: 'System maintenance will occur on Jan 15, 2025 from 2:00-4:00 AM. Service may be temporarily unavailable.',
      type: 'system' as const,
      channel: 'sms' as const,
      targetAudience: 'all_users',
      status: 'scheduled' as const,
      sentAt: '2025-01-15T02:00:00Z',
      recipients: 15847,
      delivered: 0,
      opened: 0,
      clicked: 0,
      priority: 'high' as const,
    },
    {
      id: 'NOTIF_004',
      title: 'Weekly Transaction Summary',
      message: 'Your weekly transaction summary is ready. See how you performed this week.',
      type: 'informational' as const,
      channel: 'push' as const,
      targetAudience: 'distributors',
      status: 'draft' as const,
      sentAt: null,
      recipients: 45,
      delivered: 0,
      opened: 0,
      clicked: 0,
      priority: 'low' as const,
    },
  ],
  templates: [
    {
      id: 'TPL_001',
      name: 'Welcome New User',
      type: 'onboarding',
      subject: 'Welcome to KobKlein! 🎉',
      preview: 'Thank you for joining KobKlein. Here\'s how to get started...',
      channel: 'email',
      usageCount: 2456,
    },
    {
      id: 'TPL_002',
      name: 'Transaction Completed',
      type: 'transactional',
      subject: 'Transaction Successful',
      preview: 'Your transaction of {amount} HTG has been completed successfully.',
      channel: 'push',
      usageCount: 45678,
    },
    {
      id: 'TPL_003',
      name: 'Security Alert',
      type: 'security',
      subject: 'Security Alert - Unusual Activity',
      preview: 'We detected unusual activity on your account. Please review...',
      channel: 'sms',
      usageCount: 234,
    },
    {
      id: 'TPL_004',
      name: 'Low Balance Warning',
      type: 'alert',
      subject: 'Low Wallet Balance',
      preview: 'Your wallet balance is below {threshold} HTG. Consider refilling...',
      channel: 'push',
      usageCount: 1567,
    },
  ],
  channelStats: [
    { channel: 'Push Notifications', sent: 89456, delivered: 85123, opened: 57689, rate: 95.2 },
    { channel: 'Email', sent: 45234, delivered: 42891, opened: 28567, rate: 94.8 },
    { channel: 'SMS', sent: 22098, delivered: 21567, opened: 18234, rate: 97.6 },
    { channel: 'In-App', sent: 67890, delivered: 67890, opened: 45678, rate: 100.0 },
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
    isActive: true,
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

export default function AdminNotificationsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
      <DashboardLayout
        title="Notifications Management"
        userRole="admin"
        navigation={adminNavigation}
        notifications={15}
      >
        <div className="space-y-6">
          {/* Notifications Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Communications Center</h2>
              <p className="text-muted-foreground">Manage notifications, campaigns, and user communications</p>
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>New Campaign</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-kobklein-accent text-white rounded-lg hover:bg-kobklein-accent/90 transition-colors">
                <Send className="h-4 w-4" />
                <span>Quick Send</span>
              </button>
            </div>
          </div>

          {/* Notification Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Send className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Sent</p>
                  <h3 className="text-2xl font-bold">{mockNotificationsData.stats.totalSent.toLocaleString()}</h3>
                  <p className="text-xs text-green-600">{mockNotificationsData.stats.deliveryRate}% delivered</p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Open Rate</p>
                  <h3 className="text-2xl font-bold">{mockNotificationsData.stats.openRate}%</h3>
                  <p className="text-xs text-muted-foreground">Above industry average</p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Click Rate</p>
                  <h3 className="text-2xl font-bold">{mockNotificationsData.stats.clickRate}%</h3>
                  <p className="text-xs text-green-600">+2.1% from last month</p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <h3 className="text-2xl font-bold">{mockNotificationsData.stats.scheduledNotifications}</h3>
                  <p className="text-xs text-muted-foreground">
                    {mockNotificationsData.stats.pendingNotifications} pending
                  </p>
                </div>
              </div>
            </KobKleinCard>
          </div>

          {/* Channel Performance */}
          <KobKleinCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Channel Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockNotificationsData.channelStats.map((channel, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      channel.channel.includes('Push') ? 'bg-blue-100' :
                      channel.channel.includes('Email') ? 'bg-green-100' :
                      channel.channel.includes('SMS') ? 'bg-purple-100' :
                      'bg-orange-100'
                    }`}>
                      {channel.channel.includes('Push') && <Bell className="h-4 w-4 text-blue-600" />}
                      {channel.channel.includes('Email') && <Mail className="h-4 w-4 text-green-600" />}
                      {channel.channel.includes('SMS') && <Smartphone className="h-4 w-4 text-purple-600" />}
                      {channel.channel.includes('In-App') && <MessageSquare className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{channel.channel}</h4>
                      <p className="text-xs text-muted-foreground">{channel.rate}% delivery rate</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sent:</span>
                      <span className="font-medium">{channel.sent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivered:</span>
                      <span className="font-medium">{channel.delivered.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Opened:</span>
                      <span className="font-medium">{channel.opened.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </KobKleinCard>

          {/* Recent Campaigns */}
          <KobKleinCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Campaigns</h3>
              <div className="flex space-x-2">
                <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                  <option value="">All Types</option>
                  <option value="security">Security</option>
                  <option value="promotional">Promotional</option>
                  <option value="system">System</option>
                  <option value="informational">Informational</option>
                </select>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                  Filter
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {mockNotificationsData.recentCampaigns.map((campaign) => (
                <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold">{campaign.title}</h4>
                        <Badge 
                          variant="outline"
                          className={
                            campaign.type === 'security' ? 'text-red-600 border-red-200' :
                            campaign.type === 'promotional' ? 'text-green-600 border-green-200' :
                            campaign.type === 'system' ? 'text-yellow-600 border-yellow-200' :
                            'text-blue-600 border-blue-200'
                          }
                        >
                          {campaign.type}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            campaign.status === 'sent' ? 'text-green-600 border-green-200' :
                            campaign.status === 'scheduled' ? 'text-orange-600 border-orange-200' :
                            'text-gray-600 border-gray-200'
                          }
                        >
                          {campaign.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            campaign.priority === 'high' ? 'text-red-600 border-red-200' :
                            campaign.priority === 'medium' ? 'text-yellow-600 border-yellow-200' :
                            'text-blue-600 border-blue-200'
                          }
                        >
                          {campaign.priority} priority
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{campaign.message}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Channel</p>
                          <div className="flex items-center space-x-1">
                            {campaign.channel === 'push' && <Bell className="h-3 w-3" />}
                            {campaign.channel === 'email' && <Mail className="h-3 w-3" />}
                            {campaign.channel === 'sms' && <Smartphone className="h-3 w-3" />}
                            <span className="font-medium capitalize">{campaign.channel}</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-muted-foreground">Recipients</p>
                          <p className="font-medium">{campaign.recipients.toLocaleString()}</p>
                        </div>
                        
                        {campaign.status === 'sent' && (
                          <>
                            <div>
                              <p className="text-muted-foreground">Delivered</p>
                              <p className="font-medium">{campaign.delivered.toLocaleString()}</p>
                            </div>
                            
                            <div>
                              <p className="text-muted-foreground">Opened</p>
                              <p className="font-medium">
                                {campaign.opened.toLocaleString()} 
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({((campaign.opened / campaign.delivered) * 100).toFixed(1)}%)
                                </span>
                              </p>
                            </div>
                          </>
                        )}
                        
                        {campaign.status === 'scheduled' && (
                          <div>
                            <p className="text-muted-foreground">Scheduled For</p>
                            <p className="font-medium">{formatDate(campaign.sentAt!, { includeTime: true })}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                        <Eye className="h-4 w-4" />
                      </button>
                      {campaign.status === 'draft' && (
                        <button className="p-2 text-green-600 hover:bg-green-100 rounded">
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {campaign.status === 'scheduled' && (
                        <button className="p-2 text-orange-600 hover:bg-orange-100 rounded">
                          <Clock className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {campaign.sentAt && campaign.status === 'sent' && (
                    <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-muted-foreground">
                      Sent: {formatDate(campaign.sentAt, { includeTime: true })} • 
                      Target: {campaign.targetAudience.replace('_', ' ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </KobKleinCard>

          {/* Templates Section */}
          <KobKleinCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Notification Templates</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Plus className="h-4 w-4" />
                <span>New Template</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockNotificationsData.templates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{template.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {template.type}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          {template.channel === 'email' && <Mail className="h-3 w-3 text-gray-500" />}
                          {template.channel === 'push' && <Bell className="h-3 w-3 text-gray-500" />}
                          {template.channel === 'sms' && <Smartphone className="h-3 w-3 text-gray-500" />}
                          <span className="text-xs text-muted-foreground capitalize">{template.channel}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Eye className="h-3 w-3" />
                      </button>
                      <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                        <Edit className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{template.preview}</p>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Used {template.usageCount.toLocaleString()} times</span>
                    <button className="text-kobklein-accent hover:underline">Use Template</button>
                  </div>
                </div>
              ))}
            </div>
          </KobKleinCard>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-kobklein-primary to-kobklein-accent rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Quick Communication Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Emergency Alert</span>
              </button>
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <Bell className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">System Maintenance</span>
              </button>
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">User Onboarding</span>
              </button>
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <Target className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Promotional Campaign</span>
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}