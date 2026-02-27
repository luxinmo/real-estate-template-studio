import { useState } from "react";
import { MapPin, Bed, Bath, Maximize, Star, Tag, Globe, Calendar, TrendingDown, Handshake, Users, ChevronDown, Check, ExternalLink } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/* ─── Status ─── */
const statusStyles: Record<string, { dot: string; text: string; bg: string }> = {
  Disponible: { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  Reservado: { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
  Vendido: { dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50" },
  Alquilado: { dot: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50" },
  "Bajo oferta": { dot: "bg-violet-500", text: "text-violet-700", bg: "bg-violet-50" },
};

/* ─── Portal type ─── */
interface Portal {
  name: string;
  active: boolean;
}

export interface PropertyData {
  id: number;
  image: string;
  title: string;
  price: string;
  previousPrice?: string;
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
  builtArea?: string;
  plotArea?: string;
  tags?: string[];
  portals?: Portal[];
  webActive?: boolean;
  collaboration?: boolean;       // available for collaboration
  isCollaborator?: boolean;       // belongs to a collaborator
  collaboratorName?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PropertyCardProps {
  property: PropertyData;
  onClick?: () => void;
}

/* ─── Portals Popover ─── */
const PortalsPopover = ({ portals, webActive, onToggleWeb, onTogglePortal }: {
  portals: Portal[];
  webActive: boolean;
  onToggleWeb: () => void;
  onTogglePortal: (name: string) => void;
}) => {
  const activeCount = portals.filter(p => p.active).length + (webActive ? 1 : 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Globe className="h-3.5 w-3.5" />
          <span>{activeCount} activo{activeCount !== 1 ? "s" : ""}</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0"
        align="end"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-3.5 py-2.5 border-b border-border">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Publicación</span>
        </div>

        {/* Web propia */}
        <div className="px-3.5 py-2 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5 text-primary" />
            <span className="text-[13px] font-medium text-foreground">Web propia</span>
          </div>
          <Switch checked={webActive} onCheckedChange={onToggleWeb} className="scale-75" />
        </div>

        {/* Portal list */}
        <div className="py-1 max-h-48 overflow-y-auto">
          {portals.map((portal) => (
            <button
              key={portal.name}
              onClick={() => onTogglePortal(portal.name)}
              className="flex items-center justify-between w-full px-3.5 py-2 hover:bg-accent transition-colors"
            >
              <span className={`text-[13px] ${portal.active ? "text-foreground" : "text-muted-foreground"}`}>{portal.name}</span>
              {portal.active && <Check className="h-3.5 w-3.5 text-emerald-500" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

/* ─── Main Card ─── */
const PropertyCard = ({ property, onClick }: PropertyCardProps) => {
  const p = property;
  const rating = p.rating ?? 4;
  const status = statusStyles[p.status] ?? statusStyles.Disponible;

  // Local state for toggles (demo)
  const [webActive, setWebActive] = useState(p.webActive ?? true);
  const [portals, setPortals] = useState<Portal[]>(
    p.portals ?? [
      { name: "Idealista", active: true },
      { name: "Fotocasa", active: true },
      { name: "Kyero", active: false },
      { name: "ThinkSpain", active: false },
      { name: "Green-Acres", active: true },
      { name: "Inmobilioscout24", active: false },
    ]
  );

  const togglePortal = (name: string) => {
    setPortals(prev => prev.map(p => p.name === name ? { ...p, active: !p.active } : p));
  };

  const hasPriceDrop = !!p.previousPrice;

  return (
    <div
      onClick={onClick}
      className="rounded-xl border border-border bg-card hover:shadow-elevated transition-all duration-200 cursor-pointer overflow-hidden group"
    >
      {/* ─── Main content row ─── */}
      <div className="flex">
        {/* Image */}
        <div className="w-60 shrink-0 relative overflow-hidden">
          <img
            src={p.image}
            alt={p.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 absolute inset-0"
          />
          {/* Type badge */}
          <span className="absolute top-2.5 left-2.5 bg-card/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-foreground px-2 py-0.5 rounded">
            {p.type}
          </span>
          {/* Photo count */}
          <span className="absolute bottom-2.5 right-2.5 bg-foreground/60 backdrop-blur-sm text-background text-[10px] px-2 py-0.5 rounded">
            1/12
          </span>
          {/* Collaborator ribbon */}
          {p.isCollaborator && (
            <span className="absolute top-2.5 right-2.5 bg-indigo-500/90 backdrop-blur-sm text-white text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
              <Users className="h-3 w-3" />
              Colaborador
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 px-5 py-3.5 flex flex-col">
          {/* Top row: ref + stars + status + collaboration */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Checkbox className="h-4 w-4" onClick={(e) => e.stopPropagation()} />
              <span className="text-xs text-muted-foreground font-mono">{p.reference ?? `REF-${p.id.toString().padStart(4, "0")}`}</span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"}`}
                  />
                ))}
              </div>
              {p.collaboration && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                  <Handshake className="h-3 w-3" />
                  MLS
                </span>
              )}
              {p.isCollaborator && p.collaboratorName && (
                <span className="text-[11px] text-indigo-600 font-medium">
                  vía {p.collaboratorName}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Status */}
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1 ${status.bg} ${status.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                {p.status}
              </span>
            </div>
          </div>

          {/* Price row */}
          <div className="flex items-baseline gap-2.5 mb-1">
            <span className="text-xl font-bold text-foreground tracking-tight">{p.price}</span>
            {hasPriceDrop && (
              <span className="inline-flex items-center gap-1 text-[12px] text-red-500 font-medium">
                <TrendingDown className="h-3.5 w-3.5" />
                <span className="line-through text-muted-foreground/60">{p.previousPrice}</span>
              </span>
            )}
            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">{p.operacion}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <MapPin className="h-3 w-3 text-muted-foreground" strokeWidth={1.5} />
            <span className="text-[13px] text-muted-foreground">{p.location}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-5 text-[13px] mb-2.5">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Bed className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="font-medium text-foreground">{p.beds}</span> hab.
            </span>
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Bath className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="font-medium text-foreground">{p.baths}</span> baños
            </span>
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Maximize className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="font-medium text-foreground">{p.builtArea ?? p.sqft}</span> m²
            </span>
            {p.plotArea && (
              <span className="text-muted-foreground">
                Parcela <span className="font-medium text-foreground">{p.plotArea}</span> m²
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed max-w-2xl italic">
            {p.description}
          </p>

          {/* Tags row */}
          <div className="flex items-center gap-2 mt-auto pt-2">
            {(p.tags ?? []).map((tag) => (
              <span key={tag} className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-semibold text-foreground">
                {tag}
              </span>
            ))}
            <button className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
              <Tag className="h-3 w-3" />
              Etiqueta
            </button>
          </div>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <div className="flex items-center justify-between px-5 py-2 border-t border-border bg-muted/20 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {p.createdAt ?? "15.01.2026"}
          </span>
          <span className="text-muted-foreground/50">|</span>
          <span>Act. {p.updatedAt ?? "27.02.2026"}</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>Leads (0)</button>
          <button className="hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>Visitas (0)</button>
          <button className="hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>Ofertas</button>
          <span className="text-muted-foreground/30">|</span>
          <PortalsPopover
            portals={portals}
            webActive={webActive}
            onToggleWeb={() => setWebActive(!webActive)}
            onTogglePortal={togglePortal}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
