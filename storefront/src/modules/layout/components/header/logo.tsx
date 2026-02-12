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
        width={100}
        height={100}
        className="w-16 h-16 large:w-24 large:h-24 object-contain"
        priority
      />
    </Link>
  )
}
