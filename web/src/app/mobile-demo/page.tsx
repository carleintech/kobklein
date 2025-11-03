'use client';

import React, { useState } from 'react';
import { MobileWalletOverview } from '@/components/mobile/MobilePaymentFlows';
import { MobileAuthFlow } from '@/components/mobile/MobileAuth';
import { 
  MobileButton, 
  MobileCard, 
  MobileModal, 
  useMobileOptimizations 
} from '@/components/mobile/MobileOptimizations';
import { 
  SwipeableCard, 
  PullToRefresh, 
  MobileBottomNav, 
  MobileFAB,
  MobileNumberPad,
  MobileGestureHandler
} from '@/components/mobile/MobileGestures';

export default function MobileDemoPage() {
  const { hapticFeedback, isMobile, isInstalled, isOffline, viewport } = useMobileOptimizations();
  
  // Demo states
  const [currentView, setCurrentView] = useState<'features' | 'wallet' | 'auth'>('features');
  const [showModal, setShowModal] = useState(false);
  const [showNumberPad, setShowNumberPad] = useState(false);
  const [amount, setAmount] = useState('0.00');
  const [refreshCount, setRefreshCount] = useState(0);

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshCount(count => count + 1);
    hapticFeedback('success');
  };

  const handleNumberInput = (number: string) => {
    if (amount === '0.00') {
      setAmount(number);
    } else {
      setAmount(prev => prev + number);
    }
  };

  const handleBackspace = () => {
    if (amount.length > 1) {
      setAmount(prev => prev.slice(0, -1));
    } else {
      setAmount('0.00');
    }
  };

  const handleClear = () => {
    setAmount('0.00');
  };

  const handleDecimal = () => {
    if (!amount.includes('.')) {
      setAmount(prev => prev + '.');
    }
  };

  const bottomNavItems = [
    {
      icon: '🏠',
      label: 'Features',
      active: currentView === 'features',
      onTap: () => setCurrentView('features'),
    },
    {
      icon: '💰',
      label: 'Wallet',
      active: currentView === 'wallet',
      onTap: () => setCurrentView('wallet'),
    },
    {
      icon: '🔐',
      label: 'Auth',
      active: currentView === 'auth',
      badge: 2,
      onTap: () => setCurrentView('auth'),
    },
    {
      icon: '⚙️',
      label: 'Settings',
      onTap: () => hapticFeedback('medium'),
    },
  ];

  const sampleTransactions = [
    { id: 1, description: 'Coffee Shop', amount: -4.50, time: '2 min ago', type: 'expense' },
    { id: 2, description: 'Salary Deposit', amount: 2500.00, time: '1 day ago', type: 'income' },
    { id: 3, description: 'Gas Station', amount: -35.00, time: '2 days ago', type: 'expense' },
    { id: 4, description: 'Freelance Payment', amount: 250.00, time: '3 days ago', type: 'income' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Status Bar */}
      <div className="mobile-status-bar">
        <div className="flex items-center space-x-2">
          <span>📱</span>
          <span>KobKlein PWA</span>
        </div>
        <div className="flex items-center space-x-3">
          {isOffline && <span>🔴 Offline</span>}
          {isInstalled && <span>📲 Installed</span>}
          <span>100%</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Content */}
      {currentView === 'features' && (
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="p-4 space-y-6 safe-area-top">
            {/* Header */}
            <MobileCard padding="lg" className="text-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <h1 className="text-2xl font-bold mb-2">🇭🇹 KobKlein Mobile</h1>
              <p className="text-blue-100">Haiti's First PWA Fintech Platform</p>
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <p className="font-semibold">{viewport.width}×{viewport.height}</p>
                  <p className="text-blue-200">Screen Size</p>
                </div>
                <div>
                  <p className="font-semibold">{viewport.orientation}</p>
                  <p className="text-blue-200">Orientation</p>
                </div>
              </div>
            </MobileCard>

            {/* PWA Status */}
            <MobileCard padding="md">
              <h2 className="text-lg font-semibold mb-3">PWA Status</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className={`p-3 rounded-lg ${isMobile ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  <span className="block font-semibold">{isMobile ? '✅ Mobile' : '❌ Desktop'}</span>
                  <span>Device Type</span>
                </div>
                <div className={`p-3 rounded-lg ${isInstalled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  <span className="block font-semibold">{isInstalled ? '✅ Installed' : '📲 Installable'}</span>
                  <span>PWA Status</span>
                </div>
                <div className={`p-3 rounded-lg ${isOffline ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  <span className="block font-semibold">{isOffline ? '🔴 Offline' : '🟢 Online'}</span>
                  <span>Connection</span>
                </div>
                <div className="p-3 rounded-lg bg-blue-100 text-blue-800">
                  <span className="block font-semibold">{refreshCount}</span>
                  <span>Refreshes</span>
                </div>
              </div>
            </MobileCard>

            {/* Interactive Features */}
            <MobileCard padding="md">
              <h2 className="text-lg font-semibold mb-4">Interactive Features</h2>
              <div className="space-y-3">
                <MobileButton
                  variant="primary"
                  size="lg"
                  onClick={() => setShowModal(true)}
                  haptic="medium"
                  className="w-full"
                >
                  🎯 Open Modal Demo
                </MobileButton>
                
                <MobileButton
                  variant="secondary"
                  size="lg"
                  onClick={() => setShowNumberPad(true)}
                  haptic="light"
                  className="w-full"
                >
                  🔢 Number Pad Demo
                </MobileButton>
                
                <div className="grid grid-cols-3 gap-2">
                  <MobileButton
                    variant="success"
                    size="md"
                    onClick={() => hapticFeedback('light')}
                    haptic="light"
                  >
                    Light
                  </MobileButton>
                  <MobileButton
                    variant="primary"
                    size="md"
                    onClick={() => hapticFeedback('medium')}
                    haptic="medium"
                  >
                    Medium
                  </MobileButton>
                  <MobileButton
                    variant="danger"
                    size="md"
                    onClick={() => hapticFeedback('heavy')}
                    haptic="heavy"
                  >
                    Heavy
                  </MobileButton>
                </div>
              </div>
            </MobileCard>

            {/* Swipeable Transactions */}
            <MobileCard padding="md">
              <h2 className="text-lg font-semibold mb-4">Swipeable Transactions</h2>
              <p className="text-sm text-gray-600 mb-4">Swipe left to delete, right to favorite</p>
              <div className="space-y-3">
                {sampleTransactions.map((transaction) => (
                  <SwipeableCard
                    key={transaction.id}
                    leftAction={{
                      icon: '🗑️',
                      label: 'Delete',
                      color: 'bg-red-500',
                      action: () => hapticFeedback('error')
                    }}
                    rightAction={{
                      icon: '⭐',
                      label: 'Favorite',
                      color: 'bg-yellow-500',
                      action: () => hapticFeedback('success')
                    }}
                  >
                    <div className="p-4 bg-white rounded-lg border flex items-center justify-between">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{transaction.time}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </div>
                    </div>
                  </SwipeableCard>
                ))}
              </div>
            </MobileCard>

            {/* Gesture Handler Demo */}
            <MobileGestureHandler
              onSwipeUp={() => {
                hapticFeedback('medium');
                setShowModal(true);
              }}
              onSwipeDown={() => {
                hapticFeedback('light');
                handleRefresh();
              }}
              onSwipeLeft={() => {
                hapticFeedback('light');
                setCurrentView('wallet');
              }}
              onSwipeRight={() => {
                hapticFeedback('light');
                setCurrentView('auth');
              }}
            >
              <MobileCard padding="lg" className="text-center bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <h3 className="text-lg font-semibold mb-2">🤏 Gesture Zone</h3>
                <p className="text-purple-100 text-sm mb-4">Try swiping in any direction!</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>⬆️ Open Modal</div>
                  <div>⬇️ Refresh</div>
                  <div>⬅️ Wallet</div>
                  <div>➡️ Auth</div>
                </div>
              </MobileCard>
            </MobileGestureHandler>
          </div>
        </PullToRefresh>
      )}

      {currentView === 'wallet' && <MobileWalletOverview />}

      {currentView === 'auth' && (
        <MobileAuthFlow
          mode="signin"
          onComplete={(user) => {
            console.log('Auth completed:', user);
            hapticFeedback('success');
          }}
          onModeChange={(mode) => {
            console.log('Mode changed:', mode);
            hapticFeedback('light');
          }}
        />
      )}

      {/* FAB */}
      <MobileFAB
        icon="➕"
        label="Quick Send"
        onClick={() => {
          hapticFeedback('medium');
          setCurrentView('wallet');
        }}
        variant="primary"
        size="lg"
      />

      {/* Bottom Navigation */}
      <MobileBottomNav items={bottomNavItems} />

      {/* Modal Demo */}
      <MobileModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Mobile Modal Demo"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎉</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Awesome!</h3>
            <p className="text-gray-600">This is a mobile-optimized modal with haptic feedback and smooth animations.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <MobileButton
              variant="secondary"
              size="md"
              onClick={() => setShowModal(false)}
              className="w-full"
            >
              Cancel
            </MobileButton>
            <MobileButton
              variant="primary"
              size="md"
              onClick={() => {
                hapticFeedback('success');
                setShowModal(false);
              }}
              className="w-full"
            >
              Confirm
            </MobileButton>
          </div>
        </div>
      </MobileModal>

      {/* Number Pad Modal */}
      <MobileModal
        isOpen={showNumberPad}
        onClose={() => setShowNumberPad(false)}
        title="Amount Entry"
        size="lg"
      >
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Enter amount</p>
            <div className="text-4xl font-bold text-center p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              ${amount}
            </div>
          </div>

          <MobileNumberPad
            onNumberPress={handleNumberInput}
            onBackspace={handleBackspace}
            onClear={handleClear}
            onDecimal={handleDecimal}
          />

          <div className="flex space-x-3">
            <MobileButton
              variant="secondary"
              size="lg"
              onClick={() => setShowNumberPad(false)}
              className="flex-1"
            >
              Cancel
            </MobileButton>
            <MobileButton
              variant="primary"
              size="lg"
              onClick={() => {
                hapticFeedback('success');
                setShowNumberPad(false);
              }}
              className="flex-1"
            >
              Confirm ${amount}
            </MobileButton>
          </div>
        </div>
      </MobileModal>
    </div>
  );
}