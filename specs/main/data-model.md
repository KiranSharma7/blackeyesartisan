# Data Model: MVP B2C Storefront

**Phase**: 1 - Design | **Date**: 2026-01-30 | **Plan**: [plan.md](./plan.md)

## Overview

This document describes the data entities used by the storefront. Most entities are **inherited from Solace Starter** and managed by external systems (Medusa, Strapi). Custom additions are marked with 🆕.

## Data Sources

| Source | Entities | Access |
|--------|----------|--------|
| **Medusa 2.0** | Products, Collections, Cart, Orders, Customers, Regions, Shipping | REST API (`/store/*`) |
| **Strapi CMS** | Pages, Blog Posts, Global Settings, Policies | REST API |
| **Resend** | Newsletter Subscribers | Audiences API |
| **Browser** | Age Verification Status | HTTP-only Cookie |

---

## Medusa Entities (Inherited from Solace)

### Product

```typescript
interface Product {
  id: string
  title: string
  handle: string
  description: string | null
  thumbnail: string | null
  images: ProductImage[]
  variants: ProductVariant[]
  collection: Collection | null
  created_at: string
  updated_at: string
}

interface ProductVariant {
  id: string
  title: string
  prices: Price[]
  inventory_quantity: number  // Used for SOLD badge logic
  sku: string | null
}

interface Price {
  currency_code: string  // Always "usd" in our case
  amount: number         // In cents (e.g., 4999 = $49.99)
}
```

**Custom Logic**:
- **SOLD badge rule**: Show SOLD badge and disable Add to Cart when **ALL** variants have `inventory_quantity === 0`
- For products with single variant: Check `variants[0].inventory_quantity === 0`
- For products with multiple variants: Check `variants.every(v => v.inventory_quantity === 0)`

### Collection

```typescript
interface Collection {
  id: string
  title: string
  handle: string
  products: Product[]
}
```

### Cart

```typescript
interface Cart {
  id: string
  items: LineItem[]
  region: Region
  shipping_address: Address | null
  shipping_methods: ShippingMethod[]
  payment_session: PaymentSession | null
  total: number
  subtotal: number
  shipping_total: number
  tax_total: number
}

interface LineItem {
  id: string
  title: string
  quantity: number
  unit_price: number
  variant: ProductVariant
  thumbnail: string | null
}
```

### Order

```typescript
interface Order {
  id: string
  display_id: number
  status: 'pending' | 'completed' | 'archived' | 'canceled'
  fulfillment_status: 'not_fulfilled' | 'fulfilled' | 'shipped'
  payment_status: 'not_paid' | 'awaiting' | 'captured' | 'refunded'
  items: LineItem[]
  shipping_address: Address
  total: number
  created_at: string
  fulfillments: Fulfillment[]
}

interface Fulfillment {
  id: string
  tracking_numbers: string[]  // FedEx tracking
  tracking_links: TrackingLink[]
}
```

### Customer

```typescript
interface Customer {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  shipping_addresses: Address[]
  orders: Order[]
}

interface Address {
  id: string
  first_name: string
  last_name: string
  address_1: string
  address_2: string | null
  city: string
  province: string | null
  postal_code: string
  country_code: string
  phone: string  // Required for FedEx
}
```

---

## Strapi Entities

### Global Settings (Extended) 🆕

```typescript
interface GlobalSettings {
  // Existing Solace fields
  siteName: string
  siteDescription: string
  announcement: {
    enabled: boolean
    text: string
    link: string | null
  }
  socialLinks: SocialLink[]

  // NEW: Age Gate fields
  ageGateEnabled: boolean        // Default: true
  ageGateTtlDays: number         // Default: 30
  ageGateTitle: string           // Default: "Age Verification Required"
  ageGateMessage: string         // Rich text

  // NEW: Shipping info
  handlingTimeDays: number       // Default: 3-5
  dutiesDisclaimer: string       // "Duties and taxes are buyer's responsibility"
}
```

### Page

```typescript
interface Page {
  id: number
  title: string
  slug: string
  content: RichTextBlock[]
  seo: SEO | null
  publishedAt: string
}
```

### Blog Post

```typescript
interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: RichTextBlock[]
  featuredImage: Media | null
  publishedAt: string
  author: string | null
}
```

### Policy

```typescript
interface Policy {
  id: number
  type: 'shipping' | 'returns' | 'privacy' | 'terms'
  title: string
  content: RichTextBlock[]
  lastUpdated: string
}
```

---

## Browser State

### Age Verification Cookie 🆕

```typescript
// Cookie structure (stored as simple value)
interface AgeVerificationCookie {
  name: 'age_verified'
  value: 'true'
  httpOnly: true
  secure: true  // In production
  sameSite: 'lax'
  maxAge: number  // TTL in seconds (from Strapi ageGateTtlDays)
  path: '/'
}
```

**Cookie Lifecycle**:
1. New visitor → No cookie → Redirect to `/age-gate`
2. Confirms 18+ → Cookie set with TTL from Strapi
3. Within TTL → Cookie present → Access granted
4. TTL expires → Cookie gone → Re-verify required
5. At checkout → Server validates cookie still present

---

## Resend Entities

### Newsletter Subscriber

```typescript
// Resend Audience Contact
interface Subscriber {
  id: string
  email: string
  created_at: string
  unsubscribed: boolean
}
```

**Note**: Both footer newsletter and "Notify Me" signups go to the same audience.

---

## State Management

### Client-Side State (React Context)

```typescript
// Cart Context (Solace pattern)
interface CartContext {
  cart: Cart | null
  isLoading: boolean
  addItem: (variantId: string, quantity: number) => Promise<void>
  updateItem: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
}

// UI Context (Solace pattern)
interface UIContext {
  isCartOpen: boolean
  isSearchOpen: boolean
  theme: 'light' | 'dark'
  toggleCart: () => void
  toggleSearch: () => void
  setTheme: (theme: 'light' | 'dark') => void
}
```

### Server-Side State

- **Product data**: Fetched via SSR, cached with ISR (revalidate on Strapi webhook)
- **Cart data**: Fetched per-request, not cached (uses Medusa cart ID from cookie)
- **CMS content**: Fetched via SSR, cached with ISR
- **Age verification**: Checked in middleware via cookie

---

## Data Flow Diagrams

### Age Gate Flow

```
Visitor Request
      │
      ▼
┌─────────────┐
│ Middleware  │
└─────────────┘
      │
      ▼
Cookie present? ──No──▶ Redirect to /age-gate
      │
     Yes
      │
      ▼
┌─────────────┐
│ Route loads │
└─────────────┘
```

### Product Display Flow

```
Collection Page
      │
      ▼
┌─────────────────┐
│ Fetch products  │
│ from Medusa API │
└─────────────────┘
      │
      ▼
For each product:
      │
      ▼
inventory_quantity === 0? ──Yes──▶ Show SOLD badge
      │                           Disable Add to Cart
      No                          Show NotifyMe form
      │
      ▼
Show normal ProductCard
Enable Add to Cart
```

### Newsletter Signup Flow

```
User submits email
      │
      ▼
┌────────────────┐
│ POST /api/     │
│ newsletter     │
└────────────────┘
      │
      ▼
┌────────────────┐
│ Resend API:    │
│ Create contact │
└────────────────┘
      │
      ▼
Already exists? ──Yes──▶ Return "already subscribed"
      │
      No
      │
      ▼
┌────────────────┐
│ Resend API:    │
│ Send welcome   │
│ email          │
└────────────────┘
      │
      ▼
Return success
```

---

## Validation Rules

### Email Validation

```typescript
// Used for newsletter and customer registration
const emailSchema = z.string().email()
```

### Phone Validation (International)

```typescript
// Required for FedEx shipping
import { isValidPhoneNumber } from 'libphonenumber-js'

const validatePhone = (phone: string, country: string): boolean => {
  return phone && isValidPhoneNumber(phone, country)
}
```

### Address Validation

```typescript
const addressSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  address_1: z.string().min(1),
  address_2: z.string().optional(),
  city: z.string().min(1),
  province: z.string().optional(),
  postal_code: z.string().min(1),
  country_code: z.string().length(2),
  phone: z.string().min(1),  // Required
})
```

---

## Entity Relationships

```
┌─────────────┐     ┌─────────────┐
│  Customer   │────▶│   Order     │
└─────────────┘     └─────────────┘
      │                   │
      │                   ▼
      │             ┌─────────────┐
      │             │  LineItem   │
      │             └─────────────┘
      │                   │
      ▼                   ▼
┌─────────────┐     ┌─────────────┐
│   Address   │     │  Product    │
└─────────────┘     └─────────────┘
                          │
                          ▼
                    ┌─────────────┐
                    │ Collection  │
                    └─────────────┘

┌─────────────┐     ┌─────────────┐
│   Strapi    │────▶│GlobalSettings│
│   (CMS)     │     └─────────────┘
└─────────────┘           │
      │                   ▼
      │             ┌─────────────┐
      │             │ Age Gate    │
      │             │ Config      │
      │             └─────────────┘
      ▼
┌─────────────┐
│  Pages/     │
│  Policies   │
└─────────────┘
```
