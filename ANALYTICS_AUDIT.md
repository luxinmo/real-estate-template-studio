# FUNCTIONAL AUDIT — Analytics Module

> **Generated**: 2026-03-04  
> **Scope**: Exclusively the Analytics dashboard module  
> **Stack**: React 18 + TypeScript + Recharts + Tailwind CSS + shadcn/ui  
> **Status**: UI-only prototype — all data is hardcoded mock

---

## Table of Contents

1. [Structure & Views](#1-structure--views)
2. [Components](#2-components)
3. [Mock Data](#3-mock-data)
4. [Libraries Used](#4-libraries-used)
5. [Types & Interfaces](#5-types--interfaces)
6. [API Connection Points](#6-api-connection-points)

---

## 1. Structure & Views

### Entry Point

| Element | File | Description |
|---------|------|-------------|
| Dashboard shell | `src/components/analytics/AnalyticsDashboard.tsx` | Tab navigation + date range selector + live indicator bar + content area |

The Analytics module is accessed via view `"analytics"` in `src/pages/Index.tsx`. It renders `<AnalyticsDashboard />` which manages 8 internal sub-views via `useState<AnalyticsView>`.

### Sub-View Map

| Tab ID | Component | File | Description |
|--------|-----------|------|-------------|
| `overview` | `AnalyticsOverview` | `analytics/AnalyticsOverview.tsx` | KPI cards (7), sessions area chart (30d), top 10 pages, top 10 properties, device distribution pie, contact channels bars |
| `live` | `AnalyticsLive` | `analytics/AnalyticsLive.tsx` | Live visitor count, active sessions table, visitor map placeholder, breakdowns by country/device/language |
| `search` | `AnalyticsSearch` | `analytics/AnalyticsSearch.tsx` | Top searched locations, property types, price ranges, amenities (horizontal bar charts), zero-result searches alert, top location queries |
| `properties` | `AnalyticsProperties` | `analytics/AnalyticsProperties.tsx` | Property ranking with 5 sortable metrics (views/contacts/calls/shares/favorites), featured card, "viewed never contacted" alert |
| `funnel` | `AnalyticsFunnel` | `analytics/AnalyticsFunnel.tsx` | 5-step conversion funnel with drop-off %, funnel by device (3 columns), conversion rate by language (7 cards) |
| `contacts` | `AnalyticsContacts` | `analytics/AnalyticsContacts.tsx` | Total contacts + 4 channel cards, stacked area chart (30d), top contact-generating properties, conversion by country with flags |
| `audience` | `AnalyticsAudience` | `analytics/AnalyticsAudience.tsx` | World map placeholder, sessions by country table, language/traffic source/device breakdowns, new vs returning pie |
| `settings` | `AnalyticsSettings` | `analytics/AnalyticsSettings.tsx` | Data retention/anonymize/bot tracking toggles, CSV export buttons, bot sessions table |

### Dashboard Shell Features

- **Tab navigation**: Horizontal scrollable tabs with gold `#C9A96E` active indicator
- **Date range selector**: Dropdown with options: "Last 7 days", "Last 14 days", "Last 30 days", "Last 90 days", "This month", "Last month"
- **Live indicator bar**: Shows "5 visitors online now" with green pulse dot + selected date range

---

## 2. Components

### 2.1 Dashboard Shell

| Component | File | Props | State |
|-----------|------|-------|-------|
| `AnalyticsDashboard` | `AnalyticsDashboard.tsx` | None | `view: AnalyticsView`, `dateRange: string`, `showDateDropdown: boolean` |

**Note**: `dateRange` is displayed but NOT passed to child components. When connecting to API, it must be passed as prop or context.

### 2.2 Overview

| Component | File | Props | Mock Data Used |
|-----------|------|-------|----------------|
| `AnalyticsOverview` | `AnalyticsOverview.tsx` | None | `kpis`, `sessionsTimeline`, `topPages`, `topProperties`, `deviceDistribution`, `contactChannels` |

Internal helpers:
- `iconMap`: Maps KPI `icon` string to Lucide icon component

UI sections:
1. **KPI grid** — 7 cards in responsive grid (2→4→7 cols), each with icon, value, label, trend arrow
2. **Sessions chart** — `AreaChart` with two series: sessions (solid gold) + visitors (dashed blue)
3. **Top 10 Pages** — List with progress bars
4. **Top 10 Properties** — List with ref/location/views
5. **Device Distribution** — `PieChart` (3 segments: Desktop/Mobile/Tablet)
6. **Contact Channels** — Horizontal progress bars (4 channels)

### 2.3 Live Visitors

| Component | File | Props | Mock Data Used |
|-----------|------|-------|----------------|
| `AnalyticsLive` | `AnalyticsLive.tsx` | None | `liveVisitors`, `countryBreakdown` |

Internal hardcoded data:
- `deviceBreakdown`: `[{ device, count }]` — 3 items
- `langBreakdown`: `[{ lang, label, count }]` — 5 items

UI sections:
1. **Big number** — "5" with pulse animation
2. **Active Sessions table** — Columns: Country (flag), Language, Device (icon), Current Page, Time, Pages
3. **3-column grid**: Visitor Map (placeholder), By Country (top 5 from `countryBreakdown`), By Device + By Language

### 2.4 Search Insights

| Component | File | Props | Mock Data Used |
|-----------|------|-------|----------------|
| `AnalyticsSearch` | `AnalyticsSearch.tsx` | None | `topSearchLocations`, `topSearchTypes`, `searchPriceRanges`, `topAmenities`, `zeroResultSearches`, `topLocationQueries` |

Internal helper:
- `BarSection` — Reusable horizontal `BarChart` wrapper (`{ title, data, dataKey, nameKey }`)

UI sections:
1. **Top Locations** — Horizontal bar chart
2. **Top Property Types** — Horizontal bar chart
3. **Price Range Distribution** — Horizontal bar chart
4. **Top Amenities** — Horizontal bar chart
5. **Zero Results Searches** — Amber alert card, numbered list
6. **Top Location Queries** — Numbered list

### 2.5 Properties

| Component | File | Props | Mock Data Used |
|-----------|------|-------|----------------|
| `AnalyticsProperties` | `AnalyticsProperties.tsx` | None | `topProperties`, `viewedNeverContacted` |

Internal state: `activeTab: string` (default: `"views"`)

Internal helpers:
- `tabs` array: 5 sortable tabs (`views`, `contacts`, `calls`, `shares`, `favorites`)
- `Stat` — Small stat with icon + value + label

UI sections:
1. **Tab bar** — 5 pill buttons (Views, Contacts, Calls, Shares, Favorites)
2. **Featured card** — #1 ranked property with all 5 stats
3. **Ranking table** — Sorted by active tab metric. Columns: #, Ref, Property, Location, Price, [Active Metric]
4. **Viewed Never Contacted** — Rose alert card listing properties with views > 0 and contacts = 0

### 2.6 Funnel

| Component | File | Props | Mock Data Used |
|-----------|------|-------|----------------|
| `AnalyticsFunnel` | `AnalyticsFunnel.tsx` | None | `funnelSteps`, `funnelByDevice` |

Internal constants:
- `stepColors`: 5 gold-to-dark gradient colors
- Inline `conversionByLanguage` data (7 items) — **hardcoded, NOT from mock-data.ts**

UI sections:
1. **Main Funnel** — 5 horizontal bars with drop-off percentages
2. **Funnel by Device** — 3-column grid (Desktop/Mobile/Tablet), mini bar charts
3. **Conversion Rate by Language** — 7 cards (EN, DE, NL, ES, FR, SV, RU)

### 2.7 Contacts

| Component | File | Props | Mock Data Used |
|-----------|------|-------|----------------|
| `AnalyticsContacts` | `AnalyticsContacts.tsx` | None | `contactChannels`, `contactsTimeline`, `topProperties`, `conversionByCountry` |

UI sections:
1. **Total + Channel cards** — 1 featured total card + 4 channel cards (Form, Phone, Email, WhatsApp)
2. **Contacts Over Time** — Stacked `AreaChart` with 4 series
3. **Top Contact-Generating Properties** — Top 8 by contacts, numbered list
4. **Conversion by Country** — List with flags, contacts count, conversion rate

### 2.8 Audience

| Component | File | Props | Mock Data Used |
|-----------|------|-------|----------------|
| `AnalyticsAudience` | `AnalyticsAudience.tsx` | None | `countryBreakdown`, `languageBreakdown`, `trafficSources`, `deviceDistribution`, `newVsReturning` |

UI sections:
1. **Visitor Distribution** — World map placeholder (circles)
2. **Sessions by Country** — Table with columns: Country (flag), Sessions, Conversions, Avg. Time, Share
3. **By Language** — Progress bars
4. **Traffic Source** — Progress bars
5. **By Device** — `PieChart` + legend
6. **New vs Returning** — `PieChart` + legend

### 2.9 Settings

| Component | File | Props | Mock Data Used |
|-----------|------|-------|----------------|
| `AnalyticsSettings` | `AnalyticsSettings.tsx` | None | `botSessions` |

Internal state: `retainData`, `anonymizeIps`, `trackBots` (booleans)

UI sections:
1. **Data & Privacy** — 3 toggles (Data Retention, Anonymize IPs, Track Bots)
2. **Data Export** — 3 buttons (Export All, Sessions Only, Contacts Only)
3. **Bot Sessions Detected** — Table: IP, User Agent, Sessions, Last Seen

### 2.10 Flag Utility

| Component | File | Props |
|-----------|------|-------|
| `Flag` | `analytics/flags.tsx` | `code: string`, `className?: string` (default: `"h-4 w-5 rounded-sm object-cover"`) |

Maps ISO country codes to local PNG assets in `src/assets/flags/`.

Supported codes: `ES`, `DE`, `GB`, `NL`, `BE`, `FR`, `SE`, `NO`, `RU`

Assets: `src/assets/flags/{code}.png` (downloaded from flagcdn.com, 40×30px)

---

## 3. Mock Data

### 3.1 File Location

| File | Description |
|------|-------------|
| `src/components/analytics/mock-data.ts` | All analytics mock data (249 lines) |
| `src/components/analytics/flags.tsx` | Flag image imports + `Flag` component |

### 3.2 All Exported Data

| Export Name | Type | Items | Used By |
|-------------|------|-------|---------|
| `countries` | `{ code, name, flag }[]` | 9 | Reference only |
| `languages` | `string[]` | 7 | Reference only |
| `locations` | `string[]` | 6 | Reference only |
| `propertyTypes` | `string[]` | 5 | Reference only |
| `kpis` | `{ label, value, change, icon }[]` | 7 | Overview |
| `sessionsTimeline` | `{ date, sessions, visitors }[]` | 30 | Overview |
| `topPages` | `{ path, views, pct }[]` | 10 | Overview |
| `topProperties` | `MockProperty[]` | 10 | Overview, Properties, Contacts |
| `viewedNeverContacted` | `MockProperty[]` | 4 | Properties |
| `deviceDistribution` | `{ device, sessions, pct }[]` | 3 | Overview, Audience |
| `contactChannels` | `{ channel, count, pct, color }[]` | 4 | Overview, Contacts |
| `liveVisitors` | `{ country, flag, lang, device, page, time, pages }[]` | 5 | Live |
| `countryBreakdown` | `{ code, flag, name, sessions, conversions, avgTime, pct }[]` | 9 | Live, Audience |
| `topSearchLocations` | `{ location, searches }[]` | 6 | Search |
| `topSearchTypes` | `{ type, searches }[]` | 5 | Search |
| `searchPriceRanges` | `{ range, searches }[]` | 5 | Search |
| `topAmenities` | `{ amenity, searches }[]` | 6 | Search |
| `zeroResultSearches` | `{ query, count }[]` | 5 | Search |
| `topLocationQueries` | `{ query, count }[]` | 5 | Search |
| `funnelSteps` | `{ step, value, pct }[]` | 5 | Funnel |
| `funnelByDevice` | `{ device, steps: number[] }[]` | 3 | Funnel |
| `contactsTimeline` | `{ date, form, phone, email, whatsapp }[]` | 30 | Contacts |
| `trafficSources` | `{ source, sessions, pct }[]` | 5 | Audience |
| `newVsReturning` | `{ new, returning }` | 1 | Audience |
| `languageBreakdown` | `{ lang, label, sessions, pct }[]` | 7 | Audience |
| `conversionByCountry` | `{ country, code, contacts, rate }[]` | 9 | Contacts |
| `botSessions` | `{ ip, ua, sessions, lastSeen }[]` | 5 | Settings |

### 3.3 Inline Hardcoded Data (NOT in mock-data.ts)

These data sets are hardcoded directly in components and will also need API connections:

| Component | Data | Structure |
|-----------|------|-----------|
| `AnalyticsLive` | `deviceBreakdown` | `{ device: string, count: number }[]` — 3 items |
| `AnalyticsLive` | `langBreakdown` | `{ lang: string, label: string, count: number }[]` — 5 items |
| `AnalyticsFunnel` | Conversion by language | `{ lang: string, rate: string, sessions: number }[]` — 7 items |
| `AnalyticsDashboard` | Live visitor count | Hardcoded string `"5 visitors online now"` |
| `AnalyticsDashboard` | Date range options | `["Last 7 days", "Last 14 days", "Last 30 days", "Last 90 days", "This month", "Last month"]` |

---

## 4. Libraries Used

### 4.1 Charts — Recharts

| Recharts Component | Used In | Purpose |
|--------------------|---------|---------|
| `AreaChart` + `Area` | Overview (sessions), Contacts (timeline) | Time series with gradient fill |
| `BarChart` + `Bar` | Search (4 horizontal charts) | Horizontal bar charts |
| `PieChart` + `Pie` + `Cell` | Overview (devices), Audience (devices, new/returning) | Donut charts |
| `XAxis`, `YAxis` | All charts | Axis configuration |
| `CartesianGrid` | Overview, Contacts | Grid lines |
| `Tooltip` | All charts | Hover tooltips |
| `ResponsiveContainer` | All charts | Responsive wrapper |

### 4.2 Recharts Styling Conventions

All charts use consistent styling:
```typescript
// Tooltip
contentStyle: {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12
}

// Axis ticks
tick: { fontSize: 10, fill: "hsl(var(--muted-foreground))" }
axisLine: false
tickLine: false

// Grid
stroke: "hsl(var(--border))"
strokeDasharray: "3 3"
```

### 4.3 Icons — Lucide React

| Icon | Used In |
|------|---------|
| `BarChart3`, `Users`, `Search`, `Home`, `Filter`, `MessageSquare`, `Globe`, `Settings`, `Radio`, `ChevronDown` | Dashboard tabs |
| `TrendingUp`, `TrendingDown`, `Activity`, `Eye`, `Layers`, `Clock`, `Target`, `LogOut` | Overview KPIs |
| `Monitor`, `Smartphone`, `Tablet` | Live, Funnel (device icons) |
| `Phone`, `Share2`, `Heart`, `AlertCircle` | Properties |
| `AlertTriangle` | Search (zero results) |
| `Shield`, `Download`, `Bot`, `ToggleLeft`, `ToggleRight` | Settings |

### 4.4 UI Framework

| Library | Usage |
|---------|-------|
| Tailwind CSS | All styling via utility classes + design tokens |
| shadcn/ui | Not directly used in analytics components (all custom) |

### 4.5 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Gold (primary accent) | `#C9A96E` | Active tabs, KPI icons, chart fills, feature highlights |
| Dark gold | `#8B7355` | Secondary chart series, phone channel |
| Green | `#6B8E7B` | Email channel |
| Blue | `#7B9EAE` | WhatsApp channel, visitor line |
| Emerald | Tailwind `emerald-500/600` | Live pulse, live status text |
| Rose | Tailwind `rose-500/600` | Negative trends, "never contacted" alert |
| Amber | Tailwind `amber-300/600/700` | Zero-result searches alert |

---

## 5. Types & Interfaces

### 5.1 Exported Interface

```typescript
// src/components/analytics/mock-data.ts
export interface MockProperty {
  ref: string;        // e.g. "4MNL"
  name: string;       // e.g. "Mediterranean Villa with Sea Views"
  location: string;   // e.g. "Calpe"
  type: string;       // e.g. "Villa"
  price: string;      // e.g. "€1,850,000"
  views: number;
  contacts: number;
  calls: number;
  shares: number;
  favorites: number;
}
```

### 5.2 Internal Type

```typescript
// src/components/analytics/AnalyticsDashboard.tsx
type AnalyticsView = "overview" | "live" | "search" | "properties" | "funnel" | "contacts" | "audience" | "settings";
```

### 5.3 Implicit Data Shapes (no explicit interface — inferred from mock data)

```typescript
// KPI
{ label: string; value: string; change: number; icon: string }

// Session timeline point
{ date: string; sessions: number; visitors: number }

// Top page
{ path: string; views: number; pct: number }

// Device distribution
{ device: string; sessions: number; pct: number }

// Contact channel
{ channel: string; count: number; pct: number; color: string }

// Live visitor
{ country: string; flag: string; lang: string; device: string; page: string; time: string; pages: number }

// Country breakdown
{ code: string; flag: string; name: string; sessions: number; conversions: number; avgTime: string; pct: number }

// Search location
{ location: string; searches: number }

// Search type
{ type: string; searches: number }

// Price range
{ range: string; searches: number }

// Amenity
{ amenity: string; searches: number }

// Zero result search
{ query: string; count: number }

// Location query
{ query: string; count: number }

// Funnel step
{ step: string; value: number; pct: number }

// Funnel by device
{ device: string; steps: number[] }

// Contacts timeline point
{ date: string; form: number; phone: number; email: number; whatsapp: number }

// Traffic source
{ source: string; sessions: number; pct: number }

// New vs returning
{ new: number; returning: number }

// Language breakdown
{ lang: string; label: string; sessions: number; pct: number }

// Conversion by country
{ country: string; code: string; contacts: number; rate: string }

// Bot session
{ ip: string; ua: string; sessions: number; lastSeen: string }
```

---

## 6. API Connection Points

### 6.1 Overview of Required Endpoints

Every piece of data currently comes from `mock-data.ts` imports. Below is the complete list of endpoints needed, grouped by analytics tab.

### 6.2 Dashboard Shell

| Endpoint | Method | Query Params | Response Type | Replaces |
|----------|--------|-------------|---------------|----------|
| `/api/analytics/live-count` | GET | — | `{ count: number }` | Hardcoded "5 visitors online now" |

### 6.3 Overview Tab

| Endpoint | Method | Query Params | Response Type | Replaces |
|----------|--------|-------------|---------------|----------|
| `/api/analytics/kpis` | GET | `range` | `KPI[]` | `kpis` |
| `/api/analytics/sessions-timeline` | GET | `range` | `SessionPoint[]` | `sessionsTimeline` |
| `/api/analytics/top-pages` | GET | `range`, `limit` | `TopPage[]` | `topPages` |
| `/api/analytics/top-properties` | GET | `range`, `limit`, `sortBy` | `MockProperty[]` | `topProperties` |
| `/api/analytics/device-distribution` | GET | `range` | `DeviceData[]` | `deviceDistribution` |
| `/api/analytics/contact-channels` | GET | `range` | `ChannelData[]` | `contactChannels` |

### 6.4 Live Tab

| Endpoint | Method | Query Params | Response Type | Replaces |
|----------|--------|-------------|---------------|----------|
| `/api/analytics/live-visitors` | GET | — | `LiveVisitor[]` | `liveVisitors` |
| `/api/analytics/live-breakdown` | GET | — | `{ countries: CountryBreakdown[], devices: DeviceBreakdown[], languages: LangBreakdown[] }` | `countryBreakdown` + inline data |

**Note**: Live data should use WebSocket or polling (every 10-30s) for real-time updates.

### 6.5 Search Tab

| Endpoint | Method | Query Params | Response Type | Replaces |
|----------|--------|-------------|---------------|----------|
| `/api/analytics/search/locations` | GET | `range`, `limit` | `{ location, searches }[]` | `topSearchLocations` |
| `/api/analytics/search/types` | GET | `range`, `limit` | `{ type, searches }[]` | `topSearchTypes` |
| `/api/analytics/search/price-ranges` | GET | `range` | `{ range, searches }[]` | `searchPriceRanges` |
| `/api/analytics/search/amenities` | GET | `range`, `limit` | `{ amenity, searches }[]` | `topAmenities` |
| `/api/analytics/search/zero-results` | GET | `range`, `limit` | `{ query, count }[]` | `zeroResultSearches` |
| `/api/analytics/search/location-queries` | GET | `range`, `limit` | `{ query, count }[]` | `topLocationQueries` |

### 6.6 Properties Tab

| Endpoint | Method | Query Params | Response Type | Replaces |
|----------|--------|-------------|---------------|----------|
| `/api/analytics/properties/ranking` | GET | `range`, `sortBy`, `limit` | `MockProperty[]` | `topProperties` |
| `/api/analytics/properties/never-contacted` | GET | `range`, `limit` | `MockProperty[]` | `viewedNeverContacted` |

### 6.7 Funnel Tab

| Endpoint | Method | Query Params | Response Type | Replaces |
|----------|--------|-------------|---------------|----------|
| `/api/analytics/funnel` | GET | `range` | `FunnelStep[]` | `funnelSteps` |
| `/api/analytics/funnel/by-device` | GET | `range` | `FunnelByDevice[]` | `funnelByDevice` |
| `/api/analytics/funnel/by-language` | GET | `range` | `{ lang, rate, sessions }[]` | Inline data in `AnalyticsFunnel` |

### 6.8 Contacts Tab

| Endpoint | Method | Query Params | Response Type | Replaces |
|----------|--------|-------------|---------------|----------|
| `/api/analytics/contacts/channels` | GET | `range` | `ChannelData[]` | `contactChannels` |
| `/api/analytics/contacts/timeline` | GET | `range` | `ContactsTimelinePoint[]` | `contactsTimeline` |
| `/api/analytics/contacts/top-properties` | GET | `range`, `limit` | `MockProperty[]` | `topProperties` (sorted by contacts) |
| `/api/analytics/contacts/by-country` | GET | `range` | `ConversionByCountry[]` | `conversionByCountry` |

### 6.9 Audience Tab

| Endpoint | Method | Query Params | Response Type | Replaces |
|----------|--------|-------------|---------------|----------|
| `/api/analytics/audience/countries` | GET | `range` | `CountryBreakdown[]` | `countryBreakdown` |
| `/api/analytics/audience/languages` | GET | `range` | `LanguageBreakdown[]` | `languageBreakdown` |
| `/api/analytics/audience/sources` | GET | `range` | `TrafficSource[]` | `trafficSources` |
| `/api/analytics/audience/devices` | GET | `range` | `DeviceData[]` | `deviceDistribution` |
| `/api/analytics/audience/new-vs-returning` | GET | `range` | `{ new: number, returning: number }` | `newVsReturning` |

### 6.10 Settings Tab

| Endpoint | Method | Query Params | Response Type | Replaces |
|----------|--------|-------------|---------------|----------|
| `/api/analytics/settings` | GET | — | `{ retainData, anonymizeIps, trackBots }` | Internal `useState` |
| `/api/analytics/settings` | PUT | — | Body: `{ retainData, anonymizeIps, trackBots }` | Toggle handlers |
| `/api/analytics/bots` | GET | `limit` | `BotSession[]` | `botSessions` |
| `/api/analytics/export` | GET | `type` (`all`/`sessions`/`contacts`), `range` | CSV file download | Export buttons |

### 6.11 Integration Pattern

Recommended approach using `@tanstack/react-query` (already installed):

```typescript
// Example: Replace mock KPIs with API call
import { useQuery } from "@tanstack/react-query";

const useAnalyticsKpis = (dateRange: string) => {
  return useQuery({
    queryKey: ["analytics", "kpis", dateRange],
    queryFn: () => fetch(`/api/analytics/kpis?range=${encodeURIComponent(dateRange)}`)
      .then(r => r.json()),
    refetchInterval: 60_000, // refresh every 60s
  });
};

// In component:
const { data: kpis, isLoading } = useAnalyticsKpis(dateRange);
```

### 6.12 Critical Integration Notes

1. **`dateRange` must be threaded through**: Currently `AnalyticsDashboard` holds `dateRange` state but does NOT pass it to child components. Add it as a prop or use React Context.

2. **Live data needs real-time**: The Live tab should use WebSocket or short polling (10-30s). Consider `refetchInterval` in react-query.

3. **Shared data across tabs**: `topProperties`, `deviceDistribution`, and `contactChannels` are reused across multiple tabs. Consider a shared query cache or Context to avoid duplicate API calls.

4. **The `Flag` component is self-contained**: It uses local PNG assets and maps country codes. No API needed — just ensure country codes match between API responses and the flag map.

5. **Export endpoint**: Should return `Content-Type: text/csv` with `Content-Disposition: attachment` header.

6. **Funnel language data is inline**: The conversion-by-language data in `AnalyticsFunnel.tsx` is hardcoded directly in JSX, not imported from mock-data.ts. It needs its own endpoint.

### 6.13 Total Endpoints Summary

| Category | Count |
|----------|-------|
| Dashboard shell | 1 |
| Overview | 6 |
| Live | 2 |
| Search | 6 |
| Properties | 2 |
| Funnel | 3 |
| Contacts | 4 |
| Audience | 5 |
| Settings | 4 |
| **Total** | **33** |

---

## File Inventory

| File | Lines | Purpose |
|------|-------|---------|
| `src/components/analytics/AnalyticsDashboard.tsx` | 105 | Dashboard shell with tabs + date picker |
| `src/components/analytics/AnalyticsOverview.tsx` | 150 | KPIs, charts, top pages/properties |
| `src/components/analytics/AnalyticsLive.tsx` | 138 | Live visitors table + breakdowns |
| `src/components/analytics/AnalyticsSearch.tsx` | 67 | Search insights with bar charts |
| `src/components/analytics/AnalyticsProperties.tsx` | 132 | Property ranking + alerts |
| `src/components/analytics/AnalyticsFunnel.tsx` | 107 | Conversion funnel visualization |
| `src/components/analytics/AnalyticsContacts.tsx` | 94 | Contact analytics + timeline |
| `src/components/analytics/AnalyticsAudience.tsx` | 148 | Audience demographics |
| `src/components/analytics/AnalyticsSettings.tsx` | 105 | Settings + bot detection |
| `src/components/analytics/mock-data.ts` | 249 | All mock data + MockProperty interface |
| `src/components/analytics/flags.tsx` | 21 | Flag PNG imports + Flag component |
| **Total** | **~1,316** | **11 files** |
