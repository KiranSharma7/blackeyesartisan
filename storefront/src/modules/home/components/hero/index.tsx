import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroBanner } from 'types/strapi'
import HeroCta from './hero-cta'

type HeroProps = {
  data: HeroBanner | null
  countryCode: string
}

export default function Hero({ data, countryCode }: HeroProps) {
  // Fallback content when Strapi is unavailable
  const headline = data?.Headline ?? 'Handcrafted Glass Art'
  const text =
    data?.Text ??
    'One-of-a-kind pieces, handmade in Nepal with love and fire.'
  const ctaText = data?.CTA?.BtnText ?? 'Shop Collection'
  const ctaLink = data?.CTA?.BtnLink ?? `/${countryCode}/shop`
  const imageUrl = data?.Image?.url
  const imageAlt = data?.Image?.alternativeText ?? 'BlackEyesArtisan hero'

  // Split headline to highlight "Glass Art" in acid
  const parts = headline.split(/(Glass Art)/i)

  return (
    <section
      aria-label="Hero banner"
      className="relative w-full min-h-[100dvh] bg-ink overflow-hidden flex items-center"
    >
      {/* Background image */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover object-center z-0"
        />
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-ink/90 via-ink/60 to-ink/30 md:bg-gradient-to-r md:from-ink/85 md:via-ink/60 md:to-ink/30" />

      {/* Ambient glow (desktop only) */}
      <div className="hidden md:block absolute top-1/4 right-[10%] w-[400px] h-[400px] rounded-full bg-acid/10 blur-[120px] z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-8 w-full py-24 md:py-0 flex flex-col items-center text-center md:items-start md:text-left md:max-w-2xl md:ml-[max(2rem,calc((100vw-80rem)/2+2rem))]">
        <h1 className="font-brand text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
          {parts.map((part, i) =>
            /glass art/i.test(part) ? (
              <span key={i} className="text-acid">
                {part}
              </span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </h1>

        <p className="font-sans text-base md:text-lg text-white/70 max-w-md font-medium mb-8">
          {text}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href={ctaLink.startsWith('/') ? ctaLink : `/${countryCode}${ctaLink}`}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-xl"
          >
            <Button size="xl" className="w-full sm:w-auto">
              {ctaText}
            </Button>
          </Link>

          {data?.SecondaryCTA && (
            <HeroCta
              text={data.SecondaryCTA.BtnText}
              target={data.SecondaryCTA.BtnLink}
            />
          )}
        </div>
      </div>

      {/* Bottom transition gradient to paper */}
      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-b from-transparent to-paper pointer-events-none z-30" />
    </section>
  )
}
