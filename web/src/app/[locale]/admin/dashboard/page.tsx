import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - KobKlein',
  description: 'Administrative dashboard for KobKlein platform management',
};

interface AdminDashboardPageProps {
  params: {
    locale: string;
  };
}

export default function AdminDashboardPage({ params }: AdminDashboardPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-slate-300">Platform management and oversight</p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-blue-400">52,847</p>
              <p className="text-sm text-green-400">+12% this month</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-2">Total Volume</h3>
              <p className="text-3xl font-bold text-cyan-400">$2.4M</p>
              <p className="text-sm text-green-400">+8% this month</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-2">Active Merchants</h3>
              <p className="text-3xl font-bold text-purple-400">1,247</p>
              <p className="text-sm text-green-400">+15% this month</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-2">System Uptime</h3>
              <p className="text-3xl font-bold text-green-400">99.9%</p>
              <p className="text-sm text-slate-400">Last 30 days</p>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold mb-4">User Management</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg p-3 text-left transition-colors">
                  👥 Manage Users
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 rounded-lg p-3 text-left transition-colors">
                  ✅ Verify Accounts
                </button>
                <button className="w-full bg-red-600 hover:bg-red-700 rounded-lg p-3 text-left transition-colors">
                  🚫 Suspend Users
                </button>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold mb-4">Transaction Oversight</h3>
              <div className="space-y-3">
                <button className="w-full bg-purple-600 hover:bg-purple-700 rounded-lg p-3 text-left transition-colors">
                  💳 Review Transactions
                </button>
                <button className="w-full bg-orange-600 hover:bg-orange-700 rounded-lg p-3 text-left transition-colors">
                  🔍 Fraud Detection
                </button>
                <button className="w-full bg-yellow-600 hover:bg-yellow-700 rounded-lg p-3 text-left transition-colors">
                  📊 Generate Reports
                </button>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold mb-4">System Management</h3>
              <div className="space-y-3">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-lg p-3 text-left transition-colors">
                  ⚙️ System Settings
                </button>
                <button className="w-full bg-teal-600 hover:bg-teal-700 rounded-lg p-3 text-left transition-colors">
                  📈 Analytics
                </button>
                <button className="w-full bg-pink-600 hover:bg-pink-700 rounded-lg p-3 text-left transition-colors">
                  🛠️ Maintenance
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold mb-4">Recent Admin Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">👤</span>
                  </div>
                  <div>
                    <p className="font-semibold">User account verified</p>
                    <p className="text-sm text-slate-400">Marie Dupont - ID: 12847</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">🚫</span>
                  </div>
                  <div>
                    <p className="font-semibold">Suspicious transaction flagged</p>
                    <p className="text-sm text-slate-400">Transaction ID: TX789456</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">4 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">🏪</span>
                  </div>
                  <div>
                    <p className="font-semibold">New merchant approved</p>
                    <p className="text-sm text-slate-400">Ti Boutik Lakay - Port-au-Prince</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">6 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
