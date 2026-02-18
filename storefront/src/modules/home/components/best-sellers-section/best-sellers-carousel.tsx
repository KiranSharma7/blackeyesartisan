'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { HttpTypes } from '@medusajs/types'
import { Carousel } from '@/components/retroui/Carousel'
import BestSellerCardHorizontal from './best-seller-card-horizontal'

interface BestSellersCarouselClientProps {
  products: HttpTypes.StoreProduct[]
  countryCode: string
}

function TopNavButtons() {
  const { canScrollPrev, canScrollNext, scrollPrev, scrollNext } =
    Carousel.useCarousel()

  const btnBase =
    'w-11 h-11 rounded-full border-2 border-ink bg-paper shadow-hard-sm text-ink flex items-center justify-center transition-all duration-200 hover:bg-ink hover:text-paper hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Previous product"
        className={`${btnBase} disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none`}
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
      </button>
      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Next product"
        className={`${btnBase} disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none`}
      >
        <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
      </button>
    </div>
  )
}

export default function BestSellersCarouselClient({
  products,
  countryCode,
}: BestSellersCarouselClientProps) {
  if (!products || products.length === 0) return null

  return (
    <Carousel
      opts={{ loop: false, align: 'start', slidesToScroll: 1 }}
      role="region"
      aria-label="Best Selling Products"
    >
      {/* Section header */}
      <div className="max-w-site mx-auto px-4 md:px-8 mb-10 md:mb-14">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="font-brand text-4xl md:text-5xl lg:text-6xl leading-snug">
              Best{' '}
              <span className="relative inline-block">
                Sellers
                <span className="absolute -bottom-1 left-0 w-full h-1.5 bg-sun rounded-full" />
              </span>
            </h2>
            <p className="mt-3 font-sans text-ink/60 text-base md:text-lg leading-relaxed">
              Our most-loved pieces, chosen by collectors worldwide.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 pb-1">
            <TopNavButtons />
            <Link
              href={`/${countryCode}/shop`}
              className="hidden sm:inline-flex items-center gap-1.5 font-sans font-semibold text-sm text-ink/60 hover:text-acid transition-colors duration-200 underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-acid"
            >
              View All
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Full-viewport-width carousel */}
      <div className="w-[100vw] relative left-1/2 -translate-x-1/2">
        <Carousel.Viewport>
          <Carousel.Slides className="items-stretch">
            <div className="flex-[0_0_16px] md:flex-[0_0_calc((100vw-1366px)/2+32px)] lg:flex-[0_0_calc((100vw-1366px)/2+32px)]" />

            {products.map((product) => (
              <Carousel.Slide
                key={product.id}
                className="flex-[0_0_85%] sm:flex-[0_0_55%] md:flex-[0_0_42%] lg:flex-[0_0_34%] pl-4 md:pl-6 flex"
              >
                <BestSellerCardHorizontal
                  product={product}
                  countryCode={countryCode}
                />
              </Carousel.Slide>
            ))}

            <div className="flex-[0_0_16px] md:flex-[0_0_24px]" />
          </Carousel.Slides>
        </Carousel.Viewport>
      </div>
    </Carousel>
  )
}
