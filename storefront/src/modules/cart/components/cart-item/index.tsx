'use client'

import { useTransition } from 'react'
import Image from 'next/image'
import { Trash2, Minus, Plus } from 'lucide-react'
import { HttpTypes } from '@medusajs/types'
import { convertToLocale } from '@lib/util/money'
import { updateLineItem, deleteLineItem } from '@lib/data/cart'
import { Button } from '@/components/retroui/Button'

interface CartItemProps {
  item: HttpTypes.StoreCartLineItem
}

export default function CartItem({ item }: CartItemProps) {
  const [isPending, startTransition] = useTransition()

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return
    startTransition(async () => {
      await updateLineItem({
        lineId: item.id,
        quantity: newQuantity,
      })
    })
  }

  const handleRemove = () => {
    startTransition(async () => {
      await deleteLineItem(item.id)
    })
  }

  const thumbnailUrl = item.thumbnail || '/placeholder.png'
  const unitPrice = item.unit_price || 0
  const currencyCode = item.variant?.calculated_price?.currency_code || 'usd'

  return (
    <div
      className={`flex gap-4 py-4 border-b border-ink/10 ${isPending ? 'opacity-50' : ''}`}
    >
      {/* Image */}
      <div className="w-20 h-20 bg-ink/5 border-2 border-ink rounded-xl overflow-hidden flex-shrink-0 relative">
        <Image
          src={thumbnailUrl}
          alt={item.title || 'Product'}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-bold text-sm uppercase truncate">{item.title}</h3>
        {item.variant?.title && item.variant.title !== 'Default' && (
          <p className="text-sm text-ink/60">{item.variant.title}</p>
        )}
        <p className="font-bold mt-1">
          {convertToLocale({
            amount: unitPrice,
            currency_code: currencyCode,
          })}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center border-2 border-ink rounded-xl bg-white h-10 shadow-xs">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleUpdateQuantity(item.quantity - 1)}
          disabled={isPending || item.quantity <= 1}
          className="rounded-r-none h-full"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="px-2 font-bold min-w-[2rem] text-center">
          {item.quantity}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleUpdateQuantity(item.quantity + 1)}
          disabled={isPending}
          className="rounded-l-none h-full"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleRemove}
        disabled={isPending}
        className="text-ink/40 hover:text-acid"
        aria-label="Remove item"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>
  )
}
