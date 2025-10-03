/**
 * Biometric Authentication Component
 * Provides biometric authentication interface for secure access
 */

"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBiometricAuth, useHaptics } from "@/hooks/use-device-integration";
import {
  AlertTriangle,
  CheckCircle,
  Fingerprint,
  Shield,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface BiometricSetupProps {
  userId: string;
  userName: string;
  onSetupComplete?: (success: boolean) => void;
}

export function BiometricSetup({
  userId,
  userName,
  onSetupComplete,
}: BiometricSetupProps) {
  const { isSupported, createCredential } = useBiometricAuth();
  const { success: hapticSuccess, error: hapticError } = useHaptics();
  const [isSetupLoading, setIsSetupLoading] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [setupSuccess, setSetupSuccess] = useState(false);

  const handleSetup = async () => {
    setIsSetupLoading(true);
    setSetupError(null);

    try {
      const success = await createCredential(userId, userName);
      setSetupSuccess(success);

      if (success) {
        hapticSuccess();
        onSetupComplete?.(true);
      } else {
        hapticError();
        setSetupError("Failed to set up biometric authentication");
        onSetupComplete?.(false);
      }
    } catch (error) {
      hapticError();
      setSetupError(error instanceof Error ? error.message : "Setup failed");
      onSetupComplete?.(false);
    } finally {
      setIsSetupLoading(false);
    }
  };

  if (isSupported === false) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Biometric authentication is not supported on this device.
        </AlertDescription>
      </Alert>
    );
  }

  if (isSupported === null) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Checking biometric support...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Fingerprint className="h-5 w-5" />
          <span>Biometric Authentication Setup</span>
        </CardTitle>
        <CardDescription>
          Set up fingerprint or face authentication for quick and secure access
          to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {setupSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Setup Complete!
            </h3>
            <p className="text-gray-500">
              You can now use biometric authentication to access your KobKlein
              account.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Fingerprint className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Secure Your Account
                </h3>
                <p className="text-gray-500 mb-6">
                  Use your fingerprint or face to quickly and securely access
                  your account
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">
                    Enhanced Security
                  </h4>
                  <p className="text-sm text-green-700">
                    Your biometric data stays on your device
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-900">Quick Access</h4>
                  <p className="text-sm text-blue-700">
                    Log in instantly without typing passwords
                  </p>
                </div>
              </div>
            </div>

            {setupError && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{setupError}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleSetup}
              disabled={isSetupLoading}
              className="w-full"
              size="lg"
            >
              {isSetupLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Setting up...
                </>
              ) : (
                <>
                  <Fingerprint className="h-4 w-4 mr-2" />
                  Set Up Biometric Authentication
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface BiometricLoginProps {
  onAuthSuccess?: () => void;
  onAuthFailure?: (error: string) => void;
  challenge?: string;
}

export function BiometricLogin({
  onAuthSuccess,
  onAuthFailure,
  challenge = "login",
}: BiometricLoginProps) {
  const { isSupported, authenticate, error } = useBiometricAuth();
  const { success: hapticSuccess, error: hapticError } = useHaptics();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuthenticate = async () => {
    setIsAuthenticating(true);

    try {
      const result = await authenticate(challenge);

      if (result.success) {
        hapticSuccess();
        onAuthSuccess?.();
      } else {
        hapticError();
        onAuthFailure?.(result.error || "Authentication failed");
      }
    } catch (error) {
      hapticError();
      onAuthFailure?.(
        error instanceof Error ? error.message : "Authentication failed"
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Fingerprint className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Biometric Login
        </h3>
        <p className="text-gray-500 mb-6">
          Use your fingerprint or face to authenticate
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleAuthenticate}
        disabled={isAuthenticating}
        className="w-full"
        size="lg"
      >
        {isAuthenticating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Authenticating...
          </>
        ) : (
          <>
            <Fingerprint className="h-4 w-4 mr-2" />
            Authenticate with Biometrics
          </>
        )}
      </Button>
    </div>
  );
}

interface BiometricIndicatorProps {
  isEnabled: boolean;
  className?: string;
}

export function BiometricIndicator({
  isEnabled,
  className = "",
}: BiometricIndicatorProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Fingerprint
        className={`h-4 w-4 ${isEnabled ? "text-green-500" : "text-gray-400"}`}
      />
      <Badge variant={isEnabled ? "default" : "secondary"}>
        {isEnabled ? "Biometrics Enabled" : "Biometrics Disabled"}
      </Badge>
    </div>
  );
}

