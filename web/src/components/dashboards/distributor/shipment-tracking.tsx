import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, Package, Truck } from "lucide-react";

interface Shipment {
  id: string;
  trackingNumber: string;
  destination: string;
  merchant: string;
  status: "pending" | "in-transit" | "delivered" | "delayed";
  items: Array<{
    name: string;
    quantity: number;
    sku: string;
  }>;
  estimatedDelivery: string;
  actualDelivery?: string;
  priority: "low" | "medium" | "high";
}

interface ShipmentTrackingProps {
  shipments: Shipment[];
}

export function ShipmentTracking({ shipments }: ShipmentTrackingProps) {
  const pendingShipments = shipments.filter(
    (s) => s.status === "pending"
  ).length;
  const inTransitShipments = shipments.filter(
    (s) => s.status === "in-transit"
  ).length;
  const deliveredToday = shipments.filter(
    (s) =>
      s.status === "delivered" &&
      s.actualDelivery === new Date().toISOString().split("T")[0]
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-transit":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "delayed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "in-transit":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "delayed":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 border-red-200";
      case "medium":
        return "bg-yellow-50 border-yellow-200";
      case "low":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Shipments
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingShipments}</div>
            <p className="text-xs text-muted-foreground">Awaiting pickup</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inTransitShipments}</div>
            <p className="text-xs text-muted-foreground">On the way</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Delivered Today
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredToday}</div>
            <p className="text-xs text-muted-foreground">
              Completed deliveries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Shipments
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shipments.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Shipments */}
      <Card>
        <CardHeader>
          <CardTitle>Active Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {shipments
              .filter((s) => s.status !== "delivered")
              .slice(0, 8)
              .map((shipment) => (
                <div
                  key={shipment.id}
                  className={`p-4 border rounded-lg ${getPriorityColor(
                    shipment.priority
                  )}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(shipment.status)}
                      <div>
                        <div className="font-medium">
                          #{shipment.trackingNumber}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          To: {shipment.merchant} • {shipment.destination}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {shipment.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(shipment.status)}>
                        {shipment.status.replace("-", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium mb-1">
                        Items ({shipment.items.length})
                      </div>
                      <div className="text-muted-foreground">
                        {shipment.items.slice(0, 2).map((item, idx) => (
                          <div key={idx}>
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                        {shipment.items.length > 2 && (
                          <div>+{shipment.items.length - 2} more items</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">Expected Delivery</div>
                      <div className="text-muted-foreground">
                        {shipment.estimatedDelivery}
                      </div>
                      {shipment.actualDelivery && (
                        <div className="text-green-600 font-medium">
                          Delivered: {shipment.actualDelivery}
                        </div>
                      )}
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

