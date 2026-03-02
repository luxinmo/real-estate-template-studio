import { useState } from "react";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import type { Omni47NavbarProps } from "../types";

const Omni47Navbar = ({
  logo,
  items,
  ctaButton,
  currentLang = "EN",
  languages = [],
  onLanguageChange,
  transparent = false,
}: Omni47NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const bg = transparent
    ? "bg-transparent"
    : "bg-omni47-cream/95 backdrop-blur-md border-b border-omni47-cream-dark";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${bg} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <a href="/" className="shrink-0">
          <img src={logo.src} alt={logo.alt} className="h-8 lg:h-10" />
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-[13px] font-light tracking-[0.12em] uppercase transition-colors ${
                transparent
                  ? "text-white/80 hover:text-white"
                  : "text-omni47-text/70 hover:text-omni47-text"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Language */}
          {languages.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-1 text-[12px] tracking-wider ${
                  transparent ? "text-white/70" : "text-omni47-text-muted"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                {currentLang}
                <ChevronDown className="w-3 h-3" />
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg py-2 min-w-[120px]">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { onLanguageChange?.(l.code); setLangOpen(false); }}
                      className="w-full text-left px-4 py-2 text-[13px] text-omni47-text hover:bg-omni47-cream transition-colors"
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CTA */}
          {ctaButton && (
            <a
              href={ctaButton.href}
              className="px-5 py-2.5 bg-omni47-navy text-white text-[12px] font-light tracking-[0.15em] uppercase hover:bg-omni47-navy-light transition-colors"
            >
              {ctaButton.label}
            </a>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className={`w-5 h-5 ${transparent ? "text-white" : "text-omni47-text"}`} />
          ) : (
            <Menu className={`w-5 h-5 ${transparent ? "text-white" : "text-omni47-text"}`} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-omni47-cream border-t border-omni47-cream-dark">
          <div className="px-5 py-6 space-y-4">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-[14px] font-light tracking-[0.1em] uppercase text-omni47-text/80 hover:text-omni47-text"
              >
                {item.label}
              </a>
            ))}
            {ctaButton && (
              <a
                href={ctaButton.href}
                className="block text-center mt-4 px-5 py-3 bg-omni47-navy text-white text-[12px] tracking-[0.15em] uppercase"
              >
                {ctaButton.label}
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Omni47Navbar;
