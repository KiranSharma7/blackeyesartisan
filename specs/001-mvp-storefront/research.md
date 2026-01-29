# Research: MVP B2C Storefront

**Feature**: 001-mvp-storefront
**Date**: 2026-01-29
**Status**: Complete

## Research Tasks

### 1. Medusa 2.0 Store API Integration

**Decision**: Use `@medusajs/medusa-js` client library with REST Store API

**Rationale**:
- Medusa 2.0 provides a dedicated Store API for customer-facing operations
- Official JS client handles authentication and request formatting
- Supports all required operations: products, collections, cart, checkout, orders

**Key Endpoints**:
```
GET  /store/products              # List products with inventory
GET  /store/products/:id          # Single product with variants
GET  /store/collections           # List collections
GET  /store/collections/:id       # Collection with products
POST /store/carts                 # Create cart
GET  /store/carts/:id             # Get cart
POST /store/carts/:id/line-items  # Add to cart
POST /store/carts/:id/complete    # Complete checkout
GET  /store/orders/:id            # Order details
```

**Implementation Pattern**:
```typescript
// lib/medusa/client.ts
import Medusa from "@medusajs/medusa-js"

export const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!,
  maxRetries: 3,
})

// Server-side data fetching
export async function getProducts() {
  const { products } = await medusa.products.list({
    expand: "variants,images",
    is_giftcard: false,
  })
  return products
}
```

**Alternatives Considered**:
- Direct fetch to REST API: Rejected - loses type safety and retry logic
- GraphQL (Medusa doesn't natively support): Not applicable

---

### 2. Strapi 4.x REST API Integration

**Decision**: Use native fetch with REST API and read-only token

**Rationale**:
- Strapi 4.x has stable REST API with consistent patterns
- Read-only API token sufficient for storefront (content consumption only)
- No need for GraphQL complexity for simple content fetching

**Key Endpoints**:
```
GET /api/pages?filters[slug][$eq]=about    # Single page by slug
GET /api/policies                           # All policy pages
GET /api/global-settings                    # Site settings (age gate TTL, etc.)
GET /api/announcement-bar                   # Announcement content
```

**Implementation Pattern**:
```typescript
// lib/strapi/client.ts
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL!
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_READ_TOKEN!

export async function fetchStrapi<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`${STRAPI_URL}/api${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.set(key, value)
    )
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
  })

  if (!res.ok) throw new Error(`Strapi error: ${res.status}`)
  return res.json()
}
```

**Content Types to Create in Strapi**:
1. `Page` - title, slug, content (rich text), seo
2. `Policy` - title, slug, content, category (shipping/returns/privacy/terms)
3. `GlobalSettings` - ageGateTtl, handlingTime, dutiesDisclaimer
4. `AnnouncementBar` - message, isActive, linkUrl, linkText

**Alternatives Considered**:
- Strapi GraphQL plugin: Rejected - adds complexity, REST sufficient
- Hardcoded content: Rejected - violates constitution (CMS is source of truth)

---

### 3. Next.js 14 App Router Best Practices

**Decision**: Use App Router with Server Components by default, Client Components for interactivity

**Rationale**:
- App Router is the recommended approach for Next.js 14
- Server Components reduce client bundle size
- Streaming and Suspense improve perceived performance

**Rendering Strategy**:
| Page | Rendering | Reason |
|------|-----------|--------|
| Homepage | SSR (dynamic) | Shows real-time inventory status |
| Collections | SSR (dynamic) | Products may sell out anytime |
| Product Detail | SSR (dynamic) | Inventory must be current |
| Cart | Client-side | Fully interactive, user-specific |
| Checkout | Client-side | Multi-step form, payment integration |
| About Page | SSG (revalidate) | Content changes infrequently |
| Policy Pages | SSG (revalidate) | Content changes infrequently |

**Key Patterns**:
```typescript
// Server Component with data fetching
// app/(shop)/products/[handle]/page.tsx
export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProductByHandle(params.handle)
  return <ProductDetail product={product} />
}

// Client Component for interactivity
// components/cart/add-to-cart-button.tsx
"use client"
export function AddToCartButton({ variantId, disabled }: Props) {
  const { addItem } = useCart()
  return (
    <button
      onClick={() => addItem(variantId)}
      disabled={disabled}
    >
      Add to Cart
    </button>
  )
}
```

**Alternatives Considered**:
- Pages Router: Rejected - App Router is future direction, better performance
- Full SSG: Rejected - inventory status requires dynamic data

---

### 4. Age Gate Implementation Strategy

**Decision**: HTTP-only cookie with configurable TTL, server-side verification

**Rationale**:
- HTTP-only cookie prevents client-side tampering
- Server-side check in middleware ensures gate before any content
- TTL from Strapi allows business to configure duration
- Re-verification at checkout via server action

**Implementation Approach**:

```typescript
// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const ageVerified = request.cookies.get("age_verified")
  const isExitPage = request.nextUrl.pathname === "/age-gate/exit"
  const isAgeGatePage = request.nextUrl.pathname === "/age-gate"

  // Allow exit page and age gate page
  if (isExitPage || isAgeGatePage) return NextResponse.next()

  // Redirect to age gate if not verified
  if (!ageVerified) {
    return NextResponse.redirect(new URL("/age-gate", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
```

```typescript
// app/age-gate/actions.ts
"use server"
import { cookies } from "next/headers"
import { getAgeGateTTL } from "@/lib/strapi/client"

export async function verifyAge(isOver18: boolean) {
  if (!isOver18) {
    return { redirect: "/age-gate/exit" }
  }

  const ttl = await getAgeGateTTL() // From Strapi
  const cookieStore = cookies()

  cookieStore.set("age_verified", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: ttl * 24 * 60 * 60, // TTL in days
    sameSite: "lax",
  })

  return { redirect: "/" }
}
```

**Checkout Re-verification**:
```typescript
// At checkout initiation, verify cookie is still valid
export async function initiateCheckout(cartId: string) {
  const cookieStore = cookies()
  const ageVerified = cookieStore.get("age_verified")

  if (!ageVerified) {
    return { error: "age_verification_required" }
  }

  // Proceed with checkout
}
```

**Alternatives Considered**:
- localStorage: Rejected - not accessible server-side, easily manipulated
- Session storage: Rejected - doesn't persist across browser sessions
- Database-backed verification: Rejected - overkill for anonymous verification

---

### 5. Resend Email Integration

**Decision**: Use Resend for both transactional emails and newsletter via Audiences/Lists

**Rationale**:
- Single email provider simplifies architecture
- Resend Audiences API supports newsletter management
- Medusa can trigger transactional emails via Resend integration
- Good deliverability and developer experience

**Newsletter Implementation**:
```typescript
// app/api/newsletter/route.ts
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID!

export async function POST(request: Request) {
  const { email } = await request.json()

  try {
    // Add to audience (newsletter list)
    await resend.contacts.create({
      email,
      audienceId: AUDIENCE_ID,
    })

    // Send welcome email
    await resend.emails.send({
      from: "Black Eyes Artisan <hello@blackeyesartisan.shop>",
      to: email,
      subject: "Welcome to Black Eyes Artisan",
      react: WelcomeEmail({ email }),
    })

    return Response.json({ success: true })
  } catch (error) {
    if (error.message.includes("already exists")) {
      return Response.json({ error: "already_subscribed" }, { status: 409 })
    }
    return Response.json({ error: "subscription_failed" }, { status: 500 })
  }
}
```

**Transactional Emails (via Medusa)**:
- Order confirmation: Triggered by Medusa order.placed event
- Shipping notification: Triggered by Medusa fulfillment.created event
- Configure in Medusa's notification service to use Resend

**Alternatives Considered**:
- Separate newsletter provider (Mailchimp, ConvertKit): Rejected - adds complexity
- Email via Strapi: Rejected - Strapi is CMS only, not email service

---

### 6. Sold-Out Product Display

**Decision**: Server-side inventory check with conditional rendering

**Rationale**:
- Inventory status from Medusa is authoritative
- Server-side check ensures SSR pages show correct status
- Client-side cart operations also validate inventory

**Implementation**:
```typescript
// lib/medusa/products.ts
export function isProductSoldOut(product: Product): boolean {
  return product.variants.every(
    (variant) => variant.inventory_quantity <= 0
  )
}

// components/products/product-card.tsx
export function ProductCard({ product }: { product: Product }) {
  const soldOut = isProductSoldOut(product)

  return (
    <div className="group relative">
      {soldOut && (
        <Badge className="absolute top-3 left-3 z-10">SOLD</Badge>
      )}
      <ProductImage product={product} />
      <ProductInfo product={product} />
      {soldOut ? (
        <NotifyMeForm productId={product.id} />
      ) : (
        <AddToCartButton product={product} />
      )}
    </div>
  )
}
```

**Alternatives Considered**:
- Hide sold-out products: Rejected - violates constitution (portfolio display)
- Client-side inventory check only: Rejected - causes flash of wrong content

---

### 7. International Checkout with Phone Validation

**Decision**: Custom checkout form with phone validation using libphonenumber-js

**Rationale**:
- Phone is mandatory for FedEx international shipping
- Need to validate phone format for various countries
- Medusa checkout supports custom fields

**Implementation**:
```typescript
// components/checkout/shipping-form.tsx
"use client"
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js"

export function ShippingForm() {
  const [phone, setPhone] = useState("")
  const [phoneError, setPhoneError] = useState("")

  const validatePhone = (value: string, countryCode: string) => {
    if (!isValidPhoneNumber(value, countryCode as CountryCode)) {
      setPhoneError("Please enter a valid phone number")
      return false
    }
    setPhoneError("")
    return true
  }

  return (
    <form>
      {/* Address fields */}
      <Input
        label="Phone Number *"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        onBlur={() => validatePhone(phone, selectedCountry)}
        error={phoneError}
        required
      />
      <p className="text-xs text-muted">
        Required for FedEx delivery notifications
      </p>
    </form>
  )
}
```

**Alternatives Considered**:
- No phone validation: Rejected - FedEx requires valid phone
- Server-only validation: Rejected - poor UX, should validate client-side too

---

### 8. Turborepo Monorepo Setup

**Decision**: Turborepo with pnpm workspaces

**Rationale**:
- Vercel-native (optimal deployment experience)
- Fast incremental builds with caching
- pnpm efficient disk usage and strict dependency resolution
- Supports shared packages (UI components, configs)

**Configuration**:
```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"]
    },
    "test:e2e": {
      "dependsOn": ["build"]
    }
  }
}
```

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

**Alternatives Considered**:
- Nx: Rejected - more complex, Turborepo is simpler and Vercel-native
- Lerna: Rejected - outdated, Turborepo is modern replacement
- No monorepo: Rejected - harder to share code between packages

---

## Summary of Technology Choices

| Area | Choice | Package/Tool |
|------|--------|--------------|
| Framework | Next.js 14 | `next@14` |
| Language | TypeScript | `typescript@5` |
| Styling | Tailwind CSS | `tailwindcss@3` |
| Commerce API | Medusa JS Client | `@medusajs/medusa-js` |
| CMS | Strapi REST API | Native fetch |
| Email | Resend | `resend` |
| Phone Validation | libphonenumber-js | `libphonenumber-js` |
| Monorepo | Turborepo + pnpm | `turbo`, `pnpm` |
| Testing | Vitest + Playwright | `vitest`, `@playwright/test` |
| Icons | Iconify (Solar) | `@iconify/react` or CDN |
| Images | Cloudinary | `cloudinary` (transformations) |

All choices comply with the constitution's technology constraints and support the business requirements defined in the feature specification.
