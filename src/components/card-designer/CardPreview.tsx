import { MapPin, Bed, Bath, Maximize, Star, Tag, Globe, Calendar, TrendingDown, Handshake, Crown, Sparkles, EyeOff } from "lucide-react";
import type { CardDesignConfig } from "./CardDesignerPage";
import propertyImg from "@/assets/property-1.jpg";

const MOCK = {
  id: 1,
  image: propertyImg,
  title: "Villa Contemporánea con Vistas al Mar",
  price: "€1.250.000",
  previousPrice: "€1.400.000",
  location: "Marbella, Málaga, Costa del Sol",
  beds: 4,
  baths: 3,
  sqft: "320",
  status: "Disponible",
  type: "Villa",
  operacion: "Venta",
  reference: "REF-0042",
  rating: 4,
  description: "Espectacular villa de diseño contemporáneo con amplias terrazas, piscina infinity y vistas panorámicas al Mediterráneo. Acabados de primera calidad.",
  builtArea: "320",
  plotArea: "1.200",
  tags: ["Piscina", "Vistas mar", "Garaje"],
  isExclusive: true,
  collaboration: true,
  collaborationAgency: "Costa Sol Realty",
  webFeatured: true,
  createdAt: "15.01.2026",
  updatedAt: "27.02.2026",
};

const statusStyles: Record<string, { dot: string; text: string; bg: string }> = {
  Disponible: { dot: "#10b981", text: "#047857", bg: "#ecfdf5" },
};

const CardPreview = ({ config }: { config: CardDesignConfig }) => {
  const c = config;
  const st = statusStyles.Disponible;
  const isH = c.layout === "horizontal";

  const cardStyle: React.CSSProperties = {
    fontFamily: c.fontFamily,
    backgroundColor: c.bgColor,
    color: c.textColor,
    borderRadius: c.borderRadius,
    border: `1px solid ${c.borderColor}`,
    overflow: "hidden",
  };

  const detailStyle: React.CSSProperties = {
    padding: c.cardPadding,
    gap: c.cardGap,
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
  };

  return (
    <div style={cardStyle} className="shadow-card">
      <div style={{ display: "flex", flexDirection: isH ? "row" : "column" }}>
        {/* Image */}
        <div
          style={{
            width: isH ? c.imageWidth : "100%",
            height: isH ? "auto" : c.imageHeight,
            minHeight: isH ? c.imageHeight : undefined,
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <img
            src={MOCK.image}
            alt={MOCK.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
          />
          <span style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: c.badgeSize, padding: "2px 8px", borderRadius: 4 }}>
            1/12
          </span>
          {MOCK.isExclusive && (
            <span style={{ position: "absolute", top: 10, left: 10, background: "rgba(245,158,11,0.9)", color: "#fff", fontSize: c.badgeSize - 1, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", padding: "3px 8px", borderRadius: 4, display: "flex", alignItems: "center", gap: 4 }}>
              <Crown style={{ width: c.badgeSize + 2, height: c.badgeSize + 2 }} />
              Exclusiva
            </span>
          )}
        </div>

        {/* Details */}
        <div style={detailStyle}>
          {/* Top row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: c.bodySize, color: c.mutedColor, fontFamily: "monospace" }}>{MOCK.reference}</span>
              {c.showRating && (
                <div style={{ display: "flex", gap: 1 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} style={{ width: c.bodySize, height: c.bodySize, color: i < MOCK.rating ? "#fbbf24" : `${c.mutedColor}33`, fill: i < MOCK.rating ? "#fbbf24" : "none" }} />
                  ))}
                </div>
              )}
              {c.showBadges && (
                <>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 999, background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "2px 8px", fontSize: c.badgeSize, fontWeight: 500, color: "#047857" }}>
                    <Handshake style={{ width: c.badgeSize + 2, height: c.badgeSize + 2 }} />
                    MLS - {MOCK.collaborationAgency}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 999, background: "#fffbeb", border: "1px solid #fde68a", padding: "2px 8px", fontSize: c.badgeSize, fontWeight: 500, color: "#b45309" }}>
                    <Sparkles style={{ width: c.badgeSize + 2, height: c.badgeSize + 2 }} />
                    Destacado
                  </span>
                </>
              )}
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: c.bodySize, fontWeight: 500, borderRadius: 999, padding: "4px 10px", background: st.bg, color: st.text }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: st.dot }} />
              {MOCK.status}
            </span>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: c.priceSize, fontWeight: 700, letterSpacing: "-0.02em", color: c.textColor }}>{MOCK.price}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: c.bodySize, color: "#ef4444", fontWeight: 500 }}>
              <TrendingDown style={{ width: c.bodySize + 2, height: c.bodySize + 2 }} />
              <span style={{ textDecoration: "line-through", color: `${c.mutedColor}99` }}>{MOCK.previousPrice}</span>
            </span>
            <span style={{ fontSize: c.badgeSize + 1, color: c.mutedColor, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{MOCK.operacion}</span>
          </div>

          {/* Location */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <MapPin style={{ width: c.labelSize, height: c.labelSize, color: c.mutedColor }} strokeWidth={1.5} />
            <span style={{ fontSize: c.labelSize, color: c.mutedColor }}>{MOCK.location}</span>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: c.labelSize, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, color: c.mutedColor }}>
              <Bed style={{ width: c.labelSize + 1, height: c.labelSize + 1 }} strokeWidth={1.5} />
              <span style={{ fontWeight: 500, color: c.textColor }}>{MOCK.beds}</span> hab.
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, color: c.mutedColor }}>
              <Bath style={{ width: c.labelSize + 1, height: c.labelSize + 1 }} strokeWidth={1.5} />
              <span style={{ fontWeight: 500, color: c.textColor }}>{MOCK.baths}</span> baños
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, color: c.mutedColor }}>
              <Maximize style={{ width: c.labelSize + 1, height: c.labelSize + 1 }} strokeWidth={1.5} />
              <span style={{ fontWeight: 500, color: c.textColor }}>{MOCK.builtArea}</span> m²
            </span>
            <span style={{ color: c.mutedColor }}>
              Parcela <span style={{ fontWeight: 500, color: c.textColor }}>{MOCK.plotArea}</span> m²
            </span>
          </div>

          {/* Description */}
          {c.showDescription && (
            <p style={{ fontSize: c.bodySize, color: c.mutedColor, lineHeight: 1.6, fontStyle: "italic", maxWidth: 600, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {MOCK.description}
            </p>
          )}

          {/* Tags */}
          {c.showTags && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: "auto", paddingTop: 6 }}>
              {MOCK.tags.map((tag) => (
                <span key={tag} style={{ display: "inline-flex", alignItems: "center", borderRadius: 6, border: `1px solid ${c.borderColor}`, background: `${c.mutedColor}0a`, padding: "2px 8px", fontSize: c.badgeSize, fontWeight: 600, color: c.textColor }}>
                  {tag}
                </span>
              ))}
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: c.badgeSize, color: c.accentColor, cursor: "pointer" }}>
                <Tag style={{ width: c.badgeSize + 2, height: c.badgeSize + 2 }} />
                Etiqueta
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {c.showFooter && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `8px ${c.cardPadding}px`, borderTop: `1px solid ${c.borderColor}`, background: `${c.mutedColor}08`, fontSize: c.badgeSize + 1, color: c.mutedColor, flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Calendar style={{ width: c.badgeSize + 2, height: c.badgeSize + 2 }} />
              {MOCK.createdAt}
            </span>
            <span>Act. {MOCK.updatedAt}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ cursor: "pointer" }}>Leads (0)</span>
            <span style={{ cursor: "pointer" }}>Visitas (0)</span>
            <span style={{ cursor: "pointer" }}>Ofertas</span>
            {c.showPortals && (
              <>
                <span style={{ color: `${c.mutedColor}44` }}>|</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                  <Globe style={{ width: c.badgeSize + 2, height: c.badgeSize + 2 }} />
                  4 activos
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardPreview;
