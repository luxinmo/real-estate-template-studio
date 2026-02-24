import { ChevronRight, MapPin } from "lucide-react";

export interface BreadcrumbSegment {
  label: string;
  onClick?: () => void;
}

interface LocationBreadcrumbProps {
  segments: BreadcrumbSegment[];
}

const LocationBreadcrumb = ({ segments }: LocationBreadcrumbProps) => (
  <nav className="flex items-center gap-1.5 text-[13px]">
    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
    {segments.map((seg, i) => {
      const isLast = i === segments.length - 1;
      return (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />}
          {isLast ? (
            <span className="font-medium text-foreground truncate max-w-[200px]">{seg.label}</span>
          ) : (
            <button
              onClick={seg.onClick}
              className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[160px]"
            >
              {seg.label}
            </button>
          )}
        </span>
      );
    })}
  </nav>
);

export default LocationBreadcrumb;
