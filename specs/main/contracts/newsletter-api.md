# Newsletter API Contract

**Service**: Next.js API Route → Resend Audiences
**Endpoint**: `/api/newsletter`

## Overview

Internal API route that handles newsletter subscriptions via Resend Audiences. Used by:
- Footer newsletter form
- "Notify Me" form on sold-out product pages

Both use the same unified audience list.

---

## POST /api/newsletter

Subscribe an email to the newsletter audience.

### Request

```http
POST /api/newsletter HTTP/1.1
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Request Schema

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | string | Yes | Valid email format |

### Response - Success (200)

```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter"
}
```

### Response - Already Subscribed (200)

```json
{
  "success": true,
  "alreadySubscribed": true,
  "message": "You're already subscribed"
}
```

### Response - Validation Error (400)

```json
{
  "error": "Invalid email address"
}
```

### Response - Server Error (500)

```json
{
  "error": "Subscription failed"
}
```

---

## Implementation

```typescript
// src/app/api/newsletter/route.ts
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID!

const schema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = schema.parse(body)

    // Add contact to Resend audience
    const { error } = await resend.contacts.create({
      email,
      audienceId: AUDIENCE_ID,
      unsubscribed: false,
    })

    if (error) {
      // Check if already exists
      if (error.message?.includes('already exists')) {
        return NextResponse.json({
          success: true,
          alreadySubscribed: true,
          message: "You're already subscribed",
        })
      }
      throw error
    }

    // Send welcome email
    await resend.emails.send({
      from: 'Black Eyes Artisan <hello@blackeyesartisan.shop>',
      to: email,
      subject: 'Welcome to the Black Eyes Artisan family! 🔥',
      html: `
        <h1>Welcome!</h1>
        <p>You're now on the list for exclusive drops and updates.</p>
        <p>Stay tuned for new handcrafted pieces.</p>
        <p>— Black Eyes Artisan</p>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Subscription failed' },
      { status: 500 }
    )
  }
}
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key |
| `RESEND_AUDIENCE_ID` | ID of the newsletter audience in Resend |

---

## Rate Limiting

Consider adding rate limiting to prevent abuse:

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
})

// In route handler:
const { success } = await ratelimit.limit(ip)
if (!success) {
  return NextResponse.json(
    { error: 'Too many requests' },
    { status: 429 }
  )
}
```

---

## Client Usage

### Footer Newsletter Form

```tsx
const handleSubmit = async (email: string) => {
  const res = await fetch('/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  const data = await res.json()

  if (data.success) {
    if (data.alreadySubscribed) {
      showMessage("You're already subscribed!")
    } else {
      showMessage('Welcome to the family!')
    }
  } else {
    showError(data.error)
  }
}
```

### NotifyMe Form (Sold-out Products)

Same API endpoint, different UI messaging:

```tsx
const handleNotifyMe = async (email: string) => {
  const res = await fetch('/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  const data = await res.json()

  if (data.success) {
    showMessage("We'll notify you when this drops again!")
  } else {
    showError(data.error)
  }
}
```
