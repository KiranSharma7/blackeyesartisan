'use client'

import { ShoppingBag, Search, Menu } from 'lucide-react'
import { useCartStore } from '@lib/store/useCartStore'
import { useNavStore } from '@lib/store/useNavStore'
import { HttpTypes } from '@medusajs/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NavMenuItem } from 'types/strapi'
import ScrollWrapper from './scroll-wrapper'
import Logo from './logo'
import NavMenu from './nav-menu'
import AccountDropdown from './account-dropdown'
import SearchOverlay from './search-overlay'
import MobileMenu from './mobile-menu'

interface HeaderProps {
  countryCode: string
  cart?: HttpTypes.StoreCart | null
  customer?: HttpTypes.StoreCustomer | null
  navigationItems?: NavMenuItem[]
  logoUrl?: string
}

export default function Header({
  countryCode,
  cart,
  customer,
  navigationItems = [],
  logoUrl,
}: HeaderProps) {
  const { openCartDropdown } = useCartStore()
  const { openMobileMenu, openSearch } = useNavStore()
  const itemCount =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  return (
    <>
      <ScrollWrapper>
        <nav className="px-4 md:px-8 pt-4 pb-2">
          <div className="max-w-7xl mx-auto bg-paper/90 backdrop-blur-md border-2 border-ink rounded-2xl shadow-hard-sm hover:shadow-hard transition-all px-4 py-3">
            <div className="flex items-center justify-between">
              {/* LEFT: Hamburger (mobile) + Nav Menu (desktop) */}
              <div className="flex items-center gap-2 flex-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={openMobileMenu}
                  className="md:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>

                <NavMenu items={navigationItems} countryCode={countryCode} />
              </div>

              {/* CENTER: Logo */}
              <div className="flex-shrink-0">
                <Logo countryCode={countryCode} logoUrl={logoUrl} />
              </div>

              {/* RIGHT: Search + Account + Cart */}
              <div className="flex items-center gap-1 flex-1 justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={openSearch}
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </Button>

                <AccountDropdown
                  countryCode={countryCode}
                  customer={customer}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={openCartDropdown}
                  className="relative"
                  aria-label="Open cart"
                  data-testid="cart-button"
                >
                  <ShoppingBag className="w-5 h-5" />
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
              </div>
            </div>
          </div>
        </nav>
      </ScrollWrapper>

      {/* Overlays — rendered outside ScrollWrapper so they're not clipped */}
      <SearchOverlay countryCode={countryCode} />
      <MobileMenu
        countryCode={countryCode}
        navigationItems={navigationItems}
        customer={customer}
      />
    </>
  )
}
