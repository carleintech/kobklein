// File: kobklein/web/src/components/dashboards/diaspora/send-money-interface.tsx

"use client";

import { useState } from "react";
import { 
  Send, 
  User, 
  CreditCard,
  Plus,
  Heart,
  Smartphone,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle
} from "lucide-react";

import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Button } from "@/components/ui/enhanced-button";
import { KobKleinInput, FormField } from "@/components/ui/form-field";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/lib/toast";

interface Recipient {
  id: string;
  name: string;
  phone: string;
  walletId: string;
  relation: string;
  avatar?: string;
  location: string;
  lastReceived?: {
    amount: number;
    date: string;
  };
}

interface SendMoneyInterfaceProps {
  recentRecipients: Recipient[];
}

type SendStep = 'recipient' | 'amount' | 'payment' | 'confirmation';

export function SendMoneyInterface({ recentRecipients }: SendMoneyInterfaceProps) {
  const [currentStep, setCurrentStep] = useState<SendStep>('recipient');
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { toast } = useToast();

  const quickAmounts = [25, 50, 100, 200, 500];
  const exchangeRate = 123.45; // HTG per USD

  const handleRecipientSelect = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
    setCurrentStep('amount');
  };

  const handleAmountConfirm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setCurrentStep('payment');
  };

  const handleSendMoney = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success(`Successfully sent ${formatCurrency(parseFloat(amount), 'USD')} to ${selectedRecipient?.name}!`);
      setCurrentStep('confirmation');
      
      // Reset form after success
      setTimeout(() => {
        setCurrentStep('recipient');
        setSelectedRecipient(null);
        setAmount('');
        setNote('');
      }, 4000);
      
    } catch (error) {
      toast.error('Transfer failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'recipient':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Recipient</h3>
            
            {/* Recent Recipients */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Recent Recipients</p>
              {recentRecipients.map((recipient) => (
                <div
                  key={recipient.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleRecipientSelect(recipient)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-kobklein-accent rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{recipient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {recipient.relation} • {recipient.location}
                      </p>
                      {recipient.lastReceived && (
                        <p className="text-xs text-muted-foreground">
                          Last: {formatCurrency(recipient.lastReceived.amount, 'USD')} • {recipient.lastReceived.date}
                        </p>
                      )}
                    </div>
                  </div>
                  <Send className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>

            {/* Add New Recipient */}
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New Recipient
            </Button>
          </div>
        );

      case 'amount':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Send Amount</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep('recipient')}
              >
                Change Recipient
              </Button>
            </div>

            {/* Selected Recipient */}
            {selectedRecipient && (
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-kobklein-accent rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">{selectedRecipient.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedRecipient.location}</p>
                </div>
              </div>
            )}

            {/* Amount Input */}
            <FormField label="Amount (USD)">
              <KobKleinInput
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                leftIcon={<DollarSign className="h-4 w-4" />}
                className="text-2xl font-bold text-center"
              />
            </FormField>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-5 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="text-xs"
                >
                  ${quickAmount}
                </Button>
              ))}
            </div>

            {/* Exchange Rate Display */}
            {amount && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>You send:</span>
                  <span className="font-medium">{formatCurrency(parseFloat(amount), 'USD')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Recipient gets:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(parseFloat(amount) * exchangeRate, 'HTG')}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Exchange rate:</span>
                  <span>1 USD = {exchangeRate} HTG</span>
                </div>
              </div>
            )}

            {/* Note */}
            <FormField label="Message (Optional)">
              <KobKleinInput
                placeholder="Add a message for your recipient..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </FormField>

            <Button
              variant="kobklein"
              className="w-full"
              onClick={handleAmountConfirm}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              Continue
            </Button>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Method</h3>

            {/* Transfer Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Transfer Summary</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>To:</span>
                  <span>{selectedRecipient?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>{formatCurrency(parseFloat(amount), 'USD')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fee:</span>
                  <span>$2.00</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-1">
                  <span>Total:</span>
                  <span>{formatCurrency(parseFloat(amount) + 2, 'USD')}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Select Payment Method</p>
              
              {[
                { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, details: '•••• 1234' },
                { id: 'apple', label: 'Apple Pay', icon: Smartphone, details: 'Touch ID' },
                { id: 'google', label: 'Google Pay', icon: Smartphone, details: 'Fingerprint' },
              ].map((method) => {
                const Icon = method.icon;
                return (
                  <div
                    key={method.id}
                    className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === method.id 
                        ? 'border-kobklein-accent bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="flex-1">
                      <p className="font-medium">{method.label}</p>
                      <p className="text-sm text-muted-foreground">{method.details}</p>
                    </div>
                    {paymentMethod === method.id && (
                      <CheckCircle className="h-5 w-5 text-kobklein-accent" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCurrentStep('amount')}
              >
                Back
              </Button>
              <Button
                variant="kobklein"
                className="flex-1"
                onClick={handleSendMoney}
                loading={isProcessing}
                loadingText="Processing..."
              >
                Send Money
              </Button>
            </div>
          </div>
        );

      case 'confirmation':
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-xl font-bold text-green-600">Transfer Successful!</h3>
              <p className="text-muted-foreground mt-2">
                {formatCurrency(parseFloat(amount), 'USD')} has been sent to {selectedRecipient?.name}
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                Your recipient will receive {formatCurrency(parseFloat(amount) * exchangeRate, 'HTG')} 
                in their KobKlein wallet within minutes.
              </p>
            </div>

            <Button
              variant="kobklein"
              className="w-full"
              onClick={() => {
                setCurrentStep('recipient');
                setSelectedRecipient(null);
                setAmount('');
                setNote('');
              }}
            >
              Send Another Transfer
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <KobKleinCard className="p-6">
      <div className="space-y-6">
        {/* Progress Indicator */}
        {currentStep !== 'confirmation' && (
          <div className="flex items-center space-x-2">
            {['recipient', 'amount', 'payment'].map((step, index) => (
              <div key={step} className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step 
                    ? 'bg-kobklein-accent text-white' 
                    : index < ['recipient', 'amount', 'payment'].indexOf(currentStep)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < ['recipient', 'amount', 'payment'].indexOf(currentStep) ? '✓' : index + 1}
                </div>
                {index < 2 && <div className="w-8 h-1 bg-gray-200 rounded-full" />}
              </div>
            ))}
          </div>
        )}

        {renderStepContent()}
      </div>
    </KobKleinCard>
  );
}