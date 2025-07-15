// File: kobklein/web/src/components/wallet/withdrawal-modal.tsx

import React, { useState } from 'react';
import { X, MapPin, Building, Smartphone, AlertTriangle, CheckCircle2, Loader2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'client' | 'merchant' | 'distributor';
  currentBalance: number;
  currency: 'HTG' | 'USD';
  onWithdrawalComplete: (amount: number, method: string) => void;
}

type WithdrawalMethod = 'distributor' | 'bank_transfer' | 'mobile_money';

interface NearbyDistributor {
  id: string;
  name: string;
  location: string;
  distance: number; // in km
  rating: number;
  availability: 'online' | 'busy' | 'offline';
  cashLimit: number;
}

export function WithdrawalModal({
  isOpen,
  onClose,
  userRole,
  currentBalance,
  currency,
  onWithdrawalComplete,
}: WithdrawalModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<WithdrawalMethod | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [selectedDistributor, setSelectedDistributor] = useState<NearbyDistributor | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const mockDistributors: NearbyDistributor[] = [
    {
      id: 'DIST_001',
      name: 'Pierre Distributeur',
      location: 'Port-au-Prince Central',
      distance: 0.5,
      rating: 4.9,
      availability: 'online',
      cashLimit: 50000,
    },
    {
      id: 'DIST_002',
      name: 'Marie Agent',
      location: 'Pétion-Ville',
      distance: 1.2,
      rating: 4.7,
      availability: 'online',
      cashLimit: 30000,
    },
    {
      id: 'DIST_003',
      name: 'Jean Services',
      location: 'Delmas',
      distance: 2.1,
      rating: 4.4,
      availability: 'busy',
      cashLimit: 25000,
    },
  ];

  const getAvailableMethods = () => {
    const methods = [
      {
        method: 'distributor' as WithdrawalMethod,
        label: 'Local Distributor',
        icon: <MapPin className="h-5 w-5" />,
        description: 'Visit a nearby KobKlein distributor for cash',
        available: true,
        processingTime: 'Instant',
      },
      {
        method: 'bank_transfer' as WithdrawalMethod,
        label: 'Bank Transfer',
        icon: <Building className="h-5 w-5" />,
        description: 'Transfer to your bank account',
        available: userRole === 'merchant' || userRole === 'distributor',
        processingTime: '1-3 business days',
      },
      {
        method: 'mobile_money' as WithdrawalMethod,
        label: 'Mobile Money',
        icon: <Smartphone className="h-5 w-5" />,
        description: 'Send to MonCash or other mobile wallets',
        available: true,
        processingTime: '5-15 minutes',
      },
    ];

    return methods.filter(method => method.available);
  };

  const suggestedAmounts = [500, 1000, 2500, 5000];
  const maxWithdrawal = Math.min(currentBalance, userRole === 'client' ? 10000 : 50000);

  const handleMethodSelect = (method: WithdrawalMethod) => {
    setSelectedMethod(method);
    setCurrentStep(2);
    setError('');
  };

  const validateAmount = (): boolean => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    
    if (numAmount > currentBalance) {
      setError('Insufficient balance');
      return false;
    }
    
    const minWithdrawal = 100; // 100 HTG minimum
    if (numAmount < minWithdrawal) {
      setError(`Minimum withdrawal amount is ${formatCurrency(minWithdrawal, currency)}`);
      return false;
    }
    
    if (numAmount > maxWithdrawal) {
      setError(`Maximum withdrawal amount is ${formatCurrency(maxWithdrawal, currency)}`);
      return false;
    }
    
    return true;
  };

  const handleAmountContinue = () => {
    if (!validateAmount()) return;
    
    if (selectedMethod === 'distributor') {
      setCurrentStep(3); // Distributor selection
    } else {
      setCurrentStep(4); // Confirmation
    }
  };

  const handleDistributorSelect = (distributor: NearbyDistributor) => {
    const numAmount = parseFloat(amount);
    if (numAmount > distributor.cashLimit) {
      setError(`${distributor.name} has a cash limit of ${formatCurrency(distributor.cashLimit, currency)}`);
      return;
    }
    
    setSelectedDistributor(distributor);
    setCurrentStep(4);
    setError('');
  };

  const handleProcessWithdrawal = async () => {
    if (!validateAmount() || !selectedMethod) return;

    setIsProcessing(true);
    setCurrentStep(5);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate success (95% success rate)
    if (Math.random() > 0.05) {
      const numAmount = parseFloat(amount);
      onWithdrawalComplete(numAmount, selectedMethod);
      setCurrentStep(6); // Success
    } else {
      setError('Withdrawal failed. Please try again.');
      setCurrentStep(4); // Back to confirmation
    }

    setIsProcessing(false);
  };

  const resetModal = () => {
    setSelectedMethod(null);
    setAmount('');
    setSelectedDistributor(null);
    setCurrentStep(1);
    setIsProcessing(false);
    setError('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const renderMethodSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">Choose Withdrawal Method</h3>
      <p className="text-sm text-muted-foreground text-center">
        Available balance: {formatCurrency(currentBalance, currency)}
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
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{method.label}</h4>
                  <Badge variant="outline" className="text-xs">
                    {method.processingTime}
                  </Badge>
                </div>
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
        ← Back to withdrawal methods
      </button>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold">Enter Withdrawal Amount</h3>
        <p className="text-sm text-muted-foreground">
          Available: {formatCurrency(currentBalance, currency)} • 
          Max: {formatCurrency(maxWithdrawal, currency)}
        </p>
      </div>

      {/* Amount Input */}
      <div className="text-center">
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

      {/* Suggested Amounts */}
      <div>
        <p className="text-sm text-muted-foreground mb-3 text-center">Quick amounts</p>
        <div className="grid grid-cols-2 gap-3">
          {suggestedAmounts.filter(amt => amt <= maxWithdrawal).map((suggestedAmount) => (
            <button
              key={suggestedAmount}
              onClick={() => setAmount(suggestedAmount.toString())}
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
        onClick={handleAmountContinue}
        disabled={!amount || parseFloat(amount) <= 0}
        className="w-full bg-kobklein-accent text-white py-3 px-6 rounded-lg hover:bg-kobklein-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
      >
        Continue
      </button>
    </div>
  );

  const renderDistributorSelection = () => (
    <div className="space-y-6">
      <button
        onClick={() => setCurrentStep(2)}
        className="text-sm text-kobklein-accent hover:underline"
      >
        ← Back to amount
      </button>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold">Choose Distributor</h3>
        <p className="text-sm text-muted-foreground">
          Select a nearby distributor to collect {formatCurrency(parseFloat(amount), currency)}
        </p>
      </div>

      <div className="space-y-3">
        {mockDistributors.map((distributor) => (
          <button
            key={distributor.id}
            onClick={() => handleDistributorSelect(distributor)}
            disabled={distributor.availability === 'offline' || parseFloat(amount) > distributor.cashLimit}
            className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold">{distributor.name}</h4>
                  <Badge 
                    variant="outline"
                    className={
                      distributor.availability === 'online' ? 'text-green-600 border-green-200' :
                      distributor.availability === 'busy' ? 'text-yellow-600 border-yellow-200' :
                      'text-gray-600 border-gray-200'
                    }
                  >
                    {distributor.availability}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{distributor.location}</p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                  <span>📍 {distributor.distance}km away</span>
                  <span>⭐ {distributor.rating}</span>
                  <span>💰 Max: {formatCurrency(distributor.cashLimit, currency)}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-6">
      <button
        onClick={() => setCurrentStep(selectedMethod === 'distributor' ? 3 : 2)}
        className="text-sm text-kobklein-accent hover:underline"
      >
        ← Back
      </button>

      <div className="text-center">
        <h3 className="text-lg font-semibold">Confirm Withdrawal</h3>
        <p className="text-sm text-muted-foreground">
          Please review your withdrawal details
        </p>
      </div>

      {/* Withdrawal Summary */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Withdrawal Amount:</span>
          <span className="font-semibold">{formatCurrency(parseFloat(amount), currency)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Method:</span>
          <span className="font-semibold">
            {getAvailableMethods().find(m => m.method === selectedMethod)?.label}
          </span>
        </div>
        
        {selectedDistributor && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Distributor:</span>
            <span className="font-semibold">{selectedDistributor.name}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Processing Fee:</span>
          <span className="font-semibold">Free</span>
        </div>
        
        <hr className="border-gray-200" />
        
        <div className="flex justify-between text-lg">
          <span className="font-semibold">You'll Receive:</span>
          <span className="font-bold text-kobklein-accent">
            {formatCurrency(parseFloat(amount), currency)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Remaining Balance:</span>
          <span className="font-semibold">
            {formatCurrency(currentBalance - parseFloat(amount), currency)}
          </span>
        </div>
      </div>

      {/* Method-specific instructions */}
      {selectedMethod === 'distributor' && selectedDistributor && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-700 mb-2">Pickup Instructions</h4>
          <ul className="text-sm text-blue-600 space-y-1">
            <li>• Visit {selectedDistributor.name} at {selectedDistributor.location}</li>
            <li>• Show your withdrawal confirmation code</li>
            <li>• Bring valid ID for verification</li>
            <li>• Cash will be available for pickup immediately</li>
          </ul>
        </div>
      )}

      {/* Confirm Button */}
      <button
        onClick={handleProcessWithdrawal}
        disabled={isProcessing}
        className="w-full bg-kobklein-accent text-white py-3 px-6 rounded-lg hover:bg-kobklein-accent/90 transition-colors disabled:opacity-50 font-semibold"
      >
        Confirm Withdrawal
      </button>
    </div>
  );

  const renderProcessing = () => (
    <div className="space-y-6 text-center">
      <div>
        <Loader2 className="h-12 w-12 text-kobklein-accent mx-auto mb-4 animate-spin" />
        <h3 className="text-lg font-semibold">Processing Withdrawal</h3>
        <p className="text-sm text-muted-foreground">
          Please wait while we process your withdrawal request
        </p>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="space-y-6 text-center">
      <div>
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-700">Withdrawal Successful!</h3>
        <p className="text-muted-foreground">
          Your withdrawal request for {formatCurrency(parseFloat(amount), currency)} has been processed
        </p>
      </div>

      {selectedDistributor && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="font-semibold text-green-700 mb-3">Pickup Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Confirmation Code:</span>
              <span className="font-mono font-bold">WD{Date.now().toString().slice(-6)}</span>
            </div>
            <div className="flex justify-between">
              <span>Distributor:</span>
              <span className="font-semibold">{selectedDistributor.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <span>{selectedDistributor.location}</span>
            </div>
            <div className="flex justify-between">
              <span>Distance:</span>
              <span>{selectedDistributor.distance}km away</span>
            </div>
          </div>
        </div>
      )}

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
          <h2 className="text-xl font-semibold">Withdraw Funds</h2>
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
          {currentStep === 3 && renderDistributorSelection()}
          {currentStep === 4 && renderConfirmation()}
          {currentStep === 5 && renderProcessing()}
          {currentStep === 6 && renderSuccess()}
        </div>
      </div>
    </div>
  );
}