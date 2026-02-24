import { useState, useEffect, useMemo, useCallback } from "react";
import { Check, Copy, Upload, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LocationNode, LANGUAGES, LEVEL_COLORS } from "./types";
import { mockLocations } from "./mock-data";
import LocationMap from "./LocationMap";
import LocationBreadcrumb from "./shared/LocationBreadcrumb";
import MultilingualEditor from "./shared/MultilingualEditor";

const toSafeName = (name: string) =>
  name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

interface ZoneFormPageProps {
  countryId: string;
  provinceId: string;
  townId: string;
  zoneId?: string | null;
  onBackToCountries: () => void;
  onBackToProvinces: () => void;
  onBackToTowns: () => void;
  onBackToTownDetail: () => void;
  onSave?: () => void;
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

const ZoneFormPage = ({
  countryId, provinceId, townId, zoneId,
  onBackToCountries, onBackToProvinces, onBackToTowns, onBackToTownDetail, onSave,
}: ZoneFormPageProps) => {
  const zone = zoneId ? mockLocations.find((n) => n.id === zoneId) : null;
  const country = mockLocations.find((n) => n.id === countryId);
  const province = mockLocations.find((n) => n.id === provinceId);
  const town = mockLocations.find((n) => n.id === townId);
  const isEdit = !!zone;

  // Other zones of same town (for reference on map)
  const siblingZones = useMemo(
    () => mockLocations.filter((n) => n.parentId === townId && n.level === "zone" && n.id !== zoneId),
    [townId, zoneId],
  );

  const [name, setName] = useState(zone?.name ?? "");
  const [safeName, setSafeName] = useState(zone?.safeName ?? "");
  const [active, setActive] = useState(zone?.active ?? true);
  const [order, setOrder] = useState(zone?.order ?? 1);
  const [geojson, setGeojson] = useState(zone?.geojson ?? "");
  const [activeLang, setActiveLang] = useState("en");
  const [activeSlugLang, setActiveSlugLang] = useState("en");
  const [names, setNames] = useState<Record<string, string>>(zone?.names ?? {});
  const [slugs, setSlugs] = useState<Record<string, string>>(zone?.slugs ?? {});
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [seoOpen, setSeoOpen] = useState(false);
  const [activeSeoLang, setActiveSeoLang] = useState("en");
  const [seoTitles, setSeoTitles] = useState<Record<string, string>>(zone?.seoTitle ?? {});
  const [seoDescs, setSeoDescs] = useState<Record<string, string>>(zone?.seoDescription ?? {});
  const [drawMode, setDrawMode] = useState(false);
  const [rawGeoOpen, setRawGeoOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isEdit) setSafeName(toSafeName(name));
  }, [name, isEdit]);

  const geoType = useMemo(() => {
    if (!geojson) return null;
    try { return JSON.parse(geojson).type as string; } catch { return null; }
  }, [geojson]);

  const handleDrawComplete = useCallback((geo: string) => {
    setGeojson(geo);
    setDrawMode(false);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(geojson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText);
      if (parsed.type === "Polygon" || parsed.type === "MultiPolygon") {
        setGeojson(importText);
        setImportOpen(false);
        setImportText("");
      }
    } catch {}
  };

  // Reference polygons for siblings
  const refPolygons = useMemo(
    () => siblingZones.filter((z) => z.geojson).map((z) => ({
      id: z.id,
      name: z.name,
      geojson: z.geojson!,
      color: "#9ca3af",
      highlighted: false,
    })),
    [siblingZones],
  );

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 sm:px-6 h-14 shrink-0">
        <LocationBreadcrumb
          segments={[
            { label: "Locations", onClick: onBackToCountries },
            { label: country?.name ?? "", onClick: onBackToProvinces },
            { label: province?.name ?? "", onClick: onBackToTowns },
            { label: town?.name ?? "Town", onClick: onBackToTownDetail },
            { label: isEdit ? zone.name : "New zone" },
          ]}
        />
      </div>

      {/* 50/50 split */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* LEFT — Form */}
        <div className="border-r border-border overflow-auto">
          <div className="p-4 sm:p-6 space-y-5">
            {/* Level badge */}
            <div className="flex items-center gap-2">
              <Badge className={`text-[10px] uppercase tracking-wider font-semibold ${LEVEL_COLORS.zone}`}>
                Zone
              </Badge>
              <Badge variant="outline" className="text-[10px] gap-1">
                <span className="text-muted-foreground">Town:</span> {town?.name}
              </Badge>
            </div>

            <h2 className="text-lg font-semibold text-foreground">
              {isEdit ? `Edit ${zone.name}` : "New Zone"}
            </h2>

            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-[12px]">Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Zone name" />
            </div>

            {/* Safe name */}
            <div className="space-y-1.5">
              <Label className="text-[12px]">Safe name</Label>
              <Input value={safeName} onChange={(e) => setSafeName(e.target.value)}
                className="font-mono text-xs" placeholder="auto-generated" />
            </div>

            {/* Active + Order */}
            <div className="flex items-end gap-6">
              <div className="flex items-center gap-3">
                <Switch checked={active} onCheckedChange={setActive} />
                <Label className="text-[12px]">Active</Label>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px]">Order</Label>
                <Input type="number" min={0} value={order}
                  onChange={(e) => setOrder(Number(e.target.value))} className="w-24 text-[13px]" />
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Multilingual names */}
            <div className="space-y-2">
              <Label className="text-[12px]">Multilingual names</Label>
              <FlagSelector active={activeLang} onChange={setActiveLang} data={names} />
              <Input value={names[activeLang] ?? ""}
                onChange={(e) => setNames((p) => ({ ...p, [activeLang]: e.target.value }))}
                placeholder={`Name in ${LANGUAGES.find((l) => l.code === activeLang)?.label ?? activeLang}`}
                className="text-[13px]" />
            </div>

            {/* Multilingual slugs */}
            <div className="space-y-2">
              <Label className="text-[12px]">Multilingual slugs</Label>
              <FlagSelector active={activeSlugLang} onChange={setActiveSlugLang} data={slugs} />
              <Input value={slugs[activeSlugLang] ?? ""}
                onChange={(e) => setSlugs((p) => ({ ...p, [activeSlugLang]: e.target.value }))}
                placeholder={`Slug in ${LANGUAGES.find((l) => l.code === activeSlugLang)?.label ?? activeSlugLang}`}
                className="font-mono text-xs" />
            </div>

            <div className="border-t border-border" />

            {/* Rich text description */}
            <div className="space-y-2">
              <Label className="text-[12px] font-semibold">Zone description</Label>
              <MultilingualEditor values={descriptions} onChange={setDescriptions} minHeight={200} />
            </div>

            {/* SEO */}
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

            {/* Save / Cancel */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" onClick={onBackToTownDetail}>Cancel</Button>
              <Button onClick={() => { onSave?.(); onBackToTownDetail(); }} disabled={!name.trim()}>
                {isEdit ? "Save changes" : "Create zone"}
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT — Map */}
        <div className="relative min-h-[600px] flex flex-col">
          <div className="flex-1 relative">
            <LocationMap
              polygons={refPolygons}
              geometry={geojson || undefined}
              boundaryGeojson={town?.geojson}
              center={[40, -3]}
              zoom={6}
              height="100%"
              drawMode={drawMode}
              onDrawComplete={handleDrawComplete}
              onCancelDraw={() => setDrawMode(false)}
            />

            {/* Map toolbar */}
            {geojson && !drawMode && (
              <div className="absolute top-14 right-3 z-[1000] flex gap-1.5">
                <Button size="sm" variant="secondary" className="h-7 text-[11px] shadow-md gap-1"
                  onClick={() => { setGeojson(""); }}>
                  <Trash2 className="h-3 w-3" /> Delete
                </Button>
              </div>
            )}

            {!geojson && !drawMode && (
              <div className="absolute bottom-4 right-4 z-[1000]">
                <Button size="sm" className="gap-1.5 shadow-lg" onClick={() => setDrawMode(true)}>
                  Draw zone
                </Button>
              </div>
            )}

            {drawMode && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-card border border-border rounded-lg px-4 py-2 shadow-lg flex items-center gap-3">
                <p className="text-[11px] text-muted-foreground">Click points, double-click to finish</p>
                <Button size="sm" variant="ghost" className="h-6 text-[11px]" onClick={() => setDrawMode(false)}>Cancel</Button>
              </div>
            )}
          </div>

          {/* Raw GeoJSON below map */}
          <Collapsible open={rawGeoOpen} onOpenChange={setRawGeoOpen}>
            <div className="border-t border-border">
              <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2.5">
                <span className="text-[11px] font-medium text-muted-foreground">Raw GeoJSON</span>
                <div className="flex items-center gap-2">
                  {geoType && <Badge className="text-[9px] bg-emerald-500/10 text-emerald-700 border-emerald-500/20">{geoType}</Badge>}
                  <span className={`text-[10px] transition-transform ${rawGeoOpen ? "rotate-90" : ""}`}>▶</span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-3 space-y-2">
                  {geojson ? (
                    <pre className="rounded-lg bg-muted p-3 text-[10px] font-mono text-muted-foreground overflow-auto max-h-36">
                      {JSON.stringify(JSON.parse(geojson), null, 2)}
                    </pre>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">No geometry</p>
                  )}
                  <div className="flex gap-2">
                    {geojson && (
                      <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1" onClick={handleCopy}>
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? "Copied" : "Copy"}
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1"
                      onClick={() => setImportOpen(!importOpen)}>
                      <Upload className="h-3 w-3" /> Import
                    </Button>
                  </div>
                  {importOpen && (
                    <div className="space-y-2 pt-1">
                      <Textarea value={importText} onChange={(e) => setImportText(e.target.value)}
                        rows={4} placeholder='{"type":"Polygon","coordinates":[...]}'
                        className="font-mono text-[10px] resize-none" />
                      <div className="flex gap-2">
                        <Button size="sm" className="h-6 text-[10px]" onClick={handleImport}>Import</Button>
                        <Button size="sm" variant="ghost" className="h-6 text-[10px]"
                          onClick={() => { setImportOpen(false); setImportText(""); }}>Cancel</Button>
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};

export default ZoneFormPage;
