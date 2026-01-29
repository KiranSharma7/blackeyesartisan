# Newsletter API Contract

**Provider**: Resend
**Base URL**: Internal API route (`/api/newsletter`)
**Authentication**: None (public endpoint with rate limiting)

## Overview

The newsletter functionality handles email subscriptions for:
1. Footer newsletter signup form
2. "Notify Me" signup on sold-out product pages

Both use the same unified subscriber list (single Resend Audience).

## Internal API Endpoint

### Subscribe to Newsletter

```http
POST /api/newsletter
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "subscriber@example.com",
  "source": "footer" | "notify_me",
  "productId": "prod_01ABC"  // Only when source is "notify_me"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter"
}
```

**Error Responses**:

Already Subscribed (409 Conflict):
```json
{
  "success": false,
  "error": "already_subscribed",
  "message": "This email is already subscribed to our newsletter"
}
```

Invalid Email (400 Bad Request):
```json
{
  "success": false,
  "error": "invalid_email",
  "message": "Please enter a valid email address"
}
```

Rate Limited (429 Too Many Requests):
```json
{
  "success": false,
  "error": "rate_limited",
  "message": "Too many requests. Please try again later."
}
```

Server Error (500 Internal Server Error):
```json
{
  "success": false,
  "error": "subscription_failed",
  "message": "Unable to process subscription. Please try again."
}
```

## Resend API Integration

### Add Contact to Audience

The internal API route calls Resend's Contacts API:

```typescript
// Implementation in /api/newsletter/route.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID

export async function POST(request: Request) {
  const { email, source, productId } = await request.json()

  // Validate email
  if (!isValidEmail(email)) {
    return Response.json(
      { success: false, error: 'invalid_email', message: 'Please enter a valid email address' },
      { status: 400 }
    )
  }

  try {
    // Add to Resend Audience
    await resend.contacts.create({
      email,
      audienceId: AUDIENCE_ID,
      firstName: '', // Optional, collected later
      lastName: '',
      unsubscribed: false,
    })

    // Send welcome email
    await resend.emails.send({
      from: 'Black Eyes Artisan <hello@blackeyesartisan.shop>',
      to: email,
      subject: 'Welcome to Black Eyes Artisan',
      react: WelcomeEmailTemplate({ email }),
    })

    return Response.json({ success: true, message: 'Successfully subscribed to newsletter' })

  } catch (error) {
    // Handle "contact already exists" error
    if (error.message?.includes('already exists')) {
      return Response.json(
        { success: false, error: 'already_subscribed', message: 'This email is already subscribed' },
        { status: 409 }
      )
    }

    console.error('Newsletter subscription error:', error)
    return Response.json(
      { success: false, error: 'subscription_failed', message: 'Unable to process subscription' },
      { status: 500 }
    )
  }
}
```

### Resend Contacts API Reference

**Create Contact**:
```http
POST https://api.resend.com/audiences/{audience_id}/contacts
Authorization: Bearer {RESEND_API_KEY}
Content-Type: application/json

{
  "email": "subscriber@example.com",
  "first_name": "",
  "last_name": "",
  "unsubscribed": false
}
```

**Response** (201 Created):
```json
{
  "object": "contact",
  "id": "479e3145-dd38-476b-932c-529ceb705947"
}
```

**Error** (409 Conflict - Already Exists):
```json
{
  "statusCode": 409,
  "message": "Contact already exists",
  "name": "conflict"
}
```

## Email Templates

### Welcome Email

Sent immediately upon successful subscription.

**Subject**: "Welcome to Black Eyes Artisan"

**Template** (`emails/welcome.tsx`):
```typescript
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface WelcomeEmailProps {
  email: string
}

export function WelcomeEmail({ email }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to the Black Eyes Artisan family</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://blackeyesartisan.shop/logo.png"
            width="150"
            height="50"
            alt="Black Eyes Artisan"
          />
          <Heading style={heading}>Welcome to Black Eyes Artisan</Heading>
          <Text style={text}>
            You're now part of our community of glass art enthusiasts.
          </Text>
          <Text style={text}>
            As a subscriber, you'll be the first to know about:
          </Text>
          <ul style={list}>
            <li>New product drops</li>
            <li>Exclusive pieces</li>
            <li>Behind-the-scenes content</li>
            <li>Special offers</li>
          </ul>
          <Section style={buttonContainer}>
            <Link style={button} href="https://blackeyesartisan.shop">
              Shop Now
            </Link>
          </Section>
          <Text style={footer}>
            If you didn't subscribe to this list, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#FEF8E7',
  fontFamily: "'Space Grotesk', sans-serif",
}

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
}

const heading = {
  fontFamily: "'Dela Gothic One', cursive",
  fontSize: '28px',
  color: '#18181B',
  marginBottom: '24px',
}

const text = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#18181B',
}

const list = {
  fontSize: '16px',
  lineHeight: '1.8',
  color: '#18181B',
}

const buttonContainer = {
  textAlign: 'center' as const,
  marginTop: '32px',
  marginBottom: '32px',
}

const button = {
  backgroundColor: '#D63D42',
  color: '#FFFFFF',
  padding: '14px 28px',
  borderRadius: '12px',
  textDecoration: 'none',
  fontWeight: '600',
  display: 'inline-block',
}

const footer = {
  fontSize: '12px',
  color: '#666666',
  marginTop: '40px',
}
```

## Client-Side Implementation

### Newsletter Form Component

```typescript
// components/newsletter/newsletter-form.tsx
'use client'

import { useState } from 'react'

interface NewsletterFormProps {
  source: 'footer' | 'notify_me'
  productId?: string
}

export function NewsletterForm({ source, productId }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, productId }),
      })

      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setMessage(data.message)
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.message)
      }
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={status === 'loading'}
      />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {message && (
        <p className={status === 'success' ? 'text-green-600' : 'text-red-600'}>
          {message}
        </p>
      )}
    </form>
  )
}
```

## Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
// lib/rate-limit.ts
import { headers } from 'next/headers'

const RATE_LIMIT = 5 // requests
const RATE_WINDOW = 60 * 1000 // 1 minute

const ipRequests = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(): { allowed: boolean; remaining: number } {
  const headersList = headers()
  const ip = headersList.get('x-forwarded-for') || 'unknown'

  const now = Date.now()
  const record = ipRequests.get(ip)

  if (!record || now > record.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return { allowed: true, remaining: RATE_LIMIT - 1 }
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: RATE_LIMIT - record.count }
}
```

## Environment Variables

```bash
# .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_AUDIENCE_ID=aud_xxxxxxxxxxxxx
```

## Testing

### Manual Test Cases

1. **Valid subscription**: Submit valid email → Success message, email added to Resend
2. **Duplicate subscription**: Submit same email twice → "Already subscribed" message
3. **Invalid email**: Submit "notanemail" → Validation error
4. **Rate limit**: Submit 6+ times rapidly → Rate limit error

### E2E Test (Playwright)

```typescript
// tests/e2e/newsletter.spec.ts
import { test, expect } from '@playwright/test'

test('newsletter signup from footer', async ({ page }) => {
  await page.goto('/')

  // Scroll to footer
  await page.locator('footer').scrollIntoViewIfNeeded()

  // Fill email
  await page.fill('footer input[type="email"]', 'test@example.com')

  // Submit
  await page.click('footer button[type="submit"]')

  // Verify success message
  await expect(page.locator('text=Successfully subscribed')).toBeVisible()
})

test('notify me on sold-out product', async ({ page }) => {
  // Navigate to a sold-out product
  await page.goto('/products/sold-out-item')

  // Verify SOLD badge
  await expect(page.locator('text=SOLD')).toBeVisible()

  // Fill notify me form
  await page.fill('input[type="email"]', 'test@example.com')
  await page.click('button:has-text("Notify Me")')

  // Verify success
  await expect(page.locator('text=subscribed')).toBeVisible()
})
```
