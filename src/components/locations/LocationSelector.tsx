import { useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LocationLevel, LEVEL_ORDER, LEVEL_LABELS } from "./types";
import { mockLocations } from "./mock-data";

interface LocationSelectorProps {
  value?: Record<LocationLevel, string | null>;
  onChange?: (value: Record<LocationLevel, string | null>) => void;
  maxLevel?: LocationLevel;
  className?: string;
}

const LocationSelector = ({
  value = { country: null, province: null, town: null, zone: null },
  onChange,
  maxLevel = "zone",
  className = "",
}: LocationSelectorProps) => {
  const maxIdx = LEVEL_ORDER.indexOf(maxLevel);
  const levels = LEVEL_ORDER.slice(0, maxIdx + 1);

  const parentForLevel = (level: LocationLevel): string | null => {
    const idx = LEVEL_ORDER.indexOf(level);
    if (idx === 0) return null;
    return value[LEVEL_ORDER[idx - 1]] ?? null;
  };

  const optionsForLevel = useMemo(() => {
    const map: Record<LocationLevel, typeof mockLocations> = {
      country: [],
      province: [],
      town: [],
      zone: [],
    };
    for (const lv of levels) {
      const parentId = parentForLevel(lv);
      if (lv === "country") {
        map[lv] = mockLocations.filter((n) => n.level === lv && n.active);
      } else {
        if (!parentId) {
          map[lv] = [];
        } else {
          map[lv] = mockLocations.filter((n) => n.level === lv && n.parentId === parentId && n.active);
        }
      }
    }
    return map;
  }, [value, levels]);

  const handleChange = (level: LocationLevel, id: string | null) => {
    const idx = LEVEL_ORDER.indexOf(level);
    const next = { ...value, [level]: id };
    // Clear children
    for (let i = idx + 1; i < LEVEL_ORDER.length; i++) {
      next[LEVEL_ORDER[i]] = null;
    }
    onChange?.(next);
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ${className}`}>
      {levels.map((lv) => {
        const options = optionsForLevel[lv];
        const parentId = parentForLevel(lv);
        const disabled = lv !== "country" && !parentId;

        return (
          <div key={lv} className="space-y-1">
            <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">{LEVEL_LABELS[lv]}</Label>
            <Select
              value={value[lv] ?? ""}
              onValueChange={(v) => handleChange(lv, v || null)}
              disabled={disabled}
            >
              <SelectTrigger className="h-9 text-[13px]">
                <SelectValue placeholder={`Select ${LEVEL_LABELS[lv].toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id} className="text-[13px]">
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      })}
    </div>
  );
};

export default LocationSelector;
