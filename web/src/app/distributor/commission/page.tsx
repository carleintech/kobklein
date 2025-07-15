// File: kobklein/web/src/app/distributor/commission/page.tsx

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
  TrendingUp,
  Download,
  Calendar,
  Wallet
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Commission | KobKlein Distributor",
  description: "Track your commission earnings and request payouts",
};

const mockCommissionData = {
  totalEarned: 45680.00,
  currentMonth: 22540.00,
  pendingPayout: 3420.00,
  availableForPayout: 19120.00,
  lastPayout: {
    amount: 15000.00,
    date: '2024-12-28',
  },
  breakdown: {
    onboardingCommission: 16200.00, // 18 users * HTG 900 avg
    refillCommission: 6340.00, // 2% of refill volume
  },
};

const mockCommissionHistory = [
  {
    id: 'COM_001',
    type: 'Onboarding',
    description: 'Marie Dubois - New Client',
    amount: 50.00,
    date: '2025-01-13',
    status: 'paid',
  },
  {
    id: 'COM_002',
    type: 'Refill',
    description: 'Ti Jan Market - HTG 5,000 refill',
    amount: 100.00,
    date: '2025-01-13',
    status: 'paid',
  },
  {
    id: 'COM_003',
    type: 'Onboarding',
    description: 'Ti Jan Market - New Merchant',
    amount: 75.00,
    date: '2025-01-12',
    status: 'paid',
  },
  {
    id: 'COM_004',
    type: 'Refill',
    description: 'Paul Joseph - HTG 3,500 refill',
    amount: 70.00,
    date: '2025-01-12',
    status: 'pending',
  },
  {
    id: 'COM_005',
    type: 'Bonus',
    description: 'Monthly performance bonus',
    amount: 500.00,
    date: '2025-01-01',
    status: 'paid',
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
    isActive: true,
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

export default function DistributorCommissionPage() {
  return (
    <ProtectedRoute allowedRoles={['distributor', 'admin', 'super_admin']}>
      <DashboardLayout
        title="Commission & Payouts"
        userRole="distributor"
        navigation={distributorNavigation}
        walletBalance={{
          htg: mockCommissionData.availableForPayout,
          usd: mockCommissionData.availableForPayout / 123.45,
        }}
        notifications={7}
      >
        <div className="space-y-6">
          {/* Commission Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                  <h3 className="text-2xl font-bold">{formatCurrency(mockCommissionData.totalEarned, 'HTG')}</h3>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <h3 className="text-2xl font-bold">{formatCurrency(mockCommissionData.currentMonth, 'HTG')}</h3>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available</p>
                  <h3 className="text-2xl font-bold">{formatCurrency(mockCommissionData.availableForPayout, 'HTG')}</h3>
                </div>
              </div>
            </KobKleinCard>

            <KobKleinCard className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <h3 className="text-2xl font-bold">{formatCurrency(mockCommissionData.pendingPayout, 'HTG')}</h3>
                </div>
              </div>
            </KobKleinCard>
          </div>

          {/* Payout Request */}
          <KobKleinCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Request Payout</h3>
              <Badge variant="outline" className="bg-green-100 text-green-700">
                Available: {formatCurrency(mockCommissionData.availableForPayout, 'HTG')}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-700 mb-2">Commission Breakdown</h4>
                  <div className="space-y-2 text-sm text-blue-600">
                    <div className="flex justify-between">
                      <span>Onboarding Commission:</span>
                      <span>{formatCurrency(mockCommissionData.breakdown.onboardingCommission, 'HTG')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Refill Commission (2%):</span>
                      <span>{formatCurrency(mockCommissionData.breakdown.refillCommission, 'HTG')}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total Available:</span>
                      <span>{formatCurrency(mockCommissionData.availableForPayout, 'HTG')}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-medium text-amber-700 mb-2">Last Payout</h4>
                  <div className="space-y-1 text-sm text-amber-600">
                    <p>Amount: {formatCurrency(mockCommissionData.lastPayout.amount, 'HTG')}</p>
                    <p>Date: {formatDate(mockCommissionData.lastPayout.date)}</p>
                    <p>Status: Completed</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Payout Amount</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter amount"
                    max={mockCommissionData.availableForPayout}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum: {formatCurrency(mockCommissionData.availableForPayout, 'HTG')}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Payout Method</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="bank">Bank Transfer</option>
                    <option value="mobile">Mobile Money</option>
                    <option value="cash">Cash Pickup</option>
                  </select>
                </div>

                <Button variant="kobklein" className="w-full">
                  Request Payout
                </Button>

                <p className="text-xs text-muted-foreground">
                  Payouts are processed within 24-48 hours. A small processing fee may apply.
                </p>
              </div>
            </div>
          </KobKleinCard>

          {/* Commission History */}
          <KobKleinCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Commission History</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="space-y-3">
              {mockCommissionHistory.map((commission) => (
                <div
                  key={commission.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      commission.type === 'Onboarding' ? 'bg-blue-100' :
                      commission.type === 'Refill' ? 'bg-green-100' :
                      'bg-purple-100'
                    }`}>
                      {commission.type === 'Onboarding' ? (
                        <UserPlus className="h-4 w-4 text-blue-600" />
                      ) : commission.type === 'Refill' ? (
                        <RefreshCw className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    
                    <div>
                      <p className="font-medium">{commission.description}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{commission.type}</span>
                        <span>•</span>
                        <span>{formatDate(commission.date)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(commission.amount, 'HTG')}</p>
                    <Badge 
                      variant="outline" 
                      className={commission.status === 'paid' 
                        ? 'text-green-600 border-green-200' 
                        : 'text-yellow-600 border-yellow-200'
                      }
                    >
                      {commission.status === 'paid' ? 'Paid' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </KobKleinCard>

          {/* Commission Structure */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-700 mb-3">
              💰 Commission Structure
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700">
              <div>
                <p className="font-medium mb-1">• New Client Onboarding:</p>
                <p>HTG 50 per individual user</p>
              </div>
              <div>
                <p className="font-medium mb-1">• New Merchant Onboarding:</p>
                <p>HTG 75 per business user</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Refill Commission:</p>
                <p>2% of all refill transactions processed</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white/50 rounded-lg">
              <p className="text-sm text-green-600">
                <strong>Bonus:</strong> Earn an additional HTG 500 monthly bonus when you onboard 20+ users or exceed HTG 50,000 in refill volume.
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}