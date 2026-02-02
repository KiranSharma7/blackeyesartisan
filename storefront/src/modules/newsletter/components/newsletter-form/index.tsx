'use client'

import { useState } from 'react'
import { cn } from '@lib/util/cn'
import { validateEmail } from '@lib/util/validator'

interface NewsletterFormProps {
  className?: string
  variant?: 'footer' | 'inline'
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

/**
 * NewsletterForm component - allows users to sign up for newsletter updates
 * Used in the footer for site-wide newsletter signup
 */
export default function NewsletterForm({
  className,
  variant = 'footer',
}: NewsletterFormProps) {
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

    if (!validateEmail(email)) {
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
          email: email.trim(),
          source: 'footer',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setStatus('success')
      setMessage(
        data.alreadySubscribed
          ? "You're already on our list!"
          : 'Welcome to the family!'
      )
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      )
    }
  }

  const isFooter = variant === 'footer'

  return (
    <div className={cn('w-full', className)}>
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className={cn(
          'flex gap-2',
          isFooter ? 'flex-col sm:flex-row' : 'flex-row'
        )}>
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
            aria-label="Email address for newsletter"
            className={cn(
              'flex-1 px-4 py-3 border-2 rounded-lg',
              'font-sans text-base',
              'placeholder:opacity-50',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-200',
              isFooter
                ? 'border-paper/30 bg-ink text-paper placeholder:text-paper/50 focus:ring-paper'
                : 'border-ink bg-paper text-ink placeholder:text-ink/50 focus:ring-ink'
            )}
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className={cn(
              'px-6 py-3 border-2 rounded-lg',
              'font-display text-sm uppercase tracking-wider',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-200',
              'whitespace-nowrap',
              isFooter
                ? [
                    'border-sun bg-sun text-ink',
                    'hover:bg-transparent hover:text-sun',
                    'shadow-hard-sun hover:shadow-none',
                    'disabled:hover:bg-sun disabled:hover:text-ink'
                  ]
                : [
                    'border-ink bg-ink text-paper',
                    'hover:bg-paper hover:text-ink',
                    'shadow-hard hover:shadow-hard-sm',
                    'disabled:hover:bg-ink disabled:hover:text-paper'
                  ]
            )}
          >
            {status === 'loading' ? 'Joining...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <p
            className={cn(
              'text-sm font-medium',
              status === 'success' && (isFooter ? 'text-sun' : 'text-green-600'),
              status === 'error' && 'text-acid'
            )}
            role={status === 'error' ? 'alert' : 'status'}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  )
}
