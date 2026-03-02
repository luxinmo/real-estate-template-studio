import { Bed, Bath, Maximize, Fence, Car, Check, MapPin, Phone, Mail, Printer, Shield, Sparkles, Clock, Star, Home } from "lucide-react";
import heroImg from "@/assets/luxury-hero.jpg";
import prop1 from "@/assets/luxury-property-1.jpg";
import prop2 from "@/assets/luxury-property-2.jpg";
import prop3 from "@/assets/luxury-property-3.jpg";
import detail1 from "@/assets/property-detail-1.jpg";
import detail2 from "@/assets/property-detail-2.jpg";
import detail3 from "@/assets/property-detail-3.jpg";
import detail4 from "@/assets/property-detail-4.jpg";
import detail5 from "@/assets/property-detail-5.jpg";

/* ─── Mock ─── */
const PROPERTY = {
  title: "Stunning Contemporary Villa with Panoramic Sea Views",
  subtitle: "An architectural masterpiece on the Mediterranean coast",
  location: "Santa Eulalia del Río, Ibiza",
  breadcrumb: ["Spain", "Balearic Islands", "Ibiza", "Santa Eulalia del Río"],
  ref: "PE-IBZ-2847",
  price: "€4,650,000",
  originalPrice: "€5,200,000",
  discount: 11,
  rentalPrice: "€18,500/mes",
  beds: 5, baths: 4, sqm: 420, plot: 1200, garage: 2, year: 2023,
  energyClass: "A",
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
    { icon: Star, label: "Exclusiva", detail: "Propiedad exclusiva" },
    { icon: Shield, label: "Gated Community", detail: "24/7 security" },
    { icon: Sparkles, label: "Newly Built", detail: "Completed 2023" },
    { icon: Clock, label: "Turnkey", detail: "Move-in ready" },
  ],
  images: [heroImg, detail1, detail2, detail3, detail4, detail5, prop1, prop2, prop3],
  agent: {
    name: "Isabella Martínez",
    role: "Senior Property Advisor",
    phone: "+34 600 123 456",
    email: "isabella@prestigeestates.com",
  },
};

const BRAND = "PRESTIGE ESTATES";

/* ─── PDF V2 — Catalog / Multi-section ─── */
const PropertyPdfV2 = () => {
  const handlePrint = () => window.print();

  return (
    <div className="bg-neutral-100 min-h-screen font-sans text-luxury-black print:bg-white">
      {/* Print button */}
      <div className="print:hidden fixed top-4 right-4 z-50">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-luxury-black text-white text-[13px] tracking-[0.12em] uppercase px-5 py-3 hover:bg-luxury-black/85 transition-all"
        >
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      {/* ═══════ PAGE 1: Cover ═══════ */}
      <div className="max-w-[210mm] mx-auto bg-white print:shadow-none shadow-lg my-8 print:my-0 print:break-after-page">
        {/* Full-bleed hero */}
        <div className="relative h-[65vh] print:h-[60vh] overflow-hidden">
          <img src={PROPERTY.images[0]} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-luxury-black/20 to-transparent" />

          {/* Brand */}
          <div className="absolute top-0 inset-x-0 px-8 py-5">
            <span className="text-[13px] tracking-[0.4em] text-white/80 font-light uppercase">{BRAND}</span>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-8 pb-8">
            <p className="text-[11px] tracking-[0.15em] uppercase text-white/70 font-light mb-2">{PROPERTY.breadcrumb.join(" · ")}</p>
            <h1 className="text-[28px] md:text-[36px] font-light text-white uppercase tracking-[0.02em] leading-tight mb-2">{PROPERTY.title}</h1>
            <p className="text-[14px] text-white/80 font-light">{PROPERTY.subtitle}</p>
          </div>
        </div>

        {/* Price + Specs bar */}
        <div className="px-8 py-6 border-b border-luxury-black/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-3">
              <p className="text-[32px] font-extralight text-luxury-black tracking-tight">{PROPERTY.price}</p>
              <span className="text-[14px] text-luxury-black/45 line-through font-light">{PROPERTY.originalPrice}</span>
              <span className="text-[11px] font-medium tracking-[0.08em] uppercase text-red-600/80 bg-red-50 px-2 py-0.5">-{PROPERTY.discount}%</span>
            </div>
            <div className="text-right">
              <p className="text-[12px] text-luxury-black/50 font-light">También en alquiler</p>
              <p className="text-[16px] font-light text-luxury-black">{PROPERTY.rentalPrice}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-neutral-50 px-5 py-3">
            {[
              { icon: Bed, label: "Beds", value: PROPERTY.beds },
              { icon: Bath, label: "Baths", value: PROPERTY.baths },
              { icon: Maximize, label: "Built", value: `${PROPERTY.sqm} m²` },
              { icon: Fence, label: "Plot", value: `${PROPERTY.plot} m²` },
              { icon: Car, label: "Garage", value: PROPERTY.garage },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-[13px] text-luxury-black">
                <s.icon className="w-4 h-4 text-luxury-black/40" strokeWidth={1.3} />
                <span className="font-normal">{s.value}</span>
                <span className="text-luxury-black/50 text-[11px] font-light">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights row */}
        <div className="px-8 py-5 flex flex-wrap gap-3">
          {PROPERTY.highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-2 bg-neutral-50 px-4 py-2.5">
              <h.icon className="w-4 h-4 text-luxury-black/40" strokeWidth={1.3} />
              <div>
                <p className="text-[12px] font-normal text-luxury-black">{h.label}</p>
                <p className="text-[10px] text-luxury-black/50 font-light">{h.detail}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 bg-luxury-black/[0.04] border border-luxury-black/10 px-4 py-2.5">
            <Home className="w-4 h-4 text-luxury-black/40" strokeWidth={1.3} />
            <div>
              <p className="text-[12px] font-normal text-luxury-black">También en alquiler</p>
              <p className="text-[11px] text-luxury-black/70 font-medium">{PROPERTY.rentalPrice}</p>
            </div>
          </div>
        </div>

        {/* Ref + energy footer */}
        <div className="px-8 py-3 border-t border-luxury-black/8 flex items-center justify-between">
          <span className="text-[11px] text-luxury-black/45 font-light tracking-[0.1em] uppercase">Ref: {PROPERTY.ref}</span>
          <span className="text-[11px] font-light text-luxury-black/45">
            Energy: <span className="bg-green-100 text-green-800 px-1.5 py-0.5 text-[10px] font-medium ml-1">{PROPERTY.energyClass}</span>
          </span>
        </div>
      </div>

      {/* ═══════ PAGE 2: Description + Features ═══════ */}
      <div className="max-w-[210mm] mx-auto bg-white print:shadow-none shadow-lg my-8 print:my-0 print:break-after-page">
        {/* Header bar */}
        <div className="bg-luxury-black px-8 py-3 flex items-center justify-between">
          <span className="text-[12px] tracking-[0.3em] text-white/70 font-light uppercase">{BRAND}</span>
          <span className="text-[11px] text-white/40 font-light tracking-[0.1em]">Ref: {PROPERTY.ref}</span>
        </div>

        <div className="px-8 py-8 space-y-8">
          {/* Description */}
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-luxury-black/50 font-light mb-3">About This Property</p>
            <div className="text-[13px] leading-[1.9] text-luxury-black/85 font-light whitespace-pre-line">
              {PROPERTY.description}
            </div>
          </div>

          {/* Features */}
          <div className="border-t border-luxury-black/8 pt-6">
            <p className="text-[11px] tracking-[0.25em] uppercase text-luxury-black/50 font-light mb-4">Features & Amenities</p>
            <div className="grid grid-cols-3 gap-x-5 gap-y-2.5">
              {PROPERTY.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-[12px] text-luxury-black/80 font-light">
                  <Check className="w-3 h-3 text-luxury-black/40" strokeWidth={1.5} /> {f}
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="border-t border-luxury-black/8 pt-6">
            <p className="text-[11px] tracking-[0.25em] uppercase text-luxury-black/50 font-light mb-3">Location</p>
            <p className="text-[13px] text-luxury-black/70 font-light flex items-center gap-1.5 mb-3">
              <MapPin className="w-3.5 h-3.5 text-luxury-black/40" /> {PROPERTY.breadcrumb.join(" · ")}
            </p>
            <div className="bg-neutral-50 h-[180px] flex items-center justify-center text-luxury-black/30 text-[13px] font-light">
              <MapPin className="w-4 h-4 mr-1" /> Interactive Map
            </div>
          </div>
        </div>

        {/* Page footer */}
        <div className="bg-luxury-black px-8 py-3 flex items-center justify-between mt-auto">
          <span className="text-[11px] text-white/40 font-light">Page 2</span>
          <span className="text-[11px] text-white/40 font-light">{BRAND}</span>
        </div>
      </div>

      {/* ═══════ PAGE 3: Photo Gallery + Contact ═══════ */}
      <div className="max-w-[210mm] mx-auto bg-white print:shadow-none shadow-lg my-8 print:my-0">
        {/* Header bar */}
        <div className="bg-luxury-black px-8 py-3 flex items-center justify-between">
          <span className="text-[12px] tracking-[0.3em] text-white/70 font-light uppercase">{BRAND}</span>
          <span className="text-[11px] text-white/40 font-light tracking-[0.1em]">Ref: {PROPERTY.ref}</span>
        </div>

        <div className="px-8 py-8 space-y-6">
          <p className="text-[11px] tracking-[0.25em] uppercase text-luxury-black/50 font-light">Photo Gallery</p>

          {/* Gallery grid */}
          <div className="grid grid-cols-2 gap-2">
            {PROPERTY.images.slice(0, 6).map((img, i) => (
              <div key={i} className={`overflow-hidden ${i === 0 ? "col-span-2 h-[200px]" : "h-[140px]"}`}>
                <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Additional photos row */}
          {PROPERTY.images.length > 6 && (
            <div className="grid grid-cols-3 gap-2">
              {PROPERTY.images.slice(6, 9).map((img, i) => (
                <div key={i} className="overflow-hidden h-[110px]">
                  <img src={img} alt={`Photo ${i + 7}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Agent / Contact footer */}
        <div className="bg-luxury-black px-8 py-6 mt-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-white/45 font-light mb-2">Your Private Advisor</p>
              <p className="text-[15px] text-white font-normal">{PROPERTY.agent.name}</p>
              <p className="text-[12px] text-white/50 font-light">{PROPERTY.agent.role}</p>
            </div>
            <div className="space-y-1.5 text-right">
              <p className="flex items-center justify-end gap-2 text-[13px] text-white/70 font-light">
                <Phone className="w-3.5 h-3.5" /> {PROPERTY.agent.phone}
              </p>
              <p className="flex items-center justify-end gap-2 text-[13px] text-white/70 font-light">
                <Mail className="w-3.5 h-3.5" /> {PROPERTY.agent.email}
              </p>
            </div>
          </div>
          <div className="border-t border-white/10 mt-4 pt-3 flex items-center justify-between">
            <span className="text-[11px] text-white/30 font-light">Page 3</span>
            <span className="text-[11px] tracking-[0.2em] text-white/30 font-light uppercase">{BRAND} · © 2025</span>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
};

export default PropertyPdfV2;
