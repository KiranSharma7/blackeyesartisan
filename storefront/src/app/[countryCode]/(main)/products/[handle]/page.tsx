import { cache } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { getProductByHandle } from '@lib/data/products'
import { getRegion } from '@lib/data/regions'
import ProductDetail from '@modules/products/components/product-detail'

interface ProductPageProps {
  params: Promise<{ countryCode: string; handle: string }>
}

const getProductPageData = cache(async (countryCode: string, handle: string) => {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const product = await getProductByHandle(handle, region.id)

  if (!product) {
    return null
  }

  return { product }
})

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { handle, countryCode } = await params
  const data = await getProductPageData(countryCode, handle)

  if (!data) {
    return { title: 'Product Not Found | BlackEyesArtisan' }
  }
  const { product } = data

  return {
    title: `${product.title} | BlackEyesArtisan`,
    description: product.description || 'Handcrafted glass art from Nepal.',
    openGraph: {
      title: product.title || 'BlackEyesArtisan Product',
      description: product.description || 'Handcrafted glass art from Nepal.',
      images: product.thumbnail ? [{ url: product.thumbnail }] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { countryCode, handle } = await params
  const data = await getProductPageData(countryCode, handle)
  if (!data) {
    notFound()
  }
  const { product } = data

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm font-semibold opacity-60 mb-8">
        <Link
          href={`/${countryCode}`}
          className="hover:text-ink hover:opacity-100 transition-opacity"
        >
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          href={`/${countryCode}/shop`}
          className="hover:text-ink hover:opacity-100 transition-opacity"
        >
          Shop
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-ink opacity-100 border-b-2 border-acid">
          {product.title}
        </span>
      </nav>

      {/* Product Detail */}
      <ProductDetail product={product} countryCode={countryCode} />
    </div>
  )
}
