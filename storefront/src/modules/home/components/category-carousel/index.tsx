import { getTopLevelCategories } from '@lib/data/categories'
import { getProductsList } from '@lib/data/products'
import CategoryCarouselClient from './category-carousel-client'

export type CategoryWithImage = {
  id: string
  name: string
  handle: string
  description: string | null
  imageUrl: string | null
}

interface CategoryCarouselProps {
  countryCode: string
}

export default async function CategoryCarousel({
  countryCode,
}: CategoryCarouselProps) {
  try {
    const categories = await getTopLevelCategories()

    if (!categories || categories.length === 0) {
      return null
    }

    // Fetch first product per category in parallel for auto-thumbnails
    const categoryImages = await Promise.all(
      categories.map(async (cat) => {
        // metadata.image_url takes priority
        if (cat.metadata?.image_url) {
          return cat.metadata.image_url as string
        }
        // Fall back to first product's thumbnail
        try {
          const { response } = await getProductsList({
            pageParam: 1,
            queryParams: { limit: 1, category_id: [cat.id] } as any,
            countryCode,
          })
          return response?.products?.[0]?.thumbnail || null
        } catch {
          return null
        }
      })
    )

    const categoriesWithImages: CategoryWithImage[] = categories.map(
      (cat, i) => ({
        id: cat.id,
        name: cat.name,
        handle: cat.handle,
        description: (cat.metadata?.description as string) || null,
        imageUrl: categoryImages[i],
      })
    )

    return (
      <section className="py-12 md:py-16 overflow-hidden">
        <CategoryCarouselClient
          categories={categoriesWithImages}
          countryCode={countryCode}
        />
      </section>
    )
  } catch (error) {
    console.error('Category carousel failed to load:', error)
    return null
  }
}
