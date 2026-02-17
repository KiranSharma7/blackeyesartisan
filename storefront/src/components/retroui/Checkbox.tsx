"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@lib/util";
import { Check } from "lucide-react";
import React from "react";

export const Checkbox = React.forwardRef<
  HTMLButtonElement,
  CheckboxPrimitive.CheckboxProps
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded border-2 border-ink shadow-sm transition",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-ink data-[state=checked]:text-paper",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center">
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";
