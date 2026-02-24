import { MapPin } from "lucide-react";

const PropertyMap = () => (
  <div className="rounded-xl border border-border bg-card shadow-card p-6">
    <h3 className="text-base font-semibold text-foreground mb-4">Ubicación</h3>
    <div className="rounded-lg bg-muted h-48 flex flex-col items-center justify-center gap-2">
      <MapPin className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
      <span className="text-sm text-muted-foreground">Mapa disponible con Google Maps API</span>
    </div>
    <p className="text-sm text-muted-foreground mt-3">
      Calle del Mar 24, 4ºB · 03590 Altea, Alicante, España
    </p>
  </div>
);

export default PropertyMap;
