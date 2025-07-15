// File: kobklein/web/src/app/admin/support/page.tsx

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
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Send,
  Paperclip,
  Eye,
  ArrowRight,
  Star,
  User,
  Calendar
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Support Center | KobKlein Admin",
  description: "Manage customer support tickets and user assistance",
};

// Mock support data
const mockSupportData = {
  stats: {
    openTickets: 23,
    pendingTickets: 8,
    resolvedToday: 15,
    averageResponseTime: 2.4, // hours
    customerSatisfaction: 94.8, // percentage
    totalTickets: 1456,
    escalatedTickets: 3,
  },
  tickets: [
    {
      id: 'TICKET_001',
      subject: 'Unable to activate new card',
      message: 'Hi, I received my KobKlein card yesterday but I\'m having trouble activating it. The app keeps showing an error message.',
      user: {
        id: 'USR_001',
        name: 'Marie Dubois',
        email: 'marie.dubois@example.com',
        phone: '+509 1234 5678',
        role: 'client',
        location: 'Port-au-Prince',
      },
      priority: 'medium' as const,
      status: 'open' as const,
      category: 'technical' as const,
      assignedTo: 'Support Agent 1',
      createdAt: '2025-01-13T14:30:00Z',
      lastUpdated: '2025-01-13T15:45:00Z',
      responseTime: 1.25, // hours
      attachments: ['screenshot.png'],
      tags: ['card-activation', 'mobile-app'],
    },
    {
      id: 'TICKET_002',
      subject: 'Fraudulent transaction reported',
      message: 'I noticed a transaction on my account that I didn\'t make. It was for 5,000 HTG at a merchant I\'ve never visited.',
      user: {
        id: 'USR_002',
        name: 'Jean Pierre',
        email: 'jean.pierre@example.com',
        phone: '+509 8765 4321',
        role: 'client',
        location: 'Cap-Haïtien',
      },
      priority: 'high' as const,
      status: 'escalated' as const,
      category: 'security' as const,
      assignedTo: 'Security Team',
      createdAt: '2025-01-13T12:15:00Z',
      lastUpdated: '2025-01-13T16:20:00Z',
      responseTime: 0.5, // hours
      attachments: [],
      tags: ['fraud', 'security', 'investigation'],
    },
    {
      id: 'TICKET_003',
      subject: 'Merchant account setup assistance',
      message: 'I want to set up a merchant account for my small grocery store. Can someone help me understand the process and requirements?',
      user: {
        id: 'USR_003',
        name: 'Sophie Morin',
        email: 'sophie.morin@example.com',
        phone: '+509 2468 1357',
        role: 'merchant',
        location: 'Pétion-Ville',
      },
      priority: 'medium' as const,
      status: 'in_progress' as const,
      category: 'account' as const,
      assignedTo: 'Merchant Support',
      createdAt: '2025-01-13T10:45:00Z',
      lastUpdated: '2025-01-13T14:30:00Z',
      responseTime: 2.0, // hours
      attachments: ['business_license.pdf'],
      tags: ['merchant-onboarding', 'business'],
    },
    {
      id: 'TICKET_004',
      subject: 'Refill not received',
      message: 'My cousin sent me money from the US 3 hours ago but I still haven\'t received it in my wallet. The transaction ID is TXN_12345.',
      user: {
        id: 'USR_004',
        name: 'Michel Joseph',
        email: 'michel.joseph@example.com',
        phone: '+509 3579 2468',
        role: 'client',
        location: 'Delmas',
      },
      priority: 'high' as const,
      status: 'resolved' as const,
      category: 'payment' as const,
      assignedTo: 'Payment Team',
      createdAt: '2025-01-13T08:30:00Z',
      lastUpdated: '2025-01-13T11:15:00Z',
      responseTime: 1.5, // hours
      attachments: [],
      tags: ['refill', 'diaspora', 'payment-delay'],
    },
    {
      id: 'TICKET_005',
      subject: 'App crashing on Android',
      message: 'The KobKlein app keeps crashing whenever I try to make a payment. I\'m using a Samsung Galaxy A20 with Android 10.',
      user: {
        id: 'USR_005',
        name: 'Anne Baptiste',
        email: 'anne.baptiste@example.com',
        phone: '+509 9876 5432',
        role: 'client',
        location: 'Carrefour',
      },
      priority: 'medium' as const,
      status: 'pending' as const,
      category: 'technical' as const,
      assignedTo: 'Tech Support',
      createdAt: '2025-01-13T07:20:00Z',
      lastUpdated: '2025-01-13T09:45:00Z',
      responseTime: 3.2, // hours
      attachments: ['crash_log.txt', 'device_info.txt'],
      tags: ['android', 'crash', 'payment'],
    },
  ],
  knowledgeBase: [
    {
      id: 'KB_001',
      title: 'How to activate a KobKlein card',
      category: 'Getting Started',
      views: 2456,
      helpful: 234,
      lastUpdated: '2025-01-10',
    },
    {
      id: 'KB_002',
      title: 'Troubleshooting payment failures',
      category: 'Payments',
      views: 1890,
      helpful: 178,
      lastUpdated: '2025-01-08',
    },
    {
      id: 'KB_003',
      title: 'Setting up merchant account',
      category: 'Merchant Guide',
      views: 1234,
      helpful: 145,
      lastUpdated: '2025-01-05',
    },
    {
      id: 'KB_004',
      title: 'Understanding transaction fees',
      category: 'Billing',
      views: 967,
      helpful: 112,
      lastUpdated: '2025-01-03',
    },
  ],
  supportTeam: [
    {
      id: 'AGENT_001',
      name: 'Sarah Williams',
      role: 'Senior Support Agent',
      status: 'online',
      activeTickets: 8,
      resolvedToday: 5,
      rating: 4.9,
    },
    {
      id: 'AGENT_002',
      name: 'Jean Baptiste',
      role: 'Technical Support',
      status: 'busy',
      activeTickets: 6,
      resolvedToday: 3,
      rating: 4.7,
    },
    {
      id: 'AGENT_003',
      name: 'Marie Dubois',
      role: 'Merchant Support',
      status: 'online',
      activeTickets: 4,
      resolvedToday: 7,
      rating: 4.8,
    },
    {
      id: 'AGENT_004',
      name: 'Pierre Joseph',
      role: 'Security Specialist',
      status: 'away',
      activeTickets: 2,
      resolvedToday: 2,
      rating: 4.9,
    },
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
    isActive: true,
  },
];

export default function AdminSupportPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
      <DashboardLayout
        title="Support Center"
        userRole="admin"
        navigation={adminNavigation}
        notifications={15}
      >
        <div className="space-y-6">
          {/* Support Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Customer Support Dashboard</h2>
              <p className="text-muted-foreground">Manage support tickets, help users, and monitor team performance</p>
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>New Ticket</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-kobklein-accent text-white rounded-lg hover:bg-kobklein-accent/90 transition-colors">
                <MessageSquare className="h-4 w-4" />
                <span>Live Chat</span>
              </button>
            </div>
          </div>

          {/* Support Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Open Tickets</p>
                  <h3 className="text-2xl font-bold">{mockSupportData.stats.openTickets}</h3>
                  <p className="text-xs text-red-600">{mockSupportData.stats.escalatedTickets} escalated</p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  <h3 className="text-2xl font-bold">{mockSupportData.stats.averageResponseTime}h</h3>
                  <p className="text-xs text-muted-foreground">Within SLA target</p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resolved Today</p>
                  <h3 className="text-2xl font-bold">{mockSupportData.stats.resolvedToday}</h3>
                  <p className="text-xs text-green-600">+{Math.round(Math.random() * 5 + 1)} from yesterday</p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
                  <h3 className="text-2xl font-bold">{mockSupportData.stats.customerSatisfaction}%</h3>
                  <p className="text-xs text-blue-600">Excellent rating</p>
                </div>
              </div>
            </KobKleinCard>
          </div>

          {/* Support Team Status */}
          <KobKleinCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Support Team Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockSupportData.supportTeam.map((agent) => (
                <div key={agent.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-kobklein-accent rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {agent.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{agent.name}</h4>
                      <p className="text-xs text-muted-foreground">{agent.role}</p>
                    </div>
                    <Badge 
                      variant="outline"
                      className={
                        agent.status === 'online' ? 'text-green-600 border-green-200' :
                        agent.status === 'busy' ? 'text-yellow-600 border-yellow-200' :
                        'text-gray-600 border-gray-200'
                      }
                    >
                      {agent.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active tickets:</span>
                      <span className="font-medium">{agent.activeTickets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resolved today:</span>
                      <span className="font-medium">{agent.resolvedToday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating:</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="font-medium">{agent.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </KobKleinCard>

          {/* Ticket Management */}
          <KobKleinCard className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 mb-6">
              <h3 className="text-lg font-semibold">Support Tickets</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                  />
                </div>
                
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent">
                  <option value="">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="escalated">Escalated</option>
                </select>

                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent">
                  <option value="">All Categories</option>
                  <option value="technical">Technical</option>
                  <option value="payment">Payment</option>
                  <option value="account">Account</option>
                  <option value="security">Security</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {mockSupportData.tickets.map((ticket) => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold">{ticket.subject}</h4>
                        <Badge 
                          variant="outline"
                          className={
                            ticket.priority === 'high' ? 'text-red-600 border-red-200' :
                            ticket.priority === 'medium' ? 'text-yellow-600 border-yellow-200' :
                            'text-blue-600 border-blue-200'
                          }
                        >
                          {ticket.priority} priority
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            ticket.status === 'open' ? 'text-red-600 border-red-200' :
                            ticket.status === 'in_progress' ? 'text-blue-600 border-blue-200' :
                            ticket.status === 'pending' ? 'text-yellow-600 border-yellow-200' :
                            ticket.status === 'resolved' ? 'text-green-600 border-green-200' :
                            'text-purple-600 border-purple-200'
                          }
                        >
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-gray-600 border-gray-200">
                          {ticket.category}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{ticket.message}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Customer</p>
                          <p className="font-medium">{ticket.user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {ticket.user.role} • {ticket.user.location}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-muted-foreground">Assigned To</p>
                          <p className="font-medium">{ticket.assignedTo}</p>
                        </div>
                        
                        <div>
                          <p className="text-muted-foreground">Response Time</p>
                          <p className="font-medium">{ticket.responseTime}h</p>
                        </div>
                        
                        <div>
                          <p className="text-muted-foreground">Created</p>
                          <p className="font-medium">{formatDate(ticket.createdAt, { includeTime: true })}</p>
                        </div>
                      </div>

                      {ticket.attachments.length > 0 && (
                        <div className="mt-3 flex items-center space-x-2">
                          <Paperclip className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-muted-foreground">
                            {ticket.attachments.length} attachment(s)
                          </span>
                        </div>
                      )}

                      {ticket.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {ticket.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-100 rounded">
                        <Send className="h-4 w-4" />
                      </button>
                      {ticket.status === 'open' && (
                        <button className="p-2 text-purple-600 hover:bg-purple-100 rounded">
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </KobKleinCard>

          {/* Knowledge Base */}
          <KobKleinCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Knowledge Base</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add Article</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockSupportData.knowledgeBase.map((article) => (
                <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-sm">{article.title}</h4>
                      <Badge variant="outline" className="text-xs mt-1">
                        {article.category}
                      </Badge>
                    </div>
                    <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                      <Eye className="h-3 w-3" />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{article.views.toLocaleString()} views</span>
                    <span>{article.helpful} found helpful</span>
                    <span>Updated {formatDate(article.lastUpdated)}</span>
                  </div>
                </div>
              ))}
            </div>
          </KobKleinCard>

          {/* Support Performance Insights */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">
              📊 Support Performance Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
              <div>
                <p className="font-medium mb-1">• Response Time Goal:</p>
                <p>90% of tickets responded to within 4 hours</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Most Common Issues:</p>
                <p>Card activation (35%), Payment failures (28%), Account setup (20%)</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Customer Feedback:</p>
                <p>94.8% satisfaction rate, trending upward</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}