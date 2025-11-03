'use client';

import React, { useState, useEffect } from 'react';
import { MobileButton, MobileAmountInput, MobileInput, MobileCard, useMobileOptimizations } from './MobileOptimizations';

// Quick payment amounts for Haiti market
const QUICK_AMOUNTS = [5, 10, 25, 50, 100, 250];

interface QuickSendFlowProps {
  onComplete?: (transaction: any) => void;
  onCancel?: () => void;
}

export function QuickSendFlow({ onComplete, onCancel }: QuickSendFlowProps) {
  const { hapticFeedback, isMobile } = useMobileOptimizations();
  const [step, setStep] = useState<'amount' | 'recipient' | 'confirm' | 'processing'>('amount');
  const [amount, setAmount] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount);
    hapticFeedback('medium');
  };

  const handleNext = () => {
    hapticFeedback('light');
    if (step === 'amount' && amount > 0) {
      setStep('recipient');
    } else if (step === 'recipient' && recipient.trim()) {
      setStep('confirm');
    } else if (step === 'confirm') {
      handleSend();
    }
  };

  const handleBack = () => {
    hapticFeedback('light');
    if (step === 'recipient') {
      setStep('amount');
    } else if (step === 'confirm') {
      setStep('recipient');
    }
  };

  const handleSend = async () => {
    setStep('processing');
    setIsProcessing(true);
    hapticFeedback('medium');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transaction = {
        id: Date.now().toString(),
        amount,
        recipient,
        note,
        timestamp: new Date().toISOString(),
        status: 'completed',
      };

      hapticFeedback('success');
      onComplete?.(transaction);
    } catch (error) {
      hapticFeedback('error');
      console.error('Send failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 safe-area-top">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Send Money</h1>
          <button
            onClick={() => {
              hapticFeedback('light');
              onCancel?.();
            }}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center mt-4 space-x-2">
          {['amount', 'recipient', 'confirm'].map((stepName, index) => (
            <div
              key={stepName}
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                ['amount', 'recipient', 'confirm'].indexOf(step) >= index
                  ? 'bg-white'
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 pb-safe">
        {step === 'amount' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How much?</h2>
              <p className="text-gray-600">Enter amount to send</p>
            </div>

            <MobileAmountInput
              label="Amount"
              amount={amount}
              onAmountChange={setAmount}
              currency="USD"
              max={1000}
              className="text-center"
            />

            {/* Quick amount buttons */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 text-center">Quick amounts</p>
              <div className="grid grid-cols-3 gap-3">
                {QUICK_AMOUNTS.map((quickAmount) => (
                  <MobileButton
                    key={quickAmount}
                    variant={amount === quickAmount ? 'primary' : 'secondary'}
                    size="md"
                    onClick={() => handleQuickAmount(quickAmount)}
                    haptic="light"
                    className="text-center"
                  >
                    ${quickAmount}
                  </MobileButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'recipient' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Send to whom?</h2>
              <p className="text-gray-600">Enter recipient details</p>
            </div>

            <MobileInput
              label="Phone number or email"
              type="text"
              value={recipient}
              onChange={setRecipient}
              placeholder="+509 1234 5678"
              inputMode="tel"
              autoComplete="tel"
              required
            />

            <MobileInput
              label="Note (optional)"
              type="text"
              value={note}
              onChange={setNote}
              placeholder="What's this for?"
            />

            {/* Recent contacts */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Recent contacts</p>
              <div className="space-y-2">
                {[
                  { name: 'Marie Joseph', phone: '+509 1234 5678', avatar: 'MJ' },
                  { name: 'Jean Baptiste', phone: '+509 8765 4321', avatar: 'JB' },
                  { name: 'Rose Delmas', phone: '+509 5555 1234', avatar: 'RD' },
                ].map((contact, index) => (
                  <MobileCard
                    key={index}
                    onTap={() => {
                      setRecipient(contact.phone);
                      hapticFeedback('medium');
                    }}
                    padding="sm"
                    className="flex items-center space-x-3"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">{contact.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.phone}</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </MobileCard>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm transfer</h2>
              <p className="text-gray-600">Review your transaction</p>
            </div>

            <MobileCard padding="lg" elevated={true}>
              <div className="text-center space-y-4">
                <div>
                  <p className="text-3xl font-bold text-green-600">
                    ${amount.toFixed(2)}
                  </p>
                  <p className="text-gray-600">Amount to send</p>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">{recipient}</span>
                  </div>
                  
                  {note && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Note:</span>
                      <span className="font-medium">{note}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fee:</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-bold">${amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </MobileCard>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Security Notice
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    This transaction will be processed immediately and cannot be reversed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center space-y-6 py-16">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin">
                <div className="w-4 h-4 bg-blue-600 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Processing...</h2>
              <p className="text-gray-600">Your transaction is being processed</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      {step !== 'processing' && (
        <div className="p-4 border-t bg-white safe-area-bottom">
          <div className="flex space-x-3">
            {step !== 'amount' && (
              <MobileButton
                variant="secondary"
                size="lg"
                onClick={handleBack}
                haptic="light"
                className="flex-1"
              >
                Back
              </MobileButton>
            )}
            
            <MobileButton
              variant="primary"
              size="lg"
              onClick={handleNext}
              haptic="medium"
              disabled={
                (step === 'amount' && amount <= 0) ||
                (step === 'recipient' && !recipient.trim())
              }
              className="flex-1"
            >
              {step === 'amount' && 'Continue'}
              {step === 'recipient' && 'Continue'}
              {step === 'confirm' && 'Send Money'}
            </MobileButton>
          </div>
        </div>
      )}
    </div>
  );
}

// Mobile payment request flow
interface PaymentRequestFlowProps {
  onComplete?: (request: any) => void;
  onCancel?: () => void;
}

export function PaymentRequestFlow({ onComplete, onCancel }: PaymentRequestFlowProps) {
  const { hapticFeedback } = useMobileOptimizations();
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [from, setFrom] = useState('');

  const handleRequest = async () => {
    hapticFeedback('success');
    
    const request = {
      id: Date.now().toString(),
      amount,
      description,
      from,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    onComplete?.(request);
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 safe-area-top">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Request Money</h1>
          <button
            onClick={() => {
              hapticFeedback('light');
              onCancel?.();
            }}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Payment</h2>
          <p className="text-gray-600">Ask someone to send you money</p>
        </div>

        <MobileAmountInput
          label="Amount"
          amount={amount}
          onAmountChange={setAmount}
          currency="USD"
          max={5000}
        />

        <MobileInput
          label="From (phone or email)"
          type="text"
          value={from}
          onChange={setFrom}
          placeholder="+509 1234 5678"
          inputMode="tel"
          required
        />

        <MobileInput
          label="What's this for?"
          type="text"
          value={description}
          onChange={setDescription}
          placeholder="Lunch money, rent payment, etc."
          required
        />

        {/* Quick descriptions */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Quick descriptions</p>
          <div className="grid grid-cols-2 gap-2">
            {['Lunch money', 'Gas money', 'Rent payment', 'Utilities', 'Groceries', 'Other'].map((desc) => (
              <MobileButton
                key={desc}
                variant={description === desc ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => {
                  setDescription(desc);
                  hapticFeedback('light');
                }}
                haptic="light"
              >
                {desc}
              </MobileButton>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom action */}
      <div className="p-4 border-t bg-white safe-area-bottom">
        <MobileButton
          variant="primary"
          size="lg"
          onClick={handleRequest}
          haptic="success"
          disabled={amount <= 0 || !from.trim() || !description.trim()}
          className="w-full"
        >
          Send Request
        </MobileButton>
      </div>
    </div>
  );
}

// Mobile wallet overview with quick actions
export function MobileWalletOverview() {
  const { hapticFeedback } = useMobileOptimizations();
  const [balance] = useState(1247.50);
  const [showQuickSend, setShowQuickSend] = useState(false);
  const [showRequest, setShowRequest] = useState(false);

  const quickActions = [
    { 
      icon: '💸', 
      label: 'Send', 
      color: 'bg-blue-600',
      action: () => setShowQuickSend(true)
    },
    { 
      icon: '💰', 
      label: 'Request', 
      color: 'bg-green-600',
      action: () => setShowRequest(true)
    },
    { 
      icon: '🔄', 
      label: 'Top Up', 
      color: 'bg-purple-600',
      action: () => hapticFeedback('medium')
    },
    { 
      icon: '📊', 
      label: 'History', 
      color: 'bg-orange-600',
      action: () => hapticFeedback('medium')
    },
  ];

  const recentTransactions = [
    { id: 1, type: 'sent', amount: -25.00, to: 'Marie Joseph', time: '2 min ago' },
    { id: 2, type: 'received', amount: 100.00, from: 'Jean Baptiste', time: '1 hour ago' },
    { id: 3, type: 'sent', amount: -15.50, to: 'Rose Delmas', time: '3 hours ago' },
  ];

  return (
    <>
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white p-6 safe-area-top">
          <div className="text-center">
            <p className="text-blue-100 mb-2">Available Balance</p>
            <h1 className="text-4xl font-bold mb-4">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h1>
            
            {/* Quick actions */}
            <div className="grid grid-cols-4 gap-3">
              {quickActions.map((action, index) => (
                <MobileButton
                  key={index}
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    hapticFeedback('medium');
                    action.action();
                  }}
                  haptic="medium"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 flex flex-col items-center py-3"
                >
                  <span className="text-xl mb-1">{action.icon}</span>
                  <span className="text-xs">{action.label}</span>
                </MobileButton>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Recent transactions */}
          <MobileCard padding="md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'sent' ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    <span className={`text-lg ${
                      transaction.type === 'sent' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.type === 'sent' ? '↗️' : '↙️'}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {transaction.type === 'sent' ? `Sent to ${transaction.to}` : `From ${transaction.from}`}
                    </p>
                    <p className="text-sm text-gray-600">{transaction.time}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <MobileButton
              variant="secondary"
              size="sm"
              onClick={() => hapticFeedback('light')}
              className="w-full mt-4"
            >
              View All Transactions
            </MobileButton>
          </MobileCard>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-4">
            <MobileCard padding="md">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">$324.50</p>
                <p className="text-sm text-gray-600">This month</p>
                <p className="text-xs text-green-600">↗️ +12%</p>
              </div>
            </MobileCard>
            
            <MobileCard padding="md">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">23</p>
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-xs text-blue-600">This week</p>
              </div>
            </MobileCard>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showQuickSend && (
        <div className="fixed inset-0 z-50">
          <QuickSendFlow
            onComplete={(transaction) => {
              console.log('Send completed:', transaction);
              setShowQuickSend(false);
              hapticFeedback('success');
            }}
            onCancel={() => setShowQuickSend(false)}
          />
        </div>
      )}

      {showRequest && (
        <div className="fixed inset-0 z-50">
          <PaymentRequestFlow
            onComplete={(request) => {
              console.log('Request created:', request);
              setShowRequest(false);
              hapticFeedback('success');
            }}
            onCancel={() => setShowRequest(false)}
          />
        </div>
      )}
    </>
  );
}