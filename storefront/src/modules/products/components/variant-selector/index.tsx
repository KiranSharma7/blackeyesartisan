'use client'

import { HttpTypes } from '@medusajs/types'
import { cn } from '@lib/util/cn'
import { Button } from '@/components/retroui/Button'

interface VariantSelectorProps {
  variants: HttpTypes.StoreProductVariant[]
  selectedVariantId: string
  onSelect: (variantId: string) => void
}

export default function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
}: VariantSelectorProps) {
  if (!variants || variants.length <= 1) {
    return null
  }

  return (
    <div className="space-y-3">
      <label className="font-display text-sm uppercase text-ink/60">
        Select Option
      </label>
      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedVariantId
          const isAvailable = (variant.inventory_quantity ?? 0) > 0

          return (
            <Button
              key={variant.id}
              onClick={() => onSelect(variant.id)}
              disabled={!isAvailable}
              variant={isSelected ? 'secondary' : 'outline'}
              size="sm"
              className={cn(
                !isAvailable && 'opacity-40 cursor-not-allowed line-through'
              )}
            >
              {variant.title}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
