import { Metadata } from 'next'
import { retrieveCart, enrichLineItems } from '@lib/data/cart'
import CartTemplate from '@modules/cart/templates/cart-template'

export const metadata: Metadata = {
  title: 'Cart | BlackEyesArtisan',
  description: 'View your shopping cart',
}

interface CartPageProps {
  params: Promise<{ countryCode: string }>
}

export default async function CartPage({ params }: CartPageProps) {
  const { countryCode } = await params
  const cart = await retrieveCart()

  // Enrich cart items with full product data
  if (cart?.items && cart.region_id) {
    cart.items = await enrichLineItems(cart.items, cart.region_id)
  }

  return <CartTemplate cart={cart} countryCode={countryCode} />
}
