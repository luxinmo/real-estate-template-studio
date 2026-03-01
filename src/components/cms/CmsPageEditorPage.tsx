import { useState } from "react";
import { ArrowLeft, Save, Eye, Calendar, Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/locations/shared/RichTextEditor";
import { MOCK_PAGES, CmsPage } from "./mock-data";

interface Props {
  pageId?: string | null;
  onBack: () => void;
}

const CmsPageEditorPage = ({ pageId, onBack }: Props) => {
  const existing = pageId ? MOCK_PAGES.find((pg) => pg.id === pageId) : null;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [parentId, setParentId] = useState(existing?.parentId ?? "none");
  const [status, setStatus] = useState(existing?.status ?? "draft");
  const [scheduledAt, setScheduledAt] = useState(existing?.scheduledAt ?? "");
  const [content, setContent] = useState(existing?.content ?? "");
  const [htmlMode, setHtmlMode] = useState(false);
  const [metaTitle, setMetaTitle] = useState(existing?.metaTitle ?? "");
  const [metaDesc, setMetaDesc] = useState(existing?.metaDescription ?? "");
  const [featuredImage, setFeaturedImage] = useState<string | null>(existing?.featuredImage ?? null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!existing) setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) setFeaturedImage(URL.createObjectURL(file));
    };
    input.click();
  };

  const parentPages = MOCK_PAGES.filter((pg) => pg.id !== pageId && !pg.parentId);

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 sm:px-8 pt-5 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Volver a Páginas
          </button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.open(`/page/${slug}`, "_blank")}>
              <Eye className="h-3.5 w-3.5" /> Vista previa
            </Button>
            <Button size="sm" className="gap-1.5">
              <Save className="h-3.5 w-3.5" /> Guardar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main */}
          <div className="space-y-5">
            <div>
              <Label className="text-[12px] font-medium mb-1.5 block">Título</Label>
              <Input value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Título de la página" className="text-[13px] h-10" />
            </div>

            <div>
              <Label className="text-[12px] font-medium mb-1.5 block">Slug</Label>
              <div className="flex items-center gap-0">
                <span className="text-[12px] text-muted-foreground bg-muted px-3 py-2 border border-r-0 border-input rounded-l-md h-10 flex items-center">/page/</span>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="text-[13px] h-10 rounded-l-none" />
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <Label className="text-[12px] font-medium mb-1.5 block">Imagen destacada</Label>
              {featuredImage ? (
                <div className="relative rounded-lg overflow-hidden border border-border aspect-[16/7]">
                  <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
                  <button onClick={() => setFeaturedImage(null)} className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button onClick={handleImageUpload} className="w-full border-2 border-dashed border-border rounded-lg py-10 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors">
                  <ImageIcon className="h-8 w-8" />
                  <span className="text-[13px]">Haz clic para subir una imagen</span>
                </button>
              )}
            </div>

            {/* Content Editor */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-[12px] font-medium">Contenido</Label>
                <button onClick={() => setHtmlMode(!htmlMode)} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-0.5 rounded border border-border">
                  {htmlMode ? "Editor visual" : "HTML"}
                </button>
              </div>
              {htmlMode ? (
                <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="font-mono text-[12px] min-h-[400px]" />
              ) : (
                <RichTextEditor value={content} onChange={setContent} minHeight={400} placeholder="Escribe el contenido de la página..." />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
              <h3 className="text-[13px] font-semibold">Publicación</h3>
              <div>
                <Label className="text-[12px] font-medium mb-1.5 block">Estado</Label>
                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                  <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="scheduled">Programado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {status === "scheduled" && (
                <div>
                  <Label className="text-[12px] font-medium mb-1.5 block">Fecha programada</Label>
                  <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="text-[13px] h-9" />
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
              <h3 className="text-[13px] font-semibold">Jerarquía</h3>
              <div>
                <Label className="text-[12px] font-medium mb-1.5 block">Página padre</Label>
                <Select value={parentId ?? "none"} onValueChange={(v) => setParentId(v === "none" ? null : v)}>
                  <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ninguna (raíz)</SelectItem>
                    {parentPages.map((pg) => (
                      <SelectItem key={pg.id} value={pg.id}>{pg.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
              <h3 className="text-[13px] font-semibold">SEO</h3>
              <div>
                <Label className="text-[12px] font-medium mb-1.5 block">Meta título</Label>
                <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="text-[13px] h-9" placeholder="Título para buscadores" />
                <p className="text-[11px] text-muted-foreground mt-1">{metaTitle.length}/60 caracteres</p>
              </div>
              <div>
                <Label className="text-[12px] font-medium mb-1.5 block">Meta descripción</Label>
                <Textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} className="text-[12px] min-h-[80px]" placeholder="Descripción para buscadores" />
                <p className="text-[11px] text-muted-foreground mt-1">{metaDesc.length}/160 caracteres</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmsPageEditorPage;
