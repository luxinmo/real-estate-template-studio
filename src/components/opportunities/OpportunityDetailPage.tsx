import { useState } from "react";
import {
  ArrowLeft, Phone, Mail, Flame, Check, Clock, Plus,
  CalendarDays, CheckCircle2, XCircle, Send, Eye, Sparkles,
  Globe, MailOpen, PhoneCall, StickyNote, ArrowRightCircle,
  MapPin, BedDouble, Maximize, Euro,
  MoreHorizontal, Star, ChevronRight, Zap, TrendingUp,
  Heart, Timer, Home, Paperclip, X, Target,
  MessageSquare, Image, Smile, ChevronDown, Search,
  Reply, Forward, Inbox, SendHorizontal, AtSign, Link2,
  Video, Mic, FileText, Calendar, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
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

/* ── Mock emails ── */
const mockEmails = [
  { id: "e1", direction: "out" as const, subject: "Propiedades seleccionadas para usted", date: "05.03.2026 14:00", preview: "Estimado/a, le adjunto una selección de 3 propiedades que coinciden con sus criterios...", attachments: 3 },
  { id: "e2", direction: "in" as const, subject: "Re: Propiedades seleccionadas", date: "05.03.2026 15:30", preview: "Gracias por la información. Me interesa especialmente la Villa 7441. ¿Podríamos agendar una visita?", attachments: 0 },
  { id: "e3", direction: "out" as const, subject: "Confirmación visita - Villa 7441", date: "05.03.2026 16:00", preview: "Perfecto, le confirmo la visita para el martes 3 de marzo a las 10:00h en la dirección...", attachments: 1 },
  { id: "e4", direction: "in" as const, subject: "Re: Confirmación visita", date: "06.03.2026 09:00", preview: "Confirmado. Estaremos allí. Una pregunta adicional: ¿la propiedad tiene certificado energético?", attachments: 0 },
  { id: "e5", direction: "out" as const, subject: "Información adicional Villa 7441", date: "06.03.2026 10:30", preview: "Sí, la propiedad cuenta con certificado energético clase B. Le adjunto el documento...", attachments: 2 },
];

/* ── Mock WhatsApp messages ── */
const mockMessages = [
  { id: "m1", from: "agent", text: "Buenos días, soy Vicente de la agencia. He visto su consulta sobre villas en Dénia. ¿Le puedo ayudar?", time: "10:15", date: "06.02" },
  { id: "m2", from: "client", text: "Hola Vicente! Sí, estamos buscando una villa de 4-5 habitaciones con piscina en zona Dénia-Jávea. Presupuesto hasta 700k.", time: "10:22", date: "06.02" },
  { id: "m3", from: "agent", text: "Perfecto, tengo varias opciones que podrían encajar. Le envío por email una selección.", time: "10:25", date: "06.02" },
  { id: "m4", from: "client", text: "Genial, gracias! 👍", time: "10:26", date: "06.02" },
  { id: "m5", from: "agent", text: "Le acabo de enviar 3 propiedades. La Villa 7441 en El Montgó creo que le va a encantar.", time: "14:05", date: "15.02" },
  { id: "m6", from: "client", text: "Recibido, las estoy mirando ahora mismo. La del Montgó tiene muy buena pinta!", time: "16:10", date: "15.02" },
  { id: "m7", from: "client", text: "¿Se podría visitar la semana que viene?", time: "16:12", date: "15.02" },
  { id: "m8", from: "agent", text: "Por supuesto. ¿Le viene bien el martes 3 de marzo? Podemos a las 10h y luego otra a las 11h.", time: "16:30", date: "15.02" },
  { id: "m9", from: "client", text: "Perfecto, martes a las 10h para la del Montgó.", time: "17:00", date: "15.02" },
  { id: "m10", from: "agent", text: "Confirmado ✅ Le envío la dirección exacta por email.", time: "17:05", date: "15.02" },
  { id: "m11", from: "client", text: "Hola Vicente, hemos visitado la villa y nos ha gustado mucho. Queremos hacer una segunda visita con un arquitecto amigo.", time: "18:30", date: "03.03" },
  { id: "m12", from: "agent", text: "Me alegro! Sin problema. ¿Qué día les vendría bien?", time: "18:45", date: "03.03" },
  { id: "m13", from: "client", text: "¿El miércoles 5 por la mañana?", time: "19:00", date: "03.03" },
  { id: "m14", from: "agent", text: "Hecho, miércoles 5 a las 11:00h. Les espero allí.", time: "19:10", date: "03.03" },
  { id: "m15", from: "client", text: "Hemos acabado la segunda visita. Estamos muy interesados pero también estamos viendo otra propiedad de otra agencia. Nos gustaría saber si hay margen de negociación en el precio.", time: "12:30", date: "05.03" },
  { id: "m16", from: "agent", text: "Entiendo. Déjeme hablar con el propietario y le digo algo. ¿Tienen un precio en mente?", time: "12:45", date: "05.03" },
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
      {/* ── TOP BAR ── */}
      <div className="shrink-0 border-b border-border bg-card h-11 flex items-center px-3 gap-2">
        <button onClick={onBack} className="h-7 w-7 rounded-md border border-border flex items-center justify-center hover:bg-accent transition-colors shrink-0">
          <ArrowLeft className="h-3.5 w-3.5" />
        </button>
        <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-[10px] font-semibold text-primary-foreground shrink-0">
          {lead.contactName.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>
        <span className="text-sm font-semibold text-foreground">{lead.contactName}</span>
        {lead.isHot && <Flame className="h-3.5 w-3.5 text-amber-500" />}
        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 h-4 ${lead.type === "rent" ? "text-blue-600 border-blue-200 bg-blue-50" : "text-emerald-600 border-emerald-200 bg-emerald-50"}`}>
          {lead.type === "rent" ? "Alquiler" : "Venta"}
        </Badge>
        {lead.tags.map(tag => <Badge key={tag} variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-violet-200 text-violet-600 bg-violet-50">{tag}</Badge>)}
        <span className="text-[10px] text-muted-foreground/50 font-mono">{lead.ref}</span>

        <div className="flex-1" />

        {/* Mini pipeline */}
        <div className="hidden xl:flex items-center gap-0.5">
          {pipelineStages.map((stage, i) => {
            const done = i < currentStageIndex;
            const current = i === currentStageIndex;
            return (
              <div key={stage.key} className={`h-5 px-1.5 rounded text-[8px] font-medium flex items-center gap-0.5 ${
                current ? "bg-primary text-primary-foreground" : done ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground/25"
              }`}>
                {done && <Check className="h-2 w-2" />}{stage.label}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-1 ml-2">
          <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 px-2"><Phone className="h-3 w-3" />Llamar</Button>
          <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 px-2"><Mail className="h-3 w-3" />Email</Button>
          <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
        </div>
      </div>

      {/* ── 3-COLUMN BODY ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ═══ COL 1: CONTACT SIDEBAR ═══ */}
        <div className="w-[240px] shrink-0 border-r border-border bg-card overflow-auto">
          <div className="p-3 space-y-4">
            {/* Contact info */}
            <div className="space-y-2">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Contacto</p>
              <InfoRow icon={<Mail className="h-3 w-3" />} value={lead.email} />
              <InfoRow icon={<Phone className="h-3 w-3" />} value={lead.phone} />
              <InfoRow icon={<Globe className="h-3 w-3" />} value={lead.origin} />
              <InfoRow icon={<Calendar className="h-3 w-3" />} value={lead.createdAt.split(" ")[0]} label="Creado" />
            </div>

            {/* Agent */}
            <div className="space-y-1.5">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Agente</p>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[8px] font-semibold text-muted-foreground">
                  {lead.agent.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <span className="text-[11px] font-medium text-foreground">{lead.agent}</span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="space-y-1.5">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Métricas</p>
              <div className="grid grid-cols-2 gap-1.5">
                <MiniStat label="Interés" value={`${interestScore}%`} accent={interestScore > 60} />
                <MiniStat label="Web" value={`${webVisits} visitas`} />
                <MiniStat label="Visitas" value={`${completedVisits}/${completedVisits + scheduledVisits}`} />
                <MiniStat label="Tareas" value={pendingTasks > 0 ? `${pendingTasks} pend.` : "Al día"} warn={pendingTasks > 0} />
              </div>
            </div>

            {/* Search criteria */}
            {lead.searchCriteria && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Busca</p>
                  <button className="text-[9px] text-primary hover:underline">Editar</button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {lead.searchCriteria.propertyType?.map(t => <Chip key={t} text={t} />)}
                  {lead.searchCriteria.priceMin != null && <Chip text={`${(lead.searchCriteria.priceMin / 1000).toFixed(0)}k — ${((lead.searchCriteria.priceMax || 0) / 1000).toFixed(0)}k €`} />}
                  {lead.searchCriteria.bedrooms && <Chip text={`${lead.searchCriteria.bedrooms}+ hab`} />}
                  {lead.searchCriteria.locations?.map(l => <Chip key={l} text={l} />)}
                  {lead.searchCriteria.minArea && <Chip text={`${lead.searchCriteria.minArea}+ m²`} />}
                </div>
              </div>
            )}

            {/* AI Suggestions */}
            {activeSuggestions.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-amber-700">Sugerencias IA</p>
                </div>
                <div className="space-y-1.5">
                  {activeSuggestions.map(s => (
                    <div key={s.id} className="rounded-lg border border-amber-200/60 bg-amber-50/40 p-2">
                      <div className="flex items-start gap-1.5">
                        <div className="mt-0.5">
                          {s.type === "property" ? <Home className="h-3 w-3 text-violet-500" /> : s.type === "action" ? <Zap className="h-3 w-3 text-amber-600" /> : <TrendingUp className="h-3 w-3 text-emerald-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-medium text-foreground leading-tight">{s.title}</p>
                          <p className="text-[9px] text-muted-foreground leading-snug mt-0.5">{s.description}</p>
                          {s.actionLabel && <Button size="sm" className="h-5 text-[9px] px-2 mt-1.5">{s.actionLabel}</Button>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══ COL 2: CENTER CONTENT ═══ */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-border">
          {/* Tabs */}
          <div className="shrink-0 flex items-center border-b border-border bg-card px-1">
            {([
              { key: "activity" as const, label: "Actividad", icon: <Globe className="h-3 w-3" /> },
              { key: "properties" as const, label: "Propiedades", icon: <Home className="h-3 w-3" />, count: lead.matchedProperties.length },
              { key: "emails" as const, label: "Emails", icon: <Mail className="h-3 w-3" />, count: mockEmails.length },
              { key: "tasks" as const, label: "Tareas / Visitas", icon: <CheckCircle2 className="h-3 w-3" />, count: lead.tasks.length + lead.visits.length },
            ]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setCenterTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-medium border-b-2 transition-all ${
                  centerTab === tab.key ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.count != null && <span className={`text-[9px] tabular-nums ml-0.5 ${centerTab === tab.key ? "text-primary" : "text-muted-foreground/40"}`}>{tab.count}</span>}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <ScrollArea className="flex-1">
            <div className="p-4">
              {centerTab === "activity" && <ActivityTab lead={lead} filteredTimeline={filteredTimeline} tlFilter={tlFilter} setTlFilter={setTlFilter} />}
              {centerTab === "properties" && <PropertiesTab lead={lead} />}
              {centerTab === "emails" && <EmailsTab />}
              {centerTab === "tasks" && <TasksVisitsTab lead={lead} />}
            </div>
          </ScrollArea>
        </div>

        {/* ═══ COL 3: CHAT PANEL ═══ */}
        <div className="w-[340px] shrink-0 flex flex-col bg-card overflow-hidden">
          {/* Chat header */}
          <div className="shrink-0 px-3 py-2 border-b border-border flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
              <button
                onClick={() => setChatChannel("whatsapp")}
                className={`px-2 py-1 rounded text-[9px] font-medium transition-all ${chatChannel === "whatsapp" ? "bg-emerald-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <span className="flex items-center gap-1"><MessageSquare className="h-2.5 w-2.5" />WhatsApp</span>
              </button>
              <button
                onClick={() => setChatChannel("sms")}
                className={`px-2 py-1 rounded text-[9px] font-medium transition-all ${chatChannel === "sms" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                SMS
              </button>
            </div>
            <div className="flex-1" />
            <span className="text-[9px] text-muted-foreground">{lead.phone}</span>
            <button className="h-6 w-6 rounded-md hover:bg-accent flex items-center justify-center"><Phone className="h-3 w-3 text-muted-foreground" /></button>
            <button className="h-6 w-6 rounded-md hover:bg-accent flex items-center justify-center"><Video className="h-3 w-3 text-muted-foreground" /></button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 bg-muted/20">
            <div className="p-3 space-y-1">
              {mockMessages.map((msg, i) => {
                const prevDate = i > 0 ? mockMessages[i - 1].date : null;
                const showDate = msg.date !== prevDate;
                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="flex justify-center py-2">
                        <span className="text-[9px] bg-muted rounded-full px-2.5 py-0.5 text-muted-foreground font-medium">{msg.date}</span>
                      </div>
                    )}
                    <div className={`flex ${msg.from === "agent" ? "justify-end" : "justify-start"} mb-1`}>
                      <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                        msg.from === "agent"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-card border border-border text-foreground rounded-bl-md"
                      }`}>
                        <p className="text-[11px] leading-relaxed">{msg.text}</p>
                        <p className={`text-[8px] mt-1 text-right ${msg.from === "agent" ? "text-primary-foreground/50" : "text-muted-foreground/40"}`}>
                          {msg.time}
                          {msg.from === "agent" && <span className="ml-1">✓✓</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Composer */}
          <div className="shrink-0 p-2 border-t border-border bg-card">
            <div className="flex items-end gap-1.5">
              <div className="flex items-center gap-0.5">
                <button className="h-7 w-7 rounded-md hover:bg-accent flex items-center justify-center"><Smile className="h-4 w-4 text-muted-foreground" /></button>
                <button className="h-7 w-7 rounded-md hover:bg-accent flex items-center justify-center"><Paperclip className="h-4 w-4 text-muted-foreground" /></button>
              </div>
              <div className="flex-1 relative">
                <Textarea
                  value={chatMsg}
                  onChange={(e) => setChatMsg(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="min-h-[36px] max-h-[120px] text-[12px] border-border bg-muted/30 resize-none pr-10 py-2"
                  rows={1}
                />
              </div>
              <Button size="icon" className="h-8 w-8 rounded-full shrink-0 bg-emerald-500 hover:bg-emerald-600">
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
            {/* Quick replies */}
            <div className="flex items-center gap-1 mt-1.5 overflow-x-auto">
              {["👍 Perfecto!", "Le confirmo", "Le envío info", "¿Le viene bien…?"].map(qr => (
                <button key={qr} className="shrink-0 text-[9px] px-2 py-1 rounded-full border border-border bg-card text-muted-foreground hover:bg-accent transition-colors">{qr}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════ */
/*  CENTER TAB CONTENTS                          */
/* ══════════════════════════════════════════════ */

/* ─── Activity Tab ─── */
const ActivityTab = ({ lead, filteredTimeline, tlFilter, setTlFilter }: { lead: Lead; filteredTimeline: TimelineEvent[]; tlFilter: string; setTlFilter: (f: any) => void }) => {
  const [noteText, setNoteText] = useState("");
  return (
    <div className="space-y-4">
      {/* Note composer */}
      <div className="bg-card rounded-xl border border-border p-3">
        <div className="flex items-center gap-2 mb-2">
          <Input value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Registrar actividad, nota, llamada..." className="flex-1 h-8 text-[12px] bg-muted/30 border-border" />
          <Button size="sm" className="h-8 text-[11px] px-3">Publicar</Button>
        </div>
        <div className="flex items-center gap-1">
          <QuickAction icon={<PhoneCall className="h-3 w-3" />} label="Log llamada" />
          <QuickAction icon={<CalendarDays className="h-3 w-3" />} label="Agendar visita" />
          <QuickAction icon={<CheckCircle2 className="h-3 w-3" />} label="Nueva tarea" />
          <QuickAction icon={<Send className="h-3 w-3" />} label="Enviar propiedad" />
        </div>
      </div>

      {/* Timeline filters */}
      <div className="flex items-center gap-1">
        {(["all", "actions", "web", "system"] as const).map(f => {
          const labels: Record<string, string> = { all: "Todo", actions: "Acciones", web: "Web", system: "Sistema" };
          return (
            <button key={f} onClick={() => setTlFilter(f)} className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${tlFilter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
              {labels[f]}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      {filteredTimeline.length === 0 ? (
        <p className="text-[11px] text-muted-foreground py-8 text-center">Sin actividad</p>
      ) : (
        <div className="relative">
          <div className="absolute left-[11px] top-3 bottom-3 w-px bg-border" />
          {filteredTimeline.map((ev, i) => {
            const prevDate = i > 0 ? filteredTimeline[i - 1].date.split(" ")[0] : null;
            const curDate = ev.date.split(" ")[0];
            const showDate = curDate !== prevDate;
            return (
              <div key={ev.id}>
                {showDate && <div className="relative pl-8 py-1.5"><span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/40">{curDate}</span></div>}
                <TimelineItem event={ev} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─── Properties Tab ─── */
const PropertiesTab = ({ lead }: { lead: Lead }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <p className="text-[11px] text-muted-foreground">{lead.matchedProperties.length} propiedades vinculadas</p>
      <div className="flex items-center gap-1.5">
        <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1"><Sparkles className="h-3 w-3" />Auto-match</Button>
        <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1"><Plus className="h-3 w-3" />Vincular</Button>
      </div>
    </div>
    {lead.matchedProperties.length === 0 ? (
      <div className="py-12 text-center">
        <Home className="h-8 w-8 text-muted-foreground/15 mx-auto mb-2" />
        <p className="text-[12px] text-muted-foreground">Sin propiedades vinculadas</p>
      </div>
    ) : (
      lead.matchedProperties.map((mp, i) => <PropertyCard key={mp.id} property={mp} index={i} lead={lead} />)
    )}
  </div>
);

/* ─── Emails Tab ─── */
const EmailsTab = () => (
  <div className="space-y-2">
    <div className="flex items-center justify-between mb-2">
      <p className="text-[11px] text-muted-foreground">{mockEmails.length} emails</p>
      <Button size="sm" className="h-7 text-[10px] gap-1"><Mail className="h-3 w-3" />Nuevo email</Button>
    </div>
    {mockEmails.map(email => (
      <div key={email.id} className="bg-card rounded-xl border border-border p-3 hover:shadow-sm transition-all cursor-pointer group">
        <div className="flex items-start gap-3">
          <div className={`mt-1 h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
            email.direction === "in" ? "bg-blue-50 text-blue-500 border border-blue-200" : "bg-emerald-50 text-emerald-500 border border-emerald-200"
          }`}>
            {email.direction === "in" ? <Inbox className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-semibold uppercase ${email.direction === "in" ? "text-blue-600" : "text-emerald-600"}`}>
                {email.direction === "in" ? "Recibido" : "Enviado"}
              </span>
              <span className="text-[9px] text-muted-foreground/40 tabular-nums">{email.date}</span>
            </div>
            <p className="text-[12px] font-medium text-foreground mt-0.5">{email.subject}</p>
            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed mt-0.5">{email.preview}</p>
            <div className="flex items-center gap-2 mt-2">
              {email.attachments > 0 && (
                <span className="flex items-center gap-1 text-[9px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                  <Paperclip className="h-2.5 w-2.5" />{email.attachments} adjunto(s)
                </span>
              )}
              <div className="flex-1" />
              <button className="text-[9px] text-muted-foreground hover:text-foreground flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><Reply className="h-3 w-3" />Responder</button>
              <button className="text-[9px] text-muted-foreground hover:text-foreground flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><Forward className="h-3 w-3" />Reenviar</button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

/* ─── Tasks & Visits Tab ─── */
const TasksVisitsTab = ({ lead }: { lead: Lead }) => (
  <div className="space-y-5">
    {/* Visits */}
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Visitas ({lead.visits.length})</p>
        <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1"><CalendarDays className="h-3 w-3" />Agendar</Button>
      </div>
      {lead.visits.length === 0 ? (
        <p className="text-[11px] text-muted-foreground/50 py-6 text-center">Sin visitas</p>
      ) : (
        <div className="space-y-1.5">
          {lead.visits.map(v => {
            const sMap: Record<string, { icon: React.ReactNode; cls: string; label: string }> = {
              completed: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, cls: "bg-emerald-50 text-emerald-600 border-emerald-200", label: "Realizada" },
              scheduled: { icon: <Clock className="h-3.5 w-3.5" />, cls: "bg-blue-50 text-blue-600 border-blue-200", label: "Programada" },
              cancelled: { icon: <XCircle className="h-3.5 w-3.5" />, cls: "bg-muted text-muted-foreground border-border", label: "Cancelada" },
            };
            const sc = sMap[v.status] || sMap.scheduled;
            return (
              <div key={v.id} className="flex items-center gap-3 bg-card border border-border rounded-lg p-2.5">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center border shrink-0 ${sc.cls}`}>{sc.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-foreground truncate">{v.propertyTitle}</p>
                  <p className="text-[10px] text-muted-foreground tabular-nums">{v.date}</p>
                </div>
                <Badge variant="outline" className={`text-[8px] px-1.5 h-4 border ${sc.cls}`}>{sc.label}</Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>

    {/* Tasks */}
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Tareas ({lead.tasks.length})</p>
        <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1"><Plus className="h-3 w-3" />Nueva</Button>
      </div>
      {lead.tasks.length === 0 ? (
        <p className="text-[11px] text-muted-foreground/50 py-6 text-center">Sin tareas</p>
      ) : (
        <div className="space-y-1">
          {lead.tasks.map(t => (
            <div key={t.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/30 transition-colors">
              <button className={`h-4.5 w-4.5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                t.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-border hover:border-primary"
              }`}>{t.done && <Check className="h-2.5 w-2.5" />}</button>
              <span className={`text-[11px] flex-1 ${t.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.title}</span>
              {t.dueDate && <span className="text-[9px] text-muted-foreground tabular-nums">{t.dueDate}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

/* ══════════════════════════════════════════════ */
/*  SHARED COMPONENTS                            */
/* ══════════════════════════════════════════════ */

const InfoRow = ({ icon, value, label }: { icon: React.ReactNode; value: string; label?: string }) => (
  <div className="flex items-center gap-2">
    <span className="text-muted-foreground shrink-0">{icon}</span>
    <div className="min-w-0">
      {label && <p className="text-[8px] text-muted-foreground/50 uppercase">{label}</p>}
      <p className="text-[11px] text-foreground truncate">{value}</p>
    </div>
  </div>
);

const MiniStat = ({ label, value, accent, warn }: { label: string; value: string; accent?: boolean; warn?: boolean }) => (
  <div className="bg-muted/40 rounded-lg p-2">
    <p className={`text-[12px] font-bold tabular-nums leading-none ${accent ? "text-emerald-600" : warn ? "text-amber-600" : "text-foreground"}`}>{value}</p>
    <p className="text-[8px] text-muted-foreground mt-0.5">{label}</p>
  </div>
);

const Chip = ({ text }: { text: string }) => (
  <span className="inline-flex rounded bg-muted/60 border border-border/50 px-1.5 py-0.5 text-[9px] font-medium text-foreground">{text}</span>
);

const QuickAction = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-muted-foreground hover:bg-muted transition-colors">{icon}{label}</button>
);

/* ─── Property Card (horizontal) ─── */
const PropertyCard = ({ property, index, lead }: { property: MatchedProperty; index: number; lead: Lead }) => {
  const sMap: Record<string, { label: string; cls: string }> = {
    confirmed: { label: "Seleccionada", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    pending: { label: "Pendiente", cls: "text-amber-700 bg-amber-50 border-amber-200" },
    visited: { label: "Visitada", cls: "text-violet-700 bg-violet-50 border-violet-200" },
    sent: { label: "Enviada", cls: "text-blue-700 bg-blue-50 border-blue-200" },
    discarded: { label: "Descartada", cls: "text-muted-foreground bg-muted border-border" },
  };
  const s = sMap[property.status] || sMap.pending;
  const matchPct = property.status === "confirmed" ? 97 : property.status === "visited" ? 92 : property.status === "sent" ? 88 : 85;
  const wasVisited = lead.visits.some(v => v.propertyRef === property.ref && v.status === "completed");

  return (
    <div className="flex items-stretch bg-card border border-border rounded-xl overflow-hidden group hover:shadow-sm transition-all">
      <div className="relative w-36 shrink-0 overflow-hidden">
        <img src={getImg(index)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 rounded bg-white/90 backdrop-blur-sm px-1 py-0.5 text-[8px] font-bold text-emerald-700">
          <Star className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" />{matchPct}%
        </div>
      </div>
      <div className="flex-1 p-2.5 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-[12px] font-semibold text-foreground truncate">{property.title}</p>
            <Badge variant="outline" className={`text-[8px] px-1 py-0 h-3.5 border shrink-0 ${s.cls}`}>{s.label}</Badge>
          </div>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPin className="h-2.5 w-2.5" />{property.location}</p>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[12px] font-bold text-foreground">{property.price}</span>
          <div className="flex items-center gap-1">
            {wasVisited && <span className="text-[7px] font-medium text-emerald-600 bg-emerald-50 rounded px-1 py-0.5 border border-emerald-200">Visitada</span>}
            <button className="h-5 w-5 rounded border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-accent transition-all"><Send className="h-2.5 w-2.5 text-muted-foreground" /></button>
            <button className="h-5 w-5 rounded border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-accent transition-all"><Eye className="h-2.5 w-2.5 text-muted-foreground" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Timeline Item ─── */
const TimelineItem = ({ event }: { event: TimelineEvent }) => {
  const config: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    note: { icon: <StickyNote className="h-3 w-3" />, color: "bg-muted text-muted-foreground", label: "Nota" },
    stage_change: { icon: <ArrowRightCircle className="h-3 w-3" />, color: "bg-primary/10 text-primary", label: "Etapa" },
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
    <div className="relative pl-8 py-1.5 group hover:bg-muted/20 rounded-md transition-colors">
      <div className={`absolute left-[4px] top-[10px] h-4 w-4 rounded-full flex items-center justify-center ${c.color} ring-2 ring-background`}>{c.icon}</div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className={`text-[8px] font-semibold uppercase tracking-wider px-1 py-0.5 rounded ${c.color}`}>{c.label}</span>
          <span className="text-[8px] text-muted-foreground/30 tabular-nums">{event.date.split(" ")[1] || ""}</span>
        </div>
        <p className="text-[11px] font-medium text-foreground leading-snug mt-0.5">{event.title}</p>
        {event.description && <p className="text-[10px] text-muted-foreground leading-relaxed">{event.description}</p>}
        {event.meta?.duration && (
          <span className="inline-flex items-center gap-0.5 text-[8px] text-violet-600 bg-violet-50 rounded px-1 py-0.5 mt-0.5"><Timer className="h-2 w-2" />{event.meta.duration}</span>
        )}
        {event.author && <p className="text-[8px] text-muted-foreground/30 mt-0.5">por {event.author}</p>}
      </div>
    </div>
  );
};

export default OpportunityDetailPage;
