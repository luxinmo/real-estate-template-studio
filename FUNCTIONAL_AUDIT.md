# FUNCTIONAL AUDIT — RealEstateOS Dashboard

> **Generated**: 2026-03-04  
> **Purpose**: Complete reference for connecting this UI prototype to real APIs  
> **Stack**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui  
> **Status**: UI-only prototype — all data is hardcoded mock

---

## Table of Contents

1. [Structure & Pages](#1-structure--pages)
2. [Components](#2-components)
3. [Mock Data](#3-mock-data)
4. [Libraries](#4-libraries)
5. [Types & Interfaces](#5-types--interfaces)
6. [API Connection Points](#6-api-connection-points)

---

## 1. Structure & Pages

The app is a single-page application with view-based routing managed via `useState<View>` in `src/pages/Index.tsx`. No React Router routes — all navigation is state-driven.

### Global Layout

| Element | File | Description |
|---------|------|-------------|
| Sidebar | `src/components/AppSidebar.tsx` | Left nav, 224px wide, collapsible on mobile |
| Header | `src/components/HeaderBar.tsx` | Top bar with search, hamburger (mobile), avatar |
| Main content | `src/pages/Index.tsx` | Conditional rendering based on `view` state |

### View Map

| View ID | Page Component | File | Description |
|---------|---------------|------|-------------|
| `dashboard` | `PlaceholderPage` | `Index.tsx` (inline) | Placeholder — not built yet |
| `properties` | `PropertiesPage` | `src/components/PropertiesPage.tsx` | Property listing with filters, grid/list view |
| `property-detail` | `PropertyDetailPage` | `src/components/PropertyDetailPage.tsx` | Full property detail with gallery, tabs, sidebar |
| `add-property` | `AddPropertyPage` | `src/components/AddPropertyPage.tsx` | Multi-section form for adding properties |
| `contacts` | `ContactsListPage` | `src/components/contacts/ContactsListPage.tsx` | Contact table with role/status filters |
| `add-contact` | `AddContactPage` | `src/components/contacts/AddContactPage.tsx` | Contact creation form |
| `contact-detail` | `ContactDetailPage` | `src/components/contacts/ContactDetailPage.tsx` | Contact detail with tabs (data, properties, activity, billing) |
| `agencies` | `AgenciesPage` | `src/components/agencies/AgenciesPage.tsx` | Agency grid with collaboration status filters |
| `analytics` | `AnalyticsDashboard` | `src/components/analytics/AnalyticsDashboard.tsx` | **8-tab analytics dashboard** (see below) |
| `loc-countries` | `CountriesPage` | `src/components/locations/CountriesPage.tsx` | Country list for location hierarchy |
| `loc-provinces` | `ProvincesPage` | `src/components/locations/ProvincesPage.tsx` | Provinces within a country |
| `loc-regions` | `RegionsPage` | `src/components/locations/RegionsPage.tsx` | Regions within a province |
| `loc-municipalities` | `MunicipalitiesPage` | `src/components/locations/MunicipalitiesPage.tsx` | Municipalities within a region |
| `loc-municipality-detail` | `MunicipalityDetailPage` | `src/components/locations/MunicipalityDetailPage.tsx` | Municipality detail with boroughs |
| `loc-borough-form` | `BoroughFormPage` | `src/components/locations/BoroughFormPage.tsx` | Borough create/edit form |
| `imp-fuentes` | `FuentesPage` | `src/components/importer/FuentesPage.tsx` | XML import sources management |
| `imp-mapeo` | `MapeoPage` | `src/components/importer/MapeoPage.tsx` | Field mapping for an import source |
| `imp-historial` | `HistorialPage` | `src/components/importer/HistorialPage.tsx` | Import batch history |
| `imp-scheduler` | `SchedulerPage` | `src/components/importer/SchedulerPage.tsx` | Scheduled import jobs |
| `imp-pendientes` | `PendientesPage` | `src/components/importer/PendientesPage.tsx` | Unmapped values pending assignment |
| `cms-pages` | `CmsPagesListPage` | `src/components/cms/CmsPagesListPage.tsx` | CMS static pages list |
| `cms-page-editor` | `CmsPageEditorPage` | `src/components/cms/CmsPageEditorPage.tsx` | Page editor with multilingual tabs (EN, ES, DE, FR, RU, NL) |
| `cms-blog` | `CmsBlogListPage` | `src/components/cms/CmsBlogListPage.tsx` | Blog posts list |
| `cms-blog-editor` | `CmsBlogEditorPage` | `src/components/cms/CmsBlogEditorPage.tsx` | Blog editor with multilingual tabs, FAQ section |
| `users` | `UsersPage` | `src/components/UsersPage.tsx` | User management table |
| `company` | `CompanyPage` | `src/components/company/CompanyPage.tsx` | Company profile with tabs (Home, About, Agents, Stats) |
| `card-designer` | `CardDesignerPage` | `src/components/card-designer/CardDesignerPage.tsx` | Property card visual designer with HTML export |
| `components` | `ComponentsPage` | `src/components/ComponentsPage.tsx` | UI component library / design system showcase |
| `settings` | `PlaceholderPage` | `Index.tsx` (inline) | Placeholder — not built yet |

### Analytics Dashboard Sub-Views

The analytics module has its own internal tab navigation within `AnalyticsDashboard.tsx`:

| Tab ID | Component | File | Description |
|--------|-----------|------|-------------|
| `overview` | `AnalyticsOverview` | `analytics/AnalyticsOverview.tsx` | KPIs, sessions chart, top pages, top properties, device distribution, contact channels |
| `live` | `AnalyticsLive` | `analytics/AnalyticsLive.tsx` | Active visitor count, live sessions table, visitor map, country/device/language breakdown |
| `search` | `AnalyticsSearch` | `analytics/AnalyticsSearch.tsx` | Top searched locations, property types, price ranges, amenities, zero-result searches |
| `properties` | `AnalyticsProperties` | `analytics/AnalyticsProperties.tsx` | Property ranking by views/contacts/calls/shares/favorites, viewed-never-contacted alert |
| `funnel` | `AnalyticsFunnel` | `analytics/AnalyticsFunnel.tsx` | Conversion funnel visualization, funnel by device, conversion rate by language |
| `contacts` | `AnalyticsContacts` | `analytics/AnalyticsContacts.tsx` | Contact totals by channel, timeline chart, top contact-generating properties, conversion by country |
| `audience` | `AnalyticsAudience` | `analytics/AnalyticsAudience.tsx` | World map, sessions by country table, language/source/device breakdowns, new vs returning |
| `settings` | `AnalyticsSettings` | `analytics/AnalyticsSettings.tsx` | Data retention toggles, export buttons, bot sessions table |

---

## 2. Components

### 2.1 Global / Layout

| Component | File | Props |
|-----------|------|-------|
| `AppSidebar` | `AppSidebar.tsx` | `currentView: string`, `onNavigate: (view: string) => void`, `open: boolean`, `onClose: () => void` |
| `HeaderBar` | `HeaderBar.tsx` | `onMenuToggle: () => void` |
| `NavLink` | `NavLink.tsx` | Standard react-router NavLink wrapper |

### 2.2 Properties Module

| Component | File | Props | Data Needed |
|-----------|------|-------|-------------|
| `PropertiesPage` | `PropertiesPage.tsx` | `onViewProperty: () => void`, `onAddProperty: () => void` | Property list |
| `PropertyDetailPage` | `PropertyDetailPage.tsx` | `onBack: () => void` | Single property |
| `AddPropertyPage` | `AddPropertyPage.tsx` | `onBack: () => void` | Property types, locations |
| `PropertyCard` | `properties/PropertyCard.tsx` | Property data object | — |
| `PropertyFilterSidebar` | `properties/PropertyFilterSidebar.tsx` | Filter state + handlers | Filter options |
| `PropertyFilters` | `properties/PropertyFilters.tsx` | Filter state + handlers | — |
| `PropertySearchFilters` | `properties/PropertySearchFilters.tsx` | Search state + handlers | — |

#### Add Property Sub-Sections

All in `src/components/add-property/`:

| Component | Description |
|-----------|-------------|
| `GeneralDataSection` | Reference, type, operation, status |
| `LocationSection` | Country → Province → Region → Municipality selector |
| `DescriptionSection` | Multilingual descriptions |
| `AreasDivisionsSection` | Built area, plot area, rooms |
| `FeaturesSection` | Bedrooms, bathrooms, amenities |
| `OtherFeaturesSection` | Additional amenities toggles |
| `CadastralSection` | Cadastral reference, registry |
| `EnergyCertificateSection` | Energy rating fields |
| `PhotosSection` | Image upload grid |

#### Property Detail Sub-Components

All in `src/components/property-detail/`:

| Component | Description |
|-----------|-------------|
| `PropertyGallery` | Image carousel/gallery |
| `PropertyDescription` | Rich text description |
| `PropertyFeatures` | Feature grid |
| `PropertyTabs` | Detail tabs container |
| `PropertySidebar` | Price, agent, CTA sidebar |
| `PropertyContactForm` | Inquiry form |
| `PropertyMap` | Leaflet map embed |
| `PropertyVideo` | Video player embed |
| `MortgageCalculator` | Calculator widget |
| `NearbyPlaces` | POI list |

### 2.3 Contacts Module

| Component | File | Props |
|-----------|------|-------|
| `ContactsListPage` | `contacts/ContactsListPage.tsx` | `onAddContact`, `onViewContact: (id: string) => void` |
| `AddContactPage` | `contacts/AddContactPage.tsx` | `onBack: () => void` |
| `ContactDetailPage` | `contacts/ContactDetailPage.tsx` | `contactId: string`, `onBack`, `onEdit` |

### 2.4 Agencies Module

| Component | File | Props |
|-----------|------|-------|
| `AgenciesPage` | `agencies/AgenciesPage.tsx` | None — self-contained with internal mock data |

### 2.5 Analytics Module

| Component | File | Props | Data Source |
|-----------|------|-------|-------------|
| `AnalyticsDashboard` | `analytics/AnalyticsDashboard.tsx` | None | Internal tab state |
| `AnalyticsOverview` | `analytics/AnalyticsOverview.tsx` | None | `kpis`, `sessionsTimeline`, `topPages`, `topProperties`, `deviceDistribution`, `contactChannels` |
| `AnalyticsLive` | `analytics/AnalyticsLive.tsx` | None | `liveVisitors`, `countryBreakdown` |
| `AnalyticsSearch` | `analytics/AnalyticsSearch.tsx` | None | `topSearchLocations`, `topSearchTypes`, `searchPriceRanges`, `topAmenities`, `zeroResultSearches`, `topLocationQueries` |
| `AnalyticsProperties` | `analytics/AnalyticsProperties.tsx` | None | `topProperties`, `viewedNeverContacted` |
| `AnalyticsFunnel` | `analytics/AnalyticsFunnel.tsx` | None | `funnelSteps`, `funnelByDevice` |
| `AnalyticsContacts` | `analytics/AnalyticsContacts.tsx` | None | `contactChannels`, `contactsTimeline`, `topProperties`, `conversionByCountry` |
| `AnalyticsAudience` | `analytics/AnalyticsAudience.tsx` | None | `countryBreakdown`, `languageBreakdown`, `trafficSources`, `deviceDistribution`, `newVsReturning` |
| `AnalyticsSettings` | `analytics/AnalyticsSettings.tsx` | None | `botSessions` |
| `Flag` | `analytics/flags.tsx` | `code: string`, `className?: string` | Static PNG imports |

### 2.6 Locations Module

All in `src/components/locations/`:

| Component | Props |
|-----------|-------|
| `CountriesPage` | `onSelectCountry: (id: string) => void` |
| `ProvincesPage` | `countryId`, `onBack`, `onSelectProvince` |
| `RegionsPage` | `countryId`, `provinceId`, `onBackToCountries`, `onBackToProvinces`, `onSelectRegion` |
| `MunicipalitiesPage` | `countryId`, `provinceId`, `regionId`, `onBackTo*`, `onSelectMunicipality` |
| `MunicipalityDetailPage` | `countryId`, `provinceId`, `regionId`, `municipalityId`, `onBackTo*`, `onEditBorough` |
| `BoroughFormPage` | `countryId`, `provinceId`, `regionId`, `municipalityId`, `boroughId`, `onBackTo*` |
| `LocationSelector` | Location hierarchy selector component |
| `LocationBreadcrumb` | Breadcrumb nav for location hierarchy |
| `LocationEditPanel` | Side edit panel |
| `LocationSidebar` | Location tree sidebar |
| `MapPanel` | Leaflet map for location editing |
| `MultilingualContent` | Multi-language content fields |
| `RichTextEditor` | Simple rich text editor |

### 2.7 Importer Module

All in `src/components/importer/`:

| Component | Props |
|-----------|-------|
| `FuentesPage` | `onOpenMapeo: (id: string) => void`, `onOpenHistorial: () => void` |
| `MapeoPage` | `sourceId: string`, `onBack: () => void` |
| `HistorialPage` | None |
| `SchedulerPage` | None |
| `PendientesPage` | None |

### 2.8 CMS Module

All in `src/components/cms/`:

| Component | Props |
|-----------|-------|
| `CmsPagesListPage` | `onEdit: (id: string) => void`, `onNew: () => void` |
| `CmsPageEditorPage` | `pageId: string \| null`, `onBack: () => void` |
| `CmsBlogListPage` | `onEdit: (id: string) => void`, `onNew: () => void` |
| `CmsBlogEditorPage` | `postId: string \| null`, `onBack: () => void` |

### 2.9 Company Module

| Component | File | Props |
|-----------|------|-------|
| `CompanyPage` | `company/CompanyPage.tsx` | None — self-contained with internal state |

### 2.10 Other

| Component | File | Props |
|-----------|------|-------|
| `UsersPage` | `UsersPage.tsx` | None |
| `CardDesignerPage` | `card-designer/CardDesignerPage.tsx` | None |
| `CardPreview` | `card-designer/CardPreview.tsx` | Card config object |
| `LuxuryCardPreview` | `card-designer/LuxuryCardPreview.tsx` | Card config object |
| `ComponentsPage` | `ComponentsPage.tsx` | None |
| `ComponentBlock` | `ComponentBlock.tsx` | UI block wrapper |
| `ImageCropperDialog` | `shared/ImageCropperDialog.tsx` | Image crop props |
| `LogoUploader` | `shared/LogoUploader.tsx` | Upload handler props |

---

## 3. Mock Data

### 3.1 File Locations

| Module | Mock Data File | Types File |
|--------|---------------|------------|
| Analytics | `src/components/analytics/mock-data.ts` | Same file (inline `MockProperty` interface) |
| Contacts | `src/components/contacts/mock-data.ts` | `src/components/contacts/types.ts` |
| Importer | `src/components/importer/mock-data.ts` | `src/components/importer/types.ts` |
| CMS | `src/components/cms/mock-data.ts` | Same file (inline interfaces) |
| Locations | `src/components/locations/mock-data.ts` | `src/components/locations/types.ts` |
| Agencies | Inline in `AgenciesPage.tsx` | Inline interface |
| Company | Inline in `CompanyPage.tsx` | Inline `useState` |
| Properties | Inline in `PropertiesPage.tsx` / `PropertyDetailPage.tsx` | — |
| Users | Inline in `UsersPage.tsx` | — |

### 3.2 Analytics Mock Data Structures

File: `src/components/analytics/mock-data.ts`

```typescript
// Reference data
countries: { code: string; name: string; flag: string }[]
languages: string[]  // ["en", "es", "de", "fr", "nl", "ru", "sv"]
locations: string[]  // ["Calpe", "Altea", ...]
propertyTypes: string[]  // ["Villa", "Apartment", ...]

// KPIs
kpis: { label: string; value: string; change: number; icon: string }[]

// Timeline (30 days, generated)
sessionsTimeline: { date: string; sessions: number; visitors: number }[]

// Top Pages
topPages: { path: string; views: number; pct: number }[]

// Properties
interface MockProperty {
  ref: string;
  name: string;
  location: string;
  type: string;
  price: string;
  views: number;
  contacts: number;
  calls: number;
  shares: number;
  favorites: number;
}
topProperties: MockProperty[]
viewedNeverContacted: MockProperty[]

// Device Distribution
deviceDistribution: { device: string; sessions: number; pct: number }[]

// Contact Channels
contactChannels: { channel: string; count: number; pct: number; color: string }[]

// Live Visitors
liveVisitors: { country: string; flag: string; lang: string; device: string; page: string; time: string; pages: number }[]

// Country Breakdown
countryBreakdown: { code: string; flag: string; name: string; sessions: number; conversions: number; avgTime: string; pct: number }[]

// Search Insights
topSearchLocations: { location: string; searches: number }[]
topSearchTypes: { type: string; searches: number }[]
searchPriceRanges: { range: string; searches: number }[]
topAmenities: { amenity: string; searches: number }[]
zeroResultSearches: { query: string; count: number }[]
topLocationQueries: { query: string; count: number }[]

// Funnel
funnelSteps: { step: string; value: number; pct: number }[]
funnelByDevice: { device: string; steps: number[] }[]

// Contacts Timeline (30 days, generated)
contactsTimeline: { date: string; form: number; phone: number; email: number; whatsapp: number }[]

// Traffic Sources
trafficSources: { source: string; sessions: number; pct: number }[]
newVsReturning: { new: number; returning: number }

// Language Breakdown
languageBreakdown: { lang: string; label: string; sessions: number; pct: number }[]

// Conversion by Country
conversionByCountry: { country: string; code: string; contacts: number; rate: string }[]

// Bot Sessions
botSessions: { ip: string; ua: string; sessions: number; lastSeen: string }[]
```

### 3.3 Contacts Mock Data Structures

File: `src/components/contacts/mock-data.ts`

```typescript
MOCK_CONTACTS: Contact[]        // 10 contacts
MOCK_RELATED_CONTACTS: RelatedContact[]
MOCK_OWNED_PROPERTIES: OwnedProperty[]
MOCK_ACTIVITIES: ActivityItem[]
```

### 3.4 Importer Mock Data Structures

File: `src/components/importer/mock-data.ts`

```typescript
mockSources: ImportSource[]       // 4 import sources
mockBatches: ImportBatch[]        // 5 batch runs
mockBatchRecords: BatchRecord[]   // 7 individual records
mockFieldMappings: FieldMapping[] // 15 field mappings
mockValueMappings: ValueMapping[] // XML→internal value mappings
mockPendingValues: PendingValue[] // Values awaiting assignment
mockSchedulerJobs: SchedulerJob[] // 4 scheduled jobs
```

### 3.5 CMS Mock Data Structures

File: `src/components/cms/mock-data.ts`

```typescript
MOCK_PAGES: CmsPage[]          // 5 static pages
MOCK_BLOG_POSTS: CmsBlogPost[] // 4 blog posts
BLOG_CATEGORIES: string[]      // 6 categories
AVAILABLE_TAGS: string[]       // 14 tags
```

---

## 4. Libraries

### 4.1 Charts & Visualization

| Library | Version | Used In |
|---------|---------|---------|
| **Recharts** | ^2.15.4 | `AnalyticsOverview` (AreaChart, PieChart), `AnalyticsSearch` (BarChart), `AnalyticsContacts` (AreaChart), `AnalyticsAudience` (PieChart) |

Components used: `AreaChart`, `Area`, `BarChart`, `Bar`, `PieChart`, `Pie`, `Cell`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer`

### 4.2 UI Framework

| Library | Version | Usage |
|---------|---------|-------|
| **shadcn/ui** | (components) | Buttons, Inputs, Selects, Dialogs, Tabs, Cards, Badges, Tables, etc. |
| **Tailwind CSS** | (via PostCSS) | All styling — utility-first with design tokens |
| **class-variance-authority** | ^0.7.1 | Component variants (buttons, badges) |
| **tailwindcss-animate** | ^1.0.7 | Animation utilities |
| **@radix-ui/\*** | Various | Underlying primitives for shadcn components |

### 4.3 Icons

| Library | Version | Usage |
|---------|---------|-------|
| **lucide-react** | ^0.462.0 | All icons throughout the app |
| **Flag PNGs** | — | `src/assets/flags/*.png` (ES, DE, GB, NL, BE, FR, SE, NO, RU) via `flags.tsx` |

### 4.4 Maps

| Library | Version | Used In |
|---------|---------|---------|
| **Leaflet** | ^1.9.4 | `PropertyMap`, `MapPanel` (locations) |
| **react-leaflet** | ^5.0.0 | React bindings for Leaflet |
| **@types/leaflet** | ^1.9.21 | TypeScript types |

### 4.5 Forms & Validation

| Library | Version | Usage |
|---------|---------|-------|
| **react-hook-form** | ^7.61.1 | Form state management |
| **@hookform/resolvers** | ^3.10.0 | Validation resolvers |
| **zod** | ^3.25.76 | Schema validation |

### 4.6 Other

| Library | Version | Usage |
|---------|---------|-------|
| **date-fns** | ^3.6.0 | Date formatting |
| **react-image-crop** | ^11.0.10 | Image cropping in `ImageCropperDialog` |
| **html2canvas** | ^1.4.1 | Card designer HTML export |
| **embla-carousel-react** | ^8.6.0 | Carousel component |
| **sonner** | ^1.7.4 | Toast notifications |
| **vaul** | ^0.9.9 | Drawer component |
| **cmdk** | ^1.1.1 | Command palette |
| **react-resizable-panels** | ^2.1.9 | Resizable panel layout |
| **@tanstack/react-query** | ^5.83.0 | Data fetching (not actively used yet — available for API integration) |

---

## 5. Types & Interfaces

### 5.1 Contact Types (`src/components/contacts/types.ts`)

```typescript
type ContactType = "company" | "person";
type ContactRole = "client" | "provider" | "worker" | "owner" | "other";
type ContactStatus = "active" | "provisional" | "archived";
type RelationshipType = "partner" | "associate" | "employee" | "family" | "other";
type Language = "EN" | "ES" | "FR" | "DE" | "RU" | "NL" | "PL";
type ContactOrigin = "web" | "referral" | "cold-call" | "event" | "portal" | "other";

interface Contact {
  id: string;
  type: ContactType;
  name: string;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  comercialName?: string;
  cifNif: string;
  emails: string[];
  phones: string[];
  web?: string;
  address?: string;
  roles: ContactRole[];
  status: ContactStatus;
  avatar?: string;
  languages: Language[];
  origin?: ContactOrigin;
  notes?: string;
  paymentDays?: number;
  iban?: string;
  currency?: string;
}

interface RelatedContact {
  contactId: string;
  name: string;
  avatar?: string;
  relationship: RelationshipType;
}

interface OwnedProperty {
  id: string;
  title: string;
  reference: string;
  status: string;
  thumbnail?: string;
}

interface ActivityItem {
  id: string;
  date: string;
  description: string;
  type: "call" | "email" | "visit" | "note" | "document";
}
```

### 5.2 Importer Types (`src/components/importer/types.ts`)

```typescript
interface ImportSource {
  id: string;
  name: string;
  feedUrl: string;
  format: "kyero" | "xml_generic" | "xml_custom";
  frequency: "manual" | "1h" | "6h" | "12h" | "24h" | "custom";
  cronExpression?: string;
  active: boolean;
  testMode: boolean;
  lastRun?: string;
  lastRunStatus?: "ok" | "error";
  nextRun?: string;
}

interface ImportBatch {
  id: string;
  sourceId: string;
  sourceName: string;
  startedAt: string;
  duration?: string;
  status: "completed" | "failed" | "running" | "pending";
  newRecords: number;
  updatedRecords: number;
  unchangedRecords: number;
  errors: number;
}

interface BatchRecord {
  id: string;
  externalRef: string;
  action: "created" | "updated" | "unchanged" | "error";
  changes?: string;
  error?: string;
}

interface FieldMapping {
  xmlField: string;
  xmlType: "text" | "number" | "boolean";
  sampleValue: string;
  targetField?: string;
}

interface ValueMapping {
  id: string;
  xmlValue: string;
  omniValue: string;
  fieldType: string;
}

interface PendingValue {
  id: string;
  sourceId: string;
  sourceName: string;
  entityType: "tipo" | "caracteristica";
  xmlValue: string;
  detectedAt: string;
  occurrences: number;
  status: "pending" | "assigned" | "ignored";
  assignedTo?: string;
}

interface SchedulerJob {
  id: string;
  sourceId: string;
  sourceName: string;
  frequency: string;
  active: boolean;
  lastRun?: string;
  lastRunOk?: boolean;
  nextRun?: string;
  running: boolean;
  progress?: number;
}
```

### 5.3 Location Types (`src/components/locations/types.ts`)

```typescript
type LocationLevel = "country" | "province" | "region" | "municipality" | "borough";

interface LocationNode {
  id: string;
  parentId: string | null;
  level: LocationLevel;
  name: string;
  safeName: string;
  names: Record<string, string>;       // { en: "Spain", es: "España", ... }
  slugs: Record<string, string>;       // { en: "spain", es: "espana", ... }
  active: boolean;
  order: number;
  geojson: string | null;
  childrenCount: number;
  description?: string;
  seoTitle?: Record<string, string>;
  seoDescription?: Record<string, string>;
}
```

### 5.4 CMS Types (`src/components/cms/mock-data.ts`)

```typescript
interface CmsPage {
  id: string;
  title: string;
  slug: string;
  parentId: string | null;
  status: "published" | "draft" | "scheduled";
  publishedAt: string | null;
  scheduledAt: string | null;
  updatedAt: string;
  featuredImage: string | null;
  content: string;
  metaTitle: string;
  metaDescription: string;
}

interface CmsBlogPost {
  id: string;
  title: string;
  slug: string;
  status: "published" | "draft" | "scheduled";
  publishedAt: string | null;
  scheduledAt: string | null;
  updatedAt: string;
  author: string;
  featuredImage: string | null;
  excerpt: string;
  content: string;
  tags: string[];
  category: string;
  readTime: number;
  faq?: { question: string; answer: string }[];
}
```

### 5.5 Analytics Types (`src/components/analytics/mock-data.ts`)

```typescript
interface MockProperty {
  ref: string;
  name: string;
  location: string;
  type: string;
  price: string;
  views: number;
  contacts: number;
  calls: number;
  shares: number;
  favorites: number;
}
```

---

## 6. API Connection Points

### 6.1 How to Connect

Each component currently imports data directly from `mock-data.ts` files. To connect to real APIs:

1. **Replace imports** — swap `import { data } from "./mock-data"` with API fetch calls
2. **Use `@tanstack/react-query`** — already installed, use `useQuery` for data fetching
3. **Keep interfaces** — the TypeScript interfaces define the exact shape the components expect

### 6.2 Required Endpoints

#### Analytics Module

| Endpoint | Method | Response Type | Used By |
|----------|--------|---------------|---------|
| `GET /analytics/kpis?range={dateRange}` | GET | `KPI[]` | `AnalyticsOverview` |
| `GET /analytics/sessions/timeline?range={dateRange}` | GET | `{ date, sessions, visitors }[]` | `AnalyticsOverview` |
| `GET /analytics/pages/top?limit=10&range={dateRange}` | GET | `{ path, views, pct }[]` | `AnalyticsOverview` |
| `GET /analytics/properties/top?limit=10&sortBy={views\|contacts\|calls\|shares\|favorites}&range={dateRange}` | GET | `MockProperty[]` | `AnalyticsOverview`, `AnalyticsProperties` |
| `GET /analytics/properties/never-contacted?range={dateRange}` | GET | `MockProperty[]` | `AnalyticsProperties` |
| `GET /analytics/devices?range={dateRange}` | GET | `{ device, sessions, pct }[]` | `AnalyticsOverview`, `AnalyticsAudience` |
| `GET /analytics/channels?range={dateRange}` | GET | `{ channel, count, pct, color }[]` | `AnalyticsOverview`, `AnalyticsContacts` |
| `GET /analytics/live` | GET (poll) | `{ country, lang, device, page, time, pages }[]` | `AnalyticsLive` |
| `GET /analytics/countries?range={dateRange}` | GET | `{ code, name, sessions, conversions, avgTime, pct }[]` | `AnalyticsLive`, `AnalyticsAudience` |
| `GET /analytics/search/locations?range={dateRange}` | GET | `{ location, searches }[]` | `AnalyticsSearch` |
| `GET /analytics/search/types?range={dateRange}` | GET | `{ type, searches }[]` | `AnalyticsSearch` |
| `GET /analytics/search/prices?range={dateRange}` | GET | `{ range, searches }[]` | `AnalyticsSearch` |
| `GET /analytics/search/amenities?range={dateRange}` | GET | `{ amenity, searches }[]` | `AnalyticsSearch` |
| `GET /analytics/search/zero-results?range={dateRange}` | GET | `{ query, count }[]` | `AnalyticsSearch` |
| `GET /analytics/search/queries?range={dateRange}` | GET | `{ query, count }[]` | `AnalyticsSearch` |
| `GET /analytics/funnel?range={dateRange}` | GET | `{ step, value, pct }[]` | `AnalyticsFunnel` |
| `GET /analytics/funnel/by-device?range={dateRange}` | GET | `{ device, steps: number[] }[]` | `AnalyticsFunnel` |
| `GET /analytics/contacts/timeline?range={dateRange}` | GET | `{ date, form, phone, email, whatsapp }[]` | `AnalyticsContacts` |
| `GET /analytics/contacts/by-country?range={dateRange}` | GET | `{ country, code, contacts, rate }[]` | `AnalyticsContacts` |
| `GET /analytics/languages?range={dateRange}` | GET | `{ lang, label, sessions, pct }[]` | `AnalyticsAudience` |
| `GET /analytics/traffic-sources?range={dateRange}` | GET | `{ source, sessions, pct }[]` | `AnalyticsAudience` |
| `GET /analytics/new-vs-returning?range={dateRange}` | GET | `{ new, returning }` | `AnalyticsAudience` |
| `GET /analytics/bots` | GET | `{ ip, ua, sessions, lastSeen }[]` | `AnalyticsSettings` |

#### Contacts Module

| Endpoint | Method | Response Type | Used By |
|----------|--------|---------------|---------|
| `GET /contacts?role={role}&status={status}&search={q}` | GET | `Contact[]` | `ContactsListPage` |
| `GET /contacts/:id` | GET | `Contact` | `ContactDetailPage` |
| `POST /contacts` | POST | `Contact` | `AddContactPage` |
| `PUT /contacts/:id` | PUT | `Contact` | `AddContactPage` (edit mode) |
| `GET /contacts/:id/related` | GET | `RelatedContact[]` | `ContactDetailPage` |
| `GET /contacts/:id/properties` | GET | `OwnedProperty[]` | `ContactDetailPage` |
| `GET /contacts/:id/activities` | GET | `ActivityItem[]` | `ContactDetailPage` |

#### Importer Module

| Endpoint | Method | Response Type | Used By |
|----------|--------|---------------|---------|
| `GET /import/sources` | GET | `ImportSource[]` | `FuentesPage` |
| `POST /import/sources` | POST | `ImportSource` | `FuentesPage` |
| `PUT /import/sources/:id` | PUT | `ImportSource` | `FuentesPage` |
| `GET /import/sources/:id/mappings` | GET | `FieldMapping[]` | `MapeoPage` |
| `PUT /import/sources/:id/mappings` | PUT | `FieldMapping[]` | `MapeoPage` |
| `GET /import/sources/:id/values` | GET | `ValueMapping[]` | `MapeoPage` |
| `GET /import/batches?sourceId={id}` | GET | `ImportBatch[]` | `HistorialPage` |
| `GET /import/batches/:id/records` | GET | `BatchRecord[]` | `HistorialPage` |
| `GET /import/scheduler` | GET | `SchedulerJob[]` | `SchedulerPage` |
| `POST /import/scheduler/:id/run` | POST | `void` | `SchedulerPage` |
| `GET /import/pending` | GET | `PendingValue[]` | `PendientesPage` |
| `PUT /import/pending/:id` | PUT | `PendingValue` | `PendientesPage` |

#### CMS Module

| Endpoint | Method | Response Type | Used By |
|----------|--------|---------------|---------|
| `GET /cms/pages` | GET | `CmsPage[]` | `CmsPagesListPage` |
| `GET /cms/pages/:id` | GET | `CmsPage` | `CmsPageEditorPage` |
| `POST /cms/pages` | POST | `CmsPage` | `CmsPageEditorPage` |
| `PUT /cms/pages/:id` | PUT | `CmsPage` | `CmsPageEditorPage` |
| `DELETE /cms/pages/:id` | DELETE | `void` | `CmsPagesListPage` |
| `GET /cms/blog` | GET | `CmsBlogPost[]` | `CmsBlogListPage` |
| `GET /cms/blog/:id` | GET | `CmsBlogPost` | `CmsBlogEditorPage` |
| `POST /cms/blog` | POST | `CmsBlogPost` | `CmsBlogEditorPage` |
| `PUT /cms/blog/:id` | PUT | `CmsBlogPost` | `CmsBlogEditorPage` |
| `DELETE /cms/blog/:id` | DELETE | `void` | `CmsBlogListPage` |

#### Locations Module

| Endpoint | Method | Response Type | Used By |
|----------|--------|---------------|---------|
| `GET /locations?level={level}&parentId={id}` | GET | `LocationNode[]` | All location pages |
| `GET /locations/:id` | GET | `LocationNode` | Detail/edit pages |
| `POST /locations` | POST | `LocationNode` | `BoroughFormPage` |
| `PUT /locations/:id` | PUT | `LocationNode` | Edit panels |

#### Properties Module

| Endpoint | Method | Response Type | Used By |
|----------|--------|---------------|---------|
| `GET /properties?type={type}&status={status}&location={loc}&priceMin={n}&priceMax={n}` | GET | `Property[]` | `PropertiesPage` |
| `GET /properties/:id` | GET | `PropertyDetail` | `PropertyDetailPage` |
| `POST /properties` | POST | `Property` | `AddPropertyPage` |
| `PUT /properties/:id` | PUT | `Property` | `AddPropertyPage` (edit) |

#### Other Modules

| Endpoint | Method | Response Type | Used By |
|----------|--------|---------------|---------|
| `GET /agencies` | GET | `Agency[]` | `AgenciesPage` |
| `GET /users` | GET | `User[]` | `UsersPage` |
| `GET /company` | GET | `CompanyProfile` | `CompanyPage` |
| `PUT /company` | PUT | `CompanyProfile` | `CompanyPage` |

### 6.3 Global Parameters

All analytics endpoints accept:
- `range`: `"7d"` | `"14d"` | `"30d"` | `"90d"` | `"this_month"` | `"last_month"`

The date range selector in `AnalyticsDashboard.tsx` should pass this to all child components.

### 6.4 Integration Pattern (Recommended)

```typescript
// Example: Replace mock data with API call
// Before:
import { kpis } from "./mock-data";

// After:
import { useQuery } from "@tanstack/react-query";

const { data: kpis, isLoading } = useQuery({
  queryKey: ["analytics", "kpis", dateRange],
  queryFn: () => fetch(`/api/analytics/kpis?range=${dateRange}`).then(r => r.json()),
});
```

### 6.5 Files to Modify for API Integration

| Priority | File | What to Replace |
|----------|------|-----------------|
| 🔴 High | `src/components/analytics/mock-data.ts` | All analytics data — **delete file** after migration |
| 🔴 High | `src/components/contacts/mock-data.ts` | Contact list, related data, activities |
| 🔴 High | `src/components/importer/mock-data.ts` | Import sources, batches, mappings |
| 🟡 Medium | `src/components/cms/mock-data.ts` | CMS pages and blog posts |
| 🟡 Medium | `src/components/locations/mock-data.ts` | Location hierarchy data |
| 🟡 Medium | `src/components/agencies/AgenciesPage.tsx` | Inline agency array (lines ~20-80) |
| 🟡 Medium | `src/components/company/CompanyPage.tsx` | Inline company `useState` defaults |
| 🟢 Low | `src/components/UsersPage.tsx` | Inline user array |
| 🟢 Low | `src/components/PropertiesPage.tsx` | Inline property array |
| 🟢 Low | `src/components/PropertyDetailPage.tsx` | Inline property detail object |

---

## Appendix: Flag Assets

Location: `src/assets/flags/`

| File | Country |
|------|---------|
| `es.png` | Spain |
| `de.png` | Germany |
| `gb.png` | United Kingdom |
| `nl.png` | Netherlands |
| `be.png` | Belgium |
| `fr.png` | France |
| `se.png` | Sweden |
| `no.png` | Norway |
| `ru.png` | Russia |

Utility component: `src/components/analytics/flags.tsx` — exports `<Flag code="XX" />` component and `flagMap` record.

---

*End of audit. This document should be kept in sync as new modules are added.*
