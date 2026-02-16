import Image from 'next/image'
import Link from 'next/link'
import { HttpTypes } from '@medusajs/types'
import { convertToLocale } from '@lib/util/money'
import { cn } from '@lib/util/cn'
import { Badge } from '@/components/retroui/Badge'

interface HeroPeekCardProps {
  product: HttpTypes.StoreProduct
  countryCode: string
}

function getLowestPrice(product: HttpTypes.StoreProduct) {
  if (!product.variants || product.variants.length === 0) return null

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

export default function HeroPeekCard({
  product,
  countryCode,
}: HeroPeekCardProps) {
  const price = getLowestPrice(product)
  const thumbnailUrl = product.thumbnail

  if (!thumbnailUrl) return null

  return (
    <Link
      href={`/${countryCode}/products/${product.handle}`}
      className="group block h-full"
    >
      <div className={cn(
        "relative h-full rounded-2xl border-2 border-ink shadow-hard overflow-hidden bg-ink/[0.08]",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-hard-xl"
      )}>
        {/* PICK Badge */}
        <Badge variant="solid" size="sm" className="absolute top-3 left-3 z-10">Pick</Badge>

        {/* Product Image */}
        <Image
          src={thumbnailUrl}
          alt={product.title || 'Product'}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="20vw"
        />

        {/* Always-visible product info with gradient scrim */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent">
          <h3 className="font-display font-bold text-xs text-paper uppercase line-clamp-2 mb-1 tracking-wide">
            {product.title}
          </h3>
          {price && (
            <p className="text-sm font-bold text-sun">
              {convertToLocale({
                amount: price.amount,
                currency_code: price.currency_code,
              })}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
