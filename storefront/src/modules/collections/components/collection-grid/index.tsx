import { HttpTypes } from '@medusajs/types'
import CollectionCard from '../collection-card'

interface CollectionGridProps {
  collections: HttpTypes.StoreCollection[]
  countryCode: string
}

export default function CollectionGrid({
  collections,
  countryCode,
}: CollectionGridProps) {
  if (!collections || collections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-ink/60 font-medium">No collections found.</p>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      data-testid="collection-grid"
    >
      {collections.map((collection) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          countryCode={countryCode}
        />
      ))}
    </div>
  )
}
