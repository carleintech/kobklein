"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gridVariants = cva(
  "grid gap-4",
  {
    variants: {
      cols: {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
        auto: "grid-cols-[repeat(auto-fit,minmax(280px,1fr))]",
      },
      gap: {
        sm: "gap-2",
        default: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
      },
    },
    defaultVariants: {
      cols: 3,
      gap: "default",
    },
  }
);

export interface ResponsiveGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

export function ResponsiveGrid({ 
  className, 
  cols, 
  gap, 
  ...props 
}: ResponsiveGridProps) {
  return (
    <div className={cn(gridVariants({ cols, gap }), className)} {...props} />
  );
}

// Stats grid component
export function StatsGrid({ children, className }: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <ResponsiveGrid 
      cols={4} 
      gap="lg" 
      className={cn("mb-8", className)}
    >
      {children}
    </ResponsiveGrid>
  );
}

// Card grid component
export function CardGrid({ children, className }: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <ResponsiveGrid 
      cols="auto" 
      gap="lg" 
      className={className}
    >
      {children}
    </ResponsiveGrid>
  );
}
