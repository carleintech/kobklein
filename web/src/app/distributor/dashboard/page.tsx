// File: kobklein/web/src/app/distributor/dashboard/page.tsx

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
  Settings
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { TerritoryOverview } from "@/components/dashboards/distributor/territory-overview";
import { RefillRequests } from "@/components/dashboards/distributor/refill-requests";
import { UserOnboarding } from "@/components/dashboards/distributor/user-onboarding";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const metadata: Metadata = {
  title: "Distributor Dashboard | KobKlein",
  description: "Manage your territory and grow the KobKlein network",
};

// Mock data - replace with real data fetching
const mockTerritoryData = {
  name: "Port-au-Prince Central",
  totalUsers: 234,
  activeUsers: 187,
  merchants: 45,
  monthlyVolume: {
    htg: 450800.00,
    usd: 3650.00,
  },
  commission: {
    earned: 22540.00,
    pending: 3420.00,
  },
  growth: {
    users: 18,
    revenue: 12.4,
    isPositive: true,
  },
};

const mockRefillRequests = [
  {
    id: 'REQ_001',
    requesterName: 'Marie Dubois',
    requesterType: 'client' as const,
    phone: '+509 1234 5678',
    location: 'Rue Pavée, Port-au-Prince',
    amount: 2500.00,
    requestDate: '2025-01-13T16:30:00Z',
    urgency: 'medium' as const,
    status: 'pending' as const,
    note: 'Need cash for emergency medical expenses',
  },
  {
    id: 'REQ_002',
    requesterName: 'Jean Baptiste',
    requesterType: 'merchant' as const,
    phone: '+509 8765 4321',
    location: 'Delmas 31',
    amount: 5000.00,
    requestDate: '2025-01-13T15:45:00Z',
    urgency: 'high' as const,
    status: 'pending' as const,
    businessName: 'Ti Jan Market',
    note: 'Store running low on change for customers',
  },
  {
    id: 'REQ_003',
    requesterName: 'Sophie Pierre',
    requesterType: 'client' as const,
    phone: '+509 2468 1357',
    location: 'Pétion-Ville',
    amount: 1500.00,
    requestDate: '2025-01-13T14:20:00Z',
    urgency: 'low' as const,
    status: 'accepted' as const,
  },
  {
    id: 'REQ_004',
    requesterName: 'Paul Joseph',
    requesterType: 'merchant' as const,
    phone: '+509 3579 2468',
    location: 'Bel Air',
    amount: 3500.00,
    requestDate: '2025-01-13T13:15:00Z',
    urgency: 'medium' as const,
    status: 'completed' as const,
    businessName: 'Paul\'s Electronics',
  },
  {
    id: 'REQ_005',
    requesterName: 'Claudette Moïse',
    requesterType: 'client' as const,
    phone: '+509 9876 5432',
    location: 'Carrefour',
    amount: 800.00,
    requestDate: '2025-01-13T11:30:00Z',
    urgency: 'low' as const,
    status: 'completed' as const,
  },
];

const distributorNavigation = [
  {
    label: 'Dashboard',
    href: '/distributor/dashboard',
    icon: Home,
    isActive: true,
  },
  {
    label: 'Onboard Users',
    href: '/distributor/onboard',
    icon: UserPlus,
    badge: 'New',
  },
  {
    label: 'Refill Requests',
    href: '/distributor/refill-requests',
    icon: RefreshCw,
    badge: mockRefillRequests.filter(r => r.status === 'pending').length,
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

export default function DistributorDashboard() {
  return (
    <ProtectedRoute allowedRoles={['distributor', 'admin', 'super_admin']}>
      <DashboardLayout
        title="Distributor Dashboard"
        userRole="distributor"
        navigation={distributorNavigation}
        walletBalance={{
          htg: mockTerritoryData.commission.earned,
          usd: mockTerritoryData.commission.earned / 123.45,
        }}
        notifications={7}
      >
        <div className="space-y-6">
          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome back, Agent Pierre! 🚀
                </h2>
                <p className="opacity-90">
                  You're managing {mockTerritoryData.totalUsers} users in {mockTerritoryData.name}. 
                  Keep growing the KobKlein network!
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <MapPin className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Territory Overview */}
          <TerritoryOverview territory={mockTerritoryData} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left Column - Refill Requests */}
            <div className="space-y-6">
              <RefillRequests requests={mockRefillRequests} />
            </div>

            {/* Right Column - User Onboarding */}
            <div className="space-y-6">
              <UserOnboarding />
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* This Month's Performance */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-green-700">This Month</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-green-600">New Users:</span>
                  <span className="font-medium text-green-700">+{mockTerritoryData.growth.users}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-600">Commission:</span>
                  <span className="font-medium text-green-700">HTG 22,540</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-600">Growth Rate:</span>
                  <span className="font-medium text-green-700">+{mockTerritoryData.growth.revenue}%</span>
                </div>
              </div>
            </div>

            {/* Goals & Targets */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-blue-700">Monthly Goals</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-blue-600">Users Target:</span>
                    <span className="font-medium">234/250</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '93.6%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-blue-600">Merchants:</span>
                    <span className="font-medium">45/60</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Inventory */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-amber-700">Card Inventory</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-amber-600">Available:</span>
                  <span className="font-medium text-amber-700">67 cards</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-amber-600">Distributed:</span>
                  <span className="font-medium text-amber-700">133 cards</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-amber-600">Low Stock:</span>
                  <span className="font-medium text-red-600">⚠ Order Soon</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <UserPlus className="h-6 w-6 text-gray-600 mb-2" />
                <span className="text-sm font-medium">Onboard User</span>
              </button>
              
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <RefreshCw className="h-6 w-6 text-gray-600 mb-2" />
                <span className="text-sm font-medium">Process Refills</span>
              </button>
              
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Package className="h-6 w-6 text-gray-600 mb-2" />
                <span className="text-sm font-medium">Check Inventory</span>
              </button>
              
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <DollarSign className="h-6 w-6 text-gray-600 mb-2" />
                <span className="text-sm font-medium">Request Payout</span>
              </button>
            </div>
          </div>

          {/* Territory Map Placeholder */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Territory Coverage</h3>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="font-medium">Interactive Territory Map</p>
                <p className="text-sm">View your coverage area and user locations</p>
                <button className="mt-2 px-4 py-2 bg-kobklein-accent text-white rounded-lg text-sm hover:bg-kobklein-accent/90 transition-colors">
                  View Full Map
                </button>
              </div>
            </div>
          </div>

          {/* Training & Resources */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-indigo-700 mb-3">
              📚 Distributor Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-700">
              <div>
                <p className="font-medium mb-1">• Training Materials:</p>
                <p>Access onboarding guides and best practices</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Commission Structure:</p>
                <p>Earn 2% on refills, HTG 50 per new user onboarded</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Support Hotline:</p>
                <p>24/7 assistance at +509 9999 1111</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Monthly Targets:</p>
                <p>Bonus rewards for exceeding monthly goals</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}