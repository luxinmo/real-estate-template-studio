import { useState, useEffect, useRef } from "react";
import { Bed, Bath, Maximize, ArrowRight, ArrowUpRight, Instagram, Linkedin, MessageCircle, Lock, Eye, EyeOff, Shield, Play, Quote, MapPin } from "lucide-react";
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
  { num: "01", title: "Exclusive Access", desc: "Off-market properties and private listings reserved solely for our clientele.", icon: Lock },
  { num: "02", title: "Private Office", desc: "Complete confidentiality managed through our dedicated Private Office division.", icon: Shield },
  { num: "03", title: "White-Glove Service", desc: "Personal advisors guiding every step with meticulous attention to detail.", icon: Eye },
  { num: "04", title: "Expert Negotiation", desc: "Decades securing the finest terms for discerning buyers and sellers.", icon: ArrowUpRight },
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
  { value: "25", label: "Years of Experience" },
];

const TESTIMONIALS = [
  { quote: "Prestige made our dream of owning a Mediterranean villa a seamless, unforgettable experience.", author: "James & Victoria H.", location: "London, UK" },
  { quote: "Their discretion and expertise in off-market deals is unmatched in the industry.", author: "Ahmad Al-Rashid", location: "Dubai, UAE" },
  { quote: "From the first viewing to the final signature, every detail was handled with absolute precision.", author: "Sophie Müller", location: "Zürich, Switzerland" },
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

/* ─── Styles — Jost (Futura alternative) ─── */
const font = {
  brand: "'Jost', Helvetica, sans-serif",
  heading: "'Jost', Helvetica, sans-serif",
  body: "'Jost', Helvetica, sans-serif",
};

const palette = {
  bg: "#F5F2EE",
  bgAlt: "#EDE8E1",
  text: "#1A1714",
  textMuted: "#7A7269",
  textLight: "#A69E94",
  accent: "#96794A",
  accentLight: "#B8986A",
  border: "#DDD6CC",
  white: "#FDFBF8",
  footerBg: "#1A1714",
  offMarketBg: "#2C2824",
  offMarketAccent: "#C4A265",
};

/* ═══════════════════════════════════════════════════════════ */

const Home2LandingPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrolled = useContainerScrolled(containerRef);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial((p) => (p + 1) % TESTIMONIALS.length), 5000);
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

      {/* ─── NAVBAR — Centered logo, split nav ─── */}
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
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.slice(0, 3).map((l) => (
              <a key={l} href="#" className="text-[11px] tracking-[0.22em] uppercase font-light transition-colors duration-300 hover:opacity-60" style={{ color: scrolled ? palette.text : "#fff" }}>{l}</a>
            ))}
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[22px] sm:text-[26px] tracking-[0.5em] font-light transition-colors duration-300" style={{ fontFamily: font.brand, color: scrolled ? palette.text : "#fff" }}>
              {BRAND}
            </span>
            <span className="text-[7px] tracking-[0.55em] uppercase font-light transition-colors duration-300 -mt-0.5" style={{ color: scrolled ? palette.textLight : "rgba(255,255,255,0.4)" }}>
              {BRAND_SUB}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.slice(3).map((l) => (
              <a key={l} href="#" className="text-[11px] tracking-[0.22em] uppercase font-light transition-colors duration-300 hover:opacity-60" style={{ color: scrolled ? palette.text : "#fff" }}>{l}</a>
            ))}
          </div>

          <button className="lg:hidden transition-colors duration-300" style={{ color: scrolled ? palette.text : "#fff" }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden animate-in slide-in-from-top-2 duration-200" style={{ background: palette.white, borderTop: `1px solid ${palette.border}` }}>
            <div className="px-6 py-6 flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <a key={l} href="#" className="text-[12px] tracking-[0.2em] uppercase font-light py-3" style={{ color: palette.text, borderBottom: `1px solid ${palette.border}30` }}>{l}</a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ─── HERO — Full screen ─── */}
      <section className="relative h-[70vh] sm:h-[80vh] lg:h-[100vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {HERO_SLIDES.map((slide, i) => (
          <div key={i} className="absolute inset-0 transition-opacity duration-[2s] ease-in-out" style={{ opacity: currentSlide === i ? 1 : 0 }}>
            <img src={slide.image} alt="" className="w-full h-full object-cover" style={{ transform: currentSlide === i ? "scale(1.04)" : "scale(1)", transition: "transform 8s ease-out" }} />
          </div>
        ))}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,23,20,0.55) 0%, rgba(26,23,20,0.1) 40%, rgba(26,23,20,0.2) 100%)" }} />

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <FadeIn>
            <h1 className="text-xl sm:text-2xl md:text-[2.2rem] lg:text-[2.75rem] font-extralight leading-[1.35] mb-4 sm:mb-5 whitespace-pre-line" style={{ color: "#fff", fontFamily: font.heading, letterSpacing: "0.12em" }}>
              {HERO_SLIDES[currentSlide].headline}
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-[12px] sm:text-[13px] tracking-[0.35em] uppercase font-extralight mb-8 sm:mb-10" style={{ color: "rgba(255,255,255,0.45)" }}>
              {HERO_SLIDES[currentSlide].sub}
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="text-[11px] tracking-[0.3em] uppercase font-light px-10 py-4 transition-all duration-500 hover:bg-white hover:text-[#1A1714] min-w-[220px]" style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.35)" }}>
                All Properties
              </button>
              <button className="text-[11px] tracking-[0.3em] uppercase font-light px-10 py-4 transition-all duration-500 hover:bg-white hover:text-[#1A1714] min-w-[220px]" style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.35)" }}>
                Sell With Us
              </button>
            </div>
          </FadeIn>
        </div>

        <div className="absolute bottom-6 left-6 lg:left-12 z-10">
          <span className="text-[10px] tracking-[0.15em] font-extralight" style={{ color: "rgba(255,255,255,0.25)" }}>Ref: D4522</span>
        </div>
        <div className="absolute bottom-6 sm:bottom-8 right-6 lg:right-12 flex gap-2.5 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className="transition-all duration-500" style={{ width: currentSlide === i ? 36 : 18, height: 2, borderRadius: 1, background: currentSlide === i ? "#fff" : "rgba(255,255,255,0.2)" }} />
          ))}
        </div>
      </section>

      {/* ─── INTRO — Asymmetric editorial ─── */}
      <section className="py-20 md:py-32" style={{ background: palette.white }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-start">
            <FadeIn className="md:col-span-5">
              <p className="text-[10px] tracking-[0.4em] uppercase mb-4 font-normal" style={{ color: palette.accent }}>About Us</p>
              <h2 className="text-3xl md:text-[2.5rem] font-extralight leading-[1.15]" style={{ fontFamily: font.heading, letterSpacing: "0.04em" }}>
                A Legacy of<br />Excellence
              </h2>
              <div className="mt-6 w-12 h-[1px]" style={{ background: palette.accent }} />
            </FadeIn>
            <FadeIn className="md:col-span-7" delay={0.12}>
              <p className="text-[14px] leading-[2] font-light" style={{ color: palette.textMuted }}>
                Prestige Estates is a curated luxury real estate advisory specialising in the most exclusive properties across the Mediterranean. From breathtaking seafront villas and penthouses to prestigious golf-side estates and new-build residences, we offer a bespoke service built on trust, discretion, and an uncompromising eye for quality.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ border: `1px solid ${palette.accent}40` }}>
                  <Play className="w-3.5 h-3.5 ml-0.5" style={{ color: palette.accent }} />
                </div>
                <span className="text-[11px] tracking-[0.15em] uppercase font-light" style={{ color: palette.accent }}>Watch Our Story</span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── STATS — Refined with thin separators ─── */}
      <section className="py-16 md:py-20" style={{ background: palette.bgAlt }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
              {STATS.map((s, i) => (
                <div key={i} className="text-center py-6 md:py-0" style={{ borderRight: i < 3 ? `1px solid ${palette.border}` : "none" }}>
                  <p className="text-4xl md:text-[3.5rem] font-extralight" style={{ fontFamily: font.heading, color: palette.accent, letterSpacing: "0.04em" }}>{s.value}</p>
                  <p className="text-[9px] tracking-[0.25em] uppercase mt-3 font-normal" style={{ color: palette.textLight }}>{s.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── FEATURED PROPERTIES — Elegant cards ─── */}
      <section className="py-20 md:py-28" style={{ background: palette.white }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <FadeIn>
            <div className="flex items-end justify-between mb-12 sm:mb-16">
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase mb-3 font-normal" style={{ color: palette.accent }}>Portfolio</p>
                <h2 className="text-3xl md:text-[2.5rem] font-extralight" style={{ fontFamily: font.heading, letterSpacing: "0.04em" }}>Featured Properties</h2>
              </div>
              <a href="#" className="hidden sm:flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-light transition-opacity hover:opacity-60" style={{ color: palette.accent }}>
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {PROPERTIES.map((p, i) => (
              <FadeIn key={i} delay={i * 0.12}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden aspect-[3/4]" style={{ borderRadius: 0 }}>
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.06]" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center" style={{ background: "rgba(26,23,20,0.3)" }}>
                      <span className="text-[10px] tracking-[0.3em] uppercase text-white border border-white/35 px-7 py-3 font-light">View Property</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: "linear-gradient(to top, rgba(26,23,20,0.6) 0%, transparent 100%)" }}>
                      <span className="text-[9px] tracking-[0.2em] font-light" style={{ color: "rgba(255,255,255,0.5)" }}>Ref: {p.ref}</span>
                    </div>
                  </div>
                  <div className="pt-5 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" style={{ color: palette.textLight }} />
                      <p className="text-[10px] tracking-[0.2em] uppercase font-light" style={{ color: palette.textLight }}>{p.location}</p>
                    </div>
                    <h3 className="text-[18px] font-light tracking-wide" style={{ fontFamily: font.heading }}>{p.name}</h3>
                    <p className="text-[16px] font-normal" style={{ color: palette.accent }}>{p.price}</p>
                    <div className="flex items-center gap-5 pt-1.5 text-[11px] font-extralight" style={{ color: palette.textMuted }}>
                      <span className="flex items-center gap-1.5"><Bed className="w-3.5 h-3.5" /> {p.beds} Beds</span>
                      <span className="flex items-center gap-1.5"><Bath className="w-3.5 h-3.5" /> {p.baths} Baths</span>
                      <span className="flex items-center gap-1.5"><Maximize className="w-3.5 h-3.5" /> {p.sqm} m²</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CINEMATIC QUOTE BREAK ═══ */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <img src={prop2} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(26,23,20,0.55)" }} />
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <FadeIn>
            <Quote className="w-8 h-8 mx-auto mb-6" style={{ color: "rgba(255,255,255,0.15)" }} strokeWidth={1} />
            <p className="text-[18px] sm:text-[22px] md:text-[26px] font-extralight leading-[1.5] italic" style={{ color: "#fff", fontFamily: font.heading, letterSpacing: "0.03em" }}>
              "{TESTIMONIALS[activeTestimonial].quote}"
            </p>
            <div className="mt-6 flex flex-col items-center gap-1">
              <span className="text-[11px] tracking-[0.2em] uppercase font-light" style={{ color: "rgba(255,255,255,0.6)" }}>{TESTIMONIALS[activeTestimonial].author}</span>
              <span className="text-[10px] tracking-[0.15em] font-extralight" style={{ color: "rgba(255,255,255,0.3)" }}>{TESTIMONIALS[activeTestimonial].location}</span>
            </div>
            <div className="flex gap-2 justify-center mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)} className="transition-all duration-500" style={{ width: i === activeTestimonial ? 24 : 8, height: 2, borderRadius: 1, background: i === activeTestimonial ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)" }} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ OFF-MARKET COLLECTION ═══ */}
      <section className="py-20 md:py-28" style={{ background: palette.offMarketBg }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <FadeIn>
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-14 sm:mb-18 gap-6">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-5 h-[1px]" style={{ background: palette.offMarketAccent }} />
                  <p className="text-[10px] tracking-[0.4em] uppercase font-normal" style={{ color: palette.offMarketAccent }}>Private & Confidential</p>
                </div>
                <h2 className="text-3xl md:text-[3rem] font-extralight leading-[1.1]" style={{ fontFamily: font.heading, color: "#fff", letterSpacing: "0.06em" }}>
                  Off-Market<br />Collection
                </h2>
                <p className="text-[13px] leading-[1.9] font-extralight mt-5 max-w-lg" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Exclusive properties available only through our private network. These listings are not advertised publicly — access is reserved for qualified buyers.
                </p>
              </div>
              <a href="#" className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase font-light transition-all duration-300 hover:bg-white/5 shrink-0 px-7 py-3.5" style={{ color: palette.offMarketAccent, border: `1px solid ${palette.offMarketAccent}35` }}>
                <Lock className="w-3.5 h-3.5" />
                Request Access
              </a>
            </div>
          </FadeIn>

          {/* Off-market: 2 large + 2 small layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6">
            {OFF_MARKET.map((p, i) => {
              const isLarge = i < 2;
              return (
                <FadeIn key={i} delay={i * 0.08} className={isLarge ? "md:col-span-6" : "md:col-span-6"}>
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden" style={{ borderRadius: 0, aspectRatio: isLarge ? "16/10" : "16/10" }}>
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.05]" />
                      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(44,40,36,0.7) 0%, rgba(44,40,36,0) 55%)" }} />
                      {/* Badge */}
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5" style={{ background: "rgba(44,40,36,0.6)", backdropFilter: "blur(12px)" }}>
                        <EyeOff className="w-3 h-3" style={{ color: palette.offMarketAccent }} />
                        <span className="text-[8px] tracking-[0.25em] uppercase font-normal" style={{ color: palette.offMarketAccent }}>Off-Market</span>
                      </div>
                      {/* Bottom info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <p className="text-[9px] tracking-[0.2em] uppercase font-light mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>{p.location}</p>
                        <h3 className={`${isLarge ? "text-[20px]" : "text-[17px]"} font-light tracking-wide text-white`} style={{ fontFamily: font.heading }}>{p.name}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <p className={`${isLarge ? "text-[17px]" : "text-[15px]"} font-normal`} style={{ color: palette.offMarketAccent }}>{p.price}</p>
                          <div className="flex items-center gap-3 text-[10px] font-extralight" style={{ color: "rgba(255,255,255,0.35)" }}>
                            <span>{p.beds} Beds</span>
                            <span>{p.baths} Baths</span>
                            <span>{p.sqm} m²</span>
                          </div>
                        </div>
                      </div>
                      {/* Hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-600 flex items-center justify-center" style={{ background: "rgba(44,40,36,0.4)" }}>
                        <span className="text-[10px] tracking-[0.3em] uppercase text-white border border-white/25 px-6 py-3 font-light flex items-center gap-2">
                          <Eye className="w-3.5 h-3.5" /> Private Viewing
                        </span>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn delay={0.4}>
            <div className="mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-[12px] font-extralight" style={{ color: "rgba(255,255,255,0.3)" }}>
                <span style={{ color: palette.offMarketAccent }} className="font-normal">120+</span> off-market properties currently available through our private network
              </p>
              <a href="#" className="flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase font-light transition-opacity hover:opacity-60" style={{ color: palette.offMarketAccent }}>
                Learn More <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── SERVICES — Horizontal scroll cards ─── */}
      <section className="py-20 md:py-28" style={{ background: palette.white }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="text-[10px] tracking-[0.4em] uppercase mb-3 font-normal" style={{ color: palette.accent }}>Why Choose Us</p>
              <h2 className="text-3xl md:text-[2.5rem] font-extralight" style={{ fontFamily: font.heading, letterSpacing: "0.04em" }}>A Standard Apart</h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {SERVICES.map((s, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="p-8 md:p-8 group transition-all duration-500 text-center" style={{ borderRight: i < 3 ? `1px solid ${palette.border}` : "none" }}>
                  <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-5 transition-colors duration-500 group-hover:bg-[#96794A10]" style={{ border: `1px solid ${palette.border}` }}>
                    <s.icon className="w-4.5 h-4.5" style={{ color: palette.accent }} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-normal tracking-[0.2em] block mb-3" style={{ color: palette.accent }}>{s.num}</span>
                  <h3 className="text-[16px] font-light mb-3 tracking-wide" style={{ fontFamily: font.heading }}>{s.title}</h3>
                  <p className="text-[12px] leading-[1.8] font-extralight" style={{ color: palette.textMuted }}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── JOURNAL — Blog grid ─── */}
      <section className="py-20 md:py-28" style={{ background: palette.bg }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <FadeIn>
            <div className="flex items-end justify-between mb-12 sm:mb-16">
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase mb-3 font-normal" style={{ color: palette.accent }}>Insights</p>
                <h2 className="text-3xl md:text-[2.5rem] font-extralight" style={{ fontFamily: font.heading, letterSpacing: "0.04em" }}>The Journal</h2>
              </div>
              <a href="#" className="hidden sm:flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-light transition-opacity hover:opacity-60" style={{ color: palette.accent }}>
                All Articles <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </FadeIn>

          {/* Editorial layout: 1 large + 2 stacked */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
            <FadeIn className="md:col-span-7">
              <a href="#" className="group block">
                <div className="overflow-hidden aspect-[16/10]">
                  <img src={BLOG_POSTS[0].image} alt={BLOG_POSTS[0].title} className="w-full h-full object-cover transition-transform duration-[1s] group-hover:scale-105" />
                </div>
                <div className="pt-5 space-y-2">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-light" style={{ color: palette.textLight }}>{BLOG_POSTS[0].date}</span>
                  <h4 className="text-[20px] font-light leading-[1.35] group-hover:opacity-70 transition-opacity tracking-wide" style={{ fontFamily: font.heading }}>{BLOG_POSTS[0].title}</h4>
                  <p className="text-[13px] leading-[1.7] font-extralight" style={{ color: palette.textMuted }}>{BLOG_POSTS[0].excerpt}</p>
                </div>
              </a>
            </FadeIn>
            <div className="md:col-span-5 flex flex-col gap-6 lg:gap-8">
              {BLOG_POSTS.slice(1).map((post, i) => (
                <FadeIn key={i} delay={0.1 + i * 0.1}>
                  <a href="#" className="group flex gap-4">
                    <div className="overflow-hidden aspect-square w-28 shrink-0">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[9px] tracking-[0.2em] uppercase font-light" style={{ color: palette.textLight }}>{post.date}</span>
                      <h4 className="text-[14px] font-light leading-[1.4] group-hover:opacity-70 transition-opacity" style={{ fontFamily: font.heading }}>{post.title}</h4>
                      <p className="text-[11px] leading-[1.6] font-extralight line-clamp-2" style={{ color: palette.textMuted }}>{post.excerpt}</p>
                    </div>
                  </a>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER — Elegant centered ─── */}
      <section className="py-20 md:py-28" style={{ background: palette.bgAlt }}>
        <div className="max-w-xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[10px] tracking-[0.4em] uppercase mb-4 font-normal" style={{ color: palette.accent }}>Stay Informed</p>
            <h2 className="text-2xl md:text-[2rem] font-extralight mb-3" style={{ fontFamily: font.heading, letterSpacing: "0.04em" }}>The Private List</h2>
            <p className="text-[13px] font-extralight mb-8 leading-relaxed" style={{ color: palette.textMuted }}>
              Receive exclusive off-market listings, market insights and invitations to private viewings — delivered discreetly to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-5 py-4 text-[12px] tracking-[0.1em] focus:outline-none transition-colors duration-300"
                style={{ border: `1px solid ${palette.border}`, background: palette.white, color: palette.text, fontFamily: font.body }}
              />
              <button type="submit" className="text-[10px] tracking-[0.25em] uppercase font-normal px-8 py-4 transition-all duration-300 hover:opacity-90 whitespace-nowrap" style={{ background: palette.accent, color: "#fff" }}>
                Subscribe
              </button>
            </form>
            <p className="text-[10px] mt-4 font-extralight" style={{ color: palette.textLight }}>We respect your privacy. Unsubscribe at any time.</p>
          </FadeIn>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: palette.footerBg }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
            <div>
              <span className="text-[20px] tracking-[0.5em] font-extralight block mb-1" style={{ fontFamily: font.brand, color: "#fff" }}>{BRAND}</span>
              <span className="text-[7px] tracking-[0.55em] uppercase font-light block mb-4" style={{ color: "rgba(255,255,255,0.2)" }}>{BRAND_SUB}</span>
              <p className="text-[12px] leading-relaxed font-extralight" style={{ color: "rgba(255,255,255,0.2)" }}>
                Curating extraordinary homes for exceptional lives since 2010.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase mb-5 font-normal" style={{ color: "rgba(255,255,255,0.25)" }}>Quick Links</h4>
              <ul className="space-y-3">
                {["Properties", "Off-Market", "Services", "About Us", "Contact"].map((l) => (
                  <li key={l}><a href="#" className="text-[12px] font-extralight transition-colors duration-300 hover:text-white/45" style={{ color: "rgba(255,255,255,0.18)" }}>{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase mb-5 font-normal" style={{ color: "rgba(255,255,255,0.25)" }}>Contact</h4>
              <ul className="space-y-3 text-[12px] font-extralight" style={{ color: "rgba(255,255,255,0.18)" }}>
                <li>{CONTACT.email}</li>
                <li>{CONTACT.phone}</li>
                <li>{CONTACT.city}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase mb-5 font-normal" style={{ color: "rgba(255,255,255,0.25)" }}>Follow</h4>
              <div className="flex gap-3">
                {[Instagram, Linkedin, MessageCircle].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 flex items-center justify-center transition-all duration-300 hover:border-white/15" style={{ border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.18)" }}>
                    <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-14 pt-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <p className="text-[10px] tracking-[0.2em] font-extralight" style={{ color: "rgba(255,255,255,0.1)" }}>© 2026 {BRAND}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home2LandingPage;