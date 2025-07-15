// File: kobklein/web/src/components/dashboards/merchant/pos-interface.tsx

"use client";

import { useState } from "react";
import { 
  CreditCard, 
  QrCode, 
  Smartphone, 
  Hash,
  CheckCircle,
  XCircle,
  Calculator
} from "lucide-react";

import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Button } from "@/components/ui/enhanced-button";
import { KobKleinInput } from "@/components/ui/form-field";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/lib/toast";

type PaymentMethod = 'nfc' | 'qr' | 'manual';
type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

export function POSInterface() {
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('nfc');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [customerInfo, setCustomerInfo] = useState<string>('');
  const [note, setNote] = useState<string>('');
  
  const { toast } = useToast();

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    setAmount(numericValue);
  };

  const quickAmounts = [50, 100, 250, 500, 1000, 2500];

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const processPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setPaymentStatus('processing');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        setPaymentStatus('success');
        toast.success(`Payment of ${formatCurrency(parseFloat(amount), 'HTG')} received successfully!`);
        
        // Reset form after success
        setTimeout(() => {
          setAmount('');
          setCustomerInfo('');
          setNote('');
          setPaymentStatus('idle');
        }, 3000);
      } else {
        setPaymentStatus('failed');
        toast.error('Payment failed. Please try again.');
        setTimeout(() => setPaymentStatus('idle'), 3000);
      }
    } catch (error) {
      setPaymentStatus('failed');
      toast.error('Payment processing error');
      setTimeout(() => setPaymentStatus('idle'), 3000);
    }
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'nfc':
        return <CreditCard className="h-5 w-5" />;
      case 'qr':
        return <QrCode className="h-5 w-5" />;
      case 'manual':
        return <Hash className="h-5 w-5" />;
    }
  };

  const getStatusDisplay = () => {
    switch (paymentStatus) {
      case 'processing':
        return (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kobklein-accent mx-auto mb-4"></div>
            <p className="text-lg font-medium">Processing Payment...</p>
            <p className="text-sm text-muted-foreground mt-2">
              {paymentMethod === 'nfc' && 'Waiting for card tap...'}
              {paymentMethod === 'qr' && 'Customer scanning QR code...'}
              {paymentMethod === 'manual' && 'Processing transaction...'}
            </p>
          </div>
        );
      
      case 'success':
        return (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-green-600">Payment Successful!</p>
            <p className="text-2xl font-bold mt-2">{formatCurrency(parseFloat(amount), 'HTG')}</p>
          </div>
        );
      
      case 'failed':
        return (
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-red-600">Payment Failed</p>
            <p className="text-sm text-muted-foreground mt-2">Please try again</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (paymentStatus !== 'idle') {
    return (
      <KobKleinCard className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">Payment Status</h3>
          {getStatusDisplay()}
          {paymentStatus === 'failed' && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setPaymentStatus('idle')}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </KobKleinCard>
    );
  }

  return (
    <KobKleinCard className="p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Accept Payment</h3>

        {/* Amount Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Amount (HTG)</label>
          <KobKleinInput
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            leftIcon={<Calculator className="h-4 w-4" />}
            className="text-2xl font-bold text-center"
          />
          
          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((quickAmount) => (
              <Button
                key={quickAmount}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount(quickAmount)}
                className="text-xs"
              >
                {formatCurrency(quickAmount, 'HTG')}
              </Button>
            ))}
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Payment Method</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { method: 'nfc' as const, label: 'NFC Tap' },
              { method: 'qr' as const, label: 'QR Code' },
              { method: 'manual' as const, label: 'Manual' },
            ].map(({ method, label }) => (
              <Button
                key={method}
                variant={paymentMethod === method ? "kobklein" : "outline"}
                onClick={() => setPaymentMethod(method)}
                className="flex flex-col items-center space-y-1 h-16"
              >
                {getPaymentMethodIcon(method)}
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Customer Info (Optional) */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Customer Info (Optional)</label>
          <KobKleinInput
            placeholder="Customer name or phone"
            value={customerInfo}
            onChange={(e) => setCustomerInfo(e.target.value)}
            leftIcon={<Smartphone className="h-4 w-4" />}
          />
        </div>

        {/* Note (Optional) */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Note (Optional)</label>
          <KobKleinInput
            placeholder="Transaction note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Process Payment Button */}
        <Button
          variant="kobklein"
          size="lg"
          className="w-full"
          onClick={processPayment}
          disabled={!amount || parseFloat(amount) <= 0}
        >
          {paymentMethod === 'nfc' && 'Ready for NFC Tap'}
          {paymentMethod === 'qr' && 'Generate QR Code'}
          {paymentMethod === 'manual' && 'Process Payment'}
        </Button>

        {/* Payment Instructions */}
        <div className="text-center text-sm text-muted-foreground">
          {paymentMethod === 'nfc' && (
            <p>Customer will tap their KobKlein card to complete payment</p>
          )}
          {paymentMethod === 'qr' && (
            <p>Customer will scan QR code with their KobKlein app</p>
          )}
          {paymentMethod === 'manual' && (
            <p>Enter customer details and process payment manually</p>
          )}
        </div>
      </div>
    </KobKleinCard>
  );
}