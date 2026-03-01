export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  parentId: string | null;
  status: "published" | "draft" | "scheduled";
  publishedAt: string | null;
  scheduledAt: string | null;
  updatedAt: string;
  featuredImage: string | null;
  content: string;
  metaTitle: string;
  metaDescription: string;
}

export interface CmsBlogPost {
  id: string;
  title: string;
  slug: string;
  status: "published" | "draft" | "scheduled";
  publishedAt: string | null;
  scheduledAt: string | null;
  updatedAt: string;
  author: string;
  featuredImage: string | null;
  excerpt: string;
  content: string;
  tags: string[];
  category: string;
  readTime: number;
}

export const MOCK_PAGES: CmsPage[] = [
  { id: "p1", title: "About Us", slug: "about", parentId: null, status: "published", publishedAt: "2026-01-15", scheduledAt: null, updatedAt: "2026-02-20", featuredImage: null, content: "<p>Prestige Estates is a curated luxury real estate advisory...</p>", metaTitle: "About Us | Prestige Estates", metaDescription: "Learn about our luxury real estate advisory." },
  { id: "p2", title: "Terms & Conditions", slug: "terms", parentId: null, status: "published", publishedAt: "2026-01-10", scheduledAt: null, updatedAt: "2026-01-10", featuredImage: null, content: "<h2>1. General</h2><p>These terms govern...</p>", metaTitle: "Terms | Prestige Estates", metaDescription: "Our terms and conditions." },
  { id: "p3", title: "Privacy Policy", slug: "privacy", parentId: null, status: "published", publishedAt: "2026-01-10", scheduledAt: null, updatedAt: "2026-01-10", featuredImage: null, content: "<h2>Data Collection</h2><p>We collect...</p>", metaTitle: "Privacy | Prestige Estates", metaDescription: "How we handle your data." },
  { id: "p4", title: "Our Team", slug: "team", parentId: "p1", status: "draft", publishedAt: null, scheduledAt: null, updatedAt: "2026-02-25", featuredImage: null, content: "<p>Meet our team of expert advisors...</p>", metaTitle: "Our Team | Prestige Estates", metaDescription: "Meet our team." },
  { id: "p5", title: "Careers", slug: "careers", parentId: "p1", status: "scheduled", publishedAt: null, scheduledAt: "2026-03-15", updatedAt: "2026-02-28", featuredImage: null, content: "<p>Join our growing team...</p>", metaTitle: "Careers | Prestige Estates", metaDescription: "Career opportunities." },
];

export const MOCK_BLOG_POSTS: CmsBlogPost[] = [
  { id: "b1", title: "An Insider's Guide to Coastal Living in the Mediterranean", slug: "coastal-living-mediterranean", status: "published", publishedAt: "2026-02-26", scheduledAt: null, updatedAt: "2026-02-26", author: "Alexandra Morel", featuredImage: null, excerpt: "The Mediterranean coast has evolved from a seasonal destination into a strategic lifestyle hub.", content: "<p>The Mediterranean coast has evolved...</p>", tags: ["Mediterranean", "Coastal", "Lifestyle"], category: "lifestyle", readTime: 8 },
  { id: "b2", title: "Dual Demand Drives Dubai", slug: "dual-demand-dubai", status: "published", publishedAt: "2026-02-25", scheduledAt: null, updatedAt: "2026-02-25", author: "James Harrington", featuredImage: null, excerpt: "The $500K–$1M segment grew 70% year-over-year.", content: "<p>Key insights on...</p>", tags: ["Dubai", "Investment"], category: "market-insights", readTime: 6 },
  { id: "b3", title: "A Majestic Alpine Estate Near Zermatt", slug: "alpine-estate-zermatt", status: "draft", publishedAt: null, scheduledAt: null, updatedAt: "2026-02-25", author: "Sofia Engström", featuredImage: null, excerpt: "This remarkable historic estate stands as one of Europe's most captivating properties.", content: "<p>This remarkable historic estate...</p>", tags: ["Alpine", "Switzerland"], category: "architecture", readTime: 5 },
  { id: "b4", title: "Ibiza Property Market Report Q1 2026", slug: "ibiza-market-q1-2026", status: "scheduled", publishedAt: null, scheduledAt: "2026-03-10", updatedAt: "2026-02-28", author: "Marcus Chen", featuredImage: null, excerpt: "Our quarterly analysis reveals unprecedented price levels.", content: "<p>Ibiza's luxury segment...</p>", tags: ["Ibiza", "Market Report"], category: "market-insights", readTime: 9 },
];

export const BLOG_CATEGORIES = [
  "market-insights", "lifestyle", "architecture", "investment", "destinations", "guides",
];

export const AVAILABLE_TAGS = [
  "Mediterranean", "Coastal", "Lifestyle", "Dubai", "Investment", "Market", "Alpine", "Switzerland", "Ibiza", "Market Report", "Caribbean", "Spain", "Wellness", "Architecture",
];
