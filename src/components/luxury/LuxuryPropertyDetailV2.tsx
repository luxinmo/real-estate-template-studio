import { useState } from "react";
import {
  Bed, Bath, Maximize, MapPin, Heart, Share2, ChevronLeft, ChevronRight,
  X, Check, Car, Fence, Phone, Mail, ArrowLeft, Play, View, FileDown,
  Clock, Shield, Sparkles, ChevronDown,
} from "lucide-react";
import LuxuryPhoneInput from "./LuxuryPhoneInput";
import LuxuryMortgageCalculatorV2 from "./LuxuryMortgageCalculatorV2";
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

/* ─── Data ─── */
const PROPERTY = {
  title: "Stunning Contemporary Villa with Panoramic Sea Views",
  subtitle: "An architectural masterpiece on the Mediterranean coast",
  breadcrumb: ["Spain", "Balearic Islands", "Ibiza", "Santa Eulalia del Río"],
  price: "€4,650,000",
  originalPrice: "€5,200,000",
  discount: 11,
  beds: 5, baths: 4, sqm: 420, plot: 1200, garage: 2, year: 2023,
  ref: "PE-IBZ-2847",
  energyClass: "A",
  status: "Available",
  hasVideo: true,
  hasVirtualTour: true,
  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  virtualTourUrl: "https://my.matterport.com/example",
  images: [heroImg, detail1, detail2, detail3, detail4, detail5, prop1, prop2],
  description: `This exceptional contemporary villa is set on an elevated plot offering uninterrupted panoramic views of the Mediterranean Sea and the island of Formentera. Designed by a renowned architectural studio, the property seamlessly blends indoor and outdoor living across 420 m² of impeccably finished living space.

The ground floor features a grand open-plan living area with floor-to-ceiling windows, a designer kitchen with Gaggenau appliances, and direct access to the infinity pool terrace. The master suite occupies a private wing with a spa-inspired bathroom, walk-in dressing room, and a private terrace.

Upstairs, four additional en-suite bedrooms each enjoy their own terrace and sea views. The lower level houses a home cinema, wine cellar, gym, and staff quarters. Surrounded by mature Mediterranean gardens with automated irrigation, the property includes a double garage, solar panels, and state-of-the-art home automation.`,
  features: [
    "Infinity Pool", "Sea Views", "Home Cinema", "Wine Cellar",
    "Gym", "Solar Panels", "Smart Home", "Underfloor Heating",
    "Air Conditioning", "Alarm System", "Double Garage", "Garden",
    "Terrace", "Staff Quarters", "Elevator", "Laundry Room",
  ],
  highlights: [
    { icon: Shield, label: "Gated Community", detail: "24/7 security" },
    { icon: Sparkles, label: "Newly Built", detail: "Completed 2023" },
    { icon: Clock, label: "Turnkey", detail: "Move-in ready" },
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

const BRAND = "PRESTIGE ESTATES";

/* ─── Component ─── */
const LuxuryPropertyDetailV2 = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [expandDesc, setExpandDesc] = useState(false);

  const openLightbox = (i: number) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);
  const nextSlide = () => setLightbox((p) => (p !== null ? (p + 1) % PROPERTY.images.length : 0));
  const prevSlide = () => setLightbox((p) => (p !== null ? (p - 1 + PROPERTY.images.length) % PROPERTY.images.length : 0));

  return (
    <div className="flex-1 overflow-auto bg-[#FAFAF9] font-sans text-luxury-black">

      {/* ─── IMMERSIVE HERO ─── */}
      <section className="relative h-[55vh] md:h-[65vh] overflow-hidden cursor-pointer" onClick={() => openLightbox(0)}>
        <img src={PROPERTY.images[0]} alt="Property hero" className="w-full h-full object-cover" />
        {/* Top gradient — ensures nav readability even on white/cloudy skies */}
        <div className="absolute inset-x-0 top-0 h-[140px] bg-gradient-to-b from-luxury-black/60 via-luxury-black/25 to-transparent pointer-events-none" />
        {/* Bottom gradient for text */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/70 via-luxury-black/20 to-transparent" />

        {/* ─── NAV (over image) ─── */}
        <nav className="absolute top-0 inset-x-0 z-50">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 lg:px-10 h-[56px]">
            <a href="/" className="text-[14px] tracking-[0.4em] text-white/90 font-extralight uppercase">{BRAND}</a>
            <div className="hidden md:flex items-center gap-8">
              {["Properties", "Rentals", "About", "Contact"].map((l) => (
                <a key={l} href="#" className="text-[12px] tracking-[0.2em] uppercase text-white/65 hover:text-white transition-colors duration-300 font-light">{l}</a>
              ))}
            </div>
            <button className="md:hidden text-white/70">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </nav>

        {/* Hero overlay content */}
        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-10 pb-8 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 mb-3">
            {PROPERTY.breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2 text-[12px] tracking-[0.15em] uppercase text-white/60 font-light">
                {i > 0 && <span className="text-white/30">·</span>}
                {crumb}
              </span>
            ))}
          </div>
          <h1 className="text-[26px] md:text-[34px] lg:text-[40px] font-extralight text-white leading-[1.15] tracking-[0.02em] uppercase max-w-3xl">
            {PROPERTY.title}
          </h1>
          <p className="text-[14px] text-white/60 font-light mt-2 tracking-wide">{PROPERTY.subtitle}</p>
        </div>

        {/* Media badges */}
        <div className="absolute bottom-8 right-6 lg:right-10 flex gap-2">
          {PROPERTY.hasVideo && (
            <a href={PROPERTY.videoUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-white text-[11px] tracking-[0.12em] uppercase px-4 py-2.5 hover:bg-white/25 transition-all border border-white/10">
              <Play className="w-3 h-3" fill="currentColor" /> Video
            </a>
          )}
          {PROPERTY.hasVirtualTour && (
            <a href={PROPERTY.virtualTourUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-white text-[11px] tracking-[0.12em] uppercase px-4 py-2.5 hover:bg-white/25 transition-all border border-white/10">
              <View className="w-3 h-3" /> 360°
            </a>
          )}
        </div>
      </section>

      {/* ─── THUMBNAIL STRIP ─── */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 -mt-12 relative z-10">
        <div className="flex gap-1.5">
          {PROPERTY.images.slice(1, 6).map((img, i) => (
            <div key={i} className="relative overflow-hidden cursor-pointer group h-[72px] flex-1" onClick={() => openLightbox(i + 1)}>
              <img src={img} alt={`Photo ${i + 2}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 brightness-90 group-hover:brightness-100" />
              {i === 4 && PROPERTY.images.length > 6 && (
                <div className="absolute inset-0 bg-luxury-black/50 flex items-center justify-center">
                  <span className="text-white text-[12px] tracking-[0.1em] font-light">+{PROPERTY.images.length - 6}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── PRICE + ACTIONS BAR ─── */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-8 pb-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-baseline gap-3">
            <p className="text-[34px] md:text-[42px] font-extralight text-luxury-black tracking-tight leading-none">{PROPERTY.price}</p>
            <span className="text-[15px] text-luxury-black/50 line-through font-light">{PROPERTY.originalPrice}</span>
            <span className="text-[11px] font-medium tracking-[0.08em] uppercase text-luxury-gold bg-luxury-gold/10 px-2.5 py-1">-{PROPERTY.discount}%</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLiked(!liked)} className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${liked ? "bg-luxury-black text-white" : "bg-transparent text-luxury-black/50 hover:text-luxury-black border border-luxury-black/15"}`}>
              <Heart className="w-[18px] h-[18px]" fill={liked ? "currentColor" : "none"} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-luxury-black/50 hover:text-luxury-black border border-luxury-black/15 transition-all">
              <Share2 className="w-[18px] h-[18px]" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-luxury-black/50 hover:text-luxury-black border border-luxury-black/15 transition-all" title="Download PDF">
              <FileDown className="w-[18px] h-[18px]" />
            </button>
            <span className="ml-3 text-[12px] tracking-[0.12em] uppercase text-luxury-black/50 font-light">Ref: {PROPERTY.ref}</span>
          </div>
        </div>
      </section>

      {/* ─── SPECS RIBBON ─── */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-wrap items-center gap-0 border-y border-luxury-black/8">
          {[
            { icon: Bed, label: "Bedrooms", value: PROPERTY.beds },
            { icon: Bath, label: "Bathrooms", value: PROPERTY.baths },
            { icon: Maximize, label: "Built Area", value: `${PROPERTY.sqm} m²` },
            { icon: Fence, label: "Plot", value: `${PROPERTY.plot} m²` },
            { icon: Car, label: "Garage", value: PROPERTY.garage },
          ].map((s, i, arr) => (
            <div key={i} className={`flex items-center gap-3 py-4 px-5 ${i < arr.length - 1 ? "border-r border-luxury-black/8" : ""}`}>
              <s.icon className="w-[18px] h-[18px] text-luxury-gold/80" strokeWidth={1.2} />
              <div>
                <p className="text-[16px] font-light text-luxury-black">{s.value}</p>
                <p className="text-[11px] tracking-[0.15em] uppercase text-luxury-black/45 font-light">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HIGHLIGHTS ─── */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6">
        <div className="flex flex-wrap gap-3">
          {PROPERTY.highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-2.5 bg-luxury-black/[0.03] px-4 py-2.5">
              <h.icon className="w-4 h-4 text-luxury-gold/70" strokeWidth={1.3} />
              <div>
                <p className="text-[13px] font-normal text-luxury-black">{h.label}</p>
                <p className="text-[11px] text-luxury-black/50 font-light">{h.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CONTENT + SIDEBAR ─── */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-10">

            {/* Description */}
            <div>
              <p className="text-[13px] tracking-[0.22em] uppercase text-luxury-gold/90 font-normal mb-4">About This Property</p>
              <div className={`text-[15px] leading-[1.95] text-luxury-black font-normal whitespace-pre-line ${!expandDesc ? "line-clamp-6" : ""}`}>
                {PROPERTY.description}
              </div>
              <button
                onClick={() => setExpandDesc(!expandDesc)}
                className="flex items-center gap-1 mt-3 text-[12px] tracking-[0.12em] uppercase text-luxury-black/85 hover:text-luxury-black font-medium transition-colors"
              >
                {expandDesc ? "Show less" : "Read more"} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandDesc ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-luxury-black/10 pt-8">
              <p className="text-[13px] tracking-[0.22em] uppercase text-luxury-gold/90 font-normal mb-5">Features & Amenities</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-3">
                {PROPERTY.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-[15px] text-luxury-black font-normal">
                    <Check className="w-3.5 h-3.5 text-luxury-gold/80" strokeWidth={2} />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="border-t border-luxury-black/10 pt-8">
              <p className="text-[13px] tracking-[0.22em] uppercase text-luxury-gold/90 font-normal mb-3">Location</p>
              <p className="text-[14px] text-luxury-black/85 font-normal mb-4 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-luxury-gold/75" /> {PROPERTY.breadcrumb.join(" · ")}
              </p>
              <div className="bg-luxury-black/[0.05] h-[260px] flex items-center justify-center text-luxury-black/60 text-[14px] font-normal">
                <MapPin className="w-5 h-5 mr-1.5" /> Interactive Map
              </div>
            </div>

            {/* Nearby & Mortgage */}
            <LuxuryNearbyPlaces />
            <LuxuryMortgageCalculatorV2 />
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[360px] shrink-0">
            <div className="lg:sticky lg:top-[68px] space-y-5">

              {/* Advisor card */}
              <div className="bg-white p-7 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)]">
                <p className="text-[13px] tracking-[0.22em] uppercase text-luxury-gold/90 font-normal mb-4">Your Private Advisor</p>
                <h3 className="text-[17px] font-medium text-luxury-black mb-0.5 tracking-wide">{PROPERTY.agent.name}</h3>
                <p className="text-[13px] text-luxury-black/80 font-normal mb-6">{PROPERTY.agent.role}</p>

                <form className="space-y-3 mb-5" onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder="Full name" className="w-full bg-neutral-50 border-0 px-4 py-3 text-[14px] text-luxury-black placeholder:text-luxury-black/55 focus:outline-none focus:ring-1 focus:ring-luxury-gold/40 transition-all" />
                  <input type="email" placeholder="Email address" className="w-full bg-neutral-50 border-0 px-4 py-3 text-[14px] text-luxury-black placeholder:text-luxury-black/55 focus:outline-none focus:ring-1 focus:ring-luxury-gold/40 transition-all" />
                  <LuxuryPhoneInput />
                  <textarea placeholder="I'm interested in this property..." rows={3} className="w-full bg-neutral-50 border-0 px-4 py-3 text-[14px] text-luxury-black placeholder:text-luxury-black/55 focus:outline-none focus:ring-1 focus:ring-luxury-gold/40 transition-all resize-none" />
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" className="mt-1 accent-luxury-gold" />
                    <span className="text-[12px] text-luxury-black/80 font-normal leading-relaxed">
                      I accept the <a href="#" className="underline hover:text-luxury-black">terms</a> and <a href="#" className="underline hover:text-luxury-black">privacy policy</a>.
                    </span>
                  </label>
                  <button type="submit" className="flex items-center justify-center gap-2 bg-luxury-black text-white text-[12px] tracking-[0.18em] uppercase py-3.5 w-full hover:bg-luxury-charcoal transition-all duration-300 font-medium">
                    <Mail className="w-4 h-4" /> Send Enquiry
                  </button>
                </form>

                <a href={`tel:${PROPERTY.agent.phone}`} className="flex items-center justify-center gap-2 text-luxury-black/90 text-[12px] tracking-[0.15em] uppercase py-3.5 w-full hover:bg-neutral-50 transition-all duration-300 font-medium border border-luxury-black/15">
                  <Phone className="w-4 h-4" /> Call Directly
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─── SIMILAR PROPERTIES ─── */}
      <section className="bg-white py-12">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-[13px] tracking-[0.25em] uppercase text-luxury-gold/80 font-light mb-7">You May Also Like</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SIMILAR.map((p, i) => (
              <a key={i} href="#" className="group">
                <div className="relative overflow-hidden aspect-[3/2]">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="pt-4 space-y-1.5">
                  <p className="text-[22px] font-extralight text-luxury-black tracking-tight">{p.price}</p>
                  <h3 className="text-[14px] font-normal text-luxury-black leading-snug uppercase tracking-[0.03em]">{p.name}</h3>
                  <p className="text-[12px] text-luxury-black/55 font-light flex items-center gap-1 tracking-wide">
                    <MapPin className="w-3 h-3" /> {p.location}
                  </p>
                  <div className="flex items-center gap-4 pt-1.5 text-[12px] text-luxury-black/50 font-light tracking-wide">
                    <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {p.beds}</span>
                    <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {p.baths}</span>
                    <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> {p.sqm} m²</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RECENTLY VIEWED ─── */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        <p className="text-[14px] font-normal text-luxury-black mb-4">Visto recientemente</p>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[...SIMILAR, ...SIMILAR].slice(0, 5).map((p, i) => (
            <a key={i} href="#" className="shrink-0 w-[150px] group">
              <div className="relative overflow-hidden aspect-[4/3] mb-1.5">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <p className="text-[12px] text-luxury-black/85 font-light leading-snug line-clamp-2">{p.name}</p>
              <p className="text-[13px] font-normal text-luxury-black mt-0.5">{p.price}</p>
            </a>
          ))}
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="bg-luxury-black py-16">
        <div className="max-w-md mx-auto px-6 text-center">
          <p className="text-[11px] tracking-[0.4em] uppercase text-luxury-gold/60 mb-3 font-light">Exclusive Access</p>
          <h2 className="text-[26px] font-extralight text-white tracking-[0.03em]">The Private Collection</h2>
          <p className="text-[14px] text-white/50 font-light mt-4 mb-8 leading-relaxed">
            Receive off-market listings and private viewing invitations — delivered discreetly to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" className="flex-1 bg-white/8 border border-white/10 px-4 py-3 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-luxury-gold/40 transition-colors" />
            <button type="submit" className="bg-luxury-gold/90 text-luxury-black text-[11px] tracking-[0.2em] uppercase px-7 py-3 hover:bg-luxury-gold transition-all font-medium whitespace-nowrap">Subscribe</button>
          </form>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-luxury-black border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-[13px] tracking-[0.35em] text-white/40 font-extralight uppercase">{BRAND}</span>
            <p className="text-[11px] text-white/25 tracking-wider font-light">© 2025 {BRAND}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ─── LIGHTBOX ─── */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] bg-luxury-black/97 flex items-center justify-center" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-5 right-5 text-white/30 hover:text-white transition-colors"><X className="w-6 h-6" strokeWidth={1.2} /></button>
          <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="absolute left-4 md:left-8 text-white/20 hover:text-white transition-colors"><ChevronLeft className="w-8 h-8" strokeWidth={1} /></button>
          <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="absolute right-4 md:right-8 text-white/20 hover:text-white transition-colors"><ChevronRight className="w-8 h-8" strokeWidth={1} /></button>
          <img
            src={PROPERTY.images[lightbox]}
            alt={`Photo ${lightbox + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-5 text-white/20 text-[12px] font-light tracking-[0.15em]">{lightbox + 1} / {PROPERTY.images.length}</p>
        </div>
      )}
    </div>
  );
};

export default LuxuryPropertyDetailV2;
