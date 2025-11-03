/**
 * Advanced Payments Integration Test Component
 * Demonstrates connection between frontend and backend APIs
 */

'use client';

import React, { useState } from 'react';
import { MobileButton, MobileCard } from './MobileOptimizations';
import { 
  useQRPayments, 
  useNFCPayments, 
  usePaymentRequests, 
  useMerchantQR, 
  usePaymentSecurity 
} from '@/hooks/useAdvancedPayments';

export function AdvancedPaymentsTest() {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [activeTest, setActiveTest] = useState<string | null>(null);

  const qrHook = useQRPayments();
  const nfcHook = useNFCPayments();
  const requestsHook = usePaymentRequests();
  const merchantHook = useMerchantQR();
  const securityHook = usePaymentSecurity();

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setActiveTest(testName);
    try {
      const result = await testFn();
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: true, data: result, timestamp: new Date().toLocaleTimeString() }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: false, error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toLocaleTimeString() }
      }));
    } finally {
      setActiveTest(null);
    }
  };

  const tests = [
    {
      name: 'QR Code Generation',
      fn: () => qrHook.generateQR({
        amount: 100,
        currency: 'HTG',
        description: 'Test QR Payment',
        type: 'payment_request' as const
      })
    },
    {
      name: 'NFC Session Start',
      fn: () => nfcHook.startSession({
        amount: 50,
        currency: 'USD',
        description: 'Test NFC Payment'
      })
    },
    {
      name: 'Payment Request Creation',
      fn: () => requestsHook.createRequest({
        toUserId: 'test-user-123',
        amount: 75,
        currency: 'HTG',
        description: 'Test Payment Request'
      })
    },
    {
      name: 'Merchant QR Generation',
      fn: () => merchantHook.generateMerchantQR({
        amount: 200,
        currency: 'USD',
        description: 'Test Merchant Payment',
        isReusable: true
      })
    },
    {
      name: 'Security Settings Fetch',
      fn: () => securityHook.getSettings()
    },
    {
      name: 'QR Payment History',
      fn: () => qrHook.getHistory({ limit: 5 })
    },
    {
      name: 'Merchant Dashboard',
      fn: () => merchantHook.getDashboard('week')
    }
  ];

  const isAnyLoading = qrHook.loading || nfcHook.loading || requestsHook.loading || merchantHook.loading || securityHook.loading;

  return (
    <div className="space-y-6 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🔗 Advanced Payments API Integration Test
        </h2>
        <p className="text-gray-600">
          Test the connection between frontend components and backend APIs
        </p>
      </div>

      {/* Test Controls */}
      <MobileCard>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">API Connection Tests</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tests.map((test) => (
              <MobileButton
                key={test.name}
                onClick={() => runTest(test.name, test.fn)}
                disabled={isAnyLoading}
                className={`
                  ${activeTest === test.name ? 'bg-yellow-500' : ''}
                  ${testResults[test.name]?.success === true ? 'bg-green-500' : ''}
                  ${testResults[test.name]?.success === false ? 'bg-red-500' : ''}
                `}
              >
                {activeTest === test.name ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Testing...
                  </span>
                ) : (
                  test.name
                )}
              </MobileButton>
            ))}
          </div>

          <MobileButton
            onClick={() => {
              tests.forEach(test => runTest(test.name, test.fn));
            }}
            disabled={isAnyLoading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            🚀 Run All Tests
          </MobileButton>
        </div>
      </MobileCard>

      {/* Test Results */}
      <MobileCard>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Test Results</h3>
          
          {Object.keys(testResults).length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No tests run yet. Click a test button above to start.
            </p>
          ) : (
            <div className="space-y-3">
              {Object.entries(testResults).map(([testName, result]) => (
                <div
                  key={testName}
                  className={`p-3 rounded-lg border-l-4 ${
                    result.success 
                      ? 'bg-green-50 border-green-500' 
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">
                      {result.success ? '✅' : '❌'} {testName}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {result.timestamp}
                    </span>
                  </div>
                  
                  {result.success ? (
                    <div className="text-sm text-green-700">
                      <p className="font-medium">✅ API Call Successful</p>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="cursor-pointer hover:text-green-800">
                            View Response Data
                          </summary>
                          <pre className="mt-2 p-2 bg-green-100 rounded text-xs overflow-x-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-red-700">
                      <p className="font-medium">❌ API Call Failed</p>
                      <p className="mt-1">{result.error}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </MobileCard>

      {/* Connection Status */}
      <MobileCard>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Connection Status</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                Object.values(testResults).some(r => r.success) ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className="text-sm">
                Backend API: {Object.values(testResults).some(r => r.success) ? 'Connected' : 'Not Tested'}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                navigator.onLine ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm">
                Network: {navigator.onLine ? 'Online' : 'Offline'}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm">
                Frontend: Ready
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                Object.keys(testResults).length > 0 ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className="text-sm">
                Tests: {Object.keys(testResults).length > 0 ? 'Active' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      </MobileCard>

      {/* Error States */}
      {(qrHook.error || nfcHook.error || requestsHook.error || merchantHook.error || securityHook.error) && (
        <MobileCard>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-red-600">Errors</h3>
            {qrHook.error && <p className="text-sm text-red-600">QR: {qrHook.error}</p>}
            {nfcHook.error && <p className="text-sm text-red-600">NFC: {nfcHook.error}</p>}
            {requestsHook.error && <p className="text-sm text-red-600">Requests: {requestsHook.error}</p>}
            {merchantHook.error && <p className="text-sm text-red-600">Merchant: {merchantHook.error}</p>}
            {securityHook.error && <p className="text-sm text-red-600">Security: {securityHook.error}</p>}
          </div>
        </MobileCard>
      )}
    </div>
  );
}