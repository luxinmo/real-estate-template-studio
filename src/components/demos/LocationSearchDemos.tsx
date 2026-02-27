import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { MapPin, Navigation, Search, X, ChevronRight, ChevronDown } from "lucide-react";
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
    // Skip region level — show Province, Country only
    if (current.level !== "region") {
      parts.unshift(current.name);
    }
    current = current.parentId ? mockLocations.find((l) => l.id === current!.parentId) : undefined;
  }
  return parts.join(", ");
};

/** Build subtitle path: province, country (skip self, region, municipality) */
const buildSubtitle = (locationId: string): string => {
  const parts: string[] = [];
  const self = mockLocations.find((l) => l.id === locationId);
  if (!self) return "";
  let current = self.parentId ? mockLocations.find((l) => l.id === self.parentId) : undefined;
  while (current) {
    if (current.level !== "region" && current.level !== "municipality") {
      parts.push(current.name);
    }
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

const searchLocations = (query: string, limit = 8): LocationItem[] => {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return mockLocations
    .filter((loc) => {
      if (!loc.active) return false;
      if (loc.name.toLowerCase().includes(q)) return true;
      return Object.values(loc.names).some((n) => n.toLowerCase().includes(q));
    })
    .slice(0, limit)
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

/* ════════════════════════════════════════
   VARIANT E — Collapsible Grouped + Multiselect
   ════════════════════════════════════════ */

type GroupedMunicipality = {
  id: string;
  name: string;
  path: string;
  type: string;
  children: LocationItem[];
  autoExpanded: boolean;
};

type SelectedLocation = { id: string; name: string; type: string };

const MAX_CHIPS = 3;

export const VariantECollapsible = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<SelectedLocation[]>([]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedIds = useMemo(() => new Set(selected.map((s) => s.id)), [selected]);

  const { standalone, municipalities } = useMemo(() => {
    if (!query.trim()) return { standalone: [], municipalities: [] };
    const q = query.toLowerCase().trim();

    const standaloneItems: LocationItem[] = [];
    const muniMap: Record<string, GroupedMunicipality> = {};

    // Step 1: municipalities
    const matchingMunis = mockLocations.filter(
      (loc) => loc.active && loc.level === "municipality" && !selectedIds.has(loc.id) &&
        (loc.name.toLowerCase().includes(q) || Object.values(loc.names).some((n) => n.toLowerCase().includes(q)))
    );

    matchingMunis.forEach((muni) => {
      const children = mockLocations
        .filter((l) => l.parentId === muni.id && l.level === "borough" && l.active && !selectedIds.has(l.id))
        .map((l) => ({
          id: l.id, name: l.name, path: buildPath(l.id),
          type: LEVEL_DISPLAY[l.level] || l.level, parentName: muni.name,
        }));
      muniMap[muni.id] = {
        id: muni.id, name: muni.name, path: buildSubtitle(muni.id), type: "City",
        children, autoExpanded: false,
      };
    });

    // Step 2: zones (only if no municipality matched)
    if (matchingMunis.length === 0) {
      const matchingZones = mockLocations.filter(
        (loc) => loc.active && loc.level === "borough" && !selectedIds.has(loc.id) &&
          (loc.name.toLowerCase().includes(q) || Object.values(loc.names).some((n) => n.toLowerCase().includes(q)))
      ).slice(0, 12);

      matchingZones.forEach((zone) => {
        const parentMuni = mockLocations.find((l) => l.id === zone.parentId);
        if (parentMuni) {
          if (!muniMap[parentMuni.id]) {
            muniMap[parentMuni.id] = {
              id: parentMuni.id, name: parentMuni.name, path: buildSubtitle(parentMuni.id), type: "City",
              children: [], autoExpanded: true,
            };
          }
          muniMap[parentMuni.id].children.push({
            id: zone.id, name: zone.name, path: buildPath(zone.id),
            type: LEVEL_DISPLAY[zone.level] || zone.level, parentName: parentMuni.name,
          });
          muniMap[parentMuni.id].autoExpanded = true;
        }
      });
    }

    // Step 3: other levels
    const otherMatches = mockLocations.filter(
      (loc) => loc.active && loc.level !== "municipality" && loc.level !== "borough" && loc.level !== "region" && !selectedIds.has(loc.id) &&
        (loc.name.toLowerCase().includes(q) || Object.values(loc.names).some((n) => n.toLowerCase().includes(q)))
    ).slice(0, 4);

    otherMatches.forEach((loc) => {
      standaloneItems.push({
        id: loc.id, name: loc.name, path: buildSubtitle(loc.id),
        type: LEVEL_DISPLAY[loc.level] || loc.level,
      });
    });

    return { standalone: standaloneItems, municipalities: Object.values(muniMap) };
  }, [query, selectedIds]);

  useEffect(() => {
    const autoIds = municipalities.filter((m) => m.autoExpanded).map((m) => m.id);
    setExpandedIds(new Set(autoIds));
  }, [query]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addSelection = (item: { id: string; name: string; type: string }) => {
    if (!selectedIds.has(item.id)) {
      setSelected((prev) => [...prev, item]);
    }
    setQuery("");
    inputRef.current?.focus();
  };

  const removeSelection = (id: string) => {
    setSelected((prev) => prev.filter((s) => s.id !== id));
  };

  const visibleChips = selected.slice(0, MAX_CHIPS);
  const extraCount = selected.length - MAX_CHIPS;
  const hasResults = standalone.length > 0 || municipalities.length > 0;
  const showDropdown = open && (query.trim() || selected.length > 0);

  return (
    <div ref={containerRef} className="relative">
      {/* Input with chips */}
      <div
        className="flex items-center gap-1.5 min-h-[44px] border border-border rounded-full px-3 cursor-text focus-within:border-foreground/30 transition-colors bg-background flex-wrap py-1"
        onClick={() => { inputRef.current?.focus(); setOpen(true); }}
      >
        <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
        {visibleChips.map((item) => (
          <span
            key={item.id}
            className="inline-flex items-center gap-1 bg-muted text-foreground text-[11px] font-medium rounded-full pl-2.5 pr-1.5 py-0.5 whitespace-nowrap shrink-0"
          >
            {item.name}
            <button
              onClick={(e) => { e.stopPropagation(); removeSelection(item.id); }}
              className="text-muted-foreground/50 hover:text-foreground transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {extraCount > 0 && (
          <span className="text-[11px] font-medium text-muted-foreground shrink-0">+{extraCount}</span>
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={selected.length > 0 ? "Add location..." : "City, Zone, Country…"}
          className="flex-1 min-w-[80px] h-7 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
        />
        {query && (
          <button onClick={(e) => { e.stopPropagation(); setQuery(""); inputRef.current?.focus(); }} className="text-muted-foreground/40 hover:text-muted-foreground transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-card rounded-xl border border-border shadow-lg z-50 overflow-hidden max-h-[400px] overflow-y-auto min-w-[340px]">
          {/* Selected summary */}
          {selected.length > 0 && (
            <div className="border-b border-border">
              <div className="px-4 pt-2.5 pb-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Selected ({selected.length})</span>
              </div>
              {selected.map((item) => (
                <div key={item.id} className="flex items-center gap-3 w-full px-4 py-1.5 hover:bg-muted/50 transition-colors">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                  <span className="text-[13px] text-foreground truncate flex-1">{item.name}</span>
                  <span className="text-[10px] text-muted-foreground/50 font-medium shrink-0">{item.type}</span>
                  <button onClick={() => removeSelection(item.id)} className="text-muted-foreground/30 hover:text-foreground transition-colors shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border">
            <Navigation className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Search near me</span>
          </button>

          {/* Standalone results */}
          {standalone.map((item) => (
            <button key={item.id} onClick={() => addSelection(item)} className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-muted/50 transition-colors">
              <Search className="w-4 h-4 text-muted-foreground/40 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{item.name}</div>
                {item.path && <div className="text-xs text-muted-foreground truncate">{item.path}</div>}
              </div>
              <span className="text-[11px] text-muted-foreground/60 font-medium shrink-0">{item.type}</span>
            </button>
          ))}

          {/* Municipality groups */}
          {municipalities.map((muni) => {
            const isExpanded = expandedIds.has(muni.id);
            const hasChildren = muni.children.length > 0;

            return (
              <div key={muni.id}>
                <div className="flex items-center w-full hover:bg-muted/50 transition-colors">
                  <button onClick={() => addSelection({ id: muni.id, name: muni.name, type: muni.type })} className="flex items-center gap-3 flex-1 px-4 py-2.5 text-left min-w-0">
                    <MapPin className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{muni.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{muni.path}</div>
                    </div>
                    <span className="text-[11px] text-muted-foreground/60 font-medium shrink-0">{muni.type}</span>
                  </button>
                  {hasChildren && (
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleExpand(muni.id); }}
                      className="flex items-center gap-0.5 px-3 py-2.5 text-muted-foreground/50 hover:text-foreground transition-colors shrink-0"
                    >
                      {!isExpanded && (
                        <span className="text-[10px] text-muted-foreground/40 font-medium">{muni.children.length}</span>
                      )}
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {isExpanded && muni.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => addSelection({ id: child.id, name: child.name, type: child.type })}
                    className="flex items-center gap-3 w-full pl-11 pr-4 py-2 text-left hover:bg-muted/50 transition-colors"
                  >
                    <Search className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0" />
                    <span className="text-sm text-foreground truncate flex-1">{child.name}</span>
                    <span className="text-[11px] text-muted-foreground/60 font-medium shrink-0">{child.type}</span>
                  </button>
                ))}
              </div>
            );
          })}

          {query.trim() && !hasResults && (
            <div className="px-4 py-4 text-center text-xs text-muted-foreground">No locations found</div>
          )}
        </div>
      )}
    </div>
  );
};
