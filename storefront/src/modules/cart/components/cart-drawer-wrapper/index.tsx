'use client'

import { HttpTypes } from '@medusajs/types'
import CartDrawer from '../cart-drawer'

interface CartDrawerWrapperProps {
  cart: HttpTypes.StoreCart | null
  countryCode: string
}

export default function CartDrawerWrapper({ cart, countryCode }: CartDrawerWrapperProps) {
  return <CartDrawer cart={cart} countryCode={countryCode} />
}
