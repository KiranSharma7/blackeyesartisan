# Storefront Performance Optimization (Vercel React Best Practices)

## Goals
- Improve Core Web Vitals (LCP/INP/CLS) on high-traffic storefront routes.
- Reduce hydration and client bundle cost on layout and checkout flows.
- Remove avoidable server waterfalls and duplicate route fetches.

## Implemented in this pass
- Removed global forced dynamic rendering from `storefront/src/app/[countryCode]/layout.tsx`.
- Moved age-gate verification bootstrap to client cookie initialization in `storefront/src/modules/age-gate/components/age-gate-provider.tsx`.
- Switched age-gate cookie to client-readable in `storefront/src/lib/data/cookies.ts`.
- Deduplicated metadata/page fetch paths with cached loaders in:
  - `storefront/src/app/[countryCode]/(main)/products/[handle]/page.tsx`
  - `storefront/src/app/[countryCode]/(main)/collections/[handle]/page.tsx`
  - `storefront/src/app/[countryCode]/(main)/blog/[slug]/page.tsx`
- Parallelized independent work in `storefront/src/app/[countryCode]/(main)/layout.tsx`.
- Added dynamic imports for heavy interaction UI:
  - Cart drawer in main layout
  - Stripe checkout components in payment step
- Fixed hook/perf anti-patterns:
  - Removed `setState` in effect for Stripe initialization
  - Removed `setState` in effect in address select flow
  - Simplified checkout form validation callback memoization
  - Tightened search param hook dependencies
  - Added timer cleanup in payment-processing page

## Validation run
- Targeted ESLint run on all touched storefront files: **pass**.

## Remaining baseline checks (run in connected environment)
- `npm run analyze` (bundle analysis)
- `npm run build` (currently blocked in offline sandbox due Google Fonts fetch)
- Lighthouse/Web Vitals on:
  - `/us`
  - `/us/products/[handle]`
  - `/us/checkout`

## Success metrics to track
- Lower initial JS for home and checkout routes.
- Reduced checkout JS before selecting Stripe payment.
- Improved LCP on home/product pages.
- No new React hooks performance lint violations in touched files.
