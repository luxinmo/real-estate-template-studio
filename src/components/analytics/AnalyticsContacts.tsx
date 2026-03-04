import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { contactChannels, contactsTimeline, topProperties, conversionByCountry } from "./mock-data";

const AnalyticsContacts = () => {
  const totalContacts = contactChannels.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="space-y-6">
      {/* Total + channels */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="col-span-2 lg:col-span-1 rounded-xl border border-[#C9A96E]/20 bg-gradient-to-br from-[#C9A96E]/5 to-transparent p-5">
          <p className="text-[11px] text-[#C9A96E] uppercase tracking-wider font-medium">Total Contacts</p>
          <p className="text-[36px] font-light text-foreground tracking-tighter mt-1">{totalContacts}</p>
          <p className="text-[11px] text-muted-foreground">Last 30 days</p>
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
            {[...topProperties].sort((a, b) => b.contacts - a.contacts).slice(0, 8).map((p, i) => (
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
            {conversionByCountry.map((c) => (
              <div key={c.country} className="flex items-center gap-3">
                <span className="text-sm">{c.flag}</span>
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
