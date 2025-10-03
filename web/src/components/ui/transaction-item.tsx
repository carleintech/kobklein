"use client";

import * as React from "react";
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ArrowRightIcon,
  CreditCardIcon,
  SmartphoneIcon,
  QrCodeIcon
} from "lucide-react";
import { formatCurrency, formatDateTime, getTimeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Transaction, TransactionType, TransactionStatus } from "@/types";

interface TransactionItemProps {
  transaction: Transaction;
  currentUserId: string;
  onClick?: () => void;
  className?: string;
}

const typeIcons = {
  send: ArrowUpIcon,
  receive: ArrowDownIcon,
  refill: ArrowDownIcon,
  withdraw: ArrowUpIcon,
  payment: ArrowRightIcon,
  commission: ArrowDownIcon,
};

const methodIcons = {
  card: CreditCardIcon,
  nfc: SmartphoneIcon,
  qr: QrCodeIcon,
  apple_pay: SmartphoneIcon,
  google_pay: SmartphoneIcon,
  bank_transfer: CreditCardIcon,
};

const statusColors = {
  pending: 'text-kobklein-warning',
  completed: 'text-kobklein-success',
  failed: 'text-kobklein-error',
  cancelled: 'text-muted-foreground',
};

export function TransactionItem({ 
  transaction, 
  currentUserId, 
  onClick,
  className 
}: TransactionItemProps) {
  const isOutgoing = transaction.fromUserId === currentUserId;
  const TypeIcon = typeIcons[transaction.type];
  const MethodIcon = methodIcons[transaction.method];
  
  const getTransactionColor = () => {
    if (transaction.status !== 'completed') {
      return statusColors[transaction.status];
    }
    return isOutgoing ? 'text-kobklein-error' : 'text-kobklein-success';
  };

  const getAmountDisplay = () => {
    const sign = isOutgoing ? '-' : '+';
    return `${sign}${formatCurrency(transaction.amount, transaction.currency)}`;
  };

  const getTransactionTitle = () => {
    switch (transaction.type) {
      case 'send':
        return isOutgoing ? 'Sent Money' : 'Received Money';
      case 'refill':
        return 'Wallet Refill';
      case 'withdraw':
        return 'Cash Withdrawal';
      case 'payment':
        return isOutgoing ? 'Payment' : 'Payment Received';
      case 'commission':
        return 'Commission Earned';
      default:
        return 'Transaction';
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Transaction Icon */}
      <div className={cn(
        "flex items-center justify-center w-12 h-12 rounded-full",
        transaction.status === 'completed' 
          ? isOutgoing 
            ? 'bg-red-100 text-red-600' 
            : 'bg-green-100 text-green-600'
          : 'bg-gray-100 text-gray-600'
      )}>
        <TypeIcon className="h-6 w-6" />
      </div>

      {/* Transaction Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm truncate">
            {getTransactionTitle()}
          </h4>
          <span className={cn("font-semibold text-sm", getTransactionColor())}>
            {getAmountDisplay()}
          </span>
        </div>
        
        <div className="flex items-center gap-2 mt-1">
          <MethodIcon className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {transaction.method.replace('_', ' ').toUpperCase()}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">
            {getTimeAgo(transaction.createdAt)}
          </span>
        </div>
        
        {transaction.description && (
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {transaction.description}
          </p>
        )}
      </div>

      {/* Status Indicator */}
      <div className="flex flex-col items-end">
        <div className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          transaction.status === 'completed' && 'bg-green-100 text-green-800',
          transaction.status === 'pending' && 'bg-yellow-100 text-yellow-800',
          transaction.status === 'failed' && 'bg-red-100 text-red-800',
          transaction.status === 'cancelled' && 'bg-gray-100 text-gray-800'
        )}>
          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
        </div>
        
        {transaction.fee > 0 && (
          <span className="text-xs text-muted-foreground mt-1">
            Fee: {formatCurrency(transaction.fee)}
          </span>
        )}
      </div>
    </div>
  );
}
