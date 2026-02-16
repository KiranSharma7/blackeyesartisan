'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { X, Search } from 'lucide-react'
import { useNavStore } from '@lib/store/useNavStore'
import { Button } from '@/components/retroui/Button'

interface SearchOverlayProps {
  countryCode: string
}

export default function SearchOverlay({ countryCode }: SearchOverlayProps) {
  const { isSearchOpen, closeSearch } = useNavStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch()
    }

    if (isSearchOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 100)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isSearchOpen, closeSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/${countryCode}/results/${encodeURIComponent(query.trim())}`)
      setQuery('')
      closeSearch()
    }
  }

  if (!isSearchOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-[60]"
        onClick={closeSearch}
        aria-hidden="true"
      />

      {/* Search Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-dialog-title"
        className="fixed inset-x-0 top-0 z-[70] bg-paper border-b-2 border-ink shadow-hard-xl animate-fade-in-top"
      >
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 id="search-dialog-title" className="font-display font-bold text-xl uppercase tracking-wide">
              Search
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeSearch}
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full h-14 pl-12 pr-4 rounded border-2 border-ink bg-white text-base font-medium
                         shadow-md placeholder:text-ink/40
                         focus:outline-hidden focus:shadow-xs
                         transition-all duration-200"
            />
          </form>

          <p className="mt-3 text-sm text-ink/50 font-medium">
            Press Enter to search, Esc to close
          </p>
        </div>
      </div>
    </>
  )
}
