// File: kobklein/web/src/app/admin/fraud/page.tsx

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
import { FraudMonitoring } from "@/components/dashboards/admin/fraud-monitoring";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const metadata: Metadata = {
  title: "Fraud Monitoring | KobKlein Admin",
  description: "Monitor and manage fraud alerts and security threats",
};

const mockExtendedFraudAlerts = [
  {
    id: 'FRAUD_001',
    type: 'suspicious_volume' as const,
    severity: 'high' as const,
    userId: 'USR_006',
    userName: 'Michel Pierre',
    userRole: 'client',
    description: 'Unusually high transaction volume detected',
    details: {
      amount: 50000.00,
      timeFrame: 'Last 2 hours',
    },
    timestamp: '2025-01-13T15:30:00Z',
    status: 'open' as const,
  },
  {
    id: 'FRAUD_002',
    type: 'multiple_locations' as const,
    severity: 'medium' as const,
    userId: 'USR_007',
    userName: 'Sophie Morin',
    userRole: 'merchant',
    description: 'Transactions from multiple locations simultaneously',
    details: {
      location: 'Port-au-Prince & Cap-Haïtien',
      timeFrame: 'Within 30 minutes',
    },
    timestamp: '2025-01-13T14:45:00Z',
    status: 'investigating' as const,
  },
  {
    id: 'FRAUD_003',
    type: 'velocity_check' as const,
    severity: 'critical' as const,
    userId: 'USR_008',
    userName: 'Unknown User',
    userRole: 'client',
    description: 'Rapid succession of failed transactions',
    details: {
      pattern: '50+ failed attempts in 10 minutes',
      timeFrame: 'Last 15 minutes',
    },
    timestamp: '2025-01-13T16:00:00Z',
    status: 'open' as const,
    assignedTo: 'Security Team',
  },
  {
    id: 'FRAUD_004',
    type: 'unusual_pattern' as const,
    severity: 'medium' as const,
    userId: 'USR_009',
    userName: 'Jean Baptiste',
    userRole: 'distributor',
    description: 'Unusual refill pattern detected',
    details: {
      pattern: 'Multiple small refills instead of normal pattern',
      amount: 15000.00,
    },
    timestamp: '2025-01-13T13:20:00Z',
    status: 'investigating' as const,
  },
  {
    id: 'FRAUD_005',
    type: 'device_anomaly' as const,
    severity: 'low' as const,
    userId: 'USR_010',
    userName: 'Sarah Williams',
    userRole: 'diaspora',
    description: 'Login from new device without verification',
    details: {
      location: 'Unknown location',
      timeFrame: '1 hour ago',
    },
    timestamp: '2025-01-13T12:30:00Z',
    status: 'resolved' as const,
  },
  {
    id: 'FRAUD_006',
    type: 'suspicious_volume' as const,
    severity: 'critical' as const,
    userId: 'USR_011',
    userName: 'Claudette Moïse',
    userRole: 'client',
    description: 'Transaction amount exceeds daily limit by 300%',
    details: {
      amount: 75000.00,
      timeFrame: 'Single transaction',
    },
    timestamp: '2025-01-13T11:45:00Z',
    status: 'open' as const,
  },
];

const mockFraudStats = {
  totalAlerts: 342,
  openAlerts: 18,
  resolvedToday: 12,
  falsePositiveRate: 16.8,
};

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
    isActive: true,
    badge: mockFraudStats.openAlerts,
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

export default function AdminFraudPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
      <DashboardLayout
        title="Fraud Monitoring"
        userRole="admin"
        navigation={adminNavigation}
        notifications={15}
      >
        <div className="space-y-6">
          {/* Security Status Banner */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Security Monitoring Center 🛡️
                </h2>
                <p className="opacity-90">
                  {mockFraudStats.openAlerts} active alerts requiring immediate attention. 
                  {mockFraudStats.resolvedToday} alerts resolved today.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Fraud Monitoring Component */}
          <FraudMonitoring 
            alerts={mockExtendedFraudAlerts} 
            stats={mockFraudStats} 
          />

          {/* Security Recommendations */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-amber-700 mb-3">
              🔒 Security Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-700">
              <div>
                <p className="font-medium mb-1">• Daily Monitoring:</p>
                <p>Review all high and critical alerts within 2 hours</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Pattern Analysis:</p>
                <p>Look for recurring patterns in fraud attempts</p>
              </div>
              <div>
                <p className="font-medium mb-1">• User Education:</p>
                <p>Notify users about common fraud tactics</p>
              </div>
              <div>
                <p className="font-medium mb-1">• System Updates:</p>
                <p>Keep fraud detection algorithms updated</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}