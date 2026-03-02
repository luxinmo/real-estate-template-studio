import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import LocationSearchDropdown from "@/components/properties/LocationSearchDropdown";

/* ─── Types ─── */
export interface FilterState {
  locations: { id: string; name: string; path: string; type: string }[];
  types: string[];
  priceMin: string;
  priceMax: string;
  hidePriceOnRequest: boolean;
  areaMin: string;
  areaMax: string;
  beds: string;
  baths: string;
  amenities: string[];
  newBuilds: boolean;
}

export const defaultFilters: FilterState = {
  locations: [],
  types: [],
  priceMin: "",
  priceMax: "",
  hidePriceOnRequest: false,
  areaMin: "",
  areaMax: "",
  beds: "Any",
  baths: "Any",
  amenities: [],
  newBuilds: false,
};

/* ─── Constants ─── */
const TYPE_OPTIONS_WITH_SUBTYPES: { label: string; subtypes?: string[] }[] = [
  { label: "Villa", subtypes: ["Modern Villa", "Traditional Villa", "Luxury Villa"] },
  { label: "Penthouse", subtypes: ["Duplex Penthouse", "Sky Penthouse"] },
  { label: "Apartment", subtypes: ["Ground Floor", "Duplex", "Studio", "Loft"] },
  { label: "Finca" },
  { label: "New Build" },
  { label: "Land", subtypes: ["Urban", "Rustic"] },
];
const TYPE_OPTIONS = TYPE_OPTIONS_WITH_SUBTYPES.map(t => t.label);

const BED_OPTIONS = ["Any", "1+", "2+", "3+", "4+", "5+"];
const BATH_OPTIONS = ["Any", "1+", "2+", "3+", "4+"];

const AMENITY_SIDEBAR = ["Sea Views", "Pool", "Garden", "Garage", "Terrace", "Smart Home", "Gym", "Wine Cellar"];

const AMENITY_GROUPS = [
  { title: "View", items: ["Panoramic View", "Sea Views", "Mountain View", "Golf View"] },
  { title: "Outdoor", items: ["Garden", "Pool", "Terrace", "Garage", "Balcony", "Private Beach"] },
  { title: "Indoor", items: ["Air Conditioning", "Fireplace", "Gym", "Wine Cellar", "Cinema", "Elevator", "Jacuzzi", "Sauna", "Smart Home"] },
];

const PRICE_PRESETS = [
  { label: "€500K", value: "500000" },
  { label: "€1M", value: "1000000" },
  { label: "€2M", value: "2000000" },
  { label: "€5M", value: "5000000" },
  { label: "€10M", value: "10000000" },
];

/* ─── Dropdown Hook ─── */
function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return { open, setOpen, ref };
}

/* ─── Dropdown Components ─── */
const TypeDropdown = ({ selected, onToggle }: { selected: string[]; onToggle: (v: string) => void }) => {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div ref={ref} className="relative shrink-0">
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-1 border text-[12px] px-4 py-1.5 rounded-full transition-all duration-200 shrink-0 ${selected.length > 0 ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/30"}`}>
        Type {selected.length > 0 && <span className="bg-background text-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">{selected.length}</span>} <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg w-[300px] py-2 z-50">
          {TYPE_OPTIONS.map((t) => (
            <label key={t} className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-accent transition-colors">
              <input type="checkbox" checked={selected.includes(t)} onChange={() => onToggle(t)} className="w-4 h-4 border-border rounded-sm accent-foreground" />
              <span className="text-[14px] text-foreground/80">{t}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const PriceDropdown = ({ priceMin, priceMax, hidePOR, onMinChange, onMaxChange, onHidePORChange }: {
  priceMin: string; priceMax: string; hidePOR: boolean;
  onMinChange: (v: string) => void; onMaxChange: (v: string) => void; onHidePORChange: (v: boolean) => void;
}) => {
  const { open, setOpen, ref } = useDropdown();
  const hasValue = priceMin || priceMax;
  return (
    <div ref={ref} className="relative shrink-0">
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-1 border text-[12px] px-4 py-1.5 rounded-full transition-all duration-200 ${hasValue ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/30"}`}>
        Price {hasValue && "●"} <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg w-[380px] p-5 z-50">
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Min price</label>
              <input type="text" value={priceMin} onChange={(e) => onMinChange(e.target.value)} placeholder="€ No Min" className="w-full border border-border rounded-md px-3 py-2.5 text-[13px] text-foreground bg-background focus:outline-none focus:border-foreground/30" />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {PRICE_PRESETS.slice(0, 3).map(p => (
                  <button key={p.value} onClick={() => onMinChange(p.value)} className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${priceMin === p.value ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/30"}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Max price</label>
              <input type="text" value={priceMax} onChange={(e) => onMaxChange(e.target.value)} placeholder="€ No Max" className="w-full border border-border rounded-md px-3 py-2.5 text-[13px] text-foreground bg-background focus:outline-none focus:border-foreground/30" />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {PRICE_PRESETS.slice(2).map(p => (
                  <button key={p.value} onClick={() => onMaxChange(p.value)} className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${priceMax === p.value ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/30"}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer mt-2">
            <input type="checkbox" checked={hidePOR} onChange={() => onHidePORChange(!hidePOR)} className="w-4 h-4 border-border rounded-sm accent-foreground" />
            <span className="text-[13px] text-muted-foreground">Hide "Price on Request" listings</span>
          </label>
        </div>
      )}
    </div>
  );
};

const BedsDropdown = ({ selected, onChange }: { selected: string; onChange: (v: string) => void }) => {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div ref={ref} className="relative shrink-0">
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-1 border text-[12px] px-4 py-1.5 rounded-full transition-all duration-200 ${selected !== "Any" ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/30"}`}>
        Beds {selected !== "Any" && <span className="text-[10px]">{selected}</span>} <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg w-[320px] p-5 z-50">
          <div className="flex gap-1">
            {BED_OPTIONS.map((b) => (
              <button key={b} onClick={() => onChange(b)} className={`flex-1 py-2 text-[13px] border rounded-md transition-all duration-200 ${selected === b ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground/30"}`}>
                {b}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AmenitiesDropdown = ({ selected, onToggle }: { selected: string[]; onToggle: (v: string) => void }) => {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div ref={ref} className="relative shrink-0">
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-1 border text-[12px] px-4 py-1.5 rounded-full transition-all duration-200 ${selected.length > 0 ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/30"}`}>
        Amenities {selected.length > 0 && <span className="bg-background text-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">{selected.length}</span>} <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg w-[480px] max-h-[420px] overflow-y-auto p-5 z-50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Select amenities</span>
            {selected.length > 0 && <button onClick={() => selected.forEach(s => onToggle(s))} className="text-[12px] text-muted-foreground hover:text-foreground">Clear</button>}
          </div>
          {AMENITY_GROUPS.map((group) => (
            <div key={group.title} className="mb-5 last:mb-0">
              <h4 className="text-[14px] font-medium text-foreground mb-3">{group.title}</h4>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => onToggle(item)}
                    className={`flex items-center gap-1.5 border rounded-full px-3.5 py-1.5 text-[12px] transition-all duration-200 ${selected.includes(item) ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/40"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Helper: format price ─── */
const formatPrice = (val: string) => {
  const n = parseInt(val);
  if (isNaN(n)) return val;
  if (n >= 1000000) return `€${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`;
  if (n >= 1000) return `€${(n / 1000).toFixed(0)}K`;
  return `€${n}`;
};

/* ─── Active Filter Chips ─── */
export interface ActiveChip {
  key: string;
  label: string;
  group: string;
}

export function buildActiveChips(f: FilterState): ActiveChip[] {
  const chips: ActiveChip[] = [];
  f.locations.forEach(l => chips.push({ key: `loc-${l.id}`, label: l.name, group: "location" }));
  f.types.forEach(t => chips.push({ key: `type-${t}`, label: t, group: "type" }));
  if (f.priceMin && f.priceMax) {
    chips.push({ key: "price-range", label: `${formatPrice(f.priceMin)} – ${formatPrice(f.priceMax)}`, group: "price" });
  } else if (f.priceMin) {
    chips.push({ key: "price-min", label: `From ${formatPrice(f.priceMin)}`, group: "price" });
  } else if (f.priceMax) {
    chips.push({ key: "price-max", label: `Up to ${formatPrice(f.priceMax)}`, group: "price" });
  }
  if (f.areaMin || f.areaMax) {
    const minLabel = f.areaMin ? `${f.areaMin} m²` : "";
    const maxLabel = f.areaMax ? `${f.areaMax} m²` : "";
    chips.push({ key: "area", label: minLabel && maxLabel ? `${minLabel} – ${maxLabel}` : minLabel ? `From ${minLabel}` : `Up to ${maxLabel}`, group: "area" });
  }
  if (f.beds !== "Any") chips.push({ key: "beds", label: `${f.beds} Beds`, group: "beds" });
  if (f.baths !== "Any") chips.push({ key: "baths", label: `${f.baths} Baths`, group: "baths" });
  f.amenities.forEach(a => chips.push({ key: `amenity-${a}`, label: a, group: "amenity" }));
  if (f.newBuilds) chips.push({ key: "newbuilds", label: "New Builds", group: "newBuilds" });
  if (f.hidePriceOnRequest) chips.push({ key: "hide-por", label: "Hide Price on Request", group: "hidePOR" });
  return chips;
}

export function removeChip(f: FilterState, chip: ActiveChip): FilterState {
  const next = { ...f };
  switch (chip.group) {
    case "location": next.locations = f.locations.filter(l => `loc-${l.id}` !== chip.key); break;
    case "type": next.types = f.types.filter(t => t !== chip.label); break;
    case "price": next.priceMin = ""; next.priceMax = ""; break;
    case "area": next.areaMin = ""; next.areaMax = ""; break;
    case "beds": next.beds = "Any"; break;
    case "baths": next.baths = "Any"; break;
    case "amenity": next.amenities = f.amenities.filter(a => a !== chip.label); break;
    case "newBuilds": next.newBuilds = false; break;
    case "hidePOR": next.hidePriceOnRequest = false; break;
  }
  return next;
}

/* ─── Filter Sidebar ─── */
const FilterSidebar = ({ open, onClose, filters, onChange }: { open: boolean; onClose: () => void; filters: FilterState; onChange: (f: FilterState) => void }) => {
  if (!open) return null;

  const toggleType = (t: string) => onChange({ ...filters, types: filters.types.includes(t) ? filters.types.filter(x => x !== t) : [...filters.types, t] });
  const toggleAmenity = (a: string) => onChange({ ...filters, amenities: filters.amenities.includes(a) ? filters.amenities.filter(x => x !== a) : [...filters.amenities, a] });

  return (
    <>
      <div className="fixed inset-0 bg-foreground/30 z-40" onClick={onClose} />
      <aside className="fixed top-0 left-0 h-full w-[340px] bg-card z-50 overflow-y-auto border-r border-border shadow-lg animate-in slide-in-from-left duration-300">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-[15px] font-medium text-foreground">Filters</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-7">
          {/* Property type with subtypes */}
          <div>
            <h3 className="text-[13px] font-medium text-foreground mb-3">Property type</h3>
            <div className="space-y-2.5">
              {TYPE_OPTIONS_WITH_SUBTYPES.map((t) => (
                <div key={t.label}>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2.5">
                      <input type="checkbox" checked={filters.types.includes(t.label)} onChange={() => toggleType(t.label)} className="w-4 h-4 border-border rounded-sm accent-foreground" />
                      <span className="text-[13px] text-muted-foreground group-hover:text-foreground transition-colors">{t.label}</span>
                    </div>
                    {t.subtypes && (
                      <span className="text-[11px] text-muted-foreground/60 flex items-center gap-1">All subtypes <ChevronDown className="w-3 h-3" /></span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div>
            <h3 className="text-[13px] font-medium text-foreground mb-3">Price range</h3>
            <div className="flex gap-3 mb-2">
              <input type="text" value={filters.priceMin} onChange={(e) => onChange({ ...filters, priceMin: e.target.value })} placeholder="€ No Min" className="w-full border border-border rounded-md px-3 py-2 text-[12px] text-foreground bg-background focus:outline-none focus:border-foreground/30" />
              <input type="text" value={filters.priceMax} onChange={(e) => onChange({ ...filters, priceMax: e.target.value })} placeholder="€ No Max" className="w-full border border-border rounded-md px-3 py-2 text-[12px] text-foreground bg-background focus:outline-none focus:border-foreground/30" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRICE_PRESETS.map(p => (
                <button key={p.value} onClick={() => onChange({ ...filters, priceMin: filters.priceMin === p.value ? "" : p.value })} className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${filters.priceMin === p.value ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/30"}`}>
                  {p.label}+
                </button>
              ))}
            </div>
          </div>

          {/* Living area */}
          <div>
            <h3 className="text-[13px] font-medium text-foreground mb-3">Living area</h3>
            <div className="flex gap-3">
              <input type="text" value={filters.areaMin} onChange={(e) => onChange({ ...filters, areaMin: e.target.value })} placeholder="No Min" className="w-full border border-border rounded-md px-3 py-2 text-[12px] text-foreground bg-background focus:outline-none focus:border-foreground/30" />
              <input type="text" value={filters.areaMax} onChange={(e) => onChange({ ...filters, areaMax: e.target.value })} placeholder="No Max" className="w-full border border-border rounded-md px-3 py-2 text-[12px] text-foreground bg-background focus:outline-none focus:border-foreground/30" />
            </div>
            <span className="text-[10px] text-muted-foreground mt-1 block">m²</span>
          </div>

          {/* Bedrooms */}
          <div>
            <h3 className="text-[13px] font-medium text-foreground mb-3">Bedrooms</h3>
            <div className="flex gap-1.5">
              {BED_OPTIONS.map((b) => (
                <button key={b} onClick={() => onChange({ ...filters, beds: b })} className={`px-3.5 py-1.5 text-[12px] border rounded-md transition-all duration-200 ${filters.beds === b ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground/30"}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <h3 className="text-[13px] font-medium text-foreground mb-3">Bathrooms</h3>
            <div className="flex gap-1.5">
              {BATH_OPTIONS.map((b) => (
                <button key={b} onClick={() => onChange({ ...filters, baths: b })} className={`px-3.5 py-1.5 text-[12px] border rounded-md transition-all duration-200 ${filters.baths === b ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground/30"}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-[13px] font-medium text-foreground mb-3">Amenities</h3>
            <div className="space-y-2.5">
              {AMENITY_SIDEBAR.map((a) => (
                <label key={a} className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" checked={filters.amenities.includes(a)} onChange={() => toggleAmenity(a)} className="w-4 h-4 border-border rounded-sm accent-foreground" />
                  <span className="text-[13px] text-muted-foreground group-hover:text-foreground transition-colors">{a}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-border bg-card p-4 flex gap-3">
          <button onClick={() => onChange(defaultFilters)} className="text-[12px] text-muted-foreground hover:text-foreground transition-colors font-light">Clear all</button>
          <button onClick={onClose} className="flex-1 bg-primary text-primary-foreground text-[12px] tracking-[0.1em] uppercase py-2.5 rounded-md hover:bg-primary/90 transition-all duration-300">
            Show results
          </button>
        </div>
      </aside>
    </>
  );
};

/* ─── Main Search Filter Bar ─── */
interface PropertySearchFiltersProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

const PropertySearchFilters = ({ filters, onChange }: PropertySearchFiltersProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggleType = (t: string) => onChange({ ...filters, types: filters.types.includes(t) ? filters.types.filter(x => x !== t) : [...filters.types, t] });
  const toggleAmenity = (a: string) => onChange({ ...filters, amenities: filters.amenities.includes(a) ? filters.amenities.filter(x => x !== a) : [...filters.amenities, a] });

  const activeChips = buildActiveChips(filters);

  return (
    <>
      {/* Search + filter chips row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="hidden md:flex items-center shrink-0">
          <LocationSearchDropdown
            selected={filters.locations}
            onSelectedChange={(locs) => onChange({ ...filters, locations: locs })}
            className="w-[420px]"
          />
        </div>

        <div className="w-px h-5 bg-border hidden md:block shrink-0" />

        <button
          onClick={() => setFiltersOpen(true)}
          className="flex items-center gap-1.5 bg-foreground text-background text-[12px] px-4 py-1.5 rounded-full hover:bg-foreground/85 transition-all duration-200 shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
        </button>
        <TypeDropdown selected={filters.types} onToggle={toggleType} />
        <PriceDropdown priceMin={filters.priceMin} priceMax={filters.priceMax} hidePOR={filters.hidePriceOnRequest} onMinChange={v => onChange({ ...filters, priceMin: v })} onMaxChange={v => onChange({ ...filters, priceMax: v })} onHidePORChange={v => onChange({ ...filters, hidePriceOnRequest: v })} />
        <BedsDropdown selected={filters.beds} onChange={v => onChange({ ...filters, beds: v })} />
        <AmenitiesDropdown selected={filters.amenities} onToggle={toggleAmenity} />
        <button
          onClick={() => onChange({ ...filters, newBuilds: !filters.newBuilds })}
          className={`text-[12px] px-4 py-1.5 rounded-full transition-all duration-200 shrink-0 border ${filters.newBuilds ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/30"}`}
        >
          New Builds
        </button>
      </div>

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1.5 bg-accent text-foreground text-[12px] font-medium rounded-full pl-3 pr-2 py-1.5 whitespace-nowrap"
            >
              {chip.label}
              <button
                onClick={() => onChange(removeChip(filters, chip))}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={() => onChange(defaultFilters)}
            className="text-[11px] text-muted-foreground hover:text-foreground underline transition-colors ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter Sidebar */}
      <FilterSidebar open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} onChange={onChange} />
    </>
  );
};

export default PropertySearchFilters;
