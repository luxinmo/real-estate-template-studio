import { useState, useRef, useEffect, useMemo } from "react";
import {
  Search, SlidersHorizontal, X, ChevronDown, ChevronRight, ChevronLeft,
  Bed, Bath, Maximize, MapPin, Mail, Heart, Play, Camera, Eye,
  Check, Grid3X3, List, ArrowRight, RotateCcw,
} from "lucide-react";
import heroImg from "@/assets/luxury-hero.jpg";
import LocationSearchDropdown from "./LocationSearchDropdown";
import prop1 from "@/assets/luxury-property-1.jpg";
import prop2 from "@/assets/luxury-property-2.jpg";
import prop3 from "@/assets/luxury-property-3.jpg";
import detail1 from "@/assets/property-detail-1.jpg";
import detail2 from "@/assets/property-detail-2.jpg";
import detail3 from "@/assets/property-detail-3.jpg";

/* ═══════════ DESIGN SYSTEM ═══════════ */
const C = {
  bg: "#FAFAF8",
  surface: "#FFFFFF",
  surfaceHover: "#F8F7F5",
  text: "#1A1A1A",
  textSecondary: "#5C5C5C",
  textTertiary: "#8A8A8A",
  accent: "#96794A",
  accentHover: "#7D6339",
  border: "#E8E6E3",
  borderLight: "#F0EEEB",
  dark: "#1A1A1A",
  darkMuted: "#2D2D2D",
  overlay: "rgba(26,26,26,0.55)",
  gold: "#B8965A",
};

const F = "'Jost', 'Helvetica Neue', Helvetica, sans-serif";
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
const TYPES_PILL = ["All", ...TYPE_OPTIONS];

const BED_OPTIONS = ["Any", "1+", "2+", "3+", "4+", "5+"];
const BATH_OPTIONS = ["Any", "1+", "2+", "3+", "4+"];
const REGIONS = ["All Regions", "Ibiza", "Costa Blanca"];

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

const SORTS = [
  { v: "price-desc", l: "Price ↓" },
  { v: "price-asc", l: "Price ↑" },
  { v: "beds-desc", l: "Bedrooms ↓" },
  { v: "sqm-desc", l: "Size ↓" },
];

/* ─── Hooks ─── */
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

function useSticky(ref: React.RefObject<HTMLElement | null>, threshold = 60) {
  const [s, set] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const h = () => set(el.scrollTop > threshold);
    el.addEventListener("scroll", h, { passive: true });
    return () => el.removeEventListener("scroll", h);
  }, [ref, threshold]);
  return s;
}

/* ─── Small Components ─── */
const StatusDot = ({ status }: { status: string }) => {
  const colors: Record<string, string> = { "FOR SALE": "#22C55E", "UNDER OFFER": "#F59E0B", "SOLD": "#EF4444", "NEW BUILD": "#3B82F6" };
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: colors[status] || C.textTertiary }} />
      <span className="text-[11px] tracking-[0.06em] font-normal" style={{ color: C.textSecondary }}>{status}</span>
    </span>
  );
};

const Pill = ({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="text-[13px] tracking-[0.04em] px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap font-light"
    style={{
      background: active ? C.dark : "transparent",
      color: active ? "#fff" : C.textSecondary,
      border: `1px solid ${active ? C.dark : C.border}`,
    }}
  >
    {children}
  </button>
);

const Dropdown = ({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) => {
  const { open, setOpen, ref } = useDropdown();
  const isActive = value !== options[0];
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[13px] tracking-[0.04em] font-light px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap"
        style={{
          background: isActive ? C.dark : "transparent",
          color: isActive ? "#fff" : C.textSecondary,
          border: `1px solid ${isActive ? C.dark : C.border}`,
        }}
      >
        {value === options[0] ? label : value}
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-2 py-2 min-w-[200px] z-50 rounded-xl shadow-xl animate-in fade-in-0 slide-in-from-top-1 duration-200"
          style={{ background: C.surface, border: `1px solid ${C.borderLight}` }}
        >
          {options.map((o) => (
            <button
              key={o}
              onClick={() => { onChange(o); setOpen(false); }}
              className="flex items-center justify-between w-full px-4 py-2.5 text-[13px] font-light transition-colors hover:bg-[#F8F7F5]"
              style={{ color: value === o ? C.accent : C.textSecondary }}
            >
              {o}
              {value === o && <Check className="w-3.5 h-3.5" />}
            </button>
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
interface ActiveChip { key: string; label: string; group: string }

function buildActiveChips(f: FilterState): ActiveChip[] {
  const chips: ActiveChip[] = [];
  f.locations.forEach(l => chips.push({ key: `loc-${l.id}`, label: l.name, group: "location" }));
  f.types.forEach(t => chips.push({ key: `type-${t}`, label: t, group: "type" }));
  if (f.priceMin && f.priceMax) chips.push({ key: "price-range", label: `${formatPrice(f.priceMin)} – ${formatPrice(f.priceMax)}`, group: "price" });
  else if (f.priceMin) chips.push({ key: "price-min", label: `From ${formatPrice(f.priceMin)}`, group: "price" });
  else if (f.priceMax) chips.push({ key: "price-max", label: `Up to ${formatPrice(f.priceMax)}`, group: "price" });
  if (f.areaMin || f.areaMax) {
    const minL = f.areaMin ? `${f.areaMin} m²` : "";
    const maxL = f.areaMax ? `${f.areaMax} m²` : "";
    chips.push({ key: "area", label: minL && maxL ? `${minL} – ${maxL}` : minL ? `From ${minL}` : `Up to ${maxL}`, group: "area" });
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
      <div className="fixed inset-0 z-40" style={{ background: "rgba(26,26,26,0.3)" }} onClick={onClose} />
      <aside className="fixed top-0 left-0 h-full w-[340px] z-50 overflow-y-auto shadow-lg animate-in slide-in-from-left duration-300" style={{ background: C.surface, borderRight: `1px solid ${C.borderLight}` }}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: `1px solid ${C.borderLight}` }}>
          <h2 className="text-[15px] font-medium" style={{ fontFamily: F, color: C.text }}>Filters</h2>
          <button onClick={onClose} className="transition-colors hover:opacity-70" style={{ color: C.textTertiary }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-7">
          {/* Property type */}
          <div>
            <h3 className="text-[13px] font-medium mb-3" style={{ fontFamily: F, color: C.text }}>Property type</h3>
            <div className="space-y-2.5">
              {TYPE_OPTIONS_WITH_SUBTYPES.map((t) => (
                <div key={t.label}>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2.5">
                      <input type="checkbox" checked={filters.types.includes(t.label)} onChange={() => toggleType(t.label)} className="w-4 h-4 rounded-sm accent-[#1A1A1A]" style={{ borderColor: C.border }} />
                      <span className="text-[13px] font-light group-hover:opacity-80 transition-colors" style={{ color: C.textSecondary }}>{t.label}</span>
                    </div>
                    {t.subtypes && (
                      <span className="text-[11px] flex items-center gap-1" style={{ color: C.textTertiary }}>All subtypes <ChevronDown className="w-3 h-3" /></span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div>
            <h3 className="text-[13px] font-medium mb-3" style={{ fontFamily: F, color: C.text }}>Price range</h3>
            <div className="flex gap-3 mb-2">
              <input type="text" value={filters.priceMin} onChange={(e) => onChange({ ...filters, priceMin: e.target.value })} placeholder="€ No Min"
                className="w-full px-3 py-2 text-[12px] font-light focus:outline-none transition-colors" style={{ border: `1px solid ${C.border}`, color: C.text, fontFamily: F }} />
              <input type="text" value={filters.priceMax} onChange={(e) => onChange({ ...filters, priceMax: e.target.value })} placeholder="€ No Max"
                className="w-full px-3 py-2 text-[12px] font-light focus:outline-none transition-colors" style={{ border: `1px solid ${C.border}`, color: C.text, fontFamily: F }} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRICE_PRESETS.map(p => (
                <button key={p.value} onClick={() => onChange({ ...filters, priceMin: filters.priceMin === p.value ? "" : p.value })}
                  className="text-[10px] px-2 py-0.5 rounded-full transition-colors"
                  style={{
                    border: `1px solid ${filters.priceMin === p.value ? C.dark : C.border}`,
                    background: filters.priceMin === p.value ? C.dark : "transparent",
                    color: filters.priceMin === p.value ? "#fff" : C.textTertiary,
                  }}>
                  {p.label}+
                </button>
              ))}
            </div>
          </div>

          {/* Living area */}
          <div>
            <h3 className="text-[13px] font-medium mb-3" style={{ fontFamily: F, color: C.text }}>Living area</h3>
            <div className="flex gap-3">
              <input type="text" value={filters.areaMin} onChange={(e) => onChange({ ...filters, areaMin: e.target.value })} placeholder="No Min"
                className="w-full px-3 py-2 text-[12px] font-light focus:outline-none" style={{ border: `1px solid ${C.border}`, color: C.text, fontFamily: F }} />
              <input type="text" value={filters.areaMax} onChange={(e) => onChange({ ...filters, areaMax: e.target.value })} placeholder="No Max"
                className="w-full px-3 py-2 text-[12px] font-light focus:outline-none" style={{ border: `1px solid ${C.border}`, color: C.text, fontFamily: F }} />
            </div>
            <span className="text-[10px] mt-1 block" style={{ color: C.textTertiary }}>m²</span>
          </div>

          {/* Bedrooms */}
          <div>
            <h3 className="text-[13px] font-medium mb-3" style={{ fontFamily: F, color: C.text }}>Bedrooms</h3>
            <div className="flex gap-1.5">
              {BED_OPTIONS.map((b) => (
                <button key={b} onClick={() => onChange({ ...filters, beds: b })}
                  className="px-3.5 py-1.5 text-[12px] font-light transition-all duration-200"
                  style={{
                    border: `1px solid ${filters.beds === b ? C.dark : C.border}`,
                    background: filters.beds === b ? C.dark : "transparent",
                    color: filters.beds === b ? "#fff" : C.textSecondary,
                  }}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <h3 className="text-[13px] font-medium mb-3" style={{ fontFamily: F, color: C.text }}>Bathrooms</h3>
            <div className="flex gap-1.5">
              {BATH_OPTIONS.map((b) => (
                <button key={b} onClick={() => onChange({ ...filters, baths: b })}
                  className="px-3.5 py-1.5 text-[12px] font-light transition-all duration-200"
                  style={{
                    border: `1px solid ${filters.baths === b ? C.dark : C.border}`,
                    background: filters.baths === b ? C.dark : "transparent",
                    color: filters.baths === b ? "#fff" : C.textSecondary,
                  }}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-[13px] font-medium mb-3" style={{ fontFamily: F, color: C.text }}>Amenities</h3>
            {AMENITY_GROUPS.map((group) => (
              <div key={group.title} className="mb-4 last:mb-0">
                <h4 className="text-[12px] font-medium mb-2" style={{ color: C.text }}>{group.title}</h4>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <button key={item} onClick={() => toggleAmenity(item)}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-light transition-all duration-200"
                      style={{
                        border: `1px solid ${filters.amenities.includes(item) ? C.dark : C.border}`,
                        background: filters.amenities.includes(item) ? C.dark : "transparent",
                        color: filters.amenities.includes(item) ? "#fff" : C.textSecondary,
                      }}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 flex gap-3" style={{ borderTop: `1px solid ${C.borderLight}`, background: C.surface }}>
          <button onClick={() => onChange(defaultFilters)} className="text-[12px] font-light transition-colors hover:opacity-70" style={{ color: C.textTertiary }}>Clear all</button>
          <button onClick={onClose} className="flex-1 text-[12px] tracking-[0.1em] uppercase py-2.5 transition-all duration-300 rounded-lg hover:opacity-90" style={{ background: C.dark, color: "#fff" }}>
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
    tag: "FOR SALE", style: "Contemporary", location: "Santa Eulalia del Río · Ibiza", region: "Ibiza",
    title: "Stunning Contemporary Villa with Panoramic Sea Views",
    excerpt: "This exceptional contemporary villa is set on an elevated plot offering uninterrupted panoramic views of the Mediterranean Sea and the island of Formentera...",
    beds: 5, baths: 4, sqm: 420, plot: 1200, price: "€4,650,000", priceNum: 4650000,
    ref: "PRE-1001", photos: 48, hasVideo: true, has360: false, isNew: false,
  },
  {
    id: 2, image: prop1, gallery: [prop1, detail3, heroImg],
    tag: "FOR SALE", style: "Luxury", location: "Marina Botafoch · Ibiza", region: "Ibiza",
    title: "Luxury Penthouse with Rooftop Terrace and Harbour Views",
    excerpt: "Exceptional penthouse located in the prestigious Marina Botafoch area, offering stunning views over Dalt Vila and the harbour...",
    beds: 3, baths: 3, sqm: 210, plot: null as number | null, price: "€3,100,000", priceNum: 3100000,
    ref: "PRE-2010", photos: 32, hasVideo: false, has360: true, isNew: false,
  },
  {
    id: 3, image: prop2, gallery: [prop2, detail1, detail2],
    tag: "FOR SALE", style: "Traditional", location: "San José · Ibiza", region: "Ibiza",
    title: "Traditional Finca with Modern Renovation and Private Pool",
    excerpt: "A beautifully restored traditional Ibicencan finca set within 15,000 m² of private land with olive and almond trees...",
    beds: 6, baths: 5, sqm: 480, plot: 15000, price: "€5,800,000", priceNum: 5800000,
    ref: "PRE-3020", photos: 56, hasVideo: false, has360: false, isNew: false,
  },
  {
    id: 4, image: prop3, gallery: [prop3, detail3, heroImg],
    tag: "FOR SALE", style: "Modern", location: "Altea · Costa Blanca", region: "Costa Blanca",
    title: "Modern Villa with Infinity Pool Overlooking the Mediterranean",
    excerpt: "Architecturally striking villa perched on the hillside of Altea with sweeping views of the Mediterranean coastline...",
    beds: 4, baths: 4, sqm: 350, plot: 800, price: "€2,950,000", priceNum: 2950000,
    ref: "PRE-4100", photos: 38, hasVideo: true, has360: true, isNew: false,
  },
  {
    id: 5, image: detail1, gallery: [detail1, prop1, prop2],
    tag: "NEW BUILD", style: "Modern", location: "Sant Antoni de Portmany · Ibiza", region: "Ibiza",
    title: "Modern Ibiza-Style Flat with Large Terrace",
    excerpt: "Modern Ibiza-style flat for sale in Sant Antoni de Portmany, offering a built area of approximately 70 m² and 54 m² of usable interior space...",
    beds: 1, baths: 1, sqm: 70, plot: null as number | null, price: "€530,000", priceNum: 530000,
    ref: "PRE-5200", photos: 18, hasVideo: false, has360: false, isNew: true,
  },
  {
    id: 6, image: detail2, gallery: [detail2, prop3, heroImg],
    tag: "FOR SALE", style: "Classic", location: "Jávea · Costa Blanca", region: "Costa Blanca",
    title: "Frontline Golf Estate with Mountain and Sea Views",
    excerpt: "Impressive estate located on the frontline of a prestigious golf course in Jávea, offering dual views of the Montgó mountain and the Mediterranean Sea...",
    beds: 5, baths: 5, sqm: 520, plot: 2500, price: "€3,750,000", priceNum: 3750000,
    ref: "PRE-6300", photos: 44, hasVideo: false, has360: false, isNew: false,
  },
];

/* ═══════════ PROPERTY CARD — LIST ═══════════ */
const PropertyCardList = ({ p, fav, onFav }: { p: typeof PROPERTIES[0]; fav: boolean; onFav: () => void }) => (
  <a
    href={`/property/${p.id}`}
    className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl block"
    style={{ background: C.surface, border: `1px solid ${C.borderLight}` }}
  >
    <div className="flex flex-col md:flex-row">
      {/* Image */}
      <div className="w-full md:w-[400px] lg:w-[460px] shrink-0 relative overflow-hidden aspect-[16/11] md:aspect-auto md:min-h-[320px]">
        <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]" />

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 p-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            {p.isNew && (
              <span className="text-[10px] tracking-[0.18em] uppercase font-medium px-3 py-1 rounded-full text-white" style={{ background: C.accent }}>New</span>
            )}
            {p.tag === "NEW BUILD" && !p.isNew && (
              <span className="text-[10px] tracking-[0.18em] uppercase font-medium px-3 py-1 rounded-full text-white backdrop-blur-md" style={{ background: "rgba(26,26,26,0.5)" }}>New Build</span>
            )}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFav(); }}
            className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110"
            style={{ background: "rgba(255,255,255,0.9)" }}
          >
            <Heart className={`w-4 h-4 transition-colors ${fav ? "fill-red-500 text-red-500" : ""}`} style={{ color: fav ? undefined : C.textTertiary }} />
          </button>
        </div>

        {/* Bottom media strip */}
        <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-[11px] font-normal text-white px-2.5 py-1 rounded-full backdrop-blur-md" style={{ background: "rgba(26,26,26,0.5)" }}>
              <Camera className="w-3 h-3" /> {p.photos}
            </span>
            {p.hasVideo && (
              <span className="flex items-center gap-1 text-[11px] text-white px-2.5 py-1 rounded-full backdrop-blur-md" style={{ background: "rgba(26,26,26,0.5)" }}>
                <Play className="w-3 h-3 fill-white" />
              </span>
            )}
            {p.has360 && (
              <span className="flex items-center gap-1 text-[11px] text-white px-2.5 py-1 rounded-full backdrop-blur-md" style={{ background: "rgba(26,26,26,0.5)" }}>
                <Eye className="w-3 h-3" />
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-[0.12em] uppercase font-normal text-white/80 px-2.5 py-1 rounded-full backdrop-blur-md" style={{ background: "rgba(26,26,26,0.5)" }}>
            {p.ref}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 p-6 lg:p-8 flex flex-col">
        {/* Meta line */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <StatusDot status={p.tag} />
            {p.style && (
              <span className="text-[11px] tracking-[0.02em] italic font-light hidden lg:inline" style={{ color: C.textTertiary }}>{p.style}</span>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <MapPin className="w-3.5 h-3.5" style={{ color: C.accent }} />
          <span className="text-[12px] tracking-[0.06em] uppercase font-normal" style={{ color: C.textSecondary }}>{p.location}</span>
        </div>

        {/* Title */}
        <h2
          className="text-[22px] sm:text-[26px] font-light tracking-[0.02em] mb-3 transition-colors duration-500"
          style={{ fontFamily: F, color: C.text, lineHeight: 1.25 }}
        >
          {p.title}
        </h2>

        {/* Excerpt */}
        <p className="text-[14px] leading-[1.75] font-light line-clamp-2 mb-auto hidden sm:block" style={{ color: C.textSecondary }}>
          {p.excerpt}
        </p>

        {/* Specs strip */}
        <div className="flex items-center gap-0 mt-5 mb-5 rounded-xl overflow-hidden" style={{ border: `1px solid ${C.borderLight}` }}>
          {[
            { label: "Beds", value: p.beds },
            { label: "Baths", value: p.baths },
            { label: "Built", value: `${p.sqm.toLocaleString()} m²` },
            ...(p.plot ? [{ label: "Plot", value: `${p.plot.toLocaleString()} m²` }] : []),
          ].map((s, i, arr) => (
            <div
              key={s.label}
              className="flex-1 text-center py-3"
              style={{ borderRight: i < arr.length - 1 ? `1px solid ${C.borderLight}` : "none", background: C.bg }}
            >
              <p className="text-[10px] tracking-[0.12em] uppercase font-normal mb-0.5" style={{ color: C.textTertiary }}>{s.label}</p>
              <p className="text-[15px] font-light" style={{ fontFamily: F, color: C.text }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <p className="text-[26px] sm:text-[30px] font-extralight tracking-[0.01em]" style={{ fontFamily: F, color: C.text }}>
            {p.price}
          </p>
          <span
            className="flex items-center gap-2 text-[12px] tracking-[0.1em] uppercase font-normal transition-all duration-300 group-hover:gap-3"
            style={{ color: C.accent }}
          >
            View <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  </a>
);

/* ═══════════ PROPERTY CARD — GRID ═══════════ */
const PropertyCardGrid = ({ p, fav, onFav }: { p: typeof PROPERTIES[0]; fav: boolean; onFav: () => void }) => (
  <a
    href={`/property/${p.id}`}
    className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-lg block"
    style={{ background: C.surface, border: `1px solid ${C.borderLight}` }}
  >
    <div className="relative overflow-hidden aspect-[4/3]">
      <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]" />
      <div className="absolute inset-x-0 top-0 p-3.5 flex items-start justify-between">
        <div className="flex items-center gap-1.5">
          {p.isNew && (
            <span className="text-[9px] tracking-[0.18em] uppercase font-medium px-2.5 py-0.5 rounded-full text-white" style={{ background: C.accent }}>New</span>
          )}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFav(); }}
          className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110"
          style={{ background: "rgba(255,255,255,0.9)" }}
        >
          <Heart className={`w-3.5 h-3.5 ${fav ? "fill-red-500 text-red-500" : ""}`} style={{ color: fav ? undefined : C.textTertiary }} />
        </button>
      </div>
      <div className="absolute bottom-0 inset-x-0 p-3.5 flex items-end justify-between">
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 text-[10px] text-white px-2 py-0.5 rounded-full backdrop-blur-md" style={{ background: "rgba(26,26,26,0.5)" }}>
            <Camera className="w-3 h-3" /> {p.photos}
          </span>
          {p.hasVideo && (
            <span className="text-[10px] text-white px-2 py-0.5 rounded-full backdrop-blur-md" style={{ background: "rgba(26,26,26,0.5)" }}>
              <Play className="w-3 h-3 fill-white inline" />
            </span>
          )}
        </div>
      </div>
      {/* Hover overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center" style={{ background: "rgba(26,26,26,0.25)" }}>
        <span className="text-[11px] tracking-[0.15em] uppercase text-white px-6 py-2.5 rounded-full font-normal backdrop-blur-sm" style={{ border: "1px solid rgba(255,255,255,0.5)" }}>
          View Details
        </span>
      </div>
    </div>

    <div className="p-5">
      <div className="flex items-center justify-between mb-2">
        <StatusDot status={p.tag} />
        <span className="text-[10px] tracking-[0.08em] font-light" style={{ color: C.textTertiary }}>{p.ref}</span>
      </div>
      <div className="flex items-center gap-1.5 mb-1">
        <MapPin className="w-3 h-3" style={{ color: C.accent }} />
        <span className="text-[11px] tracking-[0.04em] uppercase font-normal" style={{ color: C.textSecondary }}>{p.location}</span>
      </div>
      <h3 className="text-[17px] font-light tracking-[0.02em] mb-3 group-hover:text-[#96794A] transition-colors duration-500" style={{ fontFamily: F, color: C.text, lineHeight: 1.3 }}>
        {p.title}
      </h3>
      <div className="flex items-center gap-4 text-[13px] font-light mb-4" style={{ color: C.textSecondary }}>
        <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {p.beds}</span>
        <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {p.baths}</span>
        <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> {p.sqm}m²</span>
      </div>
      <div className="pt-4" style={{ borderTop: `1px solid ${C.borderLight}` }}>
        <p className="text-[20px] font-extralight" style={{ fontFamily: F, color: C.text }}>{p.price}</p>
      </div>
    </div>
  </a>
);

/* ═══════════════════════════════════════════════════════════ */

const LuxuryPropertyListing = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrolled = useSticky(containerRef);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [view, setView] = useState<"list" | "grid">("list");
  const [sort, setSort] = useState("price-desc");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [region, setRegion] = useState("All Regions");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [mobileMenu, setMobileMenu] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    const h = () => { if (window.innerWidth >= 1024) setMobileMenu(false); };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggleFav = (id: number) => setFavorites(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const activeChips = buildActiveChips(filters);

  const filtered = useMemo(() => {
    let r = [...PROPERTIES];
    if (search) { const q = search.toLowerCase(); r = r.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.ref.toLowerCase().includes(q)); }
    if (type !== "All") r = r.filter(p => p.tag === type.toUpperCase() || p.style?.toLowerCase() === type.toLowerCase());
    if (region !== "All Regions") r = r.filter(p => p.region === region);
    if (filters.beds !== "Any") r = r.filter(p => p.beds >= parseInt(filters.beds));
    switch (sort) {
      case "price-desc": r.sort((a, b) => b.priceNum - a.priceNum); break;
      case "price-asc": r.sort((a, b) => a.priceNum - b.priceNum); break;
      case "beds-desc": r.sort((a, b) => b.beds - a.beds); break;
      case "sqm-desc": r.sort((a, b) => b.sqm - a.sqm); break;
    }
    return r;
  }, [search, type, region, filters.beds, sort]);

  const activeCount = [type !== "All", region !== "All Regions", filters.beds !== "Any"].filter(Boolean).length;
  const clearAll = () => { setType("All"); setRegion("All Regions"); setFilters(defaultFilters); setSearch(""); };

  return (
    <div ref={containerRef} className="flex-1 overflow-auto" style={{ background: C.bg, color: C.text, fontFamily: F }}>

      {/* ── NAV ── */}
      <nav
        className="sticky top-0 z-50 transition-all duration-500"
        style={{
          background: `${C.surface}f2`,
          backdropFilter: "blur(20px) saturate(180%)",
          borderBottom: `1px solid ${scrolled ? C.borderLight : "transparent"}`,
        }}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-5 lg:px-10 h-[68px]">
          <div className="hidden lg:flex items-center gap-7">
            {NAV_LEFT.map(l => (
              <a key={l} href={l === "Home" ? "/" : l === "Properties" ? "/properties" : "#"}
                className={`text-[13px] tracking-[0.08em] transition-colors duration-300 hover:opacity-60 ${l === "Properties" ? "font-medium" : "font-light"}`}
                style={{ color: C.text }}>{l}</a>
            ))}
          </div>
          <a href="/" className="flex flex-col items-center gap-0">
            <span className="text-[22px] tracking-[0.35em] font-extralight" style={{ color: C.text }}>{BRAND_NAME.split(" ")[0]}</span>
            <span className="text-[7px] tracking-[0.5em] uppercase font-light -mt-0.5" style={{ color: C.textTertiary }}>Real Estate</span>
          </a>
          <div className="hidden lg:flex items-center gap-7">
            {NAV_RIGHT.map(l => (
              <a key={l} href={l === "Guides & Blog" ? "/blog" : "#"} className="text-[13px] tracking-[0.08em] font-light transition-colors duration-300 hover:opacity-60" style={{ color: C.text }}>{l}</a>
            ))}
          </div>
          <button className="lg:hidden" onClick={() => setMobileMenu(!mobileMenu)} style={{ color: C.text }}>
            {mobileMenu ? <X className="w-5 h-5" /> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>}
          </button>
        </div>
        {mobileMenu && (
          <div className="lg:hidden px-5 py-5 flex flex-col gap-0.5 animate-in slide-in-from-top-2 duration-200" style={{ background: C.surface, borderTop: `1px solid ${C.borderLight}` }}>
            {[...NAV_LEFT, ...NAV_RIGHT].map(l => (
              <a key={l} href="#" className="text-[14px] tracking-[0.06em] font-light py-3" style={{ color: C.text, borderBottom: `1px solid ${C.borderLight}` }}>{l}</a>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative h-[32vh] sm:h-[38vh] min-h-[240px] flex items-end overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,26,26,0.75) 0%, rgba(26,26,26,0.15) 60%, rgba(26,26,26,0.25) 100%)" }} />
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-5 lg:px-10 pb-8 sm:pb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-[0.04em] text-white mb-2" style={{ fontFamily: F }}>
            Properties
          </h1>
          <p className="text-[13px] sm:text-[14px] tracking-[0.04em] font-light" style={{ color: "rgba(255,255,255,0.6)" }}>
            {filtered.length} exclusive listings across Ibiza & Costa Blanca
          </p>
        </div>
      </section>

      {/* ── FILTERS BAR ── */}
      <section
        className="sticky top-[68px] z-40 transition-all duration-300"
        style={{ background: `${C.surface}f8`, backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.borderLight}` }}
      >
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 py-4">
          {/* Search + filters toggle */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.textTertiary }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, location, reference..."
                className="w-full pl-11 pr-10 py-3 text-[14px] font-light tracking-wide rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                style={{
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  color: C.text,
                  fontFamily: F,
                  ...(search ? { borderColor: C.accent, boxShadow: `0 0 0 2px ${C.accent}20` } : {}),
                } as React.CSSProperties}
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/5 transition-colors">
                  <X className="w-3.5 h-3.5" style={{ color: C.textTertiary }} />
                </button>
              )}
            </div>
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 px-5 py-3 text-[13px] tracking-[0.06em] font-light rounded-xl transition-all duration-300 shrink-0"
              style={{
                border: `1px solid ${activeCount > 0 ? C.accent : C.border}`,
                color: activeCount > 0 ? C.accent : C.textSecondary,
                background: activeCount > 0 ? `${C.accent}08` : "transparent",
              }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeCount > 0 && (
                <span className="w-5 h-5 rounded-full text-[10px] font-medium flex items-center justify-center text-white" style={{ background: C.accent }}>{activeCount}</span>
              )}
            </button>
          </div>

          {/* Pills row */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 hide-scrollbar">
            {TYPES_PILL.map(t => (
              <Pill key={t} active={type === t} onClick={() => setType(t)}>{t}</Pill>
            ))}
            <div className="w-px h-5 mx-1 shrink-0" style={{ background: C.border }} />
            <Dropdown label="Region" value={region} options={REGIONS} onChange={setRegion} />

            {activeCount > 0 && (
              <button onClick={clearAll} className="ml-auto flex items-center gap-1 text-[12px] font-light shrink-0 transition-colors hover:opacity-70" style={{ color: C.accent }}>
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── FILTER SIDEBAR ── */}
      <FilterSidebar open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} onChange={setFilters} />

      {/* ── RESULTS BAR ── */}
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 py-5 flex items-center justify-between">
        <div>
          <p className="text-[14px] font-light" style={{ color: C.textSecondary }}>
            <span className="font-medium" style={{ color: C.text }}>{filtered.length}</span> properties
          </p>
          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {activeChips.map((chip) => (
                <span key={chip.key} className="inline-flex items-center gap-1.5 text-[12px] font-medium rounded-full pl-3 pr-2 py-1 whitespace-nowrap" style={{ background: C.borderLight, color: C.text }}>
                  {chip.label}
                  <button onClick={() => setFilters(f => removeChip(f, chip))} className="hover:opacity-70 transition-colors" style={{ color: C.textTertiary }}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button onClick={clearAll} className="text-[11px] underline transition-colors ml-1 hover:opacity-70" style={{ color: C.textTertiary }}>Clear all</button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-0.5 p-0.5 rounded-lg" style={{ border: `1px solid ${C.border}` }}>
            <button onClick={() => setView("list")} className="p-1.5 rounded-md transition-all duration-200" style={{ background: view === "list" ? C.dark : "transparent", color: view === "list" ? "#fff" : C.textTertiary }}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setView("grid")} className="p-1.5 rounded-md transition-all duration-200" style={{ background: view === "grid" ? C.dark : "transparent", color: view === "grid" ? "#fff" : C.textTertiary }}>
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
          <div ref={sortRef} className="relative">
            <button onClick={() => setSortOpen(!sortOpen)} className="flex items-center gap-1.5 text-[13px] tracking-[0.04em] font-light px-4 py-2 rounded-lg transition-all duration-300" style={{ border: `1px solid ${C.border}`, color: C.textSecondary }}>
              {SORTS.find(s => s.v === sort)?.l}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {sortOpen && (
              <div className="absolute top-full right-0 mt-2 py-2 min-w-[200px] z-50 rounded-xl shadow-xl animate-in fade-in-0 slide-in-from-top-1 duration-200" style={{ background: C.surface, border: `1px solid ${C.borderLight}` }}>
                {SORTS.map(s => (
                  <button key={s.v} onClick={() => { setSort(s.v); setSortOpen(false); }} className="flex items-center justify-between w-full px-4 py-2.5 text-[13px] font-light transition-colors hover:bg-[#F8F7F5]" style={{ color: sort === s.v ? C.accent : C.textSecondary }}>
                    {s.l}
                    {sort === s.v && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── PROPERTY LIST ── */}
      <section className="max-w-[1400px] mx-auto px-5 lg:px-10 pb-20">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
              <Search className="w-6 h-6" style={{ color: C.textTertiary }} />
            </div>
            <p className="text-xl font-extralight mb-2" style={{ fontFamily: F, color: C.textSecondary }}>No properties found</p>
            <p className="text-[14px] font-light mb-6" style={{ color: C.textTertiary }}>Try adjusting your filters or search terms</p>
            <button onClick={clearAll} className="text-[13px] tracking-[0.08em] uppercase font-normal px-6 py-3 rounded-full transition-all duration-300 hover:opacity-80" style={{ background: C.dark, color: "#fff" }}>
              Clear All Filters
            </button>
          </div>
        ) : view === "list" ? (
          <div className="space-y-5">
            {filtered.map(p => (
              <PropertyCardList key={p.id} p={p} fav={favorites.has(p.id)} onFav={() => toggleFav(p.id)} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {filtered.map(p => (
              <PropertyCardGrid key={p.id} p={p} fav={favorites.has(p.id)} onFav={() => toggleFav(p.id)} />
            ))}
          </div>
        )}
      </section>

      {/* ── POPULAR LOCATIONS ── */}
      <section className="max-w-[1400px] mx-auto px-5 lg:px-10 py-10" style={{ borderTop: `1px solid ${C.borderLight}` }}>
        <h2 className="text-xl font-light tracking-[0.04em] mb-6" style={{ fontFamily: F, color: C.text }}>Explore Popular Locations</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-3">
          {[
            "Ibiza Town", "Santa Eulalia", "San José", "Es Cubells",
            "Cala Jondal", "Talamanca", "Marina Botafoch", "San Antonio",
            "Jávea", "Altea", "Moraira", "Calpe",
            "Dénia", "Benidorm", "Alicante", "Torrevieja",
            "Orihuela Costa", "Villajoyosa",
          ].map((loc) => (
            <a key={loc} href="#" className="text-[13px] font-light transition-colors duration-200 hover:opacity-70" style={{ color: C.textSecondary }}>
              {loc}
            </a>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <img src={prop2} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(26,26,26,0.8) 0%, rgba(26,26,26,0.5) 100%)" }} />
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <p className="text-[11px] tracking-[0.3em] uppercase mb-4 font-normal" style={{ color: C.gold }}>
            Can't find what you're looking for?
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extralight text-white mb-4 tracking-[0.03em]" style={{ fontFamily: F }}>
            Let Us Search For You
          </h2>
          <p className="text-[14px] leading-[1.8] font-light mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
            Our team has access to exclusive off-market properties not featured online. Share your requirements and we'll find your dream home.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="text-[12px] tracking-[0.15em] uppercase font-normal px-10 py-4 rounded-full transition-all duration-300 hover:opacity-90" style={{ background: C.accent, color: "#fff" }}>
              Contact an Advisor
            </button>
            <button className="text-[12px] tracking-[0.15em] uppercase font-normal px-10 py-4 rounded-full transition-all duration-300 hover:bg-white/10" style={{ border: "1px solid rgba(255,255,255,0.3)", color: "#fff" }}>
              Register Interest
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.dark }}>
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
            <div>
              <span className="text-xl tracking-[0.35em] font-extralight block mb-1" style={{ color: "#fff" }}>{BRAND_NAME.split(" ")[0]}</span>
              <span className="text-[8px] tracking-[0.4em] uppercase font-light block mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>Real Estate</span>
              <p className="text-[13px] leading-relaxed font-light" style={{ color: "rgba(255,255,255,0.5)" }}>
                Curating extraordinary homes for exceptional lives since 2010.
              </p>
            </div>
            <div>
              <h4 className="text-[11px] tracking-[0.15em] uppercase mb-5 font-normal" style={{ color: "rgba(255,255,255,0.45)" }}>Links</h4>
              <ul className="space-y-3">
                {["Properties", "Off-Market", "New Developments", "About", "Contact"].map(l => (
                  <li key={l}><a href="#" className="text-[13px] font-light transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.55)" }}>{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] tracking-[0.15em] uppercase mb-5 font-normal" style={{ color: "rgba(255,255,255,0.45)" }}>Contact</h4>
              <ul className="space-y-3 text-[13px] font-light" style={{ color: "rgba(255,255,255,0.55)" }}>
                <li>hello@prestigeestates.com</li>
                <li>+34 600 000 000</li>
                <li>Marbella, Spain</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] tracking-[0.15em] uppercase mb-5 font-normal" style={{ color: "rgba(255,255,255,0.45)" }}>Follow</h4>
              <div className="flex gap-3">
                {["IG", "LI", "WA"].map((label, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:border-white/30 text-[11px] tracking-wider" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.55)" }}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-14 pt-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-[11px] tracking-[0.12em] font-light" style={{ color: "rgba(255,255,255,0.3)" }}>© 2026 {BRAND_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LuxuryPropertyListing;
