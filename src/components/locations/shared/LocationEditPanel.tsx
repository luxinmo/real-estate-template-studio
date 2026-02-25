import { useState, useEffect, ReactNode } from "react";
import { X, Check, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LocationNode, LocationLevel, LANGUAGES, LEVEL_COLORS, LEVEL_LABELS } from "../types";
import MultilingualContent from "./MultilingualContent";

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

interface LocationEditPanelProps {
  node?: LocationNode | null;
  level: LocationLevel;
  onClose: () => void;
  onSave: () => void;
  extraContent?: ReactNode;
}

const LocationEditPanel = ({ node, level, onClose, onSave, extraContent }: LocationEditPanelProps) => {
  const isNew = !node;
  const [name, setName] = useState(node?.name ?? "");
  const [safeName, setSafeName] = useState(node?.safeName ?? "");
  const [active, setActive] = useState(node?.active ?? true);
  const [order, setOrder] = useState(node?.order ?? 1);

  const [activeLang, setActiveLang] = useState("en");
  const [slugLang, setSlugLang] = useState("en");
  const [names, setNames] = useState<Record<string, string>>(node?.names ?? {});
  const [slugs, setSlugs] = useState<Record<string, string>>(node?.slugs ?? {});
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});

  const [seoOpen, setSeoOpen] = useState(false);
  const [seoLang, setSeoLang] = useState("en");
  const [seoTitles, setSeoTitles] = useState<Record<string, string>>(node?.seoTitle ?? {});
  const [seoDescs, setSeoDescs] = useState<Record<string, string>>(node?.seoDescription ?? {});

  useEffect(() => {
    if (isNew) setSafeName(toSafeName(name));
  }, [name, isNew]);

  const showMedia = level !== "country";

  return (
    <>
      {/* Header */}
      <div className="shrink-0 border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className={`text-[9px] uppercase tracking-wider font-semibold ${LEVEL_COLORS[level]}`}>
            {LEVEL_LABELS[level]}
          </Badge>
          <h2 className="text-[14px] font-semibold text-foreground">
            {isNew ? `New ${LEVEL_LABELS[level].toLowerCase()}` : node!.name}
          </h2>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Scrollable form */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-4 py-4 space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <Label className="text-[11px]">Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-[12px]" />
          </div>

          {/* Safe name */}
          <div className="space-y-1">
            <Label className="text-[11px]">Safe name</Label>
            <Input value={safeName} onChange={(e) => setSafeName(e.target.value)} className="h-8 font-mono text-[11px]" />
          </div>

          {/* Active + Order */}
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

          {/* Multilingual names */}
          <div className="space-y-1.5">
            <Label className="text-[11px]">Multilingual names</Label>
            <FlagSelector active={activeLang} onChange={setActiveLang} data={names} />
            <Input value={names[activeLang] ?? ""}
              onChange={(e) => setNames((p) => ({ ...p, [activeLang]: e.target.value }))}
              placeholder={LANGUAGES.find((l) => l.code === activeLang)?.label}
              className="h-7 text-[11px]" />
          </div>

          {/* Multilingual slugs */}
          <div className="space-y-1.5">
            <Label className="text-[11px]">Multilingual slugs</Label>
            <FlagSelector active={slugLang} onChange={setSlugLang} data={slugs} />
            <Input value={slugs[slugLang] ?? ""}
              onChange={(e) => setSlugs((p) => ({ ...p, [slugLang]: e.target.value }))}
              className="h-7 font-mono text-[10px]" />
          </div>

          <div className="border-t border-border" />

          {/* Descriptions */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold">Description</Label>
            <MultilingualContent values={descriptions} onChange={setDescriptions} minHeight={160} />
          </div>

          {/* Media */}
          {showMedia && (
            <>
              <div className="border-t border-border" />
              <div className="space-y-3">
                <Label className="text-[11px] font-semibold">Media</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[10px]">Banner image (16:9)</Label>
                    <div className="aspect-video rounded-lg border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary/40 transition-colors">
                      <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                      <span className="text-[9px] text-muted-foreground">Click to upload</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px]">Thumbnail (1:1)</Label>
                    <div className="aspect-square rounded-lg border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary/40 transition-colors">
                      <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                      <span className="text-[9px] text-muted-foreground">Click to upload</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SEO */}
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

          {/* Extra content (e.g. GeoJSON import for BoroughFormPage) */}
          {extraContent}
        </div>
      </ScrollArea>

      {/* Sticky save/cancel */}
      <div className="shrink-0 border-t border-border px-4 py-2.5 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 h-8 text-[11px]" onClick={onClose}>Cancel</Button>
        <Button size="sm" className="flex-1 h-8 text-[11px]" disabled={!name.trim()} onClick={onSave}>
          {isNew ? `Create ${LEVEL_LABELS[level].toLowerCase()}` : "Save changes"}
        </Button>
      </div>
    </>
  );
};

export default LocationEditPanel;
