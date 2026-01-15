import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useDashboardStats(orgId: number | undefined) {
  return useQuery({
    queryKey: [api.analytics.dashboard.path, orgId],
    enabled: !!orgId,
    queryFn: async () => {
      if (!orgId) return null;
      const url = buildUrl(api.analytics.dashboard.path, { orgId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      return api.analytics.dashboard.responses[200].parse(await res.json());
    },
  });
}

export function useEmployeePerformance(employeeId: number | undefined) {
  return useQuery({
    queryKey: [api.analytics.employeePerformance.path, employeeId],
    enabled: !!employeeId,
    queryFn: async () => {
      if (!employeeId) return [];
      const url = buildUrl(api.analytics.employeePerformance.path, { id: employeeId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch performance data");
      return api.analytics.employeePerformance.responses[200].parse(await res.json());
    },
  });
}
