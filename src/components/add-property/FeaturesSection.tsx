import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";

const featureGroups: Record<string, string[]> = {
  "🏠 Features": [
    "Terrace", "Balcony", "Parking", "Parking (private)", "Garage (private)",
    "Garden (private)", "Guest house", "Storage", "Kitchen", "Independent kitchen",
    "Open plan kitchen", "Fitted kitchen", "Basement", "Laundry", "Pantry",
    "Wine cellar", "Fireplace", "Solarium", "Paddle (private)", "Tennis (private)",
    "Barbecue", "Dressing room",
  ],
  "⚡ Equipment": [
    "Tourist licence", "Air conditioning", "A/A central", "Split",
    "Pre installation", "City gas", "Fitted wardrobes", "Domotics",
    "Solar panels", "Lift", "Gym", "Heating", "Central heating",
    "GAS central heating", "Oil central heating", "Floor heating",
    "Floor heating (only bath)", "Swimming pool (private)", "Heated pool",
    "Indoor pool", "Jacuzzi", "Sauna", "Hydro massage bath", "Hammam",
    "Alarm system", "24h security system", "Shielded door",
    "Electric blinds", "Double glazing",
  ],
  "🏘 Urbanisation": [
    "Doorman", "Gated complex", "Urbanization with 24h surveillance",
    "Gym", "Paddle", "Tennis", "Restaurant", "Events room", "Coworking",
    "Garden", "Children's park", "Lift", "Community pool", "Heated pool",
    "Indoor pool", "Children pool", "Hammam", "Jacuzzi", "Sauna",
  ],
  "📍 Location": [
    "First line beach", "Second line sea", "Close to port",
    "Front line golf", "Center city", "Close to river",
    "Close to the sea", "Close to golf", "Close to airport",
  ],
  "👁 Views": [
    "Sea views", "Golf views", "Mountain views",
    "Countryside views", "City view",
  ],
};

interface FeaturesSectionProps {
  data: string[];
  onChange: (data: string[]) => void;
}

const FeaturesSection = ({ data, onChange }: FeaturesSectionProps) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (feature: string) => {
    onChange(
      data.includes(feature)
        ? data.filter((f) => f !== feature)
        : [...data, feature]
    );
  };

  const toggleGroup = (group: string) => {
    setCollapsed((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <section className="rounded-xl border border-border bg-card shadow-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-foreground">Features</h2>
        {data.length > 0 && (
          <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-2.5 py-1">
            {data.length} selected
          </span>
        )}
      </div>

      <div className="space-y-4">
        {Object.entries(featureGroups).map(([group, features]) => {
          const isCollapsed = collapsed[group];
          const groupSelected = features.filter((f) => data.includes(f)).length;

          return (
            <div key={group} className="rounded-lg border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => toggleGroup(group)}
                className="flex items-center justify-between w-full px-4 py-3 bg-background hover:bg-accent/50 transition-colors"
              >
                <span className="text-sm font-medium text-foreground">{group}</span>
                <div className="flex items-center gap-2">
                  {groupSelected > 0 && (
                    <span className="text-[10px] font-medium bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                      {groupSelected}
                    </span>
                  )}
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      isCollapsed ? "" : "rotate-180"
                    }`}
                  />
                </div>
              </button>
              {!isCollapsed && (
                <div className="px-4 py-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {features.map((feature) => (
                    <label
                      key={feature}
                      className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-1.5 hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        checked={data.includes(feature)}
                        onCheckedChange={() => toggle(feature)}
                      />
                      <span className="text-[13px] text-foreground leading-tight">{feature}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesSection;
