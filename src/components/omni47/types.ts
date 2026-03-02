/* ═══════════════════════════════════════════════════════════
   OMNI47 — Type Definitions
   All components are pure/presentational: props only, zero remote state.
   ═══════════════════════════════════════════════════════════ */

// ── Common ──────────────────────────────────────────────

export interface CTAButton {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "outline" | "gold";
}

export interface ImageAsset {
  src: string;
  alt: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface StatItem {
  label: string;
  value: string;
}

// ── Navbar ──────────────────────────────────────────────

export interface Omni47NavbarProps {
  logo: ImageAsset;
  items: NavItem[];
  ctaButton?: CTAButton;
  currentLang?: string;
  languages?: { code: string; label: string }[];
  onLanguageChange?: (code: string) => void;
  transparent?: boolean;
}

// ── Footer ──────────────────────────────────────────────

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface SocialLink {
  platform: string;
  href: string;
}

export interface Omni47FooterProps {
  logo: ImageAsset;
  description: string;
  columns: FooterColumn[];
  socialLinks: SocialLink[];
  copyright: string;
  bottomLinks?: { label: string; href: string }[];
}

// ── Layout ──────────────────────────────────────────────

export interface Omni47LayoutProps {
  navbar: Omni47NavbarProps;
  footer: Omni47FooterProps;
  children: React.ReactNode;
}

// ── Hero ────────────────────────────────────────────────

export interface Omni47HeroProps {
  backgroundImage: string;
  headline: string;
  subheadline: string;
  buttons: CTAButton[];
  overlayOpacity?: number;
}

// ── StatsBar ────────────────────────────────────────────

export interface Omni47StatsBarProps {
  stats: StatItem[];
}

// ── About ───────────────────────────────────────────────

export interface Omni47AboutSectionProps {
  label: string;
  title: string;
  description: string;
  image?: ImageAsset;
  videoUrl?: string;
  videoButtonLabel?: string;
}

// ── Property Card ───────────────────────────────────────

export interface PropertyCardData {
  id: string;
  images: string[];
  ref: string;
  location: string;
  title: string;
  price: string;
  beds: number;
  baths: number;
  builtSqm: number;
  plotSqm?: number;
  features?: string[];
  tag?: string;
  isOffMarket?: boolean;
  isNewBuild?: boolean;
  href: string;
}

export interface Omni47PropertyCardProps {
  property: PropertyCardData;
  variant?: "vertical" | "horizontal";
  onContact?: (id: string) => void;
}

// ── Featured Properties ─────────────────────────────────

export interface Omni47FeaturedPropertiesProps {
  title: string;
  subtitle: string;
  viewAllLabel: string;
  viewAllHref: string;
  properties: PropertyCardData[];
}

// ── Browse by Destination ───────────────────────────────

export interface DestinationCard {
  image: string;
  name: string;
  count: number;
  url: string;
}

export interface Omni47BrowseByDestinationProps {
  title: string;
  subtitle: string;
  destinations: DestinationCard[];
}

// ── New Developments ────────────────────────────────────

export interface NewDevelopmentCard {
  id: string;
  image: string;
  badge: string;
  deliveryQuarter: string;
  location: string;
  title: string;
  fromPrice: string;
  units: string;
  href: string;
}

export interface Omni47NewDevelopmentsProps {
  label: string;
  title: string;
  description: string;
  stats: StatItem[];
  developments: NewDevelopmentCard[];
}

// ── Off-Market ──────────────────────────────────────────

export interface Omni47OffMarketSectionProps {
  backgroundImage: string;
  headline: string;
  description: string;
  button: CTAButton;
}

// ── Property List Page ──────────────────────────────────

export interface ActiveFilter {
  key: string;
  label: string;
}

export interface Omni47PropertyListPageProps {
  operationOptions: FilterOption[];
  locationPlaceholder: string;
  typeOptions: FilterOption[];
  priceRangeOptions: FilterOption[];
  bedsOptions: FilterOption[];
  amenityOptions: FilterOption[];
  activeFilters: ActiveFilter[];
  onRemoveFilter?: (key: string) => void;
  onClearFilters?: () => void;
  resultsCount: number;
  sortOptions: FilterOption[];
  currentSort: string;
  onSortChange?: (value: string) => void;
  properties: PropertyCardData[];
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  onContactProperty?: (id: string) => void;
}

// ── Property Detail Page ────────────────────────────────

export interface AgentInfo {
  name: string;
  photo: string;
  phone: string;
  email: string;
  whatsappUrl?: string;
}

export interface FeatureGroup {
  category: string;
  items: string[];
}

export interface Omni47PropertyDetailPageProps {
  images: string[];
  title: string;
  ref: string;
  locationBreadcrumb: string[];
  price: string;
  operationTag: string;
  isOffMarket?: boolean;
  beds: number;
  baths: number;
  builtSqm: number;
  plotSqm?: number;
  description: string;
  features: FeatureGroup[];
  mapPlaceholder?: string;
  agent: AgentInfo;
  similarProperties: PropertyCardData[];
}

// ── Static Page ─────────────────────────────────────────

export interface ContentBlock {
  type: "heading" | "paragraph" | "image" | "cta";
  content?: string;
  level?: number;
  src?: string;
  alt?: string;
  button?: CTAButton;
}

export interface Omni47StaticPageProps {
  heroImage: string;
  title: string;
  content: ContentBlock[];
  sidebar?: { title: string; content: string }[];
}

// ── Contact Page ────────────────────────────────────────

export interface OfficeInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  image?: string;
  lat?: number;
  lng?: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  offices: string[];
}

export interface Omni47ContactPageProps {
  heroTitle: string;
  heroSubtitle: string;
  formTitle: string;
  subjectOptions: FilterOption[];
  offices: OfficeInfo[];
  mapPlaceholder?: string;
  onSubmit?: (data: ContactFormData) => void;
}

// ── Blog List Page ──────────────────────────────────────

export interface BlogPostCard {
  slug: string;
  image: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  href: string;
}

export interface Omni47BlogListPageProps {
  heroTitle: string;
  heroSubtitle: string;
  featuredPost: BlogPostCard;
  posts: BlogPostCard[];
  categories: FilterOption[];
  currentCategory: string;
  onCategoryChange?: (value: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

// ── Blog Post Page ──────────────────────────────────────

export interface Omni47BlogPostPageProps {
  heroImage: string;
  title: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  content: string;
  relatedPosts: BlogPostCard[];
  shareUrl: string;
}

// ── Admin Pages ─────────────────────────────────────────

export interface AdminPage {
  id: string;
  title: Record<string, string>;
  slug: string;
  status: "published" | "draft";
  lastModified: string;
}

export interface AdminContentBlock {
  id: string;
  type: "hero" | "text" | "image" | "cta" | "html";
  content: Record<string, string>;
}

export interface LanguageTab {
  code: string;
  label: string;
}

export interface Omni47AdminPagesPageProps {
  pages: AdminPage[];
  languages: LanguageTab[];
  onSave?: (page: AdminPage, blocks: AdminContentBlock[]) => void;
  onPublish?: (pageId: string) => void;
  onDelete?: (pageId: string) => void;
}

// ── Admin Blog ──────────────────────────────────────────

export interface AdminBlogPost {
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

export interface Omni47AdminBlogPageProps {
  posts: AdminBlogPost[];
  categories: FilterOption[];
  languages: LanguageTab[];
  onSave?: (post: AdminBlogPost) => void;
  onPublish?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}
