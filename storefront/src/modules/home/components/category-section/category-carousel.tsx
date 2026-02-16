'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import CategoryCard, { EnrichedCategory } from './category-card'

interface CategoryCarouselClientProps {
  categories: EnrichedCategory[]
  countryCode: string
}

export default function CategoryCarouselClient({
  categories,
  countryCode,
}: CategoryCarouselClientProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
  })

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <div
      className="relative"
      role="region"
      aria-label="Shop by Category"
    >
      {/* Full-viewport-width wrapper that breaks out of parent container */}
      <div className="w-[100vw] relative left-1/2 -translate-x-1/2">
        {/* Embla viewport */}
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {/* Leading spacer for left inset */}
            <div className="flex-[0_0_16px] md:flex-[0_0_calc((100vw-1366px)/2+32px)] lg:flex-[0_0_calc((100vw-1366px)/2+32px)]" />

            {/* All Products card — always first */}
            <div className="flex-[0_0_72%] sm:flex-[0_0_40%] md:flex-[0_0_28%] lg:flex-[0_0_22%] min-w-0 pl-4 md:pl-6 h-[380px] sm:h-[400px] md:h-[420px]">
              <Link
                href={`/${countryCode}/shop`}
                className="group block h-full"
              >
                <div className="relative h-full rounded-2xl border-2 border-ink bg-ink shadow-hard overflow-hidden transition-all duration-300 hover:shadow-hard-xl hover:-translate-y-1 flex flex-col">
                  {/* Decorative pattern area */}
                  <div className="relative flex-1 min-h-0 overflow-hidden flex items-center justify-center">
                    {/* Grid pattern background */}
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage:
                          'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                      }}
                    />
                    {/* Large arrow icon */}
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full border-2 border-paper/30 flex items-center justify-center group-hover:border-acid group-hover:bg-acid/10 transition-all duration-300">
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-paper"
                        >
                          <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
                        </svg>
                      </div>
                      <span className="text-paper/60 text-sm font-sans font-medium tracking-wide uppercase">
                        Browse Everything
                      </span>
                    </div>
                  </div>

                  {/* Label bar */}
                  <div className="border-t-2 border-paper/20 px-4 py-3 flex items-center justify-between gap-3">
                    <h3 className="font-display font-bold text-base md:text-lg uppercase truncate leading-tight text-paper">
                      All Products
                    </h3>
                    <span className="shrink-0 w-8 h-8 rounded-full bg-paper text-ink flex items-center justify-center transition-all duration-300 group-hover:bg-acid group-hover:text-paper group-hover:translate-x-0.5">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Category cards */}
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex-[0_0_72%] sm:flex-[0_0_40%] md:flex-[0_0_28%] lg:flex-[0_0_22%] min-w-0 pl-4 md:pl-6 h-[380px] sm:h-[400px] md:h-[420px]"
              >
                <CategoryCard
                  category={category}
                  countryCode={countryCode}
                />
              </div>
            ))}
            {/* Trailing spacer so last card has right padding */}
            <div className="flex-[0_0_16px] md:flex-[0_0_24px]" />
          </div>
        </div>

        {/* Navigation Buttons — hidden when can't scroll */}
        {canScrollPrev && (
          <button
            onClick={scrollPrev}
            aria-label="Previous category"
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10
                       w-11 h-11 md:w-12 md:h-12
                       rounded-full border-2 border-ink bg-paper shadow-hard-sm
                       text-ink flex items-center justify-center
                       transition-all duration-200
                       hover:bg-ink hover:text-paper hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]
                       active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {canScrollNext && (
          <button
            onClick={scrollNext}
            aria-label="Next category"
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10
                       w-11 h-11 md:w-12 md:h-12
                       rounded-full border-2 border-ink bg-paper shadow-hard-sm
                       text-ink flex items-center justify-center
                       transition-all duration-200
                       hover:bg-ink hover:text-paper hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]
                       active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
