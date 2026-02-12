'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroBanner } from 'types/strapi'

type HeroCarouselProps = {
  slides: HeroBanner[]
  countryCode: string
}

export default function HeroCarousel({
  slides,
  countryCode,
}: HeroCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const total = slides.length

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total)
  }, [total])

  // Auto-rotate every 5s
  useEffect(() => {
    if (paused || total <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [paused, next, total])

  if (!slides.length) return null

  const getSlideIndex = (offset: number) => {
    return (current + offset + total) % total
  }

  return (
    <section
      aria-label="Hero carousel"
      className="relative w-full h-[100dvh] bg-ink overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-full max-w-site mx-auto px-4 md:px-8">
        {/* Slide track */}
        <div className="relative h-full flex items-center justify-center">
          {slides.map((slide, index) => {
            const offset =
              index === current
                ? 0
                : index === getSlideIndex(1)
                  ? 1
                  : index === getSlideIndex(-1)
                    ? total <= 2 ? -2 : -1
                    : index < current
                      ? -2
                      : 2

            return (
              <div
                key={index}
                className="absolute inset-y-0 transition-all duration-700 ease-in-out rounded-2xl overflow-hidden"
                style={{
                  left:
                    offset === 0
                      ? '5%'
                      : offset === -1
                        ? '-20%'
                        : offset === 1
                          ? '75%'
                          : offset < 0
                            ? '-60%'
                            : '120%',
                  width:
                    offset === 0 ? '90%' : '30%',
                  zIndex: offset === 0 ? 20 : 10,
                  opacity: Math.abs(offset) <= 1 ? 1 : 0,
                  transform:
                    offset === 0
                      ? 'scale(1)'
                      : 'scale(0.85)',
                }}
              >
                {/* Background image */}
                {slide.Image?.url && (
                  <Image
                    src={slide.Image.url}
                    alt={slide.Image.alternativeText ?? slide.Headline}
                    fill
                    priority={index === 0}
                    sizes={offset === 0 ? '90vw' : '30vw'}
                    quality={85}
                    className="object-cover object-center"
                  />
                )}

                {/* Gradient overlay — only on active slide */}
                {offset === 0 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-transparent" />
                )}

                {/* Dimming overlay for side slides */}
                {offset !== 0 && (
                  <div className="absolute inset-0 bg-ink/60" />
                )}

                {/* Content — only on active slide */}
                {offset === 0 && (
                  <div className="absolute inset-0 z-10 flex items-end pb-16 md:pb-20 px-6 md:px-12">
                    <div className="flex items-end justify-between w-full gap-4">
                      {/* Left text */}
                      <div className="max-w-lg">
                        <h2 className="font-brand text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-3">
                          {slide.Headline}
                        </h2>
                        {slide.Text && (
                          <p className="font-sans text-sm md:text-base text-white/70 font-medium max-w-md">
                            {slide.Text}
                          </p>
                        )}
                      </div>

                      {/* Right CTA button */}
                      {slide.CTA && (
                        <div className="shrink-0">
                          <Link
                            href={
                              slide.CTA.BtnLink.startsWith('/')
                                ? `/${countryCode}${slide.CTA.BtnLink}`
                                : slide.CTA.BtnLink
                            }
                          >
                            <Button size="lg" className="whitespace-nowrap">
                              {slide.CTA.BtnText}
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Dots */}
        {total > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === current ? 'true' : undefined}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? 'bg-white w-8'
                    : 'bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
