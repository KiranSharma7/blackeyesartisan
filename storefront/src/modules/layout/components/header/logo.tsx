'use client'

import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  countryCode: string
  logoUrl?: string
}

export default function Logo({ countryCode, logoUrl }: LogoProps) {
  return (
    <Link
      href={`/${countryCode}`}
      className="flex items-center hover:opacity-90 transition-opacity"
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt="Black Eyes Artisan"
          width={56}
          height={56}
          className="w-12 h-12 md:w-14 md:h-14 object-contain"
          priority
        />
      ) : (
        <Image
          src="/logo.png"
          alt="Black Eyes Artisan"
          width={56}
          height={56}
          className="w-12 h-12 md:w-14 md:h-14 object-contain"
          priority
        />
      )}
    </Link>
  )
}
