import { useState, useEffect, useRef } from "react";

const COUNTRIES = [
  { code: "ES", flag: "🇪🇸", prefix: "+34", name: "Spain" },
  { code: "FR", flag: "🇫🇷", prefix: "+33", name: "France" },
  { code: "DE", flag: "🇩🇪", prefix: "+49", name: "Germany" },
  { code: "GB", flag: "🇬🇧", prefix: "+44", name: "United Kingdom" },
  { code: "IT", flag: "🇮🇹", prefix: "+39", name: "Italy" },
  { code: "PT", flag: "🇵🇹", prefix: "+351", name: "Portugal" },
  { code: "US", flag: "🇺🇸", prefix: "+1", name: "United States" },
  { code: "NL", flag: "🇳🇱", prefix: "+31", name: "Netherlands" },
  { code: "BE", flag: "🇧🇪", prefix: "+32", name: "Belgium" },
  { code: "CH", flag: "🇨🇭", prefix: "+41", name: "Switzerland" },
  { code: "AT", flag: "🇦🇹", prefix: "+43", name: "Austria" },
  { code: "SE", flag: "🇸🇪", prefix: "+46", name: "Sweden" },
  { code: "NO", flag: "🇳🇴", prefix: "+47", name: "Norway" },
  { code: "DK", flag: "🇩🇰", prefix: "+45", name: "Denmark" },
  { code: "RU", flag: "🇷🇺", prefix: "+7", name: "Russia" },
  { code: "AE", flag: "🇦🇪", prefix: "+971", name: "UAE" },
  { code: "SA", flag: "🇸🇦", prefix: "+966", name: "Saudi Arabia" },
  { code: "MX", flag: "🇲🇽", prefix: "+52", name: "Mexico" },
  { code: "AR", flag: "🇦🇷", prefix: "+54", name: "Argentina" },
  { code: "BR", flag: "🇧🇷", prefix: "+55", name: "Brazil" },
  { code: "CL", flag: "🇨🇱", prefix: "+56", name: "Chile" },
  { code: "CO", flag: "🇨🇴", prefix: "+57", name: "Colombia" },
  { code: "CN", flag: "🇨🇳", prefix: "+86", name: "China" },
  { code: "JP", flag: "🇯🇵", prefix: "+81", name: "Japan" },
  { code: "IN", flag: "🇮🇳", prefix: "+91", name: "India" },
  { code: "AU", flag: "🇦🇺", prefix: "+61", name: "Australia" },
];

const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  "Europe/Madrid": "ES", "Europe/Paris": "FR", "Europe/Berlin": "DE",
  "Europe/London": "GB", "Europe/Rome": "IT", "Europe/Lisbon": "PT",
  "America/New_York": "US", "America/Chicago": "US", "America/Los_Angeles": "US",
  "Europe/Amsterdam": "NL", "Europe/Brussels": "BE", "Europe/Zurich": "CH",
  "Europe/Vienna": "AT", "Europe/Stockholm": "SE", "Europe/Oslo": "NO",
  "Europe/Copenhagen": "DK", "Asia/Dubai": "AE", "Asia/Riyadh": "SA",
  "America/Mexico_City": "MX", "America/Argentina/Buenos_Aires": "AR",
  "America/Sao_Paulo": "BR", "America/Santiago": "CL", "America/Bogota": "CO",
  "Asia/Shanghai": "CN", "Asia/Tokyo": "JP", "Asia/Kolkata": "IN",
  "Australia/Sydney": "AU",
};

function detectCountry(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TIMEZONE_TO_COUNTRY[tz] || "ES";
  } catch {
    return "ES";
  }
}

function findCountryByPrefix(prefix: string) {
  const sorted = [...COUNTRIES].sort((a, b) => b.prefix.length - a.prefix.length);
  return sorted.find((c) => prefix === c.prefix) || null;
}

interface LuxuryPhoneInputProps {
  className?: string;
}

const LuxuryPhoneInput = ({ className }: LuxuryPhoneInputProps) => {
  const detectedCode = detectCountry();
  const initialCountry = COUNTRIES.find((c) => c.code === detectedCode) || COUNTRIES[0];

  const [country, setCountry] = useState(initialCountry);
  const [prefixValue, setPrefixValue] = useState(initialCountry.prefix);
  const [phone, setPhone] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handlePrefixChange = (val: string) => {
    const cleaned = val.replace(/[^+\d]/g, "");
    if (!cleaned.startsWith("+")) {
      setPrefixValue("+" + cleaned);
    } else {
      setPrefixValue(cleaned);
    }
    const matched = findCountryByPrefix(cleaned.startsWith("+") ? cleaned : "+" + cleaned);
    if (matched) {
      setCountry(matched);
    }
  };

  const selectCountry = (c: typeof COUNTRIES[0]) => {
    setCountry(c);
    setPrefixValue(c.prefix);
    setShowDropdown(false);
    setSearch("");
  };

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.prefix.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`relative ${className || ""}`} ref={dropdownRef}>
      <div className="flex border border-neutral-300 focus-within:border-luxury-black/40 transition-colors duration-300">
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-1 px-3 border-r border-neutral-300 bg-neutral-50/50 hover:bg-neutral-100 transition-colors shrink-0"
        >
          <span className="text-xl leading-none">{country.flag}</span>
          <svg className="w-3.5 h-3.5 text-luxury-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <input
          type="text"
          value={prefixValue}
          onChange={(e) => handlePrefixChange(e.target.value)}
          className="w-[70px] px-2 py-3.5 text-base text-luxury-black bg-transparent focus:outline-none text-center"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          className="flex-1 px-2 py-3.5 text-base text-luxury-black placeholder:text-luxury-black/35 bg-white focus:outline-none"
        />
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-neutral-200 shadow-lg max-h-[240px] overflow-auto">
          <div className="sticky top-0 bg-white border-b border-neutral-100 p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full px-3 py-2.5 text-sm border border-neutral-200 focus:outline-none focus:border-luxury-black/30"
              autoFocus
            />
          </div>
          {filtered.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => selectCountry(c)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-base hover:bg-neutral-50 transition-colors ${
                c.code === country.code ? "bg-neutral-50 font-medium" : "font-light"
              }`}
            >
              <span className="text-xl leading-none">{c.flag}</span>
              <span className="text-luxury-black/80">{c.name}</span>
              <span className="ml-auto text-luxury-black/45 text-sm">{c.prefix}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LuxuryPhoneInput;
