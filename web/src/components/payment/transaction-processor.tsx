"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  CreditCard,
  Eye,
  FileText,
  Lock,
  RefreshCw,
  Shield,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface TransactionDetails {
  id: string;
  amount: number;
  currency: "HTG" | "USD";
  fromUserId: string;
  fromUserName: string;
  fromUserType: "client" | "merchant" | "distributor" | "diaspora";
  toUserId: string;
  toUserName: string;
  toUserType: "client" | "merchant" | "distributor" | "diaspora";
  description: string;
  type: "payment" | "transfer" | "topup" | "withdrawal";
  fees: number;
  exchangeRate?: number;
  metadata?: Record<string, any>;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  riskLevel: "low" | "medium" | "high";
}

interface TransactionProcessorProps {
  transactionData?: TransactionDetails;
  onTransactionComplete?: (
    transaction: TransactionDetails & { status: string; timestamp: string }
  ) => void;
  onTransactionError?: (error: string) => void;
  autoProcess?: boolean;
}

export function TransactionProcessor({
  transactionData,
  onTransactionComplete,
  onTransactionError,
  autoProcess = false,
}: TransactionProcessorProps) {
  const [currentStep, setCurrentStep] = useState<
    "validate" | "confirm" | "process" | "complete"
  >("validate");
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState("");
  const [transactionResult, setTransactionResult] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock transaction for demonstration
  const [mockTransaction] = useState<TransactionDetails>({
    id: `tx_${Date.now()}`,
    amount: 125.0,
    currency: "HTG",
    fromUserId: "user_123",
    fromUserName: "Marie Dupont",
    fromUserType: "client",
    toUserId: "merchant_456",
    toUserName: "Boutique Ti Jean",
    toUserType: "merchant",
    description: "Purchase - Rice and vegetables",
    type: "payment",
    fees: 2.5,
    metadata: {
      location: "Port-au-Prince",
      paymentMethod: "qr_code",
      merchantCategory: "grocery",
    },
  });

  const transaction = transactionData || mockTransaction;

  // Validation logic
  const validateTransaction =
    useCallback(async (): Promise<ValidationResult> => {
      const errors: string[] = [];
      const warnings: string[] = [];

      // Amount validation
      if (transaction.amount <= 0) {
        errors.push("Transaction amount must be greater than zero");
      }
      if (transaction.amount > 10000) {
        warnings.push(
          "Large transaction amount - additional verification may be required"
        );
      }

      // User validation
      if (!transaction.fromUserId || !transaction.toUserId) {
        errors.push("Invalid user information");
      }
      if (transaction.fromUserId === transaction.toUserId) {
        errors.push("Cannot transfer to the same user");
      }

      // Balance validation (simulate)
      const userBalance = 500.0; // Mock user balance
      if (transaction.amount + transaction.fees > userBalance) {
        errors.push("Insufficient balance");
      }

      // Risk assessment
      let riskLevel: "low" | "medium" | "high" = "low";
      if (transaction.amount > 1000) riskLevel = "medium";
      if (transaction.amount > 5000) riskLevel = "high";
      if (transaction.fromUserType !== transaction.toUserType)
        riskLevel = "medium";

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        riskLevel,
      };
    }, [transaction]);

  // Process transaction
  const processTransaction = useCallback(async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setCurrentStep("process");

    const steps = [
      { name: "Verifying user authentication", duration: 800 },
      { name: "Checking account balances", duration: 600 },
      { name: "Applying security checks", duration: 1000 },
      { name: "Processing payment", duration: 1200 },
      { name: "Updating account balances", duration: 500 },
      { name: "Generating transaction receipt", duration: 400 },
    ];

    try {
      for (let i = 0; i < steps.length; i++) {
        setProcessingStep(steps[i].name);
        await new Promise((resolve) => setTimeout(resolve, steps[i].duration));
        setProcessingProgress(((i + 1) / steps.length) * 100);
      }

      // Simulate transaction completion
      const result = {
        ...transaction,
        status: "completed",
        timestamp: new Date().toISOString(),
        confirmationNumber: `CONF_${Date.now()}`,
        blockchainHash: `0x${Math.random().toString(16).substr(2, 8)}`, // Mock hash
        processingTime: "3.2s",
      };

      setTransactionResult(result);
      setCurrentStep("complete");
      onTransactionComplete?.(result);
    } catch (error) {
      onTransactionError?.("Transaction processing failed");
      setCurrentStep("validate");
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
      setProcessingStep("");
    }
  }, [transaction, onTransactionComplete, onTransactionError]);

  // Auto-validate on mount
  useEffect(() => {
    const runValidation = async () => {
      if (transaction) {
        const result = await validateTransaction();
        setValidationResult(result);
      }
    };
    runValidation();
  }, [transaction, validateTransaction]);

  // Auto-process if enabled and validation passes
  useEffect(() => {
    if (
      autoProcess &&
      validationResult?.isValid &&
      currentStep === "validate"
    ) {
      setCurrentStep("confirm");
      setTimeout(() => processTransaction(), 1000);
    }
  }, [autoProcess, validationResult, currentStep, processTransaction]);

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === "HTG" ? "G " : "$";
    return `${symbol}${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  return (
    <div className="space-y-6">
      {/* Processing Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Transaction Processing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Step Indicators */}
            <div className="flex items-center justify-between">
              {[
                { key: "validate", label: "Validate", icon: Shield },
                { key: "confirm", label: "Confirm", icon: Eye },
                { key: "process", label: "Process", icon: Zap },
                { key: "complete", label: "Complete", icon: CheckCircle },
              ].map((step, index) => {
                const isActive = currentStep === step.key;
                const isCompleted =
                  ["validate", "confirm", "process", "complete"].indexOf(
                    currentStep
                  ) > index;
                const StepIcon = step.icon;

                return (
                  <div key={step.key} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        isActive
                          ? "border-kobklein-primary bg-kobklein-primary text-white"
                          : isCompleted
                          ? "border-green-600 bg-green-600 text-white"
                          : "border-gray-300 bg-gray-100 text-gray-600"
                      }`}
                    >
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-2 text-sm font-medium">{step.label}</div>
                    {index < 3 && (
                      <ArrowRight className="h-4 w-4 text-gray-400 mx-4" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Processing Progress Bar */}
            {isProcessing && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 bg-kobklein-primary rounded-full transition-all duration-500 ${
                      processingProgress < 25
                        ? "w-1/4"
                        : processingProgress < 50
                        ? "w-2/4"
                        : processingProgress < 75
                        ? "w-3/4"
                        : "w-full"
                    }`}
                  />
                </div>
                <div className="text-sm text-muted-foreground text-center">
                  {processingStep} ({Math.round(processingProgress)}%)
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Transaction Details
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? (
                <Eye className="h-3 w-3" />
              ) : (
                <Eye className="h-3 w-3" />
              )}
              {showDetails ? "Hide" : "Show"} Details
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Main Transaction Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    From
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {getUserTypeIcon(transaction.fromUserType)}
                    </span>
                    <span className="font-medium">
                      {transaction.fromUserName}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    To
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {getUserTypeIcon(transaction.toUserType)}
                    </span>
                    <span className="font-medium">
                      {transaction.toUserName}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Amount
                  </div>
                  <div className="text-2xl font-bold text-kobklein-primary">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Fees
                  </div>
                  <div className="text-lg font-medium">
                    {formatCurrency(transaction.fees, transaction.currency)}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Additional Details */}
            {showDetails && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Transaction ID:</span>
                    <div className="text-muted-foreground font-mono">
                      {transaction.id}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>
                    <div className="text-muted-foreground">
                      {transaction.type.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Description:</span>
                    <div className="text-muted-foreground">
                      {transaction.description}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Total:</span>
                    <div className="font-bold">
                      {formatCurrency(
                        transaction.amount + transaction.fees,
                        transaction.currency
                      )}
                    </div>
                  </div>
                </div>

                {transaction.metadata && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium mb-2">
                      Additional Information
                    </div>
                    <div className="text-sm space-y-1">
                      {Object.entries(transaction.metadata).map(
                        ([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, " $1")}:
                            </span>
                            <span>{String(value)}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validationResult && currentStep === "validate" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security Validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Validation Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {validationResult.isValid ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-medium">
                    {validationResult.isValid
                      ? "Validation Passed"
                      : "Validation Failed"}
                  </span>
                </div>
                <Badge className={getRiskColor(validationResult.riskLevel)}>
                  {validationResult.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>

              {/* Errors */}
              {validationResult.errors.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-red-600">Errors</div>
                  {validationResult.errors.map((error, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-sm text-red-600"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Warnings */}
              {validationResult.warnings.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-yellow-600">
                    Warnings
                  </div>
                  {validationResult.warnings.map((warning, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-sm text-yellow-600"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  onClick={() => setCurrentStep("confirm")}
                  disabled={!validationResult.isValid}
                  className="flex-1 bg-kobklein-primary hover:bg-kobklein-primary/90"
                >
                  {validationResult.isValid
                    ? "Proceed to Confirmation"
                    : "Cannot Proceed"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    validateTransaction().then(setValidationResult)
                  }
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Re-validate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Step */}
      {currentStep === "confirm" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Confirm Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium">
                    Please confirm the transaction details
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  This action cannot be undone. Please verify all details before
                  proceeding.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("validate")}
                >
                  Go Back
                </Button>
                <Button
                  onClick={processTransaction}
                  className="bg-kobklein-primary hover:bg-kobklein-primary/90"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Confirm & Process
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Step */}
      {currentStep === "process" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Processing Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <RefreshCw className="h-12 w-12 animate-spin text-kobklein-primary mx-auto" />
              <div>
                <div className="text-lg font-medium">
                  Processing your transaction...
                </div>
                <div className="text-sm text-muted-foreground">
                  Please do not close this page
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Step */}
      {currentStep === "complete" && transactionResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Transaction Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <div>
                <div className="text-lg font-medium">
                  Transaction Successful!
                </div>
                <div className="text-sm text-muted-foreground">
                  Confirmation: {transactionResult.confirmationNumber}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">Processing Time</div>
                  <div className="text-muted-foreground">
                    {transactionResult.processingTime}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">Blockchain Hash</div>
                  <div className="text-muted-foreground font-mono text-xs">
                    {transactionResult.blockchainHash}
                  </div>
                </div>
              </div>

              <Button className="w-full bg-kobklein-primary hover:bg-kobklein-primary/90">
                <FileText className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

