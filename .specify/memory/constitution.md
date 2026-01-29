<!--
================================================================================
SYNC IMPACT REPORT
================================================================================
Version Change: N/A (initial) → 1.0.0
Modified Principles: None (initial creation)
Added Sections:
  - Core Principles (5 principles)
  - Technology Constraints
  - Development Workflow
  - Governance
Removed Sections: None
Templates Requiring Updates:
  - .specify/templates/plan-template.md ✅ (compatible - no changes needed)
  - .specify/templates/spec-template.md ✅ (compatible - no changes needed)
  - .specify/templates/tasks-template.md ✅ (compatible - no changes needed)
Follow-up TODOs: None
================================================================================
-->

# BlackEyesArtisan Constitution

## Core Principles

### I. Data Source Integrity

Medusa is the single source of truth for commerce data (products, inventory, cart, checkout, orders, regions, shipping). Strapi is the single source of truth for content (pages, policies, global settings). The storefront MUST NOT duplicate or cache this data in ways that create inconsistency.

- All product/inventory reads MUST originate from Medusa APIs
- All content/settings reads MUST originate from Strapi APIs
- Cart state MUST be managed through Medusa's cart/checkout flow
- No local database or persistent state for commerce data in the storefront

**Rationale**: Prevents data drift between systems and ensures customers always see accurate inventory and pricing.

### II. Business Rules Enforcement

Critical business rules MUST be enforced at the appropriate layer and never bypassed:

- **Age Gate**: Mandatory 18+ verification at site entry; MUST persist with TTL; MUST re-verify at checkout
- **Inventory Display**: Sold-out items remain visible with SOLD badge; add-to-cart MUST be disabled
- **International Checkout**: Phone number MUST be mandatory (FedEx shipping requirement)
- **Currency**: USD only in MVP; no multi-currency logic until explicitly scoped

**Rationale**: These rules exist for legal compliance (age gate), shipping logistics (phone), and brand presentation (portfolio display of sold items).

### III. API-First Integration

All integrations between storefront, Medusa, and Strapi MUST use their official APIs. Direct database access is prohibited from the storefront.

- Storefront communicates with Medusa via REST/GraphQL APIs
- Storefront communicates with Strapi via REST API
- Environment variables MUST configure all API endpoints
- API tokens MUST be stored securely and never committed to source control

**Rationale**: Maintains clean separation of concerns and allows backend services to be deployed/scaled independently.

### IV. Progressive Enhancement

The storefront MUST function with JavaScript disabled for core browsing (product viewing, navigation). Enhanced experiences (cart, checkout) may require JavaScript but MUST degrade gracefully with clear messaging.

- Server-side rendering (SSR) for all product and content pages
- Static generation (SSG) for policy pages and stable content
- Client-side hydration for interactive features only
- Clear error states when required functionality is unavailable

**Rationale**: Improves SEO, accessibility, and resilience while supporting the artisan brand's emphasis on craftsmanship.

### V. Deployment Isolation

Each deployment target (Vercel for storefront, VPS for backend services) MUST be independently deployable and testable.

- Storefront deployment MUST NOT require backend redeployment
- Backend changes MUST NOT break existing storefront functionality
- Environment-specific configuration via environment variables
- Health checks MUST be available for all services

**Rationale**: Enables rapid iteration on storefront without affecting order processing, and vice versa.

## Technology Constraints

Defines the approved technology stack. Additions require constitution amendment.

**Storefront**:
- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS for styling
- Deployed on Vercel

**Backend Services**:
- Medusa 2.0 for commerce
- Strapi for CMS
- PostgreSQL for persistence
- Redis (Upstash) for caching/sessions
- PM2 for process management
- Nginx for reverse proxy
- Deployed on Contabo VPS

**External Services**:
- Cloudinary for image optimization
- Resend for transactional email
- FedEx for shipping (manual label purchase in MVP)

**Testing**:
- Vitest or Jest for unit tests
- Playwright for E2E tests (optional, as-needed basis)

## Development Workflow

Defines required practices for all code changes.

### Code Quality Gates

1. **Type Safety**: All TypeScript code MUST pass strict type checking
2. **Linting**: ESLint MUST pass with zero errors before merge
3. **Build Verification**: `npm run build` MUST succeed before merge
4. **Environment Parity**: Development MUST use equivalent environment variables to production (with test values)

### Branching Strategy

- `main` branch is production-ready at all times
- Feature branches follow `[###-feature-name]` naming convention
- Pull requests require passing CI checks before merge

### Secrets Management

- Production credentials MUST NOT be committed to source control
- Environment variables MUST be used for all secrets
- CLAUDE.md credentials section is for development reference only; production uses secure env vars

## Governance

This constitution establishes non-negotiable standards for BlackEyesArtisan development.

### Amendment Process

1. Propose amendment with rationale in a pull request
2. Document impact on existing code/features
3. Update dependent templates if affected
4. Merge only after stakeholder approval

### Compliance

- All pull requests MUST verify compliance with Core Principles
- Architecture decisions MUST cite relevant principles
- Complexity beyond these standards MUST be justified in writing

### Version Policy

- **MAJOR**: Principle removal or redefinition that breaks existing patterns
- **MINOR**: New principle added or existing principle materially expanded
- **PATCH**: Clarifications, wording improvements, typo fixes

**Version**: 1.0.0 | **Ratified**: 2025-01-29 | **Last Amended**: 2025-01-29
