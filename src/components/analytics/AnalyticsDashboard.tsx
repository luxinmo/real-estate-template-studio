import { useState } from "react";
import { BarChart3, Users, Search, Home, Filter, MessageSquare, Globe, Settings, Radio, ChevronDown } from "lucide-react";
import AnalyticsOverview from "./AnalyticsOverview";
import AnalyticsLive from "./AnalyticsLive";
import AnalyticsSearch from "./AnalyticsSearch";
import AnalyticsProperties from "./AnalyticsProperties";
import AnalyticsFunnel from "./AnalyticsFunnel";
import AnalyticsContacts from "./AnalyticsContacts";
import AnalyticsAudience from "./AnalyticsAudience";
import AnalyticsSettings from "./AnalyticsSettings";

type AnalyticsView = "overview" | "live" | "search" | "properties" | "funnel" | "contacts" | "audience" | "settings";

const navItems: { id: AnalyticsView; label: string; icon: any }[] = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "live", label: "Live Visitors", icon: Radio },
  { id: "search", label: "Search Insights", icon: Search },
  { id: "properties", label: "Properties", icon: Home },
  { id: "funnel", label: "Funnel", icon: Filter },
  { id: "contacts", label: "Contacts", icon: MessageSquare },
  { id: "audience", label: "Audience", icon: Globe },
  { id: "settings", label: "Settings", icon: Settings },
];

const dateRanges = ["Last 7 days", "Last 14 days", "Last 30 days", "Last 90 days", "This month", "Last month"];

const AnalyticsDashboard = () => {
  const [view, setView] = useState<AnalyticsView>("overview");
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-background min-h-0">
      {/* Header */}
      <div className="shrink-0 border-b border-border px-6 py-3 flex items-center justify-between bg-card">
        <div className="flex items-center gap-6 overflow-x-auto">
          {navItems.map((item) => {
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center gap-2 py-2 text-[13px] font-medium whitespace-nowrap transition-colors border-b-2 ${
                  active
                    ? "text-[#C9A96E] border-[#C9A96E]"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                {item.label}
                {item.id === "live" && (
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
        <div className="relative ml-4 shrink-0">
          <button
            onClick={() => setShowDateDropdown(!showDateDropdown)}
            className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-[12px] text-muted-foreground hover:border-[#C9A96E]/40 transition-colors"
          >
            {dateRange}
            <ChevronDown className="h-3 w-3" />
          </button>
          {showDateDropdown && (
            <div className="absolute right-0 top-full mt-1 z-50 rounded-lg border border-border bg-card py-1 shadow-xl min-w-[160px]">
              {dateRanges.map((r) => (
                <button
                  key={r}
                  onClick={() => { setDateRange(r); setShowDateDropdown(false); }}
                  className={`w-full px-3 py-1.5 text-left text-[12px] hover:bg-muted transition-colors ${
                    r === dateRange ? "text-[#C9A96E]" : "text-muted-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Live indicator bar */}
      <div className="shrink-0 px-6 py-2 flex items-center gap-2 border-b border-border/50 bg-card">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[11px] text-emerald-600 font-medium">5 visitors online now</span>
        <span className="text-[11px] text-muted-foreground/40">·</span>
        <span className="text-[11px] text-muted-foreground">{dateRange}</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {view === "overview" && <AnalyticsOverview />}
        {view === "live" && <AnalyticsLive />}
        {view === "search" && <AnalyticsSearch />}
        {view === "properties" && <AnalyticsProperties />}
        {view === "funnel" && <AnalyticsFunnel />}
        {view === "contacts" && <AnalyticsContacts />}
        {view === "audience" && <AnalyticsAudience />}
        {view === "settings" && <AnalyticsSettings />}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
