import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, X, Check, Copy, Upload, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LocationNode, LocationLevel, LEVEL_LABELS, LEVEL_COLORS, LANGUAGES } from "./types";
import LocationMap from "./LocationMap";

interface LocationDetailPageProps {
  location?: LocationNode | null;
  parentName?: string;
  parentLevel?: LocationLevel | null;
  level: LocationLevel;
  onBack: () => void;
  onSave?: (data: Partial<LocationNode>) => void;
}

const toSafeName = (name: string) =>
  name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const LocationDetailPage = ({ location, parentName, parentLevel, level, onBack, onSave }: LocationDetailPageProps) => {
  const isEdit = !!location;

  const [name, setName] = useState(location?.name ?? "");
  const [safeName, setSafeName] = useState(location?.safeName ?? "");
  const [active, setActive] = useState(location?.active ?? true);
  const [order, setOrder] = useState(location?.order ?? 1);
  const [geojson, setGeojson] = useState(location?.geojson ?? "");
  const [description, setDescription] = useState(location?.description ?? "");
  const [activeLang, setActiveLang] = useState("en");
  const [activeSlugLang, setActiveSlugLang] = useState("en");
  const [activeSeoLang, setActiveSeoLang] = useState("en");
  const [names, setNames] = useState<Record<string, string>>(location?.names ?? {});
  const [slugs, setSlugs] = useState<Record<string, string>>(location?.slugs ?? {});
  const [seoTitles, setSeoTitles] = useState<Record<string, string>>(location?.seoTitle ?? {});
  const [seoDescriptions, setSeoDescriptions] = useState<Record<string, string>>(location?.seoDescription ?? {});
  const [seoOpen, setSeoOpen] = useState(false);
  const [rawGeoOpen, setRawGeoOpen] = useState(false);
  const [importGeoOpen, setImportGeoOpen] = useState(false);
  const [importGeoText, setImportGeoText] = useState("");
  const [editingMap, setEditingMap] = useState(false);
  const [drawingOnMap, setDrawingOnMap] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isEdit) setSafeName(toSafeName(name));
  }, [name, isEdit]);

  const geoType = useMemo(() => {
    if (!geojson) return null;
    try { return JSON.parse(geojson).type as string; } catch { return null; }
  }, [geojson]);

  const handleSave = () => {
    onSave?.({ name, safeName, active, order, geojson: geojson || null, names, slugs, description, seoTitle: seoTitles, seoDescription: seoDescriptions });
    onBack();
  };

  const handleCopyGeo = () => {
    navigator.clipboard.writeText(geojson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportGeo = () => {
    try {
      const parsed = JSON.parse(importGeoText);
      if (parsed.type === "Polygon" || parsed.type === "MultiPolygon") {
        setGeojson(importGeoText);
        setImportGeoOpen(false);
        setImportGeoText("");
      }
    } catch {}
  };

  const handleDrawComplete = (geo: string) => {
    setGeojson(geo);
    setDrawingOnMap(false);
  };

  const FlagSelector = ({ active: activeLangCode, onChange, data }: {
    active: string; onChange: (code: string) => void; data: Record<string, string>;
  }) => (
    <div className="flex flex-wrap gap-1.5">
      {LANGUAGES.map((lang) => (
        <button key={lang.code} type="button" onClick={() => onChange(lang.code)}
          className={`relative flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-all ${
            activeLangCode === lang.code
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

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5">
        {/* Back */}
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to locations
        </button>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-6">
          {/* LEFT — Form */}
          <div className="rounded-xl border border-border bg-card shadow-card p-5 sm:p-7 space-y-6">
            {/* Level badge + title */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className={`text-[10px] uppercase tracking-wider font-semibold ${LEVEL_COLORS[level]}`}>
                  {LEVEL_LABELS[level]}
                </Badge>
                {parentName && parentLevel && (
                  <Badge variant="outline" className="text-[10px] gap-1">
                    <span className="text-muted-foreground">{LEVEL_LABELS[parentLevel]}:</span> {parentName}
                  </Badge>
                )}
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                {isEdit ? `Edit ${LEVEL_LABELS[level]}` : `New ${LEVEL_LABELS[level]}`}
              </h2>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-[12px]">Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={`${LEVEL_LABELS[level]} name`} />
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
                onChange={(e) => setNames((prev) => ({ ...prev, [activeLang]: e.target.value }))}
                placeholder={`Name in ${LANGUAGES.find((l) => l.code === activeLang)?.label ?? activeLang}`}
                className="text-[13px]" />
            </div>

            {/* Multilingual slugs */}
            <div className="space-y-2">
              <Label className="text-[12px]">Multilingual slugs</Label>
              <FlagSelector active={activeSlugLang} onChange={setActiveSlugLang} data={slugs} />
              <Input value={slugs[activeSlugLang] ?? ""}
                onChange={(e) => setSlugs((prev) => ({ ...prev, [activeSlugLang]: e.target.value }))}
                placeholder={`Slug in ${LANGUAGES.find((l) => l.code === activeSlugLang)?.label ?? activeSlugLang}`}
                className="font-mono text-xs" />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-[12px]">Description / Notes</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)}
                rows={4} placeholder="Content for the location page..." className="text-[13px]" />
            </div>

            {/* SEO section */}
            <Collapsible open={seoOpen} onOpenChange={setSeoOpen}>
              <CollapsibleTrigger className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                <span className={`transition-transform ${seoOpen ? "rotate-90" : ""}`}>▶</span>
                SEO Settings
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-4 pl-4 border-l-2 border-muted">
                <div className="space-y-2">
                  <Label className="text-[12px]">Meta title</Label>
                  <FlagSelector active={activeSeoLang} onChange={setActiveSeoLang} data={seoTitles} />
                  <Input value={seoTitles[activeSeoLang] ?? ""}
                    onChange={(e) => setSeoTitles((prev) => ({ ...prev, [activeSeoLang]: e.target.value }))}
                    placeholder="Meta title" className="text-[13px]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px]">Meta description</Label>
                  <Textarea value={seoDescriptions[activeSeoLang] ?? ""}
                    onChange={(e) => setSeoDescriptions((prev) => ({ ...prev, [activeSeoLang]: e.target.value }))}
                    rows={3} placeholder="Meta description" className="text-[13px]" />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Save / Cancel */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" onClick={onBack}>Cancel</Button>
              <Button onClick={handleSave} disabled={!name.trim()}>
                {isEdit ? "Save changes" : `Create ${LEVEL_LABELS[level].toLowerCase()}`}
              </Button>
            </div>
          </div>

          {/* RIGHT — Map */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card shadow-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-foreground">Geometry</h3>
                {geoType && (
                  <Badge className="text-[10px] bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                    {geoType}
                  </Badge>
                )}
              </div>

              {/* Map */}
              <div className="relative rounded-xl overflow-hidden border border-border">
                <LocationMap
                  geometry={geojson || undefined}
                  center={[40, -3]}
                  zoom={6}
                  height="400px"
                  drawMode={drawingOnMap}
                  onDrawComplete={handleDrawComplete}
                  onCancelDraw={() => setDrawingOnMap(false)}
                />

                {/* Map toolbar */}
                {geojson && !drawingOnMap && (
                  <div className="absolute top-3 right-3 z-[1000] flex gap-1.5">
                    <Button size="sm" variant="secondary" className="h-7 text-[11px] shadow-md gap-1"
                      onClick={() => { setGeojson(""); }}>
                      <Trash2 className="h-3 w-3" /> Delete
                    </Button>
                  </div>
                )}

                {/* No geometry overlay */}
                {!geojson && !drawingOnMap && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-[1px] z-[999]">
                    <p className="text-[12px] text-muted-foreground">Click "Draw polygon" to add geometry</p>
                  </div>
                )}
              </div>

              {/* Draw / actions */}
              {!geojson && !drawingOnMap && (
                <button onClick={() => setDrawingOnMap(true)}
                  className="w-full rounded-lg border-2 border-dashed border-border py-3 text-[12px] text-muted-foreground font-medium hover:border-primary hover:text-primary transition-colors">
                  Draw polygon
                </button>
              )}

              {drawingOnMap && (
                <div className="flex items-center justify-between bg-primary/5 rounded-lg px-3 py-2">
                  <p className="text-[11px] text-muted-foreground">Click to add points, double-click to finish</p>
                  <Button size="sm" variant="ghost" className="h-6 text-[11px]"
                    onClick={() => setDrawingOnMap(false)}>Cancel</Button>
                </div>
              )}
            </div>

            {/* Raw GeoJSON */}
            <Collapsible open={rawGeoOpen} onOpenChange={setRawGeoOpen}>
              <div className="rounded-xl border border-border bg-card shadow-card">
                <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3">
                  <span className="text-[12px] font-medium text-muted-foreground">Raw GeoJSON</span>
                  <span className={`text-[10px] transition-transform ${rawGeoOpen ? "rotate-90" : ""}`}>▶</span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-2">
                    {geojson ? (
                      <pre className="rounded-lg bg-muted p-3 text-[11px] font-mono text-muted-foreground overflow-auto max-h-48">
                        {JSON.stringify(JSON.parse(geojson), null, 2)}
                      </pre>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">No geometry defined</p>
                    )}
                    <div className="flex gap-2">
                      {geojson && (
                        <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1" onClick={handleCopyGeo}>
                          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          {copied ? "Copied" : "Copy"}
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1"
                        onClick={() => setImportGeoOpen(!importGeoOpen)}>
                        <Upload className="h-3 w-3" /> Import
                      </Button>
                    </div>
                    {importGeoOpen && (
                      <div className="space-y-2 pt-2">
                        <Textarea value={importGeoText} onChange={(e) => setImportGeoText(e.target.value)}
                          rows={5} placeholder='{"type":"Polygon","coordinates":[...]}'
                          className="font-mono text-[11px] resize-none" />
                        <div className="flex gap-2">
                          <Button size="sm" className="h-7 text-[11px]" onClick={handleImportGeo}
                            disabled={!importGeoText.trim()}>Import</Button>
                          <Button size="sm" variant="ghost" className="h-7 text-[11px]"
                            onClick={() => { setImportGeoOpen(false); setImportGeoText(""); }}>Cancel</Button>
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
    </div>
  );
};

export default LocationDetailPage;
