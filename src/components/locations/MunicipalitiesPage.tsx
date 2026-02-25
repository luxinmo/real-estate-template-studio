import { useState, useMemo, useCallback } from "react";
import { Plus, Pencil, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LocationNode } from "./types";
import { mockLocations } from "./mock-data";
import LocationSidebar, { SidebarHeader, SidebarBody } from "./shared/LocationSidebar";
import LocationBreadcrumb from "./shared/LocationBreadcrumb";
import MapPanel, { MapPolygon } from "./shared/MapPanel";

const PALETTE = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#ec4899", "#06b6d4", "#84cc16"];

interface MunicipalitiesPageProps {
  countryId: string;
  provinceId: string;
  regionId: string;
  onBackToCountries: () => void;
  onBackToProvinces: () => void;
  onBackToRegions: () => void;
  onSelectMunicipality: (id: string) => void;
}

const MunicipalitiesPage = ({
  countryId, provinceId, regionId,
  onBackToCountries, onBackToProvinces, onBackToRegions, onSelectMunicipality,
}: MunicipalitiesPageProps) => {
  const [locations, setLocations] = useState<LocationNode[]>(mockLocations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [drawMode, setDrawMode] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newActive, setNewActive] = useState(true);
  const [drawnGeo, setDrawnGeo] = useState("");

  const country = locations.find((n) => n.id === countryId);
  const province = locations.find((n) => n.id === provinceId);
  const region = locations.find((n) => n.id === regionId);
  const municipalities = useMemo(
    () => locations.filter((n) => n.parentId === regionId && n.level === "municipality").sort((a, b) => a.order - b.order),
    [locations, regionId],
  );

  const mapPolygons: MapPolygon[] = useMemo(
    () => municipalities.filter((m) => m.geojson).map((m, i) => ({
      id: m.id,
      name: `${m.name} · ${locations.filter((n) => n.parentId === m.id).length} boroughs`,
      geojson: m.geojson!,
      color: PALETTE[i % PALETTE.length],
      highlighted: m.id === selectedId,
    })),
    [municipalities, selectedId, locations],
  );

  const handleSidebarClick = (id: string) => {
    if (selectedId === id) {
      onSelectMunicipality(id);
    } else {
      setSelectedId(id);
      setFocusId(id);
    }
  };

  const handlePolygonClick = useCallback((id: string) => {
    onSelectMunicipality(id);
  }, [onSelectMunicipality]);

  const handleDrawComplete = useCallback((geojson: string) => {
    setDrawnGeo(geojson); setDrawMode(false); setAdding(true);
  }, []);

  const handleSave = () => {
    if (!newName.trim()) return;
    const safeName = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setLocations((prev) => [...prev, {
      id: `muni-${Date.now()}`, parentId: regionId, level: "municipality" as const, name: newName, safeName,
      names: { en: newName }, slugs: { en: safeName }, active: newActive, order: municipalities.length + 1,
      geojson: drawnGeo, childrenCount: 0,
    }]);
    setAdding(false); setNewName(""); setDrawnGeo("");
  };

  return (
    <div className="flex-1 flex min-h-0 overflow-hidden">
      <LocationSidebar>
        <SidebarHeader>
          <LocationBreadcrumb segments={[
            { label: "Locations", onClick: onBackToCountries },
            { label: country?.name ?? "", onClick: onBackToProvinces },
            { label: province?.name ?? "", onClick: onBackToRegions },
            { label: region?.name ?? "" },
          ]} />
          <div className="flex items-center justify-between mt-1">
            <h2 className="text-[15px] font-semibold text-foreground">{region?.name}</h2>
            <Button size="sm" className="h-7 gap-1 text-[11px]"
              onClick={() => { setDrawMode(true); setAdding(false); }}>
              <Plus className="h-3 w-3" /> Add municipality
            </Button>
          </div>
        </SidebarHeader>

        <SidebarBody>
          {adding && (
            <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2.5 mb-2">
              <div className="space-y-1">
                <Label className="text-[11px]">Municipality name *</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Name" className="h-8 text-[12px]" />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={newActive} onCheckedChange={setNewActive} className="scale-[0.8]" />
                <Label className="text-[11px]">Active</Label>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="h-6 text-[10px]" onClick={handleSave} disabled={!newName.trim()}>Save</Button>
                <Button size="sm" variant="ghost" className="h-6 text-[10px]"
                  onClick={() => { setAdding(false); setNewName(""); }}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-0.5">
            {municipalities.map((m) => {
              const childCount = locations.filter((n) => n.parentId === m.id).length;
              const isSelected = selectedId === m.id;
              return (
                <div key={m.id} className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] transition-all ${
                  isSelected
                    ? "bg-primary/8 text-foreground font-medium ring-1 ring-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}>
                  <button
                    className="flex flex-1 items-center gap-2 min-w-0"
                    onClick={() => handleSidebarClick(m.id)}
                  >
                    <span className={`h-2 w-2 rounded-full shrink-0 ${m.active ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                    <span className="flex-1 text-left truncate">{m.name}</span>
                    <Badge variant="secondary" className="text-[9px] shrink-0">{childCount}</Badge>
                  </button>
                  <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-50 shrink-0 transition-opacity" />
                  <button onClick={() => onSelectMunicipality(m.id)} className="shrink-0 text-muted-foreground hover:text-primary transition-colors" title="Enter municipality">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-4">
            Click name to highlight · Click arrow or polygon to enter
          </p>
        </SidebarBody>
      </LocationSidebar>

      <div className="flex-1 min-w-0">
        <MapPanel
          polygons={mapPolygons}
          boundaryGeojson={region?.geojson}
          center={[40, -3]}
          zoom={6}
          focusedPolygonId={focusId}
          drawMode={drawMode}
          onPolygonClick={handlePolygonClick}
          onDrawComplete={handleDrawComplete}
          onCancelDraw={() => setDrawMode(false)}
        >
          {drawMode && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-card border border-border rounded-lg px-4 py-2 shadow-lg flex items-center gap-3">
              <p className="text-[11px] text-muted-foreground">Draw inside region boundary · double-click to finish</p>
              <Button size="sm" variant="ghost" className="h-6 text-[11px]" onClick={() => setDrawMode(false)}>Cancel</Button>
            </div>
          )}
        </MapPanel>
      </div>
    </div>
  );
};

export default MunicipalitiesPage;
