import { Bed, Bath, Maximize, MapPin, ArrowRight, Info } from "lucide-react";

/* ─── Types ─── */
export interface SimilarProperty {
  image: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqm: number;
  badge?: "Similar" | "Top Interest" | "Luxury";
  href?: string;
}

interface SimilarCompetingPropertiesProps {
  properties: SimilarProperty[];
  sectionTitle?: string;
  subtitle?: string;
}

/* ─── Badge colors ─── */
const BADGE_STYLES: Record<string, string> = {
  Similar: "bg-luxury-black/[0.06] text-luxury-black/70",
  "Top Interest": "bg-luxury-gold/[0.12] text-luxury-gold border border-luxury-gold/25",
  Luxury: "bg-luxury-black text-white",
};

/* ─── Card ─── */
const SimilarPropertyCard = ({ property }: { property: SimilarProperty }) => (
  <a
    href={property.href || "#"}
    className="group flex flex-col bg-white rounded-[14px] overflow-hidden shadow-[0_2px_16px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.12)] transition-all duration-500 snap-start shrink-0 w-[300px] sm:w-auto"
  >
    {/* Image */}
    <div className="relative overflow-hidden aspect-[16/9]">
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Price overlay — bottom-left */}
      <div className="absolute bottom-0 left-0 px-4 py-3">
        <p className="text-[22px] font-extralight text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          {property.price}
        </p>
      </div>

      {/* Badge — top-right */}
      {property.badge && (
        <span
          className={`absolute top-3 right-3 text-[10px] tracking-[0.14em] uppercase font-medium px-3 py-1.5 rounded-sm backdrop-blur-sm ${BADGE_STYLES[property.badge] || BADGE_STYLES.Similar}`}
        >
          {property.badge}
        </span>
      )}
    </div>

    {/* Info */}
    <div className="flex flex-col flex-1 p-5">
      <h3 className="text-[14px] font-medium text-luxury-black leading-snug tracking-[0.01em] mb-1.5 line-clamp-2 group-hover:text-luxury-gold transition-colors duration-300">
        {property.title}
      </h3>
      <p className="text-[12px] text-luxury-black/50 font-light flex items-center gap-1 tracking-wide mb-3">
        <MapPin className="w-3 h-3 shrink-0" /> {property.location}
      </p>

      {/* Specs */}
      <div className="flex items-center gap-5 pt-3 mt-auto border-t border-luxury-black/[0.06]">
        {[
          { icon: Bed, value: property.beds, label: "Beds" },
          { icon: Bath, value: property.baths, label: "Baths" },
          { icon: Maximize, value: `${property.sqm} m²`, label: "Built" },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[12px] text-luxury-black/55 font-light">
            <s.icon className="w-3.5 h-3.5 text-luxury-gold/60" strokeWidth={1.3} />
            <span>{s.value}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 text-[11px] tracking-[0.16em] uppercase font-medium text-luxury-black border border-luxury-black/12 hover:bg-luxury-black hover:text-white transition-all duration-300 rounded-sm">
        Ver propiedad <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
      </button>
    </div>
  </a>
);

/* ─── Empty State ─── */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-full bg-luxury-gold/[0.08] flex items-center justify-center mb-5">
      <MapPin className="w-6 h-6 text-luxury-gold/60" strokeWidth={1.2} />
    </div>
    <h3 className="text-[16px] font-normal text-luxury-black tracking-[0.02em] mb-2">
      No similar properties available yet
    </h3>
    <p className="text-[13px] text-luxury-black/50 font-light max-w-xs leading-relaxed">
      We are analyzing the market to suggest the best matches for this property.
    </p>
  </div>
);

/* ─── Main Component ─── */
const SimilarCompetingProperties = ({
  properties,
  sectionTitle = "Propiedades similares en esta zona",
  subtitle = "Otras propiedades que podrían interesarte",
}: SimilarCompetingPropertiesProps) => {
  const hasProperties = properties.length > 0;

  return (
    <section className="bg-white">
      {/* Divider */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="border-t border-luxury-black/[0.06]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14">
        {/* Component Tag */}
        <div className="mb-8">
          <span className="text-[10px] tracking-[0.3em] uppercase text-luxury-black/25 font-light">
            PROPERTY_MODULE_SIMILAR
          </span>
        </div>

        {/* Section Header */}
        <div className="mb-3">
          <p className="text-[13px] tracking-[0.22em] uppercase text-luxury-gold/90 font-normal mb-3">
            {subtitle}
          </p>
          <h2 className="text-[24px] md:text-[28px] font-extralight text-luxury-black tracking-[0.01em] leading-tight">
            {sectionTitle}
          </h2>
        </div>

        {/* Info line */}
        {hasProperties && (
          <div className="flex items-center gap-2 mb-8 mt-4">
            <Info className="w-3.5 h-3.5 text-luxury-black/30 shrink-0" strokeWidth={1.5} />
            <p className="text-[12px] text-luxury-black/40 font-light tracking-wide">
              This property is compared based on location, price range and property type.
            </p>
          </div>
        )}

        {/* Cards or Empty State */}
        {hasProperties ? (
          <>
            {/* Desktop/Tablet Grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {properties.map((p, i) => (
                <SimilarPropertyCard key={i} property={p} />
              ))}
            </div>

            {/* Mobile Horizontal Scroll */}
            <div className="sm:hidden flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
              {properties.map((p, i) => (
                <SimilarPropertyCard key={i} property={p} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
};

export default SimilarCompetingProperties;
export { SimilarPropertyCard };
