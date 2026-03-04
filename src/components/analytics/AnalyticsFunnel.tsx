import { funnelSteps, funnelByDevice } from "./mock-data";
import { Monitor, Smartphone, Tablet } from "lucide-react";

const stepColors = ["#C9A96E", "#B8955E", "#A0824F", "#8B7042", "#705B36"];
const deviceIcons: Record<string, any> = { Desktop: Monitor, Mobile: Smartphone, Tablet: Tablet };

const AnalyticsFunnel = () => {
  return (
    <div className="space-y-6">
      {/* Main Funnel */}
      <div className="rounded-xl border border-[#1a1a2e] bg-[#12121e] p-6">
        <h3 className="text-[13px] font-semibold text-white mb-6">Conversion Funnel</h3>
        <div className="space-y-3 max-w-2xl mx-auto">
          {funnelSteps.map((step, i) => {
            const widthPct = Math.max(step.pct, 12);
            const dropOff = i > 0 ? ((funnelSteps[i - 1].value - step.value) / funnelSteps[i - 1].value * 100).toFixed(1) : null;
            return (
              <div key={step.step} className="relative">
                {dropOff && (
                  <div className="absolute -top-2.5 right-0 text-[10px] text-rose-400/80 font-medium">
                    −{dropOff}% drop-off
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className="w-32 text-right">
                    <p className="text-[12px] text-[#c4c4d4] font-medium">{step.step}</p>
                  </div>
                  <div className="flex-1 h-10 bg-[#0a0a14] rounded-lg overflow-hidden relative">
                    <div
                      className="h-full rounded-lg flex items-center px-4 transition-all duration-500"
                      style={{ width: `${widthPct}%`, backgroundColor: stepColors[i] }}
                    >
                      <span className="text-[12px] font-semibold text-[#0a0a0f] whitespace-nowrap">
                        {step.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="w-14 text-right">
                    <span className="text-[12px] text-[#8a8a9a] font-medium tabular-nums">{step.pct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Funnel by Device */}
      <div className="rounded-xl border border-[#1a1a2e] bg-[#12121e] p-6">
        <h3 className="text-[13px] font-semibold text-white mb-6">Funnel by Device</h3>
        <div className="grid lg:grid-cols-3 gap-6">
          {funnelByDevice.map((fd) => {
            const DeviceIcon = deviceIcons[fd.device] || Monitor;
            const total = fd.steps[0];
            return (
              <div key={fd.device} className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <DeviceIcon className="h-4 w-4 text-[#C9A96E]" strokeWidth={1.5} />
                  <span className="text-[12px] text-white font-medium">{fd.device}</span>
                  <span className="text-[11px] text-[#6a6a7a] ml-auto">{total.toLocaleString()} sessions</span>
                </div>
                {funnelSteps.map((step, i) => {
                  const val = fd.steps[i];
                  const pct = ((val / total) * 100).toFixed(1);
                  const barW = Math.max((val / total) * 100, 8);
                  return (
                    <div key={step.step} className="flex items-center gap-2">
                      <span className="text-[10px] text-[#6a6a7a] w-20 text-right truncate">{step.step}</span>
                      <div className="flex-1 h-5 bg-[#0a0a14] rounded overflow-hidden">
                        <div className="h-full rounded" style={{ width: `${barW}%`, backgroundColor: stepColors[i] + "cc" }} />
                      </div>
                      <span className="text-[10px] text-[#8a8a9a] w-8 text-right tabular-nums">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Funnel by Language */}
      <div className="rounded-xl border border-[#1a1a2e] bg-[#12121e] p-6">
        <h3 className="text-[13px] font-semibold text-white mb-4">Conversion Rate by Language</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { lang: "EN", rate: "2.8%", sessions: 1124 },
            { lang: "DE", rate: "3.1%", sessions: 892 },
            { lang: "NL", rate: "3.1%", sessions: 412 },
            { lang: "ES", rate: "2.4%", sessions: 356 },
            { lang: "FR", rate: "3.0%", sessions: 198 },
            { lang: "SV", rate: "3.2%", sessions: 156 },
            { lang: "RU", rate: "2.6%", sessions: 77 },
          ].map((l) => (
            <div key={l.lang} className="rounded-lg border border-[#1a1a2e] bg-[#0a0a14] p-3 text-center">
              <p className="text-[11px] text-[#6a6a7a] uppercase tracking-wider">{l.lang}</p>
              <p className="text-[18px] text-[#C9A96E] font-semibold mt-1">{l.rate}</p>
              <p className="text-[10px] text-[#4a4a5a] mt-0.5">{l.sessions} sessions</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsFunnel;
