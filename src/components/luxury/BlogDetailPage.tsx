import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, User, Tag, Instagram, Linkedin, MessageCircle, Facebook, Twitter, Share2, ChevronUp } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import heroImg from "@/assets/luxury-hero.jpg";
import prop1 from "@/assets/luxury-property-1.jpg";
import prop2 from "@/assets/luxury-property-2.jpg";
import prop3 from "@/assets/luxury-property-3.jpg";
import propertyDetail1 from "@/assets/property-detail-1.jpg";
import propertyDetail2 from "@/assets/property-detail-2.jpg";
import propertyDetail3 from "@/assets/property-detail-3.jpg";

const p = {
  bg: "#FAF8F5", white: "#FFFFFF", text: "#2D2926", muted: "#6B6560",
  light: "#9A938B", accent: "#8B6F47", border: "#E2DCD4", footer: "#2D2926",
};
const font = "'Jost', Helvetica, sans-serif";
const BRAND_NAME = "PRESTIGE ESTATES";

const POSTS: Record<string, any> = {
  "1": {
    image: propertyDetail1,
    date: "26 Feb 2026",
    category: "Lifestyle",
    title: "Inside the Iconic Homes of the Obamas, Emma Stone, Kris Jenner and Sean Connery — Now on the Market",
    subtitle: "A remarkable collection of celebrity residences has quietly appeared on the global property market, offering rare glimpses into some of the most prestigious addresses in the world.",
    author: "Alexandra Morel",
    readTime: 8,
    tags: ["Mediterranean", "Coastal", "Lifestyle"],
    content: `
      <p>The Mediterranean coast has evolved from a seasonal destination into a strategic lifestyle hub for international buyers seeking year-round luxury. A select number of high-profile residences have entered the market, each offering its own unique narrative of architectural ambition and cultural significance.</p>

      <div class="article-property">
        <img src="${propertyDetail2}" alt="Estate exterior" />
        <span class="img-caption">The Riviera estate, originally built in the 1920s, features panoramic sea views</span>
      </div>

      <h2>Obama's Martha's Vineyard Retreat</h2>
      <div class="property-details">
        <div class="detail-row"><span class="detail-label">Price</span><span class="detail-value">$22,500,000</span></div>
        <div class="detail-row"><span class="detail-label">Location</span><span class="detail-value">Edgartown, Massachusetts</span></div>
        <div class="detail-row"><span class="detail-label">Listing Agent</span><span class="detail-value">Tom Wallace, LandVest</span></div>
      </div>

      <p>The Obamas' sprawling compound on Martha's Vineyard represents the pinnacle of understated American luxury. Set across nearly 30 acres of manicured grounds, the property offers absolute privacy while maintaining proximity to the island's renowned cultural scene.</p>

      <h2>Emma Stone's Austin Sanctuary</h2>
      <div class="property-details">
        <div class="detail-row"><span class="detail-label">Price</span><span class="detail-value">$3,995,000</span></div>
        <div class="detail-row"><span class="detail-label">Location</span><span class="detail-value">Austin, Texas</span></div>
        <div class="detail-row"><span class="detail-label">Listing Agent</span><span class="detail-value">Compass Austin</span></div>
      </div>

      <div class="article-property">
        <img src="${propertyDetail3}" alt="Modern interior" />
        <span class="img-caption">The open-plan living space with floor-to-ceiling windows overlooking the gardens</span>
      </div>

      <p>Academy Award winner Emma Stone's contemporary retreat in Austin showcases the perfect marriage of modern architecture and natural surroundings. The residence features sustainably sourced materials throughout and a design philosophy that blurs the boundary between indoor and outdoor living.</p>

      <h2>Kris Jenner's Hidden Hills Mansion</h2>

      <p>Media mogul Kris Jenner has listed her meticulously renovated Hidden Hills estate, a property that has served as a backdrop for some of television's most recognizable moments. The grounds include an Olympic-sized pool, a full production-ready entertainment wing, and landscaping designed by a Chelsea Flower Show gold medallist.</p>

      <h2>Extraordinary Celebrity Homes on the Market</h2>

      <div class="article-property">
        <img src="${prop1}" alt="Aerial view" />
        <span class="img-caption">Properties span from the Mediterranean coastline to the Swiss Alps</span>
      </div>

      <p>These properties represent far more than bricks and mortar — they are cultural artefacts, each telling the story of its famous former occupant while offering new owners the chance to write their own chapter in these storied addresses.</p>
    `,
  },
  "2": { image: prop1, date: "25 Feb 2026", category: "Market Insights", title: "Dual Demand Drives Dubai: The Emirate Welcomes Fresh Buyers Without Losing Its Ultra-Prime Edge", subtitle: "The $500K–$1M segment grew 70% year-over-year, emerging as a primary entry point for international investors.", author: "James Harrington", readTime: 6, tags: ["Dubai", "Investment", "Market"], content: `<p>Dubai's real estate market continues to defy expectations with robust growth across all segments.</p><h2>Market Overview</h2><p>The emirate's strategic positioning between East and West, combined with favourable tax policies and world-class infrastructure, continues to attract both lifestyle buyers and strategic investors.</p><div class="article-property"><img src="${prop2}" alt="Dubai skyline" /><span class="img-caption">Dubai Marina skyline at sunset</span></div><p>Key developments in the Palm Jumeirah and Downtown districts continue to set new benchmarks for luxury living in the region.</p>` },
  "3": { image: prop3, date: "25 Feb 2026", category: "Architecture", title: "A Majestic Alpine Estate Spanning 130 Hectares of Private Parkland Near Zermatt", subtitle: "This remarkable historic estate stands as one of Europe's most captivating properties.", author: "Sofia Engström", readTime: 5, tags: ["Alpine", "Estate", "Switzerland"], content: `<p>Nestled in the shadow of the Matterhorn, this extraordinary property combines centuries of Swiss heritage with contemporary luxury amenities.</p><div class="article-property"><img src="${heroImg}" alt="Alpine estate" /><span class="img-caption">The estate grounds with the Matterhorn visible in the background</span></div><h2>A Legacy in Stone</h2><p>Originally constructed in the 18th century as a hunting lodge, the property has been meticulously restored and expanded over generations.</p>` },
};

const TRENDING = [
  { id: "2", image: prop1, title: "Dual Demand Drives Dubai", category: "Market Insights", date: "25 Feb 2026" },
  { id: "3", image: prop3, title: "A Majestic Alpine Estate Near Zermatt", category: "Architecture", date: "25 Feb 2026" },
  { id: "4", image: heroImg, title: "Caribbean Paradise: Explore Exceptional Properties", category: "Destinations", date: "24 Feb 2026" },
  { id: "5", image: prop2, title: "European Waterfront Properties as Safe Investment", category: "Investment", date: "22 Feb 2026" },
];

const NAV_LEFT = ["Home", "Properties", "Rentals"];
const NAV_RIGHT = ["About", "Guides & Blog", "Contact"];
const CATEGORIES_NAV = ["Lifestyle", "Market Insights", "Architecture", "Investment", "Destinations", "Guides"];

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

  const scrollToTop = () => containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div ref={containerRef} className="flex-1 overflow-auto" style={{ background: p.white, color: p.text, fontFamily: font }}>

      {/* ─── TOP BAR ─── */}
      <div className="text-center py-1.5 text-[10px] tracking-[0.15em] uppercase font-light" style={{ background: p.bg, color: p.light, borderBottom: `1px solid ${p.border}` }}>
        Exclusive Access to Off-Market Properties — <Link to="/register" className="underline" style={{ color: p.accent }}>Join The Private List</Link>
      </div>

      {/* ─── NAVBAR ─── */}
      <nav className="sticky top-0 z-50 transition-all duration-500" style={{ background: scrolled ? `${p.white}f0` : p.white, backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: `1px solid ${p.border}` }}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 h-[56px] lg:h-[64px]">
          <div className="hidden lg:flex items-center gap-7">
            {NAV_LEFT.map((l) => (
              <Link key={l} to={l === "Home" ? "/" : l === "Properties" ? "/properties" : "#"} className="text-[12px] tracking-[0.12em] uppercase font-light transition-opacity hover:opacity-60" style={{ color: p.text }}>{l}</Link>
            ))}
          </div>
          <Link to="/" className="flex flex-col items-center">
            <span className="text-[12px] tracking-[0.2em] font-light" style={{ color: p.light }}>The Journal</span>
            <span className="text-[18px] sm:text-[22px] tracking-[0.35em] font-light -mt-0.5" style={{ color: p.text }}>{BRAND_NAME}</span>
          </Link>
          <div className="hidden lg:flex items-center gap-7">
            {NAV_RIGHT.map((l) => (
              <Link key={l} to={l === "Guides & Blog" ? "/blog" : "#"} className="text-[12px] tracking-[0.12em] uppercase font-light transition-opacity hover:opacity-60" style={{ color: p.text }}>{l}</Link>
            ))}
          </div>
        </div>

        {/* Category bar */}
        <div style={{ borderTop: `1px solid ${p.border}` }}>
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-center gap-6 overflow-x-auto h-[40px]">
            {CATEGORIES_NAV.map((cat) => (
              <Link key={cat} to="/blog" className="text-[11px] tracking-[0.1em] uppercase font-light whitespace-nowrap transition-opacity hover:opacity-60" style={{ color: p.muted }}>{cat}</Link>
            ))}
          </div>
        </div>
      </nav>

      {/* ─── ARTICLE HEADER ─── */}
      <header className="max-w-4xl mx-auto px-5 sm:px-6 pt-12 md:pt-20 pb-6 md:pb-10 text-center">
        <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-5" style={{ color: p.accent }}>{post.category}</p>
        <h1 className="text-[28px] md:text-[42px] lg:text-[48px] font-extralight leading-[1.15] tracking-[0.01em] mx-auto max-w-3xl" style={{ fontFamily: "'Jost', serif" }}>
          {post.title}
        </h1>
        {post.subtitle && (
          <p className="text-[14px] md:text-[15px] font-light leading-[1.7] mt-5 max-w-2xl mx-auto" style={{ color: p.muted }}>
            {post.subtitle}
          </p>
        )}
        <div className="flex items-center justify-center gap-4 mt-6 text-[11px] font-light" style={{ color: p.light }}>
          <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime} min read</span>
        </div>
      </header>

      {/* ─── HERO IMAGE ─── */}
      <div className="max-w-5xl mx-auto px-5 sm:px-6 mb-10 md:mb-14">
        <div className="relative overflow-hidden aspect-[16/9]">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
        <p className="text-[11px] font-light mt-2 text-right" style={{ color: p.light }}>Photo: Prestige Estates</p>
      </div>

      {/* ─── ARTICLE BODY + SIDEBAR ─── */}
      <div className="max-w-5xl mx-auto px-5 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_60px] gap-8">

          {/* Content */}
          <article className="max-w-[720px] mx-auto lg:mx-0">
            <div
              className="blog-article-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && (
              <div className="mt-12 pt-6 flex flex-wrap items-center gap-2" style={{ borderTop: `1px solid ${p.border}` }}>
                <Tag className="w-3.5 h-3.5" style={{ color: p.light }} />
                {post.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 text-[11px] font-light" style={{ border: `1px solid ${p.border}`, color: p.muted }}>{tag}</span>
                ))}
              </div>
            )}

            {/* Author box */}
            <div className="mt-8 p-6 flex items-start gap-4" style={{ background: p.bg }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-[14px] font-light" style={{ background: p.border, color: p.text }}>
                {post.author?.split(" ").map((n: string) => n[0]).join("")}
              </div>
              <div>
                <p className="text-[13px] font-medium">{post.author}</p>
                <p className="text-[12px] font-light mt-0.5" style={{ color: p.muted }}>Senior Editor at {BRAND_NAME}</p>
              </div>
            </div>
          </article>

          {/* Floating social sidebar */}
          <aside className="hidden lg:flex flex-col items-center gap-3 sticky top-[160px] self-start pt-4">
            {[Facebook, Twitter, Linkedin, Instagram, Share2].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ border: `1px solid ${p.border}`, color: p.muted }}>
                <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
            ))}
            <div className="w-[1px] h-6 my-1" style={{ background: p.border }} />
            <span className="text-[9px] tracking-[0.1em] uppercase font-light" style={{ color: p.light, writingMode: "vertical-lr" }}>Share</span>
          </aside>
        </div>
      </div>

      {/* ─── NEWSLETTER CTA ─── */}
      <section className="mt-16 md:mt-24" style={{ background: p.footer }}>
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-8">
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase font-light mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>The Private List</p>
            <h3 className="text-[22px] md:text-[26px] font-extralight tracking-[0.02em]" style={{ color: p.white }}>Join Our Inside Knowledge</h3>
            <p className="text-[13px] font-light mt-2 max-w-md" style={{ color: "rgba(255,255,255,0.5)" }}>Receive exclusive off-market listings, market insights and invitations to private viewings.</p>
          </div>
          <div className="flex gap-0">
            <input type="email" placeholder="Your email address" className="px-4 py-3 text-[13px] w-[240px] focus:outline-none" style={{ background: "rgba(255,255,255,0.08)", border: `1px solid rgba(255,255,255,0.15)`, color: p.white }} />
            <button className="px-6 py-3 text-[11px] tracking-[0.15em] uppercase font-medium" style={{ background: p.accent, color: p.white }}>Subscribe</button>
          </div>
        </div>
      </section>

      {/* ─── TRENDING IN THE JOURNAL ─── */}
      <section className="py-14 md:py-20" style={{ background: p.bg }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <h2 className="text-[13px] tracking-[0.15em] uppercase font-medium mb-8" style={{ color: p.text }}>Trending in The Journal</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {TRENDING.filter(r => r.id !== slug).slice(0, 4).map((r) => (
              <Link key={r.id} to={`/blog/${r.id}`} className="group block">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img src={r.image} alt={r.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="pt-3 space-y-1">
                  <p className="text-[9px] tracking-[0.15em] uppercase font-medium" style={{ color: p.accent }}>{r.category}</p>
                  <h3 className="text-[13px] font-normal leading-[1.35] group-hover:opacity-70 transition-opacity line-clamp-2">{r.title}</h3>
                  <p className="text-[11px] font-light" style={{ color: p.light }}>{r.date}</p>
                </div>
              </Link>
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
              { title: "Company", items: ["About Us", "Careers", "Press", "Contact"] },
              { title: "Legal", items: ["Privacy Policy", "Terms", "Cookies", "Sitemap"] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>{col.title}</p>
                {col.items.map((item) => (
                  <a key={item} href="#" className="block text-[12px] font-light py-1 transition-opacity hover:opacity-70" style={{ color: "rgba(255,255,255,0.6)" }}>{item}</a>
                ))}
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
        .blog-article-content { font-size: 15px; line-height: 1.9; color: ${p.muted}; }
        .blog-article-content h2 { font-size: 22px; font-weight: 300; letter-spacing: 0.02em; margin: 2.5em 0 0.8em; color: ${p.text}; font-family: 'Jost', serif; }
        .blog-article-content p { margin-bottom: 1.4em; }
        .blog-article-content a { color: ${p.accent}; text-decoration: underline; }
        .blog-article-content .article-property { margin: 2em 0; }
        .blog-article-content .article-property img { width: 100%; aspect-ratio: 16/10; object-fit: cover; }
        .blog-article-content .img-caption { display: block; font-size: 11px; color: ${p.light}; margin-top: 6px; font-weight: 300; }
        .blog-article-content .property-details { margin: 1em 0 1.5em; padding: 16px 20px; background: ${p.bg}; }
        .blog-article-content .detail-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid ${p.border}; font-size: 13px; }
        .blog-article-content .detail-row:last-child { border-bottom: none; }
        .blog-article-content .detail-label { color: ${p.light}; font-weight: 300; }
        .blog-article-content .detail-value { color: ${p.text}; font-weight: 400; }
      `}</style>
    </div>
  );
};

export default BlogDetailPage;
