import type { CardDesignConfig } from "./CardDesignerPage";

type ExportDeviceId = "desktop" | "tablet" | "mobile";

/**
 * Generates a standalone HTML file with inline CSS for the card design.
 * Exports using saved independent configs per device when provided.
 */
export function generateHtmlExport(
  config: CardDesignConfig,
  cardType: "crm" | "luxury",
  deviceConfigs?: Partial<Record<ExportDeviceId, CardDesignConfig>>,
): string {
  const desktop = deviceConfigs?.desktop ?? config;
  const tablet = deviceConfigs?.tablet ?? desktop;
  const mobile = deviceConfigs?.mobile ?? desktop;

  const c = desktop;
  const isLuxury = cardType === "luxury";
  const priceFontFamily = isLuxury ? "'Georgia', 'Playfair Display', serif" : c.fontFamily;

  const desktopGrid = c.layout === "horizontal" ? "5fr 7fr" : "1fr";
  const tabletGrid = tablet.layout === "horizontal" ? "5fr 7fr" : "1fr";
  const mobileGrid = mobile.layout === "horizontal" ? "5fr 7fr" : "1fr";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Property Card – ${cardType.toUpperCase()}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: '${c.fontFamily}', sans-serif;
      background: #f4f4f5;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 40px 20px;
      min-height: 100vh;
    }

    .card {
      background: ${c.bgColor};
      color: ${c.textColor};
      border-radius: ${c.borderRadius}px;
      border: 1px solid ${c.borderColor};
      overflow: hidden;
      max-width: 900px;
      width: 100%;
      display: grid;
      grid-template-columns: ${desktopGrid};
    }

    .card-image {
      position: relative;
      overflow: hidden;
      min-height: ${c.imageHeight}px;
    }
    .card-image img {
      width: 100%; height: 100%;
      object-fit: cover;
      position: absolute; inset: 0;
      transition: transform 0.7s;
    }
    .card:hover .card-image img { transform: scale(1.05); }

    .card-image .badge {
      position: absolute; top: 12px; left: 12px;
      background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
      color: #fff; font-size: ${c.badgeSize}px;
      letter-spacing: 0.12em; text-transform: uppercase;
      font-weight: 500; padding: 4px 10px;
    }
    .card-image .counter {
      position: absolute; bottom: 12px; right: 12px;
      background: rgba(0,0,0,0.6); color: #fff;
      font-size: ${c.badgeSize}px; padding: 4px 8px; font-weight: 300;
    }

    .card-info {
      display: flex; flex-direction: column; justify-content: space-between;
      padding: ${c.cardPadding + 8}px ${c.cardPadding + 12}px;
    }

    .tag-row {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: ${c.spacingTagRow}px;
    }
    .tag-row .tags { display: flex; align-items: center; gap: 12px; }
    .tag-label {
      font-size: ${c.badgeSize}px; letter-spacing: 0.18em; text-transform: uppercase;
      border: 1px solid ${c.textColor}33; color: ${c.textColor}99;
      padding: 5px 12px; font-weight: 500;
    }
    .tag-style {
      font-size: ${c.badgeSize + 1}px; color: ${c.textColor}73;
      font-weight: 300; font-style: italic;
    }
    .mail-icon { width: 18px; height: 18px; color: ${c.textColor}4d; cursor: pointer; }

    .location {
      font-size: ${c.badgeSize + 1}px; letter-spacing: 0.15em;
      text-transform: uppercase; color: ${c.textColor}80; margin-bottom: ${c.spacingLocation}px;
    }

    .title {
      font-size: ${c.titleSize}px; font-weight: ${c.titleWeight};
      color: ${c.textColor}; line-height: 1.35; margin-bottom: ${c.spacingTitle}px;
    }

    .excerpt {
      font-size: ${c.bodySize + 1}px; color: ${c.textColor}8c; font-weight: 300;
      line-height: 1.7; margin-bottom: ${c.spacingDescription}px;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }

    .specs { display: flex; align-items: center; gap: 28px; margin-bottom: ${c.spacingSpecs}px; }
    .spec { text-align: center; }
    .spec-label {
      font-size: ${c.badgeSize}px; letter-spacing: 0.1em; text-transform: uppercase;
      color: ${c.textColor}66; margin-bottom: 3px;
    }
    .spec-value { font-size: ${c.labelSize + 2}px; color: ${c.textColor}; font-weight: 300; }

    .price-row {
      margin-top: ${c.spacingPrice}px; padding-top: 18px;
      border-top: 1px solid ${c.borderColor};
    }
    .price {
      font-size: ${c.priceSize}px; font-weight: 300;
      color: ${c.textColor}; font-family: ${priceFontFamily};
      letter-spacing: -0.02em;
    }

    /* ── Tablet ── */
    @media (max-width: 768px) {
      .card {
        border-radius: ${tablet.borderRadius}px;
        border-color: ${tablet.borderColor};
        background: ${tablet.bgColor};
        color: ${tablet.textColor};
        grid-template-columns: ${tabletGrid};
      }
      .card-image { min-height: ${tablet.imageHeight}px; }
      .card-info { padding: ${tablet.cardPadding + 8}px ${tablet.cardPadding + 12}px; }
      .tag-row { margin-bottom: ${tablet.spacingTagRow}px; }
      .location { font-size: ${tablet.badgeSize + 1}px; margin-bottom: ${tablet.spacingLocation}px; }
      .title { font-size: ${tablet.titleSize}px; margin-bottom: ${tablet.spacingTitle}px; }
      .excerpt { font-size: ${tablet.bodySize + 1}px; margin-bottom: ${tablet.spacingDescription}px; }
      .specs { margin-bottom: ${tablet.spacingSpecs}px; }
      .price-row { margin-top: ${tablet.spacingPrice}px; border-top-color: ${tablet.borderColor}; }
      .price { font-size: ${tablet.priceSize}px; }
    }

    /* ── Mobile ── */
    @media (max-width: 480px) {
      .card {
        border-radius: ${mobile.borderRadius}px;
        border-color: ${mobile.borderColor};
        background: ${mobile.bgColor};
        color: ${mobile.textColor};
        grid-template-columns: ${mobileGrid};
      }
      .card-image { min-height: ${mobile.imageHeight}px; }
      .card-info { padding: ${mobile.cardPadding + 8}px ${mobile.cardPadding + 12}px; }
      .tag-row { margin-bottom: ${mobile.spacingTagRow}px; }
      .location { font-size: ${mobile.badgeSize + 1}px; margin-bottom: ${mobile.spacingLocation}px; }
      .title { font-size: ${mobile.titleSize}px; margin-bottom: ${mobile.spacingTitle}px; }
      .excerpt { font-size: ${mobile.bodySize + 1}px; margin-bottom: ${mobile.spacingDescription}px; }
      .specs { gap: 16px; margin-bottom: ${mobile.spacingSpecs}px; }
      .price-row { margin-top: ${mobile.spacingPrice}px; border-top-color: ${mobile.borderColor}; }
      .price { font-size: ${mobile.priceSize}px; }
    }
  </style>
</head>
<body>
  <article class="card">
    <div class="card-image">
      <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80" alt="Property" />
      <span class="counter">1/3</span>
    </div>
    <div class="card-info">
      <div>
        <div class="tag-row">
          <div class="tags">
            <span class="tag-label">FOR SALE</span>
            <span class="tag-style">Contemporary</span>
          </div>
          <svg class="mail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        </div>
        <p class="location">SANTA EULALIA DEL RÍO · IBIZA</p>
        <h2 class="title">STUNNING CONTEMPORARY VILLA WITH PANORAMIC SEA VIEWS</h2>
        ${c.showDescription ? `<p class="excerpt">This exceptional contemporary villa is set on an elevated plot offering uninterrupted panoramic views of the Mediterranean Sea and the island of Formentera...</p>` : ""}
        <div class="specs">
          <div class="spec"><p class="spec-label">BEDS</p><p class="spec-value">5</p></div>
          <div class="spec"><p class="spec-label">BATHS</p><p class="spec-value">4</p></div>
          <div class="spec"><p class="spec-label">BUILT</p><p class="spec-value">420 m²</p></div>
          <div class="spec"><p class="spec-label">PLOT</p><p class="spec-value">1,200 m²</p></div>
        </div>
      </div>
      ${c.showFooter ? `<div class="price-row"><p class="price">€4,650,000</p></div>` : ""}
    </div>
  </article>
</body>
</html>`;
}
