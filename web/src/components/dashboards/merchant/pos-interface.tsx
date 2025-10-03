"use client";

import {
  AlertCircle,
  Calculator,
  CheckCircle,
  CreditCard,
  Hash,
  Loader2,
  QrCode,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { useGenerateQrCode } from "@/hooks/use-api";
import { formatCurrency } from "@/lib/utils";

type PaymentMethod = "nfc" | "qr" | "manual";
type PaymentStatus = "idle" | "processing" | "success" | "failed";

export function POSInterface() {
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("nfc");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [customerInfo, setCustomerInfo] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [generatedQRCode, setGeneratedQRCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // API hooks
  const {
    mutate: generateQR,
    isPending: isGeneratingQR,
    error: qrError,
  } = useGenerateQrCode();

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");
    setAmount(numericValue);
  };

  const quickAmounts = [50, 100, 250, 500, 1000, 2500];

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const processPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setError(null);
    setPaymentStatus("processing");

    try {
      if (paymentMethod === "qr") {
        // Generate QR code for payment
        generateQR(
          {
            amount: parseFloat(amount),
            currency: "HTG",
            description: note || "POS Payment",
          },
          {
            onSuccess: (data) => {
              setGeneratedQRCode(data.data?.qrCode || null);
              setPaymentStatus("success");

              // Reset form after success
              setTimeout(() => {
                setAmount("");
                setCustomerInfo("");
                setNote("");
                setGeneratedQRCode(null);
                setPaymentStatus("idle");
              }, 10000); // Give more time for QR payment
            },
            onError: (error: any) => {
              setError(
                error.response?.data?.message || "Failed to generate QR code"
              );
              setPaymentStatus("failed");
              setTimeout(() => setPaymentStatus("idle"), 3000);
            },
          }
        );
      } else {
        // Simulate NFC or manual payment processing
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Simulate success/failure (90% success rate)
        const isSuccess = Math.random() > 0.1;

        if (isSuccess) {
          setPaymentStatus("success");
          // Reset form after success
          setTimeout(() => {
            setAmount("");
            setCustomerInfo("");
            setNote("");
            setPaymentStatus("idle");
          }, 3000);
        } else {
          setError("Payment failed. Please try again.");
          setPaymentStatus("failed");
          setTimeout(() => setPaymentStatus("idle"), 3000);
        }
      }
    } catch (error) {
      setError("Payment processing failed");
      setPaymentStatus("failed");
      setTimeout(() => setPaymentStatus("idle"), 3000);
    }
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case "nfc":
        return <CreditCard className="h-5 w-5" />;
      case "qr":
        return <QrCode className="h-5 w-5" />;
      case "manual":
        return <Hash className="h-5 w-5" />;
    }
  };

  const getStatusDisplay = () => {
    switch (paymentStatus) {
      case "processing":
        return (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kobklein-accent mx-auto mb-4"></div>
            <p className="text-lg font-medium">Processing Payment...</p>
            <p className="text-sm text-muted-foreground mt-2">
              {paymentMethod === "nfc" && "Waiting for card tap..."}
              {paymentMethod === "qr" && "Customer scanning QR code..."}
              {paymentMethod === "manual" && "Processing transaction..."}
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-green-600">
              Payment Successful!
            </p>
            {generatedQRCode && paymentMethod === "qr" && (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Customer can scan this QR code:
                </p>
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                  <div className="text-xs break-all bg-gray-100 p-2 rounded">
                    {generatedQRCode}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  QR Code expires in 15 minutes
                </p>
              </div>
            )}
            <p className="text-2xl font-bold mt-2">
              {formatCurrency(parseFloat(amount), "HTG")}
            </p>
          </div>
        );

      case "failed":
        return (
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-red-600">Payment Failed</p>
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Please try again
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (paymentStatus !== "idle") {
    return (
      <KobKleinCard className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">Payment Status</h3>
          {getStatusDisplay()}
          {paymentStatus === "failed" && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setPaymentStatus("idle")}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </KobKleinCard>
    );
  }

  return (
    <KobKleinCard className="p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Accept Payment</h3>

        {/* Amount Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Amount (HTG)</label>
          <Input
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="text-2xl font-bold text-center"
          />

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((quickAmount) => (
              <Button
                key={quickAmount}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount(quickAmount)}
                className="text-xs"
              >
                {formatCurrency(quickAmount, "HTG")}
              </Button>
            ))}
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Payment Method</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { method: "nfc" as const, label: "NFC Tap" },
              { method: "qr" as const, label: "QR Code" },
              { method: "manual" as const, label: "Manual" },
            ].map(({ method, label }) => (
              <Button
                key={method}
                variant={paymentMethod === method ? "kobklein" : "outline"}
                onClick={() => setPaymentMethod(method)}
                className="flex flex-col items-center space-y-1 h-16"
              >
                {getPaymentMethodIcon(method)}
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Customer Info (Optional) */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Customer Info (Optional)
          </label>
          <Input
            placeholder="Customer name or phone"
            value={customerInfo}
            onChange={(e) => setCustomerInfo(e.target.value)}
          />
        </div>

        {/* Note (Optional) */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Note (Optional)</label>
          <Input
            placeholder="Transaction note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Process Payment Button */}
        <Button
          variant="kobklein"
          className="w-full h-12 text-lg"
          onClick={processPayment}
          disabled={!amount || parseFloat(amount) <= 0 || isGeneratingQR}
        >
          {isGeneratingQR && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          <Calculator className="h-5 w-5 mr-2" />
          {isGeneratingQR ? "Processing..." : "Process Payment:"}{" "}
          {amount ? formatCurrency(parseFloat(amount), "HTG") : "0.00 G"}
        </Button>
      </div>
    </KobKleinCard>
  );
}

