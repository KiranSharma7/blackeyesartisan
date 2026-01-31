# Research: MVP B2C Storefront

**Phase**: 0 - Research | **Date**: 2026-01-30 | **Plan**: [plan.md](./plan.md)

## Research Topics

### 1. Solace Medusa Starter Architecture

**Decision**: Use Solace Medusa Starter as base template (fork, not clone)

**Rationale**:
- Provides 80% of required functionality out-of-box
- Same tech stack: Next.js 14 (App Router), Medusa 2.0, Strapi CMS, Stripe
- Production-ready implementations of: user accounts, order history, product search, checkout, theming
- MIT licensed, actively maintained (405+ deployments)

**Alternatives Considered**:
- Build from scratch with Turborepo monorepo → Rejected: 3-4x more work for same result
- Medusa Next.js Starter (official) → Rejected: Missing Strapi integration, less feature-complete
- Custom Next.js + Medusa integration → Rejected: No pre-built user account flows

**Solace Key Patterns**:
- Route groups: `(main)/` for shop routes, `(content)/` for CMS pages
- Medusa client: Uses `@medusajs/medusa-js` with React Query
- Strapi integration: REST API with ISR revalidation via webhook
- State management: React Context for UI state, Medusa for cart persistence
- Image handling: DigitalOcean Spaces (to be replaced with Cloudinary)

**Required Modifications for BlackEyesArtisan**:
1. Age gate middleware (new)
2. Design system overhaul (restyle all components)
3. Cloudinary image configuration (replace DO Spaces)
4. Newsletter/Resend integration (new)
5. SOLD badge on products (modify ProductCard)
6. Phone validation in checkout (extend ShippingForm)
7. Strapi Global Settings extension (add age gate fields)

---

### 2. Next.js Middleware for Age Gate

**Decision**: Implement age gate as Next.js middleware with cookie-based verification

**Rationale**:
- Edge-level blocking ensures no content renders before verification
- Works without JavaScript (critical for constitution compliance)
- Cookie-based state persists across sessions with configurable TTL
- Middleware runs before any route, guaranteeing coverage

**Implementation Pattern**:
```typescript
// middleware.ts (root level)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AGE_VERIFIED_COOKIE = 'age_verified'
const PUBLIC_PATHS = ['/age-gate', '/age-gate/exit', '/api/', '/_next/', '/favicon.ico']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check age verification cookie
  const ageVerified = request.cookies.get(AGE_VERIFIED_COOKIE)

  if (!ageVerified) {
    // Redirect to age gate with return URL
    const url = request.nextUrl.clone()
    url.pathname = '/age-gate'
    url.searchParams.set('returnUrl', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
```

**Cookie Management**:
```typescript
// lib/cookies/age-verification.ts
import { cookies } from 'next/headers'

const AGE_VERIFIED_COOKIE = 'age_verified'

export async function setAgeVerified(ttlDays: number) {
  const cookieStore = await cookies()
  cookieStore.set(AGE_VERIFIED_COOKIE, 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ttlDays * 24 * 60 * 60, // Convert days to seconds
    path: '/'
  })
}

export async function isAgeVerified(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(AGE_VERIFIED_COOKIE)?.value === 'true'
}

export async function clearAgeVerification() {
  const cookieStore = await cookies()
  cookieStore.delete(AGE_VERIFIED_COOKIE)
}
```

**Alternatives Considered**:
- Layout wrapper component → Rejected: Content may flash before JS hydration
- Server component check → Rejected: Doesn't block at edge level
- Client-side modal → Rejected: Doesn't work without JS

---

### 3. Resend Audiences API for Newsletter

**Decision**: Use Resend Audiences for newsletter list management

**Rationale**:
- Same service as transactional email (unified dashboard)
- Simple API for adding contacts to audiences
- Supports both footer newsletter and "Notify Me" signups
- No need for separate Mailchimp/ConvertKit integration

**Implementation Pattern**:
```typescript
// lib/resend/client.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID

export async function subscribeToNewsletter(email: string) {
  try {
    // Add contact to audience
    await resend.contacts.create({
      email,
      audienceId: AUDIENCE_ID,
      unsubscribed: false
    })

    // Send welcome email
    await resend.emails.send({
      from: 'Black Eyes Artisan <hello@blackeyesartisan.shop>',
      to: email,
      subject: 'Welcome to the Black Eyes Artisan family!',
      html: '...' // Welcome email template
    })

    return { success: true }
  } catch (error) {
    if (error.message?.includes('already exists')) {
      return { success: true, alreadySubscribed: true }
    }
    throw error
  }
}
```

**API Route**:
```typescript
// app/api/newsletter/route.ts
import { NextResponse } from 'next/server'
import { subscribeToNewsletter } from '@/lib/resend/client'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email()
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = schema.parse(body)

    const result = await subscribeToNewsletter(email)

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Subscription failed' },
      { status: 500 }
    )
  }
}
```

---

### 4. Cloudinary Integration (Replace DO Spaces)

**Decision**: Use Cloudinary for image optimization and delivery

**Rationale**:
- Better CDN coverage for international customers
- Built-in image transformations
- next/image integration via cloudinary loader
- Already have credentials configured

**Implementation**:
```typescript
// next.config.js
module.exports = {
  images: {
    loader: 'cloudinary',
    path: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/`
  }
}
```

**Solace Modification**:
Replace all `NEXT_PUBLIC_CDN_SPACE_DOMAIN` references with Cloudinary URLs.

---

### 5. Strapi Global Settings Extension

**Decision**: Extend existing Global Settings single type with age gate fields

**Rationale**:
- Follows Solace pattern for site-wide configuration
- No new content types needed
- CMS-configurable TTL without code changes

**New Fields to Add**:
- `ageGateEnabled` (Boolean, default: true)
- `ageGateTtlDays` (Number, default: 30)
- `ageGateTitle` (Short text, default: "Age Verification Required")
- `ageGateMessage` (Long text, default: "You must be 18 or older to enter this site.")

**Strapi Admin Steps**:
1. Content-Type Builder → Global Settings → Add fields
2. Settings → Roles → Public → Enable find permission for Global Settings

---

### 6. SOLD Badge Implementation

**Decision**: Add inventory check and SOLD badge to ProductCard component

**Rationale**:
- Solace already has ProductCard component
- Medusa provides inventory data via Store API
- Simple conditional rendering based on `inventory_quantity === 0`

**Implementation Pattern**:
```tsx
// components/products/ProductCard.tsx (modification)
{product.variants?.[0]?.inventory_quantity === 0 && (
  <div className="absolute top-3 left-3 z-10">
    <span className="bg-ink text-paper border-2 border-ink px-3 py-1
                   text-xs font-display uppercase tracking-wider rounded-lg
                   shadow-hard-sm">
      SOLD
    </span>
  </div>
)}
```

**NotifyMe Form** (for sold-out product detail pages):
- Replace Add to Cart button with NotifyMe form
- Uses same newsletter API endpoint
- Captures email for restock notifications

---

### 7. Phone Validation for International Checkout

**Decision**: Use libphonenumber-js for phone validation

**Rationale**:
- Solace already uses this library
- Supports international phone formats
- Required by FedEx for international delivery

**Implementation**:
```typescript
// Extend Solace's ShippingForm validation
import { isValidPhoneNumber } from 'libphonenumber-js'

const validatePhone = (phone: string, country: string) => {
  if (!phone) return 'Phone number is required for international shipping'
  if (!isValidPhoneNumber(phone, country)) return 'Invalid phone number format'
  return null
}
```

---

## Summary

All research topics resolved. Key findings:

1. **Solace Starter** provides solid foundation; fork and customize
2. **Age gate** via Next.js middleware ensures edge-level blocking
3. **Resend Audiences** unifies newsletter with transactional email
4. **Cloudinary** replaces DigitalOcean Spaces with better CDN
5. **Strapi extension** adds age gate config to existing Global Settings
6. **SOLD badge** is simple conditional render in ProductCard
7. **Phone validation** extends existing Solace checkout form

Next step: Generate data-model.md and contracts/ for Phase 1.
