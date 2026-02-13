'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { X, User, Package, Search } from 'lucide-react'
import { useNavStore } from '@lib/store/useNavStore'
import { Button } from '@/components/retroui/Button'
import { NavMenuItem } from 'types/strapi'
import { HttpTypes } from '@medusajs/types'

interface MobileMenuProps {
  countryCode: string
  navigationItems: NavMenuItem[]
  customer?: HttpTypes.StoreCustomer | null
}

export default function MobileMenu({
  countryCode,
  navigationItems,
  customer,
}: MobileMenuProps) {
  const { isMobileMenuOpen, closeMobileMenu, openSearch } = useNavStore()

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileMenu()
    }

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen, closeMobileMenu])

  if (!isMobileMenuOpen) return null

  const sortedItems = [...navigationItems].sort((a, b) => a.order - b.order)

  const handleSearchClick = () => {
    closeMobileMenu()
    setTimeout(() => openSearch(), 150)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/50 z-[60]"
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed inset-x-0 bottom-0 z-[70] bg-paper border-t-2 border-ink
                    rounded-t-2xl shadow-hard-xl max-h-[85vh] overflow-y-auto"
        style={{
          animation: 'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-ink/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 border-b border-ink/10">
          <span className="font-display font-bold text-lg uppercase">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="px-6 py-4">
          {/* Search */}
          <button
            onClick={handleSearchClick}
            className="w-full flex items-center gap-3 px-4 py-3.5 mb-2 rounded-xl
                       border-2 border-ink/10 hover:border-ink/30 transition-colors"
          >
            <Search className="w-5 h-5 text-ink/50" />
            <span className="text-sm font-medium text-ink/50">Search products...</span>
          </button>

          {/* Nav Links */}
          <div className="mt-2 space-y-1">
            {sortedItems.map((item) => {
              const href = item.url.startsWith('/')
                ? `/${countryCode}${item.url}`
                : item.url

              return (
                <Link key={item.id} href={href} onClick={closeMobileMenu}>
                  <button className="w-full text-left px-4 py-3.5 text-base font-bold uppercase tracking-wide rounded-xl hover:bg-stone/40 transition-colors">
                    {item.label}
                  </button>
                </Link>
              )
            })}
          </div>

          {/* Account Section */}
          <div className="mt-4 pt-4 border-t border-ink/10 space-y-1">
            {customer ? (
              <>
                <div className="px-4 py-2 mb-1">
                  <p className="text-xs font-bold uppercase text-ink/50">
                    {customer.email}
                  </p>
                </div>
                <Link
                  href={`/${countryCode}/account`}
                  onClick={closeMobileMenu}
                >
                  <button className="w-full text-left px-4 py-3.5 flex items-center gap-3 rounded-xl hover:bg-stone/40 transition-colors">
                    <User className="w-5 h-5 text-ink/60" />
                    <span className="text-sm font-semibold">My Account</span>
                  </button>
                </Link>
                <Link
                  href={`/${countryCode}/account/orders`}
                  onClick={closeMobileMenu}
                >
                  <button className="w-full text-left px-4 py-3.5 flex items-center gap-3 rounded-xl hover:bg-stone/40 transition-colors">
                    <Package className="w-5 h-5 text-ink/60" />
                    <span className="text-sm font-semibold">Orders</span>
                  </button>
                </Link>
              </>
            ) : (
              <Link
                href={`/${countryCode}/account`}
                onClick={closeMobileMenu}
              >
                <button className="w-full text-left px-4 py-3.5 flex items-center gap-3 rounded-xl hover:bg-stone/40 transition-colors">
                  <User className="w-5 h-5 text-ink/60" />
                  <span className="text-sm font-semibold">Sign In / Create Account</span>
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Bottom safe area spacing */}
        <div className="h-6" />
      </div>
    </>
  )
}
