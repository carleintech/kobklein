"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Copy,
  CreditCard,
  Download,
  Eye,
  Mail,
  MessageCircle,
  Printer,
  Receipt,
  RefreshCw,
  Share2,
  Shield,
  Star,
  ThumbsUp,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface PaymentConfirmationData {
  transactionId: string;
  confirmationNumber: string;
  status: "success" | "failed" | "pending";
  amount: number;
  currency: "HTG" | "USD";
  fees: number;
  fromUser: {
    id: string;
    name: string;
    type: "client" | "merchant" | "distributor" | "diaspora";
  };
  toUser: {
    id: string;
    name: string;
    type: "client" | "merchant" | "distributor" | "diaspora";
  };
  timestamp: string;
  description: string;
  paymentMethod: "nfc" | "qr_code" | "wallet" | "bank_transfer";
  blockchainHash?: string;
  processingTime: string;
  receipt: {
    url?: string;
    data: any;
  };
  errorMessage?: string;
  retryCount?: number;
}

interface PaymentConfirmationProps {
  paymentData: PaymentConfirmationData;
  onRetry?: () => void;
  onClose?: () => void;
  onRateExperience?: (rating: number) => void;
  showReceiptOptions?: boolean;
}

export function PaymentConfirmation({
  paymentData,
  onRetry,
  onClose,
  onRateExperience,
  showReceiptOptions = true,
}: PaymentConfirmationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [emailSent, setEmailSent] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === "HTG" ? "G " : "$";
    return `${symbol}${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-600" />;
      case "failed":
        return <XCircle className="h-16 w-16 text-red-600" />;
      case "pending":
        return <Clock className="h-16 w-16 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-16 w-16 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "success":
        return "Payment Successful!";
      case "failed":
        return "Payment Failed";
      case "pending":
        return "Payment Pending";
      default:
        return "Payment Status Unknown";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "nfc":
        return "📡";
      case "qr_code":
        return "📱";
      case "wallet":
        return "💳";
      case "bank_transfer":
        return "🏦";
      default:
        return "💳";
    }
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case "client":
        return "👤";
      case "merchant":
        return "🏪";
      case "distributor":
        return "🚚";
      case "diaspora":
        return "🌍";
      default:
        return "👤";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendEmailReceipt = async () => {
    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const sendSMSReceipt = async () => {
    // Simulate sending SMS
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 3000);
  };

  const handleRating = (newRating: number) => {
    setRating(newRating);
    onRateExperience?.(newRating);
  };

  const downloadReceipt = () => {
    // In a real implementation, this would generate and download a PDF receipt
    const receiptData = {
      ...paymentData,
      downloadedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(receiptData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kobklein-receipt-${paymentData.confirmationNumber}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareReceipt = () => {
    if (navigator.share) {
      navigator.share({
        title: "KobKlein Payment Receipt",
        text: `Payment of ${formatCurrency(
          paymentData.amount,
          paymentData.currency
        )} - Confirmation: ${paymentData.confirmationNumber}`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Status Display */}
      <Card
        className={`border-2 ${
          paymentData.status === "success"
            ? "border-green-500"
            : paymentData.status === "failed"
            ? "border-red-500"
            : "border-yellow-500"
        }`}
      >
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            {getStatusIcon(paymentData.status)}

            <div>
              <h2
                className={`text-2xl font-bold ${getStatusColor(
                  paymentData.status
                )}`}
              >
                {getStatusMessage(paymentData.status)}
              </h2>
              {paymentData.status === "success" && (
                <p className="text-muted-foreground">
                  Your payment has been processed successfully
                </p>
              )}
              {paymentData.status === "failed" && (
                <p className="text-muted-foreground">
                  {paymentData.errorMessage ||
                    "Please try again or contact support"}
                </p>
              )}
              {paymentData.status === "pending" && (
                <p className="text-muted-foreground">
                  Your payment is being processed
                </p>
              )}
            </div>

            {/* Confirmation Number */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Confirmation Number
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg font-mono font-bold">
                  {paymentData.confirmationNumber}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    copyToClipboard(paymentData.confirmationNumber)
                  }
                >
                  {copied ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
              {copied && (
                <div className="text-xs text-green-600 mt-1">
                  Copied to clipboard!
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Receipt className="h-5 w-5 mr-2" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Amount and Details */}
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-kobklein-primary">
                {formatCurrency(paymentData.amount, paymentData.currency)}
              </div>
              <div className="text-sm text-muted-foreground">
                + {formatCurrency(paymentData.fees, paymentData.currency)} fees
              </div>
              <div className="text-lg font-semibold">
                Total:{" "}
                {formatCurrency(
                  paymentData.amount + paymentData.fees,
                  paymentData.currency
                )}
              </div>
            </div>

            <Separator />

            {/* Transaction Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    From
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {getUserTypeIcon(paymentData.fromUser.type)}
                    </span>
                    <span className="font-medium">
                      {paymentData.fromUser.name}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    To
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {getUserTypeIcon(paymentData.toUser.type)}
                    </span>
                    <span className="font-medium">
                      {paymentData.toUser.name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Payment Method
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {getPaymentMethodIcon(paymentData.paymentMethod)}
                    </span>
                    <span className="font-medium capitalize">
                      {paymentData.paymentMethod.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Date & Time
                  </div>
                  <div className="font-medium">
                    {new Date(paymentData.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {paymentData.description && (
              <>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Description
                  </div>
                  <div className="font-medium">{paymentData.description}</div>
                </div>
              </>
            )}

            {/* Advanced Details */}
            {showDetails && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetails(false)}
                  >
                    <Eye className="h-3 w-3 mr-2" />
                    Hide Details
                  </Button>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Transaction ID:</span>
                      <div className="text-muted-foreground font-mono">
                        {paymentData.transactionId}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Processing Time:</span>
                      <div className="text-muted-foreground">
                        {paymentData.processingTime}
                      </div>
                    </div>
                    {paymentData.blockchainHash && (
                      <div className="col-span-2">
                        <span className="font-medium">Blockchain Hash:</span>
                        <div className="text-muted-foreground font-mono text-xs break-all">
                          {paymentData.blockchainHash}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {!showDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(true)}
              >
                <Eye className="h-3 w-3 mr-2" />
                Show More Details
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Receipt Options */}
      {showReceiptOptions && paymentData.status === "success" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Receipt Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Download Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={downloadReceipt}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={shareReceipt}
                  className="w-full"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Receipt
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="w-full"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>

              <Separator />

              {/* Send Options */}
              <div className="space-y-3">
                <div className="text-sm font-medium">Send Receipt</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={sendEmailReceipt}
                    disabled={emailSent}
                    className="w-full"
                  >
                    {emailSent ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Email Sent!
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send via Email
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={sendSMSReceipt}
                    disabled={smsSent}
                    className="w-full"
                  >
                    {smsSent ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        SMS Sent!
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Send via SMS
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Failed Payment Actions */}
      {paymentData.status === "failed" && onRetry && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCw className="h-5 w-5 mr-2" />
              Payment Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {paymentData.retryCount && paymentData.retryCount > 0 && (
                  <div>Retry attempt #{paymentData.retryCount}</div>
                )}
                <div>
                  Don&apos;t worry, no money was charged. You can try again or
                  use a different payment method.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  onClick={onRetry}
                  className="w-full bg-kobklein-primary hover:bg-kobklein-primary/90"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Different Method
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rating and Feedback */}
      {paymentData.status === "success" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ThumbsUp className="h-5 w-5 mr-2" />
              Rate Your Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-sm text-muted-foreground">
                How was your payment experience?
              </div>

              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="outline"
                    size="sm"
                    onClick={() => handleRating(star)}
                    className={
                      rating >= star
                        ? "bg-yellow-400 text-white border-yellow-400"
                        : ""
                    }
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                ))}
              </div>

              {rating > 0 && (
                <div className="text-sm text-green-600">
                  Thank you for your feedback! ({rating}/5 stars)
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-blue-600">Security Notice</div>
              <div className="text-muted-foreground">
                Keep this confirmation number safe. You may need it for customer
                support or refund requests. All KobKlein transactions are
                secured with end-to-end encryption.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        {onClose && (
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
        )}
        <Button className="flex-1 bg-kobklein-primary hover:bg-kobklein-primary/90">
          <CreditCard className="h-4 w-4 mr-2" />
          New Payment
        </Button>
      </div>
    </div>
  );
}

