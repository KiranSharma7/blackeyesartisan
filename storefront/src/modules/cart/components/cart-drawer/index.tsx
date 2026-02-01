'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { HttpTypes } from '@medusajs/types'
import { useCartStore } from '@lib/store/useCartStore'
import { convertToLocale } from '@lib/util/money'
import { Button } from '@/components/ui/button'
import CartItem from '../cart-item'

interface CartDrawerProps {
  cart: HttpTypes.StoreCart | null
  countryCode: string
}

export default function CartDrawer({ cart, countryCode }: CartDrawerProps) {
  const { isOpenCartDropdown, closeCartDropdown } = useCartStore()

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCartDropdown()
      }
    }

    if (isOpenCartDropdown) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpenCartDropdown, closeCartDropdown])

  if (!isOpenCartDropdown) return null

  const items = cart?.items || []
  const subtotal = cart?.subtotal || 0
  const currencyCode = cart?.currency_code || 'usd'

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/50 z-40"
        onClick={closeCartDropdown}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 w-full max-w-md bg-paper border-l-2 border-ink
                    shadow-hard-xl z-50 flex flex-col animate-fade-in-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-ink">
          <h2 className="font-display text-2xl uppercase">Your Cart</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeCartDropdown}
            aria-label="Close cart"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
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
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t-2 border-ink bg-white">
            <div className="flex justify-between mb-4">
              <span className="font-bold">Subtotal</span>
              <span className="font-display text-xl">
                {convertToLocale({
                  amount: subtotal,
                  currency_code: currencyCode,
                })}
              </span>
            </div>
            <Link href={`/${countryCode}/checkout`} onClick={closeCartDropdown}>
              <Button variant="secondary" size="lg" className="w-full" data-testid="checkout-link">
                Checkout
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
