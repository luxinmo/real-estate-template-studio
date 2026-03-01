import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Eye, Calendar, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { MOCK_PAGES, CmsPage } from "./mock-data";

const statusColor: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-amber-100 text-amber-700",
  scheduled: "bg-blue-100 text-blue-700",
};

interface Props {
  onEdit: (id: string) => void;
  onNew: () => void;
}

const CmsPagesListPage = ({ onEdit, onNew }: Props) => {
  const [search, setSearch] = useState("");
  const pages = MOCK_PAGES.filter((pg) => pg.title.toLowerCase().includes(search.toLowerCase()));

  const getParentTitle = (parentId: string | null) => {
    if (!parentId) return "—";
    return MOCK_PAGES.find((pg) => pg.id === parentId)?.title ?? "—";
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 sm:px-8 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">Páginas</h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">Gestiona las páginas estáticas de tu web</p>
          </div>
          <Button size="sm" onClick={onNew} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Nueva Página
          </Button>
        </div>

        <div className="max-w-sm mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar páginas..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-[13px]" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-[12px] font-medium">Título</TableHead>
                <TableHead className="text-[12px] font-medium">Slug</TableHead>
                <TableHead className="text-[12px] font-medium">Padre</TableHead>
                <TableHead className="text-[12px] font-medium">Estado</TableHead>
                <TableHead className="text-[12px] font-medium">Actualizado</TableHead>
                <TableHead className="text-[12px] font-medium text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((pg) => (
                <TableRow key={pg.id} className="cursor-pointer hover:bg-muted/20" onClick={() => onEdit(pg.id)}>
                  <TableCell className="text-[13px] font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    {pg.title}
                  </TableCell>
                  <TableCell className="text-[13px] text-muted-foreground">/page/{pg.slug}</TableCell>
                  <TableCell className="text-[13px] text-muted-foreground">{getParentTitle(pg.parentId)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${statusColor[pg.status]}`}>
                      {pg.status === "scheduled" && <Calendar className="h-3 w-3" />}
                      {pg.status.charAt(0).toUpperCase() + pg.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-[13px] text-muted-foreground">{pg.updatedAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(`/page/${pg.slug}`, "_blank")}><Eye className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(pg.id)}><Edit2 className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CmsPagesListPage;
