'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display font-bold text-6xl md:text-7xl text-acid mb-4">Oops!</h1>
        <h2 className="font-display font-bold text-2xl md:text-3xl uppercase mb-4">
          Something went <span className="text-ink">wrong</span>
        </h2>
        <p className="text-ink/70 mb-8 max-w-md mx-auto">
          We encountered an unexpected error. Please try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-block px-8 py-4 bg-ink text-paper font-display text-lg uppercase border-2 border-ink rounded-lg shadow-hard hover:shadow-hard-xl hover:-translate-y-1 transition-all"
          >
            Try Again
          </button>
          <a
            href="/us"
            className="inline-block px-8 py-4 bg-paper text-ink font-display text-lg uppercase border-2 border-ink rounded-lg shadow-hard hover:shadow-hard-xl hover:-translate-y-1 transition-all"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
