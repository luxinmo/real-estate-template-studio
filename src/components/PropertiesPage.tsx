import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const demoProperties = [
  {
    id: 1, image: property1, title: "Villa Mediterránea con Piscina", price: "1.100.000 €", location: "Moravit-Cap Blanc, Moraira",
    beds: 3, baths: 2, sqft: "190", status: "Disponible", type: "Villa", operacion: "Venta",
    reference: "6254", rating: 5, builtArea: "288", plotArea: "1.051",
    description: "Introducing a beautiful detached house, nestled in the peaceful Moravit-Cap Blanc area of Moraira, combining modern and Mediterranean architectural styles.",
    tags: ["B.B+"], portals: ["Kyero", "Idealista", "Fotocasa"],
    createdAt: "23.12.2025", updatedAt: "27.02.2026",
  },
  {
    id: 2, image: property2, title: "Penthouse con Vistas al Skyline", price: "1.890.000 €", location: "Manhattan, NY",
    beds: 3, baths: 2, sqft: "2.100", status: "Reservado", type: "Apartamento", operacion: "Venta",
    reference: "4821", rating: 4, builtArea: "2.100",
    description: "Espectacular penthouse con vistas panorámicas al skyline de Manhattan. Acabados de lujo, terraza privada y acceso directo al rooftop.",
    tags: ["A+"], createdAt: "10.01.2026", updatedAt: "25.02.2026",
  },
  {
    id: 3, image: property3, title: "Mansión Frente al Mar", price: "5.750.000 €", location: "Malibu, CA",
    beds: 6, baths: 5, sqft: "5.800", status: "Disponible", type: "Mansión", operacion: "Alquiler",
    reference: "7103", rating: 5, builtArea: "5.800", plotArea: "3.200",
    description: "Mansión exclusiva en primera línea de playa con acceso privado al mar, piscina infinity, spa y jardines tropicales.",
    tags: ["A.A"], createdAt: "05.11.2025", updatedAt: "20.02.2026",
  },
];

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
      {/* Header */}
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

      {/* Search */}
      <div className="px-8 pb-4">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por referencia, dirección, título, propietario..." className="pl-10 h-10" />
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
        {/* Property List */}
        <div className="flex-1 min-w-0 space-y-4">
          {demoProperties.map((p) => (
            <PropertyCard key={p.id} property={p} onClick={onViewProperty} />
          ))}
        </div>

        {/* Sidebar Filters */}
        <div className="w-64 shrink-0 hidden lg:block">
          <PropertyFilters
            selectedOp={selectedOp} selectedDisp={selectedDisp} selectedTipos={selectedTipos} selectedHab={selectedHab}
            precioDesde={precioDesde} precioHasta={precioHasta}
            onToggleOp={v => toggleFilter(selectedOp, v, setSelectedOp)}
            onToggleDisp={v => toggleFilter(selectedDisp, v, setSelectedDisp)}
            onToggleTipo={v => toggleFilter(selectedTipos, v, setSelectedTipos)}
            onToggleHab={v => toggleFilter(selectedHab, v, setSelectedHab)}
            onPrecioDesde={setPrecioDesde} onPrecioHasta={setPrecioHasta}
            onClearAll={clearAll}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
