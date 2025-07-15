import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diaspora Dashboard - KobKlein',
  description: 'Send money to Haiti and manage your diaspora account',
};

interface DiasporaDashboardPageProps {
  params: {
    locale: string;
  };
}

export default function DiasporaDashboardPage({ params }: DiasporaDashboardPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Diaspora Dashboard</h1>
            <p className="text-slate-300">Send money to Haiti and support your family</p>
          </div>

          {/* Balance & Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-green-700/50">
              <h3 className="text-lg font-semibold mb-2">Available Balance</h3>
              <p className="text-3xl font-bold text-green-400">$2,450.00</p>
              <p className="text-sm text-slate-400">≈ G 324,675.00</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-green-700/50">
              <h3 className="text-lg font-semibold mb-2">Sent This Month</h3>
              <p className="text-2xl font-bold text-blue-400">$850.00</p>
              <p className="text-sm text-slate-400">To 3 recipients</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-green-700/50">
              <h3 className="text-lg font-semibold mb-2">Total Sent</h3>
              <p className="text-2xl font-bold text-purple-400">$12,400.00</p>
              <p className="text-sm text-slate-400">Since joining</p>
            </div>
          </div>

          {/* Quick Send Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <button className="bg-green-600 hover:bg-green-700 rounded-lg p-4 text-center transition-colors">
              <div className="text-2xl mb-2">💸</div>
              <div className="font-semibold">Send Money</div>
            </button>
            
            <button className="bg-blue-600 hover:bg-blue-700 rounded-lg p-4 text-center transition-colors">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-semibold">Manage Recipients</div>
            </button>
            
            <button className="bg-purple-600 hover:bg-purple-700 rounded-lg p-4 text-center transition-colors">
              <div className="text-2xl mb-2">🔄</div>
              <div className="font-semibold">Auto-Refill</div>
            </button>
            
            <button className="bg-orange-600 hover:bg-orange-700 rounded-lg p-4 text-center transition-colors">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold">Send History</div>
            </button>
          </div>

          {/* Favorite Recipients */}
          <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-green-700/50 mb-8">
            <h3 className="text-xl font-semibold mb-4">Favorite Recipients</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  <div>
                    <p className="font-semibold">Marie Dupont</p>
                    <p className="text-sm text-slate-400">Port-au-Prince</p>
                    <p className="text-sm text-green-400">Last sent: $200</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">J</span>
                  </div>
                  <div>
                    <p className="font-semibold">Jean Baptiste</p>
                    <p className="text-sm text-slate-400">Cap-Haïtien</p>
                    <p className="text-sm text-blue-400">Last sent: $150</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">R</span>
                  </div>
                  <div>
                    <p className="font-semibold">Rose Michel</p>
                    <p className="text-sm text-slate-400">Jacmel</p>
                    <p className="text-sm text-purple-400">Last sent: $300</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transfers */}
          <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-green-700/50">
            <h3 className="text-xl font-semibold mb-4">Recent Transfers</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold">Sent to Marie Dupont</p>
                    <p className="text-sm text-slate-400">Today, 10:30 AM • Completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-400">$200.00</p>
                  <p className="text-sm text-slate-400">Fee: $3.99</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold">Sent to Jean Baptiste</p>
                    <p className="text-sm text-slate-400">Yesterday, 3:15 PM • Completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-400">$150.00</p>
                  <p className="text-sm text-slate-400">Fee: $2.99</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">⏳</span>
                  </div>
                  <div>
                    <p className="font-semibold">Sent to Rose Michel</p>
                    <p className="text-sm text-slate-400">2 days ago, 11:45 AM • Processing</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-purple-400">$300.00</p>
                  <p className="text-sm text-slate-400">Fee: $5.99</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
