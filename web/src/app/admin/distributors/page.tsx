// File: kobklein/web/src/app/admin/distributors/page.tsx

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
  Package,
  UserPlus
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Distributor Management | KobKlein Admin",
  description: "Monitor and manage KobKlein distributors and territories",
};

const mockDistributors = [
  {
    id: 'DIST_001',
    name: 'Pierre Distributeur',
    email: 'pierre.dist@example.com',
    phone: '+509 2468 1357',
    territory: 'Port-au-Prince Central',
    status: 'active',
    joinDate: '2024-01-10',
    stats: {
      totalUsers: 234,
      activeUsers: 187,
      merchants: 45,
      monthlyVolume: 450800.00,
      commission: 22540.00,
      cardsSold: 200,
      cardsRemaining: 67,
    },
    performance: {
      monthlyGrowth: 12.4,
      targetCompletion: 93.6,
      rating: 4.8,
    },
  },
  {
    id: 'DIST_002',
    name: 'Marie Agent',
    email: 'marie.agent@example.com',
    phone: '+509 4444 6666',
    territory: 'Pétion-Ville',
    status: 'active',
    joinDate: '2024-02-28',
    stats: {
      totalUsers: 189,
      activeUsers: 156,
      merchants: 32,
      monthlyVolume: 367200.00,
      commission: 18360.00,
      cardsSold: 150,
      cardsRemaining: 23,
    },
    performance: {
      monthlyGrowth: 8.7,
      targetCompletion: 84.5,
      rating: 4.6,
    },
  },
  {
    id: 'DIST_003',
    name: 'Jean Services',
    email: 'jean.services@example.com',
    phone: '+509 7777 8888',
    territory: 'Delmas',
    status: 'active',
    joinDate: '2024-03-15',
    stats: {
      totalUsers: 145,
      activeUsers: 112,
      merchants: 28,
      monthlyVolume: 298450.00,
      commission: 14922.50,
      cardsSold: 120,
      cardsRemaining: 45,
    },
    performance: {
      monthlyGrowth: 15.2,
      targetCompletion: 72.5,
      rating: 4.4,
    },
  },
  {
    id: 'DIST_004',
    name: 'Sophie Distributrice',
    email: 'sophie.d@example.com',
    phone: '+509 5555 9999',
    territory: 'Cap-Haïtien',
    status: 'warning',
    joinDate: '2024-04-20',
    stats: {
      totalUsers: 87,
      activeUsers: 65,
      merchants: 15,
      monthlyVolume: 156700.00,
      commission: 7835.00,
      cardsSold: 80,
      cardsRemaining: 8,
    },
    performance: {
      monthlyGrowth: -2.3,
      targetCompletion: 43.5,
      rating: 3.9,
    },
  },
];

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
    isActive: true,
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

export default function AdminDistributorsPage() {
  const totalStats = mockDistributors.reduce((acc, dist) => ({
    totalUsers: acc.totalUsers + dist.stats.totalUsers,
    totalVolume: acc.totalVolume + dist.stats.monthlyVolume,
    totalCommission: acc.totalCommission + dist.stats.commission,
    totalCards: acc.totalCards + dist.stats.cardsSold,
  }), { totalUsers: 0, totalVolume: 0, totalCommission: 0, totalCards: 0 });

  return (
    <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
      <DashboardLayout
        title="Distributor Management"
        userRole="admin"
        navigation={adminNavigation}
        notifications={15}
      >
        <div className="space-y-6">
          {/* Distributor Network Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Distributors</p>
                  <h3 className="text-2xl font-bold">{mockDistributors.length}</h3>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Active: {mockDistributors.filter(d => d.status === 'active').length}
              </p>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Network Users</p>
                  <h3 className="text-2xl font-bold">{totalStats.totalUsers}</h3>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Across all territories
              </p>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                  <h3 className="text-xl font-bold">{formatCurrency(totalStats.totalVolume, 'HTG')}</h3>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This month
              </p>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cards Distributed</p>
                  <h3 className="text-2xl font-bold">{totalStats.totalCards}</h3>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Total cards sold
              </p>
            </KobKleinCard>
          </div>

          {/* Distributors List */}
          <KobKleinCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Active Distributors</h3>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-kobklein-accent text-white rounded-lg text-sm hover:bg-kobklein-accent/90 transition-colors">
                  Add Distributor
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Export Data
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {mockDistributors.map((distributor) => (
                <div
                  key={distributor.id}
                  className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-kobklein-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {distributor.name.charAt(0)}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold">{distributor.name}</h4>
                          <Badge 
                            variant="outline" 
                            className={distributor.status === 'active' 
                              ? 'text-green-600 border-green-200' 
                              : 'text-yellow-600 border-yellow-200'
                            }
                          >
                            {distributor.status}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm font-medium">{distributor.performance.rating}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Territory</p>
                            <p className="font-medium">{distributor.territory}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Users</p>
                            <p className="font-medium">{distributor.stats.totalUsers} total</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Monthly Volume</p>
                            <p className="font-medium">{formatCurrency(distributor.stats.monthlyVolume, 'HTG')}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Commission</p>
                            <p className="font-medium">{formatCurrency(distributor.stats.commission, 'HTG')}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                          <div>
                            <p className="text-muted-foreground">Contact</p>
                            <p className="font-medium">{distributor.phone}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Growth</p>
                            <p className={`font-medium ${distributor.performance.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {distributor.performance.monthlyGrowth >= 0 ? '+' : ''}{distributor.performance.monthlyGrowth}%
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Cards Stock</p>
                            <p className={`font-medium ${distributor.stats.cardsRemaining < 20 ? 'text-red-600' : 'text-green-600'}`}>
                              {distributor.stats.cardsRemaining} remaining
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Target</p>
                            <p className="font-medium">{distributor.performance.targetCompletion}%</p>
                          </div>
                        </div>

                        {/* Progress Bars */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Monthly Target</span>
                              <span>{distributor.performance.targetCompletion}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${Math.min(distributor.performance.targetCompletion, 100)}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Card Stock</span>
                              <span>{Math.round((distributor.stats.cardsRemaining / (distributor.stats.cardsSold + distributor.stats.cardsRemaining)) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${distributor.stats.cardsRemaining < 20 ? 'bg-red-500' : 'bg-green-500'}`}
                                style={{ width: `${Math.round((distributor.stats.cardsRemaining / (distributor.stats.cardsSold + distributor.stats.cardsRemaining)) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors">
                        View Details
                      </button>
                      <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors">
                        Send Cards
                      </button>
                      {distributor.status === 'warning' && (
                        <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-xs hover:bg-yellow-200 transition-colors">
                          Review Performance
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </KobKleinCard>

          {/* Performance Summary */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-indigo-700 mb-3">
              📊 Distributor Network Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-indigo-700">
              <div>
                <p className="font-medium mb-1">• Network Growth:</p>
                <p>Average 8.5% monthly growth across territories</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Target Achievement:</p>
                <p>73% of distributors meeting monthly targets</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Card Distribution:</p>
                <p>550 cards distributed this month, 143 remaining</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}