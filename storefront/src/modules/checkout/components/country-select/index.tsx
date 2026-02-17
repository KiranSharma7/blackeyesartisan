'use client'

import * as React from 'react'
import { Select } from '@/components/retroui/Select'

export interface CountrySelectProps {
  label?: string
  error?: string
  name?: string
  id?: string
  defaultValue?: string
  value?: string
  required?: boolean
  disabled?: boolean
  onCountryChange?: (countryCode: string) => void
  className?: string
  'data-testid'?: string
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

function CountrySelect({
  label,
  error,
  name,
  defaultValue,
  value,
  onCountryChange,
  'data-testid': dataTestId,
}: CountrySelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || 'us')
  const currentValue = value !== undefined ? value : internalValue

  const handleChange = (newValue: string) => {
    setInternalValue(newValue)
    onCountryChange?.(newValue)
  }

  const selectedCountry = getCountryByCode(currentValue)

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-bold uppercase text-ink/70">
          {label}
        </label>
      )}
      {/* Hidden input to submit form data */}
      <input type="hidden" name={name} value={currentValue} />
      <Select value={currentValue} onValueChange={handleChange}>
        <Select.Trigger
          className="w-full h-12 rounded-xl shadow-hard-sm"
          data-testid={dataTestId}
        >
          <Select.Value>
            {selectedCountry?.label || 'Select country'}
          </Select.Value>
        </Select.Trigger>
        <Select.Content>
          {SHIPPING_COUNTRIES.map((country) => (
            <Select.Item key={country.value} value={country.value}>
              {country.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
      {error && <p className="text-sm font-medium text-acid">{error}</p>}
    </div>
  )
}

export { CountrySelect }
