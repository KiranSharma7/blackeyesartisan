'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { placeOrder } from '@lib/data/cart'

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null

export default function PaymentProcessingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    let isMounted = true
    let reloadTimer: ReturnType<typeof setTimeout> | undefined
    let redirectTimer: ReturnType<typeof setTimeout> | undefined

    const processPayment = async () => {
      const clientSecret = searchParams.get('payment_intent_client_secret')

      if (!clientSecret) {
        if (!isMounted) return
        setStatus('error')
        setErrorMessage('Invalid payment session')
        return
      }

      if (!stripePromise) {
        if (!isMounted) return
        setStatus('error')
        setErrorMessage('Stripe not configured')
        return
      }

      const stripe = await stripePromise
      if (!stripe) {
        if (!isMounted) return
        setStatus('error')
        setErrorMessage('Failed to load Stripe')
        return
      }

      const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret)

      if (!paymentIntent) {
        if (!isMounted) return
        setStatus('error')
        setErrorMessage('Payment not found')
        return
      }

      switch (paymentIntent.status) {
        case 'succeeded':
          try {
            await placeOrder()
            if (!isMounted) return
            setStatus('success')
          } catch (err) {
            if (!isMounted) return
            setStatus('error')
            setErrorMessage('Payment succeeded but order failed. Please contact support.')
          }
          break

        case 'processing':
          if (!isMounted) return
          setStatus('processing')
          reloadTimer = setTimeout(() => window.location.reload(), 2000)
          break

        case 'requires_payment_method':
          if (!isMounted) return
          setStatus('error')
          setErrorMessage('Payment failed. Please try another payment method.')
          redirectTimer = setTimeout(() => router.push('/us/checkout?step=payment'), 3000)
          break

        default:
          if (!isMounted) return
          setStatus('error')
          setErrorMessage('Unexpected payment status. Please contact support.')
          break
      }
    }

    void processPayment()

    return () => {
      isMounted = false
      if (reloadTimer) {
        clearTimeout(reloadTimer)
      }
      if (redirectTimer) {
        clearTimeout(redirectTimer)
      }
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-ink/5 flex items-center justify-center">
      <div className="max-w-md mx-auto p-8 bg-white border-2 border-ink rounded-xl shadow-hard">
        {status === 'processing' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-ink border-t-transparent rounded-full animate-spin" />
            <h1 className="font-display text-2xl uppercase text-center mb-2">
              Processing Payment
            </h1>
            <p className="text-center text-ink/60">Please wait...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-acid/10 rounded-full">
              <span className="text-3xl text-acid">✕</span>
            </div>
            <h1 className="font-display text-2xl uppercase text-center mb-2 text-acid">
              Payment Failed
            </h1>
            <p className="text-center text-ink/80">{errorMessage}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-green-100 rounded-full">
              <span className="text-3xl text-green-600">✓</span>
            </div>
            <h1 className="font-display text-2xl uppercase text-center mb-2">
              Payment Successful
            </h1>
            <p className="text-center text-ink/60">Completing your order...</p>
          </>
        )}
      </div>
    </div>
  )
}
