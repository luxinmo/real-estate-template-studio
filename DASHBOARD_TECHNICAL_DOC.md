# Properties Dashboard — Technical Documentation

> Generated: 2026-02-27
> Page: Properties management dashboard (CRM backoffice)
> Framework: React 18 + Vite + TypeScript + Tailwind CSS

---

## 1. Components List

| File Path | Component(s) | Lines | Role |
|---|---|---|---|
| `src/components/PropertiesPage.tsx` | `PropertiesPage`, `BulkActionsBar` | 266 | Page orchestrator: header, filters, sort, bulk actions, card list, sidebar, mobile bottom bar |
| `src/components/properties/PropertyCard.tsx` | `PropertyCard`, `PortalsPopover` | 366 | Individual property card with all badges, stats, portal management |
| `src/components/properties/PropertySearchFilters.tsx` | `PropertySearchFilters`, `FilterSidebar`, `TypeDropdown`, `PriceDropdown`, `BedsDropdown`, `AmenitiesDropdown` | 451 | Top search/filter bar with dropdowns and full sidebar panel |
| `src/components/properties/PropertyFilterSidebar.tsx` | `PropertyFilterSidebar`, `FilterSection`, `FilterChipButton`, `StarChipButton` | 267 | Right-side filter panel with include/exclude chip system |
| `src/components/luxury/LocationSearchDropdown.tsx` | `LocationSearchDropdown` | 220 | Multi-select location search with dropdown, chips, recent searches |
| `src/components/HeaderBar.tsx` | `HeaderBar` | 36 | Global header with hamburger, search placeholder, avatar |
| `src/components/AppSidebar.tsx` | `AppSidebar` | 131 | Navigation sidebar with responsive overlay |

### Supporting UI Components Used

| Component | Source |
|---|---|
| `Button` | `@/components/ui/button` |
| `Checkbox` | `@/components/ui/checkbox` |
| `Switch` | `@/components/ui/switch` |
| `Popover`, `PopoverContent`, `PopoverTrigger` | `@/components/ui/popover` |
| `Tooltip`, `TooltipContent`, `TooltipTrigger`, `TooltipProvider` | `@/components/ui/tooltip` |
| `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger` | `@/components/ui/collapsible` |
| `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetTrigger` | `@/components/ui/sheet` |

---

## 2. New vs Existing Components

### New Components (not in previous design)

| Component | Description |
|---|---|
| `PropertySearchFilters` | Complete filter bar adapted from luxury listing — location search, type/price/beds/amenities dropdowns, filter sidebar |
| `PropertyFilterSidebar` | Right-side chip-based filter panel with include/exclude/off tri-state cycling |
| `BulkActionsBar` | Multi-select action bar for batch operations |
| `PortalsPopover` | Per-card publication management with web/portal toggles and restriction indicators |
| `StarChipButton` | Star rating filter with large star icon + number overlay |
| Mobile bottom filter bar | Fixed bottom bar with Sheet integration for mobile filter access |

### Components That Replace Existing

| New | Replaces | Notes |
|---|---|---|
| `PropertySearchFilters` | `PropertyFilters` (unused) | Old filter was a collapsible sidebar with checkboxes. New is a top bar with dropdowns + slide-out panel |
| `PropertyFilterSidebar` | None (new concept) | Include/exclude chip system is entirely new |

### Placeholders for Future Features

| Component/Element | Future Purpose |
|---|---|
| Settings gear icon | Opens panel to manage available tags, users, portal configurations |
| Mobile bottom bar individual buttons | Should open popovers with respective filter chips |
| Bulk action buttons | Should trigger real operations (API calls to portals, PDF generation, etc.) |
| "Leads (0)" / "Visitas (0)" / "Ofertas" | Should link to CRM detail panels |
| "+Etiqueta" button | Should open tag management modal |
| Sort logic | Should actually sort the property array |

---

## 3. Data Requirements per Component

### PropertiesPage

| Data Needed | Model/Table | Current Status |
|---|---|---|
| Properties list (paginated) | `Property` | **MOCK** — 4 hardcoded objects in `demoProperties` array |
| Sort configuration | Client state | **MOCK** — state changes but no sort logic |
| Selection state | Client state | **CONNECTED** — `Set<number>` |
| Filter state (top bar) | Client state | **CONNECTED** — `FilterState` object |
| Filter state (sidebar) | Client state | **CONNECTED** — `SidebarFilters` object |

### PropertyCard

| Data Needed | Field | Type | Current Status |
|---|---|---|---|
| Property ID | `id` | `number` | MOCK |
| Image URL | `image` | `string` | MOCK (static imports) |
| Title | `title` | `string` | MOCK |
| Price | `price` | `string` | MOCK |
| Previous price | `previousPrice` | `string?` | MOCK |
| Price on request flag | `priceOnRequest` | `boolean?` | MOCK |
| Location | `location` | `string` | MOCK |
| Beds/baths/sqft | `beds`, `baths`, `sqft` | `number`, `number`, `string` | MOCK |
| Status | `status` | `string` | MOCK |
| Property type | `type` | `string` | MOCK |
| Operation type | `operacion` | `string` | MOCK |
| Reference | `reference` | `string?` | MOCK |
| Rating (0-5) | `rating` | `number?` | MOCK |
| Description | `description` | `string?` | MOCK |
| Built area | `builtArea` | `string?` | MOCK |
| Plot area | `plotArea` | `string?` | MOCK |
| Tags | `tags` | `string[]?` | MOCK |
| Portal configuration | `portals` | `Portal[]?` | MOCK |
| Web active flag | `webActive` | `boolean?` | MOCK → local state |
| Web featured flag | `webFeatured` | `boolean?` | MOCK → local state |
| Collaboration flag | `collaboration` | `boolean?` | MOCK |
| Collaboration agency | `collaborationAgency` | `string?` | MOCK |
| Is collaborator property | `isCollaborator` | `boolean?` | MOCK |
| Collaborator name | `collaboratorName` | `string?` | MOCK |
| Exclusive flag | `isExclusive` | `boolean?` | MOCK |
| Off-market flag | `isOffMarket` | `boolean?` | MOCK |
| Created date | `createdAt` | `string?` | MOCK |
| Updated date | `updatedAt` | `string?` | MOCK |

### Portal Interface

```typescript
interface Portal {
  name: string;          // Portal display name
  active: boolean;       // Whether property is published to this portal
  restricted?: boolean;  // Whether publishing is blocked
  restrictionReason?: string; // Tooltip explanation
}
```

### PropertyFilterSidebar

| Data Needed | Source | Current Status |
|---|---|---|
| Available tags | System configuration | **MOCK** — 7 hardcoded tags |
| System users / agents | Users table | **MOCK** — 5 hardcoded names |
| Rating scale | Static (0-5) | **DESIGNED** |
| Availability statuses | Static enum | **DESIGNED** |
| Operation types | Static enum | **DESIGNED** |
| Available portals | Portal integrations | **MOCK** — 6 hardcoded portals |

### LocationSearchDropdown

| Data Needed | Source | Current Status |
|---|---|---|
| Locations hierarchy | `mockLocations` from `locations/mock-data.ts` | **MOCK** |
| Recent searches | `localStorage` key `luxury_recent_searches` | **CONNECTED** (persisted) |

---

## 4. Design Spec

### 4.1 Layout

```
┌──────────────────────────────────────────────────────┐
│ HeaderBar (h-14, border-b)                           │
├────────┬─────────────────────────────────────────────┤
│Sidebar │ Page Content (flex-1, overflow-auto)        │
│ w-56   │ ┌─────────────────────────────────────────┐ │
│ fixed  │ │ Title + "Nueva propiedad" button        │ │
│ on lg  │ │ px-4 sm:px-8, pt-6 sm:pt-8             │ │
│        │ ├─────────────────────────────────────────┤ │
│        │ │ PropertySearchFilters bar               │ │
│        │ ├─────────────────────────────────────────┤ │
│        │ │ Results count + Sort dropdown           │ │
│        │ ├─────────────────────────────────────────┤ │
│        │ │ [BulkActionsBar if selections]          │ │
│        │ ├──────────────────────────┬──────────────┤ │
│        │ │ PropertyCard list       │ FilterSidebar │ │
│        │ │ max-w-4xl, centered     │ w-56 sticky   │ │
│        │ │ justify-center          │ hidden <xl    │ │
│        │ │ space-y-4               │ top-8         │ │
│        │ └──────────────────────────┴──────────────┘ │
│        │                                             │
│        │ [Mobile bottom bar, fixed, hidden ≥xl]      │
└────────┴─────────────────────────────────────────────┘
```

### 4.2 Property Card Anatomy

```
┌─────────────────────────────────────────────────────────┐
│ ┌──────────┬──────────────────────────────────────────┐ │
│ │          │ ☐ 6254 ★★★★★  🤝 MLS - Agency  ● Status │ │
│ │  IMAGE   │ 1.100.000 €  ↘ 1.250.000 €  VENTA      │ │
│ │  w-60    │ 📍 Location                              │ │
│ │  (sm+)   │ 🛏 3 hab. 🛁 2 baños ⬜ 288 m²  P 1.051 │ │
│ │          │ Description text italic line-clamp-2...   │ │
│ │  [EXCL]  │ [B.B+]  🏷 Etiqueta                     │ │
│ │  [1/12]  │                                          │ │
│ └──────────┴──────────────────────────────────────────┘ │
│ 📅 23.12.2025 | Act. 27.02.2026    Leads Visitas 🌐 4  │
└─────────────────────────────────────────────────────────┘
```

### 4.3 Card Dimensions & Spacing

| Element | Desktop | Mobile |
|---|---|---|
| Card border radius | `rounded-xl` (12px) | Same |
| Image width | `w-60` (240px) | `w-full`, `h-48` |
| Content padding | `px-5 py-3.5` | `px-4 py-3` |
| Footer padding | `px-5 py-2` | `px-4 py-2` |
| Card gap (list) | `space-y-4` (16px) | Same |
| Max content width | `max-w-4xl` (896px) | Full width |

### 4.4 Typography

| Element | Size | Weight | Color | Extra |
|---|---|---|---|---|
| Page title | `text-xl` / `sm:text-2xl` | `font-semibold` | `text-foreground` | `tracking-tight` |
| Page subtitle | `text-sm` | normal | `text-muted-foreground` | — |
| Price | `text-lg` / `sm:text-xl` | `font-bold` | `text-foreground` | `tracking-tight` |
| Reference | `text-xs` | normal | `text-muted-foreground` | `font-mono` |
| Location | `text-[13px]` | normal | `text-muted-foreground` | — |
| Stats | `text-[13px]` | `font-medium` (values) | `text-foreground` (values) / `text-muted-foreground` (labels) | — |
| Description | `text-[12px]` | normal | `text-muted-foreground` | `italic`, `line-clamp-2` |
| Tag pills | `text-[10px]` | `font-semibold` | `text-foreground` | — |
| Badge pills | `text-[10px]` | `font-medium` | varies by type | — |
| Footer text | `text-[11px]` | normal | `text-muted-foreground` | — |
| Filter chip | `text-[11px]` | `font-medium` | varies by state | — |
| Section title (sidebar) | `text-[12px]` | `font-semibold` | `text-muted-foreground` | `uppercase tracking-wider` |

### 4.5 Colors (Status System)

| Status | Dot | Text | Background |
|---|---|---|---|
| Disponible | `emerald-500` | `emerald-700` | `emerald-50` |
| Reservado | `amber-500` | `amber-700` | `amber-50` |
| Vendido | `red-500` | `red-700` | `red-50` |
| Alquilado | `blue-500` | `blue-700` | `blue-50` |
| Bajo oferta | `violet-500` | `violet-700` | `violet-50` |
| Off-market | `gray-500` | `gray-700` | `gray-100` |

### 4.6 Badge Colors

| Badge | Background | Border | Text | Icon Color |
|---|---|---|---|---|
| Exclusive | `amber-500/90` | none | `white` | `white` |
| MLS (own) | `emerald-50` | `emerald-200` | `emerald-700` | `emerald-700` |
| MLS (shared) | `indigo-50` | `indigo-200` | `indigo-600` | `indigo-600` |
| Destacado | `amber-50` | `amber-200` | `amber-700` | `amber-700` |
| Off-market overlay | `foreground/80` | none | `background` | `background` |

### 4.7 Animations & Transitions

| Element | Property | Duration | Easing |
|---|---|---|---|
| Card hover shadow | `shadow-elevated` | `200ms` | default |
| Image hover zoom | `transform: scale(1.05)` | `500ms` | default |
| Bulk actions bar | `slide-in-from-top-2` | `200ms` | default |
| Filter sidebar | `slide-in-from-left` | `300ms` | default |
| Selection ring | `ring-2 ring-primary/20` | instant | — |
| Filter chip state | `transition-all` | default | default |
| Dropdown pills | `transition-all` | `200ms` | default |

### 4.8 Responsive Breakpoints

| Breakpoint | Changes |
|---|---|
| `<sm` (< 640px) | Card image stacks on top (h-48). Price text-lg. Description hidden. MLS/Compartido labels truncated. Footer simplified. |
| `sm` (≥ 640px) | Card image side-by-side (w-60). Full footer. |
| `<md` (< 768px) | Location search hidden. |
| `md` (≥ 768px) | Location search visible (w-[420px]). |
| `<lg` (< 1024px) | Sidebar hidden, hamburger visible. |
| `lg` (≥ 1024px) | Sidebar visible, hamburger hidden. |
| `<xl` (< 1280px) | Filter sidebar hidden. Mobile bottom bar visible. |
| `xl` (≥ 1280px) | Filter sidebar visible. Bottom bar hidden. |

---

## 5. Functionality Spec

### 5.1 Property Selection

| Element | Current Behavior | Expected (Connected) | Dependencies |
|---|---|---|---|
| Card checkbox | Toggles `selectedIds` Set. Stops click propagation. | Same + persist selection across pagination | Property IDs from DB |
| Bulk actions bar | Appears when `selectedIds.size > 0`. Shows count. | Same | — |
| Deselect button | Clears all `selectedIds` | Same | — |

### 5.2 Sorting

| Element | Current Behavior | Expected (Connected) | Dependencies |
|---|---|---|---|
| Sort dropdown | Changes `sortBy` state. No actual sort. | Re-queries DB with `ORDER BY` clause | DB query builder |
| Sort popover | Opens/closes. Shows active option. | Same | — |

### 5.3 Portal Management (per card)

| Element | Current Behavior | Expected (Connected) | Dependencies |
|---|---|---|---|
| Web toggle | Toggles `webActive` local state. | API call to update property visibility | Property.webActive field |
| Featured toggle | Toggles `webFeatured` local state. Only shown when web active. | API call to update featured status | Property.webFeatured field |
| Portal toggle | Toggles individual portal `active` state. Disabled for restricted portals. | API call to portal sync service | Portal integration config |
| Restricted indicator | Shows `Ban` icon with tooltip explaining restriction. | Read from portal restriction rules | PortalRestriction table |

### 5.4 Sidebar Filters

| Element | Current Behavior | Expected (Connected) | Dependencies |
|---|---|---|---|
| Chip toggle | Cycles: off → include → exclude → off | Same + triggers list re-query with WHERE clauses | Property fields matching each filter |
| Clear button | Resets all chips to "off" | Same | — |
| Active count badge | Shows count of non-off chips per section | Same | — |
| Settings gear | `console.log("Settings: global")` | Opens config modal for managing tags/users | System config tables |

### 5.5 Bulk Actions

| Action | Current Behavior | Expected (Connected) | Dependencies |
|---|---|---|---|
| Exportar a portales | `console.log` | Opens portal selection dialog → queues XML feed generation per portal | Portal API integrations |
| Publicar en web | `console.log` | Sets `webActive=true` for all selected | Property table, web sync |
| Despublicar | `console.log` | Sets `webActive=false` for all selected | Property table, web sync |
| Compartir | `console.log` | Opens share dialog (link, email, WhatsApp) | Share URL generation |
| Imprimir PDF | `console.log` | Generates multi-property PDF brochure | PDF template engine |
| Añadir etiqueta | `console.log` | Opens tag picker/creator dialog | Tags table |

### 5.6 Card Navigation

| Element | Current Behavior | Expected (Connected) | Dependencies |
|---|---|---|---|
| Card click | Calls `onViewProperty()` → navigates to detail page | Route to `/properties/{id}` | Property detail page |
| Leads/Visitas/Ofertas | No action | Navigate to respective CRM tabs for that property | CRM modules |

---

## 6. New Features / Views

### 6.1 Designed & Implemented (UI only)

| Feature | Description | What it needs | Priority |
|---|---|---|---|
| **Include/Exclude filtering** | Tri-state chip system for advanced filtering. Click cycles through off → include (green) → exclude (red). | DB query builder with AND/NOT conditions per filter group | **Essential** |
| **Portal publication popover** | Per-property control for web + 6 portals with restrictions | Portal sync API, restriction rules engine | **Essential** |
| **Bulk actions bar** | Multi-select with 6 batch operations | API endpoints for each action, PDF generator, portal sync | **Essential** |
| **Star rating filter** | Large star icons (0-5) with tri-state selection | Property.rating field in DB | **Nice-to-have** |
| **Off-market as overlay** | Independent from status. Property can be "Disponible" + off-market simultaneously | `isOffMarket` boolean field | **Essential** |
| **Exclusive badge** | Golden crown badge on image | `isExclusive` boolean field | **Nice-to-have** |
| **Price on request** | Shows "Consultar precio" instead of price | `priceOnRequest` boolean field | **Essential** |
| **Price drop indicator** | Red arrow + strikethrough previous price | `previousPrice` field, price history tracking | **Nice-to-have** |
| **MLS with agency name** | Shows "MLS - {AgencyName}" for collaboration properties | Collaboration table with agency reference | **Essential** |
| **Compartido MLS badge** | Identifies properties received from collaborators | `isCollaborator` flag + source agency | **Essential** |
| **Featured web toggle** | Dedicated toggle inside portal popover, synced with card badge | `webFeatured` boolean field | **Nice-to-have** |
| **Mobile bottom filter bar** | Fixed bar with filter category buttons + Sheet for full sidebar | Responsive CSS only | **Essential** |

### 6.2 Not Yet Designed

| Feature | Description | What it needs | Priority |
|---|---|---|---|
| **Pagination** | Page navigation + results per page selector | Total count query, offset/limit | **Essential** |
| **Empty state** | Visual feedback when no properties match filters | Illustration + message + CTA | **Essential** |
| **Grid/card view** | Toggle between list and grid layout | CSS grid variant of PropertyCard | **Nice-to-have** |
| **Quick actions on hover** | Edit, duplicate, archive buttons on card hover | Action handlers + confirmation dialogs | **Nice-to-have** |
| **Photo carousel** | Mini image carousel on card hover | Property.images array | **Nice-to-have** |
| **Status change dropdown** | Change property status directly from card | Status update API | **Nice-to-have** |
| **Tag management modal** | Create/edit/delete tags with colors | Tags CRUD API | **Essential** |
| **Settings panel** | Configure visible tags, users, portals in sidebar | System config API | **Nice-to-have** |
| **Map view** | Show properties on map alongside list | Geocoded addresses, Leaflet/Mapbox | **Nice-to-have** |
| **Saved searches** | Save filter combinations for quick access | User preferences storage | **Nice-to-have** |
| **Export to Excel/CSV** | Download filtered property list | File generation endpoint | **Nice-to-have** |
| **Real-time portal status** | Show actual publication status per portal (pending, published, error) | Portal webhook/polling | **Essential** |

---

## 7. File Dependency Graph

```
PropertiesPage.tsx
├── PropertyCard.tsx
│   ├── ui/checkbox
│   ├── ui/switch
│   ├── ui/popover
│   └── ui/tooltip
├── PropertySearchFilters.tsx
│   └── LocationSearchDropdown.tsx
│       └── locations/mock-data.ts
├── PropertyFilterSidebar.tsx
│   └── ui/collapsible
├── ui/button
├── ui/popover
└── ui/sheet
```

---

## 8. State Management

All state is local React state (no global store, no backend).

| State | Location | Type | Scope |
|---|---|---|---|
| `filters` | `PropertiesPage` | `FilterState` | Top search/filter bar |
| `sidebarFilters` | `PropertiesPage` | `SidebarFilters` | Right sidebar chips |
| `selectedIds` | `PropertiesPage` | `Set<number>` | Multi-select |
| `sortBy` | `PropertiesPage` | `string` | Sort order |
| `webActive` | `PropertyCard` (each) | `boolean` | Per-card portal state |
| `webFeatured` | `PropertyCard` (each) | `boolean` | Per-card portal state |
| `portals` | `PropertyCard` (each) | `Portal[]` | Per-card portal state |

> **Note:** Portal state (`webActive`, `webFeatured`, `portals`) is managed independently per card instance, meaning changes don't persist across re-renders or propagate up. When connected to a backend, these should be lifted to the parent or managed via a mutation/cache layer.
