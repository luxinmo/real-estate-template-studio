import flagES from "@/assets/flags/es.png";
import flagDE from "@/assets/flags/de.png";
import flagGB from "@/assets/flags/gb.png";
import flagNL from "@/assets/flags/nl.png";
import flagBE from "@/assets/flags/be.png";
import flagFR from "@/assets/flags/fr.png";
import flagSE from "@/assets/flags/se.png";
import flagNO from "@/assets/flags/no.png";
import flagRU from "@/assets/flags/ru.png";

const flagMap: Record<string, string> = {
  ES: flagES, DE: flagDE, GB: flagGB, NL: flagNL, BE: flagBE,
  FR: flagFR, SE: flagSE, NO: flagNO, RU: flagRU,
};

export const Flag = ({ code, className = "h-4 w-5 rounded-sm object-cover" }: { code: string; className?: string }) => {
  const src = flagMap[code.toUpperCase()];
  if (!src) return <span className="text-sm">🏳️</span>;
  return <img src={src} alt={code} className={className} />;
};

export default flagMap;
