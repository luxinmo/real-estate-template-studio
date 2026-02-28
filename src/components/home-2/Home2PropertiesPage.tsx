import { useState, useRef, useEffect, useMemo } from "react";
import {
  Bed, Bath, Maximize, MapPin, ArrowUpDown, ChevronDown, Check, X,
  SlidersHorizontal, Search, ArrowUpRight, Instagram, Linkedin, MessageCircle,
  Home, Grid3X3, List, Heart, Play, Camera, Eye,
} from "lucide-react";
import heroImg from "@/assets/luxury-hero.jpg";
import prop1 from "@/assets/luxury-property-1.jpg";
import prop2 from "@/assets/luxury-property-2.jpg";
import prop3 from "@/assets/luxury-property-3.jpg";
import detail1 from "@/assets/property-detail-1.jpg";
import detail2 from "@/assets/property-detail-2.jpg";
import detail3 from "@/assets/property-detail-3.jpg";

/* ─── Design tokens ─── */
const palette = {
  bg: "#FAF8F5",
  bgAlt: "#F0ECE6",
  text: "#2D2926",
  textMuted: "#6B6560",
  textLight: "#9A938B",
  accent: "#8B6F47",
  accentDark: "#6E5636",
  border: "#E2DCD4",
  white: "#FFFFFF",
  footerBg: "#2D2926",
  cardBg: "#FFFFFF",
  cardHover: "#F7F4EF",
};

const font = {
  brand: "'Jost', Helvetica, sans-serif",
  heading: "'Jost', Helvetica, sans-serif",
  body: "'Jost', Helvetica, sans-serif",
};

const BRAND = "PRESTIGE";
const BRAND_SUB = "REAL ESTATE";

/* ─── Data ─── */
interface Property {
  id: number;
  image: string;
  images: string[];
  name: string;
  location: string;
  region: string;
  price: string;
  priceNum: number;
  beds: number;
  baths: number;
  sqm: number;
  plot?: number;
  type: string;
  status: "For Sale" | "Under Offer" | "Sold" | "For Rent";
  ref: string;
  isNew?: boolean;
  hasVideo?: boolean;
  has360?: boolean;
  photoCount: number;
  description: string;
  style?: string;
}

const PROPERTIES: Property[] = [
  {
    id: 1, image: prop1, images: [prop1, detail1, detail2],
    name: "The Skyline Penthouse", location: "Golden Mile, Marbella", region: "Costa del Sol",
    price: "€12,500,000", priceNum: 12500000, beds: 5, baths: 4, sqm: 420, plot: 120,
    type: "Penthouse", status: "For Sale", ref: "PRE-4522", photoCount: 32,
    description: "An extraordinary penthouse crowning one of Marbella's most prestigious addresses. Floor-to-ceiling glass reveals sweeping Mediterranean panoramas.",
    style: "Contemporary", hasVideo: true, has360: true,
  },
  {
    id: 2, image: prop2, images: [prop2, detail3, detail1],
    name: "Villa Blanca Sur Mer", location: "Cap Martí, Jávea", region: "Costa Blanca",
    price: "€8,900,000", priceNum: 8900000, beds: 6, baths: 5, sqm: 680, plot: 1800,
    type: "Villa", status: "For Sale", ref: "PRE-3871", photoCount: 48,
    description: "A masterpiece of modern Mediterranean architecture perched above the turquoise waters of Jávea. Infinity pool, landscaped gardens, and complete privacy.",
    style: "Mediterranean Modern", isNew: true,
  },
  {
    id: 3, image: prop3, images: [prop3, detail2, detail3],
    name: "Alpine Glass Retreat", location: "Sierra Blanca, Marbella", region: "Costa del Sol",
    price: "€15,200,000", priceNum: 15200000, beds: 7, baths: 6, sqm: 950, plot: 3200,
    type: "Villa", status: "Under Offer", ref: "PRE-5104", photoCount: 56,
    description: "A palatial estate in the ultra-exclusive Sierra Blanca enclave. Grand reception halls, private cinema, spa wing, and manicured grounds.",
    style: "Classic Contemporary", hasVideo: true,
  },
  {
    id: 4, image: heroImg, images: [heroImg, prop1, detail1],
    name: "Beachfront Residence", location: "Los Monteros, Marbella", region: "Costa del Sol",
    price: "€6,750,000", priceNum: 6750000, beds: 4, baths: 3, sqm: 340, plot: 600,
    type: "Villa", status: "For Sale", ref: "PRE-6201", photoCount: 28,
    description: "Direct beach access from this refined coastal residence. Wake to the sound of waves in a home where every detail has been considered.",
    style: "Coastal Modern",
  },
  {
    id: 5, image: detail1, images: [detail1, prop2, prop3],
    name: "Panoramic Sea View Apartment", location: "Altea Hills, Altea", region: "Costa Blanca",
    price: "€1,850,000", priceNum: 1850000, beds: 3, baths: 2, sqm: 185,
    type: "Apartment", status: "For Sale", ref: "PRE-7890", photoCount: 22,
    description: "Elevated living with uninterrupted views across the Albir coastline. Open-plan living, designer kitchen, and wrap-around terrace.",
    style: "Modern Minimalist", has360: true,
  },
  {
    id: 6, image: detail2, images: [detail2, heroImg, prop1],
    name: "La Zagaleta Estate", location: "Benahavís, Málaga", region: "Costa del Sol",
    price: "€19,500,000", priceNum: 19500000, beds: 8, baths: 7, sqm: 1800, plot: 4500,
    type: "Mansion", status: "For Sale", ref: "PRE-2200", photoCount: 64,
    description: "One of the finest properties in Europe's most exclusive gated community. Two swimming pools, staff quarters, helipad, and total privacy.",
    style: "Grand Classical",
  },
  {
    id: 7, image: detail3, images: [detail3, prop2, detail1],
    name: "Marina Penthouse Duplex", location: "Port Adriano, Mallorca", region: "Mallorca",
    price: "€4,200,000", priceNum: 4200000, beds: 4, baths: 3, sqm: 280,
    type: "Penthouse", status: "For Rent", ref: "PRE-3340", photoCount: 18,
    description: "Duplex penthouse overlooking the Philippe Starck-designed marina. Rooftop terrace with plunge pool and outdoor kitchen.",
    style: "Design-Led",
  },
  {
    id: 8, image: prop1, images: [prop1, detail3, heroImg],
    name: "Ibiza Cliffside Villa", location: "Es Cubells, Ibiza", region: "Ibiza",
    price: "€11,000,000", priceNum: 11000000, beds: 6, baths: 5, sqm: 520, plot: 2000,
    type: "Villa", status: "For Sale", ref: "PRE-8801", photoCount: 42,
    description: "Perched on the dramatic cliffs of Es Cubells with 180° sunset views over Formentera. Natural stone, reclaimed wood, and bohemian luxury.",
    style: "Ibizan Contemporary", hasVideo: true,
  },
];

const TYPE_OPTIONS = ["All", "Villa", "Penthouse", "Apartment", "Mansion", "Finca", "Land"];
const REGION_OPTIONS = ["All Regions", "Costa del Sol", "Costa Blanca", "Mallorca", "Ibiza", "Barcelona"];
const STATUS_OPTIONS = ["All", "For Sale", "Under Offer", "For Rent"];
const SORT_OPTIONS = [
  { value: "price-desc", label: "Price: High to Low" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "newest", label: "Newest First" },
  { value: "beds-desc", label: "Most Bedrooms" },
  { value: "sqm-desc", label: "Largest First" },
];

/* ─── Hooks ─── */
function useContainerScrolled(ref: React.RefObject<HTMLElement | null>, threshold = 60) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = () => setScrolled(el.scrollTop > threshold);
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, [ref, threshold]);
  return scrolled;
}

const FadeIn = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>
      {children}
    </div>
  );
};

/* ─── Status badge ─── */
const statusColors: Record<string, { bg: string; text: string }> = {
  "For Sale": { bg: "rgba(139,111,71,0.12)", text: palette.accent },
  "Under Offer": { bg: "rgba(217,119,6,0.12)", text: "#B45309" },
  "Sold": { bg: "rgba(220,38,38,0.1)", text: "#DC2626" },
  "For Rent": { bg: "rgba(59,130,246,0.1)", text: "#2563EB" },
};

/* ═══════════════════════════════════════════════════════ */

const Home2PropertiesPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrolled = useContainerScrolled(containerRef);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState("price-desc");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [bedsMin, setBedsMin] = useState("Any");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const NAV_LINKS = ["Home", "Properties", "Rentals", "About", "Guides & Blog", "Contact"];

  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setMobileMenuOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let result = [...PROPERTIES];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.ref.toLowerCase().includes(q));
    }
    if (selectedType !== "All") result = result.filter(p => p.type === selectedType);
    if (selectedRegion !== "All Regions") result = result.filter(p => p.region === selectedRegion);
    if (selectedStatus !== "All") result = result.filter(p => p.status === selectedStatus);
    if (priceMin) result = result.filter(p => p.priceNum >= parseInt(priceMin));
    if (priceMax) result = result.filter(p => p.priceNum <= parseInt(priceMax));
    if (bedsMin !== "Any") result = result.filter(p => p.beds >= parseInt(bedsMin));

    switch (sortBy) {
      case "price-desc": result.sort((a, b) => b.priceNum - a.priceNum); break;
      case "price-asc": result.sort((a, b) => a.priceNum - b.priceNum); break;
      case "beds-desc": result.sort((a, b) => b.beds - a.beds); break;
      case "sqm-desc": result.sort((a, b) => b.sqm - a.sqm); break;
    }
    return result;
  }, [searchQuery, selectedType, selectedRegion, selectedStatus, priceMin, priceMax, bedsMin, sortBy]);

  const activeFilters = [selectedType !== "All", selectedRegion !== "All Regions", selectedStatus !== "All", !!priceMin, !!priceMax, bedsMin !== "Any"].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedType("All");
    setSelectedRegion("All Regions");
    setSelectedStatus("All");
    setPriceMin("");
    setPriceMax("");
    setBedsMin("Any");
    setSearchQuery("");
  };

  return (
    <div ref={containerRef} className="flex-1 overflow-auto relative" style={{ background: palette.bg, color: palette.text, fontFamily: font.body }}>

      {/* ─── NAVBAR ─── */}
      <nav
        className="sticky top-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? `${palette.white}f0` : `${palette.white}f0`,
          backdropFilter: "blur(16px)",
          boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.06)" : "0 1px 0 rgba(0,0,0,0.03)",
        }}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 lg:px-12 h-[72px]">
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.slice(0, 3).map((l) => (
              <a key={l} href="#" className={`text-[13px] tracking-[0.12em] font-light transition-colors duration-300 hover:opacity-60 ${l === "Properties" ? "font-normal" : ""}`} style={{ color: palette.text }}>{l}</a>
            ))}
          </div>

          <a href="#" className="flex flex-col items-center">
            <span className="text-[20px] sm:text-[24px] tracking-[0.4em] font-light" style={{ fontFamily: font.brand, color: palette.text }}>{BRAND}</span>
            <span className="text-[7px] tracking-[0.45em] uppercase font-light -mt-0.5" style={{ color: palette.textLight }}>{BRAND_SUB}</span>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.slice(3).map((l) => (
              <a key={l} href="#" className="text-[13px] tracking-[0.12em] font-light transition-colors duration-300 hover:opacity-60" style={{ color: palette.text }}>{l}</a>
            ))}
          </div>

          <button className="lg:hidden" style={{ color: palette.text }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden animate-in slide-in-from-top-2 duration-200" style={{ background: palette.white, borderTop: `1px solid ${palette.border}` }}>
            <div className="px-6 py-6 flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <a key={l} href="#" className="text-[14px] tracking-[0.08em] font-light py-3" style={{ color: palette.text, borderBottom: `1px solid ${palette.border}40` }}>{l}</a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ─── HERO BANNER ─── */}
      <section className="relative h-[35vh] sm:h-[40vh] min-h-[260px] flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(45,41,38,0.7) 0%, rgba(45,41,38,0.3) 50%, rgba(45,41,38,0.4) 100%)" }} />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-[0.06em] text-white mb-3" style={{ fontFamily: font.heading }}>
            Our Collection
          </h1>
          <p className="text-sm tracking-[0.2em] uppercase font-light" style={{ color: "rgba(255,255,255,0.55)" }}>
            {PROPERTIES.length} Exclusive Properties
          </p>
        </div>
      </section>

      {/* ─── SEARCH & FILTERS BAR ─── */}
      <section className="sticky top-[72px] z-40 transition-all duration-300" style={{ background: `${palette.white}f5`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${palette.border}` }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4">
          {/* Search row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: palette.textLight }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, location or reference..."
                className="w-full pl-11 pr-4 py-3 text-[14px] font-light tracking-wide focus:outline-none transition-all duration-300"
                style={{ background: palette.bgAlt, border: `1px solid ${palette.border}`, color: palette.text, fontFamily: font.body }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4" style={{ color: palette.textLight }} />
                </button>
              )}
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-5 py-3 text-[13px] tracking-[0.08em] font-light transition-all duration-300 shrink-0"
              style={{ border: `1px solid ${activeFilters > 0 ? palette.accent : palette.border}`, color: activeFilters > 0 ? palette.accent : palette.textMuted, background: activeFilters > 0 ? `${palette.accent}08` : "transparent" }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilters > 0 && (
                <span className="w-5 h-5 rounded-full text-[10px] font-medium flex items-center justify-center text-white" style={{ background: palette.accent }}>{activeFilters}</span>
              )}
            </button>
          </div>

          {/* Filter pills row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Type pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
              {TYPE_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className="text-[12px] tracking-[0.08em] font-light px-4 py-1.5 whitespace-nowrap transition-all duration-300"
                  style={{
                    border: `1px solid ${selectedType === t ? palette.accent : palette.border}`,
                    background: selectedType === t ? palette.accent : "transparent",
                    color: selectedType === t ? "#fff" : palette.textMuted,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="hidden md:block w-px h-6 mx-1" style={{ background: palette.border }} />

            {/* Region dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => {
                  const el = document.getElementById("region-dropdown");
                  if (el) el.classList.toggle("hidden");
                }}
                className="flex items-center gap-1.5 text-[12px] tracking-[0.08em] font-light px-4 py-1.5 transition-all duration-300"
                style={{
                  border: `1px solid ${selectedRegion !== "All Regions" ? palette.accent : palette.border}`,
                  background: selectedRegion !== "All Regions" ? palette.accent : "transparent",
                  color: selectedRegion !== "All Regions" ? "#fff" : palette.textMuted,
                }}
              >
                {selectedRegion} <ChevronDown className="w-3 h-3" />
              </button>
              <div id="region-dropdown" className="hidden absolute top-full left-0 mt-1.5 py-1 min-w-[200px] z-50 shadow-lg" style={{ background: palette.white, border: `1px solid ${palette.border}` }}>
                {REGION_OPTIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setSelectedRegion(r);
                      document.getElementById("region-dropdown")?.classList.add("hidden");
                    }}
                    className="flex items-center justify-between w-full px-4 py-2.5 text-[13px] font-light transition-colors hover:bg-[#F7F4EF]"
                    style={{ color: selectedRegion === r ? palette.accent : palette.textMuted }}
                  >
                    {r}
                    {selectedRegion === r && <Check className="w-3.5 h-3.5" style={{ color: palette.accent }} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              {activeFilters > 0 && (
                <button onClick={clearFilters} className="text-[12px] font-light underline transition-opacity hover:opacity-60" style={{ color: palette.accent }}>
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── EXPANDED FILTERS PANEL ─── */}
        {filterOpen && (
          <div className="animate-in slide-in-from-top-2 duration-300" style={{ background: palette.white, borderTop: `1px solid ${palette.border}` }}>
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Status */}
                <div>
                  <label className="text-[11px] tracking-[0.15em] uppercase font-normal block mb-3" style={{ color: palette.textLight }}>Status</label>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedStatus(s)}
                        className="text-[12px] font-light px-3 py-1.5 transition-all duration-300"
                        style={{
                          border: `1px solid ${selectedStatus === s ? palette.accent : palette.border}`,
                          background: selectedStatus === s ? palette.accent : "transparent",
                          color: selectedStatus === s ? "#fff" : palette.textMuted,
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div>
                  <label className="text-[11px] tracking-[0.15em] uppercase font-normal block mb-3" style={{ color: palette.textLight }}>Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      placeholder="Min"
                      className="flex-1 px-3 py-2 text-[13px] font-light focus:outline-none"
                      style={{ border: `1px solid ${palette.border}`, background: palette.bgAlt, color: palette.text }}
                    />
                    <span className="self-center text-sm" style={{ color: palette.textLight }}>—</span>
                    <input
                      type="text"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      placeholder="Max"
                      className="flex-1 px-3 py-2 text-[13px] font-light focus:outline-none"
                      style={{ border: `1px solid ${palette.border}`, background: palette.bgAlt, color: palette.text }}
                    />
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="text-[11px] tracking-[0.15em] uppercase font-normal block mb-3" style={{ color: palette.textLight }}>Bedrooms</label>
                  <div className="flex gap-1.5">
                    {["Any", "2+", "3+", "4+", "5+", "6+"].map((b) => (
                      <button
                        key={b}
                        onClick={() => setBedsMin(b)}
                        className="flex-1 py-2 text-[12px] font-light transition-all duration-300"
                        style={{
                          border: `1px solid ${bedsMin === b ? palette.accent : palette.border}`,
                          background: bedsMin === b ? palette.accent : "transparent",
                          color: bedsMin === b ? "#fff" : palette.textMuted,
                        }}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick presets */}
                <div>
                  <label className="text-[11px] tracking-[0.15em] uppercase font-normal block mb-3" style={{ color: palette.textLight }}>Quick Filters</label>
                  <div className="flex flex-wrap gap-2">
                    {["Sea Views", "Pool", "New Build", "Beachfront"].map((f) => (
                      <button key={f} className="text-[12px] font-light px-3 py-1.5 transition-all duration-300 hover:border-[#8B6F47]/40" style={{ border: `1px solid ${palette.border}`, color: palette.textMuted }}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ─── RESULTS BAR ─── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-5 flex items-center justify-between">
        <p className="text-[14px] font-light" style={{ color: palette.textMuted }}>
          <span className="font-normal" style={{ color: palette.text }}>{filtered.length}</span> properties found
        </p>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="hidden sm:flex items-center gap-0.5 p-0.5" style={{ border: `1px solid ${palette.border}` }}>
            <button onClick={() => setViewMode("list")} className="p-1.5 transition-all duration-200" style={{ background: viewMode === "list" ? palette.accent : "transparent", color: viewMode === "list" ? "#fff" : palette.textLight }}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("grid")} className="p-1.5 transition-all duration-200" style={{ background: viewMode === "grid" ? palette.accent : "transparent", color: viewMode === "grid" ? "#fff" : palette.textLight }}>
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-1.5 text-[13px] tracking-[0.05em] font-light px-4 py-2 transition-all duration-300"
              style={{ border: `1px solid ${palette.border}`, color: palette.textMuted }}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{SORT_OPTIONS.find(o => o.value === sortBy)?.label}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {sortOpen && (
              <div className="absolute top-full right-0 mt-1.5 py-1 min-w-[220px] z-50 shadow-lg" style={{ background: palette.white, border: `1px solid ${palette.border}` }}>
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                    className="flex items-center justify-between w-full px-4 py-2.5 text-[13px] font-light transition-colors hover:bg-[#F7F4EF]"
                    style={{ color: sortBy === opt.value ? palette.accent : palette.textMuted }}
                  >
                    {opt.label}
                    {sortBy === opt.value && <Check className="w-3.5 h-3.5" style={{ color: palette.accent }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── PROPERTY LIST ─── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pb-20">
        {filtered.length === 0 ? (
          <FadeIn>
            <div className="text-center py-20">
              <p className="text-xl font-extralight mb-2" style={{ fontFamily: font.heading, color: palette.textMuted }}>No properties match your criteria</p>
              <button onClick={clearFilters} className="text-[13px] font-light underline" style={{ color: palette.accent }}>Clear all filters</button>
            </div>
          </FadeIn>
        ) : viewMode === "list" ? (
          <div className="space-y-5">
            {filtered.map((p, i) => (
              <FadeIn key={p.id} delay={i * 0.05}>
                <article
                  className="group cursor-pointer transition-all duration-500 overflow-hidden"
                  style={{ background: palette.cardBg, border: `1px solid ${palette.border}` }}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="w-full md:w-[380px] lg:w-[440px] shrink-0 relative overflow-hidden aspect-[16/11] md:aspect-auto">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.04] absolute inset-0" />
                      {/* Overlays */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        {p.isNew && (
                          <span className="text-[10px] tracking-[0.15em] uppercase font-normal px-3 py-1 text-white" style={{ background: palette.accent }}>New</span>
                        )}
                        <span className="text-[10px] tracking-[0.1em] font-light px-2.5 py-1 text-white" style={{ background: "rgba(45,41,38,0.65)", backdropFilter: "blur(8px)" }}>
                          {p.status}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(p.id); }}
                          className="w-9 h-9 flex items-center justify-center transition-all duration-300"
                          style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)" }}
                        >
                          <Heart className={`w-4 h-4 ${favorites.has(p.id) ? "fill-red-500 text-red-500" : ""}`} style={{ color: favorites.has(p.id) ? undefined : palette.textMuted }} />
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[11px] font-light text-white px-2 py-1" style={{ background: "rgba(45,41,38,0.6)", backdropFilter: "blur(8px)" }}>
                          <Camera className="w-3 h-3" /> {p.photoCount}
                        </span>
                        {p.hasVideo && (
                          <span className="flex items-center gap-1 text-[11px] font-light text-white px-2 py-1" style={{ background: "rgba(45,41,38,0.6)", backdropFilter: "blur(8px)" }}>
                            <Play className="w-3 h-3" /> Video
                          </span>
                        )}
                        {p.has360 && (
                          <span className="flex items-center gap-1 text-[11px] font-light text-white px-2 py-1" style={{ background: "rgba(45,41,38,0.6)", backdropFilter: "blur(8px)" }}>
                            <Eye className="w-3 h-3" /> 360°
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 p-5 sm:p-6 lg:p-8 flex flex-col justify-between">
                      <div>
                        {/* Ref + Type */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] tracking-[0.15em] uppercase font-light" style={{ color: palette.textLight }}>{p.ref}</span>
                            <span className="w-px h-3" style={{ background: palette.border }} />
                            <span className="text-[11px] tracking-[0.1em] uppercase font-light" style={{ color: palette.textLight }}>{p.type}</span>
                            {p.style && (
                              <>
                                <span className="w-px h-3 hidden sm:block" style={{ background: palette.border }} />
                                <span className="text-[11px] tracking-[0.05em] italic font-light hidden sm:inline" style={{ color: palette.textLight }}>{p.style}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: palette.accent }} />
                          <span className="text-[13px] tracking-[0.08em] uppercase font-light" style={{ color: palette.textMuted }}>{p.location}</span>
                        </div>

                        {/* Name */}
                        <h2 className="text-xl sm:text-2xl font-extralight tracking-[0.04em] mb-3 group-hover:opacity-70 transition-opacity duration-500" style={{ fontFamily: font.heading }}>
                          {p.name}
                        </h2>

                        {/* Description */}
                        <p className="text-[14px] leading-[1.8] font-light line-clamp-2 mb-5 hidden sm:block" style={{ color: palette.textMuted }}>
                          {p.description}
                        </p>

                        {/* Specs strip */}
                        <div className="flex items-center gap-5 sm:gap-8">
                          <div className="text-center">
                            <p className="text-[11px] tracking-[0.12em] uppercase font-normal mb-1" style={{ color: palette.textLight }}>Beds</p>
                            <p className="text-lg font-extralight" style={{ fontFamily: font.heading }}>{p.beds}</p>
                          </div>
                          <div className="w-px h-8" style={{ background: palette.border }} />
                          <div className="text-center">
                            <p className="text-[11px] tracking-[0.12em] uppercase font-normal mb-1" style={{ color: palette.textLight }}>Baths</p>
                            <p className="text-lg font-extralight" style={{ fontFamily: font.heading }}>{p.baths}</p>
                          </div>
                          <div className="w-px h-8" style={{ background: palette.border }} />
                          <div className="text-center">
                            <p className="text-[11px] tracking-[0.12em] uppercase font-normal mb-1" style={{ color: palette.textLight }}>Built</p>
                            <p className="text-lg font-extralight" style={{ fontFamily: font.heading }}>{p.sqm.toLocaleString()} <span className="text-sm">m²</span></p>
                          </div>
                          {p.plot && (
                            <>
                              <div className="w-px h-8 hidden sm:block" style={{ background: palette.border }} />
                              <div className="text-center hidden sm:block">
                                <p className="text-[11px] tracking-[0.12em] uppercase font-normal mb-1" style={{ color: palette.textLight }}>Plot</p>
                                <p className="text-lg font-extralight" style={{ fontFamily: font.heading }}>{p.plot.toLocaleString()} <span className="text-sm">m²</span></p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Price row */}
                      <div className="flex items-center justify-between mt-6 pt-5" style={{ borderTop: `1px solid ${palette.border}` }}>
                        <p className="text-2xl sm:text-3xl font-extralight tracking-[0.02em]" style={{ fontFamily: font.heading, color: palette.accent }}>
                          {p.price}
                        </p>
                        <span className="text-[12px] tracking-[0.15em] uppercase font-light flex items-center gap-1.5 transition-all duration-300 group-hover:gap-3" style={{ color: palette.accent }}>
                          View Details <ArrowUpRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        ) : (
          /* ─── GRID VIEW ─── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filtered.map((p, i) => (
              <FadeIn key={p.id} delay={i * 0.06}>
                <article className="group cursor-pointer" style={{ background: palette.cardBg, border: `1px solid ${palette.border}` }}>
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.06]" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      {p.isNew && (
                        <span className="text-[10px] tracking-[0.15em] uppercase font-normal px-3 py-1 text-white" style={{ background: palette.accent }}>New</span>
                      )}
                      <span className="text-[10px] tracking-[0.1em] font-light px-2.5 py-1 text-white" style={{ background: "rgba(45,41,38,0.65)", backdropFilter: "blur(8px)" }}>
                        {p.status}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(p.id); }}
                        className="w-8 h-8 flex items-center justify-center transition-all duration-300"
                        style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)" }}
                      >
                        <Heart className={`w-3.5 h-3.5 ${favorites.has(p.id) ? "fill-red-500 text-red-500" : ""}`} style={{ color: favorites.has(p.id) ? undefined : palette.textMuted }} />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                      <span className="flex items-center gap-1 text-[10px] font-light text-white px-2 py-0.5" style={{ background: "rgba(45,41,38,0.6)", backdropFilter: "blur(8px)" }}>
                        <Camera className="w-3 h-3" /> {p.photoCount}
                      </span>
                      {p.hasVideo && (
                        <span className="flex items-center gap-1 text-[10px] font-light text-white px-2 py-0.5" style={{ background: "rgba(45,41,38,0.6)", backdropFilter: "blur(8px)" }}>
                          <Play className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center" style={{ background: "rgba(45,41,38,0.3)" }}>
                      <span className="text-[11px] tracking-[0.18em] uppercase text-white border border-white/40 px-6 py-2.5 font-light">View</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] tracking-[0.12em] uppercase font-light" style={{ color: palette.textLight }}>{p.ref}</span>
                      <span className="w-px h-2.5" style={{ background: palette.border }} />
                      <span className="text-[10px] tracking-[0.08em] uppercase font-light" style={{ color: palette.textLight }}>{p.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <MapPin className="w-3 h-3" style={{ color: palette.accent }} />
                      <span className="text-[12px] tracking-[0.08em] uppercase font-light" style={{ color: palette.textMuted }}>{p.location}</span>
                    </div>
                    <h3 className="text-[17px] font-light tracking-wide mb-3 group-hover:opacity-70 transition-opacity" style={{ fontFamily: font.heading }}>{p.name}</h3>

                    <div className="flex items-center gap-4 text-[13px] font-light mb-4" style={{ color: palette.textMuted }}>
                      <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {p.beds}</span>
                      <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {p.baths}</span>
                      <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> {p.sqm} m²</span>
                    </div>

                    <div className="pt-4" style={{ borderTop: `1px solid ${palette.border}` }}>
                      <p className="text-xl font-extralight" style={{ fontFamily: font.heading, color: palette.accent }}>{p.price}</p>
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        )}
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <img src={prop2} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(45,41,38,0.7)" }} />
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-normal" style={{ color: palette.accent }}>Can't Find What You're Looking For?</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extralight text-white mb-4" style={{ fontFamily: font.heading, letterSpacing: "0.04em" }}>
              Let Us Search For You
            </h2>
            <p className="text-[15px] leading-[1.8] font-light mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
              Our team has access to exclusive listings and off-market properties not featured on our website. Share your requirements and we'll find your dream home.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="text-[13px] tracking-[0.18em] uppercase font-light px-10 py-4 transition-all duration-300 hover:opacity-90" style={{ background: palette.accent, color: "#fff" }}>
                Contact an Advisor
              </button>
              <button className="text-[13px] tracking-[0.18em] uppercase font-light px-10 py-4 transition-all duration-300 hover:bg-white/10" style={{ border: "1px solid rgba(255,255,255,0.35)", color: "#fff" }}>
                Register Interest
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: palette.footerBg }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
            <div>
              <span className="text-xl tracking-[0.4em] font-light block mb-1" style={{ fontFamily: font.brand, color: "#fff" }}>{BRAND}</span>
              <span className="text-[9px] tracking-[0.4em] uppercase font-light block mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>{BRAND_SUB}</span>
              <p className="text-sm leading-relaxed font-light" style={{ color: "rgba(255,255,255,0.5)" }}>
                Curating extraordinary homes for exceptional lives since 2010.
              </p>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase mb-5 font-normal" style={{ color: "rgba(255,255,255,0.5)" }}>Quick Links</h4>
              <ul className="space-y-3">
                {["Properties", "Off-Market", "New Developments", "About Us", "Contact"].map((l) => (
                  <li key={l}><a href="#" className="text-sm font-light transition-colors duration-300 hover:text-white" style={{ color: "rgba(255,255,255,0.55)" }}>{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase mb-5 font-normal" style={{ color: "rgba(255,255,255,0.5)" }}>Contact</h4>
              <ul className="space-y-3 text-sm font-light" style={{ color: "rgba(255,255,255,0.55)" }}>
                <li>hello@prestigeestates.com</li>
                <li>+34 600 000 000</li>
                <li>Marbella, Spain</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase mb-5 font-normal" style={{ color: "rgba(255,255,255,0.5)" }}>Follow</h4>
              <div className="flex gap-3">
                {[Instagram, Linkedin, MessageCircle].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 flex items-center justify-center transition-all duration-300 hover:border-white/30" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.55)" }}>
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-14 pt-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-xs tracking-[0.15em] font-light" style={{ color: "rgba(255,255,255,0.3)" }}>© 2026 {BRAND}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home2PropertiesPage;
