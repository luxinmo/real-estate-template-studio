import { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronRight, Bed, Bath, Maximize, MapPin, Mail } from "lucide-react";
import heroImg from "@/assets/luxury-hero.jpg";
import LocationSearchDropdown from "./LocationSearchDropdown";
import prop1 from "@/assets/luxury-property-1.jpg";
import prop2 from "@/assets/luxury-property-2.jpg";
import prop3 from "@/assets/luxury-property-3.jpg";
import detail1 from "@/assets/property-detail-1.jpg";
import detail2 from "@/assets/property-detail-2.jpg";
import detail3 from "@/assets/property-detail-3.jpg";

const BRAND_NAME = "PRESTIGE ESTATES";
const NAV_LEFT = ["Home", "Properties", "Rentals"];
const NAV_RIGHT = ["About", "Guides & Blog", "Message Us"];

/* ─── Types ─── */
interface FilterState {
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

const defaultFilters: FilterState = {
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
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-1 border text-[14px] px-4 py-2 rounded-full transition-all duration-200 shrink-0 ${selected.length > 0 ? "border-luxury-black bg-luxury-black text-white" : "border-neutral-200 text-luxury-black/65 hover:border-luxury-black/30"}`}>
        Type {selected.length > 0 && <span className="bg-white text-luxury-black text-[11px] w-4 h-4 rounded-full flex items-center justify-center font-medium">{selected.length}</span>} <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-neutral-200 rounded-sm shadow-lg w-[300px] py-2 z-50">
          {TYPE_OPTIONS.map((t) => (
            <label key={t} className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-neutral-50 transition-colors">
              <input type="checkbox" checked={selected.includes(t)} onChange={() => onToggle(t)} className="w-4 h-4 border-neutral-300 rounded-sm accent-luxury-black" />
              <span className="text-[14px] text-luxury-black/80">{t}</span>
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
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-1 border text-[14px] px-4 py-2 rounded-full transition-all duration-200 ${hasValue ? "border-luxury-black bg-luxury-black text-white" : "border-neutral-200 text-luxury-black/65 hover:border-luxury-black/30"}`}>
        Price {hasValue && "●"} <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-neutral-200 rounded-sm shadow-lg w-[380px] p-5 z-50">
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wider text-luxury-black/40 mb-1.5 block">Min price</label>
              <input type="text" value={priceMin} onChange={(e) => onMinChange(e.target.value)} placeholder="€ No Min" className="w-full border border-neutral-200 px-3 py-2.5 text-[13px] text-luxury-black focus:outline-none focus:border-luxury-black/30" />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {PRICE_PRESETS.slice(0, 3).map(p => (
                  <button key={p.value} onClick={() => onMinChange(p.value)} className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${priceMin === p.value ? "border-luxury-black bg-luxury-black text-white" : "border-neutral-200 text-luxury-black/50 hover:border-luxury-black/30"}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wider text-luxury-black/40 mb-1.5 block">Max price</label>
              <input type="text" value={priceMax} onChange={(e) => onMaxChange(e.target.value)} placeholder="€ No Max" className="w-full border border-neutral-200 px-3 py-2.5 text-[13px] text-luxury-black focus:outline-none focus:border-luxury-black/30" />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {PRICE_PRESETS.slice(2).map(p => (
                  <button key={p.value} onClick={() => onMaxChange(p.value)} className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${priceMax === p.value ? "border-luxury-black bg-luxury-black text-white" : "border-neutral-200 text-luxury-black/50 hover:border-luxury-black/30"}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer mt-2">
            <input type="checkbox" checked={hidePOR} onChange={() => onHidePORChange(!hidePOR)} className="w-4 h-4 border-neutral-300 rounded-sm accent-luxury-black" />
            <span className="text-[13px] text-luxury-black/70">Hide "Price on Request" listings</span>
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
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-1 border text-[14px] px-4 py-2 rounded-full transition-all duration-200 ${selected !== "Any" ? "border-luxury-black bg-luxury-black text-white" : "border-neutral-200 text-luxury-black/65 hover:border-luxury-black/30"}`}>
        Beds {selected !== "Any" && <span className="text-[11px]">{selected}</span>} <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-neutral-200 rounded-sm shadow-lg w-[320px] p-5 z-50">
          <div className="flex gap-1">
            {BED_OPTIONS.map((b) => (
              <button key={b} onClick={() => onChange(b)} className={`flex-1 py-2 text-[13px] border transition-all duration-200 ${selected === b ? "bg-luxury-black text-white border-luxury-black" : "border-neutral-200 text-luxury-black/60 hover:border-luxury-black/30"}`}>
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
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-1 border text-[14px] px-4 py-2 rounded-full transition-all duration-200 ${selected.length > 0 ? "border-luxury-black bg-luxury-black text-white" : "border-neutral-200 text-luxury-black/65 hover:border-luxury-black/30"}`}>
        Amenities {selected.length > 0 && <span className="bg-white text-luxury-black text-[11px] w-4 h-4 rounded-full flex items-center justify-center font-medium">{selected.length}</span>} <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-neutral-200 rounded-sm shadow-lg w-[480px] max-h-[420px] overflow-y-auto p-5 z-50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] text-luxury-black/40 uppercase tracking-wide">Select amenities</span>
            {selected.length > 0 && <button onClick={() => selected.forEach(s => onToggle(s))} className="text-[12px] text-luxury-black/50 hover:text-luxury-black">Clear</button>}
          </div>
          {AMENITY_GROUPS.map((group) => (
            <div key={group.title} className="mb-5 last:mb-0">
              <h4 className="text-[14px] font-medium text-luxury-black mb-3">{group.title}</h4>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => onToggle(item)}
                    className={`flex items-center gap-1.5 border rounded-full px-3.5 py-1.5 text-[12px] transition-all duration-200 ${selected.includes(item) ? "border-luxury-black bg-luxury-black text-white" : "border-neutral-200 text-luxury-black/60 hover:border-luxury-black/40"}`}
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
interface ActiveChip {
  key: string;
  label: string;
  group: string;
}

function buildActiveChips(f: FilterState): ActiveChip[] {
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

function removeChip(f: FilterState, chip: ActiveChip): FilterState {
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
      <div className="fixed inset-0 bg-luxury-black/30 z-40" onClick={onClose} />
      <aside className="fixed top-0 left-0 h-full w-[340px] bg-white z-50 overflow-y-auto border-r border-neutral-200 shadow-lg animate-in slide-in-from-left duration-300">
        <div className="flex items-center justify-between p-5 border-b border-neutral-200">
          <h2 className="text-[15px] font-medium text-luxury-black">Filters</h2>
          <button onClick={onClose} className="text-luxury-black/50 hover:text-luxury-black transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-7">
          {/* Property type with subtypes */}
          <div>
            <h3 className="text-[13px] font-medium text-luxury-black mb-3">Property type</h3>
            <div className="space-y-2.5">
              {TYPE_OPTIONS_WITH_SUBTYPES.map((t) => (
                <div key={t.label}>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2.5">
                      <input type="checkbox" checked={filters.types.includes(t.label)} onChange={() => toggleType(t.label)} className="w-4 h-4 border-neutral-300 rounded-sm accent-luxury-black" />
                      <span className="text-[13px] text-luxury-black/70 group-hover:text-luxury-black transition-colors">{t.label}</span>
                    </div>
                    {t.subtypes && (
                      <span className="text-[11px] text-luxury-black/35 flex items-center gap-1">All subtypes <ChevronDown className="w-3 h-3" /></span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div>
            <h3 className="text-[13px] font-medium text-luxury-black mb-3">Price range</h3>
            <div className="flex gap-3 mb-2">
              <input type="text" value={filters.priceMin} onChange={(e) => onChange({ ...filters, priceMin: e.target.value })} placeholder="€ No Min" className="w-full border border-neutral-200 px-3 py-2 text-[12px] text-luxury-black focus:outline-none focus:border-luxury-black/30" />
              <input type="text" value={filters.priceMax} onChange={(e) => onChange({ ...filters, priceMax: e.target.value })} placeholder="€ No Max" className="w-full border border-neutral-200 px-3 py-2 text-[12px] text-luxury-black focus:outline-none focus:border-luxury-black/30" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRICE_PRESETS.map(p => (
                <button key={p.value} onClick={() => onChange({ ...filters, priceMin: filters.priceMin === p.value ? "" : p.value })} className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${filters.priceMin === p.value ? "border-luxury-black bg-luxury-black text-white" : "border-neutral-200 text-luxury-black/50 hover:border-luxury-black/30"}`}>
                  {p.label}+
                </button>
              ))}
            </div>
          </div>

          {/* Living area */}
          <div>
            <h3 className="text-[13px] font-medium text-luxury-black mb-3">Living area</h3>
            <div className="flex gap-3">
              <input type="text" value={filters.areaMin} onChange={(e) => onChange({ ...filters, areaMin: e.target.value })} placeholder="No Min" className="w-full border border-neutral-200 px-3 py-2 text-[12px] text-luxury-black focus:outline-none focus:border-luxury-black/30" />
              <input type="text" value={filters.areaMax} onChange={(e) => onChange({ ...filters, areaMax: e.target.value })} placeholder="No Max" className="w-full border border-neutral-200 px-3 py-2 text-[12px] text-luxury-black focus:outline-none focus:border-luxury-black/30" />
            </div>
            <span className="text-[10px] text-luxury-black/35 mt-1 block">m²</span>
          </div>

          {/* Bedrooms */}
          <div>
            <h3 className="text-[13px] font-medium text-luxury-black mb-3">Bedrooms</h3>
            <div className="flex gap-1.5">
              {BED_OPTIONS.map((b) => (
                <button key={b} onClick={() => onChange({ ...filters, beds: b })} className={`px-3.5 py-1.5 text-[12px] border transition-all duration-200 ${filters.beds === b ? "bg-luxury-black text-white border-luxury-black" : "border-neutral-200 text-luxury-black/60 hover:border-luxury-black/30"}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <h3 className="text-[13px] font-medium text-luxury-black mb-3">Bathrooms</h3>
            <div className="flex gap-1.5">
              {BATH_OPTIONS.map((b) => (
                <button key={b} onClick={() => onChange({ ...filters, baths: b })} className={`px-3.5 py-1.5 text-[12px] border transition-all duration-200 ${filters.baths === b ? "bg-luxury-black text-white border-luxury-black" : "border-neutral-200 text-luxury-black/60 hover:border-luxury-black/30"}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-[13px] font-medium text-luxury-black mb-3">Amenities</h3>
            <div className="space-y-2.5">
              {AMENITY_SIDEBAR.map((a) => (
                <label key={a} className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" checked={filters.amenities.includes(a)} onChange={() => toggleAmenity(a)} className="w-4 h-4 border-neutral-300 rounded-sm accent-luxury-black" />
                  <span className="text-[13px] text-luxury-black/70 group-hover:text-luxury-black transition-colors">{a}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-neutral-200 bg-white p-4 flex gap-3">
          <button onClick={() => onChange(defaultFilters)} className="text-[12px] text-luxury-black/50 hover:text-luxury-black transition-colors font-light">Clear all</button>
          <button onClick={onClose} className="flex-1 bg-luxury-black text-white text-[12px] tracking-[0.1em] uppercase py-2.5 hover:bg-luxury-black/85 transition-all duration-300">
            Show results
          </button>
        </div>
      </aside>
    </>
  );
};

/* ─── Properties Data ─── */
const PROPERTIES = [
  {
    id: 1, image: heroImg, gallery: [heroImg, detail1, detail2],
    tag: "FOR SALE", style: "Contemporary", location: "Santa Eulalia del Río · Ibiza",
    title: "STUNNING CONTEMPORARY VILLA WITH PANORAMIC SEA VIEWS",
    excerpt: "This exceptional contemporary villa is set on an elevated plot offering uninterrupted panoramic views of the Mediterranean Sea and the island of Formentera...",
    beds: 5, baths: 4, sqm: 420, plot: 1200, price: "€4,650,000",
    features: ["Sea Views", "Infinity Pool", "Smart Home", "Garage"],
  },
  {
    id: 2, image: prop1, gallery: [prop1, detail3, heroImg],
    tag: "FOR SALE", style: "Luxury", location: "Marina Botafoch · Ibiza",
    title: "LUXURY PENTHOUSE WITH ROOFTOP TERRACE AND HARBOUR VIEWS",
    excerpt: "Exceptional penthouse located in the prestigious Marina Botafoch area, offering stunning views over Dalt Vila and the harbour. Features include a private rooftop terrace...",
    beds: 3, baths: 3, sqm: 210, plot: null as number | null, price: "€3,100,000",
    features: ["Terrace", "Harbour Views", "Modern", "Elevator"],
  },
  {
    id: 3, image: prop2, gallery: [prop2, detail1, detail2],
    tag: "FOR SALE", style: "Traditional", location: "San José · Ibiza",
    title: "TRADITIONAL FINCA WITH MODERN RENOVATION AND PRIVATE POOL",
    excerpt: "A beautifully restored traditional Ibicencan finca set within 15,000 m² of private land with olive and almond trees. The property combines authentic character with contemporary luxury...",
    beds: 6, baths: 5, sqm: 480, plot: 15000, price: "€5,800,000",
    features: ["Pool", "Garden", "Guest House", "Parking"],
  },
  {
    id: 4, image: prop3, gallery: [prop3, detail3, heroImg],
    tag: "FOR SALE", style: "Modern", location: "Altea · Costa Blanca",
    title: "MODERN VILLA WITH INFINITY POOL OVERLOOKING THE MEDITERRANEAN",
    excerpt: "Architecturally striking villa perched on the hillside of Altea with sweeping views of the Mediterranean coastline. Floor-to-ceiling windows flood the interiors with natural light...",
    beds: 4, baths: 4, sqm: 350, plot: 800, price: "€2,950,000",
    features: ["Infinity Pool", "Sea Views", "Home Cinema", "Wine Cellar"],
  },
  {
    id: 5, image: detail1, gallery: [detail1, prop1, prop2],
    tag: "NEW BUILD", style: "Modern", location: "Sant Antoni de Portmany · Ibiza",
    title: "MODERN IBIZA-STYLE FLAT WITH LARGE TERRACE",
    excerpt: "Modern Ibiza-style flat for sale in Sant Antoni de Portmany, offering a built area of approximately 70 m² and 54 m² of usable interior space. The property features a large terrace...",
    beds: 1, baths: 1, sqm: 70, plot: null as number | null, price: "€530,000",
    features: ["Terrace", "Modern", "Community Pool", "Parking"],
  },
  {
    id: 6, image: detail2, gallery: [detail2, prop3, heroImg],
    tag: "FOR SALE", style: "Classic", location: "Jávea · Costa Blanca",
    title: "FRONTLINE GOLF ESTATE WITH MOUNTAIN AND SEA VIEWS",
    excerpt: "Impressive estate located on the frontline of a prestigious golf course in Jávea, offering dual views of the Montgó mountain and the Mediterranean Sea...",
    beds: 5, baths: 5, sqm: 520, plot: 2500, price: "€3,750,000",
    features: ["Golf Views", "Pool", "Gym", "Staff Quarters"],
  },
];

/* ─── Property Card (horizontal) ─── */
const PropertyCard = ({ property }: { property: typeof PROPERTIES[0] }) => {
  return (
    <a href={`/property/${property.id}`} className="group grid grid-cols-1 md:grid-cols-12 gap-0 bg-neutral-50 border border-neutral-200 rounded-sm overflow-hidden mb-6 hover:shadow-md transition-shadow duration-300">
      {/* Image */}
      <div className="md:col-span-5 relative overflow-hidden aspect-[16/10] md:aspect-auto md:h-full min-h-[220px]">
        <img src={property.image} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 absolute inset-0" />
        {property.tag === "NEW BUILD" && (
          <span className="absolute top-3 left-3 bg-luxury-black/60 backdrop-blur-sm text-white text-[10px] tracking-[0.12em] uppercase font-medium px-2.5 py-1">
            New Build
          </span>
        )}
        {property.gallery.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-luxury-black/60 text-white text-[10px] px-2 py-1 font-light">
            1/{property.gallery.length}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="md:col-span-7 flex flex-col justify-between p-5 md:p-6 lg:p-8">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] tracking-[0.18em] uppercase border border-luxury-black/20 text-luxury-black/60 px-2.5 py-1 font-medium">{property.tag}</span>
              <span className="text-[11px] text-luxury-black/45 font-light italic">{property.style}</span>
            </div>
            <button onClick={(e) => { e.preventDefault(); }} className="text-luxury-black/30 hover:text-luxury-black transition-colors">
              <Mail className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] tracking-[0.15em] uppercase text-luxury-black/50 mb-1.5">{property.location}</p>
          <h2 className="text-[16px] md:text-[18px] font-medium text-luxury-black leading-snug mb-3 group-hover:text-luxury-black/75 transition-colors duration-300">
            {property.title}
          </h2>
          <p className="text-[13px] text-luxury-black/55 font-light leading-relaxed mb-4 line-clamp-2">
            {property.excerpt}
          </p>

          {/* Specs */}
          <div className="flex items-center gap-6 mb-4">
            <div className="text-center">
              <p className="text-[10px] tracking-[0.1em] uppercase text-luxury-black/40 mb-0.5">Beds</p>
              <p className="text-[15px] text-luxury-black font-light">{property.beds}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] tracking-[0.1em] uppercase text-luxury-black/40 mb-0.5">Baths</p>
              <p className="text-[15px] text-luxury-black font-light">{property.baths}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] tracking-[0.1em] uppercase text-luxury-black/40 mb-0.5">Built</p>
              <p className="text-[15px] text-luxury-black font-light">{property.sqm} m²</p>
            </div>
            {property.plot && (
              <div className="text-center">
                <p className="text-[10px] tracking-[0.1em] uppercase text-luxury-black/40 mb-0.5">Plot</p>
                <p className="text-[15px] text-luxury-black font-light">{property.plot.toLocaleString()} m²</p>
              </div>
            )}
          </div>

          {/* Feature tags */}
          <div className="flex flex-wrap gap-2">
            {property.features.map((f, i) => (
              <span key={i} className="text-[11px] text-luxury-black/50 font-light flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-luxury-black/20" />
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="mt-5 pt-4 border-t border-neutral-100">
          <p className="text-xl md:text-2xl font-light text-luxury-black font-serif tracking-tight">{property.price}</p>
        </div>
      </div>
    </a>
  );
};

/* ═══════════════════════════════════════════════════════════ */

const LuxuryPropertyListing = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const toggleType = (t: string) => setFilters(f => ({ ...f, types: f.types.includes(t) ? f.types.filter(x => x !== t) : [...f.types, t] }));
  const toggleAmenity = (a: string) => setFilters(f => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a] }));

  const activeChips = buildActiveChips(filters);

  return (
    <div className="flex-1 overflow-auto bg-white text-luxury-black font-sans">

      {/* ─── NAVBAR ─── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-[1400px] mx-auto grid grid-cols-3 items-center px-6 lg:px-10 h-[68px]">
          <div className="hidden lg:flex items-center gap-8">
            <button className="text-luxury-black/50 hover:text-luxury-black transition-colors duration-300">
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
            </button>
            {NAV_LEFT.map((l) => (
              <a key={l} href={l === "Home" ? "/" : l === "Properties" ? "/properties" : "#"} className="text-[11px] tracking-[0.18em] uppercase font-normal text-luxury-black/60 hover:text-luxury-black transition-colors duration-300">{l}</a>
            ))}
          </div>
          <div className="lg:hidden" />

          <a href="/" className="flex flex-col items-center justify-center">
            <span className="font-serif text-lg md:text-xl tracking-[0.3em] font-light text-luxury-black">{BRAND_NAME}</span>
            <span className="text-[7px] tracking-[0.35em] uppercase font-light text-luxury-black/40">Real Estate</span>
          </a>

          <div className="flex items-center justify-end gap-8">
            <div className="hidden lg:flex items-center gap-8">
              {NAV_RIGHT.map((l) => (
                <a key={l} href="#" className="text-[11px] tracking-[0.18em] uppercase font-normal text-luxury-black/60 hover:text-luxury-black transition-colors duration-300">{l}</a>
              ))}
            </div>
            <button className="lg:hidden text-luxury-black/70">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ─── BREADCRUMBS + SEARCH BAR ─── */}
      <div className="sticky top-[68px] z-40 bg-white border-b border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 pt-3 pb-2 text-[13px] text-luxury-black/45 font-light">
            <a href="/" className="hover:text-luxury-black transition-colors">Home</a>
            <ChevronRight className="w-3 h-3" />
            <a href="/properties" className="hover:text-luxury-black transition-colors">Properties</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-luxury-black/70">Ibiza & Costa Blanca</span>
          </div>

          {/* Search + filter chips row */}
          <div className="flex items-center gap-3 pb-3">
            <div className="hidden md:flex items-center shrink-0">
              <LocationSearchDropdown
                selected={filters.locations}
                onSelectedChange={(locs) => setFilters(f => ({ ...f, locations: locs }))}
                className="w-[420px]"
              />
            </div>

            <div className="w-px h-5 bg-neutral-200 hidden md:block shrink-0" />

            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-1.5 bg-luxury-black text-white text-[14px] px-4 py-2 rounded-full hover:bg-luxury-black/85 transition-all duration-200 shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </button>
            <TypeDropdown selected={filters.types} onToggle={toggleType} />
            <PriceDropdown priceMin={filters.priceMin} priceMax={filters.priceMax} hidePOR={filters.hidePriceOnRequest} onMinChange={v => setFilters(f => ({ ...f, priceMin: v }))} onMaxChange={v => setFilters(f => ({ ...f, priceMax: v }))} onHidePORChange={v => setFilters(f => ({ ...f, hidePriceOnRequest: v }))} />
            <BedsDropdown selected={filters.beds} onChange={v => setFilters(f => ({ ...f, beds: v }))} />
            <AmenitiesDropdown selected={filters.amenities} onToggle={toggleAmenity} />
            <button
              onClick={() => setFilters(f => ({ ...f, newBuilds: !f.newBuilds }))}
              className={`text-[14px] px-4 py-2 rounded-full transition-all duration-200 shrink-0 border ${filters.newBuilds ? "border-luxury-black bg-luxury-black text-white" : "border-neutral-200 text-luxury-black/65 hover:border-luxury-black/30"}`}
            >
              New Builds
            </button>
          </div>
        </div>
      </div>

      {/* ─── FILTER SIDEBAR ─── */}
      <FilterSidebar open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} onChange={setFilters} />

      {/* ─── RESULTS ─── */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {activeChips.map((chip) => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1.5 bg-neutral-100 text-luxury-black text-[12px] font-medium rounded-full pl-3 pr-2 py-1.5 whitespace-nowrap"
              >
                {chip.label}
                <button
                  onClick={() => setFilters(f => removeChip(f, chip))}
                  className="text-luxury-black/40 hover:text-luxury-black/70 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={() => setFilters(defaultFilters)}
              className="text-[11px] text-luxury-black/40 hover:text-luxury-black/70 underline transition-colors ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-light text-luxury-black font-serif tracking-tight">Luxury Homes in Ibiza & Costa Blanca</h1>
            <p className="text-[13px] text-luxury-black/55 font-light mt-2 max-w-3xl leading-relaxed">
              Discover the finest selection of luxury villas, penthouses, fincas and new-build properties across Ibiza and the Costa Blanca. From beachfront estates with panoramic sea views to exclusive golf-side residences, explore hand-picked homes curated for the most discerning buyers.
            </p>
            <p className="text-[12px] text-luxury-black/45 font-light mt-2">{PROPERTIES.length} properties found</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-luxury-black/45 font-light">Sort:</span>
            <button className="text-[12px] text-luxury-black font-medium flex items-center gap-1">
              Premium <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Property list */}
        <div>
          {PROPERTIES.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>

        {/* ─── PAGINATION ─── */}
        <div className="mt-10 flex flex-col items-center gap-5">
          <button className="border border-neutral-300 text-luxury-black/70 text-[13px] px-16 py-3 rounded-full hover:bg-luxury-black hover:text-white transition-all duration-300">
            Next
          </button>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((n) => (
              <button key={n} className={`w-8 h-8 text-[13px] rounded-full transition-all duration-200 ${n === 1 ? "border border-luxury-black text-luxury-black font-medium" : "text-luxury-black/50 hover:text-luxury-black"}`}>
                {n}
              </button>
            ))}
            <span className="text-luxury-black/30 px-1">…</span>
            <button className="w-8 h-8 text-[13px] text-luxury-black/50 hover:text-luxury-black rounded-full">50</button>
            <button className="w-8 h-8 text-luxury-black/40 hover:text-luxury-black flex items-center justify-center">
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>
          <p className="text-[12px] text-luxury-black/40 font-light">1–6 of {PROPERTIES.length} homes for sale</p>
        </div>
      </main>

      {/* ─── POPULAR LOCATIONS ─── */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 border-t border-neutral-100">
        <h2 className="text-xl font-light text-luxury-black font-serif tracking-tight mb-6">Explore Popular Locations</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-3">
          {[
            "Ibiza Town", "Santa Eulalia", "San José", "Es Cubells",
            "Cala Jondal", "Talamanca", "Marina Botafoch", "San Antonio",
            "Jávea", "Altea", "Moraira", "Calpe",
            "Dénia", "Benidorm", "Alicante", "Torrevieja",
            "Orihuela Costa", "Villajoyosa",
          ].map((loc) => (
            <a key={loc} href="#" className="text-[13px] text-luxury-black/60 hover:text-luxury-black font-light transition-colors duration-200">
              {loc}
            </a>
          ))}
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="border-t border-neutral-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-xl md:text-2xl font-light text-luxury-black font-serif tracking-tight">Get Luxury Trends & Tips</h2>
              <p className="text-[13px] text-luxury-black/55 font-light mt-2 leading-relaxed">
                Receive our top luxury picks and tips from our experts delivered to your inbox each week.
              </p>
            </div>
            <div>
              <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Your email address" className="w-full border border-neutral-300 px-4 py-3 text-[13px] text-luxury-black placeholder:text-luxury-black/30 focus:outline-none focus:border-luxury-black/40 transition-colors" />
                <button type="submit" className="bg-luxury-black text-white text-[12px] tracking-[0.1em] uppercase py-3 w-full hover:bg-luxury-black/85 transition-all duration-300">
                  Subscribe to Newsletter
                </button>
              </form>
              <p className="text-[10px] text-luxury-black/35 mt-2 font-light uppercase tracking-wide">
                By sharing your email, you agree to our <a href="#" className="underline">Terms of Use</a> and <a href="#" className="underline">Privacy</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-luxury-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm tracking-[0.25em] text-white/40 font-light font-serif">{BRAND_NAME}</span>
            <p className="text-[10px] text-white/20 tracking-wider font-light">© 2025 {BRAND_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LuxuryPropertyListing;
