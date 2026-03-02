import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock, Instagram, Linkedin, Facebook, Twitter, ChevronUp, ArrowRight, Check, Navigation } from "lucide-react";
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
  { id: "marbella", name: "Marbella", label: "Headquarters", image: heroImg, address: "Av. Ricardo Soriano, 72, 29601 Marbella, Málaga", phone: "+34 952 123 456", email: "marbella@prestigeestates.com", hours: "Mon–Fri 9:00–19:00 · Sat 10:00–14:00", lat: 36.51, lng: -4.88 },
  { id: "ibiza", name: "Ibiza", label: "Balearic Islands", image: prop1, address: "Paseo Vara de Rey, 15, 07800 Ibiza", phone: "+34 971 234 567", email: "ibiza@prestigeestates.com", hours: "Mon–Fri 9:30–18:30", lat: 38.91, lng: 1.43 },
  { id: "mallorca", name: "Palma de Mallorca", label: "Balearic Islands", image: prop2, address: "Paseo del Borne, 28, 07012 Palma", phone: "+34 971 345 678", email: "mallorca@prestigeestates.com", hours: "Mon–Fri 9:00–18:00", lat: 39.57, lng: 2.65 },
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
  const [selectedOffices, setSelectedOffices] = useState<string[]>([OFFICES[0].id]);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleOffice = (id: string) => {
    setSelectedOffices((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((o) => o !== id) : prev) : [...prev, id]
    );
  };

  const scrollToTop = () => containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const getDirectionsUrl = (office: typeof OFFICES[0]) =>
    `https://www.google.com/maps/dir/?api=1&destination=${office.lat},${office.lng}`;

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

      {/* ─── HERO ─── */}
      <section className="relative h-[30vh] md:h-[40vh] overflow-hidden">
        <img src={heroImg} alt="Contact" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(45,41,38,0.7) 0%, rgba(45,41,38,0.2) 100%)" }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-[10px] tracking-[0.3em] uppercase font-light mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>Get in Touch</p>
          <h1 className="text-[32px] md:text-[48px] font-extralight tracking-[0.04em] leading-[1.1]" style={{ color: p.white }}>Contact Us</h1>
          <p className="text-[13px] font-light mt-3 max-w-md" style={{ color: "rgba(255,255,255,0.7)" }}>
            Our multilingual team of advisors is ready to assist you across the Mediterranean.
          </p>
        </div>
      </section>

      {/* ─── CONTACT FORM ─── */}
      <section style={{ background: p.bg }}>
        <div className="max-w-[800px] mx-auto px-5 sm:px-6 py-14 md:py-20">
          <div className="text-center mb-10">
            <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-3" style={{ color: p.accent }}>Send a Message</p>
            <h2 className="text-[24px] md:text-[32px] font-extralight tracking-[0.02em]">How Can We Help?</h2>
            <p className="text-[13px] font-light mt-3 max-w-lg mx-auto" style={{ color: p.muted }}>Select one or more offices and fill in the form below. We typically respond within 24 hours.</p>
          </div>

          {/* Office selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {OFFICES.map((o) => {
              const selected = selectedOffices.includes(o.id);
              return (
                <button
                  key={o.id}
                  onClick={() => toggleOffice(o.id)}
                  className="flex items-center gap-2 px-5 py-2.5 text-[12px] tracking-[0.08em] font-light transition-all duration-300"
                  style={{
                    border: `1px solid ${selected ? p.text : p.border}`,
                    background: selected ? p.text : p.white,
                    color: selected ? p.white : p.muted,
                  }}
                >
                  {selected && <Check className="w-3 h-3" />}
                  {o.name}
                </button>
              );
            })}
          </div>

          {submitted ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: p.accent, color: p.white }}>
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-[20px] font-extralight mb-2">Message Sent</h3>
              <p className="text-[13px] font-light" style={{ color: p.muted }}>Thank you for reaching out. We'll be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] tracking-[0.1em] uppercase font-medium mb-2" style={{ color: p.muted }}>Full Name *</label>
                  <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required placeholder="John Smith" className="w-full px-4 py-3 text-[13px] focus:outline-none" style={{ border: `1px solid ${p.border}`, background: p.white, color: p.text }} />
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.1em] uppercase font-medium mb-2" style={{ color: p.muted }}>Email *</label>
                  <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required placeholder="john@example.com" className="w-full px-4 py-3 text-[13px] focus:outline-none" style={{ border: `1px solid ${p.border}`, background: p.white, color: p.text }} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] tracking-[0.1em] uppercase font-medium mb-2" style={{ color: p.muted }}>Phone</label>
                  <input type="tel" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="+34 600 000 000" className="w-full px-4 py-3 text-[13px] focus:outline-none" style={{ border: `1px solid ${p.border}`, background: p.white, color: p.text }} />
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.1em] uppercase font-medium mb-2" style={{ color: p.muted }}>Subject</label>
                  <select value={formSubject} onChange={(e) => setFormSubject(e.target.value)} className="w-full px-4 py-3 text-[13px] focus:outline-none appearance-none" style={{ border: `1px solid ${p.border}`, background: p.white, color: formSubject ? p.text : p.light }}>
                    <option value="">Select a topic</option>
                    <option value="buying">Buying a Property</option>
                    <option value="selling">Selling a Property</option>
                    <option value="valuation">Property Valuation</option>
                    <option value="investment">Investment Advisory</option>
                    <option value="rental">Luxury Rentals</option>
                    <option value="other">Other Enquiry</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] tracking-[0.1em] uppercase font-medium mb-2" style={{ color: p.muted }}>Message *</label>
                <textarea value={formMessage} onChange={(e) => setFormMessage(e.target.value)} required placeholder="Tell us about your requirements, preferred locations, budget range..." rows={5} className="w-full px-4 py-3 text-[13px] focus:outline-none resize-none" style={{ border: `1px solid ${p.border}`, background: p.white, color: p.text }} />
              </div>
              <div className="text-center pt-2">
                <button type="submit" className="inline-flex items-center gap-2 px-10 py-3.5 text-[11px] tracking-[0.15em] uppercase font-medium transition-all duration-300 hover:opacity-90" style={{ background: p.text, color: p.white }}>
                  Send Message <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <p className="text-[11px] font-light mt-4" style={{ color: p.light }}>
                  By submitting this form you agree to our <Link to="/page/privacy" className="underline" style={{ color: p.accent }}>Privacy Policy</Link>.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ─── OFFICES GRID ─── */}
      <section className="py-14 md:py-20" style={{ background: p.white }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-3" style={{ color: p.accent }}>Visit Us</p>
            <h2 className="text-[24px] md:text-[32px] font-extralight tracking-[0.02em]">Our Offices</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {OFFICES.map((office) => (
              <div key={office.id} className="group" style={{ border: `1px solid ${p.border}` }}>
                {/* Image */}
                <div className="relative overflow-hidden aspect-[16/10]">
                  <img src={office.image} alt={office.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(45,41,38,0.5) 0%, transparent 50%)" }} />
                  <div className="absolute bottom-3 left-4">
                    <h3 className="text-[16px] font-light tracking-[0.04em]" style={{ color: p.white }}>{office.name}</h3>
                    <p className="text-[10px] font-light tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.6)" }}>{office.label}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: p.accent }} />
                    <span className="text-[12px] font-light leading-[1.5]" style={{ color: p.muted }}>{office.address}</span>
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

                {/* Get Directions button */}
                <div className="px-5 pb-5">
                  <a
                    href={getDirectionsUrl(office)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-[11px] tracking-[0.12em] uppercase font-medium transition-all duration-300 hover:opacity-80"
                    style={{ border: `1px solid ${p.border}`, color: p.text }}
                  >
                    <Navigation className="w-3.5 h-3.5" /> Get Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
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
