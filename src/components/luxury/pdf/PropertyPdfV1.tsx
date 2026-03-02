import { Bed, Bath, Maximize, Fence, Car, Check, MapPin, Phone, Mail, Printer } from "lucide-react";
import heroImg from "@/assets/luxury-hero.jpg";
import detail1 from "@/assets/property-detail-1.jpg";
import detail2 from "@/assets/property-detail-2.jpg";
import detail3 from "@/assets/property-detail-3.jpg";

/* ─── Shared mock — in production, fetch by :id ─── */
const PROPERTY = {
  title: "Stunning Contemporary Villa with Panoramic Sea Views",
  location: "Santa Eulalia del Río, Ibiza",
  ref: "PE-IBZ-2847",
  price: "€4,650,000",
  rentalPrice: "€18,500/mes",
  beds: 5, baths: 4, sqm: 420, plot: 1200, garage: 2, year: 2023,
  energyClass: "A",
  description:
    "This exceptional contemporary villa is set on an elevated plot offering uninterrupted panoramic views of the Mediterranean Sea and Formentera. 420 m² of impeccably finished living space with infinity pool, home cinema, wine cellar, gym, and state-of-the-art home automation.",
  features: [
    "Infinity Pool", "Sea Views", "Home Cinema", "Wine Cellar",
    "Gym", "Solar Panels", "Smart Home", "Underfloor Heating",
    "Air Conditioning", "Alarm System", "Double Garage", "Garden",
  ],
  images: [heroImg, detail1, detail2, detail3],
  agent: {
    name: "Isabella Martínez",
    role: "Senior Property Advisor",
    phone: "+34 600 123 456",
    email: "isabella@prestigeestates.com",
  },
};

const BRAND = "PRESTIGE ESTATES";

/* ─── PDF V1 — Single Page Property Sheet ─── */
const PropertyPdfV1 = () => {
  const handlePrint = () => window.print();

  return (
    <div className="bg-white min-h-screen font-sans text-luxury-black">
      {/* Print button — hidden on print */}
      <div className="print:hidden fixed top-4 right-4 z-50">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-luxury-black text-white text-[13px] tracking-[0.12em] uppercase px-5 py-3 hover:bg-luxury-black/85 transition-all"
        >
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      {/* ─── A4 Page ─── */}
      <div className="max-w-[210mm] mx-auto bg-white print:shadow-none shadow-lg my-8 print:my-0">

        {/* Header bar */}
        <div className="bg-luxury-black px-8 py-4 flex items-center justify-between">
          <span className="text-[14px] tracking-[0.35em] text-white/90 font-light uppercase">{BRAND}</span>
          <span className="text-[11px] tracking-[0.12em] text-white/50 uppercase font-light">Property Dossier</span>
        </div>

        <div className="px-8 py-6 space-y-5">

          {/* Hero image + small grid */}
          <div className="grid grid-cols-3 gap-1.5 h-[220px]">
            <div className="col-span-2 overflow-hidden">
              <img src={PROPERTY.images[0]} alt="Main" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-1.5">
              {PROPERTY.images.slice(1, 4).map((img, i) => (
                <div key={i} className="flex-1 overflow-hidden">
                  <img src={img} alt={`Photo ${i + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Title + Price row */}
          <div className="flex items-start justify-between gap-4 border-b border-luxury-black/10 pb-4">
            <div className="flex-1">
              <h1 className="text-[20px] font-light text-luxury-black uppercase tracking-[0.03em] leading-tight mb-1">{PROPERTY.title}</h1>
              <p className="text-[13px] text-luxury-black/60 font-light flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {PROPERTY.location}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[28px] font-extralight text-luxury-black tracking-tight leading-none">{PROPERTY.price}</p>
              <p className="text-[12px] text-luxury-black/50 font-light mt-1">Alquiler: {PROPERTY.rentalPrice}</p>
              <p className="text-[11px] text-luxury-black/45 font-light mt-0.5">Ref: {PROPERTY.ref}</p>
            </div>
          </div>

          {/* Specs strip */}
          <div className="flex items-center justify-between bg-neutral-50 px-5 py-3">
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
                <span className="text-luxury-black/55 text-[11px] font-light">{s.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-luxury-black/70">
              Energy: <span className="bg-green-100 text-green-800 px-1.5 py-0.5 text-[11px] font-medium">{PROPERTY.energyClass}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-[11px] tracking-[0.22em] uppercase text-luxury-black/50 font-light mb-2">Description</p>
            <p className="text-[13px] leading-[1.8] text-luxury-black/85 font-light">{PROPERTY.description}</p>
          </div>

          {/* Features grid */}
          <div>
            <p className="text-[11px] tracking-[0.22em] uppercase text-luxury-black/50 font-light mb-2">Features</p>
            <div className="grid grid-cols-3 gap-x-4 gap-y-1.5">
              {PROPERTY.features.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[12px] text-luxury-black/80 font-light">
                  <Check className="w-3 h-3 text-luxury-black/40" strokeWidth={1.5} /> {f}
                </div>
              ))}
            </div>
          </div>

          {/* Map placeholder */}
          <div className="bg-neutral-100 h-[100px] flex items-center justify-center text-luxury-black/30 text-[13px] font-light">
            <MapPin className="w-4 h-4 mr-1" /> Map — {PROPERTY.location}
          </div>
        </div>

        {/* Footer — Agent contact */}
        <div className="bg-luxury-black px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-[13px] text-white font-normal">{PROPERTY.agent.name}</p>
            <p className="text-[11px] text-white/50 font-light">{PROPERTY.agent.role}</p>
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-[12px] text-white/70 font-light">
              <Phone className="w-3.5 h-3.5" /> {PROPERTY.agent.phone}
            </span>
            <span className="flex items-center gap-1.5 text-[12px] text-white/70 font-light">
              <Mail className="w-3.5 h-3.5" /> {PROPERTY.agent.email}
            </span>
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

export default PropertyPdfV1;
