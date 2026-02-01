import { HttpTypes } from '@medusajs/types'
import ProductCard from '../product-card'

interface ProductGridProps {
  products: HttpTypes.StoreProduct[]
  countryCode: string
}

export default function ProductGrid({ products, countryCode }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-ink/60 font-medium">No products found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          countryCode={countryCode}
        />
      ))}
    </div>
  )
}
