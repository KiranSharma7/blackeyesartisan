# Implementation Plan: MVP B2C Storefront

**Branch**: `001-mvp-storefront` | **Date**: 2026-01-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-mvp-storefront/spec.md`

## Summary

Build a B2C ecommerce storefront for BlackEyesArtisan handmade glass pipes with age gate verification, international checkout (FedEx), sold-out portfolio display, and newsletter signup. The storefront uses Next.js 14 (App Router) deployed on Vercel, consuming commerce data from Medusa 2.0 and content from Strapi CMS (both on Contabo VPS).

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), Node.js 20.x LTS
**Primary Dependencies**: Next.js 14 (App Router), Medusa JS Client, Tailwind CSS, Iconify (Solar icons)
**Storage**: PostgreSQL (Medusa/Strapi on VPS), Redis (Upstash for sessions/cache), Cookies (age gate TTL)
**Testing**: Vitest for unit tests, Playwright MCP for E2E testing (dev + production)
**Target Platform**: Web (SSR/SSG on Vercel), Mobile-responsive
**Project Type**: Turborepo monorepo (storefront + backend services)
**Performance Goals**: <3s page load, <1s age gate appearance, 60fps interactions
**Constraints**: USD only, single flat-rate international shipping, phone mandatory for FedEx
**Scale/Scope**: Small catalog (<100 products), international customers, drop-based sales model

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Implementation Notes |
|-----------|--------|---------------------|
| I. Data Source Integrity | ✅ PASS | Storefront reads from Medusa APIs (products, cart, orders) and Strapi APIs (pages, settings). No local commerce data storage. |
| II. Business Rules Enforcement | ✅ PASS | Age gate with cookie TTL + checkout re-verify. SOLD badge on zero inventory. Phone required in checkout form. USD-only pricing. |
| III. API-First Integration | ✅ PASS | All communication via Medusa REST/Store API and Strapi REST API. Environment variables for endpoints. No direct DB access. |
| IV. Progressive Enhancement | ✅ PASS | SSR for product/collection pages, SSG for policies. Age gate works server-side. Cart/checkout requires JS with clear messaging. |
| V. Deployment Isolation | ✅ PASS | Vercel (storefront) independent from VPS (Medusa/Strapi). Health checks via API endpoints. Env-based configuration. |

**Technology Constraints Compliance:**
- ✅ Next.js 14 (App Router)
- ✅ TypeScript (strict mode)
- ✅ Tailwind CSS
- ✅ Medusa 2.0 backend
- ✅ Strapi CMS
- ✅ Cloudinary (images)
- ✅ Resend (emails)
- ✅ Playwright (E2E testing)

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

### Source Code (repository root)

```text
# Turborepo Monorepo Structure
.
├── apps/
│   └── storefront/                 # Next.js 14 storefront (Vercel)
│       ├── app/
│       │   ├── (shop)/             # Main shopping routes
│       │   │   ├── page.tsx        # Homepage
│       │   │   ├── collections/
│       │   │   │   ├── page.tsx    # All collections
│       │   │   │   └── [handle]/
│       │   │   │       └── page.tsx
│       │   │   ├── products/
│       │   │   │   └── [handle]/
│       │   │   │       └── page.tsx
│       │   │   ├── cart/
│       │   │   │   └── page.tsx
│       │   │   └── checkout/
│       │   │       └── page.tsx
│       │   ├── (content)/          # CMS content routes
│       │   │   ├── about/
│       │   │   │   └── page.tsx
│       │   │   └── policies/
│       │   │       └── [slug]/
│       │   │           └── page.tsx
│       │   ├── api/                # API routes
│       │   │   ├── newsletter/
│       │   │   │   └── route.ts
│       │   │   └── revalidate/
│       │   │       └── route.ts
│       │   ├── layout.tsx          # Root layout with age gate
│       │   ├── not-found.tsx
│       │   └── error.tsx
│       ├── components/
│       │   ├── age-gate/
│       │   ├── cart/
│       │   ├── checkout/
│       │   ├── collections/
│       │   ├── common/
│       │   ├── layout/
│       │   ├── newsletter/
│       │   └── products/
│       ├── lib/
│       │   ├── medusa/             # Medusa client & utilities
│       │   ├── strapi/             # Strapi client & utilities
│       │   ├── cookies/            # Age gate cookie management
│       │   └── utils/
│       ├── styles/
│       │   └── globals.css
│       ├── public/
│       ├── next.config.js
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── ui/                         # Shared UI components (design system)
│   │   ├── src/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── input.tsx
│   │   │   └── index.ts
│   │   ├── tailwind.config.ts      # Design system tokens
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── config-tailwind/            # Shared Tailwind config
│   └── config-typescript/          # Shared TypeScript config
│
├── backend/                        # VPS deployment artifacts
│   ├── medusa/                     # Medusa 2.0 configuration
│   │   └── medusa-config.ts
│   ├── strapi/                     # Strapi configuration
│   └── nginx/                      # Nginx reverse proxy configs
│
├── tests/
│   ├── e2e/                        # Playwright E2E tests
│   │   ├── age-gate.spec.ts
│   │   ├── purchase-flow.spec.ts
│   │   ├── sold-out-display.spec.ts
│   │   └── newsletter.spec.ts
│   └── playwright.config.ts
│
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
└── .env.example
```

**Structure Decision**: Turborepo monorepo with apps/storefront (Next.js on Vercel) and packages/ui (shared design system components). Backend services (Medusa/Strapi) are deployed separately on VPS with configuration managed in backend/ directory.

## Complexity Tracking

> No constitution violations. Implementation follows all five core principles.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Implementation Phases

### Phase 0: Research (Complete)
See [research.md](./research.md) for:
- Medusa 2.0 Store API patterns
- Strapi 4.x REST API integration
- Next.js 14 App Router best practices
- Age gate implementation strategies
- Resend email integration

### Phase 1: Design (Complete)
See:
- [data-model.md](./data-model.md) - Entity relationships and state management
- [contracts/](./contracts/) - API contracts between systems
- [quickstart.md](./quickstart.md) - Development setup guide

### Phase 2: Tasks (Pending)
Run `/speckit.tasks` to generate actionable task list from this plan.

## Testing Strategy

**Development Testing Workflow:**
1. Develop feature locally
2. Run unit tests (Vitest)
3. Test with Playwright MCP locally
4. Deploy to Vercel preview
5. Test production with Playwright MCP
6. Merge to main for production deploy

**E2E Test Coverage:**
- Age gate flow (new visitor, verified visitor, TTL expiry)
- Complete purchase journey (browse → cart → checkout → confirmation)
- Sold-out product display (badge, disabled cart, newsletter CTA)
- Newsletter signup (footer form, sold-out product form)
- International checkout (address validation, phone required)

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State Management | React Context + Medusa Cart | Medusa handles cart persistence; context for UI state only |
| Image Optimization | Cloudinary + next/image | Cloudinary for transformations, Next.js for responsive loading |
| Age Gate Storage | HTTP-only cookie with TTL | Secure, server-readable, configurable via Strapi |
| Newsletter Backend | Resend Lists API | Same service as transactional email, unified management |
| Styling Approach | Tailwind + Design System Tokens | Matches design-system.md exactly, utility-first |
| Monorepo Tool | Turborepo + pnpm | Fast builds, workspace support, Vercel-native |
