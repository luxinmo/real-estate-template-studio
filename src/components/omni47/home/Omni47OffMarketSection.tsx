import Omni47Button from "../shared/Omni47Button";
import type { Omni47OffMarketSectionProps } from "../types";

const Omni47OffMarketSection = ({
  backgroundImage,
  headline,
  description,
  button,
}: Omni47OffMarketSectionProps) => (
  <section className="relative py-28 lg:py-36 overflow-hidden">
    <img
      src={backgroundImage}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-omni47-navy/70" />

    <div className="relative z-10 max-w-3xl mx-auto px-5 text-center">
      <span className="inline-block text-[11px] tracking-[0.25em] uppercase text-omni47-gold font-light mb-6">
        Exclusive Access
      </span>
      <h2 className="font-cormorant text-[32px] sm:text-[44px] lg:text-[56px] font-extralight text-white leading-[1.1]">
        {headline}
      </h2>
      <p className="mt-5 text-[14px] lg:text-[16px] font-light text-white/60 max-w-xl mx-auto leading-relaxed">
        {description}
      </p>
      <div className="mt-8">
        <Omni47Button {...button} variant={button.variant || "gold"} showArrow />
      </div>
    </div>
  </section>
);

export default Omni47OffMarketSection;
