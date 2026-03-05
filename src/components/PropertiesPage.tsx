import { useState, useMemo, useEffect, useRef } from "react";
import { Plus, ArrowUpDown, Download, Globe, GlobeIcon, Share2, Printer, Tag, X, ChevronDown, Check, SlidersHorizontal, Star, Circle, Home, Ban, EyeOff, User, Sparkles, Languages, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import PropertyCard, { PropertyData } from "@/components/properties/PropertyCard";
import PropertySearchFilters, { FilterState, defaultFilters } from "@/components/properties/PropertySearchFilters";
import PropertyFilterSidebar, { SidebarFilters, defaultSidebarFilters } from "@/components/properties/PropertyFilterSidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
  <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-lg px-3 sm:px-4 py-2.5 animate-in slide-in-from-top-2 duration-200 overflow-x-auto">
    <span className="text-sm font-medium text-foreground whitespace-nowrap">{count} sel.</span>
    <div className="h-4 w-px bg-border shrink-0" />
    <div className="flex items-center gap-1 shrink-0">
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 whitespace-nowrap" onClick={() => onAction("export-portals")}>
        <Download className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Exportar a portales</span>
        <span className="sm:hidden">Exportar</span>
      </Button>
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 whitespace-nowrap" onClick={() => onAction("publish-web")}>
        <Globe className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Publicar en web</span>
        <span className="sm:hidden">Publicar</span>
      </Button>
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 whitespace-nowrap hidden sm:inline-flex" onClick={() => onAction("unpublish-web")}>
        <GlobeIcon className="h-3.5 w-3.5 text-destructive" />
        Despublicar
      </Button>
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 whitespace-nowrap" onClick={() => onAction("share")}>
        <Share2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Compartir</span>
      </Button>
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 whitespace-nowrap hidden sm:inline-flex" onClick={() => onAction("print-pdf")}>
        <Printer className="h-3.5 w-3.5" />
        Imprimir PDF
      </Button>
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 whitespace-nowrap" onClick={() => onAction("add-tag")}>
        <Tag className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Etiqueta</span>
      </Button>
    </div>
    <div className="ml-auto shrink-0">
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={onClear}>
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  </div>
);

const aiLanguages = [
  { code: "ES", flag: "🇪🇸", label: "Español" },
  { code: "EN", flag: "🇬🇧", label: "English" },
  { code: "FR", flag: "🇫🇷", label: "Français" },
  { code: "DE", flag: "🇩🇪", label: "Deutsch" },
  { code: "RU", flag: "🇷🇺", label: "Русский" },
  { code: "NL", flag: "🇳🇱", label: "Nederlands" },
  { code: "SE", flag: "🇸🇪", label: "Svenska" },
];

const PropertiesPage = ({ onViewProperty, onAddProperty }: { onViewProperty?: () => void; onAddProperty?: () => void }) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sidebarFilters, setSidebarFilters] = useState<SidebarFilters>(defaultSidebarFilters);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState("updatedAt-desc");
  const [sortOpen, setSortOpen] = useState(false);

  // AI Description Generator state
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiSelectedLangs, setAiSelectedLangs] = useState<string[]>(["ES", "EN"]);
  const [aiPrompt, setAiPrompt] = useState("Genera una descripción profesional y atractiva para una propiedad de lujo, destacando sus características principales, ubicación y estilo de vida.");
  const [aiRunning, setAiRunning] = useState(false);
  const [aiProgress, setAiProgress] = useState({ current: 0, total: 0 });
  const [aiCurrentRef, setAiCurrentRef] = useState("");
  const [aiCurrentLang, setAiCurrentLang] = useState("");
  const aiIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleAiLang = (code: string) => {
    setAiSelectedLangs(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const startAiGeneration = () => {
    setAiRunning(true);
    const refs = demoProperties.filter(p => selectedIds.has(p.id)).map(p => p.reference);
    const total = refs.length * aiSelectedLangs.length;
    setAiProgress({ current: 0, total });
    let step = 0;

    aiIntervalRef.current = setInterval(() => {
      step++;
      const refIdx = Math.floor((step - 1) / aiSelectedLangs.length);
      const langIdx = (step - 1) % aiSelectedLangs.length;
      setAiProgress({ current: step, total });
      setAiCurrentRef(refs[refIdx] || "");
      setAiCurrentLang(aiSelectedLangs[langIdx] || "");

      if (step >= total) {
        if (aiIntervalRef.current) clearInterval(aiIntervalRef.current);
        setTimeout(() => {
          setAiRunning(false);
          setAiDialogOpen(false);
          setAiProgress({ current: 0, total: 0 });
        }, 1200);
      }
    }, 1800);
  };

  useEffect(() => {
    return () => { if (aiIntervalRef.current) clearInterval(aiIntervalRef.current); };
  }, []);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === demoProperties.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(demoProperties.map(p => p.id)));
    }
  };

  const sortedProperties = useMemo(() => {
    return [...demoProperties];
  }, [sortBy]);

  const currentSortLabel = sortOptions.find(o => o.value === sortBy)?.label ?? "Ordenar";

  return (
    <div className="flex-1 overflow-auto pb-20 xl:pb-0">
      {/* Header */}
      <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">Propiedades</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{demoProperties.length} propiedades en cartera</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setAiDialogOpen(true)}>
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Generar descripciones IA</span>
            <span className="sm:hidden">IA</span>
          </Button>
          <Button className="gap-2 shrink-0" onClick={onAddProperty}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nueva propiedad</span>
            <span className="sm:hidden">Nueva</span>
          </Button>
        </div>
      </div>

      {/* Search Filters Bar */}
      <div className="px-4 sm:px-8 pb-4">
        <PropertySearchFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Results bar + Sort */}
      <div className="px-4 sm:px-8 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedIds.size === demoProperties.length && demoProperties.length > 0}
                onCheckedChange={selectAll}
              />
              <span className="text-[12px] text-muted-foreground">Seleccionar todo</span>
            </label>
            <p className="text-[12px] text-muted-foreground">{demoProperties.length} propiedades</p>
          </div>

          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{currentSortLabel}</span>
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
        <div className="px-4 sm:px-8 pb-3">
          <BulkActionsBar
            count={selectedIds.size}
            onClear={() => setSelectedIds(new Set())}
            onAction={(action) => console.log(action, Array.from(selectedIds))}
          />
        </div>
      )}

      {/* Main content: cards + sidebar */}
      <div className="px-4 sm:px-8 pb-10 flex justify-center gap-6">
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

        {/* Right Sidebar — hidden below xl */}
        <div className="hidden xl:block">
          <PropertyFilterSidebar filters={sidebarFilters} onChange={setSidebarFilters} />
        </div>
      </div>

      {/* Mobile bottom filter bar — visible below xl */}
      <div className="fixed bottom-0 left-0 right-0 xl:hidden z-40 bg-card border-t border-border px-3 py-2 flex items-center justify-center gap-2 overflow-x-auto">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5 shrink-0">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filtros
              {Object.values(sidebarFilters).flat().filter(c => c.mode !== "off").length > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-[9px]">
                  {Object.values(sidebarFilters).flat().filter(c => c.mode !== "off").length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="pt-4">
              <PropertyFilterSidebar filters={sidebarFilters} onChange={setSidebarFilters} />
            </div>
          </SheetContent>
        </Sheet>

        <Button variant="ghost" size="sm" className="h-9 text-xs gap-1.5 shrink-0">
          <Tag className="h-3.5 w-3.5" />
          Etiquetas
        </Button>
        <Button variant="ghost" size="sm" className="h-9 text-xs gap-1.5 shrink-0">
          <User className="h-3.5 w-3.5" />
          Agente
        </Button>
        <Button variant="ghost" size="sm" className="h-9 text-xs gap-1.5 shrink-0">
          <Star className="h-3.5 w-3.5" />
          Valoración
        </Button>
        <Button variant="ghost" size="sm" className="h-9 text-xs gap-1.5 shrink-0">
          <Circle className="h-3.5 w-3.5" />
          Estado
        </Button>
        <Button variant="ghost" size="sm" className="h-9 text-xs gap-1.5 shrink-0">
          <Globe className="h-3.5 w-3.5" />
          Portales
        </Button>
      </div>

      {/* AI Description Generator Dialog */}
      <Dialog open={aiDialogOpen} onOpenChange={(open) => { if (!aiRunning) setAiDialogOpen(open); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Generar descripciones con IA
            </DialogTitle>
          </DialogHeader>

          {!aiRunning ? (
            <div className="space-y-5 pt-2">
              <div className="rounded-lg bg-muted/50 border border-border px-3 py-2.5">
                <p className="text-xs text-muted-foreground">
                  Se generarán descripciones para <span className="font-semibold text-foreground">{selectedIds.size}</span> propiedades
                  sin descripción en los idiomas seleccionados.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Idiomas de destino</Label>
                <div className="flex flex-wrap gap-2">
                  {aiLanguages.map(l => (
                    <label key={l.code} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={aiSelectedLangs.includes(l.code)}
                        onCheckedChange={() => toggleAiLang(l.code)}
                      />
                      <span className="text-sm">{l.flag} {l.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Prompt / Instrucciones para la IA</Label>
                <Textarea
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder="Describe el tono y estilo que quieres para las descripciones..."
                  className="min-h-[100px] text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button variant="outline" onClick={() => setAiDialogOpen(false)}>Cancelar</Button>
                <Button
                  onClick={startAiGeneration}
                  disabled={aiSelectedLangs.length === 0}
                  className="gap-2"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Generar {selectedIds.size * aiSelectedLangs.length} descripciones
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-5 pt-2 pb-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Generando descripciones...</span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {aiProgress.current} de {aiProgress.total}
                  </span>
                </div>
                <Progress value={(aiProgress.current / aiProgress.total) * 100} className="h-2" />
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-foreground">
                    Propiedad <span className="font-mono font-semibold">{aiCurrentRef}</span>
                  </span>
                  <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    {aiLanguages.find(l => l.code === aiCurrentLang)?.flag} {aiCurrentLang}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 bg-muted rounded animate-pulse w-full" />
                  <div className="h-3 bg-muted rounded animate-pulse w-[90%]" />
                  <div className="h-3 bg-muted rounded animate-pulse w-[75%]" />
                  <div className="h-3 bg-muted rounded animate-pulse w-[85%]" />
                </div>
              </div>

              {aiProgress.current >= aiProgress.total && (
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <Check className="h-4 w-4" />
                  ¡Todas las descripciones generadas!
                </div>
              )}

              <p className="text-[11px] text-muted-foreground">
                No cierres esta ventana mientras se generan las descripciones.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertiesPage;
