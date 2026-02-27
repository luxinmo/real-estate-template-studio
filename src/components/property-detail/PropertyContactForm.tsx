import { useState, useEffect } from "react";
import { Send, ChevronDown } from "lucide-react";

const COUNTRIES = [
  { code: "ES", flag: "🇪🇸", prefix: "+34", name: "España" },
  { code: "GB", flag: "🇬🇧", prefix: "+44", name: "United Kingdom" },
  { code: "FR", flag: "🇫🇷", prefix: "+33", name: "France" },
  { code: "DE", flag: "🇩🇪", prefix: "+49", name: "Deutschland" },
  { code: "IT", flag: "🇮🇹", prefix: "+39", name: "Italia" },
  { code: "PT", flag: "🇵🇹", prefix: "+351", name: "Portugal" },
  { code: "NL", flag: "🇳🇱", prefix: "+31", name: "Nederland" },
  { code: "BE", flag: "🇧🇪", prefix: "+32", name: "België" },
  { code: "SE", flag: "🇸🇪", prefix: "+46", name: "Sverige" },
  { code: "NO", flag: "🇳🇴", prefix: "+47", name: "Norge" },
  { code: "DK", flag: "🇩🇰", prefix: "+45", name: "Danmark" },
  { code: "CH", flag: "🇨🇭", prefix: "+41", name: "Schweiz" },
  { code: "AT", flag: "🇦🇹", prefix: "+43", name: "Österreich" },
  { code: "PL", flag: "🇵🇱", prefix: "+48", name: "Polska" },
  { code: "RU", flag: "🇷🇺", prefix: "+7", name: "Россия" },
  { code: "US", flag: "🇺🇸", prefix: "+1", name: "United States" },
  { code: "MX", flag: "🇲🇽", prefix: "+52", name: "México" },
  { code: "AR", flag: "🇦🇷", prefix: "+54", name: "Argentina" },
  { code: "CO", flag: "🇨🇴", prefix: "+57", name: "Colombia" },
  { code: "CL", flag: "🇨🇱", prefix: "+56", name: "Chile" },
  { code: "MA", flag: "🇲🇦", prefix: "+212", name: "Maroc" },
  { code: "AE", flag: "🇦🇪", prefix: "+971", name: "UAE" },
  { code: "CN", flag: "🇨🇳", prefix: "+86", name: "China" },
];

const TIMEZONE_COUNTRY_MAP: Record<string, string> = {
  "Europe/Madrid": "ES",
  "Europe/London": "GB",
  "Europe/Paris": "FR",
  "Europe/Berlin": "DE",
  "Europe/Rome": "IT",
  "Europe/Lisbon": "PT",
  "Europe/Amsterdam": "NL",
  "Europe/Brussels": "BE",
  "Europe/Stockholm": "SE",
  "Europe/Oslo": "NO",
  "Europe/Copenhagen": "DK",
  "Europe/Zurich": "CH",
  "Europe/Vienna": "AT",
  "Europe/Warsaw": "PL",
  "Europe/Moscow": "RU",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Los_Angeles": "US",
  "America/Mexico_City": "MX",
  "America/Argentina/Buenos_Aires": "AR",
  "America/Bogota": "CO",
  "America/Santiago": "CL",
  "Africa/Casablanca": "MA",
  "Asia/Dubai": "AE",
  "Asia/Shanghai": "CN",
};

const PropertyContactForm = () => {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchCountry, setSearchCountry] = useState("");
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptComms, setAcceptComms] = useState(false);

  // Detect user timezone → country
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const countryCode = TIMEZONE_COUNTRY_MAP[tz];
      if (countryCode) {
        const found = COUNTRIES.find((c) => c.code === countryCode);
        if (found) setSelectedCountry(found);
      }
    } catch {
      // fallback to ES
    }
  }, []);

  const filteredCountries = searchCountry
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(searchCountry.toLowerCase()) ||
          c.prefix.includes(searchCountry) ||
          c.code.toLowerCase().includes(searchCountry.toLowerCase())
      )
    : COUNTRIES;

  return (
    <div className="rounded-xl border border-border bg-card shadow-card p-6">
      <h3 className="text-base font-semibold text-foreground mb-1">Solicitar información</h3>
      <p className="text-xs text-muted-foreground mb-5">
        Completa el formulario y un agente te contactará en menos de 24h
      </p>

      <div className="space-y-3.5">
        {/* Name */}
        <div>
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
            Nombre completo *
          </label>
          <input
            type="text"
            placeholder="Tu nombre"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-ring transition-shadow"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
            Email *
          </label>
          <input
            type="email"
            placeholder="tu@email.com"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-ring transition-shadow"
          />
        </div>

        {/* Phone with country selector */}
        <div>
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
            Teléfono *
          </label>
          <div className="flex gap-0">
            {/* Country prefix selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setDropdownOpen(!dropdownOpen); setSearchCountry(""); }}
                className="flex items-center gap-1 rounded-l-lg border border-r-0 border-border bg-muted/50 px-2.5 py-2.5 text-[13px] text-foreground hover:bg-accent transition-colors h-full"
              >
                <span className="text-base leading-none">{selectedCountry.flag}</span>
                <span className="text-xs font-medium text-muted-foreground">{selectedCountry.prefix}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute top-full left-0 mt-1 z-50 w-64 max-h-60 overflow-auto rounded-lg border border-border bg-card shadow-lg">
                    <div className="sticky top-0 bg-card p-2 border-b border-border">
                      <input
                        type="text"
                        placeholder="Buscar país..."
                        value={searchCountry}
                        onChange={(e) => setSearchCountry(e.target.value)}
                        className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-[12px] text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-ring"
                        autoFocus
                      />
                    </div>
                    {filteredCountries.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(c);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-accent transition-colors ${
                          selectedCountry.code === c.code ? "bg-accent" : ""
                        }`}
                      >
                        <span className="text-base leading-none">{c.flag}</span>
                        <span className="text-foreground flex-1 text-left">{c.name}</span>
                        <span className="text-xs text-muted-foreground">{c.prefix}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Phone input */}
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="600 123 456"
              className="flex-1 rounded-r-lg border border-border bg-background px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-ring transition-shadow"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
            Mensaje
          </label>
          <textarea
            rows={3}
            placeholder="Me interesa esta propiedad. Me gustaría recibir más información..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none resize-none focus:ring-1 focus:ring-ring transition-shadow"
            defaultValue="Me interesa esta propiedad. Me gustaría recibir más información y concertar una visita."
          />
        </div>

        {/* Consent checkboxes */}
        <div className="space-y-2.5 pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={acceptPrivacy}
              onChange={(e) => setAcceptPrivacy(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border text-primary accent-primary cursor-pointer"
            />
            <span className="text-[12px] text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
              He leído y acepto la{" "}
              <a href="#" className="text-primary underline underline-offset-2 hover:text-primary/80">
                Política de Privacidad
              </a>{" "}
              y el tratamiento de mis datos personales. <span className="text-destructive">*</span>
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={acceptComms}
              onChange={(e) => setAcceptComms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border text-primary accent-primary cursor-pointer"
            />
            <span className="text-[12px] text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
              Acepto recibir comunicaciones comerciales y newsletters sobre propiedades similares.
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          disabled={!acceptPrivacy}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-[13px] font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed mt-1"
        >
          <Send className="h-3.5 w-3.5" />
          Enviar solicitud
        </button>

        <p className="text-[10px] text-muted-foreground/70 text-center leading-relaxed">
          Tus datos están protegidos y no se compartirán con terceros sin tu consentimiento.
        </p>
      </div>
    </div>
  );
};

export default PropertyContactForm;
