import { Metadata } from 'next'
import Link from 'next/link'
import { getProductsList } from '@lib/data/products'
import { getRegion } from '@lib/data/regions'
import { getCollectionsWithProducts } from '@lib/data/collections'
import { getHeroSlidesData } from '@lib/data/fetch'
import ProductGrid from '@modules/products/components/product-grid'
import CollectionGrid from '@modules/collections/components/collection-grid'
import HeroCarousel from '@modules/home/components/hero-carousel'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'BlackEyesArtisan | Handcrafted Glass Art',
  description:
    'One-of-a-kind handcrafted glass pipes and art, made in Nepal with love and fire.',
}

interface HomePageProps {
  params: Promise<{ countryCode: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { countryCode } = await params
  const region = await getRegion(countryCode)

  if (!region) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Region not found</p>
      </div>
    )
  }

  const [productsResult, collections, heroData] = await Promise.all([
    getProductsList({
      pageParam: 1,
      queryParams: { limit: 8 },
      countryCode,
    }),
    getCollectionsWithProducts(countryCode),
    getHeroSlidesData(),
  ])

  const products = productsResult.response.products

  const heroSlides = heroData?.data?.HeroSlides ?? []

  return (
    <>
      {/* Hero Carousel */}
      {heroSlides.length > 0 && (
        <HeroCarousel slides={heroSlides} countryCode={countryCode} />
      )}

      {/* Featured Products */}
      <section className="py-16 bg-stone/20">
        <div className="max-w-site mx-auto px-4 md:px-8">
          <h2 className="font-brand text-3xl md:text-4xl mb-8">Latest Drops</h2>
          <ProductGrid products={products} countryCode={countryCode} />
          <div className="text-center mt-8">
            <Link href={`/${countryCode}/shop`}>
              <Button variant="outline" size="lg">
                View All
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      {collections && collections.length > 0 && (
        <section className="py-16">
          <div className="max-w-site mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-brand text-3xl md:text-4xl">
                Shop by <span className="text-acid">Collection</span>
              </h2>
              <Link href={`/${countryCode}/collections`}>
                <Button variant="ghost" size="sm">
                  View All &rarr;
                </Button>
              </Link>
            </div>
            <CollectionGrid collections={collections} countryCode={countryCode} />
          </div>
        </section>
      )}

      {/* Value Props */}
      <section className="py-16 bg-stone/20">
        <div className="max-w-site mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-acid/10 border-2 border-ink rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔥</span>
              </div>
              <h3 className="font-display font-bold text-xl uppercase mb-2">Handcrafted</h3>
              <p className="text-ink/60 font-medium">
                Each piece is individually made by skilled artisans in Nepal.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-acid/10 border-2 border-ink rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-display font-bold text-xl uppercase mb-2">One of a Kind</h3>
              <p className="text-ink/60 font-medium">
                No two pieces are exactly alike. Own something truly unique.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-acid/10 border-2 border-ink rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="font-display font-bold text-xl uppercase mb-2">Ships Worldwide</h3>
              <p className="text-ink/60 font-medium">
                Secure international shipping with tracking via FedEx.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
