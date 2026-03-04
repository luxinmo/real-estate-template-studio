import { topSearchLocations, topSearchTypes, searchPriceRanges, topAmenities, zeroResultSearches, topLocationQueries } from "./mock-data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle } from "lucide-react";

const BarSection = ({ title, data, dataKey, nameKey }: { title: string; data: any[]; dataKey: string; nameKey: string }) => (
  <div className="rounded-xl border border-[#1a1a2e] bg-[#12121e] p-5">
    <h3 className="text-[13px] font-semibold text-white mb-4">{title}</h3>
    <div className="h-[200px]">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 0 }}>
          <XAxis type="number" tick={{ fontSize: 10, fill: "#6a6a7a" }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey={nameKey} tick={{ fontSize: 11, fill: "#c4c4d4" }} axisLine={false} tickLine={false} width={100} />
          <Tooltip contentStyle={{ backgroundColor: "#12121e", border: "1px solid #1a1a2e", borderRadius: 8, fontSize: 12 }} />
          <Bar dataKey={dataKey} fill="#C9A96E" radius={[0, 4, 4, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const ListSection = ({ title, items, labelKey, valueKey, Icon }: { title: string; items: any[]; labelKey: string; valueKey: string; Icon?: any }) => (
  <div className="rounded-xl border border-[#1a1a2e] bg-[#12121e] p-5">
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon className="h-4 w-4 text-amber-400" strokeWidth={1.5} />}
      <h3 className="text-[13px] font-semibold text-white">{title}</h3>
    </div>
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-[11px] text-[#4a4a5a] w-4 text-right">{i + 1}</span>
          <span className="text-[12px] text-[#c4c4d4] flex-1 truncate">{item[labelKey]}</span>
          <span className="text-[12px] text-[#8a8a9a] font-medium tabular-nums">{item[valueKey]}</span>
        </div>
      ))}
    </div>
  </div>
);

const AnalyticsSearch = () => {
  return (
    <div className="space-y-6">
      {/* Top row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <BarSection title="Top Locations Searched" data={topSearchLocations} dataKey="searches" nameKey="location" />
        <BarSection title="Top Property Types" data={topSearchTypes} dataKey="searches" nameKey="type" />
      </div>

      {/* Second row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <BarSection title="Price Range Distribution" data={searchPriceRanges} dataKey="searches" nameKey="range" />
        <BarSection title="Top Amenities" data={topAmenities} dataKey="searches" nameKey="amenity" />
      </div>

      {/* Third row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-amber-500/20 bg-[#12121e] p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-amber-400" strokeWidth={1.5} />
            <h3 className="text-[13px] font-semibold text-amber-400">Zero Results Searches</h3>
            <span className="text-[10px] text-amber-400/60 ml-auto">Demand without stock</span>
          </div>
          <div className="space-y-2.5">
            {zeroResultSearches.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[11px] text-[#4a4a5a] w-4 text-right">{i + 1}</span>
                <span className="text-[12px] text-amber-300/80 flex-1 truncate font-mono">{item.query}</span>
                <span className="text-[12px] text-amber-400/60 font-medium tabular-nums">{item.count}×</span>
              </div>
            ))}
          </div>
        </div>
        <ListSection title="Top Location Queries" items={topLocationQueries} labelKey="query" valueKey="count" />
      </div>
    </div>
  );
};

export default AnalyticsSearch;
