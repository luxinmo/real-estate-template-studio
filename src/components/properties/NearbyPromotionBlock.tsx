import { Building2, MapPin, Home } from "lucide-react";

interface Promotion {
  image: string;
  name: string;
  location: string;
  availableUnits: number;
  totalUnits: number;
  priceFrom: string;
  typologies: string[];
  deliveryDate: string;
}

const DEMO_PROMOTIONS: Promotion[] = [
  {
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop",
    name: "Residencial Mar Blau",
    location: "Santa Eulalia, Ibiza",
    availableUnits: 12,
    totalUnits: 36,
    priceFrom: "385.000 €",
    typologies: ["2 Dorm.", "3 Dorm.", "Ático"],
    deliveryDate: "Q2 2027",
  },
  {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop",
    name: "Villas del Golf",
    location: "Moraira, Costa Blanca",
    availableUnits: 5,
    totalUnits: 18,
    priceFrom: "720.000 €",
    typologies: ["Villa 3 Dorm.", "Villa 4 Dorm."],
    deliveryDate: "Q4 2026",
  },
  {
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop",
    name: "Torre Skyline",
    location: "Benidorm, Costa Blanca",
    availableUnits: 28,
    totalUnits: 64,
    priceFrom: "245.000 €",
    typologies: ["1 Dorm.", "2 Dorm.", "3 Dorm."],
    deliveryDate: "Q1 2027",
  },
];

const NearbyPromotionBlock = () => {
  return (
    <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-primary/[0.03] to-transparent p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-4.5 h-4.5 text-primary/70" strokeWidth={1.5} />
        <h3 className="text-[14px] font-semibold text-foreground tracking-tight">Promociones cercanas</h3>
        <span className="ml-auto text-[11px] text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
          {DEMO_PROMOTIONS.length} resultados
        </span>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {DEMO_PROMOTIONS.map((promo, i) => (
          <div
            key={i}
            className="group rounded-lg border border-border bg-card overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/20"
          >
            {/* Image */}
            <div className="relative h-[120px] overflow-hidden">
              <img
                src={promo.image}
                alt={promo.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2 bg-card/90 backdrop-blur-sm text-[10px] font-semibold text-foreground px-2 py-0.5 rounded-md border border-border/50">
                Obra nueva
              </div>
              <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
                Entrega {promo.deliveryDate}
              </div>
            </div>

            {/* Content */}
            <div className="p-3 space-y-2">
              <div>
                <h4 className="text-[13px] font-semibold text-foreground leading-tight">{promo.name}</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />
                  <span className="text-[11px] text-muted-foreground">{promo.location}</span>
                </div>
              </div>

              {/* Units */}
              <div className="flex items-center gap-1.5">
                <Home className="w-3 h-3 text-primary/60" strokeWidth={1.5} />
                <span className="text-[11px] text-foreground/80">
                  <strong className="text-primary">{promo.availableUnits}</strong> / {promo.totalUnits} unidades disponibles
                </span>
              </div>

              {/* Typologies */}
              <div className="flex flex-wrap gap-1">
                {promo.typologies.map((t, ti) => (
                  <span key={ti} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>

              {/* Price */}
              <div className="pt-1 border-t border-border">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Desde</p>
                <p className="text-[15px] font-semibold text-foreground tracking-tight">{promo.priceFrom}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyPromotionBlock;
