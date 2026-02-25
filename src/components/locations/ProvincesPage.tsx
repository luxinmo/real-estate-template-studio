import { useState, useMemo, useCallback } from "react";
import { Plus, Pencil, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LocationNode } from "./types";
import { mockLocations } from "./mock-data";
import { SidebarHeader, SidebarBody } from "./shared/LocationSidebar";
import LocationBreadcrumb from "./shared/LocationBreadcrumb";
import LocationEditPanel from "./shared/LocationEditPanel";
import MapPanel, { MapPolygon } from "./shared/MapPanel";

const PALETTE = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#ec4899", "#06b6d4", "#84cc16"];

interface ProvincesPageProps {
  countryId: string;
  onBack: () => void;
  onSelectProvince: (id: string) => void;
}

const ProvincesPage = ({ countryId, onBack, onSelectProvince }: ProvincesPageProps) => {
  const [locations, setLocations] = useState<LocationNode[]>(mockLocations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [drawMode, setDrawMode] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newActive, setNewActive] = useState(true);
  const [drawnGeo, setDrawnGeo] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const isEditing = !!editingId;
  const editingNode = editingId ? locations.find((n) => n.id === editingId) : null;

  const country = locations.find((n) => n.id === countryId);
  const provinces = useMemo(
    () => locations.filter((n) => n.parentId === countryId && n.level === "province").sort((a, b) => a.order - b.order),
    [locations, countryId],
  );

  const mapPolygons: MapPolygon[] = useMemo(
    () => isEditing ? [] : provinces.filter((p) => p.geojson).map((p, i) => ({
      id: p.id,
      name: `${p.name} · ${locations.filter((n) => n.parentId === p.id).length} regions`,
      geojson: p.geojson!,
      color: PALETTE[i % PALETTE.length],
      highlighted: p.id === selectedId,
    })),
    [provinces, selectedId, locations, isEditing],
  );

  const handleSidebarClick = (id: string) => {
    setSelectedId(id);
    setFocusId(id);
  };

  const handlePolygonClick = useCallback((id: string) => {
    if (id === selectedId) {
      onSelectProvince(id);
    } else {
      setSelectedId(id);
      setFocusId(id);
    }
  }, [selectedId, onSelectProvince]);

  const handleDrawComplete = useCallback((geojson: string) => {
    setDrawnGeo(geojson); setDrawMode(false); setAdding(true);
  }, []);

  const handleSave = () => {
    if (!newName.trim()) return;
    const safeName = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setLocations((prev) => [...prev, {
      id: `prov-${Date.now()}`, parentId: countryId, level: "province" as const, name: newName, safeName,
      names: { en: newName }, slugs: { en: safeName }, active: newActive, order: provinces.length + 1,
      geojson: drawnGeo, childrenCount: 0,
    }]);
    setAdding(false); setNewName(""); setDrawnGeo("");
  };

  return (
    <div className="flex-1 flex min-h-0 overflow-hidden">
      <div
        className="shrink-0 border-r border-border flex flex-col bg-card overflow-hidden"
        style={{ width: isEditing ? '70%' : '320px', transition: 'width 300ms ease' }}
      >
        {isEditing ? (
          <LocationEditPanel
            node={editingNode}
            level="province"
            onClose={() => setEditingId(null)}
            onSave={() => setEditingId(null)}
          />
        ) : (
          <>
            <SidebarHeader>
              <LocationBreadcrumb segments={[
                { label: "Locations", onClick: onBack },
                { label: country?.name ?? "" },
              ]} />
              <div className="flex items-center justify-between mt-1">
                <h2 className="text-[15px] font-semibold text-foreground">{country?.name}</h2>
                <Button size="sm" className="h-7 gap-1 text-[11px]"
                  onClick={() => { setDrawMode(true); setAdding(false); }}>
                  <Plus className="h-3 w-3" /> Add province
                </Button>
              </div>
            </SidebarHeader>

            <SidebarBody>
              {adding && (
                <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2.5 mb-2">
                  <div className="space-y-1">
                    <Label className="text-[11px]">Province name *</Label>
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
                {provinces.map((p) => {
                  const regionCount = locations.filter((n) => n.parentId === p.id).length;
                  const isSelected = selectedId === p.id;
                  return (
                    <div key={p.id} className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] transition-all ${
                      isSelected
                        ? "bg-primary/8 text-foreground font-medium ring-1 ring-primary/20"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}>
                      <button
                        className="flex flex-1 items-center gap-2 min-w-0"
                        onClick={() => handleSidebarClick(p.id)}
                      >
                        <span className={`h-2 w-2 rounded-full shrink-0 ${p.active ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                        <span className="flex-1 text-left truncate">{p.name}</span>
                        <Badge variant="secondary" className="text-[9px] shrink-0">{regionCount}</Badge>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingId(p.id); }}
                        className="shrink-0 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Edit province"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      {isSelected && (
                        <button onClick={() => onSelectProvince(p.id)} className="shrink-0 text-primary hover:text-primary/80 transition-colors" title="Enter province">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-4">
                Click to highlight · Click polygon on map to enter
              </p>
            </SidebarBody>
          </>
        )}
      </div>

      <div className="flex-1 min-w-0" style={{ transition: 'width 300ms ease' }}>
        <MapPanel
          polygons={mapPolygons}
          geometry={isEditing ? editingNode?.geojson ?? undefined : undefined}
          boundaryGeojson={isEditing ? country?.geojson : undefined}
          center={[40, -3]}
          zoom={6}
          focusedPolygonId={focusId}
          drawMode={!isEditing && drawMode}
          onPolygonClick={isEditing ? undefined : handlePolygonClick}
          onDrawComplete={handleDrawComplete}
          onCancelDraw={() => setDrawMode(false)}
        >
          {!isEditing && drawMode && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-card border border-border rounded-lg px-4 py-2 shadow-lg flex items-center gap-3">
              <p className="text-[11px] text-muted-foreground">Click points to draw · double-click to finish</p>
              <Button size="sm" variant="ghost" className="h-6 text-[11px]" onClick={() => setDrawMode(false)}>Cancel</Button>
            </div>
          )}
        </MapPanel>
      </div>
    </div>
  );
};

export default ProvincesPage;
