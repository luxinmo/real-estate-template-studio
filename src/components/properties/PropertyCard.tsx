import { useState } from "react";
import { MapPin, Bed, Bath, Maximize, Star, Tag, Globe, Calendar, TrendingDown, Handshake, Users, ChevronDown, Check, ExternalLink, Crown, Sparkles, EyeOff, Ban, Lock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

/* ─── Status ─── */
const statusStyles: Record<string, { dot: string; text: string; bg: string }> = {
  Disponible: { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  Reservado: { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
  Vendido: { dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50" },
  Alquilado: { dot: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50" },
  "Bajo oferta": { dot: "bg-violet-500", text: "text-violet-700", bg: "bg-violet-50" },
  "Off-market": { dot: "bg-gray-500", text: "text-gray-700", bg: "bg-gray-100" },
};

/* ─── Portal type ─── */
interface Portal {
  name: string;
  active: boolean;
  restricted?: boolean;
  restrictionReason?: string;
}

export interface PropertyData {
  id: number;
  image: string;
  title: string;
  price: string;
  previousPrice?: string;
  priceOnRequest?: boolean;
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
  webFeatured?: boolean;
  collaboration?: boolean;
  collaborationAgency?: string;
  isCollaborator?: boolean;
  collaboratorName?: string;
  isExclusive?: boolean;
  isOffMarket?: boolean;
  createdAt?: string;
  updatedAt?: string;
  selected?: boolean;
}

interface PropertyCardProps {
  property: PropertyData;
  onClick?: () => void;
  selected?: boolean;
  onSelect?: (id: number) => void;
}

/* ─── Portals Popover ─── */
const PortalsPopover = ({ portals, webActive, webFeatured, onToggleWeb, onToggleFeatured, onTogglePortal }: {
  portals: Portal[];
  webActive: boolean;
  webFeatured: boolean;
  onToggleWeb: () => void;
  onToggleFeatured: () => void;
  onTogglePortal: (name: string) => void;
}) => {
  const activeCount = portals.filter(p => p.active && !p.restricted).length + (webActive ? 1 : 0);
  const restrictedCount = portals.filter(p => p.restricted).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Globe className="h-3.5 w-3.5" />
          <span>{activeCount} activo{activeCount !== 1 ? "s" : ""}</span>
          {restrictedCount > 0 && (
            <span className="text-red-500">({restrictedCount} bloq.)</span>
          )}
          <ChevronDown className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-0"
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

        {/* Featured toggle */}
        {webActive && (
          <div className="px-3.5 py-2 flex items-center justify-between border-b border-border bg-amber-50/50">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-[13px] font-medium text-foreground">Destacado en web</span>
            </div>
            <Switch checked={webFeatured} onCheckedChange={onToggleFeatured} className="scale-75" />
          </div>
        )}

        {/* Portal list */}
        <div className="py-1 max-h-52 overflow-y-auto">
          {portals.map((portal) => (
            <button
              key={portal.name}
              onClick={() => !portal.restricted && onTogglePortal(portal.name)}
              disabled={portal.restricted}
              className={`flex items-center justify-between w-full px-3.5 py-2 transition-colors ${portal.restricted ? "opacity-50 cursor-not-allowed bg-red-50/50" : "hover:bg-accent"}`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-[13px] ${portal.active && !portal.restricted ? "text-foreground" : "text-muted-foreground"}`}>
                  {portal.name}
                </span>
                {portal.restricted && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Ban className="h-3 w-3 text-red-500" />
                      </TooltipTrigger>
                      <TooltipContent side="left" className="text-xs max-w-48">
                        {portal.restrictionReason ?? "Publicación no permitida"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              {portal.restricted ? (
                <Lock className="h-3.5 w-3.5 text-red-400" />
              ) : portal.active ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : null}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

/* ─── Main Card ─── */
const PropertyCard = ({ property, onClick, selected, onSelect }: PropertyCardProps) => {
  const p = property;
  const rating = p.rating ?? 4;
  const status = statusStyles[p.status] ?? statusStyles.Disponible;

  const [webActive, setWebActive] = useState(p.webActive ?? true);
  const [webFeatured, setWebFeatured] = useState(p.webFeatured ?? false);
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
  const isOffMarket = p.isOffMarket ?? p.status === "Off-market";

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border bg-card hover:shadow-elevated transition-all duration-200 cursor-pointer overflow-hidden group ${selected ? "bg-primary/[0.02] border-primary/30 shadow-sm" : "border-border"}`}
    >
      <div className="flex flex-col sm:flex-row sm:h-[220px]">
        {/* Image */}
        <div className="w-full sm:w-60 h-48 sm:h-auto shrink-0 relative overflow-hidden">
          <img
            src={p.image}
            alt={p.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 absolute inset-0"
          />
          {/* Photo count */}
          <span className="absolute bottom-2.5 right-2.5 bg-foreground/60 backdrop-blur-sm text-background text-[10px] px-2 py-0.5 rounded">
            1/12
          </span>
          {/* Off-market overlay */}
          {isOffMarket && (
            <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-foreground/80 text-background text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded flex items-center gap-1.5">
                <EyeOff className="h-3.5 w-3.5" />
                Off-market
              </span>
            </div>
          )}
          {/* Exclusive badge */}
          {p.isExclusive && (
            <span className="absolute top-2.5 left-2.5 bg-amber-500/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
              <Crown className="h-3 w-3" />
              Exclusiva
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 px-4 sm:px-5 py-3 sm:py-3.5 flex flex-col">
          {/* Top row */}
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <Checkbox
                className="h-4 w-4"
                checked={selected}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(p.id);
                }}
              />
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
                  <span className="hidden sm:inline">MLS{p.collaborationAgency ? ` - ${p.collaborationAgency}` : ""}</span>
                  <span className="sm:hidden">MLS</span>
                </span>
              )}
              {p.isCollaborator && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[10px] font-medium text-indigo-600">
                  <Users className="h-3 w-3" />
                  <span className="hidden sm:inline">Compartido MLS</span>
                  <span className="sm:hidden">MLS</span>
                </span>
              )}
              {webFeatured && webActive && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                  <Sparkles className="h-3 w-3" />
                  Destacado
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1 ${status.bg} ${status.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                {p.status}
              </span>
            </div>
          </div>

          {/* Price row */}
          <div className="flex items-baseline gap-2 sm:gap-2.5 mb-1 flex-wrap">
            {p.priceOnRequest ? (
              <span className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Consultar precio</span>
            ) : (
              <span className="text-lg sm:text-xl font-bold text-foreground tracking-tight">{p.price}</span>
            )}
            {hasPriceDrop && !p.priceOnRequest && (
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
          <div className="flex items-center gap-3 sm:gap-5 text-[13px] mb-2.5 flex-wrap">
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
          <p className="text-[12px] text-muted-foreground line-clamp-1 leading-relaxed max-w-2xl italic hidden sm:block">
            {p.description}
          </p>

          {/* Tags row */}
          <div className="flex items-center gap-2 mt-auto pt-2 flex-wrap">
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

      {/* Footer */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-2 border-t border-border bg-muted/20 text-[11px] text-muted-foreground flex-wrap gap-2">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {p.createdAt ?? "15.01.2026"}
          </span>
          <span className="text-muted-foreground/50 hidden sm:inline">|</span>
          <span className="hidden sm:inline">Act. {p.updatedAt ?? "27.02.2026"}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <button className="hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>Leads (0)</button>
          <button className="hover:text-foreground transition-colors hidden sm:inline" onClick={(e) => e.stopPropagation()}>Visitas (0)</button>
          <button className="hover:text-foreground transition-colors hidden sm:inline" onClick={(e) => e.stopPropagation()}>Ofertas</button>
          <span className="text-muted-foreground/30">|</span>
          <PortalsPopover
            portals={portals}
            webActive={webActive}
            webFeatured={webFeatured}
            onToggleWeb={() => setWebActive(!webActive)}
            onToggleFeatured={() => setWebFeatured(!webFeatured)}
            onTogglePortal={togglePortal}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
