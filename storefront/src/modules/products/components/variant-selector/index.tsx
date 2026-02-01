'use client'

import { HttpTypes } from '@medusajs/types'
import { cn } from '@lib/util/cn'

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
            <button
              key={variant.id}
              onClick={() => onSelect(variant.id)}
              disabled={!isAvailable}
              className={cn(
                'px-4 py-2 border-2 border-ink rounded-lg font-medium text-sm transition-all',
                isSelected
                  ? 'bg-ink text-paper shadow-hard-sm'
                  : 'bg-white hover:bg-stone/50',
                !isAvailable && 'opacity-40 cursor-not-allowed line-through'
              )}
            >
              {variant.title}
            </button>
          )
        })}
      </div>
    </div>
  )
}
