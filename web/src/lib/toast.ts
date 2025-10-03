import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";
import React from "react";
import { toast as sonnerToast } from "sonner";

// Enhanced toast functions with KobKlein styling
export const toast = {
  success: (message: string, description?: string) => {
    return sonnerToast.success(message, {
      description,
      icon: React.createElement(CheckCircle, { className: "h-4 w-4" }),
      className: "border-green-200 bg-green-50 text-green-900",
    });
  },

  error: (message: string, description?: string) => {
    return sonnerToast.error(message, {
      description,
      icon: React.createElement(AlertTriangle, { className: "h-4 w-4" }),
      className: "border-red-200 bg-red-50 text-red-900",
    });
  },

  warning: (message: string, description?: string) => {
    return sonnerToast.warning(message, {
      description,
      icon: React.createElement(AlertCircle, { className: "h-4 w-4" }),
      className: "border-yellow-200 bg-yellow-50 text-yellow-900",
    });
  },

  info: (message: string, description?: string) => {
    return sonnerToast.info(message, {
      description,
      icon: React.createElement(Info, { className: "h-4 w-4" }),
      className: "border-blue-200 bg-blue-50 text-blue-900",
    });
  },

  // KobKlein specific toasts
  transactionSuccess: (amount: number, type: string) => {
    return toast.success(
      "Transaction Successful",
      `${type} of ${amount} HTG completed successfully`
    );
  },

  transactionFailed: (reason?: string) => {
    return toast.error(
      "Transaction Failed",
      reason || "Unable to process transaction. Please try again."
    );
  },

  walletRefilled: (amount: number) => {
    return toast.success(
      "Wallet Refilled",
      `${amount} HTG has been added to your wallet`
    );
  },

  cardActivated: (cardType: string) => {
    return toast.success(
      "Card Activated",
      `Your ${cardType} card is now ready to use`
    );
  },

  networkError: () => {
    return toast.error(
      "Connection Error",
      "Please check your internet connection and try again"
    );
  },

  loginSuccess: (userName: string) => {
    return toast.success("Welcome back!", `Logged in as ${userName}`);
  },

  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  },

  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    });
  },
};

// Custom hook for toast notifications
export function useToast() {
  return {
    toast,
    dismiss: toast.dismiss,
  };
}
