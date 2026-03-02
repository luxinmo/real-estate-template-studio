# Next.js CMS Components — Complete Code (Multilingual + AI Translation)

> 4 standalone components ready to copy-paste into any Next.js project.  
> Dependencies: `lucide-react` only (+ React).  
> All use Tailwind CSS utility classes — no `@apply`.  
> **Multilingual**: ES 🇪🇸 · EN 🇬🇧 · DE 🇩🇪 · FR 🇫🇷  
> **AI Translation**: Botón "Traducir con IA" en cada editor

---

## Architecture Overview

### Multilingual Data Model

Todos los campos traducibles (`title`, `content`, `excerpt`, `metaTitle`, `metaDescription`, `faq`) almacenan un `Record<Lang, string>` en lugar de un `string` simple:

```typescript
type Lang = "es" | "en" | "de" | "fr";

const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: "es", label: "ES", flag: "🇪🇸" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "de", label: "DE", flag: "🇩🇪" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
];

// Ejemplo de campo multilingüe
interface MultiLangField {
  es: string;
  en: string;
  de: string;
  fr: string;
}
```

### AI Translation Flow

```
[Usuario escribe en ES] → [Click "🤖 Traducir con IA"] → [POST /api/cms/translate]
                                                              ↓
                                                    OpenAI / Google Translate API
                                                              ↓
                                                    [Rellena EN, DE, FR automáticamente]
```

---

## 1. PAGES LIST — `CmsPagesListPage.tsx`

```tsx
"use client";

import { useState } from "react";
import {
  Plus, Search, Edit2, Trash2, Eye, Calendar, FileText, Globe,
} from "lucide-react";

/* ───────── Types ───────── */
type Lang = "es" | "en" | "de" | "fr";

interface CmsPage {
  id: string;
  title: Record<Lang, string>;
  slug: string;
  parentId: string | null;
  status: "published" | "draft" | "scheduled";
  publishedAt: string | null;
  scheduledAt: string | null;
  updatedAt: string;
  translations: Lang[]; // idiomas con contenido completo
}

/* ───────── Mock data ───────── */
const MOCK_PAGES: CmsPage[] = [
  { id: "p1", title: { es: "Sobre Nosotros", en: "About Us", de: "Über Uns", fr: "À Propos" }, slug: "about", parentId: null, status: "published", publishedAt: "2026-01-15", scheduledAt: null, updatedAt: "2026-02-20", translations: ["es", "en", "de", "fr"] },
  { id: "p2", title: { es: "Términos y Condiciones", en: "Terms & Conditions", de: "AGB", fr: "Conditions Générales" }, slug: "terms", parentId: null, status: "published", publishedAt: "2026-01-10", scheduledAt: null, updatedAt: "2026-01-10", translations: ["es", "en"] },
  { id: "p3", title: { es: "Política de Privacidad", en: "Privacy Policy", de: "", fr: "" }, slug: "privacy", parentId: null, status: "published", publishedAt: "2026-01-10", scheduledAt: null, updatedAt: "2026-01-10", translations: ["es", "en"] },
  { id: "p4", title: { es: "Nuestro Equipo", en: "", de: "", fr: "" }, slug: "team", parentId: "p1", status: "draft", publishedAt: null, scheduledAt: null, updatedAt: "2026-02-25", translations: ["es"] },
  { id: "p5", title: { es: "Carreras", en: "Careers", de: "Karriere", fr: "Carrières" }, slug: "careers", parentId: "p1", status: "scheduled", publishedAt: null, scheduledAt: "2026-03-15", updatedAt: "2026-02-28", translations: ["es", "en", "de", "fr"] },
];

const LANG_FLAGS: Record<Lang, string> = { es: "🇪🇸", en: "🇬🇧", de: "🇩🇪", fr: "🇫🇷" };

const STATUS_COLOR: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-amber-100 text-amber-700",
  scheduled: "bg-blue-100 text-blue-700",
};

/* ───────── Component ───────── */
interface Props {
  onEdit: (id: string) => void;
  onNew: () => void;
}

export default function CmsPagesListPage({ onEdit, onNew }: Props) {
  const [search, setSearch] = useState("");
  const pages = MOCK_PAGES.filter((pg) =>
    pg.title.es.toLowerCase().includes(search.toLowerCase()) ||
    pg.title.en.toLowerCase().includes(search.toLowerCase())
  );

  const getParentTitle = (parentId: string | null) => {
    if (!parentId) return "—";
    return MOCK_PAGES.find((pg) => pg.id === parentId)?.title.es ?? "—";
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 sm:px-8 pt-6 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
              Páginas
            </h1>
            <p className="text-[13px] text-gray-500 mt-0.5">
              Gestiona las páginas estáticas de tu web · 4 idiomas
            </p>
          </div>
          <button
            onClick={onNew}
            className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Nueva Página
          </button>
        </div>

        {/* Search */}
        <div className="max-w-sm mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              placeholder="Buscar páginas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 h-9 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b bg-gray-50/60">
                  <th className="h-12 px-4 text-left align-middle text-[12px] font-medium text-gray-500">Título</th>
                  <th className="h-12 px-4 text-left align-middle text-[12px] font-medium text-gray-500">Slug</th>
                  <th className="h-12 px-4 text-left align-middle text-[12px] font-medium text-gray-500">Padre</th>
                  <th className="h-12 px-4 text-left align-middle text-[12px] font-medium text-gray-500">Idiomas</th>
                  <th className="h-12 px-4 text-left align-middle text-[12px] font-medium text-gray-500">Estado</th>
                  <th className="h-12 px-4 text-left align-middle text-[12px] font-medium text-gray-500">Actualizado</th>
                  <th className="h-12 px-4 text-right align-middle text-[12px] font-medium text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((pg) => (
                  <tr
                    key={pg.id}
                    className="border-b cursor-pointer transition-colors hover:bg-gray-50/50"
                    onClick={() => onEdit(pg.id)}
                  >
                    <td className="p-4 align-middle text-[13px] font-medium text-gray-900">
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                        {pg.title.es}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-[13px] text-gray-500">
                      /page/{pg.slug}
                    </td>
                    <td className="p-4 align-middle text-[13px] text-gray-500">
                      {getParentTitle(pg.parentId)}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-0.5">
                        {(["es", "en", "de", "fr"] as Lang[]).map((lang) => (
                          <span
                            key={lang}
                            className={`text-[11px] px-1.5 py-0.5 rounded ${
                              pg.translations.includes(lang)
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-gray-100 text-gray-300"
                            }`}
                            title={pg.translations.includes(lang) ? `${lang.toUpperCase()} traducido` : `${lang.toUpperCase()} pendiente`}
                          >
                            {LANG_FLAGS[lang]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_COLOR[pg.status]}`}
                      >
                        {pg.status === "scheduled" && <Calendar className="h-3 w-3" />}
                        {pg.status.charAt(0).toUpperCase() + pg.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-[13px] text-gray-500">
                      {pg.updatedAt}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => window.open(`/page/${pg.slug}`, "_blank")} className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => onEdit(pg.id)} className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button className="inline-flex items-center justify-center h-8 w-8 rounded-md text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 2. PAGE EDITOR — `CmsPageEditorPage.tsx`

```tsx
"use client";

import { useState, useRef, useCallback } from "react";
import {
  ArrowLeft, Save, Eye, X, Image as ImageIcon,
  Bold, Italic, Underline, Heading1, Heading2, Heading3,
  List, ListOrdered, Link as LinkIcon, Sparkles, Loader2,
} from "lucide-react";

/* ───────── Types ───────── */
type Lang = "es" | "en" | "de" | "fr";

const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: "es", label: "ES", flag: "🇪🇸" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "de", label: "DE", flag: "🇩🇪" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
];

type MultiLang = Record<Lang, string>;

const emptyLang = (): MultiLang => ({ es: "", en: "", de: "", fr: "" });

interface CmsPage {
  id: string;
  title: MultiLang;
  slug: string;
  parentId: string | null;
  status: "published" | "draft" | "scheduled";
  scheduledAt: string | null;
  content: MultiLang;
  metaTitle: MultiLang;
  metaDescription: MultiLang;
  featuredImage: string | null;
}

/* ───────── Mock data ───────── */
const MOCK_PAGES: CmsPage[] = [
  {
    id: "p1",
    title: { es: "Sobre Nosotros", en: "About Us", de: "Über Uns", fr: "À Propos" },
    slug: "about",
    parentId: null,
    status: "published",
    scheduledAt: null,
    content: { es: "<p>Prestige Estates es una asesoría inmobiliaria de lujo...</p>", en: "<p>Prestige Estates is a curated luxury real estate advisory...</p>", de: "<p>Prestige Estates ist eine kuratierte Luxus-Immobilienberatung...</p>", fr: "<p>Prestige Estates est un cabinet de conseil immobilier de luxe...</p>" },
    metaTitle: { es: "Sobre Nosotros | Prestige Estates", en: "About Us | Prestige Estates", de: "Über Uns | Prestige Estates", fr: "À Propos | Prestige Estates" },
    metaDescription: { es: "Conoce nuestra asesoría inmobiliaria de lujo.", en: "Learn about our luxury real estate advisory.", de: "Erfahren Sie mehr über unsere Luxus-Immobilienberatung.", fr: "Découvrez notre cabinet de conseil immobilier de luxe." },
    featuredImage: null,
  },
  {
    id: "p2",
    title: { es: "Términos y Condiciones", en: "Terms & Conditions", de: "", fr: "" },
    slug: "terms",
    parentId: null,
    status: "published",
    scheduledAt: null,
    content: { es: "<h2>1. General</h2><p>Estos términos rigen...</p>", en: "<h2>1. General</h2><p>These terms govern...</p>", de: "", fr: "" },
    metaTitle: { es: "Términos | Prestige Estates", en: "Terms | Prestige Estates", de: "", fr: "" },
    metaDescription: { es: "Nuestros términos y condiciones.", en: "Our terms and conditions.", de: "", fr: "" },
    featuredImage: null,
  },
];

/* ───────── Rich Text Toolbar Button ───────── */
const ToolBtn = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    className="p-1.5 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
  >
    <Icon className="h-3.5 w-3.5" />
  </button>
);

/* ───────── Inline Rich Text Editor ───────── */
function RichTextEditor({
  value,
  onChange,
  minHeight = 300,
}: {
  value: string;
  onChange: (html: string) => void;
  minHeight?: number;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = useCallback(
    (cmd: string, val?: string) => {
      document.execCommand(cmd, false, val);
      if (editorRef.current) onChange(editorRef.current.innerHTML);
    },
    [onChange]
  );

  const heading = useCallback(
    (tag: string) => {
      document.execCommand("formatBlock", false, tag);
      if (editorRef.current) onChange(editorRef.current.innerHTML);
    },
    [onChange]
  );

  const link = useCallback(() => {
    const url = prompt("URL:");
    if (url) exec("createLink", url);
  }, [exec]);

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50/50 flex-wrap">
        <ToolBtn icon={Heading1} label="H1" onClick={() => heading("H1")} />
        <ToolBtn icon={Heading2} label="H2" onClick={() => heading("H2")} />
        <ToolBtn icon={Heading3} label="H3" onClick={() => heading("H3")} />
        <div className="w-px h-4 bg-gray-200 mx-0.5" />
        <ToolBtn icon={Bold} label="Bold" onClick={() => exec("bold")} />
        <ToolBtn icon={Italic} label="Italic" onClick={() => exec("italic")} />
        <ToolBtn icon={Underline} label="Underline" onClick={() => exec("underline")} />
        <div className="w-px h-4 bg-gray-200 mx-0.5" />
        <ToolBtn icon={List} label="Bullet list" onClick={() => exec("insertUnorderedList")} />
        <ToolBtn icon={ListOrdered} label="Numbered list" onClick={() => exec("insertOrderedList")} />
        <div className="w-px h-4 bg-gray-200 mx-0.5" />
        <ToolBtn icon={LinkIcon} label="Link" onClick={link} />
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="px-3 py-2.5 text-[13px] text-gray-900 outline-none overflow-auto"
        style={{ minHeight }}
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={() => {
          if (editorRef.current) onChange(editorRef.current.innerHTML);
        }}
      />
    </div>
  );
}

/* ───────── AI Translate Button ───────── */
function AiTranslateButton({
  sourceLang,
  onTranslate,
  disabled,
}: {
  sourceLang: Lang;
  onTranslate: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onTranslate}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-md bg-violet-600 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      title={`Traducir desde ${sourceLang.toUpperCase()} a los demás idiomas con IA`}
    >
      {disabled ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Sparkles className="h-3.5 w-3.5" />
      )}
      Traducir con IA
    </button>
  );
}

/* ───────── Component ───────── */
interface Props {
  pageId?: string | null;
  onBack: () => void;
}

export default function CmsPageEditorPage({ pageId, onBack }: Props) {
  const existing = pageId ? MOCK_PAGES.find((pg) => pg.id === pageId) : null;

  const [activeLang, setActiveLang] = useState<Lang>("es");
  const [title, setTitle] = useState<MultiLang>(existing?.title ?? emptyLang());
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [parentId, setParentId] = useState<string | null>(existing?.parentId ?? null);
  const [status, setStatus] = useState(existing?.status ?? "draft");
  const [scheduledAt, setScheduledAt] = useState(existing?.scheduledAt ?? "");
  const [content, setContent] = useState<MultiLang>(existing?.content ?? emptyLang());
  const [htmlMode, setHtmlMode] = useState(false);
  const [metaTitle, setMetaTitle] = useState<MultiLang>(existing?.metaTitle ?? emptyLang());
  const [metaDesc, setMetaDesc] = useState<MultiLang>(existing?.metaDescription ?? emptyLang());
  const [featuredImage, setFeaturedImage] = useState<string | null>(existing?.featuredImage ?? null);
  const [isTranslating, setIsTranslating] = useState(false);

  const updateMultiLang = (
    setter: React.Dispatch<React.SetStateAction<MultiLang>>,
    lang: Lang,
    value: string
  ) => {
    setter((prev) => ({ ...prev, [lang]: value }));
  };

  const handleTitleChange = (val: string) => {
    updateMultiLang(setTitle, activeLang, val);
    if (!existing && activeLang === "es")
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) setFeaturedImage(URL.createObjectURL(file));
    };
    input.click();
  };

  // ─── AI Translation Handler ───
  // En producción, esto llama a POST /api/cms/translate
  // Ver sección "Backend: API de Traducción" más abajo
  const handleAiTranslate = async () => {
    setIsTranslating(true);
    try {
      const response = await fetch("/api/cms/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceLang: activeLang,
          targetLangs: LANGUAGES.filter((l) => l.code !== activeLang).map((l) => l.code),
          fields: {
            title: title[activeLang],
            content: content[activeLang],
            metaTitle: metaTitle[activeLang],
            metaDescription: metaDesc[activeLang],
          },
        }),
      });

      if (!response.ok) throw new Error("Translation failed");

      const data = await response.json();
      // data.translations = { en: { title, content, metaTitle, metaDescription }, de: {...}, fr: {...} }

      for (const lang of Object.keys(data.translations) as Lang[]) {
        const t = data.translations[lang];
        updateMultiLang(setTitle, lang, t.title);
        updateMultiLang(setContent, lang, t.content);
        updateMultiLang(setMetaTitle, lang, t.metaTitle);
        updateMultiLang(setMetaDesc, lang, t.metaDescription);
      }
    } catch (error) {
      console.error("Translation error:", error);
      alert("Error al traducir. Verifica la conexión con la API de traducción.");
    } finally {
      setIsTranslating(false);
    }
  };

  const parentPages = MOCK_PAGES.filter((pg) => pg.id !== pageId && !pg.parentId);

  const hasSourceContent = title[activeLang].trim().length > 0 || content[activeLang].trim().length > 0;

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 sm:px-8 pt-5 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Volver a Páginas
          </button>
          <div className="flex items-center gap-2">
            <AiTranslateButton
              sourceLang={activeLang}
              onTranslate={handleAiTranslate}
              disabled={isTranslating || !hasSourceContent}
            />
            <button onClick={() => window.open(`/page/${slug}`, "_blank")} className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Eye className="h-3.5 w-3.5" /> Vista previa
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
              <Save className="h-3.5 w-3.5" /> Guardar
            </button>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1 mb-6 p-1 bg-gray-100 rounded-lg w-fit">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setActiveLang(lang.code)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                activeLang === lang.code
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>{lang.flag}</span>
              {lang.label}
              {/* Indicador de contenido */}
              {title[lang.code]?.trim() ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main */}
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">
                Título ({activeLang.toUpperCase()})
              </label>
              <input
                value={title[activeLang]}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder={`Título de la página en ${activeLang.toUpperCase()}`}
                className="w-full rounded-md border border-gray-200 bg-white px-3 h-10 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
              />
            </div>

            {/* Slug (shared across languages) */}
            <div>
              <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">
                Slug <span className="text-gray-400 font-normal">(compartido)</span>
              </label>
              <div className="flex items-center">
                <span className="text-[12px] text-gray-500 bg-gray-50 px-3 py-2 border border-r-0 border-gray-200 rounded-l-md h-10 flex items-center">/page/</span>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} className="flex-1 rounded-r-md rounded-l-none border border-gray-200 bg-white px-3 h-10 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300" />
              </div>
            </div>

            {/* Featured Image (shared) */}
            <div>
              <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">
                Imagen destacada <span className="text-gray-400 font-normal">(compartida)</span>
              </label>
              {featuredImage ? (
                <div className="relative rounded-lg overflow-hidden border border-gray-200 aspect-[16/7]">
                  <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
                  <button onClick={() => setFeaturedImage(null)} className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button onClick={handleImageUpload} className="w-full border-2 border-dashed border-gray-200 rounded-lg py-10 flex flex-col items-center gap-2 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors">
                  <ImageIcon className="h-8 w-8" />
                  <span className="text-[13px]">Haz clic para subir una imagen</span>
                </button>
              )}
            </div>

            {/* Content Editor */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-medium text-gray-700">
                  Contenido ({activeLang.toUpperCase()})
                </label>
                <button onClick={() => setHtmlMode(!htmlMode)} className="text-[11px] text-gray-500 hover:text-gray-900 transition-colors px-2 py-0.5 rounded border border-gray-200">
                  {htmlMode ? "Editor visual" : "HTML"}
                </button>
              </div>
              {htmlMode ? (
                <textarea
                  value={content[activeLang]}
                  onChange={(e) => updateMultiLang(setContent, activeLang, e.target.value)}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 font-mono text-[12px] text-gray-900 min-h-[400px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                />
              ) : (
                <RichTextEditor
                  key={activeLang} // force re-mount on lang change
                  value={content[activeLang]}
                  onChange={(html) => updateMultiLang(setContent, activeLang, html)}
                  minHeight={400}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Publication */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
              <h3 className="text-[13px] font-semibold text-gray-900">Publicación</h3>
              <div>
                <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">Estado</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full rounded-md border border-gray-200 bg-white px-3 h-9 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  <option value="scheduled">Programado</option>
                </select>
              </div>
              {status === "scheduled" && (
                <div>
                  <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">Fecha programada</label>
                  <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 h-9 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
                </div>
              )}
            </div>

            {/* Hierarchy */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
              <h3 className="text-[13px] font-semibold text-gray-900">Jerarquía</h3>
              <div>
                <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">Página padre</label>
                <select value={parentId ?? "none"} onChange={(e) => setParentId(e.target.value === "none" ? null : e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 h-9 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
                  <option value="none">Ninguna (raíz)</option>
                  {parentPages.map((pg) => (
                    <option key={pg.id} value={pg.id}>{pg.title.es}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* SEO (per language) */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
              <h3 className="text-[13px] font-semibold text-gray-900">
                SEO ({activeLang.toUpperCase()})
              </h3>
              <div>
                <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">Meta título</label>
                <input value={metaTitle[activeLang]} onChange={(e) => updateMultiLang(setMetaTitle, activeLang, e.target.value)} placeholder="Título para buscadores" className="w-full rounded-md border border-gray-200 bg-white px-3 h-9 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
                <p className="text-[11px] text-gray-400 mt-1">{metaTitle[activeLang].length}/60 caracteres</p>
              </div>
              <div>
                <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">Meta descripción</label>
                <textarea value={metaDesc[activeLang]} onChange={(e) => updateMultiLang(setMetaDesc, activeLang, e.target.value)} placeholder="Descripción para buscadores" className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[12px] text-gray-900 min-h-[80px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
                <p className="text-[11px] text-gray-400 mt-1">{metaDesc[activeLang].length}/160 caracteres</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 3. BLOG LIST — `CmsBlogListPage.tsx`

```tsx
"use client";

import { useState } from "react";
import {
  Plus, Search, Edit2, Trash2, Eye, Calendar, Tag, BookOpen,
} from "lucide-react";

/* ───────── Types ───────── */
type Lang = "es" | "en" | "de" | "fr";

interface CmsBlogPost {
  id: string;
  title: Record<Lang, string>;
  slug: string;
  status: "published" | "draft" | "scheduled";
  updatedAt: string;
  author: string;
  category: string;
  tags: string[];
  translations: Lang[];
}

/* ───────── Mock data ───────── */
const MOCK_BLOG_POSTS: CmsBlogPost[] = [
  { id: "b1", title: { es: "Guía del Estilo de Vida Costero en el Mediterráneo", en: "An Insider's Guide to Coastal Living in the Mediterranean", de: "Ein Insider-Leitfaden für das Küstenleben am Mittelmeer", fr: "Guide de la Vie Côtière en Méditerranée" }, slug: "coastal-living-mediterranean", status: "published", updatedAt: "2026-02-26", author: "Alexandra Morel", category: "lifestyle", tags: ["Mediterranean", "Coastal", "Lifestyle"], translations: ["es", "en", "de", "fr"] },
  { id: "b2", title: { es: "La Doble Demanda Impulsa Dubái", en: "Dual Demand Drives Dubai", de: "", fr: "" }, slug: "dual-demand-dubai", status: "published", updatedAt: "2026-02-25", author: "James Harrington", category: "market-insights", tags: ["Dubai", "Investment"], translations: ["es", "en"] },
  { id: "b3", title: { es: "Una Majestuosa Finca Alpina Cerca de Zermatt", en: "A Majestic Alpine Estate Near Zermatt", de: "Ein majestätisches Alpenanwesen bei Zermatt", fr: "" }, slug: "alpine-estate-zermatt", status: "draft", updatedAt: "2026-02-25", author: "Sofia Engström", category: "architecture", tags: ["Alpine", "Switzerland"], translations: ["es", "en", "de"] },
  { id: "b4", title: { es: "Informe del Mercado Inmobiliario de Ibiza Q1 2026", en: "", de: "", fr: "" }, slug: "ibiza-market-q1-2026", status: "scheduled", updatedAt: "2026-02-28", author: "Marcus Chen", category: "market-insights", tags: ["Ibiza", "Market Report"], translations: ["es"] },
];

const LANG_FLAGS: Record<Lang, string> = { es: "🇪🇸", en: "🇬🇧", de: "🇩🇪", fr: "🇫🇷" };

const STATUS_COLOR: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-amber-100 text-amber-700",
  scheduled: "bg-blue-100 text-blue-700",
};

/* ───────── Component ───────── */
interface Props {
  onEdit: (id: string) => void;
  onNew: () => void;
}

export default function CmsBlogListPage({ onEdit, onNew }: Props) {
  const [search, setSearch] = useState("");
  const posts = MOCK_BLOG_POSTS.filter((p) =>
    p.title.es.toLowerCase().includes(search.toLowerCase()) ||
    p.title.en.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 sm:px-8 pt-6 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Blog</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Gestiona artículos y entradas del blog · 4 idiomas</p>
          </div>
          <button onClick={onNew} className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Nuevo Artículo
          </button>
        </div>

        {/* Search */}
        <div className="max-w-sm mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input placeholder="Buscar artículos..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 h-9 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300" />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b bg-gray-50/60">
                  <th className="h-12 px-4 text-left align-middle text-[12px] font-medium text-gray-500">Título</th>
                  <th className="h-12 px-4 text-left align-middle text-[12px] font-medium text-gray-500">Autor</th>
                  <th className="h-12 px-4 text-left align-middle text-[12px] font-medium text-gray-500">Categoría</th>
                  <th className="h-12 px-4 text-left align-middle text-[12px] font-medium text-gray-500">Idiomas</th>
                  <th className="h-12 px-4 text-left align-middle text-[12px] font-medium text-gray-500">Tags</th>
                  <th className="h-12 px-4 text-left align-middle text-[12px] font-medium text-gray-500">Estado</th>
                  <th className="h-12 px-4 text-left align-middle text-[12px] font-medium text-gray-500">Actualizado</th>
                  <th className="h-12 px-4 text-right align-middle text-[12px] font-medium text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b cursor-pointer transition-colors hover:bg-gray-50/50" onClick={() => onEdit(post.id)}>
                    <td className="p-4 align-middle text-[13px] font-medium text-gray-900">
                      <span className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-400 shrink-0" />
                        <span className="line-clamp-1">{post.title.es}</span>
                      </span>
                    </td>
                    <td className="p-4 align-middle text-[13px] text-gray-500">{post.author}</td>
                    <td className="p-4 align-middle text-[13px] text-gray-500 capitalize">{post.category.replace("-", " ")}</td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-0.5">
                        {(["es", "en", "de", "fr"] as Lang[]).map((lang) => (
                          <span
                            key={lang}
                            className={`text-[11px] px-1.5 py-0.5 rounded ${
                              post.translations.includes(lang)
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-gray-100 text-gray-300"
                            }`}
                          >
                            {LANG_FLAGS[lang]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-1 flex-wrap">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-500">
                            <Tag className="h-2.5 w-2.5" />{tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && <span className="text-[10px] text-gray-400">+{post.tags.length - 2}</span>}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_COLOR[post.status]}`}>
                        {post.status === "scheduled" && <Calendar className="h-3 w-3" />}
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-[13px] text-gray-500">{post.updatedAt}</td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => window.open(`/blog/${post.slug}`, "_blank")} className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"><Eye className="h-3.5 w-3.5" /></button>
                        <button onClick={() => onEdit(post.id)} className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"><Edit2 className="h-3.5 w-3.5" /></button>
                        <button className="inline-flex items-center justify-center h-8 w-8 rounded-md text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 4. BLOG EDITOR — `CmsBlogEditorPage.tsx`

```tsx
"use client";

import { useState, useRef, useCallback } from "react";
import {
  ArrowLeft, Save, Eye, X, Image as ImageIcon, Plus, Tag,
  GripVertical, Trash2, Sparkles, Loader2,
  Bold, Italic, Underline, Heading1, Heading2, Heading3,
  List, ListOrdered, Link as LinkIcon,
} from "lucide-react";

/* ───────── Types ───────── */
type Lang = "es" | "en" | "de" | "fr";

const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: "es", label: "ES", flag: "🇪🇸" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "de", label: "DE", flag: "🇩🇪" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
];

type MultiLang = Record<Lang, string>;

const emptyLang = (): MultiLang => ({ es: "", en: "", de: "", fr: "" });

interface FaqItem {
  question: MultiLang;
  answer: MultiLang;
}

interface CmsBlogPost {
  id: string;
  title: MultiLang;
  slug: string;
  status: "published" | "draft" | "scheduled";
  scheduledAt: string | null;
  updatedAt: string;
  author: string;
  featuredImage: string | null;
  excerpt: MultiLang;
  content: MultiLang;
  tags: string[];
  category: string;
  faq?: FaqItem[];
}

/* ───────── Mock data ───────── */
const BLOG_CATEGORIES = [
  "market-insights", "lifestyle", "architecture", "investment", "destinations", "guides",
];

const AVAILABLE_TAGS = [
  "Mediterranean", "Coastal", "Lifestyle", "Dubai", "Investment",
  "Market", "Alpine", "Switzerland", "Ibiza", "Market Report",
  "Caribbean", "Spain", "Wellness", "Architecture",
];

const MOCK_BLOG_POSTS: CmsBlogPost[] = [
  {
    id: "b1",
    title: { es: "Guía del Estilo de Vida Costero en el Mediterráneo", en: "An Insider's Guide to Coastal Living in the Mediterranean", de: "Ein Insider-Leitfaden für das Küstenleben am Mittelmeer", fr: "Guide de la Vie Côtière en Méditerranée" },
    slug: "coastal-living-mediterranean",
    status: "published",
    scheduledAt: null,
    updatedAt: "2026-02-26",
    author: "Alexandra Morel",
    featuredImage: null,
    excerpt: { es: "La costa mediterránea ha evolucionado de un destino estacional a un hub de estilo de vida estratégico.", en: "The Mediterranean coast has evolved from a seasonal destination into a strategic lifestyle hub.", de: "Die Mittelmeerküste hat sich von einem saisonalen Reiseziel zu einem strategischen Lifestyle-Hub entwickelt.", fr: "La côte méditerranéenne est passée d'une destination saisonnière à un hub de style de vie stratégique." },
    content: { es: "<p>La costa mediterránea ha evolucionado...</p>", en: "<p>The Mediterranean coast has evolved...</p>", de: "<p>Die Mittelmeerküste hat sich entwickelt...</p>", fr: "<p>La côte méditerranéenne a évolué...</p>" },
    tags: ["Mediterranean", "Coastal", "Lifestyle"],
    category: "lifestyle",
    faq: [{
      question: { es: "¿Cuáles son las mejores zonas para vivir en la costa?", en: "What areas are best for coastal living?", de: "Welche Gebiete eignen sich am besten für das Küstenleben?", fr: "Quelles sont les meilleures zones pour vivre sur la côte ?" },
      answer: { es: "La Costa Azul, la Costa Brava y la Costa Amalfitana.", en: "The French Riviera, Costa Brava, and Amalfi Coast.", de: "Die Côte d'Azur, Costa Brava und Amalfiküste.", fr: "La Côte d'Azur, la Costa Brava et la côte amalfitaine." },
    }],
  },
  {
    id: "b2",
    title: { es: "La Doble Demanda Impulsa Dubái", en: "Dual Demand Drives Dubai", de: "", fr: "" },
    slug: "dual-demand-dubai",
    status: "published",
    scheduledAt: null,
    updatedAt: "2026-02-25",
    author: "James Harrington",
    featuredImage: null,
    excerpt: { es: "El segmento de $500K–$1M creció un 70% interanual.", en: "The $500K–$1M segment grew 70% year-over-year.", de: "", fr: "" },
    content: { es: "<p>Datos clave sobre...</p>", en: "<p>Key insights on...</p>", de: "", fr: "" },
    tags: ["Dubai", "Investment"],
    category: "market-insights",
  },
];

/* ───────── Rich Text Toolbar Button ───────── */
const ToolBtn = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    className="p-1.5 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
  >
    <Icon className="h-3.5 w-3.5" />
  </button>
);

/* ───────── Inline Rich Text Editor ───────── */
function RichTextEditor({
  value,
  onChange,
  minHeight = 300,
}: {
  value: string;
  onChange: (html: string) => void;
  minHeight?: number;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = useCallback(
    (cmd: string, val?: string) => {
      document.execCommand(cmd, false, val);
      if (editorRef.current) onChange(editorRef.current.innerHTML);
    },
    [onChange]
  );

  const heading = useCallback(
    (tag: string) => {
      document.execCommand("formatBlock", false, tag);
      if (editorRef.current) onChange(editorRef.current.innerHTML);
    },
    [onChange]
  );

  const link = useCallback(() => {
    const url = prompt("URL:");
    if (url) exec("createLink", url);
  }, [exec]);

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50/50 flex-wrap">
        <ToolBtn icon={Heading1} label="H1" onClick={() => heading("H1")} />
        <ToolBtn icon={Heading2} label="H2" onClick={() => heading("H2")} />
        <ToolBtn icon={Heading3} label="H3" onClick={() => heading("H3")} />
        <div className="w-px h-4 bg-gray-200 mx-0.5" />
        <ToolBtn icon={Bold} label="Bold" onClick={() => exec("bold")} />
        <ToolBtn icon={Italic} label="Italic" onClick={() => exec("italic")} />
        <ToolBtn icon={Underline} label="Underline" onClick={() => exec("underline")} />
        <div className="w-px h-4 bg-gray-200 mx-0.5" />
        <ToolBtn icon={List} label="Bullet list" onClick={() => exec("insertUnorderedList")} />
        <ToolBtn icon={ListOrdered} label="Numbered list" onClick={() => exec("insertOrderedList")} />
        <div className="w-px h-4 bg-gray-200 mx-0.5" />
        <ToolBtn icon={LinkIcon} label="Link" onClick={link} />
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="px-3 py-2.5 text-[13px] text-gray-900 outline-none overflow-auto"
        style={{ minHeight }}
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={() => {
          if (editorRef.current) onChange(editorRef.current.innerHTML);
        }}
      />
    </div>
  );
}

/* ───────── Component ───────── */
interface Props {
  postId?: string | null;
  onBack: () => void;
}

export default function CmsBlogEditorPage({ postId, onBack }: Props) {
  const existing = postId ? MOCK_BLOG_POSTS.find((p) => p.id === postId) : null;

  const [activeLang, setActiveLang] = useState<Lang>("es");
  const [title, setTitle] = useState<MultiLang>(existing?.title ?? emptyLang());
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [author, setAuthor] = useState(existing?.author ?? "");
  const [category, setCategory] = useState(existing?.category ?? "lifestyle");
  const [tags, setTags] = useState<string[]>(existing?.tags ?? []);
  const [excerpt, setExcerpt] = useState<MultiLang>(existing?.excerpt ?? emptyLang());
  const [content, setContent] = useState<MultiLang>(existing?.content ?? emptyLang());
  const [htmlMode, setHtmlMode] = useState(false);
  const [status, setStatus] = useState(existing?.status ?? "draft");
  const [scheduledAt, setScheduledAt] = useState(existing?.scheduledAt ?? "");
  const [featuredImage, setFeaturedImage] = useState<string | null>(existing?.featuredImage ?? null);
  const [tagInput, setTagInput] = useState("");
  const [faqItems, setFaqItems] = useState<FaqItem[]>(
    existing?.faq ?? [{ question: emptyLang(), answer: emptyLang() }]
  );
  const [isTranslating, setIsTranslating] = useState(false);

  const updateMultiLang = (
    setter: React.Dispatch<React.SetStateAction<MultiLang>>,
    lang: Lang,
    value: string
  ) => {
    setter((prev) => ({ ...prev, [lang]: value }));
  };

  const handleTitleChange = (val: string) => {
    updateMultiLang(setTitle, activeLang, val);
    if (!existing && activeLang === "es")
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
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

  // ─── AI Translation Handler ───
  const handleAiTranslate = async () => {
    setIsTranslating(true);
    try {
      const response = await fetch("/api/cms/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceLang: activeLang,
          targetLangs: LANGUAGES.filter((l) => l.code !== activeLang).map((l) => l.code),
          fields: {
            title: title[activeLang],
            excerpt: excerpt[activeLang],
            content: content[activeLang],
          },
          faq: faqItems.map((item) => ({
            question: item.question[activeLang],
            answer: item.answer[activeLang],
          })),
        }),
      });

      if (!response.ok) throw new Error("Translation failed");

      const data = await response.json();

      for (const lang of Object.keys(data.translations) as Lang[]) {
        const t = data.translations[lang];
        updateMultiLang(setTitle, lang, t.title);
        updateMultiLang(setExcerpt, lang, t.excerpt);
        updateMultiLang(setContent, lang, t.content);
      }

      // Translate FAQ items
      if (data.faq) {
        setFaqItems((prev) =>
          prev.map((item, i) => {
            const updated = { ...item };
            for (const lang of Object.keys(data.faq[i] ?? {}) as Lang[]) {
              updated.question = { ...updated.question, [lang]: data.faq[i][lang].question };
              updated.answer = { ...updated.answer, [lang]: data.faq[i][lang].answer };
            }
            return updated;
          })
        );
      }
    } catch (error) {
      console.error("Translation error:", error);
      alert("Error al traducir. Verifica la conexión con la API de traducción.");
    } finally {
      setIsTranslating(false);
    }
  };

  const hasSourceContent = title[activeLang].trim().length > 0 || content[activeLang].trim().length > 0;

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 sm:px-8 pt-5 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Volver al Blog
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAiTranslate}
              disabled={isTranslating || !hasSourceContent}
              className="inline-flex items-center gap-1.5 rounded-md bg-violet-600 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={`Traducir desde ${activeLang.toUpperCase()} a los demás idiomas con IA`}
            >
              {isTranslating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              Traducir con IA
            </button>
            <button onClick={() => window.open(`/blog/${slug}`, "_blank")} className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Eye className="h-3.5 w-3.5" /> Vista previa
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
              <Save className="h-3.5 w-3.5" /> Guardar
            </button>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1 mb-6 p-1 bg-gray-100 rounded-lg w-fit">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setActiveLang(lang.code)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                activeLang === lang.code
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>{lang.flag}</span>
              {lang.label}
              {title[lang.code]?.trim() ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main */}
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">Título ({activeLang.toUpperCase()})</label>
              <input value={title[activeLang]} onChange={(e) => handleTitleChange(e.target.value)} placeholder={`Título del artículo en ${activeLang.toUpperCase()}`} className="w-full rounded-md border border-gray-200 bg-white px-3 h-10 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300" />
            </div>

            {/* Slug */}
            <div>
              <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">Slug <span className="text-gray-400 font-normal">(compartido)</span></label>
              <div className="flex items-center">
                <span className="text-[12px] text-gray-500 bg-gray-50 px-3 py-2 border border-r-0 border-gray-200 rounded-l-md h-10 flex items-center">/blog/</span>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} className="flex-1 rounded-r-md rounded-l-none border border-gray-200 bg-white px-3 h-10 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300" />
              </div>
            </div>

            {/* Featured Image (shared) */}
            <div>
              <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">Imagen destacada <span className="text-gray-400 font-normal">(compartida)</span></label>
              {featuredImage ? (
                <div className="relative rounded-lg overflow-hidden border border-gray-200 aspect-[16/7]">
                  <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
                  <button onClick={() => setFeaturedImage(null)} className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <button onClick={handleImageUpload} className="w-full border-2 border-dashed border-gray-200 rounded-lg py-10 flex flex-col items-center gap-2 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors">
                  <ImageIcon className="h-8 w-8" />
                  <span className="text-[13px]">Haz clic para subir una imagen</span>
                </button>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">Extracto ({activeLang.toUpperCase()})</label>
              <textarea value={excerpt[activeLang]} onChange={(e) => updateMultiLang(setExcerpt, activeLang, e.target.value)} placeholder={`Resumen breve en ${activeLang.toUpperCase()}...`} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-900 min-h-[80px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
            </div>

            {/* Content Editor */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-medium text-gray-700">Contenido ({activeLang.toUpperCase()})</label>
                <button onClick={() => setHtmlMode(!htmlMode)} className="text-[11px] text-gray-500 hover:text-gray-900 transition-colors px-2 py-0.5 rounded border border-gray-200">
                  {htmlMode ? "Editor visual" : "HTML"}
                </button>
              </div>
              {htmlMode ? (
                <textarea value={content[activeLang]} onChange={(e) => updateMultiLang(setContent, activeLang, e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 font-mono text-[12px] text-gray-900 min-h-[400px] focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
              ) : (
                <RichTextEditor key={activeLang} value={content[activeLang]} onChange={(html) => updateMultiLang(setContent, activeLang, html)} minHeight={400} />
              )}
            </div>

            {/* FAQ Section */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-medium text-gray-700">Preguntas y Respuestas (FAQ) — {activeLang.toUpperCase()}</label>
                <button onClick={() => setFaqItems([...faqItems, { question: emptyLang(), answer: emptyLang() }])} className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Plus className="h-3 w-3" /> Añadir pregunta
                </button>
              </div>
              <div className="space-y-3">
                {faqItems.map((item, i) => (
                  <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                        <GripVertical className="h-3.5 w-3.5" />
                        <span>Pregunta {i + 1}</span>
                      </div>
                      {faqItems.length > 1 && (
                        <button onClick={() => setFaqItems(faqItems.filter((_, idx) => idx !== i))} className="inline-flex items-center justify-center h-7 w-7 rounded-md text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      value={item.question[activeLang]}
                      onChange={(e) => {
                        const updated = [...faqItems];
                        updated[i] = { ...updated[i], question: { ...updated[i].question, [activeLang]: e.target.value } };
                        setFaqItems(updated);
                      }}
                      placeholder={`Pregunta en ${activeLang.toUpperCase()}...`}
                      className="w-full rounded-md border border-gray-200 bg-white px-3 h-9 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                    />
                    <textarea
                      value={item.answer[activeLang]}
                      onChange={(e) => {
                        const updated = [...faqItems];
                        updated[i] = { ...updated[i], answer: { ...updated[i].answer, [activeLang]: e.target.value } };
                        setFaqItems(updated);
                      }}
                      placeholder={`Respuesta en ${activeLang.toUpperCase()}...`}
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[12px] text-gray-900 min-h-[80px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Publication */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
              <h3 className="text-[13px] font-semibold text-gray-900">Publicación</h3>
              <div>
                <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">Estado</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full rounded-md border border-gray-200 bg-white px-3 h-9 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  <option value="scheduled">Programado</option>
                </select>
              </div>
              {status === "scheduled" && (
                <div>
                  <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">Fecha programada</label>
                  <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 h-9 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
                </div>
              )}
              <div>
                <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">Autor</label>
                <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Nombre del autor" className="w-full rounded-md border border-gray-200 bg-white px-3 h-9 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
              </div>
            </div>

            {/* Category */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
              <h3 className="text-[13px] font-semibold text-gray-900">Categoría</h3>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 h-9 text-[13px] text-gray-900 capitalize focus:outline-none focus:ring-2 focus:ring-gray-900/10">
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">{c.replace("-", " ")}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
              <h3 className="text-[13px] font-semibold text-gray-900">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-500">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-gray-900"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); } }} placeholder="Añadir tag..." className="flex-1 rounded-md border border-gray-200 bg-white px-3 h-8 text-[12px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
                <button onClick={() => addTag(tagInput)} className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"><Plus className="h-3.5 w-3.5" /></button>
              </div>
              <div className="flex flex-wrap gap-1">
                {AVAILABLE_TAGS.filter((t) => !tags.includes(t)).slice(0, 6).map((t) => (
                  <button key={t} onClick={() => addTag(t)} className="text-[10px] px-2 py-0.5 rounded border border-gray-200 text-gray-400 hover:bg-gray-100 transition-colors">{t}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 5. Backend: API de Traducción — `app/api/cms/translate/route.ts`

Esta API es **obligatoria** para que el botón "Traducir con IA" funcione.

```typescript
// app/api/cms/translate/route.ts
import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════
// CONFIGURACIÓN REQUERIDA:
// 1. Obtén una API key de OpenAI: https://platform.openai.com/api-keys
// 2. Añádela como variable de entorno: OPENAI_API_KEY=sk-...
// 3. O usa Google Cloud Translation API como alternativa
// ═══════════════════════════════════════════════════════════

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const LANG_NAMES: Record<string, string> = {
  es: "Spanish",
  en: "English",
  de: "German",
  fr: "French",
};

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY no configurada. Ver documentación." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { sourceLang, targetLangs, fields, faq } = body;

    const sourceName = LANG_NAMES[sourceLang] || sourceLang;
    const translations: Record<string, any> = {};

    for (const targetLang of targetLangs) {
      const targetName = LANG_NAMES[targetLang] || targetLang;

      const prompt = `Translate the following CMS content from ${sourceName} to ${targetName}.
Return ONLY valid JSON with the same keys. Preserve all HTML tags exactly.

Input:
${JSON.stringify(fields, null, 2)}

${faq ? `FAQ items to translate:
${JSON.stringify(faq, null, 2)}` : ""}

Output format:
{
  "fields": { ...translated fields... }
  ${faq ? ', "faq": [{ "question": "...", "answer": "..." }, ...]' : ""}
}`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a professional translator for luxury real estate content. Return only valid JSON, no markdown.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`OpenAI error for ${targetLang}:`, error);
        continue;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      try {
        const parsed = JSON.parse(content);
        translations[targetLang] = parsed.fields;
        if (parsed.faq) {
          if (!translations._faq) translations._faq = {};
          translations._faq[targetLang] = parsed.faq;
        }
      } catch {
        console.error(`Failed to parse translation for ${targetLang}`);
      }
    }

    // Reorganize FAQ translations
    const faqResult = faq?.map((_: any, i: number) => {
      const langMap: Record<string, any> = {};
      for (const lang of targetLangs) {
        if (translations._faq?.[lang]?.[i]) {
          langMap[lang] = translations._faq[lang][i];
        }
      }
      return langMap;
    });

    delete translations._faq;

    return NextResponse.json({
      translations,
      faq: faqResult || null,
    });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Error processing translation" },
      { status: 500 }
    );
  }
}
```

---

## 6. Database Schema — SQL para PostgreSQL/Supabase

### Tablas necesarias para conectar con la base de datos:

```sql
-- ═══════════════════════════════════════════════════════════
-- CMS PAGES (Multilingual)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES cms_pages(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'scheduled')),
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  featured_image TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Traducciones de páginas (1 fila por idioma por página)
CREATE TABLE cms_page_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES cms_pages(id) ON DELETE CASCADE,
  lang TEXT NOT NULL CHECK (lang IN ('es', 'en', 'de', 'fr')),
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (page_id, lang)
);

-- ═══════════════════════════════════════════════════════════
-- CMS BLOG POSTS (Multilingual)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE cms_blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'scheduled')),
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  author TEXT NOT NULL DEFAULT '',
  featured_image TEXT,
  category TEXT NOT NULL DEFAULT 'lifestyle',
  tags TEXT[] DEFAULT '{}',
  read_time INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Traducciones de posts (1 fila por idioma por post)
CREATE TABLE cms_blog_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES cms_blog_posts(id) ON DELETE CASCADE,
  lang TEXT NOT NULL CHECK (lang IN ('es', 'en', 'de', 'fr')),
  title TEXT NOT NULL DEFAULT '',
  excerpt TEXT DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (post_id, lang)
);

-- FAQ multilingüe vinculada a posts
CREATE TABLE cms_blog_faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES cms_blog_posts(id) ON DELETE CASCADE,
  lang TEXT NOT NULL CHECK (lang IN ('es', 'en', 'de', 'fr')),
  question TEXT NOT NULL DEFAULT '',
  answer TEXT NOT NULL DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  faq_group_id UUID NOT NULL, -- agrupa la misma pregunta en distintos idiomas
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para rendimiento
CREATE INDEX idx_page_trans_page ON cms_page_translations(page_id);
CREATE INDEX idx_page_trans_lang ON cms_page_translations(lang);
CREATE INDEX idx_blog_trans_post ON cms_blog_translations(post_id);
CREATE INDEX idx_blog_trans_lang ON cms_blog_translations(lang);
CREATE INDEX idx_blog_faq_post ON cms_blog_faq(post_id);
CREATE INDEX idx_blog_faq_group ON cms_blog_faq(faq_group_id);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_cms_pages_updated BEFORE UPDATE ON cms_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_cms_page_trans_updated BEFORE UPDATE ON cms_page_translations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_cms_blog_posts_updated BEFORE UPDATE ON cms_blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_cms_blog_trans_updated BEFORE UPDATE ON cms_blog_translations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 7. Funcionalidades Completas — Checklist de Implementación

### ✅ Lo que YA está incluido en los componentes (frontend listo):

| Feature | Pages List | Page Editor | Blog List | Blog Editor |
|---------|:---:|:---:|:---:|:---:|
| Tabla con búsqueda | ✅ | — | ✅ | — |
| Badges de estado (Published/Draft/Scheduled) | ✅ | — | ✅ | — |
| Indicadores de idiomas traducidos (🟢/⚪) | ✅ | — | ✅ | — |
| Acciones: ver, editar, eliminar | ✅ | — | ✅ | — |
| Botón "Nueva Página" / "Nuevo Artículo" | ✅ | — | ✅ | — |
| Tabs de idioma (ES 🇪🇸 EN 🇬🇧 DE 🇩🇪 FR 🇫🇷) | — | ✅ | — | ✅ |
| Punto verde/gris de estado traducción por tab | — | ✅ | — | ✅ |
| Botón "🤖 Traducir con IA" (violeta) | — | ✅ | — | ✅ |
| Editor visual con toolbar (H1-H3, B, I, U, listas, link) | — | ✅ | — | ✅ |
| Modo HTML toggle | — | ✅ | — | ✅ |
| Upload de imagen destacada | — | ✅ | — | ✅ |
| Slug auto-generado desde título ES | — | ✅ | — | ✅ |
| Sidebar: Estado + Fecha programada | — | ✅ | — | ✅ |
| Sidebar: Jerarquía (página padre) | — | ✅ | — | — |
| Sidebar: SEO por idioma (meta title + desc + contador) | — | ✅ | — | — |
| Sidebar: Categoría dropdown | — | — | — | ✅ |
| Sidebar: Tags con autocompletado | — | — | — | ✅ |
| FAQ multilingüe con drag handle | — | — | — | ✅ |
| Loader/spinner durante traducción | — | ✅ | — | ✅ |

### 🔌 Lo que NECESITA conectar con la base de datos:

| Acción | Endpoint API sugerido | Método | Tabla DB |
|--------|----------------------|--------|----------|
| Listar páginas | `GET /api/cms/pages` | GET | `cms_pages` + `cms_page_translations` |
| Crear página | `POST /api/cms/pages` | POST | `cms_pages` + `cms_page_translations` |
| Actualizar página | `PUT /api/cms/pages/[id]` | PUT | `cms_pages` + `cms_page_translations` |
| Eliminar página | `DELETE /api/cms/pages/[id]` | DELETE | `cms_pages` (cascade) |
| Listar posts | `GET /api/cms/blog` | GET | `cms_blog_posts` + `cms_blog_translations` |
| Crear post | `POST /api/cms/blog` | POST | `cms_blog_posts` + `cms_blog_translations` + `cms_blog_faq` |
| Actualizar post | `PUT /api/cms/blog/[id]` | PUT | `cms_blog_posts` + `cms_blog_translations` + `cms_blog_faq` |
| Eliminar post | `DELETE /api/cms/blog/[id]` | DELETE | `cms_blog_posts` (cascade) |
| Traducir con IA | `POST /api/cms/translate` | POST | No escribe en DB (devuelve JSON al frontend) |
| Subir imagen | `POST /api/cms/upload` | POST | Supabase Storage o S3 |

### 🔑 Variables de entorno requeridas:

```env
# Base de datos (Supabase o PostgreSQL directo)
DATABASE_URL=postgresql://user:pass@host:5432/db
# o si usas Supabase:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# API de traducción IA (una de las dos)
OPENAI_API_KEY=sk-...
# o alternativa:
GOOGLE_TRANSLATE_API_KEY=AIza...

# Storage de imágenes (opcional si usas Supabase Storage)
S3_BUCKET=cms-images
S3_REGION=eu-west-1
```

### 📋 Pasos de implementación en Omni47:

1. **Ejecutar el SQL** del apartado 6 en tu Supabase/PostgreSQL
2. **Copiar los 4 componentes** (secciones 1-4) en `app/components/cms/`
3. **Crear la API de traducción** (sección 5) en `app/api/cms/translate/route.ts`
4. **Configurar `OPENAI_API_KEY`** en `.env.local`
5. **Crear las APIs CRUD** para pages y blog (conectar con DB)
6. **Reemplazar mock data** por llamadas `fetch()` a tus APIs
7. **Conectar el botón Guardar** con `PUT /api/cms/pages/[id]` o `POST /api/cms/blog`
8. **Conectar el botón Eliminar** con confirmación y `DELETE`
9. **Upload de imágenes** → Supabase Storage o S3
10. **Testing**: verificar que las traducciones IA funcionan correctamente
