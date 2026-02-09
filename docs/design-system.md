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

# 7. Component Library

## 7.1 Buttons

### Primary Button (CTA)
```html
<button class="bg-acid text-white border-2 border-ink rounded-xl font-display font-bold
               text-lg px-6 py-3 shadow-hard-sm uppercase tracking-wide
               hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]
               transition-all">
    ADD TO CART
</button>
```

### Secondary Button (Dark)
```html
<button class="bg-ink text-white px-4 py-2 rounded-lg font-display font-bold text-sm
               border-2 border-ink shadow-hard-sm uppercase
               hover:bg-acid hover:shadow-none
               hover:translate-x-[2px] hover:translate-y-[2px]
               transition-all">
    CART (1)
</button>
```

### Outline Button
```html
<button class="border-2 border-ink rounded-xl px-6 py-3 font-display font-bold uppercase
               hover:bg-ink hover:text-paper transition-colors">
    LEARN MORE
</button>
```

### Icon Button
```html
<button class="p-2 rounded-lg border border-transparent
               hover:bg-sun hover:border-ink transition-all">
    <iconify-icon icon="solar:magnifer-linear" width="22"></iconify-icon>
</button>
```

### Circular Navigation Button
```html
<button class="w-10 h-10 border-2 border-ink rounded-full flex items-center justify-center 
               hover:bg-ink hover:text-paper transition-colors">
    <iconify-icon icon="solar:arrow-right-linear" width="20"></iconify-icon>
</button>
```

### Floating Action Button
```html
<button class="bg-paper p-3 rounded-full border-2 border-ink shadow-hard 
               hover:bg-sun transition-colors">
    <iconify-icon icon="solar:maximize-square-3-linear" width="20"></iconify-icon>
</button>
```

## 7.2 Navigation

### Sticky Navigation Bar
```html
<nav class="sticky top-4 z-50 px-4 md:px-8 mb-8">
    <div class="bg-paper/90 backdrop-blur-md border-2 border-ink rounded-xl shadow-hard 
                flex justify-between items-center p-4">
        <!-- Logo -->
        <a href="#" class="text-2xl md:text-3xl font-brand">
            Black<span class="text-acid">Eyes</span>
        </a>
        
        <!-- Nav Links -->
        <div class="hidden md:flex items-center gap-8 font-semibold text-sm tracking-tight">
            <a href="#" class="hover:text-acid hover:underline 
                              decoration-2 decoration-acid underline-offset-4 
                              transition-all">NEW DROPS</a>
        </div>
        
        <!-- Actions -->
        <div class="flex items-center gap-3">
            <!-- Search, Cart buttons -->
        </div>
    </div>
</nav>
```

### Breadcrumb
```html
<div class="flex items-center gap-2 text-sm font-semibold opacity-60 mb-8">
    <a href="#" class="hover:text-ink hover:underline">Home</a>
    <iconify-icon icon="solar:alt-arrow-right-linear" width="16"></iconify-icon>
    <a href="#" class="hover:text-ink hover:underline">Category</a>
    <iconify-icon icon="solar:alt-arrow-right-linear" width="16"></iconify-icon>
    <span class="text-ink opacity-100 border-b-2 border-acid">Current Page</span>
</div>
```

## 7.3 Cards

### Product Card
```html
<div class="group relative bg-white border-2 border-ink rounded-2xl overflow-hidden 
            hover:shadow-hard-xl transition-all duration-300">
    <!-- Badge -->
    <div class="absolute top-3 left-3 z-10">
        <span class="bg-paper border border-ink px-2 py-0.5 text-[10px] 
                     font-bold rounded uppercase">Fresh</span>
    </div>
    
    <!-- Image Container -->
    <div class="aspect-[4/5] bg-stone/20 border-b-2 border-ink relative overflow-hidden 
                p-6 flex items-center justify-center">
        <img src="..." class="w-full h-full object-contain 
                             group-hover:scale-110 transition-transform duration-500">
        
        <!-- Hover Action -->
        <div class="absolute inset-x-4 bottom-4 translate-y-20 
                    group-hover:translate-y-0 transition-transform duration-300">
            <button class="w-full bg-ink text-white font-display text-sm py-3 
                          rounded-xl shadow-md hover:bg-acid transition-colors">
                Add <span class="font-sans font-bold">$14</span>
            </button>
        </div>
    </div>
    
    <!-- Content -->
    <div class="p-4">
        <h3 class="font-display font-bold text-lg leading-tight uppercase mb-1">Product Name</h3>
        <div class="flex gap-1 text-[10px] font-bold text-ink/50 uppercase">
            <span>Note 1</span> • <span>Note 2</span> • <span>Note 3</span>
        </div>
    </div>
</div>
```

### Feature Card
```html
<div class="flex flex-col items-start gap-4 p-6 bg-paper border-2 border-ink 
            rounded-2xl shadow-hard hover:shadow-hard-acid transition-all duration-300">
    <div class="w-12 h-12 bg-acid text-white rounded-lg border-2 border-ink 
                flex items-center justify-center shadow-sm">
        <iconify-icon icon="solar:dropper-minimalistic-2-linear" width="24"></iconify-icon>
    </div>
    <div>
        <h3 class="font-display font-bold text-xl uppercase mb-2">Feature Title</h3>
        <p class="text-sm font-medium opacity-70 leading-relaxed">
            Feature description text goes here.
        </p>
    </div>
</div>
```

### Info Card with Badge
```html
<div class="bg-white border-2 border-ink rounded-xl p-6 relative shadow-sm">
    <div class="absolute -top-3 left-4 bg-acid text-white border-2 border-ink 
                px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
        <iconify-icon icon="solar:magic-stick-3-linear" width="14"></iconify-icon>
        <span class="text-xs font-bold uppercase tracking-wide">Label</span>
    </div>
    <p class="text-sm md:text-base leading-relaxed font-medium mt-2">
        Card content goes here.
    </p>
</div>
```

### Review Card (Light)
```html
<div class="bg-white p-6 border-2 border-ink rounded-2xl shadow-hard 
            hover:-rotate-1 transition-transform duration-300">
    <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-acid text-white rounded-full border border-ink 
                       flex items-center justify-center font-bold text-xs">JD</div>
            <div>
                <p class="font-bold text-sm leading-none">Name</p>
                <p class="text-[10px] text-ink/50 font-bold uppercase">Verified Buyer</p>
            </div>
        </div>
        <div class="flex text-sun">
            <!-- Star icons -->
        </div>
    </div>
    <p class="font-medium text-sm leading-relaxed">"Review text..."</p>
</div>
```

### Review Card (Dark)
```html
<div class="bg-ink text-paper p-6 border-2 border-ink rounded-2xl shadow-hard-acid 
            hover:rotate-1 transition-transform duration-300">
    <!-- Same structure, inverted colors -->
</div>
```

### Review Card (Accent)
```html
<div class="bg-acid text-white p-6 border-2 border-ink rounded-2xl shadow-hard 
            hover:scale-[1.02] transition-transform duration-300">
    <!-- Same structure with white text -->
</div>
```

## 7.4 Form Elements

### Text Input
```html
<input type="email" placeholder="your@email.com" 
       class="flex-1 bg-white text-ink border-2 border-ink rounded-xl px-4 py-3 
              font-bold focus:outline-none focus:shadow-hard-sun transition-all 
              placeholder:text-ink/40">
```

### Radio Selection (Size Selector)
```html
<label class="cursor-pointer relative group">
    <input type="radio" name="size" class="peer sr-only">
    <div class="border-2 border-ink rounded-xl p-3 hover:shadow-hard transition-all 
                bg-paper h-full flex flex-col items-center justify-center text-center
                peer-checked:bg-ink peer-checked:text-paper peer-checked:shadow-hard">
        <span class="font-display text-lg">5ml</span>
        <div class="text-[9px] uppercase font-bold mt-1 opacity-60">Starter</div>
    </div>
</label>
```

### Quantity Selector
```html
<div class="flex items-center border-2 border-ink rounded-xl bg-white h-14 w-32">
    <button class="flex-1 h-full hover:bg-stone rounded-l-lg transition-colors 
                   font-bold text-lg">-</button>
    <span class="font-display text-xl w-8 text-center">1</span>
    <button class="flex-1 h-full hover:bg-stone rounded-r-lg transition-colors 
                   font-bold text-lg">+</button>
</div>
```

### Select Dropdown
```html
<select class="text-[10px] font-bold bg-white px-1 py-0.5 rounded 
               border border-ink cursor-pointer outline-none hover:bg-gray-50">
    <option>10ml</option>
    <option>15ml</option>
    <option>30ml</option>
</select>
```

## 7.5 Accordion/Details

```html
<details class="group bg-paper border-2 border-ink rounded-xl overflow-hidden cursor-pointer">
    <summary class="flex items-center justify-between p-4 font-bold select-none 
                    hover:bg-white transition-colors">
        <span class="flex items-center gap-3">
            <iconify-icon icon="solar:bottle-linear" width="20"></iconify-icon>
            Section Title
        </span>
        <iconify-icon icon="solar:add-circle-linear" width="20" 
                      class="transition-transform group-open:rotate-45"></iconify-icon>
    </summary>
    <div class="p-6 pt-0 border-t-2 border-dashed border-ink/10 mt-2 bg-white">
        <!-- Content -->
    </div>
</details>
```

## 7.6 Badges & Tags

### Category Badge
```html
<span class="bg-paper border border-ink px-2 py-0.5 text-[10px] font-bold 
             rounded uppercase">Fresh</span>
```

### Hot Badge
```html
<span class="bg-acid text-white border border-ink px-2 py-0.5 text-[10px] 
             font-bold rounded uppercase">Hot</span>
```

### Rating Badge
```html
<div class="flex items-center gap-1 text-ink bg-sun px-2 py-1 rounded 
            text-xs font-bold border border-ink shadow-sm">
    <iconify-icon icon="solar:star-bold" width="12"></iconify-icon>
    4.9 (124 reviews)
</div>
```

### Stock Badge
```html
<span class="bg-ink text-paper text-xs font-bold px-2 py-1 rounded">IN STOCK</span>
```

### Promo Badge
```html
<div class="bg-sun text-ink px-4 py-2 rounded-lg border-2 border-ink shadow-md 
            flex items-center gap-2">
    <iconify-icon icon="solar:cup-star-linear" width="18"></iconify-icon>
    <span class="font-display text-xs tracking-wider">Top Rated</span>
</div>
```

### Pill Badge
```html
<div class="inline-flex items-center gap-2 bg-ink text-sun px-3 py-1 
            rounded-full border border-paper shadow-sm">
    <iconify-icon icon="solar:letter-linear" width="16"></iconify-icon>
    <span class="text-xs font-bold uppercase">Label</span>
</div>
```

### Tag Pill
```html
<span class="border border-ink rounded-full px-3 py-1 text-xs font-bold 
             hover:bg-ink hover:text-paper transition-colors cursor-default">
    Sweet
</span>
```

### Scent Note Tag
```html
<span class="bg-paper border border-ink px-2 py-1 rounded-md text-xs font-semibold">
    Lavender
</span>
```

## 7.7 Image Containers

### Hero Image Container
```html
<div class="relative bg-white border-2 border-ink rounded-[2rem] shadow-hard-xl 
            overflow-hidden aspect-square md:aspect-[4/3] group">
    <img src="..." class="absolute inset-0 w-full h-full object-cover object-center 
                         group-hover:scale-105 transition-transform duration-700">
</div>
```

### Thumbnail Gallery
```html
<div class="grid grid-cols-4 gap-4">
    <button class="relative rounded-xl border-2 border-ink overflow-hidden 
                   aspect-square bg-acid shadow-hard-sm 
                   hover:-translate-y-1 transition-transform">
        <img src="..." class="w-full h-full object-cover opacity-80 hover:opacity-100">
    </button>
    <!-- More thumbnails... -->
</div>
```

---

# 8. Layout Patterns

## 8.1 Grid System

**Product Grid:**
```html
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
    <!-- Cards -->
</div>
```

**Feature Grid:**
```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <!-- Feature cards -->
</div>
```

**Product Detail Layout:**
```html
<div class="grid lg:grid-cols-12 gap-12 items-start">
    <div class="lg:col-span-7 sticky top-32">
        <!-- Image gallery -->
    </div>
    <div class="lg:col-span-5 flex flex-col gap-8">
        <!-- Product details -->
    </div>
</div>
```

**Footer Grid:**
```html
<div class="grid grid-cols-2 md:grid-cols-4 gap-10">
    <!-- Footer columns -->
</div>
```

## 8.2 Masonry Layout

```html
<div class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
    <div class="break-inside-avoid">
        <!-- Card content -->
    </div>
</div>
```

## 8.3 Section Patterns

**Standard Section:**
```html
<section class="py-16 md:py-20 bg-paper">
    <div class="max-w-7xl mx-auto px-4 md:px-8">
        <!-- Content -->
    </div>
</section>
```

**Accent Section:**
```html
<section class="py-16 bg-acid text-white border-t-2 border-ink">
    <!-- Content -->
</section>
```

**Dark Section:**
```html
<section class="bg-ink text-paper py-16 border-b-2 border-ink overflow-hidden relative">
    <!-- Dot pattern background -->
    <div class="absolute inset-0 opacity-5" 
         style="background-image: radial-gradient(#F8F4E8 1px, transparent 1px); 
                background-size: 20px 20px;"></div>
    <div class="relative z-10">
        <!-- Content -->
    </div>
</section>
```

---

# 9. Animation System

## 9.1 Keyframe Animations

### Marquee
```css
@keyframes marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-100%); }
}
.animate-marquee {
    animation: marquee 25s linear infinite;
}
```

### Float
```css
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}
.animate-float {
    animation: float 4s ease-in-out infinite;
}
```

### Pulse Slow
```css
.animate-pulse-slow {
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

## 9.2 Transition Presets

| Type | Value | Usage |
|------|-------|-------|
| Default | `transition-all` | General transitions |
| Colors | `transition-colors` | Color changes only |
| Transform | `transition-transform` | Position/scale changes |
| Duration | `duration-300` | Standard (300ms) |
| Duration Slow | `duration-500` | Slower (500ms) |
| Duration Image | `duration-700` | Images (700ms) |

## 9.3 Hover Effects

**Scale Up (Images):**
```css
group-hover:scale-105  /* subtle */
group-hover:scale-110  /* standard */
```

**Translate Up:**
```css
hover:-translate-y-1
```

**Shadow Press:**
```css
shadow-hard-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]
```

**Rotate:**
```css
hover:-rotate-1  /* slight left */
hover:rotate-1   /* slight right */
```

**Opacity:**
```css
opacity-60 hover:opacity-100
```

**Slide Up (Card Action):**
```css
translate-y-20 group-hover:translate-y-0
```

---

# 10. Iconography

## 10.1 Icon System

**Library:** Iconify with Solar icon set  
**Import:**
```html
<script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
```

## 10.2 Icon Sizes

| Size | Pixels | Usage |
|------|--------|-------|
| xs | 12px | Inline badges |
| sm | 14-16px | Small UI elements |
| md | 18-20px | Buttons, nav |
| lg | 22-24px | Feature icons |
| xl | 32px | Large features |
| 2xl | 40px | Section headers |

## 10.3 Common Icons Used

| Icon | Name | Usage |
|------|------|-------|
| Menu | `solar:hamburger-menu-linear` | Mobile menu |
| Search | `solar:magnifer-linear` | Search |
| Cart | `solar:bag-5-linear` | Shopping cart |
| Star (filled) | `solar:star-bold` | Ratings |
| Star (outline) | `solar:star-linear` | Empty rating |
| Arrow Right | `solar:arrow-right-linear` | Links, navigation |
| Arrow Left | `solar:arrow-left-linear` | Back navigation |
| Chevron Right | `solar:alt-arrow-right-linear` | Breadcrumbs |
| Plus | `solar:add-circle-linear` | Accordion expand |
| Check | `solar:check-circle-bold` | Verified |
| Shield | `solar:shield-check-linear` | Trust badge |
| Delivery | `solar:delivery-linear` | Shipping |
| Lock | `solar:lock-keyhole-linear` | Secure payment |
| Gift | `solar:gift-linear` | Bundle/promo |
| Test Tube | `solar:test-tube-linear` | Decant info |
| Bottle | `solar:bottle-linear` | Product info |
| Dropper | `solar:dropper-minimalistic-2-linear` | Authenticity |
| Wallet | `solar:wallet-money-linear` | Pricing |
| Box | `solar:box-minimalistic-linear` | Packaging |
| Letter | `solar:letter-linear` | Newsletter |
| Chat | `solar:chat-round-dots-linear` | Reviews |
| Maximize | `solar:maximize-square-3-linear` | Expand image |
| Refresh | `solar:refresh-circle-linear` | Swap/change |
| Play | `solar:play-circle-linear` | Video |

## 10.4 Icon Usage Pattern

```html
<iconify-icon icon="solar:star-bold" width="16" class="text-sun"></iconify-icon>
```

---

# 11. Special Components

## 11.1 Marquee Banner

```html
<div class="bg-acid text-white overflow-hidden py-3 border-b-2 border-ink">
    <div class="flex animate-marquee whitespace-nowrap">
        <div class="flex items-center gap-12 mx-4 font-display uppercase text-sm tracking-widest">
            <span>✸ Message 1</span>
            <span>✸ Message 2</span>
            <span>✸ Message 3</span>
            <!-- Duplicate for seamless loop -->
        </div>
    </div>
</div>
```

## 11.2 Newsletter Section

```html
<section class="bg-acid border-t-2 border-ink py-16 text-white overflow-hidden relative">
    <!-- Background text -->
    <div class="absolute top-0 left-0 w-full h-full opacity-10 font-display text-9xl 
                leading-none whitespace-nowrap select-none pointer-events-none -translate-y-12">
        SUBSCRIBE SUBSCRIBE SUBSCRIBE
    </div>
    
    <div class="max-w-2xl mx-auto px-4 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 bg-ink text-sun px-3 py-1 
                    rounded-full border border-paper shadow-sm mb-4">
            <iconify-icon icon="solar:letter-linear" width="16"></iconify-icon>
            <span class="text-xs font-bold uppercase">The Scent Club</span>
        </div>
        <h2 class="font-brand text-4xl md:text-5xl mb-4">Don't Smell Boring.</h2>
        <p class="font-medium opacity-90 mb-8 text-lg">
            Join 15,000+ others getting weekly scent guides and exclusive drops.
        </p>
        <form class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="your@email.com" 
                   class="flex-1 bg-white text-ink border-2 border-ink rounded-xl 
                          px-4 py-3 font-bold focus:outline-none focus:shadow-hard-sun 
                          transition-all placeholder:text-ink/40">
            <button type="button" class="bg-ink text-white border-2 border-ink rounded-xl
                                        px-6 py-3 font-display font-bold uppercase hover:bg-sun hover:text-ink
                                        transition-all shadow-hard-sm
                                        hover:translate-x-[2px] hover:translate-y-[2px]">
                JOIN
            </button>
        </form>
    </div>
</section>
```

## 11.3 Mobile Bottom Bar

```html
<div class="fixed bottom-0 left-0 right-0 p-4 bg-paper border-t-2 border-ink md:hidden z-40">
    <button class="w-full bg-acid text-white border-2 border-ink rounded-xl
                   font-display font-bold text-lg py-3 shadow-hard-sm uppercase flex items-center justify-center gap-2">
        ADD TO CART - $19.00
    </button>
</div>
```

---

# 12. Footer Pattern

```html
<footer class="bg-ink text-paper pt-16 pb-8 border-t-2 border-ink">
    <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            <!-- Logo Column -->
            <div class="col-span-2 md:col-span-1">
                <a href="#" class="text-3xl font-brand mb-4 block">
                    Black<span class="text-acid">Eyes</span>
                </a>
                <p class="text-sm opacity-60 max-w-[200px]">
                    Handcrafted glass art from Nepal
                </p>
            </div>

            <!-- Link Columns -->
            <div>
                <h4 class="font-display font-bold text-lg text-sun mb-4">SHOP</h4>
                <ul class="space-y-2 text-sm font-medium opacity-80">
                    <li><a href="#" class="hover:text-acid">Link 1</a></li>
                    <li><a href="#" class="hover:text-acid">Link 2</a></li>
                </ul>
            </div>
            
            <!-- Social Column -->
            <div>
                <h4 class="font-display font-bold text-lg text-sun mb-4">SOCIALS</h4>
                <div class="flex gap-3">
                    <a href="#" class="bg-paper text-ink p-2 rounded-lg 
                                      hover:bg-acid hover:text-white transition-colors">
                        <iconify-icon icon="ri:instagram-line" width="20"></iconify-icon>
                    </a>
                </div>
            </div>
        </div>

        <!-- Bottom Bar -->
        <div class="flex flex-col md:flex-row justify-between items-center 
                    pt-8 border-t border-paper/20 text-xs font-bold opacity-40">
            <p>© 2024 Brand Name. Est. 2024.</p>
            <div class="flex gap-6 mt-4 md:mt-0">
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
            </div>
        </div>
    </div>
</footer>
```

---

# 13. Tailwind Configuration

```javascript
tailwind.config = {
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
        brand: ['Pacifico', 'cursive'],
        display: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
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
  }
}
```

---

# 14. Custom CSS

```css
body { 
  background-color: #FEF8E7; 
  color: #18181B; 
}

/* Hide scrollbar */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Text outline effects */
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

/* Text shadow */
.text-shadow-sm { 
  text-shadow: 2px 2px 0px #18181B; 
}

/* Details/summary reset */
details > summary { list-style: none; }
details > summary::-webkit-details-marker { display: none; }

/* Custom radio checked state */
input[type="radio"]:checked + div { 
  background-color: #18181B; 
  color: #FEF8E7; 
  box-shadow: 4px 4px 0px 0px #18181B; 
}

/* Iconify alignment */
iconify-icon { 
  display: inline-block; 
  vertical-align: middle; 
}

/* Selection */
::selection {
  background-color: #D63D42;
  color: white;
}
```

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