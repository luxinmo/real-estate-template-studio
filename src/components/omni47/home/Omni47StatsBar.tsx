import type { Omni47StatsBarProps } from "../types";

const Omni47StatsBar = ({ stats }: Omni47StatsBarProps) => (
  <section className="bg-omni47-navy">
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10 lg:py-14">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
        {stats.map((s, i) => (
          <div key={i} className="text-center lg:border-r last:border-r-0 border-white/10">
            <p className="font-cormorant text-[36px] lg:text-[48px] font-extralight text-white">
              {s.value}
            </p>
            <p className="text-[11px] tracking-[0.2em] uppercase text-white/50 font-light mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Omni47StatsBar;
