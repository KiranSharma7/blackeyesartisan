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
    <div className="flex items-center gap-1">
      {sortedItems.map((item) => {
        const href = item.url.startsWith('/')
          ? `/${countryCode}${item.url}`
          : item.url

        return (
          <Link
            key={item.id}
            href={href}
            className="px-3 py-1.5 text-[13px] font-semibold uppercase tracking-widest text-ink/60
                       hover:text-paper hover:bg-ink transition-colors rounded-md"
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
