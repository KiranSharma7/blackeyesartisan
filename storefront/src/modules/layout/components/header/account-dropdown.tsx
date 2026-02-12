'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { User } from 'lucide-react'
import { useNavStore } from '@lib/store/useNavStore'
import { signout } from '@lib/data/customer'
import { Button } from '@/components/ui/button'
import { HttpTypes } from '@medusajs/types'

interface AccountDropdownProps {
  countryCode: string
  customer?: HttpTypes.StoreCustomer | null
}

export default function AccountDropdown({
  countryCode,
  customer,
}: AccountDropdownProps) {
  const { isAccountOpen, toggleAccount, closeAccount } = useNavStore()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        closeAccount()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAccount()
    }

    if (isAccountOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isAccountOpen, closeAccount])

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleAccount}
        aria-label="Account menu"
        className="hidden md:flex"
      >
        <User className="w-5 h-5" />
      </Button>

      {isAccountOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-3 w-52 bg-paper border-2 border-ink rounded-xl shadow-hard p-2 animate-fade-in-top z-50"
        >
          {customer ? (
            <>
              <div className="px-3 py-2 border-b border-ink/10 mb-1">
                <p className="text-xs font-bold uppercase text-ink/50">
                  {customer.email}
                </p>
              </div>
              <Link
                href={`/${countryCode}/account`}
                onClick={closeAccount}
              >
                <button role="menuitem" className="w-full text-left px-3 py-2.5 text-sm font-semibold rounded-lg hover:bg-stone/40 transition-colors">
                  My Account
                </button>
              </Link>
              <Link
                href={`/${countryCode}/account/orders`}
                onClick={closeAccount}
              >
                <button role="menuitem" className="w-full text-left px-3 py-2.5 text-sm font-semibold rounded-lg hover:bg-stone/40 transition-colors">
                  Orders
                </button>
              </Link>
              <Link
                href={`/${countryCode}/account/profile`}
                onClick={closeAccount}
              >
                <button role="menuitem" className="w-full text-left px-3 py-2.5 text-sm font-semibold rounded-lg hover:bg-stone/40 transition-colors">
                  Profile
                </button>
              </Link>
              <div className="border-t border-ink/10 mt-1 pt-1">
                <button
                  role="menuitem"
                  onClick={() => {
                    closeAccount()
                    signout(countryCode)
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm font-semibold text-acid rounded-lg hover:bg-acid/10 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href={`/${countryCode}/account`}
                onClick={closeAccount}
              >
                <button role="menuitem" className="w-full text-left px-3 py-2.5 text-sm font-semibold rounded-lg hover:bg-stone/40 transition-colors">
                  Sign In
                </button>
              </Link>
              <Link
                href={`/${countryCode}/account`}
                onClick={closeAccount}
              >
                <button role="menuitem" className="w-full text-left px-3 py-2.5 text-sm font-semibold rounded-lg hover:bg-stone/40 transition-colors">
                  Create Account
                </button>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
