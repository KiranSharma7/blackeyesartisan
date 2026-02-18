import Image from 'next/image'
import Link from 'next/link'
import { HttpTypes } from '@medusajs/types'
import { convertToLocale } from '@lib/util/money'
import { isProductSoldOut } from '@lib/util/inventory'

interface BestSellerCardProps {
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

export default function BestSellerCard({
  product,
  countryCode,
}: BestSellerCardProps) {
  const price = getLowestPrice(product)
  const thumbnail = product.thumbnail || '/placeholder.png'
  const soldOut = isProductSoldOut(product)

  return (
    <Link href={`/${countryCode}/products/${product.handle}`} className="group block">
      <div className="rounded-2xl border-2 border-ink bg-paper shadow-hard overflow-hidden transition-all duration-300 hover:shadow-hard-xl hover:-translate-y-1">

        {/* Image area — fixed height, fills top of card */}
        <div className="relative h-64 overflow-hidden bg-paper">

          {/* SOLD badge — top right */}
          {soldOut && (
            <div className="absolute top-3 right-3 z-20">
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-display uppercase tracking-wider bg-ink text-paper border-2 border-ink rounded-xl shadow-hard-sm">
                SOLD
              </span>
            </div>
          )}

          {/* Product image */}
          <Image
            src={thumbnail}
            alt={product.title || 'Product image'}
            fill
            className={`object-contain transition-transform duration-500 group-hover:scale-105 ${soldOut ? 'opacity-60' : ''}`}
            sizes="(max-width: 640px) 75vw, (max-width: 768px) 42vw, (max-width: 1024px) 28vw, 22vw"
          />
        </div>

        {/* Bottom info bar — ink background */}
        <div className="border-t-2 border-ink px-4 py-3 bg-ink flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-bold text-base md:text-lg uppercase line-clamp-3 leading-tight text-paper">
              {product.title}
            </h3>
            {price && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-bold font-sans rounded border border-sun/40 bg-sun text-ink">
                {convertToLocale({
                  amount: price.amount,
                  currency_code: price.currency_code,
                })}
              </span>
            )}
          </div>

          {/* Arrow circle */}
          <span className="shrink-0 w-8 h-8 rounded-full bg-paper text-ink flex items-center justify-center transition-all duration-300 group-hover:bg-acid group-hover:text-paper group-hover:translate-x-0.5">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
