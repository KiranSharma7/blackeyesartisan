import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { retrieveCart, enrichLineItems } from '@lib/data/cart'
import { listCartShippingMethods } from '@lib/data/fulfillment'
import { listCartPaymentMethods } from '@lib/data/payment'
import CheckoutTemplate from '@modules/checkout/templates/checkout-template'

export const metadata: Metadata = {
  title: 'Checkout | BlackEyesArtisan',
  description: 'Complete your order',
}

interface CheckoutPageProps {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ step?: string }>
}

export default async function CheckoutPage({
  params,
  searchParams,
}: CheckoutPageProps) {
  const { countryCode } = await params
  const { step: stepParam } = await searchParams

  const cart = await retrieveCart()

  // Redirect to cart if no cart or empty cart
  if (!cart || !cart.items?.length) {
    redirect(`/${countryCode}/cart`)
  }

  // Enrich cart items with full product data
  if (cart.items && cart.region_id) {
    cart.items = await enrichLineItems(cart.items, cart.region_id)
  }

  // Determine current step
  const hasAddress = !!cart.shipping_address?.address_1
  const hasShippingMethod = cart.shipping_methods && cart.shipping_methods.length > 0

  let step: 'address' | 'delivery' | 'payment' = 'address'

  if (stepParam === 'delivery' && hasAddress) {
    step = 'delivery'
  } else if (stepParam === 'payment' && hasAddress && hasShippingMethod) {
    step = 'payment'
  } else if (!hasAddress) {
    step = 'address'
  } else if (!hasShippingMethod) {
    step = 'delivery'
  } else {
    step = 'payment'
  }

  // Fetch shipping options and payment methods
  const [shippingOptions, paymentMethods] = await Promise.all([
    listCartShippingMethods(cart.id),
    cart.region_id ? listCartPaymentMethods(cart.region_id) : null,
  ])

  return (
    <CheckoutTemplate
      cart={cart}
      shippingOptions={shippingOptions || []}
      paymentMethods={paymentMethods || []}
      countryCode={countryCode}
      step={step}
    />
  )
}
