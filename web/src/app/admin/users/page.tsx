// File: kobklein/web/src/app/admin/users/page.tsx

import { Metadata } from "next";
import { 
  Home, 
  Users, 
  Activity, 
  Shield,
  DollarSign,
  BarChart3,
  Settings,
  HelpCircle,
  Bell,
  MapPin,
  CreditCard
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { UserManagement } from "@/components/dashboards/admin/user-management";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const metadata: Metadata = {
  title: "User Management | KobKlein Admin",
  description: "Manage all KobKlein users and their accounts",
};

// Extended mock user data for comprehensive testing
const mockAllUsers = [
  {
    id: 'USR_001',
    name: 'Marie Dubois',
    email: 'marie.dubois@example.com',
    phone: '+509 1234 5678',
    role: 'client' as const,
    status: 'active' as const,
    location: 'Port-au-Prince',
    joinDate: '2024-01-15',
    lastActive: '2025-01-13T16:30:00Z',
    totalTransactions: 45,
    totalVolume: 12500.00,
    verificationStatus: 'verified' as const,
  },
  {
    id: 'USR_002',
    name: 'Ti Jan Market',
    email: 'jean@tijanmar.com',
    phone: '+509 8765 4321',
    role: 'merchant' as const,
    status: 'active' as const,
    location: 'Delmas 31',
    joinDate: '2024-02-20',
    lastActive: '2025-01-13T15:45:00Z',
    totalTransactions: 234,
    totalVolume: 45600.00,
    verificationStatus: 'verified' as const,
  },
  {
    id: 'USR_003',
    name: 'Pierre Distributeur',
    email: 'pierre.dist@example.com',
    phone: '+509 2468 1357',
    role: 'distributor' as const,
    status: 'active' as const,
    location: 'Port-au-Prince Central',
    joinDate: '2024-01-10',
    lastActive: '2025-01-13T14:20:00Z',
    totalTransactions: 567,
    totalVolume: 234500.00,
    verificationStatus: 'verified' as const,
  },
  {
    id: 'USR_004',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    phone: '+1 555 123 4567',
    role: 'diaspora' as const,
    status: 'active' as const,
    location: 'Miami, FL',
    joinDate: '2024-03-12',
    lastActive: '2025-01-13T12:15:00Z',
    totalTransactions: 23,
    totalVolume: 2300.00,
    verificationStatus: 'verified' as const,
  },
  {
    id: 'USR_005',
    name: 'Paul Joseph',
    email: 'paul.joseph@example.com',
    phone: '+509 3579 2468',
    role: 'client' as const,
    status: 'suspended' as const,
    location: 'Jacmel',
    joinDate: '2024-05-08',
    lastActive: '2025-01-10T18:30:00Z',
    totalTransactions: 12,
    totalVolume: 1800.00,
    verificationStatus: 'pending' as const,
  },
  {
    id: 'USR_006',
    name: 'Sophie Pierre',
    email: 'sophie.p@example.com',
    phone: '+509 9876 5432',
    role: 'client' as const,
    status: 'active' as const,
    location: 'Pétion-Ville',
    joinDate: '2024-03-25',
    lastActive: '2025-01-13T11:30:00Z',
    totalTransactions: 67,
    totalVolume: 18900.00,
    verificationStatus: 'verified' as const,
  },
  {
    id: 'USR_007',
    name: 'Michel Morin',
    email: 'michel.m@example.com',
    phone: '+509 1357 2468',
    role: 'merchant' as const,
    status: 'pending' as const,
    location: 'Cap-Haïtien',
    joinDate: '2025-01-10',
    lastActive: '2025-01-13T09:15:00Z',
    totalTransactions: 3,
    totalVolume: 450.00,
    verificationStatus: 'pending' as const,
  },
  {
    id: 'USR_008',
    name: 'Claudette Joseph',
    email: 'claudette.j@example.com',
    phone: '+509 5555 7777',
    role: 'client' as const,
    status: 'banned' as const,
    location: 'Carrefour',
    joinDate: '2024-06-15',
    lastActive: '2025-01-08T14:20:00Z',
    totalTransactions: 89,
    totalVolume: 23400.00,
    verificationStatus: 'verified' as const,
  },
  {
    id: 'USR_009',
    name: 'Jean-Baptiste Rémy',
    email: 'jb.remy@example.com',
    phone: '+1 617 555 0123',
    role: 'diaspora' as const,
    status: 'active' as const,
    location: 'Boston, MA',
    joinDate: '2024-04-12',
    lastActive: '2025-01-13T08:45:00Z',
    totalTransactions: 34,
    totalVolume: 4200.00,
    verificationStatus: 'verified' as const,
  },
  {
    id: 'USR_010',
    name: 'Marie Agent',
    email: 'marie.agent@example.com',
    phone: '+509 4444 6666',
    role: 'distributor' as const,
    status: 'active' as const,
    location: 'Pétion-Ville',
    joinDate: '2024-02-28',
    lastActive: '2025-01-13T13:30:00Z',
    totalTransactions: 445,
    totalVolume: 189700.00,
    verificationStatus: 'verified' as const,
  },
];

const adminNavigation = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: Home,
  },
  {
    label: 'User Management',
    href: '/admin/users',
    icon: Users,
    isActive: true,
  },
  {
    label: 'Transactions',
    href: '/admin/transactions',
    icon: Activity,
  },
  {
    label: 'Fraud Monitor',
    href: '/admin/fraud',
    icon: Shield,
    badge: 12,
  },
  {
    label: 'Financial Reports',
    href: '/admin/reports',
    icon: DollarSign,
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    label: 'Distributors',
    href: '/admin/distributors',
    icon: MapPin,
  },
  {
    label: 'Card Management',
    href: '/admin/cards',
    icon: CreditCard,
  },
  {
    label: 'Notifications',
    href: '/admin/notifications',
    icon: Bell,
  },
  {
    label: 'System Settings',
    href: '/admin/settings',
    icon: Settings,
  },
  {
    label: 'Support',
    href: '/admin/support',
    icon: HelpCircle,
  },
];

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
      <DashboardLayout
        title="User Management"
        userRole="admin"
        navigation={adminNavigation}
        notifications={15}
      >
        <div className="space-y-6">
          {/* User Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-blue-700 font-medium">Total Users</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {mockAllUsers.length}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium">Active</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {mockAllUsers.filter(u => u.status === 'active').length}
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-yellow-700 font-medium">Pending</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {mockAllUsers.filter(u => u.status === 'pending').length}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-700 font-medium">Suspended</span>
              </div>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {mockAllUsers.filter(u => u.status === 'suspended' || u.status === 'banned').length}
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-purple-700 font-medium">Verified</span>
              </div>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {mockAllUsers.filter(u => u.verificationStatus === 'verified').length}
              </p>
            </div>
          </div>

          {/* User Management Component */}
          <UserManagement users={mockAllUsers} />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}