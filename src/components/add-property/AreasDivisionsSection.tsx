import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface AreasDivisionsSectionProps {
  data: {
    builtArea: string;
    usefulArea: string;
    plot: string;
    bedrooms: number;
    bathrooms: number;
  };
  onChange: (data: any) => void;
}

const AreasDivisionsSection = ({ data, onChange }: AreasDivisionsSectionProps) => {
  const set = (field: string, value: any) => onChange({ ...data, [field]: value });

  const Counter = ({ label, value, field }: { label: string; value: number; field: string }) => (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => set(field, Math.max(0, value - 1))}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-lg font-semibold text-foreground w-8 text-center">{value}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => set(field, value + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <section className="rounded-xl border border-border bg-card shadow-card p-6">
      <h2 className="text-base font-semibold text-foreground mb-5">Areas & Divisions</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Built Area (m²)</Label>
          <Input value={data.builtArea} onChange={(e) => set("builtArea", e.target.value)} placeholder="95" type="number" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Useful Area (m²)</Label>
          <Input value={data.usefulArea} onChange={(e) => set("usefulArea", e.target.value)} placeholder="85" type="number" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Plot (m²)</Label>
          <Input value={data.plot} onChange={(e) => set("plot", e.target.value)} placeholder="800" type="number" />
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-border flex flex-wrap gap-8">
        <Counter label="Bedrooms" value={data.bedrooms} field="bedrooms" />
        <Counter label="Bathrooms" value={data.bathrooms} field="bathrooms" />
      </div>
    </section>
  );
};

export default AreasDivisionsSection;
