import { cache } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCollectionByHandle } from '@lib/data/collections'
import { getProductsListByCollectionId } from '@lib/data/products'
import ProductGrid from '@modules/products/components/product-grid'
import { Button } from '@/components/retroui/Button'

interface CollectionPageProps {
  params: Promise<{ countryCode: string; handle: string }>
}

const getCollectionMetadataData = cache(async (handle: string) => {
  const collection = await getCollectionByHandle(handle)
  if (!collection) {
    return null
  }

  return collection
})

const getCollectionPageData = cache(async (countryCode: string, handle: string) => {
  const collection = await getCollectionMetadataData(handle)

  if (!collection) {
    return null
  }

  const { response } = await getProductsListByCollectionId({
    collectionId: collection.id,
    countryCode,
    limit: 24,
  })

  return {
    collection,
    products: response.products,
  }
})

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { handle } = await params
  const collection = await getCollectionMetadataData(handle)

  if (!collection) {
    return {
      title: 'Collection Not Found | Black Eyes Artisan',
    }
  }

  return {
    title: `${collection.title} | Black Eyes Artisan`,
    description: `Browse our ${collection.title} collection of handcrafted glass art pieces.`,
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { countryCode, handle } = await params
  const data = await getCollectionPageData(countryCode, handle)
  if (!data) {
    notFound()
  }

  const { collection, products } = data

  return (
    <div className="py-16">
      <div className="max-w-site mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center text-sm font-medium text-ink/60">
            <li>
              <Link
                href={`/${countryCode}`}
                className="hover:text-ink transition-colors"
              >
                Home
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li>
              <Link
                href={`/${countryCode}/collections`}
                className="hover:text-ink transition-colors"
              >
                Collections
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li className="text-ink">{collection.title}</li>
          </ol>
        </nav>

        {/* Collection Header */}
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl md:text-5xl uppercase mb-4">
            {collection.title}
          </h1>
          {products.length > 0 && (
            <p className="text-lg font-medium text-ink/60">
              {products.length}{' '}
              {products.length === 1 ? 'piece' : 'pieces'} in this collection
            </p>
          )}
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <ProductGrid products={products} countryCode={countryCode} />
        ) : (
          <div className="text-center py-12 bg-ink/5 rounded-2xl border-2 border-ink">
            <h2 className="font-display font-bold text-2xl uppercase mb-2">
              Coming Soon
            </h2>
            <p className="text-ink/60 font-medium mb-6">
              New pieces for this collection are on the way.
            </p>
            <Link href={`/${countryCode}/collections`}>
              <Button variant="outline">Browse Other Collections</Button>
            </Link>
          </div>
        )}

        {/* Back to Collections */}
        <div className="text-center mt-12">
          <Link href={`/${countryCode}/collections`}>
            <Button variant="outline" size="lg">
              &larr; All Collections
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
