# Properties Dashboard — UI Element Checklist

> Generated: 2026-02-27
> Scope: Properties page (CRM backoffice view)
> Status legend: **DESIGNED** = UI only, no backend | **CONNECTED** = working client-side state | **PLACEHOLDER** = empty/mock data

---

## 1. Global Header Bar (`HeaderBar.tsx`)

- [ ] **Hamburger menu** — Toggles sidebar on mobile (`<lg`). Icon: `Menu` 5×5. Status: **CONNECTED**
- [ ] **Search bar** — Fake input with `Buscar...` placeholder. `w-64 md:w-80`, hidden on mobile. Status: **PLACEHOLDER** (no search logic)
- [ ] **User avatar** — Circle with initials "JD", `h-8 w-8`, `bg-primary`. Status: **PLACEHOLDER** (hardcoded)

---

## 2. App Sidebar (`AppSidebar.tsx`)

- [ ] **Brand logo** — `Building2` icon in `bg-primary` rounded square + "RealEstateOS" label. Status: **DESIGNED**
- [ ] **Navigation items** — Dashboard, Propiedades, Contactos, Agencias, Locations, Luxury Landing, Componentes. Status: **CONNECTED** (view switching works)
- [ ] **Importer section** — Fuentes, Historial, Programador, Pendientes (badge: 19). Status: **CONNECTED** (navigation) / **PLACEHOLDER** (badge hardcoded)
- [ ] **Bottom items** — Usuarios, Empresa, Ajustes. Status: **CONNECTED** (navigation)
- [ ] **Active state** — `bg-sidebar-custom-active` + `text-sidebar-custom-fg-active`. Status: **CONNECTED**
- [ ] **Mobile overlay** — `bg-foreground/20 backdrop-blur-sm`, click to close. Status: **CONNECTED**
- [ ] **Version label** — "Design Preview · v1.0". Status: **DESIGNED**

---

## 3. Page Header

- [ ] **Title** — "Propiedades", `text-xl sm:text-2xl font-semibold`. Status: **DESIGNED**
- [ ] **Subtitle** — "Catálogo de propiedades inmobiliarias", `text-sm text-muted-foreground`. Status: **DESIGNED**
- [ ] **"Nueva propiedad" button** — Primary button with `Plus` icon. Responsive: shows "Nueva" on mobile. Status: **PLACEHOLDER** (calls `onAddProperty` callback, navigates to add form)

---

## 4. Search Filters Bar (`PropertySearchFilters.tsx`)

### 4.1 Location Search (`LocationSearchDropdown.tsx`)
- [ ] **Location input** — Rounded-full input with `MapPin` icon, placeholder "City, Region, Country". `w-[420px]`, hidden `<md`. Status: **CONNECTED** (searches mock locations data)
- [ ] **Inline chips** — Max 2 visible + "+N" counter. Clearable with `X`. Status: **CONNECTED**
- [ ] **Dropdown: Selected section** — Shows currently selected locations. Status: **CONNECTED**
- [ ] **Dropdown: Search near me** — `Navigation` icon button. Status: **PLACEHOLDER** (no geolocation)
- [ ] **Dropdown: Search results** — Max 6 results from `mockLocations`. Shows path + type badge. Status: **CONNECTED** (mock data)
- [ ] **Dropdown: Recent searches** — Persisted in `localStorage`. Max 5 items. Status: **CONNECTED**
- [ ] **Dropdown: Empty state** — "No locations found" text. Status: **CONNECTED**

### 4.2 Filters Button
- [ ] **"Filters" pill** — `bg-foreground text-background`, `SlidersHorizontal` icon. Opens full filter sidebar. Status: **CONNECTED**

### 4.3 Type Dropdown
- [ ] **Type pill** — Shows count badge when active. Options: Villa, Penthouse, Apartment, Finca, New Build, Land. Checkbox list. Status: **CONNECTED** (client state only)

### 4.4 Price Dropdown
- [ ] **Price pill** — Shows "●" when active. Opens dual-input (Min/Max) + presets (€500K–€10M). Status: **CONNECTED** (client state only)
- [ ] **"Hide Price on Request" checkbox** — Inside price dropdown. Status: **CONNECTED** (client state only)

### 4.5 Beds Dropdown
- [ ] **Beds pill** — Options: Any, 1+, 2+, 3+, 4+, 5+. Single-select buttons. Status: **CONNECTED** (client state only)

### 4.6 Amenities Dropdown
- [ ] **Amenities pill** — Shows count badge. Grouped by View/Outdoor/Indoor. Multi-select pills. Status: **CONNECTED** (client state only)

### 4.7 New Builds Toggle
- [ ] **"New Builds" pill** — Toggle on/off. Status: **CONNECTED** (client state only)

### 4.8 Active Filter Chips
- [ ] **Chip row** — Appears below filter bar when filters are active. Each chip has `X` to remove. Status: **CONNECTED**
- [ ] **"Clear all" link** — Resets all filters to default. Status: **CONNECTED**

### 4.9 Filter Sidebar (Full)
- [ ] **Slide-in panel** — `w-[340px]`, left side, with overlay. `animate-in slide-in-from-left`. Status: **CONNECTED**
- [ ] **Property type with subtypes** — Checkboxes with expandable subtypes (Villa → Modern/Traditional/Luxury). Status: **CONNECTED** (client state)
- [ ] **Price range inputs** — Min/Max text inputs + preset pills. Status: **CONNECTED** (client state)
- [ ] **Living area inputs** — Min/Max m² inputs. Status: **CONNECTED** (client state)
- [ ] **Bedrooms selector** — Button group: Any, 1+, 2+, 3+, 4+, 5+. Status: **CONNECTED** (client state)
- [ ] **Bathrooms selector** — Button group: Any, 1+, 2+, 3+, 4+. Status: **CONNECTED** (client state)
- [ ] **Amenities list** — 8 checkbox items (Sea Views, Pool, etc.). Status: **CONNECTED** (client state)
- [ ] **"Clear all" button** — Footer left. Status: **CONNECTED**
- [ ] **"Show results" button** — Footer right, primary style. Status: **CONNECTED** (closes sidebar)

---

## 5. Results Bar & Sorting

- [ ] **Results count** — "{N} propiedades", `text-[12px] text-muted-foreground`. Status: **PLACEHOLDER** (hardcoded to demo array length)
- [ ] **Sort dropdown** — Popover with 6 options. `ArrowUpDown` icon. Active option shows `Check` icon. Status: **CONNECTED** (state changes, but no actual sorting logic)

| Sort Option | Value | Status |
|---|---|---|
| Última actualización | `updatedAt-desc` | PLACEHOLDER |
| Más recientes | `createdAt-desc` | PLACEHOLDER |
| Más antiguos | `createdAt-asc` | PLACEHOLDER |
| Precio: mayor a menor | `price-desc` | PLACEHOLDER |
| Precio: menor a mayor | `price-asc` | PLACEHOLDER |
| Estado | `status` | PLACEHOLDER |

---

## 6. Bulk Actions Bar (`BulkActionsBar`)

Appears when ≥1 property is selected via checkbox.

- [ ] **Selection counter** — "{N} sel.", `text-sm font-medium`. Status: **CONNECTED**
- [ ] **"Exportar a portales" button** — `Download` icon. Hidden label on mobile. Status: **PLACEHOLDER** (console.log only)
- [ ] **"Publicar en web" button** — `Globe` icon. Status: **PLACEHOLDER**
- [ ] **"Despublicar" button** — `Globe` icon red. Hidden on mobile. Status: **PLACEHOLDER**
- [ ] **"Compartir" button** — `Share2` icon. Hidden label on mobile. Status: **PLACEHOLDER**
- [ ] **"Imprimir PDF" button** — `Printer` icon. Hidden on mobile. Status: **PLACEHOLDER**
- [ ] **"Etiqueta" button** — `Tag` icon. Status: **PLACEHOLDER**
- [ ] **Deselect (X) button** — Clears all selections. Status: **CONNECTED**

---

## 7. Property Card (`PropertyCard.tsx`)

### 7.1 Image Section
- [ ] **Property image** — `w-full sm:w-60`, `h-48 sm:h-auto`. `object-cover` with hover zoom (`scale-105`, 500ms). Status: **DESIGNED** (static images)
- [ ] **Photo counter** — "1/12", bottom-right, `bg-foreground/60 backdrop-blur-sm`. Status: **PLACEHOLDER** (hardcoded)
- [ ] **Off-market overlay** — Full image overlay, `bg-foreground/40 backdrop-blur-[1px]`, centered "OFF-MARKET" label with `EyeOff` icon. Shown when `isOffMarket=true`. Status: **CONNECTED** (data-driven)
- [ ] **Exclusive badge** — Top-left, `bg-amber-500/90`, "EXCLUSIVA" with `Crown` icon. Shown when `isExclusive=true`. Status: **CONNECTED** (data-driven)

### 7.2 Details Section — Top Row
- [ ] **Selection checkbox** — `h-4 w-4`, stops propagation. Status: **CONNECTED**
- [ ] **Reference number** — Mono font, `text-xs text-muted-foreground`. Format: "6254" or auto-generated "REF-0001". Status: **DESIGNED**
- [ ] **Star rating** — 5 stars, `h-3 w-3`. Filled: `text-amber-400 fill-amber-400`. Empty: `text-muted-foreground/20`. Status: **DESIGNED** (hardcoded per property)
- [ ] **MLS badge** — Green pill (`bg-emerald-50 border-emerald-200`), `Handshake` icon, "MLS - {AgencyName}". Shown when `collaboration=true`. Truncated on mobile to "MLS". Status: **CONNECTED** (data-driven)
- [ ] **Compartido MLS badge** — Indigo pill (`bg-indigo-50 border-indigo-200`), `Users` icon, "Compartido MLS". Shown when `isCollaborator=true`. Truncated on mobile. Status: **CONNECTED** (data-driven)
- [ ] **Destacado badge** — Amber pill (`bg-amber-50 border-amber-200`), `Sparkles` icon. Shown when `webFeatured=true && webActive=true`. Status: **CONNECTED** (synced with portal popover)
- [ ] **Status badge** — Rounded-full pill with colored dot. Status: **CONNECTED** (data-driven)

| Status | Dot Color | Text Color | Background |
|---|---|---|---|
| Disponible | `bg-emerald-500` | `text-emerald-700` | `bg-emerald-50` |
| Reservado | `bg-amber-500` | `text-amber-700` | `bg-amber-50` |
| Vendido | `bg-red-500` | `text-red-700` | `bg-red-50` |
| Alquilado | `bg-blue-500` | `text-blue-700` | `bg-blue-50` |
| Bajo oferta | `bg-violet-500` | `text-violet-700` | `bg-violet-50` |
| Off-market | `bg-gray-500` | `text-gray-700` | `bg-gray-100` |

### 7.3 Details Section — Price Row
- [ ] **Price** — `text-lg sm:text-xl font-bold`. Or "Consultar precio" when `priceOnRequest=true`. Status: **DESIGNED**
- [ ] **Price drop indicator** — `TrendingDown` icon (red) + strikethrough previous price (`text-muted-foreground/60`). Shown when `previousPrice` exists. Status: **DESIGNED**
- [ ] **Operation label** — "VENTA" / "ALQUILER", `text-[11px] uppercase tracking-wide text-muted-foreground`. Status: **DESIGNED**

### 7.4 Details Section — Property Info
- [ ] **Location** — `MapPin` icon + address, `text-[13px] text-muted-foreground`. Status: **DESIGNED**
- [ ] **Beds** — `Bed` icon + count + "hab.", `text-[13px]`. Status: **DESIGNED**
- [ ] **Baths** — `Bath` icon + count + "baños", `text-[13px]`. Status: **DESIGNED**
- [ ] **Built area** — `Maximize` icon + m², `text-[13px]`. Falls back to `sqft`. Status: **DESIGNED**
- [ ] **Plot area** — "Parcela {X} m²". Only shown when `plotArea` exists. Status: **DESIGNED**
- [ ] **Description** — `text-[12px] italic text-muted-foreground`, `line-clamp-2`, hidden on mobile. Status: **DESIGNED**

### 7.5 Details Section — Tags Row
- [ ] **Tag pills** — `border-border bg-muted/50`, `text-[10px] font-semibold`. Status: **DESIGNED** (hardcoded)
- [ ] **"+ Etiqueta" button** — `text-primary`, `Tag` icon. Status: **PLACEHOLDER** (no action)

### 7.6 Footer
- [ ] **Created date** — `Calendar` icon + date. Status: **DESIGNED** (hardcoded)
- [ ] **Updated date** — "Act. {date}". Hidden on mobile. Status: **DESIGNED**
- [ ] **Leads counter** — "Leads (0)". Clickable. Status: **PLACEHOLDER**
- [ ] **Visitas counter** — "Visitas (0)". Hidden on mobile. Status: **PLACEHOLDER**
- [ ] **Ofertas button** — Clickable text. Hidden on mobile. Status: **PLACEHOLDER**
- [ ] **Portals popover trigger** — "{N} activos ({M} bloq.)" with `Globe` icon + `ChevronDown`. Status: **CONNECTED**

### 7.7 Portals Popover (`PortalsPopover`)
- [ ] **Header** — "Publicación", uppercase, `text-[11px]`. Status: **DESIGNED**
- [ ] **Web propia toggle** — `ExternalLink` icon + `Switch`. Status: **CONNECTED** (local state)
- [ ] **Destacado en web toggle** — `Sparkles` icon (amber), shown only when web is active. `bg-amber-50/50` row. Status: **CONNECTED** (local state, syncs with badge)
- [ ] **Portal list** — Max-h `52`, scrollable. Each portal shows name + check/lock icon. Status: **CONNECTED** (local state)
- [ ] **Restricted portal** — `opacity-50`, `cursor-not-allowed`, `bg-red-50/50`. `Ban` icon with tooltip explaining restriction. `Lock` icon on right. Status: **CONNECTED** (data-driven)
- [ ] **Active portal** — `Check` icon, `text-emerald-500`. Status: **CONNECTED** (toggleable)

---

## 8. Right Filter Sidebar (`PropertyFilterSidebar.tsx`)

Visible on `xl:` screens. Hidden below, replaced by bottom bar.

- [ ] **Header** — "Filtros" title + "Limpiar (N)" link + `Settings` gear icon. Status: **CONNECTED** (clear works) / **PLACEHOLDER** (gear console.log)
- [ ] **Help text** — "Clic: incluir → excluir → desactivar". Status: **DESIGNED**

### 8.1 Filter Sections (all use 3-state cycling: off → include → exclude)

| Section | Icon | Items | Default Open | Status |
|---|---|---|---|---|
| Etiquetas | `Tag` | A+, A.A, B.B+, Premium, Lujo, Inversión, Reforma | Yes | **CONNECTED** (client state) |
| Agente | `User` | Carlos García, Ana Martínez, Pedro López, María Sánchez, Luis Fernández | Yes | **CONNECTED** (client state) |
| Valoración | `Star` | 5, 4, 3, 2, 1, 0 (star icons with number overlay) | Yes | **CONNECTED** (client state) |
| Disponibilidad | `Circle` | Disponible, Reservado, Vendido, Alquilado, Bajo oferta | Yes | **CONNECTED** (client state) |
| Operación | `Home` | Venta, Alquiler, Traspaso | Yes | **CONNECTED** (client state) |
| Portales | `Globe` | Idealista, Fotocasa, Kyero, ThinkSpain, Green-Acres, Inmobilioscout24 | Yes | **CONNECTED** (client state) |
| Restricciones | `Ban` | Con restricciones, Sin restricciones | No | **CONNECTED** (client state) |
| Visibilidad | `EyeOff` | Off-market, En mercado | No | **CONNECTED** (client state) |

### 8.2 Filter Chip States

| State | Border | Background | Text | Icon |
|---|---|---|---|---|
| Off | `border-border` | `bg-card` | `text-muted-foreground` | none |
| Include | `border-emerald-300` | `bg-emerald-50` | `text-emerald-700` | `Plus` |
| Exclude | `border-red-300` | `bg-red-50` | `text-red-700` | `Minus` |

### 8.3 Star Rating Chips

| State | Border | Style |
|---|---|---|
| Off | `border-transparent` | Gray star with number |
| Include | `border-emerald-400 ring-1 ring-emerald-200` | Same star |
| Exclude | `border-red-400 ring-1 ring-red-200` | Same star |

---

## 9. Mobile Bottom Filter Bar

Visible on `<xl` screens. Fixed bottom, `z-40`.

- [ ] **"Filtros" button** — `SlidersHorizontal` icon, outline variant. Shows active count badge. Opens Sheet from bottom. Status: **CONNECTED**
- [ ] **Sheet content** — Contains full `PropertyFilterSidebar`. `max-h-[80vh]`, scrollable. Status: **CONNECTED**
- [ ] **"Etiquetas" button** — `Tag` icon, ghost variant. Status: **PLACEHOLDER** (no action)
- [ ] **"Agente" button** — `User` icon, ghost variant. Status: **PLACEHOLDER** (no action)
- [ ] **"Valoración" button** — `Star` icon, ghost variant. Status: **PLACEHOLDER** (no action)
- [ ] **"Estado" button** — `Circle` icon, ghost variant. Status: **PLACEHOLDER** (no action)
- [ ] **"Portales" button** — `Globe` icon, ghost variant. Status: **PLACEHOLDER** (no action)

---

## 10. Missing / Not Yet Designed

- [ ] **Pagination** — No pagination component exists. All 4 demo properties rendered at once. Status: **NOT DESIGNED**
- [ ] **Empty state** — No empty state for zero results. Status: **NOT DESIGNED**
- [ ] **Grid/card view toggle** — Only list view exists. Status: **NOT DESIGNED**
- [ ] **Property detail navigation** — Card `onClick` calls `onViewProperty` but navigates to a separate detail page. Status: **CONNECTED** (navigation only)
- [ ] **Real sorting** — Sort state changes but `sortedProperties` returns unsorted copy. Status: **PLACEHOLDER**
- [ ] **Real filtering** — Sidebar filters have state but don't filter the property list. Status: **PLACEHOLDER**
- [ ] **Bulk action execution** — All actions log to console. Status: **PLACEHOLDER**
- [ ] **Tag management** — "+Etiqueta" button and bulk "Añadir etiqueta" have no modal/dialog. Status: **NOT DESIGNED**
- [ ] **Gear/settings panel** — Settings icon in sidebar header logs to console. Status: **PLACEHOLDER**
- [ ] **Mobile bottom bar individual filters** — Etiquetas, Agente, Valoración, Estado, Portales buttons have no action. Status: **PLACEHOLDER**

---

## 11. Demo Data Summary

| ID | Title | Price | Status | Features |
|---|---|---|---|---|
| 1 | Villa Mediterránea con Piscina | 1.100.000 € (prev: 1.250.000 €) | Disponible | Exclusive, MLS - Lux Real Estate, Featured, 1 restricted portal |
| 2 | Penthouse con Vistas al Skyline | 1.890.000 € | Bajo oferta | Compartido MLS (Luxinmo), 2 restricted portals |
| 3 | Mansión Frente al Mar | 5.750.000 € (prev: 6.200.000 €) | Disponible | Off-market, MLS - Costa Homes |
| 4 | Ático de Diseño en Centro Histórico | Consultar precio | Disponible | Exclusive, web active |
