// File: kobklein/web/src/components/payments/nfc-tap-interface.tsx

import React, { useState, useEffect } from 'react';
import { Wifi, Smartphone, CheckCircle2, AlertTriangle, RefreshCw, CreditCard } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/kobklein-card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface NFCTapInterfaceProps {
  mode: 'merchant' | 'client';
  amount?: number;
  currency?: 'HTG' | 'USD';
  merchantName?: string;
  isActive?: boolean;
  onTap?: (cardData: any) => void;
  onCancel?: () => void;
}

export function NFCTapInterface({
  mode,
  amount,
  currency = 'HTG',
  merchantName,
  isActive = true,
  onTap,
  onCancel,
}: NFCTapInterfaceProps) {
  const [status, setStatus] = useState<'ready' | 'waiting' | 'reading' | 'success' | 'error'>('ready');
  const [lastTapTime, setLastTapTime] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Simulate NFC scanning
  const simulateNFCScan = () => {
    if (status !== 'ready') return;

    setStatus('waiting');
    
    // Simulate card detection after 2-3 seconds
    setTimeout(() => {
      setStatus('reading');
      
      // Simulate reading card data
      setTimeout(() => {
        const mockCardData = {
          cardId: 'KK_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          userId: 'USR_' + Math.random().toString(36).substr(2, 9),
          cardType: 'client',
          balance: Math.floor(Math.random() * 50000) + 5000, // Random balance between 5K-55K HTG
          holderName: 'Card Holder',
          isActive: true,
        };

        // Simulate success/failure (90% success rate)
        if (Math.random() > 0.1) {
          setStatus('success');
          setLastTapTime(new Date());
          onTap?.(mockCardData);
          
          // Reset after success
          setTimeout(() => {
            setStatus('ready');
          }, 3000);
        } else {
          setStatus('error');
          setErrorMessage('Card read failed. Please try again.');
          
          // Reset after error
          setTimeout(() => {
            setStatus('ready');
            setErrorMessage('');
          }, 3000);
        }
      }, 1500);
    }, 2000);
  };

  const getStatusDisplay = () => {
    switch (status) {
      case 'ready':
        return {
          icon: <Wifi className="h-12 w-12 text-blue-500" />,
          title: mode === 'merchant' ? 'Ready to Accept Payment' : 'Ready to Pay',
          subtitle: mode === 'merchant' 
            ? 'Ask customer to tap their KobKlein card'
            : 'Tap your card on the merchant terminal',
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
        };
      case 'waiting':
        return {
          icon: <Smartphone className="h-12 w-12 text-yellow-500 animate-pulse" />,
          title: 'Waiting for Card...',
          subtitle: 'Hold the card steady near the reader',
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
        };
      case 'reading':
        return {
          icon: <RefreshCw className="h-12 w-12 text-purple-500 animate-spin" />,
          title: 'Reading Card...',
          subtitle: 'Please keep the card in place',
          color: 'text-purple-600',
          bg: 'bg-purple-50',
          border: 'border-purple-200',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
          title: 'Payment Successful!',
          subtitle: 'Transaction completed successfully',
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
        };
      case 'error':
        return {
          icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
          title: 'Error',
          subtitle: errorMessage || 'Something went wrong',
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <KobKleinCard className="p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <CreditCard className="h-6 w-6 text-kobklein-accent" />
          <h3 className="text-xl font-semibold">NFC Payment</h3>
        </div>
        {merchantName && (
          <p className="text-sm text-muted-foreground">{merchantName}</p>
        )}
      </div>

      {/* Amount Display */}
      {amount && (
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground mb-1">Amount to {mode === 'merchant' ? 'Collect' : 'Pay'}</p>
          <p className="text-4xl font-bold text-kobklein-accent">
            {formatCurrency(amount, currency)}
          </p>
        </div>
      )}

      {/* NFC Interface */}
      <div className={`${statusDisplay.bg} ${statusDisplay.border} border-2 rounded-xl p-8 text-center mb-6 transition-all duration-300`}>
        <div className="mb-4">
          {statusDisplay.icon}
        </div>
        
        <h3 className={`text-lg font-semibold ${statusDisplay.color} mb-2`}>
          {statusDisplay.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4">
          {statusDisplay.subtitle}
        </p>

        {/* NFC Animation */}
        {status === 'ready' && (
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center border-2 border-gray-200 mb-4">
              <Wifi className="h-8 w-8 text-gray-400" />
            </div>
            {/* Animated ripples */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
              <div className="w-20 h-20 border-2 border-blue-300 rounded-full animate-ping opacity-20"></div>
              <div className="w-24 h-24 border-2 border-blue-300 rounded-full animate-ping opacity-10 absolute -top-2 -left-2" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        )}

        {/* Success Info */}
        {status === 'success' && lastTapTime && (
          <div className="text-xs text-muted-foreground">
            Completed at {lastTapTime.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="flex justify-center mb-6">
        <Badge 
          variant="outline" 
          className={
            !isActive ? 'text-gray-600 border-gray-200' :
            status === 'ready' ? 'text-blue-600 border-blue-200' :
            status === 'success' ? 'text-green-600 border-green-200' :
            status === 'error' ? 'text-red-600 border-red-200' :
            'text-yellow-600 border-yellow-200'
          }
        >
          {!isActive ? 'NFC Disabled' :
           status === 'ready' ? 'NFC Ready' :
           status === 'waiting' ? 'Detecting Card...' :
           status === 'reading' ? 'Processing...' :
           status === 'success' ? 'Success' :
           'Error'}
        </Badge>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        {status === 'ready' && isActive && (
          <button
            onClick={simulateNFCScan}
            className="flex-1 bg-kobklein-accent text-white py-3 px-6 rounded-lg hover:bg-kobklein-accent/90 transition-colors font-semibold"
          >
            {mode === 'merchant' ? 'Start Payment Collection' : 'Simulate Tap to Pay'}
          </button>
        )}
        
        {(status === 'waiting' || status === 'reading') && onCancel && (
          <button
            onClick={() => {
              setStatus('ready');
              onCancel();
            }}
            className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}

        {status === 'error' && (
          <button
            onClick={() => {
              setStatus('ready');
              setErrorMessage('');
            }}
            className="flex-1 bg-kobklein-accent text-white py-3 px-6 rounded-lg hover:bg-kobklein-accent/90 transition-colors"
          >
            Try Again
          </button>
        )}

        {status === 'success' && (
          <button
            onClick={() => setStatus('ready')}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
          >
            New Transaction
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">NFC Payment Instructions</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          {mode === 'merchant' ? (
            <>
              <li>• Ask customer to tap their KobKlein card</li>
              <li>• Hold card within 2cm of the NFC reader</li>
              <li>• Wait for the confirmation sound/vibration</li>
              <li>• Transaction will complete automatically</li>
            </>
          ) : (
            <>
              <li>• Hold your KobKlein card near the terminal</li>
              <li>• Keep the card steady for 2-3 seconds</li>
              <li>• Wait for payment confirmation</li>
              <li>• You'll receive a transaction receipt</li>
            </>
          )}
        </ul>
      </div>
    </KobKleinCard>
  );
}