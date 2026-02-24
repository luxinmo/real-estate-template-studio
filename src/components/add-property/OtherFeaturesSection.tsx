import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const orientations = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
const insideExterior = ["Interior", "Exterior", "Both"];
const depositTypes = ["Euro", "Months"];
const condoPeriods = ["Month", "Year"];
const condoTypes = ["Residential", "Commercial", "Mixed"];

interface OtherFeaturesSectionProps {
  data: {
    condoExpenses: string;
    condoPeriod: string;
    condoType: string;
    deposit: string;
    depositType: string;
    orientation: string;
    insideExterior: string;
    buildingYear: string;
    youtubeUrl: string;
    vimeoUrl: string;
    url360: string;
    ibi: string;
    garbageTax: string;
    hasKey: boolean;
    keyRef: string;
    hasCartel: boolean;
    cartelRef: string;
  };
  onChange: (data: any) => void;
}

const OtherFeaturesSection = ({ data, onChange }: OtherFeaturesSectionProps) => {
  const set = (field: string, value: any) => onChange({ ...data, [field]: value });

  return (
    <section className="rounded-xl border border-border bg-card shadow-card p-6">
      <h2 className="text-base font-semibold text-foreground mb-5">Other Features</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
        {/* Condo expenses */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Condominium Expenses (€)</Label>
          <div className="flex gap-2">
            <Input value={data.condoExpenses} onChange={(e) => set("condoExpenses", e.target.value)} placeholder="80" type="number" className="flex-1" />
            <Select value={data.condoPeriod} onValueChange={(v) => set("condoPeriod", v)}>
              <SelectTrigger className="w-24"><SelectValue placeholder="Period" /></SelectTrigger>
              <SelectContent>
                {condoPeriods.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Condominium Type</Label>
          <Select value={data.condoType} onValueChange={(v) => set("condoType", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {condoTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Deposit */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Security Deposit</Label>
          <div className="flex gap-2">
            <Input value={data.deposit} onChange={(e) => set("deposit", e.target.value)} placeholder="2400" type="number" className="flex-1" />
            <Select value={data.depositType} onValueChange={(v) => set("depositType", v)}>
              <SelectTrigger className="w-24"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                {depositTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Orientation */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Orientation</Label>
          <div className="flex flex-wrap gap-1">
            {orientations.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => set("orientation", o)}
                className={`h-8 w-8 rounded-md text-xs font-medium transition-colors ${
                  data.orientation === o
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        {/* Inside/Exterior */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Inside / Exterior</Label>
          <Select value={data.insideExterior} onValueChange={(v) => set("insideExterior", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {insideExterior.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Building Year</Label>
          <Input value={data.buildingYear} onChange={(e) => set("buildingYear", e.target.value)} placeholder="2020" type="number" />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">IBI (€/year)</Label>
          <Input value={data.ibi} onChange={(e) => set("ibi", e.target.value)} placeholder="450" type="number" />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Garbage Tax (€/year)</Label>
          <Input value={data.garbageTax} onChange={(e) => set("garbageTax", e.target.value)} placeholder="120" type="number" />
        </div>
      </div>

      {/* URLs */}
      <div className="mt-5 pt-5 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">YouTube URL</Label>
          <Input value={data.youtubeUrl} onChange={(e) => set("youtubeUrl", e.target.value)} placeholder="https://youtube.com/watch?v=..." />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Vimeo URL</Label>
          <Input value={data.vimeoUrl} onChange={(e) => set("vimeoUrl", e.target.value)} placeholder="https://vimeo.com/..." />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">360° URL</Label>
          <Input value={data.url360} onChange={(e) => set("url360", e.target.value)} placeholder="https://..." />
        </div>
      </div>

      {/* Key & Cartel */}
      <div className="mt-5 pt-5 border-t border-border flex flex-wrap gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <Checkbox checked={data.hasKey} onCheckedChange={(v) => set("hasKey", !!v)} />
            <span className="text-sm font-medium text-foreground">KEY</span>
          </label>
          {data.hasKey && (
            <Input
              value={data.keyRef}
              onChange={(e) => set("keyRef", e.target.value)}
              placeholder="Key reference"
              className="w-48"
            />
          )}
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <Checkbox checked={data.hasCartel} onCheckedChange={(v) => set("hasCartel", !!v)} />
            <span className="text-sm font-medium text-foreground">CARTEL</span>
          </label>
          {data.hasCartel && (
            <Input
              value={data.cartelRef}
              onChange={(e) => set("cartelRef", e.target.value)}
              placeholder="Cartel reference"
              className="w-48"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default OtherFeaturesSection;
