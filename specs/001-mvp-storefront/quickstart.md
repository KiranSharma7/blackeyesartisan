# Quickstart: MVP B2C Storefront

**Phase**: 1 - Design | **Date**: 2026-01-30 | **Plan**: [plan.md](./plan.md)

## Prerequisites

Before starting development, ensure you have:

1. **Backend Services Running** (on Contabo VPS 95.111.239.92):
   - Medusa 2.0 at `https://api.blackeyesartisan.shop`
   - Strapi CMS at `https://cms.blackeyesartisan.shop`
   - PostgreSQL database
   - Redis (Upstash) for sessions

2. **Local Development Environment**:
   - Node.js 20.x LTS
   - pnpm (recommended) or npm
   - Git

3. **External Service Accounts**:
   - Vercel account (deployment)
   - Cloudinary account (images)
   - Resend account (emails)
   - Stripe account (payments)

## Step 1: Fork Solace Medusa Starter

```bash
# Clone the Solace starter
git clone https://github.com/rigby-sh/solace-medusa-starter.git blackeyesartisan-storefront
cd blackeyesartisan-storefront

# Remove original git history and reinitialize
rm -rf .git
git init
git remote add origin https://github.com/YOUR_ORG/blackeyesartisan-storefront.git

# Install dependencies
npm install
```

## Step 2: Configure Environment Variables

Create `.env.local` with the following variables:

```bash
# Medusa Backend
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.blackeyesartisan.shop
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxxxxxxxxxx

# Strapi CMS
NEXT_PUBLIC_STRAPI_URL=https://cms.blackeyesartisan.shop
NEXT_PUBLIC_STRAPI_READ_TOKEN=your_strapi_read_token
STRAPI_WEBHOOK_REVALIDATION_SECRET=your_webhook_secret

# Cloudinary (replacing DO Spaces)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dllzefagw
CLOUDINARY_API_KEY=876936695179845
CLOUDINARY_API_SECRET=iEYpye-9ptjclcN4cZNKzyePo74

# Resend (Email)
RESEND_API_KEY=re_dU5PsXha_7Voxe2AEwFz2jixeyJSryv45
RESEND_AUDIENCE_ID=your_audience_id

# Stripe (from Solace/Medusa)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxxxxxxxxxxxx

# Site Config
NEXT_PUBLIC_BASE_URL=https://www.blackeyesartisan.shop
NEXT_PUBLIC_DEMO_MODE=false

# Age Gate (optional override, default from Strapi)
# AGE_GATE_TTL_DAYS=30
```

## Step 3: Update Tailwind Configuration

Replace `tailwind.config.ts` with design system tokens:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
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
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    }
  },
  plugins: [],
}

export default config
```

## Step 4: Add Google Fonts

Update `src/app/layout.tsx` to include fonts:

```tsx
import { Dela_Gothic_One, Space_Grotesk } from 'next/font/google'

const delaGothicOne = Dela_Gothic_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${delaGothicOne.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans bg-paper text-ink">
        {children}
      </body>
    </html>
  )
}
```

## Step 5: Update Image Configuration for Cloudinary

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dllzefagw/**',
      },
      {
        protocol: 'https',
        hostname: 'api.blackeyesartisan.shop',
      },
    ],
  },
}

module.exports = nextConfig
```

## Step 6: Configure Strapi Age Gate Fields

In Strapi Admin (`https://cms.blackeyesartisan.shop/admin`):

1. Go to **Content-Type Builder**
2. Select **Global Settings** (single type)
3. Add fields:
   - `ageGateEnabled` (Boolean, default: true)
   - `ageGateTtlDays` (Number, default: 30)
   - `ageGateTitle` (Short text, default: "Age Verification Required")
   - `ageGateMessage` (Long text)
4. Save and publish changes

## Step 7: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the storefront.

## Step 8: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# or via CLI:
vercel env add NEXT_PUBLIC_MEDUSA_BACKEND_URL production
# ... add all other env vars
```

## Verification Checklist

After setup, verify:

- [ ] Homepage loads with products from Medusa
- [ ] Product images load from Cloudinary
- [ ] CMS content loads from Strapi
- [ ] Cart functionality works
- [ ] Checkout flow completes with Stripe (test mode)
- [ ] User registration/login works
- [ ] Age gate redirects unverified visitors (after implementation)

## Development Workflow

1. **Feature branches**: Create from `main` with format `feature/description`
2. **Local testing**: Run `npm run dev` and test manually
3. **Type checking**: Run `npm run type-check` before commit
4. **Build verification**: Run `npm run build` before PR
5. **Preview deploys**: Vercel auto-deploys PRs for review
6. **Production deploy**: Merge to `main` triggers production deploy

## Useful Commands

```bash
# Development
npm run dev           # Start dev server
npm run build         # Production build
npm run start         # Start production server
npm run lint          # Run ESLint
npm run type-check    # TypeScript check

# Testing (after Playwright setup)
npm run test:e2e      # Run E2E tests
```

## Troubleshooting

**Images not loading?**
- Check Cloudinary cloud name in env vars
- Verify `next.config.js` remotePatterns

**Medusa API errors?**
- Verify backend URL and publishable key
- Check CORS settings on Medusa backend

**Strapi content not loading?**
- Verify Strapi URL and read token
- Check content permissions in Strapi admin

**Stripe checkout failing?**
- Use test mode keys during development
- Check Stripe webhook configuration
