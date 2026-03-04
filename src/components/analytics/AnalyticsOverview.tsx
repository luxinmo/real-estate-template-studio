import { TrendingUp, TrendingDown, Activity, Users, Eye, Layers, Clock, Target, LogOut, AlertCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useDashboard, usePropertiesRanking, useTimeline } from "@/hooks/useAnalytics";
import { formatDuration } from "@/lib/analytics-api";
import * as fallback from "./mock-data-fallback";

const iconMap: Record<string, any> = {
  activity: Activity, users: Users, eye: Eye, layers: Layers,
  clock: Clock, target: Target, "log-out": LogOut,
};

const channelColors: Record<string, string> = { form: "#C9A96E", phone: "#8B7355", email: "#6B8E7B", whatsapp: "#7B9EAE" };

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-muted ${className}`} />
);

const DemoBanner = () => (
  <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 mb-4">
    <AlertCircle className="h-3.5 w-3.5 text-amber-600" strokeWidth={1.5} />
    <span className="text-[11px] text-amber-700 font-medium">Using demo data — API unavailable</span>
  </div>
);

const AnalyticsOverview = ({ dateRange = "Last 30 days" }: { dateRange?: string }) => {
  const { data: dashData, isLoading: dashLoading, isError: dashError } = useDashboard(dateRange);
  const { data: propsData } = usePropertiesRanking(dateRange);
  const { data: timelineData } = useTimeline(dateRange, "sessions");

  const usingFallback = dashError || (!dashLoading && !dashData);

  // ── Transform API data or use fallback ──
  const kpis = dashData?.overview
    ? [
        { label: "Sessions", value: dashData.overview.sessions?.toLocaleString() ?? "0", change: 0, icon: "activity" },
        { label: "Unique Visitors", value: dashData.overview.uniqueVisitors?.toLocaleString() ?? "0", change: 0, icon: "users" },
        { label: "Pageviews", value: dashData.overview.pageviews?.toLocaleString() ?? "0", change: 0, icon: "eye" },
        { label: "Pages / Session", value: (dashData.overview.avgPagesPerSession ?? 0).toFixed(2), change: 0, icon: "layers" },
        { label: "Avg. Duration", value: formatDuration(dashData.overview.avgSessionDuration ?? 0), change: 0, icon: "clock" },
        { label: "Conversion Rate", value: (dashData.overview.conversionRate ?? 0) + "%", change: 0, icon: "target" },
        { label: "Bounce Rate", value: (dashData.overview.bounceRate ?? 0) + "%", change: 0, icon: "log-out" },
      ]
    : fallback.kpis;

  const sessionsTimeline = timelineData?.length
    ? timelineData.map((t: any) => ({
        date: new Date(t.period).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
        sessions: t.count ?? 0,
        visitors: Math.round((t.count ?? 0) * 0.7),
      }))
    : dashData?.timeline?.length
      ? dashData.timeline.map((t: any) => ({
          date: new Date(t.period).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
          sessions: t.count ?? 0,
          visitors: Math.round((t.count ?? 0) * 0.7),
        }))
      : fallback.sessionsTimeline;

  const topPages = dashData?.topPages?.length
    ? dashData.topPages.map((p: any) => ({
        path: p.page,
        views: p.views,
        pct: dashData.topPages[0] ? Math.round((p.views / dashData.topPages[0].views) * 100) : 0,
      }))
    : fallback.topPages;

  const topProperties = (() => {
    if (!propsData?.mostViewed?.length) return fallback.topProperties;
    const allRefs = new Set<string>();
    ["mostViewed", "mostContacted", "mostCalled", "mostShared", "mostFavorited"].forEach((key) => {
      (propsData[key] || []).forEach((p: any) => allRefs.add(p.ref));
    });
    return Array.from(allRefs).map((ref) => ({
      ref,
      name: ref,
      location: "—",
      type: "—",
      price: "—",
      views: propsData.mostViewed?.find((v: any) => v.ref === ref)?.count ?? 0,
      contacts: propsData.mostContacted?.find((v: any) => v.ref === ref)?.count ?? 0,
      calls: propsData.mostCalled?.find((v: any) => v.ref === ref)?.count ?? 0,
      shares: propsData.mostShared?.find((v: any) => v.ref === ref)?.count ?? 0,
      favorites: propsData.mostFavorited?.find((v: any) => v.ref === ref)?.count ?? 0,
    })).sort((a, b) => b.views - a.views).slice(0, 10);
  })();

  const deviceDistribution = (() => {
    if (!dashData?.byDevice?.length) return fallback.deviceDistribution;
    const total = dashData.byDevice.reduce((s: number, d: any) => s + d.sessions, 0);
    return dashData.byDevice.map((d: any) => ({
      device: d.value,
      sessions: d.sessions,
      pct: total > 0 ? Math.round((d.sessions / total) * 100) : 0,
    }));
  })();

  const contactChannels = (() => {
    if (!dashData?.contactChannels) return fallback.contactChannels;
    const cc = dashData.contactChannels;
    return ["form", "phone", "email", "whatsapp"].map((ch) => ({
      channel: ch === "form" ? "Contact Form" : ch === "phone" ? "Phone Call" : ch.charAt(0).toUpperCase() + ch.slice(1),
      count: cc[ch] ?? 0,
      pct: cc.total > 0 ? Math.round(((cc[ch] ?? 0) / cc.total) * 100) : 0,
      color: channelColors[ch],
    }));
  })();

  if (dashLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-[300px]" />
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {usingFallback && <DemoBanner />}

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {kpis.map((kpi) => {
          const Icon = iconMap[kpi.icon] || Activity;
          const hasChange = kpi.change !== 0;
          const positive = kpi.label === "Bounce Rate" ? kpi.change < 0 : kpi.change > 0;
          return (
            <div key={kpi.label} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C9A96E]/10">
                  <Icon className="h-3.5 w-3.5 text-[#C9A96E]" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-[22px] font-semibold text-foreground tracking-tight">{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 mb-2">{kpi.label}</p>
              {hasChange ? (
                <div className={`inline-flex items-center gap-1 text-[11px] font-medium ${positive ? "text-emerald-600" : "text-rose-500"}`}>
                  {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(kpi.change)}%
                </div>
              ) : (
                <span className="text-[11px] text-muted-foreground/40">—</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Sessions Chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-[13px] font-semibold text-foreground mb-4">Sessions Over Time</h3>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sessionsTimeline}>
              <defs>
                <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A96E" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#C9A96E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "hsl(var(--muted-foreground))" }}
              />
              <Area type="monotone" dataKey="sessions" stroke="#C9A96E" fill="url(#sessionGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="visitors" stroke="#7B9EAE" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-[13px] font-semibold text-foreground mb-4">Top 10 Pages</h3>
          <div className="space-y-2">
            {topPages.slice(0, 10).map((p: any, i: number) => (
              <div key={p.path} className="flex items-center gap-3">
                <span className="text-[11px] text-muted-foreground/50 w-4 text-right">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] text-foreground truncate block">{p.path}</span>
                  <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-[#C9A96E]/50" style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
                <span className="text-[12px] text-muted-foreground font-medium tabular-nums">{p.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Properties */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-[13px] font-semibold text-foreground mb-4">Top 10 Properties</h3>
          <div className="space-y-2">
            {topProperties.slice(0, 10).map((p: any, i: number) => (
              <div key={p.ref} className="flex items-center gap-3">
                <span className="text-[11px] text-muted-foreground/50 w-4 text-right">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-foreground truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.ref} · {p.location}</p>
                </div>
                <span className="text-[12px] text-muted-foreground font-medium tabular-nums">{p.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device + Channels */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-[13px] font-semibold text-foreground mb-4">Device Distribution</h3>
          <div className="flex items-center gap-8">
            <div className="h-[140px] w-[140px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={deviceDistribution} dataKey="pct" nameKey="device" cx="50%" cy="50%" innerRadius={35} outerRadius={60} strokeWidth={0}>
                    <Cell fill="#C9A96E" />
                    <Cell fill="#8B7355" />
                    <Cell fill="hsl(var(--muted))" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {deviceDistribution.map((d: any, i: number) => (
                <div key={d.device} className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-[#C9A96E]" : i === 1 ? "bg-[#8B7355]" : "bg-muted"}`} />
                  <span className="text-[12px] text-foreground">{d.device}</span>
                  <span className="text-[12px] text-muted-foreground ml-auto">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-[13px] font-semibold text-foreground mb-4">Contact Channels</h3>
          <div className="space-y-3">
            {contactChannels.map((ch: any) => (
              <div key={ch.channel}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-foreground">{ch.channel}</span>
                  <span className="text-[12px] text-muted-foreground font-medium">{ch.count} ({ch.pct}%)</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${ch.pct}%`, backgroundColor: ch.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
