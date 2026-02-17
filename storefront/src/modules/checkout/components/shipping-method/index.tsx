'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { HttpTypes } from '@medusajs/types'
import { setShippingMethod } from '@lib/data/cart'
import { convertToLocale } from '@lib/util/money'
import { Button } from '@/components/retroui/Button'
import { Radio } from '@/components/retroui/Radio'
import { cn } from '@lib/util/cn'

interface ShippingMethodSelectProps {
  cart: HttpTypes.StoreCart
  shippingOptions: HttpTypes.StoreCartShippingOption[]
  countryCode: string
}

export default function ShippingMethodSelect({
  cart,
  shippingOptions,
  countryCode,
}: ShippingMethodSelectProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    cart.shipping_methods?.[0]?.shipping_option_id || ''
  )

  const handleContinue = () => {
    if (!selectedOptionId) return

    startTransition(async () => {
      try {
        await setShippingMethod({
          cartId: cart.id,
          shippingMethodId: selectedOptionId,
        })
        router.push(`/${countryCode}/checkout?step=payment`)
      } catch (error) {
        console.error('Failed to set shipping method:', error)
      }
    })
  }

  if (!shippingOptions || shippingOptions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-ink/60 font-medium">
          No shipping options available for your location.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Radio
        value={selectedOptionId}
        onValueChange={setSelectedOptionId}
        className="space-y-3"
      >
        {shippingOptions.map((option) => {
          const isSelected = selectedOptionId === option.id
          const price = option.amount || 0
          const currencyCode = cart.currency_code || 'usd'

          return (
            <label
              key={option.id}
              className={cn(
                'flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all',
                isSelected
                  ? 'border-ink bg-ink/5 shadow-hard-sm'
                  : 'border-ink/30 hover:border-ink'
              )}
              data-testid="shipping-option"
            >
              <Radio.Item value={option.id} />
              <div className="flex justify-between items-center w-full">
                <div className="text-left">
                  <p className="font-display text-lg uppercase">{option.name}</p>
                  {(option.data as any)?.estimated_days && (
                    <p className={cn('text-sm', isSelected ? 'opacity-80' : 'text-ink/60')}>
                      Estimated: {(option.data as any).estimated_days} business days
                    </p>
                  )}
                </div>
                <p className="font-bold text-lg">
                  {price === 0
                    ? 'FREE'
                    : convertToLocale({
                        amount: price,
                        currency_code: currencyCode,
                      })}
                </p>
              </div>
            </label>
          )
        })}
      </Radio>

      <Button
        onClick={handleContinue}
        variant="default"
        size="lg"
        className="w-full mt-6"
        disabled={isPending || !selectedOptionId}
        data-testid="continue-payment"
      >
        {isPending ? 'Saving...' : 'Continue to Payment'}
      </Button>
    </div>
  )
}
