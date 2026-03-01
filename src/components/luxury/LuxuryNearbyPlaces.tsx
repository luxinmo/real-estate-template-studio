import { MapPin, GraduationCap, Heart, ShoppingBag, Bus, UtensilsCrossed, Palmtree } from "lucide-react";

const CATEGORIES = [
  {
    icon: Palmtree, label: "Beaches", color: "text-blue-500/70",
    places: [
      { name: "Cala Llenya", distance: "1.2 km", walk: "15 min" },
      { name: "Es Canar Beach", distance: "2.8 km", walk: "35 min" },
      { name: "Cala Nova", distance: "3.5 km", drive: "6 min" },
    ],
  },
  {
    icon: GraduationCap, label: "Education", color: "text-amber-600/70",
    places: [
      { name: "Santa Eulalia International School", distance: "1.8 km", drive: "4 min" },
      { name: "Morna International College", distance: "4.2 km", drive: "8 min" },
    ],
  },
  {
    icon: Heart, label: "Health", color: "text-red-500/70",
    places: [
      { name: "Can Misses Hospital", distance: "18 km", drive: "22 min" },
      { name: "Santa Eulalia Medical Centre", distance: "2.1 km", drive: "5 min" },
    ],
  },
  {
    icon: ShoppingBag, label: "Shopping", color: "text-purple-500/70",
    places: [
      { name: "Santa Eulalia Town Centre", distance: "2.0 km", drive: "4 min" },
      { name: "Hipermercado", distance: "2.5 km", drive: "5 min" },
    ],
  },
  {
    icon: Bus, label: "Transport", color: "text-green-600/70",
    places: [
      { name: "Ibiza Airport (IBZ)", distance: "20 km", drive: "25 min" },
      { name: "Santa Eulalia Bus Station", distance: "2.3 km", drive: "5 min" },
      { name: "Ibiza Port", distance: "19 km", drive: "22 min" },
    ],
  },
  {
    icon: UtensilsCrossed, label: "Restaurants", color: "text-orange-500/70",
    places: [
      { name: "Es Terral", distance: "1.5 km", walk: "18 min" },
      { name: "Can Curreu", distance: "3.0 km", drive: "5 min" },
      { name: "Amante Beach Club", distance: "5.2 km", drive: "10 min" },
    ],
  },
];

const LuxuryNearbyPlaces = () => {
  return (
    <div className="pt-6 border-t border-neutral-100">
      <p className="text-[12px] tracking-[0.25em] uppercase text-luxury-black/40 font-light mb-5">What's Nearby</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {CATEGORIES.map((cat, ci) => (
          <div key={ci}>
            <div className="flex items-center gap-1.5 mb-3">
              <cat.icon className={`w-4 h-4 ${cat.color}`} strokeWidth={1.5} />
              <h3 className="text-[13px] font-medium tracking-[0.12em] uppercase text-luxury-black/60">{cat.label}</h3>
            </div>
            <div className="space-y-2">
              {cat.places.map((place, pi) => (
                <div key={pi} className="flex items-center justify-between text-[14px]">
                  <span className="text-luxury-black/65 font-light">{place.name}</span>
                  <div className="flex items-center gap-2 text-luxury-black/40 text-[13px] font-light">
                    <span>{place.distance}</span>
                    <span className="text-luxury-black/20">·</span>
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
