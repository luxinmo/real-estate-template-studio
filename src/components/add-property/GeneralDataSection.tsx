import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const propertyTypes: Record<string, string[]> = {
  Apartment: ["Flat", "Penthouse", "Duplex", "Studio", "Loft", "Ground floor"],
  House: ["Detached", "Semi-detached", "Terraced", "Villa", "Mansion", "Townhouse", "Country house"],
  Commercial: ["Office", "Retail", "Warehouse", "Industrial"],
  Land: ["Urban", "Rustic", "Industrial"],
};

const statuses = ["Active", "Inactive", "Draft"];
const availabilities = ["Available", "Reserved", "Sold", "Rented"];
const styles = ["Modern", "Classic", "Mediterranean", "Minimalist", "Rustic", "Colonial", "Contemporary", "Art Deco", "Industrial", "Scandinavian", "Traditional", "Brutalist"];
const durations = ["Permanent", "Seasonal", "Temporary"];

const operationTypes = ["For Sale", "For Rent", "Short Term"];

interface OperationData {
  type: string;
  price: string;
  reference: string;
  hidePrice: boolean;
}

interface GeneralDataSectionProps {
  data: {
    propertyType: string;
    subtype: string;
    reference: string;
    status: string;
    availability: string;
    style: string[];
    duration: string;
    operations: OperationData[];
  };
  onChange: (data: any) => void;
}

const GeneralDataSection = ({ data, onChange }: GeneralDataSectionProps) => {
  const subtypes = data.propertyType ? propertyTypes[data.propertyType] || [] : [];

  const toggleOperation = (type: string) => {
    const exists = data.operations.find((o) => o.type === type);
    if (exists) {
      onChange({ ...data, operations: data.operations.filter((o) => o.type !== type) });
    } else {
      onChange({
        ...data,
        operations: [...data.operations, { type, price: "", reference: "", hidePrice: false }],
      });
    }
  };

  const updateOperation = (type: string, field: string, value: any) => {
    onChange({
      ...data,
      operations: data.operations.map((o) =>
        o.type === type ? { ...o, [field]: value } : o
      ),
    });
  };

  return (
    <section className="rounded-xl border border-border bg-card shadow-card p-6">
      <h2 className="text-base font-semibold text-foreground mb-5">General Data</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
        {/* Property Type */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Property Type</Label>
          <Select value={data.propertyType} onValueChange={(v) => onChange({ ...data, propertyType: v, subtype: "" })}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              {Object.keys(propertyTypes).map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subtype */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Subtype</Label>
          <Select value={data.subtype} onValueChange={(v) => onChange({ ...data, subtype: v })} disabled={!subtypes.length}>
            <SelectTrigger><SelectValue placeholder="Select subtype" /></SelectTrigger>
            <SelectContent>
              {subtypes.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reference */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Internal Reference</Label>
          <Input
            value={data.reference}
            onChange={(e) => onChange({ ...data, reference: e.target.value })}
            placeholder="2025-0001"
            className="font-mono"
          />
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <Select value={data.status} onValueChange={(v) => onChange({ ...data, status: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Availability */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Availability</Label>
          <Select value={data.availability} onValueChange={(v) => onChange({ ...data, availability: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {availabilities.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Architectural Style - Multiselect */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Architectural Style</Label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className={data.style.length === 0 ? "text-muted-foreground" : "text-foreground"}>
                  {data.style.length === 0 ? "Select styles" : `${data.style.length} selected`}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="m6 9 6 6 6-6"/></svg>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="start">
              {styles.map((s) => (
                <label key={s} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer text-sm">
                  <Checkbox
                    checked={data.style.includes(s)}
                    onCheckedChange={(checked) => {
                      const next = checked
                        ? [...data.style, s]
                        : data.style.filter((v) => v !== s);
                      onChange({ ...data, style: next });
                    }}
                  />
                  {s}
                </label>
              ))}
            </PopoverContent>
          </Popover>
          {data.style.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {data.style.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 rounded-md bg-accent text-accent-foreground px-2 py-0.5 text-xs font-medium">
                  {s}
                  <button type="button" onClick={() => onChange({ ...data, style: data.style.filter((v) => v !== s) })} className="hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Duration */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Duration</Label>
          <Select value={data.duration} onValueChange={(v) => onChange({ ...data, duration: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {durations.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Operations */}
      <div className="mt-6 pt-5 border-t border-border">
        <Label className="text-xs text-muted-foreground mb-3 block">Operations</Label>
        <div className="flex flex-wrap gap-3 mb-4">
          {operationTypes.map((op) => {
            const active = data.operations.some((o) => o.type === op);
            return (
              <button
                key={op}
                type="button"
                onClick={() => toggleOperation(op)}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-accent"
                }`}
              >
                {op}
                {active && <X className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>

        {data.operations.length > 0 && (
          <div className="space-y-3">
            {data.operations.map((op) => (
              <div key={op.type} className="rounded-lg border border-border bg-background p-4">
                <p className="text-sm font-medium text-foreground mb-3">{op.type}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Price (€)</Label>
                    <Input
                      type="text"
                      value={op.price}
                      onChange={(e) => updateOperation(op.type, "price", e.target.value)}
                      placeholder={op.type === "For Rent" ? "1,200" : "285,000"}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Operation Reference</Label>
                    <Input
                      value={op.reference}
                      onChange={(e) => updateOperation(op.type, "reference", e.target.value)}
                      placeholder="OP-2025-001"
                      className="font-mono"
                    />
                  </div>
                  <div className="flex items-end pb-0.5">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <Switch
                        checked={op.hidePrice}
                        onCheckedChange={(v) => updateOperation(op.type, "hidePrice", v)}
                      />
                      <span className="text-sm text-muted-foreground">Hide price</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GeneralDataSection;
