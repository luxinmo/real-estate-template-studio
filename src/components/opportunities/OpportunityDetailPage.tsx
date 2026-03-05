import { useState } from "react";
import {
  ArrowLeft, Phone, Mail, Flame, Check, Clock, Plus,
  CalendarDays, CheckCircle2, XCircle, Send, Eye, Sparkles,
  Globe, MailOpen, PhoneCall, StickyNote, ArrowRightCircle,
  Lightbulb, TrendingUp, MapPin, BedDouble, Bath, Maximize, Euro,
  MoreHorizontal, Star, ChevronRight, AlertCircle, Zap,
  ExternalLink, Heart, ThumbsUp, ThumbsDown, Timer, Activity,
  MessageSquare, Camera, Home, Paperclip
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockLeads, pipelineStages, type Lead, type TimelineEvent, type AISuggestion, type MatchedProperty } from "./mock-data";

import img1 from "@/assets/property-detail-1.jpg";
import img2 from "@/assets/property-detail-2.jpg";
import img3 from "@/assets/property-detail-3.jpg";
import img4 from "@/assets/property-detail-4.jpg";
import img5 from "@/assets/property-detail-5.jpg";
import prop1 from "@/assets/property-1.jpg";
import prop2 from "@/assets/property-2.jpg";
import prop3 from "@/assets/property-3.jpg";

const propertyImages = [img1, img2, img3, img4, img5, prop1, prop2, prop3];
const getPropertyImage = (index: number) => propertyImages[index % propertyImages.length];

interface Props {
  leadId: string;
  onBack: () => void;
}

const OpportunityDetailPage = ({ leadId, onBack }: Props) => {
  const lead = mockLeads.find(l => l.id === leadId) || mockLeads[4];
  const [noteText, setNoteText] = useState("");
  const [timelineFilter, setTimelineFilter] = useState<"all" | "actions" | "web" | "system">("all");

  const filteredTimeline = lead.timeline
    .filter(ev => {
      if (timelineFilter === "all") return true;
      if (timelineFilter === "web") return ["page_view", "email_opened"].includes(ev.type);
      if (timelineFilter === "actions") return ["note", "call", "property_sent", "visit_scheduled", "visit_completed", "task_completed"].includes(ev.type);
      return ["stage_change"].includes(ev.type);
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  // Stats
  const webVisits = lead.timeline.filter(e => e.type === "page_view").length;
  const completedVisits = lead.visits.filter(v => v.status === "completed").length;
  const scheduledVisits = lead.visits.filter(v => v.status === "scheduled").length;
  const pendingTasks = lead.tasks.filter(t => !t.done).length;
  const doneTasks = lead.tasks.filter(t => t.done).length;
  const interestScore = Math.min(100, webVisits * 12 + completedVisits * 25 + (lead.isHot ? 15 : 0));
  const activeSuggestions = lead.aiSuggestions.filter(s => !s.dismissed);

  // Pipeline progress
  const currentStageIndex = pipelineStages.findIndex(s => s.key === lead.stage);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* ── HEADER ── */}
      <div className="shrink-0 bg-card border-b border-border">
        <div className="flex items-center justify-between px-5 h-14">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onBack} className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors">
              <ArrowLeft className="h-4 w-4 text-foreground" />
            </button>
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
              {lead.contactName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold text-foreground">{lead.contactName}</h1>
                {lead.isHot && (
                  <span className="flex items-center gap-0.5 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                    <Flame className="h-3 w-3" /> Hot Lead
                  </span>
                )}
                <Badge variant="outline" className={`text-[10px] font-medium px-2 py-0.5 ${
                  lead.type === "rent" ? "text-blue-600 border-blue-200 bg-blue-50" : "text-emerald-600 border-emerald-200 bg-emerald-50"
                }`}>
                  {lead.type === "rent" ? "Alquiler" : "Venta"}
                </Badge>
                {lead.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-[10px] px-2 py-0.5 border-violet-200 text-violet-700 bg-violet-50">{tag}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</span>
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>
                <span className="font-mono text-muted-foreground/60">{lead.ref}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5"><Phone className="h-3.5 w-3.5" />Llamar</Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5"><Mail className="h-3.5 w-3.5" />Email</Button>
            <Button size="sm" className="h-8 text-xs gap-1.5"><Send className="h-3.5 w-3.5" />Enviar propiedades</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Pipeline */}
        <div className="px-5 pb-3">
          <div className="flex items-center">
            {pipelineStages.map((stage, i) => {
              const isCompleted = lead.stageHistory.some(h => h.stage === stage.key);
              const isCurrent = stage.key === lead.stage;
              return (
                <div key={stage.key} className="flex items-center flex-1 last:flex-none">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${
                    isCurrent
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : isCompleted
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground/40"
                  }`}>
                    {isCompleted && !isCurrent && <Check className="h-3 w-3" />}
                    {isCurrent && <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />}
                    {stage.label}
                  </div>
                  {i < pipelineStages.length - 1 && (
                    <div className={`flex-1 h-px mx-1 ${isCompleted ? "bg-primary/30" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── TWO-PANEL BODY ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ═══ LEFT: WORKSPACE ═══ */}
        <div className="flex-1 overflow-auto">
          <div className="p-5 space-y-5 max-w-[900px]">

            {/* ── Quick Stats ── */}
            <div className="grid grid-cols-4 gap-3">
              <StatCard
                icon={<Activity className="h-4 w-4" />}
                label="Interés"
                value={`${interestScore}%`}
                color={interestScore > 70 ? "text-emerald-600" : interestScore > 40 ? "text-amber-600" : "text-muted-foreground"}
                detail={`${webVisits} visitas web`}
              />
              <StatCard
                icon={<Camera className="h-4 w-4" />}
                label="Visitas"
                value={`${completedVisits}/${completedVisits + scheduledVisits}`}
                color="text-blue-600"
                detail={scheduledVisits > 0 ? `${scheduledVisits} programada(s)` : "Sin programar"}
              />
              <StatCard
                icon={<CheckCircle2 className="h-4 w-4" />}
                label="Tareas"
                value={`${doneTasks}/${doneTasks + pendingTasks}`}
                color={pendingTasks > 0 ? "text-amber-600" : "text-emerald-600"}
                detail={pendingTasks > 0 ? `${pendingTasks} pendiente(s)` : "Todo al día"}
              />
              <StatCard
                icon={<Home className="h-4 w-4" />}
                label="Propiedades"
                value={`${lead.matchedProperties.length}`}
                color="text-violet-600"
                detail={`${lead.matchedProperties.filter(p => p.status === "confirmed").length} seleccionada(s)`}
              />
            </div>

            {/* ── AI Suggestions ── */}
            {activeSuggestions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <h3 className="text-xs font-semibold text-foreground">Sugerencias del sistema</h3>
                  <span className="text-[10px] text-muted-foreground">· {activeSuggestions.length} activas</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeSuggestions.map((s, i) => (
                    <SuggestionCard key={s.id} suggestion={s} imageIndex={i} />
                  ))}
                </div>
              </div>
            )}

            {/* ── Search Criteria (compact) ── */}
            {lead.searchCriteria && (
              <div className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-foreground">Criterios de búsqueda</h3>
                  <button className="text-[11px] text-primary hover:underline">Editar criterios</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lead.searchCriteria.priceMin != null && (
                    <CriteriaTag icon={<Euro className="h-3 w-3" />} text={`${lead.searchCriteria.priceMin.toLocaleString()}€ — ${lead.searchCriteria.priceMax?.toLocaleString()}€`} />
                  )}
                  {lead.searchCriteria.propertyType?.map(t => (
                    <CriteriaTag key={t} icon={<Home className="h-3 w-3" />} text={t} />
                  ))}
                  {lead.searchCriteria.bedrooms && (
                    <CriteriaTag icon={<BedDouble className="h-3 w-3" />} text={`${lead.searchCriteria.bedrooms}+ hab`} />
                  )}
                  {lead.searchCriteria.locations?.map(l => (
                    <CriteriaTag key={l} icon={<MapPin className="h-3 w-3" />} text={l} />
                  ))}
                  {lead.searchCriteria.minArea && (
                    <CriteriaTag icon={<Maximize className="h-3 w-3" />} text={`${lead.searchCriteria.minArea}+ m²`} />
                  )}
                </div>
              </div>
            )}

            {/* ── Properties Grid ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-xs font-semibold text-foreground">Propiedades vinculadas</h3>
                  <div className="flex items-center gap-1">
                    {["all", "confirmed", "sent", "visited", "discarded"].map(status => {
                      const count = status === "all" ? lead.matchedProperties.length : lead.matchedProperties.filter(p => p.status === status).length;
                      const labels: Record<string, string> = { all: "Todas", confirmed: "Seleccionadas", sent: "Enviadas", visited: "Visitadas", discarded: "Descartadas" };
                      return (
                        <button key={status} className="px-2 py-0.5 rounded-md text-[10px] font-medium text-muted-foreground hover:bg-muted transition-colors">
                          {labels[status]} <span className="text-muted-foreground/50">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1"><Sparkles className="h-3 w-3" />Auto-match</Button>
                  <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1"><Plus className="h-3 w-3" />Vincular</Button>
                </div>
              </div>

              {lead.matchedProperties.length === 0 ? (
                <div className="bg-card rounded-xl border border-dashed border-border p-8 text-center">
                  <Home className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Sin propiedades vinculadas</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Usa "Auto-match" para buscar coincidencias automáticas</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lead.matchedProperties.map((mp, i) => (
                    <PropertyCard key={mp.id} property={mp} imageIndex={i} lead={lead} />
                  ))}
                </div>
              )}
            </div>

            {/* ── Visits & Tasks ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Visits */}
              <div className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-foreground">Visitas</h3>
                  <Button variant="ghost" size="sm" className="h-6 text-[11px] gap-1 text-primary"><CalendarDays className="h-3 w-3" />Agendar</Button>
                </div>
                {lead.visits.length === 0 ? (
                  <p className="text-xs text-muted-foreground/60 py-4 text-center">Sin visitas programadas</p>
                ) : (
                  <div className="space-y-2">
                    {lead.visits.map(v => (
                      <div key={v.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/30 border border-border/50">
                        <div className={`mt-0.5 h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                          v.status === "completed" ? "bg-emerald-100 text-emerald-600" :
                          v.status === "scheduled" ? "bg-blue-100 text-blue-600" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {v.status === "completed" ? <CheckCircle2 className="h-3.5 w-3.5" /> :
                           v.status === "scheduled" ? <Clock className="h-3.5 w-3.5" /> :
                           <XCircle className="h-3.5 w-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground">{v.propertyTitle}</p>
                          <p className="text-[11px] text-muted-foreground tabular-nums">{v.date}</p>
                        </div>
                        <Badge variant="outline" className={`text-[9px] px-1.5 h-5 ${
                          v.status === "completed" ? "text-emerald-600 border-emerald-200 bg-emerald-50" :
                          v.status === "scheduled" ? "text-blue-600 border-blue-200 bg-blue-50" :
                          "text-muted-foreground"
                        }`}>
                          {v.status === "completed" ? "Realizada" : v.status === "scheduled" ? "Programada" : "Cancelada"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tasks */}
              <div className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-foreground">Tareas pendientes</h3>
                  <Button variant="ghost" size="sm" className="h-6 text-[11px] gap-1 text-primary"><Plus className="h-3 w-3" />Nueva</Button>
                </div>
                {lead.tasks.length === 0 ? (
                  <p className="text-xs text-muted-foreground/60 py-4 text-center">Sin tareas pendientes</p>
                ) : (
                  <div className="space-y-1.5">
                    {lead.tasks.map(t => (
                      <div key={t.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                        <button className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                          t.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-border hover:border-primary"
                        }`}>
                          {t.done && <Check className="h-3 w-3" />}
                        </button>
                        <span className={`text-xs flex-1 ${t.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.title}</span>
                        {t.dueDate && <span className="text-[10px] text-muted-foreground tabular-nums">{t.dueDate}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT: TIMELINE ═══ */}
        <div className="w-[380px] shrink-0 flex flex-col border-l border-border bg-card overflow-hidden">
          {/* Agent info */}
          <div className="shrink-0 px-4 py-3 border-b border-border flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
              {lead.agent.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">{lead.agent}</p>
              <p className="text-[10px] text-muted-foreground">Agente asignado · Origen: {lead.origin}</p>
            </div>
          </div>

          {/* Note composer */}
          <div className="shrink-0 p-3 border-b border-border">
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1.5">
              <Input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Escribir nota o log..."
                className="flex-1 h-7 text-xs border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <button className="p-1 text-muted-foreground hover:text-foreground rounded"><Paperclip className="h-3.5 w-3.5" /></button>
              <Button size="sm" className="h-7 text-[11px] px-2.5 rounded-md">Publicar</Button>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <button className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-muted-foreground hover:bg-muted transition-colors"><Phone className="h-3 w-3" />Log llamada</button>
              <button className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-muted-foreground hover:bg-muted transition-colors"><CalendarDays className="h-3 w-3" />Agendar visita</button>
              <button className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-muted-foreground hover:bg-muted transition-colors"><CheckCircle2 className="h-3 w-3" />Añadir tarea</button>
            </div>
          </div>

          {/* Timeline filters */}
          <div className="shrink-0 px-3 pt-2.5 pb-2 flex items-center gap-1 border-b border-border">
            {[
              { key: "all" as const, label: "Todo", count: lead.timeline.length },
              { key: "actions" as const, label: "Acciones" },
              { key: "web" as const, label: "Actividad web" },
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
          </div>

          {/* Timeline */}
          <ScrollArea className="flex-1">
            <div className="p-3">
              {filteredTimeline.length === 0 ? (
                <p className="text-xs text-muted-foreground py-8 text-center">Sin actividad</p>
              ) : (
                <div className="relative">
                  <div className="absolute left-[11px] top-4 bottom-4 w-px bg-border" />
                  {filteredTimeline.map((ev, i) => {
                    const prevDate = i > 0 ? filteredTimeline[i - 1].date.split(" ")[0] : null;
                    const currentDate = ev.date.split(" ")[0];
                    const showDateHeader = currentDate !== prevDate;
                    return (
                      <div key={ev.id}>
                        {showDateHeader && (
                          <div className="relative pl-8 py-2">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">{currentDate}</span>
                          </div>
                        )}
                        <TimelineRow event={ev} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

/* ─── Stat Card ─── */
const StatCard = ({ icon, label, value, color, detail }: { icon: React.ReactNode; label: string; value: string; color: string; detail: string }) => (
  <div className="bg-card rounded-xl border border-border p-3.5">
    <div className="flex items-center justify-between mb-2">
      <span className="text-muted-foreground">{icon}</span>
      <span className={`text-lg font-bold tabular-nums ${color}`}>{value}</span>
    </div>
    <p className="text-[11px] font-medium text-foreground">{label}</p>
    <p className="text-[10px] text-muted-foreground">{detail}</p>
  </div>
);

/* ─── AI Suggestion Card ─── */
const SuggestionCard = ({ suggestion, imageIndex }: { suggestion: AISuggestion; imageIndex: number }) => {
  const isProperty = suggestion.type === "property";
  const priorityStyles = {
    high: "border-amber-200 bg-amber-50/50",
    medium: "border-blue-200 bg-blue-50/30",
    low: "border-border bg-muted/20",
  };
  const iconMap = {
    property: <Home className="h-3.5 w-3.5 text-violet-500" />,
    action: <Zap className="h-3.5 w-3.5 text-amber-500" />,
    insight: <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />,
  };

  return (
    <div className={`rounded-xl border p-3 ${priorityStyles[suggestion.priority]} transition-all hover:shadow-sm`}>
      <div className="flex items-start gap-2.5">
        {isProperty && (
          <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0">
            <img src={getPropertyImage(imageIndex + 3)} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            {iconMap[suggestion.type]}
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {suggestion.type === "property" ? "Propiedad sugerida" : suggestion.type === "action" ? "Acción recomendada" : "Insight"}
            </span>
            {suggestion.priority === "high" && <AlertCircle className="h-3 w-3 text-amber-500" />}
          </div>
          <p className="text-xs font-medium text-foreground leading-snug">{suggestion.title}</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{suggestion.description}</p>
        </div>
      </div>
      {suggestion.actionLabel && (
        <div className="flex items-center gap-2 mt-2.5">
          <Button size="sm" className="h-7 text-[11px] flex-1">{suggestion.actionLabel}</Button>
          <Button variant="ghost" size="sm" className="h-7 text-[11px] text-muted-foreground">Descartar</Button>
        </div>
      )}
    </div>
  );
};

/* ─── Criteria Tag ─── */
const CriteriaTag = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted/60 border border-border/50 px-2.5 py-1.5 text-[11px] font-medium text-foreground">
    <span className="text-muted-foreground">{icon}</span>
    {text}
  </span>
);

/* ─── Property Card ─── */
const PropertyCard = ({ property, imageIndex, lead }: { property: MatchedProperty; imageIndex: number; lead: Lead }) => {
  const statusStyles: Record<string, { label: string; color: string; bg: string }> = {
    confirmed: { label: "Seleccionada", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
    pending: { label: "Pendiente", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
    visited: { label: "Visitada", color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
    sent: { label: "Enviada", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
    discarded: { label: "Descartada", color: "text-muted-foreground", bg: "bg-muted border-border" },
  };
  const s = statusStyles[property.status] || statusStyles.pending;

  // Fake match percentage
  const matchPct = property.status === "confirmed" ? 97 : property.status === "visited" ? 92 : property.status === "sent" ? 88 : 85;

  // Check if visited
  const wasVisited = lead.visits.some(v => v.propertyRef === property.ref && v.status === "completed");
  const isScheduled = lead.visits.some(v => v.propertyRef === property.ref && v.status === "scheduled");

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden group hover:shadow-sm transition-all">
      {/* Image */}
      <div className="relative h-32 overflow-hidden">
        <img src={getPropertyImage(imageIndex)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {/* Match badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-white/90 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
          <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />{matchPct}% match
        </div>
        {/* Status badge */}
        <div className={`absolute top-2 right-2 rounded-md border px-1.5 py-0.5 text-[9px] font-semibold ${s.color} ${s.bg}`}>
          {s.label}
        </div>
        {/* Price overlay */}
        <div className="absolute bottom-2 left-2">
          <span className="text-sm font-bold text-white">{property.price}</span>
        </div>
        {/* Quick actions */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="h-6 w-6 rounded-md bg-white/80 flex items-center justify-center hover:bg-white transition-colors"><Send className="h-3 w-3 text-foreground" /></button>
          <button className="h-6 w-6 rounded-md bg-white/80 flex items-center justify-center hover:bg-white transition-colors"><Eye className="h-3 w-3 text-foreground" /></button>
          <button className="h-6 w-6 rounded-md bg-white/80 flex items-center justify-center hover:bg-white transition-colors"><Heart className="h-3 w-3 text-foreground" /></button>
        </div>
      </div>
      {/* Info */}
      <div className="p-3">
        <p className="text-xs font-semibold text-foreground truncate">{property.title}</p>
        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
          <MapPin className="h-3 w-3" />{property.location}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] font-mono text-muted-foreground/60">Ref: {property.ref}</span>
          <span className="flex-1" />
          {wasVisited && (
            <span className="flex items-center gap-0.5 text-[9px] font-medium text-emerald-600 bg-emerald-50 rounded px-1.5 py-0.5">
              <CheckCircle2 className="h-2.5 w-2.5" />Visitada
            </span>
          )}
          {isScheduled && (
            <span className="flex items-center gap-0.5 text-[9px] font-medium text-blue-600 bg-blue-50 rounded px-1.5 py-0.5">
              <Clock className="h-2.5 w-2.5" />Visita programada
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Timeline Row ─── */
const TimelineRow = ({ event }: { event: TimelineEvent }) => {
  const config: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    note: { icon: <StickyNote className="h-3 w-3" />, color: "bg-muted text-muted-foreground", label: "Nota" },
    stage_change: { icon: <ArrowRightCircle className="h-3 w-3" />, color: "bg-primary/10 text-primary", label: "Cambio etapa" },
    property_sent: { icon: <Send className="h-3 w-3" />, color: "bg-blue-100 text-blue-600", label: "Envío" },
    property_viewed: { icon: <Eye className="h-3 w-3" />, color: "bg-violet-100 text-violet-600", label: "Vista" },
    visit_scheduled: { icon: <CalendarDays className="h-3 w-3" />, color: "bg-cyan-100 text-cyan-600", label: "Visita" },
    visit_completed: { icon: <CheckCircle2 className="h-3 w-3" />, color: "bg-emerald-100 text-emerald-600", label: "Visita" },
    page_view: { icon: <Globe className="h-3 w-3" />, color: "bg-violet-100 text-violet-600", label: "Web" },
    email_opened: { icon: <MailOpen className="h-3 w-3" />, color: "bg-sky-100 text-sky-600", label: "Email" },
    call: { icon: <PhoneCall className="h-3 w-3" />, color: "bg-emerald-100 text-emerald-600", label: "Llamada" },
    task_completed: { icon: <CheckCircle2 className="h-3 w-3" />, color: "bg-emerald-100 text-emerald-600", label: "Tarea" },
    ai_suggestion: { icon: <Sparkles className="h-3 w-3" />, color: "bg-amber-100 text-amber-600", label: "IA" },
  };
  const c = config[event.type] || config.note;

  return (
    <div className="relative pl-8 py-2 group hover:bg-muted/20 rounded-lg transition-colors">
      <div className={`absolute left-[4px] top-[12px] h-[18px] w-[18px] rounded-full flex items-center justify-center ${c.color} ring-2 ring-card`}>
        {c.icon}
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className={`text-[9px] font-semibold uppercase tracking-wider px-1 py-0.5 rounded ${c.color}`}>{c.label}</span>
          <span className="text-[9px] text-muted-foreground/40 tabular-nums">{event.date.split(" ")[1] || ""}</span>
        </div>
        <p className="text-xs font-medium text-foreground leading-snug mt-0.5">{event.title}</p>
        {event.description && (
          <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{event.description}</p>
        )}
        {event.meta?.duration && (
          <span className="inline-flex items-center gap-0.5 text-[9px] text-violet-600 bg-violet-50 rounded px-1.5 py-0.5 mt-1">
            <Timer className="h-2.5 w-2.5" />{event.meta.duration}
          </span>
        )}
        {event.author && (
          <p className="text-[9px] text-muted-foreground/40 mt-0.5">por {event.author}</p>
        )}
      </div>
    </div>
  );
};

export default OpportunityDetailPage;
