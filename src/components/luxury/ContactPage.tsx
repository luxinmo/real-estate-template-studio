import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock, Instagram, Linkedin, Facebook, Twitter, ChevronUp, Send } from "lucide-react";
import heroImg from "@/assets/luxury-hero.jpg";
import prop1 from "@/assets/luxury-property-1.jpg";
import prop2 from "@/assets/luxury-property-2.jpg";

const p = {
  bg: "#FAF8F5", white: "#FFFFFF", text: "#2D2926", muted: "#6B6560",
  light: "#9A938B", accent: "#8B6F47", border: "#E2DCD4", footer: "#2D2926",
};
const font = "'Jost', Helvetica, sans-serif";
const BRAND_NAME = "PRESTIGE ESTATES";

const NAV_LEFT = ["Home", "Properties", "Rentals"];
const NAV_RIGHT = ["About", "Guides & Blog", "Contact"];

const OFFICES = [
  {
    id: "marbella",
    name: "Marbella — Headquarters",
    image: heroImg,
    address: "Av. Ricardo Soriano, 72, 29601 Marbella, Málaga",
    phone: "+34 952 123 456",
    email: "marbella@prestigeestates.com",
    hours: "Mon–Fri 9:00–19:00 · Sat 10:00–14:00",
    mapUrl: "https://www.openstreetmap.org/export/embed.html?bbox=-4.89,36.50,-4.87,36.52&layer=mapnik&marker=36.5100,-4.8826",
    description: "Our flagship office in the heart of Marbella's Golden Mile, offering panoramic views of the Mediterranean.",
  },
  {
    id: "ibiza",
    name: "Ibiza",
    image: prop1,
    address: "Paseo Vara de Rey, 15, 07800 Ibiza",
    phone: "+34 971 234 567",
    email: "ibiza@prestigeestates.com",
    hours: "Mon–Fri 9:30–18:30 · Sat by appointment",
    mapUrl: "https://www.openstreetmap.org/export/embed.html?bbox=1.42,38.90,1.44,38.92&layer=mapnik&marker=38.9067,1.4326",
    description: "Strategically located in Ibiza Town, specialising in luxury villas and exclusive off-market opportunities.",
  },
  {
    id: "mallorca",
    name: "Palma de Mallorca",
    image: prop2,
    address: "Paseo del Borne, 28, 07012 Palma de Mallorca",
    phone: "+34 971 345 678",
    email: "mallorca@prestigeestates.com",
    hours: "Mon–Fri 9:00–18:00",
    mapUrl: "https://www.openstreetmap.org/export/embed.html?bbox=2.64,39.56,2.66,39.58&layer=mapnik&marker=39.5696,2.6502",
    description: "Our Balearic hub on the prestigious Paseo del Borne, serving Mallorca's most discerning clientele.",
  },
];

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

const ContactPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrolled = useContainerScrolled(containerRef);
  const [formOffice, setFormOffice] = useState(OFFICES[0].id);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const scrollToTop = () => containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div ref={containerRef} className="flex-1 overflow-auto" style={{ background: p.white, color: p.text, fontFamily: font }}>

      {/* ─── NAVBAR ─── */}
      <nav className="sticky top-0 z-50 transition-all duration-500" style={{ background: scrolled ? `${p.white}f0` : p.white, backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: `1px solid ${p.border}` }}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 h-[56px] lg:h-[64px]">
          <div className="hidden lg:flex items-center gap-7">
            {NAV_LEFT.map((l) => (
              <Link key={l} to={l === "Home" ? "/" : l === "Properties" ? "/properties" : "#"} className="text-[12px] tracking-[0.12em] uppercase font-light transition-opacity hover:opacity-60" style={{ color: p.text }}>{l}</Link>
            ))}
          </div>
          <Link to="/" className="flex flex-col items-center">
            <span className="text-[18px] sm:text-[22px] tracking-[0.35em] font-light" style={{ color: p.text }}>{BRAND_NAME}</span>
            <span className="text-[7px] sm:text-[8px] tracking-[0.45em] uppercase font-light -mt-0.5" style={{ color: p.light }}>Real Estate</span>
          </Link>
          <div className="hidden lg:flex items-center gap-7">
            {NAV_RIGHT.map((l) => (
              <Link key={l} to={l === "Guides & Blog" ? "/blog" : l === "About" ? "/page/about" : l === "Contact" ? "/contact" : "#"}
                className="text-[12px] tracking-[0.12em] uppercase font-light transition-opacity hover:opacity-60"
                style={{ color: l === "Contact" ? p.accent : p.text }}>{l}</Link>
            ))}
          </div>
        </div>
      </nav>

      {/* ─── HEADER ─── */}
      <header className="max-w-3xl mx-auto px-5 sm:px-6 pt-12 md:pt-20 pb-8 text-center">
        <p className="text-[10px] tracking-[0.25em] uppercase font-medium mb-4" style={{ color: p.accent }}>Get in Touch</p>
        <h1 className="text-[28px] md:text-[42px] font-extralight leading-[1.15] tracking-[0.01em]">Our Offices</h1>
        <p className="text-[14px] font-light leading-[1.7] mt-4 max-w-xl mx-auto" style={{ color: p.muted }}>
          Visit us at any of our Mediterranean locations. Our multilingual team of advisors is ready to assist you.
        </p>
        <div className="w-12 h-[1px] mx-auto mt-8" style={{ background: p.accent }} />
      </header>

      {/* ─── OFFICE CARDS ─── */}
      <section className="max-w-[1200px] mx-auto px-5 sm:px-6 pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OFFICES.map((office) => (
            <div key={office.id} className="group overflow-hidden" style={{ border: `1px solid ${p.border}`, background: p.white }}>
              {/* Office Image */}
              <div className="relative overflow-hidden aspect-[16/10]">
                <img src={office.image} alt={office.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(45,41,38,0.4) 0%, transparent 50%)" }} />
                <h3 className="absolute bottom-4 left-5 text-[16px] font-light tracking-[0.04em]" style={{ color: p.white }}>{office.name}</h3>
              </div>

              {/* Mini Map */}
              <div className="aspect-[16/7] w-full">
                <iframe
                  src={office.mapUrl}
                  className="w-full h-full border-0"
                  title={`Map - ${office.name}`}
                  loading="lazy"
                />
              </div>

              {/* Details */}
              <div className="p-5 space-y-3">
                <p className="text-[13px] font-light leading-[1.6]" style={{ color: p.muted }}>{office.description}</p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: p.accent }} />
                    <span className="text-[12px] font-light" style={{ color: p.muted }}>{office.address}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: p.accent }} />
                    <a href={`tel:${office.phone}`} className="text-[12px] font-light hover:underline" style={{ color: p.muted }}>{office.phone}</a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: p.accent }} />
                    <a href={`mailto:${office.email}`} className="text-[12px] font-light hover:underline" style={{ color: p.muted }}>{office.email}</a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: p.accent }} />
                    <span className="text-[12px] font-light" style={{ color: p.light }}>{office.hours}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CONTACT FORM ─── */}
      <section style={{ background: p.bg }}>
        <div className="max-w-[700px] mx-auto px-5 sm:px-6 py-16 md:py-24">
          <div className="text-center mb-10">
            <p className="text-[10px] tracking-[0.25em] uppercase font-medium mb-3" style={{ color: p.accent }}>Send Us a Message</p>
            <h2 className="text-[24px] md:text-[32px] font-extralight tracking-[0.02em]">How Can We Help?</h2>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div>
              <label className="block text-[11px] tracking-[0.1em] uppercase font-medium mb-2" style={{ color: p.muted }}>Office</label>
              <select
                value={formOffice}
                onChange={(e) => setFormOffice(e.target.value)}
                className="w-full px-4 py-3 text-[13px] focus:outline-none appearance-none"
                style={{ border: `1px solid ${p.border}`, background: p.white, color: p.text }}
              >
                {OFFICES.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] tracking-[0.1em] uppercase font-medium mb-2" style={{ color: p.muted }}>Name</label>
                <input
                  type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 text-[13px] focus:outline-none"
                  style={{ border: `1px solid ${p.border}`, background: p.white, color: p.text }}
                />
              </div>
              <div>
                <label className="block text-[11px] tracking-[0.1em] uppercase font-medium mb-2" style={{ color: p.muted }}>Email</label>
                <input
                  type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 text-[13px] focus:outline-none"
                  style={{ border: `1px solid ${p.border}`, background: p.white, color: p.text }}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.1em] uppercase font-medium mb-2" style={{ color: p.muted }}>Message</label>
              <textarea
                value={formMessage} onChange={(e) => setFormMessage(e.target.value)}
                placeholder="Tell us about your requirements..."
                rows={5}
                className="w-full px-4 py-3 text-[13px] focus:outline-none resize-none"
                style={{ border: `1px solid ${p.border}`, background: p.white, color: p.text }}
              />
            </div>

            <div className="text-center pt-2">
              <button className="inline-flex items-center gap-2 px-10 py-3.5 text-[11px] tracking-[0.15em] uppercase font-medium transition-all duration-300 hover:opacity-90" style={{ background: p.text, color: p.white }}>
                <Send className="w-3.5 h-3.5" /> Send Message
              </button>
              <p className="text-[11px] font-light mt-3" style={{ color: p.light }}>We typically respond within 24 hours.</p>
            </div>
          </form>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: p.footer }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {[
              { title: "Properties", items: ["For Sale", "For Rent", "New Developments", "Off-Market"] },
              { title: "Locations", items: ["Marbella", "Ibiza", "Mallorca", "Costa del Sol"] },
              { title: "Company", items: [{ label: "About Us", href: "/page/about" }, { label: "Careers", href: "#" }, { label: "Press", href: "#" }, { label: "Contact", href: "/contact" }] },
              { title: "Legal", items: [{ label: "Privacy Policy", href: "/page/privacy" }, { label: "Terms", href: "/page/terms" }, { label: "Cookies", href: "#" }, { label: "Sitemap", href: "#" }] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>{col.title}</p>
                {col.items.map((item) => {
                  const label = typeof item === "string" ? item : item.label;
                  const href = typeof item === "string" ? "#" : item.href;
                  return <Link key={label} to={href} className="block text-[12px] font-light py-1 transition-opacity hover:opacity-70" style={{ color: "rgba(255,255,255,0.6)" }}>{label}</Link>;
                })}
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="text-[14px] tracking-[0.35em] font-light" style={{ color: "rgba(255,255,255,0.6)" }}>{BRAND_NAME}</span>
            <div className="flex gap-3">
              {[Instagram, Linkedin, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-all" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }}>
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
              ))}
            </div>
            <p className="text-[10px] tracking-wider font-light" style={{ color: "rgba(255,255,255,0.2)" }}>© 2026 {BRAND_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <button onClick={scrollToTop} className="fixed bottom-6 right-6 z-40 w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110" style={{ background: p.text, color: p.white }}>
        <ChevronUp className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ContactPage;
