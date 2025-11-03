'use client';

import React, { useState } from 'react';
import { MobileButton, MobileCard, useMobileOptimizations } from './MobileOptimizations';
import { QRPaymentSystem } from './QRPayments';
import { NFCPaymentSystem } from './NFCPayments';
import { PaymentRequestSystem } from './PaymentRequests';
import { MerchantQRSystem } from './MerchantQR';
import { AdvancedPaymentSecurity } from './PaymentSecurity';
import { AdvancedPaymentsTest } from './AdvancedPaymentsTest';

// Main Advanced Payments Hub
export function AdvancedPaymentsHub() {
  const [activeSystem, setActiveSystem] = useState<'hub' | 'qr' | 'nfc' | 'requests' | 'merchant' | 'security' | 'test'>('hub');
  const { hapticFeedback } = useMobileOptimizations();

  // Navigation handler
  const navigateToSystem = (system: typeof activeSystem) => {
    setActiveSystem(system);
    hapticFeedback('medium');
  };

  // Back to hub handler
  const backToHub = () => {
    setActiveSystem('hub');
    hapticFeedback('light');
  };

  // Render specific system
  if (activeSystem === 'qr') {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4 mb-6">
          <MobileButton
            variant="secondary"
            size="sm"
            onClick={backToHub}
            className="w-10 h-10 p-0 flex items-center justify-center"
          >
            ←
          </MobileButton>
          <h1 className="text-xl font-bold">QR Code Payments</h1>
        </div>
        <QRPaymentSystem />
      </div>
    );
  }

  if (activeSystem === 'nfc') {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4 mb-6">
          <MobileButton
            variant="secondary"
            size="sm"
            onClick={backToHub}
            className="w-10 h-10 p-0 flex items-center justify-center"
          >
            ←
          </MobileButton>
          <h1 className="text-xl font-bold">NFC Payments</h1>
        </div>
        <NFCPaymentSystem />
      </div>
    );
  }

  if (activeSystem === 'requests') {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4 mb-6">
          <MobileButton
            variant="secondary"
            size="sm"
            onClick={backToHub}
            className="w-10 h-10 p-0 flex items-center justify-center"
          >
            ←
          </MobileButton>
          <h1 className="text-xl font-bold">Payment Requests</h1>
        </div>
        <PaymentRequestSystem />
      </div>
    );
  }

  if (activeSystem === 'merchant') {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4 mb-6">
          <MobileButton
            variant="secondary"
            size="sm"
            onClick={backToHub}
            className="w-10 h-10 p-0 flex items-center justify-center"
          >
            ←
          </MobileButton>
          <h1 className="text-xl font-bold">Merchant Directory</h1>
        </div>
        <MerchantQRSystem />
      </div>
    );
  }

  if (activeSystem === 'security') {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4 mb-6">
          <MobileButton
            variant="secondary"
            size="sm"
            onClick={backToHub}
            className="w-10 h-10 p-0 flex items-center justify-center"
          >
            ←
          </MobileButton>
          <h1 className="text-xl font-bold">Payment Security</h1>
        </div>
        <AdvancedPaymentSecurity />
      </div>
    );
  }

  if (activeSystem === 'test') {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4 mb-6">
          <MobileButton
            variant="secondary"
            size="sm"
            onClick={backToHub}
            className="w-10 h-10 p-0 flex items-center justify-center"
          >
            ←
          </MobileButton>
          <h1 className="text-xl font-bold">API Integration Test</h1>
        </div>
        <AdvancedPaymentsTest />
      </div>
    );
  }

  // Main hub view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-600 via-blue-600 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-4xl text-white">💫</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">KobKlein Advanced</h1>
        <p className="text-gray-600">Next-generation payment technologies for Haiti</p>
      </div>

      {/* Feature Cards */}
      <div className="space-y-4">
        {/* QR Code Payments */}
        <MobileCard
          onTap={() => navigateToSystem('qr')}
          haptic="medium"
          padding="lg"
          className="border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-3xl text-white">📱</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">QR Code Payments</h3>
              <p className="text-sm text-gray-600 mb-2">
                Generate, scan, and process QR payment codes with camera integration
              </p>
              <div className="flex space-x-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Camera</span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">QR API</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Instant</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl">→</span>
              <span className="text-xs text-gray-500 mt-1">Tap</span>
            </div>
          </div>
        </MobileCard>

        {/* NFC Payments */}
        <MobileCard
          onTap={() => navigateToSystem('nfc')}
          haptic="medium"
          padding="lg"
          className="border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-3xl text-white">📡</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">NFC Tap-to-Pay</h3>
              <p className="text-sm text-gray-600 mb-2">
                Contactless payments with Near Field Communication technology
              </p>
              <div className="flex space-x-2">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Contactless</span>
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">Web NFC</span>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Business Cards</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl">→</span>
              <span className="text-xs text-gray-500 mt-1">Tap</span>
            </div>
          </div>
        </MobileCard>

        {/* Payment Requests */}
        <MobileCard
          onTap={() => navigateToSystem('requests')}
          haptic="medium"
          padding="lg"
          className="border-2 border-green-200 hover:border-green-400 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-3xl text-white">💸</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Payment Requests</h3>
              <p className="text-sm text-gray-600 mb-2">
                Create shareable payment requests with QR codes and links
              </p>
              <div className="flex space-x-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Templates</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Expiry</span>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Tracking</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl">→</span>
              <span className="text-xs text-gray-500 mt-1">Tap</span>
            </div>
          </div>
        </MobileCard>

        {/* Merchant Directory */}
        <MobileCard
          onTap={() => navigateToSystem('merchant')}
          haptic="medium"
          padding="lg"
          className="border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-3xl text-white">🏪</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Merchant Directory</h3>
              <p className="text-sm text-gray-600 mb-2">
                Browse local businesses and manage merchant QR payments
              </p>
              <div className="flex space-x-2">
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Local</span>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Verified</span>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Receipts</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl">→</span>
              <span className="text-xs text-gray-500 mt-1">Tap</span>
            </div>
          </div>
        </MobileCard>

        {/* Payment Security */}
        <MobileCard
          onTap={() => navigateToSystem('security')}
          haptic="medium"
          padding="lg"
          className="border-2 border-red-200 hover:border-red-400 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-3xl text-white">🔐</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Payment Security</h3>
              <p className="text-sm text-gray-600 mb-2">
                Advanced fraud detection, biometrics, and security controls
              </p>
              <div className="flex space-x-2">
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Biometric</span>
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">Fraud AI</span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">2FA</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl">→</span>
              <span className="text-xs text-gray-500 mt-1">Tap</span>
            </div>
          </div>
        </MobileCard>

        {/* API Integration Test */}
        <MobileCard
          onTap={() => navigateToSystem('test')}
          haptic="medium"
          padding="lg"
          className="border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-3xl text-white">🔗</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">API Integration Test</h3>
              <p className="text-sm text-gray-600 mb-2">
                Test the connection between frontend and backend APIs
              </p>
              <div className="flex space-x-2">
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Backend</span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Frontend</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Integration</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl">→</span>
              <span className="text-xs text-gray-500 mt-1">Test</span>
            </div>
          </div>
        </MobileCard>
      </div>

      {/* Stats Summary */}
      <MobileCard padding="lg" className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Advanced Features Deployed</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">⚡</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">5</p>
            <p className="text-sm text-gray-600">Payment Systems</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">🛡️</span>
            </div>
            <p className="text-2xl font-bold text-green-600">100%</p>
            <p className="text-sm text-gray-600">Secure Transactions</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">🌍</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">HTI</p>
            <p className="text-sm text-gray-600">Haiti Ready</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">📱</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">PWA</p>
            <p className="text-sm text-gray-600">Mobile First</p>
          </div>
        </div>
      </MobileCard>

      {/* Technology Showcase */}
      <MobileCard padding="lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Technology Stack</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-sm">📷</span>
            </div>
            <div>
              <p className="font-medium text-sm">Camera API Integration</p>
              <p className="text-xs text-gray-500">Real-time QR code scanning</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-sm">🔗</span>
            </div>
            <div>
              <p className="font-medium text-sm">Web NFC API</p>
              <p className="text-xs text-gray-500">Contactless payment protocol</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-sm">🔐</span>
            </div>
            <div>
              <p className="font-medium text-sm">Biometric Authentication</p>
              <p className="text-xs text-gray-500">WebAuthn & Credential API</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-sm">🤖</span>
            </div>
            <div>
              <p className="font-medium text-sm">AI Fraud Detection</p>
              <p className="text-xs text-gray-500">Real-time risk analysis</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-sm">📳</span>
            </div>
            <div>
              <p className="font-medium text-sm">Haptic Feedback</p>
              <p className="text-xs text-gray-500">Native mobile experience</p>
            </div>
          </div>
        </div>
      </MobileCard>

      {/* Getting Started */}
      <MobileCard padding="lg" className="border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🚀</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to Explore?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Choose any advanced payment feature above to get started with next-generation fintech for Haiti.
          </p>
          <div className="flex space-x-2">
            <MobileButton
              variant="primary"
              size="sm"
              onClick={() => navigateToSystem('qr')}
              className="flex-1"
            >
              Start with QR
            </MobileButton>
            <MobileButton
              variant="secondary"
              size="sm"
              onClick={() => navigateToSystem('nfc')}
              className="flex-1"
            >
              Try NFC
            </MobileButton>
          </div>
        </div>
      </MobileCard>
    </div>
  );
}