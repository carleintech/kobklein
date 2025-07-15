// File: kobklein/web/src/app/support-agent/dashboard/page.tsx

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
  Calendar,
  Target,
  Timer,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Headphones,
  MessageCircle,
  FileText,
  ExternalLink,
  Zap,
  Award
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Support Agent Dashboard | KobKlein",
  description: "Customer support agent workspace and ticket management",
};

// Mock support agent data
const mockSupportAgentData = {
  agentInfo: {
    name: 'Sarah Williams',
    id: 'AGENT_001',
    role: 'Senior Support Agent',
    team: 'Customer Success',
    shift: 'Day Shift (8:00 AM - 5:00 PM)',
    status: 'online',
    languages: ['English', 'French', 'Haitian Kreyòl'],
  },
  performance: {
    todayStats: {
      ticketsResolved: 8,
      avgResponseTime: 1.2, // hours
      customerSatisfaction: 4.9,
      activeTickets: 5,
    },
    weeklyStats: {
      ticketsResolved: 47,
      avgResponseTime: 1.8,
      customerSatisfaction: 4.8,
      escalationRate: 8.5, // percentage
    },
    monthlyStats: {
      ticketsResolved: 189,
      avgResponseTime: 2.1,
      customerSatisfaction: 4.7,
      targets: {
        resolution: 200,
        responseTime: 2.0,
        satisfaction: 4.5,
      },
    },
  },
  assignedTickets: [
    {
      id: 'TICKET_001',
      subject: 'Card activation failed multiple times',
      priority: 'high' as const,
      status: 'open' as const,
      customer: {
        name: 'Marie Dubois',
        phone: '+509 1234 5678',
        email: 'marie.dubois@example.com',
        role: 'client',
        location: 'Port-au-Prince',
        walletId: 'WALLET_12345',
      },
      createdAt: '2025-01-13T14:30:00Z',
      lastUpdated: '2025-01-13T15:45:00Z',
      category: 'technical',
      tags: ['card-activation', 'mobile-app', 'urgent'],
      lastMessage: 'Customer tried activation 5 times with same error',
      attachments: ['error_screenshot.png'],
      escalatedFrom: null,
    },
    {
      id: 'TICKET_002',
      subject: 'Merchant POS terminal not working',
      priority: 'medium' as const,
      status: 'in_progress' as const,
      customer: {
        name: 'Ti Jan Market',
        phone: '+509 8765 4321',
        email: 'tijanmar@example.com',
        role: 'merchant',
        location: 'Delmas 31',
        walletId: 'WALLET_67890',
      },
      createdAt: '2025-01-13T12:15:00Z',
      lastUpdated: '2025-01-13T16:20:00Z',
      category: 'hardware',
      tags: ['pos-terminal', 'merchant-support'],
      lastMessage: 'Sent troubleshooting steps, awaiting customer feedback',
      attachments: ['terminal_manual.pdf'],
      escalatedFrom: null,
    },
    {
      id: 'TICKET_003',
      subject: 'Diaspora refill not received',
      priority: 'high' as const,
      status: 'pending' as const,
      customer: {
        name: 'Michel Joseph',
        phone: '+509 2468 1357',
        email: 'michel.joseph@example.com',
        role: 'client',
        location: 'Cap-Haïtien',
        walletId: 'WALLET_54321',
      },
      createdAt: '2025-01-13T11:00:00Z',
      lastUpdated: '2025-01-13T14:30:00Z',
      category: 'payment',
      tags: ['refill', 'diaspora', 'payment-delay'],
      lastMessage: 'Investigating with payment team - TXN_98765',
      attachments: [],
      escalatedFrom: 'AGENT_003',
    },
    {
      id: 'TICKET_004',
      subject: 'Questions about merchant fees',
      priority: 'low' as const,
      status: 'open' as const,
      customer: {
        name: 'Sophie Morin',
        phone: '+509 3579 2468',
        email: 'sophie.morin@example.com',
        role: 'merchant',
        location: 'Pétion-Ville',
        walletId: 'WALLET_13579',
      },
      createdAt: '2025-01-13T09:45:00Z',
      lastUpdated: '2025-01-13T10:15:00Z',
      category: 'billing',
      tags: ['merchant-fees', 'pricing-question'],
      lastMessage: 'Customer wants clarification on transaction fees',
      attachments: [],
      escalatedFrom: null,
    },
    {
      id: 'TICKET_005',
      subject: 'App crashes during payment',
      priority: 'medium' as const,
      status: 'waiting_customer' as const,
      customer: {
        name: 'Anne Baptiste',
        phone: '+509 9876 5432',
        email: 'anne.baptiste@example.com',
        role: 'client',
        location: 'Carrefour',
        walletId: 'WALLET_24680',
      },
      createdAt: '2025-01-13T08:20:00Z',
      lastUpdated: '2025-01-13T13:45:00Z',
      category: 'technical',
      tags: ['app-crash', 'payment-failure', 'android'],
      lastMessage: 'Requested device details and crash logs',
      attachments: ['crash_report.txt'],
      escalatedFrom: null,
    },
  ],
  quickActions: [
    {
      title: 'Card Activation Help',
      description: 'Guide customers through card activation process',
      template: 'card_activation_guide',
      category: 'technical',
      usageCount: 45,
    },
    {
      title: 'Payment Troubleshooting',
      description: 'Resolve common payment issues',
      template: 'payment_troubleshoot',
      category: 'technical',
      usageCount: 38,
    },
    {
      title: 'Merchant Onboarding',
      description: 'Help new merchants set up their accounts',
      template: 'merchant_onboarding',
      category: 'onboarding',
      usageCount: 28,
    },
    {
      title: 'Account Security',
      description: 'Address security concerns and account safety',
      template: 'security_help',
      category: 'security',
      usageCount: 22,
    },
  ],
  knowledgeBase: [
    {
      id: 'KB_001',
      title: 'How to activate a KobKlein card',
      category: 'Getting Started',
      views: 2456,
      lastUpdated: '2025-01-10',
      quickAccess: true,
    },
    {
      id: 'KB_002',
      title: 'Troubleshooting payment failures',
      category: 'Payments',
      views: 1890,
      lastUpdated: '2025-01-08',
      quickAccess: true,
    },
    {
      id: 'KB_003',
      title: 'Merchant POS terminal guide',
      category: 'Merchant Support',
      views: 1234,
      lastUpdated: '2025-01-05',
      quickAccess: true,
    },
    {
      id: 'KB_004',
      title: 'Understanding diaspora refills',
      category: 'Diaspora Support',
      views: 987,
      lastUpdated: '2025-01-03',
      quickAccess: false,
    },
  ],
  teamStatus: [
    {
      agent: 'Sarah Williams',
      status: 'online',
      activeTickets: 5,
      resolvedToday: 8,
      avgRating: 4.9,
      specialty: 'Technical Support',
    },
    {
      agent: 'Jean Baptiste',
      status: 'busy',
      activeTickets: 7,
      resolvedToday: 6,
      avgRating: 4.7,
      specialty: 'Payment Issues',
    },
    {
      agent: 'Marie Support',
      status: 'online',
      activeTickets: 4,
      resolvedToday: 9,
      avgRating: 4.8,
      specialty: 'Merchant Support',
    },
    {
      agent: 'Pierre Help',
      status: 'away',
      activeTickets: 3,
      resolvedToday: 4,
      avgRating: 4.6,
      specialty: 'General Support',
    },
  ],
};

const supportNavigation = [
  {
    label: 'My Dashboard',
    href: '/support-agent/dashboard',
    icon: Home,
    isActive: true,
  },
  {
    label: 'My Tickets',
    href: '/support-agent/tickets',
    icon: MessageSquare,
    badge: mockSupportAgentData.assignedTickets.filter(t => t.status === 'open').length,
  },
  {
    label: 'Knowledge Base',
    href: '/support-agent/knowledge',
    icon: BookOpen,
  },
  {
    label: 'Live Chat',
    href: '/support-agent/chat',
    icon: MessageCircle,
  },
  {
    label: 'Customer Lookup',
    href: '/support-agent/lookup',
    icon: Search,
  },
  {
    label: 'Templates',
    href: '/support-agent/templates',
    icon: FileText,
  },
  {
    label: 'Team Status',
    href: '/support-agent/team',
    icon: Users,
  },
  {
    label: 'My Performance',
    href: '/support-agent/performance',
    icon: BarChart3,
  },
  {
    label: 'Settings',
    href: '/support-agent/settings',
    icon: Settings,
  },
];

export default function SupportAgentDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['support_agent', 'admin', 'super_admin']}>
      <DashboardLayout
        title="Support Agent Dashboard"
        userRole="support_agent"
        navigation={supportNavigation}
        notifications={8}
      >
        <div className="space-y-6">
          {/* Support Agent Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center space-x-2">
                  <Headphones className="h-6 w-6" />
                  <span>Welcome back, {mockSupportAgentData.agentInfo.name}</span>
                </h2>
                <p className="opacity-90">
                  {mockSupportAgentData.agentInfo.role} • {mockSupportAgentData.agentInfo.team} • {mockSupportAgentData.performance.todayStats.activeTickets} active tickets
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Badge 
                    variant="outline" 
                    className="bg-white/20 text-white border-white/30"
                  >
                    {mockSupportAgentData.agentInfo.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resolved Today</p>
                  <h3 className="text-2xl font-bold">{mockSupportAgentData.performance.todayStats.ticketsResolved}</h3>
                  <p className="text-xs text-green-600">Great progress!</p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Timer className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  <h3 className="text-2xl font-bold">{mockSupportAgentData.performance.todayStats.avgResponseTime}h</h3>
                  <p className="text-xs text-blue-600">Under target</p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer Rating</p>
                  <h3 className="text-2xl font-bold">{mockSupportAgentData.performance.todayStats.customerSatisfaction}</h3>
                  <p className="text-xs text-yellow-600">Excellent service!</p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Tickets</p>
                  <h3 className="text-2xl font-bold">{mockSupportAgentData.performance.todayStats.activeTickets}</h3>
                  <p className="text-xs text-orange-600">Need attention</p>
                </div>
              </div>
            </KobKleinCard>
          </div>

          {/* Quick Actions */}
          <KobKleinCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockSupportAgentData.quickActions.map((action, index) => (
                <button
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{action.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {action.usageCount}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {action.category}
                  </Badge>
                </button>
              ))}
            </div>
          </KobKleinCard>

          {/* My Assigned Tickets */}
          <KobKleinCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">My Assigned Tickets</h3>
              <div className="flex space-x-2">
                <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                  <option value="">All Priority</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                  <option value="">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {mockSupportAgentData.assignedTickets.map((ticket) => (
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
                          {ticket.priority}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            ticket.status === 'open' ? 'text-red-600 border-red-200' :
                            ticket.status === 'in_progress' ? 'text-blue-600 border-blue-200' :
                            ticket.status === 'pending' ? 'text-yellow-600 border-yellow-200' :
                            'text-green-600 border-green-200'
                          }
                        >
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-gray-600 border-gray-200">
                          {ticket.category}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-muted-foreground">Customer</p>
                          <p className="font-medium">{ticket.customer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {ticket.customer.role} • {ticket.customer.location}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-muted-foreground">Contact</p>
                          <p className="font-medium text-xs">{ticket.customer.phone}</p>
                          <p className="font-medium text-xs">{ticket.customer.email}</p>
                        </div>
                        
                        <div>
                          <p className="text-muted-foreground">Created</p>
                          <p className="font-medium">{formatDate(ticket.createdAt, { includeTime: true })}</p>
                          <p className="text-xs text-muted-foreground">
                            Updated: {formatDate(ticket.lastUpdated, { includeTime: true })}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Last Update:</strong> {ticket.lastMessage}
                      </p>

                      {ticket.attachments.length > 0 && (
                        <div className="flex items-center space-x-2 mb-2">
                          <Paperclip className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-muted-foreground">
                            {ticket.attachments.length} attachment(s): {ticket.attachments.join(', ')}
                          </span>
                        </div>
                      )}

                      {ticket.escalatedFrom && (
                        <div className="flex items-center space-x-2 mb-2">
                          <ArrowRight className="h-4 w-4 text-orange-500" />
                          <span className="text-sm text-orange-600">
                            Escalated from {ticket.escalatedFrom}
                          </span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1">
                        {ticket.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
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

          {/* Knowledge Base & Team Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Access Knowledge Base</h3>
              <div className="space-y-3">
                {mockSupportAgentData.knowledgeBase.filter(kb => kb.quickAccess).map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div>
                      <h4 className="font-semibold text-sm">{article.title}</h4>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{article.category}</span>
                        <span>{article.views} views</span>
                        <span>Updated {formatDate(article.lastUpdated)}</span>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-500" />
                  </div>
                ))}
                
                <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-muted-foreground hover:border-gray-400 transition-colors">
                  View All Articles →
                </button>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Team Status</h3>
              <div className="space-y-3">
                {mockSupportAgentData.teamStatus.map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-kobklein-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {agent.agent.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{agent.agent}</p>
                        <p className="text-xs text-muted-foreground">{agent.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
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
                      <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                        <span>{agent.activeTickets} active</span>
                        <span>•</span>
                        <span>{agent.resolvedToday} resolved</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span>{agent.avgRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </KobKleinCard>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Weekly Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tickets Resolved</span>
                  <span className="font-bold">{mockSupportAgentData.performance.weeklyStats.ticketsResolved}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Response Time</span>
                  <span className="font-bold">{mockSupportAgentData.performance.weeklyStats.avgResponseTime}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-bold">{mockSupportAgentData.performance.weeklyStats.customerSatisfaction}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Escalation Rate</span>
                  <span className="font-bold">{mockSupportAgentData.performance.weeklyStats.escalationRate}%</span>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Targets</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tickets Resolved</span>
                    <span>{mockSupportAgentData.performance.monthlyStats.ticketsResolved} / {mockSupportAgentData.performance.monthlyStats.targets.resolution}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(mockSupportAgentData.performance.monthlyStats.ticketsResolved / mockSupportAgentData.performance.monthlyStats.targets.resolution) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Response Time Target</span>
                    <span>{mockSupportAgentData.performance.monthlyStats.avgResponseTime}h / {mockSupportAgentData.performance.monthlyStats.targets.responseTime}h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${Math.min((mockSupportAgentData.performance.monthlyStats.targets.responseTime / mockSupportAgentData.performance.monthlyStats.avgResponseTime) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Satisfaction Target</span>
                    <span>{mockSupportAgentData.performance.monthlyStats.customerSatisfaction} / {mockSupportAgentData.performance.monthlyStats.targets.satisfaction}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${(mockSupportAgentData.performance.monthlyStats.customerSatisfaction / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Agent Profile</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Agent ID</p>
                  <p className="font-medium">{mockSupportAgentData.agentInfo.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Team</p>
                  <p className="font-medium">{mockSupportAgentData.agentInfo.team}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Shift</p>
                  <p className="font-medium">{mockSupportAgentData.agentInfo.shift}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Languages</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mockSupportAgentData.agentInfo.languages.map((lang, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </KobKleinCard>
          </div>

          {/* Support Action Center */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">🎧 Support Action Center</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <Search className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Customer Lookup</span>
              </button>
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <MessageCircle className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Start Live Chat</span>
              </button>
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <FileText className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Use Template</span>
              </button>
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <Zap className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Escalate Ticket</span>
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}