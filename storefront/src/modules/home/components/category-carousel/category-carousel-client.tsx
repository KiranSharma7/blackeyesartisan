'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { cn } from '@lib/util/cn'
import { CategoryWithImage } from './index'
import CategoryCard from './category-card'

interface CategoryCarouselClientProps {
  categories: CategoryWithImage[]
  countryCode: string
}

export default function CategoryCarouselClient({
  categories,
  countryCode,
}: CategoryCarouselClientProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: false,
    slidesToScroll: 1,
    loop: false,
    dragFree: true,
  })

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

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
    <div>
      {/* Section header with arrows */}
      <div className="max-w-site mx-auto px-4 md:px-8 mb-8 flex items-center justify-between">
        <h2 className="font-brand text-3xl md:text-4xl">
          Shop by <span className="text-acid">Category</span>
        </h2>

        {/* Navigation arrows — desktop only */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={cn(
              'w-10 h-10 rounded-full border-2 border-ink flex items-center justify-center transition-all duration-200',
              canScrollPrev
                ? 'hover:bg-ink hover:text-paper cursor-pointer'
                : 'opacity-30 cursor-not-allowed'
            )}
            aria-label="Previous categories"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 7H1m0 0l5-5M1 7l5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={cn(
              'w-10 h-10 rounded-full border-2 border-ink flex items-center justify-center transition-all duration-200',
              canScrollNext
                ? 'hover:bg-ink hover:text-paper cursor-pointer'
                : 'opacity-30 cursor-not-allowed'
            )}
            aria-label="Next categories"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 7h12m0 0L8 2m5 5L8 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Carousel viewport — full-width overflow for edge peek */}
      <div
        ref={emblaRef}
        className="overflow-hidden"
        role="region"
        aria-label="Shop by category"
      >
        <div className="flex gap-6 pl-4 md:pl-[max(2rem,calc((100vw-1366px)/2+2rem))] pr-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              countryCode={countryCode}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
