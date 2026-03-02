import type { Omni47FooterProps } from "../types";

const Omni47Footer = ({
  logo,
  description,
  columns,
  socialLinks,
  copyright,
  bottomLinks = [],
}: Omni47FooterProps) => (
  <footer className="bg-omni47-navy text-white">
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
        {/* Brand */}
        <div className="lg:col-span-4 space-y-5">
          <img src={logo.src} alt={logo.alt} className="h-8 brightness-0 invert" />
          <p className="text-[14px] font-light leading-relaxed text-white/60 max-w-sm">
            {description}
          </p>
          <div className="flex items-center gap-4 pt-2">
            {socialLinks.map((s) => (
              <a
                key={s.platform}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] tracking-[0.15em] uppercase text-white/50 hover:text-omni47-gold transition-colors"
              >
                {s.platform}
              </a>
            ))}
          </div>
        </div>

        {/* Columns */}
        {columns.map((col) => (
          <div key={col.title} className="lg:col-span-2 space-y-4">
            <h4 className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/40">
              {col.title}
            </h4>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[14px] font-light text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[12px] font-light text-white/40">{copyright}</p>
        <div className="flex items-center gap-6">
          {bottomLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[12px] font-light text-white/40 hover:text-white/70 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Omni47Footer;
