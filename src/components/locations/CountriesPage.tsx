import { useState, useMemo, useCallback } from "react";
import { Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LocationNode } from "./types";
import { mockLocations } from "./mock-data";
import LocationSidebar, { SidebarHeader, SidebarBody } from "./shared/LocationSidebar";
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

  const countries = useMemo(
    () => locations.filter((n) => n.level === "country").sort((a, b) => a.order - b.order),
    [locations],
  );

  const mapPolygons: MapPolygon[] = useMemo(
    () => countries.filter((c) => c.geojson).map((c, i) => ({
      id: c.id,
      name: c.name,
      geojson: c.geojson!,
      color: PALETTE[i % PALETTE.length],
      highlighted: c.id === selectedId,
    })),
    [countries, selectedId],
  );

  const handleSidebarClick = (id: string) => {
    onSelectCountry(id);
  };

  const handlePolygonClick = useCallback((id: string) => {
    onSelectCountry(id);
  }, [onSelectCountry]);

  return (
    <div className="flex-1 flex min-h-0 overflow-hidden">
      <LocationSidebar>
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
              <button
                key={c.id}
                onClick={() => handleSidebarClick(c.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] transition-all ${
                  selectedId === c.id
                    ? "bg-primary/8 text-foreground font-medium ring-1 ring-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <span className="text-lg">{FLAGS[c.name] ?? "🏳️"}</span>
                <span className="flex-1 text-left truncate">{c.name}</span>
                <Badge variant="secondary" className="text-[9px] shrink-0">
                  {c.childrenCount} prov
                </Badge>
                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${c.active ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                {selectedId === c.id && (
                  <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0" />
                )}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-4 px-2">
            Click a country to enter
          </p>
        </SidebarBody>
      </LocationSidebar>

      <div className="flex-1 min-w-0">
        <MapPanel
          polygons={mapPolygons}
          center={[40, -3]}
          zoom={4}
          focusedPolygonId={focusId}
          onPolygonClick={handlePolygonClick}
        />
      </div>
    </div>
  );
};

export default CountriesPage;
