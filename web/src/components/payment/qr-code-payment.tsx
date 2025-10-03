"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRealtimeBalance } from "@/contexts/WebSocketContext";
import {
  useGenerateQrCode,
  useProcessQrPayment,
  useWalletBalance,
} from "@/hooks/use-api";
import {
  AlertCircle,
  Camera,
  CheckCircle,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  Loader2,
  QrCode,
  RefreshCw,
  Share2,
  Smartphone,
} from "lucide-react";
import { useRef, useState } from "react";

interface QRPaymentData {
  id: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  currency: "HTG" | "USD";
  description: string;
  expiryTime: string;
  status: "active" | "expired" | "used";
  qrCode?: string; // Base64 or URL for QR code image
}

interface QRCodePaymentProps {
  mode?: "generate" | "scan" | "both";
  merchantInfo?: {
    id: string;
    name: string;
    logo?: string;
  };
  onPaymentSuccess?: (payment: QRPaymentData) => void;
  onPaymentError?: (error: string) => void;
}

export function QRCodePayment({
  mode = "both",
  merchantInfo,
  onPaymentSuccess,
  onPaymentError,
}: QRCodePaymentProps) {
  const [activeTab, setActiveTab] = useState<"generate" | "scan">(
    mode === "generate" ? "generate" : "scan"
  );
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [currency, setCurrency] = useState<"HTG" | "USD">("HTG");
  const [generatedQR, setGeneratedQR] = useState<QRPaymentData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<QRPaymentData | null>(null);
  const [showQRCode, setShowQRCode] = useState(true);
  const [pin, setPin] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  // API hooks
  const { data: walletData, isLoading: walletLoading } = useWalletBalance();
  const {
    mutate: generateQR,
    isPending: isGenerating,
    error: generateError,
  } = useGenerateQrCode();
  const {
    mutate: processPayment,
    isPending: isProcessing,
    error: processError,
  } = useProcessQrPayment();

  // Real-time balance updates
  const { balance: realtimeBalance } = useRealtimeBalance();

  // Use real-time balance if available, otherwise fall back to API data
  const currentBalance = realtimeBalance || walletData?.data;

  // Generate QR code using backend API
  const generateQRCode = () => {
    if (!amount || parseFloat(amount) <= 0) {
      onPaymentError?.("Please enter a valid amount");
      return;
    }

    // Check balance before generating QR
    if (currentBalance && activeTab === "generate") {
      const availableBalance =
        currency === "HTG" ? currentBalance.htg : currentBalance.usd;
      if (parseFloat(amount) > availableBalance) {
        onPaymentError?.("Insufficient balance");
        return;
      }
    }

    generateQR(
      {
        amount: parseFloat(amount),
        currency,
        description: description || undefined,
      },
      {
        onSuccess: (data) => {
          const qrData: QRPaymentData = {
            id: `qr_${Date.now()}`,
            merchantId: merchantInfo?.id || "default_merchant",
            merchantName: merchantInfo?.name || "KobKlein Merchant",
            amount: parseFloat(amount),
            currency,
            description: description || "Payment request",
            expiryTime:
              data.data?.expiresAt ||
              new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            status: "active",
            qrCode: data.data?.qrCode || "",
          };
          setGeneratedQR(qrData);
        },
        onError: (error: any) => {
          onPaymentError?.(
            error.response?.data?.message || "Failed to generate QR code"
          );
        },
      }
    );
  };

  // Process scanned QR payment
  const processQRPayment = () => {
    if (!scanResult || !pin) {
      onPaymentError?.("Please enter your PIN");
      return;
    }

    if (scanResult.status !== "active") {
      onPaymentError?.("QR code has expired or already been used");
      return;
    }

    // Check balance before processing payment
    if (currentBalance) {
      const availableBalance =
        scanResult.currency === "HTG" ? currentBalance.htg : currentBalance.usd;
      if (scanResult.amount > availableBalance) {
        onPaymentError?.("Insufficient balance");
        return;
      }
    }

    const qrData = JSON.stringify({
      ...scanResult,
      pin,
    });

    processPayment(qrData, {
      onSuccess: (data) => {
        onPaymentSuccess?.(scanResult);
        setScanResult(null);
        setPin("");
      },
      onError: (error: any) => {
        onPaymentError?.(error.response?.data?.message || "Payment failed");
      },
    });
  };

  // Simulate QR code scanning (in production, use camera integration)
  const startScanning = async () => {
    setIsScanning(true);
    setScanResult(null);

    try {
      // Simulate camera access and QR scanning
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock scanned QR data
      const mockScannedData: QRPaymentData = {
        id: `qr_scanned_${Date.now()}`,
        merchantId: "merchant_123",
        merchantName: "Boutique Ti Marie",
        amount: 150.0,
        currency: "HTG",
        description: "Purchase - Rice and beans",
        expiryTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        status: "active",
      };

      setScanResult(mockScannedData);
    } catch (error) {
      onPaymentError?.("Failed to access camera or scan QR code");
    } finally {
      setIsScanning(false);
    }
  };

  const copyQRData = () => {
    if (generatedQR) {
      const qrString = JSON.stringify(generatedQR, null, 2);
      navigator.clipboard.writeText(qrString);
    }
  };

  const shareQRCode = () => {
    if (generatedQR && navigator.share) {
      navigator.share({
        title: "KobKlein Payment Request",
        text: `Payment request for ${formatCurrency(
          generatedQR.amount,
          generatedQR.currency
        )}`,
        url: window.location.href,
      });
    }
  };

  // Generate simple QR code representation (in real app, use qrcode library)
  const generateQRDisplay = (data: QRPaymentData) => {
    if (data.qrCode) {
      return data.qrCode; // Use actual QR code from backend
    }
    return `KOBKLEIN_PAY:${data.id}:${data.amount}:${data.currency}:${data.merchantId}`;
  };

  if (walletLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency === "HTG" ? "USD" : currency,
      minimumFractionDigits: 2,
    })
      .format(amount)
      .replace("$", currency === "HTG" ? "G " : "$");
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      {mode === "both" && (
        <Card>
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <Button
                variant={activeTab === "generate" ? "default" : "outline"}
                onClick={() => setActiveTab("generate")}
                className="flex-1"
              >
                <QrCode className="h-4 w-4 mr-2" />
                Generate QR
              </Button>
              <Button
                variant={activeTab === "scan" ? "default" : "outline"}
                onClick={() => setActiveTab("scan")}
                className="flex-1"
              >
                <Camera className="h-4 w-4 mr-2" />
                Scan QR
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate QR Code Tab */}
      {(activeTab === "generate" || mode === "generate") && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="h-5 w-5 mr-2" />
              Generate Payment QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Balance Display */}
            {currentBalance && activeTab === "generate" && (
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

            {/* Error Display */}
            {(generateError || processError) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                <span className="text-sm text-red-700">
                  {(generateError as any)?.response?.data?.message ||
                    (processError as any)?.response?.data?.message ||
                    "An error occurred"}
                </span>
              </div>
            )}

            {!generatedQR ? (
              <>
                {/* Amount Input */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Payment Amount
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={currency}
                      onChange={(e) =>
                        setCurrency(e.target.value as "HTG" | "USD")
                      }
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-kobklein-primary"
                      title="Select currency"
                    >
                      <option value="HTG">HTG (Gourde)</option>
                      <option value="USD">USD (Dollar)</option>
                    </select>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-kobklein-primary"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Payment for..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-kobklein-primary"
                  />
                </div>

                {/* Merchant Info */}
                {merchantInfo && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium">
                      Merchant Information
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {merchantInfo.name} (ID: {merchantInfo.id})
                    </div>
                  </div>
                )}

                <Button
                  onClick={generateQRCode}
                  className="w-full bg-kobklein-primary hover:bg-kobklein-primary/90"
                  disabled={!amount || parseFloat(amount) <= 0 || isGenerating}
                >
                  {isGenerating && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  <QrCode className="h-4 w-4 mr-2" />
                  {isGenerating ? "Generating..." : "Generate QR Code"}
                </Button>
              </>
            ) : (
              <>
                {/* Generated QR Code Display */}
                <div className="text-center space-y-4">
                  <div className="mx-auto w-64 h-64 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center relative">
                    {showQRCode ? (
                      <div className="text-center">
                        <div className="text-6xl mb-4">📱</div>
                        <div className="text-xs text-gray-600 break-all p-2">
                          {generateQRDisplay(generatedQR)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <EyeOff className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">
                          QR Code Hidden
                        </div>
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowQRCode(!showQRCode)}
                      className="absolute top-2 right-2"
                    >
                      {showQRCode ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                  </div>

                  {/* Payment Details */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-kobklein-primary">
                      {formatCurrency(generatedQR.amount, generatedQR.currency)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {generatedQR.description}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Expires:{" "}
                      {new Date(generatedQR.expiryTime).toLocaleString()}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={copyQRData}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" onClick={shareQRCode}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setGeneratedQR(null)}
                    className="w-full"
                  >
                    Generate New QR
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Scan QR Code Tab */}
      {(activeTab === "scan" || mode === "scan") && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Scan Payment QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!scanResult ? (
              <>
                {/* Camera View */}
                <div className="relative">
                  <div className="w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                    {isScanning ? (
                      <div className="text-center text-white">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                        <div>Scanning for QR code...</div>
                        <div className="absolute inset-4 border-2 border-green-500 rounded-lg animate-pulse" />
                      </div>
                    ) : (
                      <div className="text-center text-white">
                        <Camera className="h-12 w-12 mx-auto mb-2" />
                        <div>Position QR code in the frame</div>
                        <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Scan Controls */}
                <div className="text-center space-y-3">
                  <Button
                    onClick={startScanning}
                    disabled={isScanning}
                    className="w-full bg-kobklein-primary hover:bg-kobklein-primary/90"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        Start Scanning
                      </>
                    )}
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    Point your camera at a KobKlein payment QR code
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Scanned Payment Details */}
                <div className="text-center space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />

                  <div>
                    <div className="text-lg font-medium">
                      QR Code Scanned Successfully
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Payment details found
                    </div>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Merchant</span>
                        <span className="text-sm">
                          {scanResult.merchantName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Amount</span>
                        <span className="text-lg font-bold text-kobklein-primary">
                          {formatCurrency(
                            scanResult.amount,
                            scanResult.currency
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Description</span>
                        <span className="text-sm">
                          {scanResult.description}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status</span>
                        <Badge
                          className={
                            scanResult.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {scanResult.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* PIN Input for Payment */}
                {scanResult && !isProcessing && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payment PIN</label>
                    <input
                      type="password"
                      placeholder="Enter your 4-digit PIN"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      maxLength={4}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-kobklein-primary text-center text-2xl tracking-widest"
                    />
                  </div>
                )}

                {/* Payment Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => setScanResult(null)}>
                    Scan Again
                  </Button>
                  <Button
                    onClick={processQRPayment}
                    className="bg-kobklein-primary hover:bg-kobklein-primary/90"
                    disabled={
                      scanResult.status !== "active" || !pin || isProcessing
                    }
                  >
                    {isProcessing && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    <CreditCard className="h-4 w-4 mr-2" />
                    {isProcessing ? "Processing..." : "Pay Now"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smartphone className="h-5 w-5 mr-2" />
            How to Use QR Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-kobklein-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <div className="font-medium">Generate QR Code</div>
                <div className="text-muted-foreground">
                  Enter amount and description to create a payment request
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-kobklein-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <div className="font-medium">Share with Customer</div>
                <div className="text-muted-foreground">
                  Customer scans the QR code with their KobKlein app
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-kobklein-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <div className="font-medium">Instant Payment</div>
                <div className="text-muted-foreground">
                  Payment is processed instantly and both parties receive
                  confirmation
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

