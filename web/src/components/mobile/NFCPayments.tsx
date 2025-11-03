'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MobileButton, MobileCard, MobileModal, useMobileOptimizations } from './MobileOptimizations';

// NFC Payment data structure
interface NFCPaymentData {
  type: 'tap_to_pay' | 'tap_to_receive' | 'business_card';
  amount?: number;
  currency: string;
  sender?: {
    id: string;
    name: string;
    phone?: string;
  };
  recipient?: {
    id: string;
    name: string;
    type: 'user' | 'merchant';
  };
  description?: string;
  timestamp: number;
  nonce: string;
}

// NFC capability detection
const checkNFCSupport = (): boolean => {
  return 'NDEFReader' in window;
};

interface NFCTapToPayProps {
  mode: 'send' | 'receive';
  amount?: number;
  onPaymentComplete: (data: NFCPaymentData) => void;
  onError: (error: string) => void;
  onClose: () => void;
}

export function NFCTapToPay({ mode, amount, onPaymentComplete, onError, onClose }: NFCTapToPayProps) {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'ready' | 'listening' | 'processing' | 'success' | 'error'>('ready');
  const [errorMessage, setErrorMessage] = useState('');
  const [detectedDevice, setDetectedDevice] = useState<string>('');
  const ndefReaderRef = useRef<any>(null);
  const { hapticFeedback, isMobile } = useMobileOptimizations();

  useEffect(() => {
    if (isActive) {
      startNFCSession();
    } else {
      stopNFCSession();
    }

    return () => {
      stopNFCSession();
    };
  }, [isActive, mode]);

  const startNFCSession = async () => {
    if (!checkNFCSupport()) {
      setStatus('error');
      setErrorMessage('NFC is not supported on this device');
      onError('NFC not supported');
      return;
    }

    try {
      // Request NFC permissions
      const ndefReader = new (window as any).NDEFReader();
      ndefReaderRef.current = ndefReader;

      if (mode === 'receive') {
        // Start scanning for NFC tags/devices
        await ndefReader.scan();
        setStatus('listening');
        hapticFeedback('medium');

        ndefReader.addEventListener('reading', ({ message, serialNumber }: any) => {
          handleNFCRead(message, serialNumber);
        });

        ndefReader.addEventListener('readingerror', () => {
          setStatus('error');
          setErrorMessage('Failed to read NFC data');
          hapticFeedback('error');
        });

      } else {
        // Prepare for writing payment data
        setStatus('listening');
        hapticFeedback('medium');
        
        // Simulate writing payment data to NFC
        setTimeout(() => {
          simulateNFCWrite();
        }, 2000);
      }

    } catch (error) {
      console.error('NFC error:', error);
      setStatus('error');
      setErrorMessage('NFC permission denied or unavailable');
      onError('NFC initialization failed');
    }
  };

  const stopNFCSession = () => {
    if (ndefReaderRef.current) {
      try {
        // Stop NFC scanning (if supported by browser)
        ndefReaderRef.current = null;
      } catch (error) {
        console.error('Error stopping NFC:', error);
      }
    }
    setIsActive(false);
    setStatus('ready');
  };

  const handleNFCRead = (message: any, serialNumber: string) => {
    setDetectedDevice(`Device ${serialNumber.slice(-4)}`);
    setStatus('processing');
    hapticFeedback('success');

    try {
      // Parse NFC message
      const decoder = new TextDecoder();
      let paymentData: NFCPaymentData | null = null;

      for (const record of message.records) {
        if (record.recordType === 'text') {
          const text = decoder.decode(record.data);
          
          try {
            // Try to parse as KobKlein payment data
            if (text.startsWith('kobklein://')) {
              const data = JSON.parse(atob(text.split('data=')[1]));
              paymentData = data;
              break;
            }
          } catch (e) {
            // Not a valid KobKlein payment, continue
          }
        }
      }

      if (paymentData) {
        setTimeout(() => {
          setStatus('success');
          onPaymentComplete(paymentData);
        }, 1500);
      } else {
        // Create default payment data for demo
        const defaultPayment: NFCPaymentData = {
          type: 'tap_to_pay',
          amount: amount || 25.00,
          currency: 'USD',
          sender: {
            id: 'nfc_user',
            name: 'NFC Device User'
          },
          recipient: {
            id: 'current_user',
            name: 'Your Account',
            type: 'user'
          },
          description: 'NFC Payment',
          timestamp: Date.now(),
          nonce: serialNumber
        };

        setTimeout(() => {
          setStatus('success');
          onPaymentComplete(defaultPayment);
        }, 1500);
      }

    } catch (error) {
      setStatus('error');
      setErrorMessage('Invalid NFC payment data');
      hapticFeedback('error');
    }
  };

  const simulateNFCWrite = () => {
    // Simulate writing payment data for demo
    setDetectedDevice('Target Device');
    setStatus('processing');
    
    const paymentData: NFCPaymentData = {
      type: 'tap_to_receive',
      amount: amount,
      currency: 'USD',
      recipient: {
        id: 'current_user',
        name: 'Your Account',
        type: 'user'
      },
      description: 'NFC Payment Request',
      timestamp: Date.now(),
      nonce: Date.now().toString()
    };

    setTimeout(() => {
      setStatus('success');
      hapticFeedback('success');
      onPaymentComplete(paymentData);
    }, 2000);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'ready': return '📱';
      case 'listening': return '🔍';
      case 'processing': return '⚡';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '📱';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'ready':
        return mode === 'send' 
          ? 'Ready to send payment via NFC'
          : 'Ready to receive payment via NFC';
      case 'listening':
        return mode === 'send'
          ? 'Hold your device near the receiver'
          : 'Hold sender device near your phone';
      case 'processing':
        return `Processing payment with ${detectedDevice}...`;
      case 'success':
        return 'Payment completed successfully!';
      case 'error':
        return errorMessage || 'NFC operation failed';
      default:
        return 'Initializing NFC...';
    }
  };

  return (
    <div className="space-y-6">
      {/* NFC Status Display */}
      <div className="text-center">
        <div className={`
          w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-300
          ${status === 'listening' ? 'bg-blue-100 animate-pulse' : ''}
          ${status === 'processing' ? 'bg-yellow-100 animate-spin' : ''}
          ${status === 'success' ? 'bg-green-100' : ''}
          ${status === 'error' ? 'bg-red-100' : ''}
          ${status === 'ready' ? 'bg-gray-100' : ''}
        `}>
          <span className="text-4xl">{getStatusIcon()}</span>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">
          {mode === 'send' ? 'Send Payment' : 'Receive Payment'}
        </h3>
        
        {amount && (
          <p className="text-3xl font-bold text-blue-600 mb-2">
            ${amount.toFixed(2)}
          </p>
        )}
        
        <p className="text-gray-600 mb-4">{getStatusMessage()}</p>
        
        {detectedDevice && (
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-blue-700">{detectedDevice}</span>
          </div>
        )}
      </div>

      {/* NFC Animation */}
      {status === 'listening' && (
        <div className="relative flex items-center justify-center py-8">
          <div className="relative">
            {/* Phone representation */}
            <div className="w-16 h-24 bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">📱</span>
            </div>
            
            {/* NFC waves animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 border-2 border-blue-500 rounded-full animate-ping opacity-20"></div>
              <div className="absolute w-16 h-16 border-2 border-blue-500 rounded-full animate-ping opacity-40 animation-delay-200"></div>
              <div className="absolute w-12 h-12 border-2 border-blue-500 rounded-full animate-ping opacity-60 animation-delay-400"></div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <MobileCard padding="md">
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Instructions:</h4>
          <div className="space-y-2 text-sm text-gray-600">
            {mode === 'send' ? (
              <>
                <p>• Tap "Start NFC" to begin</p>
                <p>• Hold your phone near the receiver's device</p>
                <p>• Keep devices close (within 4cm) until complete</p>
                <p>• Look for the success confirmation</p>
              </>
            ) : (
              <>
                <p>• Tap "Start NFC" to begin listening</p>
                <p>• Ask the sender to hold their device near yours</p>
                <p>• Keep devices steady during transfer</p>
                <p>• Confirm payment details when received</p>
              </>
            )}
          </div>
        </div>
      </MobileCard>

      {/* Action Buttons */}
      <div className="space-y-3">
        {!isActive ? (
          <MobileButton
            variant="primary"
            size="lg"
            onClick={() => {
              setIsActive(true);
              hapticFeedback('medium');
            }}
            className="w-full"
          >
            🚀 Start NFC {mode === 'send' ? 'Send' : 'Receive'}
          </MobileButton>
        ) : (
          <MobileButton
            variant="danger"
            size="lg"
            onClick={() => {
              setIsActive(false);
              hapticFeedback('light');
            }}
            className="w-full"
          >
            ⏹️ Stop NFC
          </MobileButton>
        )}
        
        <MobileButton
          variant="secondary"
          size="md"
          onClick={onClose}
          className="w-full"
        >
          Cancel
        </MobileButton>
      </div>

      {/* Troubleshooting */}
      {status === 'error' && (
        <MobileCard padding="md" className="bg-red-50 border-red-200">
          <h4 className="font-semibold text-red-800 mb-2">Troubleshooting:</h4>
          <div className="space-y-1 text-sm text-red-700">
            <p>• Make sure NFC is enabled in device settings</p>
            <p>• Check that both devices support NFC</p>
            <p>• Try removing phone case if thick</p>
            <p>• Ensure devices are unlocked</p>
          </div>
        </MobileCard>
      )}
    </div>
  );
}

// NFC Business Card Exchange
interface NFCBusinessCardProps {
  onCardReceived: (card: any) => void;
  onClose: () => void;
}

export function NFCBusinessCard({ onCardReceived, onClose }: NFCBusinessCardProps) {
  const [mode, setMode] = useState<'share' | 'receive'>('share');
  const [isActive, setIsActive] = useState(false);
  const { hapticFeedback } = useMobileOptimizations();

  const myBusinessCard = {
    name: 'KobKlein User',
    phone: '+509 1234 5678',
    email: 'user@kobklein.com',
    company: 'KobKlein',
    wallet: 'kobklein_user_123',
    avatar: '👤'
  };

  const handleShare = () => {
    setIsActive(true);
    hapticFeedback('medium');
    
    // Simulate NFC business card sharing
    setTimeout(() => {
      setIsActive(false);
      hapticFeedback('success');
    }, 3000);
  };

  const handleReceive = () => {
    setIsActive(true);
    hapticFeedback('medium');
    
    // Simulate receiving a business card
    setTimeout(() => {
      const receivedCard = {
        name: 'Marie Joseph',
        phone: '+509 8765 4321',
        email: 'marie@business.ht',
        company: 'Local Business',
        wallet: 'kobklein_marie_456',
        avatar: '👩‍💼'
      };
      
      setIsActive(false);
      hapticFeedback('success');
      onCardReceived(receivedCard);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4">NFC Business Card</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <MobileButton
            variant={mode === 'share' ? 'primary' : 'secondary'}
            size="md"
            onClick={() => setMode('share')}
            className="w-full"
          >
            📤 Share
          </MobileButton>
          <MobileButton
            variant={mode === 'receive' ? 'primary' : 'secondary'}
            size="md"
            onClick={() => setMode('receive')}
            className="w-full"
          >
            📥 Receive
          </MobileButton>
        </div>
      </div>

      {mode === 'share' && (
        <div className="space-y-4">
          {/* My Business Card Preview */}
          <MobileCard padding="lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">{myBusinessCard.avatar}</span>
              </div>
              <h4 className="font-semibold text-lg">{myBusinessCard.name}</h4>
              <p className="text-gray-600">{myBusinessCard.company}</p>
              <p className="text-sm text-gray-500 mt-2">{myBusinessCard.phone}</p>
              <p className="text-sm text-gray-500">{myBusinessCard.email}</p>
            </div>
          </MobileCard>

          <MobileButton
            variant="primary"
            size="lg"
            onClick={handleShare}
            loading={isActive}
            className="w-full"
          >
            {isActive ? 'Sharing via NFC...' : '📡 Share My Card'}
          </MobileButton>
        </div>
      )}

      {mode === 'receive' && (
        <div className="space-y-4">
          <MobileCard padding="md" className="text-center">
            <p className="text-gray-600 mb-4">
              Hold your phone near someone's device to receive their business card
            </p>
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">{isActive ? '🔍' : '📇'}</span>
            </div>
            {isActive && (
              <p className="text-sm text-blue-600 animate-pulse">Listening for NFC cards...</p>
            )}
          </MobileCard>

          <MobileButton
            variant="primary"
            size="lg"
            onClick={handleReceive}
            loading={isActive}
            className="w-full"
          >
            {isActive ? 'Listening...' : '📡 Receive Card'}
          </MobileButton>
        </div>
      )}

      <MobileButton
        variant="secondary"
        size="md"
        onClick={onClose}
        className="w-full"
      >
        Done
      </MobileButton>
    </div>
  );
}

// Main NFC Payment Interface
export function NFCPaymentSystem() {
  const [mode, setMode] = useState<'menu' | 'tap_pay' | 'tap_receive' | 'business_card'>('menu');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [paymentData, setPaymentData] = useState<NFCPaymentData | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { hapticFeedback, isMobile } = useMobileOptimizations();

  const nfcSupported = checkNFCSupport();

  const handlePaymentComplete = (data: NFCPaymentData) => {
    setPaymentData(data);
    setShowConfirmation(true);
    setMode('menu');
    hapticFeedback('success');
  };

  const handlePaymentError = (error: string) => {
    console.error('NFC Payment error:', error);
    hapticFeedback('error');
    setMode('menu');
  };

  const startTapToPay = (amount: number) => {
    setPaymentAmount(amount);
    setMode('tap_pay');
  };

  if (!nfcSupported) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📱</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">NFC Not Available</h3>
          <p className="text-gray-600 mb-6">
            NFC (Near Field Communication) is not supported on this device or browser.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-2">Requirements:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Android device with NFC capability</li>
              <li>• Chrome browser (latest version)</li>
              <li>• NFC enabled in device settings</li>
              <li>• Secure context (HTTPS)</li>
            </ul>
          </div>
          <MobileButton
            variant="primary"
            size="lg"
            onClick={() => {
              // Refresh page to check again
              window.location.reload();
            }}
            className="w-full"
          >
            🔄 Check Again
          </MobileButton>
        </div>
      </div>
    );
  }

  if (mode === 'tap_pay') {
    return (
      <NFCTapToPay
        mode="send"
        amount={paymentAmount}
        onPaymentComplete={handlePaymentComplete}
        onError={handlePaymentError}
        onClose={() => setMode('menu')}
      />
    );
  }

  if (mode === 'tap_receive') {
    return (
      <NFCTapToPay
        mode="receive"
        onPaymentComplete={handlePaymentComplete}
        onError={handlePaymentError}
        onClose={() => setMode('menu')}
      />
    );
  }

  if (mode === 'business_card') {
    return (
      <NFCBusinessCard
        onCardReceived={(card) => {
          console.log('Received business card:', card);
          hapticFeedback('success');
          setMode('menu');
        }}
        onClose={() => setMode('menu')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl text-white">📡</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">NFC Payments</h2>
        <p className="text-gray-600">Contactless payments and data sharing</p>
      </div>

      {/* NFC Status */}
      <MobileCard padding="md" className="bg-green-50 border-green-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-lg">✅</span>
          </div>
          <div>
            <p className="font-semibold text-green-800">NFC Available</p>
            <p className="text-sm text-green-600">Ready for contactless payments</p>
          </div>
        </div>
      </MobileCard>

      {/* NFC Actions */}
      <div className="space-y-4">
        <MobileCard
          onTap={() => setShowAmountInput(true)}
          haptic="medium"
          padding="lg"
          className="border-2 border-blue-200 hover:border-blue-400 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💳</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Tap to Pay</h3>
              <p className="text-sm text-gray-600">Send money by tapping devices</p>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </MobileCard>

        <MobileCard
          onTap={() => setMode('tap_receive')}
          haptic="medium"
          padding="lg"
          className="border-2 border-green-200 hover:border-green-400 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📲</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Tap to Receive</h3>
              <p className="text-sm text-gray-600">Receive money from others</p>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </MobileCard>

        <MobileCard
          onTap={() => setMode('business_card')}
          haptic="medium"
          padding="lg"
          className="border-2 border-purple-200 hover:border-purple-400 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📇</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Business Cards</h3>
              <p className="text-sm text-gray-600">Share contact info instantly</p>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </MobileCard>
      </div>

      {/* Recent NFC Transactions */}
      <MobileCard padding="md">
        <h3 className="font-semibold text-gray-900 mb-3">Recent NFC Activity</h3>
        <div className="space-y-3">
          {[
            { type: 'payment', contact: 'Local Store', amount: 8.50, time: '5 min ago' },
            { type: 'received', contact: 'Jean Baptiste', amount: 20.00, time: '1 hour ago' },
            { type: 'card', contact: 'Marie Joseph', time: '2 hours ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">
                    {activity.type === 'payment' ? '💳' : activity.type === 'received' ? '📲' : '📇'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">{activity.contact}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
              {activity.amount && (
                <span className={`font-semibold text-sm ${
                  activity.type === 'received' ? 'text-green-600' : 'text-gray-700'
                }`}>
                  {activity.type === 'received' ? '+' : '-'}${activity.amount.toFixed(2)}
                </span>
              )}
            </div>
          ))}
        </div>
      </MobileCard>

      {/* Amount Input Modal */}
      <MobileModal
        isOpen={showAmountInput}
        onClose={() => setShowAmountInput(false)}
        title="Enter Amount"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <input
              type="number"
              placeholder="0.00"
              className="text-3xl font-bold text-center w-full border-2 border-gray-300 rounded-lg p-4 mb-4"
              onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <MobileButton
              variant="secondary"
              size="lg"
              onClick={() => setShowAmountInput(false)}
              className="w-full"
            >
              Cancel
            </MobileButton>
            <MobileButton
              variant="primary"
              size="lg"
              onClick={() => {
                setShowAmountInput(false);
                startTapToPay(paymentAmount);
              }}
              disabled={paymentAmount <= 0}
              className="w-full"
            >
              Continue
            </MobileButton>
          </div>
        </div>
      </MobileModal>

      {/* Payment Confirmation */}
      <MobileModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Payment Complete"
        size="md"
      >
        {paymentData && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Success!</h3>
              <p className="text-3xl font-bold text-green-600 mb-2">
                ${paymentData.amount?.toFixed(2) || '0.00'}
              </p>
              <p className="text-gray-600">
                {paymentData.type === 'tap_to_pay' ? 'Sent to' : 'Received from'}{' '}
                {paymentData.sender?.name || paymentData.recipient?.name}
              </p>
            </div>
            
            <MobileButton
              variant="primary"
              size="lg"
              onClick={() => setShowConfirmation(false)}
              className="w-full"
            >
              Done
            </MobileButton>
          </div>
        )}
      </MobileModal>
    </div>
  );
}