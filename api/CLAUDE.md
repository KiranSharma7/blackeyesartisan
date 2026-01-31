# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**BlackEyesArtisan Medusa Backend** - A Medusa 2.0 commerce platform providing product catalog, inventory, orders, and payment processing for the artisan eCommerce storefront.

**Stack**: Medusa 2.0 (commerce framework) + TypeScript + PostgreSQL + Resend (email) + DigitalOcean Spaces (file storage)

**Node Version**: >= 20 (enforce via package.json engines)

## Architecture & Structure

### High-Level Design

The backend follows a **modular, event-driven architecture**:

1. **Medusa Core Modules** - Commerce primitives (Product, Order, Inventory, Region, Shipping, Cart, Checkout)
2. **Custom API Routes** - Extended REST endpoints for search and filtering (`/store/search`, `/store/filter-product-attributes`)
3. **Notification Module** - Custom Resend email provider integrated into Medusa's notification system
4. **Event Subscribers** - Listen to domain events (order.placed, auth.password_reset) and trigger workflows
5. **Workflows** - Orchestrate multi-step processes (order confirmation email pipeline)
6. **Storage** - DigitalOcean Spaces (S3-compatible) for product images and files

### Directory Organization

```
src/
├── api/                      # Custom REST API routes
│   ├── admin/               # Admin-specific endpoints
│   ├── store/               # Customer-facing endpoints
│   │   ├── search/          # GET /store/search (product search with filters)
│   │   ├── filter-product-attributes/  # GET /store/filter-product-attributes
│   │   └── custom/          # Health checks
│   └── middlewares.ts       # Route validation & middleware setup
├── modules/
│   └── resend/              # Custom notification provider (email)
│       ├── index.ts         # Module registration with Medusa
│       ├── service.ts       # ResendNotificationProviderService implementation
│       └── types.ts         # TypeScript definitions
├── workflows/               # Event orchestration
│   └── send-order-confirmation-workflow.ts  # Order confirmation email flow
├── subscribers/             # Domain event handlers
│   ├── order-placed-handler.ts  # Trigger order confirmation on order.placed
│   ├── password-reset.ts        # Send password reset email
│   └── user-invited.ts          # Send admin invite email
├── scripts/
│   ├── seed.ts             # Initialize database with regions, products, channels
│   ├── add-admin.ts        # Create admin user CLI
│   └── enable-search-engine.ts  # Enable product indexing
├── utils/                  # Utility functions
│   ├── format-order.ts     # Order response formatting
│   └── functional.ts       # Helper utilities (isNil, isNotNil)
└── jobs/                   # Background job definitions (placeholder for future)
```

### Data Flow Examples

**Order Placement → Email Notification:**
```
POST /store/checkout → order created
  → order.placed event emitted
  → order-placed-handler subscriber triggered
  → sendOrderConfirmationWorkflow initiated
    → useQueryGraphStep fetches order details from Medusa
    → sendNotificationStep creates notification record
    → ResendNotificationProviderService sends email via Resend API
```

**Product Search:**
```
GET /store/search?q=leather&limit=10&offset=0
  → validateAndTransformQuery middleware (Zod validation)
  → Route handler constructs Medusa query with filters
  → Query.index().select().where() fetches from database
  → QueryContext calculates prices for region/currency
  → Returns paginated product list
```

### Key Architectural Patterns

- **Modular Plugins**: Services are loaded via defineConfig() and can be toggled via env vars (e.g., Stripe)
- **Event-Driven**: Domain events trigger subscribers → workflows → actions (decoupled, scalable)
- **Service Injection**: Medusa framework handles dependency injection for services
- **Type Safety**: Full TypeScript, generated types from @medusajs/framework, Zod for runtime validation
- **Separation of Concerns**: Commerce logic (Medusa) vs. Notifications (custom module) vs. Search (custom routes)

## Common Development Commands

### Running & Development

```bash
# Start development server with hot reload
yarn dev

# Build TypeScript to .medusa/server
yarn build

# Start production server
yarn start
```

### Database

```bash
# Full initialization: migrate → sync-links → seed
yarn db:init

# Run migrations
yarn db:migrate

# Rollback last migration
yarn db:rollback

# Sync module data model links
yarn db:sync-links

# Seed demo data (regions, products, channels)
yarn db:seed
```

### Admin Management

```bash
# Create admin user (specify email and password)
yarn add:admin user@example.com password123

# Enable product search indexing
yarn run enable-search-engine
```

### Testing

```bash
# Unit tests
TEST_TYPE=unit yarn test

# HTTP integration tests (REST API)
TEST_TYPE=integration:http yarn test

# Module integration tests (internal modules)
TEST_TYPE=integration:modules yarn test

# New framework integration tests
TEST_TYPE=integration:new yarn test

# Run a single test file
TEST_TYPE=unit yarn test -- path/to/test.unit.spec.ts
```

## Configuration

### Environment Variables

**Core Configuration:**
- `NODE_ENV` - 'development' or 'production'
- `DATABASE_URL` - PostgreSQL connection (required: `postgresql://user:pass@host:5432/dbname`)
- `MEDUSA_BACKEND_URL` - Admin dashboard backend URL (e.g., `http://localhost:9000`)
- `JWT_SECRET` - JWT signing key (default: 'supersecret', change in production)
- `COOKIE_SECRET` - Cookie encryption key (default: 'supersecret', change in production)

**CORS Configuration:**
- `STORE_CORS` - Store API CORS origins (e.g., `http://localhost:3000,https://example.com`)
- `ADMIN_CORS` - Admin API CORS origins
- `AUTH_CORS` - Auth endpoints CORS origins

**Payment (Stripe):**
- `STRIPE_API_KEY` - Stripe secret key (optional, enables payment module if set)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret for event verification

**Email (Resend):**
- `RESEND_API_KEY` - Resend API key for sending emails
- `RESEND_FROM_EMAIL` - From address for notification emails (e.g., `noreply@example.com`)

**File Storage (DigitalOcean Spaces):**
- `DO_SPACE_URL` - File serving URL (e.g., `https://bea.digitaloceanspaces.com`)
- `DO_SPACE_ACCESS_KEY` - DO API access key
- `DO_SPACE_SECRET_KEY` - DO API secret key
- `DO_SPACE_REGION` - DO Spaces region (e.g., `nyc3`)
- `DO_SPACE_BUCKET` - Spaces bucket name
- `DO_SPACE_ENDPOINT` - Spaces API endpoint (e.g., `https://nyc3.digitaloceanspaces.com`)

### Key Configuration Files

**medusa-config.ts** - Main configuration entry point:
- Dynamically loads Stripe payment provider if credentials provided
- Configures notification providers (Resend for email)
- Sets up file storage (DigitalOcean Spaces S3-compatible)
- Configures Medusa INDEX module for product search/indexing
- Sets HTTP security (CORS, JWT, cookies)

**tsconfig.json** - TypeScript:
- Target ES2021, Module Node16
- Decorators enabled (required for Medusa)
- Output to `.medusa/server` directory
- Path alias: `@/` → `src/`
- JSX support for React email templates

**jest.config.js** - Testing:
- SWC compiler for fast TypeScript compilation
- Test type detection via `TEST_TYPE` env var
- Path mapper: `@/` → `src/`
- Node test environment

## Custom Modules & Extensions

### Resend Notification Module (`src/modules/resend/`)

Implements custom email provider extending `AbstractNotificationProviderService`:

**Email Templates Supported:**
- `order-placed` - Order confirmation with details
- `user-invited` - Admin invite with signup link
- `password-reset` - Password reset link

**Key Methods:**
- `send()` - Send email via Resend API
- `validate()` - Validate required options (api_key, from email)

**Usage in Code:**
```typescript
// Notifications triggered via Medusa's notification system
const notification = await notificationModuleService.create({
  to: "customer@example.com",
  channel: "email",
  event_name: "order-placed",
  data: { order_id: "order_123" }
});
```

### Custom API Routes

**Search Endpoint** (`src/api/store/search/route.ts`):
- Validates query params: `q` (text), `limit`, `offset`, `collection_id`, `category_id`, `price_min/max`, `materials`
- Returns paginated products with calculated prices
- Uses Zod for input validation

**Filter Attributes** (`src/api/store/filter-product-attributes/route.ts`):
- Returns available filter options: collections, product types, materials
- Used by frontend to populate filter dropdowns

## Deployment & Production

### Local Development

```bash
# Use Docker Compose for local database/cache
docker-compose up -d

# Install dependencies
yarn install

# Initialize database
yarn db:init

# Start dev server
yarn dev
```

**Access Points:**
- Medusa Store API: `http://localhost:9000`
- Medusa Admin: `http://localhost:9000/admin`

### Production (VPS)

Server: `95.111.239.92` (Contabo VPS)

**Process Management (PM2):**
```bash
# Deploy and start with PM2
pm2 start medusa-api

# Restart
pm2 restart medusa-api

# View logs
pm2 logs medusa-api

# Stop
pm2 stop medusa-api
```

**Reverse Proxy (Nginx):**
- Domain: `api.blackeyesartisan.shop` → `localhost:9000`
- SSL/TLS via Let's Encrypt

**Database & Cache:**
- PostgreSQL: Local on VPS (port 5432)
- Redis: Upstash (remote, for sessions/caching)

**Storage:**
- Product images/files: DigitalOcean Spaces (S3-compatible)
- Configuration via DO_SPACE_* env vars

## Testing Strategy

**Test Organization:**
- Unit tests: `src/**/__tests__/**/*.unit.spec.ts`
- Module integration: `src/modules/*/__tests__/**/*.[jt]s`
- HTTP integration: `integration-tests/http/*.spec.ts`
- New framework tests: `integration-tests/new/*.integration.spec.ts`

**Running Tests:**
- Always specify `TEST_TYPE` env var (tests won't run without it)
- Use `--forceExit` to ensure tests terminate
- Tests run sequentially (`--runInBand`) to avoid database conflicts

**Example Test:**
```typescript
// src/modules/resend/__tests__/resend.unit.spec.ts
describe("ResendNotificationProviderService", () => {
  it("should send email via Resend API", async () => {
    // Test implementation
  });
});
```

## Workflow & Subscriber Development

### Adding a Workflow

1. Create file: `src/workflows/my-workflow.ts`
2. Import `createWorkflow`, `WorkflowData`, `createStep`
3. Define steps and orchestrate logic
4. Export from `src/workflows/index.ts`

**Example:**
```typescript
import { createWorkflow, WorkflowData } from "@medusajs/framework/workflows-sdk";
import { StepResponse } from "@medusajs/framework/workflows-sdk";

const myStep = createStep("my-step", async (input) => {
  return new StepResponse({ result: "done" });
});

export const myWorkflow = createWorkflow("my-workflow", (input: WorkflowData<any>) => {
  const result = myStep(input);
  return result;
});
```

### Adding a Subscriber

1. Create file: `src/subscribers/my-event-handler.ts`
2. Subscribe to domain event: `"order.placed"`, `"auth.password_reset"`, etc.
3. Medusa registers automatically when module loads

**Example:**
```typescript
import { subscribe } from "@medusajs/framework";

subscribe("order.placed", async (data, container) => {
  console.log("Order placed:", data.id);
  // Trigger workflow, call service, etc.
});
```

## Common Pitfalls & Tips

### Database Migrations

- Always run `yarn db:migrate` before starting after pulling code changes
- Use `yarn db:sync-links` if module links change
- Test migrations locally before production deployment

### Stripe Integration

- Only enabled if both `STRIPE_API_KEY` and `STRIPE_WEBHOOK_SECRET` are set
- Check `medusa-config.ts` line 10 for conditional logic
- Stripe webhooks must point to `/webhooks/stripe` endpoint

### Email Testing

- Use `RESEND_API_KEY` with Resend sandbox domain for testing
- Set `RESEND_FROM_EMAIL` to verified sender address
- Check Resend dashboard for delivery status

### File Storage

- All files (product images) stored in DigitalOcean Spaces
- Requires valid `DO_SPACE_*` credentials to upload
- Files served via `DO_SPACE_URL` (typically CDN endpoint)

### Performance Optimization

- Product search uses Medusa INDEX module for indexing
- Run `yarn run enable-search-engine` after seeding in new environments
- Large query results should use pagination (limit/offset)

## Useful Links

- [Medusa Documentation](https://docs.medusajs.com)
- [Medusa API Reference](https://docs.medusajs.com/api/store)
- [Medusa GitHub](https://github.com/medusajs/medusa)
- [Resend Email Documentation](https://resend.com/docs)
