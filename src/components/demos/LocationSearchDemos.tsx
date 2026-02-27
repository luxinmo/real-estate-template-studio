import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { MapPin, Navigation, Search, X } from "lucide-react";
import { mockLocations } from "@/components/locations/mock-data";

/* ── Shared helpers ── */

const LEVEL_DISPLAY: Record<string, string> = {
  country: "Country",
  province: "Province",
  region: "Region",
  municipality: "City",
  borough: "Zone",
};

type LocationItem = { id: string; name: string; path: string; type: string; parentName?: string };

const buildPath = (locationId: string): string => {
  const parts: string[] = [];
  let current = mockLocations.find((l) => l.id === locationId);
  while (current) {
    parts.unshift(current.name);
    current = current.parentId ? mockLocations.find((l) => l.id === current!.parentId) : undefined;
  }
  return parts.join(", ");
};

const getParentName = (locationId: string): string => {
  const loc = mockLocations.find((l) => l.id === locationId);
  if (!loc?.parentId) return "";
  const parent = mockLocations.find((l) => l.id === loc.parentId);
  return parent?.name ?? "";
};

const searchLocations = (query: string): LocationItem[] => {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return mockLocations
    .filter((loc) => {
      if (!loc.active) return false;
      if (loc.name.toLowerCase().includes(q)) return true;
      return Object.values(loc.names).some((n) => n.toLowerCase().includes(q));
    })
    .slice(0, 8)
    .map((loc) => ({
      id: loc.id,
      name: loc.name,
      path: buildPath(loc.id),
      type: LEVEL_DISPLAY[loc.level] || loc.level,
      parentName: getParentName(loc.id),
    }));
};

/* ── Shared wrapper ── */

const DemoWrapper = ({
  children,
  query,
  setQuery,
  inputRef,
  containerRef,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  query: string;
  setQuery: (q: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  open: boolean;
  setOpen: (o: boolean) => void;
}) => {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div
        className="flex items-center gap-2 h-[44px] border border-border rounded-full px-4 cursor-text focus-within:border-foreground/30 transition-colors bg-background"
        onClick={() => { inputRef.current?.focus(); setOpen(true); }}
      >
        <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search locations… try 'galera' or 'altea'"
          className="flex-1 h-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
        />
        {query && (
          <button onClick={(e) => { e.stopPropagation(); setQuery(""); inputRef.current?.focus(); }} className="text-muted-foreground/40 hover:text-muted-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {open && query.trim() && children}
    </div>
  );
};

/* ════════════════════════════════════════
   VARIANT A — Two Lines: Name + Path
   ════════════════════════════════════════ */

export const VariantATwoLines = () => {
  const [query, setQuery] = useState("galera");
  const [open, setOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchLocations(query), [query]);

  return (
    <DemoWrapper {...{ query, setQuery, inputRef, containerRef, open, setOpen }}>
      <div className="absolute top-full left-0 right-0 mt-1.5 bg-card rounded-xl border border-border shadow-lg z-50 overflow-hidden">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border">
          <Navigation className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">Search near me</span>
        </button>
        {results.map((item) => (
          <button key={item.id} className="flex items-start gap-3 w-full px-4 py-2.5 text-left hover:bg-muted/50 transition-colors">
            <Search className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">{item.name}</div>
              <div className="text-xs text-muted-foreground truncate">{item.path}</div>
            </div>
            <span className="text-[11px] text-muted-foreground/60 font-medium shrink-0 mt-0.5">{item.type}</span>
          </button>
        ))}
        {results.length === 0 && (
          <div className="px-4 py-4 text-center text-xs text-muted-foreground">No locations found</div>
        )}
      </div>
    </DemoWrapper>
  );
};

/* ════════════════════════════════════════
   VARIANT B — Full Path Single Line (Current)
   ════════════════════════════════════════ */

export const VariantBFullPath = () => {
  const [query, setQuery] = useState("galera");
  const [open, setOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchLocations(query), [query]);

  return (
    <DemoWrapper {...{ query, setQuery, inputRef, containerRef, open, setOpen }}>
      <div className="absolute top-full left-0 right-0 mt-1.5 bg-card rounded-xl border border-border shadow-lg z-50 overflow-hidden">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border">
          <Navigation className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">Search near me</span>
        </button>
        {results.map((item) => (
          <button key={item.id} className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-muted/50 transition-colors">
            <Search className="w-4 h-4 text-muted-foreground/40 shrink-0" />
            <span className="text-sm text-foreground truncate flex-1">{item.path}</span>
            <span className="text-[11px] text-muted-foreground/60 font-medium shrink-0 ml-2">{item.type}</span>
          </button>
        ))}
        {results.length === 0 && (
          <div className="px-4 py-4 text-center text-xs text-muted-foreground">No locations found</div>
        )}
      </div>
    </DemoWrapper>
  );
};

/* ════════════════════════════════════════
   VARIANT C — Grouped by Parent Municipality
   ════════════════════════════════════════ */

export const VariantCGrouped = () => {
  const [query, setQuery] = useState("altea");
  const [open, setOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchLocations(query), [query]);

  // Group results by parent
  const grouped = useMemo(() => {
    const groups: Record<string, { parentName: string; parentType: string; items: LocationItem[] }> = {};
    const standalone: LocationItem[] = [];
    results.forEach((item) => {
      // If it's a borough/zone, group under its parent
      if (item.type === "Zone" && item.parentName) {
        if (!groups[item.parentName]) {
          groups[item.parentName] = { parentName: item.parentName, parentType: "City", items: [] };
        }
        groups[item.parentName].items.push(item);
      } else {
        standalone.push(item);
      }
    });
    return { groups: Object.values(groups), standalone };
  }, [results]);

  return (
    <DemoWrapper {...{ query, setQuery, inputRef, containerRef, open, setOpen }}>
      <div className="absolute top-full left-0 right-0 mt-1.5 bg-card rounded-xl border border-border shadow-lg z-50 overflow-hidden">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border">
          <Navigation className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">Search near me</span>
        </button>

        {/* Standalone results (non-zones) */}
        {grouped.standalone.map((item) => (
          <button key={item.id} className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-muted/50 transition-colors">
            <Search className="w-4 h-4 text-muted-foreground/40 shrink-0" />
            <span className="text-sm text-foreground truncate flex-1">{item.path}</span>
            <span className="text-[11px] text-muted-foreground/60 font-medium shrink-0">{item.type}</span>
          </button>
        ))}

        {/* Grouped zones */}
        {grouped.groups.map((group) => (
          <div key={group.parentName}>
            <div className="px-4 pt-3 pb-1.5 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground/50" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{group.parentName}</span>
              <span className="text-[10px] text-muted-foreground/40 font-medium">{group.parentType}</span>
            </div>
            {group.items.map((item) => (
              <button key={item.id} className="flex items-center gap-3 w-full pl-8 pr-4 py-2 text-left hover:bg-muted/50 transition-colors">
                <Search className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0" />
                <span className="text-sm text-foreground truncate flex-1">{item.name}</span>
                <span className="text-[11px] text-muted-foreground/60 font-medium shrink-0">{item.type}</span>
              </button>
            ))}
          </div>
        ))}

        {results.length === 0 && (
          <div className="px-4 py-4 text-center text-xs text-muted-foreground">No locations found</div>
        )}
      </div>
    </DemoWrapper>
  );
};

/* ════════════════════════════════════════
   VARIANT D — Name + Badge Inline
   ════════════════════════════════════════ */

export const VariantDBadge = () => {
  const [query, setQuery] = useState("galera");
  const [open, setOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchLocations(query), [query]);

  return (
    <DemoWrapper {...{ query, setQuery, inputRef, containerRef, open, setOpen }}>
      <div className="absolute top-full left-0 right-0 mt-1.5 bg-card rounded-xl border border-border shadow-lg z-50 overflow-hidden">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border">
          <Navigation className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">Search near me</span>
        </button>
        {results.map((item) => (
          <button key={item.id} className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-muted/50 transition-colors">
            <Search className="w-4 h-4 text-muted-foreground/40 shrink-0" />
            <span className="text-sm text-foreground">{item.name}</span>
            {item.parentName && (
              <span className="inline-flex items-center text-[10px] font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5 shrink-0">
                en {item.parentName}
              </span>
            )}
            <span className="text-[11px] text-muted-foreground/60 font-medium shrink-0 ml-auto">{item.type}</span>
          </button>
        ))}
        {results.length === 0 && (
          <div className="px-4 py-4 text-center text-xs text-muted-foreground">No locations found</div>
        )}
      </div>
    </DemoWrapper>
  );
};
