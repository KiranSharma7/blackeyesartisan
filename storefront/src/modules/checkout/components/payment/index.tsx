'use client'

import { useState, useTransition, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { HttpTypes } from '@medusajs/types'
import { placeOrder, initiatePaymentSession } from '@lib/data/cart'
import { convertToLocale } from '@lib/util/money'
import { Button } from '@/components/retroui/Button'
import { cn } from '@lib/util/cn'

const StripeWrapper = dynamic(() => import('../stripe-wrapper'))
const StripeCardElement = dynamic(() => import('../stripe-card-element'))

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
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoadingSecret, setIsLoadingSecret] = useState(false)

  const handleSelectProvider = (providerId: string) => {
    setSelectedProviderId(providerId)
    // Clear client secret when switching providers to force a fresh fetch
    if (providerId !== 'pp_stripe_stripe') {
      setClientSecret(null)
    }
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

  useEffect(() => {
    // Fetch a fresh client secret when Stripe is selected
    // We always fetch fresh to ensure the PaymentIntent matches current cart total
    if (selectedProviderId === 'pp_stripe_stripe') {
      setClientSecret(null) // Clear old secret first
      fetchClientSecret()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProviderId, cart.id, cart.total])

  const fetchClientSecret = async () => {
    setIsLoadingSecret(true)
    setError(null)

    try {
      const response = await initiatePaymentSession(cart, {
        provider_id: selectedProviderId,
      })

      // Use the returned payment_collection from the response, not the stale cart prop
      const paymentSession = response?.payment_collection?.payment_sessions?.find(
        (session: any) => session.provider_id === selectedProviderId
      )

      if (paymentSession?.data?.client_secret) {
        setClientSecret(paymentSession.data.client_secret as string)
      } else {
        throw new Error('Failed to get payment client secret')
      }
    } catch (err) {
      console.error('Payment initialization error:', err)
      setError('Failed to initialize payment. Please try again.')
    } finally {
      setIsLoadingSecret(false)
    }
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

      {/* Stripe Payment Form */}
      {selectedProviderId === 'pp_stripe_stripe' && (
        <div className="mt-4">
          {isLoadingSecret ? (
            <div className="p-6 text-center">
              <p className="text-sm text-ink/60">Loading payment form...</p>
            </div>
          ) : clientSecret ? (
            <StripeWrapper clientSecret={clientSecret}>
              <StripeCardElement
                cart={cart}
                onPaymentComplete={async () => {
                  await placeOrder()
                }}
                onError={setError}
              />
            </StripeWrapper>
          ) : (
            <div className="p-4 bg-acid/10 border border-acid rounded-lg">
              <p className="text-sm text-acid">Failed to load payment form. Please try manual payment.</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-acid text-sm font-medium text-center">{error}</p>
      )}

      {/* Place Order Button (hidden for Stripe) */}
      {selectedProviderId !== 'pp_stripe_stripe' && (
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
      )}

      <p className="text-xs text-ink/60 text-center">
        By placing this order, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  )
}
