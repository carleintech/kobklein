"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const containerVariants = cva(
  "w-full mx-auto px-4 sm:px-6 lg:px-8",
  {
    variants: {
      size: {
        sm: "max-w-2xl",
        default: "max-w-7xl",
        lg: "max-w-screen-xl",
        xl: "max-w-screen-2xl",
        full: "max-w-none",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export function Container({ className, size, ...props }: ContainerProps) {
  return (
    <div className={cn(containerVariants({ size }), className)} {...props} />
  );
}
