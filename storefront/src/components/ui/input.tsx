import * as React from 'react'
import { cn } from '@lib/util/cn'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    const inputId = id || props.name

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-bold uppercase text-ink/70"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            'flex h-12 w-full rounded-xl border-2 border-ink bg-white px-4 py-2 text-base font-medium',
            'shadow-hard-sm transition-all duration-200',
            'placeholder:text-ink/40',
            'focus:outline-none focus:ring-2 focus:ring-acid focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-acid focus:ring-acid',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm font-medium text-acid">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
