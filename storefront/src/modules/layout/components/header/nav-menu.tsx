'use client'

import Link from 'next/link'
import { NavMenuItem } from 'types/strapi'

interface NavMenuProps {
  items: NavMenuItem[]
  countryCode: string
}

export default function NavMenu({ items, countryCode }: NavMenuProps) {
  const sortedItems = [...items].sort((a, b) => a.order - b.order)

  return (
    <div className="hidden md:flex items-center gap-1">
      {sortedItems.map((item) => {
        const href = item.url.startsWith('/')
          ? `/${countryCode}${item.url}`
          : item.url

        return (
          <Link
            key={item.id}
            href={href}
            className="px-3 py-2 text-sm font-bold uppercase tracking-wide text-ink/80
                       hover:text-acid transition-colors rounded-lg hover:bg-stone/30"
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
