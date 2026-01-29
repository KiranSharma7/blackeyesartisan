# Data Model: MVP B2C Storefront

**Feature**: 001-mvp-storefront
**Date**: 2026-01-29
**Status**: Complete

## Overview

This document defines the data entities, their relationships, and state management patterns for the BlackEyesArtisan storefront. Data is distributed across three systems per the constitution's Data Source Integrity principle.

## Data Sources

```
┌─────────────────────────────────────────────────────────────────────┐
│                         STOREFRONT (Next.js)                        │
│                         Vercel Deployment                           │
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │  UI State    │    │  Cart State  │    │  Age Gate    │          │
│  │  (React)     │    │  (Medusa)    │    │  (Cookie)    │          │
│  └──────────────┘    └──────────────┘    └──────────────┘          │
└─────────────────────────────────────────────────────────────────────┘
           │                    │                    │
           │ REST API           │ REST API           │ Cookie
           ▼                    ▼                    ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌──────────────┐
│   STRAPI CMS        │  │   MEDUSA BACKEND    │  │   BROWSER    │
│   (Content)         │  │   (Commerce)        │  │   (State)    │
│                     │  │                     │  │              │
│  • Pages            │  │  • Products         │  │  • age_ver.. │
│  • Policies         │  │  • Collections      │  │    cookie    │
│  • GlobalSettings   │  │  • Variants         │  │  • cart_id   │
│  • Announcement     │  │  • Cart             │  │    cookie    │
│                     │  │  • Order            │  │              │
│                     │  │  • Customer         │  │              │
│                     │  │  • Region           │  │              │
└─────────────────────┘  └─────────────────────┘  └──────────────┘
         │                        │
         │                        │
         ▼                        ▼
┌─────────────────────┐  ┌─────────────────────┐
│   PostgreSQL        │  │   PostgreSQL        │
│   (Strapi DB)       │  │   (Medusa DB)       │
└─────────────────────┘  └─────────────────────┘
```

## Entity Definitions

### Commerce Entities (Medusa - Source of Truth)

#### Product
```typescript
interface Product {
  id: string
  title: string
  subtitle: string | null
  description: string
  handle: string                    // URL slug
  status: "draft" | "published"
  thumbnail: string | null
  images: ProductImage[]
  variants: ProductVariant[]
  collection: Collection | null
  collection_id: string | null
  created_at: string
  updated_at: string
  metadata: Record<string, unknown>
}

interface ProductImage {
  id: string
  url: string
  metadata: Record<string, unknown>
}
```

#### ProductVariant
```typescript
interface ProductVariant {
  id: string
  title: string
  sku: string | null
  barcode: string | null
  inventory_quantity: number        // Key for sold-out detection
  allow_backorder: boolean
  manage_inventory: boolean
  prices: MoneyAmount[]
  options: ProductOptionValue[]
  created_at: string
  updated_at: string
}

interface MoneyAmount {
  id: string
  amount: number                    // In cents (e.g., 4500 = $45.00)
  currency_code: string             // "usd" only for MVP
}
```

**Sold-Out Logic**:
```typescript
function isProductSoldOut(product: Product): boolean {
  return product.variants.every(v => v.inventory_quantity <= 0)
}

function isVariantSoldOut(variant: ProductVariant): boolean {
  return variant.inventory_quantity <= 0
}
```

#### Collection
```typescript
interface Collection {
  id: string
  title: string
  handle: string                    // URL slug
  metadata: Record<string, unknown>
  products?: Product[]              // When expanded
  created_at: string
  updated_at: string
}
```

#### Cart
```typescript
interface Cart {
  id: string
  email: string | null
  billing_address: Address | null
  shipping_address: Address | null
  items: LineItem[]
  region: Region
  shipping_methods: ShippingMethod[]
  payment_session: PaymentSession | null
  subtotal: number
  shipping_total: number
  tax_total: number
  total: number
  created_at: string
  updated_at: string
}

interface LineItem {
  id: string
  cart_id: string
  title: string
  description: string | null
  thumbnail: string | null
  quantity: number
  unit_price: number
  variant_id: string
  variant: ProductVariant
  subtotal: number
  total: number
}
```

#### Address
```typescript
interface Address {
  id: string
  first_name: string
  last_name: string
  address_1: string
  address_2: string | null
  city: string
  province: string | null           // State/Province
  postal_code: string
  country_code: string              // ISO 2-letter code
  phone: string                     // REQUIRED for FedEx
  metadata: Record<string, unknown>
}
```

#### Order
```typescript
interface Order {
  id: string
  display_id: number                // Human-readable order number
  status: OrderStatus
  email: string
  billing_address: Address
  shipping_address: Address
  items: LineItem[]
  payments: Payment[]
  fulfillments: Fulfillment[]
  subtotal: number
  shipping_total: number
  tax_total: number
  total: number
  currency_code: string
  created_at: string
  updated_at: string
}

type OrderStatus =
  | "pending"
  | "completed"
  | "archived"
  | "canceled"
  | "requires_action"

interface Fulfillment {
  id: string
  tracking_numbers: string[]
  tracking_links: TrackingLink[]
  shipped_at: string | null
  created_at: string
}

interface TrackingLink {
  tracking_number: string
  url: string                       // FedEx tracking URL
}
```

#### Customer
```typescript
interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  billing_address: Address | null
  shipping_addresses: Address[]
  orders: Order[]
  created_at: string
  updated_at: string
}
```

#### Region
```typescript
interface Region {
  id: string
  name: string
  currency_code: string             // "usd"
  countries: Country[]
  shipping_options: ShippingOption[]
}

interface ShippingOption {
  id: string
  name: string                      // "International Flat Rate"
  amount: number                    // Fixed shipping cost in cents
  is_return: boolean
}
```

### Content Entities (Strapi - Source of Truth)

#### Page
```typescript
interface StrapiPage {
  id: number
  attributes: {
    title: string
    slug: string                    // URL path
    content: string                 // Rich text (markdown or HTML)
    seo: {
      metaTitle: string
      metaDescription: string
      ogImage: StrapiMedia | null
    } | null
    createdAt: string
    updatedAt: string
    publishedAt: string | null
  }
}
```

#### Policy
```typescript
interface StrapiPolicy {
  id: number
  attributes: {
    title: string
    slug: string                    // "shipping", "returns", "privacy", "terms"
    content: string                 // Rich text
    category: "shipping" | "returns" | "privacy" | "terms"
    createdAt: string
    updatedAt: string
    publishedAt: string | null
  }
}
```

#### GlobalSettings
```typescript
interface StrapiGlobalSettings {
  id: number
  attributes: {
    ageGateTtl: number              // Days to remember age verification
    handlingTime: string            // e.g., "5-7 business days"
    dutiesDisclaimer: string        // Duties/taxes disclaimer text
    currencySymbol: string          // "$"
    siteTitle: string
    siteDescription: string
    createdAt: string
    updatedAt: string
  }
}
```

#### AnnouncementBar
```typescript
interface StrapiAnnouncementBar {
  id: number
  attributes: {
    message: string
    isActive: boolean
    linkUrl: string | null
    linkText: string | null
    backgroundColor: string | null  // Optional custom color
    createdAt: string
    updatedAt: string
  }
}
```

### Client-Side State

#### Age Verification State
```typescript
// Cookie-based (HTTP-only)
interface AgeVerificationCookie {
  name: "age_verified"
  value: "true"
  maxAge: number                    // From Strapi ageGateTtl (seconds)
  httpOnly: true
  secure: boolean                   // true in production
  sameSite: "lax"
}
```

#### Cart Context
```typescript
// React Context for cart UI state
interface CartContext {
  cart: Cart | null
  isLoading: boolean
  isOpen: boolean                   // Cart drawer state

  // Actions
  addItem: (variantId: string, quantity?: number) => Promise<void>
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  setCartOpen: (open: boolean) => void
}
```

#### Newsletter Form State
```typescript
interface NewsletterFormState {
  email: string
  status: "idle" | "loading" | "success" | "error" | "already_subscribed"
  errorMessage: string | null
}
```

## State Transitions

### Cart Lifecycle
```
┌─────────────┐     addItem()      ┌─────────────┐
│   Empty     │ ─────────────────▶ │  Has Items  │
│   (null)    │                    │             │
└─────────────┘                    └─────────────┘
                                          │
                                          │ checkout()
                                          ▼
                                   ┌─────────────┐
                                   │  Checkout   │
                                   │  In Progress│
                                   └─────────────┘
                                          │
                                          │ complete()
                                          ▼
                                   ┌─────────────┐
                                   │   Order     │
                                   │  Created    │
                                   └─────────────┘
```

### Age Verification Flow
```
┌─────────────────┐
│  New Visitor    │
│  (no cookie)    │
└────────┬────────┘
         │
         │ visits any page
         ▼
┌─────────────────┐
│   Age Gate      │
│   Modal/Page    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐  ┌────────────────┐
│Under 18│  │  18+ Confirmed │
│        │  │                │
└────┬───┘  └───────┬────────┘
     │              │
     │              │ set cookie (TTL days)
     ▼              ▼
┌────────┐  ┌────────────────┐
│ Exit   │  │   Verified     │
│ Page   │  │   (can browse) │
└────────┘  └───────┬────────┘
                    │
                    │ TTL expires
                    ▼
            ┌────────────────┐
            │  Re-verify     │
            │  Required      │
            └────────────────┘
```

### Order Status Flow
```
┌─────────┐      ┌───────────┐      ┌───────────┐
│ Pending │ ───▶ │ Completed │ ───▶ │ Fulfilled │
└─────────┘      └───────────┘      └───────────┘
     │                                    │
     │                                    │ tracking added
     ▼                                    ▼
┌─────────┐                         ┌───────────┐
│Canceled │                         │  Shipped  │
└─────────┘                         │(w/tracking)│
                                    └───────────┘
```

## Validation Rules

### Address Validation
| Field | Rule | Error Message |
|-------|------|---------------|
| first_name | Required, 1-50 chars | "First name is required" |
| last_name | Required, 1-50 chars | "Last name is required" |
| address_1 | Required, 1-200 chars | "Street address is required" |
| city | Required, 1-100 chars | "City is required" |
| postal_code | Required, valid format | "Valid postal code required" |
| country_code | Required, valid ISO code | "Please select a country" |
| phone | Required, valid format | "Valid phone number required for delivery" |

### Email Validation
| Context | Rule | Error Message |
|---------|------|---------------|
| Newsletter | Valid email format | "Please enter a valid email" |
| Checkout | Valid email format | "Please enter a valid email" |

### Cart Validation (at checkout)
| Rule | Action |
|------|--------|
| Empty cart | Block checkout, show message |
| Item out of stock | Show error, offer removal |
| Quantity exceeds inventory | Reduce to available, show notice |

## Relationships

```
Product ─────┬───── has many ───── ProductVariant
             │
             └───── belongs to ───── Collection

Cart ────────┬───── has many ───── LineItem
             │
             └───── belongs to ───── Region

LineItem ────────── references ───── ProductVariant

Order ───────┬───── has many ───── LineItem
             │
             ├───── has many ───── Payment
             │
             ├───── has many ───── Fulfillment
             │
             └───── belongs to ───── Customer

Customer ────┬───── has many ───── Order
             │
             └───── has many ───── Address

StrapiGlobalSettings ───── singleton ───── (one record)
StrapiAnnouncementBar ───── singleton ───── (one record)
```

## Data Fetching Patterns

### Server Components (SSR)
```typescript
// Fetch in Server Component, pass to Client Components
async function ProductPage({ handle }: { handle: string }) {
  const product = await medusa.products.list({
    handle,
    expand: "variants,images,collection"
  })

  return <ProductDetail product={product} />
}
```

### Client Components (Interactive)
```typescript
// Use React Query or SWR for client-side data
function CartDrawer() {
  const { cart, isLoading } = useCart()

  if (isLoading) return <Spinner />
  if (!cart) return <EmptyCart />

  return <CartItems items={cart.items} />
}
```

### ISR for CMS Content
```typescript
// Strapi content with revalidation
async function AboutPage() {
  const page = await fetchStrapi<StrapiPage>("/pages", {
    "filters[slug][$eq]": "about"
  })

  return <PageContent content={page.attributes.content} />
}

// In page file
export const revalidate = 60 // Revalidate every 60 seconds
```
