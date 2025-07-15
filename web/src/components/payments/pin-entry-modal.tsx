// File: kobklein/web/src/components/payments/pin-entry-modal.tsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Lock, Eye, EyeOff, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface PINEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  currency: 'HTG' | 'USD';
  recipient: string;
  transactionType: 'send' | 'receive' | 'refill' | 'withdraw';
}

export function PINEntryModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  currency,
  recipient,
  transactionType
}: PINEntryModalProps) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '']);
      setError('');
      setAttempts(0);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (newPin.every(digit => digit !== '') && newPin.join('').length === 4) {
      setTimeout(() => verifyPin(newPin.join('')), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyPin = async (pinValue: string) => {
    setIsVerifying(true);
    
    // Simulate PIN verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, any pin except '0000' works
    if (pinValue === '0000') {
      setAttempts(prev => prev + 1);
      setError('Incorrect PIN. Please try again.');
      setPin(['', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
      
      if (attempts >= 2) {
        setError('Too many attempts. Please try again later.');
        setTimeout(onClose, 2000);
      }
    } else {
      onSuccess();
    }
    
    setIsVerifying(false);
  };

  const clearPin = () => {
    setPin(['', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
  };

  const getTransactionDescription = () => {
    switch (transactionType) {
      case 'send':
        return `Send ${formatCurrency(amount, currency)} to ${recipient}`;
      case 'receive':
        return `Receive ${formatCurrency(amount, currency)} from ${recipient}`;
      case 'refill':
        return `Refill wallet with ${formatCurrency(amount, currency)}`;
      case 'withdraw':
        return `Withdraw ${formatCurrency(amount, currency)}`;
      default:
        return `Process ${formatCurrency(amount, currency)}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <KobKleinCard className="relative w-full max-w-sm mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-accent rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-kobklein-secondary/10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-kobklein-secondary" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-kobklein-primary">Enter PIN</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {getTransactionDescription()}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center gap-3">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type={showPin ? 'text' : 'password'}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-bold border-2 rounded-lg focus:border-kobklein-secondary outline-none transition-colors"
                  maxLength={1}
                  disabled={isVerifying}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPin(!showPin)}
              className="text-xs"
            >
              {showPin ? (
                <>
                  <EyeOff className="w-3 h-3 mr-1" />
                  Hide PIN
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3 mr-1" />
                  Show PIN
                </>
              )}
            </Button>

            {error && (
              <div className="bg-destructive/10 p-3 rounded-lg">
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </p>
                {attempts < 3 && attempts > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {3 - attempts} attempts remaining
                  </p>
                )}
              </div>
            )}

            {isVerifying && (
              <div className="flex items-center justify-center gap-2 text-kobklein-secondary">
                <div className="w-4 h-4 border-2 border-kobklein-secondary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Verifying PIN...</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={clearPin} disabled={isVerifying} className="flex-1">
              Clear
            </Button>
            <Button variant="outline" onClick={onClose} disabled={isVerifying} className="flex-1">
              Cancel
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            For demo: Use any PIN except 0000
          </p>
        </div>
      </KobKleinCard>
    </div>
  );
}