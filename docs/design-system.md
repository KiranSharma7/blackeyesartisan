# Black Eyes Artisan Design system

## Complete Brand & UI Guidelines

---

# 1. Brand Identity

## 1.1 Brand Overview

**Brand Name:** Black Eyes Artisan   
**Industry:** handmade glass pipes/ E-commerce  
**Personality:** Bold, playful, youthful, premium-casual, Gen-Z friendly  
**Voice:** Confident, witty, slightly irreverent, trustworthy

---

# 2. Color System

## 2.1 Primary Palette

| Token | Hex Code | RGB | Usage |
|-------|----------|-----|-------|
| `ink` | `#18181B` | rgb(24, 24, 27) | Primary text, borders, dark backgrounds, shadows |
| `paper` | `#FEF8E7` | rgb(254, 248, 231) | Primary background, light surfaces |
| `acid` | `#D63D42` | rgb(214, 61, 66) | Primary accent, CTAs, highlights, alerts |
| `stone` | `#E8DCCA` | rgb(232, 220, 202) | Secondary backgrounds, muted surfaces |
| `sun` | `#FCCA46` | rgb(252, 202, 70) | Secondary accent, highlights, badges |

## 2.2 Extended Palette

| Token | Hex Code | Usage |
|-------|----------|-------|
| `white` | `#FFFFFF` | Card backgrounds, inputs |
| `ink/10` | `#18181B` @ 10% | Subtle borders, dividers |
| `ink/20` | `#18181B` @ 20% | Light borders |
| `ink/40` | `#18181B` @ 40% | Muted text |
| `ink/50` | `#18181B` @ 50% | Secondary text |
| `ink/60` | `#18181B` @ 60% | Tertiary text |
| `paper/50` | `#FEF8E7` @ 50% | Overlay backgrounds |
| `paper/90` | `#FEF8E7` @ 90% | Frosted glass effect |
| `stone/20` | `#E8DCCA` @ 20% | Very light backgrounds |
| `acid/10` | `#D63D42` @ 10% | Subtle accent backgrounds |

## 2.3 Color Usage Guidelines

**Backgrounds:**
- Primary pages: `paper` (#FEF8E7)
- Cards/containers: `white` (#FFFFFF)
- Elevated sections: `stone` (#E8DCCA)
- Dark sections: `ink` (#18181B)
- Accent sections: `acid` (#D63D42)

**Text:**
- Primary text: `ink` (#18181B)
- On dark backgrounds: `paper` (#FEF8E7)
- On acid backgrounds: `white` (#FFFFFF)
- Muted/secondary: `ink` @ 60% opacity
- Links on dark: `acid` (#D63D42)

**Accents:**
- Primary CTA: `acid` (#D63D42)
- Secondary highlight: `sun` (#FCCA46)
- Success/verified: `acid` (#D63D42)
- Ratings: `sun` (#FCCA46)

---

# 3. Typography

## 3.1 Font Families

| Role | Font | Fallback | Weight |
|------|------|----------|--------|
| Brand | Pacifico | cursive | 400 (single weight) |
| Display | Inter | sans-serif | 400, 500, 600, 700, 800 |
| Body | Inter | sans-serif | 400, 500, 600, 700 |

## 3.2 Font Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

**Next.js Font Import:**
```typescript
import { Pacifico, Inter } from 'next/font/google'

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-brand',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})
```

## 3.3 Type Scale

| Name | Size (px) | Line Height | Weight | Font | Usage |
|------|-----------|-------------|--------|------|-------|
| Brand XL | 48-80px | 1.0-1.2 | 400 | Pacifico | Hero headlines (no uppercase) |
| Brand L | 30-40px | 1.2 | 400 | Pacifico | Major section headers |
| Display XL | 40-48px | 1.1 | 700 | Inter | Page titles (uppercase) |
| Display L | 32-40px | 1.1 | 700 | Inter | Section titles (uppercase) |
| Display M | 24-32px | 1.2 | 700 | Inter | Card titles (uppercase) |
| Display S | 18-20px | 1.3 | 700 | Inter | Subsection titles (uppercase) |
| Heading | 16-18px | 1.4 | 600-700 | Inter | Small headings |
| Body L | 16-18px | 1.5-1.6 | 500 | Inter | Large body text |
| Body M | 14-16px | 1.5 | 400-500 | Inter | Default body |
| Body S | 12-14px | 1.4 | 500 | Inter | Small body, descriptions |
| Caption | 10-12px | 1.3 | 600-700 | Inter | Labels, badges |
| Micro | 9-10px | 1.2 | 700 | Inter | Tiny labels |

## 3.4 Typography Treatments

**Brand Headings (Hero/Section Headers):**
```css
font-family: 'Pacifico', cursive;
font-weight: 400;
color: #18181B;
/* DO NOT use text-transform: uppercase with Pacifico */
/* Script fonts break when uppercased */
```

**Display Headings (UI Elements):**
```css
font-family: 'Inter', sans-serif;
font-weight: 700; /* REQUIRED: Inter needs explicit weights */
text-transform: uppercase;
letter-spacing: -0.02em; /* tracking-tight */
color: #18181B;
```

**Standard Text:**
```css
font-family: 'Inter', sans-serif;
font-weight: 400; /* Regular for body text */
color: #18181B;
```

**Emphasized Text:**
```css
font-family: 'Inter', sans-serif;
font-weight: 500-600; /* Medium to Semibold */
color: #18181B;
```

**Text Outline Effect:**
```css
.text-outline {
  -webkit-text-stroke: 1.5px #18181B;
  color: transparent;
}

.text-outline-acid {
  -webkit-text-stroke: 1px #D63D42;
  color: transparent;
}

.text-outline-paper {
  -webkit-text-stroke: 1px #FEF8E7;
  color: transparent;
}
```

**Text Shadow Effect:**
```css
.text-shadow-sm {
  text-shadow: 2px 2px 0px #18181B;
}
```

**Uppercase Labels:**
```css
font-family: 'Inter', sans-serif;
text-transform: uppercase;
letter-spacing: 0.1em; /* tracking-widest */
font-size: 10-12px;
font-weight: 700;
```

**Font Usage Guidelines:**

✅ **Use Pacifico (`font-brand`) for:**
- Homepage hero headlines
- Major section headers on landing pages
- Logo text
- Large decorative text (24px+)

❌ **Never use Pacifico for:**
- Buttons, navigation, product titles
- Form labels, inputs
- Small text (under 24px)
- Uppercase text (script fonts break)
- Any UI elements requiring scannability

✅ **Use Inter Bold (`font-display font-bold`) for:**
- All buttons and CTAs
- Navigation links
- Product and collection titles
- Cart and checkout headers
- All UI headings (H2-H6)
- Keep `uppercase` transformation

✅ **Use Inter Regular/Medium (`font-sans`) for:**
- Body paragraphs and descriptions
- Form inputs
- Captions and labels
- Footer links

---

# 4. Spacing System

## 4.1 Base Unit

Base spacing unit: **4px**

## 4.2 Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| 0.5 | 2px | Micro gaps |
| 1 | 4px | Tight spacing |
| 2 | 8px | Small gaps |
| 3 | 12px | Component padding (small) |
| 4 | 16px | Default padding |
| 5 | 20px | Default spacing |
| 6 | 24px | Section gaps (small) |
| 8 | 32px | Section padding |
| 10 | 40px | Large gaps |
| 12 | 48px | Section spacing |
| 16 | 64px | Page sections |
| 20 | 80px | Large section padding |

## 4.3 Container Widths

| Context | Max Width | Usage |
|---------|-----------|-------|
| Content | 1280px (`max-w-7xl`) | Main content wrapper |
| Form | 448px (`max-w-md`) | Forms, newsletter inputs |
| Text | 512px (`max-w-lg`) | Text blocks |
| Narrow | 672px (`max-w-2xl`) | Centered content |

## 4.4 Page Margins

- Mobile: `px-4` (16px)
- Desktop: `px-8` (32px)

---

# 5. Border & Shadow System

## 5.1 Border Styles

**Primary Border:**
```css
border: 2px solid #18181B;
```

**Light Border:**
```css
border: 1px solid #18181B;
```

**Dashed Divider:**
```css
border-top: 2px dashed rgba(24, 24, 27, 0.1);
```

**Subtle Border:**
```css
border: 1px solid rgba(24, 24, 27, 0.2);
```

## 5.2 Shadow System (Hard Shadows)

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-hard-sm` | `2px 2px 0px 0px #18181B` | Small elements, buttons |
| `shadow-hard` | `4px 4px 0px 0px #18181B` | Cards, default |
| `shadow-hard-xl` | `8px 8px 0px 0px #18181B` | Large cards, hero images |
| `shadow-hard-acid` | `4px 4px 0px 0px #D63D42` | Accent shadow |
| `shadow-hard-sun` | `4px 4px 0px 0px #FCCA46` | Highlight shadow |

## 5.3 Shadow Usage Pattern

**Hover Effect (Lift):**
```css
/* Default state */
box-shadow: 2px 2px 0px 0px #18181B;

/* Hover state */
box-shadow: none;
transform: translate(2px, 2px);
```

**Hover Effect (Grow):**
```css
/* Default state */
box-shadow: 4px 4px 0px 0px #18181B;

/* Hover state */
transform: translate(-1px, -1px);
box-shadow: 6px 6px 0px 0px #18181B;
```

---

# 6. Border Radius System

| Token | Value | Usage |
|-------|-------|-------|
| `rounded` | 4px | Small elements |
| `rounded-md` | 6px | Tags, small badges |
| `rounded-lg` | 8px | Buttons, inputs |
| `rounded-xl` | 12px | Cards, containers |
| `rounded-2xl` | 16px | Large cards |
| `rounded-[2rem]` | 32px | Hero images, featured cards |
| `rounded-full` | 9999px | Pills, avatars, circular buttons |

---

# 15. Design Principles

## 15.1 Core Principles

1. **Bold & Playful:** Use hard shadows, strong borders, and playful rotations
2. **Contrast is King:** High contrast between backgrounds and content
3. **Tactile Feel:** Design elements that feel "pressable" with shadow effects
4. **Youthful Energy:** Witty copy, emoji accents (✸), uppercase display text
5. **Premium Casual:** High-quality feel without being stuffy

## 15.2 Do's

- Use 2px borders consistently
- Apply hard shadows (no blur)
- Keep display text uppercase
- Use the warm paper background
- Add playful micro-interactions (rotations, lifts)
- Maintain high contrast

## 15.3 Don'ts

- Don't use soft/blurred shadows
- Don't use thin (1px) primary borders
- Don't mix too many colors in one component
- Don't use rounded corners larger than 2rem
- Don't forget hover states
- Don't use generic system fonts

---

# 16. Responsive Breakpoints

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| Default | 0px | Mobile-first base |
| `sm:` | 640px | Small tablets |
| `md:` | 768px | Tablets / small laptops |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large screens |

---

*This design system document covers all visual and interactive elements extracted from the Arovell product page. Use these tokens, components, and patterns to maintain consistency across all pages and features.*