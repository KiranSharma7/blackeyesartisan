import { Metadata } from 'next'
import Link from 'next/link'
import { getProductsList } from '@lib/data/products'
import { getRegion } from '@lib/data/regions'
import ProductGrid from '@modules/products/components/product-grid'
import { Button } from '@/components/retroui/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shop | BlackEyesArtisan',
  description: 'Browse our collection of handcrafted glass pipes and art.',
}

interface ShopPageProps {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ page?: string }>
}

export default async function ShopPage({ params, searchParams }: ShopPageProps) {
  const { countryCode } = await params
  const { page: pageParam } = await searchParams

  const page = parseInt(pageParam || '1')
  const limit = 12

  const region = await getRegion(countryCode)

  if (!region) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Region not found</p>
      </div>
    )
  }

  const { response } = await getProductsList({
    pageParam: page,
    queryParams: {
      limit,
    },
    countryCode,
  })

  const products = response.products
  const count = response.count
  const totalPages = Math.ceil(count / limit)

  return (
    <div className="max-w-site mx-auto px-4 md:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-4xl uppercase mb-2">Shop All</h1>
        <p className="text-ink/60 font-medium">
          {count} {count === 1 ? 'product' : 'products'} available
        </p>
      </div>

      {/* Products Grid */}
      <ProductGrid products={products} countryCode={countryCode} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12">
          {page > 1 ? (
            <Link href={`/${countryCode}/shop?page=${page - 1}`}>
              <Button variant="outline" size="md">
                <ChevronLeft className="w-5 h-5 mr-1" />
                Previous
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="md" disabled>
              <ChevronLeft className="w-5 h-5 mr-1" />
              Previous
            </Button>
          )}

          <span className="font-bold text-ink/60">
            Page {page} of {totalPages}
          </span>

          {page < totalPages ? (
            <Link href={`/${countryCode}/shop?page=${page + 1}`}>
              <Button variant="outline" size="md">
                Next
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="md" disabled>
              Next
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
