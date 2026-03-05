import { useState } from "react";
import {
  ArrowLeft, Phone, Mail, Flame, Check, Clock, Plus,
  CalendarDays, CheckCircle2, XCircle, Send, Eye, Sparkles,
  Globe, MailOpen, PhoneCall, StickyNote, ArrowRightCircle,
  MapPin, BedDouble, Bath, Maximize, Euro,
  MoreHorizontal, Star, ChevronRight, Zap, TrendingUp,
  Heart, Timer, Home, Paperclip, ExternalLink,
  ThumbsUp, ThumbsDown, AlertTriangle, Target, BarChart3,
  Calendar, FileText, MessageCircle, ChevronDown, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
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
const getImg = (i: number) => propertyImages[i % propertyImages.length];

interface Props {
  leadId: string;
  onBack: () => void;
}

const OpportunityDetailPage = ({ leadId, onBack }: Props) => {
  const lead = mockLeads.find(l => l.id === leadId) || mockLeads[4];
  const [noteText, setNoteText] = useState("");
  const [tlFilter, setTlFilter] = useState<"all" | "actions" | "web" | "system">("all");
  const [activeSection, setActiveSection] = useState<"properties" | "visits" | "tasks">("properties");

  const filteredTimeline = lead.timeline
    .filter(ev => {
      if (tlFilter === "all") return true;
      if (tlFilter === "web") return ["page_view", "email_opened"].includes(ev.type);
      if (tlFilter === "actions") return ["note", "call", "property_sent", "visit_scheduled", "visit_completed", "task_completed"].includes(ev.type);
      return ["stage_change"].includes(ev.type);
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const webVisits = lead.timeline.filter(e => e.type === "page_view").length;
  const completedVisits = lead.visits.filter(v => v.status === "completed").length;
  const scheduledVisits = lead.visits.filter(v => v.status === "scheduled").length;
  const pendingTasks = lead.tasks.filter(t => !t.done).length;
  const interestScore = Math.min(100, webVisits * 12 + completedVisits * 25 + (lead.isHot ? 15 : 0));
  const currentStageIndex = pipelineStages.findIndex(s => s.key === lead.stage);
  const activeSuggestions = lead.aiSuggestions.filter(s => !s.dismissed);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* ── COMPACT HEADER ── */}
      <div className="shrink-0 border-b border-border bg-card">
        <div className="flex items-center gap-3 px-4 h-12">
          <button onClick={onBack} className="h-7 w-7 rounded-md border border-border flex items-center justify-center hover:bg-accent transition-colors shrink-0">
            <ArrowLeft className="h-3.5 w-3.5 text-foreground" />
          </button>

          {/* Avatar + Name */}
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-[11px] font-semibold text-primary-foreground shrink-0">
            {lead.contactName.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-foreground truncate">{lead.contactName}</h1>
              {lead.isHot && <Flame className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
              <Badge variant="outline" className={`text-[9px] px-1.5 py-0 h-4 ${
                lead.type === "rent" ? "text-blue-600 border-blue-200 bg-blue-50" : "text-emerald-600 border-emerald-200 bg-emerald-50"
              }`}>
                {lead.type === "rent" ? "Alquiler" : "Venta"}
              </Badge>
              {lead.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-violet-200 text-violet-600 bg-violet-50">{tag}</Badge>
              ))}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span>{lead.email}</span>
              <span className="text-muted-foreground/30">·</span>
              <span>{lead.phone}</span>
              <span className="text-muted-foreground/30">·</span>
              <span className="font-mono text-[10px] text-muted-foreground/50">{lead.ref}</span>
            </div>
          </div>

          {/* Pipeline mini */}
          <div className="hidden lg:flex items-center gap-0.5 shrink-0">
            {pipelineStages.map((stage, i) => {
              const done = i < currentStageIndex;
              const current = i === currentStageIndex;
              return (
                <div key={stage.key} className="flex items-center gap-0.5">
                  <div className={`h-6 px-2 rounded flex items-center text-[9px] font-medium whitespace-nowrap ${
                    current ? "bg-primary text-primary-foreground" :
                    done ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground/30"
                  }`}>
                    {done && <Check className="h-2.5 w-2.5 mr-0.5" />}
                    {stage.label}
                  </div>
                  {i < pipelineStages.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground/20" />}
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1 px-2.5"><Phone className="h-3 w-3" />Llamar</Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1 px-2.5"><Mail className="h-3 w-3" />Email</Button>
            <Button size="sm" className="h-7 text-[11px] gap-1 px-2.5"><Send className="h-3 w-3" />Enviar</Button>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ═══ LEFT PANEL ═══ */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 space-y-4 max-w-[920px]">

            {/* ── ROW 1: Metrics bar ── */}
            <div className="flex items-center gap-3">
              <MetricPill icon={<Target className="h-3.5 w-3.5" />} label="Interés" value={`${interestScore}%`} accent={interestScore > 60} />
              <MetricPill icon={<Eye className="h-3.5 w-3.5" />} label="Visitas web" value={`${webVisits}`} />
              <MetricPill icon={<CalendarDays className="h-3.5 w-3.5" />} label="Visitas" value={`${completedVisits} hechas · ${scheduledVisits} prog.`} />
              <MetricPill icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Tareas" value={pendingTasks > 0 ? `${pendingTasks} pendientes` : "Al día"} warn={pendingTasks > 0} />
              <MetricPill icon={<Home className="h-3.5 w-3.5" />} label="Propiedades" value={`${lead.matchedProperties.length}`} />
            </div>

            {/* ── ROW 2: AI Suggestions (banner style) ── */}
            {activeSuggestions.length > 0 && (
              <div className="rounded-xl border border-amber-200/60 bg-amber-50/40 p-3">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="h-5 w-5 rounded-md bg-amber-100 flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-amber-600" />
                  </div>
                  <span className="text-[11px] font-semibold text-amber-800">Sugerencias inteligentes</span>
                  <span className="text-[10px] text-amber-600/60 ml-auto">{activeSuggestions.length} activas</span>
                </div>
                <div className="space-y-2">
                  {activeSuggestions.map((s, i) => (
                    <SuggestionRow key={s.id} suggestion={s} imageIndex={i} />
                  ))}
                </div>
              </div>
            )}

            {/* ── ROW 3: Search criteria (inline chips) ── */}
            {lead.searchCriteria && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mr-1">Busca:</span>
                {lead.searchCriteria.propertyType?.map(t => <CriteriaChip key={t} icon={<Home className="h-2.5 w-2.5" />} text={t} />)}
                {lead.searchCriteria.priceMin != null && (
                  <CriteriaChip icon={<Euro className="h-2.5 w-2.5" />} text={`${lead.searchCriteria.priceMin.toLocaleString()}€ — ${lead.searchCriteria.priceMax?.toLocaleString()}€`} />
                )}
                {lead.searchCriteria.bedrooms && <CriteriaChip icon={<BedDouble className="h-2.5 w-2.5" />} text={`${lead.searchCriteria.bedrooms}+ hab`} />}
                {lead.searchCriteria.locations?.map(l => <CriteriaChip key={l} icon={<MapPin className="h-2.5 w-2.5" />} text={l} />)}
                {lead.searchCriteria.minArea && <CriteriaChip icon={<Maximize className="h-2.5 w-2.5" />} text={`${lead.searchCriteria.minArea}+ m²`} />}
                <button className="text-[10px] text-primary hover:underline ml-1">Editar</button>
              </div>
            )}

            {/* ── Tabs: Properties / Visits / Tasks ── */}
            <div className="flex items-center border-b border-border gap-0">
              {([
                { key: "properties" as const, label: "Propiedades", count: lead.matchedProperties.length },
                { key: "visits" as const, label: "Visitas", count: lead.visits.length },
                { key: "tasks" as const, label: "Tareas", count: lead.tasks.length },
              ]).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveSection(tab.key)}
                  className={`px-4 py-2 text-[12px] font-medium border-b-2 transition-all ${
                    activeSection === tab.key
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  <span className={`ml-1.5 text-[10px] tabular-nums ${activeSection === tab.key ? "text-primary" : "text-muted-foreground/50"}`}>{tab.count}</span>
                </button>
              ))}
              <div className="flex-1" />
              {activeSection === "properties" && (
                <div className="flex items-center gap-1.5 pb-1">
                  <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1"><Sparkles className="h-3 w-3" />Auto-match</Button>
                  <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1"><Plus className="h-3 w-3" />Vincular</Button>
                </div>
              )}
              {activeSection === "visits" && (
                <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 mb-1"><CalendarDays className="h-3 w-3" />Agendar visita</Button>
              )}
              {activeSection === "tasks" && (
                <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 mb-1"><Plus className="h-3 w-3" />Nueva tarea</Button>
              )}
            </div>

            {/* ── TAB CONTENT ── */}
            {activeSection === "properties" && (
              <div className="space-y-3">
                {lead.matchedProperties.length === 0 ? (
                  <EmptyState icon={<Home className="h-6 w-6" />} text="Sin propiedades vinculadas" sub="Usa Auto-match para encontrar coincidencias" />
                ) : (
                  lead.matchedProperties.map((mp, i) => (
                    <PropertyRow key={mp.id} property={mp} index={i} lead={lead} />
                  ))
                )}
              </div>
            )}

            {activeSection === "visits" && (
              <div className="space-y-2">
                {lead.visits.length === 0 ? (
                  <EmptyState icon={<CalendarDays className="h-6 w-6" />} text="Sin visitas" sub="Agenda la primera visita para este cliente" />
                ) : (
                  lead.visits.map(v => (
                    <VisitRow key={v.id} visit={v} />
                  ))
                )}
              </div>
            )}

            {activeSection === "tasks" && (
              <div className="space-y-1.5">
                {lead.tasks.length === 0 ? (
                  <EmptyState icon={<CheckCircle2 className="h-6 w-6" />} text="Sin tareas" sub="Crea una tarea para este cliente" />
                ) : (
                  lead.tasks.map(t => (
                    <TaskRow key={t.id} task={t} />
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* ═══ RIGHT PANEL: TIMELINE ═══ */}
        <div className="w-[360px] shrink-0 flex flex-col border-l border-border bg-card overflow-hidden">
          {/* Agent */}
          <div className="shrink-0 px-4 py-2.5 border-b border-border flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[9px] font-semibold text-muted-foreground">
              {lead.agent.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="text-[11px] font-medium text-foreground">{lead.agent}</p>
              <p className="text-[9px] text-muted-foreground">Agente · {lead.origin}</p>
            </div>
          </div>

          {/* Composer */}
          <div className="shrink-0 p-3 border-b border-border">
            <div className="flex items-center gap-1.5 bg-muted/40 rounded-lg p-1.5">
              <Input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Escribe nota, log llamada..."
                className="flex-1 h-6 text-[11px] border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <Button size="sm" className="h-6 text-[10px] px-2 rounded-md">Publicar</Button>
            </div>
            <div className="flex items-center gap-0.5 mt-1.5">
              <QuickAction icon={<Phone className="h-2.5 w-2.5" />} label="Llamada" />
              <QuickAction icon={<CalendarDays className="h-2.5 w-2.5" />} label="Visita" />
              <QuickAction icon={<CheckCircle2 className="h-2.5 w-2.5" />} label="Tarea" />
              <QuickAction icon={<Send className="h-2.5 w-2.5" />} label="Email" />
            </div>
          </div>

          {/* Filters */}
          <div className="shrink-0 px-3 py-2 flex items-center gap-0.5 border-b border-border">
            {([
              { key: "all" as const, label: "Todo" },
              { key: "actions" as const, label: "Acciones" },
              { key: "web" as const, label: "Web" },
              { key: "system" as const, label: "Sistema" },
            ]).map(f => (
              <button
                key={f.key}
                onClick={() => setTlFilter(f.key)}
                className={`px-2 py-0.5 rounded text-[9px] font-medium transition-all ${
                  tlFilter === f.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
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
                <p className="text-[11px] text-muted-foreground py-8 text-center">Sin actividad</p>
              ) : (
                <div className="relative">
                  <div className="absolute left-[9px] top-3 bottom-3 w-px bg-border" />
                  {filteredTimeline.map((ev, i) => {
                    const prevDate = i > 0 ? filteredTimeline[i - 1].date.split(" ")[0] : null;
                    const curDate = ev.date.split(" ")[0];
                    const showDate = curDate !== prevDate;
                    return (
                      <div key={ev.id}>
                        {showDate && (
                          <div className="relative pl-7 py-1.5">
                            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/40">{curDate}</span>
                          </div>
                        )}
                        <TimelineItem event={ev} />
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

/* ──────────────── SUB-COMPONENTS ──────────────── */

const MetricPill = ({ icon, label, value, accent, warn }: { icon: React.ReactNode; label: string; value: string; accent?: boolean; warn?: boolean }) => (
  <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 flex-1 min-w-0">
    <span className={`shrink-0 ${accent ? "text-emerald-600" : warn ? "text-amber-600" : "text-muted-foreground"}`}>{icon}</span>
    <div className="min-w-0">
      <p className={`text-sm font-bold tabular-nums leading-none ${accent ? "text-emerald-600" : warn ? "text-amber-600" : "text-foreground"}`}>{value}</p>
      <p className="text-[9px] text-muted-foreground mt-0.5 truncate">{label}</p>
    </div>
  </div>
);

const CriteriaChip = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 border border-border/50 px-2 py-1 text-[10px] font-medium text-foreground">
    <span className="text-muted-foreground">{icon}</span>{text}
  </span>
);

const QuickAction = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] text-muted-foreground hover:bg-muted transition-colors">
    {icon}{label}
  </button>
);

const EmptyState = ({ icon, text, sub }: { icon: React.ReactNode; text: string; sub: string }) => (
  <div className="py-10 text-center">
    <div className="text-muted-foreground/20 mx-auto mb-2">{icon}</div>
    <p className="text-[12px] text-muted-foreground">{text}</p>
    <p className="text-[10px] text-muted-foreground/50 mt-0.5">{sub}</p>
  </div>
);

/* ─── Property Row (horizontal card with image) ─── */
const PropertyRow = ({ property, index, lead }: { property: MatchedProperty; index: number; lead: Lead }) => {
  const statusMap: Record<string, { label: string; cls: string }> = {
    confirmed: { label: "Seleccionada", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    pending: { label: "Pendiente", cls: "text-amber-700 bg-amber-50 border-amber-200" },
    visited: { label: "Visitada", cls: "text-violet-700 bg-violet-50 border-violet-200" },
    sent: { label: "Enviada", cls: "text-blue-700 bg-blue-50 border-blue-200" },
    discarded: { label: "Descartada", cls: "text-muted-foreground bg-muted border-border" },
  };
  const s = statusMap[property.status] || statusMap.pending;
  const matchPct = property.status === "confirmed" ? 97 : property.status === "visited" ? 92 : property.status === "sent" ? 88 : 85;
  const wasVisited = lead.visits.some(v => v.propertyRef === property.ref && v.status === "completed");
  const isScheduled = lead.visits.some(v => v.propertyRef === property.ref && v.status === "scheduled");

  return (
    <div className="flex items-stretch bg-card border border-border rounded-xl overflow-hidden group hover:shadow-sm transition-all">
      {/* Image */}
      <div className="relative w-44 shrink-0 overflow-hidden">
        <img src={getImg(index)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
        <div className="absolute top-2 left-2 flex items-center gap-1 rounded bg-white/90 backdrop-blur-sm px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
          <Star className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" />{matchPct}%
        </div>
      </div>
      {/* Info */}
      <div className="flex-1 p-3 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-[13px] font-semibold text-foreground truncate">{property.title}</p>
            <Badge variant="outline" className={`text-[8px] px-1.5 py-0 h-4 border shrink-0 ${s.cls}`}>{s.label}</Badge>
          </div>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0" />{property.location}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-foreground">{property.price}</span>
            <span className="text-[9px] font-mono text-muted-foreground/50">Ref: {property.ref}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {wasVisited && (
              <span className="flex items-center gap-0.5 text-[8px] font-medium text-emerald-600 bg-emerald-50 rounded px-1.5 py-0.5 border border-emerald-200">
                <CheckCircle2 className="h-2.5 w-2.5" />Visitada
              </span>
            )}
            {isScheduled && (
              <span className="flex items-center gap-0.5 text-[8px] font-medium text-blue-600 bg-blue-50 rounded px-1.5 py-0.5 border border-blue-200">
                <Clock className="h-2.5 w-2.5" />Programada
              </span>
            )}
            <button className="h-6 w-6 rounded-md border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"><Send className="h-3 w-3 text-muted-foreground" /></button>
            <button className="h-6 w-6 rounded-md border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"><Eye className="h-3 w-3 text-muted-foreground" /></button>
            <button className="h-6 w-6 rounded-md border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"><Heart className="h-3 w-3 text-muted-foreground" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Suggestion Row ─── */
const SuggestionRow = ({ suggestion, imageIndex }: { suggestion: AISuggestion; imageIndex: number }) => {
  const iconMap = {
    property: <Home className="h-3 w-3 text-violet-500" />,
    action: <Zap className="h-3 w-3 text-amber-600" />,
    insight: <TrendingUp className="h-3 w-3 text-emerald-500" />,
  };
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-white/60 border border-amber-100 hover:border-amber-200 transition-all">
      {suggestion.type === "property" && (
        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
          <img src={getImg(imageIndex + 3)} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      {suggestion.type !== "property" && (
        <div className="w-10 h-10 rounded-lg bg-amber-100/50 flex items-center justify-center shrink-0">
          {iconMap[suggestion.type]}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-foreground truncate">{suggestion.title}</p>
        <p className="text-[10px] text-muted-foreground truncate">{suggestion.description}</p>
      </div>
      {suggestion.actionLabel && (
        <Button size="sm" className="h-6 text-[10px] px-2.5 shrink-0">{suggestion.actionLabel}</Button>
      )}
      <button className="text-muted-foreground/30 hover:text-muted-foreground shrink-0"><X className="h-3 w-3" /></button>
    </div>
  );
};

/* ─── Visit Row ─── */
const VisitRow = ({ visit }: { visit: { id: string; date: string; propertyRef: string; propertyTitle: string; status: string } }) => {
  const statusConfig: Record<string, { icon: React.ReactNode; cls: string; label: string }> = {
    completed: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, cls: "bg-emerald-50 text-emerald-600 border-emerald-200", label: "Realizada" },
    scheduled: { icon: <Clock className="h-3.5 w-3.5" />, cls: "bg-blue-50 text-blue-600 border-blue-200", label: "Programada" },
    cancelled: { icon: <XCircle className="h-3.5 w-3.5" />, cls: "bg-muted text-muted-foreground border-border", label: "Cancelada" },
  };
  const sc = statusConfig[visit.status] || statusConfig.scheduled;

  return (
    <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:shadow-sm transition-all">
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 border ${sc.cls}`}>
        {sc.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-foreground truncate">{visit.propertyTitle}</p>
        <p className="text-[10px] text-muted-foreground tabular-nums">{visit.date}</p>
      </div>
      <Badge variant="outline" className={`text-[9px] px-1.5 h-5 border ${sc.cls}`}>{sc.label}</Badge>
    </div>
  );
};

/* ─── Task Row ─── */
const TaskRow = ({ task }: { task: { id: string; title: string; dueDate?: string; done: boolean } }) => (
  <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors">
    <button className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
      task.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-border hover:border-primary"
    }`}>
      {task.done && <Check className="h-3 w-3" />}
    </button>
    <span className={`text-[12px] flex-1 ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.title}</span>
    {task.dueDate && <span className="text-[10px] text-muted-foreground tabular-nums">{task.dueDate}</span>}
  </div>
);

/* ─── Timeline Item ─── */
const TimelineItem = ({ event }: { event: TimelineEvent }) => {
  const config: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    note: { icon: <StickyNote className="h-2.5 w-2.5" />, color: "bg-muted text-muted-foreground", label: "Nota" },
    stage_change: { icon: <ArrowRightCircle className="h-2.5 w-2.5" />, color: "bg-primary/10 text-primary", label: "Etapa" },
    property_sent: { icon: <Send className="h-2.5 w-2.5" />, color: "bg-blue-100 text-blue-600", label: "Envío" },
    property_viewed: { icon: <Eye className="h-2.5 w-2.5" />, color: "bg-violet-100 text-violet-600", label: "Vista" },
    visit_scheduled: { icon: <CalendarDays className="h-2.5 w-2.5" />, color: "bg-cyan-100 text-cyan-600", label: "Visita" },
    visit_completed: { icon: <CheckCircle2 className="h-2.5 w-2.5" />, color: "bg-emerald-100 text-emerald-600", label: "Visita" },
    page_view: { icon: <Globe className="h-2.5 w-2.5" />, color: "bg-violet-100 text-violet-600", label: "Web" },
    email_opened: { icon: <MailOpen className="h-2.5 w-2.5" />, color: "bg-sky-100 text-sky-600", label: "Email" },
    call: { icon: <PhoneCall className="h-2.5 w-2.5" />, color: "bg-emerald-100 text-emerald-600", label: "Llamada" },
    task_completed: { icon: <CheckCircle2 className="h-2.5 w-2.5" />, color: "bg-emerald-100 text-emerald-600", label: "Tarea" },
    ai_suggestion: { icon: <Sparkles className="h-2.5 w-2.5" />, color: "bg-amber-100 text-amber-600", label: "IA" },
  };
  const c = config[event.type] || config.note;

  return (
    <div className="relative pl-7 py-1.5 group hover:bg-muted/20 rounded-md transition-colors">
      <div className={`absolute left-[3px] top-[10px] h-[14px] w-[14px] rounded-full flex items-center justify-center ${c.color} ring-2 ring-card`}>
        {c.icon}
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className={`text-[8px] font-semibold uppercase tracking-wider px-1 py-0.5 rounded ${c.color}`}>{c.label}</span>
          <span className="text-[8px] text-muted-foreground/30 tabular-nums">{event.date.split(" ")[1] || ""}</span>
        </div>
        <p className="text-[11px] font-medium text-foreground leading-snug mt-0.5">{event.title}</p>
        {event.description && <p className="text-[10px] text-muted-foreground leading-relaxed">{event.description}</p>}
        {event.meta?.duration && (
          <span className="inline-flex items-center gap-0.5 text-[8px] text-violet-600 bg-violet-50 rounded px-1 py-0.5 mt-0.5">
            <Timer className="h-2 w-2" />{event.meta.duration}
          </span>
        )}
        {event.author && <p className="text-[8px] text-muted-foreground/30 mt-0.5">por {event.author}</p>}
      </div>
    </div>
  );
};

export default OpportunityDetailPage;
