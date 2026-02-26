import { useState, useEffect, useRef } from "react";
import { Bed, Bath, Maximize, ChevronDown, Instagram, Linkedin, MessageCircle, Shield, Star, Handshake, Lock, ArrowRight } from "lucide-react";
import heroImg from "@/assets/luxury-hero.jpg";
import prop1 from "@/assets/luxury-property-1.jpg";
import prop2 from "@/assets/luxury-property-2.jpg";
import prop3 from "@/assets/luxury-property-3.jpg";

/* ─── Placeholder content (easy to replace per client) ─── */
const BRAND_NAME = "PRESTIGE ESTATES";
const HERO_HEADLINE = "Where Luxury Meets Home";
const HERO_SUBHEADLINE = "Exclusive properties for those who demand the extraordinary";
const NAV_LINKS = ["Properties", "Services", "About", "Contact"];

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

const CONTACT = { email: "hello@prestigeestates.com", phone: "+34 600 000 000", city: "Marbella, Spain" };

/* ─── Scroll-aware hook ─── */
function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
}

/* ─── Intersection Observer for fade-in ─── */
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
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════ */

const LuxuryLandingPage = () => {
  const scrolled = useScrolled();

  return (
    <div className="flex-1 overflow-auto bg-white text-luxury-black font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ─── NAVBAR ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-luxury-black/95 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 h-20">
          <span className="font-serif text-xl md:text-2xl tracking-[0.2em] text-luxury-gold font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            {BRAND_NAME}
          </span>

          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((l) => (
              <a key={l} href="#" className="text-[13px] tracking-[0.15em] uppercase text-luxury-cream/70 hover:text-luxury-gold transition-colors duration-300">
                {l}
              </a>
            ))}
          </div>

          <button className="hidden md:inline-flex border border-luxury-gold/60 text-luxury-gold text-[12px] tracking-[0.15em] uppercase px-6 py-2.5 hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300">
            Schedule a Visit
          </button>

          {/* Mobile menu button */}
          <button className="md:hidden text-luxury-cream/70">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Parallax BG */}
        <div className="absolute inset-0">
          <img src={heroImg} alt="Luxury property" className="w-full h-full object-cover scale-110" style={{ transform: "scale(1.1)" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/70 via-luxury-black/50 to-luxury-black" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-6">
          <FadeIn>
            <p className="text-[11px] md:text-[13px] tracking-[0.35em] uppercase text-luxury-gold/80 mb-6">
              The World's Finest Properties
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h1
              className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {HERO_HEADLINE}
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-base md:text-lg text-luxury-cream/60 max-w-xl mx-auto mb-10 leading-relaxed">
              {HERO_SUBHEADLINE}
            </p>
          </FadeIn>
          <FadeIn delay={0.45}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-luxury-gold text-luxury-black text-[12px] tracking-[0.15em] uppercase font-semibold px-8 py-3.5 hover:bg-luxury-gold/90 transition-all duration-300 flex items-center gap-2">
                Explore Properties <ArrowRight className="w-4 h-4" />
              </button>
              <button className="border border-luxury-cream/30 text-luxury-cream text-[12px] tracking-[0.15em] uppercase px-8 py-3.5 hover:border-luxury-gold hover:text-luxury-gold transition-all duration-300">
                Book a Private Tour
              </button>
            </div>
          </FadeIn>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-luxury-cream/40 animate-bounce">
          <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* ─── FEATURED PROPERTIES ─── */}
      <section className="py-24 md:py-32 px-6 md:px-10 max-w-7xl mx-auto bg-white">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-[11px] tracking-[0.35em] uppercase text-luxury-gold mb-4">Portfolio</p>
            <h2 className="text-3xl md:text-4xl font-bold text-luxury-black" style={{ fontFamily: "'Playfair Display', serif" }}>
              Featured Properties
            </h2>
            <div className="w-16 h-[1px] bg-luxury-gold/40 mx-auto mt-6" />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {PROPERTIES.map((p, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-luxury-black/0 group-hover:bg-luxury-black/40 transition-all duration-500 flex items-center justify-center">
                    <span className="text-[12px] tracking-[0.2em] uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-white/50 px-6 py-2.5">
                      View Details
                    </span>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-luxury-gold/40 transition-all duration-500 pointer-events-none" />
                </div>

                <div className="pt-5 space-y-2">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-luxury-gold">{p.location}</p>
                  <h3 className="text-lg font-semibold text-luxury-black" style={{ fontFamily: "'Playfair Display', serif" }}>{p.name}</h3>
                  <p className="text-xl font-bold text-luxury-black/80">{p.price}</p>
                  <div className="flex items-center gap-5 pt-2 text-[12px] text-luxury-black/50">
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
              <h2 className="text-3xl md:text-4xl font-bold text-luxury-black" style={{ fontFamily: "'Playfair Display', serif" }}>
                A Standard Apart
              </h2>
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
                  <h3 className="text-sm font-semibold tracking-wide mb-3 text-luxury-black">{s.title}</h3>
                  <p className="text-[13px] leading-relaxed text-luxury-black/50">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div className="md:col-span-1">
              <span className="text-lg tracking-[0.2em] text-luxury-gold font-bold block mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {BRAND_NAME}
              </span>
              <p className="text-[13px] text-luxury-black/40 leading-relaxed">
                Curating extraordinary homes for exceptional lives since 2010.
              </p>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.2em] uppercase text-luxury-black/50 mb-5 font-semibold">Quick Links</h4>
              <ul className="space-y-3">
                {["Properties", "Services", "About Us", "Contact", "Privacy Policy"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[13px] text-luxury-black/40 hover:text-luxury-gold transition-colors duration-300">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.2em] uppercase text-luxury-black/50 mb-5 font-semibold">Contact</h4>
              <ul className="space-y-3 text-[13px] text-luxury-black/40">
                <li>{CONTACT.email}</li>
                <li>{CONTACT.phone}</li>
                <li>{CONTACT.city}</li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.2em] uppercase text-luxury-black/50 mb-5 font-semibold">Follow</h4>
              <div className="flex gap-4">
                {[Instagram, Linkedin, MessageCircle].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 border border-neutral-200 flex items-center justify-center hover:border-luxury-gold hover:text-luxury-gold text-luxury-black/40 transition-all duration-300">
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200 mt-14 pt-8 text-center">
            <p className="text-[11px] text-luxury-black/30 tracking-wider">
              © 2025 {BRAND_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LuxuryLandingPage;
