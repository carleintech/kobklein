import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Dashboard - KobKlein',
  description: 'Manage your KobKlein account and transactions',
};

interface ClientDashboardPageProps {
  params: {
    locale: string;
  };
}

export default function ClientDashboardPage({ params }: ClientDashboardPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Client Dashboard</h1>
            <p className="text-slate-300">Manage your KobKlein account and transactions</p>
          </div>

          {/* Balance Card */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-2">Current Balance</h3>
              <p className="text-3xl font-bold text-cyan-400">G 53,200.00</p>
              <p className="text-sm text-slate-400">≈ $401.51 USD</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-2">This Month</h3>
              <p className="text-2xl font-bold text-green-400">+G 12,500.00</p>
              <p className="text-sm text-slate-400">Received</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-2">Transactions</h3>
              <p className="text-2xl font-bold text-blue-400">47</p>
              <p className="text-sm text-slate-400">This month</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <button className="bg-blue-600 hover:bg-blue-700 rounded-lg p-4 text-center transition-colors">
              <div className="text-2xl mb-2">💸</div>
              <div className="font-semibold">Send Money</div>
            </button>
            
            <button className="bg-green-600 hover:bg-green-700 rounded-lg p-4 text-center transition-colors">
              <div className="text-2xl mb-2">💰</div>
              <div className="font-semibold">Request Money</div>
            </button>
            
            <button className="bg-purple-600 hover:bg-purple-700 rounded-lg p-4 text-center transition-colors">
              <div className="text-2xl mb-2">🏪</div>
              <div className="font-semibold">Pay Merchant</div>
            </button>
            
            <button className="bg-orange-600 hover:bg-orange-700 rounded-lg p-4 text-center transition-colors">
              <div className="text-2xl mb-2">📱</div>
              <div className="font-semibold">Mobile Recharge</div>
            </button>
          </div>

          {/* Recent Transactions */}
          <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">+</span>
                  </div>
                  <div>
                    <p className="font-semibold">Received from Marie</p>
                    <p className="text-sm text-slate-400">Today, 2:30 PM</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-400">+G 2,500.00</p>
                  <p className="text-sm text-slate-400">+$18.87</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">-</span>
                  </div>
                  <div>
                    <p className="font-semibold">Sent to Jean</p>
                    <p className="text-sm text-slate-400">Yesterday, 4:15 PM</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-400">-G 1,200.00</p>
                  <p className="text-sm text-slate-400">-$9.06</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">🏪</span>
                  </div>
                  <div>
                    <p className="font-semibold">Paid at Ti Boutik</p>
                    <p className="text-sm text-slate-400">2 days ago, 11:20 AM</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-400">-G 850.00</p>
                  <p className="text-sm text-slate-400">-$6.42</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
