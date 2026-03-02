import { useState, useRef, useEffect } from "react";
import { MapPin, X, ChevronDown } from "lucide-react";

interface LocationItem {
  id: string;
  name: string;
  path: string;
  type: string;
}

interface LocationSearchDropdownProps {
  selected: LocationItem[];
  onSelectedChange: (items: LocationItem[]) => void;
  className?: string;
}

const mockLocations: LocationItem[] = [
  { id: "es", name: "España", path: "España", type: "country" },
  { id: "es-alicante", name: "Alicante", path: "España > Alicante", type: "province" },
  { id: "es-malaga", name: "Málaga", path: "España > Málaga", type: "province" },
  { id: "es-madrid", name: "Madrid", path: "España > Madrid", type: "province" },
  { id: "es-barcelona", name: "Barcelona", path: "España > Barcelona", type: "province" },
  { id: "es-marbella", name: "Marbella", path: "España > Málaga > Marbella", type: "municipality" },
  { id: "es-altea", name: "Altea", path: "España > Alicante > Altea", type: "municipality" },
  { id: "es-benidorm", name: "Benidorm", path: "España > Alicante > Benidorm", type: "municipality" },
];

const LocationSearchDropdown = ({ selected, onSelectedChange, className }: LocationSearchDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = mockLocations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(search.toLowerCase()) &&
      !selected.some((s) => s.id === loc.id)
  );

  const add = (loc: LocationItem) => {
    onSelectedChange([...selected, loc]);
    setSearch("");
  };

  const remove = (id: string) => {
    onSelectedChange(selected.filter((s) => s.id !== id));
  };

  return (
    <div ref={ref} className={`relative ${className || ""}`}>
      <div
        className="flex items-center gap-2 border border-border rounded-full px-4 py-1.5 cursor-text bg-background"
        onClick={() => setOpen(true)}
      >
        <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        {selected.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {selected.map((s) => (
              <span
                key={s.id}
                className="flex items-center gap-1 bg-muted text-foreground text-[11px] px-2 py-0.5 rounded-full"
              >
                {s.name}
                <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={(e) => { e.stopPropagation(); remove(s.id); }} />
              </span>
            ))}
          </div>
        )}
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={selected.length === 0 ? "Search location…" : ""}
          className="flex-1 min-w-[80px] bg-transparent text-[12px] outline-none placeholder:text-muted-foreground"
        />
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-[260px] overflow-y-auto">
          {filtered.map((loc) => (
            <button
              key={loc.id}
              onClick={() => add(loc)}
              className="w-full text-left px-4 py-2.5 hover:bg-muted transition-colors"
            >
              <span className="text-[13px] font-medium text-foreground">{loc.name}</span>
              <span className="block text-[11px] text-muted-foreground">{loc.path}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearchDropdown;
