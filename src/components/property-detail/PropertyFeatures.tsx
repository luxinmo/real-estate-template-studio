import { Home, Zap, Building2, MapPin, Eye } from "lucide-react";

const featureGroups = [
  {
    icon: Home,
    label: "Características",
    items: ["Terraza", "Balcón", "Jardín privado", "Parking privado", "Trastero"],
  },
  {
    icon: Zap,
    label: "Equipamiento",
    items: ["Aire acondicionado", "Piscina comunitaria", "Ascensor", "Calefacción central"],
  },
  {
    icon: Building2,
    label: "Urbanización",
    items: ["Portero", "Complejo cerrado", "Zonas ajardinadas", "Acceso 24h"],
  },
  {
    icon: MapPin,
    label: "Ubicación",
    items: ["Primera línea playa", "Centro ciudad", "Cerca transporte público"],
  },
  {
    icon: Eye,
    label: "Vistas",
    items: ["Vista al mar", "Vista montaña"],
  },
];

const PropertyFeatures = () => (
  <div className="rounded-xl border border-border bg-card shadow-card p-6">
    <h3 className="text-base font-semibold text-foreground mb-5">Características</h3>
    <div className="space-y-5">
      {featureGroups.map((group) => (
        <div key={group.label}>
          <div className="flex items-center gap-2 mb-2.5">
            <group.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <span className="text-sm font-medium text-foreground">{group.label}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <span
                key={item}
                className="bg-muted rounded-full px-3 py-1 text-sm text-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default PropertyFeatures;
