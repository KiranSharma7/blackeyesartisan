import { Metadata } from 'next'
import { getRegion } from '@lib/data/regions'
import HeroSection from '@modules/home/components/hero-section'
import CategorySection from '@modules/home/components/category-section'
import BestSellersSection from '@modules/home/components/best-sellers-section'
import ParallaxBanner from '@modules/home/components/parallax-banner'

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

  return (
    <>
      {/* Hero Section */}
      <HeroSection countryCode={countryCode} />

      {/* Category Section — Header + Carousel */}
      <CategorySection countryCode={countryCode} />

      {/* Best Sellers Section — Product Carousel */}
      <BestSellersSection countryCode={countryCode} />

      {/* Parallax Banner — Full-width CTA */}
      <ParallaxBanner countryCode={countryCode} />


      {/* Value Props */}
      <section className="py-16 bg-ink/5">
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
