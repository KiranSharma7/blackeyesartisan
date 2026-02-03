'use client'

import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

interface StripeWrapperProps {
  children: React.ReactNode
  clientSecret: string
}

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null

export default function StripeWrapper({ children, clientSecret }: StripeWrapperProps) {
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
