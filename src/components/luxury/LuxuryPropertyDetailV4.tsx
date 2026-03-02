import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import {
  Bed, Bath, Maximize, MapPin, Heart, Share2, ChevronLeft, ChevronRight,
  X, Check, Car, Fence, Phone, Mail, Play, View, FileDown,
  ChevronDown, CalendarDays, ArrowRight, ArrowLeft,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import LuxuryPhoneInput from "./LuxuryPhoneInput";
import LuxuryMortgageCalculatorV3 from "./LuxuryMortgageCalculatorV3";
import LuxuryNearbyPlaces from "./LuxuryNearbyPlaces";
import heroImg from "@/assets/luxury-hero.jpg";
import prop1 from "@/assets/luxury-property-1.jpg";
import prop2 from "@/assets/luxury-property-2.jpg";
import prop3 from "@/assets/luxury-property-3.jpg";
import detail1 from "@/assets/property-detail-1.jpg";
import detail2 from "@/assets/property-detail-2.jpg";
import detail3 from "@/assets/property-detail-3.jpg";
import detail4 from "@/assets/property-detail-4.jpg";
import detail5 from "@/assets/property-detail-5.jpg";

/* ─── Home 2 palette ─── */
const p = {
  bg: "#FAF8F5",
  bgAlt: "#F0ECE6",
  text: "#2D2926",
  textMuted: "#6B6560",
  textLight: "#9A938B",
  accent: "#8B6F47",
  accentDark: "#6E5636",
  border: "#E2DCD4",
  white: "#FFFFFF",
  dark: "#2D2926",
};

/* ─── Data ─── */
const PROPERTY = {
  title: "Stunning Contemporary Villa with Panoramic Sea Views",
  subtitle: "An architectural masterpiece on the Mediterranean coast",
  breadcrumb: ["Spain", "Balearic Islands", "Ibiza", "Santa Eulalia del Río"],
  price: "€4,650,000",
  originalPrice: "€5,200,000",
  rentalPrice: "€18,500/mes",
  alsoForRent: true,
  beds: 5, baths: 4, sqm: 420, plot: 1200, garage: 2, year: 2023,
  ref: "PE-IBZ-2847",
  energyClass: "A",
  hasVideo: true,
  hasVirtualTour: true,
  videoUrl: "#",
  virtualTourUrl: "#",
  images: [heroImg, detail1, detail2, detail3, detail4, detail5, prop1, prop2],
  description: `This exceptional contemporary villa is set on an elevated plot offering uninterrupted panoramic views of the Mediterranean Sea and the island of Formentera. Designed by a renowned architectural studio, the property seamlessly blends indoor and outdoor living across 420 m² of impeccably finished living space.

The ground floor features a grand open-plan living area with floor-to-ceiling windows, a designer kitchen with Gaggenau appliances, and direct access to the infinity pool terrace. The master suite occupies a private wing with a spa-inspired bathroom, walk-in dressing room, and a private terrace.

Upstairs, four additional en-suite bedrooms each enjoy their own terrace and sea views. The lower level houses a home cinema, wine cellar, gym, and staff quarters.`,
  features: [
    "Infinity Pool", "Sea Views", "Home Cinema", "Wine Cellar",
    "Gym", "Solar Panels", "Smart Home", "Underfloor Heating",
    "Air Conditioning", "Alarm System", "Double Garage", "Garden",
    "Terrace", "Staff Quarters", "Elevator", "Laundry Room",
  ],
  agent: {
    name: "Isabella Martínez",
    role: "Senior Property Advisor",
    phone: "+34 600 123 456",
    email: "isabella@prestigeestates.com",
  },
};

const SIMILAR = [
  { image: prop1, name: "Beachfront Villa Es Cubells", location: "Es Cubells, Ibiza", price: "€6,200,000", beds: 6, baths: 5, sqm: 580 },
  { image: prop2, name: "Modern Penthouse Marina Botafoch", location: "Marina Botafoch, Ibiza", price: "€3,100,000", beds: 3, baths: 3, sqm: 210 },
  { image: prop3, name: "Traditional Finca San Carlos", location: "San Carlos, Ibiza", price: "€5,800,000", beds: 7, baths: 6, sqm: 750 },
];

const BRAND = "PRESTIGE";

/* ─── FadeIn ─── */
const FadeIn = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s` }}>
      {children}
    </div>
  );
};

/* ─── Component ─── */
const LuxuryPropertyDetailV4 = () => {
  const [currentImg, setCurrentImg] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [expandDesc, setExpandDesc] = useState(false);
  const [wantVisit, setWantVisit] = useState(false);
  const [visitDate, setVisitDate] = useState<Date | undefined>();
  const [visitTime, setVisitTime] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => setScrolled(el.scrollTop > 40);
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const closeLightbox = () => setLightbox(null);
  const nextSlide = () => setLightbox((v) => (v !== null ? (v + 1) % PROPERTY.images.length : 0));
  const prevSlide = () => setLightbox((v) => (v !== null ? (v - 1 + PROPERTY.images.length) % PROPERTY.images.length : 0));

  const nextImg = () => setCurrentImg((v) => (v + 1) % PROPERTY.images.length);
  const prevImg = () => setCurrentImg((v) => (v - 1 + PROPERTY.images.length) % PROPERTY.images.length);

  return (
    <div ref={containerRef} className="flex-1 overflow-auto" style={{ background: p.bg, color: p.text, fontFamily: "'Jost', sans-serif" }}>

      {/* ─── STICKY NAV ─── */}
      <nav
        className="sticky top-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? `${p.white}ee` : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? `1px solid ${p.border}` : "1px solid transparent",
          marginBottom: scrolled ? 0 : "-72px",
        }}
      >
        <div className="max-w-[1320px] mx-auto flex items-center justify-between px-6 lg:px-10 h-[72px]">
          <a href="/" className="text-[13px] tracking-[0.3em] font-light uppercase transition-colors" style={{ color: scrolled ? p.text : "#fff" }}>
            {BRAND}
          </a>
          <div className="hidden md:flex items-center gap-8">
            {["Properties", "Rentals", "About", "Contact"].map((l) => (
              <a key={l} href="#" className="text-[12px] tracking-[0.12em] font-light transition-colors hover:opacity-60" style={{ color: scrolled ? p.textMuted : "rgba(255,255,255,0.8)" }}>{l}</a>
            ))}
          </div>
        </div>
      </nav>

      {/* ─── HERO IMAGE — single large with nav arrows ─── */}
      <section className="relative h-[50vh] md:h-[65vh] overflow-hidden cursor-pointer" onClick={() => setLightbox(currentImg)}>
        {PROPERTY.images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Property ${i + 1}`}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: i === currentImg ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30" />

        {/* Slide arrows */}
        <button onClick={(e) => { e.stopPropagation(); prevImg(); }} className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 transition-all">
          <ChevronLeft className="w-5 h-5" strokeWidth={1} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); nextImg(); }} className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 transition-all">
          <ChevronRight className="w-5 h-5" strokeWidth={1} />
        </button>

        {/* Counter */}
        <div className="absolute bottom-5 right-6 text-[11px] text-white/60 tracking-[0.15em] font-light">
          {currentImg + 1} / {PROPERTY.images.length}
        </div>

        {/* Media badges */}
        <div className="absolute bottom-5 left-6 flex gap-2">
          {PROPERTY.hasVideo && (
            <a href={PROPERTY.videoUrl} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-white/80 bg-white/10 backdrop-blur-sm px-3 py-2 hover:bg-white/20 transition-all">
              <Play className="w-3 h-3" fill="currentColor" /> Video
            </a>
          )}
          {PROPERTY.hasVirtualTour && (
            <a href={PROPERTY.virtualTourUrl} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-white/80 bg-white/10 backdrop-blur-sm px-3 py-2 hover:bg-white/20 transition-all">
              <View className="w-3 h-3" /> 360°
            </a>
          )}
        </div>
      </section>

      {/* ─── THUMBNAIL ROW ─── */}
      <div className="max-w-[1320px] mx-auto px-6 lg:px-10 py-4">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {PROPERTY.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentImg(i)}
              className={cn(
                "shrink-0 w-16 h-12 overflow-hidden transition-all",
                i === currentImg ? "opacity-100" : "opacity-50 hover:opacity-80"
              )}
              style={{ outline: i === currentImg ? `1px solid ${p.accent}` : "none" }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* ─── TITLE + PRICE BAR ─── */}
      <FadeIn>
        <section className="max-w-[1320px] mx-auto px-6 lg:px-10 pb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4 text-[12px] tracking-[0.08em]" style={{ color: p.textLight }}>
            {PROPERTY.breadcrumb.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span style={{ color: p.border }}>·</span>}
                <span className="hover:underline cursor-pointer">{c}</span>
              </span>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 pb-6" style={{ borderBottom: `1px solid ${p.border}` }}>
            <div className="max-w-2xl">
              <h1 className="text-[24px] md:text-[32px] font-extralight leading-[1.2] tracking-[0.01em]" style={{ color: p.text }}>
                {PROPERTY.title}
              </h1>
              <p className="text-[14px] font-light mt-2 flex items-center gap-1.5" style={{ color: p.textMuted }}>
                <MapPin className="w-3.5 h-3.5" style={{ color: p.accent }} />
                {PROPERTY.breadcrumb.join(", ")}
              </p>
            </div>

            <div className="flex items-end gap-6 shrink-0">
              <div className="text-right">
                <p className="text-[32px] md:text-[38px] font-extralight tracking-tight leading-none" style={{ color: p.text }}>
                  {PROPERTY.price}
                </p>
                {PROPERTY.alsoForRent && (
                  <p className="text-[13px] font-light mt-1" style={{ color: p.accent }}>
                    Also for rent · {PROPERTY.rentalPrice}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <button onClick={() => setLiked(!liked)} className="w-9 h-9 flex items-center justify-center transition-all" style={{ color: liked ? p.text : p.textLight }}>
                  <Heart className="w-[18px] h-[18px]" fill={liked ? "currentColor" : "none"} />
                </button>
                <button className="w-9 h-9 flex items-center justify-center" style={{ color: p.textLight }}>
                  <Share2 className="w-[18px] h-[18px]" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center" style={{ color: p.textLight }}>
                  <FileDown className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>
          </div>

          {/* Ref */}
          <p className="text-[11px] tracking-[0.15em] font-mono mt-3" style={{ color: p.textLight }}>REF: {PROPERTY.ref}</p>
        </section>
      </FadeIn>

      {/* ─── SPECS ROW — minimal ─── */}
      <FadeIn>
        <section className="max-w-[1320px] mx-auto px-6 lg:px-10 pb-10">
          <div className="flex flex-wrap gap-0" style={{ borderTop: `1px solid ${p.border}`, borderBottom: `1px solid ${p.border}` }}>
            {[
              { icon: Bed, label: "Bedrooms", value: String(PROPERTY.beds) },
              { icon: Bath, label: "Bathrooms", value: String(PROPERTY.baths) },
              { icon: Maximize, label: "Built", value: `${PROPERTY.sqm} m²` },
              { icon: Fence, label: "Plot", value: `${PROPERTY.plot} m²` },
              { icon: Car, label: "Garage", value: String(PROPERTY.garage) },
            ].map((s, i, arr) => (
              <div
                key={i}
                className="flex items-center gap-3 py-5 px-6"
                style={{ borderRight: i < arr.length - 1 ? `1px solid ${p.border}` : "none" }}
              >
                <s.icon className="w-4 h-4" style={{ color: p.accent }} strokeWidth={1.3} />
                <div>
                  <p className="text-[16px] font-light" style={{ color: p.text }}>{s.value}</p>
                  <p className="text-[10px] tracking-[0.18em] uppercase font-light" style={{ color: p.textLight }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ─── CONTENT + SIDEBAR ─── */}
      <section className="max-w-[1320px] mx-auto px-6 lg:px-10 pb-16">
        <div className="flex flex-col lg:flex-row gap-14">

          {/* Main */}
          <div className="flex-1 min-w-0 space-y-12">

            {/* Description */}
            <FadeIn>
              <div>
                <p className="text-[11px] tracking-[0.25em] uppercase font-medium mb-5" style={{ color: p.accent }}>
                  About This Property
                </p>
                <div
                  className={cn("text-[15px] leading-[2] font-light whitespace-pre-line", !expandDesc && "line-clamp-5")}
                  style={{ color: p.textMuted }}
                >
                  {PROPERTY.description}
                </div>
                <button
                  onClick={() => setExpandDesc(!expandDesc)}
                  className="flex items-center gap-1 mt-4 text-[11px] tracking-[0.12em] uppercase font-medium transition-colors hover:opacity-70"
                  style={{ color: p.accent }}
                >
                  {expandDesc ? "Show less" : "Read more"}
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", expandDesc && "rotate-180")} />
                </button>
              </div>
            </FadeIn>

            {/* Features */}
            <FadeIn>
              <div style={{ borderTop: `1px solid ${p.border}`, paddingTop: "2rem" }}>
                <p className="text-[11px] tracking-[0.25em] uppercase font-medium mb-5" style={{ color: p.accent }}>
                  Features
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-0">
                  {PROPERTY.features.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 py-2.5 text-[14px] font-light"
                      style={{ color: p.textMuted, borderBottom: `1px solid ${p.border}22` }}
                    >
                      <Check className="w-3 h-3 shrink-0" style={{ color: p.accent }} strokeWidth={2} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Map */}
            <FadeIn>
              <div style={{ borderTop: `1px solid ${p.border}`, paddingTop: "2rem" }}>
                <p className="text-[11px] tracking-[0.25em] uppercase font-medium mb-3" style={{ color: p.accent }}>
                  Location
                </p>
                <p className="text-[13px] font-light mb-4 flex items-center gap-1.5" style={{ color: p.textMuted }}>
                  <MapPin className="w-3.5 h-3.5" style={{ color: p.accent }} /> {PROPERTY.breadcrumb.join(" · ")}
                </p>
                <div className="h-[260px] flex items-center justify-center text-[14px] font-light" style={{ background: p.bgAlt, color: p.textLight }}>
                  <MapPin className="w-5 h-5 mr-2" /> Interactive Map
                </div>
              </div>
            </FadeIn>

            {/* Nearby & Mortgage */}
            <FadeIn><LuxuryNearbyPlaces /></FadeIn>
            <FadeIn><LuxuryMortgageCalculatorV3 /></FadeIn>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[360px] shrink-0">
            <div className="lg:sticky lg:top-[88px] space-y-5">

              {/* Advisor card */}
              <FadeIn delay={0.1}>
                <div className="p-7" style={{ background: p.white, border: `1px solid ${p.border}` }}>
                  {/* Agent */}
                  <div className="flex items-center gap-3 mb-5 pb-5" style={{ borderBottom: `1px solid ${p.border}` }}>
                    <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: p.dark }}>
                      <span className="text-[13px] font-light text-white tracking-wider">IM</span>
                    </div>
                    <div>
                      <p className="text-[15px] font-normal" style={{ color: p.text }}>{PROPERTY.agent.name}</p>
                      <p className="text-[12px] font-light" style={{ color: p.textLight }}>{PROPERTY.agent.role}</p>
                    </div>
                  </div>

                  <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                    <input type="text" placeholder="Full name" className="w-full px-4 py-3 text-[13px] font-light focus:outline-none transition-all" style={{ background: p.bgAlt, color: p.text, border: "none" }} />
                    <input type="email" placeholder="Email" className="w-full px-4 py-3 text-[13px] font-light focus:outline-none transition-all" style={{ background: p.bgAlt, color: p.text, border: "none" }} />
                    <LuxuryPhoneInput />
                    <textarea placeholder="I'm interested in this property..." rows={3} className="w-full px-4 py-3 text-[13px] font-light focus:outline-none transition-all resize-none" style={{ background: p.bgAlt, color: p.text, border: "none" }} />

                    <label className="flex items-center gap-2 cursor-pointer py-1">
                      <input type="checkbox" checked={wantVisit} onChange={(e) => setWantVisit(e.target.checked)} style={{ accentColor: p.accent }} />
                      <span className="text-[12px] font-light flex items-center gap-1.5" style={{ color: p.textMuted }}>
                        <CalendarDays className="w-3.5 h-3.5" style={{ color: p.accent }} />
                        Schedule a visit
                      </span>
                    </label>

                    {wantVisit && (
                      <div className="space-y-2 p-3" style={{ background: p.bgAlt }}>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button type="button" className={cn("w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-left font-light transition-all", !visitDate && "opacity-50")} style={{ background: p.white, border: `1px solid ${p.border}`, color: p.text }}>
                              <CalendarDays className="w-4 h-4 shrink-0" style={{ color: p.accent }} />
                              {visitDate ? format(visitDate, "PPP") : "Select a date"}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={visitDate} onSelect={setVisitDate} disabled={(d) => d < new Date()} initialFocus className="p-3 pointer-events-auto" />
                          </PopoverContent>
                        </Popover>
                        <select value={visitTime} onChange={(e) => setVisitTime(e.target.value)} className="w-full px-4 py-2.5 text-[13px] font-light appearance-none cursor-pointer focus:outline-none transition-all" style={{ background: p.white, border: `1px solid ${p.border}`, color: p.text }}>
                          <option value="" disabled>Select a time</option>
                          {["09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","16:00","16:30","17:00","17:30","18:00","18:30","19:00"].map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <label className="flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" className="mt-1" style={{ accentColor: p.accent }} />
                      <span className="text-[11px] font-light leading-relaxed" style={{ color: p.textLight }}>
                        I accept the <a href="#" className="underline">terms</a> and <a href="#" className="underline">privacy policy</a>.
                      </span>
                    </label>

                    <button type="submit" className="flex items-center justify-center gap-2 text-white text-[11px] tracking-[0.18em] uppercase py-3.5 w-full transition-all duration-300 font-light hover:opacity-90" style={{ background: p.dark }}>
                      <Mail className="w-4 h-4" /> {wantVisit ? "Request Visit" : "Send Enquiry"}
                    </button>
                  </form>

                  <a href={`tel:${PROPERTY.agent.phone}`} className="flex items-center justify-center gap-2 text-[11px] tracking-[0.15em] uppercase py-3 w-full mt-3 font-light transition-all hover:opacity-70" style={{ color: p.textMuted, border: `1px solid ${p.border}` }}>
                    <Phone className="w-3.5 h-3.5" /> Call Directly
                  </a>
                </div>
              </FadeIn>

              {/* Details */}
              <FadeIn delay={0.2}>
                <div className="p-6" style={{ background: p.white, border: `1px solid ${p.border}` }}>
                  <p className="text-[10px] tracking-[0.25em] uppercase font-medium mb-4" style={{ color: p.accent }}>Details</p>
                  {[
                    { label: "Year Built", value: String(PROPERTY.year) },
                    { label: "Energy Rating", value: PROPERTY.energyClass },
                    { label: "Reference", value: PROPERTY.ref },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5" style={{ borderBottom: `1px solid ${p.border}33` }}>
                      <span className="text-[12px] font-light" style={{ color: p.textLight }}>{item.label}</span>
                      <span className="text-[13px] font-light" style={{ color: p.text }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SIMILAR ─── */}
      <section className="py-16" style={{ background: p.white }}>
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
          <FadeIn>
            <p className="text-[11px] tracking-[0.3em] uppercase font-light mb-8" style={{ color: p.textLight }}>Similar Properties</p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SIMILAR.map((s, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <a href="#" className="group block">
                  <div className="relative overflow-hidden aspect-[16/11]">
                    <img src={s.image} alt={s.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  </div>
                  <div className="pt-4">
                    <p className="text-[22px] font-extralight tracking-tight" style={{ color: p.text }}>{s.price}</p>
                    <h3 className="text-[13px] font-normal uppercase tracking-[0.04em] mt-1" style={{ color: p.text }}>{s.name}</h3>
                    <p className="text-[12px] font-light flex items-center gap-1 mt-1" style={{ color: p.textLight }}>
                      <MapPin className="w-3 h-3" /> {s.location}
                    </p>
                    <div className="flex gap-4 mt-2 text-[11px] font-light" style={{ color: p.textLight }}>
                      <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {s.beds}</span>
                      <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {s.baths}</span>
                      <span className="flex items-center gap-1"><Maximize className="w-3 h-3" /> {s.sqm} m²</span>
                    </div>
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section style={{ background: p.dark }}>
        <div className="max-w-md mx-auto px-6 py-16 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase font-light mb-4" style={{ color: `${p.accent}99` }}>Newsletter</p>
          <h2 className="text-[24px] font-extralight text-white tracking-[0.02em]">Stay Informed</h2>
          <p className="text-[14px] font-light mt-4 mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
            Receive curated listings and market insights.
          </p>
          <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email" className="flex-1 px-4 py-3 text-[13px] font-light text-white focus:outline-none transition-colors" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
            <button type="submit" className="text-[10px] tracking-[0.2em] uppercase px-7 py-3 font-medium whitespace-nowrap transition-all hover:opacity-90" style={{ background: p.accent, color: p.white }}>Subscribe</button>
          </form>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: p.dark, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[12px] tracking-[0.35em] font-extralight uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>{BRAND}</span>
          <p className="text-[10px] tracking-wider font-light" style={{ color: "rgba(255,255,255,0.2)" }}>© 2025 {BRAND}. All rights reserved.</p>
        </div>
      </footer>

      {/* ─── LIGHTBOX ─── */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "rgba(10,10,10,0.97)" }} onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"><X className="w-5 h-5" strokeWidth={1} /></button>
          <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="absolute left-6 md:left-12 text-white/15 hover:text-white transition-colors"><ChevronLeft className="w-8 h-8" strokeWidth={0.8} /></button>
          <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="absolute right-6 md:right-12 text-white/15 hover:text-white transition-colors"><ChevronRight className="w-8 h-8" strokeWidth={0.8} /></button>
          <img src={PROPERTY.images[lightbox]} alt="" className="max-w-[90vw] max-h-[85vh] object-contain" onClick={(e) => e.stopPropagation()} />
          <p className="absolute bottom-6 text-white/15 text-[11px] font-light tracking-[0.2em]">{lightbox + 1} / {PROPERTY.images.length}</p>
        </div>
      )}
    </div>
  );
};

export default LuxuryPropertyDetailV4;
