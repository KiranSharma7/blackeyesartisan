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

    // Build full phone number with country code for validation
    const buildFullPhoneNumber = React.useCallback(
      (phoneValue: string): string => {
        if (!phoneValue) return ''
        // If user already included country code, don't double-add
        if (phoneValue.startsWith('+')) return phoneValue
        if (phoneValue.startsWith(callingCode)) return phoneValue
        // Prepend country calling code for validation
        return `${callingCode}${phoneValue.replace(/^\s+/, '')}`
      },
      [callingCode]
    )

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

      // Validate and notify parent - use full number with country code
      if (onPhoneChange) {
        const fullPhone = buildFullPhoneNumber(newValue)
        const error = validatePhoneWithMessage(fullPhone, countryCode)
        onPhoneChange(fullPhone, error === null)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setHasBlurred(true)

      // Only validate if field has a value (phone is optional)
      if (validateOnBlur && value && value.trim()) {
        const fullPhone = buildFullPhoneNumber(value)
        const error = validatePhoneWithMessage(fullPhone, countryCode)
        setValidationError(error)
      } else {
        setValidationError(null)
      }

      // Call original onBlur if provided
      props.onBlur?.(e)
    }

    // Re-validate when country changes (only if has value)
    React.useEffect(() => {
      if (hasBlurred && value && value.trim()) {
        const fullPhone = buildFullPhoneNumber(value)
        const error = validatePhoneWithMessage(fullPhone, countryCode)
        setValidationError(error)
      } else if (hasBlurred) {
        setValidationError(null)
      }
    }, [countryCode, value, hasBlurred, buildFullPhoneNumber])

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
            For delivery updates and notifications
          </p>
        )}
      </div>
    )
  }
)
PhoneInput.displayName = 'PhoneInput'

export { PhoneInput }
