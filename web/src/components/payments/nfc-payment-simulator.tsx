// File: kobklein/web/src/components/payments/nfc-payment-simulator.tsx
import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, CheckCircle2, XCircle, Loader2, CreditCard, AlertTriangle } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';

interface NFCPaymentSimulatorProps {
  userRole: 'client' | 'merchant';
  currentBalance: number;
  onPaymentComplete?: (transaction: any) => void;
}

type NFCState = 'idle' | 'scanning' | 'detected' | 'processing' | 'success' | 'error';

export function NFCPaymentSimulator({ 
  userRole, 
  currentBalance, 
  onPaymentComplete 
}: NFCPaymentSimulatorProps) {
  const [nfcState, setNfcState] = useState<NFCState>('idle');
  const [amount, setAmount] = useState('');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isNFCSupported, setIsNFCSupported] = useState(true);

  useEffect(() => {
    // Simulate NFC availability check
    const checkNFC = () => {
      // In a real app, this would check for actual NFC support
      const hasNFC = 'NDEFReader' in window || Math.random() > 0.2;
      setIsNFCSupported(hasNFC);
    };
    
    checkNFC();
  }, []);

  const startNFCPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setNfcState('scanning');
    
    // Simulate NFC scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate card detection
    setNfcState('detected');
    
    const mockCardData = {
      cardId: 'KB' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      cardType: userRole === 'client' ? 'merchant' : 'client',
      balance: Math.floor(Math.random() * 50000) + 10000,
      userId: 'user_' + Math.random().toString(36).substr(2, 6),
      userName: userRole === 'client' ? 'Marie\'s Store' : 'Jean Baptiste',
    };
    
    setPaymentData(mockCardData);
    
    // Auto-proceed to processing after showing detected card
    setTimeout(() => {
      processPayment(mockCardData);
    }, 1500);
  };

  const processPayment = async (cardData: any) => {
    setNfcState('processing');
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const paymentAmount = parseFloat(amount);
    const hasEnoughBalance = userRole === 'client' 
      ? currentBalance >= paymentAmount 
      : cardData.balance >= paymentAmount;
    
    if (hasEnoughBalance) {
      setNfcState('success');
      
      const transaction = {
        id: 'tx_' + Math.random().toString(36).substr(2, 10),
        amount: paymentAmount,
        from: userRole === 'client' ? 'You' : cardData.userName,
        to: userRole === 'client' ? cardData.userName : 'You',
        method: 'nfc',
        timestamp: new Date(),
      };
      
      onPaymentComplete?.(transaction);
    } else {
      setNfcState('error');
    }
  };

  const resetNFC = () => {
    setNfcState('idle');
    setPaymentData(null);
    setAmount('');
  };

  if (!isNFCSupported) {
    return (
      <KobKleinCard className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
          <Smartphone className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">NFC Not Supported</h3>
        <p className="text-muted-foreground text-sm">
          Your device doesn't support NFC payments. Please use QR codes instead.
        </p>
      </KobKleinCard>
    );
  }

  return (
    <KobKleinCard className="p-6">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Wifi className="w-5 h-5 text-kobklein-secondary" />
          <h2 className="text-xl font-bold">NFC Payment</h2>
        </div>

        {nfcState === 'idle' && (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nfc-amount">
                  {userRole === 'client' ? 'Payment Amount' : 'Amount to Collect'} (HTG)
                </Label>
                <Input
                  id="nfc-amount"
                  type="number"
                  placeholder="Enter amount..."
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg text-center"
                />
              </div>
              
              <Button 
                onClick={startNFCPayment}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full"
                size="lg"
              >
                <Smartphone className="w-5 h-5 mr-2" />
                {userRole === 'client' ? 'Tap to Pay' : 'Ready to Accept Payment'}
              </Button>
            </div>
          </>
        )}

        {nfcState === 'scanning' && (
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto border-4 border-kobklein-secondary border-t-transparent rounded-full animate-spin" />
            <div>
              <h3 className="text-lg font-semibold">Scanning for {userRole === 'client' ? 'Merchant' : 'Client'} Card</h3>
              <p className="text-muted-foreground">
                {userRole === 'client' 
                  ? 'Hold your phone near the merchant terminal' 
                  : 'Ask customer to tap their KobKlein card'}
              </p>
              <p className="text-sm text-kobklein-secondary mt-2">
                Amount: {formatCurrency(parseFloat(amount), 'HTG')}
              </p>
            </div>
            <Button variant="outline" onClick={resetNFC}>
              Cancel
            </Button>
          </div>
        )}

        {nfcState === 'detected' && paymentData && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-kobklein-secondary/10 rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-kobklein-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-kobklein-success">Card Detected!</h3>
              <div className="bg-accent/30 p-3 rounded-lg mt-3">
                <p className="font-medium">{paymentData.userName}</p>
                <p className="text-sm text-muted-foreground">Card ID: {paymentData.cardId}</p>
              </div>
              <p className="text-sm text-kobklein-secondary mt-2">
                Processing payment of {formatCurrency(parseFloat(amount), 'HTG')}
              </p>
            </div>
          </div>
        )}

        {nfcState === 'processing' && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto">
              <Loader2 className="w-16 h-16 text-kobklein-secondary animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Processing Payment</h3>
              <p className="text-muted-foreground">Please don't move your device...</p>
            </div>
          </div>
        )}

        {nfcState === 'success' && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-600">Payment Successful!</h3>
              <p className="text-muted-foreground">
                {formatCurrency(parseFloat(amount), 'HTG')} transferred successfully
              </p>
              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg mt-3">
                <p className="text-sm text-green-700 dark:text-green-300">
                  {userRole === 'client' 
                    ? `Payment sent to ${paymentData?.userName}` 
                    : `Payment received from ${paymentData?.userName}`}
                </p>
              </div>
            </div>
            <Button onClick={resetNFC} className="w-full">
              New Payment
            </Button>
          </div>
        )}

        {nfcState === 'error' && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-destructive">Payment Failed</h3>
              <p className="text-muted-foreground">
                {userRole === 'client' ? 'Insufficient balance' : 'Customer has insufficient balance'}
              </p>
              <div className="bg-destructive/10 p-3 rounded-lg mt-3">
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Please check balance and try again
                </p>
              </div>
            </div>
            <Button onClick={resetNFC} variant="outline" className="w-full">
              Try Again
            </Button>
          </div>
        )}
      </div>
    </KobKleinCard>
  );
}