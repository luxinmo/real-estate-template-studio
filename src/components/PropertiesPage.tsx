import { useState } from "react";
import { MapPin, Bed, Bath, Maximize, Plus, Search, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const demoProperties = [
  { id: 1, image: property1, title: "Villa Mediterránea con Piscina", price: "$2,450,000", location: "Palm Beach, FL", beds: 4, baths: 3, sqft: "3,200", status: "Disponible", type: "Villa", operacion: "Venta" },
  { id: 2, image: property2, title: "Penthouse con Vistas al Skyline", price: "$1,890,000", location: "Manhattan, NY", beds: 3, baths: 2, sqft: "2,100", status: "Reservado", type: "Apartamento", operacion: "Venta" },
  { id: 3, image: property3, title: "Mansión Frente al Mar", price: "$5,750,000", location: "Malibu, CA", beds: 6, baths: 5, sqft: "5,800", status: "Disponible", type: "Mansión", operacion: "Alquiler" },
];

const statusColors: Record<string, string> = {
  Disponible: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Reservado: "bg-amber-50 text-amber-700 border-amber-200",
  Vendido: "bg-red-50 text-red-700 border-red-200",
  Alquilado: "bg-blue-50 text-blue-700 border-blue-200",
};

const operaciones = ["Venta", "Alquiler"];
const disponibilidades = ["Disponible", "Reservado", "Vendido", "Alquilado"];
const tiposConSubtipos: Record<string, string[]> = {
  "Piso": ["Ático", "Dúplex", "Estudio", "Loft"],
  "Casa": ["Chalet", "Adosado", "Pareado", "Villa", "Mansión"],
  "Local comercial": ["Oficina", "Nave", "Almacén"],
  "Terreno": ["Urbano", "Rústico"],
};
const habitaciones = ["1", "2", "3", "4+"];

const PropertiesPage = ({ onViewProperty, onAddProperty }: { onViewProperty?: () => void; onAddProperty?: () => void }) => {
  const [search, setSearch] = useState("");
  const [selectedOp, setSelectedOp] = useState<string[]>([]);
  const [selectedDisp, setSelectedDisp] = useState<string[]>([]);
  const [selectedTipos, setSelectedTipos] = useState<string[]>([]);
  const [selectedHab, setSelectedHab] = useState<string[]>([]);
  const [precioDesde, setPrecioDesde] = useState("");
  const [precioHasta, setPrecioHasta] = useState("");

  const toggleFilter = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const allActiveFilters = [
    ...selectedOp.map(v => ({ label: v, group: "op" as const, value: v })),
    ...selectedDisp.map(v => ({ label: v, group: "disp" as const, value: v })),
    ...selectedTipos.map(v => ({ label: v, group: "tipo" as const, value: v })),
    ...selectedHab.map(v => ({ label: `${v} hab.`, group: "hab" as const, value: v })),
  ];

  const removeFilter = (group: string, value: string) => {
    if (group === "op") setSelectedOp(prev => prev.filter(v => v !== value));
    if (group === "disp") setSelectedDisp(prev => prev.filter(v => v !== value));
    if (group === "tipo") setSelectedTipos(prev => prev.filter(v => v !== value));
    if (group === "hab") setSelectedHab(prev => prev.filter(v => v !== value));
  };

  const clearAll = () => {
    setSelectedOp([]); setSelectedDisp([]); setSelectedTipos([]); setSelectedHab([]); setPrecioDesde(""); setPrecioHasta("");
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Header with search */}
      <div className="px-8 pt-8 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Propiedades</h1>
          <p className="text-sm text-muted-foreground mt-1">Catálogo de propiedades inmobiliarias</p>
        </div>
        <Button className="gap-2 shrink-0" onClick={onAddProperty}>
          <Plus className="h-4 w-4" />
          Nueva propiedad
        </Button>
      </div>

      {/* Universal search bar */}
      <div className="px-8 pb-4">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por referencia, dirección, título, propietario..."
            className="pl-10 h-10"
          />
        </div>
      </div>

      {/* Active filter chips */}
      {allActiveFilters.length > 0 && (
        <div className="px-8 pb-4 flex flex-wrap items-center gap-2">
          {allActiveFilters.map(f => (
            <span key={f.group + f.value} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-accent/50 px-2.5 py-1 text-xs font-medium text-foreground">
              {f.label}
              <button onClick={() => removeFilter(f.group, f.value)} className="hover:text-destructive transition-colors">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button onClick={clearAll} className="text-xs font-medium text-primary hover:underline ml-1">Limpiar todos</button>
        </div>
      )}

      <div className="px-8 pb-10 flex gap-6">
        {/* Property Grid - max width constrained */}
        <div className="flex-1 min-w-0 max-w-[1200px]">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {demoProperties.map((p) => (
              <div key={p.id} onClick={onViewProperty} className="rounded-xl border border-border bg-card shadow-card overflow-hidden group hover:shadow-elevated transition-shadow cursor-pointer">
                <div className="relative h-44 overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 rounded-md bg-card/90 backdrop-blur-sm px-2.5 py-1">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-foreground">{p.type}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-md bg-primary/90 backdrop-blur-sm px-2.5 py-1">
                    <span className="text-[13px] font-semibold text-primary-foreground">{p.price}</span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[14px] font-medium text-foreground">{p.title}</p>
                  <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" strokeWidth={1.5} />
                    <span className="text-[12px]">{p.location}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                    <span className="flex items-center gap-1 text-[12px] text-muted-foreground"><Bed className="h-3.5 w-3.5" strokeWidth={1.5} /> {p.beds}</span>
                    <span className="flex items-center gap-1 text-[12px] text-muted-foreground"><Bath className="h-3.5 w-3.5" strokeWidth={1.5} /> {p.baths}</span>
                    <span className="flex items-center gap-1 text-[12px] text-muted-foreground"><Maximize className="h-3.5 w-3.5" strokeWidth={1.5} /> {p.sqft} sqft</span>
                    <span className={`ml-auto inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusColors[p.status]}`}>{p.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Filters - right side */}
        <div className="w-64 shrink-0 hidden lg:block">
          <div className="rounded-xl border border-border bg-card p-5 space-y-1 sticky top-8">
            <div className="flex items-center justify-between pb-3">
              <span className="text-sm font-semibold text-foreground">Filtros</span>
              <button onClick={clearAll} className="text-xs font-medium text-primary hover:underline">Restablecer</button>
            </div>

            {/* Operación */}
            <CollapsibleFilter label="Operación" items={operaciones} selected={selectedOp} onToggle={v => toggleFilter(selectedOp, v, setSelectedOp)} />

            {/* Disponibilidad */}
            <CollapsibleFilter label="Disponibilidad" items={disponibilidades} selected={selectedDisp} onToggle={v => toggleFilter(selectedDisp, v, setSelectedDisp)} />

            {/* Tipo con subtipos */}
            <CollapsibleFilterWithSubtypes label="Tipo" groups={tiposConSubtipos} selected={selectedTipos} onToggle={v => toggleFilter(selectedTipos, v, setSelectedTipos)} />

            {/* Habitaciones */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Habitaciones
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex gap-2 pb-3 pt-1">
                  {habitaciones.map(h => (
                    <button
                      key={h}
                      onClick={() => toggleFilter(selectedHab, h, setSelectedHab)}
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

            {/* Precio */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Precio
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex gap-2 pb-3 pt-1">
                  <Input value={precioDesde} onChange={e => setPrecioDesde(e.target.value)} placeholder="Desde" className="h-9 text-sm" />
                  <Input value={precioHasta} onChange={e => setPrecioHasta(e.target.value)} placeholder="Hasta" className="h-9 text-sm" />
                </div>
                <span className="text-[11px] text-muted-foreground pb-2 block">€</span>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Collapsible filter with checkbox list */
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

/* Collapsible filter with grouped subtypes */
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

export default PropertiesPage;
