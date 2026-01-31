# Implementation Specification: Phase 3 - User Story 1

## Browse and Purchase Available Product (Priority: P1) - MVP Core

**Phase**: 3 | **Priority**: P1 (MVP Core)
**Date**: 2026-01-31
**Status**: Ready for Implementation
**Parent Spec**: [/specs/main/spec.md](/specs/main/spec.md)
**Design System**: [/docs/design-system.md](/docs/design-system.md)

---

## 1. User Story Summary

> A collector discovers BlackEyesArtisan through social media, lands on the homepage, browses the collection of handmade glass pipes, views a product they like, adds it to cart, and completes checkout with international shipping to their country.

**Why this priority**: This is the core revenue-generating journey. Without the ability to browse and purchase, the business cannot function. Every other feature builds upon this foundation.

### Acceptance Criteria (from spec.md)

1. **Given** a visitor on the homepage, **When** they click on a product collection, **Then** they see a grid of available products with images, names, and prices
2. **Given** a visitor viewing a product, **When** they click "Add to Cart", **Then** the item is added and cart count updates visibly
3. **Given** a visitor with items in cart, **When** they proceed to checkout, **Then** they can enter shipping address (including international), phone number, and payment details
4. **Given** a visitor completing checkout, **When** payment succeeds, **Then** they see an order confirmation page and receive a confirmation email

---

## 2. Current State Analysis

### What Exists (Ready to Use)

| Component | Location | Status |
|-----------|----------|--------|
| Medusa SDK Config | `storefront/src/lib/config.ts` | ✅ Complete |
| Product Data Functions | `storefront/src/lib/data/products.ts` | ✅ Complete |
| Cart Data Functions | `storefront/src/lib/data/cart.ts` | ✅ Complete |
| Checkout Functions | `storefront/src/lib/data/cart.ts` | ✅ Complete |
| Region/Country Data | `storefront/src/lib/data/regions.ts` | ✅ Complete |
| Price Utilities | `storefront/src/lib/util/money.ts` | ✅ Complete |
| Form Validation | `storefront/src/lib/util/validator.ts` | ✅ Complete |
| Zustand Cart Store | `storefront/src/lib/store/useCartStore.tsx` | ✅ Complete |
| TypeScript Types | `storefront/src/types/global.ts` | ✅ Complete |

### What Needs Implementation

| Component | Location | Status |
|-----------|----------|--------|
| Homepage | `storefront/src/app/[countryCode]/(main)/page.tsx` | 🔴 "Hello World" stub |
| Product Detail Page | `storefront/src/app/[countryCode]/(main)/products/[handle]/page.tsx` | 🔴 "Coming Soon" stub |
| Cart Page | `storefront/src/app/[countryCode]/(main)/cart/page.tsx` | 🔴 "Coming Soon" stub |
| Checkout Page | `storefront/src/app/[countryCode]/(checkout)/checkout/page.tsx` | 🔴 "Coming Soon" stub |
| Shop/Collection Pages | `storefront/src/app/[countryCode]/(main)/shop/page.tsx` | 🔴 "Coming Soon" stub |
| Layout Components | `storefront/src/modules/layout/` | 🔴 Missing |
| Product Components | `storefront/src/modules/products/` | 🔴 Missing |
| Cart Components | `storefront/src/modules/cart/` | 🔴 Missing |
| Checkout Components | `storefront/src/modules/checkout/` | 🔴 Missing |

---

## 3. Architecture Overview

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USER JOURNEY                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   1. HOMEPAGE                                                        │
│      └─► Featured products grid (SSR from Medusa)                   │
│          └─► Product cards with prices                              │
│                                                                      │
│   2. SHOP/COLLECTION PAGE                                           │
│      └─► Full product listing (SSR with pagination)                 │
│          └─► Filter by collection                                   │
│          └─► Sort by price/date                                     │
│                                                                      │
│   3. PRODUCT DETAIL PAGE                                            │
│      └─► Product info (SSR from Medusa)                             │
│          └─► Image gallery                                          │
│          └─► Variant selector (if applicable)                       │
│          └─► Add to Cart button                                     │
│                                                                      │
│   4. CART                                                            │
│      └─► Cart state (client-side Zustand + server cookie)           │
│          └─► Line items with quantities                             │
│          └─► Cart totals                                            │
│          └─► Proceed to checkout                                    │
│                                                                      │
│   5. CHECKOUT                                                        │
│      └─► Shipping address form                                      │
│      └─► Shipping method selection                                  │
│      └─► Payment (Stripe)                                           │
│      └─► Order confirmation                                         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### API Integration Points

| Step | API Endpoint | Method | Purpose |
|------|--------------|--------|---------|
| Browse Products | `/store/products` | GET | List all products with prices |
| Product Detail | `/store/products/{handle}` | GET | Single product with variants |
| Create Cart | `/store/carts` | POST | Initialize shopping cart |
| Add to Cart | `/store/carts/{id}/line-items` | POST | Add product variant |
| Update Cart | `/store/carts/{id}/line-items/{line_id}` | POST | Update quantity |
| Remove from Cart | `/store/carts/{id}/line-items/{line_id}` | DELETE | Remove item |
| Set Shipping Address | `/store/carts/{id}` | POST | Update cart with address |
| Get Shipping Options | `/store/shipping-options` | GET | Available shipping methods |
| Set Shipping Method | `/store/carts/{id}/shipping-methods` | POST | Select shipping |
| Create Payment Session | `/store/carts/{id}/payment-sessions` | POST | Initialize Stripe |
| Complete Cart | `/store/carts/{id}/complete` | POST | Finalize order |

---

## 4. Component Specifications

### 4.1 Layout Components

#### Header (`storefront/src/modules/layout/components/header/index.tsx`)

**Purpose**: Site navigation with logo, nav links, search, and cart icon

**Design System Integration**:
```tsx
// Sticky nav with paper/ink colors
<nav className="sticky top-4 z-50 px-4 md:px-8 mb-8">
  <div className="bg-paper/90 backdrop-blur-md border-2 border-ink rounded-xl shadow-hard
                  flex justify-between items-center p-4">
    {/* Logo - Dela Gothic One */}
    <Link href="/" className="text-2xl md:text-3xl font-display tracking-tighter">
      BLACK<span className="text-acid">EYES</span>
    </Link>

    {/* Nav Links - Space Grotesk */}
    <div className="hidden md:flex items-center gap-8 font-semibold text-sm tracking-tight">
      <Link href="/shop" className="hover:text-acid hover:underline decoration-2 decoration-acid underline-offset-4">
        SHOP
      </Link>
      <Link href="/collections" className="hover:text-acid hover:underline decoration-2 decoration-acid underline-offset-4">
        COLLECTIONS
      </Link>
    </div>

    {/* Cart Button */}
    <CartButton />
  </div>
</nav>
```

**Props**:
```typescript
interface HeaderProps {
  countryCode: string
}
```

**State Dependencies**:
- `useCartStore` for cart item count

---

#### Footer (`storefront/src/modules/layout/components/footer/index.tsx`)

**Purpose**: Site footer with links, newsletter signup (Phase 6), and legal links

**Design System Integration**:
```tsx
<footer className="bg-ink text-paper pt-16 pb-8 border-t-2 border-ink">
  <div className="max-w-7xl mx-auto px-4 md:px-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
      {/* Logo */}
      <div className="col-span-2 md:col-span-1">
        <span className="text-3xl font-display tracking-tighter">
          BLACK<span className="text-transparent" style={{WebkitTextStroke: '1px #D63D42'}}>EYES</span>
        </span>
        <p className="text-sm opacity-60 max-w-[200px] mt-4">
          Handcrafted glass art from Nepal
        </p>
      </div>

      {/* Shop Links */}
      <div>
        <h4 className="font-display text-lg text-sun mb-4">SHOP</h4>
        <ul className="space-y-2 text-sm font-medium opacity-80">
          <li><Link href="/shop" className="hover:text-acid">All Products</Link></li>
          <li><Link href="/collections" className="hover:text-acid">Collections</Link></li>
        </ul>
      </div>

      {/* Policy Links */}
      <div>
        <h4 className="font-display text-lg text-sun mb-4">INFO</h4>
        <ul className="space-y-2 text-sm font-medium opacity-80">
          <li><Link href="/about" className="hover:text-acid">About</Link></li>
          <li><Link href="/policies/shipping" className="hover:text-acid">Shipping</Link></li>
        </ul>
      </div>
    </div>

    {/* Copyright */}
    <div className="pt-8 border-t border-paper/20 text-xs font-bold opacity-40">
      © 2026 Black Eyes Artisan. All rights reserved.
    </div>
  </div>
</footer>
```

---

### 4.2 Product Components

#### ProductCard (`storefront/src/modules/products/components/product-card/index.tsx`)

**Purpose**: Display product in grid/listing with image, name, price

**Design System Integration**:
```tsx
<Link
  href={`/products/${product.handle}`}
  className="group relative bg-white border-2 border-ink rounded-2xl overflow-hidden
             hover:shadow-hard-xl transition-all duration-300"
>
  {/* Image Container */}
  <div className="aspect-[4/5] bg-stone/20 border-b-2 border-ink relative overflow-hidden
                  p-6 flex items-center justify-center">
    <Image
      src={product.thumbnail || '/placeholder.png'}
      alt={product.title}
      fill
      className="object-contain group-hover:scale-110 transition-transform duration-500"
    />
  </div>

  {/* Content */}
  <div className="p-4">
    <h3 className="font-display text-lg leading-none mb-1 uppercase">
      {product.title}
    </h3>
    <p className="text-sm font-bold text-ink/60">
      {formatPrice(getLowestPrice(product))}
    </p>
  </div>
</Link>
```

**Props**:
```typescript
interface ProductCardProps {
  product: HttpTypes.StoreProduct
  regionId: string
}
```

**Utility Functions Needed**:
- `getLowestPrice(product)` - Returns cheapest variant price
- `formatPrice(amount, currency)` - Formats price with currency symbol

---

#### ProductGrid (`storefront/src/modules/products/components/product-grid/index.tsx`)

**Purpose**: Responsive grid layout for product cards

**Design System Integration**:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} regionId={regionId} />
  ))}
</div>
```

**Props**:
```typescript
interface ProductGridProps {
  products: HttpTypes.StoreProduct[]
  regionId: string
}
```

---

#### ProductDetail (`storefront/src/modules/products/components/product-detail/index.tsx`)

**Purpose**: Full product detail view with image gallery, variants, add to cart

**Design System Integration**:
```tsx
<div className="grid lg:grid-cols-12 gap-12 items-start">
  {/* Image Gallery - Left Column */}
  <div className="lg:col-span-7 sticky top-32">
    <ProductImageGallery images={product.images} />
  </div>

  {/* Product Info - Right Column */}
  <div className="lg:col-span-5 flex flex-col gap-8">
    {/* Title */}
    <div>
      <h1 className="font-display text-4xl md:text-5xl uppercase mb-2">
        {product.title}
      </h1>
      <p className="text-2xl font-bold">{formatPrice(selectedVariant.price)}</p>
    </div>

    {/* Description */}
    <p className="text-base font-medium opacity-70 leading-relaxed">
      {product.description}
    </p>

    {/* Variant Selector (if multiple variants) */}
    {product.variants.length > 1 && (
      <VariantSelector
        variants={product.variants}
        selected={selectedVariant}
        onSelect={setSelectedVariant}
      />
    )}

    {/* Add to Cart */}
    <AddToCartButton
      variantId={selectedVariant.id}
      countryCode={countryCode}
    />

    {/* Product Details Accordion */}
    <ProductAccordion product={product} />
  </div>
</div>
```

**Props**:
```typescript
interface ProductDetailProps {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}
```

---

#### ProductImageGallery (`storefront/src/modules/products/components/image-gallery/index.tsx`)

**Purpose**: Main image with thumbnail navigation

**Design System Integration**:
```tsx
<div className="space-y-4">
  {/* Main Image */}
  <div className="relative bg-white border-2 border-ink rounded-[2rem] shadow-hard-xl
                  overflow-hidden aspect-square">
    <Image
      src={selectedImage.url}
      alt={product.title}
      fill
      className="object-cover"
    />
  </div>

  {/* Thumbnails */}
  <div className="grid grid-cols-4 gap-4">
    {images.map((image, index) => (
      <button
        key={image.id}
        onClick={() => setSelectedImage(image)}
        className={cn(
          "relative rounded-xl border-2 border-ink overflow-hidden aspect-square",
          selectedImage.id === image.id
            ? "shadow-hard-sm bg-acid"
            : "hover:-translate-y-1 transition-transform"
        )}
      >
        <Image src={image.url} alt="" fill className="object-cover" />
      </button>
    ))}
  </div>
</div>
```

---

#### AddToCartButton (`storefront/src/modules/products/components/add-to-cart/index.tsx`)

**Purpose**: Button to add product variant to cart with loading state

**Design System Integration**:
```tsx
<button
  onClick={handleAddToCart}
  disabled={isLoading || !inStock}
  className="w-full bg-acid text-white border-2 border-ink rounded-xl font-display
             text-lg px-6 py-4 shadow-hard-sm
             hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]
             disabled:opacity-50 disabled:cursor-not-allowed
             transition-all"
>
  {isLoading ? 'ADDING...' : 'ADD TO CART'}
</button>
```

**Props**:
```typescript
interface AddToCartButtonProps {
  variantId: string
  countryCode: string
  disabled?: boolean
}
```

**State/Actions**:
- Uses `addToCart` server action from `src/lib/data/cart.ts`
- Updates Zustand cart store on success
- Shows toast notification on success/error

---

### 4.3 Cart Components

#### CartDrawer (`storefront/src/modules/cart/components/cart-drawer/index.tsx`)

**Purpose**: Slide-out cart preview from header

**Design System Integration**:
```tsx
<div className="fixed inset-y-0 right-0 w-full max-w-md bg-paper border-l-2 border-ink
                shadow-hard-xl z-50 flex flex-col">
  {/* Header */}
  <div className="flex items-center justify-between p-6 border-b-2 border-ink">
    <h2 className="font-display text-2xl uppercase">YOUR CART</h2>
    <button
      onClick={onClose}
      className="p-2 hover:bg-stone rounded-lg transition-colors"
    >
      <XIcon className="w-6 h-6" />
    </button>
  </div>

  {/* Items */}
  <div className="flex-1 overflow-y-auto p-6">
    {cart?.items?.map((item) => (
      <CartItem key={item.id} item={item} />
    ))}
  </div>

  {/* Footer */}
  <div className="p-6 border-t-2 border-ink bg-white">
    <div className="flex justify-between mb-4">
      <span className="font-bold">Subtotal</span>
      <span className="font-display text-xl">{formatPrice(cart?.subtotal)}</span>
    </div>
    <Link
      href="/checkout"
      className="block w-full bg-ink text-paper border-2 border-ink rounded-xl
                 font-display text-center py-4 shadow-hard-sm
                 hover:bg-acid transition-colors"
    >
      CHECKOUT
    </Link>
  </div>
</div>
```

---

#### CartItem (`storefront/src/modules/cart/components/cart-item/index.tsx`)

**Purpose**: Single line item in cart with quantity controls

**Design System Integration**:
```tsx
<div className="flex gap-4 py-4 border-b border-ink/10">
  {/* Image */}
  <div className="w-20 h-20 bg-stone/20 border-2 border-ink rounded-xl overflow-hidden flex-shrink-0">
    <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
  </div>

  {/* Details */}
  <div className="flex-1">
    <h3 className="font-display text-sm uppercase">{item.title}</h3>
    <p className="text-sm text-ink/60">{item.variant.title}</p>
    <p className="font-bold mt-1">{formatPrice(item.unit_price)}</p>
  </div>

  {/* Quantity */}
  <div className="flex items-center border-2 border-ink rounded-xl bg-white h-10">
    <button
      onClick={() => updateQuantity(item.id, item.quantity - 1)}
      className="px-3 hover:bg-stone rounded-l-lg transition-colors"
    >
      -
    </button>
    <span className="px-2 font-bold">{item.quantity}</span>
    <button
      onClick={() => updateQuantity(item.id, item.quantity + 1)}
      className="px-3 hover:bg-stone rounded-r-lg transition-colors"
    >
      +
    </button>
  </div>

  {/* Remove */}
  <button
    onClick={() => removeItem(item.id)}
    className="text-ink/40 hover:text-acid transition-colors"
  >
    <TrashIcon className="w-5 h-5" />
  </button>
</div>
```

---

#### CartPage (`storefront/src/modules/cart/templates/cart-template/index.tsx`)

**Purpose**: Full cart page with items, totals, and checkout button

**Design System Integration**:
```tsx
<div className="max-w-4xl mx-auto px-4 py-12">
  <h1 className="font-display text-4xl uppercase mb-8">YOUR CART</h1>

  {cart?.items?.length === 0 ? (
    <EmptyCart />
  ) : (
    <div className="grid lg:grid-cols-3 gap-12">
      {/* Items Column */}
      <div className="lg:col-span-2 space-y-4">
        {cart?.items?.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* Summary Column */}
      <div className="lg:col-span-1">
        <div className="bg-white border-2 border-ink rounded-2xl p-6 shadow-hard sticky top-32">
          <h2 className="font-display text-xl mb-6">ORDER SUMMARY</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold">{formatPrice(cart?.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold">Calculated at checkout</span>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-ink/20 my-6"></div>

          <div className="flex justify-between text-lg font-bold mb-6">
            <span>Total</span>
            <span className="font-display">{formatPrice(cart?.total)}</span>
          </div>

          <Link
            href="/checkout"
            className="block w-full bg-acid text-white border-2 border-ink rounded-xl
                       font-display text-center py-4 shadow-hard-sm
                       hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]
                       transition-all"
          >
            PROCEED TO CHECKOUT
          </Link>
        </div>
      </div>
    </div>
  )}
</div>
```

---

### 4.4 Checkout Components

#### CheckoutTemplate (`storefront/src/modules/checkout/templates/checkout-template/index.tsx`)

**Purpose**: Multi-step checkout flow container

**Design System Integration**:
```tsx
<div className="min-h-screen bg-stone/20">
  <div className="max-w-6xl mx-auto px-4 py-12">
    <div className="grid lg:grid-cols-2 gap-12">
      {/* Form Column */}
      <div className="space-y-8">
        {/* Shipping Address */}
        <CheckoutSection title="SHIPPING ADDRESS">
          <ShippingAddressForm cart={cart} />
        </CheckoutSection>

        {/* Shipping Method */}
        {cart?.shipping_address && (
          <CheckoutSection title="SHIPPING METHOD">
            <ShippingMethodSelect cart={cart} />
          </CheckoutSection>
        )}

        {/* Payment */}
        {cart?.shipping_methods?.length > 0 && (
          <CheckoutSection title="PAYMENT">
            <PaymentForm cart={cart} />
          </CheckoutSection>
        )}
      </div>

      {/* Summary Column */}
      <div>
        <CheckoutSummary cart={cart} />
      </div>
    </div>
  </div>
</div>
```

---

#### ShippingAddressForm (`storefront/src/modules/checkout/components/shipping-address/index.tsx`)

**Purpose**: Collect shipping address with international support

**Design System Integration**:
```tsx
<form onSubmit={handleSubmit} className="space-y-4">
  <div className="grid grid-cols-2 gap-4">
    <InputField name="first_name" label="First Name" required />
    <InputField name="last_name" label="Last Name" required />
  </div>

  <InputField name="address_1" label="Address" required />
  <InputField name="address_2" label="Apartment, suite, etc." />

  <div className="grid grid-cols-2 gap-4">
    <InputField name="city" label="City" required />
    <InputField name="postal_code" label="Postal Code" required />
  </div>

  <SelectField name="country_code" label="Country" options={countries} required />

  <InputField name="phone" label="Phone" type="tel" required
              helpText="Required for FedEx delivery" />

  <button
    type="submit"
    disabled={isSubmitting}
    className="w-full bg-ink text-paper border-2 border-ink rounded-xl
               font-display py-4 shadow-hard-sm
               hover:bg-acid transition-colors"
  >
    {isSubmitting ? 'SAVING...' : 'CONTINUE TO SHIPPING'}
  </button>
</form>
```

**Validation** (using existing validator.ts):
- All fields required except address_2
- Phone number validated with libphonenumber-js
- Country code must be valid ISO 3166-1 alpha-2

---

#### PaymentForm (`storefront/src/modules/checkout/components/payment/index.tsx`)

**Purpose**: Stripe payment integration

**Design System Integration**:
```tsx
<div className="space-y-4">
  <div className="bg-white border-2 border-ink rounded-xl p-6">
    {/* Stripe Elements Container */}
    <StripeCardElement
      options={{
        style: {
          base: {
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '16px',
            color: '#18181B',
            '::placeholder': { color: '#18181B66' }
          }
        }
      }}
    />
  </div>

  <button
    onClick={handlePayment}
    disabled={isProcessing}
    className="w-full bg-acid text-white border-2 border-ink rounded-xl
               font-display text-xl py-5 shadow-hard-sm
               hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]
               disabled:opacity-50 transition-all"
  >
    {isProcessing ? 'PROCESSING...' : `PAY ${formatPrice(cart.total)}`}
  </button>
</div>
```

---

#### OrderConfirmation (`storefront/src/modules/checkout/templates/order-confirmation/index.tsx`)

**Purpose**: Display order success with order details

**Design System Integration**:
```tsx
<div className="max-w-2xl mx-auto px-4 py-16 text-center">
  {/* Success Icon */}
  <div className="w-20 h-20 bg-acid text-white rounded-full border-2 border-ink
                  mx-auto mb-8 flex items-center justify-center shadow-hard">
    <CheckIcon className="w-10 h-10" />
  </div>

  <h1 className="font-display text-4xl uppercase mb-4">ORDER CONFIRMED!</h1>
  <p className="text-lg text-ink/60 mb-2">Order #{order.display_id}</p>
  <p className="text-sm text-ink/60 mb-8">
    Confirmation sent to {order.email}
  </p>

  {/* Order Items */}
  <div className="bg-white border-2 border-ink rounded-2xl p-6 shadow-hard text-left mb-8">
    <h2 className="font-display text-xl mb-4">ORDER DETAILS</h2>
    {order.items.map((item) => (
      <OrderItem key={item.id} item={item} />
    ))}

    <div className="border-t-2 border-dashed border-ink/20 my-4"></div>

    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span className="font-bold">{formatPrice(order.subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span>Shipping</span>
        <span className="font-bold">{formatPrice(order.shipping_total)}</span>
      </div>
      <div className="flex justify-between text-lg font-display">
        <span>TOTAL</span>
        <span>{formatPrice(order.total)}</span>
      </div>
    </div>
  </div>

  {/* Handling Time Notice */}
  <div className="bg-sun/20 border-2 border-ink rounded-xl p-4 text-sm">
    <p className="font-bold">Estimated Handling Time: 3-5 business days</p>
    <p className="text-ink/60 mt-1">
      You'll receive a shipping confirmation email with tracking when your order ships.
    </p>
  </div>

  <Link
    href="/"
    className="inline-block mt-8 bg-ink text-paper border-2 border-ink rounded-xl
               font-display px-8 py-3 shadow-hard-sm
               hover:bg-acid transition-colors"
  >
    CONTINUE SHOPPING
  </Link>
</div>
```

---

## 5. Page Implementations

### 5.1 Homepage (`storefront/src/app/[countryCode]/(main)/page.tsx`)

**Purpose**: Landing page with featured products and collections

**Data Requirements**:
- Featured products (limit 8) from Medusa
- Collections list from Medusa

**Implementation**:
```tsx
export default async function HomePage({ params }: { params: { countryCode: string } }) {
  const region = await getRegion(params.countryCode)
  const products = await getProductsList({
    pageParam: 0,
    queryParams: { limit: 8 },
    countryCode: params.countryCode
  })
  const collections = await getCollectionsList()

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="font-display text-5xl md:text-7xl uppercase mb-6">
            HANDCRAFTED<br />
            <span className="text-acid">GLASS ART</span>
          </h1>
          <p className="text-lg font-medium text-ink/60 max-w-xl mx-auto mb-8">
            One-of-a-kind pieces, handmade in Nepal with love and fire.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-acid text-white border-2 border-ink rounded-xl
                       font-display px-8 py-4 shadow-hard-sm
                       hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]
                       transition-all"
          >
            SHOP NOW
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-stone/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="font-display text-3xl uppercase mb-8">LATEST DROPS</h2>
          <ProductGrid products={products} regionId={region.id} />
          <div className="text-center mt-8">
            <Link
              href="/shop"
              className="inline-block border-2 border-ink rounded-xl font-display
                         px-8 py-3 hover:bg-ink hover:text-paper transition-colors"
            >
              VIEW ALL
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
```

---

### 5.2 Shop Page (`storefront/src/app/[countryCode]/(main)/shop/page.tsx`)

**Purpose**: Full product catalog with pagination

**Data Requirements**:
- All products with pagination
- Filter options (collections, categories)

**Implementation**:
```tsx
export default async function ShopPage({
  params,
  searchParams
}: {
  params: { countryCode: string }
  searchParams: { page?: string, collection?: string }
}) {
  const page = parseInt(searchParams.page || '1')
  const limit = 12
  const offset = (page - 1) * limit

  const region = await getRegion(params.countryCode)
  const { products, count } = await getProductsList({
    pageParam: offset,
    queryParams: {
      limit,
      collection_id: searchParams.collection ? [searchParams.collection] : undefined
    },
    countryCode: params.countryCode
  })

  const totalPages = Math.ceil(count / limit)

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h1 className="font-display text-4xl uppercase mb-8">SHOP ALL</h1>

      <ProductGrid products={products} regionId={region.id} />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} />
      )}
    </div>
  )
}
```

---

### 5.3 Product Detail Page (`storefront/src/app/[countryCode]/(main)/products/[handle]/page.tsx`)

**Purpose**: Single product view with add to cart

**Data Requirements**:
- Product by handle
- Region for pricing

**Implementation**:
```tsx
export default async function ProductPage({
  params
}: {
  params: { countryCode: string, handle: string }
}) {
  const region = await getRegion(params.countryCode)
  const product = await getProductByHandle(params.handle)

  if (!product) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm font-semibold opacity-60 mb-8">
        <Link href="/" className="hover:text-ink hover:underline">Home</Link>
        <ChevronRightIcon className="w-4 h-4" />
        <Link href="/shop" className="hover:text-ink hover:underline">Shop</Link>
        <ChevronRightIcon className="w-4 h-4" />
        <span className="text-ink opacity-100 border-b-2 border-acid">{product.title}</span>
      </nav>

      <ProductDetail
        product={product}
        region={region}
        countryCode={params.countryCode}
      />
    </div>
  )
}
```

---

### 5.4 Cart Page (`storefront/src/app/[countryCode]/(main)/cart/page.tsx`)

**Purpose**: Full cart view with checkout link

**Data Requirements**:
- Cart from cookie/server

**Implementation**:
```tsx
export default async function CartPage({
  params
}: {
  params: { countryCode: string }
}) {
  const cart = await retrieveCart()

  return <CartTemplate cart={cart} countryCode={params.countryCode} />
}
```

---

### 5.5 Checkout Page (`storefront/src/app/[countryCode]/(checkout)/checkout/page.tsx`)

**Purpose**: Multi-step checkout with payment

**Data Requirements**:
- Cart with items
- Shipping options
- Payment providers

**Implementation**:
```tsx
export default async function CheckoutPage({
  params
}: {
  params: { countryCode: string }
}) {
  const cart = await retrieveCart()

  if (!cart || !cart.items?.length) {
    redirect(`/${params.countryCode}/cart`)
  }

  const shippingOptions = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region_id)

  return (
    <CheckoutTemplate
      cart={cart}
      shippingOptions={shippingOptions}
      paymentMethods={paymentMethods}
    />
  )
}
```

---

## 6. File Structure

```
storefront/src/
├── app/
│   └── [countryCode]/
│       ├── (main)/
│       │   ├── layout.tsx                    # Main layout with Header/Footer
│       │   ├── page.tsx                      # Homepage
│       │   ├── shop/
│       │   │   └── page.tsx                  # Shop listing
│       │   ├── products/
│       │   │   └── [handle]/
│       │   │       └── page.tsx              # Product detail
│       │   └── cart/
│       │       └── page.tsx                  # Cart page
│       └── (checkout)/
│           ├── layout.tsx                    # Checkout layout (minimal header)
│           └── checkout/
│               ├── page.tsx                  # Checkout flow
│               └── confirmation/
│                   └── page.tsx              # Order confirmation
│
├── modules/
│   ├── layout/
│   │   ├── components/
│   │   │   ├── header/
│   │   │   │   ├── index.tsx                 # Header component
│   │   │   │   └── cart-button.tsx           # Cart icon with count
│   │   │   └── footer/
│   │   │       └── index.tsx                 # Footer component
│   │   └── templates/
│   │       ├── main-layout/index.tsx         # Main layout template
│   │       └── checkout-layout/index.tsx     # Checkout layout template
│   │
│   ├── products/
│   │   ├── components/
│   │   │   ├── product-card/index.tsx        # Product card
│   │   │   ├── product-grid/index.tsx        # Product grid
│   │   │   ├── product-detail/index.tsx      # Product detail
│   │   │   ├── image-gallery/index.tsx       # Image gallery
│   │   │   ├── variant-selector/index.tsx    # Variant picker
│   │   │   └── add-to-cart/index.tsx         # Add to cart button
│   │   └── templates/
│   │       └── product-template/index.tsx    # Product page template
│   │
│   ├── cart/
│   │   ├── components/
│   │   │   ├── cart-drawer/index.tsx         # Slide-out cart
│   │   │   ├── cart-item/index.tsx           # Cart line item
│   │   │   └── empty-cart/index.tsx          # Empty cart state
│   │   └── templates/
│   │       └── cart-template/index.tsx       # Cart page template
│   │
│   └── checkout/
│       ├── components/
│       │   ├── checkout-section/index.tsx    # Section wrapper
│       │   ├── shipping-address/index.tsx    # Address form
│       │   ├── shipping-method/index.tsx     # Shipping selector
│       │   ├── payment/index.tsx             # Stripe payment
│       │   ├── checkout-summary/index.tsx    # Order summary
│       │   └── input-field/index.tsx         # Styled input
│       └── templates/
│           ├── checkout-template/index.tsx   # Checkout page template
│           └── order-confirmation/index.tsx  # Confirmation template
│
└── lib/
    └── util/
        └── prices.ts                         # Price formatting utilities
```

---

## 7. Implementation Order

### Phase 3.1: Foundation (Tasks T029-T030)
1. Verify Medusa SDK client works
2. Verify Strapi client works

### Phase 3.2: Layout Components (Tasks T031-T032)
1. Create Header component with design system
2. Create Footer component with design system
3. Create main layout template

### Phase 3.3: Product Components (Tasks T033-T042)
1. Create ProductCard component
2. Create ProductGrid component
3. Create ProductImageGallery component
4. Create VariantSelector component
5. Create AddToCartButton component
6. Create ProductDetail component
7. Create Homepage with featured products
8. Create Shop page with product listing
9. Create Product detail page

### Phase 3.4: Cart Components (Tasks T038-T042)
1. Create CartItem component
2. Create CartDrawer component
3. Create CartTemplate
4. Create Cart page
5. Integrate cart button in header

### Phase 3.5: Checkout Flow (Tasks T043-T045)
1. Create ShippingAddressForm component
2. Create ShippingMethodSelect component
3. Create PaymentForm component (Stripe)
4. Create CheckoutSummary component
5. Create CheckoutTemplate
6. Create Checkout page
7. Create OrderConfirmation template
8. Create Confirmation page

### Phase 3.6: Integration & Testing (Task T046)
1. Test full purchase flow locally
2. Deploy to Vercel
3. Test in production with Playwright

---

## 8. Testing Scenarios

### E2E Test: Complete Purchase Flow

```typescript
// e2e/purchase-flow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('User Story 1: Browse and Purchase', () => {
  test('complete purchase journey', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/us')
    await expect(page.locator('h1')).toContainText('HANDCRAFTED')

    // 2. Click on a product
    await page.click('[data-testid="product-card"]:first-child')
    await expect(page).toHaveURL(/\/products\//)

    // 3. Add to cart
    await page.click('[data-testid="add-to-cart"]')
    await expect(page.locator('[data-testid="cart-count"]')).toContainText('1')

    // 4. Go to cart
    await page.click('[data-testid="cart-button"]')
    await page.click('[data-testid="checkout-link"]')

    // 5. Fill shipping address
    await page.fill('[name="first_name"]', 'John')
    await page.fill('[name="last_name"]', 'Doe')
    await page.fill('[name="address_1"]', '123 Main St')
    await page.fill('[name="city"]', 'New York')
    await page.fill('[name="postal_code"]', '10001')
    await page.selectOption('[name="country_code"]', 'us')
    await page.fill('[name="phone"]', '+1 555 123 4567')
    await page.click('[data-testid="continue-shipping"]')

    // 6. Select shipping method
    await page.click('[data-testid="shipping-option"]:first-child')
    await page.click('[data-testid="continue-payment"]')

    // 7. Enter payment (Stripe test card)
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]')
    await stripeFrame.locator('[name="cardnumber"]').fill('4242424242424242')
    await stripeFrame.locator('[name="exp-date"]').fill('12/30')
    await stripeFrame.locator('[name="cvc"]').fill('123')

    // 8. Complete order
    await page.click('[data-testid="pay-button"]')

    // 9. Verify confirmation
    await expect(page).toHaveURL(/\/confirmation/)
    await expect(page.locator('h1')).toContainText('ORDER CONFIRMED')
  })

  test('homepage shows product grid', async ({ page }) => {
    await page.goto('/us')
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount({ min: 1 })
  })

  test('product detail shows add to cart', async ({ page }) => {
    await page.goto('/us/products/test-product')
    await expect(page.locator('[data-testid="add-to-cart"]')).toBeVisible()
  })

  test('cart updates when item added', async ({ page }) => {
    await page.goto('/us/products/test-product')
    await page.click('[data-testid="add-to-cart"]')
    await expect(page.locator('[data-testid="cart-count"]')).toContainText('1')
  })
})
```

---

## 9. Success Criteria Mapping

| Criterion | Implementation | Verification |
|-----------|---------------|--------------|
| SC-001: Purchase in <5 minutes | Streamlined checkout flow | E2E test timing |
| SC-010: Page load <3 seconds | SSR, image optimization | Lighthouse audit |
| SC-011: Mobile responsive | Tailwind responsive classes | Visual regression |
| SC-012: International checkout | Country selector, phone validation | E2E with international address |

---

## 10. Dependencies

### External Dependencies
- `@stripe/stripe-js` - Stripe Elements
- `@stripe/react-stripe-js` - React Stripe components

### Internal Dependencies
- `lib/data/products.ts` - Product data fetching
- `lib/data/cart.ts` - Cart operations
- `lib/data/regions.ts` - Region/country data
- `lib/util/money.ts` - Price formatting
- `lib/util/validator.ts` - Form validation

---

## 11. Environment Variables Required

```bash
# Already configured in storefront/.env.local
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.blackeyesartisan.shop
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
```

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Stripe integration issues | Checkout blocked | Test with Stripe test mode first |
| Cart state sync issues | Lost cart items | Server-side cart validation |
| Image loading performance | Slow page load | Cloudinary optimization, lazy loading |
| Form validation UX | User frustration | Clear error messages, inline validation |

---

## 13. Post-Implementation Checklist

- [ ] All acceptance criteria passing
- [ ] E2E tests passing locally
- [ ] E2E tests passing in production
- [ ] No console errors
- [ ] Lighthouse performance score >80
- [ ] Mobile responsiveness verified
- [ ] International checkout tested
- [ ] Stripe payment tested (test mode)
- [ ] Cart persistence working
- [ ] Order confirmation page displays correctly
