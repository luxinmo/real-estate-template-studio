import { useState, useMemo, useCallback } from "react";
import { Plus, Pencil, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LocationNode } from "./types";
import { mockLocations } from "./mock-data";
import { SidebarHeader, SidebarBody } from "./shared/LocationSidebar";
import LocationEditPanel from "./shared/LocationEditPanel";
import MapPanel, { MapPolygon } from "./shared/MapPanel";

const FLAGS: Record<string, string> = { "España": "🇪🇸" };
const PALETTE = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#ec4899", "#06b6d4", "#84cc16"];

interface CountriesPageProps {
  onSelectCountry: (id: string) => void;
}

const CountriesPage = ({ onSelectCountry }: CountriesPageProps) => {
  const [locations] = useState<LocationNode[]>(mockLocations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const isEditing = !!editingId;
  const editingNode = editingId ? locations.find((n) => n.id === editingId) : null;

  const countries = useMemo(
    () => locations.filter((n) => n.level === "country").sort((a, b) => a.order - b.order),
    [locations],
  );

  const mapPolygons: MapPolygon[] = useMemo(
    () => isEditing ? [] : countries.filter((c) => c.geojson).map((c, i) => ({
      id: c.id,
      name: c.name,
      geojson: c.geojson!,
      color: PALETTE[i % PALETTE.length],
      highlighted: c.id === selectedId,
    })),
    [countries, selectedId, isEditing],
  );

  const handleSidebarClick = (id: string) => {
    onSelectCountry(id);
  };

  const handlePolygonClick = useCallback((id: string) => {
    onSelectCountry(id);
  }, [onSelectCountry]);

  return (
    <div className="flex-1 flex min-h-0 overflow-hidden">
      <div
        className="shrink-0 border-r border-border flex flex-col bg-card overflow-hidden"
        style={{ width: isEditing ? '70%' : '320px', transition: 'width 300ms ease' }}
      >
        {isEditing ? (
          <LocationEditPanel
            node={editingNode}
            level="country"
            onClose={() => setEditingId(null)}
            onSave={() => setEditingId(null)}
          />
        ) : (
          <>
            <SidebarHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-foreground">Locations</h2>
                <Button size="sm" className="h-7 gap-1 text-[11px]">
                  <Plus className="h-3 w-3" /> Add country
                </Button>
              </div>
            </SidebarHeader>
            <SidebarBody>
              <div className="space-y-0.5">
                {countries.map((c) => (
                  <div key={c.id} className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] transition-all ${
                    selectedId === c.id
                      ? "bg-primary/8 text-foreground font-medium ring-1 ring-primary/20"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}>
                    <button
                      className="flex flex-1 items-center gap-2.5 min-w-0"
                      onClick={() => handleSidebarClick(c.id)}
                    >
                      <span className="text-lg">{FLAGS[c.name] ?? "🏳️"}</span>
                      <span className="flex-1 text-left truncate">{c.name}</span>
                      <Badge variant="secondary" className="text-[9px] shrink-0">
                        {c.childrenCount} prov
                      </Badge>
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${c.active ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingId(c.id); }}
                      className="shrink-0 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Edit country"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button onClick={() => onSelectCountry(c.id)} className="shrink-0 text-muted-foreground hover:text-primary transition-colors" title="Enter country">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-4 px-2">
                Click a country to enter
              </p>
            </SidebarBody>
          </>
        )}
      </div>

      <div className="flex-1 min-w-0" style={{ transition: 'width 300ms ease' }}>
        <MapPanel
          polygons={mapPolygons}
          geometry={isEditing ? editingNode?.geojson ?? undefined : undefined}
          center={[40, -3]}
          zoom={4}
          focusedPolygonId={focusId}
          onPolygonClick={isEditing ? undefined : handlePolygonClick}
        />
      </div>
    </div>
  );
};

export default CountriesPage;
