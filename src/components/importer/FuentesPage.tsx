import { useState } from "react";
import { Plus, Play, Pencil, ClipboardList, Trash2, Copy, Check, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockSources } from "./mock-data";
import type { ImportSource } from "./types";

const formatBadge = (f: ImportSource["format"]) => {
  const map = { kyero: { label: "Kyero", cls: "bg-blue-100 text-blue-700 border-blue-200" }, xml_generic: { label: "XML Genérico", cls: "bg-muted text-muted-foreground border-border" }, xml_custom: { label: "XML Custom", cls: "bg-purple-100 text-purple-700 border-purple-200" } };
  const m = map[f];
  return <Badge variant="outline" className={m.cls}>{m.label}</Badge>;
};

const freqLabel: Record<string, string> = { manual: "Manual", "1h": "Cada hora", "6h": "Cada 6 horas", "12h": "Cada 12 horas", "24h": "Cada 24 horas", custom: "Personalizado" };

function timeAgo(iso?: string) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

function formatDt(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-ES", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

const rowBorder = (s: ImportSource) => {
  if (!s.active) return "border-l-4 border-l-muted-foreground/30";
  if (s.lastRunStatus === "error") return "border-l-4 border-l-yellow-400";
  return "border-l-4 border-l-green-500";
};

interface FuentesPageProps {
  onOpenMapeo?: (sourceId: string) => void;
  onOpenHistorial?: () => void;
}

const FuentesPage = ({ onOpenMapeo, onOpenHistorial }: FuentesPageProps) => {
  const [sources, setSources] = useState<ImportSource[]>(mockSources);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ImportSource | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formFormat, setFormFormat] = useState<ImportSource["format"]>("kyero");
  const [formFreq, setFormFreq] = useState<ImportSource["frequency"]>("6h");
  const [formCron, setFormCron] = useState("");
  const [formTestMode, setFormTestMode] = useState(false);
  const [formActive, setFormActive] = useState(true);

  const openNew = () => {
    setEditing(null);
    setFormName(""); setFormUrl(""); setFormFormat("kyero"); setFormFreq("6h"); setFormCron(""); setFormTestMode(false); setFormActive(true);
    setModalOpen(true);
  };

  const openEdit = (s: ImportSource) => {
    setEditing(s);
    setFormName(s.name); setFormUrl(s.feedUrl); setFormFormat(s.format); setFormFreq(s.frequency); setFormCron(s.cronExpression || ""); setFormTestMode(s.testMode); setFormActive(s.active);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      setSources(prev => prev.map(s => s.id === editing.id ? { ...s, name: formName, feedUrl: formUrl, format: formFormat, frequency: formFreq, cronExpression: formCron, testMode: formTestMode, active: formActive } : s));
    } else {
      const newSource: ImportSource = { id: String(Date.now()), name: formName, feedUrl: formUrl, format: formFormat, frequency: formFreq, cronExpression: formCron, testMode: formTestMode, active: formActive };
      setSources(prev => [...prev, newSource]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => setSources(prev => prev.filter(s => s.id !== id));
  const toggleActive = (id: string) => setSources(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 sm:px-8 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">Fuentes XML</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Gestiona los feeds de importación de propiedades</p>
          </div>
          <Button onClick={openNew} className="bg-[#6366F1] hover:bg-[#5558E6] text-white">
            <Plus className="h-4 w-4 mr-1.5" /> Nueva fuente
          </Button>
        </div>

        {sources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <FileDown className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-base font-medium text-foreground mb-1">No hay fuentes configuradas</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">Añade tu primer feed XML para empezar a importar propiedades automáticamente.</p>
            <Button onClick={openNew} className="bg-[#6366F1] hover:bg-[#5558E6] text-white">
              <Plus className="h-4 w-4 mr-1.5" /> Nueva fuente
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-medium">Nombre</TableHead>
                  <TableHead className="text-xs font-medium">URL del feed</TableHead>
                  <TableHead className="text-xs font-medium">Formato</TableHead>
                  <TableHead className="text-xs font-medium">Frecuencia</TableHead>
                  <TableHead className="text-xs font-medium">Estado</TableHead>
                  <TableHead className="text-xs font-medium">Última ejecución</TableHead>
                  <TableHead className="text-xs font-medium">Próxima</TableHead>
                  <TableHead className="text-xs font-medium text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sources.map(s => (
                  <TableRow key={s.id} className={rowBorder(s)}>
                    <TableCell className="font-medium text-[13px]">{s.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 max-w-[200px]">
                        <span className="text-xs text-muted-foreground truncate font-mono">{s.feedUrl}</span>
                        <button onClick={() => copyUrl(s.id, s.feedUrl)} className="shrink-0 text-muted-foreground hover:text-foreground">
                          {copiedId === s.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>{formatBadge(s.format)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{freqLabel[s.frequency]}</TableCell>
                    <TableCell>
                      <Switch checked={s.active} onCheckedChange={() => toggleActive(s.id)} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{timeAgo(s.lastRun)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDt(s.nextRun)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-0.5">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Ejecutar"><Play className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Editar" onClick={() => openEdit(s)}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Mapeo" onClick={() => onOpenMapeo?.(s.id)}><ClipboardList className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" title="Eliminar" onClick={() => handleDelete(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Modal Nueva/Editar fuente */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar fuente" : "Nueva fuente"}</DialogTitle>
            <DialogDescription>Configura los datos del feed XML.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Nombre</Label>
              <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Ej: Kyero Feed Principal" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">URL del feed XML</Label>
              <Input type="url" value={formUrl} onChange={e => setFormUrl(e.target.value)} placeholder="https://..." className="font-mono text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Formato</Label>
                <Select value={formFormat} onValueChange={(v) => setFormFormat(v as ImportSource["format"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kyero">Kyero</SelectItem>
                    <SelectItem value="xml_generic">XML Genérico</SelectItem>
                    <SelectItem value="xml_custom">XML Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Frecuencia</Label>
                <Select value={formFreq} onValueChange={(v) => setFormFreq(v as ImportSource["frequency"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="1h">Cada hora</SelectItem>
                    <SelectItem value="6h">Cada 6 horas</SelectItem>
                    <SelectItem value="12h">Cada 12 horas</SelectItem>
                    <SelectItem value="24h">Cada 24 horas</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {formFreq === "custom" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Expresión cron</Label>
                <Input value={formCron} onChange={e => setFormCron(e.target.value)} placeholder="0 */6 * * *" className="font-mono text-xs" />
                <p className="text-[10px] text-muted-foreground">Formato: minuto hora día mes díaSemana</p>
              </div>
            )}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Modo test</p>
                <p className="text-[11px] text-muted-foreground">No guarda en base de datos</p>
              </div>
              <Switch checked={formTestMode} onCheckedChange={setFormTestMode} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <p className="text-sm font-medium">Activo</p>
              <Switch checked={formActive} onCheckedChange={setFormActive} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-[#6366F1] hover:bg-[#5558E6] text-white" disabled={!formName || !formUrl}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FuentesPage;
