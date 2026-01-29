# Quickstart Guide: MVP B2C Storefront

**Feature**: 001-mvp-storefront
**Date**: 2026-01-29

## Prerequisites

- Node.js 20.x LTS
- pnpm 8.x or later
- Git
- Access to Contabo VPS (for backend services)
- Vercel account (for storefront deployment)

## Quick Setup (Development)

### 1. Clone and Install

```bash
# Navigate to project directory
cd C:\Users\black\OneDrive\Desktop\Code\blackeyesartisan.com

# Install pnpm if not already installed
npm install -g pnpm

# Install dependencies (after monorepo setup)
pnpm install
```

### 2. Environment Setup

Create `.env.local` in `apps/storefront/`:

```bash
# Medusa Backend
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_test_xxxxx

# Strapi CMS
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_READ_TOKEN=xxxxx

# Resend Email
RESEND_API_KEY=re_test_xxxxx
RESEND_AUDIENCE_ID=aud_xxxxx

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dllzefagw

# Site URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Strapi Webhook (for revalidation)
STRAPI_WEBHOOK_REVALIDATION_SECRET=xxxxx
```

### 3. Start Development Servers

```bash
# Start all services (from monorepo root)
pnpm dev

# Or start individually:
# Storefront: pnpm --filter storefront dev
# Medusa: pnpm --filter medusa dev
# Strapi: pnpm --filter strapi dev
```

### 4. Access Development URLs

| Service | URL |
|---------|-----|
| Storefront | http://localhost:3000 |
| Medusa Backend | http://localhost:9000 |
| Medusa Admin | http://localhost:9000/app |
| Strapi Admin | http://localhost:1337/admin |

## Project Initialization (First Time Only)

### Initialize Turborepo Monorepo

```bash
# Create monorepo structure
npx create-turbo@latest

# Or initialize manually:
mkdir -p apps packages
```

### Initialize Next.js Storefront

```bash
# Create Next.js app with TypeScript and Tailwind
cd apps
npx create-next-app@14 storefront --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

# Install additional dependencies
cd storefront
pnpm add @medusajs/medusa-js @tanstack/react-query
pnpm add libphonenumber-js
pnpm add resend @react-email/components
pnpm add -D @types/node
```

### Initialize Medusa Backend

```bash
# Create Medusa project
cd apps
npx create-medusa-app@latest medusa --skip-db

# Or use the Solace starter
npx degit rigby-sh/solace-medusa-starter apps/medusa
```

### Initialize Strapi CMS

```bash
# Create Strapi project
cd apps
npx create-strapi-app@latest strapi --quickstart --typescript
```

## Monorepo Configuration

### turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"]
    },
    "test:e2e": {
      "dependsOn": ["build"]
    }
  }
}
```

### pnpm-workspace.yaml
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### Root package.json
```json
{
  "name": "blackeyesartisan",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "test:e2e": "turbo run test:e2e"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  },
  "packageManager": "pnpm@8.15.0"
}
```

## Design System Setup

### Tailwind Configuration

```typescript
// apps/storefront/tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#18181B',
        paper: '#FEF8E7',
        acid: '#D63D42',
        stone: '#E8DCCA',
        sun: '#FCCA46',
      },
      fontFamily: {
        display: ['Dela Gothic One', 'cursive'],
        sans: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'hard': '4px 4px 0px 0px #18181B',
        'hard-sm': '2px 2px 0px 0px #18181B',
        'hard-xl': '8px 8px 0px 0px #18181B',
        'hard-acid': '4px 4px 0px 0px #D63D42',
        'hard-sun': '4px 4px 0px 0px #FCCA46',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

### Global Styles

```css
/* apps/storefront/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Space+Grotesk:wght@400;500;600;700&display=swap');

body {
  @apply bg-paper text-ink;
  font-family: 'Space Grotesk', sans-serif;
}

/* Text outline effects */
.text-outline {
  -webkit-text-stroke: 1.5px #18181B;
  color: transparent;
}

.text-outline-acid {
  -webkit-text-stroke: 1px #D63D42;
  color: transparent;
}

/* Text shadow */
.text-shadow-sm {
  text-shadow: 2px 2px 0px #18181B;
}

/* Selection */
::selection {
  @apply bg-acid text-white;
}

/* Hide scrollbar */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

## Testing Setup

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: process.env.CI ? undefined : {
    command: 'pnpm --filter storefront dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Install Playwright

```bash
# Install Playwright
pnpm add -D @playwright/test

# Install browsers
npx playwright install
```

## Development Workflow

### Daily Development

1. **Start services**: `pnpm dev`
2. **Make changes**: Edit code in `apps/storefront/`
3. **Test locally**: Use Playwright MCP or manual testing
4. **Lint/Type check**: `pnpm lint`
5. **Commit changes**: Follow commit conventions

### Testing Workflow

```bash
# Run unit tests
pnpm test

# Run E2E tests locally
pnpm test:e2e

# Run E2E tests against production
PLAYWRIGHT_BASE_URL=https://www.blackeyesartisan.shop pnpm test:e2e
```

### Deployment Workflow

```bash
# 1. Push to feature branch
git push origin 001-mvp-storefront

# 2. Vercel creates preview deployment automatically

# 3. Test preview deployment with Playwright
PLAYWRIGHT_BASE_URL=https://001-mvp-storefront-blackeyesartisan.vercel.app pnpm test:e2e

# 4. Merge to main for production
git checkout main
git merge 001-mvp-storefront
git push origin main

# 5. Test production
PLAYWRIGHT_BASE_URL=https://www.blackeyesartisan.shop pnpm test:e2e
```

## Common Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all services in development |
| `pnpm build` | Build all packages |
| `pnpm lint` | Run linting |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm --filter storefront dev` | Start only storefront |
| `pnpm --filter storefront build` | Build only storefront |

## Troubleshooting

### Common Issues

**Port already in use**:
```bash
# Find and kill process on port 3000
npx kill-port 3000
```

**Medusa connection failed**:
- Ensure Medusa is running on port 9000
- Check `NEXT_PUBLIC_MEDUSA_BACKEND_URL` env var
- Verify publishable API key is correct

**Strapi connection failed**:
- Ensure Strapi is running on port 1337
- Check `NEXT_PUBLIC_STRAPI_URL` env var
- Verify read token has correct permissions

**Tailwind styles not applying**:
- Check `content` paths in tailwind.config.ts
- Restart dev server after config changes
- Clear `.next` cache: `rm -rf .next`

## Next Steps

After completing the quickstart:

1. **Run `/speckit.tasks`** to generate the implementation task list
2. **Start with Task 1** (usually monorepo initialization)
3. **Follow the testing workflow** for each feature
4. **Deploy incrementally** to catch issues early
