import { useState } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, Bed, Bath, Maximize, MapPin, Heart, Mail } from "lucide-react";
import heroImg from "@/assets/luxury-hero.jpg";
import prop1 from "@/assets/luxury-property-1.jpg";
import prop2 from "@/assets/luxury-property-2.jpg";
import prop3 from "@/assets/luxury-property-3.jpg";
import detail1 from "@/assets/property-detail-1.jpg";
import detail2 from "@/assets/property-detail-2.jpg";
import detail3 from "@/assets/property-detail-3.jpg";

const BRAND_NAME = "PRESTIGE ESTATES";

const FILTER_CHIPS = ["Type", "Price", "Beds", "Amenities", "New Builds"];

const PROPERTIES = [
  {
    id: 1, image: heroImg, gallery: [heroImg, detail1, detail2],
    tag: "FOR SALE", location: "Santa Eulalia del Río · Ibiza",
    title: "STUNNING CONTEMPORARY VILLA WITH PANORAMIC SEA VIEWS",
    excerpt: "This exceptional contemporary villa is set on an elevated plot offering uninterrupted panoramic views of the Mediterranean Sea and the island of Formentera...",
    beds: 5, baths: 4, sqm: 420, price: "€4,650,000",
    features: ["Sea Views", "Infinity Pool", "Smart Home", "Garage"],
  },
  {
    id: 2, image: prop1, gallery: [prop1, detail3, heroImg],
    tag: "FOR SALE", location: "Marina Botafoch · Ibiza",
    title: "LUXURY PENTHOUSE WITH ROOFTOP TERRACE AND HARBOUR VIEWS",
    excerpt: "Exceptional penthouse located in the prestigious Marina Botafoch area, offering stunning views over Dalt Vila and the harbour. Features include a private rooftop terrace...",
    beds: 3, baths: 3, sqm: 210, price: "€3,100,000",
    features: ["Terrace", "Harbour Views", "Modern", "Elevator"],
  },
  {
    id: 3, image: prop2, gallery: [prop2, detail1, detail2],
    tag: "FOR SALE", location: "San José · Ibiza",
    title: "TRADITIONAL FINCA WITH MODERN RENOVATION AND PRIVATE POOL",
    excerpt: "A beautifully restored traditional Ibicencan finca set within 15,000 m² of private land with olive and almond trees. The property combines authentic character with contemporary luxury...",
    beds: 6, baths: 5, sqm: 480, price: "€5,800,000",
    features: ["Pool", "Garden", "Guest House", "Parking"],
  },
  {
    id: 4, image: prop3, gallery: [prop3, detail3, heroImg],
    tag: "FOR SALE", location: "Altea · Costa Blanca",
    title: "MODERN VILLA WITH INFINITY POOL OVERLOOKING THE MEDITERRANEAN",
    excerpt: "Architecturally striking villa perched on the hillside of Altea with sweeping views of the Mediterranean coastline. Floor-to-ceiling windows flood the interiors with natural light...",
    beds: 4, baths: 4, sqm: 350, price: "€2,950,000",
    features: ["Infinity Pool", "Sea Views", "Home Cinema", "Wine Cellar"],
  },
  {
    id: 5, image: detail1, gallery: [detail1, prop1, prop2],
    tag: "NEW BUILD", location: "Sant Antoni de Portmany · Ibiza",
    title: "MODERN IBIZA-STYLE FLAT WITH LARGE TERRACE",
    excerpt: "Modern Ibiza-style flat for sale in Sant Antoni de Portmany, offering a built area of approximately 70 m² and 54 m² of usable interior space. The property features a large terrace...",
    beds: 1, baths: 1, sqm: 70, price: "€530,000",
    features: ["Terrace", "Modern", "Community Pool", "Parking"],
  },
  {
    id: 6, image: detail2, gallery: [detail2, prop3, heroImg],
    tag: "FOR SALE", location: "Jávea · Costa Blanca",
    title: "FRONTLINE GOLF ESTATE WITH MOUNTAIN AND SEA VIEWS",
    excerpt: "Impressive estate located on the frontline of a prestigious golf course in Jávea, offering dual views of the Montgó mountain and the Mediterranean Sea...",
    beds: 5, baths: 5, sqm: 520, price: "€3,750,000",
    features: ["Golf Views", "Pool", "Gym", "Staff Quarters"],
  },
];

/* ─── Filter Sidebar ─── */
const FilterSidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  if (!open) return null;

  return (
    <>
      {/* Overlay for mobile */}
      <div className="fixed inset-0 bg-luxury-black/30 z-40 lg:hidden" onClick={onClose} />

      <aside className="fixed top-0 left-0 h-full w-[300px] bg-white z-50 overflow-y-auto border-r border-neutral-200 shadow-lg lg:shadow-none animate-in slide-in-from-left duration-300">
        <div className="flex items-center justify-between p-5 border-b border-neutral-200">
          <h2 className="text-[15px] font-medium text-luxury-black">Filters</h2>
          <button onClick={onClose} className="text-luxury-black/50 hover:text-luxury-black transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-7">
          {/* Property type */}
          <div>
            <h3 className="text-[13px] font-medium text-luxury-black mb-3">Property type</h3>
            <div className="space-y-2.5">
              {["Villa", "Penthouse", "Apartment", "Finca", "New Build", "Land"].map((t) => (
                <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 border-neutral-300 rounded-sm accent-luxury-black" />
                  <span className="text-[13px] text-luxury-black/70 group-hover:text-luxury-black transition-colors">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div>
            <h3 className="text-[13px] font-medium text-luxury-black mb-3">Price range</h3>
            <div className="flex gap-3">
              <input type="text" placeholder="€ No Min" className="w-full border border-neutral-200 px-3 py-2 text-[12px] text-luxury-black focus:outline-none focus:border-luxury-black/30" />
              <input type="text" placeholder="€ No Max" className="w-full border border-neutral-200 px-3 py-2 text-[12px] text-luxury-black focus:outline-none focus:border-luxury-black/30" />
            </div>
          </div>

          {/* Living area */}
          <div>
            <h3 className="text-[13px] font-medium text-luxury-black mb-3">Living area</h3>
            <div className="flex gap-3">
              <input type="text" placeholder="No Min" className="w-full border border-neutral-200 px-3 py-2 text-[12px] text-luxury-black focus:outline-none focus:border-luxury-black/30" />
              <input type="text" placeholder="No Max" className="w-full border border-neutral-200 px-3 py-2 text-[12px] text-luxury-black focus:outline-none focus:border-luxury-black/30" />
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <h3 className="text-[13px] font-medium text-luxury-black mb-3">Bedrooms</h3>
            <div className="flex gap-1.5">
              {["Any", "1+", "2+", "3+", "4+", "5+"].map((b, i) => (
                <button key={b} className={`px-3.5 py-1.5 text-[12px] border transition-all duration-200 ${i === 0 ? "bg-luxury-black text-white border-luxury-black" : "border-neutral-200 text-luxury-black/60 hover:border-luxury-black/30"}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <h3 className="text-[13px] font-medium text-luxury-black mb-3">Bathrooms</h3>
            <div className="flex gap-1.5">
              {["Any", "1+", "2+", "3+", "4+"].map((b, i) => (
                <button key={b} className={`px-3.5 py-1.5 text-[12px] border transition-all duration-200 ${i === 0 ? "bg-luxury-black text-white border-luxury-black" : "border-neutral-200 text-luxury-black/60 hover:border-luxury-black/30"}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-[13px] font-medium text-luxury-black mb-3">Amenities</h3>
            <div className="space-y-2.5">
              {["Sea Views", "Pool", "Garden", "Garage", "Terrace", "Smart Home", "Gym", "Wine Cellar"].map((a) => (
                <label key={a} className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 border-neutral-300 rounded-sm accent-luxury-black" />
                  <span className="text-[13px] text-luxury-black/70 group-hover:text-luxury-black transition-colors">{a}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-neutral-200 bg-white p-4 flex gap-3">
          <button className="text-[12px] text-luxury-black/50 hover:text-luxury-black transition-colors font-light">Clear all</button>
          <button className="flex-1 bg-luxury-black text-white text-[12px] tracking-[0.1em] uppercase py-2.5 hover:bg-luxury-black/85 transition-all duration-300">
            Show results
          </button>
        </div>
      </aside>
    </>
  );
};

/* ─── Property Card (horizontal) ─── */
const PropertyCard = ({ property }: { property: typeof PROPERTIES[0] }) => {
  const [liked, setLiked] = useState(false);

  return (
    <a href={`/property/${property.id}`} className="group grid grid-cols-1 md:grid-cols-12 gap-0 bg-neutral-50 border border-neutral-200 rounded-sm overflow-hidden mb-6 hover:shadow-md transition-shadow duration-300">
      {/* Image */}
      <div className="md:col-span-5 relative overflow-hidden aspect-[16/10] md:aspect-auto md:h-full min-h-[220px]">
        <img src={property.image} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 absolute inset-0" />
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${liked ? "bg-luxury-black text-white" : "bg-white/90 text-luxury-black/40 hover:text-luxury-black"}`}
        >
          <Heart className="w-4 h-4" fill={liked ? "currentColor" : "none"} />
        </button>
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
            <span className="text-[10px] tracking-[0.18em] uppercase border border-luxury-black/20 text-luxury-black/60 px-2.5 py-1 font-medium">{property.tag}</span>
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
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex-1 overflow-auto bg-white text-luxury-black font-sans">

      {/* ─── NAV ─── */}
      <nav className="sticky top-0 z-30 bg-white border-b border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {/* Top row */}
          <div className="flex items-center justify-between h-[56px]">
            <div className="flex items-center gap-6">
              <button className="text-luxury-black/60 hover:text-luxury-black transition-colors lg:hidden">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <a href="/" className="font-serif text-base tracking-[0.25em] text-luxury-black font-light">{BRAND_NAME}</a>
            </div>

            {/* Search bar center */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-black/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="City, Region, Country"
                  className="w-full border border-neutral-200 rounded-full pl-10 pr-4 py-2 text-[13px] text-luxury-black placeholder:text-luxury-black/35 focus:outline-none focus:border-luxury-black/30 transition-colors"
                />
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-6">
              {["About", "Contact"].map((l) => (
                <a key={l} href="#" className="text-[12px] text-luxury-black/60 hover:text-luxury-black transition-colors">{l}</a>
              ))}
            </div>
          </div>

          {/* Filter chips row */}
          <div className="flex items-center gap-2 pb-3 overflow-x-auto">
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-1.5 bg-luxury-black text-white text-[12px] px-4 py-1.5 rounded-full hover:bg-luxury-black/85 transition-all duration-200 shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </button>
            {FILTER_CHIPS.map((chip) => (
              <button key={chip} className="flex items-center gap-1 border border-neutral-200 text-[12px] text-luxury-black/65 px-4 py-1.5 rounded-full hover:border-luxury-black/30 transition-all duration-200 shrink-0">
                {chip} <ChevronDown className="w-3 h-3" />
              </button>
            ))}
            <button className="flex items-center gap-1.5 border border-neutral-300 text-[12px] text-luxury-black/50 px-4 py-1.5 rounded-full hover:border-luxury-black/30 transition-all duration-200 shrink-0">
              <Search className="w-3 h-3" /> Save search
            </button>
          </div>
        </div>
      </nav>

      {/* ─── FILTER SIDEBAR ─── */}
      <FilterSidebar open={filtersOpen} onClose={() => setFiltersOpen(false)} />

      {/* ─── RESULTS ─── */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-light text-luxury-black font-serif tracking-tight">Luxury Homes in Ibiza & Costa Blanca</h1>
            <p className="text-[12px] text-luxury-black/45 font-light mt-1">{PROPERTIES.length} listings</p>
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
      </main>

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
