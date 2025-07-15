// File: kobklein/web/src/components/payments/payment-success-animation.tsx
import React, { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, Star } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface PaymentSuccessAnimationProps {
  amount: number;
  currency: 'HTG' | 'USD';
  fromUser: string;
  toUser: string;
  method: string;
  transactionId: string;
  onClose: () => void;
  onNewPayment?: () => void;
}

export function PaymentSuccessAnimation({
  amount,
  currency,
  fromUser,
  toUser,
  method,
  transactionId,
  onClose,
  onNewPayment
}: PaymentSuccessAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <KobKleinCard className="relative w-full max-w-md mx-4 p-6 text-center overflow-hidden">
        {/* Animated background elements */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-kobklein-secondary rounded-full animate-ping"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        )}
        
        <div className="relative z-10 space-y-6">
          {/* Success Icon with Animation */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          
          {/* Success Message */}
          <div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-3xl font-bold text-kobklein-primary">
              {formatCurrency(amount, currency)}
            </p>
          </div>
          
          {/* Transaction Flow */}
          <div className="bg-accent/30 p-4 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="text-center">
                <p className="font-medium">{fromUser}</p>
                <p className="text-muted-foreground">Sender</p>
              </div>
              
              <div className="flex-1 flex items-center justify-center mx-4">
                <div className="flex-1 h-px bg-kobklein-secondary"></div>
                <ArrowRight className="w-5 h-5 text-kobklein-secondary mx-2" />
                <div className="flex-1 h-px bg-kobklein-secondary"></div>
              </div>
              
              <div className="text-center">
                <p className="font-medium">{toUser}</p>
                <p className="text-muted-foreground">Recipient</p>
              </div>
            </div>
          </div>
          
          {/* Transaction Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Method:</span>
              <span className="font-medium capitalize">{method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID:</span>
              <span className="font-medium font-mono">{transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          
          {/* Rating Request */}
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-3">How was your experience?</p>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="sm"
                  className="p-1 hover:bg-transparent"
                >
                  <Star className="w-6 h-6 text-yellow-400 hover:text-yellow-500 transition-colors" />
                </Button>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            {onNewPayment && (
              <Button variant="outline" onClick={onNewPayment} className="flex-1">
                New Payment
              </Button>
            )}
            <Button onClick={onClose} className="flex-1">
              Done
            </Button>
          </div>
        </div>
      </KobKleinCard>
    </div>
  );
}