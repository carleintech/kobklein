import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-kobklein-primary to-kobklein-accent text-white hover:from-kobklein-primary-light hover:to-kobklein-accent-light shadow-lg hover:shadow-xl",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-xl",
        outline:
          "border-2 border-kobklein-primary/20 bg-transparent text-kobklein-primary hover:bg-kobklein-primary hover:text-white backdrop-blur-sm shadow-lg hover:shadow-xl",
        secondary:
          "bg-kobklein-secondary text-white hover:bg-kobklein-secondary/80 shadow-lg hover:shadow-xl",
        ghost: "hover:bg-kobklein-primary/10 hover:text-kobklein-primary",
        link: "text-kobklein-primary underline-offset-4 hover:underline",
        fintech:
          "bg-gradient-to-r from-kobklein-primary via-kobklein-accent to-kobklein-primary-light text-white shadow-2xl hover:shadow-3xl border border-white/20 backdrop-blur-sm",
        fintechSecondary:
          "bg-gradient-to-r from-white/10 via-kobklein-accent/30 to-white/10 text-white shadow-2xl hover:shadow-3xl border-2 border-kobklein-accent/50 backdrop-blur-md hover:from-kobklein-accent/20 hover:via-kobklein-primary/30 hover:to-kobklein-accent/20 hover:border-white/40 transition-all duration-500 relative overflow-hidden group",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-14 rounded-xl px-10 py-4 text-lg",
        xl: "h-16 rounded-2xl px-12 py-5 text-xl",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

