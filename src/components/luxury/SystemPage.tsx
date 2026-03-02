import { useParams, Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { ArrowLeft, Instagram, Linkedin, Facebook, Twitter, ChevronUp } from "lucide-react";
import heroImg from "@/assets/luxury-hero.jpg";
import propertyDetail1 from "@/assets/property-detail-1.jpg";

const p = {
  bg: "#FAF8F5", white: "#FFFFFF", text: "#2D2926", muted: "#6B6560",
  light: "#9A938B", accent: "#8B6F47", border: "#E2DCD4", footer: "#2D2926",
};
const font = "'Jost', Helvetica, sans-serif";
const BRAND_NAME = "PRESTIGE ESTATES";

const NAV_LEFT = ["Home", "Properties", "Rentals"];
const NAV_RIGHT = ["About", "Guides & Blog", "Contact"];

const PAGES: Record<string, { title: string; subtitle?: string; image?: string; content: string }> = {
  "about": {
    title: "About Prestige Estates",
    subtitle: "A curated luxury real estate advisory specialising in the most exclusive properties across the Mediterranean.",
    image: heroImg,
    content: `<h2>Our Mission</h2><p>We connect discerning international buyers with exceptional properties through a bespoke service built on trust, discretion, and an uncompromising eye for quality.</p><h2>Our Story</h2><p>Founded in 2010, Prestige Estates has grown from a boutique consultancy in Marbella to a leading luxury real estate firm serving clients across Europe and beyond. Our team of multilingual advisors brings decades of combined experience in international property transactions.</p><div class="page-image"><img src="${propertyDetail1}" alt="Our offices" /><span class="img-caption">Our Marbella headquarters</span></div><h2>Why Choose Us</h2><p>With exclusive access to off-market listings, proven negotiation expertise, and a white-glove concierge service, we ensure every client receives a seamless, personalised experience from first viewing to final signature.</p><h2>Our Values</h2><ul><li><strong>Discretion</strong> — We understand that privacy is paramount</li><li><strong>Excellence</strong> — We hold ourselves to the highest standards</li><li><strong>Integrity</strong> — Transparency guides every interaction</li><li><strong>Innovation</strong> — We embrace technology to enhance our service</li></ul>`,
  },
  "terms": {
    title: "Terms & Conditions",
    subtitle: "Please read these terms carefully before using our services.",
    content: `<h2>1. General</h2><p>These terms govern the use of the Prestige Estates website and services. By accessing our platform, you agree to these conditions.</p><h2>2. Services</h2><p>Prestige Estates acts as an intermediary between property sellers and buyers. All property information is provided in good faith but should be independently verified.</p><h2>3. Intellectual Property</h2><p>All content, imagery, and branding on this website is the property of Prestige Estates and may not be reproduced without prior written consent.</p><h2>4. Liability</h2><p>While we strive to ensure accuracy, Prestige Estates accepts no liability for inaccuracies in property listings or market information. All details should be independently verified.</p><h2>5. Privacy</h2><p>We are committed to protecting your personal data. Please refer to our Privacy Policy for full details on how we collect, use, and store your information.</p>`,
  },
  "privacy": {
    title: "Privacy Policy",
    subtitle: "How we collect, use, and protect your personal information.",
    content: `<h2>Data Collection</h2><p>We collect personal information you provide directly, such as name, email, and phone number when you contact us or subscribe to our services.</p><h2>How We Use Your Data</h2><p>Your data is used solely for providing real estate advisory services, sending market updates (with your consent), and improving our platform.</p><h2>Data Storage</h2><p>We use industry-standard encryption and security measures to protect your data. Your information is stored on secure servers within the European Economic Area.</p><h2>Your Rights</h2><p>You have the right to access, rectify, or delete your personal data at any time by contacting our data protection officer at <a href="mailto:privacy@prestigeestates.com">privacy@prestigeestates.com</a>.</p><h2>Cookies</h2><p>Our website uses cookies to improve your browsing experience. You can manage your cookie preferences through your browser settings.</p>`,
  },
};

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

const SystemPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrolled = useContainerScrolled(containerRef);
  const page = PAGES[slug || "about"] || PAGES["about"];
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
              <Link key={l} to={l === "Guides & Blog" ? "/blog" : l === "About" ? "/page/about" : "#"} className="text-[12px] tracking-[0.12em] uppercase font-light transition-opacity hover:opacity-60" style={{ color: p.text }}>{l}</Link>
            ))}
          </div>
          <Link to="/" className="lg:hidden flex items-center gap-1.5 text-[12px] tracking-[0.08em] font-light" style={{ color: p.muted }}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </nav>

      {/* ─── HEADER ─── */}
      <header className="max-w-3xl mx-auto px-5 sm:px-6 pt-12 md:pt-20 pb-6 text-center">
        <p className="text-[10px] tracking-[0.25em] uppercase font-medium mb-4" style={{ color: p.accent }}>Information</p>
        <h1 className="text-[28px] md:text-[40px] font-extralight leading-[1.15] tracking-[0.01em]">{page.title}</h1>
        {page.subtitle && (
          <p className="text-[14px] font-light leading-[1.7] mt-4 max-w-xl mx-auto" style={{ color: p.muted }}>{page.subtitle}</p>
        )}
        <div className="w-12 h-[1px] mx-auto mt-8" style={{ background: p.accent }} />
      </header>

      {/* ─── HERO IMAGE ─── */}
      {page.image && (
        <div className="max-w-4xl mx-auto px-5 sm:px-6 mb-10 md:mb-14">
          <div className="relative overflow-hidden aspect-[16/9]">
            <img src={page.image} alt={page.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* ─── CONTENT ─── */}
      <article className="max-w-[720px] mx-auto px-5 sm:px-6 pb-16 md:pb-24">
        <div
          className="system-page-content"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: p.footer }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {[
              { title: "Properties", items: ["For Sale", "For Rent", "New Developments", "Off-Market"] },
              { title: "Locations", items: ["Marbella", "Ibiza", "Mallorca", "Costa del Sol"] },
              { title: "Company", items: [{ label: "About Us", href: "/page/about" }, { label: "Careers", href: "#" }, { label: "Press", href: "#" }, { label: "Contact", href: "#" }] },
              { title: "Legal", items: [{ label: "Privacy Policy", href: "/page/privacy" }, { label: "Terms", href: "/page/terms" }, { label: "Cookies", href: "#" }, { label: "Sitemap", href: "#" }] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>{col.title}</p>
                {col.items.map((item) => {
                  const label = typeof item === "string" ? item : item.label;
                  const href = typeof item === "string" ? "#" : item.href;
                  return (
                    <Link key={label} to={href} className="block text-[12px] font-light py-1 transition-opacity hover:opacity-70" style={{ color: "rgba(255,255,255,0.6)" }}>{label}</Link>
                  );
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

      {/* Back to top */}
      <button onClick={scrollToTop} className="fixed bottom-6 right-6 z-40 w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110" style={{ background: p.text, color: p.white }}>
        <ChevronUp className="w-4 h-4" />
      </button>

      <style>{`
        .system-page-content { font-size: 15px; line-height: 1.9; color: ${p.muted}; }
        .system-page-content h2 { font-size: 22px; font-weight: 300; letter-spacing: 0.02em; margin: 2.5em 0 0.8em; color: ${p.text}; font-family: 'Jost', serif; }
        .system-page-content p { margin-bottom: 1.4em; }
        .system-page-content a { color: ${p.accent}; text-decoration: underline; }
        .system-page-content ul { list-style: none; padding: 0; margin-bottom: 1.5em; }
        .system-page-content li { padding: 8px 0; border-bottom: 1px solid ${p.border}; font-size: 14px; }
        .system-page-content li:last-child { border-bottom: none; }
        .system-page-content strong { color: ${p.text}; font-weight: 500; }
        .system-page-content .page-image { margin: 2em 0; }
        .system-page-content .page-image img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
        .system-page-content .img-caption { display: block; font-size: 11px; color: ${p.light}; margin-top: 6px; font-weight: 300; }
      `}</style>
    </div>
  );
};

export default SystemPage;
