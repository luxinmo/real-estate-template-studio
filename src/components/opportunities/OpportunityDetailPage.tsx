import { useState } from "react";
import { ArrowLeft, Pencil, Archive, Trophy, Phone, AtSign, MapPin, Flame, Tag, Check, Clock, Plus, Paperclip, CalendarDays, CheckCircle2, Circle, XCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mockLeads, pipelineStages, type Lead } from "./mock-data";

interface Props {
  leadId: string;
  onBack: () => void;
}

const OpportunityDetailPage = ({ leadId, onBack }: Props) => {
  const lead = mockLeads.find(l => l.id === leadId) || mockLeads[4]; // default to Soazig
  const [noteText, setNoteText] = useState("");

  const currentStageIdx = pipelineStages.findIndex(s => s.key === lead.stage);

  return (
    <div className="flex-1 overflow-auto">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 sm:px-8 py-3">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-[10px] font-semibold px-2 py-0 h-5 rounded ${
                  lead.type === "rent" ? "text-blue-600 border-blue-200 bg-blue-50" : "text-emerald-600 border-emerald-200 bg-emerald-50"
                }`}>
                  {lead.type === "rent" ? "To rent" : "For sale"}
                </Badge>
                <span className="text-[12px] text-muted-foreground font-mono">{lead.ref}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                <span>Origen: {lead.origin}</span>
                <span>·</span>
                <span>Responsable: {lead.agent}</span>
                <Pencil className="h-2.5 w-2.5 cursor-pointer hover:text-foreground" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {lead.isHot && <Flame className="h-4 w-4 text-amber-500" />}
            <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1"><Trophy className="h-3 w-3" />WON</Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1"><Archive className="h-3 w-3" />ARCHIVED</Button>
            <Button size="sm" className="h-7 text-[11px]">Editar</Button>
          </div>
        </div>
      </div>

      {/* Contact header */}
      <div className="px-4 sm:px-8 pt-5 pb-4">
        <h1 className="text-lg font-semibold text-primary">{lead.contactName}</h1>
        <div className="flex items-center gap-4 mt-1.5 text-[12px]">
          <a className="text-primary/70 hover:underline flex items-center gap-1"><AtSign className="h-3 w-3" />{lead.email}</a>
          <span className="flex items-center gap-1 text-muted-foreground"><Phone className="h-3 w-3" />{lead.phone}</span>
        </div>
        {lead.tags.length > 0 && (
          <div className="flex items-center gap-1 mt-2">
            {lead.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-amber-100 text-amber-800 border-amber-200">{tag}</Badge>
            ))}
          </div>
        )}
      </div>

      {/* Pipeline progress */}
      <div className="px-4 sm:px-8 pb-5">
        <div className="flex items-center gap-1">
          {pipelineStages.map((stage, i) => {
            const historyEntry = lead.stageHistory.find(h => h.stage === stage.key);
            const isCompleted = !!historyEntry;
            const isCurrent = stage.key === lead.stage;
            return (
              <div key={stage.key} className="flex-1 text-center">
                <div className={`relative mx-auto mb-1 flex items-center justify-center`}>
                  {i > 0 && (
                    <div className={`absolute right-1/2 w-full h-0.5 -translate-y-0 ${
                      isCompleted ? "bg-primary/40" : "bg-border"
                    }`} />
                  )}
                  <div className={`relative z-10 h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    isCurrent
                      ? "bg-primary text-primary-foreground ring-2 ring-primary/20"
                      : isCompleted
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {isCompleted ? <Check className="h-3 w-3" /> : (i + 1)}
                  </div>
                </div>
                <p className={`text-[9px] font-medium uppercase tracking-wider ${
                  isCurrent ? "text-primary" : isCompleted ? "text-primary/60" : "text-muted-foreground/50"
                }`}>{stage.label}</p>
                {historyEntry && (
                  <p className="text-[8px] text-muted-foreground/50 mt-0.5">{historyEntry.date.split(" ")[0]}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main content 2-column */}
      <div className="px-4 sm:px-8 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preference / Search criteria */}
          {lead.preference && (
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">¿Qué busca el cliente?</h3>
                <button className="text-[11px] text-primary hover:underline flex items-center gap-1"><Pencil className="h-3 w-3" /> Editar preferencia</button>
              </div>
              <p className="text-[12px] text-foreground leading-relaxed">
                {lead.preference.split("·").map((part, i) => (
                  <span key={i}>
                    {i > 0 && <span className="text-muted-foreground mx-1">·</span>}
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal">{part.trim()}</Badge>
                  </span>
                ))}
              </p>
            </div>
          )}

          {/* Matched properties */}
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Propiedades vinculadas</h3>
              <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1"><Plus className="h-3 w-3" /> Gestionar</Button>
            </div>

            {/* Tabs for match status */}
            <Tabs defaultValue="selected" className="w-full">
              <TabsList className="h-7 bg-muted/50">
                <TabsTrigger value="matched" className="text-[11px] h-6 px-2">Coincidentes ({lead.matchedProperties.length})</TabsTrigger>
                <TabsTrigger value="selected" className="text-[11px] h-6 px-2">Seleccionadas ({lead.matchedProperties.filter(p => p.status === "confirmed").length})</TabsTrigger>
                <TabsTrigger value="visited" className="text-[11px] h-6 px-2">Visitadas ({lead.matchedProperties.filter(p => p.status === "visited").length})</TabsTrigger>
                <TabsTrigger value="discarded" className="text-[11px] h-6 px-2">Descartadas (0)</TabsTrigger>
              </TabsList>
              <TabsContent value="matched" className="mt-3 space-y-2">
                {lead.matchedProperties.map(mp => <MatchedPropertyRow key={mp.id} mp={mp} />)}
              </TabsContent>
              <TabsContent value="selected" className="mt-3 space-y-2">
                {lead.matchedProperties.filter(p => p.status === "confirmed").map(mp => <MatchedPropertyRow key={mp.id} mp={mp} />)}
              </TabsContent>
              <TabsContent value="visited" className="mt-3 space-y-2">
                {lead.matchedProperties.filter(p => p.status === "visited").map(mp => <MatchedPropertyRow key={mp.id} mp={mp} />)}
              </TabsContent>
              <TabsContent value="discarded" className="mt-3">
                <p className="text-[12px] text-muted-foreground py-4 text-center">Sin propiedades descartadas</p>
              </TabsContent>
            </Tabs>
          </div>

          {/* Notes / Activity */}
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3 mb-4">
              <Input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Escribe una nota..."
                className="flex-1 h-9 text-[13px]"
              />
              <Button size="sm" className="h-9 text-[12px]">Crear</Button>
              <button className="text-muted-foreground hover:text-foreground p-1"><Paperclip className="h-4 w-4" /></button>
            </div>

            <Tabs defaultValue="notes">
              <TabsList className="h-7 bg-muted/50">
                <TabsTrigger value="notes" className="text-[11px] h-6 px-2">Notas</TabsTrigger>
                <TabsTrigger value="logs" className="text-[11px] h-6 px-2">Logs</TabsTrigger>
                <TabsTrigger value="registers" className="text-[11px] h-6 px-2">Registros</TabsTrigger>
              </TabsList>
              <TabsContent value="notes" className="mt-3 space-y-4">
                {lead.notes.length === 0 && (
                  <p className="text-[12px] text-muted-foreground py-4 text-center">Sin notas aún</p>
                )}
                {lead.notes.map(note => (
                  <div key={note.id} className="border-l-2 border-border pl-3 py-1">
                    {note.isSystem && (
                      <div className="mb-1">
                        <p className="text-[10px] font-medium text-emerald-600">System log:</p>
                        <p className="text-[11px] text-emerald-600">{note.systemType}</p>
                      </div>
                    )}
                    <p className="text-[12px] text-foreground leading-relaxed">{note.text}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{note.date} · {note.author} <button className="text-destructive/60 hover:text-destructive ml-2">Delete</button></p>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="logs" className="mt-3">
                <p className="text-[12px] text-muted-foreground py-4 text-center">Historial del sistema</p>
              </TabsContent>
              <TabsContent value="registers" className="mt-3">
                <p className="text-[12px] text-muted-foreground py-4 text-center">Sin registros</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Property chosen */}
          {lead.property && (
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Propiedad principal</h3>
              <div className="flex gap-3">
                <div className="w-20 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
                  <img src={lead.property.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-primary">{lead.property.title} <span className="text-muted-foreground font-normal">{lead.property.ref}</span></p>
                  <p className="text-[11px] text-muted-foreground">{lead.property.location}</p>
                  <p className="text-[12px] font-medium mt-0.5">{lead.type === "rent" ? "Alquiler" : "Venta"} {lead.property.price}</p>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <Badge variant="outline" className="text-[10px] border-emerald-300 text-emerald-600">Confirmed</Badge>
              </div>
            </div>
          )}

          {/* Visits */}
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Visitas</h3>
              <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1"><CalendarDays className="h-3 w-3" />Agendar</Button>
            </div>
            {lead.visits.length === 0 ? (
              <p className="text-[11px] text-muted-foreground">Sin visitas recientes.</p>
            ) : (
              <div className="space-y-2">
                {lead.visits.map(v => (
                  <div key={v.id} className="flex items-center gap-2 text-[11px]">
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
                      v.status === "completed" ? "bg-emerald-100 text-emerald-600" :
                      v.status === "scheduled" ? "bg-blue-100 text-blue-600" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {v.status === "completed" ? <CheckCircle2 className="h-3 w-3" /> :
                       v.status === "scheduled" ? <Clock className="h-3 w-3" /> :
                       <XCircle className="h-3 w-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-foreground">{v.propertyTitle}</p>
                      <p className="text-muted-foreground">{v.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tasks */}
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tareas pendientes</h3>
              <button className="text-[11px] text-primary hover:underline">Añadir</button>
            </div>
            {lead.tasks.length === 0 ? (
              <p className="text-[11px] text-muted-foreground">Sin tareas recientes.</p>
            ) : (
              <div className="space-y-2">
                {lead.tasks.map(t => (
                  <div key={t.id} className="flex items-center gap-2 text-[12px]">
                    <div className={`h-4 w-4 rounded border flex items-center justify-center ${
                      t.done ? "bg-emerald-100 border-emerald-300 text-emerald-600" : "border-border"
                    }`}>
                      {t.done && <Check className="h-3 w-3" />}
                    </div>
                    <span className={t.done ? "line-through text-muted-foreground" : "text-foreground"}>{t.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Matched Property Row ─── */
const MatchedPropertyRow = ({ mp }: { mp: { id: string; title: string; location: string; price: string; ref: string; image: string; status: string } }) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
    confirmed: { label: "Confirmada", className: "border-emerald-300 text-emerald-600 bg-emerald-50" },
    pending: { label: "Pendiente", className: "border-amber-300 text-amber-600 bg-amber-50" },
    visited: { label: "Visitada", className: "border-violet-300 text-violet-600 bg-violet-50" },
    sent: { label: "Enviada", className: "border-blue-300 text-blue-600 bg-blue-50" },
    discarded: { label: "Descartada", className: "border-muted text-muted-foreground" },
  };

  const status = statusConfig[mp.status] || statusConfig.pending;

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
      <div className="w-14 h-10 rounded bg-muted overflow-hidden shrink-0">
        <img src={mp.image} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-primary truncate">
          {mp.title} <span className="text-muted-foreground font-normal">{mp.ref}</span>
        </p>
        <p className="text-[11px] text-muted-foreground">{mp.location} · {mp.price}</p>
      </div>
      <Badge variant="outline" className={`text-[10px] px-1.5 h-5 ${status.className}`}>{status.label}</Badge>
      <div className="flex items-center gap-1">
        <button className="text-[10px] text-primary/60 hover:text-primary hover:underline">Visitada</button>
        <button className="text-[10px] text-destructive/60 hover:text-destructive hover:underline">Descartar</button>
      </div>
    </div>
  );
};

export default OpportunityDetailPage;
