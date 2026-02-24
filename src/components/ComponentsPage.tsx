import { useState } from "react";
import ComponentBlock from "@/components/ComponentBlock";
import SearchableSelect, {
  type SearchableSelectOption,
} from "@/components/ui/searchable-select";
import { Label } from "@/components/ui/label";

const initialOwners: SearchableSelectOption[] = [
  { id: "1", label: "Carlos García López" },
  { id: "2", label: "María Fernández Ruiz" },
  { id: "3", label: "Arman Yeghiazaryan" },
  { id: "4", label: "Sophie Müller" },
];

const ComponentsPage = () => {
  const [owners, setOwners] = useState(initialOwners);
  const [selectedOwner, setSelectedOwner] = useState("");

  const handleCreateOwner = (values: Record<string, string>) => {
    const newOwner: SearchableSelectOption = {
      id: String(Date.now()),
      label: values.name,
    };
    setOwners((prev) => [...prev, newOwner]);
    return newOwner;
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 sm:px-8 pt-8 pb-6">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
          Components
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Reusable UI components for the CRM
        </p>
      </div>

      <div className="px-4 sm:px-8 pb-10 space-y-8 max-w-3xl">
        {/* SearchableSelect demo */}
        <ComponentBlock label="Component: Searchable Select with Create">
          <div className="p-6 space-y-5">
            <p className="text-sm text-muted-foreground">
              A searchable dropdown that filters options as you type. If no
              match is found, shows a "Create new" action with an inline form.
            </p>

            <div className="space-y-1.5 max-w-sm">
              <Label className="text-xs text-muted-foreground">Owner</Label>
              <SearchableSelect
                options={owners}
                value={selectedOwner}
                onValueChange={setSelectedOwner}
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

            {selectedOwner && (
              <p className="text-xs text-muted-foreground">
                Selected: <span className="font-medium text-foreground">{owners.find((o) => o.id === selectedOwner)?.label}</span>
              </p>
            )}
          </div>
        </ComponentBlock>
      </div>
    </div>
  );
};

export default ComponentsPage;
