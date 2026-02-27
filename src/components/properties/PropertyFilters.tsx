import { ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const operaciones = ["Venta", "Alquiler"];
const disponibilidades = ["Disponible", "Reservado", "Vendido", "Alquilado"];
const tiposConSubtipos: Record<string, string[]> = {
  "Piso": ["Ático", "Dúplex", "Estudio", "Loft"],
  "Casa": ["Chalet", "Adosado", "Pareado", "Villa", "Mansión"],
  "Local comercial": ["Oficina", "Nave", "Almacén"],
  "Terreno": ["Urbano", "Rústico"],
};
const habitaciones = ["1", "2", "3", "4+"];

interface PropertyFiltersProps {
  selectedOp: string[];
  selectedDisp: string[];
  selectedTipos: string[];
  selectedHab: string[];
  precioDesde: string;
  precioHasta: string;
  onToggleOp: (v: string) => void;
  onToggleDisp: (v: string) => void;
  onToggleTipo: (v: string) => void;
  onToggleHab: (v: string) => void;
  onPrecioDesde: (v: string) => void;
  onPrecioHasta: (v: string) => void;
  onClearAll: () => void;
}

const PropertyFilters = ({
  selectedOp, selectedDisp, selectedTipos, selectedHab,
  precioDesde, precioHasta,
  onToggleOp, onToggleDisp, onToggleTipo, onToggleHab,
  onPrecioDesde, onPrecioHasta, onClearAll,
}: PropertyFiltersProps) => (
  <div className="rounded-xl border border-border bg-card p-5 space-y-1 sticky top-8">
    <div className="flex items-center justify-between pb-3">
      <span className="text-sm font-semibold text-foreground">Filtros</span>
      <button onClick={onClearAll} className="text-xs font-medium text-primary hover:underline">Restablecer</button>
    </div>

    <CollapsibleFilter label="Operación" items={operaciones} selected={selectedOp} onToggle={onToggleOp} />
    <CollapsibleFilter label="Disponibilidad" items={disponibilidades} selected={selectedDisp} onToggle={onToggleDisp} />
    <CollapsibleFilterWithSubtypes label="Tipo" groups={tiposConSubtipos} selected={selectedTipos} onToggle={onToggleTipo} />

    <Collapsible>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors">
        Habitaciones
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex gap-2 pb-3 pt-1">
          {habitaciones.map(h => (
            <button
              key={h}
              onClick={() => onToggleHab(h)}
              className={`h-9 w-10 rounded-lg border text-sm font-medium transition-colors ${
                selectedHab.includes(h)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-background text-foreground hover:bg-accent"
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>

    <Collapsible>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors">
        Precio
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex gap-2 pb-3 pt-1">
          <Input value={precioDesde} onChange={e => onPrecioDesde(e.target.value)} placeholder="Desde" className="h-9 text-sm" />
          <Input value={precioHasta} onChange={e => onPrecioHasta(e.target.value)} placeholder="Hasta" className="h-9 text-sm" />
        </div>
        <span className="text-[11px] text-muted-foreground pb-2 block">€</span>
      </CollapsibleContent>
    </Collapsible>
  </div>
);

const CollapsibleFilter = ({ label, items, selected, onToggle }: { label: string; items: string[]; selected: string[]; onToggle: (v: string) => void }) => (
  <Collapsible>
    <CollapsibleTrigger className="flex items-center justify-between w-full py-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors">
      {label}
      {selected.length > 0 && <span className="text-[10px] bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 mr-1">{selected.length}</span>}
      <ChevronDown className="h-4 w-4 text-muted-foreground" />
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div className="space-y-2 pb-3 pt-1">
        {items.map(item => (
          <label key={item} className="flex items-center gap-2.5 cursor-pointer group">
            <Checkbox checked={selected.includes(item)} onCheckedChange={() => onToggle(item)} />
            <span className="text-sm text-foreground group-hover:text-primary transition-colors">{item}</span>
          </label>
        ))}
      </div>
    </CollapsibleContent>
  </Collapsible>
);

const CollapsibleFilterWithSubtypes = ({ label, groups, selected, onToggle }: { label: string; groups: Record<string, string[]>; selected: string[]; onToggle: (v: string) => void }) => (
  <Collapsible>
    <CollapsibleTrigger className="flex items-center justify-between w-full py-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors">
      {label}
      {selected.length > 0 && <span className="text-[10px] bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 mr-1">{selected.length}</span>}
      <ChevronDown className="h-4 w-4 text-muted-foreground" />
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div className="space-y-3 pb-3 pt-1">
        {Object.entries(groups).map(([tipo, subtipos]) => (
          <div key={tipo}>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox checked={selected.includes(tipo)} onCheckedChange={() => onToggle(tipo)} />
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{tipo}</span>
            </label>
            <div className="ml-6 mt-1.5 space-y-1.5">
              {subtipos.map(sub => (
                <label key={sub} className="flex items-center gap-2.5 cursor-pointer group">
                  <Checkbox checked={selected.includes(sub)} onCheckedChange={() => onToggle(sub)} />
                  <span className="text-[13px] text-muted-foreground group-hover:text-primary transition-colors">{sub}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CollapsibleContent>
  </Collapsible>
);

export default PropertyFilters;
