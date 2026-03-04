import { useQuery } from "@tanstack/react-query";
import {
  fetchDashboard,
  fetchLive,
  fetchFunnel,
  fetchSearchInsights,
  fetchPropertiesRanking,
  fetchTimeline,
} from "@/lib/analytics-api";

export function useDashboard(range: string) {
  return useQuery({
    queryKey: ["analytics", "dashboard", range],
    queryFn: () => fetchDashboard(range),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function useLive() {
  return useQuery({
    queryKey: ["analytics", "live"],
    queryFn: fetchLive,
    refetchInterval: 10_000,
  });
}

export function useFunnel(range: string) {
  return useQuery({
    queryKey: ["analytics", "funnel", range],
    queryFn: () => fetchFunnel(range),
    staleTime: 60_000,
  });
}

export function useSearchInsights(range: string) {
  return useQuery({
    queryKey: ["analytics", "search-insights", range],
    queryFn: () => fetchSearchInsights(range),
    staleTime: 60_000,
  });
}

export function usePropertiesRanking(range: string) {
  return useQuery({
    queryKey: ["analytics", "properties-ranking", range],
    queryFn: () => fetchPropertiesRanking(range),
    staleTime: 60_000,
  });
}

export function useTimeline(range: string, metric = "sessions") {
  return useQuery({
    queryKey: ["analytics", "timeline", range, metric],
    queryFn: () => fetchTimeline(range, metric),
    staleTime: 60_000,
  });
}
