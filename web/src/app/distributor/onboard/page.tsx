// File: kobklein/web/src/app/distributor/onboard/page.tsx

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
  HelpCircle
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { UserOnboarding } from "@/components/dashboards/distributor/user-onboarding";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const metadata: Metadata = {
  title: "Onboard Users | KobKlein Distributor",
  description: "Onboard new clients and merchants to KobKlein",
};

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
    isActive: true,
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
  },
  {
    label: 'Support',
    href: '/distributor/support',
    icon: HelpCircle,
  },
];

export default function DistributorOnboardPage() {
  return (
    <ProtectedRoute allowedRoles={['distributor', 'admin', 'super_admin']}>
      <DashboardLayout
        title="Onboard New Users"
        userRole="distributor"
        navigation={distributorNavigation}
        walletBalance={{
          htg: 22540.00,
          usd: 182.75,
        }}
        notifications={7}
      >
        <div className="space-y-6 max-w-4xl">
          {/* Onboarding Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-blue-700 font-medium">This Month</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-1">18</p>
              <p className="text-xs text-blue-600">Users onboarded</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-green-500" />
                <span className="text-green-700 font-medium">Clients</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-1">13</p>
              <p className="text-xs text-green-600">Individual users</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-purple-500" />
                <span className="text-purple-700 font-medium">Merchants</span>
              </div>
              <p className="text-2xl font-bold text-purple-600 mt-1">5</p>
              <p className="text-xs text-purple-600">Business users</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-amber-500" />
                <span className="text-amber-700 font-medium">Commission</span>
              </div>
              <p className="text-2xl font-bold text-amber-600 mt-1">HTG 900</p>
              <p className="text-xs text-amber-600">From onboarding</p>
            </div>
          </div>

          {/* User Onboarding Interface */}
          <UserOnboarding />

          {/* Recent Onboardings */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Onboardings</h3>
            
            <div className="space-y-3">
              {[
                { name: 'Marie Dubois', type: 'Client', date: 'Jan 13, 2025', cardId: 'KK001234' },
                { name: 'Ti Jan Market', type: 'Merchant', date: 'Jan 12, 2025', cardId: 'KK005678' },
                { name: 'Paul Joseph', type: 'Client', date: 'Jan 12, 2025', cardId: 'KK009876' },
                { name: 'Sophie\'s Salon', type: 'Merchant', date: 'Jan 11, 2025', cardId: 'KK002468' },
                { name: 'Jean Baptiste', type: 'Client', date: 'Jan 11, 2025', cardId: 'KK003691' },
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-kobklein-accent rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.type} • {user.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{user.cardId}</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Onboarding Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">
              💡 Onboarding Best Practices
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <p className="font-medium mb-1">• Verify Identity:</p>
                <p>Always check ID documents before onboarding</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Explain Features:</p>
                <p>Show users how to use their KobKlein card</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Test Transaction:</p>
                <p>Do a small test transaction to verify card works</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Follow Up:</p>
                <p>Check with new users after 1 week to assist</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}