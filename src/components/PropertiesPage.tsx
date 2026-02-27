import { useState, useMemo } from "react";
import { Plus, ArrowUpDown, Download, Globe, GlobeIcon, Share2, Printer, Tag, X, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard, { PropertyData } from "@/components/properties/PropertyCard";
import PropertySearchFilters, { FilterState, defaultFilters } from "@/components/properties/PropertySearchFilters";
import PropertyFilterSidebar, { SidebarFilters, defaultSidebarFilters } from "@/components/properties/PropertyFilterSidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const demoProperties: PropertyData[] = [
  {
    id: 1, image: property1, title: "Villa Mediterránea con Piscina", price: "1.100.000 €", previousPrice: "1.250.000 €", location: "Moravit-Cap Blanc, Moraira",
    beds: 3, baths: 2, sqft: "190", status: "Disponible", type: "Villa", operacion: "Venta",
    reference: "6254", rating: 5, builtArea: "288", plotArea: "1.051",
    description: "Introducing a beautiful detached house, nestled in the peaceful Moravit-Cap Blanc area of Moraira, combining modern and Mediterranean architectural styles.",
    tags: ["B.B+"], collaboration: true, collaborationAgency: "Lux Real Estate", webActive: true, isExclusive: true, webFeatured: true,
    createdAt: "23.12.2025", updatedAt: "27.02.2026",
    portals: [
      { name: "Idealista", active: true },
      { name: "Fotocasa", active: true },
      { name: "Kyero", active: false },
      { name: "ThinkSpain", active: false, restricted: true, restrictionReason: "Propiedad de colaborador: publicación no autorizada por el propietario" },
      { name: "Green-Acres", active: true },
      { name: "Inmobilioscout24", active: false },
    ],
  },
  {
    id: 2, image: property2, title: "Penthouse con Vistas al Skyline", price: "1.890.000 €", location: "Manhattan, NY",
    beds: 3, baths: 2, sqft: "2.100", status: "Bajo oferta", type: "Apartamento", operacion: "Venta",
    reference: "4821", rating: 4, builtArea: "2.100",
    description: "Espectacular penthouse con vistas panorámicas al skyline de Manhattan. Acabados de lujo, terraza privada y acceso directo al rooftop.",
    tags: ["A+"], isCollaborator: true, collaboratorName: "Luxinmo", webActive: false,
    createdAt: "10.01.2026", updatedAt: "25.02.2026",
    portals: [
      { name: "Idealista", active: false, restricted: true, restrictionReason: "No permitido: propiedad en colaboración con restricción de portales nacionales" },
      { name: "Fotocasa", active: false, restricted: true, restrictionReason: "No permitido: propiedad en colaboración con restricción de portales nacionales" },
      { name: "Kyero", active: true },
      { name: "ThinkSpain", active: true },
      { name: "Green-Acres", active: false },
      { name: "Inmobilioscout24", active: false },
    ],
  },
  {
    id: 3, image: property3, title: "Mansión Frente al Mar", price: "5.750.000 €", previousPrice: "6.200.000 €", location: "Malibu, CA",
    beds: 6, baths: 5, sqft: "5.800", status: "Disponible", type: "Mansión", operacion: "Alquiler",
    reference: "7103", rating: 5, builtArea: "5.800", plotArea: "3.200",
    description: "Mansión exclusiva en primera línea de playa con acceso privado al mar, piscina infinity, spa y jardines tropicales.",
    tags: ["A.A"], collaboration: true, collaborationAgency: "Costa Homes", webActive: false, isOffMarket: true,
    createdAt: "05.11.2025", updatedAt: "20.02.2026",
  },
  {
    id: 4, image: property1, title: "Ático de Diseño en Centro Histórico", price: "", location: "Valencia, España",
    beds: 4, baths: 3, sqft: "320", status: "Disponible", type: "Ático", operacion: "Venta",
    reference: "8430", rating: 3, builtArea: "320", priceOnRequest: true,
    description: "Ático reformado con materiales de primera calidad en pleno centro histórico. Terraza panorámica con vistas a la catedral.",
    tags: ["Premium"], webActive: true, isExclusive: true,
    createdAt: "01.02.2026", updatedAt: "26.02.2026",
  },
];

/* ─── Sort options ─── */
const sortOptions = [
  { value: "updatedAt-desc", label: "Última actualización" },
  { value: "createdAt-desc", label: "Más recientes" },
  { value: "createdAt-asc", label: "Más antiguos" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "status", label: "Estado" },
];

/* ─── Bulk Actions Bar ─── */
const BulkActionsBar = ({ count, onClear, onAction }: { count: number; onClear: () => void; onAction: (action: string) => void }) => (
  <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-lg px-4 py-2.5 animate-in slide-in-from-top-2 duration-200">
    <span className="text-sm font-medium text-foreground">{count} seleccionada{count > 1 ? "s" : ""}</span>
    <div className="h-4 w-px bg-border" />
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={() => onAction("export-portals")}>
        <Download className="h-3.5 w-3.5" />
        Exportar a portales
      </Button>
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={() => onAction("publish-web")}>
        <Globe className="h-3.5 w-3.5" />
        Publicar en web
      </Button>
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={() => onAction("unpublish-web")}>
        <GlobeIcon className="h-3.5 w-3.5 text-destructive" />
        Despublicar
      </Button>
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={() => onAction("share")}>
        <Share2 className="h-3.5 w-3.5" />
        Compartir
      </Button>
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={() => onAction("print-pdf")}>
        <Printer className="h-3.5 w-3.5" />
        Imprimir PDF
      </Button>
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={() => onAction("add-tag")}>
        <Tag className="h-3.5 w-3.5" />
        Añadir etiqueta
      </Button>
    </div>
    <div className="ml-auto">
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={onClear}>
        <X className="h-3.5 w-3.5" />
        Deseleccionar
      </Button>
    </div>
  </div>
);

const PropertiesPage = ({ onViewProperty, onAddProperty }: { onViewProperty?: () => void; onAddProperty?: () => void }) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sidebarFilters, setSidebarFilters] = useState<SidebarFilters>(defaultSidebarFilters);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState("updatedAt-desc");
  const [sortOpen, setSortOpen] = useState(false);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const sortedProperties = useMemo(() => {
    return [...demoProperties];
  }, [sortBy]);

  const currentSortLabel = sortOptions.find(o => o.value === sortBy)?.label ?? "Ordenar";

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

      {/* Search Filters Bar */}
      <div className="px-8 pb-4">
        <PropertySearchFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Results bar + Sort */}
      <div className="px-8 pb-3">
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-muted-foreground">{demoProperties.length} propiedades encontradas</p>

          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5" />
                {currentSortLabel}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-1" align="end">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                  className={`flex items-center justify-between w-full px-3 py-2 text-[13px] rounded-md hover:bg-accent transition-colors ${sortBy === opt.value ? "text-foreground font-medium" : "text-muted-foreground"}`}
                >
                  {opt.label}
                  {sortBy === opt.value && <Check className="h-3.5 w-3.5 text-primary" />}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="px-8 pb-3">
          <BulkActionsBar
            count={selectedIds.size}
            onClear={() => setSelectedIds(new Set())}
            onAction={(action) => console.log(action, Array.from(selectedIds))}
          />
        </div>
      )}

      {/* Main content: cards + sidebar */}
      <div className="px-8 pb-10 flex justify-center gap-6">
        {/* Property List — centered */}
        <div className="w-full max-w-4xl space-y-4">
          {sortedProperties.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              onClick={onViewProperty}
              selected={selectedIds.has(p.id)}
              onSelect={toggleSelect}
            />
          ))}
        </div>

        {/* Right Sidebar — hidden on small screens */}
        <div className="hidden xl:block">
          <PropertyFilterSidebar filters={sidebarFilters} onChange={setSidebarFilters} />
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
