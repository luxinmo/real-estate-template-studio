import { useState, useMemo, useCallback } from "react";
import { ChevronRight, Search, MapPin, Plus, Pencil, Trash2, Map, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { LocationNode, LEVEL_LABELS, CHILD_LEVEL, LEVEL_COLORS } from "./types";
import { mockLocations } from "./mock-data";
import LocationMap from "./LocationMap";

interface LocationsPageProps {
  onAdd?: (parentId: string | null, level: string) => void;
  onEdit?: (location: LocationNode) => void;
}

/* ─── Palette for map polygons ─── */
const PALETTE = [
  "#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
];

/* ─── Tree item ─── */
const TreeItem = ({
  node, depth, selected, expanded, onSelect, onToggle, allNodes, search,
}: {
  node: LocationNode; depth: number; selected: string | null;
  expanded: Set<string>; onSelect: (id: string) => void;
  onToggle: (id: string) => void; allNodes: LocationNode[]; search: string;
}) => {
  const isExpanded = expanded.has(node.id);
  const isSelected = selected === node.id;
  const hasChildren = node.childrenCount > 0;
  const children = allNodes.filter((n) => n.parentId === node.id);

  const matchesSearch =
    !search || node.name.toLowerCase().includes(search.toLowerCase()) ||
    children.some((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  if (search && !matchesSearch) return null;

  return (
    <>
      <button
        onClick={() => {
          onSelect(node.id);
          if (hasChildren && !isExpanded) onToggle(node.id);
        }}
        className={`group flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] transition-colors ${
          isSelected
            ? "bg-primary/8 border-l-2 border-primary text-foreground font-medium"
            : "text-muted-foreground hover:bg-accent hover:text-foreground border-l-2 border-transparent"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center transition-transform ${isExpanded ? "rotate-90" : ""}`}
          onClick={(e) => { e.stopPropagation(); if (hasChildren) onToggle(node.id); }}
        >
          {hasChildren && <ChevronRight className="h-3.5 w-3.5" />}
        </span>
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${node.active ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
        <span className="flex-1 truncate text-left">{node.name}</span>
        {hasChildren && (
          <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            {node.childrenCount}
          </span>
        )}
      </button>
      {isExpanded &&
        children.sort((a, b) => a.order - b.order).map((child) => (
          <TreeItem key={child.id} node={child} depth={depth + 1} selected={selected}
            expanded={expanded} onSelect={onSelect} onToggle={onToggle} allNodes={allNodes} search={search} />
        ))}
    </>
  );
};

/* ─── Main page ─── */
const LocationsPage = ({ onAdd, onEdit }: LocationsPageProps) => {
  const [locations, setLocations] = useState<LocationNode[]>(mockLocations);
  const [selected, setSelected] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["c1"]));
  const [treeSearch, setTreeSearch] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [drawMode, setDrawMode] = useState(false);
  const [drawDialog, setDrawDialog] = useState(false);
  const [drawnGeoJSON, setDrawnGeoJSON] = useState<string>("");
  const [newZoneName, setNewZoneName] = useState("");
  const [newZoneActive, setNewZoneActive] = useState(true);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedNode = locations.find((n) => n.id === selected) ?? null;
  const childLevel = selectedNode ? CHILD_LEVEL[selectedNode.level] : null;
  const children = useMemo(
    () => selected ? locations.filter((n) => n.parentId === selected).sort((a, b) => a.order - b.order) : [],
    [selected, locations],
  );

  const rootNodes = useMemo(
    () => locations.filter((n) => n.parentId === null).sort((a, b) => a.order - b.order),
    [locations],
  );

  const handleToggleActive = (id: string) => {
    setLocations((prev) => prev.map((n) => (n.id === id ? { ...n, active: !n.active } : n)));
  };

  const handleDelete = (id: string) => {
    setLocations((prev) => prev.filter((n) => n.id !== id));
  };

  const geoType = (geojson: string | null) => {
    if (!geojson) return null;
    try { return JSON.parse(geojson).type as string; } catch { return null; }
  };

  // Map polygons for children
  const mapPolygons = useMemo(() =>
    children.filter((c) => c.geojson).map((c, i) => ({
      id: c.id,
      name: c.name,
      geojson: c.geojson!,
      color: PALETTE[i % PALETTE.length],
    })),
    [children],
  );

  const handleMapPolygonClick = useCallback((id: string) => {
    const loc = locations.find((l) => l.id === id);
    if (loc) onEdit?.(loc);
  }, [locations, onEdit]);

  const handleDrawComplete = useCallback((geojson: string) => {
    setDrawnGeoJSON(geojson);
    setDrawMode(false);
    setDrawDialog(true);
  }, []);

  const handleSaveDrawn = () => {
    if (!newZoneName.trim() || !selected || !childLevel) return;
    const newId = `drawn-${Date.now()}`;
    const safeName = newZoneName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const newNode: LocationNode = {
      id: newId,
      parentId: selected,
      level: childLevel,
      name: newZoneName,
      safeName,
      names: { en: newZoneName },
      slugs: { en: safeName },
      active: newZoneActive,
      order: children.length + 1,
      geojson: drawnGeoJSON,
      childrenCount: 0,
    };
    setLocations((prev) => {
      const updated = prev.map((n) => n.id === selected ? { ...n, childrenCount: n.childrenCount + 1 } : n);
      return [...updated, newNode];
    });
    setDrawDialog(false);
    setNewZoneName("");
    setDrawnGeoJSON("");
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 sm:px-6 h-14 shrink-0">
        <div className="flex items-center gap-2.5">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <h1 className="text-[15px] font-semibold text-foreground tracking-tight">Locations</h1>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Tree panel - fixed 280px */}
        <div className="w-[280px] shrink-0 border-r border-border flex flex-col">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={treeSearch} onChange={(e) => setTreeSearch(e.target.value)}
                placeholder="Search locations..." className="h-8 pl-8 text-[13px]" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-0.5">
              {rootNodes.map((node) => (
                <TreeItem key={node.id} node={node} depth={0} selected={selected}
                  expanded={expanded} onSelect={setSelected} onToggle={toggleExpand}
                  allNodes={locations} search={treeSearch} />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {!selected || !selectedNode ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-2">
                <MapPin className="h-10 w-10 mx-auto text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Select a location from the tree</p>
              </div>
            </div>
          ) : (
            <>
              {/* Panel header */}
              <div className="flex items-center justify-between border-b border-border px-4 sm:px-6 h-12 shrink-0">
                <div className="flex items-center gap-2">
                  <Badge className={`text-[10px] uppercase tracking-wider font-semibold ${LEVEL_COLORS[selectedNode.level]}`}>
                    {LEVEL_LABELS[selectedNode.level]}
                  </Badge>
                  <span className="text-[14px] font-medium text-foreground">{selectedNode.name}</span>
                  {childLevel && (
                    <span className="text-[12px] text-muted-foreground">
                      · {children.length} {LEVEL_LABELS[childLevel]}{children.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {childLevel && (
                    <Button size="sm" className="h-8 gap-1.5 text-[12px]"
                      onClick={() => onAdd?.(selectedNode.id, childLevel)}>
                      <Plus className="h-3.5 w-3.5" />
                      Add {LEVEL_LABELS[childLevel]}
                    </Button>
                  )}
                </div>
              </div>

              {/* Tabs: List | Map */}
              {childLevel ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                  <div className="px-4 sm:px-6 pt-3">
                    <TabsList className="h-9">
                      <TabsTrigger value="list" className="gap-1.5 text-[12px]">
                        <List className="h-3.5 w-3.5" /> List
                      </TabsTrigger>
                      <TabsTrigger value="map" className="gap-1.5 text-[12px]">
                        <Map className="h-3.5 w-3.5" /> Map
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* LIST TAB */}
                  <TabsContent value="list" className="flex-1 overflow-auto mt-0">
                    {children.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center h-64">
                        <div className="text-center space-y-3">
                          <p className="text-sm text-muted-foreground">
                            No {LEVEL_LABELS[childLevel].toLowerCase()}s yet
                          </p>
                          <Button size="sm" variant="outline" className="gap-1.5 text-[12px]"
                            onClick={() => onAdd?.(selectedNode.id, childLevel)}>
                            <Plus className="h-3.5 w-3.5" />
                            Add first {LEVEL_LABELS[childLevel].toLowerCase()}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 sm:p-6">
                        <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="hover:bg-transparent">
                                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Name</TableHead>
                                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Slug</TableHead>
                                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-center">Children</TableHead>
                                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-center">Geometry</TableHead>
                                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-center">Active</TableHead>
                                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {children.map((child) => {
                                const geo = geoType(child.geojson);
                                return (
                                  <TableRow key={child.id} className="cursor-pointer"
                                    onClick={() => {
                                      setSelected(child.id);
                                      if (child.childrenCount > 0) setExpanded((prev) => new Set([...prev, child.id]));
                                    }}>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${child.active ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                                        <span className="text-[13px] font-medium text-foreground">{child.name}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <span className="text-[12px] font-mono text-muted-foreground">{child.safeName}</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {child.childrenCount > 0 ? (
                                        <Badge variant="secondary" className="text-[10px]">{child.childrenCount}</Badge>
                                      ) : (
                                        <span className="text-[11px] text-muted-foreground">—</span>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {geo ? (
                                        <Badge className="text-[10px] bg-emerald-500/10 text-emerald-700 border-emerald-500/20">Has GeoJSON</Badge>
                                      ) : (
                                        <Badge variant="secondary" className="text-[10px] text-muted-foreground">None</Badge>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                                      <Switch checked={child.active} onCheckedChange={() => handleToggleActive(child.id)} className="scale-[0.85]" />
                                    </TableCell>
                                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                      <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit?.(child)}>
                                          <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
                                          onClick={() => handleDelete(child.id)}>
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* MAP TAB */}
                  <TabsContent value="map" className="flex-1 min-h-0 mt-0 relative">
                    <div className="absolute inset-0 p-4 sm:p-6">
                      <div className="h-full rounded-xl border border-border overflow-hidden relative">
                        <LocationMap
                          polygons={mapPolygons}
                          onPolygonClick={handleMapPolygonClick}
                          drawMode={drawMode}
                          onDrawComplete={handleDrawComplete}
                          onCancelDraw={() => setDrawMode(false)}
                          height="100%"
                        />
                        {/* Floating draw button */}
                        {!drawMode && (
                          <Button size="sm" className="absolute bottom-4 right-4 z-[1000] gap-1.5 shadow-lg"
                            onClick={() => setDrawMode(true)}>
                            <Plus className="h-3.5 w-3.5" />
                            Draw new {LEVEL_LABELS[childLevel].toLowerCase()}
                          </Button>
                        )}
                        {drawMode && (
                          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-card border border-border rounded-lg px-4 py-2 shadow-lg">
                            <p className="text-[12px] text-muted-foreground">
                              Click to add points. <strong>Double-click</strong> to finish.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Zones cannot have children</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Draw dialog */}
      <Dialog open={drawDialog} onOpenChange={setDrawDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[15px]">
              New {childLevel ? LEVEL_LABELS[childLevel] : "Location"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-[12px]">Name *</Label>
              <Input value={newZoneName} onChange={(e) => setNewZoneName(e.target.value)}
                placeholder="Location name" autoFocus />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={newZoneActive} onCheckedChange={setNewZoneActive} />
              <Label className="text-[12px]">Active</Label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => { setDrawDialog(false); setDrawnGeoJSON(""); }}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveDrawn} disabled={!newZoneName.trim()}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationsPage;
