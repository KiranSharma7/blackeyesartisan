import Image from 'next/image'
import Link from 'next/link'
import { HttpTypes } from '@medusajs/types'
import { convertToLocale } from '@lib/util/money'
import { isProductSoldOut } from '@lib/util/inventory'
import { Card } from '@/components/retroui/Card'
import { Badge } from '@/components/retroui/Badge'
import { Button } from '@/components/retroui/Button'

interface BestSellerCardHorizontalProps {
  product: HttpTypes.StoreProduct
  countryCode: string
}

function getLowestPrice(
  product: HttpTypes.StoreProduct
): { amount: number; currency_code: string } | null {
  if (!product.variants || product.variants.length === 0) return null

  let lowest: { amount: number; currency_code: string } | null = null
  for (const variant of product.variants) {
    const cp = variant.calculated_price
    if (cp?.calculated_amount !== undefined) {
      const amt = cp.calculated_amount
      const cur = cp.currency_code || 'usd'
      if (!lowest || amt < lowest.amount) {
        lowest = { amount: amt, currency_code: cur }
      }
    }
  }
  return lowest
}

export default function BestSellerCardHorizontal({
  product,
  countryCode,
}: BestSellerCardHorizontalProps) {
  const price = getLowestPrice(product)
  const thumbnail = product.thumbnail || '/placeholder.png'
  const soldOut = isProductSoldOut(product)
  const category =
    (product as any).collection?.title ||
    (product as any).type?.value ||
    null

  return (
    <Card className="group w-full h-full overflow-hidden rounded-none border-2 border-ink bg-paper shadow-hard hover:shadow-hard-xl hover:-translate-y-1 transition-all duration-300">
      <Link
        href={`/${countryCode}/products/${product.handle}`}
        className="flex h-full"
      >
        {/* Image — left side, fixed height, object-contain so nothing is cropped */}
        <div className="relative w-[42%] shrink-0 self-stretch overflow-hidden bg-ink/[0.04] border-r-2 border-ink">
          {soldOut && (
            <div className="absolute inset-0 z-10 bg-ink/40 flex items-center justify-center">
              <Badge
                variant="secondary"
                size="sm"
                className="font-display uppercase tracking-widest rotate-[-8deg]"
              >
                Sold
              </Badge>
            </div>
          )}

          <Image
            src={thumbnail}
            alt={product.title || 'Product image'}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-[1.06] ${soldOut ? 'grayscale-[40%]' : ''}`}
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 22vw, 18vw"
          />
        </div>

        {/* Info — right side */}
        <div className="flex flex-col justify-between p-4 md:p-5 flex-1 min-w-0">
          <div className="flex flex-col gap-2">
            {category && (
              <Badge variant="warning" size="sm" className="self-start font-sans uppercase tracking-wider">
                {category}
              </Badge>
            )}

            <h3 className="font-display text-sm md:text-base uppercase leading-tight line-clamp-3 text-ink group-hover:text-acid transition-colors duration-200">
              {product.title}
            </h3>

            {product.subtitle && (
              <p className="font-sans text-xs text-ink/50 line-clamp-2 leading-relaxed">
                {product.subtitle}
              </p>
            )}
          </div>

          {/* Bottom: price + CTA */}
          <div className="flex items-center justify-between gap-3 mt-4">
            {price && (
              <span className="font-display text-lg md:text-xl text-ink tracking-tight">
                {convertToLocale({
                  amount: price.amount,
                  currency_code: price.currency_code,
                })}
              </span>
            )}

            <Button
              variant={soldOut ? 'outline' : 'default'}
              size="sm"
              disabled={soldOut}
              className="whitespace-nowrap"
              asChild
            >
              <span>{soldOut ? 'Sold Out' : 'Shop Now'}</span>
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  )
}
