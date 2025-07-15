// File: kobklein/web/src/components/payments/payment-status-tracker.tsx
import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatDate } from '@/lib/utils';

type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

interface PaymentStatusTrackerProps {
  transactionId: string;
  status: PaymentStatus;
  amount: number;
  currency: 'HTG' | 'USD';
  recipient: string;
  createdAt: Date;
  completedAt?: Date;
  failureReason?: string;
  estimatedCompletion?: string;
}

export function PaymentStatusTracker({
  transactionId,
  status,
  amount,
  currency,
  recipient,
  createdAt,
  completedAt,
  failureReason,
  estimatedCompletion
}: PaymentStatusTrackerProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      progress: 25,
      message: 'Payment is waiting to be processed',
    },
    processing: {
      icon: Loader2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      progress: 75,
      message: 'Payment is being processed',
    },
    completed: {
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      progress: 100,
      message: 'Payment completed successfully',
    },
    failed: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      progress: 0,
      message: 'Payment failed',
    },
    cancelled: {
      icon: AlertTriangle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      progress: 0,
      message: 'Payment was cancelled',
    },
  };

  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <KobKleinCard className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Payment Status</h3>
            <p className="text-sm text-muted-foreground font-mono">ID: {transactionId}</p>
          </div>
          <Badge className={`${config.bgColor} ${config.color} border-0`}>
            <IconComponent className={`w-3 h-3 mr-1 ${status === 'processing' ? 'animate-spin' : ''}`} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{config.progress}%</span>
          </div>
          <Progress value={config.progress} className="h-2" />
        </div>

        {/* Payment Details */}
        <div className="bg-accent/30 p-4 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-semibold">{formatCurrency(amount, currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Recipient:</span>
            <span className="font-medium">{recipient}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created:</span>
            <span>{formatDate(createdAt)}</span>
          </div>
          {completedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completed:</span>
              <span>{formatDate(completedAt)}</span>
            </div>
          )}
        </div>

        {/* Status Message */}
        <div className={`p-3 rounded-lg ${config.bgColor}`}>
          <p className={`text-sm ${config.color} flex items-center gap-2`}>
            <IconComponent className={`w-4 h-4 ${status === 'processing' ? 'animate-spin' : ''}`} />
            {config.message}
            {estimatedCompletion && status === 'processing' && (
              <span className="ml-2">• ETA: {estimatedCompletion}</span>
            )}
          </p>
          {failureReason && status === 'failed' && (
            <p className="text-xs text-red-700 mt-1">Reason: {failureReason}</p>
          )}
        </div>

        {/* Timeline Steps */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Transaction Timeline</h4>
          <div className="space-y-2">
            {[
              { step: 'Initiated', completed: true, time: formatDate(createdAt) },
              { step: 'Validated', completed: status !== 'pending', time: status !== 'pending' ? 'Just now' : null },
              { step: 'Processing', completed: ['processing', 'completed'].includes(status), time: ['processing', 'completed'].includes(status) ? 'Just now' : null },
              { step: 'Completed', completed: status === 'completed', time: completedAt ? formatDate(completedAt) : null },
            ].map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  step.completed ? 'bg-kobklein-secondary' : 'bg-gray-300'
                }`} />
                <div className="flex-1 flex justify-between">
                  <span className={`text-sm ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.step}
                  </span>
                  {step.time && (
                    <span className="text-xs text-muted-foreground">{step.time}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </KobKleinCard>
  );
}