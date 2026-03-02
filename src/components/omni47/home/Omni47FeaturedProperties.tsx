import { ArrowRight } from "lucide-react";
import Omni47PropertyCard from "../shared/Omni47PropertyCard";
import type { Omni47FeaturedPropertiesProps } from "../types";

const Omni47FeaturedProperties = ({
  title,
  subtitle,
  viewAllLabel,
  viewAllHref,
  properties,
}: Omni47FeaturedPropertiesProps) => (
  <section className="py-20 lg:py-28 bg-white">
    <div className="max-w-7xl mx-auto px-5 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
        <div>
          <h2 className="font-cormorant text-[32px] lg:text-[44px] font-extralight text-omni47-navy">
            {title}
          </h2>
          <p className="text-[14px] font-light text-omni47-text-muted mt-2">{subtitle}</p>
        </div>
        <a
          href={viewAllHref}
          className="flex items-center gap-2 text-[12px] tracking-[0.15em] uppercase text-omni47-gold hover:text-omni47-navy transition-colors shrink-0"
        >
          {viewAllLabel} <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Horizontal scroll */}
      <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {properties.slice(0, 4).map((p) => (
          <div key={p.id} className="min-w-[300px] sm:min-w-[340px] snap-start">
            <Omni47PropertyCard property={p} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Omni47FeaturedProperties;
