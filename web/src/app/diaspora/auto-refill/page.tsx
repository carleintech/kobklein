// File: kobklein/web/src/app/diaspora/auto-refill/page.tsx

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
  Plus,
  Edit3,
  Trash2,
  Clock,
  User,
  DollarSign
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Button } from "@/components/ui/enhanced-button";
import { KobKleinInput, FormField } from "@/components/ui/form-field";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Auto-Refill | KobKlein Diaspora",
  description: "Schedule automatic transfers to family and friends",
};

const mockAutoRefills = [
  {
    id: '1',
    recipientName: 'Marie Dubois',
    relation: 'Mother',
    amount: 100.00,
    frequency: 'Monthly',
    nextTransfer: '2025-01-20',
    isActive: true,
    totalSent: 1200.00,
    startDate: '2024-01-20',
  },
  {
    id: '2',
    recipientName: 'Jean Baptiste',
    relation: 'Brother',
    amount: 75.00,
    frequency: 'Bi-weekly',
    nextTransfer: '2025-01-18',
    isActive: true,
    totalSent: 900.00,
    startDate: '2024-03-15',
  },
  {
    id: '3',
    recipientName: 'Sophie Pierre',
    relation: 'Friend',
    amount: 50.00,
    frequency: 'Monthly',
    nextTransfer: '2025-01-25',
    isActive: false,
    totalSent: 300.00,
    startDate: '2024-07-25',
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
    isActive: true,
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

export default function DiasporaAutoRefillPage() {
  return (
    <ProtectedRoute allowedRoles={['diaspora', 'admin', 'super_admin']}>
      <DashboardLayout
        title="Auto-Refill Settings"
        userRole="diaspora"
        navigation={diasporaNavigation}
        notifications={3}
      >
        <div className="space-y-6 max-w-6xl">
          {/* Auto-Refill Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-green-500" />
                <span className="text-green-700 font-medium">Active Schedules</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {mockAutoRefills.filter(r => r.isActive).length}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-blue-500" />
                <span className="text-blue-700 font-medium">Monthly Total</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                ${mockAutoRefills
                  .filter(r => r.isActive)
                  .reduce((sum, r) => {
                    const multiplier = r.frequency === 'Bi-weekly' ? 2 : 1;
                    return sum + (r.amount * multiplier);
                  }, 0)}
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-500" />
                <span className="text-purple-700 font-medium">Next Transfer</span>
              </div>
              <p className="text-lg font-bold text-purple-600 mt-1">
                Jan 18, 2025
              </p>
            </div>
          </div>

          {/* Create New Auto-Refill */}
          <KobKleinCard className="p-6">
            <h3 className="text-lg font-semibold mb-6">Create New Auto-Refill Schedule</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Recipient" required>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select recipient</option>
                    <option value="marie">Marie Dubois (Mother)</option>
                    <option value="jean">Jean Baptiste (Brother)</option>
                    <option value="sophie">Sophie Pierre (Friend)</option>
                    <option value="paul">Paul Joseph (Cousin)</option>
                  </select>
                </FormField>

                <FormField label="Amount (USD)" required>
                  <KobKleinInput
                    type="number"
                    placeholder="100.00"
                    leftIcon={<DollarSign className="h-4 w-4" />}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Frequency" required>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </FormField>

                <FormField label="Start Date" required>
                  <KobKleinInput
                    type="date"
                    defaultValue="2025-01-20"
                  />
                </FormField>
              </div>

              <FormField label="Transfer Note (Optional)">
                <KobKleinInput
                  placeholder="Monthly support, Love you!"
                />
              </FormField>

              <div className="flex space-x-3">
                <Button variant="kobklein" className="flex-1">
                  Create Auto-Refill
                </Button>
                <Button variant="outline" className="flex-1">
                  Save as Draft
                </Button>
              </div>
            </form>
          </KobKleinCard>

          {/* Existing Auto-Refill Schedules */}
          <KobKleinCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Your Auto-Refill Schedules</h3>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Schedule
              </Button>
            </div>
            
            <div className="space-y-4">
              {mockAutoRefills.map((schedule) => (
                <div
                  key={schedule.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-kobklein-accent rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{schedule.recipientName}</h4>
                          <Badge 
                            variant="outline" 
                            className={schedule.isActive ? 'text-green-600 border-green-200' : 'text-gray-600 border-gray-200'}
                          >
                            {schedule.isActive ? 'Active' : 'Paused'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                          <span>{formatCurrency(schedule.amount, 'USD')} • {schedule.frequency}</span>
                          <span>Next: {schedule.nextTransfer}</span>
                          <span>Total sent: {formatCurrency(schedule.totalSent, 'USD')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </KobKleinCard>

          {/* Auto-Refill Benefits */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-700 mb-3">
              ✨ Benefits of Auto-Refill
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
              <div>
                <p className="font-medium mb-1">• Never Forget:</p>
                <p>Automatic transfers ensure consistent support</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Lower Fees:</p>
                <p>Scheduled transfers qualify for reduced rates</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Peace of Mind:</p>
                <p>Your family always receives support on time</p>
              </div>
              <div>
                <p className="font-medium mb-1">• Easy Management:</p>
                <p>Pause, edit, or cancel anytime from your dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}