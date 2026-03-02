import { useState } from "react";
import { Bed, Bath, Maximize, MapPin, Heart, Share2, ChevronLeft, ChevronRight, X, Check, Car, Waves, Trees, Fence, Wind, Sun, Wifi, ShieldCheck, Phone, Mail, ArrowRight, ArrowLeft, ChevronDown, Play, View, FileDown } from "lucide-react";
import LuxuryPhoneInput from "./LuxuryPhoneInput";
import LuxuryMortgageCalculator from "./LuxuryMortgageCalculator";
// import LuxuryPurchaseTaxCalculator from "./LuxuryPurchaseTaxCalculator";
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

/* ─── Mock Data ─── */
const PROPERTY = {
  title: "Stunning Contemporary Villa with Panoramic Sea Views",
  breadcrumb: ["Spain", "Balearic Islands", "Ibiza", "Santa Eulalia del Río"],
  price: "€4,650,000",
  originalPrice: "€5,200,000",
  discount: 11,
  beds: 5,
  baths: 4,
  sqm: 420,
  plot: 1200,
  garage: 2,
  year: 2023,
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

const BRAND_NAME = "PRESTIGE ESTATES";

/* ─── Component ─── */
const LuxuryPropertyDetail = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);

  const openLightbox = (i: number) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);
  const nextSlide = () => setLightbox((p) => (p !== null ? (p + 1) % PROPERTY.images.length : 0));
  const prevSlide = () => setLightbox((p) => (p !== null ? (p - 1 + PROPERTY.images.length) % PROPERTY.images.length : 0));

  return (
    <div className="flex-1 overflow-auto bg-white text-luxury-black font-sans">

      {/* ─── NAV ─── */}
      <nav className="sticky top-0 z-50 bg-luxury-black">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 lg:px-10 h-[56px]">
          <a href="/" className="text-[15px] tracking-[0.35em] text-white/90 font-light uppercase">{BRAND_NAME}</a>
          <div className="hidden md:flex items-center gap-7">
            {["Properties", "Rentals", "About", "Contact"].map((l) => (
              <a key={l} href="#" className="text-[13px] tracking-[0.18em] uppercase text-white/50 hover:text-white transition-colors duration-300 font-light">{l}</a>
            ))}
          </div>
          <button className="md:hidden text-white/60">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </nav>

      {/* ─── BREADCRUMB BAR ─── */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-10 pt-4 pb-2.5 flex items-center justify-between">
        <a href="#" className="flex items-center gap-1.5 text-[13px] text-luxury-black/70 hover:text-luxury-black transition-colors font-light tracking-wide">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to listings
        </a>
        <nav className="hidden sm:flex items-center gap-1 text-[13px] text-luxury-black/60 font-light">
          {PROPERTY.breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3 h-3 text-luxury-black/35" />}
              <a href="#" className={`hover:text-luxury-black transition-colors ${i === PROPERTY.breadcrumb.length - 1 ? "text-luxury-black/80" : ""}`}>{crumb}</a>
            </span>
          ))}
        </nav>
      </div>

      {/* ─── GALLERY GRID ─── */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-10">
        <div className="relative grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-1 h-[280px] md:h-[400px] lg:h-[460px]">
          {/* Main image */}
          <div className="md:col-span-2 md:row-span-2 relative overflow-hidden cursor-pointer group" onClick={() => openLightbox(0)}>
            <img src={PROPERTY.images[0]} alt="Main" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            <div className="absolute bottom-3 left-3 flex gap-1.5">
              {PROPERTY.hasVideo && (
                <a href={PROPERTY.videoUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 bg-luxury-black/60 backdrop-blur-sm text-white text-[12px] tracking-[0.08em] uppercase px-3 py-2 hover:bg-luxury-black/80 transition-all">
                  <Play className="w-3 h-3" fill="currentColor" /> Video
                </a>
              )}
              {PROPERTY.hasVirtualTour && (
                <a href={PROPERTY.virtualTourUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 bg-white/75 backdrop-blur-sm text-luxury-black text-[12px] tracking-[0.08em] uppercase px-3 py-2 hover:bg-white transition-all">
                  <View className="w-3 h-3" /> 360°
                </a>
              )}
            </div>
          </div>
          {/* Secondary images */}
          {PROPERTY.images.slice(1, 5).map((img, i) => (
            <div key={i} className="hidden md:block relative overflow-hidden cursor-pointer group" onClick={() => openLightbox(i + 1)}>
              <img src={img} alt={`Photo ${i + 2}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              {i === 3 && PROPERTY.images.length > 5 && (
                <div className="absolute inset-0 bg-luxury-black/45 flex items-center justify-center">
                  <span className="text-white text-[14px] tracking-[0.1em] font-light">+{PROPERTY.images.length - 5} photos</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── HEADER INFO ─── */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-7 pb-5">
        {/* Title first for editorial hierarchy */}
        <h1 className="text-[22px] md:text-[26px] font-light text-luxury-black leading-snug tracking-[0.04em] mb-2 uppercase">{PROPERTY.title}</h1>
        
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[12px] tracking-[0.15em] uppercase text-luxury-black/60 font-light">Ref: {PROPERTY.ref}</span>
          <span className="w-px h-3 bg-luxury-black/20" />
          <span className="text-[12px] tracking-[0.12em] uppercase text-luxury-black/60 font-light">{PROPERTY.breadcrumb.slice(-2).join(" · ")}</span>
        </div>

        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <p className="text-[32px] md:text-[38px] font-extralight text-luxury-black tracking-tight">{PROPERTY.price}</p>
            <span className="text-[16px] text-luxury-black/60 line-through font-light">{PROPERTY.originalPrice}</span>
            <span className="text-[12px] font-medium text-red-600/80 bg-red-50 px-2 py-0.5 tracking-wide">-{PROPERTY.discount}%</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setLiked(!liked)} className={`w-9 h-9 border flex items-center justify-center transition-all duration-300 ${liked ? "border-luxury-black bg-luxury-black text-white" : "border-neutral-300 text-luxury-black/60 hover:border-luxury-black/40"}`}>
              <Heart className="w-4 h-4" fill={liked ? "currentColor" : "none"} />
            </button>
            <button className="w-9 h-9 border border-neutral-300 text-luxury-black/60 hover:border-luxury-black/40 flex items-center justify-center transition-all duration-300">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 border border-neutral-300 text-luxury-black/60 hover:border-luxury-black/40 flex items-center justify-center transition-all duration-300" title="Download PDF">
              <FileDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Specs strip */}
        <div className="flex flex-wrap gap-5 border-t border-b border-neutral-200/70 py-3.5">
          {[
            { icon: Bed, label: "Beds", value: PROPERTY.beds },
            { icon: Bath, label: "Baths", value: PROPERTY.baths },
            { icon: Maximize, label: "Built", value: `${PROPERTY.sqm} m²` },
            { icon: Fence, label: "Plot", value: `${PROPERTY.plot} m²` },
            { icon: Car, label: "Garage", value: PROPERTY.garage },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-[14px] text-luxury-black/85">
              <s.icon className="w-4 h-4 text-luxury-black/50" strokeWidth={1.3} />
              <span className="font-normal">{s.value}</span>
              <span className="text-luxury-black/70 text-[13px] font-light">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CONTENT + SIDEBAR ─── */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left: main content */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Description */}
            <div className="pt-6 border-t border-neutral-100">
              <p className="text-[12px] tracking-[0.25em] uppercase text-luxury-black/60 font-light mb-4">Description</p>
              <div className="text-[15px] leading-[1.85] text-luxury-black/90 font-light whitespace-pre-line">
                {PROPERTY.description}
              </div>
            </div>

            {/* Features */}
            <div className="pt-6 border-t border-neutral-100">
              <p className="text-[12px] tracking-[0.25em] uppercase text-luxury-black/60 font-light mb-4">Features & Amenities</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-3">
                {PROPERTY.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-[14px] text-luxury-black/90 font-light">
                    <Check className="w-3.5 h-3.5 text-luxury-black/50" strokeWidth={1.5} />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="pt-6 border-t border-neutral-100">
              <p className="text-[12px] tracking-[0.25em] uppercase text-luxury-black/60 font-light mb-3">Location</p>
              <p className="text-[14px] text-luxury-black/80 font-light mb-4">{PROPERTY.breadcrumb.join(" · ")}</p>
              <div className="bg-neutral-50 h-[240px] flex items-center justify-center text-luxury-black/35 text-[14px] font-light">
                <MapPin className="w-5 h-5 mr-1.5" /> Interactive Map
              </div>
            </div>

            {/* Nearby Places */}
            <LuxuryNearbyPlaces />

            {/* Mortgage Calculator */}
            <LuxuryMortgageCalculator />

            {/* Purchase Tax Calculator - temporarily hidden */}
            {/* <LuxuryPurchaseTaxCalculator /> */}
          </div>

          {/* Right: Advisor sticky sidebar */}
          <div className="w-full lg:w-[340px] shrink-0">
            <div className="lg:sticky lg:top-[72px]">
              <div className="border border-neutral-200/80 p-6">
                <p className="text-[12px] tracking-[0.25em] uppercase text-luxury-black/60 mb-3 font-light">Your Advisor</p>
                <h3 className="text-[16px] font-normal text-luxury-black mb-0.5">{PROPERTY.agent.name}</h3>
                <p className="text-[14px] text-luxury-black/60 font-light mb-5">{PROPERTY.agent.role}</p>

                {/* Contact Form */}
                <form className="space-y-2.5 mb-5" onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder="Name" className="w-full border border-neutral-200 bg-white px-3.5 py-2.5 text-[14px] text-luxury-black placeholder:text-luxury-black/30 focus:outline-none focus:border-luxury-black/30 transition-colors duration-300" />
                  <input type="email" placeholder="Email" className="w-full border border-neutral-200 bg-white px-3.5 py-2.5 text-[14px] text-luxury-black placeholder:text-luxury-black/30 focus:outline-none focus:border-luxury-black/30 transition-colors duration-300" />
                  <LuxuryPhoneInput />
                  <textarea placeholder="I'm interested in this property..." rows={3} className="w-full border border-neutral-200 bg-white px-3.5 py-2.5 text-[14px] text-luxury-black placeholder:text-luxury-black/30 focus:outline-none focus:border-luxury-black/30 transition-colors duration-300 resize-none" />
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 accent-luxury-black" />
                    <span className="text-[12px] text-luxury-black/65 font-light leading-relaxed">
                      I accept the <a href="#" className="underline hover:text-luxury-black transition-colors">terms</a> and <a href="#" className="underline hover:text-luxury-black transition-colors">privacy policy</a>.
                    </span>
                  </label>
                  <button type="submit" className="flex items-center justify-center gap-1.5 bg-luxury-black text-white text-[13px] tracking-[0.15em] uppercase py-3 w-full hover:bg-luxury-black/85 transition-all duration-300 font-light">
                    <Mail className="w-4 h-4" /> Send Message
                  </button>
                </form>

                <a href={`tel:${PROPERTY.agent.phone}`} className="flex items-center justify-center gap-1.5 border border-luxury-black/20 text-luxury-black/70 text-[13px] tracking-[0.15em] uppercase py-3 w-full hover:bg-luxury-black hover:text-white transition-all duration-300 font-light">
                  <Phone className="w-4 h-4" /> Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SIMILAR PROPERTIES ─── */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 border-t border-neutral-100">
        <p className="text-[12px] tracking-[0.25em] uppercase text-luxury-black/60 font-light mb-6">Similar Properties</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SIMILAR.map((p, i) => (
            <a key={i} href="#" className="group">
              <div className="relative overflow-hidden aspect-[4/3]">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
              <div className="pt-3 space-y-1">
                <p className="text-[18px] font-light text-luxury-black/80 tracking-tight">{p.price}</p>
                <h3 className="text-[15px] font-light text-luxury-black leading-snug">{p.name}</h3>
                <p className="text-[13px] text-luxury-black/60 font-light flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {p.location}</p>
                <div className="flex items-center gap-3 pt-1 text-[13px] text-luxury-black/60 font-light">
                  <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {p.beds}</span>
                  <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {p.baths}</span>
                  <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> {p.sqm} m²</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ─── RECENTLY VIEWED ─── */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 border-t border-neutral-100">
        <p className="text-[14px] font-normal text-luxury-black mb-4">Visto recientemente</p>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {[...SIMILAR, ...SIMILAR].slice(0, 5).map((p, i) => (
            <a key={i} href="#" className="shrink-0 w-[160px] group">
              <div className="relative overflow-hidden aspect-[4/3] mb-1.5">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <p className="text-[13px] text-luxury-black/90 font-light leading-snug line-clamp-2">{p.name}</p>
              <p className="text-[13px] font-normal text-luxury-black mt-0.5">{p.price}</p>
            </a>
          ))}
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="py-12 bg-neutral-50/50">
        <div className="max-w-lg mx-auto px-6 text-center">
          <p className="text-[12px] tracking-[0.35em] uppercase text-luxury-black/60 mb-3 font-light">Stay Informed</p>
          <h2 className="text-[24px] font-extralight text-luxury-black tracking-[0.02em]">The Private List</h2>
          <p className="text-[14px] text-luxury-black/80 font-light mt-3 mb-7 leading-relaxed">
            Receive exclusive off-market listings and invitations to private viewings — delivered discreetly to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-2.5" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" className="flex-1 border border-neutral-200 bg-white px-4 py-3 text-[14px] text-luxury-black placeholder:text-luxury-black/35 focus:outline-none focus:border-luxury-black/30 transition-colors duration-300" />
            <button type="submit" className="bg-luxury-black text-white text-[12px] tracking-[0.18em] uppercase px-7 py-3 hover:bg-luxury-black/85 transition-all duration-300 font-light whitespace-nowrap">Subscribe</button>
          </form>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-luxury-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-[14px] tracking-[0.3em] text-white/50 font-light uppercase">{BRAND_NAME}</span>
            <p className="text-[12px] text-white/30 tracking-wider font-light">© 2025 {BRAND_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ─── LIGHTBOX ─── */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] bg-luxury-black/95 flex items-center justify-center" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
          <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="absolute left-3 md:left-6 text-white/30 hover:text-white transition-colors"><ChevronLeft className="w-8 h-8" /></button>
          <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="absolute right-3 md:right-6 text-white/30 hover:text-white transition-colors"><ChevronRight className="w-8 h-8" /></button>
          <img
            src={PROPERTY.images[lightbox]}
            alt={`Photo ${lightbox + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-4 text-white/25 text-[13px] font-light tracking-wide">{lightbox + 1} / {PROPERTY.images.length}</p>
        </div>
      )}
    </div>
  );
};

export default LuxuryPropertyDetail;
