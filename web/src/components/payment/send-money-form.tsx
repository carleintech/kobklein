"use client";

import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Loader2,
  Phone,
  QrCode,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useRealtimeBalance } from "@/contexts/WebSocketContext";
import { useSendPayment, useWalletBalance } from "@/hooks/use-api";
import { formatCurrency } from "@/lib/utils";
import type { PaymentRequest } from "@/types/api";

interface SendMoneyFormProps {
  onSuccess?: (transaction: any) => void;
  onError?: (error: string) => void;
  prefilledRecipient?: {
    id?: string;
    phone?: string;
    name?: string;
  };
}

export function SendMoneyForm({
  onSuccess,
  onError,
  prefilledRecipient,
}: SendMoneyFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<"recipient" | "amount" | "confirmation">(
    "recipient"
  );

  // Form state
  const [recipientType, setRecipientType] = useState<
    "phone" | "qr" | "contact"
  >("phone");
  const [recipientPhone, setRecipientPhone] = useState(
    prefilledRecipient?.phone || ""
  );
  const [recipientName, setRecipientName] = useState(
    prefilledRecipient?.name || ""
  );
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"HTG" | "USD">("HTG");
  const [description, setDescription] = useState("");
  const [pin, setPin] = useState("");

  // API hooks
  const { data: walletData, isLoading: walletLoading } = useWalletBalance();
  const {
    mutate: sendPayment,
    isPending: isSending,
    error: sendError,
  } = useSendPayment();

  // Real-time balance updates
  const { balance: realtimeBalance } = useRealtimeBalance();

  // Use real-time balance if available, otherwise fall back to API data
  const currentBalance = realtimeBalance || walletData?.data;

  // Quick amount presets
  const quickAmounts = [
    { amount: 100, label: "100 HTG" },
    { amount: 250, label: "250 HTG" },
    { amount: 500, label: "500 HTG" },
    { amount: 1000, label: "1,000 HTG" },
    { amount: 2500, label: "2,500 HTG" },
    { amount: 5000, label: "5,000 HTG" },
  ];

  const validateRecipient = () => {
    if (recipientType === "phone" && !recipientPhone) {
      onError?.("Please enter recipient phone number");
      return false;
    }
    return true;
  };

  const validateAmount = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      onError?.("Please enter a valid amount");
      return false;
    }

    if (currentBalance) {
      const availableBalance =
        currency === "HTG" ? currentBalance.htg : currentBalance.usd;
      if (numAmount > availableBalance) {
        onError?.("Insufficient balance");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (step === "recipient" && validateRecipient()) {
      setStep("amount");
    } else if (step === "amount" && validateAmount()) {
      setStep("confirmation");
    }
  };

  const handleSendPayment = () => {
    if (!pin) {
      onError?.("Please enter your PIN");
      return;
    }

    const paymentRequest: PaymentRequest = {
      type: "transfer",
      amount: parseFloat(amount),
      currency,
      recipientPhone,
      description: description || undefined,
      pin,
    };

    sendPayment(paymentRequest, {
      onSuccess: (data) => {
        onSuccess?.(data.data);
        router.push("/dashboard/client");
      },
      onError: (error: any) => {
        onError?.(error.response?.data?.message || "Payment failed");
      },
    });
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-6">
      {["recipient", "amount", "confirmation"].map((stepName, index) => {
        const isActive = step === stepName;
        const isCompleted =
          ["recipient", "amount", "confirmation"].indexOf(step) > index;

        return (
          <div key={stepName} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                isActive
                  ? "bg-blue-600 text-white"
                  : isCompleted
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
            </div>
            {index < 2 && (
              <div
                className={`w-16 h-0.5 ${
                  isCompleted ? "bg-green-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderRecipientStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Select Recipient
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recipient Type Selection */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={recipientType === "phone" ? "default" : "outline"}
            onClick={() => setRecipientType("phone")}
            className="flex-col h-auto py-3"
          >
            <Phone className="h-4 w-4 mb-1" />
            <span className="text-xs">Phone</span>
          </Button>
          <Button
            variant={recipientType === "qr" ? "default" : "outline"}
            onClick={() => setRecipientType("qr")}
            className="flex-col h-auto py-3"
          >
            <QrCode className="h-4 w-4 mb-1" />
            <span className="text-xs">QR Code</span>
          </Button>
          <Button
            variant={recipientType === "contact" ? "default" : "outline"}
            onClick={() => setRecipientType("contact")}
            className="flex-col h-auto py-3"
          >
            <User className="h-4 w-4 mb-1" />
            <span className="text-xs">Contact</span>
          </Button>
        </div>

        <Separator />

        {/* Phone Number Input */}
        {recipientType === "phone" && (
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+509 XXXX XXXX"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              className="text-lg"
            />
            <p className="text-sm text-muted-foreground">
              Enter the recipient's phone number registered with KobKlein
            </p>
          </div>
        )}

        {/* QR Code Scanner */}
        {recipientType === "qr" && (
          <div className="text-center py-8">
            <QrCode className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-muted-foreground mb-4">
              QR code scanning will be implemented
            </p>
            <Button variant="outline">Open Camera Scanner</Button>
          </div>
        )}

        {/* Contact Selection */}
        {recipientType === "contact" && (
          <div className="text-center py-8">
            <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-muted-foreground mb-4">
              Contact selection will be implemented
            </p>
            <Button variant="outline">Select from Contacts</Button>
          </div>
        )}

        {/* Recipient Name (Optional) */}
        {recipientType === "phone" && recipientPhone && (
          <div className="space-y-2">
            <Label htmlFor="name">Recipient Name (Optional)</Label>
            <Input
              id="name"
              placeholder="Enter recipient's name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
          </div>
        )}

        <Button
          onClick={handleNext}
          className="w-full"
          disabled={!recipientPhone}
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );

  const renderAmountStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Enter Amount
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Balance Display */}
        {currentBalance && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">
              Available Balance
            </p>
            <div className="flex justify-between text-lg font-bold text-blue-700">
              <span>{formatCurrency(currentBalance.htg, "HTG")}</span>
              <span>{formatCurrency(currentBalance.usd, "USD")}</span>
            </div>
          </div>
        )}

        {/* Currency Selection */}
        <div className="space-y-2">
          <Label>Currency</Label>
          <Select
            value={currency}
            onValueChange={(value: "HTG" | "USD") => setCurrency(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HTG">HTG (Haitian Gourde)</SelectItem>
              <SelectItem value="USD">USD (US Dollar)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-2xl font-bold text-center"
            min="0"
            step="0.01"
          />
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {quickAmounts.map((preset) => (
            <Button
              key={preset.amount}
              variant="outline"
              size="sm"
              onClick={() => setAmount(preset.amount.toString())}
              className="text-xs"
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Message (Optional)</Label>
          <Textarea
            id="description"
            placeholder="What's this payment for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setStep("recipient")}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1"
            disabled={!amount || parseFloat(amount) <= 0}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderConfirmationStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Confirm Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Summary */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">To:</span>
            <span>{recipientName || recipientPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Amount:</span>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(parseFloat(amount), currency)}
            </span>
          </div>
          {description && (
            <div className="flex justify-between">
              <span className="font-medium">Message:</span>
              <span className="text-right">{description}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total to Send:</span>
            <span className="text-lg text-green-600">
              {formatCurrency(parseFloat(amount), currency)}
            </span>
          </div>
        </div>

        {/* PIN Input */}
        <div className="space-y-2">
          <Label htmlFor="pin">Payment PIN</Label>
          <Input
            id="pin"
            type="password"
            placeholder="Enter your 4-digit PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={4}
            className="text-center text-2xl tracking-widest"
          />
          <p className="text-sm text-muted-foreground">
            Enter your secure payment PIN to authorize this transaction
          </p>
        </div>

        {/* Error Display */}
        {sendError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-sm text-red-700">
              {(sendError as any)?.response?.data?.message || "Payment failed"}
            </span>
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setStep("amount")}
            className="flex-1"
            disabled={isSending}
          >
            Back
          </Button>
          <Button
            onClick={handleSendPayment}
            className="flex-1"
            disabled={isSending || !pin}
          >
            {isSending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isSending ? "Sending..." : "Send Payment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (walletLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {renderStepIndicator()}

      {step === "recipient" && renderRecipientStep()}
      {step === "amount" && renderAmountStep()}
      {step === "confirmation" && renderConfirmationStep()}
    </div>
  );
}

