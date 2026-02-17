import { cn } from "@lib/util";
import { cva, VariantProps } from "class-variance-authority";
import React, { HTMLAttributes } from "react";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

const alertVariants = cva(
  "border-2 border-ink rounded-xl p-3 text-xs",
  {
    variants: {
      status: {
        info: "bg-sky-100",
        success: "bg-green-100",
        warning: "bg-sun/20",
        error: "bg-acid/10 border-acid",
      },
    },
    defaultVariants: {
      status: "info",
    },
  },
);

const statusIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  showIcon?: boolean;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, status = "info", showIcon = true, children, ...props }, ref) => {
    const IconComponent = statusIcons[status || "info"];

    return (
      <div
        ref={ref}
        role={status === "error" ? "alert" : "note"}
        className={cn(alertVariants({ status }), className)}
        {...props}
      >
        <div className="flex items-start gap-2">
          {showIcon && (
            <IconComponent
              className="h-4 w-4 text-ink/70 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
          )}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    );
  },
);
Alert.displayName = "Alert";
