import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { AlertCircle } from "lucide-react";
import { useDashboard } from "@/hooks/useAnalytics";
import * as fallback from "./mock-data-fallback";
import { Flag } from "./flags";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-muted ${className}`} />
);

const DemoBanner = () => (
  <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 mb-4">
    <AlertCircle className="h-3.5 w-3.5 text-amber-600" strokeWidth={1.5} />
    <span className="text-[11px] text-amber-700 font-medium">Using demo data — API unavailable</span>
  </div>
);

const AnalyticsAudience = ({ dateRange = "Last 30 days" }: { dateRange?: string }) => {
  const { data: dashData, isLoading, isError } = useDashboard(dateRange);

  const usingFallback = isError || (!isLoading && !dashData);

  // ── Country Breakdown ──
  const countryBreakdown = (() => {
    if (!dashData?.byCountry?.length) return fallback.countryBreakdown;
    const total = dashData.byCountry.reduce((s: number, c: any) => s + c.sessions, 0);
    return dashData.byCountry.map((c: any) => ({
      code: c.value,
      name: c.value,
      sessions: c.sessions,
      conversions: 0, // TODO: not available per country
      avgTime: "—",
      pct: total > 0 ? Math.round((c.sessions / total) * 100 * 10) / 10 : 0,
    }));
  })();

  // ── Language Breakdown ──
  const languageBreakdown = (() => {
    if (!dashData?.byLang?.length) return fallback.languageBreakdown;
    const total = dashData.byLang.reduce((s: number, l: any) => s + l.sessions, 0);
    const langLabels: Record<string, string> = { en: "English", es: "Spanish", de: "German", fr: "French", nl: "Dutch", ru: "Russian", sv: "Swedish" };
    return dashData.byLang.map((l: any) => ({
      lang: l.value,
      label: langLabels[l.value] || l.value,
      sessions: l.sessions,
      pct: total > 0 ? Math.round((l.sessions / total) * 100 * 10) / 10 : 0,
    }));
  })();

  // ── Traffic Sources ──
  const trafficSources = (() => {
    if (!dashData?.byReferrer?.length) return fallback.trafficSources;
    const total = dashData.byReferrer.reduce((s: number, r: any) => s + r.sessions, 0);
    return dashData.byReferrer.map((r: any) => ({
      source: r.value || "Direct",
      sessions: r.sessions,
      pct: total > 0 ? Math.round((r.sessions / total) * 100) : 0,
    }));
  })();

  // ── Device Distribution ──
  const deviceDistribution = (() => {
    if (!dashData?.byDevice?.length) return fallback.deviceDistribution;
    const total = dashData.byDevice.reduce((s: number, d: any) => s + d.sessions, 0);
    return dashData.byDevice.map((d: any) => ({
      device: d.value,
      sessions: d.sessions,
      pct: total > 0 ? Math.round((d.sessions / total) * 100) : 0,
    }));
  })();

  // TODO: API doesn't provide new vs returning — using fallback
  const newVsReturning = fallback.newVsReturning;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <Skeleton className="h-[250px]" />
          <Skeleton className="h-[300px] lg:col-span-2" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-[200px]" /><Skeleton className="h-[200px]" /><Skeleton className="h-[200px]" /><Skeleton className="h-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {usingFallback && <DemoBanner />}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-[13px] font-semibold text-foreground mb-4">Visitor Distribution</h3>
          <div className="aspect-[4/3] rounded-lg bg-muted border border-border flex items-center justify-center relative overflow-hidden">
            <div className="text-[11px] text-muted-foreground">🌍 World Map</div>
            <div className="absolute top-[30%] left-[45%] h-8 w-8 rounded-full bg-[#C9A96E]/20 animate-pulse" />
            <div className="absolute top-[35%] left-[48%] h-12 w-12 rounded-full bg-[#C9A96E]/15 animate-pulse" />
            <div className="absolute top-[42%] left-[46%] h-6 w-6 rounded-full bg-[#C9A96E]/10 animate-pulse" />
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="text-[13px] font-semibold text-foreground">Sessions by Country</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Country</th>
                  <th className="px-5 py-2.5 text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Sessions</th>
                  <th className="px-5 py-2.5 text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Conversions</th>
                  <th className="px-5 py-2.5 text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Avg. Time</th>
                  <th className="px-5 py-2.5 text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Share</th>
                </tr>
              </thead>
              <tbody>
                {countryBreakdown.map((c: any) => (
                  <tr key={c.code} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 text-foreground">
                      <span className="inline-flex items-center gap-2"><Flag code={c.code} />{c.name}</span>
                    </td>
                    <td className="px-5 py-3 text-right text-foreground font-medium tabular-nums">{c.sessions.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-[#C9A96E] font-medium tabular-nums">{c.conversions}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground tabular-nums">{c.avgTime}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground tabular-nums">{c.pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-[13px] font-semibold text-foreground mb-4">By Language</h3>
          <div className="space-y-2.5">
            {languageBreakdown.map((l: any) => (
              <div key={l.lang}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-foreground">{l.label}</span>
                  <span className="text-[11px] text-muted-foreground tabular-nums">{l.pct}%</span>
                </div>
                <div className="h-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-[#C9A96E]" style={{ width: `${l.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-[13px] font-semibold text-foreground mb-4">Traffic Source</h3>
          <div className="space-y-2.5">
            {trafficSources.map((s: any) => (
              <div key={s.source}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-foreground">{s.source}</span>
                  <span className="text-[11px] text-muted-foreground tabular-nums">{s.pct}%</span>
                </div>
                <div className="h-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-[#8B7355]" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-[13px] font-semibold text-foreground mb-4">By Device</h3>
          <div className="h-[120px] flex items-center justify-center">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={deviceDistribution} dataKey="pct" nameKey="device" cx="50%" cy="50%" innerRadius={30} outerRadius={50} strokeWidth={0}>
                  <Cell fill="#C9A96E" />
                  <Cell fill="#8B7355" />
                  <Cell fill="hsl(var(--muted))" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {deviceDistribution.map((d: any, i: number) => (
              <div key={d.device} className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${i === 0 ? "bg-[#C9A96E]" : i === 1 ? "bg-[#8B7355]" : "bg-muted"}`} />
                <span className="text-[11px] text-foreground">{d.device}</span>
                <span className="text-[11px] text-muted-foreground ml-auto">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-[13px] font-semibold text-foreground mb-4">New vs Returning</h3>
          <div className="h-[120px] flex items-center justify-center">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={[
                    { name: "New", value: newVsReturning.new },
                    { name: "Returning", value: newVsReturning.returning },
                  ]}
                  dataKey="value"
                  cx="50%" cy="50%" innerRadius={30} outerRadius={50} strokeWidth={0}
                >
                  <Cell fill="#C9A96E" />
                  <Cell fill="hsl(var(--muted))" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C9A96E]" />
              <span className="text-[11px] text-foreground">New visitors</span>
              <span className="text-[11px] text-muted-foreground ml-auto">{newVsReturning.new}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-muted" />
              <span className="text-[11px] text-foreground">Returning</span>
              <span className="text-[11px] text-muted-foreground ml-auto">{newVsReturning.returning}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsAudience;
