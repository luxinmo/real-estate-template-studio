import { useState } from "react";
import {
  ArrowLeft, Phone, Mail, Flame, Check, Clock, Plus,
  CalendarDays, CheckCircle2, XCircle, Send, Eye, Sparkles,
  Globe, MailOpen, PhoneCall, StickyNote, ArrowRightCircle,
  MapPin, BedDouble, Maximize, Euro,
  MoreHorizontal, Star, Zap, TrendingUp,
  Heart, Timer, Home, Paperclip,
  MessageSquare, Smile, Reply, Forward, Inbox, SendHorizontal,
  Video, X, PanelRightClose, PanelRightOpen
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

type Tab = "activity" | "properties" | "emails" | "tasks";

const mockEmails = [
  { id: "e1", direction: "out" as const, subject: "Propiedades seleccionadas para usted", date: "05 Mar, 14:00", preview: "Estimado/a, le adjunto una selección de 3 propiedades que coinciden con sus criterios...", attachments: 3 },
  { id: "e2", direction: "in" as const, subject: "Re: Propiedades seleccionadas", date: "05 Mar, 15:30", preview: "Gracias por la información. Me interesa la Villa 7441. ¿Podríamos agendar una visita?", attachments: 0 },
  { id: "e3", direction: "out" as const, subject: "Confirmación visita — Villa 7441", date: "05 Mar, 16:00", preview: "Le confirmo la visita para el martes 3 de marzo a las 10:00h en la dirección indicada.", attachments: 1 },
  { id: "e4", direction: "in" as const, subject: "Re: Confirmación visita", date: "06 Mar, 09:00", preview: "Confirmado. Estaremos allí. ¿La propiedad tiene certificado energético actualizado?", attachments: 0 },
  { id: "e5", direction: "out" as const, subject: "Certificado energético + Info adicional", date: "06 Mar, 10:30", preview: "La propiedad tiene certificado energético clase B. Adjunto el documento oficial.", attachments: 2 },
];

const mockMessages = [
  { id: "m1", from: "agent", text: "Buenos días, soy Vicente de la agencia. He visto su consulta sobre villas en Dénia. ¿Le puedo ayudar?", time: "10:15", date: "6 Feb" },
  { id: "m2", from: "client", text: "Hola Vicente! Sí, buscamos villa de 4-5 hab con piscina en Dénia-Jávea. Presupuesto hasta 700k.", time: "10:22", date: "6 Feb" },
  { id: "m3", from: "agent", text: "Perfecto, tengo varias opciones. Le envío por email una selección.", time: "10:25", date: "6 Feb" },
  { id: "m4", from: "client", text: "Genial, gracias! 👍", time: "10:26", date: "6 Feb" },
  { id: "m5", from: "agent", text: "Le acabo de enviar 3 propiedades. La Villa 7441 en El Montgó creo que le va a encantar.", time: "14:05", date: "15 Feb" },
  { id: "m6", from: "client", text: "La del Montgó tiene muy buena pinta! ¿Se podría visitar la semana que viene?", time: "16:10", date: "15 Feb" },
  { id: "m8", from: "agent", text: "¿Le viene bien el martes 3 de marzo a las 10h?", time: "16:30", date: "15 Feb" },
  { id: "m9", from: "client", text: "Perfecto 👍", time: "17:00", date: "15 Feb" },
  { id: "m10", from: "agent", text: "Confirmado ✅ Le envío dirección por email.", time: "17:05", date: "15 Feb" },
  { id: "m11", from: "client", text: "Hemos visitado la villa y nos ha gustado mucho. Queremos segunda visita con un arquitecto.", time: "18:30", date: "3 Mar" },
  { id: "m12", from: "agent", text: "Me alegro! ¿Qué día les vendría bien?", time: "18:45", date: "3 Mar" },
  { id: "m14", from: "agent", text: "Hecho, miércoles 5 a las 11:00h. Les espero allí 🏠", time: "19:10", date: "3 Mar" },
  { id: "m15", from: "client", text: "Segunda visita hecha. Muy interesados pero vemos otra propiedad. ¿Hay margen en el precio?", time: "12:30", date: "5 Mar" },
  { id: "m16", from: "agent", text: "Hablo con el propietario. ¿Tienen un precio en mente?", time: "12:45", date: "5 Mar" },
  { id: "m17", from: "client", text: "Alrededor de 550k sería ideal.", time: "13:00", date: "5 Mar" },
];

const OpportunityDetailPage = ({ leadId, onBack }: Props) => {
  const lead = mockLeads.find(l => l.id === leadId) || mockLeads[4];
  const [tab, setTab] = useState<Tab>("activity");
  const [chatOpen, setChatOpen] = useState(true);
  const [chatMsg, setChatMsg] = useState("");
  const [tlFilter, setTlFilter] = useState<"all" | "actions" | "web" | "system">("all");

  const stageIdx = pipelineStages.findIndex(s => s.key === lead.stage);
  const webVisits = lead.timeline.filter(e => e.type === "page_view").length;
  const doneVisits = lead.visits.filter(v => v.status === "completed").length;
  const schedVisits = lead.visits.filter(v => v.status === "scheduled").length;
  const pendingTasks = lead.tasks.filter(t => !t.done).length;
  const interest = Math.min(100, webVisits * 12 + doneVisits * 25 + (lead.isHot ? 15 : 0));
  const suggestions = lead.aiSuggestions.filter(s => !s.dismissed);

  const timeline = lead.timeline
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
      <header className="shrink-0 bg-card border-b border-border px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <button onClick={onBack} className="mt-1 h-9 w-9 rounded-xl border border-border flex items-center justify-center hover:bg-accent transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-foreground/90 to-foreground/60 flex items-center justify-center text-base font-bold text-background shadow-md">
              {lead.contactName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-bold text-foreground tracking-tight">{lead.contactName}</h1>
                {lead.isHot && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100 rounded-full px-2.5 py-1">
                    <Flame className="h-3.5 w-3.5" />Hot lead
                  </span>
                )}
                <Badge className={`text-[11px] px-3 py-1 rounded-full font-medium ${
                  lead.type === "rent" ? "bg-blue-100 text-blue-700 border-0" : "bg-emerald-100 text-emerald-700 border-0"
                }`}>
                  {lead.type === "rent" ? "Alquiler" : "Venta"}
                </Badge>
                {lead.tags.map(t => <Badge key={t} className="text-[11px] px-3 py-1 rounded-full font-medium bg-violet-100 text-violet-700 border-0">{t}</Badge>)}
              </div>
              <div className="flex items-center gap-4 mt-1.5 text-[13px] text-muted-foreground">
                <span>{lead.email}</span>
                <span>{lead.phone}</span>
                <span className="font-mono text-muted-foreground/40 text-[12px]">{lead.ref}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-9 text-[13px] gap-2 rounded-xl"><Phone className="h-4 w-4" />Llamar</Button>
            <Button variant="outline" className="h-9 text-[13px] gap-2 rounded-xl"><Mail className="h-4 w-4" />Email</Button>
            <Button className="h-9 text-[13px] gap-2 rounded-xl"><Send className="h-4 w-4" />Enviar propiedades</Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
              variant={chatOpen ? "default" : "outline"}
              size="icon"
              className="h-9 w-9 rounded-xl"
              onClick={() => setChatOpen(!chatOpen)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl"><MoreHorizontal className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Pipeline */}
        <div className="flex items-center gap-2 mt-4">
          {pipelineStages.map((stage, i) => {
            const done = i < stageIdx;
            const current = i === stageIdx;
            return (
              <div key={stage.key} className="flex items-center gap-2 flex-1">
                <div className={`h-2 flex-1 rounded-full transition-all ${
                  done ? "bg-foreground" : current ? "bg-foreground/40" : "bg-border"
                }`} />
                <span className={`text-[11px] font-medium whitespace-nowrap ${
                  current ? "text-foreground font-semibold" : done ? "text-foreground/60" : "text-muted-foreground/30"
                }`}>{stage.label}</span>
              </div>
            );
          })}
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* MAIN */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <nav className="shrink-0 flex items-center gap-6 px-6 border-b border-border bg-card/50">
            {([
              { key: "activity" as Tab, label: "Actividad" },
              { key: "properties" as Tab, label: "Propiedades", ct: lead.matchedProperties.length },
              { key: "emails" as Tab, label: "Emails", ct: mockEmails.length },
              { key: "tasks" as Tab, label: "Tareas & Visitas", ct: lead.tasks.length + lead.visits.length },
            ]).map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`py-3.5 text-[13px] font-medium border-b-2 transition-all ${
                  tab === t.key ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
                {t.ct != null && (
                  <span className={`ml-2 text-[11px] tabular-nums rounded-full px-2 py-0.5 ${
                    tab === t.key ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                  }`}>{t.ct}</span>
                )}
              </button>
            ))}
          </nav>

          <ScrollArea className="flex-1">
            <div className="p-6">
              {tab === "activity" && (
                <div className="flex gap-6">
                  {/* Left col: engagement + suggestions + criteria */}
                  <div className="w-[280px] shrink-0 space-y-5">
                    {/* Engagement */}
                    <Card>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Engagement</p>
                      <div className="flex items-end justify-between mb-2">
                        <span className="text-3xl font-bold tabular-nums text-foreground">{interest}%</span>
                        <span className="text-[12px] text-muted-foreground">interés</span>
                      </div>
                      <Progress value={interest} className="h-2 mb-4" />
                      <div className="grid grid-cols-3 gap-3">
                        <Metric v={webVisits} l="Web" />
                        <Metric v={`${doneVisits}/${doneVisits + schedVisits}`} l="Visitas" />
                        <Metric v={pendingTasks || "✓"} l="Tareas" w={pendingTasks > 0} />
                      </div>
                    </Card>

                    {/* Criteria */}
                    {lead.searchCriteria && (
                      <Card>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Qué busca</p>
                          <button className="text-[11px] text-primary font-medium hover:underline">Editar</button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {lead.searchCriteria.propertyType?.map(t => <Pill key={t}>{t}</Pill>)}
                          {lead.searchCriteria.priceMin != null && <Pill>{(lead.searchCriteria.priceMin/1000).toFixed(0)}k — {((lead.searchCriteria.priceMax||0)/1000).toFixed(0)}k €</Pill>}
                          {lead.searchCriteria.bedrooms && <Pill>{lead.searchCriteria.bedrooms}+ hab</Pill>}
                          {lead.searchCriteria.locations?.map(l => <Pill key={l}>{l}</Pill>)}
                          {lead.searchCriteria.minArea && <Pill>{lead.searchCriteria.minArea}+ m²</Pill>}
                        </div>
                      </Card>
                    )}

                    {/* Suggestions */}
                    {suggestions.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-amber-500" />
                          <p className="text-[12px] font-semibold text-foreground">Sugerencias IA</p>
                        </div>
                        {suggestions.map((s, i) => (
                          <div key={s.id} className={`rounded-2xl p-4 border ${s.priority === "high" ? "border-amber-200 bg-amber-50/50" : "border-border bg-card"}`}>
                            <div className="flex items-start gap-3">
                              {s.type === "property" ? (
                                <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0">
                                  <img src={getImg(i+3)} alt="" className="h-full w-full object-cover" />
                                </div>
                              ) : (
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${s.type === "action" ? "bg-amber-100" : "bg-emerald-100"}`}>
                                  {s.type === "action" ? <Zap className="h-4 w-4 text-amber-600" /> : <TrendingUp className="h-4 w-4 text-emerald-600" />}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-semibold text-foreground">{s.title}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{s.description}</p>
                                {s.actionLabel && <Button size="sm" className="h-7 text-[11px] px-3 mt-2 rounded-lg">{s.actionLabel}</Button>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right col: timeline */}
                  <div className="flex-1 min-w-0 space-y-4">
                    {/* Composer */}
                    <Card>
                      <Input placeholder="Registra una nota, llamada o actividad..." className="h-11 text-[13px] bg-muted/30 border-0 rounded-xl mb-3" />
                      <div className="flex items-center gap-2">
                        <Chip icon={<PhoneCall className="h-3.5 w-3.5" />}>Log llamada</Chip>
                        <Chip icon={<CalendarDays className="h-3.5 w-3.5" />}>Visita</Chip>
                        <Chip icon={<CheckCircle2 className="h-3.5 w-3.5" />}>Tarea</Chip>
                        <Chip icon={<Send className="h-3.5 w-3.5" />}>Enviar</Chip>
                        <div className="flex-1" />
                        <Button className="h-9 text-[12px] px-4 rounded-xl">Publicar</Button>
                      </div>
                    </Card>

                    {/* Filters */}
                    <div className="flex items-center gap-2">
                      {(["all","actions","web","system"] as const).map(f => {
                        const lbl: Record<string,string> = { all: "Todo", actions: "Acciones", web: "Web", system: "Sistema" };
                        return (
                          <button key={f} onClick={() => setTlFilter(f)} className={`px-4 py-2 rounded-xl text-[12px] font-medium transition-all ${
                            tlFilter === f ? "bg-foreground text-background" : "bg-card border border-border text-muted-foreground hover:text-foreground"
                          }`}>{lbl[f]}</button>
                        );
                      })}
                    </div>

                    {/* Timeline */}
                    <div className="relative ml-4">
                      <div className="absolute left-0 top-4 bottom-4 w-px bg-border" />
                      {timeline.map((ev, i) => {
                        const prev = i > 0 ? timeline[i-1].date.split(" ")[0] : null;
                        const cur = ev.date.split(" ")[0];
                        return (
                          <div key={ev.id}>
                            {cur !== prev && <div className="pl-10 py-2"><span className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-wider">{cur}</span></div>}
                            <TLRow ev={ev} />
                          </div>
                        );
                      })}
                      {timeline.length === 0 && <p className="text-muted-foreground text-[13px] py-12 text-center">Sin actividad</p>}
                    </div>
                  </div>
                </div>
              )}

              {tab === "properties" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[15px] font-semibold text-foreground">{lead.matchedProperties.length} propiedades</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" className="h-9 text-[12px] gap-2 rounded-xl"><Sparkles className="h-4 w-4" />Auto-match</Button>
                      <Button variant="outline" className="h-9 text-[12px] gap-2 rounded-xl"><Plus className="h-4 w-4" />Vincular</Button>
                    </div>
                  </div>
                  {lead.matchedProperties.length === 0 ? (
                    <div className="py-20 text-center">
                      <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3"><Home className="h-7 w-7 text-muted-foreground/20" /></div>
                      <p className="text-[14px] font-medium text-muted-foreground">Sin propiedades vinculadas</p>
                      <p className="text-[12px] text-muted-foreground/50 mt-1">Usa Auto-match para encontrar coincidencias</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {lead.matchedProperties.map((mp, i) => <PropCard key={mp.id} p={mp} i={i} lead={lead} />)}
                    </div>
                  )}
                </div>
              )}

              {tab === "emails" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[15px] font-semibold text-foreground">{mockEmails.length} emails</h2>
                    <Button className="h-9 text-[12px] gap-2 rounded-xl"><Mail className="h-4 w-4" />Nuevo email</Button>
                  </div>
                  {mockEmails.map(e => (
                    <Card key={e.id} className="group hover:shadow-lg cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                          e.direction === "in" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"
                        }`}>
                          {e.direction === "in" ? <Inbox className="h-5 w-5" /> : <Send className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className={`text-[11px] font-semibold ${e.direction === "in" ? "text-blue-600" : "text-emerald-600"}`}>
                              {e.direction === "in" ? "Recibido" : "Enviado"}
                            </span>
                            <span className="text-[11px] text-muted-foreground">{e.date}</span>
                          </div>
                          <p className="text-[14px] font-medium text-foreground">{e.subject}</p>
                          <p className="text-[12px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{e.preview}</p>
                          {(e.attachments > 0) && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted rounded-lg px-2.5 py-1 mt-2">
                              <Paperclip className="h-3 w-3" />{e.attachments} adjuntos
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl"><Reply className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl"><Forward className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {tab === "tasks" && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-[15px] font-semibold text-foreground">Visitas</h2>
                      <Button variant="outline" className="h-9 text-[12px] gap-2 rounded-xl"><CalendarDays className="h-4 w-4" />Agendar</Button>
                    </div>
                    {lead.visits.length === 0 ? (
                      <p className="text-[13px] text-muted-foreground/40 py-10 text-center">Sin visitas programadas</p>
                    ) : (
                      <div className="space-y-3">
                        {lead.visits.map(v => {
                          const cfg: Record<string,{icon:React.ReactNode;bg:string;label:string}> = {
                            completed: { icon: <CheckCircle2 className="h-5 w-5" />, bg: "bg-emerald-100 text-emerald-600", label: "Realizada" },
                            scheduled: { icon: <Clock className="h-5 w-5" />, bg: "bg-blue-100 text-blue-600", label: "Programada" },
                            cancelled: { icon: <XCircle className="h-5 w-5" />, bg: "bg-muted text-muted-foreground", label: "Cancelada" },
                          };
                          const c = cfg[v.status] || cfg.scheduled;
                          return (
                            <Card key={v.id}>
                              <div className="flex items-center gap-4">
                                <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${c.bg}`}>{c.icon}</div>
                                <div className="flex-1">
                                  <p className="text-[13px] font-medium text-foreground">{v.propertyTitle}</p>
                                  <p className="text-[12px] text-muted-foreground mt-0.5">{v.date}</p>
                                </div>
                                <Badge className={`text-[11px] px-3 py-1 rounded-full font-medium border-0 ${c.bg}`}>{c.label}</Badge>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-[15px] font-semibold text-foreground">Tareas</h2>
                      <Button variant="outline" className="h-9 text-[12px] gap-2 rounded-xl"><Plus className="h-4 w-4" />Nueva</Button>
                    </div>
                    {lead.tasks.length === 0 ? (
                      <p className="text-[13px] text-muted-foreground/40 py-10 text-center">Sin tareas</p>
                    ) : (
                      <div className="space-y-2">
                        {lead.tasks.map(t => (
                          <div key={t.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/30 transition-colors">
                            <button className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                              t.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-border hover:border-foreground"
                            }`}>{t.done && <Check className="h-3.5 w-3.5" />}</button>
                            <span className={`text-[13px] flex-1 ${t.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.title}</span>
                            {t.dueDate && <span className="text-[11px] text-muted-foreground tabular-nums">{t.dueDate}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* ═══ CHAT PANEL ═══ */}
        {chatOpen && (
          <aside className="w-[380px] shrink-0 flex flex-col border-l border-border overflow-hidden animate-in slide-in-from-right-5 duration-200">
            <div className="shrink-0 px-4 py-3 border-b border-border bg-card flex items-center gap-3">
              <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-emerald-500 text-white shadow-sm flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" />WhatsApp
                </button>
                <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-muted-foreground hover:text-foreground">
                  SMS
                </button>
              </div>
              <div className="flex-1" />
              <span className="text-[12px] text-muted-foreground font-mono">{lead.phone}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl"><Phone className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" onClick={() => setChatOpen(false)}><X className="h-4 w-4" /></Button>
            </div>

            <ScrollArea className="flex-1 bg-muted/10">
              <div className="p-4 space-y-1">
                {mockMessages.map((msg, i) => {
                  const prev = i > 0 ? mockMessages[i-1].date : null;
                  const showDate = msg.date !== prev;
                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div className="flex justify-center py-3">
                          <span className="text-[11px] bg-card border border-border rounded-full px-4 py-1 text-muted-foreground font-medium shadow-sm">{msg.date}</span>
                        </div>
                      )}
                      <div className={`flex ${msg.from === "agent" ? "justify-end" : "justify-start"} mb-2`}>
                        <div className={`max-w-[82%] rounded-2xl px-4 py-3 ${
                          msg.from === "agent"
                            ? "bg-foreground text-background rounded-br-lg"
                            : "bg-card border border-border text-foreground rounded-bl-lg shadow-sm"
                        }`}>
                          <p className="text-[13px] leading-relaxed">{msg.text}</p>
                          <p className={`text-[10px] mt-1.5 text-right tabular-nums ${msg.from === "agent" ? "text-background/40" : "text-muted-foreground/30"}`}>
                            {msg.time}{msg.from === "agent" && " ✓✓"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="shrink-0 p-3 border-t border-border bg-card">
              <div className="flex items-end gap-2">
                <button className="h-9 w-9 rounded-xl hover:bg-accent flex items-center justify-center"><Smile className="h-5 w-5 text-muted-foreground" /></button>
                <button className="h-9 w-9 rounded-xl hover:bg-accent flex items-center justify-center"><Paperclip className="h-5 w-5 text-muted-foreground" /></button>
                <Textarea
                  value={chatMsg}
                  onChange={(e) => setChatMsg(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 min-h-[44px] max-h-[120px] text-[13px] rounded-xl resize-none py-3"
                  rows={1}
                />
                <Button size="icon" className="h-10 w-10 rounded-xl shrink-0 bg-emerald-500 hover:bg-emerald-600 shadow-sm">
                  <SendHorizontal className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1">
                {["👍 Perfecto", "Le confirmo", "Le envío info", "¿Cuándo le viene bien?"].map(qr => (
                  <button key={qr} className="shrink-0 text-[11px] px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors font-medium">{qr}</button>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

/* ── ATOMS ── */

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-border bg-card p-5 transition-all ${className}`}>{children}</div>
);

const Metric = ({ v, l, w }: { v: string|number; l: string; w?: boolean }) => (
  <div className="text-center">
    <p className={`text-xl font-bold tabular-nums ${w ? "text-amber-600" : "text-foreground"}`}>{v}</p>
    <p className="text-[11px] text-muted-foreground mt-0.5">{l}</p>
  </div>
);

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-lg bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground">{children}</span>
);

const Chip = ({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) => (
  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border border-border">
    {icon}{children}
  </button>
);

const PropCard = ({ p, i, lead }: { p: MatchedProperty; i: number; lead: Lead }) => {
  const sMap: Record<string,{l:string;c:string}> = {
    confirmed:{l:"Seleccionada",c:"bg-emerald-100 text-emerald-700"},
    pending:{l:"Pendiente",c:"bg-amber-100 text-amber-700"},
    visited:{l:"Visitada",c:"bg-violet-100 text-violet-700"},
    sent:{l:"Enviada",c:"bg-blue-100 text-blue-700"},
    discarded:{l:"Descartada",c:"bg-muted text-muted-foreground"},
  };
  const s = sMap[p.status] || sMap.pending;
  const pct = p.status === "confirmed" ? 97 : p.status === "visited" ? 92 : p.status === "sent" ? 88 : 85;
  const visited = lead.visits.some(v => v.propertyRef === p.ref && v.status === "completed");
  const sched = lead.visits.some(v => v.propertyRef === p.ref && v.status === "scheduled");

  return (
    <div className="flex items-stretch rounded-2xl border border-border bg-card overflow-hidden group hover:shadow-lg transition-all">
      <div className="relative w-52 shrink-0 overflow-hidden">
        <img src={getImg(i)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 rounded-xl bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-emerald-700 shadow flex items-center gap-1">
          <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />{pct}%
        </div>
      </div>
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <p className="text-[15px] font-semibold text-foreground">{p.title}</p>
            <Badge className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border-0 ${s.c}`}>{s.l}</Badge>
          </div>
          <p className="text-[12px] text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{p.location}</p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-foreground">{p.price}</span>
            <span className="text-[11px] font-mono text-muted-foreground/30">Ref: {p.ref}</span>
          </div>
          <div className="flex items-center gap-2">
            {visited && <Badge className="text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700 border-0">Visitada</Badge>}
            {sched && <Badge className="text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700 border-0">Programada</Badge>}
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl opacity-0 group-hover:opacity-100"><Send className="h-3.5 w-3.5" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl opacity-0 group-hover:opacity-100"><Eye className="h-3.5 w-3.5" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl opacity-0 group-hover:opacity-100"><Heart className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TLRow = ({ ev }: { ev: TimelineEvent }) => {
  const cfg: Record<string,{icon:React.ReactNode;bg:string;label:string}> = {
    note:{icon:<StickyNote className="h-3.5 w-3.5"/>,bg:"bg-muted text-muted-foreground",label:"Nota"},
    stage_change:{icon:<ArrowRightCircle className="h-3.5 w-3.5"/>,bg:"bg-primary/10 text-primary",label:"Etapa"},
    property_sent:{icon:<Send className="h-3.5 w-3.5"/>,bg:"bg-blue-100 text-blue-600",label:"Envío"},
    property_viewed:{icon:<Eye className="h-3.5 w-3.5"/>,bg:"bg-violet-100 text-violet-600",label:"Vista"},
    visit_scheduled:{icon:<CalendarDays className="h-3.5 w-3.5"/>,bg:"bg-cyan-100 text-cyan-600",label:"Visita"},
    visit_completed:{icon:<CheckCircle2 className="h-3.5 w-3.5"/>,bg:"bg-emerald-100 text-emerald-600",label:"Visita"},
    page_view:{icon:<Globe className="h-3.5 w-3.5"/>,bg:"bg-violet-100 text-violet-600",label:"Web"},
    email_opened:{icon:<MailOpen className="h-3.5 w-3.5"/>,bg:"bg-sky-100 text-sky-600",label:"Email"},
    call:{icon:<PhoneCall className="h-3.5 w-3.5"/>,bg:"bg-emerald-100 text-emerald-600",label:"Llamada"},
    task_completed:{icon:<CheckCircle2 className="h-3.5 w-3.5"/>,bg:"bg-emerald-100 text-emerald-600",label:"Tarea"},
    ai_suggestion:{icon:<Sparkles className="h-3.5 w-3.5"/>,bg:"bg-amber-100 text-amber-600",label:"IA"},
  };
  const c = cfg[ev.type] || cfg.note;

  return (
    <div className="relative pl-10 py-2.5 group hover:bg-muted/20 rounded-2xl transition-colors">
      <div className={`absolute left-[-6px] top-[16px] h-5 w-5 rounded-full flex items-center justify-center ${c.bg} ring-4 ring-background`}>{c.icon}</div>
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-lg ${c.bg}`}>{c.label}</span>
        <span className="text-[10px] text-muted-foreground/30 tabular-nums">{ev.date.split(" ")[1] || ""}</span>
      </div>
      <p className="text-[13px] font-medium text-foreground">{ev.title}</p>
      {ev.description && <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">{ev.description}</p>}
      {ev.meta?.duration && (
        <span className="inline-flex items-center gap-1 text-[10px] text-violet-600 bg-violet-50 rounded-lg px-2 py-0.5 mt-1.5 font-medium">
          <Timer className="h-3 w-3" />{ev.meta.duration}
        </span>
      )}
      {ev.author && <p className="text-[10px] text-muted-foreground/30 mt-1">por {ev.author}</p>}
    </div>
  );
};

export default OpportunityDetailPage;
