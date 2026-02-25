import { useState, useMemo, useCallback } from "react";
import { Check, Copy, Upload, Trash2, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LocationNode, LEVEL_COLORS } from "./types";
import { mockLocations } from "./mock-data";
import LocationBreadcrumb from "./shared/LocationBreadcrumb";
import LocationEditPanel from "./shared/LocationEditPanel";
import MapPanel, { MapPolygon } from "./shared/MapPanel";

interface BoroughFormPageProps {
  countryId: string;
  provinceId: string;
  regionId: string;
  municipalityId: string;
  boroughId?: string | null;
  onBackToCountries: () => void;
  onBackToProvinces: () => void;
  onBackToRegions: () => void;
  onBackToMunicipalities: () => void;
  onBackToMunicipalityDetail: () => void;
}

const BoroughFormPage = ({
  countryId, provinceId, regionId, municipalityId, boroughId,
  onBackToCountries, onBackToProvinces, onBackToRegions, onBackToMunicipalities, onBackToMunicipalityDetail,
}: BoroughFormPageProps) => {
  const borough = boroughId ? mockLocations.find((n) => n.id === boroughId) : null;
  const country = mockLocations.find((n) => n.id === countryId);
  const province = mockLocations.find((n) => n.id === provinceId);
  const region = mockLocations.find((n) => n.id === regionId);
  const municipality = mockLocations.find((n) => n.id === municipalityId);
  const isEdit = !!borough;

  const siblingBoroughs = useMemo(
    () => mockLocations.filter((n) => n.parentId === municipalityId && n.level === "borough" && n.id !== boroughId),
    [municipalityId, boroughId],
  );

  const [geojson, setGeojson] = useState(borough?.geojson ?? "");
  const [drawMode, setDrawMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");

  const geoType = useMemo(() => {
    if (!geojson) return null;
    try { return JSON.parse(geojson).type as string; } catch { return null; }
  }, [geojson]);

  const handleDrawComplete = useCallback((geo: string) => { setGeojson(geo); setDrawMode(false); }, []);

  const handleCopy = () => { navigator.clipboard.writeText(geojson); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const handleImport = () => {
    try {
      const p = JSON.parse(importText);
      if (p.type === "Polygon" || p.type === "MultiPolygon") { setGeojson(importText); setImportOpen(false); setImportText(""); }
    } catch {}
  };

  const refPolygons: MapPolygon[] = useMemo(
    () => siblingBoroughs.filter((b) => b.geojson).map((b) => ({
      id: b.id, name: b.name, geojson: b.geojson!, color: "#9ca3af", highlighted: false,
    })),
    [siblingBoroughs],
  );

  // GeoJSON extra content for the edit panel
  const geoJsonContent = (
    <>
      <div className="border-t border-border" />
      <Collapsible open={importOpen} onOpenChange={setImportOpen}>
        <CollapsibleTrigger className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground">
          <span className={`transition-transform text-[10px] ${importOpen ? "rotate-90" : ""}`}>▶</span>
          Raw GeoJSON
          {geoType && <Badge className="text-[8px] bg-emerald-500/10 text-emerald-700 border-emerald-500/20 ml-1">{geoType}</Badge>}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          {geojson && (
            <pre className="rounded bg-muted p-2 text-[9px] font-mono text-muted-foreground overflow-auto max-h-28">
              {JSON.stringify(JSON.parse(geojson), null, 2)}
            </pre>
          )}
          <div className="flex gap-1.5">
            {geojson && (
              <Button size="sm" variant="outline" className="h-6 text-[9px] gap-0.5" onClick={handleCopy}>
                {copied ? <Check className="h-2.5 w-2.5" /> : <Copy className="h-2.5 w-2.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
            <Button size="sm" variant="outline" className="h-6 text-[9px] gap-0.5"
              onClick={() => setImportOpen(true)}>
              <Upload className="h-2.5 w-2.5" /> Import
            </Button>
          </div>
          <Textarea value={importText} onChange={(e) => setImportText(e.target.value)}
            rows={3} placeholder='{"type":"Polygon",...}' className="font-mono text-[9px]" />
          <Button size="sm" className="h-6 text-[9px]" onClick={handleImport} disabled={!importText.trim()}>
            Import GeoJSON
          </Button>
        </CollapsibleContent>
      </Collapsible>
    </>
  );

  return (
    <div className="flex-1 flex min-h-0 overflow-hidden">
      {/* 70% form panel */}
      <div
        className="shrink-0 border-r border-border flex flex-col bg-card overflow-hidden"
        style={{ width: '70%' }}
      >
        {/* Breadcrumb header above the edit panel */}
        <div className="shrink-0 border-b border-border px-4 py-2">
          <LocationBreadcrumb segments={[
            { label: "Locations", onClick: onBackToCountries },
            { label: country?.name ?? "", onClick: onBackToProvinces },
            { label: province?.name ?? "", onClick: onBackToRegions },
            { label: region?.name ?? "", onClick: onBackToMunicipalities },
            { label: municipality?.name ?? "", onClick: onBackToMunicipalityDetail },
            { label: isEdit ? borough!.name : "New borough" },
          ]} />
        </div>

        <LocationEditPanel
          node={borough}
          level="borough"
          onClose={onBackToMunicipalityDetail}
          onSave={onBackToMunicipalityDetail}
          extraContent={geoJsonContent}
        />
      </div>

      {/* 30% map panel */}
      <div className="flex-1 min-w-0">
        <MapPanel
          referencePolygons={refPolygons}
          geometry={geojson || undefined}
          boundaryGeojson={municipality?.geojson}
          center={[40, -3]}
          zoom={6}
          drawMode={drawMode}
          onDrawComplete={handleDrawComplete}
          onCancelDraw={() => setDrawMode(false)}
        >
          {geojson && !drawMode && (
            <div className="absolute top-14 left-3 z-[1000] flex gap-1.5">
              <Button size="sm" variant="secondary" className="h-7 text-[10px] shadow-md gap-1">
                <Pencil className="h-3 w-3" /> Edit
              </Button>
              <Button size="sm" variant="secondary" className="h-7 text-[10px] shadow-md gap-1"
                onClick={() => setGeojson("")}>
                <Trash2 className="h-3 w-3" /> Delete
              </Button>
            </div>
          )}

          {!geojson && !drawMode && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/20 backdrop-blur-[1px] z-[999]">
              <p className="text-[13px] text-muted-foreground mb-3">No geometry defined</p>
              <Button size="sm" className="gap-1.5" onClick={() => setDrawMode(true)}>
                Draw borough polygon
              </Button>
            </div>
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

export default BoroughFormPage;
