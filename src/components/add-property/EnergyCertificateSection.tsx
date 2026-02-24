import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const energyGrades = ["A", "B", "C", "D", "E", "F", "G"];
const gradeColors: Record<string, string> = {
  A: "bg-emerald-500",
  B: "bg-emerald-400",
  C: "bg-lime-400",
  D: "bg-yellow-400",
  E: "bg-amber-400",
  F: "bg-orange-400",
  G: "bg-red-500",
};

interface EnergyCertificateSectionProps {
  data: {
    energyGrade: string;
    energyConsumption: string;
    co2Grade: string;
    co2Emissions: string;
  };
  onChange: (data: any) => void;
}

const EnergyCertificateSection = ({ data, onChange }: EnergyCertificateSectionProps) => {
  const set = (field: string, value: any) => onChange({ ...data, [field]: value });

  const GradeSelector = ({ label, value, field }: { label: string; value: string; field: string }) => (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex gap-1">
        {energyGrades.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => set(field, g)}
            className={`h-9 w-9 rounded-md text-sm font-bold transition-all ${
              value === g
                ? `${gradeColors[g]} text-white scale-110 shadow-md`
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <section className="rounded-xl border border-border bg-card shadow-card p-6">
      <h2 className="text-base font-semibold text-foreground mb-5">Energy Performance Certificate</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
        <GradeSelector label="Energy Certificate" value={data.energyGrade} field="energyGrade" />
        <GradeSelector label="CO₂ Certificate" value={data.co2Grade} field="co2Grade" />
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Energy Consumption (kWh/m²)</Label>
          <Input value={data.energyConsumption} onChange={(e) => set("energyConsumption", e.target.value)} placeholder="85" type="number" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">CO₂ Emissions (kgCO₂/m²)</Label>
          <Input value={data.co2Emissions} onChange={(e) => set("co2Emissions", e.target.value)} placeholder="18" type="number" />
        </div>
      </div>
    </section>
  );
};

export default EnergyCertificateSection;
