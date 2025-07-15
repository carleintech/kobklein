// File: kobklein/web/src/app/diaspora/send/page.tsx

import { Metadata } from "next";
import { 
  Home, 
  Send, 
  Users, 
  History, 
  Heart,
  Calendar,
  CreditCard,
  HelpCircle
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { SendMoneyInterface } from "@/components/dashboards/diaspora/send-money-interface";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const metadata: Metadata = {
  title: "Send Money | KobKlein Diaspora",
  description: "Send money to family and friends in Haiti",
};

const mockRecipients = [
  {
    id: '1',
    name: 'Marie Dubois',
    phone: '+509 1234 5678',
    walletId: 'KK001234',
    relation: 'Mother',
    location: 'Port-au-Prince',
    lastReceived: {
      amount: 100.00,
      date: 'Jan 10, 2025',
    },
  },
  {
    id: '2',
    name: 'Jean Baptiste',
    phone: '+509 8765 4321',
    walletId: 'KK005678',
    relation: 'Brother',
    location: 'Cap-Haïtien',
    lastReceived: {
      amount: 75.00,
      date: 'Jan 8, 2025',
    },
  },
  {
    id: '3',
    name: 'Sophie Pierre',
    phone: '+509 2468 1357',
    walletId: 'KK009876',
    relation: 'Friend',
    location: 'Pétion-Ville',
    lastReceived: {
      amount: 50.00,
      date: 'Jan 5, 2025',
    },
  },
];

const diasporaNavigation = [
  {
    label: 'Dashboard',
    href: '/diaspora/dashboard',
    icon: Home,
  },
  {
    label: 'Send Money',
    href: '/diaspora/send',
    icon: Send,
    isActive: true,
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

export default function DiasporaSendPage() {
  return (
    <ProtectedRoute allowedRoles={['diaspora', 'admin', 'super_admin']}>
      <DashboardLayout
        title="Send Money"
        userRole="diaspora"
        navigation={diasporaNavigation}
        notifications={3}
      >
        <div className="space-y-6 max-w-4xl">
          {/* Exchange Rate Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-700">Current Exchange Rate</p>
                <p className="text-2xl font-bold text-blue-600">1 USD = 123.45 HTG</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-600">Updated: Today 3:45 PM</p>
                <p className="text-xs text-blue-600">↑ 0.3% vs yesterday</p>
              </div>
            </div>
          </div>

          {/* Send Money Interface */}
          <SendMoneyInterface recentRecipients={mockRecipients} />

          {/* Transfer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transfer Limits */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Transfer Limits</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Daily Limit:</span>
                  <span className="font-medium">$2,500 USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Limit:</span>
                  <span className="font-medium">$10,000 USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Used Today:</span>
                  <span className="font-medium text-green-600">$0 USD</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>

            {/* Fees & Timing */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Fees & Timing</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transfer Fee:</span>
                  <span className="font-medium">$2.00 USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Processing Time:</span>
                  <span className="font-medium">2-5 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Recipient Receives:</span>
                  <span className="font-medium text-green-600">Instant</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  No hidden fees. Exchange rate includes our margin.
                </p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-700 mb-2">🔒 Security Reminder</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Always verify recipient details before sending money</li>
              <li>• KobKlein will never ask for your password via email or phone</li>
              <li>• Report suspicious activity to our security team immediately</li>
              <li>• Keep your login credentials secure and never share them</li>
            </ul>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}