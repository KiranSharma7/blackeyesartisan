import Image from 'next/image'
import Link from 'next/link'
import { HttpTypes } from '@medusajs/types'
import { Card, CardContent } from '@/components/ui/card'

interface CollectionCardProps {
  collection: HttpTypes.StoreCollection
  countryCode: string
}

export default function CollectionCard({
  collection,
  countryCode,
}: CollectionCardProps) {
  // Use collection metadata for image if available, otherwise use a gradient placeholder
  const imageUrl =
    (collection.metadata?.image as string) ||
    (collection.metadata?.thumbnail as string) ||
    null

  const productCount = collection.products?.length || 0

  return (
    <Link
      href={`/${countryCode}/collections/${collection.handle}`}
      data-testid="collection-card"
    >
      <Card className="group overflow-hidden hover:shadow-hard-xl">
        {/* Image Container */}
        <div
          className="aspect-[16/10] bg-stone/30 border-b-2 border-ink relative overflow-hidden
                      flex items-center justify-center"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={collection.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
          ) : (
            /* Gradient placeholder when no image */
            <div className="absolute inset-0 bg-gradient-to-br from-acid/20 via-sun/20 to-stone/40" />
          )}

          {/* Collection title overlay */}
          <div className="absolute inset-0 bg-ink/40 group-hover:bg-ink/50 transition-colors flex items-center justify-center">
            <h3 className="font-display text-2xl md:text-3xl text-paper uppercase text-center px-4 drop-shadow-lg">
              {collection.title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink/60">
              {productCount > 0
                ? `${productCount} ${productCount === 1 ? 'piece' : 'pieces'}`
                : 'Coming soon'}
            </p>
            <span className="text-xs font-bold uppercase tracking-wider text-acid group-hover:translate-x-1 transition-transform">
              View Collection &rarr;
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
