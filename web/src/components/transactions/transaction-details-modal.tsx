// File: kobklein/web/src/components/transactions/transaction-details-modal.tsx

import React from 'react';
import { X, Copy, Download, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';

interface TransactionDetailsModalProps {
  transaction: {
    id: string;
    type: string;
    status: string;
    amount: number;
    currency: 'HTG' | 'USD';
    description: string;
    otherParty?: {
      name: string;
      role?: string;
      location?: string;
      walletId?: string;
    };
    timestamp: string;
    reference?: string;
    fee?: number;
    method?: string;
    category?: string;
    notes?: string;
    metadata?: Record<string, any>;
  };
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  onCancel?: () => void;
}

export function TransactionDetailsModal({
  transaction,
  isOpen,
  onClose,
  onRetry,
  onCancel,
}: TransactionDetailsModalProps) {
  if (!isOpen) return null;

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <RefreshCw className="h-5 w-5 text-yellow-500 animate-spin" />;
      default:
        return <RefreshCw className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    const statusConfig = {
      completed: { label: 'Completed', class: 'text-green-600 border-green-200 bg-green-50' },
      pending: { label: 'Pending', class: 'text-yellow-600 border-yellow-200 bg-yellow-50' },
      failed: { label: 'Failed', class: 'text-red-600 border-red-200 bg-red-50' },
      cancelled: { label: 'Cancelled', class: 'text-gray-600 border-gray-200 bg-gray-50' },
    };

    const config = statusConfig[transaction.status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge variant="outline" className={config.class}>
        {config.label}
      </Badge>
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You might want to show a toast notification here
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h2 className="text-xl font-semibold">Transaction Details</h2>
              <p className="text-sm text-muted-foreground">Reference: {transaction.reference || transaction.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Amount */}
          <div className="flex items-center justify-between">
            <div>
              {getStatusBadge()}
              <p className="text-sm text-muted-foreground mt-1">
                {formatDate(transaction.timestamp, { includeTime: true })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">
                {['send', 'payment', 'withdrawal'].includes(transaction.type) ? '-' : '+'}
                {formatCurrency(transaction.amount, transaction.currency)}
              </p>
              {transaction.fee && transaction.fee > 0 && (
                <p className="text-sm text-muted-foreground">
                  Fee: {formatCurrency(transaction.fee, transaction.currency)}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{transaction.description}</p>
          </div>

          {/* Transaction Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Transaction ID</h4>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {transaction.id}
                  </code>
                  <button
                    onClick={() => copyToClipboard(transaction.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Copy className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Type</h4>
                <Badge variant="outline" className="capitalize">
                  {transaction.type}
                </Badge>
              </div>

              {transaction.method && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Payment Method</h4>
                  <p className="text-sm">{transaction.method}</p>
                </div>
              )}

              {transaction.category && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Category</h4>
                  <p className="text-sm">{transaction.category}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {transaction.reference && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Reference</h4>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                      {transaction.reference}
                    </code>
                    <button
                      onClick={() => copyToClipboard(transaction.reference!)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Copy className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              )}

              {transaction.otherParty && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    {['send', 'payment'].includes(transaction.type) ? 'Recipient' : 'Sender'}
                  </h4>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{transaction.otherParty.name}</p>
                    {transaction.otherParty.role && (
                      <p className="text-xs text-muted-foreground capitalize">
                        {transaction.otherParty.role}
                      </p>
                    )}
                    {transaction.otherParty.location && (
                      <p className="text-xs text-muted-foreground">
                        {transaction.otherParty.location}
                      </p>
                    )}
                    {transaction.otherParty.walletId && (
                      <p className="text-xs text-muted-foreground font-mono">
                        ID: {transaction.otherParty.walletId}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {transaction.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                {transaction.notes}
              </p>
            </div>
          )}

          {/* Metadata */}
          {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Additional Information</h3>
              <div className="bg-gray-50 p-3 rounded">
                <pre className="text-xs text-muted-foreground overflow-x-auto">
                  {JSON.stringify(transaction.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors">
              <Download className="h-4 w-4" />
              <span>Download Receipt</span>
            </button>
            <button
              onClick={() => copyToClipboard(transaction.id)}
              className="flex items-center space-x-2 px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span>Copy ID</span>
            </button>
          </div>

          <div className="flex space-x-2">
            {onRetry && transaction.status === 'failed' && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Retry Transaction
              </button>
            )}
            {onCancel && transaction.status === 'pending' && (
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Cancel Transaction
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}