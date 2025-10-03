import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserRole } from "@/types/auth";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Package,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";

export default function DistributorDashboard() {
  // Sample data for the distributor dashboard
  const mockInventoryData = [
    {
      id: "1",
      cardType: "Standard",
      available: 2500,
      allocated: 1200,
      shipped: 800,
      status: "In Stock",
    },
    {
      id: "2",
      cardType: "Premium",
      available: 1500,
      allocated: 900,
      shipped: 600,
      status: "Low Stock",
    },
    {
      id: "3",
      cardType: "Business",
      available: 800,
      allocated: 400,
      shipped: 300,
      status: "In Stock",
    },
  ];

  const mockTerritoriesData = [
    {
      id: "1",
      name: "Port-au-Prince North",
      merchants: 45,
      activeCards: 12500,
      monthlyVolume: 2850000,
      status: "Active",
    },
    {
      id: "2",
      name: "Port-au-Prince South",
      merchants: 38,
      activeCards: 9800,
      monthlyVolume: 2100000,
      status: "Active",
    },
    {
      id: "3",
      name: "Cap-Haïtien",
      merchants: 22,
      activeCards: 5600,
      monthlyVolume: 1200000,
      status: "Expanding",
    },
    {
      id: "4",
      name: "Gonaïves",
      merchants: 15,
      activeCards: 3200,
      monthlyVolume: 850000,
      status: "New",
    },
  ];

  const recentShipments = [
    {
      id: "SHIP001",
      destination: "Merchant Hub - Pétion-Ville",
      cardCount: 500,
      type: "Standard Cards",
      status: "Delivered",
      date: "2025-01-14",
      trackingNumber: "TRK123456789",
    },
    {
      id: "SHIP002",
      destination: "Regional Office - Cap-Haïtien",
      cardCount: 300,
      type: "Premium Cards",
      status: "In Transit",
      date: "2025-01-13",
      trackingNumber: "TRK123456790",
    },
    {
      id: "SHIP003",
      destination: "Local Agent - Gonaïves",
      cardCount: 200,
      type: "Business Cards",
      status: "Processing",
      date: "2025-01-12",
      trackingNumber: "TRK123456791",
    },
  ];

  const distributorNavigation = [
    {
      label: "Dashboard",
      href: "/dashboard/distributor",
      icon: "Home" as const,
      isActive: true,
    },
    {
      label: "Inventory",
      href: "/dashboard/distributor/inventory",
      icon: "Package" as const,
    },
    {
      label: "Card Management",
      href: "/dashboard/distributor/cards",
      icon: "CreditCard" as const,
    },
    {
      label: "Territories",
      href: "/dashboard/distributor/territories",
      icon: "MapPin" as const,
    },
    {
      label: "Merchants",
      href: "/dashboard/distributor/merchants",
      icon: "Users" as const,
    },
    {
      label: "Shipments",
      href: "/dashboard/distributor/shipments",
      icon: "Truck" as const,
    },
    {
      label: "Analytics",
      href: "/dashboard/distributor/analytics",
      icon: "BarChart3" as const,
    },
    {
      label: "Settings",
      href: "/dashboard/distributor/settings",
      icon: "Settings" as const,
    },
  ];

  return (
    <ProtectedRoute allowedRoles={[UserRole.DISTRIBUTOR]}>
      <DashboardLayout
        title="Distributor Hub"
        userRole={UserRole.DISTRIBUTOR}
        navigation={distributorNavigation}
        walletBalance={{ htg: 85000, usd: 630 }}
        notifications={3}
      >
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Territories
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">+1 new this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Merchants
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">120</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cards in Stock
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4,800</div>
              <p className="text-xs text-muted-foreground">
                Available for distribution
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Volume
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">HTG 7.0M</div>
              <p className="text-xs text-muted-foreground">
                +18% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Inventory Overview */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Inventory Overview</CardTitle>
              <CardDescription>
                Current stock levels by card type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInventoryData.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{item.cardType} Cards</p>
                        <p className="text-sm text-muted-foreground">
                          Available: {item.available.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        {item.status === "Low Stock" ? (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            item.status === "Low Stock"
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Allocated: {item.allocated} | Shipped: {item.shipped}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your distribution operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                <Package className="h-4 w-4" />
                <span>Request Inventory</span>
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                <Truck className="h-4 w-4" />
                <span>Create Shipment</span>
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-50 py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Add Merchant</span>
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-50 py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Manage Territories</span>
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-50 py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>View Analytics</span>
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Shipments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Recent Shipments
              </CardTitle>
              <CardDescription>
                Track your latest card distributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentShipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    className="flex items-center space-x-4 p-3 border rounded-lg"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {shipment.status === "Delivered" && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {shipment.status === "In Transit" && (
                        <Truck className="h-4 w-4 text-blue-600" />
                      )}
                      {shipment.status === "Processing" && (
                        <Clock className="h-4 w-4 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {shipment.destination}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {shipment.cardCount} {shipment.type} • {shipment.date}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tracking: {shipment.trackingNumber}
                      </p>
                    </div>
                    <div
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        shipment.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : shipment.status === "In Transit"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {shipment.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Territory Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Territory Performance</CardTitle>
              <CardDescription>
                Overview of your distribution territories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTerritoriesData.map((territory) => (
                  <div
                    key={territory.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{territory.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {territory.merchants} merchants •{" "}
                        {territory.activeCards.toLocaleString()} active cards
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">
                        HTG {(territory.monthlyVolume / 1000000).toFixed(1)}M
                      </p>
                      <div
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          territory.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : territory.status === "Expanding"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {territory.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
