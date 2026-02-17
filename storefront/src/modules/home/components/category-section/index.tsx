import Link from 'next/link'
import { listCategories } from '@lib/data/categories'
import { getProductsList } from '@lib/data/products'
import { Button } from '@/components/retroui/Button'
import CategoryCarouselClient from './category-carousel'
import { EnrichedCategory } from './category-card'

interface CategorySectionProps {
  countryCode: string
}

export default async function CategorySection({
  countryCode,
}: CategorySectionProps) {
  const categories = await listCategories()

  if (!categories || categories.length === 0) return null

  // Filter to parent categories only (no nested children)
  const parentCategories = categories.filter(
    (cat: any) => !cat.parent_category_id
  )

  if (parentCategories.length === 0) return null

  // Fetch first product thumbnail for each category
  const enrichedCategories: EnrichedCategory[] = await Promise.all(
    parentCategories.map(async (cat: any) => {
      let thumbnail: string | null = null
      try {
        const result = await getProductsList({
          pageParam: 1,
          queryParams: { category_id: [cat.id], limit: 1 } as any,
          countryCode,
        })
        const firstProduct = result.response.products[0]
        if (firstProduct) {
          thumbnail = firstProduct.thumbnail || null
        }
      } catch {
        // Silently fail — card will show gradient fallback
      }

      return {
        id: cat.id,
        name: cat.name,
        handle: cat.handle,
        description: cat.description || null,
        thumbnail,
      }
    })
  )

  const linkClass =
    'underline underline-offset-4 decoration-2 decoration-acid text-ink font-semibold hover:text-acid transition-colors duration-200'

  return (
    <section className="py-12 md:py-20 overflow-hidden">
      {/* Split-Column Header */}
      <div className="max-w-site mx-auto px-4 md:px-8 mb-10 md:mb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-start">
          {/* Left Column — Headline + CTA */}
          <div>
            <h2 className="font-brand text-4xl md:text-5xl lg:text-6xl leading-snug mb-6 md:mb-8">
              Your Online
              <br />
              <span className="relative inline-block">
                Head Shop
                {/* Accent underline */}
                <span className="absolute -bottom-1 left-0 w-full h-1.5 bg-acid rounded-full" />
              </span>
            </h2>
            <Link href={`/${countryCode}/about`}>
              <Button
                variant="default"
                size="lg"
                className="gap-2"
              >
                Our Story
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </Button>
            </Link>
          </div>

          {/* Right Column — Body text with category links */}
          <div className="flex flex-col gap-5 font-sans text-ink/70 text-base md:text-lg leading-relaxed md:pt-2">
            <p>
              Discover handcrafted glass art from skilled Nepalese artisans.
              From stunning{' '}
              <Link href={`/${countryCode}/categories/bongs`} className={linkClass}>
                bongs
              </Link>{' '}
              and intricate{' '}
              <Link href={`/${countryCode}/categories/pipes`} className={linkClass}>
                pipes
              </Link>{' '}
              to elegant{' '}
              <Link href={`/${countryCode}/categories/rigs`} className={linkClass}>
                rigs
              </Link>
              , each piece is one of a kind.
            </p>
            <p>
              Every item is individually crafted with precision and care —
              no two pieces are ever the same. Browse our categories below
              and find the perfect addition to your collection.
            </p>
          </div>
        </div>
      </div>

      {/* Category Carousel — full-width breakout */}
      <CategoryCarouselClient
        categories={enrichedCategories}
        countryCode={countryCode}
      />
    </section>
  )
}
