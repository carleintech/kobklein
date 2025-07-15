import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Super Admin Dashboard - KobKlein',
  description: 'Super administrative dashboard for KobKlein platform oversight',
};

interface SuperAdminDashboardPageProps {
  params: {
    locale: string;
  };
}

export default function SuperAdminDashboardPage({ params }: SuperAdminDashboardPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
            <p className="text-slate-300">Complete platform oversight and control</p>
          </div>

          {/* Critical Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-red-700/50">
              <h3 className="text-lg font-semibold mb-2">Platform Revenue</h3>
              <p className="text-3xl font-bold text-green-400">$847K</p>
              <p className="text-sm text-green-400">+18% this month</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-red-700/50">
              <h3 className="text-lg font-semibold mb-2">Total Transactions</h3>
              <p className="text-3xl font-bold text-blue-400">2.8M</p>
              <p className="text-sm text-green-400">+22% this month</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-red-700/50">
              <h3 className="text-lg font-semibold mb-2">Active Countries</h3>
              <p className="text-3xl font-bold text-purple-400">12</p>
              <p className="text-sm text-green-400">+2 new markets</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-red-700/50">
              <h3 className="text-lg font-semibold mb-2">Security Score</h3>
              <p className="text-3xl font-bold text-red-400">A+</p>
              <p className="text-sm text-slate-400">All systems secure</p>
            </div>
          </div>

          {/* Super Admin Controls */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-red-700/50">
              <h3 className="text-xl font-semibold mb-4 text-red-400">System Control</h3>
              <div className="space-y-3">
                <button className="w-full bg-red-600 hover:bg-red-700 rounded-lg p-3 text-left transition-colors">
                  🔴 Emergency Shutdown
                </button>
                <button className="w-full bg-orange-600 hover:bg-orange-700 rounded-lg p-3 text-left transition-colors">
                  ⚠️ Maintenance Mode
                </button>
                <button className="w-full bg-yellow-600 hover:bg-yellow-700 rounded-lg p-3 text-left transition-colors">
                  🔧 System Configuration
                </button>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-red-700/50">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Admin Management</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg p-3 text-left transition-colors">
                  👑 Manage Admins
                </button>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-lg p-3 text-left transition-colors">
                  🔑 Role Permissions
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 rounded-lg p-3 text-left transition-colors">
                  📋 Audit Logs
                </button>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-red-700/50">
              <h3 className="text-xl font-semibold mb-4 text-green-400">Financial Control</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-700 rounded-lg p-3 text-left transition-colors">
                  💰 Treasury Management
                </button>
                <button className="w-full bg-teal-600 hover:bg-teal-700 rounded-lg p-3 text-left transition-colors">
                  📊 Financial Reports
                </button>
                <button className="w-full bg-cyan-600 hover:bg-cyan-700 rounded-lg p-3 text-left transition-colors">
                  🏦 Banking Integration
                </button>
              </div>
            </div>
          </div>

          {/* Global Statistics */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-red-700/50">
              <h3 className="text-xl font-semibold mb-4">Regional Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>🇭🇹 Haiti</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-slate-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                    <span className="text-sm">85%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>🇺🇸 USA (Diaspora)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-slate-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '72%'}}></div>
                    </div>
                    <span className="text-sm">72%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>🇨🇦 Canada</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-slate-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '45%'}}></div>
                    </div>
                    <span className="text-sm">45%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-red-700/50">
              <h3 className="text-xl font-semibold mb-4">System Health</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>API Response Time</span>
                  <span className="text-green-400">45ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Database Performance</span>
                  <span className="text-green-400">Optimal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Security Incidents</span>
                  <span className="text-green-400">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Server Load</span>
                  <span className="text-yellow-400">Medium</span>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-red-700/50">
            <h3 className="text-xl font-semibold mb-4 text-red-400">Critical System Alerts</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-900/30 border border-green-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✅</span>
                  </div>
                  <div>
                    <p className="font-semibold text-green-400">All Systems Operational</p>
                    <p className="text-sm text-slate-400">No critical issues detected</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Last check: 2 min ago</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">⚠️</span>
                  </div>
                  <div>
                    <p className="font-semibold text-yellow-400">Scheduled Maintenance</p>
                    <p className="text-sm text-slate-400">Database optimization planned for Sunday 2AM</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">In 3 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
