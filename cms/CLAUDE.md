# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This is the **Strapi 5.0.1 CMS** module for BlackEyesArtisan, providing content management for pages, settings, and editorial content consumed by the Next.js storefront and Medusa backend.

For full project context, see the parent repository's [CLAUDE.md](../CLAUDE.md).

## Quick Start Commands

```bash
# Development mode with auto-reload (port 1337)
npm run develop

# Production mode
npm run start

# Build admin panel
npm run build

# Deploy to Strapi Cloud
npm run deploy

# Run Strapi CLI commands
npm run strapi <command>
```

**Access Points**:
- Admin Panel: `http://localhost:1337/admin`
- API: `http://localhost:1337/api`
- Production: `https://cms.blackeyesartisan.shop`

## Architecture & Data Model

### Project Structure

```
src/
├── api/                    # Content collections (each has controllers, routes, services)
│   ├── homepage/          # Homepage content (hero, sections, CTAs)
│   ├── about-us/          # About page content
│   ├── blog/              # Blog listings and metadata
│   ├── blog-post-category/# Blog post categories
│   ├── collection/        # Product collections (linked to Medusa)
│   ├── faq/               # FAQ content
│   ├── privacy-policy/    # Privacy policy page
│   ├── terms-and-condition/ # Terms & conditions page
│   └── product-variant-color/ # Product color variants for display
├── components/            # Reusable content components (JSON schemas)
│   ├── about-us/         # About page components (tiles, content sections)
│   ├── color-*/          # Color-related components
│   ├── faq/              # FAQ components
│   ├── homepage/         # Homepage components (hero, CTA, sections)
│   └── seo/              # SEO metadata components
├── extensions/            # Strapi extensions and customizations
├── admin/                 # Admin panel customizations
└── index.ts              # Bootstrap hooks (register/bootstrap lifecycle)

config/
├── admin.ts              # Admin panel security (JWT, API tokens)
├── api.ts                # API routes configuration
├── database.ts           # Database connection (SQLite/MySQL/PostgreSQL)
├── middlewares.ts        # Middleware setup (CORS, etc)
├── plugins.ts            # Plugin configuration (AWS S3 upload provider)
└── server.ts             # Server configuration (port, host)
```

### Content Collections (API)

Each collection in `src/api/` follows standard Strapi structure:
- **controllers**: Request handlers (typically use `factories.createCoreController()`)
- **routes**: REST/GraphQL endpoint definitions
- **services**: Business logic (typically use `factories.createCoreService()`)
- **content-types**: JSON schema definitions for the collection structure

Collections use JSON schema definitions (stored in database) rather than code-based models. Schemas are managed through the Strapi admin UI at `/admin`.

**Important Collections**:
- `global-setting`: Site-wide settings (age gate, handling times, announcement bar, duties disclaimer)
- `homepage`: Homepage content with dynamic zones
- `collection`: Product collections linked to Medusa
- `shipping-policy`, `return-policy`, `privacy-policy`, `terms-and-condition`: Policy pages

### Components

Reusable content blocks defined as JSON schemas in `src/components/`. Used by collections via `dynamiczone` or `component` fields. Examples:
- `homepage/hero-banner` - Hero section with image, text, CTA
- `homepage/cta` - Call-to-action block
- `about-us/tile` - Tile component for team/features
- `color-hex` - Color value storage
- `color-image` - Color with associated product image

## Database & Environment

### Database Configuration

Three database options configured in `config/database.ts`:

1. **SQLite** (default for development)
   - No setup needed
   - File: `.tmp/data.db`
   - Use for local development only

2. **PostgreSQL** (production)
   - Connection via `DATABASE_URL` or individual env vars
   - Production uses: `postgres://user:pass@host:5432/strapi`
   - Connection pooling: min 2, max 10 (configurable via `DATABASE_POOL_*`)

3. **MySQL**
   - Alternative RDBMS option
   - Similar pooling configuration

### Environment Variables

Copy `.env.example` to `.env.local` (or `.env` for production). Key variables:

```
# Server
HOST=0.0.0.0                    # Bind address
PORT=1337                       # Listen port

# Secrets (generate unique values for production)
APP_KEYS="..."                  # Comma-separated app keys (rotate regularly)
API_TOKEN_SALT=...              # Salt for API token hashing
ADMIN_JWT_SECRET=...            # Admin panel JWT secret
JWT_SECRET=...                  # API JWT secret
TRANSFER_TOKEN_SALT=...         # Token transfer salt

# Database
DATABASE_URL=...                # Full PostgreSQL connection string
DATABASE_CLIENT=postgres        # sqlite, mysql, postgres
DATABASE_HOST=...
DATABASE_PORT=...
DATABASE_NAME=...
DATABASE_USERNAME=...
DATABASE_PASSWORD=...
DATABASE_SSL=false              # Enable SSL for DB connection

# File Storage (AWS S3 / DigitalOcean Spaces)
DO_SPACE_PATH=...               # S3 path prefix
DO_SPACE_ACCESS_KEY=...
DO_SPACE_SECRET_KEY=...
DO_SPACE_REGION=...
DO_SPACE_ENDPOINT=...           # S3-compatible endpoint
DO_SPACE_BUCKET=...             # Bucket name
SPACE_URL=...                   # Public URL for stored files
```

## Key Features & Customization Points

### Content Modeling

- **Dynamic Zones**: Collections use `dynamiczone` fields to mix different components (e.g., hero + sections + CTA)
- **Relations**: Collections can relate to each other (blog post → category, collection → products in Medusa)
- **Media**: Files stored via AWS S3 provider (configured in `config/plugins.ts`)

### Security

- **Admin Access**: Protected by `ADMIN_JWT_SECRET` and `API_TOKEN_SALT`
- **API Access**: Token-based authentication for programmatic access
- **CORS**: Configured in `config/middlewares.ts` to allow storefront requests
- **Content Security Policy**: CSP configured to allow S3 storage URLs for media
- **Public Permissions**: Set via bootstrap for specific content types (read-only API access)

### Storage

File uploads go to AWS S3-compatible storage (DigitalOcean Spaces):
- Provider configured in `config/plugins.ts`
- Uses AWS SDK with custom endpoint
- Public URL returned via `SPACE_URL`

### Webhooks & Events

Bootstrap lifecycle in `src/index.ts`:
- **register()**: Runs before app initialization—extend core features, register hooks
- **bootstrap()**: Runs after app starts—seed data, schedule jobs, set up event listeners

**Bootstrap Seeding**: The bootstrap function in `src/index.ts` automatically:
- Sets public permissions for content types (enables anonymous API access)
- Seeds Global Settings with default values if not present
- Seeds all policy pages (Privacy, Terms, Shipping, Return) with default content
- Publishes seeded content automatically

Storefront triggers content revalidation via webhook (see parent CLAUDE.md `STRAPI_WEBHOOK_REVALIDATION_SECRET`).

## Common Development Tasks

### Adding a New Content Collection

1. In Strapi admin: **Content-Type Builder** → **Create New Content-Type**
2. Define fields (text, media, relations, dynamic zones)
3. Set access control (public read, authenticated write)
4. Scaffold routes/controllers in `src/api/new-collection/` if custom logic needed

### Adding a Component

1. In Strapi admin: **Content-Type Builder** → **Components** → **Create New Component**
2. Define fields and attributes
3. Component is immediately available for use in dynamic zones

### Customizing Controllers/Routes

Create custom controller logic in `src/api/collection-name/controllers/collection-name.ts`:

```typescript
import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::collection-name.collection-name', ({ strapi }) => ({
  async find(ctx) {
    // Custom logic before default find
    const result = await super.find(ctx);
    return result;
  }
}))
```

### Database Migrations

Strapi handles migrations automatically. For complex changes:
1. Update schema in admin UI
2. Strapi generates SQL migrations automatically
3. Run `npm run develop` to apply (dev) or deploy production migrations

### Content Exports/Imports

Use Strapi Transfer plugin or export JSON from admin UI. Useful for:
- Backing up content between environments
- Seeding production with initial content
- Version control of content structure (not data)

## Deployment

See parent [CLAUDE.md deployment section](../CLAUDE.md#deployment-architecture).

### Production Checklist

- [ ] All `toBeModified` secrets replaced with secure values
- [ ] `DATABASE_CLIENT` set to `postgres` and `DATABASE_URL` configured
- [ ] S3 credentials configured (`DO_SPACE_*` variables)
- [ ] `NODE_ENV=production`
- [ ] Admin JWT and API token salts generated
- [ ] Database migrations applied (auto on first run)
- [ ] Nginx reverse proxy configured for `cms.blackeyesartisan.shop` → `localhost:1337`

### Container Deployment

Dockerfile provided for containerization:
- Node 18 Alpine with build tools
- Runs as non-root `node` user
- Exposes port 1337
- Builds admin panel before starting

```bash
docker build -t blackeyesartisan-cms .
docker run -p 1337:1337 --env-file .env.production blackeyesartisan-cms
```

## Testing & Type Checking

- **TypeScript**: Configured with `tsconfig.json` (ES2019 target, CommonJS modules)
- **Admin Panel**: Vite-based, separate build from server
- No unit test framework configured; add as needed (Jest, Vitest, etc.)

## Type Safety

TypeScript files use loose checking (`strict: false`). When adding custom logic:
- Import types from `@strapi/strapi` where available
- Use `factories` helper for type-safe controller/service creation
- Component/collection types available via Strapi's content-type generation

## AI Assistant Integration

This project has the Strapi MCP (Model Context Protocol) tool configured, which allows Claude Code to:
- Query the official Strapi documentation directly
- Get up-to-date Strapi best practices and examples
- Retrieve relevant documentation sections for Strapi-related questions

When working on Strapi-specific tasks, the MCP tool will automatically provide relevant documentation context.

## Documentation References

- [Strapi Official Docs](https://docs.strapi.io) - Complete API reference
- [REST API](https://docs.strapi.io/dev-docs/api/rest) - Endpoint documentation
- [GraphQL Plugin](https://docs.strapi.io/dev-docs/plugins/graphql) - If enabled
- [Customization Guide](https://docs.strapi.io/dev-docs/customize) - Controllers, services, middleware
