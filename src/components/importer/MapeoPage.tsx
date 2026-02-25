import { useState } from "react";
import { ArrowLeft, ArrowRight, Plus, Trash2, ChevronDown, ChevronRight, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { mockFieldMappings, mockValueMappings, mockSources, OMNI_FIELDS } from "./mock-data";
import type { FieldMapping, ValueMapping } from "./types";

interface MapeoPageProps {
  sourceId: string;
  onBack: () => void;
}

const typeBadge = (t: string) => {
  const cls = t === "number" ? "bg-blue-50 text-blue-600 border-blue-200" : t === "boolean" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-muted text-muted-foreground border-border";
  return <Badge variant="outline" className={`text-[10px] ${cls}`}>{t}</Badge>;
};

const MapeoPage = ({ sourceId, onBack }: MapeoPageProps) => {
  const source = mockSources.find(s => s.id === sourceId);
  const [fields, setFields] = useState<FieldMapping[]>(mockFieldMappings);
  const [values, setValues] = useState<ValueMapping[]>(mockValueMappings);
  const [patterns, setPatterns] = useState([{ pattern: "ref*", target: "Referencia" }, { pattern: "price*", target: "Precio" }]);
  const [blockTag, setBlockTag] = useState("property");
  const [testMode, setTestMode] = useState(false);
  const [rawConfig, setRawConfig] = useState(JSON.stringify({ blockTag: "property", encoding: "utf-8" }, null, 2));
  const [rawOpen, setRawOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ Propiedad: true, Ubicación: true, Superficie: true, Detalles: true, Media: true });

  const xmlFieldOptions = fields.map(f => f.xmlField);

  const setMapping = (xmlField: string, targetField: string) => {
    setFields(prev => prev.map(f => f.xmlField === xmlField ? { ...f, targetField } : f));
  };

  const getMappedXmlField = (omniField: string) => {
    const found = fields.find(f => f.targetField?.toLowerCase().replace(/[áéíóú\s]/g, m => {
      const map: Record<string, string> = { "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", " ": "_" };
      return map[m] || m;
    }) === omniField.toLowerCase().replace(/[áéíóú\s.]/g, m => {
      const map: Record<string, string> = { "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", " ": "_", ".": "_" };
      return map[m] || m;
    }));
    return found?.xmlField || "";
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 sm:px-8 pt-6 pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">Mapeo: {source?.name || "Fuente"}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Configura cómo se traducen los campos del XML a los campos de OMNI47</p>
          </div>
        </div>

        <Tabs defaultValue="campos" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="campos">Campos</TabsTrigger>
            <TabsTrigger value="valores">Valores</TabsTrigger>
            <TabsTrigger value="patrones">Patrones</TabsTrigger>
            <TabsTrigger value="config">Configuración</TabsTrigger>
          </TabsList>

          {/* ══════ CAMPOS TAB ══════ */}
          <TabsContent value="campos">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: XML Fields */}
              <div className="bg-card rounded-lg border p-4">
                <h3 className="text-sm font-semibold mb-3 text-foreground">Campos del XML</h3>
                <div className="space-y-1">
                  {fields.map(f => (
                    <div key={f.xmlField} className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-muted/50 transition-colors">
                      <span className="font-mono text-xs text-foreground flex-1">{f.xmlField}</span>
                      {typeBadge(f.xmlType)}
                      <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">{f.sampleValue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: OMNI47 Fields */}
              <div className="bg-card rounded-lg border p-4">
                <h3 className="text-sm font-semibold mb-3 text-foreground">Campos OMNI47</h3>
                <div className="space-y-3">
                  {Object.entries(OMNI_FIELDS).map(([section, sectionFields]) => (
                    <Collapsible key={section} open={expandedSections[section]} onOpenChange={(open) => setExpandedSections(prev => ({ ...prev, [section]: open }))}>
                      <CollapsibleTrigger className="flex items-center gap-1.5 w-full text-left">
                        {expandedSections[section] ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{section}</span>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-1.5 space-y-1 pl-5">
                          {sectionFields.map(field => {
                            const mapped = getMappedXmlField(field);
                            return (
                              <div key={field} className="flex items-center gap-2 py-1">
                                <span className="text-xs text-foreground w-28 shrink-0">{field}</span>
                                <ArrowLeft className="h-3 w-3 text-muted-foreground shrink-0" />
                                <Select value={mapped} onValueChange={(v) => {
                                  // clear previous mapping to this target, set new one
                                  setFields(prev => prev.map(f => {
                                    const normalized = field.toLowerCase().replace(/[áéíóú\s.]/g, m => {
                                      const map: Record<string, string> = { "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", " ": "_", ".": "_" };
                                      return map[m] || m;
                                    });
                                    if (f.xmlField === v) return { ...f, targetField: normalized };
                                    if (f.targetField === normalized) return { ...f, targetField: "" };
                                    return f;
                                  }));
                                }}>
                                  <SelectTrigger className="h-7 text-xs font-mono flex-1">
                                    <SelectValue placeholder="Sin asignar" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="">Sin asignar</SelectItem>
                                    {xmlFieldOptions.map(xf => (
                                      <SelectItem key={xf} value={xf}>{xf}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            );
                          })}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t">
              <Button variant="outline">Validar mapeo</Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white" disabled>Activar mapeo</Button>
            </div>
          </TabsContent>

          {/* ══════ VALORES TAB ══════ */}
          <TabsContent value="valores">
            <div className="bg-card rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs">Valor XML</TableHead>
                    <TableHead className="text-xs w-10 text-center">→</TableHead>
                    <TableHead className="text-xs">Valor OMNI47</TableHead>
                    <TableHead className="text-xs">Tipo</TableHead>
                    <TableHead className="text-xs w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {values.map(v => (
                    <TableRow key={v.id}>
                      <TableCell className="font-mono text-xs">{v.xmlValue}</TableCell>
                      <TableCell className="text-center"><ArrowRight className="h-3 w-3 text-muted-foreground mx-auto" /></TableCell>
                      <TableCell>
                        <Input defaultValue={v.omniValue} className="h-7 text-xs" />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">{v.fieldType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-3 border-t">
                <Button variant="ghost" size="sm" className="text-xs"><Plus className="h-3.5 w-3.5 mr-1" /> Añadir fila</Button>
              </div>
            </div>
          </TabsContent>

          {/* ══════ PATRONES TAB ══════ */}
          <TabsContent value="patrones">
            <div className="bg-card rounded-lg border p-4 space-y-3">
              <p className="text-sm text-muted-foreground">Define patrones para detectar campos automáticamente.</p>
              {patterns.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Input value={p.pattern} className="h-8 text-xs font-mono flex-1" placeholder="ref*" onChange={e => setPatterns(prev => prev.map((pp, j) => j === i ? { ...pp, pattern: e.target.value } : pp))} />
                  <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                  <Select value={p.target} onValueChange={v => setPatterns(prev => prev.map((pp, j) => j === i ? { ...pp, target: v } : pp))}>
                    <SelectTrigger className="h-8 text-xs w-48"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.values(OMNI_FIELDS).flat().map(f => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="text-xs"><Plus className="h-3.5 w-3.5 mr-1" /> Añadir patrón</Button>
              <div className="flex justify-end pt-2">
                <Button className="bg-[#6366F1] hover:bg-[#5558E6] text-white text-xs">Aplicar patrones</Button>
              </div>
            </div>
          </TabsContent>

          {/* ══════ CONFIGURACIÓN TAB ══════ */}
          <TabsContent value="config">
            <div className="bg-card rounded-lg border p-4 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Tag de bloque XML</Label>
                <Input value={blockTag} onChange={e => setBlockTag(e.target.value)} className="font-mono text-xs max-w-xs" />
                <p className="text-[10px] text-muted-foreground">El tag XML que envuelve cada propiedad (ej: &lt;property&gt;)</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Modo test</p>
                  <p className="text-[10px] text-muted-foreground">No guarda en base de datos</p>
                </div>
                <Switch checked={testMode} onCheckedChange={setTestMode} />
              </div>

              <Collapsible open={rawOpen} onOpenChange={setRawOpen}>
                <CollapsibleTrigger className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
                  <Code className="h-3.5 w-3.5" />
                  Configuración avanzada (JSON)
                  {rawOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Textarea value={rawConfig} onChange={e => setRawConfig(e.target.value)} className="mt-2 font-mono text-xs min-h-[200px]" />
                </CollapsibleContent>
              </Collapsible>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MapeoPage;
