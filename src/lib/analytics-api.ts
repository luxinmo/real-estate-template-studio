// ── Analytics API Client ──
// Connects to the external analytics backend (6 endpoints)

const API_BASE = import.meta.env.VITE_ANALYTICS_API_URL || "http://localhost:3200";

function buildUrl(path: string, params?: Record<string, string>) {
  const url = new URL(`/api/analytics${path}`, API_BASE);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v);
    });
  }
  return url.toString();
}

/** Convert the UI date range selector value to from/to ISO params */
export function dateRangeToParams(range: string): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  switch (range) {
    case "Last 7 days": from.setDate(to.getDate() - 7); break;
    case "Last 14 days": from.setDate(to.getDate() - 14); break;
    case "Last 30 days": from.setDate(to.getDate() - 30); break;
    case "Last 90 days": from.setDate(to.getDate() - 90); break;
    case "This month": from.setDate(1); break;
    case "Last month":
      from.setMonth(to.getMonth() - 1, 1);
      to.setDate(0);
      break;
    default: from.setDate(to.getDate() - 30);
  }
  return { from: from.toISOString(), to: to.toISOString() };
}

/** Format seconds to "Xm Ys" */
export function formatDuration(seconds: number): string {
  if (!seconds && seconds !== 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

/** Format ISO date to time-since string */
export function formatTimeSince(iso: string): string {
  if (!iso) return "—";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  const m = Math.floor(diff / 60);
  const s = diff % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

// ── Fetch functions ──

export async function fetchDashboard(range: string) {
  const params = dateRangeToParams(range);
  const res = await fetch(buildUrl("/dashboard", params));
  if (!res.ok) throw new Error(`Dashboard API error: ${res.status}`);
  return res.json();
}

export async function fetchLive() {
  const res = await fetch(buildUrl("/live"));
  if (!res.ok) throw new Error(`Live API error: ${res.status}`);
  return res.json();
}

export async function fetchFunnel(range: string) {
  const params = dateRangeToParams(range);
  const res = await fetch(buildUrl("/funnel", params));
  if (!res.ok) throw new Error(`Funnel API error: ${res.status}`);
  return res.json();
}

export async function fetchSearchInsights(range: string) {
  const params = dateRangeToParams(range);
  const res = await fetch(buildUrl("/search-insights", params));
  if (!res.ok) throw new Error(`Search API error: ${res.status}`);
  return res.json();
}

export async function fetchPropertiesRanking(range: string) {
  const params = dateRangeToParams(range);
  const res = await fetch(buildUrl("/properties/ranking", params));
  if (!res.ok) throw new Error(`Properties API error: ${res.status}`);
  return res.json();
}

export async function fetchTimeline(range: string, metric: string = "sessions", granularity: string = "day") {
  const params = { ...dateRangeToParams(range), metric, granularity };
  const res = await fetch(buildUrl("/timeline", params));
  if (!res.ok) throw new Error(`Timeline API error: ${res.status}`);
  return res.json();
}
