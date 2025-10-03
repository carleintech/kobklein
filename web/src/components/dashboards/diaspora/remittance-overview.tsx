import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { ArrowUpRight, Clock, DollarSign, Globe, Send } from "lucide-react";

interface RemittanceData {
  totalSent: number;
  totalRecipients: number;
  averageAmount: number;
  thisMonthSent: number;
  thisMonthCount: number;
  preferredCountry: string;
  exchangeRate: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  action: () => void;
  color: string;
}

interface RemittanceOverviewProps {
  data: RemittanceData;
}

export function RemittanceOverview({ data }: RemittanceOverviewProps) {
  const quickActions: QuickAction[] = [
    {
      id: "send-money",
      title: "Send Money",
      description: "Quick transfer to Haiti",
      icon: Send,
      action: () => console.log("Send money"),
      color: "bg-kobklein-primary hover:bg-kobklein-primary/90",
    },
    {
      id: "add-recipient",
      title: "Add Recipient",
      description: "New family member",
      icon: ArrowUpRight,
      action: () => console.log("Add recipient"),
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      id: "exchange-rate",
      title: "Check Rates",
      description: "USD to HTG rates",
      icon: DollarSign,
      action: () => console.log("Exchange rates"),
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: "schedule-transfer",
      title: "Schedule Transfer",
      description: "Recurring payments",
      icon: Clock,
      action: () => console.log("Schedule transfer"),
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${data.totalSent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Lifetime remittances
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${data.thisMonthSent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.thisMonthCount} transfers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recipients</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalRecipients}</div>
            <p className="text-xs text-muted-foreground">Family & friends</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exchange Rate</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.exchangeRate} HTG</div>
            <p className="text-xs text-muted-foreground">Per 1 USD</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-center space-y-2 ${action.color} text-white border-none`}
                  onClick={action.action}
                >
                  <Icon className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs opacity-90">
                      {action.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Transfer Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Average Transfer</span>
              <span className="text-lg font-bold">${data.averageAmount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Preferred Destination</span>
              <Badge variant="outline">{data.preferredCountry}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Transfer Success Rate</span>
              <span className="text-lg font-bold text-green-600">99.8%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Average Delivery Time</span>
              <span className="text-lg font-bold">2-4 hours</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Benefits & Savings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-green-800">
                Money Saved on Fees
              </div>
              <div className="text-2xl font-bold text-green-600">$248</div>
              <div className="text-xs text-green-600">
                vs traditional services
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-800">
                Time Saved
              </div>
              <div className="text-2xl font-bold text-blue-600">48 hours</div>
              <div className="text-xs text-blue-600">
                faster than bank transfers
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-sm font-medium text-purple-800">
                KobKlein Points
              </div>
              <div className="text-2xl font-bold text-purple-600">1,250</div>
              <div className="text-xs text-purple-600">
                earn rewards on transfers
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

