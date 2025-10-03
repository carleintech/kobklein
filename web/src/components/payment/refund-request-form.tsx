"use client";

import {
  AlertCircle,
  CheckCircle,
  DollarSign,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRequestRefund, useTransactionDetails } from "@/hooks/use-api";
import { formatCurrency } from "@/lib/utils";

interface RefundRequestFormProps {
  transactionId?: string;
  onSuccess?: (refund: any) => void;
  onError?: (error: string) => void;
}

export function RefundRequestForm({
  transactionId: initialTransactionId,
  onSuccess,
  onError,
}: RefundRequestFormProps) {
  const [transactionId, setTransactionId] = useState(
    initialTransactionId || ""
  );
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState<"transaction" | "details" | "confirmation">(
    "transaction"
  );

  // API hooks
  const {
    data: transactionData,
    isLoading: transactionLoading,
    error: transactionError,
  } = useTransactionDetails(transactionId, { enabled: !!transactionId });
  const {
    mutate: requestRefund,
    isPending: isSubmitting,
    error: refundError,
  } = useRequestRefund();

  const refundCategories = [
    { value: "product_defect", label: "Product Defect" },
    { value: "service_issue", label: "Service Issue" },
    { value: "unauthorized", label: "Unauthorized Transaction" },
    { value: "duplicate", label: "Duplicate Payment" },
    { value: "cancelled_order", label: "Cancelled Order" },
    { value: "other", label: "Other" },
  ];

  const handleTransactionLookup = () => {
    if (!transactionId) {
      onError?.("Please enter a transaction ID");
      return;
    }
    setStep("details");
  };

  const validateRefundAmount = () => {
    if (!amount || parseFloat(amount) <= 0) {
      onError?.("Please enter a valid refund amount");
      return false;
    }

    if (
      transactionData?.data &&
      parseFloat(amount) > transactionData.data.amount
    ) {
      onError?.("Refund amount cannot exceed original transaction amount");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!category || !reason) {
      onError?.("Please fill in all required fields");
      return;
    }

    if (!validateRefundAmount()) {
      return;
    }

    setStep("confirmation");
  };

  const handleSubmitRefund = () => {
    if (!description) {
      onError?.("Please provide a detailed description");
      return;
    }

    requestRefund(
      {
        transactionId,
        amount: parseFloat(amount),
        reason: category,
        description,
      },
      {
        onSuccess: (data) => {
          onSuccess?.(data.data);
          // Reset form
          setTransactionId("");
          setAmount("");
          setReason("");
          setCategory("");
          setDescription("");
          setStep("transaction");
        },
        onError: (error: any) => {
          onError?.(
            error.response?.data?.message || "Failed to submit refund request"
          );
        },
      }
    );
  };

  const renderTransactionStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Find Transaction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="transactionId">Transaction ID</Label>
          <Input
            id="transactionId"
            placeholder="Enter transaction ID (e.g., TX123456789)"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            You can find the transaction ID in your transaction history or
            receipt
          </p>
        </div>

        {transactionError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-sm text-red-700">
              Transaction not found. Please check the transaction ID.
            </span>
          </div>
        )}

        <Button
          onClick={handleTransactionLookup}
          className="w-full"
          disabled={!transactionId || transactionLoading}
        >
          {transactionLoading && (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          )}
          Lookup Transaction
        </Button>
      </CardContent>
    </Card>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      {/* Transaction Details */}
      {transactionData?.data && (
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Transaction ID:</span>
                <p>{transactionData.data.id}</p>
              </div>
              <div>
                <span className="font-medium">Amount:</span>
                <p>
                  {formatCurrency(
                    transactionData.data.amount,
                    transactionData.data.currency
                  )}
                </p>
              </div>
              <div>
                <span className="font-medium">Date:</span>
                <p>
                  {new Date(transactionData.data.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <p className="capitalize">{transactionData.data.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Refund Details Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <RefreshCw className="h-5 w-5 mr-2" />
            Refund Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Refund Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Refund Amount</Label>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1"
                min="0"
                step="0.01"
                max={transactionData?.data?.amount}
              />
            </div>
            {transactionData?.data && (
              <p className="text-sm text-muted-foreground">
                Maximum refund:{" "}
                {formatCurrency(
                  transactionData.data.amount,
                  transactionData.data.currency
                )}
              </p>
            )}
          </div>

          {/* Refund Category */}
          <div className="space-y-2">
            <Label>Refund Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {refundCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Brief Reason</Label>
            <Input
              id="reason"
              placeholder="Brief reason for refund"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setStep("transaction")}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1"
              disabled={!category || !reason || !amount}
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConfirmationStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Confirm Refund Request
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Refund Summary */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">Transaction ID:</span>
            <span>{transactionId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Refund Amount:</span>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(
                parseFloat(amount),
                transactionData?.data?.currency || "HTG"
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Category:</span>
            <span>
              {refundCategories.find((cat) => cat.value === category)?.label}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Reason:</span>
            <span>{reason}</span>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Detailed Description</Label>
          <Textarea
            id="description"
            placeholder="Please provide a detailed explanation for this refund request..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          <p className="text-sm text-muted-foreground">
            A detailed description will help us process your request faster
          </p>
        </div>

        {/* Error Display */}
        {refundError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-sm text-red-700">
              {(refundError as any)?.response?.data?.message ||
                "Failed to submit refund request"}
            </span>
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setStep("details")}
            className="flex-1"
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button
            onClick={handleSubmitRefund}
            className="flex-1"
            disabled={isSubmitting || !description}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isSubmitting ? "Submitting..." : "Submit Refund Request"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-6">
      {["transaction", "details", "confirmation"].map((stepName, index) => {
        const isActive = step === stepName;
        const isCompleted =
          ["transaction", "details", "confirmation"].indexOf(step) > index;

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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {renderStepIndicator()}

      {step === "transaction" && renderTransactionStep()}
      {step === "details" && renderDetailsStep()}
      {step === "confirmation" && renderConfirmationStep()}
    </div>
  );
}

