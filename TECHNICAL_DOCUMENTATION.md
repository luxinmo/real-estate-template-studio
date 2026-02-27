# TECHNICAL DOCUMENTATION — Prestige Estates Real Estate Portal

> **Purpose**: Pixel-perfect replication guide for migrating to a Next.js monorepo.
> **Generated**: 2026-02-27
> **Source Stack**: React 18 + Vite + Tailwind CSS + TypeScript

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Design System](#2-design-system)
3. [Components — One by One](#3-components--one-by-one)
4. [Pages & Layouts](#4-pages--layouts)
5. [Search & Filters System](#5-search--filters-system)
6. [Map Integration](#6-map-integration)
7. [State Management](#7-state-management)
8. [Data Models](#8-data-models)
9. [Interactions & UX Flows](#9-interactions--ux-flows)
10. [Exact CSS Values Reference](#10-exact-css-values-reference)

---

## 1. PROJECT OVERVIEW

### 1.1 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | ^18.3.1 |
| Build Tool | Vite | ^5.4.19 |
| Language | TypeScript | ^5.8.3 |
| Styling | Tailwind CSS | ^3.4.17 |
| CSS Animations | tailwindcss-animate | ^1.0.7 |
| Component Library | shadcn/ui (Radix UI primitives) | Various |
| Routing | react-router-dom | ^6.30.1 |
| Server State | @tanstack/react-query | ^5.83.0 |
| Icons | lucide-react | ^0.462.0 |
| Form Handling | react-hook-form + zod | ^7.61.1 / ^3.25.76 |
| Maps | Leaflet + react-leaflet | ^1.9.4 / ^5.0.0 |
| Charts | recharts | ^2.15.4 |
| Class Merging | tailwind-merge + clsx + class-variance-authority | Various |
| Image Cropping | react-image-crop | ^11.0.10 |
| Date Utilities | date-fns | ^3.6.0 |
| Carousel | embla-carousel-react | ^8.6.0 |
| Toast | sonner | ^1.7.4 |
| Drawer | vaul | ^0.9.9 |
| Resizable Panels | react-resizable-panels | ^2.1.9 |

### 1.2 Folder Structure

```
├── index.html
├── package.json
├── tailwind.config.ts
├── postcss.config.js
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── components.json                    # shadcn/ui config
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── main.tsx                       # Entry point
│   ├── App.tsx                        # Router setup
│   ├── App.css
│   ├── index.css                      # Global styles + design tokens
│   ├── vite-env.d.ts
│   ├── assets/                        # Static images (imported as ES6 modules)
│   │   ├── luxury-hero.jpg
│   │   ├── luxury-property-{1,2,3}.jpg
│   │   ├── property-{1,2,3}.jpg
│   │   ├── property-detail-{1,2,3,4,5}.jpg
│   │   ├── blog-featured.jpg
│   │   └── featured-banner.jpg
│   ├── pages/
│   │   ├── Index.tsx                  # CRM dashboard (admin panel)
│   │   └── NotFound.tsx
│   ├── components/
│   │   ├── luxury/                    # PUBLIC-FACING luxury portal
│   │   │   ├── LuxuryPropertyListing.tsx   # /properties route
│   │   │   ├── LuxuryPropertyDetail.tsx    # /property/:id route
│   │   │   ├── BlogListingPage.tsx         # /blog route
│   │   │   └── LocationSearchDropdown.tsx  # Reusable search component
│   │   ├── LuxuryLandingPage.tsx      # / route (landing)
│   │   ├── PropertiesPage.tsx         # CRM properties view
│   │   ├── PropertyDetailPage.tsx     # CRM property detail
│   │   ├── AddPropertyPage.tsx        # CRM add property form
│   │   ├── AppSidebar.tsx             # CRM sidebar navigation
│   │   ├── HeaderBar.tsx              # CRM top header
│   │   ├── contacts/                  # CRM contacts module
│   │   ├── locations/                 # CRM locations management
│   │   ├── importer/                  # CRM data importer
│   │   ├── add-property/              # CRM property form sections
│   │   ├── property-detail/           # CRM property detail components
│   │   ├── shared/                    # Shared utilities (ImageCropper, LogoUploader)
│   │   └── ui/                        # shadcn/ui components (~50+ files)
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── utils.ts                   # cn() utility
│   │   └── image/crop.ts
│   └── test/
│       ├── setup.ts
│       └── example.test.ts
```

### 1.3 Routes (App.tsx)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `<Index />` → `<LuxuryLandingPage />` | Luxury landing page (via CRM shell) |
| `/properties` | `<LuxuryPropertyListing />` | Property listing with filters |
| `/property/:id` | `<LuxuryPropertyDetail />` | Property detail page |
| `/blog` | `<BlogListingPage />` | Blog/Journal listing |
| `*` | `<NotFound />` | 404 page |

### 1.4 Environment Variables

**None.** The project uses only local mock data with no external API calls or environment variables.

### 1.5 API Endpoints

**None.** All data is hardcoded mock data within component files.

---

## 2. DESIGN SYSTEM

### 2.1 Colors

#### CSS Custom Properties (index.css `:root`)

| Token | HSL Value | Computed Hex | Usage |
|-------|-----------|-------------|-------|
| `--background` | `220 14% 96%` | `#F2F3F5` | Page background (CRM) |
| `--foreground` | `220 20% 10%` | `#141A23` | Primary text (CRM) |
| `--card` | `0 0% 100%` | `#FFFFFF` | Card backgrounds |
| `--card-foreground` | `220 20% 10%` | `#141A23` | Card text |
| `--popover` | `0 0% 100%` | `#FFFFFF` | Popover backgrounds |
| `--primary` | `220 18% 14%` | `#1D2535` | Primary accent |
| `--primary-foreground` | `0 0% 100%` | `#FFFFFF` | Text on primary |
| `--secondary` | `220 14% 96%` | `#F2F3F5` | Secondary background |
| `--muted` | `220 12% 93%` | `#ECEDEF` | Muted backgrounds |
| `--muted-foreground` | `220 8% 52%` | `#7C818A` | Muted text |
| `--accent` | `220 12% 90%` | `#E2E4E8` | Accent background |
| `--destructive` | `0 84% 60%` | `#EF4444` | Error/destructive |
| `--border` | `220 13% 91%` | `#E5E7EB` | Border color |
| `--input` | `220 13% 91%` | `#E5E7EB` | Input border |
| `--ring` | `220 20% 10%` | `#141A23` | Focus ring |
| `--radius` | `0.625rem` | `10px` | Base border radius |

#### Luxury Portal Colors (tailwind.config.ts)

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `luxury-black` | `#0A0A0A` | Primary text, buttons, nav, footer bg |
| `luxury-charcoal` | `#1A1A1A` | Secondary dark |
| `luxury-gold` | `#C9A84C` | Gold accent (defined but NOT used in current design) |
| `luxury-cream` | `#F5F0E8` | Cream accent (defined but NOT used in current design) |

#### Luxury Portal Inline Colors (used via Tailwind classes)

| Class | Meaning | Usage |
|-------|---------|-------|
| `bg-white` | `#FFFFFF` | Page background, cards, dropdowns |
| `bg-neutral-50` | `#FAFAFA` | Property card bg, subtle sections |
| `bg-neutral-100` | `#F5F5F5` | Filter chips, selected location chips |
| `text-luxury-black` | `#0A0A0A` | All primary text |
| `text-luxury-black/X` | Opacity variants | `/80` body, `/65` secondary, `/55` excerpt, `/50` label, `/45` meta, `/40` caption, `/35` placeholder, `/30` icon, `/25` divider |
| `border-neutral-200` | `#E5E5E5` | Borders, input borders, card borders |
| `border-neutral-100` | `#F5F5F5` | Subtle section borders |
| `bg-luxury-black/60` | `rgba(10,10,10,0.6)` | NEW BUILD tag on images |
| `bg-luxury-black/30` | `rgba(10,10,10,0.3)` | Filter sidebar overlay |

### 2.2 Typography

#### Font Families

| Name | Google Fonts URL | Weights | Usage |
|------|-----------------|---------|-------|
| **Inter** | `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap` | 300, 400, 500, 600, 700 | Body, UI, labels, buttons |
| **Playfair Display** | `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap` | 400, 500, 600, 700 | Headings, prices, brand name |

Tailwind config mapping:
```ts
fontFamily: {
  sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
  serif: ["'Playfair Display'", "Georgia", "serif"],
}
```

#### Font Sizes Used

| Size | Tailwind Class | Usage |
|------|---------------|-------|
| `7px` | `text-[7px]` | Brand subtitle "Real Estate" |
| `8px` | `text-[8px]` | Brand subtitle mobile |
| `10px` | `text-[10px]` | Uppercase tracking labels, tags, badges, stat labels |
| `11px` | `text-[11px]` | Nav links, sub-labels, feature dots, chip text, blog meta |
| `12px` | `text-[12px]` | Filter buttons, input text, sidebar text, counts, sort label |
| `12.5px` | `text-[12.5px]` | Landing page nav links |
| `13px` | `text-[13px]` | Body text, excerpts, descriptions, form inputs |
| `13.5px` | `text-[13.5px]` | Featured blog excerpt |
| `14px` | `text-[14px]` | Dropdown options, section titles, amenity group titles |
| `15px` | `text-[15px]` | Spec values, prices, property names |
| `16px` | `text-[16px]` | Property card title |
| `18px` | `text-[18px]` | Property card title (md) |
| `text-lg` | `18px` | Brand name |
| `text-xl` | `20px` | Page titles, section headings |
| `text-2xl` | `24px` | Main headings, prices |
| `text-3xl` | `30px` | Hero stats, landing headings |
| `text-4xl` | `36px` | Hero stats (md) |
| `text-7xl` | `72px` | Hero headline (md) |

#### Font Weights

| Weight | Class | Usage |
|--------|-------|-------|
| 300 | `font-light` | Most body text, prices, headings (luxury aesthetic) |
| 400 | `font-normal` | Nav links |
| 500 | `font-medium` | Labels, tags, property titles, filter labels, blog post titles |
| 600 | `font-semibold` | CRM headings |
| 700 | `font-bold` | Not used in luxury portal |

#### Letter Spacing

| Value | Tailwind Class | Usage |
|-------|---------------|-------|
| `0.35em` | `tracking-[0.35em]` | Hero pre-title, section labels |
| `0.3em` | `tracking-[0.3em]` | Brand name |
| `0.25em` | `tracking-[0.25em]` | Footer brand name |
| `0.2em` | `tracking-[0.2em]` | Footer section labels |
| `0.18em` | `tracking-[0.18em]` | Tags, uppercase badges, nav links |
| `0.15em` | `tracking-[0.15em]` | Location text, CTA buttons, blog tags |
| `0.14em` | `tracking-[0.14em]` | Landing nav links |
| `0.12em` | `tracking-[0.12em]` | NEW BUILD image tag, blog category |
| `0.1em` | `tracking-[0.1em]` | Spec labels, newsletter button, language code |
| `tracking-tight` | `-0.025em` | Serif headings |
| `tracking-wide` | `0.025em` | Photo count overlay |
| `tracking-wider` | `0.05em` | Copyright text |
| `tracking-widest` | `0.1em` | Component labels (CRM) |

#### Line Heights

| Value | Class | Usage |
|-------|-------|-------|
| `1.1` | `leading-[1.1]` | Hero headline |
| `1.2` | `leading-[1.2]` | Featured blog title |
| `1.35` | `leading-[1.35]` | Blog post titles |
| `1.4` | `leading-[1.4]` | Intro section title |
| `1.5` | `leading-snug` | Property card titles |
| `1.625` | `leading-relaxed` | Body text, excerpts |
| `1.85` | `leading-[1.85]` | Intro paragraph |
| `1.9` | `leading-[1.9]` | Property description |

### 2.3 Spacing

#### Container

- Max width: `max-w-[1400px]` (1400px)
- Horizontal padding: `px-6 lg:px-10` (24px / 40px)
- Mobile: `px-3 sm:px-6` (12px / 24px) for property grid

#### Section Padding

| Section | Desktop | Mobile |
|---------|---------|--------|
| Intro | `py-12 md:py-16` | 48px / 64px |
| Stats | `py-10 md:py-14` | 40px / 56px |
| Featured Properties | `py-10 md:py-16` | 40px / 64px |
| Services | `py-12 md:py-16` | 48px / 64px |
| Newsletter | `py-14 md:py-20` | 56px / 80px |
| Footer | `py-14 md:py-18` | 56px / 72px |
| Listing Results | `py-8` | 32px |
| Popular Locations | `py-10` | 40px |

#### Common Gaps

| Value | Class | Usage |
|-------|-------|-------|
| 1px | `gap-1` | Bed option buttons |
| 1.5px | `gap-1.5` | Breadcrumb items, pagination dots, bath buttons, price presets |
| 2px | `gap-2` | Filter chips, amenity tags, feature dots |
| 3px | `gap-3` | Filter bar items, price inputs, form elements |
| 4px | `gap-4` | Property grid mobile, specs row |
| 5px | `gap-5` | Property grid, pagination stack |
| 6px | `gap-6` | Specs, sidebar filters, property grid lg, blog grid |
| 8px | `gap-8` | Nav links, grid items, layout columns |
| 10px | `gap-10` | Footer grid |

### 2.4 Borders & Radius

#### Border Radius

| Element | Value | Class |
|---------|-------|-------|
| Global base | `10px` | `--radius: 0.625rem` |
| Filter buttons (pill) | `9999px` | `rounded-full` |
| Location search input | `9999px` | `rounded-full` |
| Pagination buttons | `9999px` | `rounded-full` |
| Search dropdown | `12px` | `rounded-xl` |
| Property cards | `2px` | `rounded-sm` |
| Filter dropdowns | `2px` | `rounded-sm` |
| Sidebar overlay | `0` | none |
| Feature dots | `9999px` | `rounded-full` |

#### Border Colors

| Color | Usage |
|-------|-------|
| `border-neutral-200` (#E5E5E5) | Default border for inputs, cards, dropdowns, filter buttons |
| `border-neutral-100` (#F5F5F5) | Subtle section dividers |
| `border-neutral-300` (#D4D4D4) | Pagination "Next" button, newsletter input |
| `border-luxury-black` (#0A0A0A) | Active filter buttons, active bed/bath selection |
| `border-luxury-black/20` (rgba) | Property tag borders, inactive CTA borders |
| `border-luxury-black/30` (rgba) | Input focus state |
| `border-white/40` (rgba) | Hero ghost button |
| `border-white/10` (rgba) | Footer social icons |

### 2.5 Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-xs` | `0 1px 2px 0 hsl(220 20% 10% / 0.02)` | Minimal shadow |
| `--shadow-sm` | `0 1px 3px 0 hsl(220 20% 10% / 0.04), 0 1px 2px -1px hsl(220 20% 10% / 0.03)` | Subtle shadow |
| `--shadow-md` | `0 4px 12px -2px hsl(220 20% 10% / 0.06)` | Elevated elements |
| `--shadow-card` | `0 1px 3px 0 hsl(220 20% 10% / 0.03), 0 1px 2px -1px hsl(220 20% 10% / 0.02)` | Card default |
| `shadow-sm` (Tailwind) | Standard Tailwind | Navbar scrolled state |
| `shadow-lg` (Tailwind) | Standard Tailwind | Dropdowns, filter sidebar |
| `shadow-md` (Tailwind) | Standard Tailwind | Property card hover |

### 2.6 Breakpoints

| Name | Min-width | Usage |
|------|-----------|-------|
| `sm` | `640px` | Two-column grids, horizontal forms |
| `md` | `768px` | Location search visible, 2-col property grid |
| `lg` | `1024px` | Desktop nav visible, sidebar hidden, 3-col grids |
| `xl` | `1280px` | 3-col property grid (CRM) |
| `2xl` | `1400px` | Container max-width |

---

## 3. COMPONENTS — ONE BY ONE

### 3.1 LuxuryLandingPage (`src/components/LuxuryLandingPage.tsx`)

**Purpose**: Full landing page for the luxury real estate brand. Standalone page with hero carousel, intro, stats, featured properties, services, blog, newsletter, and footer.

**File**: 508 lines, self-contained with inline mock data.

#### Props Interface

None — standalone page component.

#### Visual Specification

**Navbar** (shared across luxury pages):
- Height: `h-[60px] lg:h-[68px]`
- Max width: `1400px`, centered
- Layout: Flexbox, `justify-between`
- Background: Transparent over hero → `bg-white/95 backdrop-blur-md shadow-sm` when scrolled
- Transition: `transition-all duration-500`
- Negative margin trick: `marginBottom: scrolled ? 0 : '-68px'` to overlay hero
- Z-index: `z-50`

**Brand Logo** (center):
- Font: `font-serif` (Playfair Display)
- Size: `text-base sm:text-lg md:text-xl`
- Letter spacing: `tracking-[0.25em] sm:tracking-[0.3em]`
- Weight: `font-light`
- Color: `text-white` (transparent nav) → `text-luxury-black` (scrolled)
- Subtitle: `text-[7px] sm:text-[8px]`, `tracking-[0.35em]`, `uppercase`, `font-light`

**Nav Links**:
- Font: `text-[12.5px]`, `tracking-[0.14em]`, `uppercase`, `font-medium`
- Left: Home, Properties, Rentals
- Right: About, Guides & Blog, Message Us
- Color: `text-white hover:text-white` (transparent) → `text-luxury-black/80 hover:text-luxury-black` (scrolled)
- Transition: `duration-300`

**Language Switcher** (desktop — left of nav):
- Globe SVG icon: `w-[16px] h-[16px]`, `strokeWidth={1.2}`
- Code label: `text-[11px]`, `tracking-[0.1em]`, `font-medium`
- Dropdown: `bg-white shadow-lg border border-neutral-100`, `min-w-[140px]`
- Options: EN, ES, DE, FR, RU — `text-[12px]`, `hover:bg-neutral-50`
- Active: `text-luxury-black font-medium` vs `text-luxury-black/60`

**Mobile Menu**:
- Trigger: Hamburger icon `w-6 h-6`, `strokeWidth={1.5}`
- Panel: `bg-white border-t border-neutral-100 shadow-lg animate-in slide-in-from-top-2 duration-200`
- Links: `text-[13px]`, `tracking-[0.12em]`, `uppercase`, `font-medium`, `py-3`, `border-b border-neutral-50`
- Language row: `text-[10px]` label, chip buttons `px-3 py-1.5 text-[11px] border`

**Hero Section**:
- Height: `h-[55vh] sm:h-[70vh] lg:h-[85vh]`, `min-h-[400px] sm:min-h-[550px]`
- Multi-slide: 4 slides, auto-advance every 5000ms
- Ken Burns: `transform: scale(1.05)` on active, `scale(1)` on inactive, `transition: transform 6s ease-out`
- Overlay: `bg-gradient-to-b from-luxury-black/30 via-luxury-black/10 to-luxury-black/50`
- Pre-title: `text-[10px] sm:text-[11px] md:text-[12px]`, `tracking-[0.35em]`, `uppercase`, `text-white/60`
- Headline: `text-2xl sm:text-4xl md:text-7xl`, `font-light`, `font-serif`, `text-white`, `tracking-tight`, `drop-shadow-lg`
- Subtitle: `text-xs sm:text-sm md:text-lg`, `text-white/60`, `font-light`, `drop-shadow`
- CTA Primary: `bg-white text-luxury-black`, `text-[11px]`, `tracking-[0.15em]`, `uppercase`, `font-medium`, `px-8 py-3.5`, with ArrowRight icon
- CTA Secondary: `border border-white/40 text-white`, same text style, `backdrop-blur-sm`
- CTA hover: Primary `hover:bg-white/90`, Secondary `hover:bg-white hover:text-luxury-black`
- Mobile CTA: `w-full sm:w-auto`
- Slide indicators: `h-[2px] rounded-full`, active `w-8 bg-white`, inactive `w-4 bg-white/30 hover:bg-white/50`, `transition-all duration-500`
- Scroll indicator: `animate-bounce`, ChevronDown `w-4 h-4`, `text-white/30`

**FadeIn Animation** (reusable):
- Implementation: IntersectionObserver with `threshold: 0.15`
- Initial: `opacity: 0`, `translateY(32px)`
- Visible: `opacity: 1`, `translateY(0)`
- Transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`
- Stagger delays: 0, 0.1, 0.15, 0.2, 0.3, 0.45

**Stats Section**:
- Background: `bg-neutral-50/60`
- Grid: `grid-cols-2 md:grid-cols-4`, `gap-6 md:gap-8`
- Number: `text-3xl md:text-4xl`, `font-light`, `font-serif`
- Label: `text-[11px]`, `tracking-[0.12em]`, `uppercase`, `text-luxury-black/40`, `font-light`

**Featured Properties Grid**:
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, `gap-4 sm:gap-5`
- Card image: `aspect-[4/3] sm:aspect-[3/4]`
- Hover overlay: `bg-luxury-black/0 → bg-luxury-black/30`, `duration-500`
- Hover text: "View Details" — `text-[11px]`, `tracking-[0.2em]`, `border border-white/50`, `px-5 py-2`, fade in `opacity-0 → opacity-100`
- Image zoom: `transition-transform duration-700 group-hover:scale-105`
- Location: `text-[10px]`, `tracking-[0.18em]`, `uppercase`, `text-luxury-black/40`
- Name: `text-[14px]`, `font-light`, `font-serif`
- Price: `text-[15px]`, `font-normal`, `text-luxury-black/75`
- Specs: `text-[11px]`, `text-luxury-black/40`, `font-light`, icons `w-3.5 h-3.5`

**Services Grid**:
- Background: `bg-neutral-50/80`
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, `gap-6`
- Card: `p-6`, `border border-neutral-200/80`, `bg-white`, `hover:border-neutral-300`
- Icon circle: `w-12 h-12`, `border border-neutral-200 rounded-full`, icon `w-5 h-5`, `strokeWidth={1.2}`, `text-luxury-black/50`
- Title: `text-[13px]`, `font-medium`, `tracking-wide`
- Description: `text-[12px]`, `text-luxury-black/45`, `font-light`

**Blog/Journal Section**:
- Layout: `grid-cols-1 lg:grid-cols-12`, `gap-6 lg:gap-8`
- Featured (left): `lg:col-span-7`, full-height, `min-h-[350px]`, gradient overlay `from-luxury-black/70 via-luxury-black/10 to-transparent`
- Side articles (right): `lg:col-span-5`, stacked flex column
- Side article thumbnail: `w-[140px] h-[95px]`
- Side article title: `text-[14px]`, `font-medium`, `line-clamp-2`

**Newsletter**:
- Background: `bg-neutral-50/60`
- Max width: `max-w-xl`, centered
- Input: `border border-neutral-300`, `px-4 py-3`, `text-[13px]`
- Button: `bg-luxury-black text-white`, `text-[11px]`, `tracking-[0.15em]`, `uppercase`, `px-8 py-3`
- Privacy text: `text-[10px]`, `text-luxury-black/25`

**Footer**:
- Background: `bg-luxury-black`
- Grid: `grid-cols-1 md:grid-cols-4`, `gap-10 md:gap-8`
- Brand: `text-base`, `tracking-[0.25em]`, `text-white`, `font-light`, `font-serif`
- Section title: `text-[10px]`, `tracking-[0.2em]`, `uppercase`, `text-white/40`, `font-medium`
- Links: `text-[12px]`, `text-white/30`, `hover:text-white/70`
- Social icons: `w-9 h-9`, `border border-white/10`, icon `w-3.5 h-3.5`, `text-white/30`
- Copyright: `text-[10px]`, `text-white/20`, `tracking-wider`
- Divider: `border-t border-white/[0.06]`, `mt-12 pt-6`

---

### 3.2 LuxuryPropertyListing (`src/components/luxury/LuxuryPropertyListing.tsx`)

**Purpose**: Property listing page with multi-location search, filter dropdowns, filter sidebar, active filter chips, horizontal property cards, pagination, and popular locations.

**File**: 739 lines.

#### Key Sub-Components (inline):

##### FilterState Interface
```ts
interface FilterState {
  locations: { id: string; name: string; path: string; type: string }[];
  types: string[];        // "Villa" | "Penthouse" | "Apartment" | "Finca" | "New Build" | "Land"
  priceMin: string;       // Raw number string e.g. "500000"
  priceMax: string;
  hidePriceOnRequest: boolean;
  areaMin: string;        // m² string
  areaMax: string;
  beds: string;           // "Any" | "1+" | "2+" | "3+" | "4+" | "5+"
  baths: string;          // "Any" | "1+" | "2+" | "3+" | "4+"
  amenities: string[];
  newBuilds: boolean;
}
```

##### TypeDropdown
- Trigger: Pill button, `text-[12px]`, `px-4 py-1.5`, `rounded-full`
- Active: `border-luxury-black bg-luxury-black text-white` with count badge `bg-white text-luxury-black text-[10px] w-4 h-4 rounded-full`
- Inactive: `border-neutral-200 text-luxury-black/65 hover:border-luxury-black/30`
- Dropdown: `w-[300px]`, `py-2`, checkbox list, `text-[14px]`
- Options: Villa, Penthouse, Apartment, Finca, New Build, Land

##### PriceDropdown
- Dropdown width: `w-[380px]`, `p-5`
- Two columns: Min price / Max price
- Input: `border border-neutral-200`, `px-3 py-2.5`, `text-[13px]`
- Label: `text-[10px]`, `uppercase`, `tracking-wider`, `text-luxury-black/40`
- Preset chips: `text-[10px]`, `px-2 py-0.5`, `rounded-full`, `border`
- Presets: €500K, €1M, €2M (min) / €2M, €5M, €10M (max)
- Checkbox: "Hide Price on Request" — `text-[13px]`, `text-luxury-black/70`
- Active indicator: `●` dot in button text

##### BedsDropdown
- Dropdown width: `w-[320px]`, `p-5`
- Options: "Any", "1+", "2+", "3+", "4+", "5+" — `flex-1 py-2 text-[13px] border`
- Active: `bg-luxury-black text-white border-luxury-black`

##### AmenitiesDropdown
- Dropdown width: `w-[480px]`, `max-h-[420px]`, `overflow-y-auto`, `p-5`
- Position: `right-0` (anchored right)
- Groups: View (4), Outdoor (6), Indoor (9)
- Items as toggle pills: `border rounded-full px-3.5 py-1.5 text-[12px]`
- Active: `border-luxury-black bg-luxury-black text-white`
- Group title: `text-[14px]`, `font-medium`

##### FilterSidebar
- Position: `fixed top-0 left-0`, `w-[340px]`, `z-50`
- Animation: `animate-in slide-in-from-left duration-300`
- Border: `border-r border-neutral-200`
- Overlay: `fixed inset-0 bg-luxury-black/30 z-40`
- Header: `p-5`, `border-b border-neutral-200`, title `text-[15px] font-medium`, X button `w-5 h-5`
- Content: `p-5 space-y-7`
- Property type with subtypes: checkbox + label + "All subtypes ▾" right-aligned `text-[11px] text-luxury-black/35`
- Subtypes available: Villa (Modern/Traditional/Luxury), Penthouse (Duplex/Sky), Apartment (Ground Floor/Duplex/Studio/Loft), Land (Urban/Rustic)
- Footer: `sticky bottom-0`, `border-t`, `p-4 flex gap-3`
- Clear all: `text-[12px] text-luxury-black/50 font-light`
- Show results: `flex-1 bg-luxury-black text-white text-[12px] tracking-[0.1em] uppercase py-2.5`

##### PropertyCard (horizontal)
- Layout: `grid grid-cols-1 md:grid-cols-12`
- Background: `bg-neutral-50`
- Border: `border border-neutral-200`, `rounded-sm`
- Hover: `hover:shadow-md`, `transition-shadow duration-300`
- Margin bottom: `mb-6`
- Image column: `md:col-span-5`, `min-h-[220px]`, `aspect-[16/10]` on mobile
- Image zoom: `transition-transform duration-700 group-hover:scale-105`
- NEW BUILD tag: `absolute top-3 left-3`, `bg-luxury-black/60 backdrop-blur-sm`, `text-white text-[10px] tracking-[0.12em] uppercase font-medium px-2.5 py-1`
- Photo count: `absolute bottom-3 right-3`, `bg-luxury-black/60 text-white text-[10px] px-2 py-1 font-light`
- Info column: `md:col-span-7`, `p-5 md:p-6 lg:p-8`
- Tag badge: `text-[10px] tracking-[0.18em] uppercase border border-luxury-black/20 text-luxury-black/60 px-2.5 py-1 font-medium`
- Style label: `text-[11px] text-luxury-black/45 font-light italic` — values: Contemporary, Luxury, Traditional, Modern, Classic
- Mail icon: `w-4 h-4`, `text-luxury-black/30 hover:text-luxury-black`
- Location: `text-[11px] tracking-[0.15em] uppercase text-luxury-black/50`
- Title: `text-[16px] md:text-[18px] font-medium leading-snug`, hover `text-luxury-black/75 duration-300`
- Excerpt: `text-[13px] text-luxury-black/55 font-light leading-relaxed line-clamp-2`
- Specs row: gap `gap-6`, text-center blocks
  - Label: `text-[10px] tracking-[0.1em] uppercase text-luxury-black/40`
  - Value: `text-[15px] text-luxury-black font-light`
  - Fields: Beds, Baths, Built (m²), Plot (m², conditional)
- Feature tags: `text-[11px] text-luxury-black/50 font-light`, dot `w-1 h-1 rounded-full bg-luxury-black/20`
- Price: `text-xl md:text-2xl font-light font-serif tracking-tight`, separated by `border-t border-neutral-100 mt-5 pt-4`

##### Active Filter Chips
- Location below breadcrumbs + search bar, above title
- Container: `flex flex-wrap items-center gap-2 mb-5`
- Chip: `bg-neutral-100 text-luxury-black text-[12px] font-medium rounded-full pl-3 pr-2 py-1.5`
- X button: `w-3 h-3`, `text-luxury-black/40 hover:text-luxury-black/70`
- Clear all: `text-[11px] text-luxury-black/40 hover:text-luxury-black/70 underline ml-1`
- Chip types: location name, type name, price range (formatted), area range, "X+ Beds", "X+ Baths", amenity name, "New Builds", "Hide Price on Request"

##### Pagination
- Next button: `border border-neutral-300`, `text-[13px]`, `px-16 py-3`, `rounded-full`, hover `bg-luxury-black text-white duration-300`
- Page numbers: `w-8 h-8 text-[13px] rounded-full`
- Active page: `border border-luxury-black text-luxury-black font-medium`
- Inactive: `text-luxury-black/50 hover:text-luxury-black`
- Ellipsis: `text-luxury-black/30`
- Count: `text-[12px] text-luxury-black/40 font-light` — "1–6 of 6 homes for sale"

##### Popular Locations
- Grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6`, `gap-x-8 gap-y-3`
- Links: `text-[13px] text-luxury-black/60 hover:text-luxury-black font-light`
- 18 locations listed (Ibiza + Costa Blanca)

---

### 3.3 LocationSearchDropdown (`src/components/luxury/LocationSearchDropdown.tsx`)

**Purpose**: Multi-select location search with autocomplete, inline chips, recent searches, and selected items management.

**Props**:
```ts
interface LocationSearchDropdownProps {
  selected: LocationItem[];                           // Currently selected locations
  onSelectedChange: (items: LocationItem[]) => void;  // Update callback
  className?: string;                                 // Width class, default ""
}
```

**LocationItem type**: `{ id: string; name: string; path: string; type: string }`

#### Visual Specification

**Input Container**:
- Layout: `flex items-center gap-1.5 min-h-[40px]`
- Border: `border border-neutral-200 rounded-full px-3`
- Focus: `focus-within:border-luxury-black/30`
- MapPin icon: `w-4 h-4 text-luxury-black/30`

**Inline Chips** (max 2 visible):
- Background: `bg-neutral-100`
- Text: `text-[11px] font-medium text-luxury-black`
- Shape: `rounded-full pl-2 pr-1.5 py-0.5`
- X button: `w-3 h-3`, `text-luxury-black/40 hover:text-luxury-black/70`
- Overflow: `+N` counter — `text-[11px] font-medium text-luxury-black/50`
- Constant: `MAX_VISIBLE_CHIPS = 2`

**Text Input**:
- Style: `flex-1 min-w-[60px] h-7 bg-transparent text-[12px]`
- Placeholder: "City, Region, Country" (empty) / "Add location..." (has selections)
- Clear X: `w-3.5 h-3.5`, `text-luxury-black/30 hover:text-luxury-black/60`

**Dropdown**:
- Position: `absolute top-full left-0 right-0 mt-1.5`
- Style: `bg-white rounded-xl border border-neutral-200 shadow-lg z-50 min-w-[320px]`
- Opens: On focus (always) — `showDropdown = open`

**Selected Section** (top of dropdown when items exist):
- Header: `text-[11px] font-semibold text-luxury-black/50 uppercase tracking-wider` — "Selected"
- Border: `border-b border-neutral-100`
- Items: MapPin icon `w-4 h-4 text-luxury-black/50`, path text `text-[13px]`, X remove button `w-3.5 h-3.5`

**"Search near me"**:
- Navigation icon: `w-4 h-4 text-luxury-black/50`
- Text: `text-[13px] text-luxury-black`
- Border: `border-b border-neutral-100`
- Padding: `px-4 py-3`

**Search Results**:
- Search icon: `w-4 h-4 text-luxury-black/25`
- Path text: `text-[13px] text-luxury-black truncate`
- Type badge: `text-[11px] text-luxury-black/40 font-medium`
- Type mappings: country→"Country", province→"Province", region→"Region", municipality→"City", borough→"Locality"
- Max results: 6
- Hover: `hover:bg-neutral-50`

**Recent Searches**:
- Header: `text-[11px] font-semibold text-luxury-black/50 uppercase tracking-wider` — "Recent searches"
- Storage: `localStorage` key `"luxury_recent_searches"`, max 5 items
- Same item styling as search results

**Empty State**: `text-[12px] text-luxury-black/40` — "No locations found"

---

### 3.4 LuxuryPropertyDetail (`src/components/luxury/LuxuryPropertyDetail.tsx`)

**Purpose**: Single property detail view with photo gallery, lightbox, specs, description, features, agent card, similar properties, and newsletter.

**Navbar**: Dark variant — `bg-luxury-black`, `h-[56px]`, brand `text-white`, nav links `text-white/60`

**Gallery Grid**: `grid-cols-1 md:grid-cols-4`, `gap-1.5`, `h-[280px] md:h-[420px] lg:h-[480px]`
- Main image: `md:col-span-2 md:row-span-2`
- 4 secondary images, last shows `+N photos` overlay
- Hover: `group-hover:scale-105 duration-500`

**Lightbox**: `fixed inset-0 z-[100] bg-luxury-black/95`
- Navigation: ChevronLeft/Right `w-8 h-8`, `text-white/40 hover:text-white`
- Close: X `w-6 h-6`, `text-white/50 hover:text-white`
- Counter: `text-white/30 text-[12px] font-light`

**Header Info**: 2/3 + 1/3 grid on `lg`
- Price: `text-2xl md:text-3xl font-light font-serif tracking-tight`
- Ref: `text-[10px] tracking-[0.15em] uppercase text-luxury-black/50`
- Favorite/Share: `w-10 h-10 border`, square buttons
- Title: `text-lg md:text-xl font-light`
- Location: `text-[13px] text-luxury-black/70 font-light`, MapPin `w-3.5 h-3.5`
- Specs strip: `border-t border-b border-neutral-200 py-4`, icons `w-4 h-4 strokeWidth={1.3}`

**Agent Card**: `border border-neutral-200 p-6`
- Label: `text-[10px] tracking-[0.2em] uppercase text-luxury-black/55`
- Name: `text-[15px] font-medium`
- Role: `text-[12px] text-luxury-black/55 font-light`
- Call CTA: `bg-luxury-black text-white text-[11px] tracking-[0.15em] uppercase py-3`
- Message CTA: `border border-luxury-black/20 text-luxury-black/70`, hover fills black

**Features Grid**: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4`, `gap-x-6 gap-y-3`
- Check icon: `w-3.5 h-3.5 text-luxury-black/50 strokeWidth={1.5}`
- Text: `text-[13px] text-luxury-black/75 font-light`

---

### 3.5 BlogListingPage (`src/components/luxury/BlogListingPage.tsx`)

**Purpose**: Blog/Journal page with category filtering, search, featured post, paginated grid, and i18n-ready strings.

**Categories**: All, Market Insights, Lifestyle, Architecture & Design, Investment, Destinations, Guides
- Buttons: `px-4 py-2 text-[11px] tracking-[0.12em] uppercase font-medium border`
- Active: `border-luxury-black bg-luxury-black text-white`

**Featured Post**: `grid-cols-1 lg:grid-cols-2`, image `aspect-[4/3]`
- Featured badge: `bg-luxury-black text-white text-[9px] tracking-[0.18em] uppercase font-medium px-3 py-1`
- Title: `text-2xl md:text-3xl lg:text-[2.2rem] font-light font-serif`

**Post Grid**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, `gap-x-5 gap-y-10`
- Image: `aspect-[16/10]`
- Category badge on image: `bg-white/90 backdrop-blur-sm text-[9px]`
- Title: `text-[15px] md:text-[16px] font-medium`
- Load more: `border border-luxury-black/20`, hover fills black

---

## 4. PAGES & LAYOUTS

### 4.1 Landing Page (`/`)

**Route**: `/` → `<Index />` component renders CRM shell with `<LuxuryLandingPage />`
**Layout**: Full-width, scrollable container with `flex-1 overflow-auto`
**Sections order**: Navbar → Hero Carousel → Intro → Stats → Featured Properties → Services → Blog → Newsletter → Footer
**Max-width**: `1400px` centered
**Background**: `bg-white`

### 4.2 Property Listing (`/properties`)

**Route**: `/properties` → `<LuxuryPropertyListing />`
**Layout**: Sticky navbar (top-0) + Sticky search bar (top-68px) + Scrollable main content
**Sticky layers**:
1. Navbar: `z-50`, `top-0`, `h-[68px]`
2. Search bar: `z-40`, `top-[68px]`, `border-b border-neutral-200`

**Content structure**:
```
Breadcrumbs
Search bar + Filter buttons
Active filter chips
Page title + description + count
Property cards (vertical list)
Pagination
Popular locations grid
Newsletter
Footer
```

### 4.3 Property Detail (`/property/:id`)

**Route**: `/property/:id` → `<LuxuryPropertyDetail />`
**Layout**: Dark navbar + Gallery grid + 2/3-1/3 content layout
**Sections**: Nav → Gallery → Header/Agent → Description → Features → Map placeholder → Similar → Newsletter → Footer

### 4.4 Blog (`/blog`)

**Route**: `/blog` → `<BlogListingPage />`
**Layout**: White navbar + Categories + Featured post + Post grid + Newsletter + Footer

---

## 5. SEARCH & FILTERS SYSTEM

### 5.1 Location Search

**Component**: `LocationSearchDropdown`

**Empty input behavior**:
- Shows "Search near me" button
- Shows recent searches (if any, up to 5, stored in localStorage key `luxury_recent_searches`)
- Shows selected locations section (if any selected)

**Typing behavior**:
- No minimum characters — filters on any input
- No debounce — instant filtering
- Searches `mockLocations` array by `name` (case-insensitive) and all `names` object values
- Excludes already-selected locations
- Maximum 6 results shown

**Dropdown structure** (top to bottom):
1. **Selected section** (if selections exist): Shows all selected locations with MapPin icon, full path, and X remove button
2. **"Search near me"**: Navigation icon + label (placeholder — no geolocation implemented)
3. **Search results**: Search icon + full path + type badge
4. **Recent searches** (when no query): Same format as results

**Result path format**: Recursive parent traversal building "Municipality, Region, Province, Country" breadcrumb

**Multi-select behavior**:
- Up to 2 chips shown inline in the input
- 3+ locations show `+N` counter
- Clicking input opens dropdown showing all selections
- Each chip has X to remove
- Selections sync bidirectionally with parent FilterState

**Keyboard navigation**: Not implemented — mouse only.

### 5.2 Filter Panel

**Opening**: Click "Filters" button (black pill with SlidersHorizontal icon)
**Animation**: `animate-in slide-in-from-left duration-300`
**Closing**: Click X button, click overlay, or click "Show results"

**Filter sections** (in order):

1. **Property type** — Checkbox list with subtypes indicator
   - Options: Villa, Penthouse, Apartment, Finca, New Build, Land
   - Subtypes shown as "All subtypes ▾" (not expandable yet)

2. **Price range** — Two text inputs + preset chips
   - Min/Max inputs, placeholder "€ No Min" / "€ No Max"
   - Presets: €500K+, €1M+, €2M+, €5M+, €10M+
   - Default: empty (no filter)

3. **Living area** — Two text inputs
   - Min/Max in m², placeholder "No Min" / "No Max"
   - Label: "m²" below

4. **Bedrooms** — Button group
   - Options: Any, 1+, 2+, 3+, 4+, 5+
   - Default: "Any"

5. **Bathrooms** — Button group
   - Options: Any, 1+, 2+, 3+, 4+
   - Default: "Any"

6. **Amenities** — Checkbox list
   - Options: Sea Views, Pool, Garden, Garage, Terrace, Smart Home, Gym, Wine Cellar

**Footer**: Sticky bottom, "Clear all" link + "Show results" black button

### 5.3 Active Filter Chips

**Location**: Between search bar and page title
**Display rules**:
- Locations: chip per location with name
- Types: chip per type with label
- Price: single chip, formatted: "€500K – €2M", "From €1M", "Up to €5M"
- Area: single chip, formatted: "100 m² – 500 m²"
- Beds: "3+ Beds"
- Baths: "2+ Baths"
- Amenities: chip per amenity
- New Builds: "New Builds"
- Hide POR: "Hide Price on Request"

**Price formatting**: `formatPrice()` — ≥1M → "€XM", ≥1K → "€XK", else "€X"

**Clear behavior**: Each chip has X to remove individually. "Clear all" resets to `defaultFilters`.

### 5.4 Dropdown Filter Buttons (top bar)

Each dropdown is independent with shared `useDropdown()` hook:
- Click-outside detection via `mousedown` event listener
- `useRef` for container element

**Filter bar order**: Location search | divider | Filters (black) | Type | Price | Beds | Amenities | New Builds

### 5.5 URL State

**Not implemented.** All filter state is component-local via `useState`. No URL params.

---

## 6. MAP INTEGRATION

### 6.1 Property Detail Map

**Status**: Placeholder only — no actual map rendered.
**Placeholder**: `bg-neutral-100 h-[250px]`, centered MapPin icon + "Interactive Map" text
**Library available**: Leaflet `^1.9.4` + react-leaflet `^5.0.0` (installed but not used in luxury portal)

### 6.2 CRM Location Maps

**Library**: Leaflet via react-leaflet
**Usage**: Location management module (CRM admin) for viewing GeoJSON boundaries
**Not used in public-facing luxury portal**

---

## 7. STATE MANAGEMENT

### 7.1 Global State

**None.** No Redux, Zustand, or Context providers for global state.

### 7.2 Component-Level State

#### LuxuryPropertyListing

| State | Type | Initial | Updates | Reads |
|-------|------|---------|---------|-------|
| `filtersOpen` | `boolean` | `false` | "Filters" button click, sidebar close | FilterSidebar `open` prop |
| `filters` | `FilterState` | `defaultFilters` | All filter interactions | Dropdowns, sidebar, chips, (future: list filtering) |

#### LuxuryLandingPage

| State | Type | Initial | Updates | Reads |
|-------|------|---------|---------|-------|
| `currentSlide` | `number` | `0` | Auto-timer (5s), slide dot click | Hero images, headline text |
| `mobileMenuOpen` | `boolean` | `false` | Hamburger click, resize ≥1024 | Mobile menu panel |
| `langOpen` | `boolean` | `false` | Globe button click | Language dropdown |
| `currentLang` | `string` | `"EN"` | Language selection | Globe label, menu chips |

#### LocationSearchDropdown

| State | Type | Initial | Updates | Reads |
|-------|------|---------|---------|-------|
| `open` | `boolean` | `false` | Focus, click-outside | Dropdown visibility |
| `query` | `string` | `""` | Input typing | Search filtering |
| `recentSearches` | `LocationItem[]` | localStorage | Adding locations | Dropdown recent section |

#### BlogListingPage

| State | Type | Initial | Updates | Reads |
|-------|------|---------|---------|-------|
| `activeCategory` | `string` | `"all"` | Category button click | Post filtering |
| `searchQuery` | `string` | `""` | Search input | Post filtering |
| `visibleCount` | `number` | `6` | "Load More" click | Pagination |

### 7.3 Scroll-Based State

- `useContainerScrolled(ref, threshold=60)` — Returns `boolean` based on container scroll position
- Used for: Navbar transparency transition (landing, blog)
- Not used on listing page (navbar always solid white)

---

## 8. DATA MODELS

### 8.1 Property (Listing)

| Field | Type | Required | Example | UI Display |
|-------|------|----------|---------|------------|
| `id` | `number` | Yes | `1` | URL param `/property/1` |
| `image` | `string` (import) | Yes | `heroImg` | Card main image |
| `gallery` | `string[]` | Yes | `[heroImg, detail1, detail2]` | Photo count "1/3" |
| `tag` | `string` | Yes | `"FOR SALE"` / `"NEW BUILD"` | Badge + image overlay |
| `style` | `string` | Yes | `"Contemporary"` | Italic label next to tag |
| `location` | `string` | Yes | `"Santa Eulalia del Río · Ibiza"` | Location line (uppercase) |
| `title` | `string` | Yes | `"STUNNING CONTEMPORARY..."` | Card heading |
| `excerpt` | `string` | Yes | `"This exceptional..."` | Card description (2 lines) |
| `beds` | `number` | Yes | `5` | Specs row |
| `baths` | `number` | Yes | `4` | Specs row |
| `sqm` | `number` | Yes | `420` | Specs row as "420 m²" |
| `plot` | `number \| null` | Yes | `1200` / `null` | Specs row (conditional) "1,200 m²" |
| `price` | `string` | Yes | `"€4,650,000"` | Price section (serif) |
| `features` | `string[]` | Yes | `["Sea Views", ...]` | Feature dots row |

### 8.2 Property (Detail)

Additional fields beyond listing:

| Field | Type | Example | UI Display |
|-------|------|---------|------------|
| `garage` | `number` | `2` | Specs strip |
| `year` | `number` | `2023` | Agent card footer |
| `ref` | `string` | `"PE-IBZ-2847"` | Below price |
| `energyClass` | `string` | `"A"` | Agent card footer |
| `status` | `string` | `"Available"` | Agent card footer (green) |
| `description` | `string` | Multi-paragraph | Description section (pre-line) |
| `features` | `string[]` | 16 items | Checklist grid |
| `agent.name` | `string` | `"Isabella Martínez"` | Agent card |
| `agent.role` | `string` | `"Senior Property Advisor"` | Agent card |
| `agent.phone` | `string` | `"+34 600 123 456"` | Call CTA |
| `agent.email` | `string` | `"isabella@..."` | Email CTA |

### 8.3 Location (Search)

| Field | Type | Example |
|-------|------|---------|
| `id` | `string` | `"m6"` |
| `parentId` | `string \| null` | `"r4"` |
| `level` | `LocationLevel` | `"municipality"` |
| `name` | `string` | `"Marbella"` |
| `safeName` | `string` | `"marbella"` |
| `names` | `Record<string, string>` | `{ en: "Marbella", es: "Marbella" }` |
| `slugs` | `Record<string, string>` | `{ en: "marbella", es: "marbella" }` |
| `active` | `boolean` | `true` |
| `order` | `number` | `1` |
| `geojson` | `string \| null` | GeoJSON Polygon |
| `childrenCount` | `number` | `2` |

**Hierarchy**: Country → Province → Region → Municipality → Borough

**Mock data**: 1 country (España), 3 provinces, 4 regions, 7 municipalities, 7 boroughs = **22 total locations**

### 8.4 Blog Post

| Field | Type | Example |
|-------|------|---------|
| `id` | `string` | `"1"` |
| `image` | `string` (import) | `propertyDetail1` |
| `date` | `string` | `"26 Feb 2026"` |
| `category` | `string` | `"lifestyle"` |
| `title` | `string` | `"An Insider's Guide..."` |
| `excerpt` | `string` | Multi-sentence |
| `author` | `string` | `"Alexandra Morel"` |
| `readTime` | `number` | `8` |
| `featured` | `boolean` | `true` |

---

## 9. INTERACTIONS & UX FLOWS

### 9.1 Searching for Properties

1. **User arrives at `/properties`** — sees sticky navbar + sticky search/filter bar + 6 property cards
2. **User clicks location search** — dropdown opens showing "Search near me" + recent searches (if any)
3. **User types "Mar"** — dropdown shows filtered results matching location names (e.g., "Marbella, Costa del Sol Occidental, Málaga, España" — type: "City")
4. **User clicks result** — location added to `filters.locations`, chip appears inside input (max 2 visible), chip appears below search bar, recent searches updated in localStorage
5. **User types again** — adds second location, both chips visible in input
6. **User adds 3rd location** — input shows 2 chips + "+1" counter
7. **User opens dropdown** — sees "Selected" section at top with all 3 locations, each with X to remove

### 9.2 Applying Filters

1. **Via top bar dropdowns**: Click "Type" → check "Villa" + "Penthouse" → button turns black with count badge "2" → chips "Villa" and "Penthouse" appear below search bar
2. **Via "Filters" button**: Sidebar slides in from left → check checkboxes, select beds/baths buttons, enter price range → click "Show results" → sidebar closes → all selections reflected as chips
3. **Via "New Builds" toggle**: Click pill → turns black → "New Builds" chip appears
4. **Removing filters**: Click X on any chip, or "Clear all" to reset everything

### 9.3 Viewing Property Detail

1. **User clicks property card** — navigates to `/property/:id`
2. **Page loads** — dark navbar, 1+4 photo grid
3. **User clicks any photo** — lightbox opens (`z-[100]`, `bg-luxury-black/95`)
4. **User navigates photos** — left/right arrows, counter "X / 8"
5. **User clicks outside or X** — lightbox closes
6. **Scroll behavior** — standard scroll, no parallax

### 9.4 Blog Browsing

1. **User clicks category** — posts filter instantly, featured post only shows on "All" + no search query
2. **User types in search** — filters by title and excerpt (case-insensitive), instant
3. **User clicks "Load More"** — shows 6 more posts
4. **Empty state** — "No articles found matching your criteria."

---

## 10. EXACT CSS VALUES REFERENCE

### Luxury Portal Elements

| Element | Property | Value |
|---------|----------|-------|
| Navbar | height | `68px` (desktop), `60px` (mobile) |
| Navbar | background (scrolled) | `bg-white/95 backdrop-blur-md` |
| Navbar | z-index | `50` |
| Search bar sticky | top | `68px` |
| Search bar sticky | z-index | `40` |
| Container | max-width | `1400px` |
| Container | padding-x | `24px` (default), `40px` (lg) |
| Location search input | width | `420px` |
| Location search input | height | `40px` |
| Location search input | border-radius | `9999px` (rounded-full) |
| Filter button (pill) | padding | `6px 16px` |
| Filter button (pill) | font-size | `12px` |
| Filter button (pill) | border-radius | `9999px` |
| Filter sidebar | width | `340px` |
| Filter sidebar | z-index | `50` |
| Filter sidebar overlay | z-index | `40` |
| Filter sidebar overlay | background | `rgba(10,10,10,0.3)` |
| Type dropdown | width | `300px` |
| Price dropdown | width | `380px` |
| Beds dropdown | width | `320px` |
| Amenities dropdown | width | `480px` |
| Amenities dropdown | max-height | `420px` |
| Dropdown | border-radius | `2px` (rounded-sm) |
| Dropdown | shadow | `shadow-lg` |
| Dropdown | z-index | `50` |
| Search dropdown | border-radius | `12px` (rounded-xl) |
| Search dropdown | min-width | `320px` |
| Active chip | background | `rgb(245,245,245)` (neutral-100) |
| Active chip | padding | `6px 12px 6px 8px` (pl-3 pr-2 py-1.5) |
| Active chip | border-radius | `9999px` |
| Active chip | font-size | `12px` |
| Property card | grid | `12 cols` (5 image + 7 info) |
| Property card | background | `rgb(250,250,250)` (neutral-50) |
| Property card | border | `1px solid rgb(229,229,229)` |
| Property card | border-radius | `2px` |
| Property card | margin-bottom | `24px` |
| Property card image | min-height | `220px` |
| Property card image | aspect-ratio | `16/10` (mobile) |
| Property card hover | shadow | `shadow-md` |
| Property card hover | image scale | `1.05` over `700ms` |
| NEW BUILD tag | background | `rgba(10,10,10,0.6)` |
| NEW BUILD tag | backdrop-filter | `blur(4px)` |
| NEW BUILD tag | font-size | `10px` |
| NEW BUILD tag | letter-spacing | `0.12em` |
| NEW BUILD tag | padding | `4px 10px` |
| Photo count badge | background | `rgba(10,10,10,0.6)` |
| Tag badge (info area) | border | `1px solid rgba(10,10,10,0.2)` |
| Tag badge (info area) | font-size | `10px` |
| Tag badge (info area) | letter-spacing | `0.18em` |
| Style label | font-size | `11px` |
| Style label | font-style | `italic` |
| Spec label | font-size | `10px` |
| Spec label | letter-spacing | `0.1em` |
| Spec value | font-size | `15px` |
| Feature dot | size | `4px × 4px` |
| Feature dot | color | `rgba(10,10,10,0.2)` |
| Feature text | font-size | `11px` |
| Price text | font-size | `20px` (default), `24px` (md) |
| Price text | font-family | Playfair Display |
| Pagination "Next" | padding | `12px 64px` |
| Pagination "Next" | border-radius | `9999px` |
| Page number button | size | `32px × 32px` |
| Hero section | height | `55vh / 70vh / 85vh` |
| Hero overlay | gradient | `from-black/30 via-black/10 to-black/50` |
| Hero headline | font-size | `24px / 36px / 72px` |
| Hero CTA primary | padding | `14px 32px` |
| Hero slide indicator | height | `2px` |
| Hero slide indicator | width | `32px` (active), `16px` (inactive) |
| Hero auto-advance | interval | `5000ms` |
| Hero Ken Burns | scale | `1.05` |
| Hero Ken Burns | duration | `6s ease-out` |
| FadeIn animation | translateY | `32px → 0` |
| FadeIn animation | duration | `0.8s ease` |
| Stats number | font-size | `30px / 36px` |
| Property grid (landing) | aspect-ratio | `4/3` (mobile), `3/4` (desktop) |
| Blog featured image | aspect-ratio | `4/3` |
| Blog post image | aspect-ratio | `16/10` |
| Blog grid | columns | `1 / 2 / 3` |
| Newsletter input | padding | `12px 16px` |
| Newsletter button | letter-spacing | `0.15em` |
| Footer social icon | size | `36px × 36px` |
| Lightbox | z-index | `100` |
| Lightbox | background | `rgba(10,10,10,0.95)` |
| Lightbox nav arrows | size | `32px × 32px` |
| Agent card CTA | letter-spacing | `0.15em` |
| Agent card CTA | padding-y | `12px` |
| Gallery grid | height | `280px / 420px / 480px` |
| Gallery gap | gap | `6px` (gap-1.5) |

### Transition Durations

| Element | Duration | Easing |
|---------|----------|--------|
| Navbar bg change | `500ms` | `ease` (default) |
| Nav link color | `300ms` | `ease` (default) |
| Button hover | `200ms` | `ease` (default) |
| Button hover (CTA) | `300ms` | `ease` (default) |
| Image zoom | `700ms` | `ease` (default) |
| Image zoom (500ms) | `500ms` | `ease` (default) |
| Hero slide opacity | `1500ms` | `ease-in-out` |
| FadeIn | `800ms` | `ease` |
| Filter sidebar | `300ms` | `ease` (animate-in) |
| Card shadow | `300ms` | `ease` (default) |
| Property card title | `300ms` | `ease` (default) |

---

## APPENDIX A: Utility Functions

### `cn()` — Class Name Merger
```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### `formatPrice()` — Price Display Formatter
```ts
const formatPrice = (val: string) => {
  const n = parseInt(val);
  if (isNaN(n)) return val;
  if (n >= 1000000) return `€${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`;
  if (n >= 1000) return `€${(n / 1000).toFixed(0)}K`;
  return `€${n}`;
};
```

### `buildPath()` — Location Breadcrumb Builder
```ts
const buildPath = (locationId: string): string => {
  const parts: string[] = [];
  let current = mockLocations.find((l) => l.id === locationId);
  while (current) {
    parts.unshift(current.name);
    current = current.parentId
      ? mockLocations.find((l) => l.id === current!.parentId)
      : undefined;
  }
  return parts.join(", ");
};
```

### `buildActiveChips()` — Filter State → Chip Array
```ts
function buildActiveChips(f: FilterState): ActiveChip[] {
  // Builds array of { key, label, group } from all active filter values
  // Groups: location, type, price, area, beds, baths, amenity, newBuilds, hidePOR
}
```

### `removeChip()` — Remove Single Filter Chip
```ts
function removeChip(f: FilterState, chip: ActiveChip): FilterState {
  // Returns new FilterState with the specified chip's filter value removed
}
```

---

## APPENDIX B: Image Assets

All images are in `src/assets/` and imported as ES6 modules:

| File | Usage |
|------|-------|
| `luxury-hero.jpg` | Hero slides, property images |
| `luxury-property-1.jpg` | Property listings, featured |
| `luxury-property-2.jpg` | Property listings, blog |
| `luxury-property-3.jpg` | Property listings, blog |
| `property-1.jpg` | CRM properties |
| `property-2.jpg` | CRM properties |
| `property-3.jpg` | CRM properties |
| `property-detail-1.jpg` | Gallery, blog featured |
| `property-detail-2.jpg` | Gallery |
| `property-detail-3.jpg` | Gallery |
| `property-detail-4.jpg` | Gallery |
| `property-detail-5.jpg` | Gallery |
| `blog-featured.jpg` | Blog (unused in current code) |
| `featured-banner.jpg` | Banner (unused in current code) |

---

## APPENDIX C: shadcn/ui Components Installed

All in `src/components/ui/`:

accordion, alert, alert-dialog, aspect-ratio, avatar, avatar-upload, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, searchable-select, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toast, toaster, toggle, toggle-group, tooltip

**Config** (`components.json`):
```json
{
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

---

*End of Technical Documentation*
