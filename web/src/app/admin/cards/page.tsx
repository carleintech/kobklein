// File: kobklein/web/src/app/admin/cards/page.tsx

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
  Plus,
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Download
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Card Management | KobKlein Admin",
  description: "Manage KobKlein card inventory, batches, and distribution",
};

// Mock card management data
const mockCardData = {
  inventory: {
    totalCards: 50000,
    distributedCards: 38456,
    activeCards: 35789,
    inactiveCards: 2667,
    pendingActivation: 1234,
    stockRemaining: 11544,
    defectiveCards: 89,
  },
  cardBatches: [
    {
      id: 'BATCH_2025_001',
      batchNumber: 'KK-2025-001',
      quantity: 5000,
      cardType: 'client',
      productionDate: '2025-01-10',
      status: 'delivered' as const,
      distributor: 'Pierre Distributeur',
      distributorLocation: 'Port-au-Prince Central',
      deliveryDate: '2025-01-12',
      activatedCount: 3456,
      notes: 'Standard client cards',
    },
    {
      id: 'BATCH_2025_002',
      batchNumber: 'KK-2025-002',
      quantity: 2000,
      cardType: 'merchant',
      productionDate: '2025-01-08',
      status: 'in_transit' as const,
      distributor: 'Marie Agent',
      distributorLocation: 'Pétion-Ville',
      deliveryDate: '2025-01-15',
      activatedCount: 0,
      notes: 'Merchant premium cards',
    },
    {
      id: 'BATCH_2025_003',
      batchNumber: 'KK-2025-003',
      quantity: 1000,
      cardType: 'distributor',
      productionDate: '2025-01-12',
      status: 'production' as const,
      distributor: 'Pending Assignment',
      distributorLocation: 'TBD',
      deliveryDate: '2025-01-20',
      activatedCount: 0,
      notes: 'Special distributor cards with enhanced features',
    },
    {
      id: 'BATCH_2025_004',
      batchNumber: 'KK-2025-004',
      quantity: 3000,
      cardType: 'client',
      productionDate: '2025-01-13',
      status: 'ready' as const,
      distributor: 'Jean Services',
      distributorLocation: 'Delmas',
      deliveryDate: '2025-01-16',
      activatedCount: 0,
      notes: 'Rush order for Delmas region',
    },
  ],
  activationStats: {
    todayActivations: 156,
    weeklyActivations: 1234,
    monthlyActivations: 4567,
    activationRate: 89.6,
    averageTimeToActivation: 3.2, // days
  },
  cardTypes: [
    {
      type: 'Basic Client Card',
      price: 15.00,
      inStock: 8456,
      features: ['NFC Enabled', 'QR Code', 'Basic Wallet'],
      color: 'Blue',
    },
    {
      type: 'Named Client Card',
      price: 20.00,
      inStock: 2234,
      features: ['NFC Enabled', 'QR Code', 'Photo ID', 'Apple/Google Pay'],
      color: 'Dark Blue',
    },
    {
      type: 'Merchant Pro Card',
      price: 50.00,
      inStock: 567,
      features: ['NFC Enabled', 'QR Code', 'POS Integration', 'No Withdrawal Fees'],
      color: 'Gold',
    },
    {
      type: 'Distributor Card',
      price: 100.00,
      inStock: 123,
      features: ['NFC Enabled', 'QR Code', 'Admin Features', 'Commission Tracking'],
      color: 'Black',
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
    isActive: true,
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

export default function AdminCardsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
      <DashboardLayout
        title="Card Management"
        userRole="admin"
        navigation={adminNavigation}
        notifications={15}
      >
        <div className="space-y-6">
          {/* Card Management Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Card Inventory & Distribution</h2>
              <p className="text-muted-foreground">Manage KobKlein card production, distribution, and activation</p>
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>New Batch</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-kobklein-accent text-white rounded-lg hover:bg-kobklein-accent/90 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Card Inventory Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Cards</p>
                  <h3 className="text-2xl font-bold">{mockCardData.inventory.totalCards.toLocaleString()}</h3>
                  <p className="text-xs text-muted-foreground">
                    {mockCardData.inventory.distributedCards.toLocaleString()} distributed
                  </p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Cards</p>
                  <h3 className="text-2xl font-bold">{mockCardData.inventory.activeCards.toLocaleString()}</h3>
                  <p className="text-xs text-green-600">
                    {mockCardData.activationStats.activationRate}% activation rate
                  </p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Activation</p>
                  <h3 className="text-2xl font-bold">{mockCardData.inventory.pendingActivation.toLocaleString()}</h3>
                  <p className="text-xs text-muted-foreground">
                    Avg {mockCardData.activationStats.averageTimeToActivation} days to activate
                  </p>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stock Remaining</p>
                  <h3 className="text-2xl font-bold">{mockCardData.inventory.stockRemaining.toLocaleString()}</h3>
                  <p className="text-xs text-muted-foreground">
                    Available for distribution
                  </p>
                </div>
              </div>
            </KobKleinCard>
          </div>

          {/* Card Types and Pricing */}
          <KobKleinCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Card Types & Inventory</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockCardData.cardTypes.map((cardType, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-sm">{cardType.type}</h4>
                      <p className="text-xs text-muted-foreground">{cardType.color} design</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      ${cardType.price}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">In Stock</span>
                      <span className="text-sm font-bold">{cardType.inStock.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          cardType.inStock > 5000 ? 'bg-green-500' :
                          cardType.inStock > 1000 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((cardType.inStock / 10000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    {cardType.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-kobklein-accent rounded-full"></div>
                        <span className="text-xs text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </KobKleinCard>

          {/* Card Batch Management */}
          <KobKleinCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Card Batch Tracking</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search batches..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
                  />
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent">
                  <option value="">All Status</option>
                  <option value="production">Production</option>
                  <option value="ready">Ready</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Batch</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Quantity</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Distributor</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Delivery Date</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Activated</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCardData.cardBatches.map((batch) => (
                    <tr key={batch.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-sm">{batch.batchNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            Produced: {formatDate(batch.productionDate)}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge 
                          variant="outline"
                          className={
                            batch.cardType === 'client' ? 'text-blue-600 border-blue-200' :
                            batch.cardType === 'merchant' ? 'text-green-600 border-green-200' :
                            'text-purple-600 border-purple-200'
                          }
                        >
                          {batch.cardType}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium">{batch.quantity.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className={
                              batch.status === 'delivered' ? 'text-green-600 border-green-200' :
                              batch.status === 'in_transit' ? 'text-orange-600 border-orange-200' :
                              batch.status === 'ready' ? 'text-blue-600 border-blue-200' :
                              'text-gray-600 border-gray-200'
                            }
                          >
                            <div className="flex items-center space-x-1">
                              {batch.status === 'delivered' && <CheckCircle2 className="h-3 w-3" />}
                              {batch.status === 'in_transit' && <Truck className="h-3 w-3" />}
                              {batch.status === 'ready' && <Package className="h-3 w-3" />}
                              {batch.status === 'production' && <Clock className="h-3 w-3" />}
                              <span>{batch.status.replace('_', ' ')}</span>
                            </div>
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm font-medium">{batch.distributor}</p>
                          <p className="text-xs text-muted-foreground">{batch.distributorLocation}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm">{formatDate(batch.deliveryDate)}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm font-bold">{batch.activatedCount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {((batch.activatedCount / batch.quantity) * 100).toFixed(1)}% activated
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                            <eye className="h-4 w-4" />
                          </button>
                          {batch.status === 'ready' && (
                            <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                              <Truck className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </KobKleinCard>

          {/* Activation Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activation Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Today</p>
                    <p className="text-xs text-muted-foreground">Card activations</p>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {mockCardData.activationStats.todayActivations}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">This Week</p>
                    <p className="text-xs text-muted-foreground">Card activations</p>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {mockCardData.activationStats.weeklyActivations.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">This Month</p>
                    <p className="text-xs text-muted-foreground">Card activations</p>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">
                    {mockCardData.activationStats.monthlyActivations.toLocaleString()}
                  </span>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Card Issues & Alerts</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-700">Defective Cards</p>
                      <p className="text-xs text-red-600">Cards reported as faulty</p>
                    </div>
                  </div>
                  <span className="font-bold text-red-600">{mockCardData.inventory.defectiveCards}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-700">Low Stock Alert</p>
                      <p className="text-xs text-yellow-600">Merchant cards below threshold</p>
                    </div>
                  </div>
                  <span className="font-bold text-yellow-600">2 types</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-700">Production Queue</p>
                      <p className="text-xs text-blue-600">Batches in production</p>
                    </div>
                  </div>
                  <span className="font-bold text-blue-600">3 batches</span>
                </div>
              </div>
            </KobKleinCard>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}