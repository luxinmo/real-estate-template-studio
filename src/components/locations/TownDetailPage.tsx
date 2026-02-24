import { useState, useMemo, useCallback } from "react";
import { Plus, Pencil, Trash2, Check, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LocationNode, LANGUAGES } from "./types";
import { mockLocations } from "./mock-data";
import LocationMap from "./LocationMap";
import LocationBreadcrumb from "./shared/LocationBreadcrumb";
import MultilingualEditor from "./shared/MultilingualEditor";

const PALETTE = [
  "#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
];

interface TownDetailPageProps {
  countryId: string;
  provinceId: string;
  townId: string;
  onBackToCountries: () => void;
  onBackToProvinces: () => void;
  onBackToTowns: () => void;
  onEditZone: (zoneId: string) => void;
  onAddZone: () => void;
}

const FlagSelector = ({ active, onChange, data }: {
  active: string; onChange: (code: string) => void; data: Record<string, string>;
}) => (
  <div className="flex flex-wrap gap-1.5">
    {LANGUAGES.map((lang) => (
      <button key={lang.code} type="button" onClick={() => onChange(lang.code)}
        className={`relative flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-all ${
          active === lang.code
            ? "ring-2 ring-primary bg-primary/5 text-foreground"
            : "bg-muted text-muted-foreground hover:bg-accent"
        }`}>
        <span className="text-sm">{lang.flag}</span>
        <span className="uppercase">{lang.code}</span>
        {data[lang.code] && (
          <Check className="h-2.5 w-2.5 text-emerald-500 absolute -top-0.5 -right-0.5" />
        )}
      </button>
    ))}
  </div>
);

const TownDetailPage = ({
  countryId, provinceId, townId,
  onBackToCountries, onBackToProvinces, onBackToTowns,
  onEditZone, onAddZone,
}: TownDetailPageProps) => {
  const [locations, setLocations] = useState<LocationNode[]>(mockLocations);
  const [selectedZones, setSelectedZones] = useState<Set<string>>(new Set());
  const [focusedZoneId, setFocusedZoneId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("zones");
  const [drawMode, setDrawMode] = useState(false);
  const [editBoundary, setEditBoundary] = useState(false);

  // Inline add zone
  const [addingZone, setAddingZone] = useState(false);
  const [newZoneName, setNewZoneName] = useState("");
  const [newZoneActive, setNewZoneActive] = useState(true);
  const [drawnGeoJSON, setDrawnGeoJSON] = useState("");

  // Info tab
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [seoOpen, setSeoOpen] = useState(false);
  const [activeSeoLang, setActiveSeoLang] = useState("en");
  const [seoTitles, setSeoTitles] = useState<Record<string, string>>({});
  const [seoDescs, setSeoDescs] = useState<Record<string, string>>({});

  const country = locations.find((n) => n.id === countryId);
  const province = locations.find((n) => n.id === provinceId);
  const town = locations.find((n) => n.id === townId);
  const zones = useMemo(
    () => locations.filter((n) => n.parentId === townId && n.level === "zone").sort((a, b) => a.order - b.order),
    [locations, townId],
  );

  const mapPolygons = useMemo(
    () => zones.filter((z) => z.geojson).map((z, i) => ({
      id: z.id,
      name: z.name,
      geojson: z.geojson!,
      color: PALETTE[i % PALETTE.length],
      highlighted: selectedZones.has(z.id),
    })),
    [zones, selectedZones],
  );

  const toggleZone = (id: string) => {
    setSelectedZones((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setFocusedZoneId(id);
  };

  const selectAll = () => setSelectedZones(new Set(zones.map((z) => z.id)));
  const clearAll = () => { setSelectedZones(new Set()); setFocusedZoneId(null); };

  const handlePolygonClick = useCallback((id: string) => {
    toggleZone(id);
  }, []);

  const handleDrawComplete = useCallback((geojson: string) => {
    setDrawnGeoJSON(geojson);
    setDrawMode(false);
    setAddingZone(true);
  }, []);

  const handleSaveNewZone = () => {
    if (!newZoneName.trim()) return;
    const safeName = newZoneName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const newNode: LocationNode = {
      id: `zone-${Date.now()}`,
      parentId: townId,
      level: "zone",
      name: newZoneName,
      safeName,
      names: { en: newZoneName },
      slugs: { en: safeName },
      active: newZoneActive,
      order: zones.length + 1,
      geojson: drawnGeoJSON || null,
      childrenCount: 0,
    };
    setLocations((prev) => [...prev, newNode]);
    setAddingZone(false);
    setNewZoneName("");
    setDrawnGeoJSON("");
  };

  const handleDeleteZone = (id: string) => {
    setLocations((prev) => prev.filter((n) => n.id !== id));
    setSelectedZones((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 sm:px-6 h-14 shrink-0">
        <LocationBreadcrumb
          segments={[
            { label: "Locations", onClick: onBackToCountries },
            { label: country?.name ?? "", onClick: onBackToProvinces },
            { label: province?.name ?? "", onClick: onBackToTowns },
            { label: town?.name ?? "Town" },
          ]}
        />
      </div>

      {/* 50/50 split */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT */}
        <div className="border-r border-border flex flex-col min-h-0 overflow-hidden">
          {/* Town header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0">
            <h2 className="text-lg font-semibold text-foreground flex-1">{town?.name}</h2>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <div className="px-4 pt-2 shrink-0">
              <TabsList className="h-9">
                <TabsTrigger value="zones" className="text-[12px]">Zones</TabsTrigger>
                <TabsTrigger value="info" className="text-[12px]">Info</TabsTrigger>
              </TabsList>
            </div>

            {/* ZONES TAB */}
            <TabsContent value="zones" className="flex-1 min-h-0 mt-0 flex flex-col">
              <div className="flex items-center gap-2 px-4 py-2 shrink-0">
                <Button variant="ghost" size="sm" className="h-6 text-[11px]" onClick={selectAll}>
                  <CheckSquare className="h-3 w-3 mr-1" /> Select all
                </Button>
                <Button variant="ghost" size="sm" className="h-6 text-[11px]" onClick={clearAll}>
                  <Square className="h-3 w-3 mr-1" /> Clear
                </Button>
              </div>

              <ScrollArea className="flex-1 px-4">
                <div className="space-y-1 pb-4">
                  {zones.map((z) => (
                    <div
                      key={z.id}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors ${
                        selectedZones.has(z.id) ? "bg-primary/5" : "hover:bg-accent"
                      }`}
                    >
                      <Checkbox
                        checked={selectedZones.has(z.id)}
                        onCheckedChange={() => toggleZone(z.id)}
                      />
                      <span className="flex-1 text-[13px] font-medium text-foreground">{z.name}</span>
                      {z.geojson ? (
                        <Badge className="text-[9px] bg-emerald-500/10 text-emerald-700 border-emerald-500/20">GeoJSON</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[9px]">None</Badge>
                      )}
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEditZone(z.id)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDeleteZone(z.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}

                  {zones.length === 0 && !addingZone && (
                    <p className="text-[12px] text-muted-foreground text-center py-6">No zones yet</p>
                  )}

                  {/* Inline add form */}
                  {addingZone && (
                    <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3 mt-2">
                      <div className="space-y-1.5">
                        <Label className="text-[12px]">Zone name *</Label>
                        <Input value={newZoneName} onChange={(e) => setNewZoneName(e.target.value)} placeholder="Zone name" className="h-8" />
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch checked={newZoneActive} onCheckedChange={setNewZoneActive} className="scale-[0.85]" />
                        <Label className="text-[11px]">Active</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="h-7 text-[11px]" onClick={handleSaveNewZone} disabled={!newZoneName.trim()}>Save</Button>
                        <Button size="sm" variant="ghost" className="h-7 text-[11px]"
                          onClick={() => { setAddingZone(false); setNewZoneName(""); setDrawnGeoJSON(""); }}>Cancel</Button>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Add zone button */}
              {!addingZone && (
                <div className="px-4 py-3 border-t border-border shrink-0">
                  <Button variant="outline" size="sm" className="w-full gap-1.5 text-[12px]"
                    onClick={() => setDrawMode(true)}>
                    <Plus className="h-3.5 w-3.5" /> Add zone
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* INFO TAB */}
            <TabsContent value="info" className="flex-1 min-h-0 mt-0 overflow-auto">
              <div className="p-4 space-y-5">
                <div className="space-y-2">
                  <Label className="text-[12px] font-semibold">Description content</Label>
                  <MultilingualEditor values={descriptions} onChange={setDescriptions} minHeight={250} />
                </div>

                <Collapsible open={seoOpen} onOpenChange={setSeoOpen}>
                  <CollapsibleTrigger className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <span className={`transition-transform ${seoOpen ? "rotate-90" : ""}`}>▶</span>
                    SEO Settings
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 space-y-4 pl-4 border-l-2 border-muted">
                    <FlagSelector active={activeSeoLang} onChange={setActiveSeoLang} data={seoTitles} />
                    <div className="space-y-1.5">
                      <Label className="text-[12px]">Meta title</Label>
                      <Input value={seoTitles[activeSeoLang] ?? ""}
                        onChange={(e) => setSeoTitles((p) => ({ ...p, [activeSeoLang]: e.target.value }))}
                        placeholder="Meta title" className="text-[13px]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[12px]">Meta description</Label>
                      <Textarea value={seoDescs[activeSeoLang] ?? ""}
                        onChange={(e) => setSeoDescs((p) => ({ ...p, [activeSeoLang]: e.target.value }))}
                        rows={3} placeholder="Meta description" className="text-[13px]" />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT — Map */}
        <div className="relative min-h-[600px]">
          <LocationMap
            polygons={mapPolygons}
            boundaryGeojson={town?.geojson}
            center={[40, -3]}
            zoom={6}
            height="100%"
            drawMode={drawMode}
            focusedPolygonId={focusedZoneId}
            onPolygonClick={handlePolygonClick}
            onDrawComplete={handleDrawComplete}
            onCancelDraw={() => setDrawMode(false)}
          />

          {/* Edit boundary button */}
          {!drawMode && (
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-14 left-3 z-[1000] h-7 text-[11px] shadow-md gap-1"
              onClick={() => setEditBoundary(!editBoundary)}
            >
              <Pencil className="h-3 w-3" /> Edit boundary
            </Button>
          )}

          {drawMode && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-card border border-border rounded-lg px-4 py-2 shadow-lg flex items-center gap-3">
              <p className="text-[11px] text-muted-foreground">Click points to draw zone, double-click to finish</p>
              <Button size="sm" variant="ghost" className="h-6 text-[11px]" onClick={() => setDrawMode(false)}>Cancel</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TownDetailPage;
