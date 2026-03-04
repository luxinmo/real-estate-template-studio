import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertCircle } from "lucide-react";
import { useDashboard, usePropertiesRanking, useTimeline } from "@/hooks/useAnalytics";
import * as fallback from "./mock-data-fallback";
import { Flag } from "./flags";

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

const AnalyticsContacts = ({ dateRange = "Last 30 days" }: { dateRange?: string }) => {
  const { data: dashData, isLoading: dashLoading, isError: dashError } = useDashboard(dateRange);
  const { data: propsData } = usePropertiesRanking(dateRange);
  const { data: timelineData } = useTimeline(dateRange, "conversions");

  const usingFallback = dashError || (!dashLoading && !dashData);

  // ── Contact Channels ──
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

  const totalContacts = contactChannels.reduce((sum, c) => sum + c.count, 0);

  // ── Contacts Timeline ──
  const contactsTimeline = timelineData?.length
    ? timelineData.map((t: any) => ({
        date: new Date(t.period).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
        form: t.count ?? 0,
        phone: 0, // TODO: API doesn't split by channel in timeline
        email: 0,
        whatsapp: 0,
      }))
    : fallback.contactsTimeline;

  // ── Top contact-generating properties ──
  const topContactProperties = (() => {
    if (!propsData?.mostContacted?.length) {
      return [...fallback.topProperties].sort((a, b) => b.contacts - a.contacts).slice(0, 8);
    }
    return propsData.mostContacted.slice(0, 8).map((p: any) => ({
      ref: p.ref,
      name: p.ref, // TODO: enrich
      contacts: p.count,
    }));
  })();

  // ── Conversion by Country ──
  const conversionByCountry = (() => {
    if (!dashData?.byCountry?.length) return fallback.conversionByCountry;
    const totalSessions = dashData.overview?.sessions ?? 1;
    return dashData.byCountry.map((c: any) => ({
      country: c.value,
      code: c.value,
      contacts: Math.round(c.sessions * (dashData.overview?.conversionRate ?? 0) / 100),
      rate: ((c.sessions / totalSessions) * (dashData.overview?.conversionRate ?? 0)).toFixed(1) + "%",
    }));
  })();

  if (dashLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-[300px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {usingFallback && <DemoBanner />}

      {/* Total + channels */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="col-span-2 lg:col-span-1 rounded-xl border border-[#C9A96E]/20 bg-gradient-to-br from-[#C9A96E]/5 to-transparent p-5">
          <p className="text-[11px] text-[#C9A96E] uppercase tracking-wider font-medium">Total Contacts</p>
          <p className="text-[36px] font-light text-foreground tracking-tighter mt-1">{totalContacts}</p>
          <p className="text-[11px] text-muted-foreground">{dateRange}</p>
        </div>
        {contactChannels.map((ch) => (
          <div key={ch.channel} className="rounded-xl border border-border bg-card p-4">
            <p className="text-[11px] text-muted-foreground mb-2">{ch.channel}</p>
            <p className="text-[22px] font-semibold text-foreground">{ch.count}</p>
            <div className="h-1 rounded-full bg-muted mt-2 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${ch.pct}%`, backgroundColor: ch.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-[13px] font-semibold text-foreground mb-4">Contacts Over Time</h3>
        <div className="h-[260px]">
          <ResponsiveContainer>
            <AreaChart data={contactsTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="form" stackId="1" stroke="#C9A96E" fill="#C9A96E" fillOpacity={0.2} />
              <Area type="monotone" dataKey="phone" stackId="1" stroke="#8B7355" fill="#8B7355" fillOpacity={0.2} />
              <Area type="monotone" dataKey="email" stackId="1" stroke="#6B8E7B" fill="#6B8E7B" fillOpacity={0.2} />
              <Area type="monotone" dataKey="whatsapp" stackId="1" stroke="#7B9EAE" fill="#7B9EAE" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-3">
          {[
            { label: "Form", color: "#C9A96E" },
            { label: "Phone", color: "#8B7355" },
            { label: "Email", color: "#6B8E7B" },
            { label: "WhatsApp", color: "#7B9EAE" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} />
              <span className="text-[11px] text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-[13px] font-semibold text-foreground mb-4">Top Contact-Generating Properties</h3>
          <div className="space-y-2">
            {topContactProperties.map((p: any, i: number) => (
              <div key={p.ref} className="flex items-center gap-3">
                <span className="text-[11px] text-muted-foreground/50 w-4 text-right">{i + 1}</span>
                <span className="text-[11px] text-[#C9A96E] font-mono w-10">{p.ref}</span>
                <span className="text-[12px] text-foreground flex-1 truncate">{p.name}</span>
                <span className="text-[12px] text-foreground font-semibold">{p.contacts}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-[13px] font-semibold text-foreground mb-4">Conversion by Country</h3>
          <div className="space-y-2">
            {conversionByCountry.map((c: any) => (
              <div key={c.country} className="flex items-center gap-3">
                <Flag code={c.code} />
                <span className="text-[12px] text-foreground flex-1">{c.country}</span>
                <span className="text-[12px] text-muted-foreground tabular-nums">{c.contacts} contacts</span>
                <span className="text-[12px] text-[#C9A96E] font-medium w-12 text-right">{c.rate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsContacts;
