import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, MoreHorizontal, Plus, Flame, ArrowRight, Mail, UserPlus, Tag, FileDown, Sparkles, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { mockLeads, pipelineStages, agents, type Lead, type PipelineStage } from "./mock-data";

interface OpportunitiesPageProps {
  onViewDetail: (id: string) => void;
}

const PAGE_SIZE = 10;

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
        l.ref.toLowerCase().includes(q)
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

  // Stage distribution for opportunities
  const stageDistribution = useMemo(() => {
    const opps = mockLeads.filter(l => l.stage !== "lead");
    return pipelineStages.filter(s => s.key !== "lead").map(s => ({
      ...s,
      count: opps.filter(l => l.stage === s.key).length,
    }));
  }, []);

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 sm:px-8 pt-6 pb-8">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Pipeline</h1>
          <Button size="sm" className="h-8 gap-1.5 text-[12px]">
            <Plus className="h-3.5 w-3.5" />
            Nuevo
          </Button>
        </div>

        {/* Mode toggle — pill style */}
        <div className="inline-flex items-center rounded-lg bg-muted p-0.5 mb-5">
          <button
            onClick={() => { setTabMode("leads"); setStageFilter("all"); setPage(0); setSelectedIds(new Set()); }}
            className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-[13px] font-medium transition-all ${
              tabMode === "leads" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Leads
            <span className={`text-[11px] font-semibold tabular-nums px-1.5 py-0.5 rounded-md ${
              tabMode === "leads" ? "bg-primary text-primary-foreground" : "bg-muted-foreground/10"
            }`}>{leadCount}</span>
          </button>
          <button
            onClick={() => { setTabMode("opportunities"); setStageFilter("all"); setPage(0); setSelectedIds(new Set()); }}
            className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-[13px] font-medium transition-all ${
              tabMode === "opportunities" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Oportunidades
            <span className={`text-[11px] font-semibold tabular-nums px-1.5 py-0.5 rounded-md ${
              tabMode === "opportunities" ? "bg-primary text-primary-foreground" : "bg-muted-foreground/10"
            }`}>{oppCount}</span>
          </button>
        </div>

        {/* Pipeline stage bar — horizontal proportional visualization */}
        {tabMode === "opportunities" && (
          <div className="mb-5">
            <div className="flex h-7 rounded-lg overflow-hidden border border-border bg-card">
              {stageDistribution.map((s, i) => {
                const total = stageDistribution.reduce((a, b) => a + b.count, 0) || 1;
                const pct = Math.max((s.count / total) * 100, 8);
                const isActive = stageFilter === s.key;
                const colors = [
                  "bg-blue-500/15 text-blue-700 hover:bg-blue-500/25",
                  "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25",
                  "bg-amber-500/15 text-amber-700 hover:bg-amber-500/25",
                  "bg-violet-500/15 text-violet-700 hover:bg-violet-500/25",
                  "bg-cyan-500/15 text-cyan-700 hover:bg-cyan-500/25",
                  "bg-rose-500/15 text-rose-700 hover:bg-rose-500/25",
                ];
                return (
                  <button
                    key={s.key}
                    onClick={() => { setStageFilter(isActive ? "all" : s.key); setPage(0); }}
                    style={{ width: `${pct}%` }}
                    className={`flex items-center justify-center gap-1 text-[10px] font-semibold transition-all border-r border-border last:border-r-0 ${colors[i % colors.length]} ${
                      isActive ? "ring-1 ring-inset ring-primary/30" : ""
                    }`}
                  >
                    <span className="truncate">{s.label}</span>
                    <span className="opacity-60">{s.count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Search + controls */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="Buscar por nombre, email, teléfono o referencia..."
              className="pl-9 h-8 text-[12px] bg-card border-border"
            />
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1 text-[11px]">
            <SlidersHorizontal className="h-3 w-3" /> Filtros
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between py-2 mb-1 text-[11px] border-b border-border">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={allSelected}
              onCheckedChange={() => {
                if (allSelected) setSelectedIds(new Set());
                else setSelectedIds(new Set(paged.map(l => l.id)));
              }}
              className="h-3.5 w-3.5"
            />
            {selectedIds.size > 0 ? (
              <>
                <span className="font-medium text-foreground">{selectedIds.size} sel.</span>
                <span className="text-muted-foreground/40">·</span>
                <button onClick={() => setSelectedIds(new Set(filtered.map(l => l.id)))} className="text-primary hover:underline">Todo</button>
                <button onClick={() => setSelectedIds(new Set())} className="text-muted-foreground hover:underline">Limpiar</button>
                <span className="text-muted-foreground/40">·</span>
                <button className="text-muted-foreground hover:text-foreground flex items-center gap-1"><Mail className="h-3 w-3" />Email</button>
                <button className="text-muted-foreground hover:text-foreground flex items-center gap-1"><UserPlus className="h-3 w-3" />Asignar</button>
                <button className="text-muted-foreground hover:text-foreground flex items-center gap-1"><Tag className="h-3 w-3" />Tag</button>
                <button className="text-muted-foreground hover:text-foreground flex items-center gap-1"><FileDown className="h-3 w-3" />Exportar</button>
                {tabMode === "leads" && (
                  <button className="text-emerald-600 font-medium flex items-center gap-1"><Sparkles className="h-3 w-3" />→ Oportunidad</button>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">Seleccionar para acciones</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground tabular-nums">
            <span>{filtered.length > 0 ? `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, filtered.length)}` : "0"} de {filtered.length}</span>
            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="p-0.5 hover:text-foreground disabled:opacity-30"><ChevronLeft className="h-3.5 w-3.5" /></button>
            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="p-0.5 hover:text-foreground disabled:opacity-30"><ChevronRight className="h-3.5 w-3.5" /></button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[32px_1fr_180px_120px_100px_80px_40px] items-center px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
            <div />
            <div>Contacto</div>
            <div>Propiedad</div>
            <div>Origen</div>
            <div>Etapa</div>
            <div>Fecha</div>
            <div />
          </div>

          {/* Rows */}
          {paged.map(lead => (
            <LeadTableRow
              key={lead.id}
              lead={lead}
              selected={selectedIds.has(lead.id)}
              onToggle={() => toggleSelect(lead.id)}
              onView={() => onViewDetail(lead.id)}
              onEdit={() => setEditLead(lead)}
              tabMode={tabMode}
            />
          ))}

          {filtered.length === 0 && (
            <div className="py-16 text-center text-muted-foreground text-[13px]">
              Sin resultados
            </div>
          )}
        </div>
      </div>

      {editLead && <EditLeadDialog lead={editLead} onClose={() => setEditLead(null)} />}
    </div>
  );
};

/* ─── Table Row ─── */
interface LeadTableRowProps {
  lead: Lead;
  selected: boolean;
  onToggle: () => void;
  onView: () => void;
  onEdit: () => void;
  tabMode: TabMode;
}

const stageLabels: Record<string, { label: string; dot: string }> = {
  lead: { label: "Lead", dot: "bg-muted-foreground" },
  opportunity: { label: "Oportunidad", dot: "bg-blue-500" },
  first_contact: { label: "1er Contacto", dot: "bg-emerald-500" },
  send_info: { label: "Info Enviada", dot: "bg-amber-500" },
  visit: { label: "Visita", dot: "bg-violet-500" },
  valuing: { label: "Valoración", dot: "bg-cyan-500" },
  negotiation: { label: "Negociación", dot: "bg-rose-500" },
};

const LeadTableRow = ({ lead, selected, onToggle, onView, onEdit, tabMode }: LeadTableRowProps) => {
  const stage = stageLabels[lead.stage] || stageLabels.lead;

  return (
    <div
      onClick={onView}
      className={`grid grid-cols-[32px_1fr_180px_120px_100px_80px_40px] items-center px-3 py-2.5 border-b border-border last:border-b-0 cursor-pointer transition-colors group ${
        selected ? "bg-primary/[0.02]" : "hover:bg-muted/20"
      }`}
    >
      {/* Checkbox */}
      <div onClick={e => e.stopPropagation()}>
        <Checkbox checked={selected} onCheckedChange={onToggle} className="h-3.5 w-3.5" />
      </div>

      {/* Contact */}
      <div className="min-w-0 flex items-center gap-3">
        {/* Avatar circle */}
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[11px] font-semibold text-muted-foreground shrink-0">
          {lead.contactName.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-medium text-foreground truncate">{lead.contactName}</span>
            {lead.isNew && <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[9px] px-1 py-0 h-3.5 font-semibold">NEW</Badge>}
            {lead.isHot && <Flame className="h-3 w-3 text-amber-500 shrink-0" />}
            {lead.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-[9px] px-1 py-0 h-3.5 border-amber-300 text-amber-700 bg-amber-50">{tag}</Badge>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="truncate">{lead.email}</span>
            <span className="text-muted-foreground/30">·</span>
            <span className="font-mono text-[10px]">{lead.ref}</span>
          </div>
        </div>
      </div>

      {/* Property */}
      <div className="min-w-0">
        {lead.property ? (
          <div className="flex items-center gap-2">
            <div className="h-8 w-12 rounded bg-muted overflow-hidden shrink-0">
              <img src={lead.property.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-foreground truncate">{lead.property.type}, {lead.property.bedrooms} Bed</p>
              <p className="text-[10px] text-muted-foreground truncate">{lead.property.price}</p>
            </div>
          </div>
        ) : (
          <span className="text-[11px] text-muted-foreground/40">—</span>
        )}
      </div>

      {/* Origin */}
      <div className="text-[11px] text-muted-foreground">{lead.origin}</div>

      {/* Stage */}
      <div className="flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${stage.dot}`} />
        <span className="text-[11px] text-foreground">{stage.label}</span>
      </div>

      {/* Date */}
      <div className="text-[10px] text-muted-foreground tabular-nums">
        {lead.createdAt.split(" ")[0]}
      </div>

      {/* Actions */}
      <div onClick={e => e.stopPropagation()} className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-accent transition-opacity">
              <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 text-[12px]">
            <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={onView}>Ver detalle</DropdownMenuItem>
            <DropdownMenuSeparator />
            {tabMode === "leads" && <DropdownMenuItem className="text-emerald-600">Pasar a Oportunidad</DropdownMenuItem>}
            <DropdownMenuItem>Asignar agente</DropdownMenuItem>
            <DropdownMenuItem>Enviar email</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Descartar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

/* ─── Edit Dialog ─── */
const EditLeadDialog = ({ lead, onClose }: { lead: Lead; onClose: () => void }) => (
  <Dialog open onOpenChange={onClose}>
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="text-base">Editar · {lead.ref}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Nombre</Label>
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
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Nota</Label>
          <Textarea className="mt-1 text-[13px] min-h-[60px]" placeholder="Añadir comentario del agente..." />
        </div>
      </div>
      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={onClose} className="text-[12px] h-8">Cancelar</Button>
        <Button className="text-[12px] h-8">Guardar</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default OpportunitiesPage;
