import { useState } from "react";
import { ArrowLeft, Save, Eye, X, Image as ImageIcon, Plus, Tag, GripVertical, Trash2, AlertTriangle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RichTextEditor from "@/components/locations/shared/RichTextEditor";
import { MOCK_BLOG_POSTS, BLOG_CATEGORIES, AVAILABLE_TAGS } from "./mock-data";

const LANGUAGES = [
  { code: "es", label: "ES", name: "Español" },
  { code: "en", label: "EN", name: "English" },
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "fr", label: "FR", name: "Français" },
  { code: "ru", label: "RU", name: "Русский" },
  { code: "nl", label: "NL", name: "Nederlands" },
];

interface FaqItem { question: string; answer: string; }

interface LangContent {
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  faq: FaqItem[];
}

const emptyLangContent = (): LangContent => ({
  title: "",
  excerpt: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
  faq: [{ question: "", answer: "" }],
});

interface Props {
  postId?: string | null;
  onBack: () => void;
}

const CmsBlogEditorPage = ({ postId, onBack }: Props) => {
  const existing = postId ? MOCK_BLOG_POSTS.find((p) => p.id === postId) : null;

  const [activeLang, setActiveLang] = useState("es");
  const [langData, setLangData] = useState<Record<string, LangContent>>(() => {
    const init: Record<string, LangContent> = {};
    LANGUAGES.forEach((l) => {
      if (l.code === "es") {
        init[l.code] = {
          title: existing?.title ?? "",
          excerpt: existing?.excerpt ?? "",
          content: existing?.content ?? "",
          metaTitle: "",
          metaDescription: "",
          faq: existing?.faq ?? [{ question: "", answer: "" }],
        };
      } else {
        init[l.code] = emptyLangContent();
      }
    });
    return init;
  });

  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [author, setAuthor] = useState(existing?.author ?? "");
  const [category, setCategory] = useState(existing?.category ?? "lifestyle");
  const [tags, setTags] = useState<string[]>(existing?.tags ?? []);
  const [htmlMode, setHtmlMode] = useState(false);
  const [status, setStatus] = useState(existing?.status ?? "draft");
  const [scheduledAt, setScheduledAt] = useState(existing?.scheduledAt ?? "");
  const [featuredImage, setFeaturedImage] = useState<string | null>(existing?.featuredImage ?? null);
  const [tagInput, setTagInput] = useState("");

  const currentLang = langData[activeLang];

  const updateLangField = (field: keyof LangContent, value: any) => {
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

  const addTag = (tag: string) => {
    const t = tag.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const untranslatedLangs = LANGUAGES.filter(
    (l) => !langData[l.code].title.trim()
  );

  const isLangTranslated = (code: string) => !!langData[code].title.trim();

  const faqItems = currentLang.faq;
  const setFaqItems = (items: FaqItem[]) => updateLangField("faq", items);

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 sm:px-8 pt-5 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Volver al Blog
          </button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.open(`/blog/${slug}`, "_blank")}>
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
              <Input value={currentLang.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Título del artículo" className="text-[13px] h-10" />
            </div>

            <div>
              <Label className="text-[12px] font-medium mb-1.5 block">Slug</Label>
              <div className="flex items-center">
                <span className="text-[12px] text-muted-foreground bg-muted px-3 py-2 border border-r-0 border-input rounded-l-md h-10 flex items-center">/blog/</span>
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

            {/* Excerpt */}
            <div>
              <Label className="text-[12px] font-medium mb-1.5 block">Extracto <span className="text-muted-foreground uppercase text-[10px] ml-1">({activeLang})</span></Label>
              <Textarea value={currentLang.excerpt} onChange={(e) => updateLangField("excerpt", e.target.value)} className="text-[13px] min-h-[80px]" placeholder="Resumen breve del artículo..." />
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
                <RichTextEditor value={currentLang.content} onChange={(v) => updateLangField("content", v)} minHeight={400} placeholder="Escribe el contenido del artículo..." />
              )}
            </div>

            {/* FAQ Section */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-[12px] font-medium">Preguntas y Respuestas (FAQ) <span className="text-muted-foreground uppercase text-[10px] ml-1">({activeLang})</span></Label>
                <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1" onClick={() => setFaqItems([...faqItems, { question: "", answer: "" }])}>
                  <Plus className="h-3 w-3" /> Añadir pregunta
                </Button>
              </div>
              <div className="space-y-3">
                {faqItems.map((item, i) => (
                  <div key={i} className="rounded-lg border border-border bg-card p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                        <GripVertical className="h-3.5 w-3.5" />
                        <span>Pregunta {i + 1}</span>
                      </div>
                      {faqItems.length > 1 && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setFaqItems(faqItems.filter((_, idx) => idx !== i))}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                    <Input
                      value={item.question}
                      onChange={(e) => { const updated = [...faqItems]; updated[i] = { ...updated[i], question: e.target.value }; setFaqItems(updated); }}
                      placeholder="Escribe la pregunta..."
                      className="text-[13px] h-9"
                    />
                    <Textarea
                      value={item.answer}
                      onChange={(e) => { const updated = [...faqItems]; updated[i] = { ...updated[i], answer: e.target.value }; setFaqItems(updated); }}
                      placeholder="Escribe la respuesta..."
                      className="text-[12px] min-h-[80px]"
                    />
                  </div>
                ))}
              </div>
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
              <div>
                <Label className="text-[12px] font-medium mb-1.5 block">Autor</Label>
                <Input value={author} onChange={(e) => setAuthor(e.target.value)} className="text-[13px] h-9" placeholder="Nombre del autor" />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
              <h3 className="text-[13px] font-semibold">Categoría</h3>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BLOG_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">{c.replace("-", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
              <h3 className="text-[13px] font-semibold">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-muted text-muted-foreground">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-foreground"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); } }} className="text-[12px] h-8 flex-1" placeholder="Añadir tag..." />
                <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => addTag(tagInput)}><Plus className="h-3.5 w-3.5" /></Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {AVAILABLE_TAGS.filter((t) => !tags.includes(t)).slice(0, 6).map((t) => (
                  <button key={t} onClick={() => addTag(t)} className="text-[10px] px-2 py-0.5 rounded border border-border text-muted-foreground hover:bg-muted transition-colors">{t}</button>
                ))}
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

            {/* SEO per language */}
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

export default CmsBlogEditorPage;
