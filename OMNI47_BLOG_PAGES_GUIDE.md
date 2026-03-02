# OMNI47 — Guía de Diseño y Funcionalidades: Páginas y Blog

> Documento de referencia para construir los módulos de **Páginas Estáticas** y **Blog** del template OMNI47.  
> Todos los componentes son **puros/presentacionales** (props only, zero remote state).

---

## Índice

1. [Design System](#1-design-system)
2. [Páginas Estáticas (Public)](#2-páginas-estáticas-public)
3. [Blog List (Public)](#3-blog-list-public)
4. [Blog Post Detail (Public)](#4-blog-post-detail-public)
5. [Admin CMS — Pages](#5-admin-cms--pages)
6. [Admin CMS — Blog](#6-admin-cms--blog)
7. [Tipos TypeScript](#7-tipos-typescript)
8. [Mock Data de Referencia](#8-mock-data-de-referencia)
9. [Archivos a Descargar del Git](#9-archivos-a-descargar-del-git)

---

## 1. Design System

### Paleta de Colores

| Token                  | Valor        | Uso                           |
|------------------------|--------------|-------------------------------|
| `omni47-cream`         | `#F5F0E8`    | Fondo principal               |
| `omni47-cream-dark`    | `#E8E0D0`    | Bordes, separadores           |
| `omni47-navy`          | `#1B2A3B`    | Textos principales, headers   |
| `omni47-navy-light`    | `#2A3D52`    | Hover de navy                 |
| `omni47-gold`          | `#C9A96E`    | Acentos, categorías, links    |
| `omni47-text`          | `#1B2A3B`    | Texto body oscuro             |
| `omni47-text-muted`    | `#6B7B8D`    | Texto secundario / meta       |

### Tipografía

| Fuente              | Uso                          | Weights         |
|---------------------|------------------------------|-----------------|
| **Cormorant Garamond** | Headings (h1-h3)          | extralight, light |
| **Jost**            | Body text, UI, labels        | light (300)     |

### Convenciones de Estilo

- **Labels/Tags**: `text-[10px] tracking-[0.2em] uppercase font-light`
- **Inputs**: `bg-white border border-omni47-cream-dark text-[14px] font-light focus:outline-none focus:border-omni47-gold`
- **Buttons Primary**: `bg-omni47-navy text-white text-[12px] tracking-wider uppercase hover:bg-omni47-navy-light`
- **Buttons Outline**: `border border-omni47-cream-dark text-omni47-text-muted hover:border-omni47-gold`
- **Status Badges**: `text-[10px] tracking-wider uppercase px-2 py-1` + `bg-green-50 text-green-600` (published) / `bg-amber-50 text-amber-600` (draft)

---

## 2. Páginas Estáticas (Public)

**Componente**: `Omni47StaticPage`  
**Ruta ejemplo**: `/omni47/page/about`

### Layout

```
┌─────────────────────────────────────────────────┐
│              HERO (40-50vh)                      │
│  Imagen full-width + overlay navy/50            │
│  Título centrado: Cormorant 36px/56px extralight│
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────┐  ┌─────────────┐      │
│  │  CONTENT BLOCKS      │  │  SIDEBAR    │      │
│  │  (8 cols)            │  │  (4 cols)   │      │
│  │                      │  │             │      │
│  │  • heading           │  │  Card bg-   │      │
│  │  • paragraph         │  │  white p-6  │      │
│  │  • image             │  │             │      │
│  │  • cta               │  │  Título     │      │
│  │                      │  │  Cormorant  │      │
│  └──────────────────────┘  └─────────────┘      │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Content Blocks (Renderizado)

| type        | Renderizado                                                                 |
|-------------|-----------------------------------------------------------------------------|
| `heading`   | `<h2>` / `<h3>` — Cormorant, light, navy. Sizes: h1=32px, h2=26px, h3=20px |
| `paragraph` | `<p>` — 14px, font-light, leading-[1.9], text-muted                        |
| `image`     | `<img>` — w-full, aspect-[16/9], object-cover                              |
| `cta`       | `Omni47Button` con `showArrow`                                              |

### Props Interface

```typescript
interface ContentBlock {
  type: "heading" | "paragraph" | "image" | "cta";
  content?: string;       // Para heading y paragraph
  level?: number;          // Para heading (1, 2, 3)
  src?: string;            // Para image
  alt?: string;            // Para image
  button?: CTAButton;      // Para cta
}

interface Omni47StaticPageProps {
  heroImage: string;
  title: string;
  content: ContentBlock[];
  sidebar?: { title: string; content: string }[];  // Opcional
}
```

### Sin Sidebar

Si no se pasa `sidebar`, el contenido se centra: `max-w-3xl mx-auto`.

---

## 3. Blog List (Public)

**Componente**: `Omni47BlogListPage`  
**Ruta**: `/omni47/blog`

### Layout

```
┌─────────────────────────────────────────────────┐
│             HERO (navy bg)                       │
│  Título: Cormorant 36/56px extralight white     │
│  Subtítulo: 14px, white/60                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  [All] [Market Insights] [Lifestyle] [Arch...]  │  ← Category filter pills
│                                                 │
│  ┌──────────────────────────────────────────┐   │
│  │         FEATURED POST                    │   │
│  │  ┌─────────────┐┌──────────────────┐     │   │  ← 50/50 grid, bg-white
│  │  │   IMAGE     ││  Category (gold) │     │   │
│  │  │  16:10      ││  Title (Cormorant│     │   │
│  │  │             ││    26/32px)      │     │   │
│  │  │             ││  Excerpt         │     │   │
│  │  │             ││  Date · Author   │     │   │
│  │  │             ││  "Read More →"   │     │   │
│  │  └─────────────┘└──────────────────┘     │   │
│  └──────────────────────────────────────────┘   │
│                                                 │
│  ┌──────┐  ┌──────┐  ┌──────┐                   │  ← 3-column grid
│  │ POST │  │ POST │  │ POST │                   │
│  │ card │  │ card │  │ card │                   │
│  └──────┘  └──────┘  └──────┘                   │
│                                                 │
│           [◀] [1] [2] [3] [▶]                   │  ← Pagination
└─────────────────────────────────────────────────┘
```

### Post Card Design

```
┌──────────────────┐
│  IMAGE (16:10)   │  ← hover: scale-105, duration-700
├──────────────────┤
│  p-5             │
│  CATEGORY        │  ← 10px, tracking-[0.2em], uppercase, gold
│  TITLE           │  ← Cormorant 20px, light, navy → hover: gold
│  EXCERPT         │  ← 13px, light, muted, line-clamp-2
│  Date · Author   │  ← 11px, muted/60
└──────────────────┘
```

### Category Filter Pills

- **Activo**: `bg-omni47-navy text-white`
- **Inactivo**: `border border-omni47-cream-dark text-omni47-text-muted hover:border-omni47-gold`
- Tamaño: `px-4 py-2 text-[12px] tracking-[0.1em] uppercase font-light`

### Paginación

- Botones cuadrados `w-9 h-9`
- **Activo**: `bg-omni47-navy text-white`
- **Inactivo**: `border border-omni47-cream-dark text-omni47-text-muted`
- Flechas: `ChevronLeft` / `ChevronRight` (Lucide), disabled: `opacity-30`

### Props Interface

```typescript
interface BlogPostCard {
  slug: string;
  image: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  href: string;
}

interface Omni47BlogListPageProps {
  heroTitle: string;
  heroSubtitle: string;
  featuredPost: BlogPostCard;
  posts: BlogPostCard[];
  categories: FilterOption[];      // { value, label }
  currentCategory: string;
  onCategoryChange?: (value: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}
```

---

## 4. Blog Post Detail (Public)

**Componente**: `Omni47BlogPostPage`  
**Ruta**: `/omni47/blog/:slug`

### Layout

```
┌─────────────────────────────────────────────────┐
│            HERO IMAGE (50-60vh)                  │
│  Gradient: from-navy/80 via-navy/30 to-transparent│
│  ┌─ max-w-3xl ──────────────────────┐           │
│  │  CATEGORY (gold, 11px, tracking) │           │
│  │  TITLE (Cormorant 32/48px white) │           │
│  └──────────────────────────────────┘           │
├─────────────────────────────────────────────────┤
│  max-w-3xl mx-auto                              │
│  Author · Date · ReadTime · Category(gold)      │  ← 12px, border-b
├─────────────────────────────────────────────────┤
│                                                 │
│  ARTICLE CONTENT (HTML renderizado)             │
│                                                 │
│  Prose styles:                                  │
│  • Body: 14px, light, leading-[1.9], muted      │
│  • h2: Cormorant 26px, light, navy, mt-10 mb-4  │
│  • h3: Cormorant 20px, light, navy              │
│  • img: w-full, my-8                            │
│  • a: gold, no-underline, hover:underline       │
│  • blockquote: border-l-2 gold, pl-6, italic    │
│                                                 │
├─────────────────────────────────────────────────┤
│  Share: [Facebook] [Twitter] [LinkedIn]         │
│  Botones: w-9 h-9 border square                 │
├─────────────────────────────────────────────────┤
│           RELATED ARTICLES (bg-white)           │
│  Título: Cormorant 28px, centered               │
│  3-column grid (same Post Card design)          │
└─────────────────────────────────────────────────┘
```

### Contenido HTML

El campo `content` es un **string HTML** que se inyecta con `dangerouslySetInnerHTML`. Los estilos se aplican con selectores de `prose` customizados via Tailwind arbitrary variants.

### Share Buttons

Tres redes sociales con URLs estándar:
- Facebook: `https://facebook.com/sharer/sharer.php?u=${shareUrl}`
- Twitter: `https://twitter.com/intent/tweet?url=${shareUrl}`
- LinkedIn: `https://linkedin.com/sharing/share-offsite/?url=${shareUrl}`

### Props Interface

```typescript
interface Omni47BlogPostPageProps {
  heroImage: string;
  title: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  content: string;           // HTML string
  relatedPosts: BlogPostCard[];
  shareUrl: string;
}
```

---

## 5. Admin CMS — Pages

**Componente**: `Omni47AdminPagesPage`  
**Ruta**: `/omni47/admin/pages`

### Vista Lista

```
┌─────────────────────────────────────────────────┐
│  "Pages" (Cormorant 28px)        [+ New Page]   │
├─────────────────────────────────────────────────┤
│  bg-white table                                 │
│  ┌────────┬──────┬────────┬──────────┬─────┐    │
│  │ Title  │ Slug │ Status │ Modified │     │    │
│  ├────────┼──────┼────────┼──────────┼─────┤    │
│  │ About  │/about│✅ pub  │2026-01-10│ ✏️🗑 │    │
│  │ Privacy│/priv │✅ pub  │2025-12-15│ ✏️🗑 │    │
│  │ Terms  │/terms│⚠️ draft│2026-02-20│ ✏️🗑 │    │
│  └────────┴──────┴────────┴──────────┴─────┘    │
└─────────────────────────────────────────────────┘
```

- Headers: `text-[11px] tracking-wider uppercase text-omni47-text-muted font-light`
- Slug: `text-[13px] font-mono text-muted/60`
- Rows: `hover:bg-omni47-cream/50 transition-colors`

### Vista Editor (Block-Based)

```
┌─────────────────────────────────────────────────┐
│  ← Back to Pages              [Save] [Publish]  │
├─────────────────────────────────────────────────┤
│  [EN] [ES] [DE] [FR] [RU] [NL]                 │  ← Language tabs
├─────────────────────────────────────────────────┤
│  Title (lang)    _________________________      │
│  Slug           _____________                   │
│  Status         [Draft ▼]                       │
├─────────────────────────────────────────────────┤
│  CONTENT BLOCKS                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ ⋮⋮  HERO                         ↑ ↓ 🗑 │    │
│  │     [textarea content per lang]         │    │
│  ├─────────────────────────────────────────┤    │
│  │ ⋮⋮  TEXT                         ↑ ↓ 🗑 │    │
│  │     [textarea content per lang]         │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  [+ hero] [+ text] [+ image] [+ cta] [+ html]  │  ← Add block buttons
└─────────────────────────────────────────────────┘
```

### Funcionalidades del Editor

1. **Pestañas de idioma**: Pill buttons, activo = navy, inactivo = border outline
2. **Block types**: `hero`, `text`, `image`, `cta`, `html`
3. **Reordenar bloques**: Botones ↑↓ (ChevronUp/ChevronDown)
4. **Eliminar bloques**: Botón Trash2 (red-400 → red-600)
5. **Drag handle**: GripVertical (visual, cursor-grab)
6. **Contenido multilingüe**: Cada bloque tiene `content: Record<string, string>` — el textarea muestra/edita el idioma activo

### Props Interface

```typescript
interface AdminPage {
  id: string;
  title: Record<string, string>;   // { en: "About Us", es: "Sobre Nosotros" }
  slug: string;
  status: "published" | "draft";
  lastModified: string;
}

interface AdminContentBlock {
  id: string;
  type: "hero" | "text" | "image" | "cta" | "html";
  content: Record<string, string>;  // { en: "...", es: "..." }
}

interface Omni47AdminPagesPageProps {
  pages: AdminPage[];
  languages: LanguageTab[];          // { code: "en", label: "English" }
  onSave?: (page: AdminPage, blocks: AdminContentBlock[]) => void;
  onPublish?: (pageId: string) => void;
  onDelete?: (pageId: string) => void;
}
```

---

## 6. Admin CMS — Blog

**Componente**: `Omni47AdminBlogPage`  
**Ruta**: `/omni47/admin/blog`

### Vista Lista

```
┌─────────────────────────────────────────────────┐
│  "Blog Posts" (Cormorant 28px)    [+ New Post]  │
├─────────────────────────────────────────────────┤
│  bg-white table                                 │
│  Title │ Category │ Status │ Date │ Author │    │
│  ──────┼──────────┼────────┼──────┼────────┼──  │
│  Rise..│ Market   │✅ pub  │ Jan  │ Victoria│✏️🗑│
│  Top 5 │ Lifestyle│⚠️ draft│ Jan  │ James  │✏️🗑│
└─────────────────────────────────────────────────┘
```

### Vista Editor (Rich Text)

```
┌─────────────────────────────────────────────────┐
│  ← Back to Blog               [Save] [Publish]  │
├─────────────────────────────────────────────────┤
│  [EN] [ES] [DE] [FR] [RU] [NL]                 │
├─────────────────────────────────────────────────┤
│  Title (lang)    _________________________      │
│                                                 │
│  Slug    ________   Category [Market ▼]         │
│  Status  [Draft▼]                               │
│                                                 │
│  Author  ________   Date  [📅 2026-01-15]       │
│                                                 │
│  Featured Image URL  ________________________   │
├─────────────────────────────────────────────────┤
│  Body (lang)                                    │
│  ┌─────────────────────────────────────────┐    │
│  │ [H1][H2][H3][B][I][🔗][🖼️]  ← Toolbar  │    │
│  ├─────────────────────────────────────────┤    │
│  │                                         │    │
│  │  [textarea rows=12]                     │    │
│  │  Write your article content...          │    │
│  │                                         │    │
│  └─────────────────────────────────────────┘    │
├─────────────────────────────────────────────────┤
│  SEO FIELDS (lang)                              │
│  Meta Title      _________________________      │
│  Meta Description [textarea rows=3]             │
└─────────────────────────────────────────────────┘
```

### Funcionalidades del Editor

1. **Pestañas de idioma**: Misma UX que Admin Pages
2. **Campos multilingües**: `title`, `body`, `seoTitle`, `seoDescription` — cada uno es `Record<string, string>`
3. **Campos globales** (no traducibles): `slug`, `category`, `status`, `author`, `date`, `featuredImage`
4. **Toolbar**: Iconos de Lucide (H1, H2, H3, Bold, Italic, Link, Image) — actualmente decorativos, preparados para integrar un editor WYSIWYG
5. **SEO Section**: Separada por `border-t border-omni47-cream-dark pt-6`
6. **Categorías**: Dropdown `<select>` con opciones pasadas por props

### Props Interface

```typescript
interface AdminBlogPost {
  id: string;
  title: Record<string, string>;
  slug: string;
  category: string;
  author: string;
  date: string;
  featuredImage: string;
  body: Record<string, string>;
  seoTitle: Record<string, string>;
  seoDescription: Record<string, string>;
  status: "published" | "draft";
}

interface Omni47AdminBlogPageProps {
  posts: AdminBlogPost[];
  categories: FilterOption[];
  languages: LanguageTab[];
  onSave?: (post: AdminBlogPost) => void;
  onPublish?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}
```

---

## 7. Tipos TypeScript

Todos los tipos están en `src/components/omni47/types.ts`. Los tipos compartidos clave:

```typescript
interface CTAButton {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "outline" | "gold";
}

interface FilterOption {
  value: string;
  label: string;
}

interface LanguageTab {
  code: string;
  label: string;
}
```

---

## 8. Mock Data de Referencia

Archivo: `src/components/omni47/demo/mock-data.ts`

### Blog Categories (ejemplo)

```typescript
categories: [
  { value: "all", label: "All" },
  { value: "market-insights", label: "Market Insights" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "architecture", label: "Architecture" },
  { value: "investment", label: "Investment" },
]
```

### Languages (ejemplo)

```typescript
languages: [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "ru", label: "Русский" },
  { code: "nl", label: "Nederlands" },
]
```

### Blog Post Card (ejemplo)

```typescript
{
  slug: "post-0",
  image: "https://...",
  category: "Market Insights",
  title: "The Rise of Sustainable Luxury Living",
  excerpt: "Discover the latest trends...",
  date: "Jan 15, 2026",
  author: "Victoria Laurent",
  href: "/omni47/blog/post-0",
}
```

---

## 9. Archivos a Descargar del Git

### Páginas Públicas

| Archivo | Descripción |
|---------|-------------|
| `src/components/omni47/pages/Omni47StaticPage.tsx` | Página estática con bloques de contenido |
| `src/components/omni47/pages/Omni47BlogListPage.tsx` | Listado de blog con featured + grid + paginación |
| `src/components/omni47/pages/Omni47BlogPostPage.tsx` | Detalle de artículo con hero, prose, share, related |

### Admin CMS

| Archivo | Descripción |
|---------|-------------|
| `src/components/omni47/pages/Omni47AdminPagesPage.tsx` | CRUD de páginas con block builder multilingüe |
| `src/components/omni47/pages/Omni47AdminBlogPage.tsx` | CRUD de blog con rich text editor y SEO |

### Dependencias Compartidas

| Archivo | Descripción |
|---------|-------------|
| `src/components/omni47/types.ts` | Todas las interfaces TypeScript |
| `src/components/omni47/shared/Omni47Button.tsx` | Botón reutilizable (usado en StaticPage CTAs) |
| `src/components/omni47/demo/mock-data.ts` | Datos de ejemplo para todas las vistas |
| `src/components/omni47/index.ts` | Barrel exports |

### Configuración (ya deberías tenerla si montaste Home/Properties)

| Archivo | Tokens necesarios |
|---------|-------------------|
| `src/index.css` | Variables CSS omni47-* |
| `tailwind.config.ts` | Colores, fuentes (Cormorant Garamond, Jost) |

### Dependencias npm

```
lucide-react    → Iconos (Plus, Pencil, Trash2, Save, ChevronLeft/Right, Share2, Facebook, Twitter, Linkedin, Bold, Italic, Heading1-3, Link, Image, GripVertical, ChevronUp/Down, Eye)
```

---

## Notas de Integración

1. **El toolbar del blog editor es visual** — los botones H1/H2/H3/B/I/Link/Image no ejecutan acciones. Para producción, integrar un editor WYSIWYG como TipTap, Lexical o Quill.

2. **El contenido del blog post se renderiza como HTML crudo** (`dangerouslySetInnerHTML`). En producción, sanitizar con DOMPurify.

3. **Los callbacks `onSave`, `onPublish`, `onDelete`** son opcionales — en producción, conectar a tu API/base de datos.

4. **El Page Builder usa bloques simples** con textareas. Para producción, considerar un block editor más rico (ej. Editor.js, Notion-like).

5. **Las rutas en `href`** usan el prefijo `/omni47/`. Ajustar según tu estructura de rutas.
