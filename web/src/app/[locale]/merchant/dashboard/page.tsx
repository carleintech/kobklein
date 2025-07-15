import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Merchant Dashboard - KobKlein',
  description: 'Manage your business payments and KobKlein merchant account',
};

interface MerchantDashboardPageProps {
  params: {
    locale: string;
  };
}

export default function MerchantDashboardPage({ params }: MerchantDashboardPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Merchant Dashboard</h1>
            <p className="text-slate-300">Manage your business payments and transactions</p>
          </div>

          {/* Business Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-teal-700/50">
              <h3 className="text-lg font-semibold mb-2">Today&apos;s Sales</h3>
              <p className="text-3xl font-bold text-teal-400">G 12,450.00</p>
              <p className="text-sm text-green-400">+18% vs yesterday</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-teal-700/50">
              <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
              <p className="text-3xl font-bold text-blue-400">G 285,600.00</p>
              <p className="text-sm text-green-400">+12% this month</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-teal-700/50">
              <h3 className="text-lg font-semibold mb-2">Transactions</h3>
              <p className="text-3xl font-bold text-purple-400">847</p>
              <p className="text-sm text-slate-400">This month</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-teal-700/50">
              <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
              <p className="text-3xl font-bold text-green-400">99.2%</p>
              <p className="text-sm text-slate-400">Payment success</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <button className="bg-teal-600 hover:bg-teal-700 rounded-lg p-4 text-center transition-colors">
              <div className="text-2xl mb-2">💳</div>
              <div className="font-semibold">Process Payment</div>
            </button>
            
            <button className="bg-blue-600 hover:bg-blue-700 rounded-lg p-4 text-center transition-colors">
              <div className="text-2xl mb-2">📱</div>
              <div className="font-semibold">NFC Payment</div>
            </button>
            
            <button className="bg-purple-600 hover:bg-purple-700 rounded-lg p-4 text-center transition-colors">
              <div className="text-2xl mb-2">🔄</div>
              <div className="font-semibold">Refund Transaction</div>
            </button>
            
            <button className="bg-orange-600 hover:bg-orange-700 rounded-lg p-4 text-center transition-colors">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold">Sales Report</div>
            </button>
          </div>

          {/* Payment Methods Performance */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-teal-700/50">
              <h3 className="text-xl font-semibold mb-4">Payment Methods</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">📱</span>
                    </div>
                    <span>NFC Payments</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">65%</p>
                    <p className="text-sm text-slate-400">G 185,640</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">💳</span>
                    </div>
                    <span>QR Code</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">25%</p>
                    <p className="text-sm text-slate-400">G 71,400</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">📞</span>
                    </div>
                    <span>USSD</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">10%</p>
                    <p className="text-sm text-slate-400">G 28,560</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-teal-700/50">
              <h3 className="text-xl font-semibold mb-4">Business Hours Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Morning (6AM - 12PM)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-slate-700 rounded-full h-2">
                      <div className="bg-teal-500 h-2 rounded-full" style={{width: '40%'}}></div>
                    </div>
                    <span className="text-sm">40%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Afternoon (12PM - 6PM)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-slate-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '45%'}}></div>
                    </div>
                    <span className="text-sm">45%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Evening (6PM - 10PM)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-slate-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '15%'}}></div>
                    </div>
                    <span className="text-sm">15%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-teal-700/50">
            <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold">NFC Payment</p>
                    <p className="text-sm text-slate-400">Customer: Marie D. • 2:45 PM</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-400">G 450.00</p>
                  <p className="text-sm text-slate-400">Fee: G 9.00</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold">QR Code Payment</p>
                    <p className="text-sm text-slate-400">Customer: Jean B. • 2:30 PM</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-400">G 1,250.00</p>
                  <p className="text-sm text-slate-400">Fee: G 25.00</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold">USSD Payment</p>
                    <p className="text-sm text-slate-400">Customer: Rose M. • 2:15 PM</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-purple-400">G 750.00</p>
                  <p className="text-sm text-slate-400">Fee: G 15.00</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold">NFC Payment</p>
                    <p className="text-sm text-slate-400">Customer: Pierre L. • 2:00 PM</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-teal-400">G 2,100.00</p>
                  <p className="text-sm text-slate-400">Fee: G 42.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
