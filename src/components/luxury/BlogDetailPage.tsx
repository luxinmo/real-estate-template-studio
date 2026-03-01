import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, User, Tag, Instagram, Linkedin, MessageCircle } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import heroImg from "@/assets/luxury-hero.jpg";
import prop1 from "@/assets/luxury-property-1.jpg";
import prop2 from "@/assets/luxury-property-2.jpg";
import prop3 from "@/assets/luxury-property-3.jpg";
import propertyDetail1 from "@/assets/property-detail-1.jpg";

const p = {
  bg: "#FAF8F5", white: "#FFFFFF", text: "#2D2926", muted: "#6B6560",
  light: "#9A938B", accent: "#8B6F47", border: "#E2DCD4", footer: "#2D2926",
};
const font = "'Jost', Helvetica, sans-serif";
const BRAND_NAME = "PRESTIGE ESTATES";

const POSTS: Record<string, any> = {
  "1": { image: propertyDetail1, date: "26 Feb 2026", category: "Lifestyle", title: "An Insider's Guide to Coastal Living in the Mediterranean", author: "Alexandra Morel", readTime: 8, tags: ["Mediterranean", "Coastal", "Lifestyle"], content: `<p>The Mediterranean coast has evolved from a seasonal destination into a strategic lifestyle hub for international buyers seeking year-round luxury.</p><h2>Why the Mediterranean?</h2><p>From Ibiza's bohemian energy to the Costa Blanca's understated elegance, discover why discerning buyers are making the move. The region offers an unparalleled combination of climate, culture, cuisine, and connectivity.</p><p>International schools, world-class healthcare, and excellent transport links make the Mediterranean more than just a holiday destination — it's a place to build a life.</p><h2>Key Markets to Watch</h2><p>Costa del Sol remains the perennial favourite, but emerging areas such as the Costa Tropical and the Balearic Islands offer compelling value propositions for forward-thinking investors.</p><p>With property values showing consistent year-on-year growth and rental yields remaining strong, the Mediterranean continues to attract both lifestyle buyers and strategic investors alike.</p>` },
  "2": { image: prop1, date: "25 Feb 2026", category: "Market Insights", title: "Dual Demand Drives Dubai", author: "James Harrington", readTime: 6, tags: ["Dubai", "Investment", "Market"], content: `<p>The $500K–$1M segment grew 70% year-over-year, emerging as a primary entry point for international investors.</p><h2>Market Overview</h2><p>Dubai's real estate market continues to defy expectations with robust growth across all segments.</p>` },
  "3": { image: prop3, date: "25 Feb 2026", category: "Architecture", title: "A Majestic Alpine Estate Near Zermatt", author: "Sofia Engström", readTime: 5, tags: ["Alpine", "Estate", "Switzerland"], content: `<p>This remarkable historic estate stands as one of Europe's most captivating properties.</p>` },
};

const RELATED = [
  { id: "2", image: prop1, title: "Dual Demand Drives Dubai", category: "Market Insights", date: "25 Feb 2026" },
  { id: "3", image: prop3, title: "A Majestic Alpine Estate Near Zermatt", category: "Architecture", date: "25 Feb 2026" },
  { id: "4", image: heroImg, title: "Caribbean Paradise: Explore Exceptional Properties", category: "Destinations", date: "24 Feb 2026" },
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

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrolled = useContainerScrolled(containerRef);
  const post = POSTS[slug || "1"] || POSTS["1"];

  return (
    <div ref={containerRef} className="flex-1 overflow-auto" style={{ background: p.bg, color: p.text, fontFamily: font }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 transition-all duration-500" style={{ background: scrolled ? `${p.white}f0` : p.white, backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: `1px solid ${p.border}` }}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 h-[60px] lg:h-[68px]">
          <Link to="/blog" className="flex items-center gap-2 text-[13px] tracking-[0.08em] font-light transition-opacity hover:opacity-60" style={{ color: p.muted }}>
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>
          <Link to="/" className="flex flex-col items-center">
            <span className="text-[18px] sm:text-[22px] tracking-[0.35em] font-light" style={{ color: p.text }}>{BRAND_NAME}</span>
          </Link>
          <div className="w-[120px]" />
        </div>
      </nav>

      {/* Hero Image */}
      <div className="relative w-full h-[40vh] md:h-[55vh] overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(45,41,38,0.5) 0%, transparent 60%)" }} />
      </div>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-5 sm:px-6 -mt-20 relative z-10">
        <div className="rounded-sm p-6 md:p-10" style={{ background: p.white }}>
          <div className="flex flex-wrap items-center gap-3 mb-5 text-[11px] font-light" style={{ color: p.light }}>
            <span className="px-3 py-1 text-[9px] tracking-[0.15em] uppercase font-medium" style={{ background: p.bg, color: p.accent }}>{post.category}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime} min read</span>
            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extralight tracking-[0.02em] leading-[1.2] mb-6">{post.title}</h1>
          <div className="w-12 h-[1px] mb-8" style={{ background: p.accent }} />

          {/* Content */}
          <div
            className="prose-custom"
            style={{ fontSize: "15px", lineHeight: 1.9, color: p.muted }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && (
            <div className="mt-10 pt-6 flex flex-wrap items-center gap-2" style={{ borderTop: `1px solid ${p.border}` }}>
              <Tag className="w-3.5 h-3.5" style={{ color: p.light }} />
              {post.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 text-[11px] font-light" style={{ border: `1px solid ${p.border}`, color: p.muted }}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* Related */}
      <section className="max-w-[1200px] mx-auto px-5 sm:px-6 py-16 md:py-24">
        <h2 className="text-xl md:text-2xl font-extralight tracking-[0.04em] text-center mb-10">Related Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {RELATED.filter(r => r.id !== slug).slice(0, 3).map((r) => (
            <Link key={r.id} to={`/blog/${r.id}`} className="group block">
              <div className="relative overflow-hidden aspect-[16/10]">
                <img src={r.image} alt={r.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="pt-3 space-y-1">
                <p className="text-[10px] tracking-[0.15em] uppercase font-medium" style={{ color: p.accent }}>{r.category}</p>
                <h3 className="text-[15px] font-normal leading-[1.35] group-hover:opacity-70 transition-opacity line-clamp-2">{r.title}</h3>
                <p className="text-[11px] font-light" style={{ color: p.light }}>{r.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

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
        .prose-custom h2 { font-size: 22px; font-weight: 300; letter-spacing: 0.02em; margin: 2em 0 0.8em; color: ${p.text}; }
        .prose-custom p { margin-bottom: 1.2em; }
        .prose-custom a { color: ${p.accent}; text-decoration: underline; }
      `}</style>
    </div>
  );
};

export default BlogDetailPage;
