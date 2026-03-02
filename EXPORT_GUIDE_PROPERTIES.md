# Guía de Exportación – Vista /properties (Luxury Property Listing)

## Archivos necesarios

### 1. Componente principal (TODO EN UNO)
```
src/components/luxury/LuxuryPropertyListing.tsx
```
> Este archivo es un **monolito autocontenido** (~737 líneas) que incluye:
> - Navbar con logo centrado y navegación
> - Breadcrumbs
> - Barra de búsqueda con LocationSearchDropdown
> - Filtros en dropdowns (Type, Price, Beds, Amenities, New Builds)
> - Sidebar de filtros (slide-in desde la izquierda)
> - Sistema de chips activos (active filters)
> - Tarjetas de propiedad horizontales (PropertyCard interno)
> - Paginación
> - Sección "Popular Locations"
> - Newsletter
> - Footer

### 2. Búsqueda de ubicación
```
src/components/luxury/LocationSearchDropdown.tsx
```
> Dropdown con autocompletado jerárquico (Country → Province → Region → City → Borough).
> Soporta selección múltiple, chips inline, búsquedas recientes (localStorage).

### 3. Datos de ubicaciones (mock)
```
src/components/locations/mock-data.ts
```
> Array `mockLocations` usado por LocationSearchDropdown para buscar.
> En producción, reemplazar por llamada API.

### 4. Imágenes
```
src/assets/luxury-hero.jpg
src/assets/luxury-property-1.jpg
src/assets/luxury-property-2.jpg
src/assets/luxury-property-3.jpg
src/assets/property-detail-1.jpg
src/assets/property-detail-2.jpg
src/assets/property-detail-3.jpg
```

### 5. Design System
```
src/index.css              → Variable `--luxury-black` y fuentes
tailwind.config.ts         → Color `luxury-black` en extend.colors
```

---

## Variables CSS clave (index.css)

```css
/* La página usa principalmente: */
--luxury-black: /* color base para texto/botones, normalmente #1A1A1A o similar */

/* Fondo: bg-white (blanco puro) */
/* Fuente: font-sans (Jost, configurada en el proyecto) */
```

## Colores Tailwind custom necesarios (tailwind.config.ts)

```js
colors: {
  "luxury-black": "var(--luxury-black)", // o el valor HSL que uses
}
```

> **Nota:** El componente usa clases como `text-luxury-black/55`, `bg-luxury-black/30`, etc.
> con opacidad de Tailwind. Asegúrate de que el color base esté definido correctamente.

---

## Dependencias npm

```bash
npm install lucide-react tailwindcss-animate class-variance-authority clsx tailwind-merge
```

---

## Tipografía

```css
@import url('https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400;500;600;700&display=swap');

body {
  font-family: 'Jost', sans-serif;
}
```

---

## Estructura del componente

```
LuxuryPropertyListing (monolito)
├── Navbar (inline, grid 3 cols)
│   ├── NAV_LEFT: ["Home", "Properties", "Rentals"]
│   ├── Logo centrado: "PRESTIGE ESTATES"
│   └── NAV_RIGHT: ["About", "Guides & Blog", "Message Us"]
│
├── Breadcrumbs + Search Bar (sticky top-[68px])
│   ├── LocationSearchDropdown (autocompletado multi-select)
│   ├── Filters button (abre sidebar)
│   ├── TypeDropdown (multi-select checkboxes)
│   ├── PriceDropdown (min/max + presets + hide POR)
│   ├── BedsDropdown (Any, 1+, 2+, 3+, 4+, 5+)
│   ├── AmenitiesDropdown (agrupado: View, Outdoor, Indoor)
│   └── New Builds toggle
│
├── FilterSidebar (slide-in izquierda, overlay)
│   ├── Property type con subtypes
│   ├── Price range con presets
│   ├── Living area (m²)
│   ├── Bedrooms / Bathrooms
│   └── Amenities (checkboxes)
│
├── Active Filter Chips (pills removibles)
│
├── Results Header
│   ├── Título: "Luxury Homes in Ibiza & Costa Blanca"
│   ├── Descripción
│   ├── Count: "6 properties found"
│   └── Sort: "Premium"
│
├── PropertyCard (horizontal, por cada propiedad)
│   ├── Imagen (16/10 aspect, hover scale)
│   ├── Tag: "FOR SALE" / "NEW BUILD"
│   ├── Location (uppercase, tracking)
│   ├── Typology | Style | REF
│   ├── Title (17-19px, font-medium)
│   ├── Description (line-clamp-2)
│   ├── Specs strip: BEDS | BATHS | BUILT | PLOT
│   ├── Feature dots
│   └── Price (28px, font-extralight)
│
├── Pagination (Next button + numbered pages)
├── Popular Locations (6-col grid de links)
├── Newsletter (email input + subscribe)
└── Footer (luxury-black bg)
```

---

## Estado interno (useState)

| Variable | Tipo | Propósito |
|---|---|---|
| `filtersOpen` | `boolean` | Abre/cierra sidebar de filtros |
| `filters` | `FilterState` | Estado completo de todos los filtros |

```ts
interface FilterState {
  locations: { id: string; name: string; path: string; type: string }[];
  types: string[];
  priceMin: string;
  priceMax: string;
  hidePriceOnRequest: boolean;
  areaMin: string;
  areaMax: string;
  beds: string;      // "Any" | "1+" | "2+" | "3+" | "4+" | "5+"
  baths: string;     // "Any" | "1+" | "2+" | "3+" | "4+"
  amenities: string[];
  newBuilds: boolean;
}
```

---

## Helpers internos

- `useDropdown()` — Hook para dropdowns con click-outside
- `buildActiveChips(filters)` — Genera array de chips activos
- `removeChip(filters, chip)` — Elimina un chip específico
- `formatPrice(val)` — Formatea número a "€500K", "€1M", etc.

---

## Datos mock (PROPERTIES array)

6 propiedades con esta estructura:
```ts
{
  id: number;
  image: string;           // import de src/assets/
  gallery: string[];       // array de imports
  tag: "FOR SALE" | "NEW BUILD";
  style: string;           // "Contemporary", "Luxury", etc.
  location: string;        // "Santa Eulalia del Río · Ibiza"
  title: string;           // uppercase
  excerpt: string;
  beds: number;
  baths: number;
  sqm: number;
  plot: number | null;
  price: string;           // "€4,650,000"
  features: string[];      // ["Sea Views", "Infinity Pool", ...]
}
```

---

## Responsive

- **Desktop (≥768px):** Tarjetas en grid 12 cols (5 imagen + 7 info)
- **Mobile (<768px):** Tarjetas en stack vertical (imagen arriba, info abajo)
- **Navbar:** Links ocultos en mobile, hamburger visible
- **Search bar:** LocationSearchDropdown oculto en mobile (`hidden md:flex`)

---

## Cómo integrar

1. Copia `LuxuryPropertyListing.tsx` y `LocationSearchDropdown.tsx`
2. Copia `src/components/locations/mock-data.ts` (o sustituye por API)
3. Copia las 7 imágenes a `src/assets/`
4. Añade `luxury-black` a tu `tailwind.config.ts`
5. Importa Jost desde Google Fonts
6. Renderiza `<LuxuryPropertyListing />` en tu ruta `/properties`

---

## Archivos NO necesarios

Estos archivos existen en el proyecto pero **NO** son usados por esta vista:

- `src/components/properties/PropertyCard.tsx` → Es la tarjeta del CRM, no del listing público
- `src/components/properties/PropertyFilters.tsx` → Es el sidebar del CRM
- `src/components/properties/PropertySearchFilters.tsx` → Es una versión alternativa de filtros
- `src/components/properties/PropertyFilterSidebar.tsx` → Sidebar del CRM

La vista `/properties` es **completamente autónoma** en `LuxuryPropertyListing.tsx`.

---

## Total: 3 archivos TypeScript + 7 imágenes + config
