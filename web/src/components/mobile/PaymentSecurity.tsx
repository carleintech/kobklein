'use client';

import React, { useState, useEffect } from 'react';
import { MobileButton, MobileCard, MobileModal, useMobileOptimizations } from './MobileOptimizations';

// Security data structures
interface SecurityProfile {
  id: string;
  userId: string;
  biometricEnabled: boolean;
  pinEnabled: boolean;
  twoFactorEnabled: boolean;
  deviceTrusted: boolean;
  riskScore: number; // 0-100, higher = riskier
  lastSecurityCheck: number;
  securityLevel: 'basic' | 'enhanced' | 'maximum';
  fraudAlerts: FraudAlert[];
  trustedDevices: TrustedDevice[];
  paymentLimits: PaymentLimits;
}

interface FraudAlert {
  id: string;
  type: 'suspicious_location' | 'unusual_amount' | 'rapid_transactions' | 'device_change' | 'velocity_check';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  resolved: boolean;
  action?: 'block' | 'verify' | 'monitor';
}

interface TrustedDevice {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  fingerprint: string;
  lastUsed: number;
  trusted: boolean;
  location?: string;
}

interface PaymentLimits {
  daily: number;
  weekly: number;
  monthly: number;
  single: number;
  merchant: number;
}

interface PaymentVerification {
  required: boolean;
  methods: ('biometric' | 'pin' | '2fa' | 'sms' | 'email')[];
  reason: string;
  expiresAt: number;
}

// Biometric Authentication Component
interface BiometricAuthProps {
  onSuccess: (verified: boolean) => void;
  onCancel: () => void;
  amount?: number;
  reason?: string;
}

export function BiometricAuth({ onSuccess, onCancel, amount, reason }: BiometricAuthProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authMethod, setAuthMethod] = useState<'fingerprint' | 'face' | 'pin'>('fingerprint');
  const [pinValue, setPinValue] = useState('');
  const [attempts, setAttempts] = useState(0);
  const { hapticFeedback } = useMobileOptimizations();

  const checkBiometricSupport = (): boolean => {
    return 'PublicKeyCredential' in window && 'navigator' in window && 'credentials' in navigator;
  };

  const authenticateWithBiometric = async () => {
    setIsAuthenticating(true);
    hapticFeedback('medium');

    try {
      if (checkBiometricSupport()) {
        // Simulate biometric authentication
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate success/failure (90% success rate)
        const success = Math.random() > 0.1;
        
        if (success) {
          hapticFeedback('success');
          onSuccess(true);
        } else {
          hapticFeedback('error');
          setAttempts(prev => prev + 1);
          if (attempts >= 2) {
            // Switch to PIN after 3 failed attempts
            setAuthMethod('pin');
          }
        }
      } else {
        // Fallback to PIN
        setAuthMethod('pin');
      }
    } catch (error) {
      console.error('Biometric auth failed:', error);
      hapticFeedback('error');
      setAuthMethod('pin');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const authenticateWithPin = () => {
    if (pinValue.length !== 6) return;
    
    setIsAuthenticating(true);
    hapticFeedback('medium');

    // Simulate PIN verification
    setTimeout(() => {
      const success = pinValue === '123456'; // Demo PIN
      
      if (success) {
        hapticFeedback('success');
        onSuccess(true);
      } else {
        hapticFeedback('error');
        setPinValue('');
        setAttempts(prev => prev + 1);
        
        if (attempts >= 4) {
          // Lock account after 5 failed attempts
          onSuccess(false);
        }
      }
      setIsAuthenticating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🔐</span>
        </div>
        <h2 className="text-xl font-bold">Security Verification</h2>
        <p className="text-gray-600 mt-2">
          {reason || 'Please verify your identity to continue'}
        </p>
        {amount && (
          <p className="text-2xl font-bold text-red-600 mt-2">
            ${amount.toFixed(2)}
          </p>
        )}
      </div>

      {/* Authentication Methods */}
      {authMethod === 'fingerprint' && (
        <div className="space-y-6">
          <div className="text-center">
            <div className={`
              w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-300
              ${isAuthenticating ? 'bg-blue-100 animate-pulse' : 'bg-gray-100'}
            `}>
              <span className="text-5xl">👆</span>
            </div>
            <p className="text-gray-600 mb-4">
              {isAuthenticating ? 'Scanning fingerprint...' : 'Touch the fingerprint sensor'}
            </p>
            {attempts > 0 && (
              <p className="text-red-600 text-sm mb-4">
                Authentication failed. {3 - attempts} attempts remaining.
              </p>
            )}
          </div>

          <div className="space-y-3">
            <MobileButton
              variant="primary"
              size="lg"
              onClick={authenticateWithBiometric}
              loading={isAuthenticating}
              className="w-full"
            >
              {isAuthenticating ? 'Authenticating...' : '👆 Use Fingerprint'}
            </MobileButton>
            
            <MobileButton
              variant="secondary"
              size="md"
              onClick={() => setAuthMethod('pin')}
              className="w-full"
            >
              Use PIN Instead
            </MobileButton>
          </div>
        </div>
      )}

      {authMethod === 'face' && (
        <div className="space-y-6">
          <div className="text-center">
            <div className={`
              w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-300
              ${isAuthenticating ? 'bg-blue-100 animate-pulse' : 'bg-gray-100'}
            `}>
              <span className="text-5xl">👤</span>
            </div>
            <p className="text-gray-600 mb-4">
              {isAuthenticating ? 'Scanning face...' : 'Look at your device camera'}
            </p>
          </div>

          <MobileButton
            variant="primary"
            size="lg"
            onClick={authenticateWithBiometric}
            loading={isAuthenticating}
            className="w-full"
          >
            {isAuthenticating ? 'Scanning...' : '👤 Use Face ID'}
          </MobileButton>
        </div>
      )}

      {authMethod === 'pin' && (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Enter your 6-digit PIN</p>
            <div className="flex justify-center space-x-2 mb-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`
                    w-12 h-12 border-2 rounded-lg flex items-center justify-center
                    ${i < pinValue.length ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                  `}
                >
                  {i < pinValue.length && <span className="text-xl">•</span>}
                </div>
              ))}
            </div>
            {attempts > 0 && (
              <p className="text-red-600 text-sm mb-4">
                Incorrect PIN. {5 - attempts} attempts remaining.
              </p>
            )}
          </div>

          {/* PIN Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <MobileButton
                key={num}
                variant="secondary"
                size="lg"
                onClick={() => {
                  if (pinValue.length < 6) {
                    const newPin = pinValue + num.toString();
                    setPinValue(newPin);
                    hapticFeedback('light');
                    
                    if (newPin.length === 6) {
                      authenticateWithPin();
                    }
                  }
                }}
                className="aspect-square text-xl font-bold"
              >
                {num}
              </MobileButton>
            ))}
            <MobileButton
              variant="secondary"
              size="lg"
              onClick={() => {
                setPinValue(prev => prev.slice(0, -1));
                hapticFeedback('light');
              }}
              className="aspect-square"
            >
              ⌫
            </MobileButton>
            <MobileButton
              variant="secondary"
              size="lg"
              onClick={() => {
                if (pinValue.length < 6) {
                  const newPin = pinValue + '0';
                  setPinValue(newPin);
                  hapticFeedback('light');
                  
                  if (newPin.length === 6) {
                    authenticateWithPin();
                  }
                }
              }}
              className="aspect-square text-xl font-bold"
            >
              0
            </MobileButton>
            <div></div> {/* Empty space */}
          </div>

          <p className="text-center text-sm text-gray-500">
            Demo PIN: 123456
          </p>
        </div>
      )}

      {/* Alternative Methods */}
      <div className="flex space-x-3">
        {checkBiometricSupport() && authMethod !== 'fingerprint' && (
          <MobileButton
            variant="secondary"
            size="sm"
            onClick={() => setAuthMethod('fingerprint')}
            className="flex-1"
          >
            👆 Fingerprint
          </MobileButton>
        )}
        
        <MobileButton
          variant="secondary"
          size="sm"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </MobileButton>
      </div>
    </div>
  );
}

// Fraud Detection Component
interface FraudDetectionProps {
  paymentData: {
    amount: number;
    recipient: string;
    location?: string;
    deviceFingerprint?: string;
  };
  onComplete: (approved: boolean, verification?: PaymentVerification) => void;
}

export function FraudDetection({ paymentData, onComplete }: FraudDetectionProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [riskScore, setRiskScore] = useState(0);
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [decision, setDecision] = useState<'approve' | 'verify' | 'block' | null>(null);
  const { hapticFeedback } = useMobileOptimizations();

  useEffect(() => {
    analyzeFraudRisk();
  }, []);

  const analyzeFraudRisk = async () => {
    // Simulate fraud analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    let score = 0;
    const factors: string[] = [];
    
    // Amount-based risk
    if (paymentData.amount > 1000) {
      score += 30;
      factors.push('Large transaction amount');
    } else if (paymentData.amount > 500) {
      score += 15;
      factors.push('Above average transaction');
    }
    
    // Location-based risk (simulation)
    if (Math.random() > 0.8) {
      score += 25;
      factors.push('Unusual location detected');
    }
    
    // Device-based risk (simulation)
    if (Math.random() > 0.9) {
      score += 20;
      factors.push('New or unrecognized device');
    }
    
    // Time-based risk
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) {
      score += 10;
      factors.push('Transaction outside normal hours');
    }
    
    // Velocity check (simulation)
    if (Math.random() > 0.85) {
      score += 15;
      factors.push('Multiple recent transactions');
    }
    
    setRiskScore(score);
    setRiskFactors(factors);
    
    // Decision logic
    let finalDecision: 'approve' | 'verify' | 'block';
    if (score < 20) {
      finalDecision = 'approve';
    } else if (score < 50) {
      finalDecision = 'verify';
    } else {
      finalDecision = 'block';
    }
    
    setDecision(finalDecision);
    setIsAnalyzing(false);
    
    // Auto-complete based on decision
    setTimeout(() => {
      if (finalDecision === 'approve') {
        hapticFeedback('success');
        onComplete(true);
      } else if (finalDecision === 'verify') {
        hapticFeedback('medium');
        onComplete(false, {
          required: true,
          methods: score > 35 ? ['biometric', 'pin'] : ['pin'],
          reason: 'Additional verification required for security',
          expiresAt: Date.now() + (10 * 60 * 1000) // 10 minutes
        });
      } else {
        hapticFeedback('error');
        onComplete(false);
      }
    }, 2000);
  };

  const getRiskColor = (score: number) => {
    if (score < 20) return 'green';
    if (score < 50) return 'yellow';
    return 'red';
  };

  const getRiskLabel = (score: number) => {
    if (score < 20) return 'Low Risk';
    if (score < 50) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🛡️</span>
        </div>
        <h2 className="text-xl font-bold">Security Analysis</h2>
        <p className="text-gray-600">Checking transaction for fraud indicators</p>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing ? (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing transaction security...</p>
          </div>
          
          <MobileCard padding="md">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Amount verification</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span>Location check</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span>Device fingerprint</span>
                <span className="text-blue-600">⏳</span>
              </div>
              <div className="flex justify-between">
                <span>Behavioral analysis</span>
                <span className="text-gray-400">⏳</span>
              </div>
            </div>
          </MobileCard>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Risk Score */}
          <MobileCard padding="lg" className={`
            border-2 
            ${getRiskColor(riskScore) === 'green' ? 'border-green-200 bg-green-50' : ''}
            ${getRiskColor(riskScore) === 'yellow' ? 'border-yellow-200 bg-yellow-50' : ''}
            ${getRiskColor(riskScore) === 'red' ? 'border-red-200 bg-red-50' : ''}
          `}>
            <div className="text-center">
              <div className={`
                w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3
                ${getRiskColor(riskScore) === 'green' ? 'bg-green-100' : ''}
                ${getRiskColor(riskScore) === 'yellow' ? 'bg-yellow-100' : ''}
                ${getRiskColor(riskScore) === 'red' ? 'bg-red-100' : ''}
              `}>
                <span className="text-2xl font-bold">{riskScore}</span>
              </div>
              <h3 className={`
                text-lg font-bold
                ${getRiskColor(riskScore) === 'green' ? 'text-green-700' : ''}
                ${getRiskColor(riskScore) === 'yellow' ? 'text-yellow-700' : ''}
                ${getRiskColor(riskScore) === 'red' ? 'text-red-700' : ''}
              `}>
                {getRiskLabel(riskScore)}
              </h3>
              <p className="text-sm text-gray-600">Security Risk Score</p>
            </div>
          </MobileCard>

          {/* Transaction Details */}
          <MobileCard padding="md">
            <h4 className="font-semibold mb-3">Transaction Analysis</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">${paymentData.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recipient:</span>
                <span className="font-medium">{paymentData.recipient}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{paymentData.location || 'Port-au-Prince, Haiti'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </MobileCard>

          {/* Risk Factors */}
          {riskFactors.length > 0 && (
            <MobileCard padding="md">
              <h4 className="font-semibold mb-3">Risk Factors Detected</h4>
              <div className="space-y-2">
                {riskFactors.map((factor, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span className="text-sm text-gray-700">{factor}</span>
                  </div>
                ))}
              </div>
            </MobileCard>
          )}

          {/* Decision */}
          <MobileCard padding="lg" className={`
            text-center border-2
            ${decision === 'approve' ? 'border-green-200 bg-green-50' : ''}
            ${decision === 'verify' ? 'border-yellow-200 bg-yellow-50' : ''}
            ${decision === 'block' ? 'border-red-200 bg-red-50' : ''}
          `}>
            <div className="mb-3">
              <span className="text-3xl">
                {decision === 'approve' && '✅'}
                {decision === 'verify' && '⚠️'}
                {decision === 'block' && '🚫'}
              </span>
            </div>
            <h3 className="text-lg font-bold mb-2">
              {decision === 'approve' && 'Transaction Approved'}
              {decision === 'verify' && 'Verification Required'}
              {decision === 'block' && 'Transaction Blocked'}
            </h3>
            <p className="text-sm text-gray-600">
              {decision === 'approve' && 'No security concerns detected. Proceeding with payment.'}
              {decision === 'verify' && 'Additional authentication required for security.'}
              {decision === 'block' && 'Transaction blocked due to high fraud risk.'}
            </p>
          </MobileCard>
        </div>
      )}
    </div>
  );
}

// Security Settings Component
export function SecuritySettings() {
  const [securityProfile, setSecurityProfile] = useState<SecurityProfile>({
    id: 'security_001',
    userId: 'user_001',
    biometricEnabled: true,
    pinEnabled: true,
    twoFactorEnabled: false,
    deviceTrusted: true,
    riskScore: 15,
    lastSecurityCheck: Date.now() - 86400000, // 24 hours ago
    securityLevel: 'enhanced',
    fraudAlerts: [
      {
        id: 'alert_001',
        type: 'unusual_amount',
        severity: 'medium',
        message: 'Large transaction detected: $750.00',
        timestamp: Date.now() - 3600000,
        resolved: true
      }
    ],
    trustedDevices: [
      {
        id: 'device_001',
        name: 'iPhone 13',
        type: 'mobile',
        fingerprint: 'fp_abc123',
        lastUsed: Date.now(),
        trusted: true,
        location: 'Port-au-Prince, Haiti'
      }
    ],
    paymentLimits: {
      daily: 1000,
      weekly: 5000,
      monthly: 20000,
      single: 500,
      merchant: 200
    }
  });

  const [showBiometricSetup, setShowBiometricSetup] = useState(false);
  const [showLimitsModal, setShowLimitsModal] = useState(false);
  const { hapticFeedback } = useMobileOptimizations();

  const toggleSetting = (setting: keyof Pick<SecurityProfile, 'biometricEnabled' | 'pinEnabled' | 'twoFactorEnabled'>) => {
    setSecurityProfile(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    hapticFeedback('medium');
  };

  const updateSecurityLevel = (level: SecurityProfile['securityLevel']) => {
    setSecurityProfile(prev => ({
      ...prev,
      securityLevel: level
    }));
    hapticFeedback('medium');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl text-white">🔐</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Security</h2>
        <p className="text-gray-600">Protect your transactions and account</p>
      </div>

      {/* Security Score */}
      <MobileCard padding="lg" className={`
        border-2 
        ${securityProfile.riskScore < 20 ? 'border-green-200 bg-green-50' : ''}
        ${securityProfile.riskScore >= 20 && securityProfile.riskScore < 50 ? 'border-yellow-200 bg-yellow-50' : ''}
        ${securityProfile.riskScore >= 50 ? 'border-red-200 bg-red-50' : ''}
      `}>
        <div className="text-center">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3
            ${securityProfile.riskScore < 20 ? 'bg-green-100' : ''}
            ${securityProfile.riskScore >= 20 && securityProfile.riskScore < 50 ? 'bg-yellow-100' : ''}
            ${securityProfile.riskScore >= 50 ? 'bg-red-100' : ''}
          `}>
            <span className="text-xl font-bold">{100 - securityProfile.riskScore}</span>
          </div>
          <h3 className="text-lg font-bold">Security Score</h3>
          <p className="text-sm text-gray-600 capitalize">
            {securityProfile.securityLevel} protection level
          </p>
        </div>
      </MobileCard>

      {/* Security Level */}
      <MobileCard padding="lg">
        <h3 className="font-semibold mb-4">Security Level</h3>
        <div className="space-y-3">
          {[
            { level: 'basic', label: 'Basic', description: 'PIN protection only' },
            { level: 'enhanced', label: 'Enhanced', description: 'PIN + biometrics + fraud detection' },
            { level: 'maximum', label: 'Maximum', description: 'All security features + 2FA' }
          ].map((option) => (
            <div
              key={option.level}
              onClick={() => updateSecurityLevel(option.level as any)}
              className={`
                flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors
                ${securityProfile.securityLevel === option.level 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center
                ${securityProfile.securityLevel === option.level 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
                }
              `}>
                {securityProfile.securityLevel === option.level && (
                  <span className="text-white text-xs">•</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{option.label}</p>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      </MobileCard>

      {/* Authentication Methods */}
      <MobileCard padding="lg">
        <h3 className="font-semibold mb-4">Authentication Methods</h3>
        <div className="space-y-4">
          {[
            {
              key: 'biometricEnabled',
              label: 'Biometric Authentication',
              description: 'Fingerprint, Face ID, or Voice',
              icon: '👆',
              enabled: securityProfile.biometricEnabled
            },
            {
              key: 'pinEnabled',
              label: 'PIN Security',
              description: '6-digit PIN for payments',
              icon: '🔢',
              enabled: securityProfile.pinEnabled
            },
            {
              key: 'twoFactorEnabled',
              label: 'Two-Factor Authentication',
              description: 'SMS or app-based 2FA',
              icon: '📱',
              enabled: securityProfile.twoFactorEnabled
            }
          ].map((method) => (
            <div
              key={method.key}
              onClick={() => toggleSetting(method.key as any)}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">{method.icon}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">{method.label}</p>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
              <div className={`
                w-12 h-6 rounded-full transition-colors
                ${method.enabled ? 'bg-blue-500' : 'bg-gray-300'}
              `}>
                <div className={`
                  w-5 h-5 bg-white rounded-full shadow transform transition-transform
                  ${method.enabled ? 'translate-x-6' : 'translate-x-0.5'}
                `}></div>
              </div>
            </div>
          ))}
        </div>
      </MobileCard>

      {/* Payment Limits */}
      <MobileCard padding="lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Payment Limits</h3>
          <MobileButton
            variant="secondary"
            size="sm"
            onClick={() => setShowLimitsModal(true)}
          >
            Edit
          </MobileButton>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="font-medium">${securityProfile.paymentLimits.single}</p>
            <p className="text-gray-600">Single Payment</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="font-medium">${securityProfile.paymentLimits.daily}</p>
            <p className="text-gray-600">Daily Limit</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="font-medium">${securityProfile.paymentLimits.weekly}</p>
            <p className="text-gray-600">Weekly Limit</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="font-medium">${securityProfile.paymentLimits.monthly}</p>
            <p className="text-gray-600">Monthly Limit</p>
          </div>
        </div>
      </MobileCard>

      {/* Trusted Devices */}
      <MobileCard padding="lg">
        <h3 className="font-semibold mb-3">Trusted Devices</h3>
        <div className="space-y-3">
          {securityProfile.trustedDevices.map((device) => (
            <div key={device.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">
                  {device.type === 'mobile' ? '📱' : device.type === 'desktop' ? '💻' : '📱'}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium">{device.name}</p>
                <p className="text-sm text-gray-500">{device.location}</p>
                <p className="text-xs text-gray-400">
                  Last used: {new Date(device.lastUsed).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  ✓ Trusted
                </span>
              </div>
            </div>
          ))}
        </div>
      </MobileCard>

      {/* Recent Alerts */}
      {securityProfile.fraudAlerts.length > 0 && (
        <MobileCard padding="lg">
          <h3 className="font-semibold mb-3">Security Alerts</h3>
          <div className="space-y-3">
            {securityProfile.fraudAlerts.map((alert) => (
              <div key={alert.id} className={`
                p-3 rounded-lg border-l-4
                ${alert.severity === 'critical' ? 'border-red-500 bg-red-50' : ''}
                ${alert.severity === 'high' ? 'border-orange-500 bg-orange-50' : ''}
                ${alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' : ''}
                ${alert.severity === 'low' ? 'border-blue-500 bg-blue-50' : ''}
              `}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`
                    text-xs font-medium px-2 py-1 rounded-full
                    ${alert.severity === 'critical' ? 'bg-red-100 text-red-700' : ''}
                    ${alert.severity === 'high' ? 'bg-orange-100 text-orange-700' : ''}
                    ${alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                    ${alert.severity === 'low' ? 'bg-blue-100 text-blue-700' : ''}
                  `}>
                    {alert.severity.toUpperCase()}
                  </span>
                  {alert.resolved && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Resolved
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium mb-1">{alert.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </MobileCard>
      )}

      {/* Payment Limits Modal */}
      <MobileModal
        isOpen={showLimitsModal}
        onClose={() => setShowLimitsModal(false)}
        title="Edit Payment Limits"
        size="lg"
      >
        <div className="space-y-4">
          {[
            { key: 'single', label: 'Single Payment', value: securityProfile.paymentLimits.single },
            { key: 'daily', label: 'Daily Limit', value: securityProfile.paymentLimits.daily },
            { key: 'weekly', label: 'Weekly Limit', value: securityProfile.paymentLimits.weekly },
            { key: 'monthly', label: 'Monthly Limit', value: securityProfile.paymentLimits.monthly }
          ].map((limit) => (
            <div key={limit.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {limit.label} (USD)
              </label>
              <input
                type="number"
                defaultValue={limit.value}
                className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value) || 0;
                  setSecurityProfile(prev => ({
                    ...prev,
                    paymentLimits: {
                      ...prev.paymentLimits,
                      [limit.key]: newValue
                    }
                  }));
                }}
              />
            </div>
          ))}
          
          <div className="grid grid-cols-2 gap-3 mt-6">
            <MobileButton
              variant="secondary"
              size="lg"
              onClick={() => setShowLimitsModal(false)}
              className="w-full"
            >
              Cancel
            </MobileButton>
            <MobileButton
              variant="primary"
              size="lg"
              onClick={() => {
                setShowLimitsModal(false);
                hapticFeedback('success');
              }}
              className="w-full"
            >
              Save Changes
            </MobileButton>
          </div>
        </div>
      </MobileModal>
    </div>
  );
}

// Main Security System Component
export function AdvancedPaymentSecurity() {
  const [currentView, setCurrentView] = useState<'settings' | 'biometric' | 'fraud'>('settings');
  const [showBiometric, setShowBiometric] = useState(false);
  const [showFraud, setShowFraud] = useState(false);
  
  const demoPaymentData = {
    amount: 250.00,
    recipient: 'Local Merchant',
    location: 'Port-au-Prince, Haiti',
    deviceFingerprint: 'fp_demo_123'
  };

  if (showBiometric) {
    return (
      <BiometricAuth
        amount={demoPaymentData.amount}
        reason="Verify payment to Local Merchant"
        onSuccess={(verified) => {
          console.log('Biometric auth result:', verified);
          setShowBiometric(false);
        }}
        onCancel={() => setShowBiometric(false)}
      />
    );
  }

  if (showFraud) {
    return (
      <FraudDetection
        paymentData={demoPaymentData}
        onComplete={(approved, verification) => {
          console.log('Fraud detection result:', { approved, verification });
          setShowFraud(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SecuritySettings />
      
      {/* Demo Buttons */}
      <MobileCard padding="lg">
        <h3 className="font-semibold mb-3">Security Demos</h3>
        <div className="space-y-3">
          <MobileButton
            variant="secondary"
            size="md"
            onClick={() => setShowBiometric(true)}
            className="w-full"
          >
            🔐 Test Biometric Authentication
          </MobileButton>
          <MobileButton
            variant="secondary"
            size="md"
            onClick={() => setShowFraud(true)}
            className="w-full"
          >
            🛡️ Test Fraud Detection
          </MobileButton>
        </div>
      </MobileCard>
    </div>
  );
}