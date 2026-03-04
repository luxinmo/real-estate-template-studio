import { useState } from "react";
import { Shield, Download, Bot, ToggleLeft, ToggleRight } from "lucide-react";
import { botSessions } from "./mock-data-fallback";

// TODO: Settings endpoint not available yet — using mock data
// TODO: Bot sessions endpoint not available yet — using mock data

const AnalyticsSettings = () => {
  const [retainData, setRetainData] = useState(true);
  const [anonymizeIps, setAnonymizeIps] = useState(true);
  const [trackBots, setTrackBots] = useState(false);

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className="text-[#C9A96E]">
      {on ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6 text-muted-foreground/40" />}
    </button>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Data Retention */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <Shield className="h-5 w-5 text-[#C9A96E]" strokeWidth={1.5} />
          <h3 className="text-[14px] font-semibold text-foreground">Data & Privacy</h3>
        </div>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] text-foreground font-medium">Data Retention</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Keep analytics data for 12 months</p>
            </div>
            <Toggle on={retainData} onToggle={() => setRetainData(!retainData)} />
          </div>
          <div className="border-t border-border" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] text-foreground font-medium">Anonymize IP Addresses</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Mask last octet of visitor IPs for GDPR compliance</p>
            </div>
            <Toggle on={anonymizeIps} onToggle={() => setAnonymizeIps(!anonymizeIps)} />
          </div>
          <div className="border-t border-border" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] text-foreground font-medium">Track Bot Sessions</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Include known bots in analytics data</p>
            </div>
            <Toggle on={trackBots} onToggle={() => setTrackBots(!trackBots)} />
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <Download className="h-5 w-5 text-[#C9A96E]" strokeWidth={1.5} />
          <h3 className="text-[14px] font-semibold text-foreground">Data Export</h3>
        </div>
        <p className="text-[12px] text-muted-foreground mb-4">Download your analytics data as CSV for external analysis.</p>
        <div className="flex gap-3">
          <button className="rounded-lg bg-[#C9A96E] px-4 py-2 text-[12px] font-medium text-white hover:bg-[#b8955e] transition-colors">
            Export All Data (CSV)
          </button>
          <button className="rounded-lg border border-border bg-background px-4 py-2 text-[12px] font-medium text-muted-foreground hover:border-[#C9A96E]/40 transition-colors">
            Export Sessions Only
          </button>
          <button className="rounded-lg border border-border bg-background px-4 py-2 text-[12px] font-medium text-muted-foreground hover:border-[#C9A96E]/40 transition-colors">
            Export Contacts Only
          </button>
        </div>
      </div>

      {/* Bot Sessions */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center gap-3">
          <Bot className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <h3 className="text-[13px] font-semibold text-foreground">Bot Sessions Detected</h3>
          <span className="text-[11px] text-muted-foreground/50 ml-auto">Excluded from analytics</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">IP</th>
                <th className="px-5 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">User Agent</th>
                <th className="px-5 py-2.5 text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Sessions</th>
                <th className="px-5 py-2.5 text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {botSessions.map((b, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 text-muted-foreground font-mono">{b.ip}</td>
                  <td className="px-5 py-3 text-foreground">{b.ua}</td>
                  <td className="px-5 py-3 text-right text-foreground font-medium tabular-nums">{b.sessions}</td>
                  <td className="px-5 py-3 text-right text-muted-foreground">{b.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSettings;
