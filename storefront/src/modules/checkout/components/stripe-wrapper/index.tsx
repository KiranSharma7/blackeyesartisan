'use client'

import { useEffect, useState } from 'react'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

interface StripeWrapperProps {
  children: React.ReactNode
  clientSecret: string
}

export default function StripeWrapper({ children, clientSecret }: StripeWrapperProps) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (key) {
      setStripePromise(loadStripe(key))
    }
  }, [])

  if (!stripePromise || !clientSecret) {
    return null
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'flat',
          variables: {
            colorPrimary: '#1a1a1a',
            colorBackground: '#ffffff',
            colorText: '#1a1a1a',
            colorDanger: '#dc2626',
            fontFamily: 'Space Grotesk, sans-serif',
            borderRadius: '12px',
          },
        },
      }}
    >
      {children}
    </Elements>
  )
}
