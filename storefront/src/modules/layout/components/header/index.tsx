'use client'

import { ShoppingBag, Search, Menu } from 'lucide-react'
import { useCartStore } from '@lib/store/useCartStore'
import { useNavStore } from '@lib/store/useNavStore'
import { HttpTypes } from '@medusajs/types'
import { Button } from '@/components/retroui/Button'
import { Badge } from '@/components/retroui/Badge'
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
        <div className="px-4 large:px-6 pt-3 pb-1">
          <nav className="max-w-site mx-auto bg-paper/80 backdrop-blur-md border-2 border-ink rounded-2xl shadow-hard-sm">
            <div className="flex items-center justify-between h-16 large:h-[72px] px-4 large:px-6">
              {/* LEFT: Hamburger (mobile) + Logo */}
              <div className="flex items-center gap-3">
                <div className="block large:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={openMobileMenu}
                    aria-label="Open menu"
                    className="hover:bg-ink/5 -ml-2"
                  >
                    <Menu className="w-5 h-5 text-ink/70" />
                  </Button>
                </div>

                <Logo countryCode={countryCode} logoUrl={logoUrl} />
              </div>

              {/* CENTER: Nav Menu (desktop only) */}
              <div className="hidden large:flex flex-1 justify-center">
                <NavMenu items={navigationItems} countryCode={countryCode} />
              </div>

              {/* RIGHT: Search + Account + Cart */}
              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={openSearch}
                  aria-label="Search"
                  className="hover:bg-ink/5"
                >
                  <Search className="w-[18px] h-[18px] text-ink/70" />
                </Button>

                <AccountDropdown
                  countryCode={countryCode}
                  customer={customer}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={openCartDropdown}
                  className="relative hover:bg-ink/5"
                  aria-label="Open cart"
                  data-testid="cart-button"
                >
                  <ShoppingBag className="w-[18px] h-[18px] text-ink/70" />
                  {itemCount > 0 && (
                    <Badge
                      variant="primary"
                      className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] p-0 flex items-center justify-center text-[9px] font-semibold"
                      data-testid="cart-count"
                    >
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </nav>
        </div>
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
