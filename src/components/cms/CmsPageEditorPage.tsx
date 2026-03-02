import { useState } from "react";
import { ArrowLeft, Save, Eye, Calendar, Upload, X, Image as ImageIcon, AlertTriangle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/locations/shared/RichTextEditor";
import { MOCK_PAGES, CmsPage } from "./mock-data";

const LANGUAGES = [
  { code: "es", label: "ES", name: "Español" },
  { code: "en", label: "EN", name: "English" },
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "fr", label: "FR", name: "Français" },
  { code: "ru", label: "RU", name: "Русский" },
  { code: "nl", label: "NL", name: "Nederlands" },
];

interface LangContent {
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
}

const emptyLangContent = (): LangContent => ({
  title: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
});

interface Props {
  pageId?: string | null;
  onBack: () => void;
}

const CmsPageEditorPage = ({ pageId, onBack }: Props) => {
  const existing = pageId ? MOCK_PAGES.find((pg) => pg.id === pageId) : null;

  const [activeLang, setActiveLang] = useState("es");
  const [langData, setLangData] = useState<Record<string, LangContent>>(() => {
    const init: Record<string, LangContent> = {};
    LANGUAGES.forEach((l) => {
      if (l.code === "es") {
        init[l.code] = {
          title: existing?.title ?? "",
          content: existing?.content ?? "",
          metaTitle: existing?.metaTitle ?? "",
          metaDescription: existing?.metaDescription ?? "",
        };
      } else {
        init[l.code] = emptyLangContent();
      }
    });
    return init;
  });

  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [parentId, setParentId] = useState(existing?.parentId ?? "none");
  const [status, setStatus] = useState(existing?.status ?? "draft");
  const [scheduledAt, setScheduledAt] = useState(existing?.scheduledAt ?? "");
  const [htmlMode, setHtmlMode] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<string | null>(existing?.featuredImage ?? null);

  const currentLang = langData[activeLang];

  const updateLangField = (field: keyof LangContent, value: string) => {
    setLangData((prev) => ({
      ...prev,
      [activeLang]: { ...prev[activeLang], [field]: value },
    }));
  };

  const handleTitleChange = (val: string) => {
    updateLangField("title", val);
    if (!existing && activeLang === "es") {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
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

  // Check which languages are untranslated (no title filled)
  const untranslatedLangs = LANGUAGES.filter(
    (l) => !langData[l.code].title.trim()
  );

  const isLangTranslated = (code: string) => !!langData[code].title.trim();

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

        {/* Language Tabs */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Globe className="h-4 w-4 text-muted-foreground mr-1" />
            {LANGUAGES.map((lang) => {
              const isActive = activeLang === lang.code;
              const translated = isLangTranslated(lang.code);
              return (
                <button
                  key={lang.code}
                  onClick={() => setActiveLang(lang.code)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : translated
                      ? "bg-muted text-foreground hover:bg-accent"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted border border-dashed border-border"
                  }`}
                  title={`${lang.name}${!translated ? " — Sin traducir" : ""}`}
                >
                  {lang.label}
                  {!translated && !isActive && (
                    <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Untranslated warning */}
          {untranslatedLangs.length > 0 && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[12px] font-medium text-amber-800">
                  {untranslatedLangs.length} idioma{untranslatedLangs.length > 1 ? "s" : ""} sin traducir
                </p>
                <p className="text-[11px] text-amber-600 mt-0.5">
                  Faltan: {untranslatedLangs.map((l) => l.name).join(", ")}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main */}
          <div className="space-y-5">
            <div>
              <Label className="text-[12px] font-medium mb-1.5 block">Título <span className="text-muted-foreground uppercase text-[10px] ml-1">({activeLang})</span></Label>
              <Input value={currentLang.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Título de la página" className="text-[13px] h-10" />
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
                <Label className="text-[12px] font-medium">Contenido <span className="text-muted-foreground uppercase text-[10px] ml-1">({activeLang})</span></Label>
                <button onClick={() => setHtmlMode(!htmlMode)} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-0.5 rounded border border-border">
                  {htmlMode ? "Editor visual" : "HTML"}
                </button>
              </div>
              {htmlMode ? (
                <Textarea value={currentLang.content} onChange={(e) => updateLangField("content", e.target.value)} className="font-mono text-[12px] min-h-[400px]" />
              ) : (
                <RichTextEditor value={currentLang.content} onChange={(v) => updateLangField("content", v)} minHeight={400} placeholder="Escribe el contenido de la página..." />
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

            {/* Language status card */}
            <div className="rounded-lg border border-border bg-card p-4 space-y-3">
              <h3 className="text-[13px] font-semibold flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" /> Idiomas
              </h3>
              <div className="space-y-1.5">
                {LANGUAGES.map((lang) => {
                  const translated = isLangTranslated(lang.code);
                  return (
                    <div key={lang.code} className="flex items-center justify-between">
                      <span className="text-[12px] text-muted-foreground">{lang.name}</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                        translated ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {translated ? "Traducido" : "Pendiente"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
              <h3 className="text-[13px] font-semibold">SEO <span className="text-muted-foreground uppercase text-[10px] ml-1">({activeLang})</span></h3>
              <div>
                <Label className="text-[12px] font-medium mb-1.5 block">Meta título</Label>
                <Input value={currentLang.metaTitle} onChange={(e) => updateLangField("metaTitle", e.target.value)} className="text-[13px] h-9" placeholder="Título para buscadores" />
                <p className="text-[11px] text-muted-foreground mt-1">{currentLang.metaTitle.length}/60 caracteres</p>
              </div>
              <div>
                <Label className="text-[12px] font-medium mb-1.5 block">Meta descripción</Label>
                <Textarea value={currentLang.metaDescription} onChange={(e) => updateLangField("metaDescription", e.target.value)} className="text-[12px] min-h-[80px]" placeholder="Descripción para buscadores" />
                <p className="text-[11px] text-muted-foreground mt-1">{currentLang.metaDescription.length}/160 caracteres</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmsPageEditorPage;
