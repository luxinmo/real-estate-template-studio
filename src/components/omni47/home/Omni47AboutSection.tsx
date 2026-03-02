import { Play } from "lucide-react";
import Omni47SectionLabel from "../shared/Omni47SectionLabel";
import type { Omni47AboutSectionProps } from "../types";

const Omni47AboutSection = ({
  label,
  title,
  description,
  image,
  videoButtonLabel,
}: Omni47AboutSectionProps) => (
  <section className="py-20 lg:py-28 bg-omni47-cream">
    <div className="max-w-7xl mx-auto px-5 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Text */}
        <div className="space-y-6 max-w-lg">
          <Omni47SectionLabel text={label} />
          <h2 className="font-cormorant text-[32px] lg:text-[44px] font-extralight text-omni47-navy leading-[1.15]">
            {title}
          </h2>
          <p className="text-[14px] lg:text-[15px] font-light leading-[1.8] text-omni47-text-muted">
            {description}
          </p>
          {videoButtonLabel && (
            <button className="flex items-center gap-3 group mt-4">
              <span className="w-12 h-12 rounded-full border border-omni47-gold flex items-center justify-center group-hover:bg-omni47-gold transition-colors">
                <Play className="w-4 h-4 text-omni47-gold group-hover:text-white transition-colors" />
              </span>
              <span className="text-[13px] tracking-[0.1em] uppercase text-omni47-navy font-light">
                {videoButtonLabel}
              </span>
            </button>
          )}
        </div>

        {/* Image */}
        {image && (
          <div className="relative">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full aspect-[4/5] object-cover"
            />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-omni47-gold/30" />
          </div>
        )}
      </div>
    </div>
  </section>
);

export default Omni47AboutSection;
