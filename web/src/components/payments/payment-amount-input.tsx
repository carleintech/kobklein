// File: kobklein/web/src/components/payments/payment-amount-input.tsx

import React, { useState, useEffect } from 'react';
import { DollarSign, Calculator, Minus, Plus } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/kobklein-card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface PaymentAmountInputProps {
  currency: 'HTG' | 'USD';
  onAmountChange: (amount: number) => void;
  minAmount?: number;
  maxAmount?: number;
  suggestedAmounts?: number[];
  exchangeRate?: number; // HTG per USD
  showCalculator?: boolean;
  placeholder?: string;
}

export function PaymentAmountInput({
  currency,
  onAmountChange,
  minAmount = 1,
  maxAmount = 1000000,
  suggestedAmounts = [100, 500, 1000, 2000, 5000],
  exchangeRate = 150, // Default HTG per USD
  showCalculator = true,
  placeholder = "Enter amount",
}: PaymentAmountInputProps) {
  const [amount, setAmount] = useState<string>('');
  const [showKeypad, setShowKeypad] = useState(false);
  const [altCurrency, setAltCurrency] = useState<'HTG' | 'USD'>(currency === 'HTG' ? 'USD' : 'HTG');

  const numericAmount = parseFloat(amount) || 0;
  const convertedAmount = currency === 'HTG' 
    ? numericAmount / exchangeRate 
    : numericAmount * exchangeRate;

  useEffect(() => {
    onAmountChange(numericAmount);
  }, [numericAmount, onAmountChange]);

  const handleAmountInput = (value: string) => {
    // Allow only numbers and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleKeypadInput = (key: string) => {
    if (key === 'clear') {
      setAmount('');
    } else if (key === 'backspace') {
      setAmount(prev => prev.slice(0, -1));
    } else if (key === '.') {
      if (!amount.includes('.')) {
        setAmount(prev => prev + key);
      }
    } else {
      setAmount(prev => prev + key);
    }
  };

  const handleSuggestedAmount = (suggestedAmount: number) => {
    setAmount(suggestedAmount.toString());
  };

  const adjustAmount = (delta: number) => {
    const newAmount = Math.max(0, numericAmount + delta);
    setAmount(newAmount.toString());
  };

  const isValidAmount = numericAmount >= minAmount && numericAmount <= maxAmount;

  return (
    <KobKleinCard className="p-6">
      {/* Header */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        <DollarSign className="h-5 w-5 text-kobklein-accent" />
        <h3 className="text-lg font-semibold">Enter Payment Amount</h3>
      </div>

      {/* Amount Input */}
      <div className="text-center mb-6">
        <div className="relative">
          <input
            type="text"
            value={amount}
            onChange={(e) => handleAmountInput(e.target.value)}
            placeholder={placeholder}
            className="w-full text-center text-4xl font-bold border-none outline-none bg-transparent text-kobklein-primary"
            style={{ fontSize: amount.length > 8 ? '2rem' : '2.5rem' }}
          />
          <div className="text-center mt-2">
            <Badge variant="outline" className="text-sm">
              {currency}
            </Badge>
          </div>
        </div>

        {/* Converted Amount */}
        {numericAmount > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              ≈ {formatCurrency(convertedAmount, altCurrency)} {altCurrency}
            </p>
            <p className="text-xs text-muted-foreground">
              Exchange rate: 1 USD = {exchangeRate} HTG
            </p>
          </div>
        )}

        {/* Amount Validation */}
        {amount && !isValidAmount && (
          <div className="mt-2 text-sm text-red-600">
            Amount must be between {formatCurrency(minAmount, currency)} and {formatCurrency(maxAmount, currency)}
          </div>
        )}
      </div>

      {/* Quick Amount Adjustment */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <button
          onClick={() => adjustAmount(-100)}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Minus className="h-4 w-4" />
        </button>
        
        <span className="text-sm text-muted-foreground min-w-0 px-4">
          {formatCurrency(numericAmount, currency)}
        </span>
        
        <button
          onClick={() => adjustAmount(100)}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Suggested Amounts */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-3 text-center">Quick amounts</p>
        <div className="grid grid-cols-3 gap-2">
          {suggestedAmounts.map((suggestedAmount) => (
            <button
              key={suggestedAmount}
              onClick={() => handleSuggestedAmount(suggestedAmount)}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              {formatCurrency(suggestedAmount, currency)}
            </button>
          ))}
        </div>
      </div>

      {/* Calculator Keypad */}
      {showCalculator && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Calculator</p>
            <button
              onClick={() => setShowKeypad(!showKeypad)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Calculator className="h-4 w-4" />
            </button>
          </div>

          {showKeypad && (
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'clear'].map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeypadInput(key)}
                  className={`p-3 rounded-lg font-medium transition-colors ${
                    key === 'clear' 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {key === 'clear' ? 'Clear' : key}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Amount Summary */}
      {numericAmount > 0 && isValidAmount && (
        <div className="mt-6 p-4 bg-kobklein-primary/5 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Amount:</span>
            <span className="text-xl font-bold text-kobklein-accent">
              {formatCurrency(numericAmount, currency)}
            </span>
          </div>
        </div>
      )}
    </KobKleinCard>
  );
}