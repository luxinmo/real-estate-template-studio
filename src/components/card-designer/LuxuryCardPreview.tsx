import { Mail } from "lucide-react";
import type { CardDesignConfig } from "./CardDesignerPage";
import propImg from "@/assets/luxury-hero.jpg";

const MOCK = {
  id: 1,
  image: propImg,
  tag: "FOR SALE",
  style: "Contemporary",
  location: "SANTA EULALIA DEL RÍO · IBIZA",
  title: "STUNNING CONTEMPORARY VILLA WITH PANORAMIC SEA VIEWS",
  excerpt: "This exceptional contemporary villa is set on an elevated plot offering uninterrupted panoramic views of the Mediterranean Sea and the island of Formentera...",
  beds: 5,
  baths: 4,
  sqm: 420,
  plot: 1200,
  price: "€4,650,000",
  features: ["Sea Views", "Infinity Pool", "Smart Home", "Garage"],
  galleryCount: 3,
  isNewBuild: false,
};

const LuxuryCardPreview = ({ config }: { config: CardDesignConfig }) => {
  const c = config;
  const isH = c.layout === "horizontal";

  /* Derived sizes that scale proportionally with the config */
  const tagSize = c.badgeSize;         // ~10
  const styleSize = c.badgeSize + 1;   // ~11
  const locationSize = c.badgeSize + 1;// ~11
  const titleFSize = c.titleSize;      // ~18
  const excerptSize = c.bodySize + 1;  // ~13
  const specLabelSize = c.badgeSize;   // ~10
  const specValueSize = c.labelSize + 2;// ~15
  const featureSize = c.badgeSize + 1; // ~11
  const priceSize = c.priceSize;       // ~24

  const cardStyle: React.CSSProperties = {
    fontFamily: c.fontFamily,
    backgroundColor: c.bgColor,
    color: c.textColor,
    borderRadius: c.borderRadius,
    border: `1px solid ${c.borderColor}`,
    overflow: "hidden",
    display: isH ? "grid" : "flex",
    gridTemplateColumns: isH ? "5fr 7fr" : undefined,
    flexDirection: isH ? undefined : "column",
  };

  const infoPad = c.cardPadding + 8; // match the generous padding of the real card

  return (
    <div style={cardStyle}>
      {/* ─── Image ─── */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          height: isH ? "auto" : c.imageHeight,
          minHeight: isH ? 280 : undefined,
        }}
      >
        <img
          src={MOCK.image}
          alt={MOCK.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, transition: "transform 0.7s" }}
        />
        {MOCK.isNewBuild && (
          <span style={{
            position: "absolute", top: 12, left: 12,
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
            color: "#fff", fontSize: tagSize,
            letterSpacing: "0.12em", textTransform: "uppercase",
            fontWeight: 500, padding: "4px 10px",
          }}>
            New Build
          </span>
        )}
        <span style={{
          position: "absolute", bottom: 12, right: 12,
          background: "rgba(0,0,0,0.6)", color: "#fff",
          fontSize: tagSize, padding: "4px 8px", fontWeight: 300,
        }}>
          1/{MOCK.galleryCount}
        </span>
      </div>

      {/* ─── Info ─── */}
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: `${infoPad}px ${infoPad + 4}px`,
      }}>
        <div>
          {/* Tag row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: c.spacingTagRow }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{
                fontSize: tagSize, letterSpacing: "0.18em", textTransform: "uppercase",
                border: `1px solid ${c.textColor}33`, color: `${c.textColor}99`,
                padding: "5px 12px", fontWeight: 500,
              }}>
                {MOCK.tag}
              </span>
              <span style={{ fontSize: styleSize, color: `${c.textColor}73`, fontWeight: 300, fontStyle: "italic" }}>
                {MOCK.style}
              </span>
            </div>
            <Mail style={{ width: 18, height: 18, color: `${c.textColor}4d`, cursor: "pointer" }} />
          </div>

          {/* Location */}
          <p style={{
            fontSize: locationSize, letterSpacing: "0.15em", textTransform: "uppercase",
            color: `${c.textColor}80`, marginBottom: c.spacingLocation,
          }}>
            {MOCK.location}
          </p>

          {/* Title */}
          <h2 style={{
            fontSize: titleFSize,
            fontWeight: c.titleWeight,
            color: c.textColor, lineHeight: 1.35, marginBottom: c.spacingTitle,
          }}>
            {MOCK.title}
          </h2>

          {/* Excerpt */}
          {c.showDescription && (
            <p style={{
              fontSize: excerptSize, color: `${c.textColor}8c`, fontWeight: 300,
              lineHeight: 1.7, marginBottom: c.spacingDescription,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {MOCK.excerpt}
            </p>
          )}

          {/* Specs strip */}
          <div style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: c.spacingSpecs }}>
            {[
              { label: "BEDS", value: String(MOCK.beds) },
              { label: "BATHS", value: String(MOCK.baths) },
              { label: "BUILT", value: `${MOCK.sqm} m²` },
              ...(MOCK.plot ? [{ label: "PLOT", value: `${MOCK.plot.toLocaleString()} m²` }] : []),
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <p style={{
                  fontSize: specLabelSize, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: `${c.textColor}66`, marginBottom: 3,
                }}>{s.label}</p>
                <p style={{ fontSize: specValueSize, color: c.textColor, fontWeight: 300 }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Feature tags with dots */}
          {c.showTags && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {MOCK.features.map((f) => (
                <span key={f} style={{
                  fontSize: featureSize, color: `${c.textColor}80`, fontWeight: 300,
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <span style={{ width: 4, height: 4, borderRadius: 999, background: `${c.textColor}33`, flexShrink: 0 }} />
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        {c.showFooter && (
          <div style={{ marginTop: c.spacingPrice, paddingTop: 18, borderTop: `1px solid ${c.borderColor}` }}>
            <p style={{
              fontSize: priceSize, fontWeight: 300, color: c.textColor,
              fontFamily: "'Georgia', 'Playfair Display', serif",
              letterSpacing: "-0.02em",
            }}>
              {MOCK.price}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LuxuryCardPreview;
