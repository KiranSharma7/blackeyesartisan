'use client'

import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { Button } from '@/components/retroui/Button'
import { convertToLocale } from '@lib/util/money'
import { HttpTypes } from '@medusajs/types'

interface StripeCardElementProps {
  cart: HttpTypes.StoreCart
  onPaymentComplete: () => Promise<void>
  onError: (error: string) => void
}

export default function StripeCardElement({
  cart,
  onPaymentComplete,
  onError,
}: StripeCardElementProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        throw new Error(submitError.message)
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/us/checkout/payment-processing`,
        },
        redirect: 'if_required',
      })

      if (error) {
        throw new Error(error.message)
      }

      await onPaymentComplete()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed'
      setErrorMessage(message)
      onError(message)
    } finally {
      setIsProcessing(false)
    }
  }

  const total = cart.total || 0
  const currencyCode = cart.currency_code || 'usd'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: 'tabs',
          paymentMethodOrder: ['card'],
        }}
      />

      {errorMessage && (
        <div className="p-3 bg-acid/10 border-2 border-acid rounded-xl">
          <p className="text-sm text-acid font-medium">{errorMessage}</p>
        </div>
      )}

      <Button
        type="submit"
        size="xl"
        className="w-full"
        disabled={!stripe || !elements || isProcessing}
      >
        {isProcessing
          ? 'Processing...'
          : `Pay ${convertToLocale({ amount: total, currency_code: currencyCode })}`}
      </Button>
    </form>
  )
}
