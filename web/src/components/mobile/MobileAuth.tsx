'use client';

import React, { useState } from 'react';
import { MobileButton, MobileInput, MobileCard, useMobileOptimizations } from './MobileOptimizations';

interface MobileAuthFlowProps {
  mode?: 'signin' | 'signup' | 'reset';
  onComplete?: (user: any) => void;
  onModeChange?: (mode: 'signin' | 'signup' | 'reset') => void;
}

export function MobileAuthFlow({ 
  mode = 'signin', 
  onComplete, 
  onModeChange 
}: MobileAuthFlowProps) {
  const { hapticFeedback, isMobile } = useMobileOptimizations();
  
  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (mode === 'signup' && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Signup-specific validations
    if (mode === 'signup') {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      hapticFeedback('error');
      return;
    }

    setIsLoading(true);
    hapticFeedback('medium');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const user = {
        id: Date.now().toString(),
        email: formData.email,
        firstName: formData.firstName || formData.email.split('@')[0],
        lastName: formData.lastName || '',
        phone: formData.phone,
      };

      hapticFeedback('success');
      onComplete?.(user);
    } catch (error) {
      hapticFeedback('error');
      setErrors({ general: 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (newMode: 'signin' | 'signup' | 'reset') => {
    hapticFeedback('light');
    setErrors({});
    onModeChange?.(newMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 pt-12 pb-8 safe-area-top">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-white">K</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">KobKlein</h1>
          <p className="text-blue-100">
            {mode === 'signin' && 'Welcome back!'}
            {mode === 'signup' && 'Join the community'}
            {mode === 'reset' && 'Reset your password'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 py-8">
        <MobileCard padding="lg" className="max-w-md mx-auto">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'signin' && 'Sign In'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'reset' && 'Reset Password'}
              </h2>
            </div>

            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            )}

            {/* Form fields */}
            <div className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <MobileInput
                      label="First Name"
                      type="text"
                      value={formData.firstName}
                      onChange={(value) => updateField('firstName', value)}
                      error={errors.firstName}
                      autoComplete="given-name"
                      required
                    />
                    <MobileInput
                      label="Last Name"
                      type="text"
                      value={formData.lastName}
                      onChange={(value) => updateField('lastName', value)}
                      error={errors.lastName}
                      autoComplete="family-name"
                      required
                    />
                  </div>

                  <MobileInput
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={(value) => updateField('phone', value)}
                    error={errors.phone}
                    placeholder="+509 1234 5678"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                  />
                </>
              )}

              <MobileInput
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(value) => updateField('email', value)}
                error={errors.email}
                placeholder="your@email.com"
                inputMode="email"
                autoComplete="email"
                required
              />

              {mode !== 'reset' && (
                <>
                  <div className="relative">
                    <MobileInput
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(value) => updateField('password', value)}
                      error={errors.password}
                      placeholder="Enter your password"
                      autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowPassword(!showPassword);
                        hapticFeedback('light');
                      }}
                      className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                    >
                      <span className="text-sm">
                        {showPassword ? '🙈' : '👁️'}
                      </span>
                    </button>
                  </div>

                  {mode === 'signup' && (
                    <MobileInput
                      label="Confirm Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(value) => updateField('confirmPassword', value)}
                      error={errors.confirmPassword}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      required
                    />
                  )}
                </>
              )}
            </div>

            {/* Submit button */}
            <MobileButton
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              loading={isLoading}
              haptic="medium"
              className="w-full"
            >
              {mode === 'signin' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'reset' && 'Send Reset Link'}
            </MobileButton>

            {/* Mode switching */}
            <div className="space-y-3 text-center text-sm">
              {mode === 'signin' && (
                <>
                  <button
                    onClick={() => handleModeChange('reset')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Forgot your password?
                  </button>
                  <div className="text-gray-600">
                    Don't have an account?{' '}
                    <button
                      onClick={() => handleModeChange('signup')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Sign up
                    </button>
                  </div>
                </>
              )}

              {mode === 'signup' && (
                <div className="text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => handleModeChange('signin')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Sign in
                  </button>
                </div>
              )}

              {mode === 'reset' && (
                <div className="text-gray-600">
                  Remember your password?{' '}
                  <button
                    onClick={() => handleModeChange('signin')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>

            {/* Social auth (Haiti-specific) */}
            {mode !== 'reset' && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <MobileButton
                    variant="secondary"
                    size="md"
                    onClick={() => hapticFeedback('medium')}
                    className="flex items-center justify-center space-x-2"
                  >
                    <span>📱</span>
                    <span>SMS</span>
                  </MobileButton>
                  
                  <MobileButton
                    variant="secondary"
                    size="md"
                    onClick={() => hapticFeedback('medium')}
                    className="flex items-center justify-center space-x-2"
                  >
                    <span>🌐</span>
                    <span>Google</span>
                  </MobileButton>
                </div>
              </>
            )}

            {/* Terms and privacy */}
            {mode === 'signup' && (
              <div className="text-xs text-gray-600 text-center leading-relaxed">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Privacy Policy
                </a>
              </div>
            )}
          </div>
        </MobileCard>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 text-center text-xs text-gray-500 safe-area-bottom">
        <p>🇭🇹 Made for Haiti and the diaspora community</p>
        <p className="mt-1">Secure • Fast • Reliable</p>
      </div>
    </div>
  );
}

// Biometric authentication component for supported devices
interface BiometricAuthProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  onFallback: () => void;
}

export function BiometricAuth({ onSuccess, onError, onFallback }: BiometricAuthProps) {
  const { hapticFeedback } = useMobileOptimizations();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authenticateWithBiometric = async () => {
    setIsAuthenticating(true);
    hapticFeedback('medium');

    try {
      // Check if Web Authentication API is available
      if (!window.PublicKeyCredential) {
        throw new Error('Biometric authentication not supported');
      }

      // Check for biometric authentication availability
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      
      if (!available) {
        throw new Error('No biometric authenticator available');
      }

      // Create authentication options
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: "KobKlein",
            id: "kobklein.com",
          },
          user: {
            id: new TextEncoder().encode("user123"),
            name: "user@example.com",
            displayName: "User",
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
          },
        },
      });

      if (credential) {
        hapticFeedback('success');
        onSuccess();
      }
    } catch (error) {
      hapticFeedback('error');
      const errorMessage = error instanceof Error ? error.message : 'Biometric authentication failed';
      onError(errorMessage);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <MobileCard padding="lg" className="text-center">
      <div className="space-y-6">
        <div>
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Secure Authentication
          </h3>
          <p className="text-gray-600 text-sm">
            Use your fingerprint or face ID to sign in securely
          </p>
        </div>

        <MobileButton
          variant="primary"
          size="lg"
          onClick={authenticateWithBiometric}
          loading={isAuthenticating}
          haptic="medium"
          className="w-full"
        >
          {isAuthenticating ? 'Authenticating...' : 'Use Biometric'}
        </MobileButton>

        <MobileButton
          variant="secondary"
          size="md"
          onClick={() => {
            hapticFeedback('light');
            onFallback();
          }}
          className="w-full"
        >
          Use Password Instead
        </MobileButton>
      </div>
    </MobileCard>
  );
}