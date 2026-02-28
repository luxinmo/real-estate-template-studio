import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import {
  Download, Type, BoxSelect, Palette, RotateCcw, Eye, Layers,
  ChevronDown, ChevronRight, Minus, Plus
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CardPreview from "./CardPreview";
import LuxuryCardPreview from "./LuxuryCardPreview";

/* ─── Types ─── */
export interface CardDesignConfig {
  // Typography
  titleSize: number;
  priceSize: number;
  bodySize: number;
  labelSize: number;
  badgeSize: number;
  fontFamily: string;
  titleWeight: number;
  // Spacing
  cardPadding: number;
  cardGap: number;
  borderRadius: number;
  imageHeight: number;
  imageWidth: number;
  // Colors
  bgColor: string;
  textColor: string;
  mutedColor: string;
  accentColor: string;
  borderColor: string;
  // Layout
  layout: "horizontal" | "vertical";
  showDescription: boolean;
  showTags: boolean;
  showFooter: boolean;
  showRating: boolean;
  showPortals: boolean;
  showBadges: boolean;
}

const defaultCrmConfig: CardDesignConfig = {
  titleSize: 15,
  priceSize: 20,
  bodySize: 12,
  labelSize: 13,
  badgeSize: 10,
  fontFamily: "Inter",
  titleWeight: 600,
  cardPadding: 16,
  cardGap: 10,
  borderRadius: 12,
  imageHeight: 200,
  imageWidth: 240,
  bgColor: "#ffffff",
  textColor: "#0f172a",
  mutedColor: "#64748b",
  accentColor: "#2563eb",
  borderColor: "#e2e8f0",
  layout: "horizontal",
  showDescription: true,
  showTags: true,
  showFooter: true,
  showRating: true,
  showPortals: true,
  showBadges: true,
};

const defaultLuxuryConfig: CardDesignConfig = {
  titleSize: 18,
  priceSize: 26,
  bodySize: 13,
  labelSize: 13,
  badgeSize: 10,
  fontFamily: "Inter",
  titleWeight: 600,
  cardPadding: 20,
  cardGap: 10,
  borderRadius: 2,
  imageHeight: 280,
  imageWidth: 240,
  bgColor: "#fafafa",
  textColor: "#1a1a1a",
  mutedColor: "#64748b",
  accentColor: "#1a1a1a",
  borderColor: "#e5e5e5",
  layout: "horizontal",
  showDescription: true,
  showTags: true,
  showFooter: true,
  showRating: false,
  showPortals: false,
  showBadges: false,
};

/* ─── Collapsible Section ─── */
const Section = ({ title, icon: Icon, children, defaultOpen = true }: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 text-[13px] font-semibold text-foreground hover:bg-muted/50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          {title}
        </span>
        {open ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
};

/* ─── Control Row ─── */
const ControlRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-[12px] text-muted-foreground whitespace-nowrap">{label}</span>
    <div className="flex items-center gap-2 min-w-0">{children}</div>
  </div>
);

/* ─── Numeric Stepper ─── */
const NumericStepper = ({ value, onChange, min = 0, max = 100, suffix = "px" }: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}) => (
  <div className="flex items-center gap-1 bg-muted/50 rounded-md border border-border">
    <button onClick={() => onChange(Math.max(min, value - 1))} className="px-1.5 py-1 hover:bg-muted transition-colors rounded-l-md">
      <Minus className="h-3 w-3 text-muted-foreground" />
    </button>
    <span className="text-[12px] font-mono text-foreground min-w-[36px] text-center">{value}{suffix}</span>
    <button onClick={() => onChange(Math.min(max, value + 1))} className="px-1.5 py-1 hover:bg-muted transition-colors rounded-r-md">
      <Plus className="h-3 w-3 text-muted-foreground" />
    </button>
  </div>
);

/* ─── Color Input ─── */
const ColorInput = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div className="flex items-center gap-2">
    <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer p-0" />
    <span className="text-[11px] font-mono text-muted-foreground uppercase">{value}</span>
  </div>
);

/* ─── Main Page ─── */
const CardDesignerPage = () => {
  const [cardType, setCardType] = useState<"crm" | "luxury">("crm");
  const [config, setConfig] = useState<CardDesignConfig>({ ...defaultCrmConfig });
  const previewRef = useRef<HTMLDivElement>(null);

  const update = useCallback(<K extends keyof CardDesignConfig>(key: K, value: CardDesignConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const switchCardType = (type: "crm" | "luxury") => {
    setCardType(type);
    setConfig(type === "crm" ? { ...defaultCrmConfig } : { ...defaultLuxuryConfig });
  };

  const resetConfig = () => setConfig(cardType === "crm" ? { ...defaultCrmConfig } : { ...defaultLuxuryConfig });

  const handleDownload = async () => {
    if (!previewRef.current) return;
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `card-design-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Error generating image:", err);
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">Card Designer</h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">Diseña y personaliza la tarjeta de propiedad</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Card type tabs */}
          <div className="flex items-center bg-muted/50 rounded-lg border border-border p-0.5 mr-2">
            <button
              onClick={() => switchCardType("crm")}
              className={`text-[12px] px-3 py-1.5 rounded-md font-medium transition-all ${cardType === "crm" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              CRM Card
            </button>
            <button
              onClick={() => switchCardType("luxury")}
              className={`text-[12px] px-3 py-1.5 rounded-md font-medium transition-all ${cardType === "luxury" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Luxury Web
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={resetConfig} className="gap-1.5 text-[12px]">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
          <Button size="sm" onClick={handleDownload} className="gap-1.5 text-[12px]">
            <Download className="h-3.5 w-3.5" />
            Descargar PNG
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Preview Area */}
        <div className="flex-1 overflow-auto bg-muted/30 p-6 sm:p-10 flex items-start justify-center">
          <div ref={previewRef} className="w-full max-w-3xl">
            {cardType === "crm" ? (
              <CardPreview config={config} />
            ) : (
              <LuxuryCardPreview config={config} />
            )}
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-72 xl:w-80 border-l border-border bg-card overflow-y-auto shrink-0">
          {/* Layout */}
          <Section title="Layout" icon={Layers}>
            <ControlRow label="Orientación">
              <Select value={config.layout} onValueChange={(v) => update("layout", v as "horizontal" | "vertical")}>
                <SelectTrigger className="w-28 h-7 text-[12px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="horizontal">Horizontal</SelectItem>
                  <SelectItem value="vertical">Vertical</SelectItem>
                </SelectContent>
              </Select>
            </ControlRow>
            <ControlRow label="Imagen alto">
              <NumericStepper value={config.imageHeight} onChange={(v) => update("imageHeight", v)} min={100} max={400} />
            </ControlRow>
            {config.layout === "horizontal" && (
              <ControlRow label="Imagen ancho">
                <NumericStepper value={config.imageWidth} onChange={(v) => update("imageWidth", v)} min={120} max={400} />
              </ControlRow>
            )}
            <ControlRow label="Border radius">
              <NumericStepper value={config.borderRadius} onChange={(v) => update("borderRadius", v)} min={0} max={32} />
            </ControlRow>
          </Section>

          {/* Typography */}
          <Section title="Tipografía" icon={Type}>
            <ControlRow label="Fuente">
              <Select value={config.fontFamily} onValueChange={(v) => update("fontFamily", v)}>
                <SelectTrigger className="w-28 h-7 text-[12px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="system-ui">System UI</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Playfair Display">Playfair</SelectItem>
                </SelectContent>
              </Select>
            </ControlRow>
            <ControlRow label="Título">
              <NumericStepper value={config.titleSize} onChange={(v) => update("titleSize", v)} min={10} max={28} />
            </ControlRow>
            <ControlRow label="Peso título">
              <Select value={String(config.titleWeight)} onValueChange={(v) => update("titleWeight", Number(v))}>
                <SelectTrigger className="w-28 h-7 text-[12px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="400">Regular</SelectItem>
                  <SelectItem value="500">Medium</SelectItem>
                  <SelectItem value="600">Semibold</SelectItem>
                  <SelectItem value="700">Bold</SelectItem>
                </SelectContent>
              </Select>
            </ControlRow>
            <ControlRow label="Precio">
              <NumericStepper value={config.priceSize} onChange={(v) => update("priceSize", v)} min={12} max={36} />
            </ControlRow>
            <ControlRow label="Body">
              <NumericStepper value={config.bodySize} onChange={(v) => update("bodySize", v)} min={9} max={18} />
            </ControlRow>
            <ControlRow label="Labels">
              <NumericStepper value={config.labelSize} onChange={(v) => update("labelSize", v)} min={9} max={18} />
            </ControlRow>
            <ControlRow label="Badges">
              <NumericStepper value={config.badgeSize} onChange={(v) => update("badgeSize", v)} min={8} max={14} />
            </ControlRow>
          </Section>

          {/* Spacing */}
          <Section title="Márgenes" icon={BoxSelect}>
            <ControlRow label="Padding interno">
              <NumericStepper value={config.cardPadding} onChange={(v) => update("cardPadding", v)} min={0} max={40} />
            </ControlRow>
            <ControlRow label="Gap elementos">
              <NumericStepper value={config.cardGap} onChange={(v) => update("cardGap", v)} min={0} max={24} />
            </ControlRow>
          </Section>

          {/* Colors */}
          <Section title="Colores" icon={Palette}>
            <ControlRow label="Fondo">
              <ColorInput value={config.bgColor} onChange={(v) => update("bgColor", v)} />
            </ControlRow>
            <ControlRow label="Texto">
              <ColorInput value={config.textColor} onChange={(v) => update("textColor", v)} />
            </ControlRow>
            <ControlRow label="Texto secundario">
              <ColorInput value={config.mutedColor} onChange={(v) => update("mutedColor", v)} />
            </ControlRow>
            <ControlRow label="Acento">
              <ColorInput value={config.accentColor} onChange={(v) => update("accentColor", v)} />
            </ControlRow>
            <ControlRow label="Borde">
              <ColorInput value={config.borderColor} onChange={(v) => update("borderColor", v)} />
            </ControlRow>
          </Section>

          {/* Visibility */}
          <Section title="Visibilidad" icon={Eye}>
            <ControlRow label="Descripción">
              <Switch checked={config.showDescription} onCheckedChange={(v) => update("showDescription", v)} className="scale-75" />
            </ControlRow>
            <ControlRow label="Etiquetas">
              <Switch checked={config.showTags} onCheckedChange={(v) => update("showTags", v)} className="scale-75" />
            </ControlRow>
            <ControlRow label="Footer">
              <Switch checked={config.showFooter} onCheckedChange={(v) => update("showFooter", v)} className="scale-75" />
            </ControlRow>
            <ControlRow label="Rating">
              <Switch checked={config.showRating} onCheckedChange={(v) => update("showRating", v)} className="scale-75" />
            </ControlRow>
            <ControlRow label="Portales">
              <Switch checked={config.showPortals} onCheckedChange={(v) => update("showPortals", v)} className="scale-75" />
            </ControlRow>
            <ControlRow label="Badges (MLS, etc)">
              <Switch checked={config.showBadges} onCheckedChange={(v) => update("showBadges", v)} className="scale-75" />
            </ControlRow>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default CardDesignerPage;
