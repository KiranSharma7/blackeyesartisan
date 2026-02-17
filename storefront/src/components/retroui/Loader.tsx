import { cn } from "@lib/util";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const loaderVariants = cva(
  "rounded-full border-ink/20 border-t-acid animate-spin",
  {
    variants: {
      size: {
        sm: "w-5 h-5 border-2",
        md: "w-8 h-8 border-[3px]",
        lg: "w-12 h-12 border-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface LoaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {}

export const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, size = "md", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(loaderVariants({ size }), className)}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  ),
);
Loader.displayName = "Loader";
