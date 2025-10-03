import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, TrendingUp, Store } from "lucide-react";

interface Merchant {
  id: string;
  name: string;
  businessName: string;
  location: string;
  status: "active" | "inactive" | "pending";
  monthlyVolume: number;
  cardsIssued: number;
  lastActivity: string;
  contactPerson: string;
  phone: string;
}

interface MerchantNetworkProps {
  merchants: Merchant[];
}

export function MerchantNetwork({ merchants }: MerchantNetworkProps) {
  const activeMerchants = merchants.filter(m => m.status === "active").length;
  const totalVolume = merchants.reduce((sum, m) => sum + m.monthlyVolume, 0);
  const totalCards = merchants.reduce((sum, m) => sum + m.cardsIssued, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Merchants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMerchants}</div>
            <p className="text-xs text-muted-foreground">
              Out of {merchants.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVolume.toLocaleString()} HTG</div>
            <p className="text-xs text-muted-foreground">
              Network-wide transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cards Distributed</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCards.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total cards in circulation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage Areas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(merchants.map(m => m.location)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Geographic locations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Merchant List */}
      <Card>
        <CardHeader>
          <CardTitle>Merchant Network</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {merchants.slice(0, 8).map((merchant) => (
              <div key={merchant.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-kobklein-primary rounded-full flex items-center justify-center">
                    <Store className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{merchant.businessName}</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {merchant.location}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Contact: {merchant.contactPerson} • {merchant.phone}
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Badge className={getStatusColor(merchant.status)}>
                    {merchant.status.toUpperCase()}
                  </Badge>
                  <div className="text-sm font-medium">
                    {merchant.monthlyVolume.toLocaleString()} HTG/month
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {merchant.cardsIssued} cards issued
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last active: {merchant.lastActivity}
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
