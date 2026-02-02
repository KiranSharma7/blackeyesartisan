'use client'

import * as React from 'react'
import { cn } from '@lib/util/cn'
import {
  validatePhoneWithMessage,
  getPhonePlaceholder,
  formatPhoneAsYouType,
  getCountryCallingCode,
} from '@lib/util/phone-validation'

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  error?: string
  countryCode: string
  onPhoneChange?: (phone: string, isValid: boolean) => void
  validateOnBlur?: boolean
  formatAsYouType?: boolean
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      label,
      error: externalError,
      id,
      countryCode,
      onPhoneChange,
      validateOnBlur = true,
      formatAsYouType = false,
      defaultValue,
      value: controlledValue,
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name
    const [internalValue, setInternalValue] = React.useState<string>(
      (defaultValue as string) || ''
    )
    const [validationError, setValidationError] = React.useState<string | null>(
      null
    )
    const [hasBlurred, setHasBlurred] = React.useState(false)

    // Use controlled value if provided, otherwise internal state
    const value =
      controlledValue !== undefined ? (controlledValue as string) : internalValue

    // Update placeholder when country changes
    const placeholder = React.useMemo(() => {
      return getPhonePlaceholder(countryCode)
    }, [countryCode])

    // Get country calling code for display
    const callingCode = React.useMemo(() => {
      return getCountryCallingCode(countryCode)
    }, [countryCode])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value

      // Optionally format as user types
      if (formatAsYouType && newValue) {
        newValue = formatPhoneAsYouType(newValue, countryCode)
      }

      setInternalValue(newValue)

      // Clear validation error while typing
      if (validationError) {
        setValidationError(null)
      }

      // Validate and notify parent
      if (onPhoneChange) {
        const error = validatePhoneWithMessage(newValue, countryCode)
        onPhoneChange(newValue, error === null)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setHasBlurred(true)

      if (validateOnBlur && value) {
        const error = validatePhoneWithMessage(value, countryCode)
        setValidationError(error)
      }

      // Call original onBlur if provided
      props.onBlur?.(e)
    }

    // Re-validate when country changes
    React.useEffect(() => {
      if (hasBlurred && value) {
        const error = validatePhoneWithMessage(value, countryCode)
        setValidationError(error)
      }
    }, [countryCode, value, hasBlurred])

    // Determine which error to display (external takes priority)
    const displayError = externalError || validationError

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
        <div className="relative">
          <div className="absolute left-0 top-0 h-12 flex items-center pl-4 pointer-events-none">
            <span className="text-ink/60 font-medium text-sm border-r border-ink/20 pr-3">
              {callingCode}
            </span>
          </div>
          <input
            type="tel"
            id={inputId}
            className={cn(
              'flex h-12 w-full rounded-xl border-2 border-ink bg-white pl-16 pr-4 py-2 text-base font-medium',
              'shadow-hard-sm transition-all duration-200',
              'placeholder:text-ink/40',
              'focus:outline-none focus:ring-2 focus:ring-acid focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              displayError && 'border-acid focus:ring-acid',
              className
            )}
            ref={ref}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder.replace(callingCode, '').trim()}
            autoComplete="tel"
            inputMode="tel"
            {...props}
          />
        </div>
        {displayError ? (
          <p className="text-sm font-medium text-acid">{displayError}</p>
        ) : (
          <p className="text-xs text-ink/60">
            Required for FedEx delivery notifications
          </p>
        )}
      </div>
    )
  }
)
PhoneInput.displayName = 'PhoneInput'

export { PhoneInput }
