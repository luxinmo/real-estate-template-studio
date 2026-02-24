import { useState } from "react";

const languages = [
  { code: "ES", flag: "🇪🇸" },
  { code: "EN", flag: "🇬🇧" },
  { code: "FR", flag: "🇫🇷" },
  { code: "DE", flag: "🇩🇪" },
  { code: "RU", flag: "🇷🇺" },
  { code: "NL", flag: "🇳🇱" },
  { code: "PL", flag: "🇵🇱" },
];

const PropertyDescription = () => {
  const [lang, setLang] = useState("ES");

  return (
    <div className="rounded-xl border border-border bg-card shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Descripción</h3>
        <div className="flex gap-1">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                lang === l.code
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {l.flag} {l.code}
            </button>
          ))}
        </div>
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-3">
        Apartamento con vistas al mar en Altea
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Espectacular apartamento en 4ª planta con impresionantes vistas panorámicas al mar Mediterráneo y a la montaña. 
        Situado en una de las mejores zonas residenciales de Altea, este inmueble cuenta con 85 m² útiles distribuidos 
        en 2 amplios dormitorios, 1 baño completo reformado, cocina americana totalmente equipada y un luminoso 
        salón-comedor con acceso directo a una terraza de 15 m² donde podrá disfrutar de atardeceres inolvidables.
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed mt-3">
        La urbanización dispone de piscina comunitaria, amplias zonas ajardinadas, parking privado y acceso controlado 
        las 24 horas. A tan solo 5 minutos a pie del casco antiguo de Altea y de las mejores playas de la Costa Blanca. 
        Ideal como residencia habitual o como inversión vacacional con alta rentabilidad.
      </p>
    </div>
  );
};

export default PropertyDescription;
