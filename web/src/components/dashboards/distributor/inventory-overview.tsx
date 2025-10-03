import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useDistributorStats } from "@/hooks/use-api";
import { AlertTriangle, CheckCircle, Package, TrendingUp } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minThreshold: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  category: string;
  value: number;
}

interface InventoryOverviewProps {
  items?: InventoryItem[];
}

export function InventoryOverview({
  items: fallbackItems = [],
}: InventoryOverviewProps) {
  const {
    data: distributorStatsResponse,
    isLoading,
    error,
    refetch,
  } = useDistributorStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 flex justify-center">
                <LoadingSpinner size="sm" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive mb-4">
              Failed to load distributor stats
            </p>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const distributorStats = distributorStatsResponse?.data;

  // Mock inventory data based on distributor stats
  const items =
    fallbackItems.length > 0
      ? fallbackItems
      : [
          {
            id: "1",
            name: "KobKlein NFC Cards",
            sku: "KKC-001",
            quantity: distributorStats?.cardsSold.active || 150,
            minThreshold: 50,
            status:
              (distributorStats?.cardsSold.active || 150) > 50
                ? "in-stock"
                : ("low-stock" as const),
            category: "Cards",
            value: 25,
          },
          {
            id: "2",
            name: "Card Activation Kits",
            sku: "CAK-002",
            quantity: 30,
            minThreshold: 10,
            status: "in-stock" as const,
            category: "Accessories",
            value: 15,
          },
          {
            id: "3",
            name: "POS Terminal Stands",
            sku: "PTS-003",
            quantity: 5,
            minThreshold: 10,
            status: "low-stock" as const,
            category: "Hardware",
            value: 85,
          },
        ];

  const totalValue = items.reduce(
    (sum, item) => sum + item.quantity * item.value,
    0
  );
  const lowStockItems = items.filter(
    (item) => item.status === "low-stock"
  ).length;
  const outOfStockItems = items.filter(
    (item) => item.status === "out-of-stock"
  ).length;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-800";
      case "low-stock":
        return "bg-yellow-100 text-yellow-800";
      case "out-of-stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-stock":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "low-stock":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "out-of-stock":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inventory Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalValue.toLocaleString()} HTG
            </div>
            <p className="text-xs text-muted-foreground">
              Across {items.length} product types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalItems.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Cards sold: {distributorStats?.cardsSold.total || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {lowStockItems}
            </div>
            <p className="text-xs text-muted-foreground">
              Items below threshold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(distributorStats?.monthlyVolume.htg || 0).toLocaleString()} HTG
            </div>
            <p className="text-xs text-muted-foreground">
              Commission earned:{" "}
              {(distributorStats?.commission.earned || 0).toLocaleString()} HTG
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.slice(0, 10).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      SKU: {item.sku}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(item.status)}>
                    {item.status.replace("-", " ").toUpperCase()}
                  </Badge>
                  <div className="text-right">
                    <div className="font-medium">{item.quantity} units</div>
                    <div className="text-sm text-muted-foreground">
                      Min: {item.minThreshold}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

