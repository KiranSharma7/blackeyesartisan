import { Metadata } from 'next'
import Link from 'next/link'
import { getProductsList } from '@lib/data/products'
import { getRegion } from '@lib/data/regions'
import ProductGrid from '@modules/products/components/product-grid'
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

  const { response } = await getProductsList({
    pageParam: 1,
    queryParams: { limit: 8 },
    countryCode,
  })

  const products = response.products

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="font-display text-5xl md:text-7xl uppercase mb-6">
            Handcrafted
            <br />
            <span className="text-acid">Glass Art</span>
          </h1>
          <p className="text-lg font-medium text-ink/60 max-w-xl mx-auto mb-8">
            One-of-a-kind pieces, handmade in Nepal with love and fire.
          </p>
          <Link href={`/${countryCode}/shop`}>
            <Button size="xl">Shop Now</Button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-stone/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="font-display text-3xl uppercase mb-8">Latest Drops</h2>
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

      {/* Value Props */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-acid/10 border-2 border-ink rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔥</span>
              </div>
              <h3 className="font-display text-xl uppercase mb-2">Handcrafted</h3>
              <p className="text-ink/60 font-medium">
                Each piece is individually made by skilled artisans in Nepal.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-acid/10 border-2 border-ink rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-display text-xl uppercase mb-2">One of a Kind</h3>
              <p className="text-ink/60 font-medium">
                No two pieces are exactly alike. Own something truly unique.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-acid/10 border-2 border-ink rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="font-display text-xl uppercase mb-2">Ships Worldwide</h3>
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
