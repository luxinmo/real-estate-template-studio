import { useState, useRef, useEffect } from "react";
import { Tag, User, Circle, Home, Globe, Ban, EyeOff, ChevronDown, Plus, Minus, X, Star, Settings } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

/* ─── Filter chip with include / exclude toggle ─── */
type FilterMode = "off" | "include" | "exclude";

interface FilterChip {
  label: string;
  mode: FilterMode;
}

/* ─── Hover popover for chip options ─── */
const ChipOptionsPopover = ({ currentMode, onSelect }: { currentMode: FilterMode; onSelect: (mode: FilterMode) => void }) => {
  const options: { mode: FilterMode; label: string; icon: React.ReactNode; activeClass: string }[] = [
    { mode: "include", label: "Incluir", icon: <Plus className="h-3 w-3" />, activeClass: "bg-emerald-500 text-white" },
    { mode: "exclude", label: "Excluir", icon: <Minus className="h-3 w-3" />, activeClass: "bg-red-500 text-white" },
    { mode: "off", label: "Quitar", icon: <X className="h-3 w-3" />, activeClass: "" },
  ];

  return (
    <div className="absolute top-full left-0 mt-1 z-50 flex items-center gap-0.5 rounded-lg bg-popover border border-border px-1 py-1 shadow-lg animate-in fade-in-0 zoom-in-95 duration-100">
      {options.map(opt => (
        <button
          key={opt.mode}
          onClick={(e) => { e.stopPropagation(); onSelect(opt.mode); }}
          className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
            currentMode === opt.mode ? opt.activeClass : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
};

const FilterChipButton = ({ chip, onToggle, onSetMode }: { chip: FilterChip; onToggle: () => void; onSetMode: (mode: FilterMode) => void }) => {
  const [showOptions, setShowOptions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const base = "relative inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-all cursor-pointer select-none";
  const styles: Record<FilterMode, string> = {
    off: "border-border bg-card text-muted-foreground hover:bg-accent",
    include: "border-emerald-300 bg-emerald-50 text-emerald-700",
    exclude: "border-red-300 bg-red-50 text-red-700",
  };

  const handleClick = () => {
    if (chip.mode === "off") {
      onSetMode("include");
    } else {
      setShowOptions(prev => !prev);
    }
  };

  // Close on outside click
  useEffect(() => {
    if (!showOptions) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setShowOptions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showOptions]);

  return (
    <div ref={containerRef} className="relative">
      <button onClick={handleClick} className={`${base} ${styles[chip.mode]}`}>
        {chip.mode === "include" && <Plus className="h-3 w-3" />}
        {chip.mode === "exclude" && <Minus className="h-3 w-3" />}
        {chip.label}
      </button>
      {showOptions && (
        <ChipOptionsPopover
          currentMode={chip.mode}
          onSelect={(mode) => { onSetMode(mode); setShowOptions(false); }}
        />
      )}
    </div>
  );
};

/* ─── Star rating chip — large star with number ─── */
const StarChipButton = ({ stars, mode, onToggle }: { stars: number; mode: FilterMode; onToggle: () => void }) => {
  const borderStyle: Record<FilterMode, string> = {
    off: "border-transparent",
    include: "border-emerald-400 ring-1 ring-emerald-200",
    exclude: "border-red-400 ring-1 ring-red-200",
  };

  return (
    <button
      onClick={onToggle}
      className={`relative flex flex-col items-center justify-center w-10 h-10 rounded-md border-2 transition-all cursor-pointer select-none hover:bg-accent ${borderStyle[mode]}`}
    >
      <Star className={`h-7 w-7 ${stars === 0 ? "text-muted-foreground/30" : "text-muted-foreground/40 fill-muted-foreground/40"}`} />
      <span className="absolute text-[11px] font-bold text-foreground" style={{ marginTop: "-2px" }}>
        {stars}
      </span>
    </button>
  );
};

/* ─── Filter section ─── */
const FilterSection = ({
  icon: Icon,
  title,
  chips,
  onToggle,
  onSetMode,
  defaultOpen = true,
}: {
  icon: React.ElementType;
  title: string;
  chips: FilterChip[];
  onToggle: (label: string) => void;
  onSetMode: (label: string, mode: FilterMode) => void;
  defaultOpen?: boolean;
}) => {
  const activeCount = chips.filter(c => c.mode !== "off").length;

  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
        <span className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5" />
          {title}
          {activeCount > 0 && (
            <span className="text-[9px] bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 normal-case tracking-normal">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown className="h-3.5 w-3.5" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-wrap gap-1.5 pb-3">
          {chips.map((chip) => (
            <FilterChipButton
              key={chip.label}
              chip={chip}
              onToggle={() => onToggle(chip.label)}
              onSetMode={(mode) => onSetMode(chip.label, mode)}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

/* ─── Main Sidebar ─── */
export interface SidebarFilters {
  tags: FilterChip[];
  users: FilterChip[];
  ratings: FilterChip[];
  availability: FilterChip[];
  operation: FilterChip[];
  portals: FilterChip[];
  restrictedPortals: FilterChip[];
  offMarket: FilterChip[];
}

const cycleMode = (current: FilterMode): FilterMode => {
  if (current === "off") return "include";
  if (current === "include") return "exclude";
  return "off";
};

export const defaultSidebarFilters: SidebarFilters = {
  tags: [
    { label: "A+", mode: "off" },
    { label: "A.A", mode: "off" },
    { label: "B.B+", mode: "off" },
    { label: "Premium", mode: "off" },
    { label: "Lujo", mode: "off" },
    { label: "Inversión", mode: "off" },
    { label: "Reforma", mode: "off" },
  ],
  users: [
    { label: "Carlos García", mode: "off" },
    { label: "Ana Martínez", mode: "off" },
    { label: "Pedro López", mode: "off" },
    { label: "María Sánchez", mode: "off" },
    { label: "Luis Fernández", mode: "off" },
  ],
  ratings: [
    { label: "5", mode: "off" },
    { label: "4", mode: "off" },
    { label: "3", mode: "off" },
    { label: "2", mode: "off" },
    { label: "1", mode: "off" },
    { label: "0", mode: "off" },
  ],
  availability: [
    { label: "Disponible", mode: "off" },
    { label: "Reservado", mode: "off" },
    { label: "Vendido", mode: "off" },
    { label: "Alquilado", mode: "off" },
    { label: "Bajo oferta", mode: "off" },
  ],
  operation: [
    { label: "Venta", mode: "off" },
    { label: "Alquiler", mode: "off" },
    { label: "Traspaso", mode: "off" },
  ],
  portals: [
    { label: "Idealista", mode: "off" },
    { label: "Fotocasa", mode: "off" },
    { label: "Kyero", mode: "off" },
    { label: "ThinkSpain", mode: "off" },
    { label: "Green-Acres", mode: "off" },
    { label: "Inmobilioscout24", mode: "off" },
  ],
  restrictedPortals: [
    { label: "Con restricciones", mode: "off" },
    { label: "Sin restricciones", mode: "off" },
  ],
  offMarket: [
    { label: "Off-market", mode: "off" },
    { label: "En mercado", mode: "off" },
  ],
};

const PropertyFilterSidebar = ({
  filters,
  onChange,
}: {
  filters: SidebarFilters;
  onChange: (f: SidebarFilters) => void;
}) => {
  const toggleChip = (section: keyof SidebarFilters, label: string) => {
    onChange({
      ...filters,
      [section]: filters[section].map((c) =>
        c.label === label ? { ...c, mode: cycleMode(c.mode) } : c
      ),
    });
  };

  const setChipMode = (section: keyof SidebarFilters, label: string, mode: FilterMode) => {
    onChange({
      ...filters,
      [section]: filters[section].map((c) =>
        c.label === label ? { ...c, mode } : c
      ),
    });
  };

  const activeTotal = Object.values(filters).flat().filter(c => c.mode !== "off").length;

  return (
    <div className="w-56 shrink-0 space-y-0.5 sticky top-8">
      <div className="flex items-center justify-between pb-2 border-b border-border mb-2">
        <span className="text-sm font-semibold text-foreground">Filtros</span>
        <div className="flex items-center gap-1.5">
          {activeTotal > 0 && (
            <button
              onClick={() => onChange(defaultSidebarFilters)}
              className="text-[11px] font-medium text-primary hover:underline"
            >
              Limpiar ({activeTotal})
            </button>
          )}
          <button
            onClick={() => console.log("Settings: global")}
            className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title="Configurar filtros"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground pb-2">
        Clic para seleccionar · Hover para opciones
      </p>

      <FilterSection
        icon={Tag}
        title="Etiquetas"
        chips={filters.tags}
        onToggle={(l) => toggleChip("tags", l)}
        onSetMode={(l, m) => setChipMode("tags", l, m)}
      />
      <FilterSection
        icon={User}
        title="Agente"
        chips={filters.users}
        onToggle={(l) => toggleChip("users", l)}
        onSetMode={(l, m) => setChipMode("users", l, m)}
      />

      {/* Star ratings */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
          <span className="flex items-center gap-2">
            <Star className="h-3.5 w-3.5" />
            Valoración
            {filters.ratings.filter(c => c.mode !== "off").length > 0 && (
              <span className="text-[9px] bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 normal-case tracking-normal">
                {filters.ratings.filter(c => c.mode !== "off").length}
              </span>
            )}
          </span>
          <ChevronDown className="h-3.5 w-3.5" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-nowrap gap-1.5 pb-3">
            {filters.ratings.map((chip) => (
              <StarChipButton
                key={chip.label}
                stars={parseInt(chip.label)}
                mode={chip.mode}
                onToggle={() => toggleChip("ratings", chip.label)}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <FilterSection icon={Circle} title="Disponibilidad" chips={filters.availability} onToggle={(l) => toggleChip("availability", l)} onSetMode={(l, m) => setChipMode("availability", l, m)} />
      <FilterSection icon={Home} title="Operación" chips={filters.operation} onToggle={(l) => toggleChip("operation", l)} onSetMode={(l, m) => setChipMode("operation", l, m)} />
      <FilterSection icon={Globe} title="Portales" chips={filters.portals} onToggle={(l) => toggleChip("portals", l)} onSetMode={(l, m) => setChipMode("portals", l, m)} />
      <FilterSection icon={Ban} title="Restricciones" chips={filters.restrictedPortals} onToggle={(l) => toggleChip("restrictedPortals", l)} onSetMode={(l, m) => setChipMode("restrictedPortals", l, m)} defaultOpen={false} />
      <FilterSection icon={EyeOff} title="Visibilidad" chips={filters.offMarket} onToggle={(l) => toggleChip("offMarket", l)} onSetMode={(l, m) => setChipMode("offMarket", l, m)} defaultOpen={false} />
    </div>
  );
};

export default PropertyFilterSidebar;
