// File: kobklein/web/src/components/payments/payment-confirmation-modal.tsx
import React from 'react';
import { X, ArrowRight, Clock, Shield, AlertTriangle } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: {
    amount: number;
    currency: 'HTG' | 'USD';
    recipient: {
      name: string;
      id: string;
      type: 'client' | 'merchant' | 'distributor';
    };
    sender: {
      name: string;
      id: string;
    };
    method: 'nfc' | 'qr' | 'card' | 'manual';
    fee: number;
    description?: string;
    estimatedTime: string;
  };
}

export function PaymentConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  transaction
}: PaymentConfirmationModalProps) {
  if (!isOpen) return null;

  const totalAmount = transaction.amount + transaction.fee;
  const netAmount = transaction.amount - transaction.fee;

  const getMethodBadge = () => {
    const methodColors = {
      nfc: 'bg-blue-100 text-blue-800',
      qr: 'bg-green-100 text-green-800',
      card: 'bg-purple-100 text-purple-800',
      manual: 'bg-gray-100 text-gray-800',
    };

    return (
      <Badge className={methodColors[transaction.method]}>
        {transaction.method.toUpperCase()}
      </Badge>
    );
  };

  const getRecipientIcon = () => {
    switch (transaction.recipient.type) {
      case 'merchant':
        return '🏪';
      case 'distributor':
        return '🏢';
      default:
        return '👤';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <KobKleinCard className="relative w-full max-w-md mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-accent rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-kobklein-primary">Confirm Payment</h2>
            <p className="text-muted-foreground mt-2">
              Please review the transaction details
            </p>
          </div>

          {/* Transaction Amount */}
          <div className="text-center bg-accent/30 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">You're sending</p>
            <p className="text-3xl font-bold text-kobklein-primary">
              {formatCurrency(transaction.amount, transaction.currency)}
            </p>
          </div>

          {/* Transaction Flow */}
          <div className="flex items-center justify-between bg-accent/20 p-4 rounded-lg">
            <div className="text-center flex-1">
              <div className="w-12 h-12 mx-auto bg-kobklein-secondary/10 rounded-full flex items-center justify-center mb-2">
                <span className="text-lg">👤</span>
              </div>
              <p className="font-medium text-sm">{transaction.sender.name}</p>
              <p className="text-xs text-muted-foreground">You</p>
            </div>
            
            <div className="flex items-center justify-center mx-4">
              <ArrowRight className="w-6 h-6 text-kobklein-secondary" />
            </div>
            
            <div className="text-center flex-1">
              <div className="w-12 h-12 mx-auto bg-kobklein-secondary/10 rounded-full flex items-center justify-center mb-2">
                <span className="text-lg">{getRecipientIcon()}</span>
              </div>
              <p className="font-medium text-sm">{transaction.recipient.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{transaction.recipient.type}</p>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Payment Method:</span>
              {getMethodBadge()}
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recipient ID:</span>
              <span className="font-mono text-sm">{transaction.recipient.id}</span>
            </div>
            
            {transaction.description && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Description:</span>
                <span className="text-sm max-w-32 text-right">{transaction.description}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Processing Time:</span>
              <span className="text-sm flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {transaction.estimatedTime}
              </span>
            </div>
          </div>

          {/* Fee Breakdown */}
          {transaction.fee > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Payment Amount:</span>
                <span>{formatCurrency(transaction.amount, transaction.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Processing Fee:</span>
                <span>{formatCurrency(transaction.fee, transaction.currency)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total:</span>
                <span>{formatCurrency(totalAmount, transaction.currency)}</span>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              This transaction is secured with end-to-end encryption
            </p>
          </div>

          {/* Warning for large amounts */}
          {transaction.amount > 10000 && (
            <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Large transaction amount. Please verify recipient details carefully.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onConfirm} className="flex-1">
              Confirm & Pay
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By confirming, you agree to KobKlein's terms of service
          </p>
        </div>
      </KobKleinCard>
    </div>
  );
}