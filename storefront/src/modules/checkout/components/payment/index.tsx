'use client'

import { useState, useTransition } from 'react'
import { HttpTypes } from '@medusajs/types'
import { placeOrder, initiatePaymentSession } from '@lib/data/cart'
import { convertToLocale } from '@lib/util/money'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@lib/util/cn'

interface PaymentFormProps {
  cart: HttpTypes.StoreCart
  paymentMethods: HttpTypes.StorePaymentProvider[]
}

export default function PaymentForm({ cart, paymentMethods }: PaymentFormProps) {
  const [isPending, startTransition] = useTransition()
  const [selectedProviderId, setSelectedProviderId] = useState<string>(
    cart.payment_collection?.payment_sessions?.[0]?.provider_id || 'pp_system_default'
  )
  const [error, setError] = useState<string | null>(null)

  const handleSelectProvider = (providerId: string) => {
    setSelectedProviderId(providerId)
  }

  const handlePlaceOrder = () => {
    setError(null)

    startTransition(async () => {
      try {
        // Initialize payment session if needed
        await initiatePaymentSession(cart, {
          provider_id: selectedProviderId,
        })

        // Place the order
        await placeOrder()
      } catch (err) {
        console.error('Payment error:', err)
        setError(err instanceof Error ? err.message : 'Payment failed. Please try again.')
      }
    })
  }

  const total = cart.total || 0
  const currencyCode = cart.currency_code || 'usd'

  // For MVP, show a simple manual payment option
  const availableProviders = paymentMethods?.length > 0
    ? paymentMethods
    : [{ id: 'pp_system_default', name: 'Manual Payment' }]

  return (
    <div className="space-y-4">
      {/* Payment Method Selection */}
      {availableProviders.map((provider: any) => {
        const isSelected = selectedProviderId === provider.id

        return (
          <button
            key={provider.id}
            type="button"
            onClick={() => handleSelectProvider(provider.id)}
            className={cn(
              'w-full text-left p-4 border-2 border-ink rounded-xl transition-all',
              isSelected
                ? 'bg-ink text-paper shadow-hard-sm'
                : 'bg-white hover:bg-stone/30'
            )}
          >
            <p className="font-display text-lg uppercase">
              {provider.id === 'pp_system_default'
                ? 'Manual Payment'
                : provider.id === 'pp_stripe_stripe'
                ? 'Credit Card'
                : provider.id}
            </p>
          </button>
        )
      })}

      {/* Stripe Card Element would go here for production */}
      {selectedProviderId === 'pp_stripe_stripe' && (
        <Card className="p-6 bg-stone/20">
          <p className="text-sm text-ink/60 text-center">
            Stripe payment integration - Card input will appear here
          </p>
        </Card>
      )}

      {error && (
        <p className="text-acid text-sm font-medium text-center">{error}</p>
      )}

      {/* Place Order Button */}
      <Button
        onClick={handlePlaceOrder}
        size="xl"
        className="w-full mt-6"
        disabled={isPending}
        data-testid="pay-button"
      >
        {isPending
          ? 'Processing...'
          : `Pay ${convertToLocale({ amount: total, currency_code: currencyCode })}`}
      </Button>

      <p className="text-xs text-ink/60 text-center">
        By placing this order, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  )
}
