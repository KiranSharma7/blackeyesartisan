import React, { TextareaHTMLAttributes } from "react";
import { cn } from "@lib/util";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || props.name;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-bold uppercase text-foreground/70"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "px-4 py-3 w-full min-h-[100px] rounded border-2 shadow-md transition focus:outline-hidden focus:shadow-xs font-medium resize-y",
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
Textarea.displayName = "Textarea";
