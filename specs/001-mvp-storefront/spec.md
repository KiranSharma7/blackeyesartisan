# Feature Specification: MVP B2C Storefront

**Feature Branch**: `001-mvp-storefront`
**Created**: 2026-01-29
**Status**: Draft
**Base Template**: [Solace Medusa Starter](https://github.com/rigby-sh/solace-medusa-starter) (fork with customizations)
**Input**: User description: "B2C ecommerce storefront for handmade glass pipes with age gate, international checkout, sold-out portfolio display, and newsletter signup"

## Clarifications

### Session 2026-01-29

- Q: What is the shipping zone structure? → A: Single flat rate for all international destinations
- Q: Should "Notify Me" and newsletter signups use the same or separate lists? → A: Single unified newsletter list (both signups go to same list)

### Session 2026-01-30

- Q: Which Solace Starter features to retain vs. disable? → A: Retain all Solace features (user profiles, order history, product search, promo codes, blog, dark/light theming) except DigitalOcean Spaces (use Cloudinary instead)
- Q: Age gate integration approach? → A: Next.js middleware with cookie check (edge-level blocking, redirects to /age-gate page)
- Q: Payment provider? → A: Stripe (Solace default, already integrated)
- Q: Newsletter list management provider? → A: Resend Audiences (unified transactional + newsletter in one service)
- Q: Where to store age gate configuration in CMS? → A: Extend Strapi Global Settings single type with ageGateTtlDays (number) and ageGateEnabled (boolean) fields

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse and Purchase Available Product (Priority: P1)

A collector discovers BlackEyesArtisan through social media, lands on the homepage, browses the collection of handmade glass pipes, views a product they like, adds it to cart, and completes checkout with international shipping to their country.

**Why this priority**: This is the core revenue-generating journey. Without the ability to browse and purchase, the business cannot function. Every other feature builds upon this foundation.

**Independent Test**: Can be fully tested by navigating from homepage → collection → product detail → add to cart → checkout → order confirmation. Delivers the complete purchase experience.

**Acceptance Scenarios**:

1. **Given** a visitor on the homepage, **When** they click on a product collection, **Then** they see a grid of available products with images, names, and prices
2. **Given** a visitor viewing a product, **When** they click "Add to Cart", **Then** the item is added and cart count updates visibly
3. **Given** a visitor with items in cart, **When** they proceed to checkout, **Then** they can enter shipping address (including international), phone number, and payment details
4. **Given** a visitor completing checkout, **When** payment succeeds, **Then** they see an order confirmation page and receive a confirmation email

---

### User Story 2 - Age Verification Gate (Priority: P1)

A first-time visitor arrives at the site and must verify they are 18+ before accessing any content. The verification persists for a configurable duration so returning visitors don't need to re-verify each visit.

**Why this priority**: Legal compliance requirement. The site sells tobacco-related accessories and must verify age before showing any products. This is a blocking requirement for launch.

**Independent Test**: Can be tested by clearing cookies, visiting any page, verifying the gate appears, confirming age, and checking that subsequent page visits don't show the gate until TTL expires.

**Acceptance Scenarios**:

1. **Given** a new visitor without age verification, **When** they access any page, **Then** they see a full-screen age gate modal before any content loads
2. **Given** a visitor on the age gate, **When** they confirm they are 18+, **Then** the gate dismisses and they can browse the site freely
3. **Given** a visitor on the age gate, **When** they indicate they are under 18, **Then** they are redirected to an exit page and cannot access the store
4. **Given** a verified visitor returning within the TTL period, **When** they visit the site, **Then** they do not see the age gate
5. **Given** a verified visitor returning after TTL expires, **When** they visit the site, **Then** they must re-verify their age
6. **Given** a visitor at checkout, **When** they are about to complete purchase, **Then** the system re-verifies age status is still valid

---

### User Story 3 - View Sold-Out Items as Portfolio (Priority: P2)

A collector wants to see the artisan's past work, even items that are no longer available. Sold items remain visible in collections and product pages as a portfolio/gallery, clearly marked as sold, with add-to-cart disabled but newsletter signup available.

**Why this priority**: Builds trust and demonstrates craftsmanship. Collectors want to see the body of work. Also captures leads for future drops via newsletter signup on sold items.

**Independent Test**: Can be tested by marking a product as sold-out in the backend and verifying it displays with SOLD badge, disabled purchase button, and newsletter CTA.

**Acceptance Scenarios**:

1. **Given** a product with zero inventory, **When** displayed in collection grid, **Then** it shows a "SOLD" badge overlay on the image
2. **Given** a visitor on a sold-out product page, **When** they view the page, **Then** the Add to Cart button is disabled/hidden and replaced with a "Notify Me" newsletter signup
3. **Given** a visitor on a sold-out product, **When** they submit their email for notifications, **Then** they receive confirmation and are subscribed to restock/new drop notifications
4. **Given** a sold-out product, **When** inventory is added back, **Then** the SOLD badge is removed and Add to Cart becomes available

---

### User Story 4 - Newsletter Signup for Drops and Updates (Priority: P2)

A visitor interested in the artisan's work wants to be notified about new product drops and restocks. They can sign up via footer newsletter form or via sold-out product notification signup.

**Why this priority**: Essential for marketing and building customer base. Drop-based business model requires a way to notify interested buyers when new pieces are available.

**Independent Test**: Can be tested by submitting email in newsletter form and verifying subscription is recorded and welcome email is sent.

**Acceptance Scenarios**:

1. **Given** a visitor on any page, **When** they scroll to footer, **Then** they see a newsletter signup form with compelling copy
2. **Given** a visitor entering a valid email, **When** they submit the form, **Then** they see a success message and receive a welcome email
3. **Given** a visitor entering an already-subscribed email, **When** they submit, **Then** they see a message indicating they're already subscribed
4. **Given** an invalid email format, **When** submitted, **Then** the form shows validation error without page reload

---

### User Story 5 - View Order Confirmation and Receive Emails (Priority: P2)

After completing a purchase, the customer sees an order confirmation page with order details and receives a confirmation email. When the order ships, they receive a shipping notification with FedEx tracking information.

**Why this priority**: Post-purchase communication builds trust and reduces support inquiries. Essential for professional customer experience.

**Independent Test**: Can be tested by completing an order and verifying confirmation page displays correct details and email is received within expected timeframe.

**Acceptance Scenarios**:

1. **Given** a completed order, **When** the confirmation page loads, **Then** it displays order number, items purchased, shipping address, and estimated handling time
2. **Given** a completed order, **When** processed, **Then** customer receives confirmation email with order details within 5 minutes
3. **Given** an order marked as shipped with tracking number, **When** updated, **Then** customer receives shipping email with FedEx tracking link
4. **Given** order confirmation page, **When** viewed, **Then** it shows clear disclaimer about international duties/taxes being buyer's responsibility

---

### User Story 6 - International Checkout with Required Phone (Priority: P2)

An international buyer completes checkout with full address details including mandatory phone number (required by FedEx for international deliveries). They see clear shipping cost, estimated delivery timeframe, and duties/taxes disclaimer.

**Why this priority**: Business ships internationally from Nepal via FedEx. Phone number is mandatory for FedEx delivery. Clear shipping information reduces support tickets and abandoned carts.

**Independent Test**: Can be tested by completing checkout with an international address and verifying phone is required, shipping options display, and disclaimers are visible.

**Acceptance Scenarios**:

1. **Given** checkout shipping step, **When** entering address, **Then** phone number field is required and validates format
2. **Given** an international shipping address, **When** proceeding to shipping options, **Then** a single flat-rate shipping cost is displayed clearly
3. **Given** checkout payment step, **When** viewing totals, **Then** a visible disclaimer states "Duties and taxes are the buyer's responsibility"
4. **Given** checkout completion, **When** reviewing order, **Then** estimated handling time is displayed (sourced from CMS)

---

### User Story 7 - Browse Product Collections (Priority: P3)

A visitor can browse products organized into collections/categories. They can filter and navigate between different groupings of the artisan's work.

**Why this priority**: Improves discoverability and user experience for larger catalogs. Important but not blocking for initial launch with small inventory.

**Independent Test**: Can be tested by navigating to collections page and filtering by category, verifying correct products display.

**Acceptance Scenarios**:

1. **Given** homepage or navigation, **When** clicking collections link, **Then** visitor sees available product collections
2. **Given** a collection page, **When** viewing, **Then** products in that collection display in a grid with consistent card design
3. **Given** collection page, **When** products are a mix of available and sold, **Then** both display with appropriate visual distinction

---

### User Story 8 - View About/Story Page (Priority: P3)

A visitor wants to learn about the artisan, their craft, and the story behind BlackEyesArtisan. This builds trust and connection with the brand.

**Why this priority**: Important for brand building and conversion, but not blocking for basic commerce functionality.

**Independent Test**: Can be tested by navigating to About page and verifying content loads from CMS.

**Acceptance Scenarios**:

1. **Given** navigation or footer, **When** clicking About/Story link, **Then** visitor sees the artisan's story page
2. **Given** About page, **When** viewing, **Then** content is loaded from CMS and displays artisan story, craft details, and brand values

---

### User Story 9 - View Policy Pages (Priority: P3)

A visitor can access shipping policy, return policy, privacy policy, and terms of service. These are required for compliance and customer confidence.

**Why this priority**: Required for legal compliance and customer trust, but content-focused rather than functionality-focused.

**Independent Test**: Can be tested by navigating to each policy page and verifying content loads.

**Acceptance Scenarios**:

1. **Given** footer links, **When** clicking shipping policy, **Then** shipping information page displays with handling times and international shipping details
2. **Given** footer links, **When** clicking return policy, **Then** return/refund policy displays
3. **Given** footer links, **When** clicking privacy policy, **Then** privacy policy displays
4. **Given** footer links, **When** clicking terms of service, **Then** terms display

---

### Edge Cases

- What happens when a visitor adds an item to cart, but it sells out before checkout completion? → Cart should validate inventory at checkout and show error if no longer available
- How does system handle failed payment attempts? → Show clear error message and allow retry without losing cart contents
- What happens if email service is unavailable? → Order completes but email is queued for retry; order confirmation page is primary confirmation
- How does the site behave with JavaScript disabled? → Age gate should still block access; basic browsing should degrade gracefully
- What happens when visitor blocks cookies? → Age gate may appear on each visit; cart functionality may be limited; show notice about cookie requirements

## Requirements *(mandatory)*

### Functional Requirements

**Age Gate**
- **FR-001**: System MUST display age verification gate before any site content is accessible to new visitors
- **FR-002**: System MUST persist age verification status with configurable TTL (via Strapi Global Settings `ageGateTtlDays` field)
- **FR-003**: System MUST re-verify age status at checkout initiation
- **FR-004**: System MUST redirect users who decline age verification to an exit page
- **FR-040**: Age gate MUST be implemented via Next.js middleware (edge-level blocking) that checks cookie and redirects unverified visitors to `/age-gate` page before any content renders

**Product Display**
- **FR-005**: System MUST display all products (available and sold-out) in collection views
- **FR-006**: System MUST show "SOLD" badge on products with zero inventory
- **FR-007**: System MUST disable add-to-cart functionality for sold-out products
- **FR-008**: System MUST display product images, name, price, and description on product detail pages
- **FR-009**: System MUST source product data from commerce backend

**Cart & Checkout**
- **FR-010**: Users MUST be able to add available products to a persistent cart
- **FR-011**: Users MUST be able to view, update quantities, and remove items from cart
- **FR-012**: System MUST require phone number for all orders (FedEx requirement)
- **FR-013**: System MUST support international shipping addresses
- **FR-014**: System MUST display a single flat-rate shipping cost for all international destinations
- **FR-015**: System MUST display duties/taxes disclaimer during checkout
- **FR-016**: System MUST validate inventory availability before payment processing
- **FR-017**: System MUST process payments securely via Stripe (USD only, inherited from Solace)

**Email & Notifications**
- **FR-018**: System MUST send order confirmation email upon successful purchase (via Resend)
- **FR-019**: System MUST send shipping notification email with tracking link when order ships (via Resend)
- **FR-020**: System MUST support newsletter subscription with email validation (via Resend Audiences)
- **FR-021**: System MUST send welcome email upon newsletter signup (via Resend)
- **FR-022**: System MUST allow "notify me" signup on sold-out product pages (adds to Resend Audiences list)

**Content Management**
- **FR-023**: System MUST display pages and policies managed via CMS
- **FR-024**: System MUST display announcement bar content from CMS (if configured)
- **FR-025**: System MUST source handling time and shipping information from CMS

**Currency**
- **FR-026**: System MUST display all prices in USD only

**User Accounts (inherited from Solace Starter)**
- **FR-027**: Users MUST be able to register and log in to an account
- **FR-028**: Users MUST be able to view their order history
- **FR-029**: Users MUST be able to manage profile settings and shipping addresses
- **FR-030**: Users MUST be able to reset their password

**Product Search (inherited from Solace Starter)**
- **FR-031**: Users MUST be able to search products by keyword
- **FR-032**: Search results MUST display matching products with relevance ranking

**Promotional Codes (inherited from Solace Starter)**
- **FR-033**: Users MUST be able to apply promotional codes at checkout
- **FR-034**: System MUST validate and apply discounts from valid promo codes

**Blog (inherited from Solace Starter)**
- **FR-035**: System MUST display blog posts managed via CMS
- **FR-036**: Blog pages MUST be accessible from navigation

**Theming (inherited from Solace Starter)**
- **FR-037**: System MUST support dark and light theme modes
- **FR-038**: Users SHOULD be able to toggle between themes (or respect system preference)

**Image Hosting**
- **FR-039**: System MUST use Cloudinary for image optimization and delivery (NOT DigitalOcean Spaces)

### Key Entities

- **Product**: Handmade glass piece with name, description, images, price, inventory status; sourced from commerce backend
- **Collection**: Grouping of related products for browsing organization
- **Cart**: Temporary storage of products a visitor intends to purchase; persists across sessions
- **Order**: Completed purchase with customer details, items, shipping address, payment status, tracking info
- **Customer**: Person who has completed at least one order; has email, shipping addresses, order history; can have registered account
- **User Account**: Registered customer with login credentials, profile settings, saved addresses, and order history access (inherited from Solace)
- **Subscriber**: Person who has signed up for newsletter; email and subscription preferences; single unified list for both footer signup and "Notify Me" on sold-out products
- **Page**: CMS-managed content page (About, policies, etc.)
- **Blog Post**: CMS-managed blog article with title, content, publish date, and optional featured image (inherited from Solace)
- **Global Settings**: CMS-managed site configuration including: `ageGateEnabled` (boolean), `ageGateTtlDays` (number), handling times, announcement bar, theme preferences (extends Solace's existing Global Settings single type)

## Success Criteria *(mandatory)*

### Measurable Outcomes (Launch Criteria)

- **SC-001**: Visitors can complete the full purchase journey (browse → cart → checkout → confirmation) in under 5 minutes
- **SC-002**: Age gate appears within 1 second of page load for new visitors
- **SC-003**: 100% of sold-out products display SOLD badge and prevent add-to-cart
- **SC-004**: 100% of completed orders result in confirmation email delivery
- **SC-005**: Newsletter signup form captures email with 90%+ success rate on valid submissions
- **SC-010**: All pages load within 3 seconds on standard connections
- **SC-011**: Site functions correctly on mobile devices (responsive design)
- **SC-012**: International buyers can complete checkout without errors

### Post-Launch Tracking Metrics (90-Day)

- **SC-006**: Site achieves 1.5-3% conversion rate within first 90 days
- **SC-007**: Email capture rate reaches 3-8% of visitors within first 90 days
- **SC-008**: Support tickets per order remain below 0.15 (shipping clarity metric)
- **SC-009**: 98%+ of orders are successfully fulfilled with tracking information
