'use client'

import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  countryCode: string
  logoUrl?: string
}

function getFullLogoUrl(url: string): string {
  if (url.startsWith('http')) return url
  // Strapi returns relative paths like /uploads/logo.png — prepend CMS base URL
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || ''
  return `${strapiUrl}${url}`
}

export default function Logo({ countryCode, logoUrl }: LogoProps) {
  const src = logoUrl ? getFullLogoUrl(logoUrl) : '/logo.png'

  return (
    <Link
      href={`/${countryCode}`}
      className="flex items-center hover:opacity-90 transition-opacity"
    >
      <Image
        src={src}
        alt="Black Eyes Artisan"
        width={80}
        height={80}
        className="w-14 h-14 large:w-20 large:h-20 object-contain"
        priority
      />
    </Link>
  )
}
