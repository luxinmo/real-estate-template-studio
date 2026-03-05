import { useState } from "react";
import {
  ArrowLeft, Phone, Mail, Flame, Check, Clock, Plus,
  CalendarDays, CheckCircle2, XCircle, Send, Eye, Sparkles,
  Globe, MailOpen, PhoneCall, StickyNote, ArrowRightCircle,
  MapPin, BedDouble, Maximize, Euro,
  MoreHorizontal, Star, Zap, TrendingUp,
  Heart, Timer, Home, Paperclip,
  MessageSquare, Smile, Reply, Forward, Inbox, SendHorizontal,
  Video, Calendar, ChevronRight, Target, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
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

const imgs = [img1, img2, img3, img4, img5, prop1, prop2, prop3];
const getImg = (i: number) => imgs[i % imgs.length];

interface Props { leadId: string; onBack: () => void; }

type CenterTab = "activity" | "properties" | "emails" | "tasks";

const mockEmails = [
  { id: "e1", direction: "out" as const, subject: "Propiedades seleccionadas para usted", date: "05.03 14:00", preview: "Estimado/a, le adjunto una selección de 3 propiedades que coinciden con sus criterios de búsqueda...", attachments: 3 },
  { id: "e2", direction: "in" as const, subject: "Re: Propiedades seleccionadas", date: "05.03 15:30", preview: "Gracias por la información. Me interesa especialmente la Villa 7441. ¿Podríamos agendar una visita para la semana que viene?", attachments: 0 },
  { id: "e3", direction: "out" as const, subject: "Confirmación visita - Villa 7441", date: "05.03 16:00", preview: "Perfecto, le confirmo la visita para el martes 3 de marzo a las 10:00h en la siguiente dirección...", attachments: 1 },
  { id: "e4", direction: "in" as const, subject: "Re: Confirmación visita", date: "06.03 09:00", preview: "Confirmado. Estaremos allí. Una pregunta: ¿la propiedad tiene certificado energético actualizado?", attachments: 0 },
  { id: "e5", direction: "out" as const, subject: "Información adicional + Certificado energético", date: "06.03 10:30", preview: "Sí, la propiedad cuenta con certificado energético clase B. Adjunto el documento oficial para su revisión.", attachments: 2 },
];

const mockMessages = [
  { id: "m1", from: "agent", text: "Buenos días, soy Vicente de la agencia. He visto su consulta sobre villas en Dénia. ¿Le puedo ayudar?", time: "10:15", date: "06.02" },
  { id: "m2", from: "client", text: "Hola Vicente! Sí, estamos buscando una villa de 4-5 habitaciones con piscina en zona Dénia-Jávea. Presupuesto hasta 700k.", time: "10:22", date: "06.02" },
  { id: "m3", from: "agent", text: "Perfecto, tengo varias opciones que podrían encajar. Le envío por email una selección.", time: "10:25", date: "06.02" },
  { id: "m4", from: "client", text: "Genial, gracias! 👍", time: "10:26", date: "06.02" },
  { id: "m5", from: "agent", text: "Le acabo de enviar 3 propiedades. La Villa 7441 en El Montgó creo que le va a encantar.", time: "14:05", date: "15.02" },
  { id: "m6", from: "client", text: "Recibido, las estoy mirando ahora mismo. La del Montgó tiene muy buena pinta!", time: "16:10", date: "15.02" },
  { id: "m7", from: "client", text: "¿Se podría visitar la semana que viene?", time: "16:12", date: "15.02" },
  { id: "m8", from: "agent", text: "Por supuesto. ¿Le viene bien el martes 3 de marzo? Podemos a las 10h y luego otra a las 11h.", time: "16:30", date: "15.02" },
  { id: "m9", from: "client", text: "Perfecto, martes a las 10h para la del Montgó. 👍", time: "17:00", date: "15.02" },
  { id: "m10", from: "agent", text: "Confirmado ✅ Le envío la dirección exacta por email.", time: "17:05", date: "15.02" },
  { id: "m11", from: "client", text: "Hola Vicente, hemos visitado la villa y nos ha gustado mucho. Queremos hacer una segunda visita con un arquitecto amigo.", time: "18:30", date: "03.03" },
  { id: "m12", from: "agent", text: "Me alegro mucho! Sin problema. ¿Qué día les vendría bien?", time: "18:45", date: "03.03" },
  { id: "m13", from: "client", text: "¿El miércoles 5 por la mañana?", time: "19:00", date: "03.03" },
  { id: "m14", from: "agent", text: "Hecho, miércoles 5 a las 11:00h. Les espero allí. 🏠", time: "19:10", date: "03.03" },
  { id: "m15", from: "client", text: "Hemos acabado la segunda visita. Estamos muy interesados pero también estamos viendo otra propiedad. ¿Hay margen de negociación en el precio?", time: "12:30", date: "05.03" },
  { id: "m16", from: "agent", text: "Entiendo. Déjeme hablar con el propietario y le comento. ¿Tienen un precio en mente?", time: "12:45", date: "05.03" },
  { id: "m17", from: "client", text: "Si pudiera estar alrededor de 550k sería ideal para nosotros.", time: "13:00", date: "05.03" },
];

const OpportunityDetailPage = ({ leadId, onBack }: Props) => {
  const lead = mockLeads.find(l => l.id === leadId) || mockLeads[4];
  const [centerTab, setCenterTab] = useState<CenterTab>("activity");
  const [chatMsg, setChatMsg] = useState("");
  const [tlFilter, setTlFilter] = useState<"all" | "actions" | "web" | "system">("all");
  const [chatChannel, setChatChannel] = useState<"whatsapp" | "sms">("whatsapp");

  const currentStageIndex = pipelineStages.findIndex(s => s.key === lead.stage);
  const webVisits = lead.timeline.filter(e => e.type === "page_view").length;
  const completedVisits = lead.visits.filter(v => v.status === "completed").length;
  const scheduledVisits = lead.visits.filter(v => v.status === "scheduled").length;
  const pendingTasks = lead.tasks.filter(t => !t.done).length;
  const interestScore = Math.min(100, webVisits * 12 + completedVisits * 25 + (lead.isHot ? 15 : 0));
  const activeSuggestions = lead.aiSuggestions.filter(s => !s.dismissed);

  const filteredTimeline = lead.timeline
    .filter(ev => {
      if (tlFilter === "all") return true;
      if (tlFilter === "web") return ["page_view", "email_opened"].includes(ev.type);
      if (tlFilter === "actions") return ["note", "call", "property_sent", "visit_scheduled", "visit_completed", "task_completed"].includes(ev.type);
      return ["stage_change"].includes(ev.type);
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* ── HEADER ── */}
      <header className="shrink-0 bg-card border-b border-border">
        {/* Row 1: Contact + actions */}
        <div className="flex items-center h-14 px-5 gap-4">
          <button onClick={onBack} className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors shrink-0">
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </button>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-sm font-bold text-primary-foreground shadow-sm shrink-0">
              {lead.contactName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[15px] font-semibold text-foreground">{lead.contactName}</h1>
                {lead.isHot && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                    <Flame className="h-3 w-3" />Hot
                  </span>
                )}
                <Badge variant="outline" className={`text-[10px] px-2 py-0.5 rounded-full ${
                  lead.type === "rent" ? "text-blue-600 border-blue-200 bg-blue-50/80" : "text-emerald-600 border-emerald-200 bg-emerald-50/80"
                }`}>
                  {lead.type === "rent" ? "Alquiler" : "Venta"}
                </Badge>
                {lead.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-[10px] px-2 py-0.5 rounded-full border-violet-200 text-violet-600 bg-violet-50/80">{tag}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-0.5 text-[12px] text-muted-foreground">
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</span>
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>
                <span className="text-muted-foreground/30">·</span>
                <span className="font-mono text-[11px] text-muted-foreground/40">{lead.ref}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="h-9 text-[12px] gap-2 px-3 rounded-lg"><Phone className="h-3.5 w-3.5" />Llamar</Button>
            <Button variant="outline" size="sm" className="h-9 text-[12px] gap-2 px-3 rounded-lg"><Mail className="h-3.5 w-3.5" />Email</Button>
            <Button size="sm" className="h-9 text-[12px] gap-2 px-3 rounded-lg"><Send className="h-3.5 w-3.5" />Enviar propiedades</Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Row 2: Pipeline */}
        <div className="px-5 pb-3 flex items-center gap-1">
          {pipelineStages.map((stage, i) => {
            const done = i < currentStageIndex;
            const current = i === currentStageIndex;
            return (
              <div key={stage.key} className="flex items-center gap-1 flex-1">
                <div className={`flex-1 h-1.5 rounded-full transition-all ${
                  done ? "bg-primary" : current ? "bg-primary/50" : "bg-border"
                }`} />
                <span className={`text-[9px] font-medium whitespace-nowrap ${
                  current ? "text-foreground" : done ? "text-primary" : "text-muted-foreground/30"
                }`}>
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </header>

      {/* ── BODY: 3 COLUMNS ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ═══ LEFT SIDEBAR ═══ */}
        <aside className="w-[260px] shrink-0 border-r border-border overflow-auto bg-card/50">
          <div className="p-4 space-y-5">
            {/* Agent */}
            <section>
              <SectionLabel>Agente asignado</SectionLabel>
              <div className="flex items-center gap-3 mt-2">
                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-[10px] font-bold text-accent-foreground">
                  {lead.agent.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-[12px] font-medium text-foreground">{lead.agent}</p>
                  <p className="text-[10px] text-muted-foreground">Origen: {lead.origin} · {lead.createdAt.split(" ")[0]}</p>
                </div>
              </div>
            </section>

            {/* Metrics */}
            <section>
              <SectionLabel>Engagement</SectionLabel>
              <div className="mt-2 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-muted-foreground">Nivel de interés</span>
                    <span className={`text-[13px] font-bold tabular-nums ${interestScore > 60 ? "text-emerald-600" : "text-foreground"}`}>{interestScore}%</span>
                  </div>
                  <Progress value={interestScore} className="h-1.5" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <MetricBox value={webVisits} label="Web" icon={<Globe className="h-3 w-3" />} />
                  <MetricBox value={`${completedVisits}/${completedVisits + scheduledVisits}`} label="Visitas" icon={<Eye className="h-3 w-3" />} />
                  <MetricBox value={pendingTasks || "✓"} label="Tareas" icon={<CheckCircle2 className="h-3 w-3" />} warn={pendingTasks > 0} />
                </div>
              </div>
            </section>

            {/* Search criteria */}
            {lead.searchCriteria && (
              <section>
                <div className="flex items-center justify-between">
                  <SectionLabel>Qué busca</SectionLabel>
                  <button className="text-[10px] text-primary hover:underline font-medium">Editar</button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {lead.searchCriteria.propertyType?.map(t => <Tag key={t} icon={<Home className="h-2.5 w-2.5" />}>{t}</Tag>)}
                  {lead.searchCriteria.priceMin != null && (
                    <Tag icon={<Euro className="h-2.5 w-2.5" />}>{(lead.searchCriteria.priceMin / 1000).toFixed(0)}k — {((lead.searchCriteria.priceMax || 0) / 1000).toFixed(0)}k €</Tag>
                  )}
                  {lead.searchCriteria.bedrooms && <Tag icon={<BedDouble className="h-2.5 w-2.5" />}>{lead.searchCriteria.bedrooms}+ hab</Tag>}
                  {lead.searchCriteria.locations?.map(l => <Tag key={l} icon={<MapPin className="h-2.5 w-2.5" />}>{l}</Tag>)}
                  {lead.searchCriteria.minArea && <Tag icon={<Maximize className="h-2.5 w-2.5" />}>{lead.searchCriteria.minArea}+ m²</Tag>}
                </div>
              </section>
            )}

            {/* AI Suggestions */}
            {activeSuggestions.length > 0 && (
              <section>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="h-4 w-4 rounded bg-amber-100 flex items-center justify-center">
                    <Sparkles className="h-2.5 w-2.5 text-amber-600" />
                  </div>
                  <SectionLabel className="text-amber-800">IA Sugerencias</SectionLabel>
                </div>
                <div className="space-y-2">
                  {activeSuggestions.map((s, i) => (
                    <div key={s.id} className={`rounded-xl p-3 border transition-all hover:shadow-sm ${
                      s.priority === "high" ? "border-amber-200 bg-amber-50/60" : "border-border bg-card"
                    }`}>
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5">
                          {s.type === "property" ? <Home className="h-3.5 w-3.5 text-violet-500" /> :
                           s.type === "action" ? <Zap className="h-3.5 w-3.5 text-amber-500" /> :
                           <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-foreground leading-tight">{s.title}</p>
                          <p className="text-[10px] text-muted-foreground leading-snug mt-1">{s.description}</p>
                          {s.actionLabel && (
                            <Button size="sm" className="h-6 text-[10px] px-3 mt-2 rounded-lg">{s.actionLabel}</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </aside>

        {/* ═══ CENTER ═══ */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <nav className="shrink-0 flex items-center gap-1 px-4 bg-card border-b border-border">
            {([
              { key: "activity" as const, label: "Actividad", icon: <BarChart3 className="h-3.5 w-3.5" /> },
              { key: "properties" as const, label: "Propiedades", icon: <Home className="h-3.5 w-3.5" />, count: lead.matchedProperties.length },
              { key: "emails" as const, label: "Emails", icon: <Mail className="h-3.5 w-3.5" />, count: mockEmails.length },
              { key: "tasks" as const, label: "Tareas & Visitas", icon: <CalendarDays className="h-3.5 w-3.5" />, count: lead.tasks.length + lead.visits.length },
            ]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setCenterTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 text-[12px] font-medium border-b-2 transition-all ${
                  centerTab === tab.key
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.count != null && (
                  <span className={`text-[10px] tabular-nums rounded-full px-1.5 py-0.5 ${
                    centerTab === tab.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground/60"
                  }`}>{tab.count}</span>
                )}
              </button>
            ))}
          </nav>

          <ScrollArea className="flex-1">
            <div className="p-5 max-w-[800px]">
              {centerTab === "activity" && <ActivityTab lead={lead} timeline={filteredTimeline} tlFilter={tlFilter} setTlFilter={setTlFilter} />}
              {centerTab === "properties" && <PropertiesTab lead={lead} />}
              {centerTab === "emails" && <EmailsTab />}
              {centerTab === "tasks" && <TasksVisitsTab lead={lead} />}
            </div>
          </ScrollArea>
        </main>

        {/* ═══ RIGHT: CHAT ═══ */}
        <aside className="w-[360px] shrink-0 flex flex-col border-l border-border overflow-hidden">
          {/* Header */}
          <div className="shrink-0 px-4 py-3 border-b border-border bg-card flex items-center gap-3">
            <div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5">
              <button
                onClick={() => setChatChannel("whatsapp")}
                className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                  chatChannel === "whatsapp" ? "bg-emerald-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MessageSquare className="h-3 w-3" />WhatsApp
              </button>
              <button
                onClick={() => setChatChannel("sms")}
                className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                  chatChannel === "sms" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                SMS
              </button>
            </div>
            <div className="flex-1" />
            <span className="text-[11px] text-muted-foreground font-mono">{lead.phone}</span>
            <button className="h-8 w-8 rounded-lg border border-border hover:bg-accent flex items-center justify-center transition-colors"><Phone className="h-3.5 w-3.5 text-muted-foreground" /></button>
            <button className="h-8 w-8 rounded-lg border border-border hover:bg-accent flex items-center justify-center transition-colors"><Video className="h-3.5 w-3.5 text-muted-foreground" /></button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1" style={{ background: "hsl(var(--muted) / 0.15)" }}>
            <div className="p-4 space-y-0.5">
              {mockMessages.map((msg, i) => {
                const prevDate = i > 0 ? mockMessages[i - 1].date : null;
                const showDate = msg.date !== prevDate;
                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="flex justify-center py-3">
                        <span className="text-[10px] bg-card border border-border rounded-full px-3 py-1 text-muted-foreground font-medium shadow-sm">{msg.date}</span>
                      </div>
                    )}
                    <div className={`flex ${msg.from === "agent" ? "justify-end" : "justify-start"} mb-1.5`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${
                        msg.from === "agent"
                          ? "bg-primary text-primary-foreground rounded-br-lg"
                          : "bg-card border border-border text-foreground rounded-bl-lg"
                      }`}>
                        <p className="text-[12px] leading-relaxed">{msg.text}</p>
                        <p className={`text-[9px] mt-1.5 text-right tabular-nums ${msg.from === "agent" ? "text-primary-foreground/40" : "text-muted-foreground/30"}`}>
                          {msg.time}{msg.from === "agent" && " ✓✓"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Composer */}
          <div className="shrink-0 p-3 border-t border-border bg-card">
            <div className="flex items-end gap-2">
              <div className="flex items-center gap-0.5">
                <button className="h-8 w-8 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"><Smile className="h-4 w-4 text-muted-foreground" /></button>
                <button className="h-8 w-8 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"><Paperclip className="h-4 w-4 text-muted-foreground" /></button>
              </div>
              <Textarea
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 min-h-[40px] max-h-[120px] text-[12px] border-border rounded-xl resize-none py-2.5"
                rows={1}
              />
              <Button size="icon" className="h-9 w-9 rounded-xl shrink-0 bg-emerald-500 hover:bg-emerald-600 shadow-sm">
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5">
              {["👍 Perfecto", "Le confirmo", "Le envío info", "¿Cuándo le viene bien?"].map(qr => (
                <button key={qr} className="shrink-0 text-[10px] px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">{qr}</button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════ */
/*  SHARED                                           */
/* ══════════════════════════════════════════════════ */

const SectionLabel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ${className}`}>{children}</p>
);

const MetricBox = ({ value, label, icon, warn }: { value: string | number; label: string; icon: React.ReactNode; warn?: boolean }) => (
  <div className="rounded-lg bg-card border border-border p-2.5 text-center">
    <div className="flex items-center justify-center mb-1 text-muted-foreground">{icon}</div>
    <p className={`text-[14px] font-bold tabular-nums leading-none ${warn ? "text-amber-600" : "text-foreground"}`}>{value}</p>
    <p className="text-[9px] text-muted-foreground mt-1">{label}</p>
  </div>
);

const Tag = ({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-lg bg-muted border border-border/50 px-2 py-1 text-[10px] font-medium text-foreground">
    {icon && <span className="text-muted-foreground">{icon}</span>}
    {children}
  </span>
);

/* ═══ CENTER TABS ═══ */

const ActivityTab = ({ lead, timeline, tlFilter, setTlFilter }: { lead: Lead; timeline: TimelineEvent[]; tlFilter: string; setTlFilter: (f: any) => void }) => {
  const [noteText, setNoteText] = useState("");
  return (
    <div className="space-y-5">
      {/* Composer */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex gap-3">
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-[10px] font-bold text-accent-foreground shrink-0 mt-0.5">Tú</div>
          <div className="flex-1">
            <Input value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Registra una nota, llamada o actividad..." className="h-10 text-[13px] border-0 bg-muted/30 rounded-lg shadow-none focus-visible:ring-1" />
            <div className="flex items-center gap-2 mt-3">
              <ActionChip icon={<PhoneCall className="h-3 w-3" />} label="Log llamada" />
              <ActionChip icon={<CalendarDays className="h-3 w-3" />} label="Agendar visita" />
              <ActionChip icon={<CheckCircle2 className="h-3 w-3" />} label="Nueva tarea" />
              <ActionChip icon={<Send className="h-3 w-3" />} label="Enviar propiedad" />
              <div className="flex-1" />
              <Button size="sm" className="h-8 text-[11px] px-4 rounded-lg">Publicar</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1.5">
        {(["all", "actions", "web", "system"] as const).map(f => {
          const labels: Record<string, string> = { all: "Todo", actions: "Acciones", web: "Actividad web", system: "Sistema" };
          return (
            <button key={f} onClick={() => setTlFilter(f)} className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
              tlFilter === f ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}>
              {labels[f]}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      {timeline.length === 0 ? (
        <p className="text-[12px] text-muted-foreground py-12 text-center">Sin actividad</p>
      ) : (
        <div className="relative ml-3">
          <div className="absolute left-0 top-4 bottom-4 w-px bg-border" />
          {timeline.map((ev, i) => {
            const prevDate = i > 0 ? timeline[i - 1].date.split(" ")[0] : null;
            const curDate = ev.date.split(" ")[0];
            const showDate = curDate !== prevDate;
            return (
              <div key={ev.id}>
                {showDate && <div className="relative pl-8 py-2"><span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40">{curDate}</span></div>}
                <TLItem event={ev} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const PropertiesTab = ({ lead }: { lead: Lead }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <p className="text-[12px] text-muted-foreground">{lead.matchedProperties.length} propiedades vinculadas</p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1.5 rounded-lg"><Sparkles className="h-3.5 w-3.5" />Auto-match</Button>
        <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1.5 rounded-lg"><Plus className="h-3.5 w-3.5" />Vincular</Button>
      </div>
    </div>
    {lead.matchedProperties.length === 0 ? (
      <div className="py-16 text-center">
        <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3"><Home className="h-6 w-6 text-muted-foreground/20" /></div>
        <p className="text-[13px] text-muted-foreground">Sin propiedades vinculadas</p>
        <p className="text-[11px] text-muted-foreground/50 mt-1">Usa "Auto-match" para encontrar coincidencias</p>
      </div>
    ) : (
      lead.matchedProperties.map((mp, i) => <PropCard key={mp.id} p={mp} i={i} lead={lead} />)
    )}
  </div>
);

const EmailsTab = () => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <p className="text-[12px] text-muted-foreground">{mockEmails.length} conversaciones</p>
      <Button size="sm" className="h-8 text-[11px] gap-1.5 rounded-lg"><Mail className="h-3.5 w-3.5" />Nuevo email</Button>
    </div>
    {mockEmails.map(email => (
      <div key={email.id} className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-all cursor-pointer group">
        <div className="flex items-start gap-4">
          <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
            email.direction === "in" ? "bg-blue-50 text-blue-500" : "bg-emerald-50 text-emerald-500"
          }`}>
            {email.direction === "in" ? <Inbox className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className={`text-[9px] px-2 py-0.5 rounded-full ${
                email.direction === "in" ? "text-blue-600 border-blue-200 bg-blue-50/80" : "text-emerald-600 border-emerald-200 bg-emerald-50/80"
              }`}>{email.direction === "in" ? "Recibido" : "Enviado"}</Badge>
              <span className="text-[10px] text-muted-foreground tabular-nums">{email.date}</span>
            </div>
            <p className="text-[13px] font-medium text-foreground">{email.subject}</p>
            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed mt-1">{email.preview}</p>
            <div className="flex items-center gap-3 mt-3">
              {email.attachments > 0 && (
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted rounded-lg px-2 py-1">
                  <Paperclip className="h-3 w-3" />{email.attachments} adjunto(s)
                </span>
              )}
              <div className="flex-1" />
              <button className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><Reply className="h-3 w-3" />Responder</button>
              <button className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><Forward className="h-3 w-3" />Reenviar</button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const TasksVisitsTab = ({ lead }: { lead: Lead }) => (
  <div className="space-y-6">
    <section>
      <div className="flex items-center justify-between mb-3">
        <SectionLabel>Visitas ({lead.visits.length})</SectionLabel>
        <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1.5 rounded-lg"><CalendarDays className="h-3 w-3" />Agendar</Button>
      </div>
      {lead.visits.length === 0 ? (
        <p className="text-[11px] text-muted-foreground/50 py-8 text-center">Sin visitas programadas</p>
      ) : (
        <div className="space-y-2">
          {lead.visits.map(v => {
            const cfg: Record<string, { icon: React.ReactNode; cls: string; label: string }> = {
              completed: { icon: <CheckCircle2 className="h-4 w-4" />, cls: "bg-emerald-50 text-emerald-600 border-emerald-200", label: "Realizada" },
              scheduled: { icon: <Clock className="h-4 w-4" />, cls: "bg-blue-50 text-blue-600 border-blue-200", label: "Programada" },
              cancelled: { icon: <XCircle className="h-4 w-4" />, cls: "bg-muted text-muted-foreground border-border", label: "Cancelada" },
            };
            const c = cfg[v.status] || cfg.scheduled;
            return (
              <div key={v.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-3.5 hover:shadow-sm transition-all">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center border shrink-0 ${c.cls}`}>{c.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-foreground truncate">{v.propertyTitle}</p>
                  <p className="text-[11px] text-muted-foreground tabular-nums mt-0.5">{v.date}</p>
                </div>
                <Badge variant="outline" className={`text-[9px] px-2 py-0.5 rounded-full border ${c.cls}`}>{c.label}</Badge>
              </div>
            );
          })}
        </div>
      )}
    </section>

    <section>
      <div className="flex items-center justify-between mb-3">
        <SectionLabel>Tareas ({lead.tasks.length})</SectionLabel>
        <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1.5 rounded-lg"><Plus className="h-3 w-3" />Nueva</Button>
      </div>
      {lead.tasks.length === 0 ? (
        <p className="text-[11px] text-muted-foreground/50 py-8 text-center">Sin tareas pendientes</p>
      ) : (
        <div className="space-y-1.5">
          {lead.tasks.map(t => (
            <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors">
              <button className={`h-5 w-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                t.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-border hover:border-primary"
              }`}>{t.done && <Check className="h-3 w-3" />}</button>
              <span className={`text-[12px] flex-1 ${t.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.title}</span>
              {t.dueDate && <span className="text-[10px] text-muted-foreground tabular-nums">{t.dueDate}</span>}
            </div>
          ))}
        </div>
      )}
    </section>
  </div>
);

/* ═══ ATOMS ═══ */

const ActionChip = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border border-transparent hover:border-border">
    {icon}{label}
  </button>
);

const PropCard = ({ p, i, lead }: { p: MatchedProperty; i: number; lead: Lead }) => {
  const sMap: Record<string, { label: string; cls: string }> = {
    confirmed: { label: "Seleccionada", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    pending: { label: "Pendiente", cls: "text-amber-700 bg-amber-50 border-amber-200" },
    visited: { label: "Visitada", cls: "text-violet-700 bg-violet-50 border-violet-200" },
    sent: { label: "Enviada", cls: "text-blue-700 bg-blue-50 border-blue-200" },
    discarded: { label: "Descartada", cls: "text-muted-foreground bg-muted border-border" },
  };
  const s = sMap[p.status] || sMap.pending;
  const matchPct = p.status === "confirmed" ? 97 : p.status === "visited" ? 92 : p.status === "sent" ? 88 : 85;
  const wasVisited = lead.visits.some(v => v.propertyRef === p.ref && v.status === "completed");
  const isScheduled = lead.visits.some(v => v.propertyRef === p.ref && v.status === "scheduled");

  return (
    <div className="flex items-stretch rounded-xl border border-border bg-card overflow-hidden group hover:shadow-md transition-all">
      <div className="relative w-48 shrink-0 overflow-hidden">
        <img src={getImg(i)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/5" />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-lg bg-white/95 backdrop-blur-sm px-2 py-1 text-[10px] font-bold text-emerald-700 shadow-sm">
          <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />{matchPct}% match
        </div>
      </div>
      <div className="flex-1 p-4 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-[13px] font-semibold text-foreground truncate">{p.title}</p>
            <Badge variant="outline" className={`text-[9px] px-2 py-0.5 rounded-full border shrink-0 ${s.cls}`}>{s.label}</Badge>
          </div>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3 w-3" />{p.location}</p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-bold text-foreground">{p.price}</span>
            <span className="text-[10px] font-mono text-muted-foreground/40">Ref: {p.ref}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {wasVisited && <Badge variant="outline" className="text-[8px] px-2 py-0.5 rounded-full text-emerald-600 border-emerald-200 bg-emerald-50/80">Visitada</Badge>}
            {isScheduled && <Badge variant="outline" className="text-[8px] px-2 py-0.5 rounded-full text-blue-600 border-blue-200 bg-blue-50/80">Programada</Badge>}
            <button className="h-7 w-7 rounded-lg border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-accent transition-all"><Send className="h-3 w-3 text-muted-foreground" /></button>
            <button className="h-7 w-7 rounded-lg border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-accent transition-all"><Eye className="h-3 w-3 text-muted-foreground" /></button>
            <button className="h-7 w-7 rounded-lg border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-accent transition-all"><Heart className="h-3 w-3 text-muted-foreground" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TLItem = ({ event }: { event: TimelineEvent }) => {
  const cfg: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    note: { icon: <StickyNote className="h-3 w-3" />, color: "bg-muted text-muted-foreground", label: "Nota" },
    stage_change: { icon: <ArrowRightCircle className="h-3 w-3" />, color: "bg-primary/10 text-primary", label: "Etapa" },
    property_sent: { icon: <Send className="h-3 w-3" />, color: "bg-blue-50 text-blue-600", label: "Envío" },
    property_viewed: { icon: <Eye className="h-3 w-3" />, color: "bg-violet-50 text-violet-600", label: "Vista" },
    visit_scheduled: { icon: <CalendarDays className="h-3 w-3" />, color: "bg-cyan-50 text-cyan-600", label: "Visita" },
    visit_completed: { icon: <CheckCircle2 className="h-3 w-3" />, color: "bg-emerald-50 text-emerald-600", label: "Visita" },
    page_view: { icon: <Globe className="h-3 w-3" />, color: "bg-violet-50 text-violet-600", label: "Web" },
    email_opened: { icon: <MailOpen className="h-3 w-3" />, color: "bg-sky-50 text-sky-600", label: "Email" },
    call: { icon: <PhoneCall className="h-3 w-3" />, color: "bg-emerald-50 text-emerald-600", label: "Llamada" },
    task_completed: { icon: <CheckCircle2 className="h-3 w-3" />, color: "bg-emerald-50 text-emerald-600", label: "Tarea" },
    ai_suggestion: { icon: <Sparkles className="h-3 w-3" />, color: "bg-amber-50 text-amber-600", label: "IA" },
  };
  const c = cfg[event.type] || cfg.note;

  return (
    <div className="relative pl-8 py-2 group hover:bg-muted/20 rounded-xl transition-colors">
      <div className={`absolute left-[-5px] top-[14px] h-[18px] w-[18px] rounded-full flex items-center justify-center ${c.color} ring-[3px] ring-background shadow-sm`}>
        {c.icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${c.color}`}>{c.label}</span>
          <span className="text-[9px] text-muted-foreground/30 tabular-nums">{event.date.split(" ")[1] || ""}</span>
        </div>
        <p className="text-[12px] font-medium text-foreground leading-snug mt-1">{event.title}</p>
        {event.description && <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{event.description}</p>}
        {event.meta?.duration && (
          <span className="inline-flex items-center gap-1 text-[9px] text-violet-600 bg-violet-50 rounded-md px-2 py-0.5 mt-1.5 font-medium">
            <Timer className="h-2.5 w-2.5" />{event.meta.duration}
          </span>
        )}
        {event.author && <p className="text-[9px] text-muted-foreground/30 mt-1">por {event.author}</p>}
      </div>
    </div>
  );
};

export default OpportunityDetailPage;
