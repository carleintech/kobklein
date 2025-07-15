// File: kobklein/web/src/components/wallet/exchange-modal.tsx
import React, { useState, useEffect } from 'react';
import { X, ArrowUpDown, DollarSign, TrendingUp } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatCurrency } from '@/lib/utils';

interface ExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalanceHTG: number;
  currentBalanceUSD: number;
}

type ExchangeDirection = 'HTG_TO_USD' | 'USD_TO_HTG';

export function ExchangeModal({ isOpen, onClose, currentBalanceHTG, currentBalanceUSD }: ExchangeModalProps) {
  const [amount, setAmount] = useState('');
  const [direction, setDirection] = useState<ExchangeDirection>('HTG_TO_USD');
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(125.50); // HTG per USD

  if (!isOpen) return null;

  const fromCurrency = direction === 'HTG_TO_USD' ? 'HTG' : 'USD';
  const toCurrency = direction === 'HTG_TO_USD' ? 'USD' : 'HTG';
  const currentBalance = direction === 'HTG_TO_USD' ? currentBalanceHTG : currentBalanceUSD;
  
  const calculateExchange = () => {
    const inputAmount = parseFloat(amount);
    if (!inputAmount) return 0;
    
    if (direction === 'HTG_TO_USD') {
      return inputAmount / exchangeRate;
    } else {
      return inputAmount * exchangeRate;
    }
  };

  const exchangeFee = parseFloat(amount) * 0.015; // 1.5% fee
  const outputAmount = calculateExchange();
  const finalAmount = outputAmount - (direction === 'HTG_TO_USD' ? exchangeFee / exchangeRate : exchangeFee);

  const handleExchange = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    onClose();
  };

  const switchDirection = () => {
    setDirection(direction === 'HTG_TO_USD' ? 'USD_TO_HTG' : 'HTG_TO_USD');
    setAmount('');
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
            <h2 className="text-2xl font-bold text-kobklein-primary">Currency Exchange</h2>
            <p className="text-muted-foreground mt-2">
              Current Rate: 1 USD = {exchangeRate} HTG
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between bg-accent/30 p-4 rounded-lg">
              <div className="text-center flex-1">
                <p className="text-sm text-muted-foreground">From</p>
                <p className="font-bold text-lg">{fromCurrency}</p>
                <p className="text-xs text-muted-foreground">
                  Balance: {formatCurrency(currentBalance, fromCurrency)}
                </p>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={switchDirection}
                className="mx-4 rounded-full"
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
              
              <div className="text-center flex-1">
                <p className="text-sm text-muted-foreground">To</p>
                <p className="font-bold text-lg">{toCurrency}</p>
                <p className="text-xs text-kobklein-secondary">
                  Rate: {direction === 'HTG_TO_USD' ? `÷${exchangeRate}` : `×${exchangeRate}`}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exchange-amount">Amount to Exchange</Label>
              <Input
                id="exchange-amount"
                type="number"
                placeholder={`Enter ${fromCurrency} amount...`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg"
                max={currentBalance}
              />
              {parseFloat(amount) > currentBalance && (
                <p className="text-sm text-destructive">Insufficient balance</p>
              )}
            </div>

            {amount && parseFloat(amount) > 0 && (
              <div className="bg-accent/30 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">You send:</span>
                  <span className="font-medium">{formatCurrency(parseFloat(amount), fromCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exchange fee (1.5%):</span>
                  <span className="font-medium">{formatCurrency(exchangeFee, fromCurrency)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-medium">You receive:</span>
                  <span className="font-bold text-kobklein-success">
                    {formatCurrency(finalAmount, toCurrency)}
                  </span>
                </div>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Live exchange rate updated every 5 minutes
              </p>
            </div>

            <Button 
              onClick={handleExchange}
              disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > currentBalance || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                `Exchange ${fromCurrency} to ${toCurrency}`
              )}
            </Button>
          </div>
        </div>
      </KobKleinCard>
    </div>
  );
}