import { useState } from "react";
import { ChevronRight, Plus, Minus, AlertCircle, CheckCircle2, Loader2, Clock, X, RefreshCw, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { mockBatches, mockBatchRecords, mockSources } from "./mock-data";
import type { ImportBatch, BatchRecord } from "./types";

const statusBadge = (status: ImportBatch["status"]) => {
  const map = {
    completed: { label: "Completado", cls: "bg-green-100 text-green-700 border-green-200" },
    failed: { label: "Fallido", cls: "bg-red-100 text-red-700 border-red-200" },
    running: { label: "En curso", cls: "bg-blue-100 text-blue-700 border-blue-200" },
    pending: { label: "Pendiente", cls: "bg-muted text-muted-foreground border-border" },
  };
  const m = map[status];
  return (
    <Badge variant="outline" className={`${m.cls} text-[10px]`}>
      {status === "running" && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
      {m.label}
    </Badge>
  );
};

const actionBadge = (action: BatchRecord["action"]) => {
  const map = {
    created: { label: "Nuevo", cls: "bg-green-100 text-green-700 border-green-200" },
    updated: { label: "Actualizado", cls: "bg-blue-100 text-blue-700 border-blue-200" },
    unchanged: { label: "Sin cambios", cls: "bg-muted text-muted-foreground border-border" },
    error: { label: "Error", cls: "bg-red-100 text-red-700 border-red-200" },
  };
  const m = map[action];
  return <Badge variant="outline" className={`${m.cls} text-[10px]`}>{m.label}</Badge>;
};

function formatDt(iso: string) {
  return new Date(iso).toLocaleString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
}

const HistorialPage = () => {
  const [filterSource, setFilterSource] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState<ImportBatch | null>(null);
  const [expandedError, setExpandedError] = useState<string | null>(null);

  const filtered = mockBatches.filter(b => {
    if (filterSource !== "all" && b.sourceId !== filterSource) return false;
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 sm:px-8 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">Historial de Importaciones</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Consulta el resultado de cada ejecución de importación</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <Select value={filterSource} onValueChange={setFilterSource}>
            <SelectTrigger className="w-48 h-9 text-xs"><SelectValue placeholder="Fuente" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las fuentes</SelectItem>
              {mockSources.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 h-9 text-xs"><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="completed">Completado</SelectItem>
              <SelectItem value="failed">Fallido</SelectItem>
              <SelectItem value="running">En curso</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Layout with optional detail panel */}
        <div className="flex gap-4">
          <div className={`flex-1 bg-card rounded-lg border shadow-sm overflow-hidden transition-all duration-300 ${selectedBatch ? "w-1/2" : "w-full"}`}>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs">Fuente</TableHead>
                  <TableHead className="text-xs">Inicio</TableHead>
                  <TableHead className="text-xs">Duración</TableHead>
                  <TableHead className="text-xs">Estado</TableHead>
                  <TableHead className="text-xs text-center"><Plus className="h-3 w-3 inline text-green-500" /></TableHead>
                  <TableHead className="text-xs text-center"><RefreshCw className="h-3 w-3 inline text-blue-500" /></TableHead>
                  <TableHead className="text-xs text-center"><Minus className="h-3 w-3 inline text-muted-foreground" /></TableHead>
                  <TableHead className="text-xs text-center"><AlertCircle className="h-3 w-3 inline text-red-500" /></TableHead>
                  <TableHead className="text-xs"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(b => (
                  <TableRow key={b.id} className={selectedBatch?.id === b.id ? "bg-accent" : ""}>
                    <TableCell className="text-[13px] font-medium">{b.sourceName}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDt(b.startedAt)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{b.duration || "—"}</TableCell>
                    <TableCell>{statusBadge(b.status)}</TableCell>
                    <TableCell className="text-center text-xs font-medium text-green-600">{b.newRecords}</TableCell>
                    <TableCell className="text-center text-xs font-medium text-blue-600">{b.updatedRecords}</TableCell>
                    <TableCell className="text-center text-xs text-muted-foreground">{b.unchangedRecords}</TableCell>
                    <TableCell className="text-center text-xs font-medium text-red-600">{b.errors || "—"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setSelectedBatch(b)}>
                        Ver detalle <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Detail panel */}
          {selectedBatch && (
            <div className="w-[480px] shrink-0 bg-card rounded-lg border shadow-sm overflow-hidden flex flex-col animate-in slide-in-from-right-4 duration-200">
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <h3 className="text-sm font-semibold">{selectedBatch.sourceName}</h3>
                  <p className="text-[11px] text-muted-foreground">{formatDt(selectedBatch.startedAt)} · {selectedBatch.duration}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedBatch(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-4 gap-2 p-4">
                <Card className="shadow-none"><CardContent className="p-3 text-center"><p className="text-lg font-bold text-green-600">{selectedBatch.newRecords}</p><p className="text-[10px] text-muted-foreground">Nuevas</p></CardContent></Card>
                <Card className="shadow-none"><CardContent className="p-3 text-center"><p className="text-lg font-bold text-blue-600">{selectedBatch.updatedRecords}</p><p className="text-[10px] text-muted-foreground">Actualizadas</p></CardContent></Card>
                <Card className="shadow-none"><CardContent className="p-3 text-center"><p className="text-lg font-bold text-muted-foreground">{selectedBatch.unchangedRecords}</p><p className="text-[10px] text-muted-foreground">Sin cambios</p></CardContent></Card>
                <Card className="shadow-none"><CardContent className="p-3 text-center"><p className="text-lg font-bold text-red-600">{selectedBatch.errors}</p><p className="text-[10px] text-muted-foreground">Errores</p></CardContent></Card>
              </div>

              {/* Records */}
              <div className="flex-1 overflow-auto border-t">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-[10px]">Ref externa</TableHead>
                      <TableHead className="text-[10px]">Acción</TableHead>
                      <TableHead className="text-[10px]">Cambios</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBatchRecords.map(r => (
                      <TableRow key={r.id}>
                        <TableCell className="font-mono text-xs">{r.externalRef}</TableCell>
                        <TableCell>{actionBadge(r.action)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {r.error ? (
                            <button onClick={() => setExpandedError(expandedError === r.id ? null : r.id)} className="text-red-600 hover:underline text-left">
                              {expandedError === r.id ? r.error : "Ver error..."}
                            </button>
                          ) : (
                            r.changes || "—"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialPage;
