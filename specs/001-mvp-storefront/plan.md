# Implementation Plan: MVP B2C Storefront

**Branch**: `001-mvp-storefront` | **Date**: 2026-01-30 | **Spec**: [spec.md](./spec.md)
**Base Templates**:
- Storefront: [Solace Medusa Starter](https://github.com/rigby-sh/solace-medusa-starter) (Next.js 14, fork with customizations)
- Backend API: [solace-medusa-starter-api](https://github.com/rigby-sh/solace-medusa-starter-api) (Medusa 2.0, deploy to VPS)
- CMS: [solace-medusa-starter-strapi](https://github.com/rigby-sh/solace-medusa-starter-strapi) (Strapi, deploy to VPS)

> ⚠️ **Note**: These repos haven't been updated in ~2 years. Phase 0.5 includes dependency audit and upgrade to current Medusa 2.0 / Next.js 14 APIs.

## Summary

Build a B2C ecommerce storefront for BlackEyesArtisan handmade glass pipes using three Solace starter templates:

| Component | Starter Repo | Deploy To |
|-----------|-------------|-----------|
| Storefront | solace-medusa-starter | Vercel (www.blackeyesartisan.shop) |
| Commerce API | solace-medusa-starter-api | VPS via SSH (api.blackeyesartisan.shop) |
| CMS | solace-medusa-starter-strapi | VPS via SSH (cms.blackeyesartisan.shop) |

Key customizations: age gate verification (legal compliance), sold-out portfolio display, custom design system (Black Eyes Artisan brand), and international checkout with FedEx requirements.

**Implementation approach**: Each task follows Code → Test Local (Playwright MCP) → Deploy → Test Production (Playwright MCP) workflow.

## Technical Context

**Base Template**: Solace Medusa Starter (Next.js 14, Medusa 2.0, Strapi CMS, Stripe)
**Language/Version**: TypeScript 5.x (strict mode), Node.js 20.x LTS
**Primary Dependencies**: Next.js 14 (App Router), Medusa JS Client, Tailwind CSS, Iconify (Solar icons)
**Storage**: PostgreSQL (Medusa/Strapi on VPS), Redis (Upstash for sessions/cache), Cookies (age gate TTL)
**Testing**: Vitest for unit tests, Playwright MCP for E2E testing (integrated with Claude Code for local + production validation)
**Deployment**: Vercel CLI (storefront), SSH + PM2 (backend services on VPS)
**Target Platform**: Web (SSR/SSG on Vercel), Mobile-responsive
**Project Type**: Next.js standalone (forked from Solace Starter)
**Performance Goals**: <3s page load, <1s age gate appearance, 60fps interactions
**Constraints**: USD only, single flat-rate international shipping, phone mandatory for FedEx
**Scale/Scope**: Small catalog (<100 products), international customers, drop-based sales model

**Design System**: All UI/UX work MUST follow `/docs/design-system.md`:
- Colors: ink (#18181B), paper (#FEF8E7), acid (#D63D42), stone (#E8DCCA), sun (#FCCA46)
- Fonts: Dela Gothic One (display), Space Grotesk (body)
- Hard shadows (no blur): shadow-hard, shadow-hard-sm, shadow-hard-xl
- 2px borders, uppercase display text, warm paper backgrounds

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Implementation Notes |
|-----------|--------|---------------------|
| I. Data Source Integrity | ✅ PASS | Solace already uses Medusa APIs for products/cart/orders and Strapi APIs for content. No changes needed. |
| II. Business Rules Enforcement | ✅ PASS | Age gate via Next.js middleware (edge-level). SOLD badge on zero inventory. Phone required in checkout (extend Solace form). USD-only (Solace default). |
| III. API-First Integration | ✅ PASS | Solace uses Medusa REST/Store API and Strapi REST API. Environment variables for endpoints. No direct DB access. |
| IV. Progressive Enhancement | ✅ PASS | Solace uses SSR for product/collection pages. Age gate middleware works server-side (no JS required for blocking). Cart/checkout requires JS (Solace default). |
| V. Deployment Isolation | ✅ PASS | Vercel (storefront) independent from VPS (Medusa/Strapi). Solace already supports this architecture. |

**Technology Constraints Compliance:**
- ✅ Next.js 14 (App Router) - Solace default
- ✅ TypeScript (strict mode) - Solace default
- ✅ Tailwind CSS - Solace default (needs design system customization)
- ✅ Medusa 2.0 backend - Solace default
- ✅ Strapi CMS - Solace default
- ✅ Cloudinary (images) - Replace DigitalOcean Spaces config
- ✅ Resend (emails) - Add to Solace
- ✅ Stripe (payments) - Solace default
- ✅ Playwright (E2E testing) - Add to project

## Project Structure

### Documentation (this feature)

```text
specs/001-mvp-storefront/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API contracts)
│   ├── medusa-store-api.md
│   ├── strapi-content-api.md
│   └── newsletter-api.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (Solace Starter Fork)

```text
# Solace Medusa Starter Structure (forked)
.
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (main)/                   # Main layout group (Solace default)
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── products/
│   │   │   │   └── [handle]/
│   │   │   │       └── page.tsx
│   │   │   ├── collections/
│   │   │   │   └── [handle]/
│   │   │   │       └── page.tsx
│   │   │   ├── cart/
│   │   │   │   └── page.tsx
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx
│   │   │   ├── account/              # User accounts (Solace)
│   │   │   ├── search/               # Product search (Solace)
│   │   │   └── blog/                 # Blog (Solace + Strapi)
│   │   ├── (content)/                # CMS content routes
│   │   │   ├── about/
│   │   │   └── policies/
│   │   │       └── [slug]/
│   │   ├── age-gate/                 # NEW: Age verification page
│   │   │   ├── page.tsx
│   │   │   └── exit/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── newsletter/           # NEW: Newsletter API (Resend)
│   │   │   │   └── route.ts
│   │   │   └── strapi-revalidate/    # Solace default (webhook)
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   └── middleware.ts             # NEW: Age gate middleware
│   │
│   ├── components/
│   │   ├── age-gate/                 # NEW: Age gate components
│   │   │   ├── AgeGateModal.tsx
│   │   │   └── ExitPage.tsx
│   │   ├── products/
│   │   │   ├── ProductCard.tsx       # MODIFY: Add SOLD badge
│   │   │   └── ProductDetail.tsx     # MODIFY: Add NotifyMe form
│   │   ├── newsletter/               # NEW: Newsletter components
│   │   │   ├── NewsletterForm.tsx
│   │   │   └── NotifyMeForm.tsx
│   │   ├── checkout/
│   │   │   └── ShippingForm.tsx      # MODIFY: Phone required, duties disclaimer
│   │   ├── layout/
│   │   │   ├── Header.tsx            # MODIFY: Design system
│   │   │   ├── Footer.tsx            # MODIFY: Design system + newsletter
│   │   │   └── AnnouncementBar.tsx   # MODIFY: Design system
│   │   └── ui/                       # Solace UI components (redesign)
│   │
│   ├── lib/
│   │   ├── medusa/                   # Solace Medusa utilities
│   │   ├── strapi/                   # Solace Strapi utilities
│   │   ├── cookies/                  # NEW: Age gate cookie management
│   │   │   └── age-verification.ts
│   │   └── resend/                   # NEW: Resend email client
│   │       └── client.ts
│   │
│   └── styles/
│       └── globals.css               # MODIFY: Design system tokens
│
├── public/
├── tailwind.config.ts                # MODIFY: Design system colors/shadows
├── next.config.js
├── middleware.ts                     # NEW: Age gate middleware (root level)
├── .env.example                      # MODIFY: Add Cloudinary, Resend vars
└── package.json
```

**Structure Decision**: Fork Solace Medusa Starter rather than building from scratch. This provides working implementations of: user accounts, order history, product search, checkout with Stripe, Strapi integration, dark/light theming, and responsive design. Customizations focus on: age gate, design system, sold-out display, newsletter, and international checkout requirements.

## What Solace Provides (No Implementation Needed)

These features are already implemented in Solace Starter:

| Feature | Solace Implementation | Our Action |
|---------|----------------------|------------|
| User Registration/Login | Full auth flow with Medusa | Keep as-is |
| Order History | Account page with orders | Keep as-is |
| Profile Settings | Address management, password reset | Keep as-is |
| Product Search | Keyword search with filters | Keep as-is |
| Promo Codes | Checkout discount application | Keep as-is |
| Blog | Strapi integration | Keep as-is |
| Dark/Light Theme | CSS variables + toggle | Keep theming, apply design system |
| Cart Management | Full cart CRUD | Keep as-is |
| Checkout Flow | 3-step with Stripe | Extend for phone requirement |
| Strapi Revalidation | Webhook endpoint | Keep as-is |
| Product Grid/Cards | Collection and PDP | Restyle with design system |
| Responsive Design | Mobile-first | Keep structure, restyle |

## What We Need to Build (Custom Development)

| Feature | Why Not in Solace | Complexity |
|---------|------------------|------------|
| Age Gate Middleware | Legal compliance for tobacco accessories | Medium |
| Age Gate UI | Custom modal/exit page | Low |
| SOLD Badge | Portfolio display requirement | Low |
| NotifyMe Form | Lead capture on sold-out items | Low |
| Newsletter API | Resend Audiences integration | Medium |
| Footer Newsletter | Email capture | Low |
| Phone Validation | FedEx requirement | Low |
| Duties Disclaimer | International checkout | Low |
| Design System | Brand customization | High |
| Cloudinary Config | Replace DO Spaces | Low |
| Strapi Age Gate Fields | CMS configuration | Low |

## Complexity Tracking

> No constitution violations. Implementation follows all five core principles.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Implementation Phases

### Phase 0: Research (Complete)
See [research.md](./research.md) for:
- Solace Medusa Starter architecture analysis
- Next.js middleware patterns for age gate
- Medusa 2.0 Store API (Solace patterns)
- Strapi 4.x REST API (Solace patterns)
- Resend Audiences API for newsletter
- Cloudinary Next.js integration

### Phase 0.5: Starter Audit & Upgrade (Required)

**Purpose**: The Solace starter repos haven't been updated in ~2 years. Before implementation, audit and upgrade dependencies.

**Repos to Audit**:
1. `solace-medusa-starter` (storefront) - Check Next.js 14 App Router compatibility
2. `solace-medusa-starter-api` (Medusa) - Verify Medusa 2.0 API compatibility
3. `solace-medusa-starter-strapi` (CMS) - Check Strapi 4.x/5.x compatibility

**Audit Checklist**:
- [ ] Clone all three repos locally
- [ ] Run `pnpm outdated` to identify stale dependencies
- [ ] Check for breaking changes in Medusa 2.0 migration guide
- [ ] Verify Next.js 14 App Router patterns match current best practices
- [ ] Test build succeeds with dependency upgrades
- [ ] Document required code changes for compatibility

**Decision Gate**: If upgrade effort exceeds 2-3 days, consider building from scratch with Turborepo instead.

### Phase 1: Design (Complete)
See:
- [data-model.md](./data-model.md) - Entity relationships and state management
- [contracts/](./contracts/) - API contracts (newsletter, age gate settings)
- [quickstart.md](./quickstart.md) - Development setup guide (Solace fork)

### Phase 2: Tasks (Pending)
Run `/speckit.tasks` to generate actionable task list from this plan.

## Testing Strategy

**E2E Test Coverage:**
- Age gate flow (new visitor, verified visitor, TTL expiry)
- Complete purchase journey (browse → cart → checkout → confirmation)
- Sold-out product display (badge, disabled cart, newsletter CTA)
- Newsletter signup (footer form, sold-out product form)
- International checkout (address validation, phone required)
- User account flows (login, order history, profile)
- Product search
- Theme toggle

## Implementation Workflow (Per Task)

Every task follows this workflow: **Code → Test Local → Deploy → Test Production**

### Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         TASK IMPLEMENTATION FLOW                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   1. IMPLEMENT                                                          │
│      └─► Write code for task                                            │
│          └─► Commit to feature branch                                   │
│                                                                         │
│   2. TEST LOCAL (Playwright MCP)                                        │
│      └─► Run E2E tests against localhost:3000                           │
│          └─► If FAIL → Fix and repeat                                   │
│          └─► If PASS → Continue                                         │
│                                                                         │
│   3. DEPLOY                                                             │
│      ├─► Storefront: `vercel deploy --prod` (Vercel CLI)                │
│      └─► Backend/CMS: SSH to VPS → git pull → pm2 restart               │
│                                                                         │
│   4. TEST PRODUCTION (Playwright MCP)                                   │
│      └─► Run E2E tests against https://www.blackeyesartisan.shop        │
│          └─► If FAIL → Rollback, fix, redeploy                          │
│          └─► If PASS → Task complete ✅                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Deployment Targets

| Component | Platform | Deploy Method | URL |
|-----------|----------|---------------|-----|
| Storefront (Next.js) | Vercel | `vercel deploy --prod` | https://www.blackeyesartisan.shop |
| Medusa API | Contabo VPS | SSH → PM2 | https://api.blackeyesartisan.shop |
| Strapi CMS | Contabo VPS | SSH → PM2 | https://cms.blackeyesartisan.shop |

### Detailed Workflow Steps

#### Step 1: Implement Task
```bash
# Create/switch to feature branch
git checkout -b task/T001-setup-monorepo

# Implement the task code
# ... coding ...

# Commit changes
git add -A
git commit -m "T001: Initialize Turborepo monorepo"
```

#### Step 2: Test Local with Playwright MCP
```bash
# Start local dev server
pnpm dev

# Run Playwright tests via MCP (Claude Code integration)
# Tests run against http://localhost:3000
# Playwright MCP captures screenshots, validates UI, checks flows
```

**Playwright MCP Test Pattern:**
- Navigate to relevant pages
- Capture accessibility snapshots (`browser_snapshot`)
- Validate expected elements present
- Test user flows (click, fill forms, submit)
- Check console for errors (`browser_console_messages`)

#### Step 3: Deploy to Production

**Storefront (Vercel):**
```bash
# Deploy to production
vercel deploy --prod

# Or push to main for auto-deploy
git push origin main
```

**Backend Services (VPS via SSH):**
```bash
# SSH to VPS
ssh root@95.111.239.92

# Navigate to service directory
cd /var/www/medusa  # or /var/www/strapi

# Pull latest changes
git pull origin main

# Install dependencies if changed
pnpm install

# Build
pnpm build

# Restart service
pm2 restart medusa  # or strapi
```

#### Step 4: Test Production with Playwright MCP
```bash
# Run Playwright tests via MCP against production URLs
# Tests run against https://www.blackeyesartisan.shop
# Validates deployment successful and features work in production
```

**Production Test Checklist:**
- [ ] Site loads without errors
- [ ] Age gate appears for new visitors
- [ ] Products display correctly
- [ ] Cart operations work
- [ ] Checkout flow completes (test mode)
- [ ] CMS content displays

### Rollback Procedure

If production tests fail:

**Storefront (Vercel):**
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

**Backend (VPS):**
```bash
ssh root@95.111.239.92
cd /var/www/medusa

# Revert to previous commit
git revert HEAD
pnpm build
pm2 restart medusa
```

### Task Completion Criteria

A task is COMPLETE only when:
1. ✅ Code implemented and committed
2. ✅ Local Playwright MCP tests pass
3. ✅ Deployed to production (Vercel/VPS)
4. ✅ Production Playwright MCP tests pass
5. ✅ No console errors in production

### Phase-Specific Workflows

| Phase | Local Test Focus | Production Test Focus |
|-------|------------------|----------------------|
| Setup (1) | Build succeeds, dev server starts | N/A (no deploy yet) |
| Foundation (2) | API clients connect, providers work | API endpoints respond |
| User Stories (3-11) | Full E2E flows per story | Story acceptance criteria |
| Polish (12) | Error states, edge cases | Performance, SEO, 404s |

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Base Template | Solace Medusa Starter | 80% of features pre-built; matches tech stack |
| State Management | Solace defaults (Medusa Cart) | Already implemented and tested |
| Image Optimization | Cloudinary + next/image | Replace DO Spaces; better CDN for Nepal origin |
| Age Gate Storage | HTTP-only cookie with TTL | Secure, server-readable, configurable via Strapi |
| Age Gate Blocking | Next.js middleware | Edge-level blocking before any content renders |
| Newsletter Backend | Resend Audiences API | Same service as transactional email, unified management |
| Styling Approach | Tailwind + Custom Design System | Override Solace defaults with brand tokens |
| Design System Source | /docs/design-system.md | Bold, playful, Gen-Z friendly aesthetic |

## Design System Integration

All UI components MUST be restyled to match `/docs/design-system.md`:

**Priority Order:**
1. tailwind.config.ts - Add color tokens, font families, shadows
2. globals.css - Add custom CSS utilities (text-outline, etc.)
3. Layout components (Header, Footer, Nav)
4. Product components (Card, Grid, Detail)
5. Checkout components
6. Age gate components (new)
7. Newsletter components (new)

**Key Style Rules:**
- Primary background: paper (#FEF8E7)
- All borders: 2px solid ink (#18181B)
- Shadows: Hard shadows only (no blur)
- Display text: Dela Gothic One, uppercase
- Body text: Space Grotesk, medium weight
- CTAs: acid (#D63D42) background
- Hover effects: Shadow press or grow pattern
