import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { countryBreakdown, languageBreakdown, trafficSources, deviceDistribution, newVsReturning } from "./mock-data";

const AnalyticsAudience = () => {
  return (
    <div className="space-y-6">
      {/* World map + country table */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map placeholder */}
        <div className="rounded-xl border border-[#1a1a2e] bg-[#12121e] p-5">
          <h3 className="text-[13px] font-semibold text-white mb-4">Visitor Distribution</h3>
          <div className="aspect-[4/3] rounded-lg bg-[#0a0a14] border border-[#1a1a2e] flex items-center justify-center relative overflow-hidden">
            <div className="text-[11px] text-[#4a4a5a]">🌍 World Map</div>
            {/* Simulated heat zones */}
            <div className="absolute top-[30%] left-[45%] h-8 w-8 rounded-full bg-[#C9A96E]/20 animate-pulse" />
            <div className="absolute top-[35%] left-[48%] h-12 w-12 rounded-full bg-[#C9A96E]/15 animate-pulse" />
            <div className="absolute top-[42%] left-[46%] h-6 w-6 rounded-full bg-[#C9A96E]/10 animate-pulse" />
          </div>
        </div>

        {/* Country table */}
        <div className="lg:col-span-2 rounded-xl border border-[#1a1a2e] bg-[#12121e] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#1a1a2e]">
            <h3 className="text-[13px] font-semibold text-white">Sessions by Country</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-[#1a1a2e]">
                  <th className="px-5 py-2.5 text-left text-[11px] font-medium text-[#6a6a7a] uppercase tracking-wider">Country</th>
                  <th className="px-5 py-2.5 text-right text-[11px] font-medium text-[#6a6a7a] uppercase tracking-wider">Sessions</th>
                  <th className="px-5 py-2.5 text-right text-[11px] font-medium text-[#6a6a7a] uppercase tracking-wider">Conversions</th>
                  <th className="px-5 py-2.5 text-right text-[11px] font-medium text-[#6a6a7a] uppercase tracking-wider">Avg. Time</th>
                  <th className="px-5 py-2.5 text-right text-[11px] font-medium text-[#6a6a7a] uppercase tracking-wider">Share</th>
                </tr>
              </thead>
              <tbody>
                {countryBreakdown.map((c) => (
                  <tr key={c.code} className="border-b border-[#1a1a2e]/50 hover:bg-[#1a1a2e]/30 transition-colors">
                    <td className="px-5 py-3 text-[#c4c4d4]">
                      <span className="mr-2">{c.flag}</span>{c.name}
                    </td>
                    <td className="px-5 py-3 text-right text-white font-medium tabular-nums">{c.sessions.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-[#C9A96E] font-medium tabular-nums">{c.conversions}</td>
                    <td className="px-5 py-3 text-right text-[#8a8a9a] tabular-nums">{c.avgTime}</td>
                    <td className="px-5 py-3 text-right text-[#6a6a7a] tabular-nums">{c.pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Language + Source + Device + New vs Returning */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Language */}
        <div className="rounded-xl border border-[#1a1a2e] bg-[#12121e] p-5">
          <h3 className="text-[13px] font-semibold text-white mb-4">By Language</h3>
          <div className="space-y-2.5">
            {languageBreakdown.map((l) => (
              <div key={l.lang}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-[#c4c4d4]">{l.label}</span>
                  <span className="text-[11px] text-[#6a6a7a] tabular-nums">{l.pct}%</span>
                </div>
                <div className="h-1 rounded-full bg-[#1a1a2e] overflow-hidden">
                  <div className="h-full rounded-full bg-[#C9A96E]" style={{ width: `${l.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Source */}
        <div className="rounded-xl border border-[#1a1a2e] bg-[#12121e] p-5">
          <h3 className="text-[13px] font-semibold text-white mb-4">Traffic Source</h3>
          <div className="space-y-2.5">
            {trafficSources.map((s) => (
              <div key={s.source}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-[#c4c4d4]">{s.source}</span>
                  <span className="text-[11px] text-[#6a6a7a] tabular-nums">{s.pct}%</span>
                </div>
                <div className="h-1 rounded-full bg-[#1a1a2e] overflow-hidden">
                  <div className="h-full rounded-full bg-[#8B7355]" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device */}
        <div className="rounded-xl border border-[#1a1a2e] bg-[#12121e] p-5">
          <h3 className="text-[13px] font-semibold text-white mb-4">By Device</h3>
          <div className="h-[120px] flex items-center justify-center">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={deviceDistribution} dataKey="pct" nameKey="device" cx="50%" cy="50%" innerRadius={30} outerRadius={50} strokeWidth={0}>
                  <Cell fill="#C9A96E" />
                  <Cell fill="#8B7355" />
                  <Cell fill="#4a4a5a" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {deviceDistribution.map((d, i) => (
              <div key={d.device} className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${i === 0 ? "bg-[#C9A96E]" : i === 1 ? "bg-[#8B7355]" : "bg-[#4a4a5a]"}`} />
                <span className="text-[11px] text-[#c4c4d4]">{d.device}</span>
                <span className="text-[11px] text-[#6a6a7a] ml-auto">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* New vs Returning */}
        <div className="rounded-xl border border-[#1a1a2e] bg-[#12121e] p-5">
          <h3 className="text-[13px] font-semibold text-white mb-4">New vs Returning</h3>
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
                  <Cell fill="#2a2a3e" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C9A96E]" />
              <span className="text-[11px] text-[#c4c4d4]">New visitors</span>
              <span className="text-[11px] text-[#6a6a7a] ml-auto">{newVsReturning.new}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#2a2a3e]" />
              <span className="text-[11px] text-[#c4c4d4]">Returning</span>
              <span className="text-[11px] text-[#6a6a7a] ml-auto">{newVsReturning.returning}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsAudience;
