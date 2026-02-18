import { getCollectionByHandle } from '@lib/data/collections'
import { getProductsList } from '@lib/data/products'
import BestSellersCarouselClient from './best-sellers-carousel'

interface BestSellersSectionProps {
  countryCode: string
}

export default async function BestSellersSection({
  countryCode,
}: BestSellersSectionProps) {
  let products: any[] = []

  // Try to fetch from a "best-sellers" Medusa collection first
  try {
    const collection = await getCollectionByHandle('best-sellers')
    if (collection?.id) {
      const result = await getProductsList({
        pageParam: 1,
        queryParams: { collection_id: [collection.id], limit: 10 } as any,
        countryCode,
      })
      products = result.response.products
    }
  } catch {
    // Collection not found — fall through to fallback
  }

  // Fallback: use latest products
  if (products.length === 0) {
    try {
      const result = await getProductsList({
        pageParam: 1,
        queryParams: { limit: 10 },
        countryCode,
      })
      products = result.response.products
    } catch {
      return null
    }
  }

  if (products.length === 0) return null

  return (
    <section className="py-12 md:py-20 overflow-hidden">
      <BestSellersCarouselClient products={products} countryCode={countryCode} />
    </section>
  )
}
