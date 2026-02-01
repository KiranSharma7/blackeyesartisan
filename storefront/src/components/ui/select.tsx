import * as React from 'react'
import { cn } from '@lib/util/cn'
import { ChevronDown } from 'lucide-react'

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    const selectId = id || props.name

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-bold uppercase text-ink/70"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            className={cn(
              'flex h-12 w-full appearance-none rounded-xl border-2 border-ink bg-white px-4 py-2 pr-10 text-base font-medium',
              'shadow-hard-sm transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-acid focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-acid focus:ring-acid',
              className
            )}
            ref={ref}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/60 pointer-events-none" />
        </div>
        {error && <p className="text-sm font-medium text-acid">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }
