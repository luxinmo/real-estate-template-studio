export type LocationLevel = "country" | "province" | "town" | "zone";

export const LEVEL_ORDER: LocationLevel[] = ["country", "province", "town", "zone"];

export const LEVEL_LABELS: Record<LocationLevel, string> = {
  country: "Country",
  province: "Province",
  town: "Town",
  zone: "Zone",
};

export const CHILD_LEVEL: Record<LocationLevel, LocationLevel | null> = {
  country: "province",
  province: "town",
  town: "zone",
  zone: null,
};

export const PARENT_LEVEL: Record<LocationLevel, LocationLevel | null> = {
  country: null,
  province: "country",
  town: "province",
  zone: "town",
};

export interface LocationNode {
  id: string;
  parentId: string | null;
  level: LocationLevel;
  name: string;
  safeName: string;
  names: Record<string, string>;
  slugs: Record<string, string>;
  active: boolean;
  order: number;
  geojson: string | null;
  childrenCount: number;
  description?: string;
  seoTitle?: Record<string, string>;
  seoDescription?: Record<string, string>;
}

export const LANGUAGES = [
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "es", flag: "🇪🇸", label: "Spanish" },
  { code: "fr", flag: "🇫🇷", label: "French" },
  { code: "de", flag: "🇩🇪", label: "German" },
  { code: "ru", flag: "🇷🇺", label: "Russian" },
  { code: "nl", flag: "🇳🇱", label: "Dutch" },
  { code: "pl", flag: "🇵🇱", label: "Polish" },
] as const;

export const LEVEL_COLORS: Record<LocationLevel, string> = {
  country: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  province: "bg-violet-500/10 text-violet-700 border-violet-500/20",
  town: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  zone: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
};
