'use client'

import Link from 'next/link'
import { HttpTypes } from '@medusajs/types'
import { useCartStore } from '@lib/store/useCartStore'
import { convertToLocale } from '@lib/util/money'
import { Button } from '@/components/retroui/Button'
import { Drawer } from '@/components/retroui/Drawer'
import CartItem from '../cart-item'

interface CartDrawerProps {
  cart: HttpTypes.StoreCart | null
  countryCode: string
}

export default function CartDrawer({ cart, countryCode }: CartDrawerProps) {
  const { isOpenCartDropdown, closeCartDropdown } = useCartStore()

  const items = cart?.items || []
  const subtotal = cart?.subtotal || 0
  const currencyCode = cart?.currency_code || 'usd'

  return (
    <Drawer open={isOpenCartDropdown} onOpenChange={(open) => !open && closeCartDropdown()}>
      <Drawer.Content title="Shopping Cart">
        {/* Header */}
        <Drawer.Header>
          <h2 className="font-display font-bold text-2xl uppercase">Your Cart</h2>
        </Drawer.Header>

        {/* Items */}
        <Drawer.Body>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-ink/60 font-medium mb-4">Your cart is empty</p>
              <Button variant="link" onClick={closeCartDropdown}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => <CartItem key={item.id} item={item} />)
          )}
        </Drawer.Body>

        {/* Footer */}
        {items.length > 0 && (
          <Drawer.Footer>
            <div className="flex justify-between mb-4">
              <span className="font-bold">Subtotal</span>
              <span className="font-display font-bold text-xl">
                {convertToLocale({
                  amount: subtotal,
                  currency_code: currencyCode,
                })}
              </span>
            </div>
            <Link href={`/${countryCode}/checkout`} onClick={closeCartDropdown}>
              <Button variant="default" size="lg" className="w-full" data-testid="checkout-link">
                Checkout
              </Button>
            </Link>
          </Drawer.Footer>
        )}
      </Drawer.Content>
    </Drawer>
  )
}
