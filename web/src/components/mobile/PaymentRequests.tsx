'use client';

import React, { useState, useEffect } from 'react';
import { MobileButton, MobileCard, MobileModal, useMobileOptimizations } from './MobileOptimizations';

// Payment Request data structure
interface PaymentRequest {
  id: string;
  amount: number;
  currency: string;
  description: string;
  recipient: {
    id: string;
    name: string;
    avatar?: string;
  };
  created: number;
  expires: number;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  paymentMethods: ('qr' | 'nfc' | 'link')[];
  qrCode?: string;
  paymentLink?: string;
  nfcData?: any;
  metadata?: {
    category?: string;
    reference?: string;
    recurring?: boolean;
  };
}

// Request templates for common use cases
const REQUEST_TEMPLATES = [
  {
    id: 'split_bill',
    name: 'Split Bill',
    icon: '🍽️',
    description: 'Restaurant, groceries, etc.',
    defaultAmount: 25.00
  },
  {
    id: 'rent_utilities',
    name: 'Rent/Utilities',
    icon: '🏠',
    description: 'Housing expenses',
    defaultAmount: 500.00
  },
  {
    id: 'group_gift',
    name: 'Group Gift',
    icon: '🎁',
    description: 'Collect money for gifts',
    defaultAmount: 15.00
  },
  {
    id: 'service_payment',
    name: 'Service Payment',
    icon: '🔧',
    description: 'Repairs, cleaning, etc.',
    defaultAmount: 50.00
  },
  {
    id: 'loan_repayment',
    name: 'Loan Repayment',
    icon: '💰',
    description: 'Personal loans',
    defaultAmount: 100.00
  },
  {
    id: 'event_ticket',
    name: 'Event Ticket',
    icon: '🎫',
    description: 'Concert, sports, etc.',
    defaultAmount: 30.00
  }
];

// Expiry options
const EXPIRY_OPTIONS = [
  { label: '1 Hour', hours: 1 },
  { label: '6 Hours', hours: 6 },
  { label: '24 Hours', hours: 24 },
  { label: '3 Days', hours: 72 },
  { label: '1 Week', hours: 168 },
  { label: 'Never', hours: 0 }
];

interface PaymentRequestFormProps {
  template?: typeof REQUEST_TEMPLATES[0];
  onSubmit: (request: PaymentRequest) => void;
  onCancel: () => void;
}

export function PaymentRequestForm({ template, onSubmit, onCancel }: PaymentRequestFormProps) {
  const [amount, setAmount] = useState(template?.defaultAmount || 0);
  const [description, setDescription] = useState(template?.description || '');
  const [expiryHours, setExpiryHours] = useState(24);
  const [paymentMethods, setPaymentMethods] = useState<('qr' | 'nfc' | 'link')[]>(['qr', 'link']);
  const [category, setCategory] = useState(template?.id || '');
  const [reference, setReference] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const { hapticFeedback } = useMobileOptimizations();

  const generatePaymentRequest = async (): Promise<PaymentRequest> => {
    const now = Date.now();
    const expires = expiryHours > 0 ? now + (expiryHours * 60 * 60 * 1000) : 0;
    
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate QR code data
    const qrData = {
      type: 'payment_request',
      id: requestId,
      amount,
      currency: 'USD',
      description,
      recipient: {
        id: 'current_user',
        name: 'KobKlein User'
      },
      expires
    };
    
    // Generate payment link
    const paymentLink = `https://kobklein.com/pay?req=${btoa(JSON.stringify(qrData))}`;
    
    // Generate QR code (using QR Server API)
    let qrCode = '';
    try {
      const qrResponse = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(paymentLink)}`);
      if (qrResponse.ok) {
        qrCode = qrResponse.url;
      }
    } catch (error) {
      console.error('QR generation failed', error);
    }
    
    // Generate NFC data
    const nfcData = paymentMethods.includes('nfc') ? {
      type: 'ndef',
      records: [{
        recordType: 'text',
        data: `kobklein://payment_request?data=${btoa(JSON.stringify(qrData))}`
      }]
    } : undefined;

    return {
      id: requestId,
      amount,
      currency: 'USD',
      description,
      recipient: {
        id: 'current_user',
        name: 'KobKlein User',
        avatar: '👤'
      },
      created: now,
      expires,
      status: 'pending',
      paymentMethods,
      qrCode,
      paymentLink,
      nfcData,
      metadata: {
        category,
        reference: reference || undefined,
        recurring: isRecurring
      }
    };
  };

  const handleSubmit = async () => {
    if (amount <= 0) return;
    
    hapticFeedback('medium');
    const request = await generatePaymentRequest();
    onSubmit(request);
  };

  const togglePaymentMethod = (method: 'qr' | 'nfc' | 'link') => {
    setPaymentMethods(prev => {
      if (prev.includes(method)) {
        return prev.filter(m => m !== method);
      } else {
        return [...prev, method];
      }
    });
    hapticFeedback('light');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">{template?.icon || '💸'}</span>
        </div>
        <h2 className="text-xl font-bold">Create Payment Request</h2>
        <p className="text-gray-600">{template?.name || 'Custom Request'}</p>
      </div>

      {/* Amount Input */}
      <MobileCard padding="lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount (USD)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount || ''}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="w-full text-3xl font-bold text-center border-2 border-gray-300 rounded-lg py-4 px-12 focus:border-blue-500 focus:outline-none"
            placeholder="0.00"
          />
        </div>
      </MobileCard>

      {/* Description */}
      <MobileCard padding="lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-lg p-4 focus:border-blue-500 focus:outline-none"
          rows={3}
          placeholder="What is this payment for?"
        />
      </MobileCard>

      {/* Expiry Time */}
      <MobileCard padding="lg">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Request Expires
        </label>
        <div className="grid grid-cols-2 gap-2">
          {EXPIRY_OPTIONS.map((option) => (
            <MobileButton
              key={option.hours}
              variant={expiryHours === option.hours ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => {
                setExpiryHours(option.hours);
                hapticFeedback('light');
              }}
              className="w-full"
            >
              {option.label}
            </MobileButton>
          ))}
        </div>
      </MobileCard>

      {/* Payment Methods */}
      <MobileCard padding="lg">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Available Payment Methods
        </label>
        <div className="space-y-2">
          {[
            { id: 'qr', label: 'QR Code', icon: '📱', description: 'Scannable QR code' },
            { id: 'link', label: 'Payment Link', icon: '🔗', description: 'Shareable web link' },
            { id: 'nfc', label: 'NFC', icon: '📡', description: 'Tap to pay/request' }
          ].map((method) => (
            <div
              key={method.id}
              onClick={() => togglePaymentMethod(method.id as any)}
              className={`
                flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors
                ${paymentMethods.includes(method.id as any) 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className={`
                w-6 h-6 rounded border-2 flex items-center justify-center
                ${paymentMethods.includes(method.id as any) 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
                }
              `}>
                {paymentMethods.includes(method.id as any) && (
                  <span className="text-white text-xs">✓</span>
                )}
              </div>
              <span className="text-lg">{method.icon}</span>
              <div className="flex-1">
                <p className="font-medium">{method.label}</p>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
            </div>
          ))}
        </div>
      </MobileCard>

      {/* Additional Options */}
      <MobileCard padding="lg">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Additional Options
        </label>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Reference/Note</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              placeholder="Optional reference number"
            />
          </div>
          
          <div
            onClick={() => {
              setIsRecurring(!isRecurring);
              hapticFeedback('light');
            }}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className={`
              w-6 h-6 rounded border-2 flex items-center justify-center
              ${isRecurring ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}
            `}>
              {isRecurring && <span className="text-white text-xs">✓</span>}
            </div>
            <div>
              <p className="font-medium">Recurring Request</p>
              <p className="text-sm text-gray-500">Request this payment regularly</p>
            </div>
          </div>
        </div>
      </MobileCard>

      {/* Submit Buttons */}
      <div className="space-y-3">
        <MobileButton
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={amount <= 0 || !description.trim() || paymentMethods.length === 0}
          className="w-full"
        >
          🚀 Create Request
        </MobileButton>
        
        <MobileButton
          variant="secondary"
          size="md"
          onClick={onCancel}
          className="w-full"
        >
          Cancel
        </MobileButton>
      </div>
    </div>
  );
}

// Payment Request Display Component
interface PaymentRequestDisplayProps {
  request: PaymentRequest;
  onShare: (method: string, data: string) => void;
  onCancel: (requestId: string) => void;
  onClose: () => void;
}

export function PaymentRequestDisplay({ request, onShare, onCancel, onClose }: PaymentRequestDisplayProps) {
  const [selectedTab, setSelectedTab] = useState<'qr' | 'link' | 'nfc'>('qr');
  const { hapticFeedback } = useMobileOptimizations();
  
  const timeRemaining = request.expires > 0 ? 
    Math.max(0, request.expires - Date.now()) : 0;
  
  const formatTimeRemaining = (ms: number): string => {
    if (ms === 0) return 'Never expires';
    if (ms < 0) return 'Expired';
    
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const handleShare = async (method: 'qr' | 'link' | 'nfc') => {
    let shareData: any = {};
    
    switch (method) {
      case 'qr':
        if (request.qrCode) {
          shareData = {
            title: 'Payment Request - KobKlein',
            text: `${request.recipient.name} is requesting $${request.amount.toFixed(2)} for ${request.description}`,
            url: request.paymentLink
          };
        }
        break;
      case 'link':
        shareData = {
          title: 'Payment Request - KobKlein',
          text: `Pay $${request.amount.toFixed(2)} for ${request.description}`,
          url: request.paymentLink
        };
        break;
      case 'nfc':
        // NFC sharing would write to NFC tag
        onShare('nfc', JSON.stringify(request.nfcData));
        return;
    }
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url || JSON.stringify(shareData));
        hapticFeedback('success');
      }
      onShare(method, shareData.url || JSON.stringify(shareData));
    } catch (error) {
      console.error('Share failed:', error);
      hapticFeedback('error');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      hapticFeedback('success');
    } catch (error) {
      hapticFeedback('error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">✅</span>
        </div>
        <h2 className="text-xl font-bold">Request Created!</h2>
        <p className="text-3xl font-bold text-green-600 mt-2">
          ${request.amount.toFixed(2)}
        </p>
        <p className="text-gray-600">{request.description}</p>
      </div>

      {/* Status & Expiry */}
      <MobileCard padding="md" className={`
        ${request.status === 'pending' ? 'bg-blue-50 border-blue-200' : ''}
        ${request.status === 'expired' ? 'bg-red-50 border-red-200' : ''}
        ${request.status === 'paid' ? 'bg-green-50 border-green-200' : ''}
      `}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold capitalize">{request.status}</p>
            <p className="text-sm text-gray-600">
              {formatTimeRemaining(timeRemaining)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Request ID</p>
            <p className="font-mono text-xs">{request.id.slice(-8)}</p>
          </div>
        </div>
      </MobileCard>

      {/* Payment Method Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        {request.paymentMethods.map((method) => (
          <button
            key={method}
            onClick={() => {
              setSelectedTab(method);
              hapticFeedback('light');
            }}
            className={`
              flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors
              ${selectedTab === method 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600'
              }
            `}
          >
            {method === 'qr' && '📱 QR'}
            {method === 'link' && '🔗 Link'}
            {method === 'nfc' && '📡 NFC'}
          </button>
        ))}
      </div>

      {/* Payment Method Content */}
      <MobileCard padding="lg">
        {selectedTab === 'qr' && request.qrCode && (
          <div className="text-center space-y-4">
            <p className="font-medium">Scan to Pay</p>
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
              <img 
                src={request.qrCode} 
                alt="Payment QR Code" 
                className="w-48 h-48 mx-auto"
              />
            </div>
            <div className="space-y-2">
              <MobileButton
                variant="primary"
                size="md"
                onClick={() => handleShare('qr')}
                className="w-full"
              >
                📤 Share QR Code
              </MobileButton>
              <MobileButton
                variant="secondary"
                size="sm"
                onClick={() => copyToClipboard(request.paymentLink!)}
                className="w-full"
              >
                📋 Copy Link
              </MobileButton>
            </div>
          </div>
        )}

        {selectedTab === 'link' && request.paymentLink && (
          <div className="space-y-4">
            <p className="font-medium">Payment Link</p>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="font-mono text-xs break-all">
                {request.paymentLink}
              </p>
            </div>
            <div className="space-y-2">
              <MobileButton
                variant="primary"
                size="md"
                onClick={() => handleShare('link')}
                className="w-full"
              >
                📤 Share Link
              </MobileButton>
              <MobileButton
                variant="secondary"
                size="sm"
                onClick={() => copyToClipboard(request.paymentLink || '')}
                className="w-full"
              >
                📋 Copy Link
              </MobileButton>
            </div>
          </div>
        )}

        {selectedTab === 'nfc' && request.nfcData && (
          <div className="text-center space-y-4">
            <p className="font-medium">NFC Payment Request</p>
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">📡</span>
            </div>
            <p className="text-sm text-gray-600">
              Hold another device near your phone to share this payment request via NFC
            </p>
            <MobileButton
              variant="primary"
              size="md"
              onClick={() => handleShare('nfc')}
              className="w-full"
            >
              📡 Share via NFC
            </MobileButton>
          </div>
        )}
      </MobileCard>

      {/* Request Details */}
      <MobileCard padding="md">
        <h4 className="font-semibold mb-3">Request Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Created:</span>
            <span>{new Date(request.created).toLocaleString()}</span>
          </div>
          {request.expires > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Expires:</span>
              <span>{new Date(request.expires).toLocaleString()}</span>
            </div>
          )}
          {request.metadata?.reference && (
            <div className="flex justify-between">
              <span className="text-gray-600">Reference:</span>
              <span>{request.metadata.reference}</span>
            </div>
          )}
          {request.metadata?.recurring && (
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span>Recurring Request</span>
            </div>
          )}
        </div>
      </MobileCard>

      {/* Action Buttons */}
      <div className="space-y-3">
        {request.status === 'pending' && (
          <MobileButton
            variant="danger"
            size="md"
            onClick={() => {
              onCancel(request.id);
              hapticFeedback('medium');
            }}
            className="w-full"
          >
            ❌ Cancel Request
          </MobileButton>
        )}
        
        <MobileButton
          variant="secondary"
          size="md"
          onClick={onClose}
          className="w-full"
        >
          Done
        </MobileButton>
      </div>
    </div>
  );
}

// Main Payment Request System
export function PaymentRequestSystem() {
  const [mode, setMode] = useState<'menu' | 'templates' | 'create' | 'view' | 'manage'>('menu');
  const [selectedTemplate, setSelectedTemplate] = useState<typeof REQUEST_TEMPLATES[0] | null>(null);
  const [activeRequest, setActiveRequest] = useState<PaymentRequest | null>(null);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const { hapticFeedback } = useMobileOptimizations();

  const handleCreateRequest = (request: PaymentRequest) => {
    setPaymentRequests(prev => [request, ...prev]);
    setActiveRequest(request);
    setMode('view');
    hapticFeedback('success');
  };

  const handleShare = (method: string, data: string) => {
    console.log(`Shared via ${method}:`, data);
    hapticFeedback('success');
  };

  const handleCancelRequest = (requestId: string) => {
    setPaymentRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'cancelled' as const }
          : req
      )
    );
    setMode('menu');
  };

  if (mode === 'templates') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Choose Template</h2>
          <p className="text-gray-600">Quick setup for common requests</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {REQUEST_TEMPLATES.map((template) => (
            <MobileCard
              key={template.id}
              onTap={() => {
                setSelectedTemplate(template);
                setMode('create');
              }}
              haptic="medium"
              padding="lg"
              className="border-2 border-gray-200 hover:border-blue-400 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">{template.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                  <p className="text-sm font-medium text-blue-600">
                    ~${template.defaultAmount.toFixed(2)}
                  </p>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </MobileCard>
          ))}
        </div>

        <MobileButton
          variant="secondary"
          size="md"
          onClick={() => setMode('menu')}
          className="w-full"
        >
          Back to Menu
        </MobileButton>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <PaymentRequestForm
        template={selectedTemplate || undefined}
        onSubmit={handleCreateRequest}
        onCancel={() => {
          setSelectedTemplate(null);
          setMode('menu');
        }}
      />
    );
  }

  if (mode === 'view' && activeRequest) {
    return (
      <PaymentRequestDisplay
        request={activeRequest}
        onShare={handleShare}
        onCancel={handleCancelRequest}
        onClose={() => {
          setActiveRequest(null);
          setMode('menu');
        }}
      />
    );
  }

  if (mode === 'manage') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">My Requests</h2>
          <p className="text-gray-600">Manage your payment requests</p>
        </div>

        <div className="space-y-4">
          {paymentRequests.length === 0 ? (
            <MobileCard padding="lg" className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📝</span>
              </div>
              <p className="text-gray-600 mb-4">No payment requests yet</p>
              <MobileButton
                variant="primary"
                size="md"
                onClick={() => setMode('templates')}
                className="w-full"
              >
                Create Your First Request
              </MobileButton>
            </MobileCard>
          ) : (
            paymentRequests.map((request) => (
              <MobileCard
                key={request.id}
                onTap={() => {
                  setActiveRequest(request);
                  setMode('view');
                }}
                haptic="light"
                padding="lg"
                className={`
                  border-2 transition-colors
                  ${request.status === 'pending' ? 'border-blue-200 hover:border-blue-400' : ''}
                  ${request.status === 'paid' ? 'border-green-200 bg-green-50' : ''}
                  ${request.status === 'expired' ? 'border-red-200 bg-red-50' : ''}
                  ${request.status === 'cancelled' ? 'border-gray-200 bg-gray-50' : ''}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold">${request.amount.toFixed(2)}</span>
                      <span className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${request.status === 'pending' ? 'bg-blue-100 text-blue-700' : ''}
                        ${request.status === 'paid' ? 'bg-green-100 text-green-700' : ''}
                        ${request.status === 'expired' ? 'bg-red-100 text-red-700' : ''}
                        ${request.status === 'cancelled' ? 'bg-gray-100 text-gray-700' : ''}
                      `}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{request.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(request.created).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
              </MobileCard>
            ))
          )}
        </div>

        <MobileButton
          variant="secondary"
          size="md"
          onClick={() => setMode('menu')}
          className="w-full"
        >
          Back to Menu
        </MobileButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl text-white">💸</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Requests</h2>
        <p className="text-gray-600">Request money with QR codes, links & NFC</p>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <MobileCard
          onTap={() => setMode('templates')}
          haptic="medium"
          padding="lg"
          className="border-2 border-blue-200 hover:border-blue-400 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Quick Request</h3>
              <p className="text-sm text-gray-600">Use templates for common requests</p>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </MobileCard>

        <MobileCard
          onTap={() => {
            setSelectedTemplate(null);
            setMode('create');
          }}
          haptic="medium"
          padding="lg"
          className="border-2 border-gray-200 hover:border-gray-400 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Custom Request</h3>
              <p className="text-sm text-gray-600">Create a custom payment request</p>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </MobileCard>

        <MobileCard
          onTap={() => setMode('manage')}
          haptic="medium"
          padding="lg"
          className="border-2 border-purple-200 hover:border-purple-400 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">My Requests</h3>
              <p className="text-sm text-gray-600">
                {paymentRequests.length > 0 
                  ? `${paymentRequests.length} active requests`
                  : 'View and manage requests'
                }
              </p>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </MobileCard>
      </div>

      {/* Recent Activity */}
      {paymentRequests.length > 0 && (
        <MobileCard padding="md">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Requests</h3>
          <div className="space-y-3">
            {paymentRequests.slice(0, 3).map((request) => (
              <div
                key={request.id}
                onClick={() => {
                  setActiveRequest(request);
                  setMode('view');
                }}
                className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium text-sm">${request.amount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{request.description}</p>
                </div>
                <span className={`
                  px-2 py-1 text-xs font-medium rounded-full
                  ${request.status === 'pending' ? 'bg-blue-100 text-blue-700' : ''}
                  ${request.status === 'paid' ? 'bg-green-100 text-green-700' : ''}
                  ${request.status === 'expired' ? 'bg-red-100 text-red-700' : ''}
                `}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </MobileCard>
      )}
    </div>
  );
}