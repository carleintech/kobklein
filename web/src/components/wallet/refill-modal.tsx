// File: kobklein/web/src/components/wallet/refill-modal.tsx

import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building, Globe, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/kobklein-card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface RefillModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'client' | 'merchant' | 'distributor' | 'diaspora';
  currentBalance: number;
  currency: 'HTG' | 'USD';
  onRefillComplete: (amount: number, method: string) => void;
}

type RefillMethod = 'card' | 'bank' | 'apple_pay' | 'google_pay' | 'distributor' | 'crypto';

interface RefillStep {
  id: number;
  title: string;
  description: string;
}

export function RefillModal({
  isOpen,
  onClose,
  userRole,
  currentBalance,
  currency,
  onRefillComplete,
}: RefillModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<RefillMethod | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const getAvailableMethods = (): { method: RefillMethod; label: string; icon: React.ReactNode; description: string; available: boolean }[] => {
    const baseMethods = [
      {
        method: 'card' as RefillMethod,
        label: 'Credit/Debit Card',
        icon: <CreditCard className="h-5 w-5" />,
        description: 'Visa, Mastercard, American Express',
        available: true,
      },
      {
        method: 'bank' as RefillMethod,
        label: 'Bank Transfer',
        icon: <Building className="h-5 w-5" />,
        description: 'Direct from your bank account',
        available: userRole === 'diaspora',
      },
      {
        method: 'apple_pay' as RefillMethod,
        label: 'Apple Pay',
        icon: <Smartphone className="h-5 w-5" />,
        description: 'Quick and secure payment',
        available: userRole === 'diaspora',
      },
      {
        method: 'google_pay' as RefillMethod,
        label: 'Google Pay',
        icon: <Smartphone className="h-5 w-5" />,
        description: 'Pay with Google Pay',
        available: userRole === 'diaspora',
      },
      {
        method: 'distributor' as RefillMethod,
        label: 'Distributor Agent',
        icon: <Globe className="h-5 w-5" />,
        description: 'Visit a local KobKlein distributor',
        available: userRole === 'client' || userRole === 'merchant',
      },
    ];

    return baseMethods.filter(method => method.available);
  };

  const getProcessingSteps = (): RefillStep[] => {
    const commonSteps = [
      { id: 1, title: 'Initiating Payment', description: 'Setting up your refill request...' },
      { id: 2, title: 'Processing Payment', description: 'Securely processing your payment...' },
      { id: 3, title: 'Updating Balance', description: 'Adding funds to your wallet...' },
      { id: 4, title: 'Complete', description: 'Refill completed successfully!' },
    ];

    if (selectedMethod === 'distributor') {
      return [
        { id: 1, title: 'Creating Request', description: 'Generating refill request...' },
        { id: 2, title: 'Finding Distributors', description: 'Locating nearby distributors...' },
        { id: 3, title: 'Request Sent', description: 'Notifying distributors in your area...' },
        { id: 4, title: 'Awaiting Completion', description: 'Wait for distributor to complete refill' },
      ];
    }

    return commonSteps;
  };

  const suggestedAmounts = userRole === 'diaspora' 
    ? [50, 100, 200, 500] // USD amounts for diaspora
    : [1000, 2500, 5000, 10000]; // HTG amounts for local users

  const handleMethodSelect = (method: RefillMethod) => {
    setSelectedMethod(method);
    setCurrentStep(2);
    setError('');
  };

  const handleAmountSelect = (suggestedAmount: number) => {
    setAmount(suggestedAmount.toString());
  };

  const validateAmount = (): boolean => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    
    const minAmount = userRole === 'diaspora' ? 10 : 100; // $10 USD or 100 HTG
    const maxAmount = userRole === 'diaspora' ? 2000 : 100000; // $2000 USD or 100K HTG
    
    if (numAmount < minAmount) {
      setError(`Minimum refill amount is ${formatCurrency(minAmount, currency)}`);
      return false;
    }
    
    if (numAmount > maxAmount) {
      setError(`Maximum refill amount is ${formatCurrency(maxAmount, currency)}`);
      return false;
    }
    
    return true;
  };

  const handleProceedToPayment = () => {
    if (!validateAmount()) return;
    setCurrentStep(3);
  };

  const handleProcessRefill = async () => {
    if (!validateAmount() || !selectedMethod) return;

    setIsProcessing(true);
    setProcessingStep(0);
    const steps = getProcessingSteps();

    // Simulate processing steps
    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Simulate success/failure (95% success rate)
    if (Math.random() > 0.05) {
      const numAmount = parseFloat(amount);
      onRefillComplete(numAmount, selectedMethod);
      setCurrentStep(4); // Success step
    } else {
      setError('Payment failed. Please try again.');
      setCurrentStep(2); // Go back to amount selection
    }

    setIsProcessing(false);
  };

  const resetModal = () => {
    setSelectedMethod(null);
    setAmount('');
    setCurrentStep(1);
    setIsProcessing(false);
    setProcessingStep(0);
    setError('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const renderMethodSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">Choose Refill Method</h3>
      <p className="text-sm text-muted-foreground text-center">
        Select how you'd like to add funds to your KobKlein wallet
      </p>
      
      <div className="space-y-3">
        {getAvailableMethods().map((method) => (
          <button
            key={method.method}
            onClick={() => handleMethodSelect(method.method)}
            className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                {method.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{method.label}</h4>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderAmountSelection = () => (
    <div className="space-y-6">
      <button
        onClick={() => setCurrentStep(1)}
        className="text-sm text-kobklein-accent hover:underline"
      >
        ← Back to payment methods
      </button>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold">Enter Refill Amount</h3>
        <p className="text-sm text-muted-foreground">
          Current balance: {formatCurrency(currentBalance, currency)}
        </p>
      </div>

      {/* Amount Input */}
      <div className="text-center">
        <div className="relative">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder="0.00"
            className="w-full text-center text-3xl font-bold border-none outline-none bg-transparent text-kobklein-primary"
          />
          <div className="text-center mt-2">
            <Badge variant="outline" className="text-sm">
              {currency}
            </Badge>
          </div>
        </div>
      </div>

      {/* Suggested Amounts */}
      <div>
        <p className="text-sm text-muted-foreground mb-3 text-center">Quick amounts</p>
        <div className="grid grid-cols-2 gap-3">
          {suggestedAmounts.map((suggestedAmount) => (
            <button
              key={suggestedAmount}
              onClick={() => handleAmountSelect(suggestedAmount)}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              {formatCurrency(suggestedAmount, currency)}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={handleProceedToPayment}
        disabled={!amount || parseFloat(amount) <= 0}
        className="w-full bg-kobklein-accent text-white py-3 px-6 rounded-lg hover:bg-kobklein-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
      >
        Continue to Payment
      </button>
    </div>
  );

  const renderPaymentConfirmation = () => (
    <div className="space-y-6">
      <button
        onClick={() => setCurrentStep(2)}
        className="text-sm text-kobklein-accent hover:underline"
      >
        ← Back to amount
      </button>

      <div className="text-center">
        <h3 className="text-lg font-semibold">Confirm Your Refill</h3>
        <p className="text-sm text-muted-foreground">
          Please review your refill details
        </p>
      </div>

      {/* Refill Summary */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Refill Amount:</span>
          <span className="font-semibold">{formatCurrency(parseFloat(amount), currency)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Payment Method:</span>
          <span className="font-semibold">
            {getAvailableMethods().find(m => m.method === selectedMethod)?.label}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Processing Fee:</span>
          <span className="font-semibold">Free</span>
        </div>
        
        <hr className="border-gray-200" />
        
        <div className="flex justify-between text-lg">
          <span className="font-semibold">Total:</span>
          <span className="font-bold text-kobklein-accent">
            {formatCurrency(parseFloat(amount), currency)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">New Balance:</span>
          <span className="font-semibold">
            {formatCurrency(currentBalance + parseFloat(amount), currency)}
          </span>
        </div>
      </div>

      {/* Payment Instructions */}
      {selectedMethod === 'distributor' ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-700 mb-2">Distributor Refill Instructions</h4>
          <ul className="text-sm text-blue-600 space-y-1">
            <li>• A refill request will be sent to nearby distributors</li>
            <li>• You'll receive SMS notification when a distributor accepts</li>
            <li>• Visit the distributor with cash to complete the refill</li>
            <li>• Your wallet will be updated immediately after payment</li>
          </ul>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-700 mb-2">Secure Payment Processing</h4>
          <ul className="text-sm text-green-600 space-y-1">
            <li>• Your payment information is encrypted and secure</li>
            <li>• Funds will be available immediately after processing</li>
            <li>• You'll receive a confirmation email and SMS</li>
            <li>• 24/7 customer support available if you need help</li>
          </ul>
        </div>
      )}

      {/* Confirm Button */}
      <button
        onClick={handleProcessRefill}
        disabled={isProcessing}
        className="w-full bg-kobklein-accent text-white py-3 px-6 rounded-lg hover:bg-kobklein-accent/90 transition-colors disabled:opacity-50 font-semibold"
      >
        {selectedMethod === 'distributor' ? 'Send Refill Request' : 'Complete Payment'}
      </button>
    </div>
  );

  const renderProcessing = () => {
    const steps = getProcessingSteps();
    const currentProcessingStep = steps[processingStep];

    return (
      <div className="space-y-6 text-center">
        <div>
          <Loader2 className="h-12 w-12 text-kobklein-accent mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold">{currentProcessingStep?.title}</h3>
          <p className="text-sm text-muted-foreground">{currentProcessingStep?.description}</p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                index < processingStep ? 'bg-green-50 border border-green-200' :
                index === processingStep ? 'bg-blue-50 border border-blue-200' :
                'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                index < processingStep ? 'bg-green-500 text-white' :
                index === processingStep ? 'bg-blue-500 text-white' :
                'bg-gray-300 text-gray-600'
              }`}>
                {index < processingStep ? '✓' : step.id}
              </div>
              <span className={`text-sm ${
                index <= processingStep ? 'font-medium' : 'text-muted-foreground'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="space-y-6 text-center">
      <div>
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-700">Refill Successful!</h3>
        <p className="text-muted-foreground">
          {formatCurrency(parseFloat(amount), currency)} has been added to your wallet
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex justify-between mb-2">
          <span className="text-green-700">Previous Balance:</span>
          <span className="font-semibold">{formatCurrency(currentBalance, currency)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-green-700">Amount Added:</span>
          <span className="font-semibold">+{formatCurrency(parseFloat(amount), currency)}</span>
        </div>
        <hr className="border-green-200 my-3" />
        <div className="flex justify-between text-lg">
          <span className="font-semibold text-green-700">New Balance:</span>
          <span className="font-bold text-green-600">
            {formatCurrency(currentBalance + parseFloat(amount), currency)}
          </span>
        </div>
      </div>

      <button
        onClick={handleClose}
        className="w-full bg-kobklein-accent text-white py-3 px-6 rounded-lg hover:bg-kobklein-accent/90 transition-colors font-semibold"
      >
        Done
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Refill Wallet</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 1 && renderMethodSelection()}
          {currentStep === 2 && renderAmountSelection()}
          {currentStep === 3 && !isProcessing && renderPaymentConfirmation()}
          {currentStep === 3 && isProcessing && renderProcessing()}
          {currentStep === 4 && renderSuccess()}
        </div>
      </div>
    </div>
  );
}