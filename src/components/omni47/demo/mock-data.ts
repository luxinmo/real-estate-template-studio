import heroImg from "@/assets/luxury-hero.jpg";
import prop1 from "@/assets/luxury-property-1.jpg";
import prop2 from "@/assets/luxury-property-2.jpg";
import prop3 from "@/assets/luxury-property-3.jpg";
import detail1 from "@/assets/property-detail-1.jpg";
import detail2 from "@/assets/property-detail-2.jpg";
import detail3 from "@/assets/property-detail-3.jpg";
import detail4 from "@/assets/property-detail-4.jpg";
import blogImg from "@/assets/blog-featured.jpg";
import bannerImg from "@/assets/featured-banner.jpg";

import type {
  Omni47NavbarProps,
  Omni47FooterProps,
  Omni47HeroProps,
  Omni47StatsBarProps,
  Omni47AboutSectionProps,
  Omni47FeaturedPropertiesProps,
  Omni47BrowseByDestinationProps,
  Omni47NewDevelopmentsProps,
  Omni47OffMarketSectionProps,
  Omni47PropertyListPageProps,
  Omni47PropertyDetailPageProps,
  Omni47StaticPageProps,
  Omni47ContactPageProps,
  Omni47BlogListPageProps,
  Omni47BlogPostPageProps,
  Omni47AdminPagesPageProps,
  Omni47AdminBlogPageProps,
  PropertyCardData,
  BlogPostCard,
} from "../types";

// ── Shared property mock ────────────────────────────────

const makeProperty = (i: number): PropertyCardData => ({
  id: `prop-${i}`,
  images: [prop1, prop2, prop3],
  ref: `REF-00${i}`,
  location: i % 2 === 0 ? "Marbella, Costa del Sol" : "Ibiza, Balearic Islands",
  title: i % 2 === 0 ? "Contemporary Villa with Sea Views" : "Luxury Penthouse in Marina Botafoch",
  price: `€${(1.2 + i * 0.8).toFixed(1)}M`,
  beds: 4 + (i % 3),
  baths: 3 + (i % 2),
  builtSqm: 350 + i * 50,
  plotSqm: i % 2 === 0 ? 1200 + i * 100 : undefined,
  features: ["Sea Views", "Pool", "Garage"],
  tag: i === 0 ? "Featured" : undefined,
  isOffMarket: i === 2,
  href: `/omni47/property/${i}`,
});

const properties: PropertyCardData[] = Array.from({ length: 8 }, (_, i) => makeProperty(i));

const makeBlogPost = (i: number): BlogPostCard => ({
  slug: `post-${i}`,
  image: i % 2 === 0 ? blogImg : bannerImg,
  category: i % 2 === 0 ? "Market Insights" : "Lifestyle",
  title: i % 2 === 0 ? "The Rise of Sustainable Luxury Living" : "Top 5 Destinations for Waterfront Homes",
  excerpt: "Discover the latest trends shaping the luxury real estate market across the Mediterranean coast.",
  date: "Jan 15, 2026",
  author: "Victoria Laurent",
  href: `/omni47/blog/post-${i}`,
});

const blogPosts: BlogPostCard[] = Array.from({ length: 6 }, (_, i) => makeBlogPost(i));

// ── Navbar ──────────────────────────────────────────────

export const navbarProps: Omni47NavbarProps = {
  logo: { src: "/placeholder.svg", alt: "OMNI47" },
  items: [
    { label: "Properties", href: "/omni47/properties" },
    { label: "New Developments", href: "#" },
    { label: "About", href: "/omni47/page/about" },
    { label: "Blog", href: "/omni47/blog" },
    { label: "Contact", href: "/omni47/contact" },
  ],
  ctaButton: { label: "List Your Property", href: "#" },
  currentLang: "EN",
  languages: [
    { code: "EN", label: "English" },
    { code: "ES", label: "Español" },
    { code: "DE", label: "Deutsch" },
    { code: "FR", label: "Français" },
    { code: "RU", label: "Русский" },
  ],
  transparent: true,
};

// ── Footer ──────────────────────────────────────────────

export const footerProps: Omni47FooterProps = {
  logo: { src: "/placeholder.svg", alt: "OMNI47" },
  description: "OMNI47 is a premier luxury real estate agency specializing in exclusive properties across the Mediterranean.",
  columns: [
    {
      title: "Properties",
      links: [
        { label: "For Sale", href: "#" },
        { label: "For Rent", href: "#" },
        { label: "New Developments", href: "#" },
        { label: "Off-Market", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Our Team", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "/omni47/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "/omni47/blog" },
        { label: "Market Reports", href: "#" },
        { label: "Buyer's Guide", href: "#" },
        { label: "FAQ", href: "#" },
      ],
    },
  ],
  socialLinks: [
    { platform: "Instagram", href: "#" },
    { platform: "LinkedIn", href: "#" },
    { platform: "YouTube", href: "#" },
  ],
  copyright: "© 2026 OMNI47. All rights reserved.",
  bottomLinks: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

// ── Home ────────────────────────────────────────────────

export const heroProps: Omni47HeroProps = {
  backgroundImage: heroImg,
  headline: "Exceptional Properties for Exceptional Living",
  subheadline: "Discover the finest luxury real estate across Marbella, Ibiza, and the Mediterranean's most coveted destinations.",
  buttons: [
    { label: "Explore Properties", href: "/omni47/properties" },
    { label: "Contact Us", href: "/omni47/contact" },
  ],
};

export const statsProps: Omni47StatsBarProps = {
  stats: [
    { value: "€2.4B+", label: "Portfolio Value" },
    { value: "850+", label: "Properties" },
    { value: "25+", label: "Years Experience" },
    { value: "12", label: "Offices" },
  ],
};

export const aboutProps: Omni47AboutSectionProps = {
  label: "About OMNI47",
  title: "A Legacy of Excellence in Luxury Real Estate",
  description: "For over 25 years, OMNI47 has been the trusted partner for discerning buyers and sellers of luxury properties. Our deep market knowledge, extensive network, and commitment to discretion ensure every transaction exceeds expectations.",
  image: { src: prop1, alt: "Luxury villa" },
  videoButtonLabel: "Watch Our Story",
};

export const featuredProps: Omni47FeaturedPropertiesProps = {
  title: "Featured Properties",
  subtitle: "Hand-selected residences from our exclusive portfolio",
  viewAllLabel: "View All",
  viewAllHref: "/omni47/properties",
  properties: properties.slice(0, 4),
};

export const destinationsProps: Omni47BrowseByDestinationProps = {
  title: "Browse by Destination",
  subtitle: "Find your dream home in the world's most desirable locations",
  destinations: [
    { image: prop1, name: "Marbella", count: 142, url: "#" },
    { image: prop2, name: "Ibiza", count: 98, url: "#" },
    { image: prop3, name: "Mallorca", count: 76, url: "#" },
    { image: detail1, name: "Costa Blanca", count: 124, url: "#" },
    { image: detail2, name: "Barcelona", count: 53, url: "#" },
    { image: detail3, name: "Madrid", count: 41, url: "#" },
  ],
};

export const newDevProps: Omni47NewDevelopmentsProps = {
  label: "New Developments",
  title: "Invest in Tomorrow's Landmarks",
  description: "Exclusive access to off-plan luxury developments with premium finishes and prime locations.",
  stats: [
    { value: "24", label: "Active Projects" },
    { value: "€180M", label: "Total Value" },
    { value: "92%", label: "Sold" },
  ],
  developments: [
    {
      id: "dev-1",
      image: detail1,
      badge: "New Build",
      deliveryQuarter: "Q3 2027",
      location: "Marbella East",
      title: "The Residences at La Cala",
      fromPrice: "€895,000",
      units: "48 units",
      href: "#",
    },
    {
      id: "dev-2",
      image: detail2,
      badge: "New Build",
      deliveryQuarter: "Q1 2027",
      location: "Ibiza, Santa Eulalia",
      title: "Marina Bay Luxury Apartments",
      fromPrice: "€1.2M",
      units: "24 units",
      href: "#",
    },
    {
      id: "dev-3",
      image: detail3,
      badge: "New Build",
      deliveryQuarter: "Q4 2026",
      location: "Mallorca, Port Andratx",
      title: "Sunset Villas Collection",
      fromPrice: "€2.8M",
      units: "12 villas",
      href: "#",
    },
  ],
};

export const offMarketProps: Omni47OffMarketSectionProps = {
  backgroundImage: bannerImg,
  headline: "Not All Properties Are Public",
  description: "Access our exclusive portfolio of off-market properties, available only to registered clients. Discretion guaranteed.",
  button: { label: "Request Access", href: "#", variant: "gold" },
};

// ── Property List ───────────────────────────────────────

export const propertyListProps: Omni47PropertyListPageProps = {
  operationOptions: [
    { value: "sale", label: "For Sale" },
    { value: "rent", label: "For Rent" },
  ],
  locationPlaceholder: "Search by location...",
  typeOptions: [
    { value: "villa", label: "Villa" },
    { value: "apartment", label: "Apartment" },
    { value: "penthouse", label: "Penthouse" },
    { value: "townhouse", label: "Townhouse" },
  ],
  priceRangeOptions: [
    { value: "0-500000", label: "Up to €500K" },
    { value: "500000-1000000", label: "€500K - €1M" },
    { value: "1000000-3000000", label: "€1M - €3M" },
    { value: "3000000+", label: "€3M+" },
  ],
  bedsOptions: [
    { value: "1", label: "1+" },
    { value: "2", label: "2+" },
    { value: "3", label: "3+" },
    { value: "4", label: "4+" },
  ],
  amenityOptions: [
    { value: "pool", label: "Pool" },
    { value: "sea-views", label: "Sea Views" },
    { value: "garage", label: "Garage" },
  ],
  activeFilters: [
    { key: "location", label: "Marbella" },
    { key: "beds", label: "3+ Beds" },
  ],
  resultsCount: 47,
  sortOptions: [
    { value: "newest", label: "Newest First" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
  ],
  currentSort: "newest",
  properties,
  currentPage: 1,
  totalPages: 4,
};

// ── Property Detail ─────────────────────────────────────

export const propertyDetailProps: Omni47PropertyDetailPageProps = {
  images: [detail1, detail2, detail3, detail4, prop1],
  title: "Contemporary Villa with Panoramic Sea Views",
  ref: "REF-0042",
  locationBreadcrumb: ["Spain", "Andalusia", "Marbella", "Golden Mile"],
  price: "€4,850,000",
  operationTag: "For Sale",
  isOffMarket: false,
  beds: 6,
  baths: 5,
  builtSqm: 680,
  plotSqm: 1450,
  description:
    "This stunning contemporary villa sits on one of the most prestigious plots on Marbella's Golden Mile, offering unobstructed panoramic views of the Mediterranean Sea. Designed by a renowned architect, the property features floor-to-ceiling windows, an infinity pool, and state-of-the-art smart home technology throughout. The open-plan living areas seamlessly blend indoor and outdoor spaces, perfect for entertaining or quiet contemplation of the breathtaking coastal views.",
  features: [
    { category: "Interior", items: ["Open plan living", "Chef's kitchen", "Home cinema", "Wine cellar", "Gym", "Smart home system"] },
    { category: "Exterior", items: ["Infinity pool", "Landscaped gardens", "BBQ area", "Covered terrace", "3-car garage"] },
    { category: "Views & Location", items: ["Panoramic sea views", "Mountain views", "Walking distance to beach", "Gated community"] },
  ],
  agent: {
    name: "Alexandra Beaumont",
    photo: "/placeholder.svg",
    phone: "+34 622 456 789",
    email: "alexandra@omni47.com",
    whatsappUrl: "https://wa.me/34622456789",
  },
  similarProperties: properties.slice(0, 3),
};

// ── Static Page ─────────────────────────────────────────

export const staticPageProps: Omni47StaticPageProps = {
  heroImage: bannerImg,
  title: "About OMNI47",
  content: [
    { type: "heading", content: "Our Story", level: 2 },
    { type: "paragraph", content: "Founded in 2001, OMNI47 has grown to become one of the Mediterranean's most trusted luxury real estate agencies. With offices in Marbella, Ibiza, and Mallorca, we connect discerning buyers with exceptional properties." },
    { type: "image", src: prop1, alt: "Our Marbella office" },
    { type: "heading", content: "Our Values", level: 2 },
    { type: "paragraph", content: "Discretion, expertise, and an unwavering commitment to excellence define everything we do. Every property in our portfolio is personally vetted by our team of experts." },
    { type: "cta", button: { label: "Contact Our Team", href: "/omni47/contact", variant: "outline" } },
  ],
  sidebar: [
    { title: "Quick Facts", content: "25+ years in luxury real estate, 850+ properties, 12 offices across Europe." },
    { title: "Awards", content: "Best Luxury Agency Spain 2025, European Property Awards 2024." },
  ],
};

// ── Contact ─────────────────────────────────────────────

export const contactProps: Omni47ContactPageProps = {
  heroTitle: "Get in Touch",
  heroSubtitle: "We'd love to hear from you. Reach out to any of our offices or send us a message below.",
  formTitle: "Send Us a Message",
  subjectOptions: [
    { value: "buying", label: "Buying" },
    { value: "selling", label: "Selling" },
    { value: "renting", label: "Renting" },
    { value: "valuation", label: "Property Valuation" },
    { value: "other", label: "Other" },
  ],
  offices: [
    { id: "marbella", name: "Marbella", address: "Blvd. Príncipe Alfonso de Hohenlohe, 29602", phone: "+34 952 123 456", email: "marbella@omni47.com", hours: "Mon-Fri 9:00-18:00", image: prop1 },
    { id: "ibiza", name: "Ibiza", address: "Paseo Marítimo 12, 07800 Ibiza", phone: "+34 971 234 567", email: "ibiza@omni47.com", hours: "Mon-Fri 9:00-18:00", image: prop2 },
    { id: "mallorca", name: "Mallorca", address: "Paseo del Borne 8, 07012 Palma", phone: "+34 971 345 678", email: "mallorca@omni47.com", hours: "Mon-Fri 9:00-18:00", image: prop3 },
  ],
};

// ── Blog List ───────────────────────────────────────────

export const blogListProps: Omni47BlogListPageProps = {
  heroTitle: "Journal",
  heroSubtitle: "Insights, trends, and stories from the world of luxury real estate",
  featuredPost: blogPosts[0],
  posts: blogPosts.slice(1),
  categories: [
    { value: "all", label: "All" },
    { value: "market-insights", label: "Market Insights" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "architecture", label: "Architecture" },
    { value: "investment", label: "Investment" },
  ],
  currentCategory: "all",
  currentPage: 1,
  totalPages: 3,
};

// ── Blog Post ───────────────────────────────────────────

export const blogPostProps: Omni47BlogPostPageProps = {
  heroImage: blogImg,
  title: "The Rise of Sustainable Luxury Living",
  author: "Victoria Laurent",
  date: "January 15, 2026",
  category: "Market Insights",
  readTime: "6 min read",
  content: `
    <p>The luxury real estate market is undergoing a fundamental shift. Today's discerning buyers aren't just looking for opulence — they're seeking properties that align with their values of sustainability and environmental responsibility.</p>
    <h2>A New Definition of Luxury</h2>
    <p>Gone are the days when luxury was defined solely by marble floors and gold fixtures. Modern luxury buyers prioritize energy efficiency, sustainable materials, and smart home technology that reduces environmental impact without compromising comfort.</p>
    <blockquote>The most prestigious developments in Marbella and Ibiza now achieve BREEAM or LEED certification as standard, not as an afterthought.</blockquote>
    <h2>Market Impact</h2>
    <p>Properties with strong sustainability credentials command a premium of 15-25% over comparable non-certified properties. This trend is particularly pronounced in the €3M+ segment, where buyers are willing to invest in long-term value.</p>
    <h3>Key Sustainability Features</h3>
    <p>Solar panels, geothermal heating, rainwater harvesting, and passive house design principles are becoming expected features in new luxury developments. The integration of these systems has become so sophisticated that they enhance rather than compromise the aesthetic appeal of a property.</p>
  `,
  relatedPosts: blogPosts.slice(1, 4),
  shareUrl: "https://omni47.com/blog/sustainable-luxury-living",
};

// ── Admin Pages ─────────────────────────────────────────

const langs = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "ru", label: "Русский" },
  { code: "nl", label: "Nederlands" },
];

export const adminPagesProps: Omni47AdminPagesPageProps = {
  pages: [
    { id: "1", title: { en: "About Us", es: "Sobre Nosotros" }, slug: "about", status: "published", lastModified: "2026-01-10" },
    { id: "2", title: { en: "Privacy Policy", es: "Política de Privacidad" }, slug: "privacy", status: "published", lastModified: "2025-12-15" },
    { id: "3", title: { en: "Terms of Service", es: "Términos de Servicio" }, slug: "terms", status: "draft", lastModified: "2026-02-20" },
  ],
  languages: langs,
};

export const adminBlogProps: Omni47AdminBlogPageProps = {
  posts: [
    { id: "1", title: { en: "The Rise of Sustainable Luxury Living" }, slug: "sustainable-luxury", category: "market-insights", author: "Victoria Laurent", date: "2026-01-15", featuredImage: "", body: { en: "" }, seoTitle: { en: "" }, seoDescription: { en: "" }, status: "published" },
    { id: "2", title: { en: "Top 5 Waterfront Destinations" }, slug: "waterfront-destinations", category: "lifestyle", author: "James Harris", date: "2026-01-08", featuredImage: "", body: { en: "" }, seoTitle: { en: "" }, seoDescription: { en: "" }, status: "draft" },
  ],
  categories: [
    { value: "market-insights", label: "Market Insights" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "architecture", label: "Architecture" },
    { value: "investment", label: "Investment" },
  ],
  languages: langs,
};
