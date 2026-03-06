import { useState } from "react";
import {
  ArrowLeft, Phone, Mail, Flame, Check, Clock, Plus,
  CalendarDays, CheckCircle2, XCircle, Send, Eye, Sparkles,
  Globe, MailOpen, PhoneCall, StickyNote, ArrowRightCircle,
  MapPin, BedDouble, Maximize, Euro,
  MoreHorizontal, Star, Zap, TrendingUp,
  Heart, Timer, Home, Paperclip,
  MessageSquare, Smile, Reply, Forward, Inbox, SendHorizontal,
  Video, X, ThumbsUp, ThumbsDown, Search, Filter, Building2,
  AlertCircle, ChevronDown, ChevronRight, ExternalLink, Tag
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

type RightTab = "whatsapp" | "email" | "historial";
type PropFilter = "all" | "suggested" | "sent" | "visited" | "discarded" | "new";

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

const mockHistorial: { id: string; date: string; type: string; text: string; by?: string }[] = [
  { id: "h1", date: "06 Mar", type: "stage", text: "Etapa cambiada: Contacto → Cualificado", by: "Vicente" },
  { id: "h2", date: "05 Mar", type: "email", text: "Email enviado: Certificado energético + Info adicional", by: "Vicente" },
  { id: "h3", date: "05 Mar", type: "visit", text: "Segunda visita realizada — Villa Montgó REF-7441", by: "Vicente" },
  { id: "h4", date: "05 Mar", type: "whatsapp", text: "Conversación WhatsApp — Negociación precio", by: "Vicente" },
  { id: "h5", date: "03 Mar", type: "visit", text: "Primera visita realizada — Villa Montgó REF-7441", by: "Vicente" },
  { id: "h6", date: "03 Mar", type: "whatsapp", text: "Conversación WhatsApp — Confirmar visita", by: "Vicente" },
  { id: "h7", date: "15 Feb", type: "email", text: "Email enviado: 3 propiedades seleccionadas", by: "Vicente" },
  { id: "h8", date: "15 Feb", type: "property", text: "Propiedades enviadas: Villa 7441, Chalet 2201, Ático 1190", by: "Sistema" },
  { id: "h9", date: "06 Feb", type: "whatsapp", text: "Primer contacto WhatsApp", by: "Vicente" },
  { id: "h10", date: "05 Feb", type: "web", text: "Visitó 4 propiedades en la web — zona Dénia/Jávea", by: "Sistema" },
  { id: "h11", date: "05 Feb", type: "lead", text: "Lead creado desde formulario web", by: "Sistema" },
];

// Extra mock properties for "new matches" from the system
const mockNewMatches = [
  { id: "new1", title: "Villa Moderna Costa Blanca", location: "Jávea, Alicante", price: "595.000 €", beds: 4, area: "280 m²", match: 94, ref: "REF-8812", isNew: true },
  { id: "new2", title: "Chalet con Vistas al Mar", location: "Dénia, Alicante", price: "520.000 €", beds: 5, area: "310 m²", match: 91, ref: "REF-9034", isNew: true },
  { id: "new3", title: "Finca Rústica Renovada", location: "Pedreguer, Alicante", price: "480.000 €", beds: 4, area: "350 m²", match: 87, ref: "REF-9201", isNew: true },
];

const OpportunityDetailPage = ({ leadId, onBack }: Props) => {
  const lead = mockLeads.find(l => l.id === leadId) || mockLeads[4];
  const [rightTab, setRightTab] = useState<RightTab>("whatsapp");
  const [chatMsg, setChatMsg] = useState("");
  const [propFilter, setPropFilter] = useState<PropFilter>("all");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    origin: true, visits: true, offers: true, suggested: true, newMatches: true
  });

  const stageIdx = pipelineStages.findIndex(s => s.key === lead.stage);
  const webVisits = lead.timeline.filter(e => e.type === "page_view").length;
  const doneVisits = lead.visits.filter(v => v.status === "completed").length;
  const schedVisits = lead.visits.filter(v => v.status === "scheduled").length;
  const interest = Math.min(100, webVisits * 12 + doneVisits * 25 + (lead.isHot ? 15 : 0));

  const toggleSection = (key: string) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));

  // Separate properties by category
  const originProperty = lead.matchedProperties.find(p => p.status === "confirmed");
  const visitedProps = lead.matchedProperties.filter(p => p.status === "visited");
  const sentProps = lead.matchedProperties.filter(p => p.status === "sent");
  const pendingProps = lead.matchedProperties.filter(p => p.status === "pending");
  const discardedProps = lead.matchedProperties.filter(p => p.status === "discarded");

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* ── COMPACT HEADER ── */}
      <header className="shrink-0 bg-card border-b border-border px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-foreground/90 to-foreground/60 flex items-center justify-center text-sm font-bold text-background">
              {lead.contactName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[15px] font-bold text-foreground">{lead.contactName}</h1>
                {lead.isHot && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-100 rounded-full px-2 py-0.5">
                    <Flame className="h-3 w-3" />Hot
                  </span>
                )}
                <Badge className={`text-[10px] px-2 py-0.5 rounded-full font-medium border-0 ${
                  lead.type === "rent" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                }`}>
                  {lead.type === "rent" ? "Alquiler" : "Venta"}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
                <span>{lead.email}</span>
                <span>{lead.phone}</span>
              </div>
            </div>
          </div>

          {/* Pipeline inline */}
          <div className="flex items-center gap-1.5 flex-1 max-w-md mx-6">
            {pipelineStages.map((stage, i) => {
              const done = i < stageIdx;
              const current = i === stageIdx;
              return (
                <div key={stage.key} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className={`h-1.5 w-full rounded-full transition-all ${
                    done ? "bg-foreground" : current ? "bg-foreground/40" : "bg-border"
                  }`} />
                  <span className={`text-[9px] font-medium whitespace-nowrap ${
                    current ? "text-foreground font-semibold" : "text-muted-foreground/40"
                  }`}>{stage.label}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="h-8 text-[12px] gap-1.5 rounded-lg"><Phone className="h-3.5 w-3.5" />Llamar</Button>
            <Button size="sm" className="h-8 text-[12px] gap-1.5 rounded-lg"><Send className="h-3.5 w-3.5" />Enviar propiedades</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      {/* ── BODY: 2 columns (center=properties, right=comms) ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ═══ CENTER: PROPERTIES WORKSPACE ═══ */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-border">
          {/* Toolbar */}
          <div className="shrink-0 flex items-center gap-2 px-5 py-2.5 border-b border-border bg-card/50">
            <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
              {([
                { key: "all" as PropFilter, label: "Todas" },
                { key: "suggested" as PropFilter, label: "Sugeridas" },
                { key: "sent" as PropFilter, label: "Enviadas" },
                { key: "visited" as PropFilter, label: "Visitadas" },
                { key: "new" as PropFilter, label: "Nuevas", badge: mockNewMatches.length },
                { key: "discarded" as PropFilter, label: "Descartadas" },
              ]).map(f => (
                <button
                  key={f.key}
                  onClick={() => setPropFilter(f.key)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                    propFilter === f.key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.label}
                  {f.badge && (
                    <span className="h-4 min-w-[16px] rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center px-1">{f.badge}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1.5 rounded-lg">
              <Sparkles className="h-3.5 w-3.5" />Auto-match
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1.5 rounded-lg">
              <Plus className="h-3.5 w-3.5" />Vincular
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-5 space-y-4">

              {/* ── Search Criteria Bar ── */}
              {lead.searchCriteria && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40 border border-border">
                  <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-[11px] text-muted-foreground font-medium shrink-0">Busca:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.searchCriteria.propertyType?.map(t => <CriteriaPill key={t}>{t}</CriteriaPill>)}
                    {lead.searchCriteria.priceMin != null && <CriteriaPill><Euro className="h-3 w-3" />{(lead.searchCriteria.priceMin/1000).toFixed(0)}k — {((lead.searchCriteria.priceMax||0)/1000).toFixed(0)}k</CriteriaPill>}
                    {lead.searchCriteria.bedrooms && <CriteriaPill><BedDouble className="h-3 w-3" />{lead.searchCriteria.bedrooms}+ hab</CriteriaPill>}
                    {lead.searchCriteria.locations?.map(l => <CriteriaPill key={l}><MapPin className="h-3 w-3" />{l}</CriteriaPill>)}
                    {lead.searchCriteria.minArea && <CriteriaPill><Maximize className="h-3 w-3" />{lead.searchCriteria.minArea}+ m²</CriteriaPill>}
                  </div>
                  <button className="ml-auto text-[11px] text-primary font-medium hover:underline shrink-0">Editar</button>
                </div>
              )}

              {/* ── Engagement quick stats ── */}
              <div className="grid grid-cols-4 gap-3">
                <StatCard label="Interés" value={`${interest}%`} sub={<Progress value={interest} className="h-1 mt-1" />} />
                <StatCard label="Visitas" value={`${doneVisits}/${doneVisits + schedVisits}`} sub={schedVisits > 0 ? `${schedVisits} pendiente(s)` : "Todas hechas"} highlight={schedVisits > 0} />
                <StatCard label="Props enviadas" value={sentProps.length + visitedProps.length + (originProperty ? 1 : 0)} sub={`${lead.matchedProperties.length} total`} />
                <StatCard label="Ofertas" value="1" sub="550k € (pendiente)" highlight />
              </div>

              {/* ── ORIGIN PROPERTY (the one they came for) ── */}
              {(propFilter === "all" || propFilter === "suggested") && originProperty && (
                <Section
                  title="Propiedad de entrada"
                  subtitle="La propiedad por la que contactó"
                  icon={<Star className="h-4 w-4 text-amber-500" />}
                  open={expandedSections.origin}
                  onToggle={() => toggleSection("origin")}
                >
                  <OriginPropertyCard p={originProperty} lead={lead} />
                </Section>
              )}

              {/* ── VISITS & OFFERS ── */}
              {(propFilter === "all" || propFilter === "visited") && (
                <Section
                  title="Visitas & Ofertas"
                  subtitle={`${doneVisits} realizadas · ${schedVisits} programadas`}
                  icon={<CalendarDays className="h-4 w-4 text-blue-500" />}
                  open={expandedSections.visits}
                  onToggle={() => toggleSection("visits")}
                  count={lead.visits.length}
                >
                  <div className="space-y-2">
                    {lead.visits.map(v => {
                      const prop = lead.matchedProperties.find(p => p.ref === v.propertyRef);
                      const cfg: Record<string, { icon: React.ReactNode; bg: string; label: string }> = {
                        completed: { icon: <CheckCircle2 className="h-4 w-4" />, bg: "bg-emerald-100 text-emerald-600", label: "Realizada" },
                        scheduled: { icon: <Clock className="h-4 w-4" />, bg: "bg-blue-100 text-blue-600", label: "Programada" },
                        cancelled: { icon: <XCircle className="h-4 w-4" />, bg: "bg-muted text-muted-foreground", label: "Cancelada" },
                      };
                      const c = cfg[v.status] || cfg.scheduled;
                      return (
                        <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:shadow-sm transition-all group">
                          <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${c.bg}`}>{c.icon}</div>
                          {prop && (
                            <div className="h-9 w-14 rounded-lg overflow-hidden shrink-0">
                              <img src={getImg(lead.matchedProperties.indexOf(prop))} alt="" className="h-full w-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-medium text-foreground truncate">{v.propertyTitle}</p>
                            <p className="text-[11px] text-muted-foreground">{v.date}</p>
                          </div>
                          <Badge className={`text-[10px] px-2 py-0.5 rounded-full font-medium border-0 ${c.bg}`}>{c.label}</Badge>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg"><Eye className="h-3.5 w-3.5" /></Button>
                          </div>
                        </div>
                      );
                    })}
                    {/* Offer row */}
                    <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-amber-200 bg-amber-50/30">
                      <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-amber-100 text-amber-600">
                        <Euro className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-foreground">Oferta: 550.000 €</p>
                        <p className="text-[11px] text-muted-foreground">Villa Montgó REF-7441 · Pendiente respuesta propietario</p>
                      </div>
                      <Badge className="text-[10px] px-2 py-0.5 rounded-full font-semibold border-0 bg-amber-100 text-amber-700">Pendiente</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1.5 rounded-lg w-full">
                      <CalendarDays className="h-3.5 w-3.5" />Agendar visita
                    </Button>
                  </div>
                </Section>
              )}

              {/* ── SUGGESTED / SENT PROPERTIES ── */}
              {(propFilter === "all" || propFilter === "suggested" || propFilter === "sent") && (
                <Section
                  title="Propiedades propuestas"
                  subtitle="Seleccionadas por el agente o el sistema"
                  icon={<Send className="h-4 w-4 text-primary" />}
                  open={expandedSections.suggested}
                  onToggle={() => toggleSection("suggested")}
                  count={sentProps.length + pendingProps.length + visitedProps.length}
                >
                  <div className="grid grid-cols-1 gap-3">
                    {[...visitedProps, ...sentProps, ...pendingProps].map((mp, i) => (
                      <PropertyRow key={mp.id} p={mp} i={i} lead={lead} />
                    ))}
                    {[...visitedProps, ...sentProps, ...pendingProps].length === 0 && (
                      <p className="text-[12px] text-muted-foreground py-6 text-center">Sin propiedades propuestas aún</p>
                    )}
                  </div>
                </Section>
              )}

              {/* ── NEW MATCHES FROM SYSTEM ── */}
              {(propFilter === "all" || propFilter === "new") && (
                <Section
                  title="Nuevas coincidencias"
                  subtitle="Propiedades recientes que encajan con la búsqueda"
                  icon={<Sparkles className="h-4 w-4 text-violet-500" />}
                  open={expandedSections.newMatches}
                  onToggle={() => toggleSection("newMatches")}
                  count={mockNewMatches.length}
                  highlight
                >
                  <div className="grid grid-cols-1 gap-3">
                    {mockNewMatches.map((nm, i) => (
                      <div key={nm.id} className="flex items-center gap-3 p-3 rounded-xl border border-violet-200 bg-violet-50/20 hover:shadow-sm transition-all group">
                        <div className="relative h-16 w-24 rounded-lg overflow-hidden shrink-0">
                          <img src={getImg(i + 5)} alt="" className="h-full w-full object-cover" />
                          <div className="absolute top-1 left-1 rounded-md bg-violet-600 text-white px-1.5 py-0.5 text-[9px] font-bold flex items-center gap-0.5">
                            <Sparkles className="h-2.5 w-2.5" />{nm.match}%
                          </div>
                          <div className="absolute top-1 right-1 rounded-md bg-primary text-primary-foreground px-1.5 py-0.5 text-[9px] font-bold">
                            NUEVA
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-foreground">{nm.title}</p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{nm.location}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[12px] font-bold text-foreground">{nm.price}</span>
                            <span className="text-[10px] text-muted-foreground">{nm.beds} hab · {nm.area}</span>
                            <span className="text-[10px] font-mono text-muted-foreground/40">{nm.ref}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button size="sm" className="h-7 text-[10px] px-3 rounded-lg gap-1">
                            <ThumbsUp className="h-3 w-3" />Proponer
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 text-[10px] px-3 rounded-lg gap-1">
                            <ThumbsDown className="h-3 w-3" />Descartar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* ── DISCARDED ── */}
              {(propFilter === "all" || propFilter === "discarded") && discardedProps.length > 0 && (
                <Section
                  title="Descartadas"
                  subtitle="Propiedades descartadas por el agente o cliente"
                  icon={<XCircle className="h-4 w-4 text-muted-foreground" />}
                  open={false}
                  onToggle={() => {}}
                  count={discardedProps.length}
                >
                  <div className="grid grid-cols-1 gap-2">
                    {discardedProps.map((mp, i) => (
                      <PropertyRow key={mp.id} p={mp} i={i + 4} lead={lead} />
                    ))}
                  </div>
                </Section>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* ═══ RIGHT: COMMUNICATION PANEL (wide) ═══ */}
        <aside className="w-[440px] shrink-0 flex flex-col overflow-hidden bg-card">
          {/* Tabs */}
          <div className="shrink-0 flex items-center border-b border-border">
            {([
              { key: "whatsapp" as RightTab, label: "WhatsApp", icon: <MessageSquare className="h-3.5 w-3.5" />, color: "text-emerald-600" },
              { key: "email" as RightTab, label: "Email", icon: <Mail className="h-3.5 w-3.5" />, color: "text-blue-600" },
              { key: "historial" as RightTab, label: "Historial", icon: <Clock className="h-3.5 w-3.5" />, color: "text-muted-foreground" },
            ]).map(t => (
              <button
                key={t.key}
                onClick={() => setRightTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[12px] font-medium border-b-2 transition-all ${
                  rightTab === t.key
                    ? `border-foreground text-foreground`
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {rightTab === "whatsapp" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Chat header */}
              <div className="shrink-0 px-4 py-2.5 border-b border-border flex items-center gap-2 bg-emerald-50/30">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[12px] font-medium text-foreground">En línea</span>
                <div className="flex-1" />
                <span className="text-[11px] text-muted-foreground font-mono">{lead.phone}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg"><Phone className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg"><Video className="h-3.5 w-3.5" /></Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-1">
                  {mockMessages.map((msg, i) => {
                    const prev = i > 0 ? mockMessages[i - 1].date : null;
                    const showDate = msg.date !== prev;
                    return (
                      <div key={msg.id}>
                        {showDate && (
                          <div className="flex justify-center py-2.5">
                            <span className="text-[10px] bg-muted rounded-full px-3 py-1 text-muted-foreground font-medium">{msg.date}</span>
                          </div>
                        )}
                        <div className={`flex ${msg.from === "agent" ? "justify-end" : "justify-start"} mb-1.5`}>
                          <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                            msg.from === "agent"
                              ? "bg-emerald-600 text-white rounded-br-md"
                              : "bg-background border border-border text-foreground rounded-bl-md"
                          }`}>
                            <p className="text-[12px] leading-relaxed">{msg.text}</p>
                            <p className={`text-[9px] mt-1 text-right tabular-nums ${msg.from === "agent" ? "text-emerald-200" : "text-muted-foreground/40"}`}>
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
              <div className="shrink-0 p-3 border-t border-border">
                <div className="flex items-end gap-2">
                  <button className="h-8 w-8 rounded-lg hover:bg-accent flex items-center justify-center shrink-0"><Paperclip className="h-4 w-4 text-muted-foreground" /></button>
                  <Textarea
                    value={chatMsg}
                    onChange={(e) => setChatMsg(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 min-h-[40px] max-h-[100px] text-[12px] rounded-xl resize-none py-2.5"
                    rows={1}
                  />
                  <Button size="icon" className="h-9 w-9 rounded-xl shrink-0 bg-emerald-500 hover:bg-emerald-600">
                    <SendHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-1.5 mt-2 overflow-x-auto">
                  {["👍 OK", "Le confirmo", "Envío info", "¿Cuándo?", "Gracias"].map(qr => (
                    <button key={qr} className="shrink-0 text-[10px] px-2.5 py-1 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors font-medium">{qr}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {rightTab === "email" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="shrink-0 px-4 py-2.5 border-b border-border flex items-center justify-between">
                <span className="text-[12px] text-muted-foreground">{mockEmails.length} emails</span>
                <Button size="sm" className="h-7 text-[11px] gap-1.5 rounded-lg"><Mail className="h-3 w-3" />Nuevo</Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-3 space-y-2">
                  {mockEmails.map(e => (
                    <div key={e.id} className="p-3 rounded-xl border border-border hover:shadow-sm transition-all cursor-pointer group">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`h-6 w-6 rounded-md flex items-center justify-center ${
                          e.direction === "in" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"
                        }`}>
                          {e.direction === "in" ? <Inbox className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
                        </div>
                        <span className={`text-[10px] font-semibold ${e.direction === "in" ? "text-blue-600" : "text-emerald-600"}`}>
                          {e.direction === "in" ? "Recibido" : "Enviado"}
                        </span>
                        <span className="text-[10px] text-muted-foreground ml-auto">{e.date}</span>
                      </div>
                      <p className="text-[12px] font-medium text-foreground">{e.subject}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{e.preview}</p>
                      {e.attachments > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted rounded-md px-2 py-0.5 mt-1.5">
                          <Paperclip className="h-2.5 w-2.5" />{e.attachments}
                        </span>
                      )}
                      <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 rounded-md gap-1"><Reply className="h-3 w-3" />Responder</Button>
                        <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 rounded-md gap-1"><Forward className="h-3 w-3" />Reenviar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {rightTab === "historial" && (
            <ScrollArea className="flex-1">
              <div className="p-4">
                <div className="relative ml-3">
                  <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />
                  {mockHistorial.map((h, i) => {
                    const prev = i > 0 ? mockHistorial[i - 1].date : null;
                    const showDate = h.date !== prev;
                    const iconMap: Record<string, { icon: React.ReactNode; bg: string }> = {
                      stage: { icon: <ArrowRightCircle className="h-3 w-3" />, bg: "bg-primary/10 text-primary" },
                      email: { icon: <Mail className="h-3 w-3" />, bg: "bg-blue-100 text-blue-600" },
                      visit: { icon: <CalendarDays className="h-3 w-3" />, bg: "bg-emerald-100 text-emerald-600" },
                      whatsapp: { icon: <MessageSquare className="h-3 w-3" />, bg: "bg-emerald-100 text-emerald-600" },
                      property: { icon: <Home className="h-3 w-3" />, bg: "bg-violet-100 text-violet-600" },
                      web: { icon: <Globe className="h-3 w-3" />, bg: "bg-cyan-100 text-cyan-600" },
                      lead: { icon: <Zap className="h-3 w-3" />, bg: "bg-amber-100 text-amber-600" },
                    };
                    const ic = iconMap[h.type] || iconMap.lead;
                    return (
                      <div key={h.id}>
                        {showDate && (
                          <div className="pl-8 py-1.5">
                            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-wider">{h.date}</span>
                          </div>
                        )}
                        <div className="relative pl-8 py-2 hover:bg-muted/20 rounded-lg transition-colors">
                          <div className={`absolute left-[-5px] top-[12px] h-4 w-4 rounded-full flex items-center justify-center ${ic.bg} ring-2 ring-background`}>{ic.icon}</div>
                          <p className="text-[12px] text-foreground">{h.text}</p>
                          {h.by && <p className="text-[10px] text-muted-foreground/40 mt-0.5">por {h.by}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          )}
        </aside>
      </div>
    </div>
  );
};

/* ── ATOMS ── */

const CriteriaPill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-md bg-background border border-border px-2 py-0.5 text-[10px] font-medium text-foreground">{children}</span>
);

const StatCard = ({ label, value, sub, highlight }: { label: string; value: string | number; sub: React.ReactNode; highlight?: boolean }) => (
  <div className={`rounded-xl border p-3 ${highlight ? "border-amber-200 bg-amber-50/30" : "border-border bg-card"}`}>
    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
    <p className={`text-xl font-bold tabular-nums mt-0.5 ${highlight ? "text-amber-700" : "text-foreground"}`}>{value}</p>
    <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
  </div>
);

const Section = ({ title, subtitle, icon, open, onToggle, count, children, highlight }: {
  title: string; subtitle: string; icon: React.ReactNode; open: boolean; onToggle: () => void; count?: number; children: React.ReactNode; highlight?: boolean;
}) => (
  <div className={`rounded-xl border ${highlight ? "border-violet-200 bg-violet-50/10" : "border-border bg-card"}`}>
    <button onClick={onToggle} className="w-full flex items-center gap-3 p-4 hover:bg-muted/20 transition-colors text-left">
      {icon}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-foreground">{title}</span>
          {count != null && <span className="text-[10px] font-bold bg-muted text-muted-foreground rounded-full px-2 py-0.5">{count}</span>}
        </div>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
      {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
    </button>
    {open && <div className="px-4 pb-4">{children}</div>}
  </div>
);

const OriginPropertyCard = ({ p, lead }: { p: MatchedProperty; lead: Lead }) => {
  const visited = lead.visits.some(v => v.propertyRef === p.ref && v.status === "completed");
  const sched = lead.visits.some(v => v.propertyRef === p.ref && v.status === "scheduled");
  return (
    <div className="flex gap-4 p-1 rounded-xl">
      <div className="relative w-40 h-28 rounded-xl overflow-hidden shrink-0">
        <img src={getImg(0)} alt="" className="h-full w-full object-cover" />
        <div className="absolute top-2 left-2 rounded-lg bg-amber-500 text-white px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
          <Star className="h-3 w-3" />Entrada
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-foreground">{p.title}</p>
        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{p.location}</p>
        <p className="text-lg font-bold text-foreground mt-1">{p.price}</p>
        <div className="flex items-center gap-2 mt-2">
          {visited && <Badge className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700 border-0">2 visitas</Badge>}
          {sched && <Badge className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700 border-0">Programada</Badge>}
          <Badge className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-700 border-0">Oferta 550k</Badge>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <Button variant="outline" size="sm" className="h-7 text-[10px] px-2.5 rounded-lg gap-1"><Eye className="h-3 w-3" />Ver ficha</Button>
          <Button variant="outline" size="sm" className="h-7 text-[10px] px-2.5 rounded-lg gap-1"><Send className="h-3 w-3" />Enviar</Button>
        </div>
      </div>
    </div>
  );
};

const PropertyRow = ({ p, i, lead }: { p: MatchedProperty; i: number; lead: Lead }) => {
  const sMap: Record<string, { l: string; c: string }> = {
    confirmed: { l: "Seleccionada", c: "bg-emerald-100 text-emerald-700" },
    pending: { l: "Pendiente", c: "bg-amber-100 text-amber-700" },
    visited: { l: "Visitada", c: "bg-violet-100 text-violet-700" },
    sent: { l: "Enviada", c: "bg-blue-100 text-blue-700" },
    discarded: { l: "Descartada", c: "bg-muted text-muted-foreground" },
  };
  const s = sMap[p.status] || sMap.pending;
  const pct = p.status === "confirmed" ? 97 : p.status === "visited" ? 92 : p.status === "sent" ? 88 : 85;
  const visited = lead.visits.some(v => v.propertyRef === p.ref && v.status === "completed");
  const sched = lead.visits.some(v => v.propertyRef === p.ref && v.status === "scheduled");

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:shadow-sm transition-all group">
      <div className="relative h-14 w-20 rounded-lg overflow-hidden shrink-0">
        <img src={getImg(i)} alt="" className="h-full w-full object-cover" />
        <div className="absolute top-1 left-1 rounded-md bg-white/90 backdrop-blur px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 flex items-center gap-0.5">
          <Star className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" />{pct}%
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[12px] font-semibold text-foreground truncate">{p.title}</p>
          <Badge className={`text-[9px] px-2 py-0 rounded-full font-medium border-0 ${s.c}`}>{s.l}</Badge>
        </div>
        <p className="text-[11px] text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{p.location}</p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-[12px] font-bold text-foreground">{p.price}</span>
          <span className="text-[9px] font-mono text-muted-foreground/40">{p.ref}</span>
          {visited && <span className="text-[9px] font-medium text-emerald-600">✓ Visitada</span>}
          {sched && <span className="text-[9px] font-medium text-blue-600">📅 Programada</span>}
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg"><Send className="h-3 w-3" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg"><Eye className="h-3 w-3" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg"><ThumbsDown className="h-3 w-3" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg"><Heart className="h-3 w-3" /></Button>
      </div>
    </div>
  );
};

export default OpportunityDetailPage;
