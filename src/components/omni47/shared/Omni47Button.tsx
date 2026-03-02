import { ArrowRight } from "lucide-react";
import type { CTAButton } from "../types";

interface Omni47ButtonProps extends CTAButton {
  className?: string;
  showArrow?: boolean;
  onClick?: () => void;
}

const variants = {
  primary:
    "bg-omni47-navy text-white hover:bg-omni47-navy-light",
  secondary:
    "bg-white/10 text-white border border-white/30 backdrop-blur-sm hover:bg-white/20",
  outline:
    "bg-transparent text-omni47-navy border border-omni47-navy hover:bg-omni47-navy hover:text-white",
  gold:
    "bg-omni47-gold text-white hover:bg-omni47-gold-light",
};

const Omni47Button = ({
  label,
  href,
  variant = "primary",
  className = "",
  showArrow = false,
  onClick,
}: Omni47ButtonProps) => {
  const cls = `inline-flex items-center justify-center gap-2 px-7 py-3 text-[12px] font-light tracking-[0.15em] uppercase transition-all duration-300 ${variants[variant]} ${className}`;

  if (onClick) {
    return (
      <button className={cls} onClick={onClick} type="button">
        {label}
        {showArrow && <ArrowRight className="w-3.5 h-3.5" />}
      </button>
    );
  }

  return (
    <a href={href} className={cls}>
      {label}
      {showArrow && <ArrowRight className="w-3.5 h-3.5" />}
    </a>
  );
};

export default Omni47Button;
