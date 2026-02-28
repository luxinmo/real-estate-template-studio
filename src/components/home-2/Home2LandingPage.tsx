import { useState, useEffect, useRef } from "react";
import { Bed, Bath, Maximize, ArrowRight, ArrowUpRight, Instagram, Linkedin, MessageCircle, Lock, Eye, EyeOff, Shield } from "lucide-react";
import heroImg from "@/assets/luxury-hero.jpg";
import prop1 from "@/assets/luxury-property-1.jpg";
import prop2 from "@/assets/luxury-property-2.jpg";
import prop3 from "@/assets/luxury-property-3.jpg";

/* ─── Data ─── */
const BRAND = "PRESTIGE";
const BRAND_SUB = "REAL ESTATE";

const HERO_SLIDES = [
  { image: heroImg, headline: "OUR PURPOSE, TO ELEVATE\nTHE REAL ESTATE INDUSTRY", sub: "JOIN OUR PATH" },
  { image: prop1, headline: "EXCEPTIONAL HOMES\nFOR EXCEPTIONAL LIVES", sub: "DISCOVER THE COLLECTION" },
  { image: prop2, headline: "WHERE LUXURY\nMEETS THE SEA", sub: "COASTAL LIVING REDEFINED" },
  { image: prop3, headline: "PRIVATE MOUNTAIN\nSANCTUARIES", sub: "NATURE'S GRANDEUR AWAITS" },
];

const PROPERTIES = [
  { image: prop1, name: "The Skyline Penthouse", location: "Manhattan, New York", price: "€12,500,000", beds: 5, baths: 4, sqm: 420, ref: "D4522" },
  { image: prop2, name: "Villa Blanca Sur Mer", location: "Costa Brava, Spain", price: "€8,900,000", beds: 6, baths: 5, sqm: 680, ref: "D3871" },
  { image: prop3, name: "Alpine Glass Retreat", location: "Zermatt, Switzerland", price: "€15,200,000", beds: 7, baths: 6, sqm: 950, ref: "D5104" },
];

const OFF_MARKET = [
  { image: prop3, name: "Sierra Blanca Palace", location: "Marbella Golden Mile", price: "€28,000,000", beds: 9, baths: 10, sqm: 2400, ref: "OM-001" },
  { image: heroImg, name: "La Zagaleta Crown Estate", location: "Benahavís, Málaga", price: "€19,500,000", beds: 8, baths: 7, sqm: 1800, ref: "OM-002" },
  { image: prop1, name: "Cascada de Camoján Villa", location: "Marbella, Málaga", price: "Price on Request", beds: 7, baths: 6, sqm: 1200, ref: "OM-003" },
  { image: prop2, name: "Puente Romano Penthouse", location: "Marbella, Málaga", price: "€14,800,000", beds: 5, baths: 5, sqm: 850, ref: "OM-004" },
];

const SERVICES = [
  { num: "01", title: "Exclusive Access", desc: "Off-market properties and private listings reserved solely for our clientele." },
  { num: "02", title: "Private Office", desc: "Complete confidentiality managed through our dedicated Private Office division." },
  { num: "03", title: "White-Glove Service", desc: "Personal advisors guiding every step with meticulous attention to detail." },
  { num: "04", title: "Expert Negotiation", desc: "Decades securing the finest terms for discerning buyers and sellers." },
];

const BLOG_POSTS = [
  { image: prop2, date: "26 Feb 2026", title: "An Insider's Guide to Mediterranean Coastal Living", excerpt: "The Mediterranean coast has evolved from a seasonal escape into a strategic lifestyle hub..." },
  { image: prop1, date: "25 Feb 2026", title: "Dual Demand Drives Dubai's Ultra-Prime Market Edge", excerpt: "Key insights on the $500K–$1M segment growing 70% year-over-year..." },
  { image: prop3, date: "24 Feb 2026", title: "A Majestic Alpine Estate Near Zermatt", excerpt: "This remarkable historic estate stands as one of Europe's most captivating properties..." },
];

const CONTACT = { email: "hello@prestigeestates.com", phone: "+34 600 000 000", city: "Marbella, Spain" };

const STATS = [
  { value: "347", label: "Properties for Sale" },
  { value: "€2.1B", label: "Portfolio Value" },
  { value: "120+", label: "Off-Market Listings" },
  { value: "25+", label: "Years of Experience" },
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

/* ─── Styles ─── */
const font = {
  brand: "'futura-pt', Helvetica, sans-serif",
  heading: "'futura-pt', Helvetica, sans-serif",
  body: "'futura-pt', Helvetica, sans-serif",
};

const palette = {
  bg: "#F5F2EE",
  bgAlt: "#EBE6DF",
  text: "#1A1714",
  textMuted: "#7A7269",
  textLight: "#A69E94",
  accent: "#96794A",
  accentLight: "#B8986A",
  border: "#DDD6CC",
  white: "#FDFBF8",
  footerBg: "#1A1714",
  offMarketBg: "#2C2824",
  offMarketAccent: "#B8986A",
};

/* ═══════════════════════════════════════════════════════════ */

const Home2LandingPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrolled = useContainerScrolled(containerRef);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setMobileMenuOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const NAV_LINKS = ["HOME", "PROPERTIES", "RENTALS", "ABOUT", "GUIDES & BLOG", "MESSAGE US"];

  return (
    <div ref={containerRef} className="flex-1 overflow-auto relative" style={{ background: palette.bg, color: palette.text, fontFamily: font.body }}>

      {/* ─── NAVBAR — Drumelia style: centered logo, split nav ─── */}
      <nav
        className="sticky top-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? `${palette.white}f0` : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.04)" : "none",
          marginBottom: scrolled ? 0 : "-80px",
        }}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 lg:px-12 h-[80px]">
          {/* Left nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.slice(0, 3).map((l) => (
              <a
                key={l}
                href="#"
                className="text-[11px] tracking-[0.22em] uppercase font-medium transition-colors duration-300 hover:opacity-60"
                style={{ color: scrolled ? palette.text : "#fff", fontFamily: font.body }}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Center logo */}
          <div className="flex flex-col items-center">
            <span
              className="text-[20px] sm:text-[24px] tracking-[0.45em] font-normal transition-colors duration-300"
              style={{ fontFamily: font.brand, color: scrolled ? palette.text : "#fff" }}
            >
              {BRAND}
            </span>
            <span
              className="text-[8px] tracking-[0.5em] uppercase font-medium transition-colors duration-300 -mt-0.5"
              style={{ fontFamily: font.body, color: scrolled ? palette.textLight : "rgba(255,255,255,0.45)" }}
            >
              {BRAND_SUB}
            </span>
          </div>

          {/* Right nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.slice(3).map((l) => (
              <a
                key={l}
                href="#"
                className="text-[11px] tracking-[0.22em] uppercase font-medium transition-colors duration-300 hover:opacity-60"
                style={{ color: scrolled ? palette.text : "#fff", fontFamily: font.body }}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden transition-colors duration-300"
            style={{ color: scrolled ? palette.text : "#fff" }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden animate-in slide-in-from-top-2 duration-200" style={{ background: palette.white, borderTop: `1px solid ${palette.border}` }}>
            <div className="px-6 py-6 flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <a key={l} href="#" className="text-[12px] tracking-[0.2em] uppercase font-medium py-3" style={{ color: palette.text, borderBottom: `1px solid ${palette.border}30` }}>{l}</a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ─── HERO — Full screen, Drumelia style ─── */}
      <section className="relative h-[70vh] sm:h-[80vh] lg:h-[100vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {HERO_SLIDES.map((slide, i) => (
          <div key={i} className="absolute inset-0 transition-opacity duration-[2s] ease-in-out" style={{ opacity: currentSlide === i ? 1 : 0 }}>
            <img src={slide.image} alt="" className="w-full h-full object-cover" style={{ transform: currentSlide === i ? "scale(1.04)" : "scale(1)", transition: "transform 8s ease-out" }} />
          </div>
        ))}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,23,20,0.55) 0%, rgba(26,23,20,0.15) 40%, rgba(26,23,20,0.25) 100%)" }} />

        {/* Centered hero text — Drumelia style */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <FadeIn>
            <h1
              className="text-xl sm:text-2xl md:text-4xl lg:text-[2.75rem] font-normal leading-[1.35] mb-4 sm:mb-5 whitespace-pre-line"
              style={{ color: "#fff", fontFamily: font.heading, letterSpacing: "0.08em" }}
            >
              {HERO_SLIDES[currentSlide].headline}
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-[13px] sm:text-[14px] tracking-[0.3em] uppercase font-light mb-8 sm:mb-10" style={{ color: "rgba(255,255,255,0.5)", fontFamily: font.body }}>
              {HERO_SLIDES[currentSlide].sub}
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="text-[12px] tracking-[0.25em] uppercase font-medium px-10 py-4 transition-all duration-300 hover:opacity-90 min-w-[220px]"
                style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(8px)" }}
              >
                All Properties
              </button>
              <button
                className="text-[12px] tracking-[0.25em] uppercase font-medium px-10 py-4 transition-all duration-300 hover:opacity-90 min-w-[220px]"
                style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(8px)" }}
              >
                Sell With Us
              </button>
            </div>
          </FadeIn>
        </div>

        {/* Ref bottom left */}
        <div className="absolute bottom-6 left-6 lg:left-12 z-10">
          <span className="text-[10px] tracking-wider font-light" style={{ color: "rgba(255,255,255,0.3)" }}>Ref: D4522</span>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-6 sm:bottom-8 right-6 lg:right-12 flex gap-2.5 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className="transition-all duration-500" style={{ width: currentSlide === i ? 36 : 18, height: 2, borderRadius: 1, background: currentSlide === i ? "#fff" : "rgba(255,255,255,0.25)" }} />
          ))}
        </div>
      </section>

      {/* ─── INTRO ─── */}
      <section className="py-16 md:py-24" style={{ background: palette.white }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
            <FadeIn className="md:col-span-4">
              <p className="text-[10px] tracking-[0.35em] uppercase mb-3 font-medium" style={{ color: palette.accent }}>About Us</p>
              <h2 className="text-2xl md:text-3xl font-normal leading-[1.2]" style={{ fontFamily: font.heading, letterSpacing: "0.02em" }}>
                A Legacy of Excellence
              </h2>
            </FadeIn>
            <FadeIn className="md:col-span-8" delay={0.1}>
              <p className="text-[14px] leading-[1.9] font-light" style={{ color: palette.textMuted }}>
                Prestige Estates is a curated luxury real estate advisory specialising in the most exclusive properties across the Mediterranean. From breathtaking seafront villas and penthouses to prestigious golf-side estates and new-build residences, we offer a bespoke service built on trust, discretion, and an uncompromising eye for quality.
              </p>
              <div className="mt-6 h-[1px]" style={{ background: `linear-gradient(to right, ${palette.accent}40, transparent)` }} />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-14 md:py-18" style={{ background: palette.bgAlt }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {STATS.map((s, i) => (
                <div key={i}>
                  <p className="text-3xl md:text-[2.75rem] font-normal" style={{ fontFamily: font.heading, color: palette.accent, letterSpacing: "0.02em" }}>{s.value}</p>
                  <p className="text-[10px] tracking-[0.18em] uppercase mt-2 font-medium" style={{ color: palette.textLight }}>{s.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── FEATURED PROPERTIES ─── */}
      <section className="py-16 md:py-24" style={{ background: palette.white }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <FadeIn>
            <div className="flex items-end justify-between mb-10 sm:mb-14">
              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase mb-2 font-medium" style={{ color: palette.accent }}>Portfolio</p>
                <h2 className="text-2xl md:text-4xl font-normal" style={{ fontFamily: font.heading, letterSpacing: "0.02em" }}>Featured Properties</h2>
              </div>
              <a href="#" className="hidden sm:flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase font-medium transition-opacity hover:opacity-60" style={{ color: palette.accent }}>
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {PROPERTIES.map((p, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden aspect-[4/5]" style={{ borderRadius: 2 }}>
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1s] group-hover:scale-105" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center" style={{ background: "rgba(26,23,20,0.35)" }}>
                      <span className="text-[11px] tracking-[0.25em] uppercase text-white border border-white/40 px-6 py-3 backdrop-blur-sm font-medium">View Details</span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[9px] tracking-wider font-light px-2 py-1" style={{ background: "rgba(0,0,0,0.4)", color: "rgba(255,255,255,0.6)", backdropFilter: "blur(4px)" }}>Ref: {p.ref}</span>
                    </div>
                  </div>
                  <div className="pt-4 space-y-1.5">
                    <p className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: palette.textLight }}>{p.location}</p>
                    <h3 className="text-[17px] font-normal" style={{ fontFamily: font.heading, letterSpacing: "0.01em" }}>{p.name}</h3>
                    <p className="text-[15px] font-medium" style={{ color: palette.accent }}>{p.price}</p>
                    <div className="flex items-center gap-4 pt-1 text-[11px] font-light" style={{ color: palette.textMuted }}>
                      <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {p.beds}</span>
                      <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {p.baths}</span>
                      <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> {p.sqm} m²</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ OFF-MARKET SECTION ═══ */}
      <section className="py-20 md:py-28" style={{ background: palette.offMarketBg }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <FadeIn>
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 sm:mb-16 gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <Shield className="w-4 h-4" style={{ color: palette.offMarketAccent }} />
                  <p className="text-[10px] tracking-[0.4em] uppercase font-medium" style={{ color: palette.offMarketAccent }}>Private & Confidential</p>
                </div>
                <h2 className="text-3xl md:text-5xl font-normal leading-[1.15]" style={{ fontFamily: font.heading, color: "#fff", letterSpacing: "0.03em" }}>
                  Off-Market<br />Collection
                </h2>
                <p className="text-[13px] leading-[1.8] font-light mt-4 max-w-lg" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Exclusive properties available only through our private network. These listings are not advertised publicly — access is reserved for qualified buyers.
                </p>
              </div>
              <a href="#" className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-medium transition-opacity hover:opacity-70 shrink-0 px-6 py-3" style={{ color: palette.offMarketAccent, border: `1px solid ${palette.offMarketAccent}40` }}>
                <Lock className="w-3.5 h-3.5" />
                Request Access
              </a>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {OFF_MARKET.map((p, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden aspect-[3/4]" style={{ borderRadius: 2 }}>
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1s] group-hover:scale-105" />
                    {/* Off-market overlay */}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(30,42,30,0.8) 0%, rgba(30,42,30,0) 50%)" }} />
                    {/* Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5" style={{ background: "rgba(30,42,30,0.75)", backdropFilter: "blur(8px)", borderRadius: 2 }}>
                      <EyeOff className="w-3 h-3" style={{ color: palette.offMarketAccent }} />
                      <span className="text-[9px] tracking-[0.2em] uppercase font-medium" style={{ color: palette.offMarketAccent }}>Off-Market</span>
                    </div>
                    {/* Ref */}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[9px] tracking-wider font-light" style={{ color: "rgba(255,255,255,0.4)" }}>Ref: {p.ref}</span>
                    </div>
                    {/* Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center" style={{ background: "rgba(30,42,30,0.5)" }}>
                      <span className="text-[10px] tracking-[0.25em] uppercase text-white border border-white/30 px-5 py-2.5 backdrop-blur-sm font-medium flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5" /> Private Viewing
                      </span>
                    </div>
                  </div>
                  <div className="pt-3.5 space-y-1">
                    <p className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>{p.location}</p>
                    <h3 className="text-[15px] font-normal" style={{ fontFamily: font.heading, color: "#fff", letterSpacing: "0.01em" }}>{p.name}</h3>
                    <p className="text-[14px] font-medium" style={{ color: palette.offMarketAccent }}>{p.price}</p>
                    <div className="flex items-center gap-3.5 pt-1 text-[10px] font-light" style={{ color: "rgba(255,255,255,0.3)" }}>
                      <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {p.beds}</span>
                      <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {p.baths}</span>
                      <span className="flex items-center gap-1"><Maximize className="w-3 h-3" /> {p.sqm} m²</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Off-market CTA bar */}
          <FadeIn delay={0.4}>
            <div className="mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-[12px] font-light" style={{ color: "rgba(255,255,255,0.3)" }}>
                <span style={{ color: palette.offMarketAccent }} className="font-medium">120+</span> off-market properties currently available through our private network
              </p>
              <a href="#" className="flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase font-medium transition-opacity hover:opacity-60" style={{ color: palette.offMarketAccent }}>
                Learn More <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section className="py-16 md:py-24" style={{ background: palette.bg }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-[10px] tracking-[0.35em] uppercase mb-3 font-medium" style={{ color: palette.accent }}>Why Choose Us</p>
              <h2 className="text-2xl md:text-4xl font-normal" style={{ fontFamily: font.heading, letterSpacing: "0.02em" }}>A Standard Apart</h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: palette.border }}>
            {SERVICES.map((s, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="p-8 md:p-10 group transition-colors duration-500 hover:bg-white/80" style={{ background: palette.white }}>
                  <span className="text-[11px] font-medium tracking-wider block mb-4" style={{ color: palette.accent }}>{s.num}</span>
                  <h3 className="text-[18px] font-normal mb-3" style={{ fontFamily: font.heading }}>{s.title}</h3>
                  <p className="text-[13px] leading-[1.8] font-light" style={{ color: palette.textMuted }}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── JOURNAL / BLOG ─── */}
      <section className="py-16 md:py-24" style={{ background: palette.white }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <FadeIn>
            <div className="flex items-end justify-between mb-10 sm:mb-14">
              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase mb-2 font-medium" style={{ color: palette.accent }}>Insights</p>
                <h2 className="text-2xl md:text-4xl font-normal" style={{ fontFamily: font.heading, letterSpacing: "0.02em" }}>The Journal</h2>
              </div>
              <a href="#" className="hidden sm:flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase font-medium transition-opacity hover:opacity-60" style={{ color: palette.accent }}>
                All Articles <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {BLOG_POSTS.map((post, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <a href="#" className="group block">
                  <div className="overflow-hidden aspect-[3/2]" style={{ borderRadius: 2 }}>
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="pt-4 space-y-2">
                    <span className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: palette.textLight }}>{post.date}</span>
                    <h4 className="text-[16px] font-normal leading-[1.35] group-hover:opacity-70 transition-opacity" style={{ fontFamily: font.heading }}>{post.title}</h4>
                    <p className="text-[12px] leading-[1.7] font-light line-clamp-2" style={{ color: palette.textMuted }}>{post.excerpt}</p>
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="py-16 md:py-24" style={{ background: palette.bgAlt }}>
        <div className="max-w-xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[10px] tracking-[0.35em] uppercase mb-3 font-medium" style={{ color: palette.accent }}>Stay Informed</p>
            <h2 className="text-2xl md:text-3xl font-normal mb-3" style={{ fontFamily: font.heading, letterSpacing: "0.02em" }}>The Private List</h2>
            <p className="text-[13px] font-light mb-8 leading-relaxed" style={{ color: palette.textMuted }}>
              Receive exclusive off-market listings, market insights and invitations to private viewings — delivered discreetly to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3.5 text-[13px] focus:outline-none transition-colors duration-300"
                style={{ border: `1px solid ${palette.border}`, background: palette.white, color: palette.text, fontFamily: font.body }}
              />
              <button
                type="submit"
                className="text-[11px] tracking-[0.2em] uppercase font-medium px-8 py-3.5 transition-all duration-300 hover:opacity-90 whitespace-nowrap"
                style={{ background: palette.accent, color: "#fff" }}
              >
                Subscribe
              </button>
            </form>
            <p className="text-[10px] mt-4 font-light" style={{ color: palette.textLight }}>We respect your privacy. Unsubscribe at any time.</p>
          </FadeIn>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: palette.footerBg }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
            <div>
              <span className="text-[18px] tracking-[0.4em] font-normal block mb-1" style={{ fontFamily: font.brand, color: "#fff" }}>{BRAND}</span>
              <span className="text-[7px] tracking-[0.5em] uppercase font-medium block mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>{BRAND_SUB}</span>
              <p className="text-[12px] leading-relaxed font-light" style={{ color: "rgba(255,255,255,0.25)" }}>
                Curating extraordinary homes for exceptional lives since 2010.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Quick Links</h4>
              <ul className="space-y-2.5">
                {["Properties", "Off-Market", "Services", "About Us", "Contact"].map((l) => (
                  <li key={l}><a href="#" className="text-[12px] font-light transition-colors duration-300 hover:text-white/50" style={{ color: "rgba(255,255,255,0.2)" }}>{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Contact</h4>
              <ul className="space-y-2.5 text-[12px] font-light" style={{ color: "rgba(255,255,255,0.2)" }}>
                <li>{CONTACT.email}</li>
                <li>{CONTACT.phone}</li>
                <li>{CONTACT.city}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Follow</h4>
              <div className="flex gap-3">
                {[Instagram, Linkedin, MessageCircle].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 flex items-center justify-center transition-all duration-300 hover:border-white/20" style={{ border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.2)" }}>
                    <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 pt-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <p className="text-[10px] tracking-[0.2em] font-light" style={{ color: "rgba(255,255,255,0.12)" }}>© 2026 {BRAND}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home2LandingPage;
