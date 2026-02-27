import { MapPin, Bed, Bath, Maximize, Star, ChevronDown, Tag, Globe, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const statusColors: Record<string, string> = {
  Disponible: "text-emerald-600",
  Reservado: "text-amber-600",
  Vendido: "text-red-600",
  Alquilado: "text-blue-600",
};

const statusDotColors: Record<string, string> = {
  Disponible: "bg-emerald-500",
  Reservado: "bg-amber-500",
  Vendido: "bg-red-500",
  Alquilado: "bg-blue-500",
};

export interface PropertyData {
  id: number;
  image: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string;
  status: string;
  type: string;
  operacion: string;
  reference?: string;
  rating?: number;
  description?: string;
  usefulArea?: string;
  builtArea?: string;
  plotArea?: string;
  tags?: string[];
  portals?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface PropertyCardProps {
  property: PropertyData;
  onClick?: () => void;
}

const PropertyCard = ({ property, onClick }: PropertyCardProps) => {
  const p = property;
  const rating = p.rating ?? 4;

  return (
    <div
      onClick={onClick}
      className="rounded-xl border border-border bg-card hover:shadow-elevated transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <Checkbox className="h-4 w-4" onClick={(e) => e.stopPropagation()} />
          <span className="text-sm font-semibold text-primary">{p.type} {p.operacion === "Alquiler" ? "En alquiler" : "En venta"}</span>
          <span className="text-xs text-muted-foreground font-mono">{p.reference ?? `REF-${p.id.toString().padStart(4, "0")}`}</span>
          <div className="flex items-center gap-0.5 ml-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${statusColors[p.status]}`}>
            <span className={`h-2 w-2 rounded-full ${statusDotColors[p.status]}`} />
            {p.status}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex">
        {/* Image */}
        <div className="w-56 h-44 shrink-0 overflow-hidden">
          <img
            src={p.image}
            alt={p.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 px-5 py-3 flex flex-col justify-between">
          <div>
            {/* Price & location */}
            <div className="flex items-baseline gap-3">
              <span className="text-xl font-bold text-foreground">{p.price}</span>
              <span className="text-xs text-muted-foreground font-medium">({p.operacion})</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin className="h-3 w-3 text-muted-foreground" strokeWidth={1.5} />
              <span className="text-sm text-muted-foreground">{p.location}</span>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-x-5 gap-y-1 mt-2.5 flex-wrap text-[13px]">
              <span className="text-muted-foreground">
                Status <span className="font-medium text-foreground">{p.status}</span>
              </span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Bed className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span className="font-medium text-foreground">{p.beds}</span> hab.
              </span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Bath className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span className="font-medium text-foreground">{p.baths}</span> baños
              </span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Maximize className="h-3.5 w-3.5" strokeWidth={1.5} />
                Sup. construida <span className="font-medium text-foreground">{p.builtArea ?? p.sqft} m²</span>
              </span>
              {p.plotArea && (
                <span className="text-muted-foreground">
                  Parcela <span className="font-medium text-foreground">{p.plotArea} m²</span>
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2 italic leading-relaxed max-w-2xl">
              {p.description ?? `Propiedad ${p.type.toLowerCase()} ubicada en ${p.location}. ${p.beds} habitaciones, ${p.baths} baños y ${p.sqft} m² de superficie.`}
            </p>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 mt-2">
            {(p.tags ?? ["B.B+"]).map((tag) => (
              <span key={tag} className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-foreground">
                {tag}
              </span>
            ))}
            <button className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
              <Tag className="h-3 w-3" />
              Añadir etiqueta
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-2 border-t border-border bg-muted/20 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Creado: {p.createdAt ?? "15.01.2026"}
          </span>
          <span>
            Actualizado: {p.updatedAt ?? "27.02.2026"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>Leads (0) ▾</button>
          <button className="hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>Oportunidades (0) ▾</button>
          <button className="hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>Visitas (0) ▾</button>
          <button className="hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>Ofertas ▾</button>
          <Globe className="h-3.5 w-3.5 hover:text-foreground transition-colors cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
