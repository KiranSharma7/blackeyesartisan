import { getMidBannerData } from '@lib/data/fetch'
import { getCollectionByHandle } from '@lib/data/collections'
import { getProductsList, getProductsListByCollectionId } from '@lib/data/products'
import { BannerContent } from 'types/strapi'
import HeroCarousel from './hero-carousel'
import HeroSkeleton from './hero-skeleton'

const HERO_PICKS_HANDLE = 'hero-picks'

// TODO: Remove mock data once Strapi MidBanner is populated
const MOCK_SLIDES: BannerContent[] = [
  {
    Headline: 'Art Born from Fire',
    Text: 'Handcrafted borosilicate glass pipes, made in Nepal with love and fire.',
    CTA: { id: 1, BtnText: 'Shop Now', BtnLink: '/us/shop' },
    Image: {
      url: 'https://images.unsplash.com/photo-1563826904577-6b72c5d75e53?w=1200&q=80',
      alternativeText: 'Handcrafted glass art',
    },
  },
  {
    Headline: 'One of a Kind',
    Text: 'No two pieces are exactly alike. Own something truly unique.',
    CTA: { id: 2, BtnText: 'View Collections', BtnLink: '/us/collections' },
    Image: {
      url: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&q=80',
      alternativeText: 'Unique handmade glass pieces',
    },
  },
]

interface HeroSectionProps {
  countryCode: string
}

export default async function HeroSection({ countryCode }: HeroSectionProps) {
  try {
    const [heroData, heroPicks] = await Promise.all([
      getMidBannerData(),
      getCollectionByHandle(HERO_PICKS_HANDLE),
    ])

    // Fetch peek products from "hero-picks" collection, fall back to first 2 products
    let peekProducts
    if (heroPicks?.id) {
      const { response } = await getProductsListByCollectionId({
        collectionId: heroPicks.id,
        countryCode,
        limit: 2,
      })
      peekProducts = response?.products || []
    } else {
      const { response } = await getProductsList({
        pageParam: 1,
        queryParams: { limit: 2 },
        countryCode,
      })
      peekProducts = response?.products || []
    }

    const midBanner = heroData?.data?.MidBanner

    // Use CMS data if available, otherwise fall back to mock slides
    const slides = midBanner ? [midBanner] : MOCK_SLIDES

    return (
      <HeroCarousel
        slides={slides}
        peekProducts={peekProducts}
        countryCode={countryCode}
      />
    )
  } catch (error) {
    console.error('Hero section failed to load:', error)
    return null
  }
}
