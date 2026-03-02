import { ArrowRight } from "lucide-react";
import Omni47SectionLabel from "../shared/Omni47SectionLabel";
import type { Omni47NewDevelopmentsProps } from "../types";

const Omni47NewDevelopments = ({
  label,
  title,
  description,
  stats,
  developments,
}: Omni47NewDevelopmentsProps) => (
  <section className="py-20 lg:py-28 bg-white">
    <div className="max-w-7xl mx-auto px-5 lg:px-8">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
        <div className="space-y-4">
          <Omni47SectionLabel text={label} />
          <h2 className="font-cormorant text-[32px] lg:text-[44px] font-extralight text-omni47-navy leading-[1.15]">
            {title}
          </h2>
        </div>
        <div className="flex flex-col justify-end">
          <p className="text-[14px] font-light leading-[1.8] text-omni47-text-muted max-w-md">
            {description}
          </p>
          {/* Stats row */}
          <div className="flex gap-8 mt-6">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="font-cormorant text-[28px] font-extralight text-omni47-navy">{s.value}</p>
                <p className="text-[11px] tracking-[0.15em] uppercase text-omni47-text-muted font-light">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {developments.map((d) => (
          <a key={d.id} href={d.href} className="group bg-omni47-cream overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={d.image}
                alt={d.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 bg-omni47-gold text-white text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 font-light">
                {d.badge}
              </span>
              <span className="absolute top-3 right-3 bg-white/90 text-omni47-navy text-[10px] tracking-wider uppercase px-3 py-1.5 font-light">
                {d.deliveryQuarter}
              </span>
            </div>
            <div className="p-5 space-y-2">
              <p className="text-[11px] tracking-[0.15em] uppercase text-omni47-text-muted font-light">{d.location}</p>
              <h3 className="font-cormorant text-[20px] font-light text-omni47-navy group-hover:text-omni47-gold transition-colors">
                {d.title}
              </h3>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[14px] font-light text-omni47-text-muted">
                  From <span className="font-cormorant text-[22px] text-omni47-navy">{d.fromPrice}</span>
                </span>
                <span className="text-[11px] tracking-wider uppercase text-omni47-text-muted">{d.units}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default Omni47NewDevelopments;
