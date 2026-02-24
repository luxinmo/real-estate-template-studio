import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchableSelect, { type SearchableSelectOption } from "@/components/ui/searchable-select";

const initialOwners: SearchableSelectOption[] = [
  { id: "1", label: "Carlos García López" },
  { id: "2", label: "María Fernández Ruiz" },
  { id: "3", label: "Arman Yeghiazaryan" },
];

interface CadastralSectionProps {
  data: {
    cadastralRef: string;
    registrationNumber: string;
    ownerId: string;
  };
  onChange: (data: any) => void;
}

const CadastralSection = ({ data, onChange }: CadastralSectionProps) => {
  const set = (field: string, value: any) => onChange({ ...data, [field]: value });
  const [owners, setOwners] = useState(initialOwners);

  const handleCreateOwner = (values: Record<string, string>) => {
    const newOwner: SearchableSelectOption = {
      id: String(Date.now()),
      label: values.name,
    };
    setOwners((prev) => [...prev, newOwner]);
    return newOwner;
  };

  return (
    <section className="rounded-xl border border-border bg-card shadow-card p-6">
      <h2 className="text-base font-semibold text-foreground mb-5">Cadastral Reference</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Cadastral Reference</Label>
          <Input value={data.cadastralRef} onChange={(e) => set("cadastralRef", e.target.value)} placeholder="1234567AB1234C0001XY" className="font-mono text-xs" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Registration Number</Label>
          <Input value={data.registrationNumber} onChange={(e) => set("registrationNumber", e.target.value)} placeholder="12345" className="font-mono" />
        </div>

        {/* Owner selector */}
        <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
          <Label className="text-xs text-muted-foreground">Owner</Label>
          <SearchableSelect
            options={owners}
            value={data.ownerId}
            onValueChange={(v) => set("ownerId", v)}
            placeholder="Search owner…"
            
            createLabel="Create owner"
            createFields={[
              { key: "name", label: "Full Name", placeholder: "Full name" },
              { key: "phone", label: "Phone", placeholder: "+34 600 000 000" },
              { key: "email", label: "Email", placeholder: "email@example.com", type: "email" },
            ]}
            onCreate={handleCreateOwner}
          />
        </div>
      </div>
    </section>
  );
};

export default CadastralSection;
