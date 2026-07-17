import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1",
  {
    variants: {
      variant: {
        default: "border-transparent bg-navy text-paper hover:bg-academic",
        secondary: "border-transparent bg-mist text-navy hover:bg-mist/70",
        outline: "border-navy/20 text-navy/80 bg-transparent",
        accent: "border-transparent bg-teal/25 text-navy",
        gold: "border-transparent bg-gold/15 text-gold",
        success: "border-transparent bg-teal/20 text-academic",
        warning: "border-transparent bg-gold/20 text-gold",
        destructive: "border-transparent bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
