'use client'

import { useState, useTransition, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { HttpTypes } from '@medusajs/types'
import { updateCart } from '@lib/data/cart'
import { Input } from '@/components/retroui/Input'
import { Button } from '@/components/retroui/Button'
import { Alert } from '@/components/retroui/Alert'
import {
  CountrySelect,
  SHIPPING_COUNTRIES,
} from '@modules/checkout/components/country-select'
import { PhoneInput } from '@modules/checkout/components/phone-input'
import {
  validatePhoneWithMessage,
  formatPhoneE164,
} from '@lib/util/phone-validation'

interface ShippingAddressFormProps {
  cart: HttpTypes.StoreCart
  countryCode: string
}

// Default country code (single region: USD)
const DEFAULT_COUNTRY = 'us'

export default function ShippingAddressForm({
  cart,
  countryCode,
}: ShippingAddressFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedCountry, setSelectedCountry] = useState<string>(
    cart.shipping_address?.country_code || DEFAULT_COUNTRY
  )
  const [phoneValue, setPhoneValue] = useState<string>(
    cart.shipping_address?.phone || ''
  )
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(true)

  const shippingAddress = cart.shipping_address

  const handleCountryChange = useCallback((newCountryCode: string) => {
    setSelectedCountry(newCountryCode)
    // Clear phone error when country changes as format may differ
    setErrors((prev) => {
      const { phone, ...rest } = prev
      return rest
    })
  }, [])

  const handlePhoneChange = useCallback((phone: string, isValid: boolean) => {
    setPhoneValue(phone)
    setIsPhoneValid(isValid)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const newErrors: Record<string, string> = {}

    // Basic validation for required fields
    const requiredFields = [
      'first_name',
      'last_name',
      'address_1',
      'city',
      'postal_code',
      'country_code',
    ]

    for (const field of requiredFields) {
      if (!formData.get(field)) {
        newErrors[field] = 'This field is required'
      }
    }

    // Email validation
    const email = formData.get('email') as string
    if (!email || !email.includes('@')) {
      newErrors.email = 'Valid email is required'
    }

    // Phone is optional - only validate format if provided
    const phone = phoneValue
    const country = formData.get('country_code') as string

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    // Format phone to E.164 before saving
    const formattedPhone = formatPhoneE164(phone, country)

    startTransition(async () => {
      try {
        await updateCart({
          email: email,
          shipping_address: {
            first_name: formData.get('first_name') as string,
            last_name: formData.get('last_name') as string,
            address_1: formData.get('address_1') as string,
            address_2: (formData.get('address_2') as string) || '',
            city: formData.get('city') as string,
            postal_code: formData.get('postal_code') as string,
            country_code: formData.get('country_code') as string,
            phone: formattedPhone,
          },
          billing_address: {
            first_name: formData.get('first_name') as string,
            last_name: formData.get('last_name') as string,
            address_1: formData.get('address_1') as string,
            address_2: (formData.get('address_2') as string) || '',
            city: formData.get('city') as string,
            postal_code: formData.get('postal_code') as string,
            country_code: formData.get('country_code') as string,
            phone: formattedPhone,
          },
        })
        // Always use 'us' country code for redirects (single region)
        router.push('/us/checkout?step=delivery')
      } catch (error) {
        console.error('Failed to update address:', error)
        setErrors({ form: 'Failed to save address. Please try again.' })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.form && (
        <Alert status="error">
          {errors.form}
        </Alert>
      )}

      <Input
        name="email"
        label="Email"
        type="email"
        defaultValue={cart.email || ''}
        placeholder="your@email.com"
        error={errors.email}
        required
        data-testid="shipping-email-input"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="first_name"
          label="First Name"
          defaultValue={shippingAddress?.first_name || ''}
          error={errors.first_name}
          required
          data-testid="shipping-first-name-input"
        />
        <Input
          name="last_name"
          label="Last Name"
          defaultValue={shippingAddress?.last_name || ''}
          error={errors.last_name}
          required
          data-testid="shipping-last-name-input"
        />
      </div>

      <Input
        name="address_1"
        label="Address"
        defaultValue={shippingAddress?.address_1 || ''}
        placeholder="Street address"
        error={errors.address_1}
        required
        data-testid="shipping-address-input"
      />

      <Input
        name="address_2"
        label="Apartment, suite, etc. (optional)"
        defaultValue={shippingAddress?.address_2 || ''}
        data-testid="shipping-address-2-input"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="city"
          label="City"
          defaultValue={shippingAddress?.city || ''}
          error={errors.city}
          required
          data-testid="shipping-city-input"
        />
        <Input
          name="postal_code"
          label="Postal Code"
          defaultValue={shippingAddress?.postal_code || ''}
          error={errors.postal_code}
          required
          data-testid="shipping-postal-code-input"
        />
      </div>

      <CountrySelect
        name="country_code"
        label="Country"
        defaultValue={selectedCountry}
        onCountryChange={handleCountryChange}
        error={errors.country_code}
        required
        data-testid="shipping-country-select"
      />

      <PhoneInput
        name="phone"
        label="Phone (optional)"
        countryCode={selectedCountry}
        defaultValue={phoneValue}
        onPhoneChange={handlePhoneChange}
        error={errors.phone}
        data-testid="shipping-phone-input"
      />

      <Button
        type="submit"
        variant="default"
        size="lg"
        className="w-full mt-6"
        disabled={isPending}
      >
        {isPending ? 'Saving...' : 'Continue to Shipping'}
      </Button>
    </form>
  )
}
