import Omni47Button from "../shared/Omni47Button";
import type { Omni47HeroProps } from "../types";

const Omni47Hero = ({
  backgroundImage,
  headline,
  subheadline,
  buttons,
  overlayOpacity = 0.45,
}: Omni47HeroProps) => (
  <section className="relative h-[85vh] lg:h-screen flex items-center justify-center overflow-hidden">
    <img
      src={backgroundImage}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(to bottom, rgba(27,42,59,${overlayOpacity}), rgba(27,42,59,${overlayOpacity * 0.7}) 60%, rgba(27,42,59,${overlayOpacity * 1.2}))`,
      }}
    />

    <div className="relative z-10 text-center px-5 max-w-4xl mx-auto">
      <h1 className="font-cormorant text-[36px] sm:text-[52px] lg:text-[72px] font-extralight text-white leading-[1.1] tracking-tight">
        {headline}
      </h1>
      <p className="mt-5 text-[14px] lg:text-[16px] font-light text-white/70 max-w-xl mx-auto leading-relaxed">
        {subheadline}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
        {buttons.map((btn, i) => (
          <Omni47Button
            key={i}
            {...btn}
            variant={i === 0 ? "secondary" : "primary"}
            showArrow={i === 0}
          />
        ))}
      </div>
    </div>

    {/* Scroll indicator */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
      <div className="w-px h-12 bg-white/30" />
      <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-light">Scroll</span>
    </div>
  </section>
);

export default Omni47Hero;
