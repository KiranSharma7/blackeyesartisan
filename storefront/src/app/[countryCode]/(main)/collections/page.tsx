import { Metadata } from 'next'
import { getCollectionsWithProducts } from '@lib/data/collections'
import CollectionGrid from '@modules/collections/components/collection-grid'

export const metadata: Metadata = {
  title: 'Collections | Black Eyes Artisan',
  description:
    'Browse our curated collections of handcrafted glass art pieces.',
}

interface CollectionsPageProps {
  params: Promise<{ countryCode: string }>
}

export default async function CollectionsPage({ params }: CollectionsPageProps) {
  const { countryCode } = await params
  const collections = await getCollectionsWithProducts(countryCode)

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl md:text-5xl uppercase mb-4">
            Our <span className="text-acid">Collections</span>
          </h1>
          <p className="text-lg font-medium text-ink/60 max-w-xl mx-auto">
            Explore our curated collections of handcrafted glass art, each piece
            made with passion and precision in Nepal.
          </p>
        </div>

        {/* Collections Grid */}
        {collections && collections.length > 0 ? (
          <CollectionGrid collections={collections} countryCode={countryCode} />
        ) : (
          <div className="text-center py-12 bg-stone/20 rounded-2xl border-2 border-ink">
            <h2 className="font-display font-bold text-2xl uppercase mb-2">
              Coming Soon
            </h2>
            <p className="text-ink/60 font-medium">
              Our collections are being curated. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
