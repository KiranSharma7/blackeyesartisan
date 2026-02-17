# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Project**: BlackEyesArtisan - handcrafted artisan eCommerce storefront
**Repository Type**: Monorepo with three independent services
**Stack**:
- **Storefront**: Next.js 14 (Vercel)
- **Backend**: Medusa 2.0 (Contabo VPS, port 9000)
- **CMS**: Strapi 5.0.1 (Contabo VPS, port 1337)

### Key Business Rules
- **Age gate**: Mandatory 18+ verification at entry (persisted with TTL; re-checked at checkout)
- **Currency**: USD only (MVP)
- **Inventory**: Sold-out items remain visible with SOLD badge; add-to-cart disabled
- **International checkout**: Full support with mandatory phone number (FedEx requirement)
- **Email**: Resend for transactional emails (order confirmation, tracking updates)
- **Taxes**: Manual approach in MVP; duties/taxes disclaimer visible in checkout and policies

### Data Sources of Truth
- **Medusa** (all eCommerce): Products, collections, featured/hero picks, inventory, pricing, cart, checkout, orders, regions, shipping, payments, customers — any commerce-related selection or curation (e.g. which products appear as hero peek cards) is managed via Medusa collections/admin, NOT Strapi
- **Strapi** (all content): Pages, policies, blog posts, FAQs, global settings (age gate TTL, handling times, announcement bar), banner slides, SEO metadata — purely editorial/content, never product data
- **Storefront**: Reads commerce data from Medusa + content from Strapi via APIs; never the source of truth for either

---

## Development Commands

### Storefront (Next.js 14)
```bash
npm run dev              # Start dev server (port 8000, Turbopack)
npm run build            # Production build
npm start                # Run production server
npm run lint             # Run ESLint
npm run format:write     # Auto-fix code formatting (Prettier)
npm run format           # Check formatting
npm run analyze          # Bundle size analysis
npm run test-e2e         # Run Playwright E2E tests (parallel)
npm run test:serial      # Run E2E tests serially (single worker)
```

### API (Medusa 2.0)
```bash
yarn dev                 # Development with auto-reload
yarn build               # Production build
yarn start               # Start server (port 9000)
yarn seed                # Seed database with sample data
yarn add:admin           # Create admin user
yarn test:unit           # Unit tests
yarn test:integration:modules  # Integration tests
yarn db:init             # Migrate, sync links, and seed
yarn db:migrate          # Run migrations
yarn db:seed             # Run seed script
```

### CMS (Strapi 5.0.1)
```bash
npm run develop          # Development with auto-reload (port 1337)
npm run start            # Production mode
npm run build            # Build admin panel
npm run strapi           # Strapi CLI
```

---

## Architecture Overview

### Directory Structure
```
├── storefront/          # Next.js 14 storefront (Vercel)
│   ├── src/
│   │   ├── app/         # App Router with [countryCode] dynamic routing
│   │   ├── modules/     # Feature-organized components
│   │   ├── lib/         # SDK config, hooks, utilities, state (Zustand)
│   │   ├── types/       # TypeScript definitions
│   │   ├── styles/      # Tailwind CSS custom styles
│   │   └── e2e/         # Playwright E2E tests
│   ├── next.config.js   # Image optimization, remote patterns
│   ├── tailwind.config.js # Design system colors/fonts
│   └── playwright.config.ts
│
├── api/                 # Medusa 2.0 backend
│   ├── src/
│   │   ├── api/         # REST endpoints (admin/, store/)
│   │   ├── modules/     # Business logic (resend email module)
│   │   ├── workflows/   # Multi-step processes
│   │   ├── subscribers/ # Event handlers
│   │   └── scripts/     # Admin utilities (seed, add-admin)
│   └── medusa-config.ts # Core config
│
├── cms/                 # Strapi 5.0.1 CMS
│   ├── src/
│   │   ├── api/         # REST collections (homepage, blog, etc.)
│   │   ├── components/  # Reusable content blocks
│   │   └── extensions/  # Strapi customizations
│   └── config/
│       ├── database.ts  # DB connection (SQLite/MySQL/PostgreSQL)
│       └── server.ts    # Port, host config
│
├── docs/                # Documentation (design-system.md, prd.md)
├── specs/               # Specifications and task tracking
└── CLAUDE.md            # This file
```

### Tech Stack Summary
| Component | Framework | Language | Version |
|-----------|-----------|----------|---------|
| Storefront | Next.js | TypeScript | 14 (Turbopack) |
| API | Medusa | TypeScript | 2.0 |
| CMS | Strapi | TypeScript | 5.0.1 |
| Styling | Tailwind CSS | CSS | 3.4.17 |
| State Mgmt | Zustand | JavaScript | 5.0.2 |
| Testing (E2E) | Playwright | JavaScript | 1.51.1 |
| Testing (Unit/Integration) | Jest | JavaScript | 29.7.0 |

### Service Interaction
```
Browser → Vercel Storefront (Next.js)
         ↓ (Medusa SDK calls)
         Medusa Backend (port 9000)
         ↓ (Events)
         Resend Email, S3 Storage

         ↓ (API calls)
         Strapi CMS (port 1337)
         ↓ (Webhooks)
         Next.js ISR revalidation
```

---

## Development Workflow

### Local Development Setup

**Prerequisites**:
- Node.js 20.9.0+ (Storefront), 20+ (API), 18-20 (CMS)
- PostgreSQL 12+ (or use SQLite for dev)
- Yarn 3.2.3 (API only)

**First-time setup**:
```bash
# Storefront
cd storefront
npm install
cp .env.example .env.local

# API
cd ../api
yarn install
cp .env.example .env.local
yarn db:init  # Initialize database

# CMS
cd ../cms
npm install
cp .env.example .env.local
npm run develop
```

**Running all services**:
```bash
# Terminal 1: API
cd api && yarn dev

# Terminal 2: CMS
cd cms && npm run develop

# Terminal 3: Storefront
cd storefront && npm run dev
```

Services will be available at:
- **Storefront**: http://localhost:8000
- **Medusa API**: http://localhost:9000
- **Medusa Admin**: http://localhost:9000/admin
- **Strapi CMS**: http://localhost:1337
- **Strapi Admin**: http://localhost:1337/admin

### Environment Variables

**Storefront** (.env.local):
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` - Medusa API endpoint
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` - SDK public key
- `NEXT_PUBLIC_STRAPI_URL` - Strapi CMS endpoint
- `NEXT_PUBLIC_STRAPI_READ_TOKEN` - CMS auth token
- `NEXT_PUBLIC_BASE_URL` - Storefront URL
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Image CDN

**API** (.env.local):
- `DATABASE_URL` - PostgreSQL connection string
- `MEDUSA_BACKEND_URL` - Public API URL
- `RESEND_API_KEY` - Email provider
- `DO_SPACE_*` - AWS S3 credentials for file storage

**CMS** (.env.local):
- `DATABASE_URL` or `DATABASE_HOST/PORT/NAME` - DB connection
- `APP_KEYS` - App key rotation
- `JWT_SECRET`, `ADMIN_JWT_SECRET` - Auth tokens
- `DO_SPACE_*` - File storage credentials

---

## Code Organization

### Storefront Module Structure
Each feature in `/src/modules` follows this pattern:
- `components/` - React components
- `hooks/` - Custom hooks
- `actions/` - Server actions
- `layout.tsx` - Module layout
- `page.tsx` - Module page
- Dynamic routes: `[slug]/page.tsx`

### API Service Layers
- **api/admin/** - Admin-only REST endpoints
- **api/store/** - Customer-facing REST endpoints
- **modules/** - Business logic and custom modules
- **workflows/** - Orchestrated multi-step processes
- **subscribers/** - Event-driven handlers
- **scripts/** - Admin utilities

### CMS Collections
- **api/homepage/** - Homepage content
- **api/collection/** - Product collections
- **api/blog-post/** - Blog articles
- **api/faq/**, **privacy-policy/**, etc. - Static pages

---

## Testing

### Storefront (Playwright E2E)
```bash
npm run test-e2e     # Parallel execution (default)
npm run test:serial  # Serial execution (single worker)
```
- Tests in `/e2e` directory
- Setup/teardown for authenticated flows
- HTML reports generated in `/playwright-report`
- Configure in `playwright.config.ts`

### API (Jest Unit & Integration)
```bash
yarn test:unit                      # Unit tests only
yarn test:integration:modules       # Module integration tests
yarn test:integration:http          # HTTP endpoint tests
```
- Unit tests: `src/**/__tests__/**/*.unit.spec.ts`
- Integration tests: `integration-tests/` directories
- Configure in `jest.config.js`

---

## Code Style & Conventions

### TypeScript Configuration
- **Strict mode**: Disabled (loose checking for flexibility)
- **Path aliases** (Storefront): `@lib`, `@modules`, `@pages`
- **Decorators**: Enabled (required for Medusa/Strapi)

### Formatting & Linting
- **Prettier**: Code formatting (import sort plugin)
  ```bash
  npm run format:write   # Auto-fix
  npm run format        # Check only
  ```
- **ESLint**: Code quality (Storefront only)
  ```bash
  npm run lint
  ```

### Component Patterns
- **Storefront**: React functional components + hooks. **ALWAYS use RetroUI components** from `storefront/src/components/retroui/` (Button, Card, Input, Select, Dialog, Badge, Text, Label, Accordion, Alert, Drawer, Loader, Radio, Carousel, Textarea, Switch, Checkbox, Progress, Tabs, Menu, Breadcrumb, Sonner). Never use raw HTML elements or other UI libraries when a RetroUI equivalent exists.
- **API**: TypeORM entities with decorators
- **CMS**: Strapi REST collections with custom components

### State Management
- **Storefront**: Zustand for client-side state
- **API**: Dependency injection (Medusa built-in)
- **CMS**: REST API state management

---

## Deployment Architecture

### DNS & Domain
**Primary Domain**: blackeyesartisan.shop
- Subdomains:
  - `www.blackeyesartisan.shop` → Vercel (storefront)
  - `api.blackeyesartisan.shop` → VPS Nginx → Medusa (port 9000)
  - `cms.blackeyesartisan.shop` → VPS Nginx → Strapi (port 1337)

### Vercel (Storefront)
- Deployed manually via Vercel CLI (`vercel` or `vercel --prod`), NOT auto-deployed from GitHub
- Environment variables configured in Vercel dashboard
- Required vars: `NEXT_PUBLIC_MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_STRAPI_URL`, `NEXT_PUBLIC_STRAPI_READ_TOKEN`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, `NEXT_PUBLIC_BASE_URL`, `STRAPI_WEBHOOK_REVALIDATION_SECRET`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

### Contabo VPS (Backend Services)
- **IP**: 95.111.239.92
- **Services**: Medusa (9000), Strapi (1337), PostgreSQL (5432)
- **Nginx**: Reverse proxy with SSL for api.* and cms.* subdomains
- **PM2**: Process manager for service orchestration

### Deployment Flow
1. **Storefront**: vercel cLI → Vercel auto-deploys
2. **Backend**: SSH to VPS → Deploy code → Restart PM2 services
3. **DNS**: A records point to VPS IP for api/cms subdomains

---

## External Services & Integrations

### Email (Resend)
- Transactional emails: order confirmations, tracking updates
- Medusa custom notification module: `/api/src/modules/resend`
- API Key in `.env`

### File Storage (AWS S3 / DigitalOcean Spaces)
- Product images (Medusa + Strapi)
- Configuration in medusa-config.ts and strapi config
- Credentials: `DO_SPACE_*` environment variables

### Image CDN (Cloudinary)
- Image optimization and delivery
- Configured in Next.js for all remote images
- Cloud Name: `dllzefagw`

### Rate Limiting & Caching (Upstash Redis)
- Redis cache for performance
- URL format: `redis://default:[password]@[endpoint]`

### Payments (Stripe - Optional)
- Medusa supports dynamic payment configuration
- Configured via Stripe API keys in environment

---

## Common Development Patterns

### Adding a New Feature
1. **Storefront**: Create module in `/src/modules/[feature-name]`
2. **API**: Create entity in `/api/src/modules/[feature-name]`
3. **CMS**: Create collection in `/cms/src/api/[feature-name]`
4. **Connect**: Wire APIs together using SDK (storefront → API → CMS)

### Database Changes (API)
1. Create migration: `yarn run typeorm migration:create`
2. Run migration: `yarn db:migrate`
3. Sync module links: `yarn db:sync-links`

### Adding Content Types (CMS)
1. Create collection in `/cms/src/api`
2. Define content components in `/cms/src/components`
3. Configure admin permissions in `/cms/config/admin.ts`
4. Expose API endpoint (automatic in Strapi)

### Testing a Feature
1. **E2E**: Add test in `/storefront/e2e`
2. **Unit**: Add test next to module code
3. **Integration**: Add test in `integration-tests/` directory

---

## Important Notes

- **Credentials**: Stored in `.env` files (not in repo). See Production Credentials section below.
- **Database**: Development uses SQLite (auto-created), production uses PostgreSQL
- **Admin Users**: Create via `yarn add:admin` (API) or Strapi UI
- **Database Seeding**: `yarn seed` populates initial product/region data
- **Webhook Revalidation**: Strapi changes trigger Next.js ISR via webhook secret

---

## Production Credentials

### Contabo VPS (Production Server)
```
IP Address: 95.111.239.92
Username: root
Password: 19m6tJW9F5du5Lo
SSH: ssh root@95.111.239.92
```

### Upstash Redis
```
Endpoint: singular-mule-46745.upstash.io:6379
URL: redis://default:AbaZAAIncDE2NjJmNDQyNDViZDA0M2U4YTM3YzY0NGQ2ZDMyYjViMnAxNDY3NDU@singular-mule-46745.upstash.io:6379
CLI: redis-cli --tls -u redis://default:AbaZAAIncDE2NjJmNDQyNDViZDA0M2U4YTM3YzY0NGQ2ZDMyYjViMnAxNDY3NDU@singular-mule-46745.upstash.io:6379
```

### Cloudinary
```
Cloud Name: dllzefagw
API Key: 876936695179845
API Secret: iEYpye-9ptjclcN4cZNKzyePo74
URL: cloudinary://876936695179845:iEYpye-9ptjclcN4cZNKzyePo74@dllzefagw
```

### Resend
```
API Key: re_dU5PsXha_7Voxe2AEwFz2jixeyJSryv45
```


Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.