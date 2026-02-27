# Location Search Dropdown — Implementation Specification

> **Reference implementation**: `src/components/demos/LocationSearchDemos.tsx` → `VariantECollapsible`
> **Live demo**: `/dashboard/componentes` → "Variant E: Collapsible Groups"

---

## 1. Overview

A multiselect location search input with hierarchical grouping. Users can search and select **municipalities** (cities) and their **zones** (boroughs/neighborhoods). Selected items appear as chips in the input and as expandable groups in the dropdown.

### Key Behaviors

| Action | Result |
|--------|--------|
| Type a **municipality** name (e.g. "altea") | Shows matching municipalities **collapsed** with expand arrow + zone count |
| Type a **zone** name (e.g. "galera") | Shows parent municipality **auto-expanded** with matching zone(s) visible |
| Click a municipality row | Selects the **entire municipality** (implies all zones) |
| Click expand arrow → click zone | Selects/deselects **individual zones** within a municipality |
| Click input when items are selected | Dropdown opens showing **"Selected" section** at top with expandable zone management |
| Click input with no query and no selection | Shows **"Recent searches"** section |
| Deselect a municipality | Removes the municipality AND all its individually selected zones |

---

## 2. Data Model

### Location Hierarchy (4 visible levels, region is skipped in display)

```
Country → Province → [Region - hidden] → Municipality → Zone (Borough)
```

### Database Schema Required

```sql
-- locations table
id          UUID PRIMARY KEY
parent_id   UUID REFERENCES locations(id)
level       ENUM('country', 'province', 'region', 'municipality', 'borough')
name        VARCHAR(255)           -- Display name
safe_name   VARCHAR(255)           -- URL-safe slug
names       JSONB                  -- { "en": "Altea", "es": "Altea", "fr": "Altea" }
slugs       JSONB                  -- { "en": "altea", "es": "altea" }
active      BOOLEAN DEFAULT true
sort_order  INTEGER DEFAULT 0
geojson     TEXT                   -- GeoJSON geometry (optional)
```

### TypeScript Types

```typescript
type LocationLevel = "country" | "province" | "region" | "municipality" | "borough";

interface LocationNode {
  id: string;
  parentId: string | null;
  level: LocationLevel;
  name: string;
  names: Record<string, string>;  // multilingual names
  active: boolean;
}

// Selected item in the search component
interface SelectedLocation {
  id: string;
  name: string;
  type: string;        // Display label: "Country" | "Province" | "City" | "Zone"
  parentId?: string;   // Only for zones — references parent municipality
}

// Internal grouped municipality for dropdown rendering
interface GroupedMunicipality {
  id: string;
  name: string;
  path: string;          // Subtitle: "Alicante, España"
  type: string;          // "City"
  children: LocationItem[];
  autoExpanded: boolean; // true when a child zone matched the search query
}
```

---

## 3. Search Algorithm

### Priority Logic (CRITICAL)

```
1. Search MUNICIPALITIES first (name match or multilingual name match)
2. ONLY IF zero municipalities match → search ZONES (boroughs)
3. Also search COUNTRIES and PROVINCES as standalone results
4. NEVER show "region" level in results or paths
```

### Path Display (buildSubtitle)

When showing the subtitle under a municipality name, skip the location itself, skip region, skip municipality:

```
Municipality "Altea" → subtitle: "Alicante, España"
  (skips: self, region "Marina Baixa")

Zone "Galera del Mar" → shown under parent municipality header, no individual subtitle needed
```

### Search Implementation

```typescript
const search = (query: string, locations: LocationNode[]) => {
  const q = query.toLowerCase().trim();
  if (!q) return { standalone: [], municipalities: [] };

  // Step 1: Match municipalities
  const matchingMunis = locations.filter(
    loc => loc.active && loc.level === "municipality" &&
    (loc.name.toLowerCase().includes(q) ||
     Object.values(loc.names).some(n => n.toLowerCase().includes(q)))
  );

  if (matchingMunis.length > 0) {
    // Return each muni with ALL its zones as children (collapsed, autoExpanded=false)
    return { municipalities: matchingMunis.map(muni => ({
      ...muni,
      children: getAllZones(muni.id),
      autoExpanded: false,  // user expands manually
    }))};
  }

  // Step 2: No munis matched → search zones
  const matchingZones = locations.filter(
    loc => loc.active && loc.level === "borough" &&
    (loc.name.toLowerCase().includes(q) ||
     Object.values(loc.names).some(n => n.toLowerCase().includes(q)))
  ).slice(0, 12);

  // Group zones under their parent municipality (autoExpanded=true)
  // ...
};
```

---

## 4. Component API

```typescript
interface LocationSearchDropdownProps {
  selected: SelectedLocation[];
  onSelectedChange: (items: SelectedLocation[]) => void;
  placeholder?: string;           // Default: "City, Zone, Country…"
  maxVisibleChips?: number;        // Default: 3
  className?: string;
}
```

---

## 5. UI Structure

### 5.1 Input Bar (pill-shaped)

```
┌──────────────────────────────────────────────────────┐
│ 📍  [Altea] [Calpe (3)] [+2]  Add location...    ✕  │
└──────────────────────────────────────────────────────┘
```

- **Container**: `min-h-[44px]`, `rounded-full`, `border border-border`, `px-3`, `flex-wrap py-1`
- **Icon**: `MapPin` 16×16, `text-muted-foreground`
- **Chips**: `bg-muted text-foreground text-[11px] font-medium rounded-full pl-2.5 pr-1.5 py-0.5`
  - Shows municipality name if entire muni selected: `"Altea"`
  - Shows name + count if individual zones: `"Calpe (3)"`
  - Max visible chips configurable (default 3), overflow shows `"+N"`
  - Each chip has X button to remove
- **Input**: `text-sm`, `min-w-[80px]`, transparent background
  - Placeholder: `"City, Zone, Country…"` when empty, `"Add location..."` when items selected
- **Clear button**: X icon, only when query has text

### 5.2 Dropdown Panel

```
┌──────────────────────────────────────────────────────┐
│  SELECTED                                            │
│  ☑ Altea                                  All zones  │
│     Alicante, España                          ▼ 10  │
│       ☑ Galera del Mar                               │
│       ☑ Altea Pueblo                                 │
│       ☐ Altea Hills                                  │
│       ☐ Cap Negret                                   │
│       ...                                            │
│  ☑ Calpe                                     3/3  ▶ │
│     Alicante, España                                 │
│ ─────────────────────────────────────────────────── │
│  🔍 Marbella                                  City  │
│     Málaga, España                             ▶ 2  │
│  🔍 Estepona                                  City  │
│     Málaga, España                             ▶ 1  │
└──────────────────────────────────────────────────────┘
```

- **Container**: `rounded-xl border border-border shadow-lg`, `max-h-[420px] overflow-y-auto`, `min-w-[340px]`
- **Position**: absolute, `top-full mt-1.5`, full width of parent

### 5.3 Selected Section (top of dropdown)

Only visible when `selected.length > 0`.

- **Header**: `"SELECTED"` — `text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider`
- **Municipality row**:
  - MapPin icon: `w-4 h-4 text-muted-foreground/50`
  - Name: `text-sm font-medium text-foreground`
  - Subtitle: `text-xs text-muted-foreground` (e.g. "Alicante, España")
  - Right side: `"All zones"` or `"3/10"` count — `text-[10px] text-muted-foreground/50`
  - X button to remove municipality
  - Expand button: ChevronRight/ChevronDown + zone count

- **Zone row** (when expanded):
  - Indented: `pl-11`
  - MapPin icon: `w-3.5 h-3.5 text-muted-foreground/40`
  - Name: `text-[13px] text-foreground`
  - Unselected zones show `opacity-50`
  - Selected zones show X icon to remove

### 5.3b Recent Searches Section

Visible when `query` is empty AND there are recent searches not already selected.

- **Header**: Clock icon + `"Recent searches"` — same style as section headers
- **Row**: MapPin icon + name + type label. Clicking adds to selection.

### 5.4 Search Results Section (below selected / recent)

- **Municipality result row**:
  - MapPin icon: `w-4 h-4 text-muted-foreground/50`
  - Two lines: name (bold) + subtitle path
  - Type label: `"City"` — `text-[11px] text-muted-foreground/60`
  - Expand arrow with zone count

- **Zone result row** (when expanded under municipality):
  - MapPin icon (smaller)
  - Indented `pl-11`
  - Name + type label

- **Standalone results** (country, province):
  - Search icon
  - Two lines: name + path
  - Type label

- **Empty state**: `"No locations found"` — `text-xs text-muted-foreground`, centered

---

## 6. Selection Logic

### Selecting a Municipality
```typescript
const toggleMuniSelection = (muniId, muniName) => {
  if (alreadySelected(muniId)) {
    // DESELECT: remove muni AND all its zones from selection
    remove(muniId);
    removeAllZonesOf(muniId);
  } else {
    // SELECT: remove any individually selected zones, add muni (implies all)
    removeAllZonesOf(muniId);
    add({ id: muniId, name: muniName, type: "City" });
  }
};
```

### Selecting a Zone
```typescript
const toggleZone = (zoneId, zoneName, parentMuniId) => {
  if (alreadySelected(zoneId)) {
    remove(zoneId);
  } else {
    add({ id: zoneId, name: zoneName, type: "Zone", parentId: parentMuniId });
  }
};
```

### Chip Display Logic
```typescript
const buildChips = (selected, selectedMuniGroups) => {
  const chips = [];
  selectedMuniGroups.forEach(group => {
    const isMuniSelected = selected.has(group.id);
    const selectedZoneCount = group.zones.filter(z => z.selected).length;
    if (isMuniSelected) {
      chips.push({ id: group.id, label: group.name });           // "Altea"
    } else if (selectedZoneCount > 0) {
      chips.push({ id: group.id, label: `${group.name} (${selectedZoneCount})` }); // "Altea (3)"
    }
  });
  return chips;
};
```

---

## 7. State Management

```typescript
// Component state
const [query, setQuery] = useState("");              // Search input text
const [open, setOpen] = useState(false);             // Dropdown visibility
const [selected, setSelected] = useState([]);        // Array of SelectedLocation
const [expandedIds, setExpandedIds] = useState(Set); // Expanded munis in search results
const [selectedExpandedIds, setSelectedExpandedIds] = useState(Set); // Expanded munis in selected section

// Derived state (useMemo)
const selectedIds = Set(selected.map(s => s.id));
const selectedMuniGroups = /* group selected items by parent municipality */;
const standaloneSelected = selected.filter(s => s.type !== "City" && s.type !== "Zone");
const { standalone, municipalities } = /* search results */;
const chipItems = /* build chip display from selectedMuniGroups */;
```

### Auto-expand behavior
```typescript
// When query changes, auto-expand municipalities whose CHILDREN matched
useEffect(() => {
  const autoIds = municipalities
    .filter(m => m.autoExpanded)  // true when zone children matched
    .map(m => m.id);
  setExpandedIds(new Set(autoIds));
}, [query]);
```

---

## 8. Interactions

| Interaction | Handler |
|-------------|---------|
| Click input container | Focus input + open dropdown |
| Type in input | Update query + open dropdown |
| Click outside | Close dropdown (mousedown listener) |
| Click municipality row | `toggleMuniSelection()` — select/deselect entire muni |
| Click expand arrow | `toggleExpand()` / `toggleSelectedExpand()` — show/hide zones |
| Click zone row | `toggleZone()` — toggle individual zone |
| Click chip X | `removeSelection()` — remove that item |
| Click clear (X in input) | Clear query text, keep selections |
| Click recent search item | `addSelection()` — add to selection |

---

## 9. Icons Used (lucide-react)

| Icon | Usage |
|------|-------|
| `MapPin` | Input prefix, municipality rows, zone rows (all locations) |
| `Search` | Standalone result rows (country, province) |
| `X` | Chip remove, clear input, selected item remove, zone deselect |
| `ChevronRight` | Collapsed expand arrow |
| `ChevronDown` | Expanded expand arrow |
| `Clock` | Recent searches section header |

---

## 10. Tailwind Classes Reference

### Design Tokens (use semantic tokens, NOT raw colors)

| Element | Classes |
|---------|---------|
| Input container | `border-border bg-background focus-within:border-foreground/30` |
| Chip | `bg-muted text-foreground` |
| Dropdown | `bg-card border-border shadow-lg` |
| Row hover | `hover:bg-muted/50` |
| Name text | `text-foreground` |
| Subtitle text | `text-muted-foreground` |
| Type label | `text-muted-foreground/60` |
| Section header | `text-muted-foreground/60` |
| MapPin icon (muni) | `text-muted-foreground/50` |
| MapPin icon (zone) | `text-muted-foreground/40` |
| Unselected zone | `opacity-50` |

### Typography

| Element | Size |
|---------|------|
| Input text | `text-sm` (14px) |
| Name (results) | `text-sm font-medium` |
| Subtitle | `text-xs` (12px) |
| Chip text | `text-[11px] font-medium` |
| Section header | `text-[11px] font-semibold uppercase tracking-wider` |
| Type label | `text-[11px] font-medium` |
| Zone count | `text-[10px] font-medium` |
| Zone name (selected) | `text-[13px]` |

### Spacing

| Element | Value |
|---------|-------|
| Input height | `min-h-[44px]` |
| Input padding | `px-3 py-1` |
| Dropdown gap from input | `mt-1.5` |
| Row padding | `px-4 py-2.5` (results), `px-4 py-2` (selected), `pl-11 pr-4 py-1.5` (zones) |
| Dropdown max height | `max-h-[420px]` |
| Dropdown min width | `min-w-[340px]` |
| Icon size | `w-4 h-4` (standard), `w-3.5 h-3.5` (zone) |

---

## 11. Edge Cases

1. **Municipality selected + expand zones**: All zones appear as selected (not dimmed). Clicking a zone deselects it individually.
2. **All zones manually selected**: Does NOT auto-promote to municipality selection. The chip shows `"Altea (10)"` not `"Altea"`.
3. **Remove chip for municipality with individual zones**: Removes the municipality group entry and all its zones from selection.
4. **Search returns both municipality AND its zones**: Only municipality appears (priority logic). Zones are accessible via expand arrow.
5. **Empty query + dropdown open**: Shows "Selected" section (if any) + "Recent searches" section (if any).
6. **Max chips overflow**: Shows first N chips + `"+M"` counter.
7. **Recent searches**: Tracked in component state. Items already selected are excluded from recent list.

---

## 12. File Reference

The complete working implementation is in:
- **Component**: `src/components/demos/LocationSearchDemos.tsx` → `export const VariantECollapsible`
- **Mock data**: `src/components/locations/mock-data.ts`
- **Types**: `src/components/locations/types.ts`
