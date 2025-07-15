// File: kobklein/web/src/app/distributor/inventory/page.tsx

import { Metadata } from "next";
import { 
  Home, 
  UserPlus, 
  RefreshCw, 
  DollarSign, 
  MapPin,
  BarChart3,
  Users,
  Package,
  HelpCircle,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const metadata: Metadata = {
  title: "Card Inventory | KobKlein Distributor",
  description: "Manage your KobKlein card inventory and order new cards",
};

const mockInventoryData = {
  totalCards: 200,
  availableCards: 67,
  distributedCards: 133,
  lowStockAlert: true,
  reorderLevel: 50,
  lastOrder: {
    quantity: 100,
    date: '2024-12-15',
    status: 'delivered',
  },
};

const mockCardBatches = [
  {
    id: 'BATCH_001',
    cardRange: 'KK010001 - KK010100',
    quantity: 100,
    status: 'available',
    receivedDate: '2024-12-15',
    distributed: 33,
  },
  {
    id: 'BATCH_002',
    cardRange: 'KK009901 - KK010000',
    quantity: 100,
    status: 'distributed',
    receivedDate: '2024-11-20',
    distributed: 100,
  },
  {
    id: 'BATCH_003',
    cardRange: 'KK009801 - KK009900',
    quantity: 100,
    status: 'distributed',
    receivedDate: '2024-10-25',
    distributed: 100,
  },
];

const distributorNavigation = [
  {
    label: 'Dashboard',
    href: '/distributor/dashboard',
    icon: Home,
  },
  {
    label: 'Onboard Users',
    href: '/distributor/onboard',
    icon: UserPlus,
  },
  {
    label: 'Refill Requests',
    href: '/distributor/refill-requests',
    icon: RefreshCw,
    badge: 3,
  },
  {
    label: 'My Territory',
    href: '/distributor/territory',
    icon: MapPin,
  },
  {
    label: 'Commission',
    href: '/distributor/commission',
    icon: DollarSign,
  },
  {
    label: 'Analytics',
    href: '/distributor/analytics',
    icon: BarChart3,
  },
  {
    label: 'Card Inventory',
    href: '/distributor/inventory',
    icon: Package,
    isActive: true,
  },
  {
    label: 'Support',
    href: '/distributor/support',
    icon: HelpCircle,
  },
];

export default function DistributorInventoryPage() {
  return (
    <ProtectedRoute allowedRoles={['distributor', 'admin', 'super_admin']}>
      <DashboardLayout
        title="Card Inventory"
        userRole="distributor"
        navigation={distributorNavigation}
        walletBalance={{
          htg: 22540.00,
          usd: 182.75,
        }}
        notifications={7}
      >
        <div className="space-y-6">
          {/* Inventory Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Cards</p>
                  <h3 className="text-2xl font-bold">{mockInventoryData.totalCards}</h3>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available</p>
                  <h3 className="text-2xl font-bold">{mockInventoryData.availableCards}</h3>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Distributed</p>
                  <h3 className="text-2xl font-bold">{mockInventoryData.distributedCards}</h3>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <h3 className="text-lg font-bold text-amber-600">Low Stock</h3>
                </div>
              </div>
            </KobKleinCard>
          </div>

          {/* Low Stock Alert */}
          {mockInventoryData.lowStockAlert && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-amber-700">Low Stock Alert</h4>
                  <p className="text-sm text-amber-600">
                    You have {mockInventoryData.availableCards} cards remaining. 
                    Consider ordering more cards when you reach {mockInventoryData.reorderLevel} cards.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Order Now
                </Button>
              </div>
            </div>
          )}

          {/* Order New Cards */}
          <KobKleinCard className="p-6">
            <h3 className="text-lg font-semibold mb-6">Order New Cards</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="50">50 cards - HTG 2,500</option>
                    <option value="100">100 cards - HTG 4,500 (10% discount)</option>
                    <option value="200">200 cards - HTG 8,000 (20% discount)</option>
                    <option value="500">500 cards - HTG 17,500 (30% discount)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Card Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="standard">Standard Cards (Blue)</option>
                    <option value="merchant">Merchant Cards (Green)</option>
                    <option value="premium">Premium Cards (Black)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Address</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Enter your delivery address..."
                    defaultValue="Port-au-Prince Central Distribution Office&#10;Rue Pavée, Port-au-Prince"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-700 mb-2">Order Summary</h4>
                  <div className="space-y-2 text-sm text-blue-600">
                    <div className="flex justify-between">
                      <span>100 Standard Cards:</span>
                      <span>HTG 4,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span>HTG 200</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount (10%):</span>
                      <span>-HTG 450</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total:</span>
                      <span>HTG 4,250</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-700 mb-2">Delivery Information</h4>
                  <div className="space-y-1 text-sm text-green-600">
                    <p>• Delivery Time: 3-5 business days</p>
                    <p>• Payment: Deducted from commission</p>
                    <p>• Tracking: SMS updates provided</p>
                    <p>• Support: 24/7 assistance available</p>
                  </div>
                </div>

                <Button variant="kobklein" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Place Order
                </Button>
              </div>
            </div>
          </KobKleinCard>

          {/* Card Batches */}
          <KobKleinCard className="p-6">
            <h3 className="text-lg font-semibold mb-6">Card Batches</h3>
            
            <div className="space-y-4">
              {mockCardBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-kobklein-accent rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    
                    <div>
                      <h4 className="font-medium">{batch.id}</h4>
                      <p className="text-sm text-muted-foreground">
                        {batch.cardRange} • {batch.quantity} cards
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Received: {new Date(batch.receivedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge 
                      variant="outline" 
                      className={batch.status === 'available' 
                        ? 'text-green-600 border-green-200' 
                        : 'text-gray-600 border-gray-200'
                      }
                    >
                      {batch.status === 'available' ? 'Available' : 'Distributed'}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {batch.distributed}/{batch.quantity} distributed
                    </p>
                    {batch.status === 'available' && (
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(batch.distributed / batch.quantity) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </KobKleinCard>

          {/* Order History */}
          <KobKleinCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
            
            <div className="space-y-3">
              {[
                { id: 'ORD_003', quantity: 100, date: '2024-12-15', status: 'delivered', total: 4250 },
                { id: 'ORD_002', quantity: 100, date: '2024-11-20', status: 'delivered', total: 4250 },
                { id: 'ORD_001', quantity: 50, date: '2024-10-25', status: 'delivered', total: 2500 },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Package className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.quantity} cards • {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">HTG {order.total.toLocaleString()}</p>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </KobKleinCard>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}