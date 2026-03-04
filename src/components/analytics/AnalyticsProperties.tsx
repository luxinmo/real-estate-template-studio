import { useState } from "react";
import { Eye, MessageSquare, Phone, Share2, Heart, AlertCircle } from "lucide-react";
import { topProperties, viewedNeverContacted, MockProperty } from "./mock-data";

const tabs = [
  { id: "views", label: "Most Viewed", icon: Eye, key: "views" as const },
  { id: "contacts", label: "Most Contacted", icon: MessageSquare, key: "contacts" as const },
  { id: "calls", label: "Most Called", icon: Phone, key: "calls" as const },
  { id: "shares", label: "Most Shared", icon: Share2, key: "shares" as const },
  { id: "favorites", label: "Most Favorited", icon: Heart, key: "favorites" as const },
];

const AnalyticsProperties = () => {
  const [activeTab, setActiveTab] = useState("views");

  const currentTab = tabs.find((t) => t.id === activeTab)!;
  const sorted = [...topProperties].sort((a, b) => b[currentTab.key] - a[currentTab.key]);
  const featured = sorted[0];

  return (
    <div className="space-y-6">
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
                  ? "bg-[#C9A96E] text-[#0a0a0f]"
                  : "bg-[#12121e] text-[#8a8a9a] border border-[#1a1a2e] hover:border-[#C9A96E]/30"
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
            <h3 className="text-lg font-semibold text-white">{featured.name}</h3>
            <p className="text-[12px] text-[#6a6a7a] mt-1">{featured.ref} · {featured.location} · {featured.type}</p>
            <p className="text-[15px] text-[#C9A96E] font-semibold mt-2">{featured.price}</p>
          </div>
          <div className="text-right">
            <p className="text-[36px] font-light text-white tracking-tighter">{featured[currentTab.key].toLocaleString()}</p>
            <p className="text-[11px] text-[#6a6a7a]">{currentTab.label.toLowerCase()}</p>
          </div>
        </div>
        <div className="flex gap-6 mt-4 pt-4 border-t border-[#1a1a2e]">
          <Stat icon={Eye} label="Views" value={featured.views} />
          <Stat icon={MessageSquare} label="Contacts" value={featured.contacts} />
          <Stat icon={Phone} label="Calls" value={featured.calls} />
          <Stat icon={Share2} label="Shares" value={featured.shares} />
          <Stat icon={Heart} label="Favorites" value={featured.favorites} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#1a1a2e] bg-[#12121e] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#1a1a2e]">
          <h3 className="text-[13px] font-semibold text-white">Property Ranking — {currentTab.label}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#1a1a2e]">
                <th className="px-5 py-2.5 text-left text-[11px] font-medium text-[#6a6a7a] uppercase tracking-wider w-8">#</th>
                <th className="px-5 py-2.5 text-left text-[11px] font-medium text-[#6a6a7a] uppercase tracking-wider">Ref</th>
                <th className="px-5 py-2.5 text-left text-[11px] font-medium text-[#6a6a7a] uppercase tracking-wider">Property</th>
                <th className="px-5 py-2.5 text-left text-[11px] font-medium text-[#6a6a7a] uppercase tracking-wider">Location</th>
                <th className="px-5 py-2.5 text-right text-[11px] font-medium text-[#6a6a7a] uppercase tracking-wider">Price</th>
                <th className="px-5 py-2.5 text-right text-[11px] font-medium text-[#C9A96E] uppercase tracking-wider">{currentTab.label.split(" ")[1]}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => (
                <tr key={p.ref} className="border-b border-[#1a1a2e]/50 hover:bg-[#1a1a2e]/30 transition-colors">
                  <td className="px-5 py-3 text-[#4a4a5a] font-medium">{i + 1}</td>
                  <td className="px-5 py-3 text-[#C9A96E] font-mono">{p.ref}</td>
                  <td className="px-5 py-3 text-[#c4c4d4]">{p.name}</td>
                  <td className="px-5 py-3 text-[#8a8a9a]">{p.location}</td>
                  <td className="px-5 py-3 text-right text-[#c4c4d4] font-medium">{p.price}</td>
                  <td className="px-5 py-3 text-right text-white font-semibold">{p[currentTab.key].toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Viewed never contacted */}
      <div className="rounded-xl border border-rose-500/20 bg-[#12121e] p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-4 w-4 text-rose-400" strokeWidth={1.5} />
          <h3 className="text-[13px] font-semibold text-rose-400">Viewed but Never Contacted</h3>
          <span className="text-[10px] text-rose-400/60 ml-auto">Potential listing issues</span>
        </div>
        <div className="space-y-2">
          {viewedNeverContacted.map((p) => (
            <div key={p.ref} className="flex items-center gap-4 py-2 px-3 rounded-lg hover:bg-[#1a1a2e]/30 transition-colors">
              <span className="text-[12px] text-[#C9A96E] font-mono">{p.ref}</span>
              <span className="text-[12px] text-[#c4c4d4] flex-1 truncate">{p.name}</span>
              <span className="text-[12px] text-[#6a6a7a]">{p.location}</span>
              <span className="text-[12px] text-[#8a8a9a] font-medium">{p.views} views</span>
              <span className="text-[10px] text-rose-400 font-medium">0 contacts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Stat = ({ icon: Icon, label, value }: { icon: any; label: string; value: number }) => (
  <div className="flex items-center gap-2">
    <Icon className="h-3.5 w-3.5 text-[#6a6a7a]" strokeWidth={1.5} />
    <span className="text-[12px] text-[#c4c4d4] font-medium">{value}</span>
    <span className="text-[10px] text-[#4a4a5a]">{label}</span>
  </div>
);

export default AnalyticsProperties;
