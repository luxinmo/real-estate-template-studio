# Luxury Landing Page – Export Guide for Cursor

## File: `src/components/LuxuryLandingPage.tsx` (508 lines)

---

## 📦 Dependencies

```bash
npm install lucide-react
```

Icons used: `Bed, Bath, Maximize, ChevronDown, Instagram, Linkedin, MessageCircle, Shield, Star, Handshake, Lock, ArrowRight`

## 🖼️ Assets Required

```
src/assets/luxury-hero.jpg
src/assets/luxury-property-1.jpg
src/assets/luxury-property-2.jpg
src/assets/luxury-property-3.jpg
```

---

## 🧩 Component Architecture

### Internal Utilities (defined inside the file)

| Name | Type | Purpose |
|---|---|---|
| `useScrolled(threshold)` | Hook | Detects window scroll position |
| `useContainerScrolled(ref, threshold)` | Hook | Detects scroll inside a container element |
| `useFadeIn()` | Hook | IntersectionObserver-based fade-in animation |
| `FadeIn` | Component | Wrapper that animates children on scroll with configurable `delay` |

### Constants / Data Arrays

All data is defined as constants at the top of the file. In a real app, these would come from a CMS/API and be translated.

---

## 🌐 TRANSLATABLE STRINGS MAP

Below is every string that needs translation, organized by section:

### 1. BRAND & NAVIGATION
```ts
const BRAND_NAME = "PRESTIGE ESTATES";                    // 🌐
const NAV_LEFT = ["Home", "Properties", "Rentals"];       // 🌐
const NAV_RIGHT = ["About", "Guides & Blog", "Message Us"]; // 🌐
// Subtitle under logo:
"Real Estate"                                              // 🌐
```

### 2. LANGUAGES SELECTOR
```ts
const LANGUAGES = [
  { code: "EN", label: "English" },    // 🌐 label
  { code: "ES", label: "Español" },
  { code: "DE", label: "Deutsch" },
  { code: "FR", label: "Français" },
  { code: "RU", label: "Русский" },
];
// Mobile menu label:
"Language"                                                 // 🌐
```

### 3. HERO SLIDESHOW
```ts
const HERO_SLIDES = [
  { image: heroImg, headline: "Where Luxury Meets Home", sub: "Exclusive properties for those who demand the extraordinary" },          // 🌐
  { image: prop1, headline: "Elevated Urban Living", sub: "Penthouses and residences in the world's most coveted addresses" },          // 🌐
  { image: prop2, headline: "Coastal Perfection", sub: "Beachfront estates crafted for an unparalleled lifestyle" },                    // 🌐
  { image: prop3, headline: "Mountain Retreats", sub: "Private sanctuaries surrounded by nature's grandeur" },                          // 🌐
];
// Above headline:
"The World's Finest Properties"                            // 🌐
// CTA buttons:
"Explore Properties"                                       // 🌐
"Book a Private Tour"                                      // 🌐
```

### 4. INTRO / PRESENTATION SECTION
```ts
const INTRO_TITLE = "Luxury Real Estate Specialists in Ibiza & Costa Blanca";  // 🌐
const INTRO_TEXT = "Prestige Estates is a curated luxury real estate advisory..."; // 🌐 (long paragraph)
```

### 5. STATS / NUMBERS
```
"347"              → "Properties for Sale"     // 🌐 label
"€2.1B"            → "Portfolio Value"         // 🌐 label
"120+"             → "Off-Market Properties"   // 🌐 label
"25+"              → "Years of Experience"     // 🌐 label
```

### 6. FEATURED PROPERTIES
```ts
const PROPERTIES = [
  { name: "The Skyline Penthouse", location: "Manhattan, New York", price: "€12,500,000", beds: 5, baths: 4, sqm: 420 },  // 🌐 name, location
  { name: "Villa Blanca Sur Mer", location: "Costa Brava, Spain", price: "€8,900,000", beds: 6, baths: 5, sqm: 680 },
  { name: "Alpine Glass Retreat", location: "Zermatt, Switzerland", price: "€15,200,000", beds: 7, baths: 6, sqm: 950 },
  { name: "The Infinity Residence", location: "Marbella, Spain", price: "€9,750,000", beds: 5, baths: 5, sqm: 520 },
];
// Section labels:
"Portfolio"                    // 🌐
"Featured Properties"          // 🌐
"View Details"                 // 🌐 (hover overlay)
"View All Properties"          // 🌐 (CTA button)
// Property card unit:
"m²"                           // 🌐 (could be sqft in US)
```

### 7. SERVICES SECTION
```ts
const SERVICES = [
  { icon: Star, title: "Exclusive Listings", desc: "Villas, penthouses, estates..." },        // 🌐 title + desc
  { icon: Lock, title: "Private Office", desc: "Total confidentiality guaranteed..." },        // 🌐
  { icon: Handshake, title: "White-Glove Service", desc: "Dedicated advisors guiding..." },   // 🌐
  { icon: Shield, title: "Expert Negotiation", desc: "Decades of experience securing..." },   // 🌐
];
// Section labels:
"Why Choose Us"                // 🌐
"A Standard Apart"             // 🌐
```

### 8. JOURNAL / BLOG SECTION
```ts
const BLOG_POSTS = [
  { date: "26 Feb 2026", title: "An Insider's Guide to Coastal Living...", excerpt: "The Mediterranean coast..." },  // 🌐 title + excerpt
  { date: "25 Feb 2026", title: "Dual Demand Drives Dubai...", excerpt: "Key Insights..." },
  { date: "25 Feb 2026", title: "A Majestic Alpine Estate...", excerpt: "This remarkable historic..." },
  { date: "24 Feb 2026", title: "Caribbean Paradise...", excerpt: "The Caribbean's appeal..." },
];
// Section title:
"The Journal"                  // 🌐
```

### 9. NEWSLETTER SECTION
```
"Stay Informed"                                            // 🌐
"The Private List"                                         // 🌐
"Receive exclusive off-market listings, market insights..." // 🌐 (description)
"Your email address"                                       // 🌐 (placeholder)
"Subscribe"                                                // 🌐 (button)
"We respect your privacy. Unsubscribe at any time."        // 🌐
```

### 10. FOOTER
```ts
const CONTACT = { email: "hello@prestigeestates.com", phone: "+34 600 000 000", city: "Marbella, Spain" };
// Footer description:
"Curating extraordinary homes for exceptional lives since 2010."  // 🌐
// Column headers:
"Quick Links"                  // 🌐
"Contact"                      // 🌐
"Follow"                       // 🌐
// Quick links items:
["Properties", "Services", "About Us", "Contact", "Privacy Policy"]  // 🌐
// Copyright:
"© 2025 {BRAND_NAME}. All rights reserved."                // 🌐
```

---

## 🎨 Design Tokens Used

### Tailwind Custom Colors (defined in `tailwind.config.ts`)
```
luxury-black    → primary dark color used throughout
```

### Typography
- **Serif font** (`font-serif`): used for headlines, brand name, property names, stats numbers
- **Sans font** (`font-sans`): body text, labels, buttons
- Font loaded: **Inter** from Google Fonts (sans), serif is system default or custom

### Key Sizing Patterns
| Element | Mobile | Tablet | Desktop |
|---|---|---|---|
| Hero height | `55vh` | `70vh` | `85vh` |
| Property aspect | `4/3` | `3/4` | `3/4` |
| Nav height | `60px` | `60px` | `68px` |
| Container padding | `px-3` | `px-6` | `px-10` |
| Max-width | — | — | `1400px` |

### Animation Patterns
- **FadeIn**: `opacity 0→1` + `translateY(32px→0)`, 0.8s ease, configurable delay
- **Ken Burns**: `scale(1) → scale(1.05)` over 6s on active slide
- **Hover cards**: `scale-105` on images, overlay opacity transition
- **Slide indicators**: width transition `w-4 ↔ w-8`
- **Navbar**: transparent→white background transition on scroll

### Spacing System
- Sections: `py-10 md:py-16` or `py-12 md:py-16`
- Grids: `gap-4 sm:gap-5` (properties), `gap-6` (services)
- Text tracking: `tracking-[0.35em]` (labels), `tracking-[0.15em]` (buttons), `tracking-[0.25em]` (logo)

---

## 🏗️ Section-by-Section Structure (JSX Order)

```
1. <nav>           — Sticky navbar (transparent → solid on scroll)
   ├── Globe/Language selector (desktop)
   ├── NAV_LEFT links
   ├── Center logo (BRAND_NAME + "Real Estate")
   ├── NAV_RIGHT links
   ├── Mobile hamburger button
   └── Mobile menu overlay (links + language grid)

2. <section>       — Hero slideshow (HERO_SLIDES)
   ├── Background images with Ken Burns
   ├── Gradient overlay
   ├── Headline + subtitle (changes per slide)
   ├── 2 CTA buttons
   ├── Slide indicators (dots)
   └── Scroll hint (chevron bounce)

3. <section>       — Intro/Presentation
   ├── INTRO_TITLE (serif heading)
   ├── Divider line
   └── INTRO_TEXT (paragraph)

4. <section>       — Stats bar (4-column grid)
   └── 4× { value + label }

5. <section>       — Featured Properties (PROPERTIES grid)
   ├── Section header ("Portfolio" / "Featured Properties")
   ├── 4-column property card grid
   │   └── Each: image + hover overlay + name + location + price + beds/baths/sqm
   └── "View All Properties" CTA

6. <section>       — Services (SERVICES grid)
   ├── Section header ("Why Choose Us" / "A Standard Apart")
   └── 4-column service cards
       └── Each: icon (circle border) + title + description

7. <section>       — Journal/Blog (12-col grid: 7+5)
   ├── "The Journal" title
   ├── Featured article (col-span-7, full-height image + overlay text)
   └── 3 side articles (col-span-5, thumbnail + text)

8. <section>       — Newsletter
   ├── "The Private List" heading
   ├── Description
   ├── Email input + Subscribe button
   └── Privacy note

9. <footer>        — Dark footer
   ├── Brand name + tagline
   ├── Quick Links column
   ├── Contact column
   ├── Social icons (Instagram, LinkedIn, MessageCircle)
   └── Copyright bar
```

---

## 🔑 Key Behaviors

1. **Navbar scroll detection**: Uses `useContainerScrolled` because the page scrolls inside a container (`flex-1 overflow-auto`), NOT the window
2. **Hero auto-play**: `setInterval` every 5000ms cycling slides
3. **Mobile menu**: Closes automatically on window resize ≥1024px
4. **FadeIn**: Uses `IntersectionObserver` with `threshold: 0.15`
5. **Language state**: `useState("EN")` — currently visual only, no actual translation logic

---

## 💡 i18n Recommendation for Cursor

Create a `translations/` folder with JSON files per language:

```
translations/
├── en.json
├── es.json
├── de.json
├── fr.json
└── ru.json
```

Use `react-i18next` or a simple context-based approach:

```ts
// Simple approach without library:
const t = translations[currentLang];
// Then replace all hardcoded strings:
// "Explore Properties" → t.hero.cta_explore
// "View Details" → t.properties.view_details
```
