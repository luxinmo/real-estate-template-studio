import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Instagram, Linkedin, MessageCircle } from "lucide-react";
import heroImg from "@/assets/luxury-hero.jpg";
import prop1 from "@/assets/luxury-property-1.jpg";
import prop2 from "@/assets/luxury-property-2.jpg";
import prop3 from "@/assets/luxury-property-3.jpg";
import propertyDetail1 from "@/assets/property-detail-1.jpg";

/* ─── PALETTE & FONT — synced with Home 2 ─── */
const p = {
  bg: "#FAF8F5",
  white: "#FFFFFF",
  text: "#2D2926",
  muted: "#6B6560",
  light: "#9A938B",
  accent: "#8B6F47",
  border: "#E2DCD4",
  footer: "#2D2926",
};
const font = "'Jost', Helvetica, sans-serif";

/* ─── TRANSLATABLE STRINGS ─── */
const BRAND_NAME = "PRESTIGE ESTATES";
const PAGE_TITLE = "The Journal";
const PAGE_SUBTITLE = "Insights, guides and stories from the world of luxury real estate";
const SEARCH_PLACEHOLDER = "Search articles...";
const ALL_CATEGORIES_LABEL = "All";
const READ_MORE = "Read More";
const FEATURED_LABEL = "Featured";
const MIN_READ_SUFFIX = "min read";
const NEWSLETTER_TITLE = "The Private List";
const NEWSLETTER_SUBTITLE = "Stay Informed";
const NEWSLETTER_DESC = "Receive exclusive off-market listings, market insights and invitations to private viewings — delivered discreetly to your inbox.";
const NEWSLETTER_PLACEHOLDER = "Your email address";
const NEWSLETTER_BUTTON = "Subscribe";
const NEWSLETTER_PRIVACY = "We respect your privacy. Unsubscribe at any time.";
const LOAD_MORE = "Load More Articles";
const NO_RESULTS = "No articles found matching your criteria.";

const NAV_LEFT = ["Home", "Properties", "Rentals"];
const NAV_RIGHT = ["About", "Guides & Blog", "Message Us"];
const CONTACT = { email: "hello@prestigeestates.com", phone: "+34 600 000 000", city: "Marbella, Spain" };

/* ─── CATEGORIES ─── */
const CATEGORIES = [
  { slug: "all", label: ALL_CATEGORIES_LABEL },
  { slug: "market-insights", label: "Market Insights" },
  { slug: "lifestyle", label: "Lifestyle" },
  { slug: "architecture", label: "Architecture & Design" },
  { slug: "investment", label: "Investment" },
  { slug: "destinations", label: "Destinations" },
  { slug: "guides", label: "Guides" },
];

/* ─── BLOG POSTS DATA ─── */
const BLOG_POSTS = [
  { id: "1", image: propertyDetail1, date: "26 Feb 2026", category: "lifestyle", title: "An Insider's Guide to Coastal Living in the Mediterranean", excerpt: "The Mediterranean coast has evolved from a seasonal destination into a strategic lifestyle hub for international buyers seeking year-round luxury. From Ibiza's bohemian energy to the Costa Blanca's understated elegance, discover why discerning buyers are making the move.", author: "Alexandra Morel", readTime: 8, featured: true },
  { id: "2", image: prop1, date: "25 Feb 2026", category: "market-insights", title: "Dual Demand Drives Dubai: The Emirate Welcomes Fresh Buyers Without Losing Its Ultra-Prime Edge", excerpt: "Key Insights: The $500K–$1M segment grew 70% year-over-year, emerging as a primary entry point for international investors looking at Dubai's thriving market.", author: "James Harrington", readTime: 6, featured: false },
  { id: "3", image: prop3, date: "25 Feb 2026", category: "architecture", title: "A Majestic Alpine Estate Spanning 130 Hectares of Private Parkland Near Zermatt", excerpt: "This remarkable historic estate stands as one of Europe's most captivating properties, where centuries of heritage meet contemporary luxury in a breathtaking mountain setting.", author: "Sofia Engström", readTime: 5, featured: false },
  { id: "4", image: heroImg, date: "24 Feb 2026", category: "destinations", title: "Caribbean Paradise: Explore Exceptional Properties Across the Region's Most Coveted Islands", excerpt: "The Caribbean's appeal extends beyond its white-sand beaches. Spanning more than 7,000 islands across a turquoise expanse, the region offers an extraordinary range of luxury living opportunities.", author: "Marcus Chen", readTime: 7, featured: false },
  { id: "5", image: prop2, date: "22 Feb 2026", category: "investment", title: "Why European Waterfront Properties Remain the Safest Long-Term Investment", excerpt: "As global markets fluctuate, European waterfront real estate continues to demonstrate exceptional resilience. We analyse the data behind this enduring asset class.", author: "Alexandra Morel", readTime: 10, featured: false },
  { id: "6", image: prop1, date: "20 Feb 2026", category: "guides", title: "The Complete Guide to Buying Property in Spain as a Non-Resident", excerpt: "Navigating Spain's property market as an international buyer requires careful planning. From NIE numbers to tax implications, here's everything you need to know.", author: "James Harrington", readTime: 12, featured: false },
  { id: "7", image: prop3, date: "18 Feb 2026", category: "lifestyle", title: "The Rise of Wellness-Centric Luxury Homes: A New Standard in Premium Living", excerpt: "Today's ultra-high-net-worth buyers aren't just looking for square footage — they're seeking spaces that actively enhance physical and mental well-being.", author: "Sofia Engström", readTime: 6, featured: false },
  { id: "8", image: heroImg, date: "15 Feb 2026", category: "market-insights", title: "Ibiza Property Market Report Q1 2026: Record Demand Meets Limited Supply", excerpt: "Our quarterly analysis reveals that Ibiza's luxury segment has reached unprecedented price levels, driven by a surge in international demand and a constrained supply pipeline.", author: "Marcus Chen", readTime: 9, featured: false },
];

const LANGUAGES = [
  { code: "EN", label: "English" },
  { code: "ES", label: "Español" },
  { code: "DE", label: "Deutsch" },
  { code: "FR", label: "Français" },
  { code: "RU", label: "Русский" },
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

const FadeIn = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>
      {children}
    </div>
  );
};

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

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    const matchesSearch = searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts.find((pp) => pp.featured);
  const regularPosts = filteredPosts.filter((pp) => !pp.featured).slice(0, visibleCount);
  const hasMore = filteredPosts.filter((pp) => !pp.featured).length > visibleCount;
  const getCategoryLabel = (slug: string) => CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

  return (
    <div ref={containerRef} className="flex-1 overflow-auto relative" style={{ background: p.bg, color: p.text, fontFamily: font }}>

      {/* ─── NAVBAR ─── */}
      <nav
        className="sticky top-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? `${p.white}f0` : p.white,
          backdropFilter: scrolled ? "blur(16px)" : "none",
          boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.06)" : "none",
          borderBottom: scrolled ? "none" : `1px solid ${p.border}`,
        }}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 h-[60px] lg:h-[68px]">
          {/* Globe / Language */}
          <div className="hidden lg:flex items-center relative">
            <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1.5 transition-colors duration-300" style={{ color: p.light }}>
              <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              <span className="text-[11px] tracking-[0.1em] font-medium">{currentLang}</span>
            </button>
            {langOpen && (
              <div className="absolute top-full left-0 mt-2 shadow-lg py-1 min-w-[140px]" style={{ background: p.white, border: `1px solid ${p.border}` }}>
                {LANGUAGES.map((lang) => (
                  <button key={lang.code} onClick={() => { setCurrentLang(lang.code); setLangOpen(false); }}
                    className="w-full text-left px-4 py-2 text-[12px] hover:bg-neutral-50 transition-colors"
                    style={{ color: currentLang === lang.code ? p.text : p.light, fontWeight: currentLang === lang.code ? 500 : 400 }}
                  >{lang.label}</button>
                ))}
              </div>
            )}
          </div>

          {/* Left nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LEFT.map((l) => (
              <Link key={l} to={l === "Home" ? "/" : l === "Properties" ? "/properties" : "#"} className="text-[13px] tracking-[0.12em] uppercase font-light transition-colors duration-300 hover:opacity-60" style={{ color: p.text }}>{l}</Link>
            ))}
          </div>

          {/* Center logo */}
          <Link to="/" className="flex flex-col items-center">
            <span className="text-[20px] sm:text-[24px] tracking-[0.35em] font-light" style={{ color: p.text }}>{BRAND_NAME}</span>
            <span className="text-[7px] sm:text-[8px] tracking-[0.45em] uppercase font-light -mt-0.5" style={{ color: p.light }}>Real Estate</span>
          </Link>

          {/* Right nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_RIGHT.map((l) => (
              <Link key={l} to={l === "Guides & Blog" ? "/blog" : "#"} className="text-[13px] tracking-[0.12em] uppercase font-light transition-colors duration-300 hover:opacity-60" style={{ color: l === "Guides & Blog" ? p.text : p.muted }}>{l}</Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden" style={{ color: p.muted }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden animate-in slide-in-from-top-2 duration-200" style={{ background: p.white, borderTop: `1px solid ${p.border}` }}>
            <div className="px-6 py-6 flex flex-col gap-1">
              {[...NAV_LEFT, ...NAV_RIGHT].map((l) => (
                <Link key={l} to={l === "Home" ? "/" : l === "Properties" ? "/properties" : l === "Guides & Blog" ? "/blog" : "#"} className="text-[14px] tracking-[0.08em] font-light py-3" style={{ color: p.text, borderBottom: `1px solid ${p.border}40` }}>{l}</Link>
              ))}
              <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${p.border}` }}>
                <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: p.light }}>Language</p>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button key={lang.code} onClick={() => setCurrentLang(lang.code)}
                      className="px-3 py-1.5 text-[11px] tracking-[0.1em] transition-colors"
                      style={{
                        border: `1px solid ${currentLang === lang.code ? p.text : p.border}`,
                        background: currentLang === lang.code ? p.text : "transparent",
                        color: currentLang === lang.code ? p.white : p.light,
                      }}
                    >{lang.code}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ─── PAGE HEADER ─── */}
      <section className="py-10 md:py-16" style={{ background: p.bg }}>
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-10">
          <FadeIn>
            <div className="text-center mb-8 md:mb-12">
              <p className="text-xs tracking-[0.3em] uppercase mb-3 font-normal" style={{ color: p.accent }}>Journal</p>
              <h1 className="text-3xl md:text-5xl font-extralight tracking-[0.04em]">{PAGE_TITLE}</h1>
              <p className="text-[13px] md:text-[14px] font-light mt-3 max-w-lg mx-auto" style={{ color: p.light }}>{PAGE_SUBTITLE}</p>
              <div className="w-12 h-[1px] mx-auto mt-6" style={{ background: p.accent }} />
            </div>
          </FadeIn>

          {/* Search */}
          <FadeIn delay={0.1}>
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: p.light }} strokeWidth={1.5} />
                <input
                  type="text" value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(6); }}
                  placeholder={SEARCH_PLACEHOLDER}
                  className="w-full pl-10 pr-4 py-3 text-[13px] focus:outline-none transition-colors duration-300"
                  style={{ border: `1px solid ${p.border}`, background: p.white, color: p.text }}
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
                  className="px-4 py-2 text-[11px] tracking-[0.12em] uppercase font-medium transition-all duration-300"
                  style={{
                    border: `1px solid ${activeCategory === cat.slug ? p.text : p.border}`,
                    background: activeCategory === cat.slug ? p.text : "transparent",
                    color: activeCategory === cat.slug ? p.white : p.light,
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* ─── FEATURED POST ─── */}
          {featuredPost && activeCategory === "all" && searchQuery === "" && (
            <FadeIn delay={0.2}>
              <div className="mb-12 md:mb-16 pb-12 md:pb-16" style={{ borderBottom: `1px solid ${p.border}` }}>
                <Link to={`/blog/${featuredPost.id}`} className="group block">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img src={featuredPost.image} alt={featuredPost.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[9px] tracking-[0.18em] uppercase font-medium px-3 py-1" style={{ background: p.text, color: p.white }}>{FEATURED_LABEL}</span>
                        <span className="text-[10px] tracking-[0.18em] uppercase font-medium" style={{ color: p.light }}>{getCategoryLabel(featuredPost.category)}</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl lg:text-[2.2rem] font-extralight tracking-[0.02em] leading-[1.2] group-hover:opacity-70 transition-opacity duration-300">
                        {featuredPost.title}
                      </h2>
                      <p className="text-[13.5px] font-light mt-4 leading-[1.8] line-clamp-3 lg:line-clamp-4" style={{ color: p.muted }}>{featuredPost.excerpt}</p>
                      <div className="flex items-center gap-3 mt-6 text-[11px] font-light" style={{ color: p.light }}>
                        <span>{featuredPost.author}</span>
                        <span className="w-[3px] h-[3px] rounded-full" style={{ background: p.border }} />
                        <span>{featuredPost.date}</span>
                        <span className="w-[3px] h-[3px] rounded-full" style={{ background: p.border }} />
                        <span>{featuredPost.readTime} {MIN_READ_SUFFIX}</span>
                      </div>
                      <div className="mt-7">
                        <span className="text-[11px] tracking-[0.15em] uppercase font-medium inline-flex items-center gap-2 pb-0.5 group-hover:opacity-70 transition-opacity duration-300" style={{ color: p.accent, borderBottom: `1px solid ${p.accent}40` }}>
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
                          <span className="backdrop-blur-sm text-[9px] tracking-[0.15em] uppercase font-medium px-2.5 py-1" style={{ background: `${p.white}e6`, color: p.text }}>
                            {getCategoryLabel(post.category)}
                          </span>
                        </div>
                      </div>
                      <div className="pt-4 space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-light" style={{ color: p.light }}>
                          <span>{post.date}</span>
                          <span className="w-0.5 h-0.5 rounded-full" style={{ background: p.border }} />
                          <span>{post.readTime} {MIN_READ_SUFFIX}</span>
                        </div>
                        <h3 className="text-[15px] md:text-[16px] font-normal leading-[1.35] group-hover:opacity-70 transition-opacity duration-300 line-clamp-2" style={{ color: p.text }}>
                          {post.title}
                        </h3>
                        <p className="text-[12px] font-light leading-relaxed line-clamp-2" style={{ color: p.muted }}>{post.excerpt}</p>
                        <p className="text-[11px] font-light pt-1" style={{ color: p.light }}>{post.author}</p>
                      </div>
                    </Link>
                  </FadeIn>
                ))}
              </div>

              {hasMore && (
                <FadeIn delay={0.2}>
                  <div className="text-center mt-12">
                    <button onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="text-[11px] tracking-[0.15em] uppercase px-9 py-3 transition-all duration-300 hover:opacity-80"
                      style={{ border: `1px solid ${p.border}`, color: p.muted }}
                    >{LOAD_MORE}</button>
                  </div>
                </FadeIn>
              )}
            </>
          ) : (
            <FadeIn>
              <div className="text-center py-16">
                <p className="text-[14px] font-light" style={{ color: p.light }}>{NO_RESULTS}</p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="py-14 md:py-20" style={{ background: p.white }}>
        <div className="max-w-xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: p.accent }}>{NEWSLETTER_SUBTITLE}</p>
            <h2 className="text-2xl md:text-3xl font-extralight tracking-[0.04em]">{NEWSLETTER_TITLE}</h2>
            <p className="text-[13px] font-light mt-3 mb-8 leading-relaxed" style={{ color: p.muted }}>{NEWSLETTER_DESC}</p>
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder={NEWSLETTER_PLACEHOLDER}
                className="flex-1 px-4 py-3 text-[13px] focus:outline-none transition-colors duration-300"
                style={{ border: `1px solid ${p.border}`, background: p.white, color: p.text }} />
              <button type="submit" className="text-[11px] tracking-[0.15em] uppercase px-8 py-3 transition-all duration-300 whitespace-nowrap hover:opacity-90"
                style={{ background: p.accent, color: p.white }}>{NEWSLETTER_BUTTON}</button>
            </form>
            <p className="text-[10px] mt-4 font-light" style={{ color: p.light }}>{NEWSLETTER_PRIVACY}</p>
          </FadeIn>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: p.footer }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14 md:py-18">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
            <div className="md:col-span-1">
              <span className="text-[18px] tracking-[0.35em] font-light block mb-3" style={{ color: p.white }}>{BRAND_NAME}</span>
              <p className="text-[12px] leading-relaxed font-light" style={{ color: "rgba(255,255,255,0.3)" }}>Curating extraordinary homes for exceptional lives since 2010.</p>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.2em] uppercase mb-4 font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Quick Links</h4>
              <ul className="space-y-2.5">
                {["Properties", "Services", "About Us", "Contact", "Privacy Policy"].map((l) => (
                  <li key={l}><a href="#" className="text-[12px] font-light hover:text-white/70 transition-colors duration-300" style={{ color: "rgba(255,255,255,0.3)" }}>{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.2em] uppercase mb-4 font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Contact</h4>
              <ul className="space-y-2.5 text-[12px] font-light" style={{ color: "rgba(255,255,255,0.3)" }}>
                <li>{CONTACT.email}</li>
                <li>{CONTACT.phone}</li>
                <li>{CONTACT.city}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.2em] uppercase mb-4 font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Follow</h4>
              <div className="flex gap-3">
                {[Instagram, Linkedin, MessageCircle].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 flex items-center justify-center hover:border-white/30 hover:text-white/70 transition-all duration-300" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }}>
                    <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 pt-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[10px] tracking-wider font-light" style={{ color: "rgba(255,255,255,0.2)" }}>© 2025 {BRAND_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogListingPage;
