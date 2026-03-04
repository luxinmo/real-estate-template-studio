import { topSearchLocations, topSearchTypes, searchPriceRanges, topAmenities, zeroResultSearches, topLocationQueries } from "./mock-data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle } from "lucide-react";

const BarSection = ({ title, data, dataKey, nameKey }: { title: string; data: any[]; dataKey: string; nameKey: string }) => (
  <div className="rounded-xl border border-border bg-card p-5">
    <h3 className="text-[13px] font-semibold text-foreground mb-4">{title}</h3>
    <div className="h-[200px]">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 0 }}>
          <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey={nameKey} tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }} axisLine={false} tickLine={false} width={100} />
          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
          <Bar dataKey={dataKey} fill="#C9A96E" radius={[0, 4, 4, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const AnalyticsSearch = () => {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <BarSection title="Top Locations Searched" data={topSearchLocations} dataKey="searches" nameKey="location" />
        <BarSection title="Top Property Types" data={topSearchTypes} dataKey="searches" nameKey="type" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <BarSection title="Price Range Distribution" data={searchPriceRanges} dataKey="searches" nameKey="range" />
        <BarSection title="Top Amenities" data={topAmenities} dataKey="searches" nameKey="amenity" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-amber-300/40 bg-amber-50/50 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-amber-600" strokeWidth={1.5} />
            <h3 className="text-[13px] font-semibold text-amber-700">Zero Results Searches</h3>
            <span className="text-[10px] text-amber-600/60 ml-auto">Demand without stock</span>
          </div>
          <div className="space-y-2.5">
            {zeroResultSearches.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[11px] text-muted-foreground/50 w-4 text-right">{i + 1}</span>
                <span className="text-[12px] text-amber-800 flex-1 truncate font-mono">{item.query}</span>
                <span className="text-[12px] text-amber-600/70 font-medium tabular-nums">{item.count}×</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-[13px] font-semibold text-foreground mb-4">Top Location Queries</h3>
          <div className="space-y-2.5">
            {topLocationQueries.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[11px] text-muted-foreground/50 w-4 text-right">{i + 1}</span>
                <span className="text-[12px] text-foreground flex-1 truncate">{item.query}</span>
                <span className="text-[12px] text-muted-foreground font-medium tabular-nums">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSearch;
