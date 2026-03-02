import { useState } from "react";
import { format } from "date-fns";
import {
  Bed, Bath, Maximize, MapPin, Heart, Share2, ChevronLeft, ChevronRight,
  X, Check, Car, Fence, Phone, Mail, Play, View, FileDown,
  Clock, Shield, Sparkles, ChevronDown, CalendarDays, Star, Home, ArrowRight,
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

/* ─── Data (same as V2) ─── */
const PROPERTY = {
  title: "Stunning Contemporary Villa with Panoramic Sea Views",
  subtitle: "An architectural masterpiece on the Mediterranean coast",
  breadcrumb: ["Spain", "Balearic Islands", "Ibiza", "Santa Eulalia del Río"],
  price: "€4,650,000",
  originalPrice: "€5,200,000",
  discount: 11,
  rentalPrice: "€18,500/mes",
  alsoForRent: true,
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
    { icon: Star, label: "Exclusive", detail: "Exclusive listing" },
    { icon: Shield, label: "Gated Community", detail: "24/7 security" },
    { icon: Sparkles, label: "Newly Built", detail: "Completed 2023" },
    { icon: Clock, label: "Turnkey", detail: "Move-in ready" },
  ],
  agent: {
    name: "Isabella Martínez",
    role: "Senior Property Advisor",
    phone: "+34 600 123 456",
    email: "isabella@prestigeestates.com",
    initials: "IM",
  },
};

const SIMILAR = [
  { image: prop1, name: "Beachfront Villa Es Cubells", location: "Es Cubells, Ibiza", price: "€6,200,000", beds: 6, baths: 5, sqm: 580 },
  { image: prop2, name: "Modern Penthouse Marina Botafoch", location: "Marina Botafoch, Ibiza", price: "€3,100,000", beds: 3, baths: 3, sqm: 210 },
  { image: prop3, name: "Traditional Finca San Carlos", location: "San Carlos, Ibiza", price: "€5,800,000", beds: 7, baths: 6, sqm: 750 },
];

const BRAND = "PRESTIGE ESTATES";

/* ─── Component ─── */
const LuxuryPropertyDetailV3 = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [expandDesc, setExpandDesc] = useState(false);
  const [wantVisit, setWantVisit] = useState(false);
  const [visitDate, setVisitDate] = useState<Date | undefined>();
  const [visitTime, setVisitTime] = useState("");
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);

  const openLightbox = (i: number) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);
  const nextSlide = () => setLightbox((p) => (p !== null ? (p + 1) % PROPERTY.images.length : 0));
  const prevSlide = () => setLightbox((p) => (p !== null ? (p - 1 + PROPERTY.images.length) % PROPERTY.images.length : 0));

  return (
    <div className="flex-1 overflow-auto bg-[#F9F8F6] font-sans text-luxury-black">

      {/* ─── FULL-BLEED HERO ─── */}
      <section className="relative h-[60vh] md:h-[75vh] overflow-hidden">
        <img src={PROPERTY.images[0]} alt="Property hero" className="w-full h-full object-cover scale-[1.02]" />
        {/* Cinematic gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/50 via-transparent to-luxury-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/30 to-transparent" />

        {/* Nav */}
        <nav className="absolute top-0 inset-x-0 z-50">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between px-8 lg:px-14 h-[64px]">
            <a href="/" className="text-[13px] tracking-[0.4em] text-white/90 font-light uppercase [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">{BRAND}</a>
            <div className="hidden md:flex items-center gap-10">
              {["Properties", "Rentals", "About", "Contact"].map((l) => (
                <a key={l} href="#" className="text-[11px] tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors duration-300 font-light [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">{l}</a>
              ))}
            </div>
          </div>
        </nav>

        {/* Hero content — bottom left, editorial style */}
        <div className="absolute bottom-0 inset-x-0">
          <div className="max-w-[1440px] mx-auto px-8 lg:px-14 pb-10 md:pb-14">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 mb-4">
              {PROPERTY.breadcrumb.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase text-white/70 font-light [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
                  {i > 0 && <span className="text-white/40">—</span>}
                  {crumb}
                </span>
              ))}
            </div>
            
            {/* Title — serif for editorial elegance */}
            <h1 className="text-[28px] md:text-[38px] lg:text-[48px] font-serif font-normal text-white leading-[1.1] max-w-4xl [text-shadow:0_2px_8px_rgba(0,0,0,0.4)]">
              {PROPERTY.title}
            </h1>
            <p className="text-[14px] md:text-[16px] text-white/75 font-light mt-3 tracking-[0.02em] max-w-2xl [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
              {PROPERTY.subtitle}
            </p>

            {/* Floating price on hero */}
            <div className="mt-6 flex items-end gap-3">
              <span className="text-[36px] md:text-[48px] font-extralight text-white leading-none tracking-tight [text-shadow:0_2px_6px_rgba(0,0,0,0.3)]">
                {PROPERTY.price}
              </span>
              {PROPERTY.alsoForRent && (
                <span className="text-[13px] text-luxury-gold font-medium tracking-[0.06em] mb-1 bg-luxury-gold/15 backdrop-blur-sm px-3 py-1 border border-luxury-gold/25">
                  Also for rent · {PROPERTY.rentalPrice}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Media badges — top right area */}
        <div className="absolute top-[72px] right-8 lg:right-14 flex gap-2">
          {PROPERTY.hasVideo && (
            <a href={PROPERTY.videoUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xl text-white text-[10px] tracking-[0.15em] uppercase px-4 py-2.5 hover:bg-white/20 transition-all border border-white/15">
              <Play className="w-3 h-3" fill="currentColor" /> Video
            </a>
          )}
          {PROPERTY.hasVirtualTour && (
            <a href={PROPERTY.virtualTourUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xl text-white text-[10px] tracking-[0.15em] uppercase px-4 py-2.5 hover:bg-white/20 transition-all border border-white/15">
              <View className="w-3 h-3" /> 360° Tour
            </a>
          )}
        </div>
      </section>

      {/* ─── MOSAIC GALLERY ─── */}
      <div className="max-w-[1440px] mx-auto px-8 lg:px-14 -mt-8 relative z-10">
        <div className="grid grid-cols-4 md:grid-cols-6 gap-1">
          {PROPERTY.images.slice(1, 7).map((img, i) => (
            <div
              key={i}
              className={cn(
                "relative overflow-hidden cursor-pointer group",
                i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-[4/3]"
              )}
              onClick={() => openLightbox(i + 1)}
            >
              <img src={img} alt={`Photo ${i + 2}`} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 brightness-[0.92] group-hover:brightness-100" />
              <div className="absolute inset-0 bg-luxury-black/0 group-hover:bg-luxury-black/10 transition-all duration-500" />
              {i === 5 && PROPERTY.images.length > 7 && (
                <div className="absolute inset-0 bg-luxury-black/40 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="text-white text-[13px] tracking-[0.15em] font-light">+{PROPERTY.images.length - 7} more</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── ACTION BAR ─── */}
      <section className="max-w-[1440px] mx-auto px-8 lg:px-14 py-6">
        <div className="flex items-center justify-between border-b border-luxury-black/8 pb-6">
          <div className="flex items-center gap-4">
            {PROPERTY.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-[12px] tracking-[0.1em] uppercase text-luxury-black/60 font-light">
                <h.icon className="w-3.5 h-3.5 text-luxury-gold/70" strokeWidth={1.4} />
                {h.label}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setLiked(!liked)} className={cn(
              "w-9 h-9 flex items-center justify-center transition-all duration-300 rounded-full",
              liked ? "bg-luxury-black text-white" : "text-luxury-black/40 hover:text-luxury-black hover:bg-luxury-black/5"
            )}>
              <Heart className="w-4 h-4" fill={liked ? "currentColor" : "none"} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center text-luxury-black/40 hover:text-luxury-black hover:bg-luxury-black/5 transition-all rounded-full">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center text-luxury-black/40 hover:text-luxury-black hover:bg-luxury-black/5 transition-all rounded-full" title="Download PDF">
              <FileDown className="w-4 h-4" />
            </button>
            <span className="ml-4 text-[11px] tracking-[0.15em] uppercase text-luxury-black/35 font-mono">{PROPERTY.ref}</span>
          </div>
        </div>
      </section>

      {/* ─── SPECS — elegant horizontal cards ─── */}
      <section className="max-w-[1440px] mx-auto px-8 lg:px-14 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-luxury-black/[0.06]">
          {[
            { icon: Bed, label: "Bedrooms", value: String(PROPERTY.beds) },
            { icon: Bath, label: "Bathrooms", value: String(PROPERTY.baths) },
            { icon: Maximize, label: "Built Area", value: `${PROPERTY.sqm} m²` },
            { icon: Fence, label: "Plot Size", value: `${PROPERTY.plot} m²` },
            { icon: Car, label: "Garage", value: String(PROPERTY.garage) },
          ].map((s, i) => (
            <div key={i} className="bg-[#F9F8F6] py-6 px-5 text-center group">
              <s.icon className="w-5 h-5 text-luxury-gold/60 mx-auto mb-3 group-hover:text-luxury-gold transition-colors" strokeWidth={1.2} />
              <p className="text-[22px] font-extralight text-luxury-black tracking-tight">{s.value}</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-luxury-black/40 font-light mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CONTENT + SIDEBAR ─── */}
      <section className="max-w-[1440px] mx-auto px-8 lg:px-14 pb-16">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-14">

            {/* Description — editorial serif heading */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-luxury-gold/30" />
                <p className="text-[11px] tracking-[0.3em] uppercase text-luxury-gold font-medium">About This Property</p>
                <div className="h-px flex-1 bg-luxury-gold/30" />
              </div>
              <div className={cn(
                "text-[15px] leading-[2] text-luxury-black/80 font-light whitespace-pre-line",
                !expandDesc && "line-clamp-6"
              )}>
                {PROPERTY.description}
              </div>
              <button
                onClick={() => setExpandDesc(!expandDesc)}
                className="flex items-center gap-1.5 mt-4 text-[11px] tracking-[0.15em] uppercase text-luxury-gold hover:text-luxury-black font-medium transition-colors"
              >
                {expandDesc ? "Show less" : "Continue reading"} 
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", expandDesc && "rotate-180")} />
              </button>
            </div>

            {/* Features — clean grid with subtle dividers */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-luxury-gold/30" />
                <p className="text-[11px] tracking-[0.3em] uppercase text-luxury-gold font-medium">Features & Amenities</p>
                <div className="h-px flex-1 bg-luxury-gold/30" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0">
                {PROPERTY.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-3 px-3 border-b border-luxury-black/[0.05] text-[14px] text-luxury-black/75 font-light">
                    <Check className="w-3 h-3 text-luxury-gold/70 shrink-0" strokeWidth={2.5} />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-luxury-gold/30" />
                <p className="text-[11px] tracking-[0.3em] uppercase text-luxury-gold font-medium">Location</p>
                <div className="h-px flex-1 bg-luxury-gold/30" />
              </div>
              <p className="text-[14px] text-luxury-black/70 font-light mb-4 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-luxury-gold/70" /> {PROPERTY.breadcrumb.join(" · ")}
              </p>
              <div className="bg-luxury-black/[0.04] h-[300px] flex items-center justify-center text-luxury-black/40 text-[14px] font-light">
                <MapPin className="w-5 h-5 mr-2" /> Interactive Map
              </div>
            </div>

            {/* Nearby & Mortgage */}
            <LuxuryNearbyPlaces />
            <LuxuryMortgageCalculatorV3 />
          </div>

          {/* Sidebar — refined floating card */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="lg:sticky lg:top-[24px] space-y-6">

              {/* Advisor */}
              <div className="bg-white shadow-[0_4px_40px_-8px_rgba(0,0,0,0.08)] p-8">
                {/* Agent identity */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-luxury-black/[0.06]">
                  <div className="w-14 h-14 rounded-full bg-luxury-black flex items-center justify-center shrink-0">
                    <span className="text-[14px] font-light text-white tracking-wider">{PROPERTY.agent.initials}</span>
                  </div>
                  <div>
                    <p className="text-[11px] tracking-[0.2em] uppercase text-luxury-gold/80 font-medium mb-1">Your Advisor</p>
                    <h3 className="text-[16px] font-normal text-luxury-black tracking-wide">{PROPERTY.agent.name}</h3>
                    <p className="text-[12px] text-luxury-black/50 font-light">{PROPERTY.agent.role}</p>
                  </div>
                </div>

                {/* Contact form */}
                <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder="Full name" className="w-full bg-[#F9F8F6] border-0 px-4 py-3.5 text-[13px] text-luxury-black placeholder:text-luxury-black/40 focus:outline-none focus:ring-1 focus:ring-luxury-gold/30 transition-all font-light" />
                  <input type="email" placeholder="Email" className="w-full bg-[#F9F8F6] border-0 px-4 py-3.5 text-[13px] text-luxury-black placeholder:text-luxury-black/40 focus:outline-none focus:ring-1 focus:ring-luxury-gold/30 transition-all font-light" />
                  <LuxuryPhoneInput />
                  <textarea placeholder="I'm interested in this property..." rows={3} className="w-full bg-[#F9F8F6] border-0 px-4 py-3.5 text-[13px] text-luxury-black placeholder:text-luxury-black/40 focus:outline-none focus:ring-1 focus:ring-luxury-gold/30 transition-all resize-none font-light" />

                  {/* Visit scheduler */}
                  <label className="flex items-center gap-2 cursor-pointer select-none py-1">
                    <input type="checkbox" checked={wantVisit} onChange={(e) => setWantVisit(e.target.checked)} className="accent-luxury-gold" />
                    <span className="text-[12px] text-luxury-black/70 font-light flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-luxury-gold/70" />
                      Schedule a private viewing
                    </span>
                  </label>

                  {wantVisit && (
                    <div className="space-y-2 bg-[#F9F8F6] p-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button type="button" className={cn(
                            "w-full flex items-center gap-2 bg-white border border-luxury-black/8 px-4 py-2.5 text-[13px] text-left transition-all hover:border-luxury-gold/30 font-light",
                            !visitDate && "text-luxury-black/35"
                          )}>
                            <CalendarDays className="w-4 h-4 text-luxury-gold/60 shrink-0" />
                            {visitDate ? format(visitDate, "PPP") : "Select a date"}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={visitDate} onSelect={setVisitDate} disabled={(date) => date < new Date()} initialFocus className="p-3 pointer-events-auto" />
                        </PopoverContent>
                      </Popover>
                      <select value={visitTime} onChange={(e) => setVisitTime(e.target.value)} className="w-full bg-white border border-luxury-black/8 px-4 py-2.5 text-[13px] text-luxury-black appearance-none cursor-pointer focus:outline-none focus:border-luxury-gold/30 transition-all font-light">
                        <option value="" disabled>Select a time</option>
                        {["09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","16:00","16:30","17:00","17:30","18:00","18:30","19:00"].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" className="mt-1 accent-luxury-gold" />
                    <span className="text-[11px] text-luxury-black/50 font-light leading-relaxed">
                      I accept the <a href="#" className="underline hover:text-luxury-black">terms</a> and <a href="#" className="underline hover:text-luxury-black">privacy policy</a>.
                    </span>
                  </label>

                  <button type="submit" className="flex items-center justify-center gap-2 bg-luxury-black text-white text-[11px] tracking-[0.2em] uppercase py-4 w-full hover:bg-luxury-charcoal transition-all duration-500 font-light">
                    <Mail className="w-4 h-4" /> {wantVisit ? "Request Private Viewing" : "Send Enquiry"}
                  </button>
                </form>

                <a href={`tel:${PROPERTY.agent.phone}`} className="flex items-center justify-center gap-2 text-luxury-black/70 text-[11px] tracking-[0.18em] uppercase py-3.5 w-full hover:bg-[#F9F8F6] transition-all duration-300 font-light mt-3 border border-luxury-black/10">
                  <Phone className="w-3.5 h-3.5" /> Call Directly
                </a>
              </div>

              {/* Quick facts */}
              <div className="bg-white shadow-[0_4px_40px_-8px_rgba(0,0,0,0.08)] p-6">
                <p className="text-[10px] tracking-[0.25em] uppercase text-luxury-gold/80 font-medium mb-4">Property Details</p>
                {[
                  { label: "Year Built", value: String(PROPERTY.year) },
                  { label: "Energy Rating", value: PROPERTY.energyClass },
                  { label: "Status", value: PROPERTY.status },
                  { label: "Reference", value: PROPERTY.ref },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-luxury-black/[0.04] last:border-0">
                    <span className="text-[12px] text-luxury-black/45 font-light tracking-wide">{item.label}</span>
                    <span className="text-[13px] text-luxury-black font-light">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SIMILAR — editorial cards ─── */}
      <section className="bg-white py-16">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-14">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-luxury-black/10" />
            <p className="text-[11px] tracking-[0.3em] uppercase text-luxury-black/40 font-light">Similar Properties</p>
            <div className="h-px flex-1 bg-luxury-black/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SIMILAR.map((p, i) => (
              <a key={i} href="#" className="group">
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[28px] font-extralight text-white tracking-tight leading-none">{p.price}</p>
                    <h3 className="text-[13px] font-light text-white/90 mt-2 uppercase tracking-[0.06em]">{p.name}</h3>
                    <p className="text-[11px] text-white/60 font-light flex items-center gap-1 mt-1 tracking-wide">
                      <MapPin className="w-3 h-3" /> {p.location}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-white/50 font-light tracking-wider">
                      <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {p.beds}</span>
                      <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {p.baths}</span>
                      <span className="flex items-center gap-1"><Maximize className="w-3 h-3" /> {p.sqm} m²</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-luxury-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.08),transparent_70%)]" />
        <div className="relative max-w-lg mx-auto px-8 py-20 text-center">
          <div className="w-12 h-px bg-luxury-gold/40 mx-auto mb-6" />
          <p className="text-[10px] tracking-[0.5em] uppercase text-luxury-gold/50 mb-4 font-light">Exclusive Access</p>
          <h2 className="text-[28px] md:text-[34px] font-serif font-normal text-white leading-[1.15]">The Private Collection</h2>
          <p className="text-[14px] text-white/40 font-light mt-5 mb-10 leading-relaxed">
            Receive off-market listings and private viewing invitations — delivered discreetly to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" className="flex-1 bg-white/[0.06] border border-white/10 px-5 py-3.5 text-[13px] text-white placeholder:text-white/25 focus:outline-none focus:border-luxury-gold/30 transition-colors font-light" />
            <button type="submit" className="bg-luxury-gold text-luxury-black text-[10px] tracking-[0.25em] uppercase px-8 py-3.5 hover:bg-luxury-gold/90 transition-all font-medium whitespace-nowrap">Subscribe</button>
          </form>
          <div className="w-12 h-px bg-luxury-gold/40 mx-auto mt-10" />
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-luxury-black">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-14 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-[12px] tracking-[0.4em] text-white/30 font-extralight uppercase">{BRAND}</span>
            <p className="text-[10px] text-white/20 tracking-wider font-light">© 2025 {BRAND}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ─── LIGHTBOX ─── */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] bg-luxury-black/[0.98] flex items-center justify-center" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"><X className="w-5 h-5" strokeWidth={1} /></button>
          <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="absolute left-6 md:left-12 text-white/15 hover:text-white transition-colors"><ChevronLeft className="w-8 h-8" strokeWidth={0.8} /></button>
          <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="absolute right-6 md:right-12 text-white/15 hover:text-white transition-colors"><ChevronRight className="w-8 h-8" strokeWidth={0.8} /></button>
          <img src={PROPERTY.images[lightbox]} alt={`Photo ${lightbox + 1}`} className="max-w-[90vw] max-h-[85vh] object-contain" onClick={(e) => e.stopPropagation()} />
          <p className="absolute bottom-6 text-white/15 text-[11px] font-light tracking-[0.2em]">{lightbox + 1} / {PROPERTY.images.length}</p>
        </div>
      )}
    </div>
  );
};

export default LuxuryPropertyDetailV3;
