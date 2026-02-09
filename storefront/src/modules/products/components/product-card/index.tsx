import Image from 'next/image'
import Link from 'next/link'
import { HttpTypes } from '@medusajs/types'
import { convertToLocale } from '@lib/util/money'
import { isProductSoldOut } from '@lib/util/inventory'
import { Card, CardContent } from '@/components/ui/card'
import { SoldBadgeOverlay } from '../sold-badge'

interface ProductCardProps {
  product: HttpTypes.StoreProduct
  countryCode: string
}

function getLowestPrice(product: HttpTypes.StoreProduct): {
  amount: number
  currency_code: string
} | null {
  if (!product.variants || product.variants.length === 0) {
    return null
  }

  let lowestPrice: { amount: number; currency_code: string } | null = null

  for (const variant of product.variants) {
    const calculatedPrice = variant.calculated_price
    if (calculatedPrice?.calculated_amount !== undefined) {
      const amount = calculatedPrice.calculated_amount
      const currency = calculatedPrice.currency_code || 'usd'

      if (!lowestPrice || amount < lowestPrice.amount) {
        lowestPrice = { amount, currency_code: currency }
      }
    }
  }

  return lowestPrice
}

export default function ProductCard({ product, countryCode }: ProductCardProps) {
  const price = getLowestPrice(product)
  const thumbnailUrl = product.thumbnail || '/placeholder.png'
  const soldOut = isProductSoldOut(product)

  return (
    <Link
      href={`/${countryCode}/products/${product.handle}`}
      data-testid="product-card"
    >
      <Card className="group overflow-hidden hover:shadow-hard-xl">
        {/* Image Container */}
        <div
          className="aspect-[4/5] bg-stone/20 border-b-2 border-ink relative overflow-hidden
                      p-6 flex items-center justify-center"
        >
          {/* SOLD Badge for sold-out products */}
          {soldOut && <SoldBadgeOverlay />}

          <Image
            src={thumbnailUrl}
            alt={product.title || 'Product image'}
            fill
            className={`object-contain group-hover:scale-110 transition-transform duration-500 ${
              soldOut ? 'opacity-60' : ''
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <h3 className="font-display font-bold text-lg leading-tight mb-1 uppercase line-clamp-2">
            {product.title}
          </h3>
          {price && (
            <p className="text-sm font-bold text-ink/60">
              {convertToLocale({
                amount: price.amount,
                currency_code: price.currency_code,
              })}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
