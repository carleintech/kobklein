'use client';

import React, { useState, useEffect } from 'react';
import { MobileButton, MobileCard, MobileModal, useMobileOptimizations } from './MobileOptimizations';

// Merchant data structure
interface Merchant {
  id: string;
  name: string;
  category: string;
  logo?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  verified: boolean;
  rating: number;
  totalTransactions: number;
  qrCodes: MerchantQRCode[];
  paymentMethods: string[];
  businessHours?: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
}

// Merchant QR Code types
interface MerchantQRCode {
  id: string;
  type: 'fixed_amount' | 'variable_amount' | 'product_specific' | 'table_service';
  name: string;
  description?: string;
  amount?: number;
  currency: string;
  qrData: string;
  qrImage: string;
  active: boolean;
  created: number;
  lastUsed?: number;
  usageCount: number;
  metadata?: {
    productId?: string;
    tableNumber?: string;
    category?: string;
    tax?: number;
    tip?: boolean;
  };
}

// Transaction data for merchants
interface MerchantTransaction {
  id: string;
  merchantId: string;
  qrCodeId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  customer: {
    id: string;
    name?: string;
    phone?: string;
  };
  items?: {
    name: string;
    quantity: number;
    price: number;
  }[];
  tax?: number;
  tip?: number;
  total: number;
  paymentMethod: string;
  timestamp: number;
  metadata?: {
    tableNumber?: string;
    reference?: string;
    notes?: string;
  };
}

// Sample merchant data for Haiti
const SAMPLE_MERCHANTS: Merchant[] = [
  {
    id: 'merchant_1',
    name: 'Resto Lakay',
    category: 'Restaurant',
    logo: '🍽️',
    description: 'Authentic Haitian cuisine in Port-au-Prince',
    address: 'Rue Capois, Port-au-Prince',
    phone: '+509 1234 5678',
    verified: true,
    rating: 4.5,
    totalTransactions: 342,
    qrCodes: [],
    paymentMethods: ['KobKlein', 'Cash', 'Card'],
    businessHours: {
      monday: { open: '08:00', close: '22:00' },
      tuesday: { open: '08:00', close: '22:00' },
      wednesday: { open: '08:00', close: '22:00' },
      thursday: { open: '08:00', close: '22:00' },
      friday: { open: '08:00', close: '23:00' },
      saturday: { open: '09:00', close: '23:00' },
      sunday: { open: '10:00', close: '21:00' }
    }
  },
  {
    id: 'merchant_2',
    name: 'Boutik Ayiti',
    category: 'Retail',
    logo: '🛍️',
    description: 'Local crafts and souvenirs',
    address: 'Marché de Fer, Port-au-Prince',
    phone: '+509 8765 4321',
    verified: true,
    rating: 4.2,
    totalTransactions: 156,
    qrCodes: [],
    paymentMethods: ['KobKlein', 'Cash'],
    businessHours: {
      monday: { open: '07:00', close: '17:00' },
      tuesday: { open: '07:00', close: '17:00' },
      wednesday: { open: '07:00', close: '17:00' },
      thursday: { open: '07:00', close: '17:00' },
      friday: { open: '07:00', close: '18:00' },
      saturday: { open: '07:00', close: '18:00' },
      sunday: { open: '00:00', close: '00:00', closed: true }
    }
  },
  {
    id: 'merchant_3',
    name: 'Transport Rapide',
    category: 'Transportation',
    logo: '🚌',
    description: 'Fast and reliable transportation service',
    address: 'Station Centrale, Port-au-Prince',
    phone: '+509 5555 0123',
    verified: true,
    rating: 4.0,
    totalTransactions: 1203,
    qrCodes: [],
    paymentMethods: ['KobKlein', 'Cash']
  }
];

// QR Code Generator for Merchants
interface MerchantQRGeneratorProps {
  merchant: Merchant;
  onQRGenerated: (qrCode: MerchantQRCode) => void;
  onClose: () => void;
}

export function MerchantQRGenerator({ merchant, onQRGenerated, onClose }: MerchantQRGeneratorProps) {
  const [qrType, setQrType] = useState<'fixed_amount' | 'variable_amount' | 'product_specific' | 'table_service'>('variable_amount');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [productId, setProductId] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [allowTip, setAllowTip] = useState(true);
  const [taxRate, setTaxRate] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const { hapticFeedback } = useMobileOptimizations();

  const generateQRCode = async () => {
    if (!name.trim()) return;
    
    setIsGenerating(true);
    hapticFeedback('medium');

    try {
      // Generate QR data
      const qrData = {
        type: 'merchant_payment',
        merchantId: merchant.id,
        merchantName: merchant.name,
        qrType,
        amount: qrType === 'variable_amount' ? undefined : amount,
        currency: 'USD',
        metadata: {
          productId: qrType === 'product_specific' ? productId : undefined,
          tableNumber: qrType === 'table_service' ? tableNumber : undefined,
          tax: taxRate > 0 ? taxRate : undefined,
          tip: allowTip
        },
        timestamp: Date.now()
      };

      const paymentLink = `https://kobklein.com/merchant/pay?data=${btoa(JSON.stringify(qrData))}`;
      
      // Generate QR image
      const qrResponse = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(paymentLink)}`);
      
      const newQRCode: MerchantQRCode = {
        id: `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: qrType,
        name,
        description: description || undefined,
        amount: qrType === 'variable_amount' ? undefined : amount,
        currency: 'USD',
        qrData: JSON.stringify(qrData),
        qrImage: qrResponse.url,
        active: true,
        created: Date.now(),
        usageCount: 0,
        metadata: {
          productId: qrType === 'product_specific' ? productId : undefined,
          tableNumber: qrType === 'table_service' ? tableNumber : undefined,
          tax: taxRate > 0 ? taxRate : undefined,
          tip: allowTip
        }
      };

      setTimeout(() => {
        setIsGenerating(false);
        hapticFeedback('success');
        onQRGenerated(newQRCode);
      }, 2000);

    } catch (error) {
      console.error('QR generation failed:', error);
      setIsGenerating(false);
      hapticFeedback('error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">{merchant.logo}</span>
        </div>
        <h2 className="text-xl font-bold">Generate QR Code</h2>
        <p className="text-gray-600">{merchant.name}</p>
      </div>

      {/* QR Type Selection */}
      <MobileCard padding="lg">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          QR Code Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { type: 'variable_amount', label: 'Variable Amount', icon: '💰' },
            { type: 'fixed_amount', label: 'Fixed Amount', icon: '🔒' },
            { type: 'product_specific', label: 'Product', icon: '📦' },
            { type: 'table_service', label: 'Table Service', icon: '🍽️' }
          ].map((option) => (
            <MobileButton
              key={option.type}
              variant={qrType === option.type ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => {
                setQrType(option.type as any);
                hapticFeedback('light');
              }}
              className="w-full text-xs"
            >
              {option.icon} {option.label}
            </MobileButton>
          ))}
        </div>
      </MobileCard>

      {/* Basic Information */}
      <MobileCard padding="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QR Code Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
              placeholder={
                qrType === 'table_service' ? 'Table 5 - Dine In' :
                qrType === 'product_specific' ? 'Griot Plate Special' :
                'General Payment QR'
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
              rows={2}
              placeholder="Optional description for this QR code"
            />
          </div>
        </div>
      </MobileCard>

      {/* Type-specific fields */}
      {(qrType === 'fixed_amount' || qrType === 'product_specific') && (
        <MobileCard padding="lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (USD) *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl font-bold text-gray-400">$</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount || ''}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full text-2xl font-bold text-center border-2 border-gray-300 rounded-lg py-3 px-12 focus:border-blue-500 focus:outline-none"
              placeholder="0.00"
            />
          </div>
        </MobileCard>
      )}

      {qrType === 'product_specific' && (
        <MobileCard padding="lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product ID
          </label>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
            placeholder="GRIOT001"
          />
        </MobileCard>
      )}

      {qrType === 'table_service' && (
        <MobileCard padding="lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Table Number *
          </label>
          <input
            type="text"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
            placeholder="5"
          />
        </MobileCard>
      )}

      {/* Additional Options */}
      <MobileCard padding="lg">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Additional Options
        </label>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tax Rate (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="50"
              value={taxRate || ''}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              placeholder="10.0"
            />
          </div>
          
          <div
            onClick={() => {
              setAllowTip(!allowTip);
              hapticFeedback('light');
            }}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className={`
              w-6 h-6 rounded border-2 flex items-center justify-center
              ${allowTip ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}
            `}>
              {allowTip && <span className="text-white text-xs">✓</span>}
            </div>
            <div>
              <p className="font-medium">Allow Tips</p>
              <p className="text-sm text-gray-500">Customer can add gratuity</p>
            </div>
          </div>
        </div>
      </MobileCard>

      {/* Generate Button */}
      <div className="space-y-3">
        <MobileButton
          variant="primary"
          size="lg"
          onClick={generateQRCode}
          loading={isGenerating}
          disabled={!name.trim() || (qrType === 'table_service' && !tableNumber.trim()) || ((qrType === 'fixed_amount' || qrType === 'product_specific') && amount <= 0)}
          className="w-full"
        >
          {isGenerating ? 'Generating QR Code...' : '🔄 Generate QR Code'}
        </MobileButton>
        
        <MobileButton
          variant="secondary"
          size="md"
          onClick={onClose}
          className="w-full"
        >
          Cancel
        </MobileButton>
      </div>
    </div>
  );
}

// Merchant Dashboard Component
interface MerchantDashboardProps {
  merchant: Merchant;
  onBack: () => void;
}

export function MerchantDashboard({ merchant, onBack }: MerchantDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'qrcodes' | 'transactions' | 'settings'>('overview');
  const [qrCodes, setQrCodes] = useState<MerchantQRCode[]>(merchant.qrCodes);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [selectedQR, setSelectedQR] = useState<MerchantQRCode | null>(null);
  const [transactions] = useState<MerchantTransaction[]>([
    {
      id: 'txn_001',
      merchantId: merchant.id,
      amount: 25.50,
      currency: 'USD',
      status: 'completed',
      customer: { id: 'cust_001', name: 'Jean Baptiste', phone: '+509 1111 2222' },
      total: 25.50,
      paymentMethod: 'KobKlein',
      timestamp: Date.now() - 1800000 // 30 minutes ago
    },
    {
      id: 'txn_002',
      merchantId: merchant.id,
      amount: 12.75,
      currency: 'USD',
      status: 'completed',
      customer: { id: 'cust_002', name: 'Marie Joseph' },
      total: 12.75,
      paymentMethod: 'KobKlein',
      timestamp: Date.now() - 3600000 // 1 hour ago
    }
  ]);
  const { hapticFeedback } = useMobileOptimizations();

  const handleQRGenerated = (newQR: MerchantQRCode) => {
    setQrCodes(prev => [newQR, ...prev]);
    setShowQRGenerator(false);
    setSelectedQR(newQR);
    hapticFeedback('success');
  };

  const toggleQRStatus = (qrId: string) => {
    setQrCodes(prev => prev.map(qr => 
      qr.id === qrId ? { ...qr, active: !qr.active } : qr
    ));
    hapticFeedback('medium');
  };

  if (showQRGenerator) {
    return (
      <MerchantQRGenerator
        merchant={merchant}
        onQRGenerated={handleQRGenerated}
        onClose={() => setShowQRGenerator(false)}
      />
    );
  }

  if (selectedQR) {
    return (
      <div className="space-y-6">
        {/* QR Code Display */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">{merchant.logo}</span>
          </div>
          <h2 className="text-xl font-bold">{selectedQR.name}</h2>
          <p className="text-gray-600">{merchant.name}</p>
        </div>

        {/* QR Code Image */}
        <MobileCard padding="lg" className="text-center">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block mb-4">
            <img 
              src={selectedQR.qrImage} 
              alt={selectedQR.name} 
              className="w-64 h-64 mx-auto"
            />
          </div>
          {selectedQR.amount && (
            <p className="text-2xl font-bold text-green-600 mb-2">
              ${selectedQR.amount.toFixed(2)}
            </p>
          )}
          <p className="text-sm text-gray-600 mb-4">{selectedQR.description}</p>
          
          <div className="space-y-2">
            <MobileButton
              variant="primary"
              size="md"
              onClick={async () => {
                try {
                  if (navigator.share) {
                    await navigator.share({
                      title: `${selectedQR.name} - ${merchant.name}`,
                      text: `Scan to pay at ${merchant.name}`,
                      url: `https://kobklein.com/merchant/pay?qr=${selectedQR.id}`
                    });
                  } else {
                    await navigator.clipboard.writeText(`https://kobklein.com/merchant/pay?qr=${selectedQR.id}`);
                  }
                  hapticFeedback('success');
                } catch (error) {
                  hapticFeedback('error');
                }
              }}
              className="w-full"
            >
              📤 Share QR Code
            </MobileButton>
            
            <MobileButton
              variant="secondary"
              size="sm"
              onClick={() => setSelectedQR(null)}
              className="w-full"
            >
              Back to Dashboard
            </MobileButton>
          </div>
        </MobileCard>

        {/* QR Stats */}
        <MobileCard padding="md">
          <h4 className="font-semibold mb-3">QR Code Statistics</h4>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{selectedQR.usageCount}</p>
              <p className="text-sm text-gray-600">Total Scans</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {selectedQR.lastUsed ? new Date(selectedQR.lastUsed).toLocaleDateString() : 'Never'}
              </p>
              <p className="text-sm text-gray-600">Last Used</p>
            </div>
          </div>
        </MobileCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <MobileButton
          variant="secondary"
          size="sm"
          onClick={onBack}
          className="w-10 h-10 p-0 flex items-center justify-center"
        >
          ←
        </MobileButton>
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">{merchant.logo}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">{merchant.name}</h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{merchant.category}</span>
                {merchant.verified && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'qrcodes', label: 'QR Codes', icon: '📱' },
          { id: 'transactions', label: 'Payments', icon: '💳' },
          { id: 'settings', label: 'Settings', icon: '⚙️' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              hapticFeedback('light');
            }}
            className={`
              flex-1 py-2 px-2 rounded-md text-xs font-medium transition-colors
              ${activeTab === tab.id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600'
              }
            `}
          >
            <span className="block">{tab.icon}</span>
            <span className="block">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <MobileCard padding="md" className="text-center">
              <p className="text-2xl font-bold text-green-600">{transactions.length}</p>
              <p className="text-sm text-gray-600">Today's Payments</p>
            </MobileCard>
            <MobileCard padding="md" className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                ${transactions.reduce((sum, t) => sum + t.total, 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Today's Revenue</p>
            </MobileCard>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <MobileCard padding="md" className="text-center">
              <p className="text-2xl font-bold text-purple-600">{qrCodes.length}</p>
              <p className="text-sm text-gray-600">Active QR Codes</p>
            </MobileCard>
            <MobileCard padding="md" className="text-center">
              <p className="text-2xl font-bold text-orange-600">{merchant.rating}</p>
              <p className="text-sm text-gray-600">Customer Rating</p>
            </MobileCard>
          </div>

          {/* Quick Actions */}
          <MobileCard padding="lg">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-3">
              <MobileButton
                variant="primary"
                size="md"
                onClick={() => setShowQRGenerator(true)}
                className="w-full"
              >
                ➕ Create New QR Code
              </MobileButton>
              <MobileButton
                variant="secondary"
                size="md"
                onClick={() => setActiveTab('transactions')}
                className="w-full"
              >
                📊 View Today's Transactions
              </MobileButton>
            </div>
          </MobileCard>
        </div>
      )}

      {/* QR Codes Tab */}
      {activeTab === 'qrcodes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">QR Codes</h3>
            <MobileButton
              variant="primary"
              size="sm"
              onClick={() => setShowQRGenerator(true)}
            >
              ➕ New
            </MobileButton>
          </div>

          {qrCodes.length === 0 ? (
            <MobileCard padding="lg" className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📱</span>
              </div>
              <p className="text-gray-600 mb-4">No QR codes created yet</p>
              <MobileButton
                variant="primary"
                size="md"
                onClick={() => setShowQRGenerator(true)}
                className="w-full"
              >
                Create Your First QR Code
              </MobileButton>
            </MobileCard>
          ) : (
            <div className="space-y-3">
              {qrCodes.map((qr) => (
                <MobileCard
                  key={qr.id}
                  padding="lg"
                  className={`border-2 transition-colors ${
                    qr.active ? 'border-green-200' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => setSelectedQR(qr)}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold">{qr.name}</h4>
                        <span className={`
                          px-2 py-1 text-xs font-medium rounded-full
                          ${qr.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                        `}>
                          {qr.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {qr.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        {qr.amount && ` • $${qr.amount.toFixed(2)}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        Used {qr.usageCount} times • Created {new Date(qr.created).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MobileButton
                        variant={qr.active ? 'danger' : 'secondary'}
                        size="sm"
                        onClick={() => toggleQRStatus(qr.id)}
                        className="px-3"
                      >
                        {qr.active ? 'Disable' : 'Enable'}
                      </MobileButton>
                    </div>
                  </div>
                </MobileCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          
          {transactions.length === 0 ? (
            <MobileCard padding="lg" className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💳</span>
              </div>
              <p className="text-gray-600">No transactions yet</p>
            </MobileCard>
          ) : (
            <div className="space-y-3">
              {transactions.map((txn) => (
                <MobileCard
                  key={txn.id}
                  padding="lg"
                  className={`border-2 ${
                    txn.status === 'completed' ? 'border-green-200' : 
                    txn.status === 'pending' ? 'border-yellow-200' : 
                    'border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold">${txn.total.toFixed(2)}</span>
                        <span className={`
                          px-2 py-1 text-xs font-medium rounded-full
                          ${txn.status === 'completed' ? 'bg-green-100 text-green-700' : 
                            txn.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'}
                        `}>
                          {txn.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {txn.customer.name || 'Anonymous Customer'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(txn.timestamp).toLocaleString()} • {txn.paymentMethod}
                      </p>
                    </div>
                    <span className="text-gray-400">→</span>
                  </div>
                </MobileCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Merchant Settings</h3>
          
          <MobileCard padding="lg">
            <h4 className="font-semibold mb-3">Business Information</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Address:</span>
                <span>{merchant.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span>{merchant.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span>{merchant.email || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Transactions:</span>
                <span>{merchant.totalTransactions}</span>
              </div>
            </div>
          </MobileCard>

          <MobileCard padding="lg">
            <h4 className="font-semibold mb-3">Payment Methods</h4>
            <div className="space-y-2">
              {merchant.paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded border-2 border-green-500 flex items-center justify-center">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <span className="text-sm">{method}</span>
                </div>
              ))}
            </div>
          </MobileCard>

          <MobileCard padding="lg">
            <h4 className="font-semibold mb-3">Actions</h4>
            <div className="space-y-3">
              <MobileButton
                variant="secondary"
                size="md"
                onClick={() => {/* Edit merchant info */}}
                className="w-full"
              >
                ✏️ Edit Business Info
              </MobileButton>
              <MobileButton
                variant="secondary"
                size="md"
                onClick={() => {/* Download QR codes */}}
                className="w-full"
              >
                📥 Download All QR Codes
              </MobileButton>
              <MobileButton
                variant="secondary"
                size="md"
                onClick={() => {/* Export transactions */}}
                className="w-full"
              >
                📊 Export Transaction History
              </MobileButton>
            </div>
          </MobileCard>
        </div>
      )}
    </div>
  );
}

// Main Merchant Integration System
export function MerchantQRSystem() {
  const [mode, setMode] = useState<'directory' | 'dashboard'>('directory');
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [merchants] = useState<Merchant[]>(SAMPLE_MERCHANTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { hapticFeedback } = useMobileOptimizations();

  const categories = ['all', ...Array.from(new Set(merchants.map(m => m.category)))];
  
  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         merchant.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || merchant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (mode === 'dashboard' && selectedMerchant) {
    return (
      <MerchantDashboard
        merchant={selectedMerchant}
        onBack={() => {
          setSelectedMerchant(null);
          setMode('directory');
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl text-white">🏪</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Merchant Directory</h2>
        <p className="text-gray-600">Browse and manage merchant QR payments</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search merchants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <MobileButton
              key={category}
              variant={selectedCategory === category ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => {
                setSelectedCategory(category);
                hapticFeedback('light');
              }}
              className="whitespace-nowrap"
            >
              {category === 'all' ? 'All' : category}
            </MobileButton>
          ))}
        </div>
      </div>

      {/* Merchants List */}
      <div className="space-y-4">
        {filteredMerchants.length === 0 ? (
          <MobileCard padding="lg" className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-gray-600">No merchants found</p>
            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
          </MobileCard>
        ) : (
          filteredMerchants.map((merchant) => (
            <MobileCard
              key={merchant.id}
              onTap={() => {
                setSelectedMerchant(merchant);
                setMode('dashboard');
              }}
              haptic="medium"
              padding="lg"
              className="border-2 border-gray-200 hover:border-blue-400 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">{merchant.logo}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold">{merchant.name}</h3>
                    {merchant.verified && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{merchant.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>⭐ {merchant.rating}</span>
                    <span>📍 {merchant.address?.split(',')[0]}</span>
                    <span>💳 {merchant.totalTransactions} txns</span>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </MobileCard>
          ))
        )}
      </div>

      {/* Add Merchant Button */}
      <MobileCard
        onTap={() => {
          // TODO: Implement add merchant functionality
          hapticFeedback('medium');
        }}
        haptic="medium"
        padding="lg"
        className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">➕</span>
          </div>
          <div>
            <h3 className="font-semibold text-blue-600">Add Your Business</h3>
            <p className="text-sm text-gray-600">Start accepting QR payments</p>
          </div>
        </div>
      </MobileCard>
    </div>
  );
}