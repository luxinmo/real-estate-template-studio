import { useParams, Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { ArrowLeft, Instagram, Linkedin, MessageCircle } from "lucide-react";

const p = {
  bg: "#FAF8F5", white: "#FFFFFF", text: "#2D2926", muted: "#6B6560",
  light: "#9A938B", accent: "#8B6F47", border: "#E2DCD4", footer: "#2D2926",
};
const font = "'Jost', Helvetica, sans-serif";
const BRAND_NAME = "PRESTIGE ESTATES";

const PAGES: Record<string, { title: string; content: string; image?: string }> = {
  "about": {
    title: "About Us",
    content: `<p>Prestige Estates is a curated luxury real estate advisory specialising in the most exclusive properties across the Mediterranean.</p><h2>Our Mission</h2><p>We connect discerning international buyers with exceptional properties through a bespoke service built on trust, discretion, and an uncompromising eye for quality.</p><h2>Our Story</h2><p>Founded in 2010, Prestige Estates has grown from a boutique consultancy in Marbella to a leading luxury real estate firm serving clients across Europe and beyond. Our team of multilingual advisors brings decades of combined experience in international property transactions.</p><h2>Why Choose Us</h2><p>With exclusive access to off-market listings, proven negotiation expertise, and a white-glove concierge service, we ensure every client receives a seamless, personalised experience from first viewing to final signature.</p>`,
  },
  "terms": {
    title: "Terms & Conditions",
    content: `<h2>1. General</h2><p>These terms govern the use of the Prestige Estates website and services. By accessing our platform, you agree to these conditions.</p><h2>2. Services</h2><p>Prestige Estates acts as an intermediary between property sellers and buyers. All property information is provided in good faith but should be independently verified.</p><h2>3. Privacy</h2><p>We are committed to protecting your personal data. Please refer to our Privacy Policy for full details on how we collect, use, and store your information.</p>`,
  },
  "privacy": {
    title: "Privacy Policy",
    content: `<h2>Data Collection</h2><p>We collect personal information you provide directly, such as name, email, and phone number when you contact us or subscribe to our services.</p><h2>How We Use Your Data</h2><p>Your data is used solely for providing real estate advisory services, sending market updates (with your consent), and improving our platform.</p><h2>Your Rights</h2><p>You have the right to access, rectify, or delete your personal data at any time by contacting our data protection officer.</p>`,
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

  return (
    <div ref={containerRef} className="flex-1 overflow-auto" style={{ background: p.bg, color: p.text, fontFamily: font }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 transition-all duration-500" style={{ background: scrolled ? `${p.white}f0` : p.white, backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: `1px solid ${p.border}` }}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 h-[60px] lg:h-[68px]">
          <Link to="/" className="flex items-center gap-2 text-[13px] tracking-[0.08em] font-light transition-opacity hover:opacity-60" style={{ color: p.muted }}>
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <Link to="/" className="flex flex-col items-center">
            <span className="text-[18px] sm:text-[22px] tracking-[0.35em] font-light" style={{ color: p.text }}>{BRAND_NAME}</span>
          </Link>
          <div className="w-[80px]" />
        </div>
      </nav>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-5 sm:px-6 py-12 md:py-20">
        <p className="text-xs tracking-[0.3em] uppercase mb-3 font-normal" style={{ color: p.accent }}>Information</p>
        <h1 className="text-3xl md:text-4xl font-extralight tracking-[0.04em] leading-[1.2] mb-4">{page.title}</h1>
        <div className="w-12 h-[1px] mb-10" style={{ background: p.accent }} />

        <div
          className="prose-system"
          style={{ fontSize: "15px", lineHeight: 1.9, color: p.muted }}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>

      {/* Footer */}
      <footer style={{ background: p.footer }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-[16px] tracking-[0.35em] font-light" style={{ color: p.white }}>{BRAND_NAME}</span>
            <div className="flex gap-3">
              {[Instagram, Linkedin, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 flex items-center justify-center hover:text-white/70 transition-all" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }}>
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-4 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[10px] tracking-wider font-light" style={{ color: "rgba(255,255,255,0.2)" }}>© 2025 {BRAND_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        .prose-system h2 { font-size: 22px; font-weight: 300; letter-spacing: 0.02em; margin: 2em 0 0.8em; color: ${p.text}; }
        .prose-system p { margin-bottom: 1.2em; }
        .prose-system a { color: ${p.accent}; text-decoration: underline; }
        .prose-system ul { list-style: disc; padding-left: 1.5em; margin-bottom: 1.2em; }
        .prose-system li { margin-bottom: 0.4em; }
      `}</style>
    </div>
  );
};

export default SystemPage;
