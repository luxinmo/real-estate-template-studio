import type { Omni47BrowseByDestinationProps } from "../types";

const Omni47BrowseByDestination = ({
  title,
  subtitle,
  destinations,
}: Omni47BrowseByDestinationProps) => (
  <section className="py-20 lg:py-28 bg-omni47-cream">
    <div className="max-w-7xl mx-auto px-5 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="font-cormorant text-[32px] lg:text-[44px] font-extralight text-omni47-navy">
          {title}
        </h2>
        <p className="text-[14px] font-light text-omni47-text-muted mt-2">{subtitle}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {destinations.map((d) => (
          <a
            key={d.url}
            href={d.url}
            className="group relative aspect-[3/4] overflow-hidden"
          >
            <img
              src={d.image}
              alt={d.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="font-cormorant text-[18px] lg:text-[20px] font-light text-white">
                {d.name}
              </h3>
              <p className="text-[11px] tracking-wider uppercase text-white/60 font-light mt-0.5">
                {d.count} properties
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default Omni47BrowseByDestination;
