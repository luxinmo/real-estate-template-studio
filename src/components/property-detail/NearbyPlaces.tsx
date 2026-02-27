import {
  GraduationCap, ShoppingCart, Stethoscope, Bus, UtensilsCrossed,
  Waves, Trees, Dumbbell, Landmark, Fuel,
} from "lucide-react";

interface Place {
  name: string;
  distance: string;
  walkMin?: number;
}

interface Category {
  icon: React.ElementType;
  label: string;
  color: string;
  places: Place[];
}

const categories: Category[] = [
  {
    icon: Waves,
    label: "Playas",
    color: "text-sky-500",
    places: [
      { name: "Playa La Roda", distance: "350 m", walkMin: 5 },
      { name: "Playa Cap Blanch", distance: "800 m", walkMin: 11 },
      { name: "Cala del Soio", distance: "1.2 km", walkMin: 16 },
    ],
  },
  {
    icon: GraduationCap,
    label: "Educación",
    color: "text-amber-500",
    places: [
      { name: "CEIP Altea", distance: "600 m", walkMin: 8 },
      { name: "IES Altea", distance: "1.1 km", walkMin: 14 },
      { name: "Escuela de Música", distance: "450 m", walkMin: 6 },
    ],
  },
  {
    icon: Stethoscope,
    label: "Salud",
    color: "text-red-400",
    places: [
      { name: "Centro de Salud Altea", distance: "500 m", walkMin: 7 },
      { name: "Hospital Marina Baixa", distance: "4.2 km" },
      { name: "Farmacia Plaza", distance: "200 m", walkMin: 3 },
    ],
  },
  {
    icon: ShoppingCart,
    label: "Comercio",
    color: "text-emerald-500",
    places: [
      { name: "Mercadona", distance: "400 m", walkMin: 5 },
      { name: "Mercado Municipal", distance: "300 m", walkMin: 4 },
      { name: "Centro Comercial La Marina", distance: "3.5 km" },
    ],
  },
  {
    icon: Bus,
    label: "Transporte",
    color: "text-indigo-500",
    places: [
      { name: "Parada TRAM Altea", distance: "250 m", walkMin: 3 },
      { name: "Parada Bus Interurbano", distance: "350 m", walkMin: 5 },
      { name: "AP-7 (acceso)", distance: "2.8 km" },
    ],
  },
  {
    icon: UtensilsCrossed,
    label: "Restauración",
    color: "text-orange-400",
    places: [
      { name: "Casco Antiguo (restaurantes)", distance: "200 m", walkMin: 3 },
      { name: "Paseo Marítimo", distance: "300 m", walkMin: 4 },
    ],
  },
  {
    icon: Dumbbell,
    label: "Ocio y deporte",
    color: "text-violet-500",
    places: [
      { name: "Club de Golf Don Cayo", distance: "3 km" },
      { name: "Club Náutico Altea", distance: "600 m", walkMin: 8 },
      { name: "Polideportivo Municipal", distance: "900 m", walkMin: 12 },
    ],
  },
];

const NearbyPlaces = () => (
  <div className="rounded-xl border border-border bg-card shadow-card p-6">
    <h3 className="text-base font-semibold text-foreground mb-5">Lugares cercanos</h3>

    <div className="space-y-5">
      {categories.map((cat) => (
        <div key={cat.label}>
          <div className="flex items-center gap-2 mb-2.5">
            <cat.icon className={`h-4 w-4 ${cat.color}`} strokeWidth={1.5} />
            <span className="text-sm font-medium text-foreground">{cat.label}</span>
          </div>

          <div className="space-y-1.5 ml-6">
            {cat.places.map((place) => (
              <div key={place.name} className="flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">{place.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">{place.distance}</span>
                  {place.walkMin && (
                    <span className="text-[11px] text-muted-foreground/60">
                      🚶 {place.walkMin} min
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default NearbyPlaces;
