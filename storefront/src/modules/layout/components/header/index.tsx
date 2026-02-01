'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@lib/store/useCartStore'
import { HttpTypes } from '@medusajs/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

interface HeaderProps {
  countryCode: string
  cart?: HttpTypes.StoreCart | null
}

export default function Header({ countryCode, cart }: HeaderProps) {
  const { openCartDropdown } = useCartStore()
  const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  return (
    <nav className="sticky top-4 z-50 px-4 md:px-8 mb-8">
      <Card className="bg-paper/90 backdrop-blur-md flex justify-between items-center p-4 hover:shadow-hard">
        {/* Logo */}
        <Link
          href={`/${countryCode}`}
          className="text-2xl md:text-3xl font-display tracking-tighter hover:opacity-80 transition-opacity"
        >
          BLACK<span className="text-acid">EYES</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-sm tracking-tight uppercase">
          <Link href={`/${countryCode}/shop`}>
            <Button variant="link">Shop</Button>
          </Link>
          <Link href={`/${countryCode}/collections`}>
            <Button variant="link">Collections</Button>
          </Link>
        </div>

        {/* Cart Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={openCartDropdown}
          className="relative"
          aria-label="Open cart"
          data-testid="cart-button"
        >
          <ShoppingBag className="w-6 h-6" />
          {itemCount > 0 && (
            <Badge
              variant="primary"
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-[10px]"
              data-testid="cart-count"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </Card>
    </nav>
  )
}
