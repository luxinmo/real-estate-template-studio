import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Eye, Calendar, Tag, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { MOCK_BLOG_POSTS } from "./mock-data";

const statusColor: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-amber-100 text-amber-700",
  scheduled: "bg-blue-100 text-blue-700",
};

interface Props {
  onEdit: (id: string) => void;
  onNew: () => void;
}

const CmsBlogListPage = ({ onEdit, onNew }: Props) => {
  const [search, setSearch] = useState("");
  const posts = MOCK_BLOG_POSTS.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 sm:px-8 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">Blog</h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">Gestiona artículos y entradas del blog</p>
          </div>
          <Button size="sm" onClick={onNew} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Nuevo Artículo
          </Button>
        </div>

        <div className="max-w-sm mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar artículos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-[13px]" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-[12px] font-medium">Título</TableHead>
                <TableHead className="text-[12px] font-medium">Autor</TableHead>
                <TableHead className="text-[12px] font-medium">Categoría</TableHead>
                <TableHead className="text-[12px] font-medium">Tags</TableHead>
                <TableHead className="text-[12px] font-medium">Estado</TableHead>
                <TableHead className="text-[12px] font-medium">Actualizado</TableHead>
                <TableHead className="text-[12px] font-medium text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id} className="cursor-pointer hover:bg-muted/20" onClick={() => onEdit(post.id)}>
                  <TableCell className="text-[13px] font-medium flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="line-clamp-1">{post.title}</span>
                  </TableCell>
                  <TableCell className="text-[13px] text-muted-foreground">{post.author}</TableCell>
                  <TableCell className="text-[13px] text-muted-foreground capitalize">{post.category.replace("-", " ")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 flex-wrap">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground">
                          <Tag className="h-2.5 w-2.5" />{tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && <span className="text-[10px] text-muted-foreground">+{post.tags.length - 2}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${statusColor[post.status]}`}>
                      {post.status === "scheduled" && <Calendar className="h-3 w-3" />}
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-[13px] text-muted-foreground">{post.updatedAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(`/blog/${post.slug}`, "_blank")}><Eye className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(post.id)}><Edit2 className="h-3.5 w-3.5" /></Button>
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

export default CmsBlogListPage;
