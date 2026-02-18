'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useEffect } from 'react'
import { Button } from '@/components/retroui/Button'

interface ParallaxBannerProps {
  countryCode: string
}

export default function ParallaxBanner({ countryCode }: ParallaxBannerProps) {
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!imgRef.current) return
      const section = imgRef.current.parentElement
      if (!section) return
      const rect = section.getBoundingClientRect()
      const offset = rect.top * 0.15
      imgRef.current.style.transform = `translateY(${offset}px)`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative overflow-hidden" style={{ height: '480px' }}>
      {/* Parallax image layer — slightly oversized so translateY has room */}
      <div
        ref={imgRef}
        className="absolute inset-0 will-change-transform"
        style={{ top: '-20%', bottom: '-20%' }}
      >
        <Image
          src="/api/bg-image"
          alt="Handcrafted artisan glass pipes"
          fill
          unoptimized
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h2
          className="font-brand text-4xl md:text-6xl lg:text-7xl text-white leading-tight max-w-3xl"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
        >
          Essential tools
          <br />
          for your perfect session
        </h2>

        <p
          className="mt-4 text-white/80 font-sans text-base md:text-lg max-w-md"
          style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
        >
          Quality you can feel, reliability you can count on
        </p>

        <Link href={`/${countryCode}/shop`} className="mt-8">
          <Button variant="default" size="lg">
            Shop Now &rarr;
          </Button>
        </Link>
      </div>
    </section>
  )
}
