// File: kobklein/web/src/app/regional-manager/dashboard/page.tsx

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
  Building,
  UserPlus,
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Target,
  Award,
  Calendar,
  Phone,
  Mail,
  Map,
  Plus,
  Eye,
  Edit,
  Send,
  Download
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Regional Manager Dashboard | KobKlein",
  description: "Regional management and oversight for KobKlein operations",
};

// Mock regional manager data
const mockRegionalData = {
  regionInfo: {
    name: 'Port-au-Prince Metropolitan Area',
    code: 'PAP-METRO',
    manager: 'Sophie Operations',
    population: 2800000,
    coverage: 87.3, // percentage
    lastUpdated: '2025-01-13T16:30:00Z',
  },
  performance: {
    monthlyGrowth: 15.7,
    quarterlyTarget: 78.9,
    userAcquisition: 1245,
    revenueGenerated: 456789.12,
    transactionVolume: 8934567.89,
    marketPenetration: 23.4,
  },
  distributors: [
    {
      id: 'DIST_001',
      name: 'Pierre Distributeur',
      location: 'Port-au-Prince Central',
      zone: 'Downtown',
      status: 'active',
      performance: 94.6,
      usersManaged: 1245,
      monthlyTarget: 1500,
      cardsInStock: 45,
      lastActivity: '2025-01-13T15:30:00Z',
      contact: '+509 1234 5678',
      joinDate: '2024-02-15',
    },
    {
      id: 'DIST_002',
      name: 'Marie Agent',
      location: 'Pétion-Ville',
      zone: 'Uptown',
      status: 'active',
      performance: 87.3,
      usersManaged: 867,
      monthlyTarget: 1000,
      cardsInStock: 23,
      lastActivity: '2025-01-13T16:15:00Z',
      contact: '+509 8765 4321',
      joinDate: '2024-03-10',
    },
    {
      id: 'DIST_003',
      name: 'Jean Services',
      location: 'Delmas',
      zone: 'East Zone',
      status: 'warning',
      performance: 65.2,
      usersManaged: 456,
      monthlyTarget: 800,
      cardsInStock: 8,
      lastActivity: '2025-01-13T12:45:00Z',
      contact: '+509 2468 1357',
      joinDate: '2024-01-20',
    },
    {
      id: 'DIST_004',
      name: 'Anne Business',
      location: 'Carrefour',
      zone: 'South Zone',
      status: 'active',
      performance: 92.1,
      usersManaged: 723,
      monthlyTarget: 900,
      cardsInStock: 67,
      lastActivity: '2025-01-13T16:00:00Z',
      contact: '+509 3579 2468',
      joinDate: '2024-04-05',
    },
  ],
  merchants: [
    {
      id: 'MERCH_001',
      name: 'Ti Jan Market',
      category: 'Grocery',
      location: 'Delmas 31',
      status: 'active',
      monthlyVolume: 67890.12,
      transactionCount: 456,
      averageTicket: 148.90,
      distributorAssigned: 'Jean Services',
      lastTransaction: '2025-01-13T16:20:00Z',
      joinDate: '2024-08-15',
    },
    {
      id: 'MERCH_002',
      name: 'Belle Pharmacie',
      category: 'Healthcare',
      location: 'Pétion-Ville',
      status: 'active',
      monthlyVolume: 123456.78,
      transactionCount: 234,
      averageTicket: 527.59,
      distributorAssigned: 'Marie Agent',
      lastTransaction: '2025-01-13T15:45:00Z',
      joinDate: '2024-09-20',
    },
    {
      id: 'MERCH_003',
      name: 'Auto Parts Plus',
      category: 'Automotive',
      location: 'Port-au-Prince Central',
      status: 'inactive',
      monthlyVolume: 23456.78,
      transactionCount: 45,
      averageTicket: 521.26,
      distributorAssigned: 'Pierre Distributeur',
      lastTransaction: '2025-01-10T11:30:00Z',
      joinDate: '2024-07-12',
    },
  ],
  regionalStats: {
    zones: [
      {
        name: 'Downtown',
        distributors: 3,
        merchants: 45,
        users: 8956,
        growth: 18.5,
        penetration: 34.2,
        priority: 'high',
      },
      {
        name: 'Uptown',
        distributors: 2,
        merchants: 23,
        users: 4567,
        growth: 12.3,
        penetration: 28.7,
        priority: 'medium',
      },
      {
        name: 'East Zone',
        distributors: 4,
        merchants: 34,
        users: 6789,
        growth: 8.9,
        penetration: 19.4,
        priority: 'high',
      },
      {
        name: 'South Zone',
        distributors: 2,
        merchants: 18,
        users: 3456,
        growth: 22.1,
        penetration: 15.8,
        priority: 'medium',
      },
    ],
    challenges: [
      {
        id: 'CHALLENGE_001',
        title: 'Low Card Stock in East Zone',
        description: 'Multiple distributors running low on inventory',
        severity: 'medium',
        affectedZones: ['East Zone'],
        actionRequired: 'Immediate restocking needed',
        dueDate: '2025-01-15',
      },
      {
        id: 'CHALLENGE_002',
        title: 'Merchant Activation Rate Below Target',
        description: 'Only 65% of new merchants are active within 30 days',
        severity: 'high',
        affectedZones: ['Downtown', 'East Zone'],
        actionRequired: 'Enhanced onboarding support',
        dueDate: '2025-01-20',
      },
      {
        id: 'CHALLENGE_003',
        title: 'Competition Increasing in Uptown',
        description: 'New mobile payment services entering market',
        severity: 'medium',
        affectedZones: ['Uptown'],
        actionRequired: 'Strategic response planning',
        dueDate: '2025-01-25',
      },
    ],
  },
  recentActivities: [
    {
      id: 'ACTIVITY_001',
      type: 'distributor_approval',
      title: 'New Distributor Approved',
      description: 'Approved Claude Merchant for South Zone operations',
      timestamp: '2025-01-13T15:30:00Z',
      zone: 'South Zone',
      impact: 'positive',
    },
    {
      id: 'ACTIVITY_002',
      type: 'card_delivery',
      title: 'Card Batch Delivered',
      description: '500 cards delivered to Downtown distributors',
      timestamp: '2025-01-13T14:20:00Z',
      zone: 'Downtown',
      impact: 'positive',
    },
    {
      id: 'ACTIVITY_003',
      type: 'merchant_issue',
      title: 'Merchant Support Required',
      description: 'Ti Jan Market experiencing POS terminal issues',
      timestamp: '2025-01-13T13:45:00Z',
      zone: 'East Zone',
      impact: 'negative',
    },
    {
      id: 'ACTIVITY_004',
      type: 'training_session',
      title: 'Training Session Completed',
      description: 'Conducted distributor training for new features',
      timestamp: '2025-01-13T10:00:00Z',
      zone: 'All Zones',
      impact: 'neutral',
    },
  ],
};

const regionalNavigation = [
  {
    label: 'Regional Overview',
    href: '/regional-manager/dashboard',
    icon: Home,
    isActive: true,
  },
  {
    label: 'Distributor Network',
    href: '/regional-manager/distributors',
    icon: Users,
  },
  {
    label: 'Merchant Management',
    href: '/regional-manager/merchants',
    icon: Building,
  },
  {
    label: 'Zone Performance',
    href: '/regional-manager/zones',
    icon: MapPin,
  },
  {
    label: 'Resource Allocation',
    href: '/regional-manager/resources',
    icon: Package,
  },
  {
    label: 'Growth Analytics',
    href: '/regional-manager/analytics',
    icon: BarChart3,
  },
  {
    label: 'Training & Support',
    href: '/regional-manager/training',
    icon: Award,
  },
  {
    label: 'Regional Reports',
    href: '/regional-manager/reports',
    icon: Activity,
  },
  {
    label: 'Settings',
    href: '/regional-manager/settings',
    icon: Settings,
  },
];

export default function RegionalManagerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['regional_manager', 'admin', 'super_admin']}>
      <DashboardLayout
        title="Regional Manager Dashboard"
        userRole="regional_manager"
        navigation={regionalNavigation}
        notifications={12}
      >
        <div className="space-y-6">
          {/* Regional Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center space-x-2">
                  <MapPin className="h-6 w-6" />
                  <span>{mockRegionalData.regionInfo.name}</span>
                </h2>
                <p className="opacity-90">
                  Regional Code: {mockRegionalData.regionInfo.code} • Coverage: {mockRegionalData.performance.marketPenetration}% market penetration • {mockRegionalData.distributors.length} active distributors
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <MapPin className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Growth</p>
                  <h3 className="text-2xl font-bold">{mockRegionalData.performance.monthlyGrowth}%</h3>
                  <p className="text-xs text-green-600">Above regional target</p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quarterly Target</p>
                  <h3 className="text-2xl font-bold">{mockRegionalData.performance.quarterlyTarget}%</h3>
                  <p className="text-xs text-blue-600">On track to meet goal</p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue Generated</p>
                  <h3 className="text-xl font-bold">{formatCurrency(mockRegionalData.performance.revenueGenerated, 'HTG')}</h3>
                  <p className="text-xs text-purple-600">This month</p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">New Users</p>
                  <h3 className="text-2xl font-bold">{mockRegionalData.performance.userAcquisition.toLocaleString()}</h3>
                  <p className="text-xs text-orange-600">This month</p>
                </div>
              </div>
            </KobKleinCard>
          </div>

          {/* Zone Performance Overview */}
          <KobKleinCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Zone Performance Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockRegionalData.regionalStats.zones.map((zone, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{zone.name}</h4>
                    <Badge 
                      variant="outline"
                      className={
                        zone.priority === 'high' ? 'text-red-600 border-red-200' :
                        'text-blue-600 border-blue-200'
                      }
                    >
                      {zone.priority} priority
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distributors:</span>
                      <span className="font-medium">{zone.distributors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Merchants:</span>
                      <span className="font-medium">{zone.merchants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Users:</span>
                      <span className="font-medium">{zone.users.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Growth:</span>
                      <span className={`font-medium ${zone.growth >= 15 ? 'text-green-600' : 'text-blue-600'}`}>
                        +{zone.growth}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Market Penetration</span>
                      <span>{zone.penetration}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${zone.penetration}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </KobKleinCard>

          {/* Distributor Network Status */}
          <KobKleinCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Distributor Network</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add Distributor</span>
              </button>
            </div>

            <div className="space-y-4">
              {mockRegionalData.distributors.map((distributor) => (
                <div key={distributor.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-kobklein-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {distributor.name.charAt(0)}
                        </span>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h4 className="text-lg font-semibold">{distributor.name}</h4>
                          <Badge 
                            variant="outline"
                            className={
                              distributor.status === 'active' ? 'text-green-600 border-green-200' :
                              'text-yellow-600 border-yellow-200'
                            }
                          >
                            {distributor.status}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm font-medium">{distributor.performance}%</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Location</p>
                            <p className="font-medium">{distributor.location}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Zone</p>
                            <p className="font-medium">{distributor.zone}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Users Managed</p>
                            <p className="font-medium">{distributor.usersManaged} / {distributor.monthlyTarget}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Cards in Stock</p>
                            <p className={`font-medium ${distributor.cardsInStock < 20 ? 'text-red-600' : 'text-green-600'}`}>
                              {distributor.cardsInStock}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-2">
                          <div>
                            <p className="text-muted-foreground">Contact</p>
                            <p className="font-medium">{distributor.contact}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Joined</p>
                            <p className="font-medium">{formatDate(distributor.joinDate)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Last Active</p>
                            <p className="font-medium">{formatDate(distributor.lastActivity, { includeTime: true })}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Target Progress</p>
                            <p className="font-medium">{Math.round((distributor.usersManaged / distributor.monthlyTarget) * 100)}%</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Monthly Target Progress</span>
                            <span>{Math.round((distributor.usersManaged / distributor.monthlyTarget) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                (distributor.usersManaged / distributor.monthlyTarget) >= 0.8 ? 'bg-green-500' :
                                (distributor.usersManaged / distributor.monthlyTarget) >= 0.6 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${Math.min((distributor.usersManaged / distributor.monthlyTarget) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors">
                        <Eye className="h-3 w-3 inline mr-1" />
                        View Details
                      </button>
                      <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors">
                        <Send className="h-3 w-3 inline mr-1" />
                        Send Cards
                      </button>
                      {distributor.status === 'warning' && (
                        <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-xs hover:bg-yellow-200 transition-colors">
                          <Phone className="h-3 w-3 inline mr-1" />
                          Contact
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </KobKleinCard>

          {/* Regional Challenges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Current Challenges</h3>
              <div className="space-y-4">
                {mockRegionalData.regionalStats.challenges.map((challenge) => (
                  <div 
                    key={challenge.id} 
                    className={`border rounded-lg p-4 ${
                      challenge.severity === 'high' ? 'border-red-200 bg-red-50' :
                      'border-yellow-200 bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-sm">{challenge.title}</h4>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={
                          challenge.severity === 'high' ? 'text-red-600 border-red-200' :
                          'text-yellow-600 border-yellow-200'
                        }
                      >
                        {challenge.severity}
                      </Badge>
                    </div>
                    
                    <div className="text-sm">
                      <p className="text-muted-foreground">
                        <strong>Action Required:</strong> {challenge.actionRequired}
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Due Date:</strong> {formatDate(challenge.dueDate)}
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Affected Zones:</strong> {challenge.affectedZones.join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
              <div className="space-y-3">
                {mockRegionalData.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.impact === 'positive' ? 'bg-green-100' :
                      activity.impact === 'negative' ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      {activity.type === 'distributor_approval' && <UserPlus className="h-4 w-4 text-green-600" />}
                      {activity.type === 'card_delivery' && <Package className="h-4 w-4 text-green-600" />}
                      {activity.type === 'merchant_issue' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                      {activity.type === 'training_session' && <Award className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                        <span>Zone: {activity.zone}</span>
                        <span>{formatDate(activity.timestamp, { includeTime: true })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </KobKleinCard>
          </div>

          {/* Regional Action Center */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">🎯 Regional Action Center</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <Plus className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Onboard Distributor</span>
              </button>
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <Package className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Request Cards</span>
              </button>
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <Award className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Schedule Training</span>
              </button>
              <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
                <Download className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Generate Report</span>
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}