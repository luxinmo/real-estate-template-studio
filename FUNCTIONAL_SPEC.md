# OMNI47 — Functional Specification

> Complete luxury real estate website template. All components are **pure/presentational** — they receive typed props only, with zero hardcoded data or remote state.

---

## Architecture Overview

```
src/components/omni47/
├── types.ts                          # All TypeScript interfaces
├── index.ts                          # Barrel exports
├── layout/
│   ├── Omni47Navbar.tsx              # Global navigation
│   ├── Omni47Footer.tsx              # Global footer
│   └── Omni47Layout.tsx              # Page wrapper (navbar + footer)
├── shared/
│   ├── Omni47Button.tsx              # CTA button component
│   ├── Omni47PropertyCard.tsx        # Property card (vertical/horizontal)
│   └── Omni47SectionLabel.tsx        # Section label badge
├── home/
│   ├── Omni47Hero.tsx                # Full-screen hero
│   ├── Omni47StatsBar.tsx            # 4-stat bar
│   ├── Omni47AboutSection.tsx        # About with video CTA
│   ├── Omni47FeaturedProperties.tsx  # Horizontal scroll carousel
│   ├── Omni47BrowseByDestination.tsx # 6-col destination grid
│   ├── Omni47NewDevelopments.tsx     # New build cards
│   └── Omni47OffMarketSection.tsx    # CTA overlay section
├── pages/
│   ├── Omni47HomePage.tsx            # Composed home page
│   ├── Omni47PropertyListPage.tsx    # Filterable listing
│   ├── Omni47PropertyDetailPage.tsx  # Full property detail
│   ├── Omni47StaticPage.tsx          # Generic content page
│   ├── Omni47ContactPage.tsx         # Contact form + offices
│   ├── Omni47BlogListPage.tsx        # Blog listing
│   ├── Omni47BlogPostPage.tsx        # Single blog post
│   ├── Omni47AdminPagesPage.tsx      # CMS page editor
│   └── Omni47AdminBlogPage.tsx       # CMS blog editor
└── demo/
    ├── Omni47DemoApp.tsx             # Route-based demo shell
    └── mock-data.ts                  # Sample data for all pages
```

---

## Routes

| Route                     | Page Component             | Description                |
| ------------------------- | -------------------------- | -------------------------- |
| `/omni47`                 | Omni47HomePage             | Home page                  |
| `/omni47/properties`      | Omni47PropertyListPage     | Property listing + filters |
| `/omni47/property/:id`    | Omni47PropertyDetailPage   | Property detail            |
| `/omni47/page/:slug`      | Omni47StaticPage           | Generic content page       |
| `/omni47/contact`         | Omni47ContactPage          | Contact form + offices     |
| `/omni47/blog`            | Omni47BlogListPage         | Blog listing               |
| `/omni47/blog/:slug`      | Omni47BlogPostPage         | Blog post                  |
| `/omni47/admin/pages`     | Omni47AdminPagesPage       | CMS page management        |
| `/omni47/admin/blog`      | Omni47AdminBlogPage        | CMS blog management        |

---

## Component Specifications

### 1. Omni47Navbar

```typescript
interface Omni47NavbarProps {
  logo: ImageAsset;
  items: NavItem[];
  ctaButton?: CTAButton;
  currentLang?: string;
  languages?: { code: string; label: string }[];
  onLanguageChange?: (code: string) => void;
  transparent?: boolean;
}
```

**API Endpoint:** `GET /api/settings/navigation`
**States:** Default, transparent (on hero), mobile menu open
**Actions:** Language switch (onLanguageChange), mobile toggle

---

### 2. Omni47Footer

```typescript
interface Omni47FooterProps {
  logo: ImageAsset;
  description: string;
  columns: FooterColumn[];
  socialLinks: SocialLink[];
  copyright: string;
  bottomLinks?: { label: string; href: string }[];
}
```

**API Endpoint:** `GET /api/settings/footer`
**States:** Default only

---

### 3. Omni47Hero

```typescript
interface Omni47HeroProps {
  backgroundImage: string;
  headline: string;
  subheadline: string;
  buttons: CTAButton[];
  overlayOpacity?: number;
}
```

**API Endpoint:** `GET /api/pages/home/hero`
**States:** Default, loading (skeleton)

---

### 4. Omni47StatsBar

```typescript
interface Omni47StatsBarProps {
  stats: StatItem[];  // max 4
}
```

**API Endpoint:** `GET /api/stats`
**States:** Default, loading

---

### 5. Omni47AboutSection

```typescript
interface Omni47AboutSectionProps {
  label: string;
  title: string;
  description: string;
  image?: ImageAsset;
  videoUrl?: string;
  videoButtonLabel?: string;
}
```

**API Endpoint:** `GET /api/pages/home/about`
**States:** Default
**Actions:** Play video (opens modal/lightbox)

---

### 6. Omni47FeaturedProperties

```typescript
interface Omni47FeaturedPropertiesProps {
  title: string;
  subtitle: string;
  viewAllLabel: string;
  viewAllHref: string;
  properties: PropertyCardData[];  // max 4
}
```

**API Endpoint:** `GET /api/properties?featured=true&limit=4`
**States:** Default, loading, empty

---

### 7. Omni47BrowseByDestination

```typescript
interface Omni47BrowseByDestinationProps {
  title: string;
  subtitle: string;
  destinations: DestinationCard[];
}
```

**API Endpoint:** `GET /api/destinations`
**States:** Default
**Responsive:** 6 cols desktop / 3 tablet / 2 mobile

---

### 8. Omni47NewDevelopments

```typescript
interface Omni47NewDevelopmentsProps {
  label: string;
  title: string;
  description: string;
  stats: StatItem[];
  developments: NewDevelopmentCard[];
}
```

**API Endpoint:** `GET /api/developments?status=active`
**States:** Default, loading, empty
**Special:** Cards show NEW BUILD badge, delivery quarter

---

### 9. Omni47OffMarketSection

```typescript
interface Omni47OffMarketSectionProps {
  backgroundImage: string;
  headline: string;
  description: string;
  button: CTAButton;
}
```

**API Endpoint:** `GET /api/pages/home/off-market`
**States:** Default
**Actions:** CTA click → registration/access request

---

### 10. Omni47PropertyCard

```typescript
interface Omni47PropertyCardProps {
  property: PropertyCardData;
  variant?: "vertical" | "horizontal";
  onContact?: (id: string) => void;
}
```

**States:** Default, hover, off-market badge, featured tag
**Actions:** Image carousel (prev/next), contact click

---

### 11. Omni47PropertyListPage

```typescript
interface Omni47PropertyListPageProps {
  operationOptions: FilterOption[];
  locationPlaceholder: string;
  typeOptions: FilterOption[];
  priceRangeOptions: FilterOption[];
  bedsOptions: FilterOption[];
  amenityOptions: FilterOption[];
  activeFilters: ActiveFilter[];
  onRemoveFilter?: (key: string) => void;
  onClearFilters?: () => void;
  resultsCount: number;
  sortOptions: FilterOption[];
  currentSort: string;
  onSortChange?: (value: string) => void;
  properties: PropertyCardData[];
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  onContactProperty?: (id: string) => void;
}
```

**API Endpoint:** `GET /api/properties?operation=sale&location=...&type=...&price=...&beds=...&sort=...&page=1`
**States:** Default, loading, empty results, error
**Actions:** Filter change, filter remove, clear all, sort, pagination, contact

---

### 12. Omni47PropertyDetailPage

```typescript
interface Omni47PropertyDetailPageProps {
  images: string[];
  title: string;
  ref: string;
  locationBreadcrumb: string[];
  price: string;
  operationTag: string;
  isOffMarket?: boolean;
  beds: number;
  baths: number;
  builtSqm: number;
  plotSqm?: number;
  description: string;
  features: FeatureGroup[];
  mapPlaceholder?: string;
  agent: AgentInfo;
  similarProperties: PropertyCardData[];
}
```

**API Endpoint:** `GET /api/properties/:id`
**States:** Default, loading, off-market, error (404)
**Actions:** Image gallery navigation, agent contact (call, email, WhatsApp)

---

### 13. Omni47StaticPage

```typescript
interface Omni47StaticPageProps {
  heroImage: string;
  title: string;
  content: ContentBlock[];
  sidebar?: { title: string; content: string }[];
}
```

**API Endpoint:** `GET /api/pages/:slug`
**States:** Default, loading, 404
**Content blocks:** heading, paragraph, image, cta

---

### 14. Omni47ContactPage

```typescript
interface Omni47ContactPageProps {
  heroTitle: string;
  heroSubtitle: string;
  formTitle: string;
  subjectOptions: FilterOption[];
  offices: OfficeInfo[];
  mapPlaceholder?: string;
  onSubmit?: (data: ContactFormData) => void;
}
```

**API Endpoint:**
- `GET /api/offices`
- `POST /api/contact` → `{ name, email, phone, subject, message, offices[] }`

**States:** Default, submitting, success, error
**Actions:** Multi-office selection, form submit

---

### 15. Omni47BlogListPage

```typescript
interface Omni47BlogListPageProps {
  heroTitle: string;
  heroSubtitle: string;
  featuredPost: BlogPostCard;
  posts: BlogPostCard[];
  categories: FilterOption[];
  currentCategory: string;
  onCategoryChange?: (value: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}
```

**API Endpoint:** `GET /api/blog?category=all&page=1`
**States:** Default, loading, empty
**Actions:** Category filter, pagination

---

### 16. Omni47BlogPostPage

```typescript
interface Omni47BlogPostPageProps {
  heroImage: string;
  title: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  content: string;  // HTML
  relatedPosts: BlogPostCard[];
  shareUrl: string;
}
```

**API Endpoint:** `GET /api/blog/:slug`
**States:** Default, loading, 404
**Actions:** Share (Facebook, Twitter, LinkedIn)

---

### 17. Omni47AdminPagesPage

```typescript
interface Omni47AdminPagesPageProps {
  pages: AdminPage[];
  languages: LanguageTab[];
  onSave?: (page: AdminPage, blocks: AdminContentBlock[]) => void;
  onPublish?: (pageId: string) => void;
  onDelete?: (pageId: string) => void;
}
```

**API Endpoints:**
- `GET /api/admin/pages`
- `POST /api/admin/pages` → create
- `PUT /api/admin/pages/:id` → update
- `DELETE /api/admin/pages/:id`
- `PUT /api/admin/pages/:id/publish`

**States:** List view, editor view
**Actions:** Create, edit, delete, save, publish, add/move/remove content blocks, language switch

---

### 18. Omni47AdminBlogPage

```typescript
interface Omni47AdminBlogPageProps {
  posts: AdminBlogPost[];
  categories: FilterOption[];
  languages: LanguageTab[];
  onSave?: (post: AdminBlogPost) => void;
  onPublish?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}
```

**API Endpoints:**
- `GET /api/admin/blog`
- `POST /api/admin/blog` → create
- `PUT /api/admin/blog/:id` → update
- `DELETE /api/admin/blog/:id`
- `PUT /api/admin/blog/:id/publish`

**States:** List view, editor view
**Actions:** Create, edit, delete, save, publish, rich text editing, SEO fields, language switch

---

## Design Tokens

| Token             | Value       | Usage                        |
| ----------------- | ----------- | ---------------------------- |
| `omni47-cream`    | `#F5F0E8`   | Background                   |
| `omni47-navy`     | `#1B2A3B`   | Primary text, buttons        |
| `omni47-gold`     | `#C9A96E`   | Accent, labels, CTAs         |
| `omni47-navy-light` | `#2D4A63` | Hover states                 |
| `omni47-gold-light` | `#D4BF8E` | Light accent                 |
| `omni47-cream-dark` | `#E6DDD0` | Borders, dividers            |
| `omni47-text`     | `#1B2A3B`   | Body text                    |
| `omni47-text-muted` | `#5C6B7A` | Secondary text               |

## Typography

| Element           | Font                | Weight      | Size           |
| ----------------- | ------------------- | ----------- | -------------- |
| Headings          | Cormorant Garamond  | Extralight  | 32-72px        |
| Body              | Jost                | Light       | 13-15px        |
| Labels/Caps       | Jost                | Light       | 10-12px        |
| Monospace (Refs)  | System monospace    | Normal      | 11px           |

## Responsive Breakpoints

- Mobile: < 640px (1 col)
- Tablet: 640-1023px (2-3 cols)
- Desktop: 1024px+ (full layout)
- Max width: 1280px (7xl container)
