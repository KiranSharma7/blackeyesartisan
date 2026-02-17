"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@lib/util";
import React from "react";

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  RadioGroupPrimitive.RadioGroupProps
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn("space-y-3", className)}
    {...props}
  />
));
RadioGroup.displayName = "RadioGroup";

interface RadioItemProps extends RadioGroupPrimitive.RadioGroupItemProps {
  label?: React.ReactNode;
}

const RadioItem = React.forwardRef<HTMLButtonElement, RadioItemProps>(
  ({ className, label, children, ...props }, ref) => (
    <label
      className={cn(
        "flex items-center gap-3 cursor-pointer group",
        className,
      )}
    >
      <RadioGroupPrimitive.Item
        ref={ref}
        className="h-5 w-5 rounded-full border-2 border-ink shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-acid focus-visible:ring-offset-2 data-[state=checked]:border-ink"
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <span className="block h-2.5 w-2.5 rounded-full bg-ink" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {label && <span className="font-medium">{label}</span>}
      {children}
    </label>
  ),
);
RadioItem.displayName = "RadioItem";

const RadioComponent = Object.assign(RadioGroup, {
  Item: RadioItem,
});

export { RadioComponent as Radio };
