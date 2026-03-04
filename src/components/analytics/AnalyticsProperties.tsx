import { useState } from "react";
import { Eye, MessageSquare, Phone, Share2, Heart, AlertCircle } from "lucide-react";
import { usePropertiesRanking } from "@/hooks/useAnalytics";
import * as fallback from "./mock-data-fallback";
import type { MockProperty } from "./mock-data-fallback";

const tabs = [
  { id: "views", label: "Most Viewed", icon: Eye, apiKey: "mostViewed" as const, key: "views" as const },
  { id: "contacts", label: "Most Contacted", icon: MessageSquare, apiKey: "mostContacted" as const, key: "contacts" as const },
  { id: "calls", label: "Most Called", icon: Phone, apiKey: "mostCalled" as const, key: "calls" as const },
  { id: "shares", label: "Most Shared", icon: Share2, apiKey: "mostShared" as const, key: "shares" as const },
  { id: "favorites", label: "Most Favorited", icon: Heart, apiKey: "mostFavorited" as const, key: "favorites" as const },
];

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-muted ${className}`} />
);

const DemoBanner = () => (
  <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 mb-4">
    <AlertCircle className="h-3.5 w-3.5 text-amber-600" strokeWidth={1.5} />
    <span className="text-[11px] text-amber-700 font-medium">Using demo data — API unavailable</span>
  </div>
);

const AnalyticsProperties = ({ dateRange = "Last 30 days" }: { dateRange?: string }) => {
  const [activeTab, setActiveTab] = useState("views");
  const { data: apiData, isLoading, isError } = usePropertiesRanking(dateRange);

  const usingFallback = isError || (!isLoading && !apiData);

  // ── Build unified property list from API or fallback ──
  const topProperties: MockProperty[] = (() => {
    if (!apiData?.mostViewed?.length) return fallback.topProperties;
    const allRefs = new Set<string>();
    ["mostViewed", "mostContacted", "mostCalled", "mostShared", "mostFavorited"].forEach((key) => {
      (apiData[key] || []).forEach((p: any) => allRefs.add(p.ref));
    });
    return Array.from(allRefs).map((ref) => ({
      ref,
      name: ref, // TODO: enrich with property data
      location: "—",
      type: "—",
      price: "—",
      views: apiData.mostViewed?.find((v: any) => v.ref === ref)?.count ?? 0,
      contacts: apiData.mostContacted?.find((v: any) => v.ref === ref)?.count ?? 0,
      calls: apiData.mostCalled?.find((v: any) => v.ref === ref)?.count ?? 0,
      shares: apiData.mostShared?.find((v: any) => v.ref === ref)?.count ?? 0,
      favorites: apiData.mostFavorited?.find((v: any) => v.ref === ref)?.count ?? 0,
    }));
  })();

  const viewedNeverContacted = (() => {
    if (!apiData?.mostViewed?.length) return fallback.viewedNeverContacted;
    return topProperties.filter((p) => p.views > 0 && p.contacts === 0);
  })();

  const currentTab = tabs.find((t) => t.id === activeTab)!;
  const sorted = [...topProperties].sort((a, b) => b[currentTab.key] - a[currentTab.key]);
  const featured = sorted[0];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-1"><Skeleton className="h-10 w-32" /><Skeleton className="h-10 w-32" /><Skeleton className="h-10 w-32" /></div>
        <Skeleton className="h-40" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!featured) return null;

  return (
    <div className="space-y-6">
      {usingFallback && <DemoBanner />}

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[12px] font-medium whitespace-nowrap transition-all ${
                active
                  ? "bg-[#C9A96E] text-white"
                  : "bg-card text-muted-foreground border border-border hover:border-[#C9A96E]/30"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" strokeWidth={1.5} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Featured property card */}
      <div className="rounded-xl border border-[#C9A96E]/20 bg-gradient-to-br from-[#C9A96E]/5 to-transparent p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] text-[#C9A96E] uppercase tracking-wider font-medium mb-1">
              #{1} {currentTab.label}
            </p>
            <h3 className="text-lg font-semibold text-foreground">{featured.name}</h3>
            <p className="text-[12px] text-muted-foreground mt-1">{featured.ref} · {featured.location} · {featured.type}</p>
            <p className="text-[15px] text-[#C9A96E] font-semibold mt-2">{featured.price}</p>
          </div>
          <div className="text-right">
            <p className="text-[36px] font-light text-foreground tracking-tighter">{featured[currentTab.key].toLocaleString()}</p>
            <p className="text-[11px] text-muted-foreground">{currentTab.label.toLowerCase()}</p>
          </div>
        </div>
        <div className="flex gap-6 mt-4 pt-4 border-t border-border">
          <Stat icon={Eye} label="Views" value={featured.views} />
          <Stat icon={MessageSquare} label="Contacts" value={featured.contacts} />
          <Stat icon={Phone} label="Calls" value={featured.calls} />
          <Stat icon={Share2} label="Shares" value={featured.shares} />
          <Stat icon={Heart} label="Favorites" value={featured.favorites} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-[13px] font-semibold text-foreground">Property Ranking — {currentTab.label}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider w-8">#</th>
                <th className="px-5 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Ref</th>
                <th className="px-5 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Property</th>
                <th className="px-5 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Location</th>
                <th className="px-5 py-2.5 text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="px-5 py-2.5 text-right text-[11px] font-medium text-[#C9A96E] uppercase tracking-wider">{currentTab.label.split(" ")[1]}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => (
                <tr key={p.ref} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 text-muted-foreground/50 font-medium">{i + 1}</td>
                  <td className="px-5 py-3 text-[#C9A96E] font-mono">{p.ref}</td>
                  <td className="px-5 py-3 text-foreground">{p.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.location}</td>
                  <td className="px-5 py-3 text-right text-foreground font-medium">{p.price}</td>
                  <td className="px-5 py-3 text-right text-foreground font-semibold">{p[currentTab.key].toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Viewed never contacted */}
      {viewedNeverContacted.length > 0 && (
        <div className="rounded-xl border border-rose-300/30 bg-rose-50/50 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-4 w-4 text-rose-500" strokeWidth={1.5} />
            <h3 className="text-[13px] font-semibold text-rose-600">Viewed but Never Contacted</h3>
            <span className="text-[10px] text-rose-500/60 ml-auto">Potential listing issues</span>
          </div>
          <div className="space-y-2">
            {viewedNeverContacted.map((p) => (
              <div key={p.ref} className="flex items-center gap-4 py-2 px-3 rounded-lg hover:bg-rose-100/30 transition-colors">
                <span className="text-[12px] text-[#C9A96E] font-mono">{p.ref}</span>
                <span className="text-[12px] text-foreground flex-1 truncate">{p.name}</span>
                <span className="text-[12px] text-muted-foreground">{p.location}</span>
                <span className="text-[12px] text-muted-foreground font-medium">{p.views} views</span>
                <span className="text-[10px] text-rose-500 font-medium">0 contacts</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Stat = ({ icon: Icon, label, value }: { icon: any; label: string; value: number }) => (
  <div className="flex items-center gap-2">
    <Icon className="h-3.5 w-3.5 text-muted-foreground/60" strokeWidth={1.5} />
    <span className="text-[12px] text-foreground font-medium">{value}</span>
    <span className="text-[10px] text-muted-foreground/50">{label}</span>
  </div>
);

export default AnalyticsProperties;
