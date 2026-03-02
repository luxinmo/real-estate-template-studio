import { useState, useRef, useEffect, useMemo } from "react";
import {
  Bed, Bath, Maximize, MapPin, ChevronDown, Check, X,
  SlidersHorizontal, Search, ArrowRight, Instagram, Linkedin, MessageCircle,
  Grid3X3, List, Heart, Play, Camera, Eye, ChevronLeft, ChevronRight,
  RotateCcw,
} from "lucide-react";
import heroImg from "@/assets/luxury-hero.jpg";
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
const BRAND = "PRESTIGE";

/* ═══════════ DATA ═══════════ */
interface Property {
  id: number;
  image: string;
  gallery: string[];
  title: string;
  location: string;
  region: string;
  price: string;
  priceNum: number;
  beds: number;
  baths: number;
  built: number;
  plot?: number;
  type: string;
  status: "For Sale" | "Under Offer" | "Sold" | "For Rent";
  ref: string;
  isNew?: boolean;
  hasVideo?: boolean;
  has360?: boolean;
  photos: number;
  excerpt: string;
  style?: string;
}

const PROPERTIES: Property[] = [
  {
    id: 1, image: prop1, gallery: [prop1, detail1, detail2],
    title: "La Zagaleta Estate", location: "Benahavís, Málaga", region: "Costa del Sol",
    price: "€19,500,000", priceNum: 19500000, beds: 8, baths: 7, built: 1800, plot: 4500,
    type: "Mansion", status: "For Sale", ref: "PRE-2200", photos: 64,
    excerpt: "One of the finest properties in Europe's most exclusive gated community. Two pools, staff quarters, helipad.",
    style: "Grand Classical",
  },
  {
    id: 2, image: prop3, gallery: [prop3, detail2, detail3],
    title: "Sierra Blanca Glass Retreat", location: "Sierra Blanca, Marbella", region: "Costa del Sol",
    price: "€15,200,000", priceNum: 15200000, beds: 7, baths: 6, built: 950, plot: 3200,
    type: "Villa", status: "Under Offer", ref: "PRE-5104", photos: 56,
    excerpt: "Palatial estate in the ultra-exclusive Sierra Blanca enclave. Private cinema, spa wing, and manicured gardens.",
    style: "Contemporary", hasVideo: true,
  },
  {
    id: 3, image: prop1, gallery: [prop1, detail3, heroImg],
    title: "The Skyline Penthouse", location: "Golden Mile, Marbella", region: "Costa del Sol",
    price: "€12,500,000", priceNum: 12500000, beds: 5, baths: 4, built: 420, plot: 120,
    type: "Penthouse", status: "For Sale", ref: "PRE-4522", photos: 32,
    excerpt: "An extraordinary penthouse crowning Marbella's most prestigious address. Floor-to-ceiling glass, sweeping panoramas.",
    style: "Ultra Modern", hasVideo: true, has360: true,
  },
  {
    id: 4, image: detail1, gallery: [detail1, prop2, prop3],
    title: "Ibiza Cliffside Villa", location: "Es Cubells, Ibiza", region: "Ibiza",
    price: "€11,000,000", priceNum: 11000000, beds: 6, baths: 5, built: 520, plot: 2000,
    type: "Villa", status: "For Sale", ref: "PRE-8801", photos: 42,
    excerpt: "Perched on dramatic cliffs with 180° sunset views over Formentera. Natural stone, reclaimed wood, bohemian luxury.",
    style: "Ibizan Contemporary", hasVideo: true,
  },
  {
    id: 5, image: prop2, gallery: [prop2, detail3, detail1],
    title: "Villa Blanca Sur Mer", location: "Cap Martí, Jávea", region: "Costa Blanca",
    price: "€8,900,000", priceNum: 8900000, beds: 6, baths: 5, built: 680, plot: 1800,
    type: "Villa", status: "For Sale", ref: "PRE-3871", photos: 48,
    excerpt: "Modern Mediterranean architecture above turquoise waters. Infinity pool, landscaped gardens, and complete privacy.",
    style: "Mediterranean Modern", isNew: true,
  },
  {
    id: 6, image: heroImg, gallery: [heroImg, prop1, detail1],
    title: "Beachfront Residence", location: "Los Monteros, Marbella", region: "Costa del Sol",
    price: "€6,750,000", priceNum: 6750000, beds: 4, baths: 3, built: 340, plot: 600,
    type: "Villa", status: "For Sale", ref: "PRE-6201", photos: 28,
    excerpt: "Direct beach access from this refined coastal residence. Every detail considered for seamless indoor-outdoor living.",
    style: "Coastal Modern",
  },
  {
    id: 7, image: detail3, gallery: [detail3, prop2, detail1],
    title: "Marina Penthouse Duplex", location: "Port Adriano, Mallorca", region: "Mallorca",
    price: "€4,200,000", priceNum: 4200000, beds: 4, baths: 3, built: 280,
    type: "Penthouse", status: "For Rent", ref: "PRE-3340", photos: 18,
    excerpt: "Duplex penthouse overlooking the Philippe Starck-designed marina. Rooftop terrace with plunge pool.",
    style: "Design-Led",
  },
  {
    id: 8, image: detail2, gallery: [detail2, heroImg, prop3],
    title: "Panoramic Sea View Apartment", location: "Altea Hills, Altea", region: "Costa Blanca",
    price: "€1,850,000", priceNum: 1850000, beds: 3, baths: 2, built: 185,
    type: "Apartment", status: "For Sale", ref: "PRE-7890", photos: 22,
    excerpt: "Elevated living with uninterrupted views across the Albir coastline. Open-plan living and wrap-around terrace.",
    style: "Modern Minimalist", has360: true,
  },
];

const TYPES = ["All", "Villa", "Penthouse", "Apartment", "Mansion"];
const REGIONS = ["All Regions", "Costa del Sol", "Costa Blanca", "Mallorca", "Ibiza"];
const BEDS_OPTS = ["Any", "2+", "3+", "4+", "5+", "6+"];
const SORTS = [
  { v: "price-desc", l: "Price ↓" },
  { v: "price-asc", l: "Price ↑" },
  { v: "beds-desc", l: "Bedrooms ↓" },
  { v: "sqm-desc", l: "Size ↓" },
];

/* ═══════════ HOOKS ═══════════ */
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

/* ═══════════ SMALL COMPONENTS ═══════════ */

const StatusDot = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    "For Sale": "#22C55E",
    "Under Offer": "#F59E0B",
    "Sold": "#EF4444",
    "For Rent": "#3B82F6",
  };
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: colors[status] || C.textTertiary }} />
      <span className="text-[11px] tracking-[0.06em] font-normal" style={{ color: C.textSecondary }}>{status}</span>
    </span>
  );
};

const Pill = ({ active, children, onClick, count }: { active: boolean; children: React.ReactNode; onClick: () => void; count?: number }) => (
  <button
    onClick={onClick}
    className="relative text-[13px] tracking-[0.04em] px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap font-light"
    style={{
      background: active ? C.dark : "transparent",
      color: active ? "#fff" : C.textSecondary,
      border: `1px solid ${active ? C.dark : C.border}`,
    }}
  >
    {children}
    {count !== undefined && count > 0 && (
      <span
        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-medium flex items-center justify-center"
        style={{ background: C.accent, color: "#fff" }}
      >{count}</span>
    )}
  </button>
);

const Dropdown = ({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
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

/* ═══════════ PROPERTY CARD — LIST ═══════════ */
const PropertyCardList = ({ p, fav, onFav }: { p: Property; fav: boolean; onFav: () => void }) => (
  <article
    className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl"
    style={{ background: C.surface, border: `1px solid ${C.borderLight}` }}
  >
    <div className="flex flex-col md:flex-row">
      {/* Image — 5:7 ratio */}
      <div className="w-full md:w-[400px] lg:w-[460px] shrink-0 relative overflow-hidden aspect-[16/11] md:aspect-auto md:min-h-[320px]">
        <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]" />

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 p-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            {p.isNew && (
              <span className="text-[10px] tracking-[0.18em] uppercase font-medium px-3 py-1 rounded-full text-white" style={{ background: C.accent }}>
                New
              </span>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onFav(); }}
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
              <span className="flex items-center gap-1 text-[11px] font-normal text-white px-2.5 py-1 rounded-full backdrop-blur-md" style={{ background: "rgba(26,26,26,0.5)" }}>
                <Play className="w-3 h-3 fill-white" />
              </span>
            )}
            {p.has360 && (
              <span className="flex items-center gap-1 text-[11px] font-normal text-white px-2.5 py-1 rounded-full backdrop-blur-md" style={{ background: "rgba(26,26,26,0.5)" }}>
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
            <StatusDot status={p.status} />
            <span className="text-[11px] tracking-[0.04em] font-light px-2.5 py-0.5 rounded-full" style={{ color: C.textTertiary, border: `1px solid ${C.borderLight}` }}>{p.type}</span>
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
          className="text-[22px] sm:text-[26px] font-light tracking-[0.02em] mb-3 group-hover:text-[#96794A] transition-colors duration-500"
          style={{ fontFamily: F, color: C.text, lineHeight: 1.25 }}
        >
          {p.title}
        </h2>

        {/* Excerpt */}
        <p className="text-[14px] leading-[1.75] font-light line-clamp-2 mb-auto hidden sm:block" style={{ color: C.textSecondary }}>
          {p.excerpt}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-0 mt-5 mb-5 rounded-xl overflow-hidden" style={{ border: `1px solid ${C.borderLight}` }}>
          {[
            { label: "Beds", value: p.beds },
            { label: "Baths", value: p.baths },
            { label: "Built", value: `${p.built.toLocaleString()} m²` },
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
  </article>
);

/* ═══════════ PROPERTY CARD — GRID ═══════════ */
const PropertyCardGrid = ({ p, fav, onFav }: { p: Property; fav: boolean; onFav: () => void }) => (
  <article
    className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-lg"
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
          onClick={(e) => { e.stopPropagation(); onFav(); }}
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
        <StatusDot status={p.status} />
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
        <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> {p.built}m²</span>
      </div>

      <div className="pt-4" style={{ borderTop: `1px solid ${C.borderLight}` }}>
        <p className="text-[20px] font-extralight" style={{ fontFamily: F, color: C.text }}>{p.price}</p>
      </div>
    </div>
  </article>
);

/* ═══════════ MAIN PAGE ═══════════ */
const Home2PropertiesPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrolled = useSticky(containerRef);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [view, setView] = useState<"list" | "grid">("list");
  const [sort, setSort] = useState("price-desc");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [region, setRegion] = useState("All Regions");
  const [beds, setBeds] = useState("Any");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const NAV = ["Home", "Properties", "Rentals", "About", "Blog", "Contact"];

  useEffect(() => {
    const h = () => { if (window.innerWidth >= 1024) setMobileMenu(false); };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const toggleFav = (id: number) => setFavorites(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const filtered = useMemo(() => {
    let r = [...PROPERTIES];
    if (search) { const q = search.toLowerCase(); r = r.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.ref.toLowerCase().includes(q)); }
    if (type !== "All") r = r.filter(p => p.type === type);
    if (region !== "All Regions") r = r.filter(p => p.region === region);
    if (beds !== "Any") r = r.filter(p => p.beds >= parseInt(beds));
    switch (sort) {
      case "price-desc": r.sort((a, b) => b.priceNum - a.priceNum); break;
      case "price-asc": r.sort((a, b) => a.priceNum - b.priceNum); break;
      case "beds-desc": r.sort((a, b) => b.beds - a.beds); break;
      case "sqm-desc": r.sort((a, b) => b.built - a.built); break;
    }
    return r;
  }, [search, type, region, beds, sort]);

  const activeCount = [type !== "All", region !== "All Regions", beds !== "Any"].filter(Boolean).length;

  const clearAll = () => { setType("All"); setRegion("All Regions"); setBeds("Any"); setSearch(""); };

  const sortRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={containerRef} className="flex-1 overflow-auto" style={{ background: C.bg, color: C.text, fontFamily: F }}>

      {/* ── NAV ── */}
      <nav
        className="sticky top-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? `${C.surface}f2` : `${C.surface}f2`,
          backdropFilter: "blur(20px) saturate(180%)",
          borderBottom: `1px solid ${scrolled ? C.borderLight : "transparent"}`,
        }}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-5 lg:px-10 h-[68px]">
          <div className="hidden lg:flex items-center gap-7">
            {NAV.slice(0, 3).map(l => (
              <a key={l} href="#" className={`text-[13px] tracking-[0.08em] transition-colors duration-300 hover:opacity-60 ${l === "Properties" ? "font-medium" : "font-light"}`} style={{ color: C.text }}>{l}</a>
            ))}
          </div>
          <a href="#" className="flex flex-col items-center gap-0">
            <span className="text-[22px] tracking-[0.35em] font-extralight" style={{ color: C.text }}>{BRAND}</span>
            <span className="text-[7px] tracking-[0.5em] uppercase font-light -mt-0.5" style={{ color: C.textTertiary }}>Real Estate</span>
          </a>
          <div className="hidden lg:flex items-center gap-7">
            {NAV.slice(3).map(l => (
              <a key={l} href="#" className="text-[13px] tracking-[0.08em] font-light transition-colors duration-300 hover:opacity-60" style={{ color: C.text }}>{l}</a>
            ))}
          </div>
          <button className="lg:hidden" onClick={() => setMobileMenu(!mobileMenu)} style={{ color: C.text }}>
            {mobileMenu ? <X className="w-5 h-5" /> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>}
          </button>
        </div>
        {mobileMenu && (
          <div className="lg:hidden px-5 py-5 flex flex-col gap-0.5 animate-in slide-in-from-top-2 duration-200" style={{ background: C.surface, borderTop: `1px solid ${C.borderLight}` }}>
            {NAV.map(l => (
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
            {PROPERTIES.length} exclusive listings across Spain's most coveted coastlines
          </p>
        </div>
      </section>

      {/* ── FILTERS BAR ── */}
      <section
        className="sticky top-[68px] z-40 transition-all duration-300"
        style={{ background: `${C.surface}f8`, backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.borderLight}` }}
      >
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 py-4">
          {/* Search + filter toggle */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.textTertiary }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, location, reference..."
                className="w-full pl-11 pr-10 py-3 text-[14px] font-light tracking-wide rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontFamily: F, ...(search ? { borderColor: C.accent, boxShadow: `0 0 0 2px ${C.accent}20` } : {}) } as React.CSSProperties}
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/5 transition-colors">
                  <X className="w-3.5 h-3.5" style={{ color: C.textTertiary }} />
                </button>
              )}
            </div>
            <button
              onClick={() => setFiltersExpanded(!filtersExpanded)}
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
            {TYPES.map(t => (
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

        {/* Expanded filters */}
        {filtersExpanded && (
          <div className="animate-in slide-in-from-top-2 duration-200" style={{ background: C.surface, borderTop: `1px solid ${C.borderLight}` }}>
            <div className="max-w-[1400px] mx-auto px-5 lg:px-10 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="text-[11px] tracking-[0.12em] uppercase font-normal block mb-3" style={{ color: C.textTertiary }}>Min. Bedrooms</label>
                  <div className="flex gap-1.5">
                    {BEDS_OPTS.map(b => (
                      <button
                        key={b}
                        onClick={() => setBeds(b)}
                        className="flex-1 py-2.5 text-[13px] font-light rounded-lg transition-all duration-300"
                        style={{
                          background: beds === b ? C.dark : "transparent",
                          color: beds === b ? "#fff" : C.textSecondary,
                          border: `1px solid ${beds === b ? C.dark : C.border}`,
                        }}
                      >{b}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] tracking-[0.12em] uppercase font-normal block mb-3" style={{ color: C.textTertiary }}>Quick Filters</label>
                  <div className="flex flex-wrap gap-2">
                    {["Sea Views", "Pool", "New Build", "Beachfront", "Golf"].map(f => (
                      <button key={f} className="text-[12px] font-light px-4 py-2 rounded-full transition-all duration-300 hover:border-[#96794A]" style={{ border: `1px solid ${C.border}`, color: C.textSecondary }}>{f}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] tracking-[0.12em] uppercase font-normal block mb-3" style={{ color: C.textTertiary }}>Price Range</label>
                  <div className="flex gap-2 items-center">
                    <input placeholder="Min €" className="flex-1 px-3 py-2.5 text-[13px] font-light rounded-lg focus:outline-none" style={{ border: `1px solid ${C.border}`, background: C.bg, color: C.text }} />
                    <span className="text-sm" style={{ color: C.textTertiary }}>—</span>
                    <input placeholder="Max €" className="flex-1 px-3 py-2.5 text-[13px] font-light rounded-lg focus:outline-none" style={{ border: `1px solid ${C.border}`, background: C.bg, color: C.text }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── RESULTS BAR ── */}
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 py-5 flex items-center justify-between">
        <p className="text-[14px] font-light" style={{ color: C.textSecondary }}>
          <span className="font-medium" style={{ color: C.text }}>{filtered.length}</span> properties
        </p>
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
              <span className="text-xl tracking-[0.35em] font-extralight block mb-1" style={{ color: "#fff" }}>{BRAND}</span>
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
                {[Instagram, Linkedin, MessageCircle].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:border-white/30" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.55)" }}>
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-14 pt-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-[11px] tracking-[0.12em] font-light" style={{ color: "rgba(255,255,255,0.3)" }}>© 2026 {BRAND}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home2PropertiesPage;
