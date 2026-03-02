import { useState } from "react";
import { ChevronLeft, ChevronRight, Bed, Bath, Maximize, LandPlot, Phone } from "lucide-react";
import type { Omni47PropertyCardProps } from "../types";

const Omni47PropertyCard = ({
  property: p,
  variant = "vertical",
  onContact,
}: Omni47PropertyCardProps) => {
  const [imgIdx, setImgIdx] = useState(0);

  const prev = () => setImgIdx((i) => (i === 0 ? p.images.length - 1 : i - 1));
  const next = () => setImgIdx((i) => (i === p.images.length - 1 ? 0 : i + 1));

  const isHorizontal = variant === "horizontal";

  return (
    <div
      className={`group bg-white overflow-hidden transition-shadow hover:shadow-lg ${
        isHorizontal ? "flex flex-col sm:flex-row" : ""
      }`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${isHorizontal ? "sm:w-[340px] shrink-0" : ""}`}>
        <div className={`relative ${isHorizontal ? "aspect-[4/3]" : "aspect-[3/2]"}`}>
          <img
            src={p.images[imgIdx]}
            alt={p.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Tag */}
          {p.tag && (
            <span className="absolute top-3 left-3 bg-omni47-navy text-white text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 font-light">
              {p.tag}
            </span>
          )}

          {/* Off-market badge */}
          {p.isOffMarket && (
            <span className="absolute top-3 right-3 bg-omni47-gold text-white text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 font-light">
              Off-Market
            </span>
          )}

          {/* Carousel controls */}
          {p.images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.preventDefault(); prev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-omni47-navy" />
              </button>
              <button
                onClick={(e) => { e.preventDefault(); next(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-3.5 h-3.5 text-omni47-navy" />
              </button>
              <span className="absolute bottom-2 right-3 text-[11px] text-white/80 font-light">
                {imgIdx + 1}/{p.images.length}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[11px] tracking-[0.15em] uppercase text-omni47-text-muted font-light">
          {p.location}
        </p>
        <a href={p.href}>
          <h3 className="font-cormorant text-[20px] lg:text-[22px] font-light text-omni47-navy mt-1.5 hover:text-omni47-gold transition-colors">
            {p.title}
          </h3>
        </a>

        {/* Specs */}
        <div className="flex items-center gap-4 mt-3 text-omni47-text-muted">
          <span className="flex items-center gap-1 text-[12px]">
            <Bed className="w-3.5 h-3.5" /> {p.beds}
          </span>
          <span className="flex items-center gap-1 text-[12px]">
            <Bath className="w-3.5 h-3.5" /> {p.baths}
          </span>
          <span className="flex items-center gap-1 text-[12px]">
            <Maximize className="w-3.5 h-3.5" /> {p.builtSqm} m²
          </span>
          {p.plotSqm && (
            <span className="flex items-center gap-1 text-[12px]">
              <LandPlot className="w-3.5 h-3.5" /> {p.plotSqm} m²
            </span>
          )}
        </div>

        {/* Features */}
        {p.features && p.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {p.features.map((f) => (
              <span key={f} className="text-[10px] tracking-wider uppercase px-2 py-1 border border-omni47-cream-dark text-omni47-text-muted">
                {f}
              </span>
            ))}
          </div>
        )}

        {/* Price + Contact */}
        <div className="flex items-center justify-between mt-auto pt-4">
          <span className="font-cormorant text-[24px] font-light text-omni47-navy">
            {p.price}
          </span>
          {onContact && (
            <button
              onClick={() => onContact(p.id)}
              className="flex items-center gap-1.5 text-[11px] tracking-[0.1em] uppercase text-omni47-gold hover:text-omni47-navy transition-colors"
            >
              <Phone className="w-3 h-3" /> Contact
            </button>
          )}
        </div>

        {/* Ref */}
        <p className="text-[11px] font-mono text-omni47-text-muted/50 mt-2">
          {p.ref}
        </p>
      </div>
    </div>
  );
};

export default Omni47PropertyCard;
