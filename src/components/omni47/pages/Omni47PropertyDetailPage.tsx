import { useState } from "react";
import { ChevronLeft, ChevronRight, Bed, Bath, Maximize, LandPlot, Phone, Mail, MessageCircle, MapPin, Check } from "lucide-react";
import Omni47PropertyCard from "../shared/Omni47PropertyCard";
import type { Omni47PropertyDetailPageProps } from "../types";

const Omni47PropertyDetailPage = ({
  images,
  title,
  ref: refId,
  locationBreadcrumb,
  price,
  operationTag,
  isOffMarket,
  beds,
  baths,
  builtSqm,
  plotSqm,
  description,
  features,
  agent,
  similarProperties,
}: Omni47PropertyDetailPageProps) => {
  const [mainImg, setMainImg] = useState(0);

  return (
    <div className="min-h-screen bg-omni47-cream pt-20 lg:pt-24">
      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
          {/* Main */}
          <div className="lg:col-span-8 relative aspect-[16/10] overflow-hidden group">
            <img
              src={images[mainImg]}
              alt={title}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setMainImg((i) => (i === 0 ? images.length - 1 : i - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMainImg((i) => (i === images.length - 1 ? 0 : i + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
            {isOffMarket && (
              <span className="absolute top-4 right-4 bg-omni47-gold text-white text-[10px] tracking-[0.15em] uppercase px-4 py-2 font-light">
                Off-Market
              </span>
            )}
          </div>
          {/* Thumbnails */}
          <div className="lg:col-span-4 grid grid-cols-4 lg:grid-cols-2 gap-2">
            {images.slice(0, 4).map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImg(i)}
                className={`aspect-square overflow-hidden border-2 transition-colors ${
                  mainImg === i ? "border-omni47-gold" : "border-transparent"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left */}
          <div className="lg:col-span-8 space-y-10">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 text-[12px] text-omni47-text-muted font-light">
                {locationBreadcrumb.map((loc, i) => (
                  <span key={i} className="flex items-center gap-2">
                    {i > 0 && <span className="text-omni47-cream-dark">/</span>}
                    {loc}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-start justify-between gap-4 mt-3">
                <div>
                  <h1 className="font-cormorant text-[32px] lg:text-[42px] font-extralight text-omni47-navy">
                    {title}
                  </h1>
                  <p className="text-[11px] font-mono text-omni47-text-muted/50 mt-1">{refId}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 border border-omni47-cream-dark text-[10px] tracking-[0.15em] uppercase text-omni47-text-muted mb-2">
                    {operationTag}
                  </span>
                  <p className="font-cormorant text-[32px] font-extralight text-omni47-navy">{price}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-omni47-cream-dark">
              {[
                { icon: Bed, label: "Bedrooms", value: beds },
                { icon: Bath, label: "Bathrooms", value: baths },
                { icon: Maximize, label: "Built m²", value: builtSqm },
                ...(plotSqm ? [{ icon: LandPlot, label: "Plot m²", value: plotSqm }] : []),
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <s.icon className="w-5 h-5 text-omni47-gold" />
                  <div>
                    <p className="font-cormorant text-[22px] font-light text-omni47-navy">{s.value}</p>
                    <p className="text-[11px] tracking-wider uppercase text-omni47-text-muted font-light">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="font-cormorant text-[24px] font-light text-omni47-navy mb-4">Description</h2>
              <p className="text-[14px] font-light leading-[1.9] text-omni47-text-muted">{description}</p>
            </div>

            {/* Features */}
            <div>
              <h2 className="font-cormorant text-[24px] font-light text-omni47-navy mb-6">Features & Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {features.map((fg) => (
                  <div key={fg.category}>
                    <h3 className="text-[12px] tracking-[0.15em] uppercase text-omni47-gold font-light mb-3">
                      {fg.category}
                    </h3>
                    <ul className="space-y-2">
                      {fg.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-[13px] font-light text-omni47-text-muted">
                          <Check className="w-3.5 h-3.5 text-omni47-gold shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div>
              <h2 className="font-cormorant text-[24px] font-light text-omni47-navy mb-4">Location</h2>
              <div className="aspect-[16/9] bg-omni47-cream-dark flex items-center justify-center">
                <MapPin className="w-8 h-8 text-omni47-text-muted/30" />
              </div>
            </div>
          </div>

          {/* Right - Agent card */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white p-6 space-y-5">
              <div className="flex items-center gap-4">
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-cormorant text-[20px] font-light text-omni47-navy">{agent.name}</h3>
                  <p className="text-[12px] text-omni47-text-muted font-light">Property Consultant</p>
                </div>
              </div>
              <div className="space-y-3">
                <a
                  href={`tel:${agent.phone}`}
                  className="flex items-center gap-3 w-full px-4 py-3 border border-omni47-cream-dark text-[13px] font-light text-omni47-text hover:border-omni47-gold transition-colors"
                >
                  <Phone className="w-4 h-4 text-omni47-gold" /> {agent.phone}
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  className="flex items-center gap-3 w-full px-4 py-3 border border-omni47-cream-dark text-[13px] font-light text-omni47-text hover:border-omni47-gold transition-colors"
                >
                  <Mail className="w-4 h-4 text-omni47-gold" /> {agent.email}
                </a>
                {agent.whatsappUrl && (
                  <a
                    href={agent.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-omni47-navy text-white text-[12px] tracking-[0.1em] uppercase font-light hover:bg-omni47-navy-light transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar properties */}
        {similarProperties.length > 0 && (
          <div className="mt-20 pt-10 border-t border-omni47-cream-dark">
            <h2 className="font-cormorant text-[32px] font-extralight text-omni47-navy mb-8">
              Similar Properties
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.slice(0, 3).map((p) => (
                <Omni47PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Omni47PropertyDetailPage;
