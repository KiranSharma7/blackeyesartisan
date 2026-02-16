'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { HttpTypes } from '@medusajs/types'
import { BannerContent } from 'types/strapi'
import HeroSlide from './hero-slide'
import HeroDots from './hero-dots'
import HeroPeekCard from './hero-peek-card'

interface HeroCarouselProps {
  slides: BannerContent[]
  peekProducts: HttpTypes.StoreProduct[]
  countryCode: string
}

export default function HeroCarousel({
  slides,
  peekProducts,
  countryCode,
}: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: slides.length > 1, skipSnaps: false },
    slides.length > 1
      ? [Autoplay({ delay: 5000, stopOnInteraction: true })]
      : []
  )

  const [activeIndex, setActiveIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setActiveIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  )

  const leftPeek = peekProducts[0]
  const rightPeek = peekProducts[1]

  return (
    <section className="w-full py-6 md:py-10">
      <div className="max-w-site mx-auto px-4 md:px-8">
        {/* Responsive grid: single column mobile, 3-panel desktop */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2.5fr_1fr] gap-6 items-stretch">
          {/* Left Peek Product - hidden on mobile */}
          {leftPeek ? (
            <div className="hidden md:block h-[420px] md:-rotate-1 hover:rotate-0 transition-transform duration-300">
              <HeroPeekCard product={leftPeek} countryCode={countryCode} />
            </div>
          ) : (
            <div className="hidden md:block h-[420px]" />
          )}

          {/* Center Carousel */}
          <div className="relative aspect-[16/9] md:aspect-auto md:h-[420px] rounded-[2rem] border-2 border-ink shadow-hard md:shadow-hard-xl overflow-hidden">
            <div ref={emblaRef} className="h-full overflow-hidden">
              <div className="flex h-full">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className="flex-[0_0_100%] min-w-0 h-full"
                  >
                    <HeroSlide slide={slide} priority={index === 0} />
                  </div>
                ))}
              </div>
            </div>

            {/* Dots overlay */}
            <div className="absolute bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 z-20">
              <HeroDots
                count={slides.length}
                activeIndex={activeIndex}
                onDotClick={scrollTo}
              />
            </div>
          </div>

          {/* Right Peek Product - hidden on mobile */}
          {rightPeek ? (
            <div className="hidden md:block h-[420px] md:rotate-1 hover:rotate-0 transition-transform duration-300">
              <HeroPeekCard product={rightPeek} countryCode={countryCode} />
            </div>
          ) : (
            <div className="hidden md:block h-[420px]" />
          )}
        </div>
      </div>
    </section>
  )
}
