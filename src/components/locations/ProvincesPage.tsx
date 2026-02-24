import { useState, useMemo, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LocationNode } from "./types";
import { mockLocations } from "./mock-data";
import LocationMap from "./LocationMap";
import LocationBreadcrumb from "./shared/LocationBreadcrumb";

const PALETTE = [
  "#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
];

interface ProvincesPageProps {
  countryId: string;
  onBack: () => void;
  onSelectProvince: (provinceId: string) => void;
  onEditProvince: (loc: LocationNode) => void;
}

const ProvincesPage = ({ countryId, onBack, onSelectProvince, onEditProvince }: ProvincesPageProps) => {
  const [locations, setLocations] = useState<LocationNode[]>(mockLocations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawMode, setDrawMode] = useState(false);
  const [drawDialog, setDrawDialog] = useState(false);
  const [drawnGeoJSON, setDrawnGeoJSON] = useState("");
  const [newName, setNewName] = useState("");
  const [newActive, setNewActive] = useState(true);

  const country = locations.find((n) => n.id === countryId);
  const provinces = useMemo(
    () => locations.filter((n) => n.parentId === countryId && n.level === "province").sort((a, b) => a.order - b.order),
    [locations, countryId],
  );

  const mapPolygons = useMemo(
    () => provinces.filter((p) => p.geojson).map((p, i) => ({
      id: p.id,
      name: `${p.name} (${locations.filter((n) => n.parentId === p.id).length} towns)`,
      geojson: p.geojson!,
      color: PALETTE[i % PALETTE.length],
      highlighted: p.id === selectedId,
    })),
    [provinces, selectedId, locations],
  );

  const handleChipClick = (id: string) => {
    if (selectedId === id) {
      onSelectProvince(id);
    } else {
      setSelectedId(id);
    }
  };

  const handlePolygonClick = useCallback((id: string) => {
    onSelectProvince(id);
  }, [onSelectProvince]);

  const handleDrawComplete = useCallback((geojson: string) => {
    setDrawnGeoJSON(geojson);
    setDrawMode(false);
    setDrawDialog(true);
  }, []);

  const handleSave = () => {
    if (!newName.trim()) return;
    const safeName = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const newNode: LocationNode = {
      id: `prov-${Date.now()}`,
      parentId: countryId,
      level: "province",
      name: newName,
      safeName,
      names: { en: newName },
      slugs: { en: safeName },
      active: newActive,
      order: provinces.length + 1,
      geojson: drawnGeoJSON,
      childrenCount: 0,
    };
    setLocations((prev) => [...prev, newNode]);
    setDrawDialog(false);
    setNewName("");
    setDrawnGeoJSON("");
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 sm:px-6 h-14 shrink-0">
        <LocationBreadcrumb
          segments={[
            { label: "Locations", onClick: onBack },
            { label: country?.name ?? "Country" },
          ]}
        />
      </div>

      {/* Chips (30%) */}
      <div className="shrink-0 border-b border-border" style={{ height: "30%" }}>
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-semibold text-foreground">Provinces</h3>
            <span className="text-[11px] text-muted-foreground">{provinces.length} total</span>
          </div>
          <ScrollArea className="flex-1">
            <div className="flex flex-wrap gap-2 pb-2">
              {provinces.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleChipClick(p.id)}
                  onDoubleClick={() => onSelectProvince(p.id)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-medium transition-all ${
                    selectedId === p.id
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-card text-foreground border-border hover:border-primary/30 hover:shadow-sm"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${p.active ? "bg-emerald-400" : "bg-muted-foreground/30"}`} />
                  {p.name}
                  <Badge variant={selectedId === p.id ? "outline" : "secondary"} className="text-[9px] ml-1">
                    {locations.filter((n) => n.parentId === p.id).length} towns
                  </Badge>
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <p className="text-[10px] text-muted-foreground mt-1">Click to highlight, double-click or click polygon to enter</p>
        </div>
      </div>

      {/* Map (70%) */}
      <div className="flex-1 min-h-0 relative">
        <LocationMap
          polygons={mapPolygons}
          center={[40, -3]}
          zoom={6}
          height="100%"
          drawMode={drawMode}
          focusedPolygonId={selectedId}
          onPolygonClick={handlePolygonClick}
          onDrawComplete={handleDrawComplete}
          onCancelDraw={() => setDrawMode(false)}
        />

        {/* Floating add button */}
        {!drawMode && (
          <Button
            size="sm"
            className="absolute bottom-4 right-4 z-[1000] gap-1.5 shadow-lg"
            onClick={() => setDrawMode(true)}
          >
            <Plus className="h-3.5 w-3.5" /> Add province
          </Button>
        )}

        {drawMode && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-card border border-border rounded-lg px-4 py-2 shadow-lg flex items-center gap-3">
            <p className="text-[11px] text-muted-foreground">Click points to draw, double-click to finish</p>
            <Button size="sm" variant="ghost" className="h-6 text-[11px]" onClick={() => setDrawMode(false)}>Cancel</Button>
          </div>
        )}
      </div>

      {/* Save drawn dialog */}
      <Dialog open={drawDialog} onOpenChange={setDrawDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[15px]">New Province</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-[12px]">Name *</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Province name" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={newActive} onCheckedChange={setNewActive} />
              <Label className="text-[12px]">Active</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => { setDrawDialog(false); setDrawnGeoJSON(""); }}>Cancel</Button>
              <Button size="sm" onClick={handleSave} disabled={!newName.trim()}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProvincesPage;
