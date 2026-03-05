import { useState } from "react";
import {
  ArrowLeft, Archive, Trophy, Phone, AtSign, Flame, Check, Clock, Plus,
  Paperclip, CalendarDays, CheckCircle2, XCircle, Send, Eye, Sparkles,
  Globe, Mail, MailOpen, PhoneCall, StickyNote, ArrowRightCircle,
  Lightbulb, Home, TrendingUp, Search, Pencil, ChevronDown, ChevronUp,
  ExternalLink, MapPin, BedDouble, Bath, Maximize, Euro
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockLeads, pipelineStages, type Lead, type TimelineEvent, type AISuggestion } from "./mock-data";

interface Props {
  leadId: string;
  onBack: () => void;
}

const OpportunityDetailPage = ({ leadId, onBack }: Props) => {
  const lead = mockLeads.find(l => l.id === leadId) || mockLeads[4];
  const [noteText, setNoteText] = useState("");
  const [timelineFilter, setTimelineFilter] = useState<"all" | "actions" | "web" | "system">("all");
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(true);

  const filteredTimeline = lead.timeline.filter(ev => {
    if (timelineFilter === "all") return true;
    if (timelineFilter === "web") return ["page_view", "email_opened"].includes(ev.type);
    if (timelineFilter === "actions") return ["note", "call", "property_sent", "visit_scheduled", "visit_completed", "task_completed"].includes(ev.type);
    if (timelineFilter === "system") return ["stage_change"].includes(ev.type);
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const activeSuggestions = lead.aiSuggestions.filter(s => !s.dismissed);
  const visibleSuggestions = showAllSuggestions ? activeSuggestions : activeSuggestions.slice(0, 2);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Top bar */}
      <div className="shrink-0 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 sm:px-6 h-12">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onBack} className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[11px] font-semibold text-muted-foreground">
              {lead.contactName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[14px] font-semibold text-foreground truncate">{lead.contactName}</h1>
                <span className="text-[11px] font-mono text-muted-foreground">{lead.ref}</span>
                <Badge variant="outline" className={`text-[9px] font-semibold px-1.5 py-0 h-4 rounded-sm ${
                  lead.type === "rent" ? "text-blue-600 border-blue-200 bg-blue-50" : "text-emerald-600 border-emerald-200 bg-emerald-50"
                }`}>
                  {lead.type === "rent" ? "Alquiler" : "Venta"}
                </Badge>
                {lead.isHot && <Flame className="h-3.5 w-3.5 text-amber-500" />}
                {lead.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-amber-300 text-amber-700 bg-amber-50">{tag}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><AtSign className="h-3 w-3" />{lead.email}</span>
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>
                <span>Agente: <strong className="text-foreground">{lead.agent}</strong></span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" className="h-7 text-[11px] text-muted-foreground"><Archive className="h-3 w-3 mr-1" />Archivar</Button>
            <Button variant="ghost" size="sm" className="h-7 text-[11px] text-emerald-600"><Trophy className="h-3 w-3 mr-1" />Ganada</Button>
            <Button size="sm" className="h-7 text-[11px]">Editar</Button>
          </div>
        </div>

        {/* Pipeline stepper */}
        <div className="px-4 sm:px-6 pb-3">
          <div className="flex items-center gap-0">
            {pipelineStages.map((stage, i) => {
              const isCompleted = lead.stageHistory.some(h => h.stage === stage.key);
              const isCurrent = stage.key === lead.stage;
              return (
                <div key={stage.key} className="flex items-center">
                  <div className={`h-5 px-2.5 rounded-full flex items-center gap-1 text-[9px] font-semibold transition-all ${
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground/40"
                  }`}>
                    {isCompleted && !isCurrent && <Check className="h-2.5 w-2.5" />}
                    {stage.label}
                  </div>
                  {i < pipelineStages.length - 1 && (
                    <div className={`w-4 h-px ${isCompleted ? "bg-primary/30" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL — Workspace */}
        <div className="flex-1 overflow-auto border-r border-border">
          <div className="p-4 sm:p-6 space-y-5 max-w-2xl">

            {/* AI Suggestions */}
            {activeSuggestions.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/30 p-3">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    <h3 className="text-[11px] font-semibold text-amber-800">Sugerencias del sistema</h3>
                  </div>
                  <span className="text-[10px] text-amber-600">{activeSuggestions.length} activas</span>
                </div>
                <div className="space-y-2">
                  {visibleSuggestions.map(s => (
                    <SuggestionCard key={s.id} suggestion={s} />
                  ))}
                </div>
                {activeSuggestions.length > 2 && (
                  <button
                    onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                    className="text-[10px] text-amber-700 hover:underline mt-2 flex items-center gap-0.5"
                  >
                    {showAllSuggestions ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    {showAllSuggestions ? "Menos" : `Ver ${activeSuggestions.length - 2} más`}
                  </button>
                )}
              </div>
            )}

            {/* Search Criteria */}
            <div className="bg-card rounded-xl border border-border">
              <button
                onClick={() => setSearchExpanded(!searchExpanded)}
                className="flex items-center justify-between w-full p-4 text-left"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-3.5 w-3.5 text-muted-foreground" />
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Búsqueda del cliente</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={e => { e.stopPropagation(); }} className="text-[10px] text-primary hover:underline flex items-center gap-0.5">
                    <Pencil className="h-3 w-3" /> Configurar
                  </button>
                  {searchExpanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
                </div>
              </button>
              {searchExpanded && (
                <div className="px-4 pb-4 -mt-1">
                  {lead.searchCriteria ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {lead.searchCriteria.priceMin != null && (
                        <CriteriaChip icon={<Euro className="h-3 w-3" />} label="Precio" value={`${lead.searchCriteria.priceMin.toLocaleString()}€ — ${lead.searchCriteria.priceMax?.toLocaleString()}€`} />
                      )}
                      {lead.searchCriteria.propertyType && (
                        <CriteriaChip icon={<Home className="h-3 w-3" />} label="Tipo" value={lead.searchCriteria.propertyType.join(", ")} />
                      )}
                      {lead.searchCriteria.bedrooms && (
                        <CriteriaChip icon={<BedDouble className="h-3 w-3" />} label="Habitaciones" value={`${lead.searchCriteria.bedrooms}+`} />
                      )}
                      {lead.searchCriteria.locations && (
                        <CriteriaChip icon={<MapPin className="h-3 w-3" />} label="Zonas" value={lead.searchCriteria.locations.join(", ")} />
                      )}
                      {lead.searchCriteria.dealType && (
                        <CriteriaChip icon={<TrendingUp className="h-3 w-3" />} label="Operación" value={lead.searchCriteria.dealType === "rent" ? "Alquiler" : "Venta"} />
                      )}
                      {lead.searchCriteria.minArea && (
                        <CriteriaChip icon={<Maximize className="h-3 w-3" />} label="Superficie" value={`${lead.searchCriteria.minArea}+ m²`} />
                      )}
                    </div>
                  ) : lead.preference ? (
                    <div className="flex flex-wrap gap-1.5">
                      {lead.preference.split("·").map((part, i) => (
                        <span key={i} className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] text-foreground">{part.trim()}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">Sin criterios definidos. <button className="text-primary hover:underline">Configurar búsqueda</button></p>
                  )}
                </div>
              )}
            </div>

            {/* Properties — System suggested + linked */}
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Propiedades</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1"><Sparkles className="h-3 w-3" />Buscar coincidencias</Button>
                  <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1"><Plus className="h-3 w-3" />Vincular</Button>
                </div>
              </div>

              <Tabs defaultValue="all">
                <TabsList className="h-7 bg-muted/40 p-0.5">
                  <TabsTrigger value="all" className="text-[10px] h-6 px-2.5">Todas ({lead.matchedProperties.length})</TabsTrigger>
                  <TabsTrigger value="confirmed" className="text-[10px] h-6 px-2.5">Seleccionadas</TabsTrigger>
                  <TabsTrigger value="visited" className="text-[10px] h-6 px-2.5">Visitadas</TabsTrigger>
                  <TabsTrigger value="sent" className="text-[10px] h-6 px-2.5">Enviadas</TabsTrigger>
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
                {["confirmed", "visited", "sent", "discarded"].map(status => (
                  <TabsContent key={status} value={status} className="mt-3">
                    {lead.matchedProperties.filter(p => p.status === status).length === 0 ? (
                      <p className="text-[11px] text-muted-foreground py-6 text-center">Sin propiedades</p>
                    ) : (
                      <div className="space-y-1">
                        {lead.matchedProperties.filter(p => p.status === status).map(mp => (
                          <PropertyRow key={mp.id} mp={mp} />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Tasks + Visits side-by-side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Timeline */}
        <div className="w-[360px] shrink-0 flex flex-col bg-card overflow-hidden">
          {/* Note composer */}
          <div className="shrink-0 p-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Añadir nota..."
                className="flex-1 h-8 text-[12px] border-border"
              />
              <button className="p-1.5 text-muted-foreground hover:text-foreground"><Paperclip className="h-3.5 w-3.5" /></button>
              <Button size="sm" className="h-8 text-[11px] px-3">Publicar</Button>
            </div>
          </div>

          {/* Timeline filters */}
          <div className="shrink-0 px-3 pt-3 pb-2 border-b border-border">
            <div className="flex items-center gap-1">
              {[
                { key: "all" as const, label: "Todo" },
                { key: "actions" as const, label: "Acciones" },
                { key: "web" as const, label: "Web" },
                { key: "system" as const, label: "Sistema" },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setTimelineFilter(f.key)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${
                    timelineFilter === f.key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {f.label}
                </button>
              ))}
              <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">{filteredTimeline.length}</span>
            </div>
          </div>

          {/* Timeline scroll */}
          <ScrollArea className="flex-1">
            <div className="p-3">
              {filteredTimeline.length === 0 ? (
                <p className="text-[12px] text-muted-foreground py-8 text-center">Sin actividad</p>
              ) : (
                <div className="relative">
                  <div className="absolute left-[9px] top-3 bottom-3 w-px bg-border" />
                  <div className="space-y-0">
                    {filteredTimeline.map((ev, i) => {
                      const prevDate = i > 0 ? filteredTimeline[i - 1].date.split(" ")[0] : null;
                      const currentDate = ev.date.split(" ")[0];
                      const showDateHeader = currentDate !== prevDate;

                      return (
                        <div key={ev.id}>
                          {showDateHeader && (
                            <div className="relative pl-7 py-2">
                              <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60">{currentDate}</span>
                            </div>
                          )}
                          <TimelineEventRow event={ev} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

/* ─── Criteria Chip ─── */
const CriteriaChip = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-2 rounded-lg bg-muted/50 px-2.5 py-2">
    <div className="text-muted-foreground mt-0.5">{icon}</div>
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-[11px] text-foreground font-medium">{value}</p>
    </div>
  </div>
);

/* ─── AI Suggestion Card ─── */
const SuggestionCard = ({ suggestion }: { suggestion: AISuggestion }) => {
  const iconMap = {
    property: <Home className="h-3.5 w-3.5" />,
    action: <Lightbulb className="h-3.5 w-3.5" />,
    insight: <TrendingUp className="h-3.5 w-3.5" />,
  };
  const priorityColors = {
    high: "border-l-amber-500",
    medium: "border-l-blue-400",
    low: "border-l-muted-foreground/30",
  };

  return (
    <div className={`flex items-start gap-2.5 rounded-lg bg-white border border-amber-100 border-l-2 ${priorityColors[suggestion.priority]} px-3 py-2`}>
      <div className="text-amber-600 mt-0.5 shrink-0">{iconMap[suggestion.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-foreground">{suggestion.title}</p>
        <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">{suggestion.description}</p>
      </div>
      {suggestion.actionLabel && (
        <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 shrink-0 border-amber-300 text-amber-700 hover:bg-amber-100">
          {suggestion.actionLabel}
        </Button>
      )}
    </div>
  );
};

/* ─── Timeline Event Row ─── */
const TimelineEventRow = ({ event }: { event: TimelineEvent }) => {
  const config: Record<string, { icon: React.ReactNode; color: string }> = {
    note: { icon: <StickyNote className="h-2.5 w-2.5" />, color: "bg-muted text-muted-foreground" },
    stage_change: { icon: <ArrowRightCircle className="h-2.5 w-2.5" />, color: "bg-primary/10 text-primary" },
    property_sent: { icon: <Send className="h-2.5 w-2.5" />, color: "bg-blue-100 text-blue-600" },
    property_viewed: { icon: <Eye className="h-2.5 w-2.5" />, color: "bg-violet-100 text-violet-600" },
    visit_scheduled: { icon: <CalendarDays className="h-2.5 w-2.5" />, color: "bg-cyan-100 text-cyan-600" },
    visit_completed: { icon: <CheckCircle2 className="h-2.5 w-2.5" />, color: "bg-emerald-100 text-emerald-600" },
    page_view: { icon: <Globe className="h-2.5 w-2.5" />, color: "bg-violet-100 text-violet-600" },
    email_opened: { icon: <MailOpen className="h-2.5 w-2.5" />, color: "bg-sky-100 text-sky-600" },
    call: { icon: <PhoneCall className="h-2.5 w-2.5" />, color: "bg-emerald-100 text-emerald-600" },
    task_completed: { icon: <CheckCircle2 className="h-2.5 w-2.5" />, color: "bg-emerald-100 text-emerald-600" },
    ai_suggestion: { icon: <Sparkles className="h-2.5 w-2.5" />, color: "bg-amber-100 text-amber-600" },
  };

  const c = config[event.type] || config.note;

  return (
    <div className="relative pl-7 py-1.5 group hover:bg-muted/20 rounded-r-lg transition-colors">
      <div className={`absolute left-[3px] top-[10px] h-[14px] w-[14px] rounded-full flex items-center justify-center ${c.color}`}>
        {c.icon}
      </div>
      <div>
        <p className="text-[11px] font-medium text-foreground leading-tight">{event.title}</p>
        {event.description && (
          <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">{event.description}</p>
        )}
        {event.meta?.duration && (
          <span className="inline-flex items-center gap-0.5 text-[9px] text-violet-600 bg-violet-50 rounded px-1 py-0.5 mt-0.5">
            <Clock className="h-2.5 w-2.5" />{event.meta.duration}
          </span>
        )}
        <p className="text-[9px] text-muted-foreground/50 mt-0.5 tabular-nums">
          {event.date.split(" ")[1] || ""}
          {event.author && <> · {event.author}</>}
        </p>
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
