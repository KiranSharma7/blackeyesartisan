# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**BlackEyesArtisan Storefront** - A handcrafted artisan eCommerce store built on Next.js 14, Medusa 2.0 (commerce backend), and Strapi (CMS).

**Tech Stack:**
- **Framework**: Next.js 14 with TypeScript and Turbopack
- **Commerce**: Medusa 2.0 (@medusajs/js-sdk)
- **CMS**: Strapi
- **Styling**: Tailwind CSS with custom design system
- **Payments**: Stripe & PayPal
- **UI Components**: Medusa UI, Radix UI, Headless UI
- **Image CDN**: Cloudinary
- **Email**: Resend
- **Rate Limiting & Cache**: Upstash Redis

## Development Commands

```bash
# Start dev server with Turbopack (port 8000)
npm run dev

# Build for production
npm run build

# Run production preview
npm start

# Linting
npm run lint

# Code formatting
npm run format          # Check formatting
npm run format:write   # Fix formatting

# E2E Testing
npm test-e2e          # Run all Playwright tests
npm run test:serial   # Run tests sequentially (--workers=1)

# Bundle analysis
npm run analyze       # Generate bundle size analysis
```

## Architecture & Code Structure

### Directory Layout

```
src/
├── app/                          # Next.js 14 app router
│   ├── api/                      # Server actions and API routes
│   │   └── strapi-revalidate/   # Webhook for Strapi content revalidation
│   └── [countryCode]/            # Dynamic country-based routing
│       ├── (checkout)/           # Checkout flow pages
│       └── (main)/               # Main store pages
│
├── modules/                      # Feature modules (business logic)
│   ├── account/                  # User account & authentication
│   ├── cart/                     # Shopping cart functionality
│   ├── checkout/                 # Multi-step checkout
│   ├── products/                 # Product display & details
│   ├── categories/               # Product categories
│   ├── collections/              # Product collections
│   ├── blog/                     # Blog functionality
│   ├── common/                   # Shared components & utilities
│   │   ├── components/           # Reusable UI components
│   │   ├── icons/               # Icon components
│   │   └── theme-provider/      # Theme management (light/dark)
│   ├── layout/                   # Layout components (header, footer)
│   ├── search/                   # Product search
│   └── home/                     # Homepage module
│
├── lib/                          # Shared utilities
│   ├── config.ts                # Medusa SDK configuration
│   ├── constants.tsx            # App constants & navigation builders
│   ├── data/                     # Data fetching functions
│   │   ├── fetch.ts             # Strapi fetch utilities
│   │   ├── products.ts          # Product data fetching
│   │   ├── cart.ts              # Cart operations
│   │   ├── customer.ts          # Customer data operations
│   │   ├── orders.ts            # Order operations
│   │   ├── collections.ts       # Collection queries
│   │   └── [other].ts           # Regional, fulfillment, payment data
│   ├── hooks/                    # Custom React hooks
│   ├── util/                     # Utility functions (formatting, validation)
│   ├── store/                    # State management (Zustand)
│   ├── context/                  # React context providers
│   └── mdxPlugins/              # MDX processing plugins
│
├── styles/                       # Global styles
└── types/                        # TypeScript type definitions
```

### Module Structure Pattern

Each feature module follows this convention:
```
modules/[feature]/
├── components/
│   ├── [feature]-component/
│   │   ├── index.tsx          # Main component export
│   │   └── [subcomponent].tsx
│   └── shared-component.tsx
├── index.tsx                  # Module barrel export
└── [hooks/utils].ts          # Feature-specific utilities
```

### Key File Purposes

| File | Purpose |
|------|---------|
| `src/lib/config.ts` | Medusa SDK initialization with backend URL & publishable key |
| `src/lib/constants.tsx` | App-wide constants, navigation builders, filter keys, payment provider mappings |
| `src/lib/data/fetch.ts` | Strapi API utilities using ISR tags for cache invalidation |
| `src/lib/data/products.ts` | Product queries via Medusa SDK |
| `src/lib/data/cart.ts` | Cart operations with extensive helper functions |
| `src/lib/util/*.ts` | Formatting (money, prices), validation, URL handling, event composition |
| `eslint.config.mjs` | Flat config ESLint with React/TS/Hooks rules; test file overrides |
| `next.config.js` | Image optimization, remote pattern configuration for CDNs |

## Data Flow & Integration

### Medusa Backend Integration
- **SDK**: `@medusajs/js-sdk` initialized in `src/lib/config.ts`
- **Pattern**: Data fetching functions in `src/lib/data/` use the Medusa SDK
- **Example**: Products, cart, orders, customers, regions
- **Environment**: `NEXT_PUBLIC_MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`

### Strapi CMS Integration
- **Pattern**: Functions in `src/lib/data/fetch.ts` use direct HTTP fetch with Bearer token
- **ISR Tags**: Uses Next.js `next: { tags: [...] }` for on-demand revalidation
- **Webhook**: `/api/strapi-revalidate` endpoint triggered by Strapi webhooks
- **Environment**: `NEXT_PUBLIC_STRAPI_URL`, `NEXT_PUBLIC_STRAPI_READ_TOKEN`, `STRAPI_WEBHOOK_REVALIDATION_SECRET`
- **Types**: Strapi response types in `types/strapi.ts`

### Image Handling
- **Primary**: Cloudinary (`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`)
- **Fallback**: Medusa AWS S3 buckets (configured in `next.config.js`)
- **Pattern**: Use Next.js `Image` component with optimized remotePatterns
- **Legacy**: `NEXT_PUBLIC_SPACE_DOMAIN` support for backward compatibility

### Payment Processing
- **Stripe**: `@stripe/react-stripe-js`, `@stripe/stripe-js` (payment methods: cards, BLIK, Przelewy24, iDeal, Bancontact)
- **PayPal**: `@paypal/react-paypal-js`, `@paypal/paypal-js`
- **Provider Mapping**: `paymentInfoMap` in `constants.tsx` maps provider IDs to UI components
- **Manual Payment**: Supported via `pp_system_default` provider ID

## State Management & Context

- **Cart State**: Zustand store (`src/lib/store/`)
- **Theme**: Context provider (`modules/common/components/theme-provider`)
- **Medusa Session**: Managed via SDK cookies

## Code Patterns & Conventions

### TypeScript
- **Strict Mode**: Disabled (`"strict": false` in tsconfig.json) - lenient for rapid development
- **Path Aliases**:
  - `@lib/*` → `src/lib/`
  - `@modules/*` → `src/modules/`
  - `@pages/*` → `src/pages/`

### Data Fetching
- **Server Components**: Default for pages; fetch directly in components
- **ISR**: Use `next: { tags: [...] }` in fetch for cache invalidation via webhook
- **Revalidation Secret**: Required in env for webhook security

### Component Patterns
- **Functional Components**: Standard React functional components
- **Client/Server**: Explicitly mark with `'use client'` when needed
- **Styling**: Tailwind CSS with `cn()` utility for class merging (from `@lib/util/cn`)

### Error Handling
- **Medusa Errors**: Custom error parsing in `src/lib/util/medusa-error.ts`
- **API Errors**: Handle gracefully; avoid hard blocking

### Validation
- **Zod**: For schema validation
- **Yup**: For form validation (Formik integration)
- **Custom**: Phone number validation via `libphonenumber-js`

## Environment Variables

Required for local development (see `.env.example`):

```
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY     # Medusa public key
NEXT_PUBLIC_MEDUSA_BACKEND_URL         # Backend API URL
NEXT_PUBLIC_STRAPI_URL                 # Strapi CMS URL
NEXT_PUBLIC_STRAPI_READ_TOKEN          # Strapi read token
STRAPI_WEBHOOK_REVALIDATION_SECRET     # Webhook auth secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME      # Image CDN
NEXT_PUBLIC_BASE_URL                   # Site base URL
RESEND_API_KEY                         # Email service
UPSTASH_REDIS_REST_URL                 # Rate limiting & cache
UPSTASH_REDIS_REST_TOKEN               # Redis auth
```

## Testing

- **E2E Framework**: Playwright (`playwright.config.ts`)
- **Test Files**: `e2e/**/*.ts` or `**/*.spec.ts`/`**/*.test.ts`
- **ESLint Rules**: Relaxed for test files (no hook rules, empty patterns allowed)

## Linting & Formatting

- **ESLint**: `eslint.config.mjs` (flat config format)
  - React/React Hooks rules enforced
  - Unused imports detected
  - TypeScript strict rules mostly disabled for flexibility
  - Test files have relaxed rules
- **Prettier**: `prettier --write .` to format, `prettier --check .` to verify
- **Pre-commit**: Ensure formatting passes before commits

## Custom Design System

- **Fonts**:
  - Display: `Dela Gothic One` (--font-display)
  - Sans: `Space Grotesk` (--font-sans)
- **Theme**: Light/Dark mode support via `next-themes`
- **Colors**: Tailwind custom classes (check `tailwind.config.js`)

## Common Development Tasks

### Adding a New Page
1. Create route in `src/app/[countryCode]/(main)/[page-name]/`
2. Create `page.tsx` component
3. Fetch content via Medusa SDK or Strapi in server component
4. Use layout from `modules/layout/`

### Adding a New Component
1. Create in appropriate module's `components/` folder
2. Export from module `index.tsx`
3. Use Tailwind + `cn()` for styling
4. Use Medusa UI or Radix for accessible patterns

### Modifying Cart/Checkout
1. Cart logic: `src/lib/data/cart.ts` and Zustand store
2. Checkout flow: `modules/checkout/`
3. Test shipping regions in Medusa admin

### Adding Payment Methods
1. Map provider ID in `constants.tsx` `paymentInfoMap`
2. Add Stripe/PayPal specific handling in checkout
3. Test with Medusa payment methods setup

## Browser Support & Polyfills

- Node.js >= 20.9.0 required
- Uses ES2021+ JavaScript features
- No special polyfills needed for modern browsers

## Important Notes

- **Content Sourcing**: Strapi is the source of truth for pages, policies, and content; Medusa for products and orders
- **Currency**: USD only in MVP (see `constants.tsx` for multi-currency support patterns)
- **Regions**: Region-based routing via `[countryCode]` parameter; configure in Medusa
- **Image Optimization**: Cloudinary is preferred; Medusa S3 as fallback
- **Rate Limiting**: Upstash Redis used for rate limit checks; configured per endpoint as needed
