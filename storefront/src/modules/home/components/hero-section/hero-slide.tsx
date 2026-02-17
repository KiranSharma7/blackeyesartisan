import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/retroui/Button'
import { BannerContent } from 'types/strapi'

interface HeroSlideProps {
  slide: BannerContent
  priority?: boolean
}

export default function HeroSlide({ slide, priority = false }: HeroSlideProps) {
  const rawUrl = slide.Image?.url
  if (!rawUrl) return null

  const imageUrl = rawUrl.startsWith('http')
    ? rawUrl
    : `${process.env.NEXT_PUBLIC_STRAPI_URL}${rawUrl}`

  return (
    <div className="relative w-full h-full bg-ink/[0.08] rounded-[2rem] overflow-hidden">
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={slide.Image?.alternativeText || slide.Headline || 'Hero banner'}
        fill
        priority={priority}
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 55vw"
        quality={85}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-10">
        {/* Headline - Pacifico brand font */}
        <h1 className="font-brand text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-paper leading-tight mb-3 text-shadow-sm">
          {slide.Headline}
        </h1>

        {/* Subtext */}
        {slide.Text && (
          <p className="font-sans text-sm md:text-base text-paper/80 max-w-lg mb-5 line-clamp-2">
            {slide.Text}
          </p>
        )}

        {/* CTA Button */}
        {slide.CTA && (
          <Button
            variant="default"
            size="lg"
            asChild
          >
            <Link href={slide.CTA.BtnLink}>{slide.CTA.BtnText}</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
