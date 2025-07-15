// File: kobklein/web/src/app/merchant/refill/page.tsx

import { Metadata } from "next";
import { 
  Home, 
  CreditCard, 
  BarChart3, 
  RefreshCw, 
  Settings,
  HelpCircle,
  History,
  Store,
  Users,
  Wallet,
  Phone,
  MapPin
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Button } from "@/components/ui/enhanced-button";
import { KobKleinInput, FormField } from "@/components/ui/form-field";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const metadata: Metadata = {
  title: "Refill Wallet | KobKlein Merchant",
  description: "Request wallet refill from distributors",
};

const merchantNavigation = [
  {
    label: 'Dashboard',
    href: '/merchant/dashboard',
    icon: Home,
  },
  {
    label: 'Accept Payment',
    href: '/merchant/pos',
    icon: CreditCard,
    badge: 'Live',
  },
  {
    label: 'Transactions',
    href: '/merchant/transactions',
    icon: History,
  },
  {
    label: 'Analytics',
    href: '/merchant/analytics',
    icon: BarChart3,
  },
  {
    label: 'Customers',
    href: '/merchant/customers',
    icon: Users,
  },
  {
    label: 'Refill Wallet',
    href: '/merchant/refill',
    icon: RefreshCw,
    isActive: true,
  },
  {
    label: 'Store Settings',
    href: '/merchant/settings',
    icon: Store,
  },
  {
    label: 'Support',
    href: '/merchant/support',
    icon: HelpCircle,
  },
];

export default function MerchantRefillPage() {
  return (
    <ProtectedRoute allowedRoles={['merchant', 'admin', 'super_admin']}>
      <DashboardLayout
        title="Refill Wallet"
        userRole="merchant"
        navigation={merchantNavigation}
        walletBalance={{
          htg: 12450.75,
          usd: 102.25,
        }}
        notifications={5}
      >
        <div className="space-y-6 max-w-4xl">
          {/* Current Balance Overview */}
          <KobKleinCard className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-kobklein-accent rounded-lg flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Current Wallet Balance</h3>
                <p className="text-2xl font-bold text-kobklein-accent">HTG 12,450.75</p>
                <p className="text-sm text-muted-foreground">USD 102.25 equivalent</p>
              </div>
            </div>
          </KobKleinCard>

          {/* Request Refill Form */}
          <KobKleinCard className="p-6">
            <h3 className="text-lg font-semibold mb-6">Request Wallet Refill</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Refill Amount (HTG)"
                  required
                >
                  <KobKleinInput
                    type="number"
                    placeholder="Enter amount"
                    leftIcon={<Wallet className="h-4 w-4" />}
                  />
                </FormField>

                <FormField
                  label="Preferred Distributor"
                >
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select distributor (optional)</option>
                    <option value="dist1">Pierre Distributeur - Port-au-Prince</option>
                    <option value="dist2">Marie Agent - Pétion-Ville</option>
                    <option value="dist3">Jean Services - Delmas</option>
                  </select>
                </FormField>
              </div>

              <FormField
                label="Pickup Location"
                required
              >
                <KobKleinInput
                  placeholder="Enter your store address"
                  leftIcon={<MapPin className="h-4 w-4" />}
                  defaultValue="Ti Jan Market, Rue Pavée, Port-au-Prince"
                />
              </FormField>

              <FormField
                label="Contact Phone"
                required
              >
                <KobKleinInput
                  type="tel"
                  placeholder="+509 1234 5678"
                  leftIcon={<Phone className="h-4 w-4" />}
                />
              </FormField>

              <FormField
                label="Additional Notes"
              >
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Any special instructions for the distributor..."
                />
              </FormField>

              <div className="flex space-x-4">
                <Button variant="kobklein" className="flex-1">
                  Request Refill
                </Button>
                <Button variant="outline" className="flex-1">
                  Save as Draft
                </Button>
              </div>
            </form>
          </KobKleinCard>

          {/* Recent Refill Requests */}
          <KobKleinCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Refill Requests</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">HTG 5,000 refill</p>
                  <p className="text-sm text-muted-foreground">Pierre Distributeur • Jan 12, 2025</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  Completed
                </span>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">HTG 3,000 refill</p>
                  <p className="text-sm text-muted-foreground">Marie Agent • Jan 11, 2025</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                  In Progress
                </span>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">HTG 2,500 refill</p>
                  <p className="text-sm text-muted-foreground">Jean Services • Jan 10, 2025</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  Completed
                </span>
              </div>
            </div>
          </KobKleinCard>

          {/* Emergency Contact */}
          <KobKleinCard className="p-6 bg-red-50 border-red-200">
            <h3 className="text-lg font-semibold text-red-700 mb-2">Emergency Refill</h3>
            <p className="text-red-600 text-sm mb-4">
              Need an urgent refill? Contact our emergency distributor hotline.
            </p>
            <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
              Call Emergency Line: +509 9999 0000
            </Button>
          </KobKleinCard>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}