import { TrendingUp, TrendingDown, Activity, Users, Eye, Layers, Clock, Target, LogOut } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { kpis, sessionsTimeline, topPages, topProperties, deviceDistribution, contactChannels } from "./mock-data";

const iconMap: Record<string, any> = {
  activity: Activity, users: Users, eye: Eye, layers: Layers,
  clock: Clock, target: Target, "log-out": LogOut,
};

const AnalyticsOverview = () => {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {kpis.map((kpi) => {
          const Icon = iconMap[kpi.icon] || Activity;
          const positive = kpi.label === "Bounce Rate" ? kpi.change < 0 : kpi.change > 0;
          return (
            <div key={kpi.label} className="rounded-xl border border-[#1a1a2e] bg-[#12121e] p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C9A96E]/10">
                  <Icon className="h-3.5 w-3.5 text-[#C9A96E]" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-[22px] font-semibold text-white tracking-tight">{kpi.value}</p>
              <p className="text-[11px] text-[#6a6a7a] mt-0.5 mb-2">{kpi.label}</p>
              <div className={`inline-flex items-center gap-1 text-[11px] font-medium ${positive ? "text-emerald-400" : "text-rose-400"}`}>
                {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(kpi.change)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Sessions Chart */}
      <div className="rounded-xl border border-[#1a1a2e] bg-[#12121e] p-5">
        <h3 className="text-[13px] font-semibold text-white mb-4">Sessions Over Time</h3>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sessionsTimeline}>
              <defs>
                <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A96E" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#C9A96E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6a6a7a" }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: "#6a6a7a" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#12121e", border: "1px solid #1a1a2e", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#8a8a9a" }}
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
        <div className="rounded-xl border border-[#1a1a2e] bg-[#12121e] p-5">
          <h3 className="text-[13px] font-semibold text-white mb-4">Top 10 Pages</h3>
          <div className="space-y-2">
            {topPages.map((p, i) => (
              <div key={p.path} className="flex items-center gap-3">
                <span className="text-[11px] text-[#4a4a5a] w-4 text-right">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-[#c4c4d4] truncate">{p.path}</span>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-[#1a1a2e] overflow-hidden">
                    <div className="h-full rounded-full bg-[#C9A96E]/60" style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
                <span className="text-[12px] text-[#8a8a9a] font-medium tabular-nums">{p.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Properties */}
        <div className="rounded-xl border border-[#1a1a2e] bg-[#12121e] p-5">
          <h3 className="text-[13px] font-semibold text-white mb-4">Top 10 Properties</h3>
          <div className="space-y-2">
            {topProperties.map((p, i) => (
              <div key={p.ref} className="flex items-center gap-3">
                <span className="text-[11px] text-[#4a4a5a] w-4 text-right">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#c4c4d4] truncate">{p.name}</p>
                  <p className="text-[10px] text-[#6a6a7a]">{p.ref} · {p.location}</p>
                </div>
                <span className="text-[12px] text-[#8a8a9a] font-medium tabular-nums">{p.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device + Channels */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Device */}
        <div className="rounded-xl border border-[#1a1a2e] bg-[#12121e] p-5">
          <h3 className="text-[13px] font-semibold text-white mb-4">Device Distribution</h3>
          <div className="flex items-center gap-8">
            <div className="h-[140px] w-[140px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={deviceDistribution} dataKey="pct" nameKey="device" cx="50%" cy="50%" innerRadius={35} outerRadius={60} strokeWidth={0}>
                    <Cell fill="#C9A96E" />
                    <Cell fill="#8B7355" />
                    <Cell fill="#4a4a5a" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {deviceDistribution.map((d, i) => (
                <div key={d.device} className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-[#C9A96E]" : i === 1 ? "bg-[#8B7355]" : "bg-[#4a4a5a]"}`} />
                  <span className="text-[12px] text-[#c4c4d4]">{d.device}</span>
                  <span className="text-[12px] text-[#6a6a7a] ml-auto">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Channels */}
        <div className="rounded-xl border border-[#1a1a2e] bg-[#12121e] p-5">
          <h3 className="text-[13px] font-semibold text-white mb-4">Contact Channels</h3>
          <div className="space-y-3">
            {contactChannels.map((ch) => (
              <div key={ch.channel}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-[#c4c4d4]">{ch.channel}</span>
                  <span className="text-[12px] text-[#8a8a9a] font-medium">{ch.count} ({ch.pct}%)</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#1a1a2e] overflow-hidden">
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
