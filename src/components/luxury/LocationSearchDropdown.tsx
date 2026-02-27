import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { MapPin, Navigation, Search, X } from "lucide-react";
import { mockLocations } from "@/components/locations/mock-data";

const LEVEL_DISPLAY: Record<string, string> = {
  country: "Country",
  province: "Province",
  region: "Region",
  municipality: "City",
  borough: "Locality",
};

type LocationItem = { id: string; name: string; path: string; type: string };

/** Build a breadcrumb path for a location */
const buildPath = (locationId: string): string => {
  const parts: string[] = [];
  let current = mockLocations.find((l) => l.id === locationId);
  while (current) {
    parts.unshift(current.name);
    current = current.parentId ? mockLocations.find((l) => l.id === current!.parentId) : undefined;
  }
  return parts.join(", ");
};

interface LocationSearchDropdownProps {
  selected: LocationItem[];
  onSelectedChange: (items: LocationItem[]) => void;
  className?: string;
}

const RECENT_KEY = "luxury_recent_searches";

const LocationSearchDropdown = ({ selected, onSelectedChange, className = "" }: LocationSearchDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [recentSearches, setRecentSearches] = useState<LocationItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return mockLocations
      .filter((loc) => {
        if (!loc.active) return false;
        if (selected.some((s) => s.id === loc.id)) return false;
        if (loc.name.toLowerCase().includes(q)) return true;
        return Object.values(loc.names).some((n) => n.toLowerCase().includes(q));
      })
      .slice(0, 6)
      .map((loc) => ({
        id: loc.id,
        name: loc.name,
        path: buildPath(loc.id),
        type: LEVEL_DISPLAY[loc.level] || loc.level,
      }));
  }, [query, selected]);

  const addLocation = useCallback(
    (item: LocationItem) => {
      onSelectedChange([...selected, item]);
      setQuery("");
      inputRef.current?.focus();

      const updated = [item, ...recentSearches.filter((r) => r.id !== item.id)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    },
    [onSelectedChange, selected, recentSearches]
  );

  const removeLocation = useCallback(
    (id: string) => {
      onSelectedChange(selected.filter((s) => s.id !== id));
    },
    [onSelectedChange, selected]
  );

  const showDropdown = open && (query.trim() || recentSearches.length > 0);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Clean input without chips */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-black/30" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={selected.length > 0 ? "Add location..." : "City, Region, Country"}
          className="w-full h-10 border border-neutral-200 rounded-full pl-10 pr-9 text-[12px] text-luxury-black placeholder:text-luxury-black/35 focus:outline-none focus:border-luxury-black/30 transition-colors"
        />
        {query && (
          <button onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-black/30 hover:text-luxury-black/60 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-neutral-200 shadow-lg z-50 overflow-hidden min-w-[320px]">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors border-b border-neutral-100">
            <Navigation className="w-4 h-4 text-luxury-black/50" />
            <span className="text-[13px] text-luxury-black">Search near me</span>
          </button>

          {results.length > 0 && (
            <div>
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addLocation(item)}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-neutral-50 transition-colors"
                >
                  <Search className="w-4 h-4 text-luxury-black/25 shrink-0" />
                  <span className="text-[13px] text-luxury-black truncate flex-1">{item.path}</span>
                  <span className="text-[11px] text-luxury-black/40 font-medium shrink-0 ml-2">{item.type}</span>
                </button>
              ))}
            </div>
          )}

          {!query.trim() && recentSearches.filter((r) => !selected.some((s) => s.id === r.id)).length > 0 && (
            <div>
              <div className="px-4 pt-2.5 pb-1.5">
                <span className="text-[11px] font-semibold text-luxury-black/50 uppercase tracking-wider">Recent searches</span>
              </div>
              {recentSearches
                .filter((r) => !selected.some((s) => s.id === r.id))
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => addLocation(item)}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-neutral-50 transition-colors"
                  >
                    <Search className="w-4 h-4 text-luxury-black/25 shrink-0" />
                    <span className="text-[13px] text-luxury-black truncate flex-1">{item.path}</span>
                    <span className="text-[11px] text-luxury-black/40 font-medium shrink-0 ml-2">{item.type}</span>
                  </button>
                ))}
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className="px-4 py-4 text-center">
              <span className="text-[12px] text-luxury-black/40">No locations found</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearchDropdown;
