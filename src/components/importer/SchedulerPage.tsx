import { useState } from "react";
import { Activity, Clock, Play, Loader2, CheckCircle2, XCircle, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { mockSchedulerJobs } from "./mock-data";

function timeAgo(iso?: string) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins} min`;
  return `hace ${Math.floor(mins / 60)}h`;
}

function timeUntil(iso?: string) {
  if (!iso) return "—";
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0) return "ahora";
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `en ${mins} min`;
  return `en ${Math.floor(mins / 60)}h`;
}

const SchedulerPage = () => {
  const [jobs] = useState(mockSchedulerJobs);

  const activeCount = jobs.filter(j => j.active).length;
  const runningCount = jobs.filter(j => j.running).length;
  const nextJob = jobs.filter(j => j.nextRun).sort((a, b) => new Date(a.nextRun!).getTime() - new Date(b.nextRun!).getTime())[0];
  const lastJob = jobs.filter(j => j.lastRun).sort((a, b) => new Date(b.lastRun!).getTime() - new Date(a.lastRun!).getTime())[0];

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 sm:px-8 pt-8 pb-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Programador</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Estado de las tareas programadas de importación</p>
        </div>

        {/* Status cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card className="shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[#6366F1]/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-[#6366F1]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                <p className="text-[11px] text-muted-foreground">Fuentes activas</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
                <Loader2 className={`h-4 w-4 text-blue-600 ${runningCount > 0 ? "animate-spin" : ""}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{runningCount}</p>
                <p className="text-[11px] text-muted-foreground">En ejecución</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-green-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{nextJob ? timeUntil(nextJob.nextRun) : "—"}</p>
                <p className="text-[11px] text-muted-foreground">Próxima ejecución</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{lastJob ? timeAgo(lastJob.lastRun) : "—"}</p>
                <p className="text-[11px] text-muted-foreground">Última ejecución</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs table */}
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs">Fuente</TableHead>
                <TableHead className="text-xs">Frecuencia</TableHead>
                <TableHead className="text-xs">Estado</TableHead>
                <TableHead className="text-xs">Última ejecución</TableHead>
                <TableHead className="text-xs">Próxima</TableHead>
                <TableHead className="text-xs text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map(j => (
                <TableRow key={j.id}>
                  <TableCell className="text-[13px] font-medium">{j.sourceName}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{j.frequency}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={j.active ? "bg-green-100 text-green-700 border-green-200 text-[10px]" : "bg-muted text-muted-foreground border-border text-[10px]"}>
                      {j.active ? "Activo" : "Pausado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">{timeAgo(j.lastRun)}</span>
                      {j.lastRunOk !== undefined && (
                        j.lastRunOk ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <XCircle className="h-3.5 w-3.5 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {j.running ? (
                      <div className="flex items-center gap-2">
                        <Progress value={j.progress} className="h-1.5 w-20" />
                        <span className="text-[10px] text-muted-foreground">{j.progress}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">{timeUntil(j.nextRun)}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="h-7 text-xs" disabled={j.running}>
                      {j.running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3 mr-1" />}
                      {j.running ? "Ejecutando..." : "Ejecutar ahora"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default SchedulerPage;
