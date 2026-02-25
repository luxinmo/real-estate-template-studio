import { useState, useEffect, useMemo, useCallback } from "react";
import { Check, Copy, Upload, Trash2, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LocationNode, LANGUAGES, LEVEL_COLORS } from "./types";
import { mockLocations } from "./mock-data";
import LocationSidebar, { SidebarHeader } from "./shared/LocationSidebar";
import LocationBreadcrumb from "./shared/LocationBreadcrumb";
import MultilingualContent from "./shared/MultilingualContent";
import MapPanel, { MapPolygon } from "./shared/MapPanel";

const toSafeName = (name: string) =>
  name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

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

  const [name, setName] = useState(borough?.name ?? "");
  const [safeName, setSafeName] = useState(borough?.safeName ?? "");
  const [active, setActive] = useState(borough?.active ?? true);
  const [order, setOrder] = useState(borough?.order ?? 1);
  const [geojson, setGeojson] = useState(borough?.geojson ?? "");
  const [activeLang, setActiveLang] = useState("en");
  const [slugLang, setSlugLang] = useState("en");
  const [names, setNames] = useState<Record<string, string>>(borough?.names ?? {});
  const [slugs, setSlugs] = useState<Record<string, string>>(borough?.slugs ?? {});
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [seoOpen, setSeoOpen] = useState(false);
  const [seoLang, setSeoLang] = useState("en");
  const [seoTitles, setSeoTitles] = useState<Record<string, string>>(borough?.seoTitle ?? {});
  const [seoDescs, setSeoDescs] = useState<Record<string, string>>(borough?.seoDescription ?? {});
  const [drawMode, setDrawMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");

  useEffect(() => {
    if (!isEdit) setSafeName(toSafeName(name));
  }, [name, isEdit]);

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

  return (
    <div className="flex-1 flex min-h-0 overflow-hidden">
      <LocationSidebar>
        <SidebarHeader>
          <LocationBreadcrumb segments={[
            { label: "Locations", onClick: onBackToCountries },
            { label: country?.name ?? "", onClick: onBackToProvinces },
            { label: province?.name ?? "", onClick: onBackToRegions },
            { label: region?.name ?? "", onClick: onBackToMunicipalities },
            { label: municipality?.name ?? "", onClick: onBackToMunicipalityDetail },
            { label: isEdit ? borough!.name : "New borough" },
          ]} />
          <div className="flex items-center gap-2 mt-1">
            <Badge className={`text-[9px] uppercase tracking-wider font-semibold ${LEVEL_COLORS.borough}`}>Borough</Badge>
            <Badge variant="outline" className="text-[9px] gap-0.5">
              <span className="text-muted-foreground">Municipality:</span> {municipality?.name}
            </Badge>
          </div>
        </SidebarHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="px-3 py-3 space-y-4">
            <div className="space-y-1">
              <Label className="text-[11px]">Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-[12px]" />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px]">Safe name</Label>
              <Input value={safeName} onChange={(e) => setSafeName(e.target.value)} className="h-8 font-mono text-[11px]" />
            </div>

            <div className="flex items-end gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={active} onCheckedChange={setActive} className="scale-[0.8]" />
                <Label className="text-[11px]">Active</Label>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">Order</Label>
                <Input type="number" min={0} value={order} onChange={(e) => setOrder(Number(e.target.value))} className="w-16 h-7 text-[11px]" />
              </div>
            </div>

            <div className="border-t border-border" />

            <div className="space-y-1.5">
              <Label className="text-[11px]">Multilingual names</Label>
              <FlagSelector active={activeLang} onChange={setActiveLang} data={names} />
              <Input value={names[activeLang] ?? ""}
                onChange={(e) => setNames((p) => ({ ...p, [activeLang]: e.target.value }))}
                placeholder={LANGUAGES.find((l) => l.code === activeLang)?.label}
                className="h-7 text-[11px]" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px]">Multilingual slugs</Label>
              <FlagSelector active={slugLang} onChange={setSlugLang} data={slugs} />
              <Input value={slugs[slugLang] ?? ""}
                onChange={(e) => setSlugs((p) => ({ ...p, [slugLang]: e.target.value }))}
                className="h-7 font-mono text-[10px]" />
            </div>

            <div className="border-t border-border" />

            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold">Borough description</Label>
              <MultilingualContent values={descriptions} onChange={setDescriptions} minHeight={160} />
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
          </div>
        </ScrollArea>

        <div className="shrink-0 border-t border-border px-3 py-2.5 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 h-8 text-[11px]" onClick={onBackToMunicipalityDetail}>Cancel</Button>
          <Button size="sm" className="flex-1 h-8 text-[11px]" disabled={!name.trim()} onClick={onBackToMunicipalityDetail}>
            {isEdit ? "Save changes" : "Create borough"}
          </Button>
        </div>
      </LocationSidebar>

      <div className="flex-1 min-w-0 relative">
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
          {!geojson && !drawMode && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/20 backdrop-blur-[1px] z-[999]">
              <p className="text-[13px] text-muted-foreground mb-3">No geometry defined</p>
              <Button size="sm" className="gap-1.5" onClick={() => setDrawMode(true)}>
                Draw borough polygon
              </Button>
            </div>
          )}

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
