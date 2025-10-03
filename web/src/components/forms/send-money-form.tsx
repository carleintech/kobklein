"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MobileCard, QuickActionCard } from "@/components/ui/mobile-cards";
import { QRScanner } from "@/components/ui/qr-scanner";
import { TouchInput, TouchNumberPad } from "@/components/ui/touch-input";
import { useOfflineStorage, usePWA } from "@/contexts/PWAContext";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  DollarSign,
  Loader,
  QrCode,
  Shield,
  Users,
  WifiOff,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

interface SendMoneyFormProps {
  onBack?: () => void;
  onSuccess?: (transaction: any) => void;
}

type Step =
  | "recipient"
  | "amount"
  | "method"
  | "review"
  | "pin"
  | "processing"
  | "success";

interface Recipient {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatar?: string;
  type: "contact" | "qr" | "manual";
}

interface PaymentMethod {
  id: string;
  name: string;
  type: "balance" | "card" | "bank";
  balance?: string;
  last4?: string;
  fees?: number;
  icon: React.ComponentType<{ className?: string }>;
}

export function SendMoneyForm({ onBack, onSuccess }: SendMoneyFormProps) {
  const [step, setStep] = useState<Step>("recipient");
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const [pin, setPin] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [recentContacts] = useState<Recipient[]>([
    {
      id: "1",
      name: "Marie Dubois",
      phone: "+509 1234 5678",
      type: "contact",
    },
    {
      id: "2",
      name: "Jean Baptiste",
      phone: "+509 8765 4321",
      type: "contact",
    },
    {
      id: "3",
      name: "Rose Sanon",
      email: "rose@example.com",
      type: "contact",
    },
  ]);

  const { isOffline } = usePWA();
  const { storeOfflineTransaction } = useOfflineStorage();

  const paymentMethods: PaymentMethod[] = useMemo(
    () => [
      {
        id: "balance",
        name: "KobKlein Balance",
        type: "balance",
        balance: "$250.00",
        fees: 0,
        icon: DollarSign,
      },
      {
        id: "card1",
        name: "Credit Card",
        type: "card",
        last4: "4532",
        fees: 2.9,
        icon: CreditCard,
      },
    ],
    []
  );

  // Auto-select balance as default payment method
  useEffect(() => {
    if (!paymentMethod) {
      setPaymentMethod(paymentMethods[0]);
    }
  }, [paymentMethod, paymentMethods]);

  const handleQRScan = (data: string) => {
    try {
      // Parse QR code data (mock implementation)
      const url = new URL(data);
      if (url.protocol === "kobklein:" && url.hostname === "pay") {
        const recipientId = url.searchParams.get("recipient");
        const qrAmount = url.searchParams.get("amount");

        if (recipientId) {
          setRecipient({
            id: recipientId,
            name: `User ${recipientId}`,
            type: "qr",
          });

          if (qrAmount) {
            setAmount(qrAmount);
            setStep("review");
          } else {
            setStep("amount");
          }
        }
      }
      setShowScanner(false);
    } catch (error) {
      setError("Invalid QR code format");
    }
  };

  const handleManualRecipient = (phone: string) => {
    if (phone.length >= 10) {
      setRecipient({
        id: `manual_${phone}`,
        name: phone,
        phone,
        type: "manual",
      });
      setStep("amount");
    }
  };

  const calculateTotal = () => {
    const baseAmount = parseFloat(amount) || 0;
    const fees = paymentMethod?.fees
      ? (baseAmount * paymentMethod.fees) / 100
      : 0;
    return baseAmount + fees;
  };

  const handleSubmit = async () => {
    if (!recipient || !amount || !paymentMethod) return;

    setIsProcessing(true);
    setError("");

    const transaction = {
      id: `tx_${Date.now()}`,
      recipient,
      amount: parseFloat(amount),
      note,
      paymentMethod,
      total: calculateTotal(),
      timestamp: new Date(),
      status: "pending",
    };

    try {
      if (isOffline) {
        // Store for background sync
        await storeOfflineTransaction(transaction);
        setStep("success");
        setTimeout(() => {
          onSuccess?.(transaction);
        }, 2000);
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setStep("success");
        setTimeout(() => {
          onSuccess?.(transaction);
        }, 2000);
      }
    } catch (error) {
      setError("Transaction failed. Please try again.");
      setStep("review");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBiometricAuth = async () => {
    // Mock biometric authentication
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  };

  if (showScanner) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowScanner(false)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">Scan QR Code</h2>
        </div>

        <QRScanner
          onScan={handleQRScan}
          onError={setError}
          onClose={() => setShowScanner(false)}
        />

        {error && (
          <div className="text-center p-4 bg-destructive/10 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-xl font-bold">Send Money</h1>
        </div>

        {isOffline && (
          <Badge variant="destructive" className="flex items-center space-x-1">
            <WifiOff className="h-3 w-3" />
            <span>Offline</span>
          </Badge>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-2">
        {["recipient", "amount", "method", "review", "pin"].map(
          (stepName, index) => (
            <div
              key={stepName}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                ["recipient", "amount", "method", "review", "pin"].indexOf(
                  step
                ) >= index
                  ? "bg-primary"
                  : "bg-muted"
              )}
            />
          )
        )}
      </div>

      {/* Step Content */}
      {step === "recipient" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <QuickActionCard
              icon={QrCode}
              title="Scan QR"
              description="Quick payment"
              onClick={() => setShowScanner(true)}
              variant="primary"
            />
            <QuickActionCard
              icon={Users}
              title="Contacts"
              description="From phone"
              onClick={() => {
                /* Open contacts */
              }}
            />
          </div>

          <div>
            <h3 className="font-medium mb-3">Recent Contacts</h3>
            <div className="space-y-2">
              {recentContacts.map((contact) => (
                <MobileCard key={contact.id} interactive>
                  <button
                    onClick={() => {
                      setRecipient(contact);
                      setStep("amount");
                    }}
                    className="w-full p-3 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {contact.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {contact.phone || contact.email}
                        </p>
                      </div>
                    </div>
                  </button>
                </MobileCard>
              ))}
            </div>
          </div>

          <div>
            <TouchInput
              label="Phone Number"
              type="tel"
              placeholder="+509 1234 5678"
              onChange={(e) => handleManualRecipient(e.target.value)}
            />
          </div>
        </div>
      )}

      {step === "amount" && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="font-medium text-lg">Send to {recipient?.name}</h3>
            <p className="text-sm text-muted-foreground">
              {recipient?.phone || recipient?.email}
            </p>
          </div>

          <TouchNumberPad
            value={amount}
            onChange={setAmount}
            currency
            onSubmit={() => setStep("method")}
            submitLabel="Continue"
          />

          <TouchInput
            label="Note (Optional)"
            placeholder="What's this for?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      )}

      {step === "method" && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="font-medium text-lg">Payment Method</h3>
            <p className="text-sm text-muted-foreground">
              Choose how to send ${amount}
            </p>
          </div>

          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <MobileCard
                  key={method.id}
                  interactive
                  className={cn(
                    "border-2",
                    paymentMethod?.id === method.id
                      ? "border-primary bg-primary/5"
                      : "border-transparent"
                  )}
                >
                  <button
                    onClick={() => setPaymentMethod(method)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-accent/10">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{method.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {method.balance
                              ? `Balance: ${method.balance}`
                              : method.last4
                              ? `•••• ${method.last4}`
                              : ""}
                          </p>
                        </div>
                      </div>
                      {method.fees && method.fees > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {method.fees}% fee
                        </Badge>
                      )}
                    </div>
                  </button>
                </MobileCard>
              );
            })}
          </div>

          <Button
            onClick={() => setStep("review")}
            className="w-full"
            disabled={!paymentMethod}
          >
            Continue
          </Button>
        </div>
      )}

      {step === "review" && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="font-medium text-lg">Review Transaction</h3>
          </div>

          <MobileCard>
            <div className="p-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recipient</span>
                <span className="font-medium">{recipient?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">${amount}</span>
              </div>
              {paymentMethod?.fees && paymentMethod.fees > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fee</span>
                  <span className="font-medium">
                    $
                    {(
                      ((parseFloat(amount) || 0) * paymentMethod.fees) /
                      100
                    ).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-lg">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
              {note && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Note: {note}</p>
                </div>
              )}
            </div>
          </MobileCard>

          {error && (
            <div className="p-4 bg-destructive/10 rounded-lg">
              <p className="text-sm text-destructive text-center">{error}</p>
            </div>
          )}

          <Button onClick={() => setStep("pin")} className="w-full" size="lg">
            <Shield className="h-4 w-4 mr-2" />
            Confirm Payment
          </Button>
        </div>
      )}

      {step === "pin" && (
        <div className="space-y-6">
          <div className="text-center">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-medium text-lg">Security Verification</h3>
            <p className="text-sm text-muted-foreground">
              Enter your PIN to authorize this payment
            </p>
          </div>

          <TouchNumberPad
            value={pin}
            onChange={setPin}
            maxLength={6}
            onSubmit={handleSubmit}
            submitLabel="Send Money"
            biometric
            onBiometricAuth={handleBiometricAuth}
          />
        </div>
      )}

      {step === "processing" && (
        <div className="text-center space-y-6 py-12">
          <Loader className="h-16 w-16 text-primary animate-spin mx-auto" />
          <div>
            <h3 className="font-medium text-lg">Processing Payment</h3>
            <p className="text-sm text-muted-foreground">
              {isOffline ? "Payment queued for when online" : "Please wait..."}
            </p>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="text-center space-y-6 py-12">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <div>
            <h3 className="font-medium text-lg text-green-600">
              Payment {isOffline ? "Queued" : "Sent"}!
            </h3>
            <p className="text-sm text-muted-foreground">
              ${amount} to {recipient?.name}
            </p>
            {isOffline && (
              <p className="text-xs text-muted-foreground mt-2">
                Will be processed when connection is restored
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

