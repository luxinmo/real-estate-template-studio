import { useState } from "react";
import { AlertTriangle, Tag, Layers, EyeOff, Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { mockPendingValues, mockSources } from "./mock-data";
import type { PendingValue } from "./types";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

const existingTypes = ["Apartamento", "Villa", "Adosado", "Ático", "Chalet", "Estudio", "Dúplex", "Local comercial", "Parcela"];
const existingFeatures = ["Piscina", "Jardín", "Garaje", "A/C", "Calefacción", "Terraza", "Ascensor", "Trastero", "Alarma"];

const PendientesPage = () => {
  const [items, setItems] = useState<PendingValue[]>(mockPendingValues);
  const [tab, setTab] = useState<"all" | "tipo" | "caracteristica" | "ignored">("all");
  const [filterSource, setFilterSource] = useState("all");
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [creatingId, setCreatingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const filtered = items.filter(i => {
    if (tab === "ignored" && i.status !== "ignored") return false;
    if (tab === "tipo" && (i.entityType !== "tipo" || i.status === "ignored")) return false;
    if (tab === "caracteristica" && (i.entityType !== "caracteristica" || i.status === "ignored")) return false;
    if (tab === "all" && i.status === "ignored") return false;
    if (filterSource !== "all" && i.sourceId !== filterSource) return false;
    return true;
  });

  const counts = {
    all: items.filter(i => i.status !== "ignored").length,
    tipo: items.filter(i => i.entityType === "tipo" && i.status !== "ignored").length,
    caracteristica: items.filter(i => i.entityType === "caracteristica" && i.status !== "ignored").length,
    ignored: items.filter(i => i.status === "ignored").length,
  };

  const handleAssign = (id: string, value: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: "assigned" as const, assignedTo: value } : i));
    setAssigningId(null);
  };

  const handleIgnore = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: "ignored" as const } : i));
  };

  const handleCreate = (id: string) => {
    if (!newName) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: "assigned" as const, assignedTo: newName } : i));
    setCreatingId(null);
    setNewName("");
  };

  const tabCls = (t: string) => `px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`;

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 sm:px-8 pt-8 pb-6">
        <div className="mb-1">
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Valores Pendientes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Tipos y características detectados en los feeds que necesitan ser asignados</p>
        </div>

        {/* Tabs + filter */}
        <div className="flex items-center justify-between mt-4 mb-4 flex-wrap gap-2">
          <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
            <button className={tabCls("all")} onClick={() => setTab("all")}>Todos ({counts.all})</button>
            <button className={tabCls("tipo")} onClick={() => setTab("tipo")}>Tipos ({counts.tipo})</button>
            <button className={tabCls("caracteristica")} onClick={() => setTab("caracteristica")}>Características ({counts.caracteristica})</button>
            <button className={tabCls("ignored")} onClick={() => setTab("ignored")}>Ignorados ({counts.ignored})</button>
          </div>
          <Select value={filterSource} onValueChange={setFilterSource}>
            <SelectTrigger className="w-44 h-8 text-xs"><SelectValue placeholder="Fuente" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las fuentes</SelectItem>
              {mockSources.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
              {tab === "ignored" ? <EyeOff className="h-7 w-7 text-muted-foreground" /> : <Check className="h-7 w-7 text-green-500" />}
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">
              {tab === "ignored" ? "No hay valores ignorados" : "¡Todo asignado!"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              {tab === "ignored" ? "Los valores que marques como ignorados aparecerán aquí." : "No hay valores pendientes de asignación en esta categoría."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filtered.map(item => (
              <Card key={item.id} className={`shadow-sm transition-all ${item.status === "assigned" ? "opacity-60" : ""} ${item.status === "ignored" ? "opacity-50" : ""}`}>
                <CardContent className="p-4">
                  {/* Top badges */}
                  <div className="flex items-center gap-2 mb-2.5">
                    <Badge variant="outline" className="text-[10px] bg-muted">{item.sourceName}</Badge>
                    <Badge variant="outline" className={`text-[10px] ${item.entityType === "tipo" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-purple-50 text-purple-600 border-purple-200"}`}>
                      {item.entityType === "tipo" ? <Tag className="h-2.5 w-2.5 mr-1" /> : <Layers className="h-2.5 w-2.5 mr-1" />}
                      {item.entityType === "tipo" ? "Tipo" : "Característica"}
                    </Badge>
                    {item.status === "assigned" && <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]"><Check className="h-2.5 w-2.5 mr-0.5" /> {item.assignedTo}</Badge>}
                    {item.status === "ignored" && <Badge className="bg-muted text-muted-foreground text-[10px]"><EyeOff className="h-2.5 w-2.5 mr-0.5" /> Ignorado</Badge>}
                  </div>

                  {/* Value */}
                  <p className="font-mono text-sm bg-muted/60 px-2.5 py-1.5 rounded-md mb-2">{item.xmlValue}</p>
                  <p className="text-[11px] text-muted-foreground mb-3">{timeAgo(item.detectedAt)} · {item.occurrences} veces</p>

                  {/* Actions */}
                  {item.status === "pending" && (
                    <div className="flex items-center gap-2">
                      {assigningId === item.id ? (
                        <div className="flex items-center gap-1.5 flex-1">
                          <Select onValueChange={(v) => handleAssign(item.id, v)}>
                            <SelectTrigger className="h-7 text-xs flex-1"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                            <SelectContent>
                              {(item.entityType === "tipo" ? existingTypes : existingFeatures).map(v => (
                                <SelectItem key={v} value={v}>{v}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setAssigningId(null)}><X className="h-3 w-3" /></Button>
                        </div>
                      ) : creatingId === item.id ? (
                        <div className="flex items-center gap-1.5 flex-1">
                          <Input value={newName} onChange={e => setNewName(e.target.value)} className="h-7 text-xs flex-1" placeholder="Nombre nuevo..." autoFocus />
                          <Button size="sm" className="h-7 text-xs bg-[#6366F1] hover:bg-[#5558E6] text-white" onClick={() => handleCreate(item.id)}>Crear</Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setCreatingId(null); setNewName(""); }}><X className="h-3 w-3" /></Button>
                        </div>
                      ) : (
                        <>
                          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setAssigningId(item.id)}>Asignar a...</Button>
                          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setCreatingId(item.id)}><Plus className="h-3 w-3 mr-1" /> Crear nuevo</Button>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => handleIgnore(item.id)}>Ignorar</Button>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendientesPage;
