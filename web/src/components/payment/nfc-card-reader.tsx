"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import {
  AlertTriangle,
  CheckCircle,
  CreditCard,
  RefreshCw,
  Settings,
  Wifi,
  WifiOff,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface NFCCardData {
  id: string;
  number: string;
  holderName: string;
  expiryDate: string;
  balance: number;
  cardType: "kobklein" | "visa" | "mastercard" | "unknown";
  status: "active" | "blocked" | "expired";
}

interface NFCReaderProps {
  onCardRead?: (cardData: NFCCardData) => void;
  onError?: (error: string) => void;
  isEnabled?: boolean;
}

export function NFCCardReader({
  onCardRead,
  onError,
  isEnabled = true,
}: NFCReaderProps) {
  const [isReading, setIsReading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [lastCardRead, setLastCardRead] = useState<NFCCardData | null>(null);
  const [readerStatus, setReaderStatus] = useState<
    "idle" | "reading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Simulate NFC reader connection check
  useEffect(() => {
    const checkConnection = async () => {
      // In a real implementation, this would check for actual NFC hardware
      if (typeof window !== "undefined" && "NDEFReader" in window) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    };

    checkConnection();
  }, []);

  const startReading = async () => {
    if (!isEnabled || !isConnected) {
      const error = !isConnected
        ? "NFC reader not connected"
        : "NFC reading disabled";
      setErrorMessage(error);
      setReaderStatus("error");
      onError?.(error);
      return;
    }

    setIsReading(true);
    setReaderStatus("reading");
    setErrorMessage("");

    try {
      // Simulate card reading process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate reading a KobKlein card
      const mockCardData: NFCCardData = {
        id: `card_${Date.now()}`,
        number: "**** **** **** 1234",
        holderName: "Jean Baptiste",
        expiryDate: "12/27",
        balance: 2500.0,
        cardType: "kobklein",
        status: "active",
      };

      setLastCardRead(mockCardData);
      setReaderStatus("success");
      onCardRead?.(mockCardData);
    } catch (error) {
      const errorMsg = "Failed to read card. Please try again.";
      setErrorMessage(errorMsg);
      setReaderStatus("error");
      onError?.(errorMsg);
    } finally {
      setIsReading(false);

      // Reset status after 3 seconds
      setTimeout(() => {
        setReaderStatus("idle");
      }, 3000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reading":
        return "bg-blue-100 text-blue-800";
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "reading":
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <XCircle className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getCardTypeIcon = (cardType: string) => {
    switch (cardType) {
      case "kobklein":
        return "🏦";
      case "visa":
        return "💳";
      case "mastercard":
        return "💳";
      default:
        return "💳";
    }
  };

  return (
    <div className="space-y-4">
      {/* NFC Reader Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              NFC Card Reader
            </div>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <Badge
                className={
                  isConnected
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Reader Controls */}
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div
                  className={`w-32 h-32 mx-auto rounded-full border-4 border-dashed flex items-center justify-center mb-4 transition-colors ${
                    readerStatus === "reading"
                      ? "border-blue-500 bg-blue-50"
                      : readerStatus === "success"
                      ? "border-green-500 bg-green-50"
                      : readerStatus === "error"
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">
                      {readerStatus === "reading"
                        ? "📡"
                        : readerStatus === "success"
                        ? "✅"
                        : readerStatus === "error"
                        ? "❌"
                        : "💳"}
                    </div>
                    <div className="text-sm font-medium">
                      {readerStatus === "reading"
                        ? "Reading..."
                        : readerStatus === "success"
                        ? "Card Read"
                        : readerStatus === "error"
                        ? "Error"
                        : "Place Card Here"}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={startReading}
                  disabled={!isEnabled || !isConnected || isReading}
                  className="w-full bg-kobklein-primary hover:bg-kobklein-primary/90"
                >
                  {isReading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Reading Card...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Start Reading
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Status Message */}
            {readerStatus !== "idle" && (
              <div className="text-center">
                <Badge className={getStatusColor(readerStatus)}>
                  {getStatusIcon(readerStatus)}
                  <span className="ml-2">
                    {readerStatus === "reading"
                      ? "Scanning for card..."
                      : readerStatus === "success"
                      ? "Card successfully read"
                      : readerStatus === "error"
                      ? errorMessage
                      : "Ready to scan"}
                  </span>
                </Badge>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && readerStatus === "error" && (
              <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mx-auto mb-2" />
                <div className="text-sm text-red-800">{errorMessage}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Last Card Read */}
      {lastCardRead && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Card Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getCardTypeIcon(lastCardRead.cardType)}
                  </div>
                  <div>
                    <div className="font-medium">{lastCardRead.holderName}</div>
                    <div className="text-sm text-muted-foreground">
                      {lastCardRead.number}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Expires: {lastCardRead.expiryDate}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-kobklein-primary">
                    ${lastCardRead.balance.toLocaleString()} HTG
                  </div>
                  <Badge
                    className={
                      lastCardRead.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {lastCardRead.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
                <Button className="w-full bg-kobklein-primary hover:bg-kobklein-primary/90">
                  Process Payment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reader Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Reader Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Auto-read enabled</div>
                <div className="text-sm text-muted-foreground">
                  Automatically detect cards
                </div>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Security level</div>
                <div className="text-sm text-muted-foreground">
                  High security validation
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">High</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Read timeout</div>
                <div className="text-sm text-muted-foreground">
                  Maximum read duration
                </div>
              </div>
              <Badge variant="outline">30 seconds</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

