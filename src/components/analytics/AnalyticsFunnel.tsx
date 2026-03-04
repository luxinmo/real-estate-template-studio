import { Monitor, Smartphone, Tablet, AlertCircle } from "lucide-react";
import { useFunnel } from "@/hooks/useAnalytics";
import * as fallback from "./mock-data-fallback";

const stepColors = ["#C9A96E", "#B8955E", "#A0824F", "#8B7042", "#705B36"];
const deviceIcons: Record<string, any> = { Desktop: Monitor, Mobile: Smartphone, Tablet: Tablet };

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-muted ${className}`} />
);

const DemoBanner = () => (
  <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 mb-4">
    <AlertCircle className="h-3.5 w-3.5 text-amber-600" strokeWidth={1.5} />
    <span className="text-[11px] text-amber-700 font-medium">Using demo data — API unavailable</span>
  </div>
);

const AnalyticsFunnel = ({ dateRange = "Last 30 days" }: { dateRange?: string }) => {
  const { data: apiData, isLoading, isError } = useFunnel(dateRange);

  const usingFallback = isError || (!isLoading && !apiData);

  // ── Transform API data or use fallback ──
  const funnelSteps = apiData?.steps?.length
    ? apiData.steps.map((s: any) => ({
        step: s.name,
        value: s.count,
        pct: Number(s.pct),
      }))
    : fallback.funnelSteps;

  // TODO: API doesn't provide funnel by device yet — using fallback
  const funnelByDevice = fallback.funnelByDevice;

  // TODO: API doesn't provide conversion by language yet — using inline data
  const conversionByLang = [
    { lang: "EN", rate: "2.8%", sessions: 1124 },
    { lang: "DE", rate: "3.1%", sessions: 892 },
    { lang: "NL", rate: "3.1%", sessions: 412 },
    { lang: "ES", rate: "2.4%", sessions: 356 },
    { lang: "FR", rate: "3.0%", sessions: 198 },
    { lang: "SV", rate: "3.2%", sessions: 156 },
    { lang: "RU", rate: "2.6%", sessions: 77 },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[300px]" />
        <Skeleton className="h-[250px]" />
        <Skeleton className="h-[120px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {usingFallback && <DemoBanner />}

      {/* Main Funnel */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-[13px] font-semibold text-foreground mb-6">Conversion Funnel</h3>
        <div className="space-y-3 max-w-2xl mx-auto">
          {funnelSteps.map((step: any, i: number) => {
            const widthPct = Math.max(step.pct, 12);
            const dropOff = i > 0 ? ((funnelSteps[i - 1].value - step.value) / funnelSteps[i - 1].value * 100).toFixed(1) : null;
            return (
              <div key={step.step} className="relative">
                {dropOff && (
                  <div className="absolute -top-2.5 right-0 text-[10px] text-rose-500 font-medium">
                    −{dropOff}% drop-off
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className="w-32 text-right">
                    <p className="text-[12px] text-foreground font-medium">{step.step}</p>
                  </div>
                  <div className="flex-1 h-10 bg-muted rounded-lg overflow-hidden relative">
                    <div
                      className="h-full rounded-lg flex items-center px-4 transition-all duration-500"
                      style={{ width: `${widthPct}%`, backgroundColor: stepColors[i] || stepColors[stepColors.length - 1] }}
                    >
                      <span className="text-[12px] font-semibold text-white whitespace-nowrap">
                        {step.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="w-14 text-right">
                    <span className="text-[12px] text-muted-foreground font-medium tabular-nums">{step.pct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Funnel by Device — TODO: needs API endpoint */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-[13px] font-semibold text-foreground mb-6">Funnel by Device</h3>
        <div className="grid lg:grid-cols-3 gap-6">
          {funnelByDevice.map((fd) => {
            const DeviceIcon = deviceIcons[fd.device] || Monitor;
            const total = fd.steps[0];
            return (
              <div key={fd.device} className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <DeviceIcon className="h-4 w-4 text-[#C9A96E]" strokeWidth={1.5} />
                  <span className="text-[12px] text-foreground font-medium">{fd.device}</span>
                  <span className="text-[11px] text-muted-foreground ml-auto">{total.toLocaleString()} sessions</span>
                </div>
                {fallback.funnelSteps.map((step, i) => {
                  const val = fd.steps[i];
                  const pct = ((val / total) * 100).toFixed(1);
                  const barW = Math.max((val / total) * 100, 8);
                  return (
                    <div key={step.step} className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-20 text-right truncate">{step.step}</span>
                      <div className="flex-1 h-5 bg-muted rounded overflow-hidden">
                        <div className="h-full rounded" style={{ width: `${barW}%`, backgroundColor: stepColors[i] }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground w-8 text-right tabular-nums">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Funnel by Language — TODO: needs API endpoint */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-[13px] font-semibold text-foreground mb-4">Conversion Rate by Language</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {conversionByLang.map((l) => (
            <div key={l.lang} className="rounded-lg border border-border bg-muted/30 p-3 text-center">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{l.lang}</p>
              <p className="text-[18px] text-[#C9A96E] font-semibold mt-1">{l.rate}</p>
              <p className="text-[10px] text-muted-foreground/50 mt-0.5">{l.sessions} sessions</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsFunnel;
