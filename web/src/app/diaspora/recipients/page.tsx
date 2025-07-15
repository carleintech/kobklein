// File: kobklein/web/src/app/diaspora/recipients/page.tsx

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
import { RecipientManagement } from "@/components/dashboards/diaspora/recipient-management";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const metadata: Metadata = {
  title: "Recipients | KobKlein Diaspora",
  description: "Manage your recipients in Haiti",
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
  {
    id: '5',
    name: 'Claudette Moïse',
    phone: '+509 9876 5432',
    walletId: 'KK003691',
    relation: 'Aunt',
    location: 'Les Cayes',
    addedDate: '2024-04-08',
    totalSent: 1120.00,
    lastTransfer: {
      amount: 60.00,
      date: '2025-01-02',
    },
    isActive: true,
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
  },
  {
    label: 'Recipients',
    href: '/diaspora/recipients',
    icon: Users,
    isActive: true,
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

export default function DiasporaRecipientsPage() {
  return (
    <ProtectedRoute allowedRoles={['diaspora', 'admin', 'super_admin']}>
      <DashboardLayout
        title="My Recipients"
        userRole="diaspora"
        navigation={diasporaNavigation}
        notifications={3}
      >
        <div className="space-y-6">
          {/* Recipients Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-blue-700 font-medium">Total Recipients</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {mockRecipients.length}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium">Active</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {mockRecipients.filter(r => r.isActive).length}
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-purple-500" />
                <span className="text-purple-700 font-medium">Family</span>
              </div>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {mockRecipients.filter(r => 
                  ['mother', 'father', 'brother', 'sister', 'aunt', 'cousin'].includes(r.relation.toLowerCase())
                ).length}
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Send className="w-5 h-5 text-amber-500" />
                <span className="text-amber-700 font-medium">Total Sent</span>
              </div>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                ${mockRecipients.reduce((sum, r) => sum + r.totalSent, 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Recipient Management Component */}
          <RecipientManagement recipients={mockRecipients} />

          {/* Recipient Tips */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-indigo-700 mb-3">
              💡 Managing Recipients Effectively
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-700">
              <div>
                <p className="font-medium mb-1">• Keep Information Updated:</p>
                <p>Regularly update phone numbers and locations</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Verify Identity:</p>
                <p>Always confirm identity before adding new recipients</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Set Relationships:</p>
                <p>Clear relationships help with record-keeping</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Regular Communication:</p>
                <p>Stay in touch to ensure successful transfers</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}