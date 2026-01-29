# Tasks: MVP B2C Storefront

**Input**: Design documents from `/specs/001-mvp-storefront/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: E2E tests included as final phase (Playwright configured in project).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo**: `apps/storefront/` for Next.js, `packages/ui/` for shared components
- **Backend configs**: `backend/` for Medusa/Strapi deployment configs
- **Tests**: `tests/e2e/` for Playwright tests

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize Turborepo monorepo with Next.js storefront and shared packages

- [ ] T001 Initialize Turborepo monorepo with pnpm workspaces in root `package.json`, `pnpm-workspace.yaml`, and `turbo.json`
- [ ] T002 Create Next.js 14 storefront app with TypeScript and App Router in `apps/storefront/`
- [ ] T003 [P] Create shared UI package structure in `packages/ui/`
- [ ] T004 [P] Create shared Tailwind config package in `packages/config-tailwind/`
- [ ] T005 [P] Create shared TypeScript config package in `packages/config-typescript/`
- [ ] T006 [P] Configure Tailwind with design system tokens (colors, fonts, shadows) in `apps/storefront/tailwind.config.ts`
- [ ] T007 [P] Add global styles with fonts and custom utilities in `apps/storefront/styles/globals.css`
- [ ] T008 Create environment configuration with `.env.example` at repository root
- [ ] T009 [P] Install core dependencies: `@medusajs/medusa-js`, `@tanstack/react-query`, `libphonenumber-js`, `resend` in `apps/storefront/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T010 Create Medusa client wrapper with retry logic in `apps/storefront/lib/medusa/client.ts`
- [ ] T011 [P] Create Strapi client wrapper with ISR caching in `apps/storefront/lib/strapi/client.ts`
- [ ] T012 [P] Create cookie management utilities in `apps/storefront/lib/cookies/index.ts`
- [ ] T013 Define TypeScript types for Medusa commerce entities in `apps/storefront/lib/medusa/types.ts`
- [ ] T014 [P] Define TypeScript types for Strapi CMS entities in `apps/storefront/lib/strapi/types.ts`
- [ ] T015 Create root layout with HTML structure and metadata in `apps/storefront/app/layout.tsx`
- [ ] T016 Create QueryClientProvider wrapper for React Query in `apps/storefront/lib/providers/query-provider.tsx`
- [ ] T017 Create CartContext and CartProvider for cart state management in `apps/storefront/lib/providers/cart-provider.tsx`
- [ ] T018 Create combined Providers component wrapping all contexts in `apps/storefront/lib/providers/index.tsx`
- [ ] T019 [P] Create utility functions for price formatting and inventory checks in `apps/storefront/lib/utils/index.ts`
- [ ] T020 [P] Create reusable Button component in `packages/ui/src/button.tsx`
- [ ] T021 [P] Create reusable Badge component in `packages/ui/src/badge.tsx`
- [ ] T022 [P] Create reusable Input component in `packages/ui/src/input.tsx`
- [ ] T023 [P] Create reusable Card component in `packages/ui/src/card.tsx`
- [ ] T024 Export all UI components from `packages/ui/src/index.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Browse and Purchase Available Product (Priority: P1)

**Goal**: Enable visitors to browse products, add to cart, and complete checkout

**Independent Test**: Navigate from homepage to collection to product detail, add to cart, complete checkout with order confirmation

### Implementation for User Story 1

- [ ] T025 [P] [US1] Create product data fetching functions in `apps/storefront/lib/medusa/products.ts`
- [ ] T026 [P] [US1] Create collection data fetching functions in `apps/storefront/lib/medusa/collections.ts`
- [ ] T027 [P] [US1] Create cart operations (create, add, update, remove) in `apps/storefront/lib/medusa/cart.ts`
- [ ] T028 [P] [US1] Create order fetching functions in `apps/storefront/lib/medusa/orders.ts`
- [ ] T029 [P] [US1] Create ProductImage component with Cloudinary optimization in `apps/storefront/components/products/product-image.tsx`
- [ ] T030 [P] [US1] Create ProductCard component for grid display in `apps/storefront/components/products/product-card.tsx`
- [ ] T031 [P] [US1] Create ProductGrid component for collections in `apps/storefront/components/products/product-grid.tsx`
- [ ] T032 [US1] Create ProductDetail component with image gallery in `apps/storefront/components/products/product-detail.tsx`
- [ ] T033 [US1] Create AddToCartButton component with loading state in `apps/storefront/components/cart/add-to-cart-button.tsx`
- [ ] T034 [US1] Create CartDrawer component for slide-out cart in `apps/storefront/components/cart/cart-drawer.tsx`
- [ ] T035 [P] [US1] Create CartItem component for line items in `apps/storefront/components/cart/cart-item.tsx`
- [ ] T036 [P] [US1] Create CartSummary component for totals in `apps/storefront/components/cart/cart-summary.tsx`
- [ ] T037 [US1] Create Header component with cart icon and count in `apps/storefront/components/layout/header.tsx`
- [ ] T038 [P] [US1] Create Footer component with navigation links in `apps/storefront/components/layout/footer.tsx`
- [ ] T039 [US1] Create shop layout with Header/Footer in `apps/storefront/app/(shop)/layout.tsx`
- [ ] T040 [US1] Create homepage with featured products in `apps/storefront/app/(shop)/page.tsx`
- [ ] T041 [US1] Create product detail page with SSR data fetching in `apps/storefront/app/(shop)/products/[handle]/page.tsx`
- [ ] T042 [US1] Create cart page for full cart view in `apps/storefront/app/(shop)/cart/page.tsx`
- [ ] T043 [US1] Create checkout page shell in `apps/storefront/app/(shop)/checkout/page.tsx`
- [ ] T044 [US1] Create CheckoutForm component with multi-step flow in `apps/storefront/components/checkout/checkout-form.tsx`
- [ ] T045 [P] [US1] Create ShippingForm component for address entry in `apps/storefront/components/checkout/shipping-form.tsx`
- [ ] T046 [P] [US1] Create PaymentForm component for payment selection in `apps/storefront/components/checkout/payment-form.tsx`
- [ ] T047 [US1] Create OrderReview component for final review in `apps/storefront/components/checkout/order-review.tsx`
- [ ] T048 [US1] Create checkout server actions for cart completion in `apps/storefront/app/(shop)/checkout/actions.ts`
- [ ] T049 [US1] Create order confirmation page in `apps/storefront/app/(shop)/checkout/confirmation/page.tsx`

**Checkpoint**: User Story 1 complete - visitors can browse and purchase products

---

## Phase 4: User Story 2 - Age Verification Gate (Priority: P1)

**Goal**: Require 18+ verification before any site content is accessible

**Independent Test**: Clear cookies, visit any page, verify age gate appears, confirm age, verify browsing works and gate doesn't reappear within TTL

### Implementation for User Story 2

- [ ] T050 [US2] Create age verification middleware checking cookie in `apps/storefront/middleware.ts`
- [ ] T051 [US2] Fetch global settings (ageGateTtl) from Strapi in `apps/storefront/lib/strapi/settings.ts`
- [ ] T052 [P] [US2] Create AgeGate component with styled modal in `apps/storefront/components/age-gate/age-gate.tsx`
- [ ] T053 [P] [US2] Create ExitPage component for under-18 redirect in `apps/storefront/components/age-gate/exit-page.tsx`
- [ ] T054 [US2] Create age gate page route in `apps/storefront/app/age-gate/page.tsx`
- [ ] T055 [US2] Create exit page route in `apps/storefront/app/age-gate/exit/page.tsx`
- [ ] T056 [US2] Create server actions for age verification with cookie setting in `apps/storefront/app/age-gate/actions.ts`
- [ ] T057 [US2] Add checkout age re-verification in `apps/storefront/app/(shop)/checkout/actions.ts`

**Checkpoint**: User Story 2 complete - age gate blocks underage visitors

---

## Phase 5: User Story 3 - View Sold-Out Items as Portfolio (Priority: P2)

**Goal**: Display sold-out products with SOLD badge and disabled purchase, showing newsletter signup instead

**Independent Test**: Mark a product as sold-out in Medusa, verify SOLD badge appears, add-to-cart is disabled, and newsletter CTA is shown

### Implementation for User Story 3

- [ ] T058 [P] [US3] Create isProductSoldOut and isVariantSoldOut utility functions in `apps/storefront/lib/utils/inventory.ts`
- [ ] T059 [P] [US3] Create SoldBadge component with styled overlay in `apps/storefront/components/products/sold-badge.tsx`
- [ ] T060 [US3] Update ProductCard to show SoldBadge when inventory is zero in `apps/storefront/components/products/product-card.tsx`
- [ ] T061 [US3] Update ProductDetail to show disabled state and NotifyMe form when sold out in `apps/storefront/components/products/product-detail.tsx`
- [ ] T062 [US3] Create NotifyMeForm component for sold-out products in `apps/storefront/components/newsletter/notify-me-form.tsx`

**Checkpoint**: User Story 3 complete - sold-out products display as portfolio with newsletter signup

---

## Phase 6: User Story 4 - Newsletter Signup for Drops and Updates (Priority: P2)

**Goal**: Allow visitors to subscribe to newsletter via footer form or sold-out product notification

**Independent Test**: Submit email in newsletter form, verify success message and welcome email received

### Implementation for User Story 4

- [ ] T063 [US4] Create newsletter API route with Resend integration in `apps/storefront/app/api/newsletter/route.ts`
- [ ] T064 [P] [US4] Create rate limiting utility for API routes in `apps/storefront/lib/utils/rate-limit.ts`
- [ ] T065 [P] [US4] Create email validation utility in `apps/storefront/lib/utils/validation.ts`
- [ ] T066 [P] [US4] Create WelcomeEmail template with React Email in `apps/storefront/emails/welcome.tsx`
- [ ] T067 [US4] Create NewsletterForm component for footer in `apps/storefront/components/newsletter/newsletter-form.tsx`
- [ ] T068 [US4] Update Footer to include NewsletterForm in `apps/storefront/components/layout/footer.tsx`

**Checkpoint**: User Story 4 complete - newsletter signup works from footer and sold-out products

---

## Phase 7: User Story 5 - View Order Confirmation and Receive Emails (Priority: P2)

**Goal**: Show order confirmation page with order details and send confirmation/shipping emails

**Independent Test**: Complete an order, verify confirmation page shows order details, verify confirmation email is received

### Implementation for User Story 5

- [ ] T069 [P] [US5] Create OrderConfirmation component with order details display in `apps/storefront/components/checkout/order-confirmation.tsx`
- [ ] T070 [P] [US5] Create TrackingInfo component for fulfillment display in `apps/storefront/components/orders/tracking-info.tsx`
- [ ] T071 [P] [US5] Create OrderConfirmationEmail template with React Email in `apps/storefront/emails/order-confirmation.tsx`
- [ ] T072 [P] [US5] Create ShippingNotificationEmail template with FedEx tracking in `apps/storefront/emails/shipping-notification.tsx`
- [ ] T073 [US5] Fetch global settings for dutiesDisclaimer and handlingTime in order confirmation in `apps/storefront/app/(shop)/checkout/confirmation/page.tsx`

**Checkpoint**: User Story 5 complete - order confirmation and emails work

---

## Phase 8: User Story 6 - International Checkout with Required Phone (Priority: P2)

**Goal**: Support international addresses with mandatory phone validation and clear shipping/duties information

**Independent Test**: Complete checkout with international address, verify phone is required, shipping cost displays, duties disclaimer visible

### Implementation for User Story 6

- [ ] T074 [P] [US6] Create phone validation with libphonenumber-js in `apps/storefront/lib/utils/phone-validation.ts`
- [ ] T075 [P] [US6] Create CountrySelect component with ISO country codes in `apps/storefront/components/checkout/country-select.tsx`
- [ ] T076 [P] [US6] Create PhoneInput component with country-aware validation in `apps/storefront/components/checkout/phone-input.tsx`
- [ ] T077 [US6] Update ShippingForm to include phone validation and country selector in `apps/storefront/components/checkout/shipping-form.tsx`
- [ ] T078 [P] [US6] Create ShippingOptions component displaying flat-rate options in `apps/storefront/components/checkout/shipping-options.tsx`
- [ ] T079 [P] [US6] Create DutiesDisclaimer component with CMS content in `apps/storefront/components/checkout/duties-disclaimer.tsx`
- [ ] T080 [US6] Integrate ShippingOptions and DutiesDisclaimer into checkout flow in `apps/storefront/components/checkout/checkout-form.tsx`

**Checkpoint**: User Story 6 complete - international checkout with phone validation works

---

## Phase 9: User Story 7 - Browse Product Collections (Priority: P3)

**Goal**: Allow visitors to browse products organized by collections

**Independent Test**: Navigate to collections page, select a collection, verify products in that collection display

### Implementation for User Story 7

- [ ] T081 [P] [US7] Create CollectionCard component for collection grid in `apps/storefront/components/collections/collection-card.tsx`
- [ ] T082 [P] [US7] Create CollectionGrid component for listing collections in `apps/storefront/components/collections/collection-grid.tsx`
- [ ] T083 [US7] Create collections listing page in `apps/storefront/app/(shop)/collections/page.tsx`
- [ ] T084 [US7] Create collection detail page with products in `apps/storefront/app/(shop)/collections/[handle]/page.tsx`
- [ ] T085 [US7] Update homepage to include collections section in `apps/storefront/app/(shop)/page.tsx`

**Checkpoint**: User Story 7 complete - collection browsing works

---

## Phase 10: User Story 8 - View About/Story Page (Priority: P3)

**Goal**: Display artisan story page with content from CMS

**Independent Test**: Navigate to About page, verify content loads from Strapi

### Implementation for User Story 8

- [ ] T086 [P] [US8] Create page data fetching from Strapi in `apps/storefront/lib/strapi/pages.ts`
- [ ] T087 [P] [US8] Create PageContent component for rich text rendering in `apps/storefront/components/content/page-content.tsx`
- [ ] T088 [US8] Create content routes layout in `apps/storefront/app/(content)/layout.tsx`
- [ ] T089 [US8] Create About page route with CMS content in `apps/storefront/app/(content)/about/page.tsx`

**Checkpoint**: User Story 8 complete - About page displays CMS content

---

## Phase 11: User Story 9 - View Policy Pages (Priority: P3)

**Goal**: Display policy pages (shipping, returns, privacy, terms) from CMS

**Independent Test**: Navigate to each policy page via footer links, verify content loads

### Implementation for User Story 9

- [ ] T090 [P] [US9] Create policy data fetching from Strapi in `apps/storefront/lib/strapi/policies.ts`
- [ ] T091 [US9] Create dynamic policy page route in `apps/storefront/app/(content)/policies/[slug]/page.tsx`
- [ ] T092 [US9] Update Footer with policy page links in `apps/storefront/components/layout/footer.tsx`

**Checkpoint**: User Story 9 complete - all policy pages accessible

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, SEO, and final refinements

- [ ] T093 [P] Create 404 not-found page in `apps/storefront/app/not-found.tsx`
- [ ] T094 [P] Create global error boundary page in `apps/storefront/app/error.tsx`
- [ ] T095 [P] Create loading states for route transitions in `apps/storefront/app/loading.tsx`
- [ ] T096 [P] Create AnnouncementBar component with CMS content in `apps/storefront/components/layout/announcement-bar.tsx`
- [ ] T097 Update root layout to include AnnouncementBar in `apps/storefront/app/layout.tsx`
- [ ] T098 [P] Create revalidation API route for Strapi webhooks in `apps/storefront/app/api/revalidate/route.ts`
- [ ] T099 [P] Add metadata generation for SEO on all pages in `apps/storefront/lib/utils/metadata.ts`
- [ ] T100 Create Playwright configuration in `playwright.config.ts`
- [ ] T101 [P] Create E2E test for age gate flow in `tests/e2e/age-gate.spec.ts`
- [ ] T102 [P] Create E2E test for purchase flow in `tests/e2e/purchase-flow.spec.ts`
- [ ] T103 [P] Create E2E test for sold-out display in `tests/e2e/sold-out-display.spec.ts`
- [ ] T104 [P] Create E2E test for newsletter signup in `tests/e2e/newsletter.spec.ts`
- [ ] T105 Run quickstart.md validation and fix any setup issues

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1) and User Story 2 (P1) form the MVP core
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Core shopping flow
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Can run parallel with US1
- **User Story 3 (P2)**: Depends on US1 components (ProductCard, ProductDetail) - Extends sold-out handling
- **User Story 4 (P2)**: Can start after Foundational - Standalone newsletter feature
- **User Story 5 (P2)**: Depends on US1 checkout completion - Extends order flow
- **User Story 6 (P2)**: Depends on US1 checkout form - Extends address/phone handling
- **User Story 7 (P3)**: Can start after Foundational - Standalone collections feature
- **User Story 8 (P3)**: Can start after Foundational - Standalone CMS page
- **User Story 9 (P3)**: Can start after Foundational - Standalone CMS pages

### Within Each User Story

- Models/utilities before components
- Components before pages
- Pages before integration
- Story complete before moving to next priority

### Parallel Opportunities

**Setup Phase (T001-T009)**:
- T003, T004, T005 can run in parallel (package creation)
- T006, T007 can run in parallel (styling setup)

**Foundational Phase (T010-T024)**:
- T010, T011, T012 can run in parallel (client setup)
- T013, T014 can run in parallel (type definitions)
- T019-T024 can run in parallel (utilities and UI components)

**User Story Parallel Execution**:
- US1 and US2 can run in parallel (both P1)
- US4, US7, US8, US9 can all run in parallel (no dependencies)

---

## Parallel Example: Foundation Setup

```bash
# Launch all client wrappers together:
Task: "Create Medusa client wrapper in apps/storefront/lib/medusa/client.ts"
Task: "Create Strapi client wrapper in apps/storefront/lib/strapi/client.ts"
Task: "Create cookie management utilities in apps/storefront/lib/cookies/index.ts"

# Launch all type definitions together:
Task: "Define TypeScript types for Medusa in apps/storefront/lib/medusa/types.ts"
Task: "Define TypeScript types for Strapi in apps/storefront/lib/strapi/types.ts"
```

## Parallel Example: User Story 1

```bash
# Launch all data fetching functions together:
Task: "Create product data fetching in apps/storefront/lib/medusa/products.ts"
Task: "Create collection data fetching in apps/storefront/lib/medusa/collections.ts"
Task: "Create cart operations in apps/storefront/lib/medusa/cart.ts"

# Launch all product components together:
Task: "Create ProductImage component in apps/storefront/components/products/product-image.tsx"
Task: "Create ProductCard component in apps/storefront/components/products/product-card.tsx"
Task: "Create ProductGrid component in apps/storefront/components/products/product-grid.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Browse & Purchase)
4. Complete Phase 4: User Story 2 (Age Gate)
5. **STOP and VALIDATE**: Test both stories independently
6. Deploy/demo if ready - this is the minimal viable product

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 + US2 → Test independently → Deploy/Demo (**MVP!**)
3. Add US3 (Sold-Out Display) → Enhances product viewing
4. Add US4 (Newsletter) → Captures leads
5. Add US5 + US6 (Order Confirmation, Intl Checkout) → Enhances checkout
6. Add US7, US8, US9 (Collections, About, Policies) → Content pages
7. Add Polish phase → Production-ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Browse & Purchase)
   - Developer B: User Story 2 (Age Gate)
3. After MVP complete:
   - Developer A: US5 + US6 (Checkout enhancements)
   - Developer B: US3 + US4 (Sold-out + Newsletter)
   - Developer C: US7, US8, US9 (Content pages)
4. All developers: Polish phase together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- **MVP Scope**: User Stories 1 + 2 (Phase 3 + Phase 4) deliver a working storefront with age gate
