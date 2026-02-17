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
- **UI Components**: RetroUI (custom component library in `src/components/retroui/`)
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
npm run test-e2e        # Run all Playwright tests in parallel
npm run test:serial     # Run tests sequentially (--workers=1)

# Bundle analysis
npm run analyze         # Generate bundle size analysis
```

## Architecture & Code Structure

### Directory Layout

```
src/
├── app/                          # Next.js 14 app router
│   ├── api/                      # Server actions and API routes
│   │   └── strapi-revalidate/   # Webhook for Strapi content revalidation
│   └── [countryCode]/            # Dynamic country-based routing (region/locale)
│       ├── (checkout)/           # Route group: Checkout flow pages
│       └── (main)/               # Route group: Main store pages
│           ├── account/          # Uses parallel routes pattern
│           │   ├── @dashboard/   # Parallel slot: Logged-in user dashboard
│           │   └── @login/       # Parallel slot: Login form
│           ├── products/[handle]/ # Product detail pages
│           ├── collections/      # Collection listing and detail pages
│           ├── categories/[...category]/ # Category pages (catch-all)
│           └── [content-pages]/  # Static content (about, policies, etc.)
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
│   │   ├── categories.ts        # Category queries
│   │   ├── regions.ts           # Region/country data
│   │   ├── payment.ts           # Payment provider utilities
│   │   └── fulfillment.ts       # Shipping/fulfillment options
│   ├── hooks/                    # Custom React hooks
│   ├── util/                     # Utility functions (formatting, validation)
│   ├── store/                    # State management (Zustand)
│   ├── context/                  # React context providers
│   └── mdxPlugins/              # MDX processing plugins
│
├── styles/                       # Global styles
└── types/                        # TypeScript type definitions
    └── strapi.ts                # Strapi CMS response types
```

### Routing Architecture

**Next.js 14 Advanced Patterns:**
- **Dynamic Routes**: `[countryCode]` enables region-based routing (e.g., `/us`, `/uk`)
- **Route Groups**: `(main)` and `(checkout)` organize routes without affecting URL structure
- **Parallel Routes**: Account page uses `@dashboard` and `@login` slots to conditionally render based on auth state
- **Catch-All Routes**: Categories use `[...category]` for nested category hierarchies

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
| `src/lib/data/cookies.ts` | Cookie management utilities for cart and session |
| `src/lib/util/*.ts` | Formatting (money, prices), validation, URL handling, event composition |
| `src/types/strapi.ts` | TypeScript types for Strapi CMS responses |
| `eslint.config.mjs` | Flat config ESLint with React/TS/Hooks rules; test file overrides |
| `next.config.js` | Image optimization, remote pattern configuration for CDNs; runs `check-env-variables.js` at build |
| `check-env-variables.js` | Validates required environment variables at build time |
| `playwright.config.ts` | E2E test configuration with setup/teardown and dual project structure |

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
- **Target**: ES5 with modern lib features (DOM, ESNext)
- **Path Aliases**:
  - `@/*` → `src/`
  - `@lib/*` → `src/lib/`
  - `@modules/*` → `src/modules/`
  - `@pages/*` → `src/pages/`
  - `@/components/*` → `src/components/`

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

```bash
# Medusa Backend
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY     # Medusa public key
NEXT_PUBLIC_MEDUSA_BACKEND_URL         # Backend API URL (e.g., https://api.blackeyesartisan.shop)

# Strapi CMS
NEXT_PUBLIC_STRAPI_URL                 # Strapi CMS URL (e.g., https://cms.blackeyesartisan.shop)
NEXT_PUBLIC_STRAPI_READ_TOKEN          # Strapi read token (from Strapi admin)
STRAPI_WEBHOOK_REVALIDATION_SECRET     # Webhook auth secret (generate with crypto.randomBytes)

# Cloudinary (Image CDN)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME      # Cloudinary cloud name (default: dllzefagw)

# Legacy vars for Solace compatibility (optional - now point to Cloudinary)
NEXT_PUBLIC_CDN_SPACE_DOMAIN           # Points to res.cloudinary.com
NEXT_PUBLIC_SPACE_DOMAIN               # Points to res.cloudinary.com
NEXT_PUBLIC_SPACE_ENDPOINT             # Points to res.cloudinary.com

# Email (Resend)
RESEND_API_KEY                         # Email service API key
RESEND_AUDIENCE_ID                     # Email audience ID (optional)

# Upstash Redis (Rate Limiting & Cache)
UPSTASH_REDIS_REST_URL                 # Redis endpoint URL
UPSTASH_REDIS_REST_TOKEN               # Redis auth token

# Stripe (Payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY     # Stripe public key

# Site Configuration
NEXT_PUBLIC_BASE_URL                   # Site base URL (e.g., https://www.blackeyesartisan.shop)
NEXT_PUBLIC_DEMO_MODE                  # Enable/disable demo mode (boolean)
```

**Important Notes:**
- `NEXT_PUBLIC_*` variables are exposed to the browser
- `check-env-variables.js` validates required env vars at build time
- For testing, set `NEXT_PUBLIC_BASE_URL` to match your local dev server (e.g., `http://localhost:8000`)

## Testing

### Playwright E2E Testing
- **Framework**: Playwright (`playwright.config.ts`)
- **Test Files**: `e2e/**/*.ts` or `**/*.spec.ts`/`**/*.test.ts`
- **Configuration**:
  - Two test projects: `chromium auth` (authenticated flows) and `chromium public` (public pages)
  - Setup/teardown pattern via `global/setup.ts`, `global/public-setup.ts`, and `global/teardown.ts`
  - Authenticated state stored in `playwright/.auth/user.json`
  - Tests run with single worker (`workers: 1`) to avoid conflicts
  - Base URL from `NEXT_PUBLIC_BASE_URL` environment variable
- **Running Tests**:
  - `npm run test-e2e` - Runs all tests with setup/teardown
  - `npm run test:serial` - Runs tests sequentially (same as default)
  - HTML reports generated in `/playwright-report`
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

### Adding a New Static Page
1. Create route: `src/app/[countryCode]/(main)/[page-name]/page.tsx`
2. Fetch content from Strapi using `fetchStrapiContent()` from `lib/data/fetch.ts`
3. Add ISR tag for cache invalidation: `next: { tags: ['page-name'] }`
4. Use server component pattern (default)
5. Configure corresponding Strapi content type if needed

### Adding a New Product-Related Page
1. Create route under appropriate section (categories, collections, products)
2. Use Medusa SDK from `lib/config.ts` for data fetching
3. Import data functions from `lib/data/products.ts`, `lib/data/collections.ts`, etc.
4. Follow existing patterns in similar pages

### Adding a New Component
1. Create in appropriate module's `components/` folder
2. Follow naming convention: `[feature]-component/index.tsx`
3. Export from module `index.tsx` for clean imports
4. Use Tailwind + `cn()` utility for class merging
5. **ALWAYS use RetroUI components** from `src/components/retroui/` (Button, Card, Input, Select, Dialog, Badge, Text, Label, Accordion, Alert, Drawer, Loader, Radio, Carousel, Textarea, Switch, Checkbox, Progress, Tabs, Menu, Breadcrumb). Never use raw HTML elements (button, input, select, etc.) or other UI libraries when a RetroUI equivalent exists.
6. Mark as `'use client'` only if needed (interactivity, hooks)

### Modifying Cart/Checkout Flow
1. **Cart State**: Zustand store in `src/lib/store/`
2. **Cart Operations**: Functions in `src/lib/data/cart.ts`
3. **UI Components**: `modules/cart/` and `modules/checkout/`
4. **Checkout Pages**: `src/app/[countryCode]/(checkout)/checkout/`
5. Test with different regions and shipping options in Medusa admin

### Adding Payment Methods
1. Configure payment provider in Medusa backend
2. Map provider ID in `constants.tsx` `paymentInfoMap`:
   ```tsx
   'pp_[provider]_[id]': { title: 'Display Name', icon: null }
   ```
3. Add provider-specific handling in checkout components if needed
4. Test checkout flow with new payment method

### Adding Filter Options
1. Define filter key in `FILTER_KEYS` constant (`constants.tsx`)
2. Add filter logic in product listing components
3. Update URL query parameters for filter persistence
4. Test with category/collection pages

### Updating Strapi Content
1. Make changes in Strapi admin
2. Strapi webhook automatically triggers revalidation at `/api/strapi-revalidate`
3. Next.js revalidates pages with matching ISR tags
4. Changes appear on storefront without rebuild

### Debugging
- **Dev Server**: Check terminal for build errors and warnings
- **Client Errors**: Use browser DevTools console
- **API Errors**: Check Network tab for failed Medusa/Strapi requests
- **Build Issues**: Run `npm run build` to catch production-only errors
- **Test Failures**: Check `playwright-report/index.html` for E2E test details

## Prerequisites & Requirements

### Node.js & Package Manager
- **Node.js**: >= 20.9.0 (specified in package.json engines)
- **npm**: >= 10.0.0
- **Target**: ES5 output with modern lib features (DOM, ESNext)

### Browser Support
- Modern browsers supporting ES2021+ features
- No special polyfills required
- React 18.3.1+ (Next.js 16.1.1 includes React)

### Build Validation
- `check-env-variables.js` runs at build time to validate required env vars
- Only validates `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` as strictly required
- Build will fail if required variables are missing

## Important Architecture Decisions

### Data Sources & Responsibilities
- **Strapi CMS**: Source of truth for static content (pages, policies, blog posts, FAQs, homepage content, global settings)
- **Medusa Backend**: Source of truth for commerce data (products, inventory, cart, checkout, orders, regions, shipping)
- **Storefront**: Reads from both via SDK (Medusa) and direct fetch (Strapi); no write operations to CMS

### Key Business Logic
- **Region-Based Routing**: All routes under `[countryCode]` dynamic segment for multi-region support
- **Currency**: USD only in MVP; multi-currency patterns exist in `constants.tsx` via `noDivisionCurrencies`
- **ISR Cache Invalidation**: Strapi webhooks trigger Next.js revalidation via `/api/strapi-revalidate` endpoint
- **Image Strategy**: Cloudinary primary CDN, Medusa S3 fallback, legacy `SPACE_DOMAIN` support for backward compatibility
- **Payment Providers**: Mapped via `paymentInfoMap` in `constants.tsx` - supports Stripe (cards, BLIK, Przelewy24, iDeal, Bancontact), PayPal, and Manual Payment
- **Rate Limiting**: Upstash Redis for API protection; configured per-endpoint as needed
- **Filter Architecture**: Product filters defined in `FILTER_KEYS` constant; supports order_by, price, material, type, collection

### Performance Optimizations
- **Turbopack**: Development server uses Turbopack for faster builds
- **Image Optimization**: Next.js Image component with remotePatterns for CDN optimization
- **Server Components**: Default pattern for all pages; client components marked explicitly
- **MDX Processing**: Custom plugins in `lib/mdxPlugins/` for blog and content pages
