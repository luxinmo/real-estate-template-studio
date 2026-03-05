import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Mail, UserPlus, Tag, Trash2, FileDown, MoreHorizontal, Plus, Flame, Sparkles, Phone, AtSign, Pencil, MessageSquare, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { mockLeads, pipelineStages, stageCounts, agents, type Lead, type PipelineStage } from "./mock-data";

interface OpportunitiesPageProps {
  onViewDetail: (id: string) => void;
}

const PAGE_SIZE = 10;

const stageColors: Record<string, string> = {
  lead: "bg-muted text-muted-foreground",
  opportunity: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  first_contact: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  send_info: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  visit: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  valuing: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  negotiation: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
};

type TabMode = "leads" | "opportunities";

const OpportunitiesPage = ({ onViewDetail }: OpportunitiesPageProps) => {
  const [tabMode, setTabMode] = useState<TabMode>("leads");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<PipelineStage | "all">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [editLead, setEditLead] = useState<Lead | null>(null);

  const leadsData = useMemo(() => {
    if (tabMode === "leads") return mockLeads.filter(l => l.stage === "lead");
    return mockLeads.filter(l => l.stage !== "lead");
  }, [tabMode]);

  const filtered = useMemo(() => {
    let items = leadsData;
    if (stageFilter !== "all") items = items.filter(l => l.stage === stageFilter);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(l =>
        l.contactName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.ref.toLowerCase().includes(q) ||
        l.phone.includes(q)
      );
    }
    return items;
  }, [leadsData, stageFilter, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };
  const allSelected = paged.length > 0 && paged.every(l => selectedIds.has(l.id));

  const leadCount = mockLeads.filter(l => l.stage === "lead").length;
  const oppCount = mockLeads.filter(l => l.stage !== "lead").length;

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 sm:px-8 pt-6 pb-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">
              {tabMode === "leads" ? `(${leadCount} leads)` : `(${oppCount} oportunidades)`}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-8 gap-1.5 text-[12px]">
              <Plus className="h-3.5 w-3.5" />
              {tabMode === "leads" ? "Nuevo Lead" : "Nueva Oportunidad"}
            </Button>
          </div>
        </div>

        {/* Tab toggle */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => { setTabMode("leads"); setStageFilter("all"); setPage(0); setSelectedIds(new Set()); }}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
              tabMode === "leads"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">{leadCount}</span>
            Leads ({leadCount})
          </button>
          <button
            onClick={() => { setTabMode("opportunities"); setStageFilter("all"); setPage(0); setSelectedIds(new Set()); }}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
              tabMode === "opportunities"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">{oppCount}</span>
            Oportunidades ({oppCount})
          </button>
        </div>

        {/* Pipeline stage pills - only for opportunities */}
        {tabMode === "opportunities" && (
          <div className="flex items-center gap-1.5 mb-4 flex-wrap">
            {pipelineStages.filter(s => s.key !== "lead").map(s => {
              const count = stageCounts[s.key] || mockLeads.filter(l => l.stage === s.key).length;
              const isActive = stageFilter === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => { setStageFilter(isActive ? "all" : s.key); setPage(0); }}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium transition-colors border ${
                    isActive
                      ? "border-primary/30 bg-primary/5 text-foreground"
                      : "border-transparent bg-muted/60 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white ${
                    count > 0 ? "bg-primary/70" : "bg-muted-foreground/30"
                  }`}>{count}</span>
                  {s.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Teléfono, nombre, dirección, título, ref..."
            className="pl-9 h-9 text-[13px] bg-card border-border"
          />
        </div>

        {/* Selection bar */}
        <div className="flex items-center justify-between py-2 border-b border-border mb-1 text-[12px]">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={allSelected}
              onCheckedChange={() => {
                if (allSelected) setSelectedIds(new Set());
                else setSelectedIds(new Set(paged.map(l => l.id)));
              }}
              className="h-3.5 w-3.5"
            />
            <span className="text-primary font-medium">{selectedIds.size} seleccionados</span>
            <button onClick={() => setSelectedIds(new Set(filtered.map(l => l.id)))} className="text-primary hover:underline">Seleccionar todo</button>
            <button onClick={() => setSelectedIds(new Set())} className="text-muted-foreground hover:underline">Limpiar</button>
            {filtered.some(l => l.isNew) && (
              <button className="text-emerald-600 hover:underline font-medium">Nuevos ({filtered.filter(l => l.isNew).length})</button>
            )}
            {filtered.some(l => l.isHot) && (
              <button className="text-amber-600 hover:underline font-medium">Hot ({filtered.filter(l => l.isHot).length})</button>
            )}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>{page * PAGE_SIZE + 1} - {Math.min((page + 1) * PAGE_SIZE, filtered.length)} de {filtered.length}</span>
            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="p-0.5 hover:text-foreground disabled:opacity-30">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="p-0.5 hover:text-foreground disabled:opacity-30">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Bulk actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-1.5 py-2 mb-1 text-[12px]">
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-[11px]"><Mail className="h-3 w-3" />Email</Button>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-[11px]"><UserPlus className="h-3 w-3" />Asignar</Button>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-[11px]"><Tag className="h-3 w-3" />Añadir tag</Button>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-[11px]"><Tag className="h-3 w-3" />Quitar tag</Button>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-[11px]"><FileDown className="h-3 w-3" />Exportar</Button>
            {tabMode === "leads" && (
              <Button variant="ghost" size="sm" className="h-7 gap-1 text-[11px] text-emerald-600"><Sparkles className="h-3 w-3" />Pasar a Oportunidad</Button>
            )}
          </div>
        )}

        {/* Lead rows */}
        <div className="space-y-0">
          {paged.map(lead => (
            <LeadRow
              key={lead.id}
              lead={lead}
              selected={selectedIds.has(lead.id)}
              onToggle={() => toggleSelect(lead.id)}
              onView={() => onViewDetail(lead.id)}
              onEdit={() => setEditLead(lead)}
              tabMode={tabMode}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground text-sm">
            No se encontraron resultados
          </div>
        )}
      </div>

      {/* Edit Lead Dialog */}
      {editLead && (
        <EditLeadDialog lead={editLead} onClose={() => setEditLead(null)} />
      )}
    </div>
  );
};

/* ─── Lead Row ─── */
interface LeadRowProps {
  lead: Lead;
  selected: boolean;
  onToggle: () => void;
  onView: () => void;
  onEdit: () => void;
  tabMode: TabMode;
}

const LeadRow = ({ lead, selected, onToggle, onView, onEdit, tabMode }: LeadRowProps) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className={`border-b border-border transition-colors ${selected ? "bg-primary/[0.02]" : "hover:bg-muted/30"}`}>
      {/* Top meta row */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <Checkbox checked={selected} onCheckedChange={onToggle} className="h-3.5 w-3.5" />
          <Badge variant="outline" className={`text-[10px] font-semibold px-2 py-0 h-5 rounded ${
            lead.type === "rent" ? "text-blue-600 border-blue-200 bg-blue-50" : "text-emerald-600 border-emerald-200 bg-emerald-50"
          }`}>
            {lead.type === "rent" ? "To rent" : "For sale"}
          </Badge>
          <span className="font-mono">{lead.ref}</span>
          <span>editado hace {lead.editedAgo}</span>
          {lead.isNew && <Badge className="bg-emerald-500 text-white text-[9px] px-1.5 py-0 h-4">New</Badge>}
          {lead.isHot && <Flame className="h-3.5 w-3.5 text-amber-500" />}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>Creado {lead.createdAt}</span>
          {tabMode === "leads" && (
            <button className="text-[10px] text-emerald-600 font-medium hover:underline">→ Oportunidad</button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex gap-4 px-3 pb-3 cursor-pointer" onClick={onView}>
        {/* Contact info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-semibold text-primary hover:underline">{lead.contactName}</h3>
          <div className="flex items-center gap-3 mt-1 text-[12px]">
            <a className="text-primary/70 hover:underline flex items-center gap-1" onClick={e => e.stopPropagation()}>
              <AtSign className="h-3 w-3" />{lead.email}
            </a>
          </div>
          <div className="flex items-center gap-3 mt-1 text-[12px] text-muted-foreground">
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="mt-1.5 text-[11px] text-primary/60 hover:text-primary flex items-center gap-1"
          >
            <Tag className="h-3 w-3" /> Añadir tag
          </button>
          {lead.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-1">
              {lead.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-amber-100 text-amber-800 border-amber-200">{tag}</Badge>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground">
            <span>Origen: <strong className="text-foreground">{lead.origin}</strong></span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
            Responsable: <strong className="text-foreground">{lead.agent}</strong>
            <Pencil className="h-2.5 w-2.5 text-muted-foreground/50 cursor-pointer hover:text-foreground" />
          </div>
        </div>

        {/* Property card */}
        {lead.property && (
          <div className="flex items-start gap-3 shrink-0">
            <div className="w-28 h-20 rounded-lg bg-muted overflow-hidden">
              <img src={lead.property.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-primary">
                {lead.property.title} <span className="text-muted-foreground font-normal text-[11px]">{lead.property.ref}</span>
              </p>
              <p className="text-[11px] text-muted-foreground">{lead.property.location}</p>
              <p className="text-[12px] font-medium mt-0.5">
                {lead.type === "rent" ? "To rent" : "For sale"} {lead.property.price}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="flex items-center gap-1 text-[10px] text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Available
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-start gap-1 shrink-0 ml-2" onClick={e => e.stopPropagation()}>
          <button className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><X className="h-3.5 w-3.5" /></button>
          <button className="p-1.5 rounded hover:bg-emerald-50 text-muted-foreground hover:text-emerald-600"><Check className="h-3.5 w-3.5" /></button>
          <button onClick={onEdit} className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      {/* Comments toggle */}
      <div className="px-3 pb-2" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 border border-border rounded px-2 py-0.5"
        >
          <MessageSquare className="h-3 w-3" />
          {showComments ? "Ocultar comentarios" : "Mostrar comentarios"} {lead.notes.length > 0 && `(${lead.notes.length})`}
        </button>
        {showComments && lead.notes.length > 0 && (
          <div className="mt-2 space-y-1.5 pl-4 border-l-2 border-border">
            {lead.notes.slice(0, 2).map(note => (
              <div key={note.id} className="text-[11px]">
                {note.isSystem && <p className="text-emerald-600 font-medium">{note.systemType}</p>}
                <p className="text-muted-foreground">{note.text}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">{note.date} · {note.author}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Edit Lead Dialog ─── */
const EditLeadDialog = ({ lead, onClose }: { lead: Lead; onClose: () => void }) => (
  <Dialog open onOpenChange={onClose}>
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="text-base">Editar lead</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Nombre de contacto</Label>
          <Input defaultValue={lead.contactName} className="mt-1 h-9 text-[13px]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Teléfono</Label>
            <Input defaultValue={lead.phone} className="mt-1 h-9 text-[13px]" />
          </div>
          <div>
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Email</Label>
            <Input defaultValue={lead.email} className="mt-1 h-9 text-[13px]" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Agente</Label>
            <Select defaultValue={lead.agent}>
              <SelectTrigger className="mt-1 h-9 text-[13px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {agents.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Referencia</Label>
            <Input defaultValue={lead.property?.ref || ""} className="mt-1 h-9 text-[13px]" />
          </div>
          <div>
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Origen</Label>
            <Select defaultValue={lead.origin}>
              <SelectTrigger className="mt-1 h-9 text-[13px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Web", "Idealista", "Thinkspain", "Fotocasa", "Directo"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Comentario del agente</Label>
          <Textarea className="mt-1 text-[13px] min-h-[60px]" />
        </div>
      </div>
      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={onClose} className="text-[12px] h-8">Cerrar</Button>
        <Button className="text-[12px] h-8">Guardar</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default OpportunitiesPage;
