"use client";

import { Skeleton } from "./skeleton";

export function TransactionSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border">
      {/* Icon skeleton */}
      <Skeleton className="h-12 w-12 rounded-full" />
      
      {/* Content skeleton */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-1" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-3 w-48" />
      </div>
      
      {/* Status skeleton */}
      <div className="flex flex-col items-end gap-1">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

export function TransactionListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <TransactionSkeleton key={i} />
      ))}
    </div>
  );
}
