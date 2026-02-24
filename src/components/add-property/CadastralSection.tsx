import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const demoOwners = [
  { id: "1", name: "Carlos García López" },
  { id: "2", name: "María Fernández Ruiz" },
  { id: "3", name: "Arman Yeghiazaryan" },
];

interface CadastralSectionProps {
  data: {
    cadastralRef: string;
    floors: string;
    registrationNumber: string;
    ownerId: string;
  };
  onChange: (data: any) => void;
}

const CadastralSection = ({ data, onChange }: CadastralSectionProps) => {
  const set = (field: string, value: any) => onChange({ ...data, [field]: value });
  const [owners, setOwners] = useState(demoOwners);
  const [newOwner, setNewOwner] = useState({ name: "", phone: "", email: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  const createOwner = () => {
    if (!newOwner.name.trim()) return;
    const id = String(Date.now());
    const owner = { id, name: newOwner.name };
    setOwners([...owners, owner]);
    onChange({ ...data, ownerId: id });
    setNewOwner({ name: "", phone: "", email: "" });
    setDialogOpen(false);
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
          <Label className="text-xs text-muted-foreground">Floors</Label>
          <Input value={data.floors} onChange={(e) => set("floors", e.target.value)} placeholder="4" type="number" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Registration Number</Label>
          <Input value={data.registrationNumber} onChange={(e) => set("registrationNumber", e.target.value)} placeholder="12345" className="font-mono" />
        </div>

        {/* Owner selector */}
        <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
          <Label className="text-xs text-muted-foreground">Owner</Label>
          <div className="flex gap-2">
            <Select value={data.ownerId} onValueChange={(v) => set("ownerId", v)}>
              <SelectTrigger className="flex-1"><SelectValue placeholder="Search owner..." /></SelectTrigger>
              <SelectContent>
                {owners.map((o) => (
                  <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <UserPlus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Quick Add Owner</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Full Name</Label>
                    <Input value={newOwner.name} onChange={(e) => setNewOwner({ ...newOwner, name: e.target.value })} placeholder="Full name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Phone</Label>
                    <Input value={newOwner.phone} onChange={(e) => setNewOwner({ ...newOwner, phone: e.target.value })} placeholder="+34 600 000 000" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <Input value={newOwner.email} onChange={(e) => setNewOwner({ ...newOwner, email: e.target.value })} placeholder="email@example.com" type="email" />
                  </div>
                  <Button onClick={createOwner} className="w-full gap-2">
                    <Plus className="h-4 w-4" /> Create & Assign
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CadastralSection;
