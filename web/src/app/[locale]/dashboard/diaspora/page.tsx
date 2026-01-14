import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserRole } from "@/types/auth";
import { Globe, Heart, Send, TrendingDown, Users } from "lucide-react";

export default function DiasporaDashboard() {
  const diasporaNavigation = [
    {
      label: "Dashboard",
      href: "/dashboard/diaspora",
      icon: "Home" as const,
      isActive: true,
    },
    {
      label: "Send Money",
      href: "/send",
      icon: "Send" as const,
      isActive: false,
    },
    {
      label: "Recipients",
      href: "/recipients",
      icon: "Users" as const,
      isActive: false,
    },
    {
      label: "History",
      href: "/history",
      icon: "History" as const,
      isActive: false,
    },
  ];

  return (
    <SupabaseProtectedRoute allowedRoles={[UserRole.DIASPORA]}>
      <DashboardLayout
        title="Diaspora Connect"
        userRole={UserRole.DIASPORA}
        navigation={diasporaNavigation}
        walletBalance={{ htg: 168750, usd: 1250 }}
        notifications={2}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sent This Month
              </CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,250.00</div>
              <p className="text-xs text-muted-foreground">≈ HTG 168,750.00</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recipients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                Active family members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Exchange Rate
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">135.00</div>
              <p className="text-xs text-muted-foreground">USD to HTG today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Transfers</CardTitle>
              <CardDescription>
                Your latest remittances to Haiti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    recipient: "Marie Delva (Mother)",
                    amount: 200,
                    date: "Today",
                    status: "Delivered",
                    location: "Port-au-Prince",
                  },
                  {
                    recipient: "Jean Delva (Brother)",
                    amount: 150,
                    date: "Dec 20",
                    status: "Delivered",
                    location: "Cap-Haïtien",
                  },
                  {
                    recipient: "Sophie Laurent (Sister)",
                    amount: 300,
                    date: "Dec 18",
                    status: "Delivered",
                    location: "Gonaïves",
                  },
                  {
                    recipient: "Claude Moreau (Uncle)",
                    amount: 100,
                    date: "Dec 15",
                    status: "Delivered",
                    location: "Les Cayes",
                  },
                ].map((transfer, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="ml-4 space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">
                        {transfer.recipient}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transfer.location} • {transfer.date} •{" "}
                        {transfer.status}
                      </p>
                    </div>
                    <div className="font-medium text-green-600">
                      ${transfer.amount}.00
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Send Money</CardTitle>
              <CardDescription>Quick transfer to family</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors">
                Send to Family
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors">
                Add New Recipient
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md transition-colors">
                Rate Calculator
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md transition-colors">
                Transfer History
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md transition-colors">
                Track Transfer
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Exchange Rates
              </CardTitle>
              <CardDescription>
                Current rates for your transfers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">USD → HTG</p>
                    <p className="text-sm text-muted-foreground">
                      US Dollar to Haitian Gourde
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">135.00</p>
                    <p className="text-sm text-green-600">+0.5%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">EUR → HTG</p>
                    <p className="text-sm text-muted-foreground">
                      Euro to Haitian Gourde
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">147.80</p>
                    <p className="text-sm text-red-600">-0.2%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">CAD → HTG</p>
                    <p className="text-sm text-muted-foreground">
                      Canadian Dollar to Haitian Gourde
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">100.25</p>
                    <p className="text-sm text-green-600">+0.3%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Family Recipients</CardTitle>
              <CardDescription>
                Your trusted recipients in Haiti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    name: "Marie Delva",
                    relation: "Mother",
                    location: "Port-au-Prince",
                    favorite: true,
                  },
                  {
                    name: "Jean Delva",
                    relation: "Brother",
                    location: "Cap-Haïtien",
                    favorite: true,
                  },
                  {
                    name: "Sophie Laurent",
                    relation: "Sister",
                    location: "Gonaïves",
                    favorite: false,
                  },
                  {
                    name: "Claude Moreau",
                    relation: "Uncle",
                    location: "Les Cayes",
                    favorite: false,
                  },
                ].map((recipient, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {recipient.name.split(" ")[0][0]}
                          {recipient.name.split(" ")[1][0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{recipient.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {recipient.relation} • {recipient.location}
                        </p>
                      </div>
                    </div>
                    {recipient.favorite && (
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </SupabaseProtectedRoute>
  );
}
