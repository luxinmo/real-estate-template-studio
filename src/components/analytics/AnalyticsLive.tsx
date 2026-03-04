import { Monitor, Smartphone, Tablet } from "lucide-react";
import { liveVisitors, countryBreakdown } from "./mock-data";
import { Flag } from "./flags";

const deviceIcons: Record<string, any> = { Desktop: Monitor, Mobile: Smartphone, Tablet: Tablet };

const AnalyticsLive = () => {
  const deviceBreakdown = [
    { device: "Desktop", count: 2 },
    { device: "Mobile", count: 2 },
    { device: "Tablet", count: 1 },
  ];

  const langBreakdown = [
    { lang: "de", label: "German", count: 1 },
    { lang: "en", label: "English", count: 1 },
    { lang: "nl", label: "Dutch", count: 1 },
    { lang: "sv", label: "Swedish", count: 1 },
    { lang: "es", label: "Spanish", count: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Big number */}
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[13px] text-emerald-600 font-medium uppercase tracking-wider">Live Now</span>
        </div>
        <p className="text-[72px] font-light text-foreground tracking-tighter leading-none">5</p>
        <p className="text-[13px] text-muted-foreground mt-2">Active visitors on your website</p>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-[13px] font-semibold text-foreground">Active Sessions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Country</th>
                <th className="px-5 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Language</th>
                <th className="px-5 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Device</th>
                <th className="px-5 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Current Page</th>
                <th className="px-5 py-2.5 text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                <th className="px-5 py-2.5 text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Pages</th>
              </tr>
            </thead>
            <tbody>
              {liveVisitors.map((v, i) => {
                const DeviceIcon = deviceIcons[v.device] || Monitor;
                return (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 text-foreground">
                      <span className="inline-flex items-center gap-2"><Flag code={v.country} />{v.country}</span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground uppercase">{v.lang}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <DeviceIcon className="h-3.5 w-3.5 text-muted-foreground/60" strokeWidth={1.5} />
                        {v.device}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[#C9A96E] font-mono text-[11px]">{v.page}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground tabular-nums">{v.time}</td>
                    <td className="px-5 py-3 text-right text-foreground font-medium">{v.pages}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* World map placeholder + breakdowns */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 rounded-xl border border-border bg-card p-5">
          <h3 className="text-[13px] font-semibold text-foreground mb-4">Visitor Map</h3>
          <div className="aspect-square rounded-lg bg-muted border border-border flex items-center justify-center relative overflow-hidden">
            <div className="text-[11px] text-muted-foreground">🌍 World Map</div>
            <div className="absolute top-[35%] left-[48%] h-2 w-2 rounded-full bg-[#C9A96E] animate-pulse" />
            <div className="absolute top-[32%] left-[45%] h-2 w-2 rounded-full bg-[#C9A96E] animate-pulse" />
            <div className="absolute top-[34%] left-[47%] h-1.5 w-1.5 rounded-full bg-[#C9A96E]/60 animate-pulse" />
            <div className="absolute top-[28%] left-[50%] h-1.5 w-1.5 rounded-full bg-[#C9A96E]/60 animate-pulse" />
            <div className="absolute top-[42%] left-[46%] h-2 w-2 rounded-full bg-[#C9A96E] animate-pulse" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-[13px] font-semibold text-foreground mb-4">By Country</h3>
          <div className="space-y-2.5">
            {countryBreakdown.slice(0, 5).map((c) => (
              <div key={c.code} className="flex items-center gap-2">
                <Flag code={c.code} />
                <span className="text-[12px] text-foreground flex-1">{c.name}</span>
                <span className="text-[12px] text-muted-foreground tabular-nums">{c.sessions}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-[13px] font-semibold text-foreground mb-3">By Device</h3>
            <div className="space-y-2">
              {deviceBreakdown.map((d) => {
                const DIcon = deviceIcons[d.device] || Monitor;
                return (
                  <div key={d.device} className="flex items-center gap-2">
                    <DIcon className="h-3.5 w-3.5 text-muted-foreground/60" strokeWidth={1.5} />
                    <span className="text-[12px] text-foreground flex-1">{d.device}</span>
                    <span className="text-[12px] text-[#C9A96E] font-medium">{d.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-[13px] font-semibold text-foreground mb-3">By Language</h3>
            <div className="space-y-2">
              {langBreakdown.map((l) => (
                <div key={l.lang} className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground/50 uppercase w-4">{l.lang}</span>
                  <span className="text-[12px] text-foreground flex-1">{l.label}</span>
                  <span className="text-[12px] text-[#C9A96E] font-medium">{l.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsLive;
