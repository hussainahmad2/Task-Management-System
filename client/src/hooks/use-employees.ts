import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type CreateEmployeeRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useEmployees(orgId: number | undefined) {
  return useQuery({
    queryKey: [api.employees.list.path, orgId],
    enabled: !!orgId,
    queryFn: async () => {
      if (!orgId) return [];
      const url = buildUrl(api.employees.list.path, { orgId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch employees");
      return api.employees.list.responses[200].parse(await res.json());
    },
  });
}

export function useEmployee(id: number | undefined) {
  return useQuery({
    queryKey: [api.employees.get.path, id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.employees.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch employee details");
      return api.employees.get.responses[200].parse(await res.json());
    },
  });
}

// Type for employee creation payload (includes user fields + string date)
type EmployeeCreatePayload = Omit<CreateEmployeeRequest, 'orgId' | 'joiningDate'> & {
  joiningDate: string; // API expects string in YYYY-MM-DD format
  username?: string;
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
};

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ orgId, data }: { orgId: number; data: EmployeeCreatePayload }) => {
      const url = buildUrl(api.employees.create.path, { orgId });
      const res = await fetch(url, {
        method: api.employees.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create employee");
      }
      return api.employees.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.employees.list.path, variables.orgId] });
      toast({ title: "Success", description: "Employee added successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useHierarchy(orgId: number | undefined) {
  return useQuery({
    queryKey: [api.employees.hierarchy.path, orgId],
    enabled: !!orgId,
    queryFn: async () => {
      if (!orgId) return null;
      const url = buildUrl(api.employees.hierarchy.path, { orgId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch hierarchy");
      return await res.json();
    },
  });
}
