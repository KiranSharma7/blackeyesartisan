'use client'

import { useState, useTransition } from 'react'
import { addToCart } from '@lib/data/cart'
import { useCartStore } from '@lib/store/useCartStore'
import { Button } from '@/components/ui/button'

interface AddToCartButtonProps {
  variantId: string
  countryCode: string
  disabled?: boolean
  inStock?: boolean
}

export default function AddToCartButton({
  variantId,
  countryCode,
  disabled = false,
  inStock = true,
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { openCartDropdown } = useCartStore()

  const handleAddToCart = () => {
    if (!variantId || disabled || !inStock) return

    setError(null)
    startTransition(async () => {
      try {
        await addToCart({
          variantId,
          quantity: 1,
          countryCode,
        })
        openCartDropdown()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add to cart')
      }
    })
  }

  const buttonText = isPending
    ? 'ADDING...'
    : !inStock
      ? 'OUT OF STOCK'
      : 'ADD TO CART'

  return (
    <div className="space-y-2">
      <Button
        onClick={handleAddToCart}
        disabled={isPending || disabled || !inStock}
        size="xl"
        className="w-full"
        data-testid="add-to-cart"
      >
        {buttonText}
      </Button>
      {error && (
        <p className="text-acid text-sm font-medium text-center">{error}</p>
      )}
    </div>
  )
}
