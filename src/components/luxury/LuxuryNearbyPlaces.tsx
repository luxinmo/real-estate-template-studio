import { MapPin, GraduationCap, Heart, ShoppingBag, Bus, UtensilsCrossed, Palmtree } from "lucide-react";

const CATEGORIES = [
  {
    icon: Palmtree, label: "Beaches", color: "text-blue-500",
    places: [
      { name: "Cala Llenya", distance: "1.2 km", walk: "15 min" },
      { name: "Es Canar Beach", distance: "2.8 km", walk: "35 min" },
      { name: "Cala Nova", distance: "3.5 km", drive: "6 min" },
    ],
  },
  {
    icon: GraduationCap, label: "Education", color: "text-amber-600",
    places: [
      { name: "Santa Eulalia International School", distance: "1.8 km", drive: "4 min" },
      { name: "Morna International College", distance: "4.2 km", drive: "8 min" },
    ],
  },
  {
    icon: Heart, label: "Health", color: "text-red-500",
    places: [
      { name: "Can Misses Hospital", distance: "18 km", drive: "22 min" },
      { name: "Santa Eulalia Medical Centre", distance: "2.1 km", drive: "5 min" },
    ],
  },
  {
    icon: ShoppingBag, label: "Shopping", color: "text-purple-500",
    places: [
      { name: "Santa Eulalia Town Centre", distance: "2.0 km", drive: "4 min" },
      { name: "Hipermercado", distance: "2.5 km", drive: "5 min" },
    ],
  },
  {
    icon: Bus, label: "Transport", color: "text-green-600",
    places: [
      { name: "Ibiza Airport (IBZ)", distance: "20 km", drive: "25 min" },
      { name: "Santa Eulalia Bus Station", distance: "2.3 km", drive: "5 min" },
      { name: "Ibiza Port", distance: "19 km", drive: "22 min" },
    ],
  },
  {
    icon: UtensilsCrossed, label: "Restaurants", color: "text-orange-500",
    places: [
      { name: "Es Terral", distance: "1.5 km", walk: "18 min" },
      { name: "Can Curreu", distance: "3.0 km", drive: "5 min" },
      { name: "Amante Beach Club", distance: "5.2 km", drive: "10 min" },
    ],
  },
];

const LuxuryNearbyPlaces = () => {
  return (
    <div className="pt-10 border-t border-neutral-100">
      <h2 className="text-4xl font-light text-luxury-black font-serif tracking-tight mb-8 flex items-center gap-3">
        <MapPin className="w-8 h-8 text-luxury-black/40" strokeWidth={1.3} />
        What's Nearby
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {CATEGORIES.map((cat, ci) => (
          <div key={ci}>
            <div className="flex items-center gap-2 mb-4">
              <cat.icon className={`w-5 h-5 ${cat.color}`} strokeWidth={1.5} />
              <h3 className="text-base font-medium tracking-[0.1em] uppercase text-luxury-black/70">{cat.label}</h3>
            </div>
            <div className="space-y-2.5">
              {cat.places.map((place, pi) => (
                <div key={pi} className="flex items-center justify-between text-base">
                  <span className="text-luxury-black/75 font-light">{place.name}</span>
                  <div className="flex items-center gap-3 text-luxury-black/45 text-sm font-light">
                    <span>{place.distance}</span>
                    <span className="text-luxury-black/30">•</span>
                    <span>{"walk" in place ? `🚶 ${place.walk}` : `🚗 ${place.drive}`}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LuxuryNearbyPlaces;
