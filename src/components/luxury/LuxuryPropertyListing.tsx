import { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronRight, Bed, Bath, Maximize, MapPin, Heart, Mail, Eye, Mountain, Waves as WavesIcon, Trees, Flower2, Car, Home, Dumbbell, Wine, Tv, ThermometerSun, Lock, Fence } from "lucide-react";
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

/* ─── Filter Dropdown Hook ─── */
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

/* ─── Filter Dropdown Components ─── */
const TYPE_OPTIONS = [
  { label: "Villa", sub: "All types" },
  { label: "Penthouse", sub: "All types" },
  { label: "Apartment", sub: "All types" },
  { label: "Finca", sub: null },
  { label: "Land", sub: null },
  { label: "New Build", sub: null },
];

const AMENITY_GROUPS = [
  { title: "View", items: ["Panoramic View", "Sea View", "Mountain View", "Golf View"] },
  { title: "Outdoor", items: ["Garden", "Pool", "Terrace", "Garage", "Balcony", "Private Beach"] },
  { title: "Indoor", items: ["Air Conditioning", "Fireplace", "Gym", "Wine Cellar", "Cinema", "Elevator", "Jacuzzi", "Sauna", "Smart Home"] },
];

const TypeDropdown = () => {
  const { open, setOpen, ref } = useDropdown();
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (v: string) => setSelected((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);
  return (
    <div ref={ref} className="relative shrink-0">
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-1 border text-[12px] px-4 py-1.5 rounded-full transition-all duration-200 shrink-0 ${selected.length > 0 ? "border-luxury-black bg-luxury-black text-white" : "border-neutral-200 text-luxury-black/65 hover:border-luxury-black/30"}`}>
        Type {selected.length > 0 && <span className="bg-white text-luxury-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">{selected.length}</span>} <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-neutral-200 rounded-sm shadow-lg w-[300px] py-2 z-50">
          {TYPE_OPTIONS.map((t) => (
            <label key={t.label} className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={selected.includes(t.label)} onChange={() => toggle(t.label)} className="w-4 h-4 border-neutral-300 rounded-sm accent-luxury-black" />
                <span className="text-[14px] text-luxury-black/80">{t.label}</span>
              </div>
              {t.sub && <span className="text-[12px] text-luxury-black/35 flex items-center gap-1">{t.sub} <ChevronDown className="w-3 h-3" /></span>}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const PriceDropdown = () => {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div ref={ref} className="relative shrink-0">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1 border border-neutral-200 text-[12px] text-luxury-black/65 px-4 py-1.5 rounded-full hover:border-luxury-black/30 transition-all duration-200">
        Price <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-neutral-200 rounded-sm shadow-lg w-[340px] p-5 z-50">
          <div className="mb-4">
            <div className="w-full h-1 bg-luxury-black rounded-full relative">
              <div className="absolute -left-1 -top-1.5 w-4 h-4 bg-white border-2 border-luxury-black rounded-full cursor-pointer" />
              <div className="absolute -right-1 -top-1.5 w-4 h-4 bg-white border-2 border-luxury-black rounded-full cursor-pointer" />
            </div>
          </div>
          <div className="flex gap-3 mb-3">
            <div className="flex-1 relative">
              <input type="text" placeholder="€ No Min" className="w-full border border-neutral-200 px-3 py-2.5 text-[13px] text-luxury-black focus:outline-none focus:border-luxury-black/30" />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-luxury-black/25 hover:text-luxury-black/50"><X className="w-3.5 h-3.5" /></button>
            </div>
            <div className="flex-1 relative">
              <input type="text" placeholder="€ No Max" className="w-full border border-neutral-200 px-3 py-2.5 text-[13px] text-luxury-black focus:outline-none focus:border-luxury-black/30" />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-luxury-black/25 hover:text-luxury-black/50"><X className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 border-neutral-300 rounded-sm accent-luxury-black" />
            <span className="text-[13px] text-luxury-black/70">Hide "Price on Request" listings</span>
          </label>
        </div>
      )}
    </div>
  );
};

const BedsDropdown = () => {
  const { open, setOpen, ref } = useDropdown();
  const [selected, setSelected] = useState("Any");
  return (
    <div ref={ref} className="relative shrink-0">
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-1 border text-[12px] px-4 py-1.5 rounded-full transition-all duration-200 ${selected !== "Any" ? "border-luxury-black bg-luxury-black text-white" : "border-neutral-200 text-luxury-black/65 hover:border-luxury-black/30"}`}>
        Beds {selected !== "Any" && <span className="text-[10px]">{selected}</span>} <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-neutral-200 rounded-sm shadow-lg w-[320px] p-5 z-50">
          <div className="flex gap-1">
            {["Any", "1+", "2+", "3+", "4+", "5+"].map((b) => (
              <button key={b} onClick={() => setSelected(b)} className={`flex-1 py-2 text-[13px] border transition-all duration-200 ${selected === b ? "bg-luxury-black text-white border-luxury-black" : "border-neutral-200 text-luxury-black/60 hover:border-luxury-black/30"}`}>
                {b}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2.5 mt-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 border-neutral-300 rounded-sm accent-luxury-black" />
            <span className="text-[13px] text-luxury-black/70">Use exact match</span>
          </label>
        </div>
      )}
    </div>
  );
};

const AmenitiesDropdown = () => {
  const { open, setOpen, ref } = useDropdown();
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (v: string) => setSelected((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);
  return (
    <div ref={ref} className="relative shrink-0">
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-1 border text-[12px] px-4 py-1.5 rounded-full transition-all duration-200 ${selected.length > 0 ? "border-luxury-black bg-luxury-black text-white" : "border-neutral-200 text-luxury-black/65 hover:border-luxury-black/30"}`}>
        Amenities {selected.length > 0 && <span className="bg-white text-luxury-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">{selected.length}</span>} <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-neutral-200 rounded-sm shadow-lg w-[480px] max-h-[420px] overflow-y-auto p-5 z-50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] text-luxury-black/40 uppercase tracking-wide">Select amenities</span>
            {selected.length > 0 && <button onClick={() => setSelected([])} className="text-[12px] text-luxury-black/50 hover:text-luxury-black">Clear all</button>}
          </div>
          {AMENITY_GROUPS.map((group) => (
            <div key={group.title} className="mb-5 last:mb-0">
              <h4 className="text-[14px] font-medium text-luxury-black mb-3">{group.title}</h4>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => toggle(item)}
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

const NewBuildsChip = () => {
  const [active, setActive] = useState(false);
  return (
    <button
      onClick={() => setActive(!active)}
      className={`text-[12px] px-4 py-1.5 rounded-full transition-all duration-200 shrink-0 border ${active ? "border-luxury-black bg-luxury-black text-white" : "border-neutral-200 text-luxury-black/65 hover:border-luxury-black/30"}`}
    >
      New Builds
    </button>
  );
};

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
  const [selectedLocations, setSelectedLocations] = useState<{ id: string; name: string; path: string; type: string }[]>([]);

  return (
    <div className="flex-1 overflow-auto bg-white text-luxury-black font-sans">

      {/* ─── NAVBAR (white, same as landing scrolled state) ─── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-[1400px] mx-auto grid grid-cols-3 items-center px-6 lg:px-10 h-[68px]">
          {/* Left: Globe + nav links */}
          <div className="hidden lg:flex items-center gap-8">
            <button className="text-luxury-black/50 hover:text-luxury-black transition-colors duration-300">
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
            </button>
            {NAV_LEFT.map((l) => (
              <a key={l} href={l === "Home" ? "/" : l === "Properties" ? "/properties" : "#"} className="text-[11px] tracking-[0.18em] uppercase font-normal text-luxury-black/60 hover:text-luxury-black transition-colors duration-300">{l}</a>
            ))}
          </div>
          <div className="lg:hidden" />

          {/* Center logo */}
          <a href="/" className="flex flex-col items-center justify-center">
            <span className="font-serif text-lg md:text-xl tracking-[0.3em] font-light text-luxury-black">{BRAND_NAME}</span>
            <span className="text-[7px] tracking-[0.35em] uppercase font-light text-luxury-black/40">Real Estate</span>
          </a>

          {/* Right: nav links + mobile menu */}
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
          <div className="flex items-center gap-1.5 pt-3 pb-2 text-[11px] text-luxury-black/45 font-light">
            <a href="/" className="hover:text-luxury-black transition-colors">Home</a>
            <ChevronRight className="w-3 h-3" />
            <a href="/properties" className="hover:text-luxury-black transition-colors">Properties</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-luxury-black/70">Ibiza & Costa Blanca</span>
          </div>

          {/* Search + filter chips row */}
          <div className="flex items-center gap-3 pb-3">
            {/* Search */}
            <div className="hidden md:flex items-center shrink-0">
              <LocationSearchDropdown
                selected={selectedLocations}
                onSelectedChange={setSelectedLocations}
                className="w-[420px]"
              />
            </div>

            <div className="w-px h-5 bg-neutral-200 hidden md:block shrink-0" />

            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-1.5 bg-luxury-black text-white text-[12px] px-4 py-1.5 rounded-full hover:bg-luxury-black/85 transition-all duration-200 shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </button>
            <TypeDropdown />
            <PriceDropdown />
            <BedsDropdown />
            <AmenitiesDropdown />
            <NewBuildsChip />
            <button className="flex items-center gap-1.5 border border-neutral-300 text-[12px] text-luxury-black/50 px-4 py-1.5 rounded-full hover:border-luxury-black/30 transition-all duration-200 shrink-0">
              <Search className="w-3 h-3" /> Save search
            </button>
          </div>
        </div>
      </div>

      {/* ─── FILTER SIDEBAR ─── */}
      <FilterSidebar open={filtersOpen} onClose={() => setFiltersOpen(false)} />

      {/* ─── RESULTS ─── */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {/* Selected location chips */}
            {selectedLocations.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {selectedLocations.map((loc) => (
                  <span
                    key={loc.id}
                    className="inline-flex items-center gap-1.5 bg-neutral-100 text-luxury-black text-[12px] font-medium rounded-full pl-3 pr-2 py-1.5 whitespace-nowrap"
                  >
                    {loc.name}
                    <button
                      onClick={() => setSelectedLocations((prev) => prev.filter((s) => s.id !== loc.id))}
                      className="text-luxury-black/40 hover:text-luxury-black/70 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setSelectedLocations([])}
                  className="text-[11px] text-luxury-black/40 hover:text-luxury-black/70 underline transition-colors ml-1"
                >
                  Clear all
                </button>
              </div>
            )}
            <h1 className="text-xl md:text-2xl font-light text-luxury-black font-serif tracking-tight">Luxury Homes in Ibiza & Costa Blanca</h1>
            <p className="text-[13px] text-luxury-black/55 font-light mt-2 max-w-3xl leading-relaxed">
              Discover the finest selection of luxury villas, penthouses, fincas and new-build properties across Ibiza and the Costa Blanca. From beachfront estates with panoramic sea views to exclusive golf-side residences, explore hand-picked homes curated for the most discerning buyers.
            </p>
            <p className="text-[12px] text-luxury-black/45 font-light mt-2">{PROPERTIES.length} listings</p>
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

      {/* ─── NEWSLETTER (horizontal) ─── */}
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
