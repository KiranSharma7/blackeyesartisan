# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product Overview & Requirements

**Project**: BlackEyesArtisan - handcrafted artisan eCommerce storefront
**Stack**: Next.js 14 (storefront) + Medusa 2.0 (commerce backend) + Strapi (CMS)
**Base template**: Solace Medusa Starter (with customizations for BlackEyesArtisan)

### Key Business Rules
- **Age gate**: Mandatory 18+ verification at entry (persisted with TTL; re-checked at checkout)
- **Currency**: USD only (MVP)
- **Shipping**: Nepal-based, FedEx partner (flat-rate zones; manual label purchase in MVP)
- **Inventory**:
  - Sold-out items remain visible in collections and product pages (portfolio display)
  - SOLD badge shown; add-to-cart disabled
  - Newsletter CTA displayed for sold items
- **International checkout**: Full support required; phone number mandatory (FedEx requirement)
- **Email**: Resend for transactional emails (order confirmation, tracking updates)
- **Taxes**: Manual approach in MVP; duties/taxes disclaimer visible in checkout and policies

### Data Source of Truth
- **Medusa backend**: Products, inventory, cart, checkout, orders, regions, shipping options
- **Strapi CMS**: Pages, policies, global settings (age gate TTL, handling times, announcement bar)
- **Storefront**: Reads commerce data from Medusa + content from Strapi via APIs

## Deployment Architecture

### DNS & Domain
**Primary Domain**: blackeyesartisan.shop
- DNS configured with VPS nameservers
- Managed at domain registrar level
- Subdomains (when configured):
  - `www.blackeyesartisan.shop` → Vercel (storefront)
  - `api.blackeyesartisan.shop` → VPS/Nginx → Medusa backend (port 9000)
  - `cms.blackeyesartisan.shop` → VPS/Nginx → Strapi CMS (port 1337)

### Deployment Platforms

#### Vercel (Storefront)
- Platform: [vercel.com](https://vercel.com)
- Project: blackeyesartisan (Next.js storefront)
- Auto-deploy: Connected to GitHub main branch
- Environment variables required:
  - `NEXT_PUBLIC_MEDUSA_BACKEND_URL` → https://api.blackeyesartisan.shop
  - `NEXT_PUBLIC_STRAPI_URL` → https://cms.blackeyesartisan.shop
  - `NEXT_PUBLIC_STRAPI_READ_TOKEN`
  - `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
  - `NEXT_PUBLIC_BASE_URL` → https://www.blackeyesartisan.shop
  - `STRAPI_WEBHOOK_REVALIDATION_SECRET`
  - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dllzefagw`

#### Contabo VPS (Backend Services)
- **IP**: 95.111.239.92
- **Services**: Medusa (port 9000), Strapi (port 1337), PostgreSQL (port 5432)
- **Reverse Proxy**: Nginx for api. and cms. subdomains with SSL
- **Process Manager**: PM2 for service orchestration
- **Status**: Clean slate - ready for fresh deployment

### Deployment Flow
1. **Storefront**: Push to GitHub → Vercel auto-deploys → Available at www.blackeyesartisan.shop
2. **Backend (VPS)**: SSH to VPS → Deploy Medusa + Strapi → Configure Nginx → Restart PM2
3. **DNS**: Point A records to VPS IP, CNAME for www to Vercel



## Production CREDENTIALS 

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
