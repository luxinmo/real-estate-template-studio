import { useState, useEffect, useRef } from "react";
import { Bed, Bath, Maximize, ChevronDown, Instagram, Linkedin, MessageCircle, Shield, Star, Handshake, Lock, ArrowRight } from "lucide-react";
import heroImg from "@/assets/luxury-hero.jpg";
import prop1 from "@/assets/luxury-property-1.jpg";
import prop2 from "@/assets/luxury-property-2.jpg";
import prop3 from "@/assets/luxury-property-3.jpg";

/* ─── Placeholder content ─── */
const BRAND_NAME = "PRESTIGE ESTATES";
const NAV_LEFT = ["Home", "Properties", "Rentals"];
const NAV_RIGHT = ["About", "Guides & Blog", "Message Us"];

const INTRO_TITLE = "Villa George — Contemporary Villa with Sea Views in Sierra Blanca, Marbella";
const INTRO_TEXT = "Prestige Estates is a curated luxury real estate advisory dedicated to connecting discerning clients with the world's most extraordinary properties. From sun-drenched Mediterranean villas to iconic Manhattan penthouses, we offer a bespoke service built on trust, discretion, and an uncompromising eye for quality. Every home in our portfolio is handpicked, every client relationship is personal, and every transaction is handled with the care it deserves.";

const PROPERTIES = [
  { image: prop1, name: "The Skyline Penthouse", location: "Manhattan, New York", price: "€12,500,000", beds: 5, baths: 4, sqm: 420 },
  { image: prop2, name: "Villa Blanca Sur Mer", location: "Costa Brava, Spain", price: "€8,900,000", beds: 6, baths: 5, sqm: 680 },
  { image: prop3, name: "Alpine Glass Retreat", location: "Zermatt, Switzerland", price: "€15,200,000", beds: 7, baths: 6, sqm: 950 },
];

const SERVICES = [
  { icon: Star, title: "Exclusive Listings", desc: "Access to off-market properties and pre-launch opportunities reserved for our clients." },
  { icon: Handshake, title: "White-Glove Service", desc: "Dedicated advisors guiding you through every step with unmatched attention to detail." },
  { icon: Shield, title: "Expert Negotiation", desc: "Decades of experience securing the finest terms for discerning buyers and sellers." },
  { icon: Lock, title: "Discreet & Private", desc: "Your privacy is paramount. Every transaction handled with absolute confidentiality." },
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

/* ─── Hooks ─── */
function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
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
  const scrolled = useScrolled();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 overflow-auto bg-white text-luxury-black font-sans">

      {/* ─── NAVBAR ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100" : "bg-transparent"}`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-10 h-[72px]">
          {/* Globe icon */}
          <div className="hidden md:flex items-center">
            <button className={`transition-colors duration-300 ${scrolled ? "text-luxury-black/60 hover:text-luxury-black" : "text-white/60 hover:text-white"}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
            </button>
          </div>

          {/* Left nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LEFT.map((l) => (
              <a key={l} href="#" className={`text-[11px] tracking-[0.18em] uppercase font-medium transition-colors duration-300 ${scrolled ? "text-luxury-black/70 hover:text-luxury-black" : "text-white/80 hover:text-white"}`}>{l}</a>
            ))}
          </div>

          {/* Center logo */}
          <div className="flex flex-col items-center">
            <span className={`font-serif text-xl md:text-2xl tracking-[0.3em] font-light transition-colors duration-300 ${scrolled ? "text-luxury-black" : "text-white"}`}>
              {BRAND_NAME}
            </span>
            <span className={`text-[8px] tracking-[0.35em] uppercase font-light transition-colors duration-300 ${scrolled ? "text-luxury-black/50" : "text-white/50"}`}>
              Real Estate
            </span>
          </div>

          {/* Right nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_RIGHT.map((l) => (
              <a key={l} href="#" className={`text-[11px] tracking-[0.18em] uppercase font-medium transition-colors duration-300 ${scrolled ? "text-luxury-black/70 hover:text-luxury-black" : "text-white/80 hover:text-white"}`}>{l}</a>
            ))}
          </div>

          {/* Mobile menu */}
          <button className={`md:hidden transition-colors duration-300 ${scrolled ? "text-luxury-black/70" : "text-white/70"}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </nav>

      {/* ─── HERO SLIDESHOW ─── */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {HERO_SLIDES.map((slide, i) => (
          <div key={i} className="absolute inset-0 transition-opacity duration-[1.5s] ease-in-out" style={{ opacity: currentSlide === i ? 1 : 0 }}>
            <img src={slide.image} alt={slide.headline} className="w-full h-full object-cover" style={{ transform: currentSlide === i ? "scale(1.05)" : "scale(1)", transition: "transform 6s ease-out" }} />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/40 via-luxury-black/20 to-luxury-black/60" />

        <div className="relative z-10 text-center max-w-4xl px-6">
          <FadeIn>
            <p className="text-[11px] md:text-[13px] tracking-[0.35em] uppercase text-luxury-gold mb-6">The World's Finest Properties</p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-light leading-[1.1] mb-6 text-white drop-shadow-lg font-serif tracking-tight">
              {HERO_SLIDES[currentSlide].headline}
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto mb-10 leading-relaxed drop-shadow font-light">
              {HERO_SLIDES[currentSlide].sub}
            </p>
          </FadeIn>
          <FadeIn delay={0.45}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-luxury-gold text-luxury-black text-[12px] tracking-[0.15em] uppercase font-medium px-8 py-3.5 hover:bg-luxury-gold/90 transition-all duration-300 flex items-center gap-2">
                Explore Properties <ArrowRight className="w-4 h-4" />
              </button>
              <button className="border border-white/40 text-white text-[12px] tracking-[0.15em] uppercase px-8 py-3.5 hover:border-luxury-gold hover:text-luxury-gold transition-all duration-300 backdrop-blur-sm">
                Book a Private Tour
              </button>
            </div>
          </FadeIn>
        </div>

        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-[3px] rounded-full transition-all duration-500 ${currentSlide === i ? "w-8 bg-luxury-gold" : "w-4 bg-white/30 hover:bg-white/50"}`} />
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 animate-bounce">
          <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* ─── INTRO / PRESENTATION ─── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <FadeIn>
            <h1 className="text-2xl sm:text-3xl md:text-[2.5rem] font-light leading-[1.3] tracking-tight text-luxury-black font-serif">
              {INTRO_TITLE}
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="w-12 h-[1px] bg-luxury-gold mx-auto my-8" />
          </FadeIn>
          <FadeIn delay={0.25}>
            <p className="text-[15px] md:text-base leading-[1.9] text-luxury-black/55 font-light max-w-3xl mx-auto">
              {INTRO_TEXT}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── FEATURED PROPERTIES ─── */}
      <section className="py-24 md:py-32 px-6 md:px-10 max-w-7xl mx-auto bg-white">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-[11px] tracking-[0.35em] uppercase text-luxury-gold mb-4">Portfolio</p>
            <h2 className="text-3xl md:text-4xl font-light text-luxury-black font-serif tracking-tight">Featured Properties</h2>
            <div className="w-16 h-[1px] bg-luxury-gold/40 mx-auto mt-6" />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {PROPERTIES.map((p, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-luxury-black/0 group-hover:bg-luxury-black/40 transition-all duration-500 flex items-center justify-center">
                    <span className="text-[12px] tracking-[0.2em] uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-white/50 px-6 py-2.5">View Details</span>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-luxury-gold/40 transition-all duration-500 pointer-events-none" />
                </div>
                <div className="pt-5 space-y-2">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-luxury-gold">{p.location}</p>
                  <h3 className="text-lg font-light text-luxury-black font-serif">{p.name}</h3>
                  <p className="text-xl font-normal text-luxury-black/80">{p.price}</p>
                  <div className="flex items-center gap-5 pt-2 text-[12px] text-luxury-black/45 font-light">
                    <span className="flex items-center gap-1.5"><Bed className="w-3.5 h-3.5" /> {p.beds} Beds</span>
                    <span className="flex items-center gap-1.5"><Bath className="w-3.5 h-3.5" /> {p.baths} Baths</span>
                    <span className="flex items-center gap-1.5"><Maximize className="w-3.5 h-3.5" /> {p.sqm} m²</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div className="text-center mt-16">
            <button className="border border-luxury-gold text-luxury-gold text-[12px] tracking-[0.15em] uppercase px-10 py-3.5 hover:bg-luxury-gold hover:text-white transition-all duration-300">
              View All Properties
            </button>
          </div>
        </FadeIn>
      </section>

      {/* ─── SERVICES ─── */}
      <section className="py-24 md:py-32 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-[11px] tracking-[0.35em] uppercase text-luxury-gold mb-4">Why Choose Us</p>
              <h2 className="text-3xl md:text-4xl font-light text-luxury-black font-serif tracking-tight">A Standard Apart</h2>
              <div className="w-16 h-[1px] bg-luxury-gold/40 mx-auto mt-6" />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="text-center group p-6 border border-neutral-200 hover:border-luxury-gold/40 bg-white transition-all duration-500">
                  <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center border border-luxury-gold/30 rounded-full group-hover:bg-luxury-gold/10 transition-all duration-500">
                    <s.icon className="w-6 h-6 text-luxury-gold" strokeWidth={1.2} />
                  </div>
                  <h3 className="text-sm font-medium tracking-wide mb-3 text-luxury-black">{s.title}</h3>
                  <p className="text-[13px] leading-relaxed text-luxury-black/50 font-light">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE JOURNAL / BLOG ─── */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-light text-luxury-black font-serif tracking-tight mb-14">The Journal</h2>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Featured article — large left */}
            <FadeIn className="lg:col-span-7">
              <a href="#" className="group block">
                <div className="relative overflow-hidden aspect-[16/10]">
                  <img src={BLOG_POSTS[0].image} alt={BLOG_POSTS[0].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <span className="text-[11px] tracking-wider text-white/60 font-light">{BLOG_POSTS[0].date}</span>
                    <h3 className="text-xl md:text-2xl font-light text-white font-serif leading-snug mt-2">{BLOG_POSTS[0].title}</h3>
                    <p className="text-[13px] text-white/60 font-light mt-2 line-clamp-2">{BLOG_POSTS[0].excerpt}</p>
                  </div>
                </div>
              </a>
            </FadeIn>

            {/* Side articles — stacked right */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {BLOG_POSTS.slice(1).map((post, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <a href="#" className="group flex gap-4 items-start">
                    <div className="w-28 h-20 shrink-0 overflow-hidden rounded">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] tracking-[0.15em] uppercase text-luxury-black/40 font-light">{post.date}</span>
                      <h4 className="text-[15px] font-normal text-luxury-black leading-snug mt-1 group-hover:text-luxury-gold transition-colors duration-300 line-clamp-2">{post.title}</h4>
                      <p className="text-[13px] text-luxury-black/45 font-light mt-1.5 line-clamp-2">{post.excerpt}</p>
                    </div>
                  </a>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER (DARK) ─── */}
      <footer className="bg-luxury-black">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div className="md:col-span-1">
              <span className="text-lg tracking-[0.2em] text-luxury-gold font-bold block mb-4 font-serif">{BRAND_NAME}</span>
              <p className="text-[13px] text-luxury-cream/40 leading-relaxed font-light">
                Curating extraordinary homes for exceptional lives since 2010.
              </p>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.2em] uppercase text-luxury-cream/50 mb-5 font-medium">Quick Links</h4>
              <ul className="space-y-3">
                {["Properties", "Services", "About Us", "Contact", "Privacy Policy"].map((l) => (
                  <li key={l}><a href="#" className="text-[13px] text-luxury-cream/40 hover:text-luxury-gold transition-colors duration-300 font-light">{l}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.2em] uppercase text-luxury-cream/50 mb-5 font-medium">Contact</h4>
              <ul className="space-y-3 text-[13px] text-luxury-cream/40 font-light">
                <li>{CONTACT.email}</li>
                <li>{CONTACT.phone}</li>
                <li>{CONTACT.city}</li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.2em] uppercase text-luxury-cream/50 mb-5 font-medium">Follow</h4>
              <div className="flex gap-4">
                {[Instagram, Linkedin, MessageCircle].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 border border-luxury-cream/10 flex items-center justify-center hover:border-luxury-gold/50 hover:text-luxury-gold text-luxury-cream/40 transition-all duration-300">
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-luxury-cream/[0.08] mt-14 pt-8 text-center">
            <p className="text-[11px] text-luxury-cream/30 tracking-wider font-light">© 2025 {BRAND_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LuxuryLandingPage;
