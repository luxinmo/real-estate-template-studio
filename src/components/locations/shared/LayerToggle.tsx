import { Map as MapIcon, Satellite } from "lucide-react";

interface LayerToggleProps {
  mode: "osm" | "satellite";
  onChange: (mode: "osm" | "satellite") => void;
}

const LayerToggle = ({ mode, onChange }: LayerToggleProps) => (
  <div className="absolute top-3 right-3 z-[1000] flex rounded-lg overflow-hidden border border-border shadow-md">
    <button
      onClick={() => onChange("osm")}
      className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
        mode === "osm"
          ? "bg-primary text-primary-foreground"
          : "bg-card text-muted-foreground hover:bg-accent"
      }`}
    >
      <MapIcon className="h-3 w-3" />
      Map
    </button>
    <button
      onClick={() => onChange("satellite")}
      className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
        mode === "satellite"
          ? "bg-primary text-primary-foreground"
          : "bg-card text-muted-foreground hover:bg-accent"
      }`}
    >
      <Satellite className="h-3 w-3" />
      Satellite
    </button>
  </div>
);

export default LayerToggle;
