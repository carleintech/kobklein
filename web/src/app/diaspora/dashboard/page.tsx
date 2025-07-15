// File: kobklein/web/src/app/diaspora/dashboard/page.tsx

import { Metadata } from "next";
import { 
  Home, 
  Send, 
  Users, 
  History, 
  Heart,
  Calendar,
  CreditCard,
  HelpCircle,
  Settings,
  Globe
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { RemittanceOverview } from "@/components/dashboards/diaspora/remittance-overview";
import { SendMoneyInterface } from "@/components/dashboards/diaspora/send-money-interface";
import { RecipientManagement } from "@/components/dashboards/diaspora/recipient-management";
import { RecentTransactions } from "@/components/dashboards/client/recent-transactions";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const metadata: Metadata = {
  title: "Diaspora Dashboard | KobKlein",
  description: "Send money to family and friends in Haiti",
};

// Mock data - replace with real data fetching
const mockRemittanceData = {
  monthlyStats: {
    totalSent: {
      usd: 850.00,
      htg: 104875.00,
    },
    transactions: 8,
    recipients: 4,
    averageAmount: 106.25,
  },
  yearlyChange: {
    amount: 1240.50,
    percentage: 18.7,
    isPositive: true,
  },
  nextScheduled: {
    amount: 100.00,
    recipient: "Marie (Mother)",
    date: "Jan 20, 2025",
  },
};

const mockRecipients = [
  {
    id: '1',
    name: 'Marie Dubois',
    phone: '+509 1234 5678',
    walletId: 'KK001234',
    relation: 'Mother',
    location: 'Port-au-Prince',
    addedDate: '2024-01-15',
    totalSent: 2850.00,
    lastTransfer: {
      amount: 100.00,
      date: '2025-01-10',
    },
    isActive: true,
  },
  {
    id: '2',
    name: 'Jean Baptiste',
    phone: '+509 8765 4321',
    walletId: 'KK005678',
    relation: 'Brother',
    location: 'Cap-Haïtien',
    addedDate: '2024-02-20',
    totalSent: 1650.00,
    lastTransfer: {
      amount: 75.00,
      date: '2025-01-08',
    },
    isActive: true,
  },
  {
    id: '3',
    name: 'Sophie Pierre',
    phone: '+509 2468 1357',
    walletId: 'KK009876',
    relation: 'Friend',
    location: 'Pétion-Ville',
    addedDate: '2024-03-10',
    totalSent: 890.00,
    lastTransfer: {
      amount: 50.00,
      date: '2025-01-05',
    },
    isActive: true,
  },
  {
    id: '4',
    name: 'Paul Joseph',
    phone: '+509 3579 2468',
    walletId: 'KK002468',
    relation: 'Cousin',
    location: 'Jacmel',
    addedDate: '2024-05-12',
    totalSent: 420.00,
    lastTransfer: {
      amount: 25.00,
      date: '2024-12-28',
    },
    isActive: false,
  },
];

const mockTransactions = [
  {
    id: '1',
    type: 'sent' as const,
    amount: 100.00,
    currency: 'USD' as const,
    description: 'Monthly support to Marie (Mother)',
    date: '2025-01-10T14:30:00Z',
    status: 'completed' as const,
    recipient: 'Marie Dubois',
  },
  {
    id: '2',
    type: 'sent' as const,
    amount: 75.00,
    currency: 'USD' as const,
    description: 'Support for Jean (Brother)',
    date: '2025-01-08T16:45:00Z',
    status: 'completed' as const,
    recipient: 'Jean Baptiste',
  },
  {
    id: '3',
    type: 'sent' as const,
    amount: 50.00,
    currency: 'USD' as const,
    description: 'Birthday gift for Sophie',
    date: '2025-01-05T10:20:00Z',
    status: 'completed' as const,
    recipient: 'Sophie Pierre',
  },
  {
    id: '4',
    type: 'sent' as const,
    amount: 125.00,
    currency: 'USD' as const,
    description: 'Emergency support to Marie',
    date: '2025-01-03T12:15:00Z',
    status: 'completed' as const,
    recipient: 'Marie Dubois',
  },
  {
    id: '5',
    type: 'sent' as const,
    amount: 200.00,
    currency: 'USD' as const,
    description: 'School fees for Jean',
    date: '2024-12-30T18:30:00Z',
    status: 'completed' as const,
    recipient: 'Jean Baptiste',
  },
];

const diasporaNavigation = [
  {
    label: 'Dashboard',
    href: '/diaspora/dashboard',
    icon: Home,
    isActive: true,
  },
  {
    label: 'Send Money',
    href: '/diaspora/send',
    icon: Send,
  },
  {
    label: 'Recipients',
    href: '/diaspora/recipients',
    icon: Users,
  },
  {
    label: 'Transfer History',
    href: '/diaspora/history',
    icon: History,
  },
  {
    label: 'Auto-Refill',
    href: '/diaspora/auto-refill',
    icon: Calendar,
  },
  {
    label: 'Community Support',
    href: '/diaspora/community',
    icon: Heart,
  },
  {
    label: 'Payment Methods',
    href: '/diaspora/payment-methods',
    icon: CreditCard,
  },
  {
    label: 'Help Center',
    href: '/diaspora/help',
    icon: HelpCircle,
  },
];

export default function DiasporaDashboard() {
  return (
    <ProtectedRoute allowedRoles={['diaspora', 'admin', 'super_admin']}>
      <DashboardLayout
        title="Diaspora Dashboard"
        userRole="diaspora"
        navigation={diasporaNavigation}
        notifications={3}
      >
        <div className="space-y-6">
          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome back! You're making a difference 🇭🇹
                </h2>
                <p className="opacity-90">
                  You've sent {mockRemittanceData.monthlyStats.totalSent.usd} USD this month, 
                  supporting {mockRemittanceData.monthlyStats.recipients} family members and friends.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Globe className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Remittance Overview */}
          <RemittanceOverview
            monthlyStats={mockRemittanceData.monthlyStats}
            yearlyChange={mockRemittanceData.yearlyChange}
            nextScheduled={mockRemittanceData.nextScheduled}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left Column - Send Money Interface */}
            <div className="space-y-6">
              <SendMoneyInterface recentRecipients={mockRecipients.filter(r => r.isActive)} />
            </div>

            {/* Right Column - Recent Activity */}
            <div className="space-y-6">
              <RecentTransactions 
                transactions={mockTransactions}
                showAll={false}
              />
            </div>
          </div>

          {/* Recipients Overview */}
          <RecipientManagement recipients={mockRecipients} />

          {/* Impact & Community Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Haiti Economic Impact */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-green-700">Your Impact</h3>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-green-600">
                  ${mockRemittanceData.monthlyStats.totalSent.usd * 12}
                </p>
                <p className="text-sm text-green-600">
                  Estimated annual support to Haiti
                </p>
                <p className="text-xs text-green-600">
                  This helps strengthen Haiti's economy and supports local communities
                </p>
              </div>
            </div>

            {/* Exchange Rate Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-blue-700">Exchange Rate</h3>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-blue-600">
                  1 USD = 123.45 HTG
                </p>
                <p className="text-sm text-blue-600">
                  Updated today at 3:45 PM
                </p>
                <p className="text-xs text-blue-600">
                  ↑ 0.3% vs yesterday
                </p>
              </div>
            </div>

            {/* Community Support */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-purple-700">Community</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-purple-600">
                  Join our diaspora community
                </p>
                <button className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors">
                  Support Local Causes →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Send className="h-6 w-6 text-gray-600 mb-2" />
                <span className="text-sm font-medium">Send Money</span>
              </button>
              
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="h-6 w-6 text-gray-600 mb-2" />
                <span className="text-sm font-medium">Schedule Transfer</span>
              </button>
              
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-6 w-6 text-gray-600 mb-2" />
                <span className="text-sm font-medium">Add Recipient</span>
              </button>
              
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="h-6 w-6 text-gray-600 mb-2" />
                <span className="text-sm font-medium">Support Cause</span>
              </button>
            </div>
          </div>

          {/* Tips & Resources */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-amber-700 mb-3">
              💡 Tips for Sending Money to Haiti
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-700">
              <div>
                <p className="font-medium mb-1">• Best Times to Send:</p>
                <p>Mornings Haiti time (GMT-5) for faster processing</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Lower Fees:</p>
                <p>Schedule monthly transfers to save on transaction fees</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Security:</p>
                <p>Always verify recipient details before sending</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Emergency Support:</p>
                <p>Use our 24/7 emergency transfer line: +1-800-KOBKLEIN</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}