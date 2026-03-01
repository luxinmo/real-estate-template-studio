import { useState, useEffect, useRef } from "react";
import { Bed, Bath, Maximize, ChevronDown, Instagram, Linkedin, MessageCircle, Shield, Star, Handshake, Lock, ArrowRight } from "lucide-react";
import heroImg from "@/assets/luxury-hero.jpg";
import prop1 from "@/assets/luxury-property-1.jpg";
import prop2 from "@/assets/luxury-property-2.jpg";
import prop3 from "@/assets/luxury-property-3.jpg";

/* ═══════════ DESIGN SYSTEM ═══════════ */
const C = {
  bg: "#FAFAF8",
  surface: "#FFFFFF",
  text: "#1A1A1A",
  textSecondary: "#5C5C5C",
  textTertiary: "#8A8A8A",
  accent: "#96794A",
  border: "#E8E6E3",
  borderLight: "#F0EEEB",
  dark: "#1A1A1A",
  gold: "#B8965A",
};

const F = "'Jost', 'Helvetica Neue', Helvetica, sans-serif";

/* ─── Placeholder content ─── */
const BRAND_NAME = "PRESTIGE";

const INTRO_TITLE = "Luxury Real Estate Specialists in Ibiza & Costa Blanca";
const INTRO_TEXT = "Prestige Estates is a curated luxury real estate advisory specialising in the most exclusive properties across Ibiza and the Costa Blanca. From breathtaking seafront villas and penthouses to prestigious golf-side estates and new-build residences, we offer a bespoke service built on trust, discretion, and an uncompromising eye for quality. Every home in our portfolio is handpicked, every client relationship is personal, and every transaction is handled with absolute confidentiality through our Private Office.";

const NAV = ["Home", "Properties", "Rentals", "About", "Blog", "Contact"];

const PROPERTIES = [
  { image: prop1, name: "The Skyline Penthouse", location: "Manhattan, New York", price: "€12,500,000", beds: 5, baths: 4, sqm: 420 },
  { image: prop2, name: "Villa Blanca Sur Mer", location: "Costa Brava, Spain", price: "€8,900,000", beds: 6, baths: 5, sqm: 680 },
  { image: prop3, name: "Alpine Glass Retreat", location: "Zermatt, Switzerland", price: "€15,200,000", beds: 7, baths: 6, sqm: 950 },
  { image: heroImg, name: "The Infinity Residence", location: "Marbella, Spain", price: "€9,750,000", beds: 5, baths: 5, sqm: 520 },
];

const SERVICES = [
  { icon: Star, title: "Exclusive Listings", desc: "Villas, penthouses, estates, new builds, frontline beach & golf — access to off-market opportunities reserved for our clients." },
  { icon: Lock, title: "Private Office", desc: "Total confidentiality guaranteed. Discreet transactions managed through our Private Office for high-profile clients." },
  { icon: Handshake, title: "White-Glove Service", desc: "Dedicated advisors guiding you through every step with unmatched attention to detail." },
  { icon: Shield, title: "Expert Negotiation", desc: "Decades of experience securing the finest terms for discerning buyers and sellers." },
];

const BLOG_POSTS = [
  { image: prop2, date: "26 Feb 2026", title: "An Insider's Guide to Coastal Living in the Mediterranean", excerpt: "The Mediterranean coast has evolved from a seasonal destination into a strategic lifestyle hub for international buyers seeking year-round luxury..." },
  { image: prop1, date: "25 Feb 2026", title: "Dual Demand Drives Dubai: The Emirate Welcomes Fresh Buyers Without Losing Its Ultra-Prime Edge", excerpt: "Key Insights: The $500K–$1M segment grew 70% year-over-year, emerging as a primary entry point f..." },
  { image: prop3, date: "25 Feb 2026", title: "A Majestic Alpine Estate Spanning 130 Hectares of Private Parkland Near Zermatt", excerpt: "This remarkable historic estate stands as one of Europe's most captivating properties, w..." },
  { image: heroImg, date: "24 Feb 2026", title: "Caribbean Paradise: Explore Exceptional Properties Across the Region's Most Coveted Islands", excerpt: "The Caribbean's appeal extends beyond its white-sand beaches. Spanning more than 7,000 islands ac..." },
];

const CONTACT = { email: "hello@prestigeestates.com", phone: "+34 600 000 000", city: "Marbella, Spain" };

const HERO_SLIDES = [
  { image: heroImg, headline: "Where Luxury Meets Home", sub: "Exclusive properties for those who demand the extraordinary" },
  { image: prop1, headline: "Elevated Urban Living", sub: "Penthouses and residences in the world's most coveted addresses" },
  { image: prop2, headline: "Coastal Perfection", sub: "Beachfront estates crafted for an unparalleled lifestyle" },
  { image: prop3, headline: "Mountain Retreats", sub: "Private sanctuaries surrounded by nature's grandeur" },
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

/* ═══════════════════════════════════════════════════════════ */

const LuxuryLandingPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrolled = useContainerScrolled(containerRef);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setMobileMenuOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <div ref={containerRef} className="flex-1 overflow-auto relative" style={{ background: C.surface, color: C.text, fontFamily: F }}>

      {/* ─── NAVBAR ─── */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-500`}
        style={{
          background: scrolled ? `${C.surface}f2` : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.04)" : "none",
          marginBottom: scrolled ? 0 : "-68px",
        }}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-5 lg:px-10 h-[60px] lg:h-[68px]">
          {/* Globe / Language - desktop */}
          <div className="hidden lg:flex items-center relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 transition-colors duration-300"
              style={{ color: scrolled ? C.textTertiary : "rgba(255,255,255,0.7)" }}
            >
              <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              <span className="text-[11px] tracking-[0.1em] font-medium">{currentLang}</span>
            </button>
            {langOpen && (
              <div className="absolute top-full left-0 mt-2 shadow-lg py-1 min-w-[140px] rounded-xl" style={{ background: C.surface, border: `1px solid ${C.borderLight}` }}>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setCurrentLang(lang.code); setLangOpen(false); }}
                    className="w-full text-left px-4 py-2 text-[12px] hover:bg-[#F8F7F5] transition-colors"
                    style={{ color: currentLang === lang.code ? C.text : C.textTertiary }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Left nav links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV.slice(0, 3).map((l) => (
              <a key={l} href={l === "Properties" ? "/properties" : "#"}
                className="text-[13px] tracking-[0.1em] uppercase font-light transition-colors duration-300 hover:opacity-70"
                style={{ color: scrolled ? C.text : "#fff" }}>{l}</a>
            ))}
          </div>

          {/* Center logo */}
          <div className="flex flex-col items-center">
            <span
              className="text-[20px] sm:text-[22px] tracking-[0.35em] font-extralight transition-colors duration-300"
              style={{ color: scrolled ? C.text : "#fff" }}
            >
              {BRAND_NAME}
            </span>
            <span
              className="text-[7px] sm:text-[8px] tracking-[0.5em] uppercase font-light transition-colors duration-300 -mt-0.5"
              style={{ color: scrolled ? C.textTertiary : "rgba(255,255,255,0.45)" }}
            >
              Real Estate
            </span>
          </div>

          {/* Right nav links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV.slice(3).map((l) => (
              <a key={l} href={l === "Blog" ? "/blog" : "#"}
                className="text-[13px] tracking-[0.1em] uppercase font-light transition-colors duration-300 hover:opacity-70"
                style={{ color: scrolled ? C.text : "#fff" }}>{l}</a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden transition-colors duration-300"
            style={{ color: scrolled ? C.text : "rgba(255,255,255,0.9)" }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {/* ─── MOBILE MENU OVERLAY ─── */}
        {mobileMenuOpen && (
          <div className="lg:hidden shadow-lg animate-in slide-in-from-top-2 duration-200" style={{ background: C.surface, borderTop: `1px solid ${C.borderLight}` }}>
            <div className="px-6 py-6 flex flex-col gap-1">
              {NAV.map((l) => (
                <a key={l} href="#" className="text-[14px] tracking-[0.08em] uppercase font-light py-3 transition-colors hover:opacity-70" style={{ color: C.text, borderBottom: `1px solid ${C.borderLight}` }}>
                  {l}
                </a>
              ))}
              {/* Language selector in mobile */}
              <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${C.borderLight}` }}>
                <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: C.textTertiary }}>Language</p>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setCurrentLang(lang.code); }}
                      className="px-3 py-1.5 text-[11px] tracking-[0.1em] transition-colors rounded-full"
                      style={{
                        border: `1px solid ${currentLang === lang.code ? C.dark : C.border}`,
                        background: currentLang === lang.code ? C.dark : "transparent",
                        color: currentLang === lang.code ? "#fff" : C.textSecondary,
                      }}
                    >
                      {lang.code}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ─── HERO SLIDESHOW ─── */}
      <section className="relative h-[55vh] sm:h-[70vh] lg:h-[85vh] min-h-[400px] sm:min-h-[550px] flex items-center justify-center overflow-hidden">
        {HERO_SLIDES.map((slide, i) => (
          <div key={i} className="absolute inset-0 transition-opacity duration-[1.5s] ease-in-out" style={{ opacity: currentSlide === i ? 1 : 0 }}>
            <img src={slide.image} alt={slide.headline} className="w-full h-full object-cover" style={{ transform: currentSlide === i ? "scale(1.05)" : "scale(1)", transition: "transform 6s ease-out" }} />
          </div>
        ))}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to b, rgba(26,26,26,0.3) 0%, rgba(26,26,26,0.1) 40%, rgba(26,26,26,0.5) 100%)" }} />

        <div className="relative z-10 text-center max-w-4xl px-6">
          <FadeIn>
            <p className="text-[10px] sm:text-[11px] md:text-[12px] tracking-[0.35em] uppercase mb-4 sm:mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>The World's Finest Properties</p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extralight leading-[1.1] mb-4 sm:mb-6 text-white drop-shadow-lg tracking-[0.04em]" style={{ fontFamily: F }}>
              {HERO_SLIDES[currentSlide].headline}
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-xs sm:text-sm md:text-lg max-w-xl mx-auto mb-6 sm:mb-10 leading-relaxed drop-shadow font-light" style={{ color: "rgba(255,255,255,0.6)" }}>
              {HERO_SLIDES[currentSlide].sub}
            </p>
          </FadeIn>
          <FadeIn delay={0.45}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button className="w-full sm:w-auto text-[11px] tracking-[0.15em] uppercase font-medium px-8 py-3.5 transition-all duration-300 flex items-center justify-center gap-2 rounded-full" style={{ background: C.surface, color: C.text }}>
                Explore Properties <ArrowRight className="w-4 h-4" />
              </button>
              <button className="w-full sm:w-auto text-[11px] tracking-[0.15em] uppercase px-8 py-3.5 transition-all duration-300 backdrop-blur-sm rounded-full text-white hover:bg-white hover:text-[#1A1A1A]" style={{ border: "1px solid rgba(255,255,255,0.4)" }}>
                Book a Private Tour
              </button>
            </div>
          </FadeIn>
        </div>

        <div className="absolute bottom-12 sm:bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-[2px] rounded-full transition-all duration-500 ${currentSlide === i ? "w-8 bg-white" : "w-4 bg-white/30 hover:bg-white/50"}`} />
          ))}
        </div>

        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce" style={{ color: "rgba(255,255,255,0.3)" }}>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* ─── INTRO / PRESENTATION ─── */}
      <section className="py-12 md:py-16" style={{ background: C.surface }}>
        <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
          <FadeIn>
            <h2 className="text-xl sm:text-2xl md:text-[1.85rem] font-extralight leading-[1.4] tracking-[0.02em]" style={{ fontFamily: F, color: C.text }}>
              {INTRO_TITLE}
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="w-10 h-[1px] mx-auto my-5" style={{ background: C.border }} />
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-[13px] md:text-[14px] leading-[1.85] font-light" style={{ color: C.textSecondary }}>
              {INTRO_TEXT}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── STATS / NUMBERS ─── */}
      <section className="py-10 md:py-14" style={{ background: C.bg }}>
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
              {[
                { value: "347", label: "Properties for Sale" },
                { value: "€2.1B", label: "Portfolio Value" },
                { value: "120+", label: "Off-Market Properties" },
                { value: "25+", label: "Years of Experience" },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl md:text-4xl font-extralight" style={{ fontFamily: F, color: C.text }}>{stat.value}</p>
                  <p className="text-[11px] tracking-[0.12em] uppercase mt-1.5 font-light" style={{ color: C.textTertiary }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── FEATURED PROPERTIES ─── */}
      <section className="py-10 md:py-16" style={{ background: C.surface }}>
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-10">
          <FadeIn>
            <div className="text-center mb-8 sm:mb-10">
              <p className="text-[10px] tracking-[0.35em] uppercase mb-2" style={{ color: C.textTertiary }}>Portfolio</p>
              <h2 className="text-2xl md:text-3xl font-extralight tracking-[0.04em]" style={{ fontFamily: F, color: C.text }}>Featured Properties</h2>
              <div className="w-12 h-[1px] mx-auto mt-4" style={{ background: C.border }} />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {PROPERTIES.map((p, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden aspect-[4/3] sm:aspect-[3/4] rounded-xl">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center">
                      <span className="text-[11px] tracking-[0.2em] uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 px-5 py-2 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.5)" }}>View Details</span>
                    </div>
                  </div>
                  <div className="pt-3.5 space-y-1">
                    <p className="text-[10px] tracking-[0.18em] uppercase" style={{ color: C.textTertiary }}>{p.location}</p>
                    <h3 className="text-[14px] font-light" style={{ fontFamily: F, color: C.text }}>{p.name}</h3>
                    <p className="text-[15px] font-normal" style={{ color: C.accent }}>{p.price}</p>
                    <div className="flex items-center gap-4 pt-1 text-[11px] font-light" style={{ color: C.textTertiary }}>
                      <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {p.beds}</span>
                      <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {p.baths}</span>
                      <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> {p.sqm} m²</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <div className="text-center mt-10">
              <a href="/properties" className="text-[11px] tracking-[0.15em] uppercase px-9 py-3 transition-all duration-300 rounded-full hover:opacity-80" style={{ border: `1px solid ${C.border}`, color: C.textSecondary }}>
                View All Properties
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section className="py-12 md:py-16" style={{ background: C.bg }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <FadeIn>
            <div className="text-center mb-8">
              <p className="text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: C.textTertiary }}>Why Choose Us</p>
              <h2 className="text-2xl md:text-3xl font-extralight tracking-[0.04em]" style={{ fontFamily: F, color: C.text }}>A Standard Apart</h2>
              <div className="w-12 h-[1px] mx-auto mt-5" style={{ background: C.border }} />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="text-center group p-6 transition-all duration-500 rounded-2xl" style={{ border: `1px solid ${C.borderLight}`, background: C.surface }}>
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full transition-all duration-500" style={{ border: `1px solid ${C.border}` }}>
                    <s.icon className="w-5 h-5" strokeWidth={1.2} style={{ color: C.accent }} />
                  </div>
                  <h3 className="text-[13px] font-medium tracking-wide mb-2.5" style={{ fontFamily: F, color: C.text }}>{s.title}</h3>
                  <p className="text-[12px] leading-relaxed font-light" style={{ color: C.textSecondary }}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE JOURNAL / BLOG ─── */}
      <section className="py-12 md:py-16" style={{ background: C.surface }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-extralight tracking-[0.04em] mb-8" style={{ fontFamily: F, color: C.text }}>The Journal</h2>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Featured article */}
            <FadeIn className="lg:col-span-7">
              <a href="#" className="group block h-full">
                <div className="relative overflow-hidden rounded-2xl h-full min-h-[350px]">
                  <img src={BLOG_POSTS[0].image} alt={BLOG_POSTS[0].title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,26,26,0.7) 0%, rgba(26,26,26,0.1) 50%, transparent 100%)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                    <span className="text-[10px] tracking-[0.15em] uppercase font-light" style={{ color: "rgba(255,255,255,0.5)" }}>{BLOG_POSTS[0].date}</span>
                    <h3 className="text-lg md:text-xl font-light text-white leading-snug mt-1.5" style={{ fontFamily: F }}>{BLOG_POSTS[0].title}</h3>
                    <p className="text-[12px] font-light mt-2 line-clamp-2" style={{ color: "rgba(255,255,255,0.5)" }}>{BLOG_POSTS[0].excerpt}</p>
                  </div>
                </div>
              </a>
            </FadeIn>

            {/* Side articles */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              {BLOG_POSTS.slice(1).map((post, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <a href="#" className="group flex gap-4 items-start">
                    <div className="w-[140px] h-[95px] shrink-0 overflow-hidden rounded-xl">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <span className="text-[10px] tracking-[0.18em] uppercase font-light" style={{ color: C.textTertiary }}>{post.date}</span>
                      <h4 className="text-[14px] font-medium leading-[1.35] mt-1 transition-colors duration-300 line-clamp-2 group-hover:opacity-70" style={{ fontFamily: F, color: C.text }}>{post.title}</h4>
                      <p className="text-[12px] font-light mt-1 line-clamp-2 leading-relaxed" style={{ color: C.textTertiary }}>{post.excerpt}</p>
                    </div>
                  </a>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="py-14 md:py-20" style={{ background: C.bg }}>
        <div className="max-w-xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: C.textTertiary }}>Stay Informed</p>
            <h2 className="text-2xl md:text-3xl font-extralight tracking-[0.04em]" style={{ fontFamily: F, color: C.text }}>The Private List</h2>
            <p className="text-[13px] font-light mt-3 mb-8 leading-relaxed" style={{ color: C.textSecondary }}>
              Receive exclusive off-market listings, market insights and invitations to private viewings — delivered discreetly to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 text-[13px] focus:outline-none transition-colors duration-300 rounded-xl"
                style={{ border: `1px solid ${C.border}`, color: C.text, background: C.surface, fontFamily: F }}
              />
              <button type="submit" className="text-[11px] tracking-[0.15em] uppercase px-8 py-3 transition-all duration-300 whitespace-nowrap rounded-full hover:opacity-90" style={{ background: C.dark, color: "#fff" }}>
                Subscribe
              </button>
            </form>
            <p className="text-[10px] mt-4 font-light" style={{ color: C.textTertiary }}>We respect your privacy. Unsubscribe at any time.</p>
          </FadeIn>
        </div>
      </section>

      {/* ─── FOOTER (DARK) ─── */}
      <footer style={{ background: C.dark }}>
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
            <div className="md:col-span-1">
              <span className="text-xl tracking-[0.35em] font-extralight block mb-1" style={{ color: "#fff" }}>{BRAND_NAME}</span>
              <span className="text-[8px] tracking-[0.4em] uppercase font-light block mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>Real Estate</span>
              <p className="text-[13px] leading-relaxed font-light" style={{ color: "rgba(255,255,255,0.5)" }}>
                Curating extraordinary homes for exceptional lives since 2010.
              </p>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.15em] uppercase mb-5 font-normal" style={{ color: "rgba(255,255,255,0.45)" }}>Quick Links</h4>
              <ul className="space-y-3">
                {["Properties", "Services", "About Us", "Contact", "Privacy Policy"].map((l) => (
                  <li key={l}><a href="#" className="text-[13px] font-light transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.55)" }}>{l}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.15em] uppercase mb-5 font-normal" style={{ color: "rgba(255,255,255,0.45)" }}>Contact</h4>
              <ul className="space-y-3 text-[13px] font-light" style={{ color: "rgba(255,255,255,0.55)" }}>
                <li>{CONTACT.email}</li>
                <li>{CONTACT.phone}</li>
                <li>{CONTACT.city}</li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.15em] uppercase mb-5 font-normal" style={{ color: "rgba(255,255,255,0.45)" }}>Follow</h4>
              <div className="flex gap-3">
                {[Instagram, Linkedin, MessageCircle].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:border-white/30" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.55)" }}>
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14 pt-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-[11px] tracking-[0.12em] font-light" style={{ color: "rgba(255,255,255,0.3)" }}>© 2026 {BRAND_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LuxuryLandingPage;
