import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "../../../shared/routes";

export function useAuditLogs(filters?: { userId?: string, tableName?: string, startDate?: Date, endDate?: Date }) {
  return useQuery({
    queryKey: ["auditLogs", filters],
    queryFn: async () => {
      const response = await fetch(buildUrl(api.auditLogs.list.path));
      if (!response.ok) throw new Error("Failed to fetch audit logs");
      return response.json();
    },
  });
}

export function useAuditLog(id: number | undefined) {
  return useQuery({
    queryKey: ["auditLog", id],
    queryFn: async () => {
      if (!id) throw new Error("Audit log ID is required");
      const response = await fetch(buildUrl(api.auditLogs.get.path, { id }));
      if (!response.ok) throw new Error("Failed to fetch audit log");
      return response.json();
    },
    enabled: !!id,
  });
}