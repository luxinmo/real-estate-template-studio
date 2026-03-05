import { useState } from "react";
import { ArrowLeft, Pencil, Archive, Trophy, Phone, AtSign, Flame, Tag, Check, Clock, Plus, Paperclip, CalendarDays, CheckCircle2, XCircle, MoreHorizontal, Send, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mockLeads, pipelineStages, type Lead } from "./mock-data";

interface Props {
  leadId: string;
  onBack: () => void;
}

const OpportunityDetailPage = ({ leadId, onBack }: Props) => {
  const lead = mockLeads.find(l => l.id === leadId) || mockLeads[4];
  const [noteText, setNoteText] = useState("");
  const [activeTab, setActiveTab] = useState("activity");

  return (
    <div className="flex-1 overflow-auto bg-background">
      {/* Compact top bar */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 sm:px-6 h-12">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onBack} className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="text-[12px] font-mono text-muted-foreground">{lead.ref}</span>
            <Badge variant="outline" className={`text-[10px] font-semibold px-1.5 py-0 h-4 rounded-sm ${
              lead.type === "rent" ? "text-blue-600 border-blue-200 bg-blue-50" : "text-emerald-600 border-emerald-200 bg-emerald-50"
            }`}>
              {lead.type === "rent" ? "Alquiler" : "Venta"}
            </Badge>
            {lead.isHot && <Flame className="h-3.5 w-3.5 text-amber-500" />}
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" className="h-7 text-[11px] text-muted-foreground"><Archive className="h-3 w-3 mr-1" />Archivar</Button>
            <Button variant="ghost" size="sm" className="h-7 text-[11px] text-emerald-600"><Trophy className="h-3 w-3 mr-1" />Ganada</Button>
            <Button size="sm" className="h-7 text-[11px]">Editar</Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-10">
        {/* Contact card */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-[15px] font-semibold text-muted-foreground">
              {lead.contactName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground tracking-tight">{lead.contactName}</h1>
              <div className="flex items-center gap-3 mt-0.5 text-[12px] text-muted-foreground">
                <span className="flex items-center gap-1"><AtSign className="h-3 w-3" />{lead.email}</span>
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>
              </div>
              {lead.tags.length > 0 && (
                <div className="flex items-center gap-1 mt-1.5">
                  {lead.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-amber-300 text-amber-700 bg-amber-50">{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="text-right text-[11px] text-muted-foreground">
            <p>Agente: <strong className="text-foreground">{lead.agent}</strong></p>
            <p>Origen: {lead.origin}</p>
          </div>
        </div>

        {/* Pipeline — minimal horizontal stepper */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <div className="flex items-center">
            {pipelineStages.map((stage, i) => {
              const historyEntry = lead.stageHistory.find(h => h.stage === stage.key);
              const isCompleted = !!historyEntry;
              const isCurrent = stage.key === lead.stage;
              return (
                <div key={stage.key} className="flex items-center flex-1 last:flex-0">
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                      isCurrent
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : isCompleted
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground/40"
                    }`}>
                      {isCompleted && !isCurrent ? <Check className="h-3 w-3" /> : (i + 1)}
                    </div>
                    <span className={`mt-1.5 text-[9px] font-medium ${
                      isCurrent ? "text-foreground" : isCompleted ? "text-muted-foreground" : "text-muted-foreground/30"
                    }`}>{stage.label}</span>
                    {historyEntry && (
                      <span className="text-[8px] text-muted-foreground/40 tabular-nums">{historyEntry.date.split(" ")[0]}</span>
                    )}
                  </div>
                  {i < pipelineStages.length - 1 && (
                    <div className={`flex-1 h-px mx-2 mt-[-18px] ${isCompleted ? "bg-primary/20" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
          {/* Main column */}
          <div className="space-y-5">
            {/* Preferences */}
            {lead.preference && (
              <div className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Búsqueda del cliente</h3>
                  <button className="text-[10px] text-primary hover:underline">Editar</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {lead.preference.split("·").map((part, i) => (
                    <span key={i} className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] text-foreground">{part.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Properties */}
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Propiedades</h3>
                <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1"><Plus className="h-3 w-3" />Vincular</Button>
              </div>

              <Tabs defaultValue="all">
                <TabsList className="h-7 bg-muted/40 p-0.5">
                  <TabsTrigger value="all" className="text-[10px] h-6 px-2.5">Todas ({lead.matchedProperties.length})</TabsTrigger>
                  <TabsTrigger value="confirmed" className="text-[10px] h-6 px-2.5">Seleccionadas</TabsTrigger>
                  <TabsTrigger value="visited" className="text-[10px] h-6 px-2.5">Visitadas</TabsTrigger>
                  <TabsTrigger value="discarded" className="text-[10px] h-6 px-2.5">Descartadas</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-3">
                  {lead.matchedProperties.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground py-6 text-center">Sin propiedades vinculadas</p>
                  ) : (
                    <div className="space-y-1">
                      {lead.matchedProperties.map(mp => (
                        <PropertyRow key={mp.id} mp={mp} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="confirmed" className="mt-3">
                  <div className="space-y-1">
                    {lead.matchedProperties.filter(p => p.status === "confirmed").map(mp => <PropertyRow key={mp.id} mp={mp} />)}
                  </div>
                </TabsContent>
                <TabsContent value="visited" className="mt-3">
                  <div className="space-y-1">
                    {lead.matchedProperties.filter(p => p.status === "visited").map(mp => <PropertyRow key={mp.id} mp={mp} />)}
                  </div>
                </TabsContent>
                <TabsContent value="discarded" className="mt-3">
                  <p className="text-[11px] text-muted-foreground py-6 text-center">Sin propiedades descartadas</p>
                </TabsContent>
              </Tabs>
            </div>

            {/* Activity — Notes/Logs */}
            <div className="bg-card rounded-xl border border-border p-4">
              {/* Compose */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                <Input
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Añadir nota..."
                  className="flex-1 h-8 text-[12px] border-border"
                />
                <button className="p-1.5 text-muted-foreground hover:text-foreground"><Paperclip className="h-3.5 w-3.5" /></button>
                <Button size="sm" className="h-8 text-[11px] px-3">Publicar</Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="h-7 bg-muted/40 p-0.5">
                  <TabsTrigger value="activity" className="text-[10px] h-6 px-2.5">Actividad</TabsTrigger>
                  <TabsTrigger value="logs" className="text-[10px] h-6 px-2.5">Sistema</TabsTrigger>
                </TabsList>
                <TabsContent value="activity" className="mt-4">
                  {lead.notes.length === 0 ? (
                    <p className="text-[12px] text-muted-foreground py-8 text-center">Sin actividad registrada</p>
                  ) : (
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
                      <div className="space-y-5">
                        {lead.notes.map(note => (
                          <div key={note.id} className="relative pl-6">
                            <div className={`absolute left-0 top-1 h-4 w-4 rounded-full flex items-center justify-center ${
                              note.isSystem ? "bg-emerald-100 text-emerald-600" : "bg-muted text-muted-foreground"
                            }`}>
                              {note.isSystem ? <Check className="h-2.5 w-2.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />}
                            </div>
                            {note.isSystem && (
                              <p className="text-[10px] font-medium text-emerald-600 mb-0.5">{note.systemType}</p>
                            )}
                            <p className="text-[12px] text-foreground leading-relaxed">{note.text}</p>
                            <p className="text-[10px] text-muted-foreground/50 mt-1">{note.date} · {note.author}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="logs" className="mt-4">
                  <div className="relative">
                    <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
                    {lead.stageHistory.map((entry, i) => (
                      <div key={i} className="relative pl-6 pb-4">
                        <div className="absolute left-0 top-1 h-4 w-4 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <Check className="h-2.5 w-2.5" />
                        </div>
                        <p className="text-[11px] text-foreground">
                          Pasó a <strong>{pipelineStages.find(s => s.key === entry.stage)?.label}</strong>
                        </p>
                        <p className="text-[10px] text-muted-foreground/50">{entry.date}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Main property */}
            {lead.property && (
              <div className="bg-card rounded-xl border border-border p-3">
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Propiedad principal</h4>
                <div className="w-full aspect-[16/10] rounded-lg bg-muted overflow-hidden mb-2">
                  <img src={lead.property.image} alt="" className="w-full h-full object-cover" />
                </div>
                <p className="text-[12px] font-medium text-foreground">{lead.property.title}</p>
                <p className="text-[11px] text-muted-foreground">{lead.property.location}</p>
                <p className="text-[13px] font-semibold mt-1">{lead.property.price}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-emerald-600">Disponible</span>
                  <span className="text-[10px] text-muted-foreground ml-auto font-mono">{lead.property.ref}</span>
                </div>
              </div>
            )}

            {/* Visits */}
            <div className="bg-card rounded-xl border border-border p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Visitas</h4>
                <button className="text-[10px] text-primary hover:underline flex items-center gap-0.5"><CalendarDays className="h-3 w-3" />Agendar</button>
              </div>
              {lead.visits.length === 0 ? (
                <p className="text-[11px] text-muted-foreground/50 py-3 text-center">Sin visitas</p>
              ) : (
                <div className="space-y-2">
                  {lead.visits.map(v => (
                    <div key={v.id} className="flex items-start gap-2">
                      <div className={`mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0 ${
                        v.status === "completed" ? "bg-emerald-100 text-emerald-600" :
                        v.status === "scheduled" ? "bg-blue-100 text-blue-600" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {v.status === "completed" ? <CheckCircle2 className="h-2.5 w-2.5" /> :
                         v.status === "scheduled" ? <Clock className="h-2.5 w-2.5" /> :
                         <XCircle className="h-2.5 w-2.5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-foreground truncate">{v.propertyTitle}</p>
                        <p className="text-[10px] text-muted-foreground tabular-nums">{v.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tasks */}
            <div className="bg-card rounded-xl border border-border p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tareas</h4>
                <button className="text-[10px] text-primary hover:underline">+ Añadir</button>
              </div>
              {lead.tasks.length === 0 ? (
                <p className="text-[11px] text-muted-foreground/50 py-3 text-center">Sin tareas</p>
              ) : (
                <div className="space-y-1.5">
                  {lead.tasks.map(t => (
                    <div key={t.id} className="flex items-center gap-2">
                      <div className={`h-3.5 w-3.5 rounded border flex items-center justify-center shrink-0 ${
                        t.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-border"
                      }`}>
                        {t.done && <Check className="h-2.5 w-2.5" />}
                      </div>
                      <span className={`text-[11px] ${t.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Property Row ─── */
const PropertyRow = ({ mp }: { mp: { id: string; title: string; location: string; price: string; ref: string; image: string; status: string } }) => {
  const statusMap: Record<string, { label: string; cls: string }> = {
    confirmed: { label: "Confirmada", cls: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    pending: { label: "Pendiente", cls: "text-amber-600 bg-amber-50 border-amber-200" },
    visited: { label: "Visitada", cls: "text-violet-600 bg-violet-50 border-violet-200" },
    sent: { label: "Enviada", cls: "text-blue-600 bg-blue-50 border-blue-200" },
    discarded: { label: "Descartada", cls: "text-muted-foreground bg-muted border-border" },
  };
  const s = statusMap[mp.status] || statusMap.pending;

  return (
    <div className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-muted/30 transition-colors group">
      <div className="w-12 h-9 rounded bg-muted overflow-hidden shrink-0">
        <img src={mp.image} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-foreground truncate">{mp.title} <span className="text-muted-foreground/50 font-mono">{mp.ref}</span></p>
        <p className="text-[10px] text-muted-foreground">{mp.location} · {mp.price}</p>
      </div>
      <Badge variant="outline" className={`text-[9px] px-1.5 h-4 border ${s.cls}`}>{s.label}</Badge>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1 rounded hover:bg-accent text-muted-foreground" title="Ver"><Eye className="h-3 w-3" /></button>
        <button className="p-1 rounded hover:bg-accent text-muted-foreground" title="Enviar"><Send className="h-3 w-3" /></button>
        <button className="p-1 rounded hover:bg-destructive/10 text-muted-foreground" title="Descartar"><XCircle className="h-3 w-3" /></button>
      </div>
    </div>
  );
};

export default OpportunityDetailPage;
