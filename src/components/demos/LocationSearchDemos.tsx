import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { MapPin, Navigation, Search, X, ChevronRight, ChevronDown, Clock } from "lucide-react";
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

type SelectedLocation = { id: string; name: string; type: string; parentId?: string };

const MAX_CHIPS = 3;

export const VariantECollapsible = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedExpandedIds, setSelectedExpandedIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<SelectedLocation[]>([]);
  const [recentSearches, setRecentSearches] = useState<SelectedLocation[]>([]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedIds = useMemo(() => new Set(selected.map((s) => s.id)), [selected]);

  // Build selected municipalities with their zones for the "Selected" section
  const selectedMuniGroups = useMemo(() => {
    const groups: { id: string; name: string; path: string; zones: { id: string; name: string; selected: boolean }[] }[] = [];
    const muniIds = new Set<string>();

    // Collect selected municipalities
    selected.forEach((s) => {
      if (s.type === "City") muniIds.add(s.id);
    });

    // Collect parent munis of selected zones
    selected.forEach((s) => {
      if (s.type === "Zone" && s.parentId) muniIds.add(s.parentId);
    });

    muniIds.forEach((muniId) => {
      const muni = mockLocations.find((l) => l.id === muniId);
      if (!muni) return;
      const allZones = mockLocations.filter((l) => l.parentId === muniId && l.level === "borough" && l.active);
      const isMuniSelected = selectedIds.has(muniId);
      groups.push({
        id: muniId,
        name: muni.name,
        path: buildSubtitle(muniId),
        zones: allZones.map((z) => ({
          id: z.id,
          name: z.name,
          selected: isMuniSelected || selectedIds.has(z.id),
        })),
      });
    });

    // Standalone selected (country, province)
    return groups;
  }, [selected, selectedIds]);

  const standaloneSelected = useMemo(
    () => selected.filter((s) => s.type !== "City" && s.type !== "Zone"),
    [selected],
  );

  const { standalone, municipalities } = useMemo(() => {
    if (!query.trim()) return { standalone: [], municipalities: [] };
    const q = query.toLowerCase().trim();

    const standaloneItems: LocationItem[] = [];
    const muniMap: Record<string, GroupedMunicipality> = {};

    // Step 1: municipalities
    const matchingMunis = mockLocations.filter(
      (loc) => loc.active && loc.level === "municipality" &&
        (loc.name.toLowerCase().includes(q) || Object.values(loc.names).some((n) => n.toLowerCase().includes(q)))
    );

    matchingMunis.forEach((muni) => {
      const children = mockLocations
        .filter((l) => l.parentId === muni.id && l.level === "borough" && l.active)
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
        (loc) => loc.active && loc.level === "borough" &&
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
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectedExpand = (id: string) => {
    setSelectedExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const addSelection = (item: SelectedLocation) => {
    if (!selectedIds.has(item.id)) {
      setSelected((prev) => [...prev, item]);
    }
    // Track recent
    setRecentSearches((prev) => [item, ...prev.filter((r) => r.id !== item.id)].slice(0, 5));
    setQuery("");
    inputRef.current?.focus();
  };

  const removeSelection = (id: string) => {
    setSelected((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleZone = (zoneId: string, zoneName: string, parentId: string) => {
    if (selectedIds.has(zoneId)) {
      removeSelection(zoneId);
    } else {
      setSelected((prev) => [...prev, { id: zoneId, name: zoneName, type: "Zone", parentId }]);
    }
  };

  const toggleMuniSelection = (muniId: string, muniName: string) => {
    if (selectedIds.has(muniId)) {
      // Deselect muni and all its zones
      const zoneIds = mockLocations.filter((l) => l.parentId === muniId && l.level === "borough").map((l) => l.id);
      setSelected((prev) => prev.filter((s) => s.id !== muniId && !zoneIds.includes(s.id)));
    } else {
      // Select municipality (implies all zones)
      const zoneIds = mockLocations.filter((l) => l.parentId === muniId && l.level === "borough").map((l) => l.id);
      setSelected((prev) => {
        const without = prev.filter((s) => !zoneIds.includes(s.id));
        return [...without, { id: muniId, name: muniName, type: "City" }];
      });
    }
    setQuery("");
    inputRef.current?.focus();
  };

  // Chip display
  const chipItems = useMemo(() => {
    const chips: { id: string; label: string }[] = [];
    selectedMuniGroups.forEach((g) => {
      const isMuniSelected = selectedIds.has(g.id);
      const selectedZoneCount = g.zones.filter((z) => z.selected).length;
      if (isMuniSelected) {
        chips.push({ id: g.id, label: g.name });
      } else if (selectedZoneCount > 0) {
        chips.push({ id: g.id, label: `${g.name} (${selectedZoneCount})` });
      }
    });
    standaloneSelected.forEach((s) => chips.push({ id: s.id, label: s.name }));
    return chips;
  }, [selectedMuniGroups, standaloneSelected, selectedIds]);

  const visibleChips = chipItems.slice(0, MAX_CHIPS);
  const extraCount = chipItems.length - MAX_CHIPS;
  const hasResults = standalone.length > 0 || municipalities.length > 0;
  const showDropdown = open;

  return (
    <div ref={containerRef} className="relative">
      {/* Input with chips */}
      <div
        className="flex items-center gap-1.5 min-h-[44px] border border-border rounded-full px-3 cursor-text focus-within:border-foreground/30 transition-colors bg-background flex-wrap py-1"
        onClick={() => { inputRef.current?.focus(); setOpen(true); }}
      >
        <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
        {visibleChips.map((chip) => (
          <span
            key={chip.id}
            className="inline-flex items-center gap-1 bg-muted text-foreground text-[11px] font-medium rounded-full pl-2.5 pr-1.5 py-0.5 whitespace-nowrap shrink-0"
          >
            {chip.label}
            <button
              onClick={(e) => { e.stopPropagation(); removeSelection(chip.id); }}
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
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-card rounded-xl border border-border shadow-lg z-50 overflow-hidden max-h-[420px] overflow-y-auto min-w-[340px]">

          {/* ── Selected municipalities with expandable zones ── */}
          {selectedMuniGroups.length > 0 && (
            <div className="border-b border-border">
              <div className="px-4 pt-2.5 pb-1">
                <span className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Selected</span>
              </div>
              {selectedMuniGroups.map((group) => {
                const isExp = selectedExpandedIds.has(group.id);
                const isMuniSelected = selectedIds.has(group.id);
                const selectedZoneCount = group.zones.filter((z) => z.selected).length;
                const totalZones = group.zones.length;

                return (
                  <div key={group.id}>
                    <div className="flex items-center w-full hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 flex-1 px-4 py-2 min-w-0">
                        <MapPin className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{group.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{group.path}</div>
                        </div>
                        {isMuniSelected && (
                          <span className="text-[10px] text-muted-foreground/50 font-medium shrink-0">All zones</span>
                        )}
                        {!isMuniSelected && selectedZoneCount > 0 && (
                          <span className="text-[10px] text-muted-foreground/50 font-medium shrink-0">{selectedZoneCount}/{totalZones}</span>
                        )}
                      </div>
                      <button
                        onClick={() => removeSelection(group.id)}
                        className="px-2 py-2 text-muted-foreground/30 hover:text-foreground transition-colors shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      {totalZones > 0 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSelectedExpand(group.id); }}
                          className="flex items-center gap-0.5 px-3 py-2 text-muted-foreground/50 hover:text-foreground transition-colors shrink-0"
                        >
                          {!isExp && <span className="text-[10px] text-muted-foreground/40 font-medium">{totalZones}</span>}
                          {isExp ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                    {isExp && group.zones.map((zone) => (
                      <button
                        key={zone.id}
                        onClick={() => toggleZone(zone.id, zone.name, group.id)}
                        className={`flex items-center gap-3 w-full pl-11 pr-4 py-1.5 text-left hover:bg-muted/50 transition-colors ${zone.selected ? "" : "opacity-50"}`}
                      >
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                        <span className="text-[13px] text-foreground truncate flex-1">{zone.name}</span>
                        {zone.selected && (
                          <X className="w-3 h-3 text-muted-foreground/30 hover:text-foreground shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                );
              })}
              {standaloneSelected.map((item) => (
                <div key={item.id} className="flex items-center gap-3 w-full px-4 py-1.5 hover:bg-muted/50 transition-colors">
                  <MapPin className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                  <span className="text-[13px] text-foreground truncate flex-1">{item.name}</span>
                  <span className="text-[10px] text-muted-foreground/50 font-medium shrink-0">{item.type}</span>
                  <button onClick={() => removeSelection(item.id)} className="text-muted-foreground/30 hover:text-foreground transition-colors shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── Recent searches (when no query) ── */}
          {!query.trim() && recentSearches.filter((r) => !selectedIds.has(r.id)).length > 0 && (
            <div>
              <div className="px-4 pt-2.5 pb-1">
                <span className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Recent searches
                </span>
              </div>
              {recentSearches
                .filter((r) => !selectedIds.has(r.id))
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => addSelection(item)}
                    className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-muted/50 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                    <span className="text-sm text-foreground truncate flex-1">{item.name}</span>
                    <span className="text-[11px] text-muted-foreground/60 font-medium shrink-0">{item.type}</span>
                  </button>
                ))}
            </div>
          )}

          {/* ── Search results ── */}
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

          {municipalities.map((muni) => {
            const isExpanded = expandedIds.has(muni.id);
            const hasChildren = muni.children.length > 0;

            return (
              <div key={muni.id}>
                <div className="flex items-center w-full hover:bg-muted/50 transition-colors">
                  <button
                    onClick={() => toggleMuniSelection(muni.id, muni.name)}
                    className="flex items-center gap-3 flex-1 px-4 py-2.5 text-left min-w-0"
                  >
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
                      {!isExpanded && <span className="text-[10px] text-muted-foreground/40 font-medium">{muni.children.length}</span>}
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {isExpanded && muni.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => toggleZone(child.id, child.name, muni.id)}
                    className="flex items-center gap-3 w-full pl-11 pr-4 py-2 text-left hover:bg-muted/50 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0" />
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
