import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Instagram, Linkedin, MessageCircle } from "lucide-react";
import heroImg from "@/assets/luxury-hero.jpg";
import prop1 from "@/assets/luxury-property-1.jpg";
import prop2 from "@/assets/luxury-property-2.jpg";
import prop3 from "@/assets/luxury-property-3.jpg";
import propertyDetail1 from "@/assets/property-detail-1.jpg";

/* ─── TRANSLATABLE STRINGS ─── */
const BRAND_NAME = "PRESTIGE ESTATES"; // 🌐
const PAGE_TITLE = "The Journal"; // 🌐
const PAGE_SUBTITLE = "Insights, guides and stories from the world of luxury real estate"; // 🌐
const SEARCH_PLACEHOLDER = "Search articles..."; // 🌐
const ALL_CATEGORIES_LABEL = "All"; // 🌐
const READ_MORE = "Read More"; // 🌐
const FEATURED_LABEL = "Featured"; // 🌐
const MIN_READ_SUFFIX = "min read"; // 🌐
const NEWSLETTER_TITLE = "The Private List"; // 🌐
const NEWSLETTER_SUBTITLE = "Stay Informed"; // 🌐
const NEWSLETTER_DESC = "Receive exclusive off-market listings, market insights and invitations to private viewings — delivered discreetly to your inbox."; // 🌐
const NEWSLETTER_PLACEHOLDER = "Your email address"; // 🌐
const NEWSLETTER_BUTTON = "Subscribe"; // 🌐
const NEWSLETTER_PRIVACY = "We respect your privacy. Unsubscribe at any time."; // 🌐
const LOAD_MORE = "Load More Articles"; // 🌐
const NO_RESULTS = "No articles found matching your criteria."; // 🌐

const NAV_LEFT = ["Home", "Properties", "Rentals"]; // 🌐
const NAV_RIGHT = ["About", "Guides & Blog", "Message Us"]; // 🌐
const CONTACT = { email: "hello@prestigeestates.com", phone: "+34 600 000 000", city: "Marbella, Spain" };

/* ─── CATEGORIES ─── */
const CATEGORIES = [
  { slug: "all", label: ALL_CATEGORIES_LABEL }, // 🌐
  { slug: "market-insights", label: "Market Insights" }, // 🌐
  { slug: "lifestyle", label: "Lifestyle" }, // 🌐
  { slug: "architecture", label: "Architecture & Design" }, // 🌐
  { slug: "investment", label: "Investment" }, // 🌐
  { slug: "destinations", label: "Destinations" }, // 🌐
  { slug: "guides", label: "Guides" }, // 🌐
];

/* ─── BLOG POSTS DATA ─── */
const BLOG_POSTS = [
  {
    id: "1",
    image: propertyDetail1,
    date: "26 Feb 2026", // 🌐
    category: "lifestyle",
    title: "An Insider's Guide to Coastal Living in the Mediterranean", // 🌐
    excerpt: "The Mediterranean coast has evolved from a seasonal destination into a strategic lifestyle hub for international buyers seeking year-round luxury. From Ibiza's bohemian energy to the Costa Blanca's understated elegance, discover why discerning buyers are making the move.", // 🌐
    author: "Alexandra Morel", // 🌐
    readTime: 8,
    featured: true,
  },
  {
    id: "2",
    image: prop1,
    date: "25 Feb 2026",
    category: "market-insights",
    title: "Dual Demand Drives Dubai: The Emirate Welcomes Fresh Buyers Without Losing Its Ultra-Prime Edge", // 🌐
    excerpt: "Key Insights: The $500K–$1M segment grew 70% year-over-year, emerging as a primary entry point for international investors looking at Dubai's thriving market.", // 🌐
    author: "James Harrington",
    readTime: 6,
    featured: false,
  },
  {
    id: "3",
    image: prop3,
    date: "25 Feb 2026",
    category: "architecture",
    title: "A Majestic Alpine Estate Spanning 130 Hectares of Private Parkland Near Zermatt", // 🌐
    excerpt: "This remarkable historic estate stands as one of Europe's most captivating properties, where centuries of heritage meet contemporary luxury in a breathtaking mountain setting.", // 🌐
    author: "Sofia Engström",
    readTime: 5,
    featured: false,
  },
  {
    id: "4",
    image: heroImg,
    date: "24 Feb 2026",
    category: "destinations",
    title: "Caribbean Paradise: Explore Exceptional Properties Across the Region's Most Coveted Islands", // 🌐
    excerpt: "The Caribbean's appeal extends beyond its white-sand beaches. Spanning more than 7,000 islands across a turquoise expanse, the region offers an extraordinary range of luxury living opportunities.", // 🌐
    author: "Marcus Chen",
    readTime: 7,
    featured: false,
  },
  {
    id: "5",
    image: prop2,
    date: "22 Feb 2026",
    category: "investment",
    title: "Why European Waterfront Properties Remain the Safest Long-Term Investment", // 🌐
    excerpt: "As global markets fluctuate, European waterfront real estate continues to demonstrate exceptional resilience. We analyse the data behind this enduring asset class.", // 🌐
    author: "Alexandra Morel",
    readTime: 10,
    featured: false,
  },
  {
    id: "6",
    image: prop1,
    date: "20 Feb 2026",
    category: "guides",
    title: "The Complete Guide to Buying Property in Spain as a Non-Resident", // 🌐
    excerpt: "Navigating Spain's property market as an international buyer requires careful planning. From NIE numbers to tax implications, here's everything you need to know.", // 🌐
    author: "James Harrington",
    readTime: 12,
    featured: false,
  },
  {
    id: "7",
    image: prop3,
    date: "18 Feb 2026",
    category: "lifestyle",
    title: "The Rise of Wellness-Centric Luxury Homes: A New Standard in Premium Living", // 🌐
    excerpt: "Today's ultra-high-net-worth buyers aren't just looking for square footage — they're seeking spaces that actively enhance physical and mental well-being.", // 🌐
    author: "Sofia Engström",
    readTime: 6,
    featured: false,
  },
  {
    id: "8",
    image: heroImg,
    date: "15 Feb 2026",
    category: "market-insights",
    title: "Ibiza Property Market Report Q1 2026: Record Demand Meets Limited Supply", // 🌐
    excerpt: "Our quarterly analysis reveals that Ibiza's luxury segment has reached unprecedented price levels, driven by a surge in international demand and a constrained supply pipeline.", // 🌐
    author: "Marcus Chen",
    readTime: 9,
    featured: false,
  },
];

/* ─── Hooks ─── */
function useContainerScrolled(ref: React.RefObject<HTMLElement | null>, threshold = 60) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = () => setScrolled(el.scrollTop > threshold);
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, [ref, threshold]);
  return scrolled;
}

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

const FadeIn = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const { ref, visible } = useFadeIn();
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s` }}>
      {children}
    </div>
  );
};

const LANGUAGES = [
  { code: "EN", label: "English" },
  { code: "ES", label: "Español" },
  { code: "DE", label: "Deutsch" },
  { code: "FR", label: "Français" },
  { code: "RU", label: "Русский" },
];

/* ═══════════════════════════════════════════════════════════ */

const BlogListingPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrolled = useContainerScrolled(containerRef);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setMobileMenuOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Filter posts
  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts.find((p) => p.featured);
  const regularPosts = filteredPosts.filter((p) => !p.featured).slice(0, visibleCount);
  const hasMore = filteredPosts.filter((p) => !p.featured).length > visibleCount;

  const getCategoryLabel = (slug: string) => CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

  return (
    <div ref={containerRef} className="flex-1 overflow-auto bg-white text-luxury-black font-sans relative">

      {/* ─── NAVBAR ─── */}
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white border-b border-neutral-100"}`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 h-[60px] lg:h-[68px]">
          {/* Globe / Language - desktop */}
          <div className="hidden lg:flex items-center relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-luxury-black/60 hover:text-luxury-black transition-colors duration-300"
            >
              <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              <span className="text-[11px] tracking-[0.1em] font-medium">{currentLang}</span>
            </button>
            {langOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border border-neutral-100 py-1 min-w-[140px]">
                {LANGUAGES.map((lang) => (
                  <button key={lang.code} onClick={() => { setCurrentLang(lang.code); setLangOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-[12px] hover:bg-neutral-50 transition-colors ${currentLang === lang.code ? "text-luxury-black font-medium" : "text-luxury-black/60"}`}
                  >{lang.label}</button>
                ))}
              </div>
            )}
          </div>

          {/* Left nav links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LEFT.map((l) => (
              <Link key={l} to={l === "Home" ? "/" : l === "Properties" ? "/properties" : "#"} className="text-[12.5px] tracking-[0.14em] uppercase font-medium text-luxury-black/80 hover:text-luxury-black transition-colors duration-300">{l}</Link>
            ))}
          </div>

          {/* Center logo */}
          <Link to="/" className="flex flex-col items-center">
            <span className="font-serif text-base sm:text-lg md:text-xl tracking-[0.25em] sm:tracking-[0.3em] font-light text-luxury-black">{BRAND_NAME}</span>
            <span className="text-[7px] sm:text-[8px] tracking-[0.35em] uppercase font-light text-luxury-black/50">Real Estate</span>
          </Link>

          {/* Right nav links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_RIGHT.map((l) => (
              <Link key={l} to={l === "Guides & Blog" ? "/blog" : "#"} className={`text-[12.5px] tracking-[0.14em] uppercase font-medium transition-colors duration-300 ${l === "Guides & Blog" ? "text-luxury-black" : "text-luxury-black/80 hover:text-luxury-black"}`}>{l}</Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden text-luxury-black/80" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-neutral-100 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="px-6 py-6 flex flex-col gap-1">
              {[...NAV_LEFT, ...NAV_RIGHT].map((l) => (
                <Link key={l} to={l === "Home" ? "/" : l === "Properties" ? "/properties" : l === "Guides & Blog" ? "/blog" : "#"} className="text-[13px] tracking-[0.12em] uppercase font-medium text-luxury-black/70 hover:text-luxury-black py-3 border-b border-neutral-50 transition-colors">{l}</Link>
              ))}
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <p className="text-[10px] tracking-[0.2em] uppercase text-luxury-black/40 mb-3">Language</p>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button key={lang.code} onClick={() => setCurrentLang(lang.code)}
                      className={`px-3 py-1.5 text-[11px] tracking-[0.1em] border transition-colors ${currentLang === lang.code ? "border-luxury-black bg-luxury-black text-white" : "border-neutral-200 text-luxury-black/60 hover:border-luxury-black/30"}`}
                    >{lang.code}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ─── PAGE HEADER ─── */}
      <section className="py-10 md:py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-10">
          <FadeIn>
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-3xl md:text-5xl font-light text-luxury-black font-serif tracking-tight">{PAGE_TITLE}</h1>
              <p className="text-[13px] md:text-[14px] text-luxury-black/45 font-light mt-3 max-w-lg mx-auto">{PAGE_SUBTITLE}</p>
              <div className="w-12 h-[1px] bg-neutral-300 mx-auto mt-6" />
            </div>
          </FadeIn>

          {/* Search */}
          <FadeIn delay={0.1}>
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-black/30" strokeWidth={1.5} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(6); }}
                  placeholder={SEARCH_PLACEHOLDER}
                  className="w-full border border-neutral-200 bg-white pl-10 pr-4 py-3 text-[13px] text-luxury-black placeholder:text-luxury-black/30 focus:outline-none focus:border-luxury-black/40 transition-colors duration-300"
                />
              </div>
            </div>
          </FadeIn>

          {/* Categories */}
          <FadeIn delay={0.15}>
            <div className="flex flex-wrap justify-center gap-2 mb-10 md:mb-14">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => { setActiveCategory(cat.slug); setVisibleCount(6); }}
                  className={`px-4 py-2 text-[11px] tracking-[0.12em] uppercase font-medium border transition-all duration-300 ${
                    activeCategory === cat.slug
                      ? "border-luxury-black bg-luxury-black text-white"
                      : "border-neutral-200 text-luxury-black/50 hover:border-luxury-black/30 hover:text-luxury-black/70"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* ─── FEATURED POST ─── */}
          {featuredPost && activeCategory === "all" && searchQuery === "" && (
            <FadeIn delay={0.2}>
              <div className="mb-12 md:mb-16 border-b border-neutral-100 pb-12 md:pb-16">
                <Link to={`/blog/${featuredPost.id}`} className="group block">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img src={featuredPost.image} alt={featuredPost.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-luxury-black text-white text-[9px] tracking-[0.18em] uppercase font-medium px-3 py-1">{FEATURED_LABEL}</span>
                        <span className="text-[10px] tracking-[0.18em] uppercase text-luxury-black/35 font-medium">{getCategoryLabel(featuredPost.category)}</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl lg:text-[2.2rem] font-light text-luxury-black font-serif tracking-tight leading-[1.2] group-hover:text-luxury-black/70 transition-colors duration-300">
                        {featuredPost.title}
                      </h2>
                      <p className="text-[13.5px] text-luxury-black/45 font-light mt-4 leading-[1.8] line-clamp-3 lg:line-clamp-4">{featuredPost.excerpt}</p>
                      <div className="flex items-center gap-3 mt-6 text-[11px] text-luxury-black/35 font-light">
                        <span>{featuredPost.author}</span>
                        <span className="w-[3px] h-[3px] bg-luxury-black/15 rounded-full" />
                        <span>{featuredPost.date}</span>
                        <span className="w-[3px] h-[3px] bg-luxury-black/15 rounded-full" />
                        <span>{featuredPost.readTime} {MIN_READ_SUFFIX}</span>
                      </div>
                      <div className="mt-7">
                        <span className="text-[11px] tracking-[0.15em] uppercase text-luxury-black/60 font-medium group-hover:text-luxury-black transition-colors duration-300 inline-flex items-center gap-2 border-b border-luxury-black/20 pb-0.5">
                          {READ_MORE} <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </FadeIn>
          )}

          {/* ─── POSTS GRID ─── */}
          {regularPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
                {regularPosts.map((post, i) => (
                  <FadeIn key={post.id} delay={i * 0.08}>
                    <Link to={`/blog/${post.id}`} className="group block">
                      <div className="relative overflow-hidden aspect-[16/10]">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute top-3 left-3">
                          <span className="bg-white/90 backdrop-blur-sm text-luxury-black text-[9px] tracking-[0.15em] uppercase font-medium px-2.5 py-1">
                            {getCategoryLabel(post.category)}
                          </span>
                        </div>
                      </div>
                      <div className="pt-4 space-y-2">
                        <div className="flex items-center gap-2 text-[10px] text-luxury-black/35 font-light">
                          <span>{post.date}</span>
                          <span className="w-0.5 h-0.5 bg-luxury-black/20 rounded-full" />
                          <span>{post.readTime} {MIN_READ_SUFFIX}</span>
                        </div>
                        <h3 className="text-[15px] md:text-[16px] font-medium text-luxury-black leading-[1.35] group-hover:text-luxury-black/70 transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-[12px] text-luxury-black/40 font-light leading-relaxed line-clamp-2">{post.excerpt}</p>
                        <p className="text-[11px] text-luxury-black/30 font-light pt-1">{post.author}</p>
                      </div>
                    </Link>
                  </FadeIn>
                ))}
              </div>

              {hasMore && (
                <FadeIn delay={0.2}>
                  <div className="text-center mt-12">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="border border-luxury-black/20 text-luxury-black/70 text-[11px] tracking-[0.15em] uppercase px-9 py-3 hover:bg-luxury-black hover:text-white transition-all duration-300"
                    >
                      {LOAD_MORE}
                    </button>
                  </div>
                </FadeIn>
              )}
            </>
          ) : (
            <FadeIn>
              <div className="text-center py-16">
                <p className="text-[14px] text-luxury-black/40 font-light">{NO_RESULTS}</p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="py-14 md:py-20 bg-neutral-50/60">
        <div className="max-w-xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[10px] tracking-[0.35em] uppercase text-luxury-black/40 mb-3">{NEWSLETTER_SUBTITLE}</p>
            <h2 className="text-2xl md:text-3xl font-light text-luxury-black font-serif tracking-tight">{NEWSLETTER_TITLE}</h2>
            <p className="text-[13px] text-luxury-black/45 font-light mt-3 mb-8 leading-relaxed">{NEWSLETTER_DESC}</p>
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder={NEWSLETTER_PLACEHOLDER}
                className="flex-1 border border-neutral-300 bg-white px-4 py-3 text-[13px] text-luxury-black placeholder:text-luxury-black/30 focus:outline-none focus:border-luxury-black/40 transition-colors duration-300" />
              <button type="submit" className="bg-luxury-black text-white text-[11px] tracking-[0.15em] uppercase px-8 py-3 hover:bg-luxury-black/85 transition-all duration-300 whitespace-nowrap">{NEWSLETTER_BUTTON}</button>
            </form>
            <p className="text-[10px] text-luxury-black/25 mt-4 font-light">{NEWSLETTER_PRIVACY}</p>
          </FadeIn>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-luxury-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14 md:py-18">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
            <div className="md:col-span-1">
              <span className="text-base tracking-[0.25em] text-white font-light block mb-3 font-serif">{BRAND_NAME}</span>
              <p className="text-[12px] text-white/30 leading-relaxed font-light">Curating extraordinary homes for exceptional lives since 2010.</p>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-4 font-medium">Quick Links</h4>
              <ul className="space-y-2.5">
                {["Properties", "Services", "About Us", "Contact", "Privacy Policy"].map((l) => (
                  <li key={l}><a href="#" className="text-[12px] text-white/30 hover:text-white/70 transition-colors duration-300 font-light">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-4 font-medium">Contact</h4>
              <ul className="space-y-2.5 text-[12px] text-white/30 font-light">
                <li>{CONTACT.email}</li>
                <li>{CONTACT.phone}</li>
                <li>{CONTACT.city}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-4 font-medium">Follow</h4>
              <div className="flex gap-3">
                {[Instagram, Linkedin, MessageCircle].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-white/30 hover:text-white/70 text-white/30 transition-all duration-300">
                    <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/[0.06] mt-12 pt-6 text-center">
            <p className="text-[10px] text-white/20 tracking-wider font-light">© 2025 {BRAND_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogListingPage;
