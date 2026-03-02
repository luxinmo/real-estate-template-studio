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
const MAX_VISIBLE_CHIPS = 2;

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

  const visibleChips = selected.slice(0, MAX_VISIBLE_CHIPS);
  const extraCount = selected.length - MAX_VISIBLE_CHIPS;

  const showDropdown = open;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input with inline chips */}
      <div
        className="flex items-center gap-1.5 min-h-[40px] border border-neutral-200 rounded-full px-3 cursor-text focus-within:border-luxury-black/30 transition-colors"
        onClick={() => { inputRef.current?.focus(); setOpen(true); }}
      >
        <MapPin className="w-4 h-4 text-luxury-black/30 shrink-0" />
        {visibleChips.map((item) => (
          <span
            key={item.id}
            className="inline-flex items-center gap-1 bg-neutral-100 text-luxury-black text-[11px] font-medium rounded-full pl-2 pr-1.5 py-0.5 whitespace-nowrap shrink-0"
          >
            {item.name}
            <button
              onClick={(e) => { e.stopPropagation(); removeLocation(item.id); }}
              className="text-luxury-black/40 hover:text-luxury-black/70 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {extraCount > 0 && (
          <span className="text-[11px] font-medium text-luxury-black/50 shrink-0">+{extraCount}</span>
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={selected.length > 0 ? "Add location..." : "City, Region, Country"}
          className="flex-1 min-w-[60px] h-7 bg-transparent text-[12px] text-luxury-black placeholder:text-luxury-black/35 focus:outline-none"
        />
        {query && (
          <button onClick={(e) => { e.stopPropagation(); setQuery(""); inputRef.current?.focus(); }} className="text-luxury-black/30 hover:text-luxury-black/60 transition-colors shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-neutral-200 shadow-lg z-50 overflow-hidden min-w-[320px]">
          {/* Selected locations section */}
          {selected.length > 0 && (
            <div className="border-b border-neutral-100">
              <div className="px-4 pt-2.5 pb-1.5">
                <span className="text-[11px] font-semibold text-luxury-black/50 uppercase tracking-wider">Selected</span>
              </div>
              {selected.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-neutral-50 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-luxury-black/50 shrink-0" />
                  <span className="text-[13px] text-luxury-black truncate flex-1">{item.path}</span>
                  <button
                    onClick={() => removeLocation(item.id)}
                    className="text-luxury-black/30 hover:text-luxury-black/60 transition-colors shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

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
