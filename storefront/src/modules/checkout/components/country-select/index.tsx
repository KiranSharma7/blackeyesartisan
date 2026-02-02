'use client'

import * as React from 'react'
import { cn } from '@lib/util/cn'
import { ChevronDown } from 'lucide-react'

export interface CountrySelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string
  error?: string
  onCountryChange?: (countryCode: string) => void
}

/**
 * Comprehensive list of countries for international shipping
 * Sorted with US first (primary market), then alphabetically by label
 */
export const SHIPPING_COUNTRIES = [
  { value: 'us', label: 'United States', phoneCode: '+1' },
  { value: 'au', label: 'Australia', phoneCode: '+61' },
  { value: 'at', label: 'Austria', phoneCode: '+43' },
  { value: 'be', label: 'Belgium', phoneCode: '+32' },
  { value: 'br', label: 'Brazil', phoneCode: '+55' },
  { value: 'ca', label: 'Canada', phoneCode: '+1' },
  { value: 'dk', label: 'Denmark', phoneCode: '+45' },
  { value: 'fi', label: 'Finland', phoneCode: '+358' },
  { value: 'fr', label: 'France', phoneCode: '+33' },
  { value: 'de', label: 'Germany', phoneCode: '+49' },
  { value: 'hk', label: 'Hong Kong', phoneCode: '+852' },
  { value: 'ie', label: 'Ireland', phoneCode: '+353' },
  { value: 'it', label: 'Italy', phoneCode: '+39' },
  { value: 'jp', label: 'Japan', phoneCode: '+81' },
  { value: 'mx', label: 'Mexico', phoneCode: '+52' },
  { value: 'nl', label: 'Netherlands', phoneCode: '+31' },
  { value: 'nz', label: 'New Zealand', phoneCode: '+64' },
  { value: 'no', label: 'Norway', phoneCode: '+47' },
  { value: 'pl', label: 'Poland', phoneCode: '+48' },
  { value: 'pt', label: 'Portugal', phoneCode: '+351' },
  { value: 'sg', label: 'Singapore', phoneCode: '+65' },
  { value: 'kr', label: 'South Korea', phoneCode: '+82' },
  { value: 'es', label: 'Spain', phoneCode: '+34' },
  { value: 'se', label: 'Sweden', phoneCode: '+46' },
  { value: 'ch', label: 'Switzerland', phoneCode: '+41' },
  { value: 'gb', label: 'United Kingdom', phoneCode: '+44' },
] as const

export type ShippingCountryCode = (typeof SHIPPING_COUNTRIES)[number]['value']

/**
 * Get country data by code
 */
export const getCountryByCode = (code: string) => {
  return SHIPPING_COUNTRIES.find(
    (country) => country.value === code.toLowerCase()
  )
}

/**
 * Get phone code for a country
 */
export const getPhoneCodeForCountry = (countryCode: string): string => {
  const country = getCountryByCode(countryCode)
  return country?.phoneCode || '+1'
}

const CountrySelect = React.forwardRef<HTMLSelectElement, CountrySelectProps>(
  ({ className, label, error, id, onCountryChange, ...props }, ref) => {
    const selectId = id || props.name

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onCountryChange) {
        onCountryChange(e.target.value)
      }
    }

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
            onChange={handleChange}
            {...props}
          >
            {SHIPPING_COUNTRIES.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
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
CountrySelect.displayName = 'CountrySelect'

export { CountrySelect }
