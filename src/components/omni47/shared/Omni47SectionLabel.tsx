interface Omni47SectionLabelProps {
  text: string;
  className?: string;
}

const Omni47SectionLabel = ({ text, className = "" }: Omni47SectionLabelProps) => (
  <span
    className={`inline-block text-[11px] font-light tracking-[0.25em] uppercase text-omni47-gold ${className}`}
  >
    {text}
  </span>
);

export default Omni47SectionLabel;
