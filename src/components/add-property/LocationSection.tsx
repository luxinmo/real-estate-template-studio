import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MapPin } from "lucide-react";

const branches = ["Main Office", "Altea Office", "Madrid Office", "Barcelona Office"];

interface LocationSectionProps {
  data: {
    country: string;
    province: string;
    town: string;
    zone: string;
    address: string;
    zipCode: string;
    number: string;
    staircase: string;
    floor: string;
    door: string;
    
    publishAddress: boolean;
    publishGeo: boolean;
    branch: string;
  };
  onChange: (data: any) => void;
}

const LocationSection = ({ data, onChange }: LocationSectionProps) => {
  const set = (field: string, value: any) => onChange({ ...data, [field]: value });

  return (
    <section className="rounded-xl border border-border bg-card shadow-card p-6">
      <h2 className="text-base font-semibold text-foreground mb-5">Location</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Country</Label>
          <Input value={data.country} onChange={(e) => set("country", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">District / Province</Label>
          <Input value={data.province} onChange={(e) => set("province", e.target.value)} placeholder="Alicante" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Town</Label>
          <Input value={data.town} onChange={(e) => set("town", e.target.value)} placeholder="Altea" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Zone</Label>
          <Input value={data.zone} onChange={(e) => set("zone", e.target.value)} placeholder="Centro" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs text-muted-foreground">Address</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={data.address} onChange={(e) => set("address", e.target.value)} placeholder="Start typing an address..." className="pl-10" />
          </div>
          <p className="text-[11px] text-muted-foreground">Google Maps autocomplete can be configured via API key</p>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Zip Code</Label>
          <Input value={data.zipCode} onChange={(e) => set("zipCode", e.target.value)} placeholder="03590" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Number</Label>
          <Input value={data.number} onChange={(e) => set("number", e.target.value)} placeholder="12" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Staircase</Label>
          <Input value={data.staircase} onChange={(e) => set("staircase", e.target.value)} placeholder="A" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Floor</Label>
          <Input value={data.floor} onChange={(e) => set("floor", e.target.value)} placeholder="4" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Door</Label>
          <Input value={data.door} onChange={(e) => set("door", e.target.value)} placeholder="B" />
        </div>
      </div>

      {/* Toggles & Branch */}
      <div className="mt-5 pt-5 border-t border-border flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <Switch checked={data.publishAddress} onCheckedChange={(v) => set("publishAddress", v)} />
          <span className="text-sm text-foreground">Publish address</span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <Switch checked={data.publishGeo} onCheckedChange={(v) => set("publishGeo", v)} />
          <span className="text-sm text-foreground">Publish geocoordinates</span>
        </label>
        <div className="ml-auto space-y-1.5 w-56">
          <Label className="text-xs text-muted-foreground">Branch / Office</Label>
          <Select value={data.branch} onValueChange={(v) => set("branch", v)}>
            <SelectTrigger><SelectValue placeholder="Select office" /></SelectTrigger>
            <SelectContent>
              {branches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
