import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LocationNode } from "./types";
import { mockLocations } from "./mock-data";
import LocationBreadcrumb from "./shared/LocationBreadcrumb";

interface CountriesPageProps {
  onSelectCountry: (countryId: string) => void;
  onAddCountry: () => void;
  onEditCountry: (location: LocationNode) => void;
}

const FLAGS: Record<string, string> = { "España": "🇪🇸", "France": "🇫🇷", "Portugal": "🇵🇹", "Italy": "🇮🇹", "Germany": "🇩🇪" };

const CountriesPage = ({ onSelectCountry, onAddCountry, onEditCountry }: CountriesPageProps) => {
  const [locations, setLocations] = useState<LocationNode[]>(mockLocations);
  const countries = locations.filter((n) => n.level === "country").sort((a, b) => a.order - b.order);

  const handleToggleActive = (id: string) => {
    setLocations((prev) => prev.map((n) => (n.id === id ? { ...n, active: !n.active } : n)));
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 sm:px-6 h-14 shrink-0">
        <LocationBreadcrumb segments={[{ label: "Locations" }]} />
        <Button size="sm" className="h-8 gap-1.5 text-[12px]" onClick={onAddCountry}>
          <Plus className="h-3.5 w-3.5" /> Add country
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold w-12"></TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Name</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-center">Provinces</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-center">Active</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {countries.map((country) => (
                <TableRow
                  key={country.id}
                  className="cursor-pointer"
                  onClick={() => onSelectCountry(country.id)}
                >
                  <TableCell className="text-xl text-center">
                    {FLAGS[country.name] ?? "🏳️"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${country.active ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                      <span className="text-[13px] font-medium text-foreground">{country.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="text-[10px]">{country.childrenCount}</Badge>
                  </TableCell>
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <Switch checked={country.active} onCheckedChange={() => handleToggleActive(country.id)} className="scale-[0.85]" />
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEditCountry(country)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {countries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-sm text-muted-foreground">
                    No countries yet. Click "Add country" to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CountriesPage;
