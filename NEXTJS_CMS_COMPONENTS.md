# Next.js CMS Components — Complete Code

> 4 standalone components ready to copy-paste into any Next.js project.  
> Dependencies: `lucide-react` only (+ React).  
> All use Tailwind CSS utility classes — no `@apply`.
>
> **v2 — Multilingual support** added to both editors (ES, EN, DE, FR, RU, NL)
> with per-language content fields and untranslated-language warnings.

---

## 1. PAGES LIST — `CmsPagesListPage.tsx`

```tsx
"use client";

import { useState } from "react";
import {
  Plus, Search, Edit2, Trash2, Eye, Calendar, FileText,
} from "lucide-react";

/* ───────── Types ───────── */
interface CmsPage {
  id: string;
  title: string;
  slug: string;
  parentId: string | null;
  status: "published" | "draft" | "scheduled";
  publishedAt: string | null;
  scheduledAt: string | null;
  updatedAt: string;
}

/* ───────── Mock data ───────── */
const MOCK_PAGES: CmsPage[] = [
  { id: "p1", title: "About Us", slug: "about", parentId: null, status: "published", publishedAt: "2026-01-15", scheduledAt: null, updatedAt: "2026-02-20" },
  { id: "p2", title: "Terms & Conditions", slug: "terms", parentId: null, status: "published", publishedAt: "2026-01-10", scheduledAt: null, updatedAt: "2026-01-10" },
  { id: "p3", title: "Privacy Policy", slug: "privacy", parentId: null, status: "published", publishedAt: "2026-01-10", scheduledAt: null, updatedAt: "2026-01-10" },
  { id: "p4", title: "Our Team", slug: "team", parentId: "p1", status: "draft", publishedAt: null, scheduledAt: null, updatedAt: "2026-02-25" },
  { id: "p5", title: "Careers", slug: "careers", parentId: "p1", status: "scheduled", publishedAt: null, scheduledAt: "2026-03-15", updatedAt: "2026-02-28" },
];

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
    pg.title.toLowerCase().includes(search.toLowerCase())
  );

  const getParentTitle = (parentId: string | null) => {
    if (!parentId) return "—";
    return MOCK_PAGES.find((pg) => pg.id === parentId)?.title ?? "—";
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
              Gestiona las páginas estáticas de tu web
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
                        {pg.title}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-[13px] text-gray-500">
                      /page/{pg.slug}
                    </td>
                    <td className="p-4 align-middle text-[13px] text-gray-500">
                      {getParentTitle(pg.parentId)}
                    </td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_COLOR[pg.status]}`}
                      >
                        {pg.status === "scheduled" && (
                          <Calendar className="h-3 w-3" />
                        )}
                        {pg.status.charAt(0).toUpperCase() + pg.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-[13px] text-gray-500">
                      {pg.updatedAt}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() =>
                            window.open(`/page/${pg.slug}`, "_blank")
                          }
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onEdit(pg.id)}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        >
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

## 2. PAGE EDITOR — `CmsPageEditorPage.tsx` (Multilingual)

```tsx
"use client";

import { useState, useRef, useCallback } from "react";
import {
  ArrowLeft, Save, Eye, X, Image as ImageIcon, AlertTriangle, Globe,
  Bold, Italic, Underline, Heading1, Heading2, Heading3,
  List, ListOrdered, Link as LinkIcon,
} from "lucide-react";

/* ───────── Languages ───────── */
const LANGUAGES = [
  { code: "es", label: "ES", name: "Español" },
  { code: "en", label: "EN", name: "English" },
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "fr", label: "FR", name: "Français" },
  { code: "ru", label: "RU", name: "Русский" },
  { code: "nl", label: "NL", name: "Nederlands" },
];

/* ───────── Types ───────── */
interface LangContent {
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
}

interface CmsPage {
  id: string;
  title: string;
  slug: string;
  parentId: string | null;
  status: "published" | "draft" | "scheduled";
  scheduledAt: string | null;
  content: string;
  metaTitle: string;
  metaDescription: string;
  featuredImage: string | null;
}

const emptyLangContent = (): LangContent => ({
  title: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
});

/* ───────── Mock data ───────── */
const MOCK_PAGES: CmsPage[] = [
  { id: "p1", title: "About Us", slug: "about", parentId: null, status: "published", scheduledAt: null, content: "<p>Prestige Estates is a curated luxury real estate advisory...</p>", metaTitle: "About Us | Prestige Estates", metaDescription: "Learn about our luxury real estate advisory.", featuredImage: null },
  { id: "p2", title: "Terms & Conditions", slug: "terms", parentId: null, status: "published", scheduledAt: null, content: "<h2>1. General</h2><p>These terms govern...</p>", metaTitle: "Terms | Prestige Estates", metaDescription: "Our terms and conditions.", featuredImage: null },
  { id: "p3", title: "Privacy Policy", slug: "privacy", parentId: null, status: "published", scheduledAt: null, content: "<h2>Data Collection</h2><p>We collect...</p>", metaTitle: "Privacy | Prestige Estates", metaDescription: "How we handle your data.", featuredImage: null },
  { id: "p4", title: "Our Team", slug: "team", parentId: "p1", status: "draft", scheduledAt: null, content: "<p>Meet our team of expert advisors...</p>", metaTitle: "Our Team | Prestige Estates", metaDescription: "Meet our team.", featuredImage: null },
  { id: "p5", title: "Careers", slug: "careers", parentId: "p1", status: "scheduled", scheduledAt: "2026-03-15", content: "<p>Join our growing team...</p>", metaTitle: "Careers | Prestige Estates", metaDescription: "Career opportunities.", featuredImage: null },
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

/* ───────── Language Tab Bar ───────── */
function LanguageTabs({
  activeLang,
  onChangeLang,
  isTranslated,
}: {
  activeLang: string;
  onChangeLang: (code: string) => void;
  isTranslated: (code: string) => boolean;
}) {
  const untranslated = LANGUAGES.filter((l) => !isTranslated(l.code));

  return (
    <div className="mb-5">
      <div className="flex items-center gap-1.5 flex-wrap">
        <Globe className="h-4 w-4 text-gray-400 mr-1" />
        {LANGUAGES.map((lang) => {
          const isActive = activeLang === lang.code;
          const translated = isTranslated(lang.code);
          return (
            <button
              key={lang.code}
              onClick={() => onChangeLang(lang.code)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                isActive
                  ? "bg-gray-900 text-white shadow-sm"
                  : translated
                  ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100 border border-dashed border-gray-300"
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

      {untranslated.length > 0 && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-[12px] font-medium text-amber-800">
              {untranslated.length} idioma{untranslated.length > 1 ? "s" : ""} sin traducir
            </p>
            <p className="text-[11px] text-amber-600 mt-0.5">
              Faltan: {untranslated.map((l) => l.name).join(", ")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── Language Status Card (Sidebar) ───────── */
function LanguageStatusCard({
  isTranslated,
}: {
  isTranslated: (code: string) => boolean;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
      <h3 className="text-[13px] font-semibold text-gray-900 flex items-center gap-1.5">
        <Globe className="h-3.5 w-3.5" /> Idiomas
      </h3>
      <div className="space-y-1.5">
        {LANGUAGES.map((lang) => {
          const translated = isTranslated(lang.code);
          return (
            <div key={lang.code} className="flex items-center justify-between">
              <span className="text-[12px] text-gray-500">{lang.name}</span>
              <span
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                  translated
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {translated ? "Traducido" : "Pendiente"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────── Component ───────── */
interface Props {
  pageId?: string | null;
  onBack: () => void;
}

export default function CmsPageEditorPage({ pageId, onBack }: Props) {
  const existing = pageId
    ? MOCK_PAGES.find((pg) => pg.id === pageId)
    : null;

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
  const [parentId, setParentId] = useState<string | null>(
    existing?.parentId ?? null
  );
  const [status, setStatus] = useState(existing?.status ?? "draft");
  const [scheduledAt, setScheduledAt] = useState(existing?.scheduledAt ?? "");
  const [htmlMode, setHtmlMode] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<string | null>(
    existing?.featuredImage ?? null
  );

  const currentLang = langData[activeLang];

  const updateLangField = (field: keyof LangContent, value: string) => {
    setLangData((prev) => ({
      ...prev,
      [activeLang]: { ...prev[activeLang], [field]: value },
    }));
  };

  const handleTitleChange = (val: string) => {
    updateLangField("title", val);
    if (!existing && activeLang === "es")
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
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

  const parentPages = MOCK_PAGES.filter(
    (pg) => pg.id !== pageId && !pg.parentId
  );

  const isLangTranslated = (code: string) => !!langData[code].title.trim();

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 sm:px-8 pt-5 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a Páginas
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(`/page/${slug}`, "_blank")}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" /> Vista previa
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
              <Save className="h-3.5 w-3.5" /> Guardar
            </button>
          </div>
        </div>

        {/* Language Tabs */}
        <LanguageTabs
          activeLang={activeLang}
          onChangeLang={setActiveLang}
          isTranslated={isLangTranslated}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main */}
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">
                Título <span className="text-gray-400 uppercase text-[10px] ml-1">({activeLang})</span>
              </label>
              <input
                value={currentLang.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Título de la página"
                className="w-full rounded-md border border-gray-200 bg-white px-3 h-10 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">
                Slug
              </label>
              <div className="flex items-center">
                <span className="text-[12px] text-gray-500 bg-gray-50 px-3 py-2 border border-r-0 border-gray-200 rounded-l-md h-10 flex items-center">
                  /page/
                </span>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 rounded-r-md rounded-l-none border border-gray-200 bg-white px-3 h-10 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">
                Imagen destacada
              </label>
              {featuredImage ? (
                <div className="relative rounded-lg overflow-hidden border border-gray-200 aspect-[16/7]">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setFeaturedImage(null)}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleImageUpload}
                  className="w-full border-2 border-dashed border-gray-200 rounded-lg py-10 flex flex-col items-center gap-2 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ImageIcon className="h-8 w-8" />
                  <span className="text-[13px]">
                    Haz clic para subir una imagen
                  </span>
                </button>
              )}
            </div>

            {/* Content Editor */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-medium text-gray-700">
                  Contenido <span className="text-gray-400 uppercase text-[10px] ml-1">({activeLang})</span>
                </label>
                <button
                  onClick={() => setHtmlMode(!htmlMode)}
                  className="text-[11px] text-gray-500 hover:text-gray-900 transition-colors px-2 py-0.5 rounded border border-gray-200"
                >
                  {htmlMode ? "Editor visual" : "HTML"}
                </button>
              </div>
              {htmlMode ? (
                <textarea
                  value={currentLang.content}
                  onChange={(e) => updateLangField("content", e.target.value)}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 font-mono text-[12px] text-gray-900 min-h-[400px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                />
              ) : (
                <RichTextEditor
                  value={currentLang.content}
                  onChange={(v) => updateLangField("content", v)}
                  minHeight={400}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Publication */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
              <h3 className="text-[13px] font-semibold text-gray-900">
                Publicación
              </h3>
              <div>
                <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">
                  Estado
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as "draft" | "published" | "scheduled"
                    )
                  }
                  className="w-full rounded-md border border-gray-200 bg-white px-3 h-9 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  <option value="scheduled">Programado</option>
                </select>
              </div>
              {status === "scheduled" && (
                <div>
                  <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">
                    Fecha programada
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 h-9 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>
              )}
            </div>

            {/* Hierarchy */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
              <h3 className="text-[13px] font-semibold text-gray-900">
                Jerarquía
              </h3>
              <div>
                <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">
                  Página padre
                </label>
                <select
                  value={parentId ?? "none"}
                  onChange={(e) =>
                    setParentId(e.target.value === "none" ? null : e.target.value)
                  }
                  className="w-full rounded-md border border-gray-200 bg-white px-3 h-9 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                >
                  <option value="none">Ninguna (raíz)</option>
                  {parentPages.map((pg) => (
                    <option key={pg.id} value={pg.id}>
                      {pg.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Language Status */}
            <LanguageStatusCard isTranslated={isLangTranslated} />

            {/* SEO */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
              <h3 className="text-[13px] font-semibold text-gray-900">
                SEO <span className="text-gray-400 uppercase text-[10px] ml-1">({activeLang})</span>
              </h3>
              <div>
                <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">
                  Meta título
                </label>
                <input
                  value={currentLang.metaTitle}
                  onChange={(e) => updateLangField("metaTitle", e.target.value)}
                  placeholder="Título para buscadores"
                  className="w-full rounded-md border border-gray-200 bg-white px-3 h-9 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  {currentLang.metaTitle.length}/60 caracteres
                </p>
              </div>
              <div>
                <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">
                  Meta descripción
                </label>
                <textarea
                  value={currentLang.metaDescription}
                  onChange={(e) => updateLangField("metaDescription", e.target.value)}
                  placeholder="Descripción para buscadores"
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[12px] text-gray-900 min-h-[80px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  {currentLang.metaDescription.length}/160 caracteres
                </p>
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
interface CmsBlogPost {
  id: string;
  title: string;
  slug: string;
  status: "published" | "draft" | "scheduled";
  updatedAt: string;
  author: string;
  category: string;
  tags: string[];
}

/* ───────── Mock data ───────── */
const MOCK_BLOG_POSTS: CmsBlogPost[] = [
  { id: "b1", title: "An Insider's Guide to Coastal Living in the Mediterranean", slug: "coastal-living-mediterranean", status: "published", updatedAt: "2026-02-26", author: "Alexandra Morel", category: "lifestyle", tags: ["Mediterranean", "Coastal", "Lifestyle"] },
  { id: "b2", title: "Dual Demand Drives Dubai", slug: "dual-demand-dubai", status: "published", updatedAt: "2026-02-25", author: "James Harrington", category: "market-insights", tags: ["Dubai", "Investment"] },
  { id: "b3", title: "A Majestic Alpine Estate Near Zermatt", slug: "alpine-estate-zermatt", status: "draft", updatedAt: "2026-02-25", author: "Sofia Engström", category: "architecture", tags: ["Alpine", "Switzerland"] },
  { id: "b4", title: "Ibiza Property Market Report Q1 2026", slug: "ibiza-market-q1-2026", status: "scheduled", updatedAt: "2026-02-28", author: "Marcus Chen", category: "market-insights", tags: ["Ibiza", "Market Report"] },
];

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
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 sm:px-8 pt-6 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
              Blog
            </h1>
            <p className="text-[13px] text-gray-500 mt-0.5">
              Gestiona artículos y entradas del blog
            </p>
          </div>
          <button
            onClick={onNew}
            className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Nuevo Artículo
          </button>
        </div>

        {/* Search */}
        <div className="max-w-sm mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              placeholder="Buscar artículos..."
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
                  <th className="h-12 px-4 text-left align-middle text-[12px] font-medium text-gray-500">Autor</th>
                  <th className="h-12 px-4 text-left align-middle text-[12px] font-medium text-gray-500">Categoría</th>
                  <th className="h-12 px-4 text-left align-middle text-[12px] font-medium text-gray-500">Tags</th>
                  <th className="h-12 px-4 text-left align-middle text-[12px] font-medium text-gray-500">Estado</th>
                  <th className="h-12 px-4 text-left align-middle text-[12px] font-medium text-gray-500">Actualizado</th>
                  <th className="h-12 px-4 text-right align-middle text-[12px] font-medium text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b cursor-pointer transition-colors hover:bg-gray-50/50"
                    onClick={() => onEdit(post.id)}
                  >
                    <td className="p-4 align-middle text-[13px] font-medium text-gray-900">
                      <span className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-400 shrink-0" />
                        <span className="line-clamp-1">{post.title}</span>
                      </span>
                    </td>
                    <td className="p-4 align-middle text-[13px] text-gray-500">
                      {post.author}
                    </td>
                    <td className="p-4 align-middle text-[13px] text-gray-500 capitalize">
                      {post.category.replace("-", " ")}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-1 flex-wrap">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-500"
                          >
                            <Tag className="h-2.5 w-2.5" />
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="text-[10px] text-gray-400">
                            +{post.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_COLOR[post.status]}`}
                      >
                        {post.status === "scheduled" && (
                          <Calendar className="h-3 w-3" />
                        )}
                        {post.status.charAt(0).toUpperCase() +
                          post.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-[13px] text-gray-500">
                      {post.updatedAt}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() =>
                            window.open(`/blog/${post.slug}`, "_blank")
                          }
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onEdit(post.id)}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        >
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

## 4. BLOG EDITOR — `CmsBlogEditorPage.tsx` (Multilingual)

```tsx
"use client";

import { useState, useRef, useCallback } from "react";
import {
  ArrowLeft, Save, Eye, X, Image as ImageIcon, Plus, Tag,
  GripVertical, Trash2, AlertTriangle, Globe,
  Bold, Italic, Underline, Heading1, Heading2, Heading3,
  List, ListOrdered, Link as LinkIcon,
} from "lucide-react";

/* ───────── Languages ───────── */
const LANGUAGES = [
  { code: "es", label: "ES", name: "Español" },
  { code: "en", label: "EN", name: "English" },
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "fr", label: "FR", name: "Français" },
  { code: "ru", label: "RU", name: "Русский" },
  { code: "nl", label: "NL", name: "Nederlands" },
];

/* ───────── Types ───────── */
interface FaqItem {
  question: string;
  answer: string;
}

interface LangContent {
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  faq: FaqItem[];
}

interface CmsBlogPost {
  id: string;
  title: string;
  slug: string;
  status: "published" | "draft" | "scheduled";
  scheduledAt: string | null;
  updatedAt: string;
  author: string;
  featuredImage: string | null;
  excerpt: string;
  content: string;
  tags: string[];
  category: string;
  faq?: FaqItem[];
}

const emptyLangContent = (): LangContent => ({
  title: "",
  excerpt: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
  faq: [{ question: "", answer: "" }],
});

/* ───────── Mock data ───────── */
const BLOG_CATEGORIES = [
  "market-insights",
  "lifestyle",
  "architecture",
  "investment",
  "destinations",
  "guides",
];

const AVAILABLE_TAGS = [
  "Mediterranean", "Coastal", "Lifestyle", "Dubai", "Investment",
  "Market", "Alpine", "Switzerland", "Ibiza", "Market Report",
  "Caribbean", "Spain", "Wellness", "Architecture",
];

const MOCK_BLOG_POSTS: CmsBlogPost[] = [
  { id: "b1", title: "An Insider's Guide to Coastal Living in the Mediterranean", slug: "coastal-living-mediterranean", status: "published", scheduledAt: null, updatedAt: "2026-02-26", author: "Alexandra Morel", featuredImage: null, excerpt: "The Mediterranean coast has evolved from a seasonal destination into a strategic lifestyle hub.", content: "<p>The Mediterranean coast has evolved...</p>", tags: ["Mediterranean", "Coastal", "Lifestyle"], category: "lifestyle", faq: [{ question: "What areas are best for coastal living?", answer: "The French Riviera, Costa Brava, and Amalfi Coast." }] },
  { id: "b2", title: "Dual Demand Drives Dubai", slug: "dual-demand-dubai", status: "published", scheduledAt: null, updatedAt: "2026-02-25", author: "James Harrington", featuredImage: null, excerpt: "The $500K–$1M segment grew 70% year-over-year.", content: "<p>Key insights on...</p>", tags: ["Dubai", "Investment"], category: "market-insights" },
  { id: "b3", title: "A Majestic Alpine Estate Near Zermatt", slug: "alpine-estate-zermatt", status: "draft", scheduledAt: null, updatedAt: "2026-02-25", author: "Sofia Engström", featuredImage: null, excerpt: "This remarkable historic estate stands as one of Europe's most captivating properties.", content: "<p>This remarkable historic estate...</p>", tags: ["Alpine", "Switzerland"], category: "architecture" },
  { id: "b4", title: "Ibiza Property Market Report Q1 2026", slug: "ibiza-market-q1-2026", status: "scheduled", scheduledAt: "2026-03-10", updatedAt: "2026-02-28", author: "Marcus Chen", featuredImage: null, excerpt: "Our quarterly analysis reveals unprecedented price levels.", content: "<p>Ibiza's luxury segment...</p>", tags: ["Ibiza", "Market Report"], category: "market-insights" },
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

/* ───────── Language Tab Bar ───────── */
function LanguageTabs({
  activeLang,
  onChangeLang,
  isTranslated,
}: {
  activeLang: string;
  onChangeLang: (code: string) => void;
  isTranslated: (code: string) => boolean;
}) {
  const untranslated = LANGUAGES.filter((l) => !isTranslated(l.code));

  return (
    <div className="mb-5">
      <div className="flex items-center gap-1.5 flex-wrap">
        <Globe className="h-4 w-4 text-gray-400 mr-1" />
        {LANGUAGES.map((lang) => {
          const isActive = activeLang === lang.code;
          const translated = isTranslated(lang.code);
          return (
            <button
              key={lang.code}
              onClick={() => onChangeLang(lang.code)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                isActive
                  ? "bg-gray-900 text-white shadow-sm"
                  : translated
                  ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100 border border-dashed border-gray-300"
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

      {untranslated.length > 0 && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-[12px] font-medium text-amber-800">
              {untranslated.length} idioma{untranslated.length > 1 ? "s" : ""} sin traducir
            </p>
            <p className="text-[11px] text-amber-600 mt-0.5">
              Faltan: {untranslated.map((l) => l.name).join(", ")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── Language Status Card (Sidebar) ───────── */
function LanguageStatusCard({
  isTranslated,
}: {
  isTranslated: (code: string) => boolean;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
      <h3 className="text-[13px] font-semibold text-gray-900 flex items-center gap-1.5">
        <Globe className="h-3.5 w-3.5" /> Idiomas
      </h3>
      <div className="space-y-1.5">
        {LANGUAGES.map((lang) => {
          const translated = isTranslated(lang.code);
          return (
            <div key={lang.code} className="flex items-center justify-between">
              <span className="text-[12px] text-gray-500">{lang.name}</span>
              <span
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                  translated
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {translated ? "Traducido" : "Pendiente"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────── Component ───────── */
interface Props {
  postId?: string | null;
  onBack: () => void;
}

export default function CmsBlogEditorPage({ postId, onBack }: Props) {
  const existing = postId
    ? MOCK_BLOG_POSTS.find((p) => p.id === postId)
    : null;

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
  const [featuredImage, setFeaturedImage] = useState<string | null>(
    existing?.featuredImage ?? null
  );
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
    if (!existing && activeLang === "es")
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
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

  const isLangTranslated = (code: string) => !!langData[code].title.trim();

  const faqItems = currentLang.faq;
  const setFaqItems = (items: FaqItem[]) => updateLangField("faq", items);

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 sm:px-8 pt-5 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al Blog
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(`/blog/${slug}`, "_blank")}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" /> Vista previa
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
              <Save className="h-3.5 w-3.5" /> Guardar
            </button>
          </div>
        </div>

        {/* Language Tabs */}
        <LanguageTabs
          activeLang={activeLang}
          onChangeLang={setActiveLang}
          isTranslated={isLangTranslated}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main */}
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">
                Título <span className="text-gray-400 uppercase text-[10px] ml-1">({activeLang})</span>
              </label>
              <input
                value={currentLang.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Título del artículo"
                className="w-full rounded-md border border-gray-200 bg-white px-3 h-10 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">
                Slug
              </label>
              <div className="flex items-center">
                <span className="text-[12px] text-gray-500 bg-gray-50 px-3 py-2 border border-r-0 border-gray-200 rounded-l-md h-10 flex items-center">
                  /blog/
                </span>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 rounded-r-md rounded-l-none border border-gray-200 bg-white px-3 h-10 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">
                Imagen destacada
              </label>
              {featuredImage ? (
                <div className="relative rounded-lg overflow-hidden border border-gray-200 aspect-[16/7]">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setFeaturedImage(null)}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleImageUpload}
                  className="w-full border-2 border-dashed border-gray-200 rounded-lg py-10 flex flex-col items-center gap-2 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ImageIcon className="h-8 w-8" />
                  <span className="text-[13px]">
                    Haz clic para subir una imagen
                  </span>
                </button>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">
                Extracto <span className="text-gray-400 uppercase text-[10px] ml-1">({activeLang})</span>
              </label>
              <textarea
                value={currentLang.excerpt}
                onChange={(e) => updateLangField("excerpt", e.target.value)}
                placeholder="Resumen breve del artículo..."
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-900 min-h-[80px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              />
            </div>

            {/* Content Editor */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-medium text-gray-700">
                  Contenido <span className="text-gray-400 uppercase text-[10px] ml-1">({activeLang})</span>
                </label>
                <button
                  onClick={() => setHtmlMode(!htmlMode)}
                  className="text-[11px] text-gray-500 hover:text-gray-900 transition-colors px-2 py-0.5 rounded border border-gray-200"
                >
                  {htmlMode ? "Editor visual" : "HTML"}
                </button>
              </div>
              {htmlMode ? (
                <textarea
                  value={currentLang.content}
                  onChange={(e) => updateLangField("content", e.target.value)}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 font-mono text-[12px] text-gray-900 min-h-[400px] focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              ) : (
                <RichTextEditor
                  value={currentLang.content}
                  onChange={(v) => updateLangField("content", v)}
                  minHeight={400}
                />
              )}
            </div>

            {/* FAQ Section */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-medium text-gray-700">
                  Preguntas y Respuestas (FAQ) <span className="text-gray-400 uppercase text-[10px] ml-1">({activeLang})</span>
                </label>
                <button
                  onClick={() =>
                    setFaqItems([...faqItems, { question: "", answer: "" }])
                  }
                  className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-3 w-3" /> Añadir pregunta
                </button>
              </div>
              <div className="space-y-3">
                {faqItems.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-gray-200 bg-white p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                        <GripVertical className="h-3.5 w-3.5" />
                        <span>Pregunta {i + 1}</span>
                      </div>
                      {faqItems.length > 1 && (
                        <button
                          onClick={() =>
                            setFaqItems(
                              faqItems.filter((_, idx) => idx !== i)
                            )
                          }
                          className="inline-flex items-center justify-center h-7 w-7 rounded-md text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      value={item.question}
                      onChange={(e) => {
                        const updated = [...faqItems];
                        updated[i] = {
                          ...updated[i],
                          question: e.target.value,
                        };
                        setFaqItems(updated);
                      }}
                      placeholder="Escribe la pregunta..."
                      className="w-full rounded-md border border-gray-200 bg-white px-3 h-9 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                    />
                    <textarea
                      value={item.answer}
                      onChange={(e) => {
                        const updated = [...faqItems];
                        updated[i] = {
                          ...updated[i],
                          answer: e.target.value,
                        };
                        setFaqItems(updated);
                      }}
                      placeholder="Escribe la respuesta..."
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
              <h3 className="text-[13px] font-semibold text-gray-900">
                Publicación
              </h3>
              <div>
                <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">
                  Estado
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as "draft" | "published" | "scheduled"
                    )
                  }
                  className="w-full rounded-md border border-gray-200 bg-white px-3 h-9 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  <option value="scheduled">Programado</option>
                </select>
              </div>
              {status === "scheduled" && (
                <div>
                  <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">
                    Fecha programada
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 h-9 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>
              )}
              <div>
                <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">
                  Autor
                </label>
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Nombre del autor"
                  className="w-full rounded-md border border-gray-200 bg-white px-3 h-9 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              </div>
            </div>

            {/* Category */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
              <h3 className="text-[13px] font-semibold text-gray-900">
                Categoría
              </h3>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 h-9 text-[13px] text-gray-900 capitalize focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              >
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c.replace("-", " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
              <h3 className="text-[13px] font-semibold text-gray-900">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-600"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-gray-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                  className="flex-1 rounded-md border border-gray-200 bg-white px-3 h-8 text-[12px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                  placeholder="Añadir tag..."
                />
                <button
                  onClick={() => addTag(tagInput)}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {AVAILABLE_TAGS.filter((t) => !tags.includes(t))
                  .slice(0, 6)
                  .map((t) => (
                    <button
                      key={t}
                      onClick={() => addTag(t)}
                      className="text-[10px] px-2 py-0.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                      {t}
                    </button>
                  ))}
              </div>
            </div>

            {/* Language Status */}
            <LanguageStatusCard isTranslated={isLangTranslated} />

            {/* SEO */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
              <h3 className="text-[13px] font-semibold text-gray-900">
                SEO <span className="text-gray-400 uppercase text-[10px] ml-1">({activeLang})</span>
              </h3>
              <div>
                <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">
                  Meta título
                </label>
                <input
                  value={currentLang.metaTitle}
                  onChange={(e) => updateLangField("metaTitle", e.target.value)}
                  placeholder="Título para buscadores"
                  className="w-full rounded-md border border-gray-200 bg-white px-3 h-9 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  {currentLang.metaTitle.length}/60 caracteres
                </p>
              </div>
              <div>
                <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">
                  Meta descripción
                </label>
                <textarea
                  value={currentLang.metaDescription}
                  onChange={(e) =>
                    updateLangField("metaDescription", e.target.value)
                  }
                  placeholder="Descripción para buscadores"
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[12px] text-gray-900 min-h-[80px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  {currentLang.metaDescription.length}/160 caracteres
                </p>
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

## Multilingual Architecture Notes

### Key Design Decisions

1. **Per-language state**: Translatable fields (title, content, excerpt, FAQ, meta SEO) are stored in a `Record<string, LangContent>` object keyed by language code.

2. **Shared fields**: Slug, status, author, category, tags, featured image, and hierarchy remain language-independent.

3. **Translation detection**: A language is considered "translated" when its `title` field is non-empty. This drives:
   - The amber dot indicator on untranslated language tabs
   - The dashed border style on untranslated tabs
   - The warning banner listing missing languages
   - The sidebar status card showing Traducido/Pendiente per language

4. **Language indicator on labels**: Each translatable field label shows the active language code (e.g., `Título (ES)`) to prevent confusion.

5. **Auto-slug generation**: Only triggers from the primary language (ES) to avoid overwriting the slug when editing other languages.

### Components extracted for reuse:
- `LanguageTabs` — renders the language bar + warning banner
- `LanguageStatusCard` — sidebar card with per-language translation status
