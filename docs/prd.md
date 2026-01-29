# PRD v1.2 — BlackEyesArtisan (Strapi + MedusaJS + Resend)

## 1) Product Summary

**BlackEyesArtisan** is a direct-to-consumer ecommerce site for handmade glass pieces (often one-of-one). The site must:
- Sell available items fast (drop-friendly)
- Keep sold pieces visible as a portfolio/gallery
- Support **international checkout** 
- Enforce **18+ age gate**
- Use **USD only** at MVP
- Use **Resend** for transactional email

**Tech stack**
- Commerce + orders: **MedusaJS** (starter: `rigby-sh/solace-medusa-starter`)
- CMS + settings: **Strapi**
- Email: **Resend**
- Payments: **Stripe** (recommended for Medusa; supports global cards)
- turborepo for monorepo management
  shadcdui with retro ui library fro neo brutalism design

---

## 2) Goals, Non-Goals, Metrics

### Goals (MVP)
1. Reliable direct checkout experience for global buyers (USD).
2. Strong brand presentation: story + craft + gallery of sold work.
3. Fast admin workflow: add products, fulfill orders, send tracking.
4. Compliance: age gating and clear policies for international shipping.

### Non-goals (MVP)
- Automated duties/taxes calculation
- Multi-currency
- Two-way Etsy sync
- Advanced marketing automation (beyond basic newsletter + transactional)

### Success Metrics (first 90 days)
- Conversion rate: 1.5%–3%
- Email capture: 3%–8%
- Support tickets per order: < 0.15 (shipping clarity reduces this)
- % orders successfully fulfilled with tracking: > 98%

---

## 3) Personas & Core Journeys

### Personas
- **Collector:** wants “one-of-one”, proof of authenticity, sold gallery.
- **International buyer:** needs shipping time/cost clarity, customs disclaimer.
- **Gift buyer:** wants fast trust + delivery expectations.

### MVP Journeys
1. **Browse → PDP → Add to cart → Checkout → Order confirmation**
2. **Sold item viewing** (portfolio) → newsletter signup
3. **Post-purchase:** confirmation email → shipped email with FedEx tracking

