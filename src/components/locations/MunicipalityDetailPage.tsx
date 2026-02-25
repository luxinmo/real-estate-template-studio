import { useState, useMemo, useCallback } from "react";
import { Plus, Pencil, Trash2, Check, Maximize2, Minimize2, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LocationNode, LANGUAGES } from "./types";
import { mockLocations } from "./mock-data";
import LocationSidebar, { SidebarHeader } from "./shared/LocationSidebar";
import LocationBreadcrumb from "./shared/LocationBreadcrumb";
import MultilingualContent from "./shared/MultilingualContent";
import MapPanel, { MapPolygon } from "./shared/MapPanel";

const PALETTE = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#ec4899", "#06b6d4", "#84cc16"];

const FlagSelector = ({ active, onChange, data }: {
  active: string; onChange: (code: string) => void; data: Record<string, string>;
}) => (
  <div className="flex flex-wrap gap-1">
    {LANGUAGES.map((l) => (
      <button key={l.code} type="button" onClick={() => onChange(l.code)}
        className={`relative flex items-center gap-0.5 rounded-md px-2 py-1 text-[11px] font-medium transition-all ${
          active === l.code ? "ring-2 ring-primary bg-primary/5 text-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
        }`}>
        <span className="text-sm">{l.flag}</span>
        <span className="uppercase">{l.code}</span>
        {data[l.code] && <Check className="h-2 w-2 text-emerald-500 absolute -top-0.5 -right-0.5" />}
      </button>
    ))}
  </div>
);

interface MunicipalityDetailPageProps {
  countryId: string;
  provinceId: string;
  regionId: string;
  municipalityId: string;
  onBackToCountries: () => void;
  onBackToProvinces: () => void;
  onBackToRegions: () => void;
  onBackToMunicipalities: () => void;
  onEditBorough: (boroughId: string) => void;
}

const MunicipalityDetailPage = ({
  countryId, provinceId, regionId, municipalityId,
  onBackToCountries, onBackToProvinces, onBackToRegions, onBackToMunicipalities, onEditBorough,
}: MunicipalityDetailPageProps) => {
  const [locations, setLocations] = useState<LocationNode[]>(mockLocations);
  const [visibleBoroughs, setVisibleBoroughs] = useState<Set<string>>(new Set());
  const [focusedBoroughId, setFocusedBoroughId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("boroughs");
  const [drawMode, setDrawMode] = useState(false);
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const [boroughsPanelPosition, setBoroughsPanelPosition] = useState<"top" | "side">("side");

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newActive, setNewActive] = useState(true);
  const [drawnGeo, setDrawnGeo] = useState("");

  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [seoOpen, setSeoOpen] = useState(false);
  const [seoLang, setSeoLang] = useState("en");
  const [seoTitles, setSeoTitles] = useState<Record<string, string>>({});
  const [seoDescs, setSeoDescs] = useState<Record<string, string>>({});

  const country = locations.find((n) => n.id === countryId);
  const province = locations.find((n) => n.id === provinceId);
  const region = locations.find((n) => n.id === regionId);
  const municipality = locations.find((n) => n.id === municipalityId);
  const boroughs = useMemo(
    () => locations.filter((n) => n.parentId === municipalityId && n.level === "borough").sort((a, b) => a.order - b.order),
    [locations, municipalityId],
  );

  const mapPolygons: MapPolygon[] = useMemo(
    () => boroughs
      .filter((b) => b.geojson && visibleBoroughs.has(b.id))
      .map((b, i) => ({
        id: b.id,
        name: b.name,
        geojson: b.geojson!,
        color: PALETTE[i % PALETTE.length],
        highlighted: false,
      })),
    [boroughs, visibleBoroughs],
  );

  const toggleBoroughVisibility = (id: string) => {
    setVisibleBoroughs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        setFocusedBoroughId(id);
      }
      return next;
    });
  };

  const handlePolygonClick = useCallback((id: string) => {
    onEditBorough(id);
  }, [onEditBorough]);

  const handleDrawComplete = useCallback((geo: string) => {
    setDrawnGeo(geo); setDrawMode(false); setAdding(true); setActiveTab("boroughs");
  }, []);

  const handleSaveBorough = () => {
    if (!newName.trim()) return;
    const safeName = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setLocations((prev) => [...prev, {
      id: `borough-${Date.now()}`, parentId: municipalityId, level: "borough" as const, name: newName, safeName,
      names: { en: newName }, slugs: { en: safeName }, active: newActive, order: boroughs.length + 1,
      geojson: drawnGeo || null, childrenCount: 0,
    }]);
    setAdding(false); setNewName(""); setDrawnGeo("");
  };

  const handleDeleteBorough = (id: string) => {
    setLocations((prev) => prev.filter((n) => n.id !== id));
    setVisibleBoroughs((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  return (
    <div className="flex-1 flex min-h-0 overflow-hidden relative">
      {!mapFullscreen && (
        <LocationSidebar>
          <SidebarHeader>
            <LocationBreadcrumb segments={[
              { label: "Locations", onClick: onBackToCountries },
              { label: country?.name ?? "", onClick: onBackToProvinces },
              { label: province?.name ?? "", onClick: onBackToRegions },
              { label: region?.name ?? "", onClick: onBackToMunicipalities },
              { label: municipality?.name ?? "" },
            ]} />
            <div className="flex items-center justify-between mt-1">
              <h2 className="text-[15px] font-semibold text-foreground">{municipality?.name}</h2>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setMapFullscreen(true)} title="Expand map">
                <Maximize2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </SidebarHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <div className="px-3 pt-2 shrink-0">
              <TabsList className="h-8 w-full">
                <TabsTrigger value="boroughs" className="text-[11px] flex-1">Boroughs</TabsTrigger>
                <TabsTrigger value="info" className="text-[11px] flex-1">Info</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="boroughs" className="flex-1 min-h-0 mt-0 flex flex-col">
              <ScrollArea className="flex-1 min-h-0 px-3 pt-2">
                <div className="space-y-0.5 pb-3">
                  {boroughs.map((b) => {
                    const isVisible = visibleBoroughs.has(b.id);
                    return (
                      <div
                        key={b.id}
                        className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors ${
                          isVisible ? "bg-primary/5" : "hover:bg-accent"
                        }`}
                      >
                        <Switch
                          checked={isVisible}
                          onCheckedChange={() => toggleBoroughVisibility(b.id)}
                          className="scale-[0.7]"
                        />
                        <span className={`h-1.5 w-1.5 rounded-full ${b.active ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                        <span className="flex-1 text-[12px] font-medium text-foreground truncate">{b.name}</span>
                        {b.geojson ? (
                          <Badge className="text-[8px] bg-emerald-500/10 text-emerald-700 border-emerald-500/20">Geo</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[8px]">—</Badge>
                        )}
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onEditBorough(b.id)}>
                          <Pencil className="h-2.5 w-2.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive" onClick={() => handleDeleteBorough(b.id)}>
                          <Trash2 className="h-2.5 w-2.5" />
                        </Button>
                      </div>
                    );
                  })}

                  {boroughs.length === 0 && !adding && (
                    <p className="text-[11px] text-muted-foreground text-center py-4">No boroughs</p>
                  )}

                  {adding && (
                    <div className="rounded-lg border border-border bg-muted/30 p-2.5 space-y-2 mt-1">
                      <div className="space-y-1">
                        <Label className="text-[10px]">Borough name *</Label>
                        <Input value={newName} onChange={(e) => setNewName(e.target.value)} className="h-7 text-[11px]" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={newActive} onCheckedChange={setNewActive} className="scale-[0.75]" />
                        <Label className="text-[10px]">Active</Label>
                      </div>
                      <div className="flex gap-1.5">
                        <Button size="sm" className="h-6 text-[10px]" onClick={handleSaveBorough} disabled={!newName.trim()}>Save</Button>
                        <Button size="sm" variant="ghost" className="h-6 text-[10px]"
                          onClick={() => { setAdding(false); setNewName(""); }}>Cancel</Button>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {!adding && (
                <div className="px-3 py-2 border-t border-border shrink-0">
                  <Button variant="outline" size="sm" className="w-full gap-1 text-[11px] h-7"
                    onClick={() => setDrawMode(true)}>
                    <Plus className="h-3 w-3" /> Add borough
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="info" className="flex-1 min-h-0 mt-0 overflow-auto">
              <div className="p-3 space-y-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold">Description content</Label>
                  <MultilingualContent values={descriptions} onChange={setDescriptions} minHeight={200} />
                </div>

                <Collapsible open={seoOpen} onOpenChange={setSeoOpen}>
                  <CollapsibleTrigger className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground">
                    <span className={`transition-transform text-[10px] ${seoOpen ? "rotate-90" : ""}`}>▶</span>
                    SEO Settings
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-3 pl-3 border-l-2 border-muted">
                    <FlagSelector active={seoLang} onChange={setSeoLang} data={seoTitles} />
                    <div className="space-y-1">
                      <Label className="text-[10px]">Meta title</Label>
                      <Input value={seoTitles[seoLang] ?? ""}
                        onChange={(e) => setSeoTitles((p) => ({ ...p, [seoLang]: e.target.value }))}
                        className="h-7 text-[11px]" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px]">Meta description</Label>
                      <Textarea value={seoDescs[seoLang] ?? ""}
                        onChange={(e) => setSeoDescs((p) => ({ ...p, [seoLang]: e.target.value }))}
                        rows={2} className="text-[11px]" />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </TabsContent>
          </Tabs>
        </LocationSidebar>
      )}

      <div className="flex-1 min-w-0 relative">
        <MapPanel
          polygons={mapPolygons}
          boundaryGeojson={municipality?.geojson}
          center={[40, -3]}
          zoom={6}
          focusedPolygonId={focusedBoroughId}
          drawMode={drawMode}
          onPolygonClick={handlePolygonClick}
          onDrawComplete={handleDrawComplete}
          onCancelDraw={() => setDrawMode(false)}
        >
          {mapFullscreen && (
            <div className="absolute top-3 left-3 z-[1000] flex items-center gap-1.5">
              <Button size="sm" variant="secondary" className="h-7 text-[10px] shadow-md gap-1" onClick={() => setMapFullscreen(false)}>
                <Minimize2 className="h-3 w-3" /> Exit fullscreen
              </Button>
              <Button
                size="sm"
                variant={boroughsPanelPosition === "side" ? "default" : "secondary"}
                className="h-7 text-[10px] shadow-md gap-1"
                onClick={() => setBoroughsPanelPosition(boroughsPanelPosition === "side" ? "top" : "side")}
              >
                <PanelLeft className="h-3 w-3" /> {boroughsPanelPosition === "side" ? "Boroughs → Top" : "Boroughs → Side"}
              </Button>
            </div>
          )}

          {mapFullscreen && (
            <>
              {boroughsPanelPosition === "side" ? (
                <div className="absolute top-14 left-3 bottom-4 z-[1000] w-[260px] bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-xl flex flex-col overflow-hidden">
                  <div className="px-3 py-2 border-b border-border shrink-0 flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-foreground">Boroughs</span>
                    <Button variant="outline" size="sm" className="h-5 text-[9px] gap-0.5" onClick={() => setDrawMode(true)}>
                      <Plus className="h-2.5 w-2.5" /> Add
                    </Button>
                  </div>
                  <ScrollArea className="flex-1 min-h-0">
                    <div className="p-2 space-y-0.5">
                      {boroughs.map((b) => {
                        const isVisible = visibleBoroughs.has(b.id);
                        return (
                          <div key={b.id} className={`flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors ${isVisible ? "bg-primary/10" : "hover:bg-accent"}`}>
                            <Switch checked={isVisible} onCheckedChange={() => toggleBoroughVisibility(b.id)} className="scale-[0.6]" />
                            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${b.active ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                            <span className="flex-1 text-[11px] font-medium text-foreground truncate">{b.name}</span>
                            <Button variant="ghost" size="icon" className="h-4 w-4 shrink-0" onClick={() => onEditBorough(b.id)}>
                              <Pencil className="h-2 w-2" />
                            </Button>
                          </div>
                        );
                      })}
                      {boroughs.length === 0 && <p className="text-[10px] text-muted-foreground text-center py-3">No boroughs</p>}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div className="absolute top-14 left-3 right-14 z-[1000] bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-xl overflow-hidden">
                  <div className="px-3 py-1.5 border-b border-border flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-foreground">Boroughs</span>
                    <Button variant="outline" size="sm" className="h-5 text-[9px] gap-0.5" onClick={() => setDrawMode(true)}>
                      <Plus className="h-2.5 w-2.5" /> Add
                    </Button>
                  </div>
                  <div className="px-2 py-1.5 flex flex-wrap gap-1 max-h-[120px] overflow-y-auto">
                    {boroughs.map((b) => {
                      const isVisible = visibleBoroughs.has(b.id);
                      return (
                        <button
                          key={b.id}
                          onClick={() => toggleBoroughVisibility(b.id)}
                          className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors border ${
                            isVisible
                              ? "bg-primary/10 border-primary/30 text-foreground"
                              : "bg-muted/50 border-border text-muted-foreground hover:bg-accent"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${b.active ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                          {b.name}
                        </button>
                      );
                    })}
                    {boroughs.length === 0 && <p className="text-[10px] text-muted-foreground py-2">No boroughs</p>}
                  </div>
                </div>
              )}
            </>
          )}

          {!mapFullscreen && !drawMode && (
            <>
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-14 left-3 z-[1000] h-7 text-[10px] shadow-md gap-1"
              >
                <Pencil className="h-3 w-3" /> Edit boundary
              </Button>
              <Button
                size="sm"
                className="absolute bottom-4 right-4 z-[1000] gap-1 text-[11px] shadow-lg"
                onClick={() => setDrawMode(true)}
              >
                <Plus className="h-3 w-3" /> Draw borough
              </Button>
            </>
          )}
          {drawMode && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-card border border-border rounded-lg px-4 py-2 shadow-lg flex items-center gap-3">
              <p className="text-[11px] text-muted-foreground">Click points · double-click to finish</p>
              <Button size="sm" variant="ghost" className="h-6 text-[11px]" onClick={() => setDrawMode(false)}>Cancel</Button>
            </div>
          )}
        </MapPanel>
      </div>
    </div>
  );
};

export default MunicipalityDetailPage;
