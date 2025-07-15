import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Distributor Dashboard - KobKlein',
  description: 'Manage your KobKlein distribution network and commissions',
};

interface DistributorDashboardPageProps {
  params: {
    locale: string;
  };
}

export default function DistributorDashboardPage({ params }: DistributorDashboardPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Distributor Dashboard</h1>
            <p className="text-slate-300">Manage your network and track commissions</p>
          </div>

          {/* Key Performance Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-orange-700/50">
              <h3 className="text-lg font-semibold mb-2">Total Commission</h3>
              <p className="text-3xl font-bold text-orange-400">G 45,200.00</p>
              <p className="text-sm text-green-400">+15% this month</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-orange-700/50">
              <h3 className="text-lg font-semibold mb-2">Active Agents</h3>
              <p className="text-3xl font-bold text-blue-400">24</p>
              <p className="text-sm text-green-400">+3 new this month</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-orange-700/50">
              <h3 className="text-lg font-semibold mb-2">Monthly Volume</h3>
              <p className="text-3xl font-bold text-purple-400">G 2.4M</p>
              <p className="text-sm text-green-400">+22% growth</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-orange-700/50">
              <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
              <p className="text-3xl font-bold text-green-400">98.5%</p>
              <p className="text-sm text-slate-400">Transaction success</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <button className="bg-orange-600 hover:bg-orange-700 rounded-lg p-4 text-center transition-colors">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-semibold">Manage Agents</div>
            </button>
            
            <button className="bg-green-600 hover:bg-green-700 rounded-lg p-4 text-center transition-colors">
              <div className="text-2xl mb-2">💰</div>
              <div className="font-semibold">Commission Report</div>
            </button>
            
            <button className="bg-blue-600 hover:bg-blue-700 rounded-lg p-4 text-center transition-colors">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold">Performance Analytics</div>
            </button>
            
            <button className="bg-purple-600 hover:bg-purple-700 rounded-lg p-4 text-center transition-colors">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-semibold">Territory Management</div>
            </button>
          </div>

          {/* Agent Performance */}
          <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-orange-700/50 mb-8">
            <h3 className="text-xl font-semibold mb-4">Top Performing Agents</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">🥇</span>
                  </div>
                  <div>
                    <p className="font-semibold">Pierre Moïse</p>
                    <p className="text-sm text-slate-400">Port-au-Prince • Agent ID: AG001</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-orange-400">G 125,000</p>
                  <p className="text-sm text-slate-400">Monthly volume</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-silver-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">🥈</span>
                  </div>
                  <div>
                    <p className="font-semibold">Marie Celestin</p>
                    <p className="text-sm text-slate-400">Cap-Haïtien • Agent ID: AG007</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-400">G 98,500</p>
                  <p className="text-sm text-slate-400">Monthly volume</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-bronze-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">🥉</span>
                  </div>
                  <div>
                    <p className="font-semibold">Jean Luc</p>
                    <p className="text-sm text-slate-400">Jacmel • Agent ID: AG012</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-purple-400">G 87,200</p>
                  <p className="text-sm text-slate-400">Monthly volume</p>
                </div>
              </div>
            </div>
          </div>

          {/* Commission Breakdown & Territory Map */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-orange-700/50">
              <h3 className="text-xl font-semibold mb-4">Commission Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Transaction Fees</span>
                  <span className="text-green-400">G 28,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Agent Bonuses</span>
                  <span className="text-blue-400">G 12,200</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Volume Incentives</span>
                  <span className="text-purple-400">G 4,500</span>
                </div>
                <hr className="border-slate-600" />
                <div className="flex justify-between items-center font-semibold">
                  <span>Total This Month</span>
                  <span className="text-orange-400">G 45,200</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-orange-700/50">
              <h3 className="text-xl font-semibold mb-4">Territory Coverage</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Port-au-Prince</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-slate-700 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: '90%'}}></div>
                    </div>
                    <span className="text-sm">8 agents</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cap-Haïtien</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-slate-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '65%'}}></div>
                    </div>
                    <span className="text-sm">5 agents</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Jacmel</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-slate-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '45%'}}></div>
                    </div>
                    <span className="text-sm">3 agents</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Other Cities</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-slate-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '35%'}}></div>
                    </div>
                    <span className="text-sm">8 agents</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-orange-700/50">
            <h3 className="text-xl font-semibold mb-4">Recent Network Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">+</span>
                  </div>
                  <div>
                    <p className="font-semibold">New agent onboarded</p>
                    <p className="text-sm text-slate-400">Sophia Laurent - Pétion-Ville</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">💰</span>
                  </div>
                  <div>
                    <p className="font-semibold">Commission payout processed</p>
                    <p className="text-sm text-slate-400">G 45,200 distributed to network</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">1 day ago</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">🎯</span>
                  </div>
                  <div>
                    <p className="font-semibold">Monthly target achieved</p>
                    <p className="text-sm text-slate-400">105% of G 2.3M volume target reached</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
