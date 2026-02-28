import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { MapPin, Navigation, Search, X, ChevronRight, ChevronDown, Clock } from "lucide-react";
import { mockLocations } from "@/components/locations/mock-data";

const LEVEL_DISPLAY: Record<string, string> = {
  country: "Country",
  province: "Province",
  region: "Region",
  municipality: "City",
  borough: "Zone",
};

type LocationItem = { id: string; name: string; path: string; type: string; parentName?: string };
type SelectedLocation = { id: string; name: string; type: string; parentId?: string };

type GroupedMunicipality = {
  id: string;
  name: string;
  path: string;
  type: string;
  children: LocationItem[];
  autoExpanded: boolean;
};

const buildPath = (locationId: string): string => {
  const parts: string[] = [];
  let current = mockLocations.find((l) => l.id === locationId);
  while (current) {
    if (current.level !== "region") parts.unshift(current.name);
    current = current.parentId ? mockLocations.find((l) => l.id === current!.parentId) : undefined;
  }
  return parts.join(", ");
};

const buildSubtitle = (locationId: string): string => {
  const parts: string[] = [];
  const self = mockLocations.find((l) => l.id === locationId);
  if (!self) return "";
  let current = self.parentId ? mockLocations.find((l) => l.id === self.parentId) : undefined;
  while (current) {
    if (current.level !== "region" && current.level !== "municipality") parts.push(current.name);
    current = current.parentId ? mockLocations.find((l) => l.id === current!.parentId) : undefined;
  }
  return parts.join(", ");
};

interface LocationSearchDropdownProps {
  selected: { id: string; name: string; path: string; type: string }[];
  onSelectedChange: (items: { id: string; name: string; path: string; type: string }[]) => void;
  className?: string;
}

const MAX_CHIPS = 2;
const RECENT_KEY = "luxury_recent_searches_v2";

const LocationSearchDropdown = ({ selected, onSelectedChange, className = "" }: LocationSearchDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedExpandedIds, setSelectedExpandedIds] = useState<Set<string>>(new Set());
  const [recentSearches, setRecentSearches] = useState<SelectedLocation[]>(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Internal selected state derived from props
  const internalSelected = useMemo<SelectedLocation[]>(() =>
    selected.map(s => ({ id: s.id, name: s.name, type: s.type })),
    [selected]
  );
  const selectedIds = useMemo(() => new Set(internalSelected.map(s => s.id)), [internalSelected]);

  // Sync selections back to parent
  const syncToParent = useCallback((items: SelectedLocation[]) => {
    onSelectedChange(items.map(s => ({
      id: s.id,
      name: s.name,
      path: buildPath(s.id),
      type: s.type,
    })));
  }, [onSelectedChange]);

  // Selected municipality groups for "Selected" section
  const selectedMuniGroups = useMemo(() => {
    const groups: { id: string; name: string; path: string; zones: { id: string; name: string; selected: boolean }[] }[] = [];
    const muniIds = new Set<string>();
    internalSelected.forEach(s => { if (s.type === "City") muniIds.add(s.id); });
    internalSelected.forEach(s => { if (s.type === "Zone" && s.parentId) muniIds.add(s.parentId); });

    muniIds.forEach(muniId => {
      const muni = mockLocations.find(l => l.id === muniId);
      if (!muni) return;
      const allZones = mockLocations.filter(l => l.parentId === muniId && l.level === "borough" && l.active);
      const isMuniSelected = selectedIds.has(muniId);
      groups.push({
        id: muniId, name: muni.name, path: buildSubtitle(muniId),
        zones: allZones.map(z => ({ id: z.id, name: z.name, selected: isMuniSelected || selectedIds.has(z.id) })),
      });
    });
    return groups;
  }, [internalSelected, selectedIds]);

  const standaloneSelected = useMemo(
    () => internalSelected.filter(s => s.type !== "City" && s.type !== "Zone"),
    [internalSelected]
  );

  // Search results with hierarchical grouping
  const { standalone, municipalities } = useMemo(() => {
    if (!query.trim()) return { standalone: [], municipalities: [] };
    const q = query.toLowerCase().trim();
    const standaloneItems: LocationItem[] = [];
    const muniMap: Record<string, GroupedMunicipality> = {};

    // Step 1: municipalities
    const matchingMunis = mockLocations.filter(
      loc => loc.active && loc.level === "municipality" &&
        (loc.name.toLowerCase().includes(q) || Object.values(loc.names).some(n => n.toLowerCase().includes(q)))
    );
    matchingMunis.forEach(muni => {
      const children = mockLocations
        .filter(l => l.parentId === muni.id && l.level === "borough" && l.active)
        .map(l => ({ id: l.id, name: l.name, path: buildPath(l.id), type: LEVEL_DISPLAY[l.level] || l.level, parentName: muni.name }));
      muniMap[muni.id] = { id: muni.id, name: muni.name, path: buildSubtitle(muni.id), type: "City", children, autoExpanded: false };
    });

    // Step 2: zones (only if no municipality matched)
    if (matchingMunis.length === 0) {
      const matchingZones = mockLocations.filter(
        loc => loc.active && loc.level === "borough" &&
          (loc.name.toLowerCase().includes(q) || Object.values(loc.names).some(n => n.toLowerCase().includes(q)))
      ).slice(0, 12);
      matchingZones.forEach(zone => {
        const parentMuni = mockLocations.find(l => l.id === zone.parentId);
        if (parentMuni) {
          if (!muniMap[parentMuni.id]) {
            muniMap[parentMuni.id] = { id: parentMuni.id, name: parentMuni.name, path: buildSubtitle(parentMuni.id), type: "City", children: [], autoExpanded: true };
          }
          muniMap[parentMuni.id].children.push({ id: zone.id, name: zone.name, path: buildPath(zone.id), type: LEVEL_DISPLAY[zone.level] || zone.level, parentName: parentMuni.name });
          muniMap[parentMuni.id].autoExpanded = true;
        }
      });
    }

    // Step 3: other levels
    mockLocations.filter(
      loc => loc.active && loc.level !== "municipality" && loc.level !== "borough" && loc.level !== "region" && !selectedIds.has(loc.id) &&
        (loc.name.toLowerCase().includes(q) || Object.values(loc.names).some(n => n.toLowerCase().includes(q)))
    ).slice(0, 4).forEach(loc => {
      standaloneItems.push({ id: loc.id, name: loc.name, path: buildSubtitle(loc.id), type: LEVEL_DISPLAY[loc.level] || loc.level });
    });

    return { standalone: standaloneItems, municipalities: Object.values(muniMap) };
  }, [query, selectedIds]);

  useEffect(() => {
    const autoIds = municipalities.filter(m => m.autoExpanded).map(m => m.id);
    setExpandedIds(new Set(autoIds));
  }, [query]);

  const toggleExpand = (id: string) => setExpandedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleSelectedExpand = (id: string) => setSelectedExpandedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const addSelection = (item: SelectedLocation) => {
    if (!selectedIds.has(item.id)) {
      const next = [...internalSelected, item];
      syncToParent(next);
    }
    setRecentSearches(prev => { const u = [item, ...prev.filter(r => r.id !== item.id)].slice(0, 5); localStorage.setItem(RECENT_KEY, JSON.stringify(u)); return u; });
    setQuery("");
    inputRef.current?.focus();
  };

  const removeSelection = (id: string) => {
    syncToParent(internalSelected.filter(s => s.id !== id));
  };

  const toggleZone = (zoneId: string, zoneName: string, parentId: string) => {
    if (selectedIds.has(zoneId)) {
      syncToParent(internalSelected.filter(s => s.id !== zoneId));
    } else {
      syncToParent([...internalSelected, { id: zoneId, name: zoneName, type: "Zone", parentId }]);
    }
  };

  const toggleMuniSelection = (muniId: string, muniName: string) => {
    if (selectedIds.has(muniId)) {
      const zoneIds = mockLocations.filter(l => l.parentId === muniId && l.level === "borough").map(l => l.id);
      syncToParent(internalSelected.filter(s => s.id !== muniId && !zoneIds.includes(s.id)));
    } else {
      const zoneIds = mockLocations.filter(l => l.parentId === muniId && l.level === "borough").map(l => l.id);
      const without = internalSelected.filter(s => !zoneIds.includes(s.id));
      syncToParent([...without, { id: muniId, name: muniName, type: "City" }]);
    }
    setQuery("");
    inputRef.current?.focus();
  };

  // Chip display
  const chipItems = useMemo(() => {
    const chips: { id: string; label: string }[] = [];
    selectedMuniGroups.forEach(g => {
      const isMuniSelected = selectedIds.has(g.id);
      const selectedZoneCount = g.zones.filter(z => z.selected).length;
      if (isMuniSelected) chips.push({ id: g.id, label: g.name });
      else if (selectedZoneCount > 0) chips.push({ id: g.id, label: `${g.name} (${selectedZoneCount})` });
    });
    standaloneSelected.forEach(s => chips.push({ id: s.id, label: s.name }));
    return chips;
  }, [selectedMuniGroups, standaloneSelected, selectedIds]);

  const visibleChips = chipItems.slice(0, MAX_CHIPS);
  const extraCount = chipItems.length - MAX_CHIPS;
  const hasResults = standalone.length > 0 || municipalities.length > 0;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input with chips */}
      <div
        className="flex items-center gap-1.5 min-h-[40px] border border-neutral-200 rounded-full px-3 cursor-text focus-within:border-luxury-black/30 transition-colors flex-wrap py-1"
        onClick={() => { inputRef.current?.focus(); setOpen(true); }}
      >
        <MapPin className="w-4 h-4 text-luxury-black/30 shrink-0" />
        {visibleChips.map(chip => (
          <span key={chip.id} className="inline-flex items-center gap-1 bg-neutral-100 text-luxury-black text-[11px] font-medium rounded-full pl-2.5 pr-1.5 py-0.5 whitespace-nowrap shrink-0">
            {chip.label}
            <button onClick={(e) => { e.stopPropagation(); removeSelection(chip.id); }} className="text-luxury-black/40 hover:text-luxury-black/70 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {extraCount > 0 && <span className="text-[11px] font-medium text-luxury-black/50 shrink-0">+{extraCount}</span>}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={selected.length > 0 ? "Add location..." : "City, Zone, Country…"}
          className="flex-1 min-w-[60px] h-7 bg-transparent text-[12px] text-luxury-black placeholder:text-luxury-black/35 focus:outline-none"
        />
        {query && (
          <button onClick={(e) => { e.stopPropagation(); setQuery(""); inputRef.current?.focus(); }} className="text-luxury-black/30 hover:text-luxury-black/60 transition-colors shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-neutral-200 shadow-lg z-50 overflow-hidden max-h-[420px] overflow-y-auto min-w-[340px]">

          {/* Selected section */}
          {selectedMuniGroups.length > 0 && (
            <div className="border-b border-neutral-100">
              <div className="px-4 pt-2.5 pb-1">
                <span className="text-[11px] font-semibold text-luxury-black/40 uppercase tracking-wider">Selected</span>
              </div>
              {selectedMuniGroups.map(group => {
                const isExp = selectedExpandedIds.has(group.id);
                const isMuniSelected = selectedIds.has(group.id);
                const selectedZoneCount = group.zones.filter(z => z.selected).length;
                const totalZones = group.zones.length;
                return (
                  <div key={group.id}>
                    <div className="flex items-center w-full hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center gap-3 flex-1 px-4 py-2 min-w-0">
                        <MapPin className="w-4 h-4 text-luxury-black/40 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-luxury-black truncate">{group.name}</div>
                          <div className="text-xs text-luxury-black/50 truncate">{group.path}</div>
                        </div>
                        {isMuniSelected && <span className="text-[10px] text-luxury-black/40 font-medium shrink-0">All zones</span>}
                        {!isMuniSelected && selectedZoneCount > 0 && <span className="text-[10px] text-luxury-black/40 font-medium shrink-0">{selectedZoneCount}/{totalZones}</span>}
                      </div>
                      <button onClick={() => removeSelection(group.id)} className="px-2 py-2 text-luxury-black/25 hover:text-luxury-black transition-colors shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                      {totalZones > 0 && (
                        <button onClick={(e) => { e.stopPropagation(); toggleSelectedExpand(group.id); }} className="flex items-center gap-0.5 px-3 py-2 text-luxury-black/40 hover:text-luxury-black transition-colors shrink-0">
                          {!isExp && <span className="text-[10px] text-luxury-black/30 font-medium">{totalZones}</span>}
                          {isExp ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                    {isExp && group.zones.map(zone => (
                      <button key={zone.id} onClick={() => toggleZone(zone.id, zone.name, group.id)}
                        className={`flex items-center gap-3 w-full pl-11 pr-4 py-1.5 text-left hover:bg-neutral-50 transition-colors ${zone.selected ? "" : "opacity-50"}`}>
                        <MapPin className="w-3.5 h-3.5 text-luxury-black/30 shrink-0" />
                        <span className="text-[13px] text-luxury-black truncate flex-1">{zone.name}</span>
                        {zone.selected && <X className="w-3 h-3 text-luxury-black/25 hover:text-luxury-black shrink-0" />}
                      </button>
                    ))}
                  </div>
                );
              })}
              {standaloneSelected.map(item => (
                <div key={item.id} className="flex items-center gap-3 w-full px-4 py-1.5 hover:bg-neutral-50 transition-colors">
                  <MapPin className="w-4 h-4 text-luxury-black/40 shrink-0" />
                  <span className="text-[13px] text-luxury-black truncate flex-1">{item.name}</span>
                  <span className="text-[10px] text-luxury-black/40 font-medium shrink-0">{item.type}</span>
                  <button onClick={() => removeSelection(item.id)} className="text-luxury-black/25 hover:text-luxury-black transition-colors shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Near me */}
          <button className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors border-b border-neutral-100">
            <Navigation className="w-4 h-4 text-luxury-black/40" />
            <span className="text-[13px] text-luxury-black">Search near me</span>
          </button>

          {/* Recent searches */}
          {!query.trim() && recentSearches.filter(r => !selectedIds.has(r.id)).length > 0 && (
            <div>
              <div className="px-4 pt-2.5 pb-1">
                <span className="text-[11px] font-semibold text-luxury-black/40 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Recent searches
                </span>
              </div>
              {recentSearches.filter(r => !selectedIds.has(r.id)).map(item => (
                <button key={item.id} onClick={() => addSelection(item)} className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-neutral-50 transition-colors">
                  <MapPin className="w-4 h-4 text-luxury-black/30 shrink-0" />
                  <span className="text-sm text-luxury-black truncate flex-1">{item.name}</span>
                  <span className="text-[11px] text-luxury-black/40 font-medium shrink-0">{item.type}</span>
                </button>
              ))}
            </div>
          )}

          {/* Search results */}
          {standalone.map(item => (
            <button key={item.id} onClick={() => addSelection(item)} className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-neutral-50 transition-colors">
              <Search className="w-4 h-4 text-luxury-black/20 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-luxury-black truncate">{item.name}</div>
                {item.path && <div className="text-xs text-luxury-black/50 truncate">{item.path}</div>}
              </div>
              <span className="text-[11px] text-luxury-black/40 font-medium shrink-0">{item.type}</span>
            </button>
          ))}

          {municipalities.map(muni => {
            const isExpanded = expandedIds.has(muni.id);
            const hasChildren = muni.children.length > 0;
            return (
              <div key={muni.id}>
                <div className="flex items-center w-full hover:bg-neutral-50 transition-colors">
                  <button onClick={() => toggleMuniSelection(muni.id, muni.name)} className="flex items-center gap-3 flex-1 px-4 py-2.5 text-left min-w-0">
                    <MapPin className="w-4 h-4 text-luxury-black/40 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-luxury-black truncate">{muni.name}</div>
                      <div className="text-xs text-luxury-black/50 truncate">{muni.path}</div>
                    </div>
                    <span className="text-[11px] text-luxury-black/40 font-medium shrink-0">{muni.type}</span>
                  </button>
                  {hasChildren && (
                    <button onClick={(e) => { e.stopPropagation(); toggleExpand(muni.id); }} className="flex items-center gap-0.5 px-3 py-2.5 text-luxury-black/40 hover:text-luxury-black transition-colors shrink-0">
                      {!isExpanded && <span className="text-[10px] text-luxury-black/30 font-medium">{muni.children.length}</span>}
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                {isExpanded && muni.children.map(child => (
                  <button key={child.id} onClick={() => toggleZone(child.id, child.name, muni.id)} className="flex items-center gap-3 w-full pl-11 pr-4 py-2 text-left hover:bg-neutral-50 transition-colors">
                    <MapPin className="w-3.5 h-3.5 text-luxury-black/25 shrink-0" />
                    <span className="text-sm text-luxury-black truncate flex-1">{child.name}</span>
                    <span className="text-[11px] text-luxury-black/40 font-medium shrink-0">{child.type}</span>
                  </button>
                ))}
              </div>
            );
          })}

          {query.trim() && !hasResults && (
            <div className="px-4 py-4 text-center text-xs text-luxury-black/40">No locations found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearchDropdown;
