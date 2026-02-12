# Homepage Design Plan - BlackEyesArtisan

**Date**: 2026-02-10
**Approach**: Hybrid Art + Story + Shop
**Design Language**: Dark cinematic hero transitioning to bold/playful product sections

---

## Page Structure (Top to Bottom)

```
1. Age Gate Modal (minimal, blurred backdrop)
2. Announcement Bar
3. Sticky Navigation
4. Hero Section (dark, full-bleed)
   ── transition: dark → warm ──
5. New Arrivals (carousel)
6. Browse by Category (2x2 grid)
7. The Craft (video + process steps)
8. Customer Reviews
9. Newsletter CTA
10. Footer
```

---

## 1. Age Gate

**Style**: Minimal modal popup over blurred hero background.

- **Trigger**: Fires on first visit, persisted with TTL (re-checked at checkout)
- **Visual**: Centered card on dark `backdrop-blur-lg` overlay
  - Logo (Pacifico brand text or logo.png)
  - Heading: "Are you 18 or older?"
  - Two buttons: "Yes, Enter" (acid red CTA) / "No, Leave" (outline)
- **Background**: Hero is visible but blurred behind the overlay, teasing the site

---

## 2. Hero Section

**Background**: Full-viewport height, dark (`#0a0a0a` or ink `#18181B`).

### Layout

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   [Left side - 50%]          [Right side - 50%]     │
│                                                     │
│   Handcrafted               ┌───────────────────┐   │
│   Glass Art                 │                   │   │
│                             │  Hero Product     │   │
│   One-of-a-kind boro-       │  Image            │   │
│   silicate pieces, born     │  (Green Octopus   │   │
│   from fire in the heart    │   or best piece)  │   │
│   of Nepal.                 │                   │   │
│                             └───────────────────┘   │
│   [Shop Collection] [Watch the Process]             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Typography
- **Brand heading**: `font-brand` (Pacifico), 56-72px, white (`#FAFAFA`)
- **Subheading**: `font-sans` (Inter), 18px, muted white (`rgba(255,255,255,0.7)`)
- **Primary CTA**: "Shop Collection" - acid red bg (`#D63D42`), white text, `shadow-hard` with ink
- **Secondary CTA**: "Watch the Process" - text link, white with underline, scrolls to craft section

### Product Image
- Full-bleed or contained hero shot of the most striking piece
- Subtle glow/ambient light effect around the glass (CSS `box-shadow` or radial gradient)
- The translucent/iridescent glass colors pop against the dark background

### Mobile
- Stacked: Image on top (60vh), text below
- Heading scales down to 36-42px
- CTAs stack vertically, full-width

### Transition to Next Section
- Diagonal clip-path or gradient fade from dark (`#0a0a0a`) to warm paper (`#FEF8E7`)

---

## 3. New Arrivals Section

**Background**: `paper` (#FEF8E7) - the playful zone begins.

### Layout
- **Section heading**: "NEW ARRIVALS" in uppercase Inter Bold, with acid-red accent underline (4px wide, 40px long)
- **Subtitle**: "Fresh from the studio" in Inter Regular, `ink/60` color
- Horizontal scrollable carousel
  - Desktop: 4 visible cards + arrow navigation
  - Mobile: 1.5 visible cards + swipe
  - Shows up to 8 products

### Product Card Design
```
┌──────────────────────┐  ← 2px ink border
│ ┌──────────────────┐ │
│ │                  │ │  ← Product image (1:1 ratio)
│ │   Product Photo  │ │     Hover: scale(1.05)
│ │                  │ │
│ └──────────────────┘ │
│                      │
│  PRODUCT NAME        │  ← Inter Bold, uppercase, 14px
│  $299.99             │  ← acid red, Inter Bold, 18px
│                      │
│  [ADD TO CART]       │  ← Appears on hover (desktop)
│                      │     Always visible on mobile
└──────────────────────┘
   ████                   ← shadow-hard (4px 4px 0 0 ink)
```

### Badges (overlaid on image)
- **SOLD**: sun yellow badge, top-right, ink text
- **NEW**: acid red badge, top-left
- **1 LEFT**: outline badge, top-right

---

## 4. Browse by Category

**Background**: `paper` (#FEF8E7), continues seamlessly.

### Layout
- **Section heading**: "SHOP BY COLLECTION" in uppercase Inter Bold
- 2x2 grid on desktop, 1-column stack on mobile
- Cards are large (roughly 50% width each)

### Category Cards

| Position | Category | Suggested Image |
|----------|----------|-----------------|
| Top-left | Octopus Sculptures | Signature octopus piece (green iridescent) |
| Top-right | Hand Pipes | Best hand pipe photo |
| Bottom-left | Bubblers | Best bubbler photo |
| Bottom-right | Sherlocks | Best sherlock photo |

### Card Design
```
┌──────────────────────────────┐  ← 2px ink border
│                              │
│      [Large Photo]           │  ← 3:2 aspect ratio
│      with dark gradient      │     Bottom gradient overlay
│      overlay at bottom       │
│                              │
│   ──────────────────────     │
│   Octopus                    │  ← Pacifico, 28px, white
│   Sculptures                 │     Positioned over gradient
│   SHOP NOW →                 │  ← Inter Bold, uppercase, 12px
│                              │
└──────────────────────────────┘
   ████████████████████████████   ← shadow-hard-xl on hover
```

### Hover Effect
- Image `scale(1.03)`
- Shadow lifts from `shadow-hard` to `shadow-hard-xl`
- "SHOP NOW" text slides in or opacity fades in
- `cursor-pointer`
- `transition-all duration-300`

---

## 5. The Craft Section

**Background**: `stone` (#E8DCCA) for visual separation.

### Part A: Video Embed

```
┌─────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────┐ │
│ │                                             │ │
│ │          Glass-Blowing Process Video        │ │  ← 16:9
│ │          (YouTube/Cloudinary embed)         │ │     2px ink border
│ │          with custom play button            │ │     shadow-hard-xl
│ │                                             │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│              Born from Fire                     │  ← Pacifico, 36-48px
│                                                 │
│   Every piece is hand-sculpted in our           │  ← Inter, 16px, ink/70
│   Kathmandu studio using traditional            │
│   glass-blowing techniques.                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Part B: Process Steps (4 columns)

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│    01    │ │    02    │ │    03    │ │    04    │
│          │ │          │ │          │ │          │
│  [icon]  │ │  [icon]  │ │  [icon]  │ │  [icon]  │
│          │ │          │ │          │ │          │
│   HEAT   │ │  SHAPE   │ │  DETAIL  │ │   SHIP   │
│          │ │          │ │          │ │          │
│ Boro-    │ │ Hand-    │ │ Tenta-   │ │ Triple-  │
│ silicate │ │ sculpted │ │ cles &   │ │ protected│
│ glass    │ │ into     │ │ eyes     │ │ packaging│
│ heated   │ │ organic  │ │ added    │ │ ships    │
│ to       │ │ forms,   │ │ one by   │ │ world-   │
│ 1500°F   │ │ no molds │ │ one      │ │ wide     │
│          │ │          │ │          │ │          │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

### Step Card Style
- `paper` background, 2px ink border, `shadow-hard`
- Step number: acid red, Inter Bold, 32px
- Icon: SVG (Lucide icons - `Flame`, `Hand`, `Eye`, `Package`)
- Title: Inter Bold, uppercase, 14px
- Description: Inter Regular, 13px, `ink/60`
- Mobile: 2x2 grid or horizontal scroll

---

## 6. Customer Reviews

**Background**: `paper` (#FEF8E7).

### Layout
- **Section heading**: "WHAT COLLECTORS SAY" in uppercase Inter Bold
- 3-column grid, stacked on mobile
- Maximum 3 reviews displayed (with "See All Reviews" link)

### Review Card Design
```
┌──────────────────────────────┐  ← 2px ink border
│                              │
│  ★ ★ ★ ★ ★                  │  ← sun yellow stars
│                              │
│  "Absolutely amazed by the   │  ← Inter, 14px, ink
│   beautiful piece..."        │     Truncated to 3 lines
│                              │
│  ─────────────────────       │
│  Dylan D.                    │  ← Inter Bold, 13px
│  Verified Purchase           │  ← Inter, 12px, ink/50
│                              │     + green checkmark icon
│  [tiny product thumbnail]    │
│                              │
└──────────────────────────────┘
   ████████████████████████████   ← shadow-hard
```

### Variants (alternate card accent colors for visual interest)
- Card 1: Default (`paper` bg)
- Card 2: `stone` bg
- Card 3: Default (`paper` bg)

---

## 7. Newsletter CTA

**Background**: Full-width acid red (`#D63D42`) banner.

### Layout
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│          Join the Tentacle Club                     │  ← Pacifico, white, 36px
│                                                     │
│   Get first access to new drops, exclusive pieces,  │  ← Inter, white/80, 16px
│   and behind-the-scenes content.                    │
│                                                     │
│   ┌────────────────────────────┐ ┌──────────────┐  │
│   │ Enter your email           │ │  SUBSCRIBE   │  │
│   └────────────────────────────┘ └──────────────┘  │
│    ↑ paper bg, ink border         ↑ ink bg, paper   │
│                                     text, shadow    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 8. Footer

**Background**: ink (`#18181B`).

Standard footer with:
- Logo (Pacifico brand text in white)
- Navigation columns: Shop, About, Support, Legal
- Social media icons (Instagram, Etsy, TikTok)
- Payment method icons
- Copyright + age disclaimer

---

## Design Tokens Reference

| Token | Value | Usage |
|-------|-------|-------|
| `ink` | #18181B | Text, borders, dark backgrounds |
| `paper` | #FEF8E7 | Primary warm background |
| `acid` | #D63D42 | CTAs, prices, accents |
| `stone` | #E8DCCA | Secondary background |
| `sun` | #FCCA46 | Stars, badges, highlights |
| `hero-dark` | #0a0a0a | Hero section background |
| `font-brand` | Pacifico | Decorative headings (24px+) |
| `font-display` | Inter Bold | UI headings, buttons (uppercase) |
| `font-sans` | Inter | Body text |
| `shadow-hard` | 4px 4px 0 0 ink | Standard card shadow |
| `shadow-hard-xl` | 8px 8px 0 0 ink | Hover/elevated shadow |
| `border` | 2px solid ink | Standard component border |

---

## Responsive Breakpoints

| Breakpoint | Hero | New Arrivals | Categories | Craft Steps | Reviews |
|------------|------|--------------|------------|-------------|---------|
| Mobile (<640px) | Stacked, 36px heading | 1.5 cards visible, swipe | 1 column | 2x2 grid | 1 column |
| Tablet (640-1024px) | Stacked, 48px heading | 2.5 cards visible | 2 columns | 4 columns | 2 columns |
| Desktop (1024px+) | Side-by-side, 56-72px heading | 4 cards visible + arrows | 2x2 grid | 4 columns | 3 columns |

---

## Implementation Notes

### Data Sources
- **New Arrivals**: Fetched from Medusa API (sorted by `created_at` desc, limit 8)
- **Categories/Collections**: Fetched from Medusa collections API
- **Reviews**: Pulled from Medusa orders/reviews or hardcoded initially (until review system is built)
- **Craft Video**: Hosted on Cloudinary or YouTube, URL from Strapi CMS global settings
- **Announcement Bar**: Content from Strapi CMS

### Performance Considerations
- Hero image: Use Next.js `<Image>` with `priority` flag for LCP optimization
- Product images: Lazy loaded with blur placeholders via Cloudinary
- Video: Lazy loaded, only loads when section enters viewport
- Carousel: CSS scroll-snap for smooth native scrolling (no heavy JS library)

### Accessibility
- Age gate: Focus trap when modal is open, `aria-modal`, escape key to close
- Carousel: Arrow key navigation, proper `aria-label` on nav buttons
- All images: Descriptive alt text from product data
- Color contrast: All text meets 4.5:1 WCAG AA minimum
- `prefers-reduced-motion`: Disable hover animations, auto-scroll

### Files to Create/Modify
- `storefront/src/app/[countryCode]/(main)/page.tsx` - Rewrite homepage
- `storefront/src/modules/home/` - New module for homepage sections
  - `components/hero.tsx` - Dark hero section
  - `components/new-arrivals.tsx` - Product carousel
  - `components/category-grid.tsx` - Browse by collection
  - `components/the-craft.tsx` - Video + process steps
  - `components/reviews.tsx` - Customer reviews
  - `components/newsletter.tsx` - Email signup CTA
- `storefront/src/modules/age-gate/` - Update modal styling
- `storefront/tailwind.config.js` - Add `hero-dark` color if needed
