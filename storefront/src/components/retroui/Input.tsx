import React, { InputHTMLAttributes } from "react";
import { cn } from "@lib/util";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type = "text", placeholder, className = "", label, error, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-bold uppercase text-foreground/70"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          id={inputId}
          placeholder={placeholder}
          className={cn(
            "px-4 py-2 h-12 w-full rounded border-2 shadow-md transition focus:outline-hidden focus:shadow-xs font-medium",
            error
              ? "border-destructive text-destructive shadow-xs shadow-destructive"
              : "",
            className,
          )}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
