// ── Analytics Mock Data ──
// Simulates a luxury real estate agency in Costa Blanca (~500 properties)

export const countries = [
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
];

export const languages = ["en", "es", "de", "fr", "nl", "ru", "sv"];

export const locations = ["Calpe", "Altea", "Benidorm", "Moraira", "Jávea", "Denia"];

export const propertyTypes = ["Villa", "Apartment", "Penthouse", "Townhouse", "Plot"];

// ── KPIs ──
export const kpis = [
  { label: "Sessions", value: "3,247", change: +12.4, icon: "activity" },
  { label: "Unique Visitors", value: "2,891", change: +8.7, icon: "users" },
  { label: "Pageviews", value: "14,583", change: +15.2, icon: "eye" },
  { label: "Pages / Session", value: "4.49", change: +3.1, icon: "layers" },
  { label: "Avg. Duration", value: "3m 42s", change: -2.3, icon: "clock" },
  { label: "Conversion Rate", value: "2.8%", change: +0.4, icon: "target" },
  { label: "Bounce Rate", value: "34.2%", change: -1.8, icon: "log-out" },
];

// ── Sessions Timeline (30 days) ──
export const sessionsTimeline = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 1, 3 + i);
  return {
    date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    sessions: Math.floor(80 + Math.random() * 60),
    visitors: Math.floor(60 + Math.random() * 50),
  };
});

// ── Top Pages ──
export const topPages = [
  { path: "/properties", views: 4_230, pct: 29 },
  { path: "/properties/mediterranean-villa-sea-views", views: 1_892, pct: 13 },
  { path: "/", views: 1_654, pct: 11 },
  { path: "/properties/luxury-penthouse-altea", views: 1_201, pct: 8 },
  { path: "/contact", views: 987, pct: 7 },
  { path: "/properties/modern-apartment-calpe", views: 876, pct: 6 },
  { path: "/about", views: 654, pct: 4 },
  { path: "/properties/sea-front-villa-moraira", views: 543, pct: 4 },
  { path: "/blog", views: 498, pct: 3 },
  { path: "/properties/penthouse-benidorm-beach", views: 421, pct: 3 },
];

// ── Top Properties ──
export interface MockProperty {
  ref: string;
  name: string;
  location: string;
  type: string;
  price: string;
  views: number;
  contacts: number;
  calls: number;
  shares: number;
  favorites: number;
}

export const topProperties: MockProperty[] = [
  { ref: "4MNL", name: "Mediterranean Villa with Sea Views", location: "Calpe", type: "Villa", price: "€1,850,000", views: 1892, contacts: 47, calls: 18, shares: 34, favorites: 89 },
  { ref: "HHT0", name: "Luxury Penthouse in Altea", location: "Altea", type: "Penthouse", price: "€2,450,000", views: 1201, contacts: 38, calls: 12, shares: 28, favorites: 67 },
  { ref: "KL92", name: "Modern Apartment in Calpe", location: "Calpe", type: "Apartment", price: "€385,000", views: 876, contacts: 31, calls: 9, shares: 19, favorites: 45 },
  { ref: "PQ71", name: "Sea Front Villa Moraira", location: "Moraira", type: "Villa", price: "€3,200,000", views: 543, contacts: 22, calls: 8, shares: 15, favorites: 38 },
  { ref: "AB34", name: "Penthouse Benidorm Beach", location: "Benidorm", type: "Penthouse", price: "€920,000", views: 421, contacts: 19, calls: 7, shares: 12, favorites: 31 },
  { ref: "CD56", name: "Luxury Townhouse Jávea", location: "Jávea", type: "Townhouse", price: "€675,000", views: 387, contacts: 15, calls: 5, shares: 11, favorites: 28 },
  { ref: "EF78", name: "Contemporary Villa Denia", location: "Denia", type: "Villa", price: "€1,150,000", views: 342, contacts: 14, calls: 6, shares: 9, favorites: 24 },
  { ref: "GH90", name: "Golf Resort Apartment", location: "Altea", type: "Apartment", price: "€295,000", views: 298, contacts: 11, calls: 4, shares: 8, favorites: 19 },
  { ref: "IJ12", name: "Beachfront Plot Calpe", location: "Calpe", type: "Plot", price: "€450,000", views: 276, contacts: 9, calls: 3, shares: 7, favorites: 16 },
  { ref: "MN45", name: "Mountain View Villa Altea", location: "Altea", type: "Villa", price: "€1,680,000", views: 254, contacts: 12, calls: 5, shares: 10, favorites: 22 },
];

// ── Device Distribution ──
export const deviceDistribution = [
  { device: "Desktop", sessions: 1_462, pct: 45 },
  { device: "Mobile", sessions: 1_364, pct: 42 },
  { device: "Tablet", sessions: 421, pct: 13 },
];

// ── Contact Channels ──
export const contactChannels = [
  { channel: "Contact Form", count: 87, pct: 42, color: "#C9A96E" },
  { channel: "Phone Call", count: 52, pct: 25, color: "#8B7355" },
  { channel: "Email", count: 41, pct: 20, color: "#6B8E7B" },
  { channel: "WhatsApp", count: 27, pct: 13, color: "#7B9EAE" },
];

// ── Live Visitors ──
export const liveVisitors = [
  { country: "DE", flag: "🇩🇪", lang: "de", device: "Desktop", page: "/properties/mediterranean-villa-sea-views", time: "4m 12s", pages: 6 },
  { country: "GB", flag: "🇬🇧", lang: "en", device: "Mobile", page: "/properties", time: "1m 34s", pages: 3 },
  { country: "NL", flag: "🇳🇱", lang: "nl", device: "Desktop", page: "/properties/luxury-penthouse-altea", time: "7m 02s", pages: 9 },
  { country: "SE", flag: "🇸🇪", lang: "sv", device: "Tablet", page: "/contact", time: "0m 48s", pages: 2 },
  { country: "ES", flag: "🇪🇸", lang: "es", device: "Mobile", page: "/", time: "2m 15s", pages: 4 },
];

// ── Country Breakdown (Audience) ──
export const countryBreakdown = [
  { code: "DE", flag: "🇩🇪", name: "Germany", sessions: 892, conversions: 28, avgTime: "4m 12s", pct: 27.5 },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom", sessions: 724, conversions: 21, avgTime: "3m 45s", pct: 22.3 },
  { code: "NL", flag: "🇳🇱", name: "Netherlands", sessions: 487, conversions: 15, avgTime: "3m 58s", pct: 15.0 },
  { code: "BE", flag: "🇧🇪", name: "Belgium", sessions: 312, conversions: 9, avgTime: "3m 22s", pct: 9.6 },
  { code: "ES", flag: "🇪🇸", name: "Spain", sessions: 289, conversions: 7, avgTime: "2m 51s", pct: 8.9 },
  { code: "FR", flag: "🇫🇷", name: "France", sessions: 198, conversions: 6, avgTime: "3m 10s", pct: 6.1 },
  { code: "SE", flag: "🇸🇪", name: "Sweden", sessions: 156, conversions: 5, avgTime: "4m 33s", pct: 4.8 },
  { code: "NO", flag: "🇳🇴", name: "Norway", sessions: 112, conversions: 4, avgTime: "4m 18s", pct: 3.4 },
  { code: "RU", flag: "🇷🇺", name: "Russia", sessions: 77, conversions: 2, avgTime: "3m 42s", pct: 2.4 },
];

// ── Search Insights ──
export const topSearchLocations = [
  { location: "Calpe", searches: 487 },
  { location: "Altea", searches: 392 },
  { location: "Moraira", searches: 334 },
  { location: "Jávea", searches: 298 },
  { location: "Benidorm", searches: 276 },
  { location: "Denia", searches: 189 },
];

export const topSearchTypes = [
  { type: "Villa", searches: 634 },
  { type: "Apartment", searches: 498 },
  { type: "Penthouse", searches: 287 },
  { type: "Townhouse", searches: 156 },
  { type: "Plot", searches: 89 },
];

export const searchPriceRanges = [
  { range: "€150K – €300K", searches: 312 },
  { range: "€300K – €500K", searches: 487 },
  { range: "€500K – €1M", searches: 534 },
  { range: "€1M – €2M", searches: 298 },
  { range: "€2M – €3.5M", searches: 134 },
];

export const topAmenities = [
  { amenity: "Sea View", searches: 723 },
  { amenity: "Pool", searches: 645 },
  { amenity: "Garage", searches: 412 },
  { amenity: "Garden", searches: 389 },
  { amenity: "Air Conditioning", searches: 334 },
  { amenity: "Terrace", searches: 298 },
];

export const zeroResultSearches = [
  { query: "Castle Costa Blanca", count: 23 },
  { query: "Villa under €100K Moraira", count: 18 },
  { query: "Beachfront penthouse Denia", count: 15 },
  { query: "Farm house Altea", count: 12 },
  { query: "Villa 10 bedrooms Calpe", count: 9 },
];

export const topLocationQueries = [
  { query: "Calpe sea view", count: 145 },
  { query: "Altea old town", count: 98 },
  { query: "Moraira beachfront", count: 87 },
  { query: "Jávea port area", count: 76 },
  { query: "Benidorm poniente", count: 65 },
];

// ── Funnel ──
export const funnelSteps = [
  { step: "Sessions", value: 3247, pct: 100 },
  { step: "Listing View", value: 2_156, pct: 66.4 },
  { step: "Property View", value: 1_423, pct: 43.8 },
  { step: "Started Form", value: 312, pct: 9.6 },
  { step: "Submitted / Called", value: 207, pct: 6.4 },
];

export const funnelByDevice = [
  { device: "Desktop", steps: [1462, 1024, 712, 178, 124] },
  { device: "Mobile", steps: [1364, 876, 534, 98, 62] },
  { device: "Tablet", steps: [421, 256, 177, 36, 21] },
];

// ── Contacts Timeline ──
export const contactsTimeline = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 1, 3 + i);
  return {
    date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    form: Math.floor(2 + Math.random() * 5),
    phone: Math.floor(1 + Math.random() * 3),
    email: Math.floor(0 + Math.random() * 3),
    whatsapp: Math.floor(0 + Math.random() * 2),
  };
});

// ── Traffic Sources ──
export const trafficSources = [
  { source: "Organic Search", sessions: 1_298, pct: 40 },
  { source: "Direct", sessions: 812, pct: 25 },
  { source: "Social Media", sessions: 487, pct: 15 },
  { source: "Referral", sessions: 389, pct: 12 },
  { source: "Paid Search", sessions: 261, pct: 8 },
];

export const newVsReturning = { new: 68, returning: 32 };

// ── Language Breakdown ──
export const languageBreakdown = [
  { lang: "en", label: "English", sessions: 1_124, pct: 34.6 },
  { lang: "de", label: "German", sessions: 892, pct: 27.5 },
  { lang: "nl", label: "Dutch", sessions: 412, pct: 12.7 },
  { lang: "es", label: "Spanish", sessions: 356, pct: 11.0 },
  { lang: "fr", label: "French", sessions: 198, pct: 6.1 },
  { lang: "sv", label: "Swedish", sessions: 156, pct: 4.8 },
  { lang: "ru", label: "Russian", sessions: 77, pct: 2.4 },
];

// ── Conversion by Country ──
export const conversionByCountry = [
  { country: "Germany", code: "DE", contacts: 28, rate: "3.1%" },
  { country: "United Kingdom", code: "GB", contacts: 21, rate: "2.9%" },
  { country: "Netherlands", code: "NL", contacts: 15, rate: "3.1%" },
  { country: "Belgium", code: "BE", contacts: 9, rate: "2.9%" },
  { country: "Spain", code: "ES", contacts: 7, rate: "2.4%" },
  { country: "France", code: "FR", contacts: 6, rate: "3.0%" },
  { country: "Sweden", code: "SE", contacts: 5, rate: "3.2%" },
  { country: "Norway", code: "NO", contacts: 4, rate: "3.6%" },
  { country: "Russia", code: "RU", contacts: 2, rate: "2.6%" },
];

// ── Settings ──
export const botSessions = [
  { ip: "185.23.xx.xx", ua: "AhrefsBot/7.0", sessions: 342, lastSeen: "2 hours ago" },
  { ip: "66.249.xx.xx", ua: "Googlebot/2.1", sessions: 287, lastSeen: "15 min ago" },
  { ip: "157.55.xx.xx", ua: "Bingbot/2.0", sessions: 156, lastSeen: "1 hour ago" },
  { ip: "114.119.xx.xx", ua: "SemrushBot/7", sessions: 98, lastSeen: "3 hours ago" },
  { ip: "46.229.xx.xx", ua: "PetalBot/2.5", sessions: 67, lastSeen: "6 hours ago" },
];

// Properties viewed but never contacted
export const viewedNeverContacted: MockProperty[] = [
  { ref: "VN01", name: "Hillside Villa Benidorm", location: "Benidorm", type: "Villa", price: "€780,000", views: 234, contacts: 0, calls: 0, shares: 5, favorites: 12 },
  { ref: "VN02", name: "Studio Apartment Calpe", location: "Calpe", type: "Apartment", price: "€158,000", views: 198, contacts: 0, calls: 0, shares: 3, favorites: 8 },
  { ref: "VN03", name: "Old Town Townhouse Altea", location: "Altea", type: "Townhouse", price: "€425,000", views: 167, contacts: 0, calls: 0, shares: 2, favorites: 6 },
  { ref: "VN04", name: "Garden Plot Denia", location: "Denia", type: "Plot", price: "€195,000", views: 145, contacts: 0, calls: 0, shares: 1, favorites: 4 },
];
