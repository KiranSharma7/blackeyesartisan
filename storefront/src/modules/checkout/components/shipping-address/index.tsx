'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { HttpTypes } from '@medusajs/types'
import { updateCart } from '@lib/data/cart'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface ShippingAddressFormProps {
  cart: HttpTypes.StoreCart
  countryCode: string
}

// Default country code (single region: USD)
const DEFAULT_COUNTRY = 'us'

// Countries available for shipping (US first, then international alphabetically)
const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'au', label: 'Australia' },
  { value: 'ca', label: 'Canada' },
  { value: 'de', label: 'Germany' },
  { value: 'es', label: 'Spain' },
  { value: 'fr', label: 'France' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'it', label: 'Italy' },
  { value: 'jp', label: 'Japan' },
  { value: 'nl', label: 'Netherlands' },
]

export default function ShippingAddressForm({
  cart,
  countryCode,
}: ShippingAddressFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const shippingAddress = cart.shipping_address

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const newErrors: Record<string, string> = {}

    // Basic validation
    const requiredFields = [
      'first_name',
      'last_name',
      'address_1',
      'city',
      'postal_code',
      'country_code',
      'phone',
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

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
            phone: formData.get('phone') as string,
          },
          billing_address: {
            first_name: formData.get('first_name') as string,
            last_name: formData.get('last_name') as string,
            address_1: formData.get('address_1') as string,
            address_2: (formData.get('address_2') as string) || '',
            city: formData.get('city') as string,
            postal_code: formData.get('postal_code') as string,
            country_code: formData.get('country_code') as string,
            phone: formData.get('phone') as string,
          },
        })
        // Always use 'us' country code for redirects (single region)
        router.push('/us/checkout?step=delivery')
      } catch (error) {
        console.error('Failed to update address:', error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="email"
        label="Email"
        type="email"
        defaultValue={cart.email || ''}
        placeholder="your@email.com"
        error={errors.email}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="first_name"
          label="First Name"
          defaultValue={shippingAddress?.first_name || ''}
          error={errors.first_name}
          required
        />
        <Input
          name="last_name"
          label="Last Name"
          defaultValue={shippingAddress?.last_name || ''}
          error={errors.last_name}
          required
        />
      </div>

      <Input
        name="address_1"
        label="Address"
        defaultValue={shippingAddress?.address_1 || ''}
        placeholder="Street address"
        error={errors.address_1}
        required
      />

      <Input
        name="address_2"
        label="Apartment, suite, etc. (optional)"
        defaultValue={shippingAddress?.address_2 || ''}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="city"
          label="City"
          defaultValue={shippingAddress?.city || ''}
          error={errors.city}
          required
        />
        <Input
          name="postal_code"
          label="Postal Code"
          defaultValue={shippingAddress?.postal_code || ''}
          error={errors.postal_code}
          required
        />
      </div>

      <Select
        name="country_code"
        label="Country"
        options={COUNTRIES}
        defaultValue={shippingAddress?.country_code || DEFAULT_COUNTRY}
        error={errors.country_code}
        required
      />

      <Input
        name="phone"
        label="Phone"
        type="tel"
        defaultValue={shippingAddress?.phone || ''}
        placeholder="+1 555 123 4567"
        error={errors.phone}
        required
      />
      <p className="text-xs text-ink/60 -mt-2">
        Required for FedEx delivery notifications
      </p>

      <Button
        type="submit"
        variant="secondary"
        size="lg"
        className="w-full mt-6"
        disabled={isPending}
      >
        {isPending ? 'Saving...' : 'Continue to Shipping'}
      </Button>
    </form>
  )
}
