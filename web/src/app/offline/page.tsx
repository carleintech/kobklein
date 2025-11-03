'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, Wifi, WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [pendingSync, setPendingSync] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Auto-redirect when back online
      setTimeout(() => {
        router.push('/');
      }, 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [router]);

  const handleRetry = () => {
    if (navigator.onLine) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* KobKlein Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-600 rounded-full p-3 mr-3">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">KobKlein</h1>
        </div>

        {/* Connection Status */}
        <div className="mb-6">
          {isOnline ? (
            <div className="flex items-center justify-center text-green-600">
              <Wifi className="h-8 w-8 mr-2" />
              <span className="text-lg font-semibold">Connection Restored!</span>
            </div>
          ) : (
            <div className="flex items-center justify-center text-gray-500">
              <WifiOff className="h-8 w-8 mr-2" />
              <span className="text-lg font-semibold">You're Offline</span>
            </div>
          )}
        </div>

        {/* Status Message */}
        <div className="mb-6">
          {isOnline ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                Great! Your connection is back. Redirecting you now...
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700 mb-3">
                Don't worry! KobKlein works offline too. Your data is safe and will sync when you're back online.
              </p>
              <p className="text-sm text-gray-500">
                You can still:
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• View your wallet balance</li>
                <li>• Check transaction history</li>
                <li>• Prepare payments (will send when online)</li>
              </ul>
            </div>
          )}
        </div>

        {/* Pending Sync Info */}
        {pendingSync > 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              {pendingSync} transaction{pendingSync > 1 ? 's' : ''} pending sync
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {isOnline ? (
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Continue to KobKlein
            </button>
          ) : (
            <>
              <button
                onClick={handleRetry}
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Try Again
              </button>
              
              <button
                onClick={() => router.push('/wallet')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View Offline Wallet
              </button>
            </>
          )}
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 mt-6">
          KobKlein automatically syncs your data when you're back online. 
          No transactions will be lost.
        </p>
      </div>

      {/* Network Status Indicator */}
      <div className="mt-8 flex items-center text-sm text-gray-500">
        <div className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
        {isOnline ? 'Connected' : 'No Internet Connection'}
      </div>
    </div>
  );
}