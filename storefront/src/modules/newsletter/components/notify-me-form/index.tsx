'use client'

import { useState } from 'react'
import { cn } from '@lib/util/cn'
import { Button } from '@/components/retroui/Button'

interface NotifyMeFormProps {
  productTitle: string
  className?: string
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

/**
 * NotifyMeForm component - allows users to sign up for restock notifications
 * Used on sold-out product detail pages
 */
export default function NotifyMeForm({
  productTitle,
  className,
}: NotifyMeFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email) {
      setStatus('error')
      setMessage('Please enter your email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'notify_me',
          productTitle,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setStatus('success')
      setMessage(
        data.alreadySubscribed
          ? "You're already on our list! We'll notify you when this item is back."
          : "You're in! We'll email you when this item is back in stock."
      )
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      )
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Heading */}
      <div className="text-center">
        <h3 className="font-display text-xl uppercase mb-1">Sold Out</h3>
        <p className="text-sm text-ink/70">
          Get notified when this item is back in stock
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status === 'error') {
                setStatus('idle')
                setMessage('')
              }
            }}
            placeholder="Enter your email"
            disabled={status === 'loading' || status === 'success'}
            className={cn(
              'flex-1 px-4 py-3 border-2 border-ink rounded-xl',
              'font-medium bg-paper text-ink',
              'placeholder:text-ink/40',
              'focus:outline-hidden focus:shadow-xs shadow-md',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-200'
            )}
          />
          <Button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            variant="secondary"
            size="lg"
            className="whitespace-nowrap"
          >
            {status === 'loading' ? 'Submitting...' : 'Notify Me'}
          </Button>
        </div>

        {/* Status Message */}
        {message && (
          <p
            className={cn(
              'text-sm text-center font-medium',
              status === 'success' && 'text-green-600',
              status === 'error' && 'text-acid'
            )}
          >
            {message}
          </p>
        )}
      </form>

      {/* Privacy Note */}
      <p className="text-xs text-ink/50 text-center">
        We&apos;ll only email you about this product. Unsubscribe anytime.
      </p>
    </div>
  )
}
