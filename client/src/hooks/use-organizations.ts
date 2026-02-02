import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type Organization } from "@shared/schema";
import { z } from "zod";
import { insertOrganizationSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useOrganizations() {
  return useQuery({
    queryKey: [api.organizations.list.path],
    queryFn: async () => {
      const res = await fetch(api.organizations.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch organizations");
      return api.organizations.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: z.infer<typeof insertOrganizationSchema>) => {
      const res = await fetch(api.organizations.create.path, {
        method: api.organizations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create organization");
      }
      
      return api.organizations.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.organizations.list.path] });
      toast({ title: "Success", description: "Organization created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDepartments(orgId: number | undefined) {
  return useQuery({
    queryKey: [api.departments.list.path, orgId],
    enabled: !!orgId,
    queryFn: async () => {
      if (!orgId) return [];
      const url = buildUrl(api.departments.list.path, { orgId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch departments");
      return api.departments.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ orgId, data }: { orgId: number; data: { name: string; managerId?: number } }) => {
      const url = buildUrl(api.departments.create.path, { orgId });
      const res = await fetch(url, {
        method: api.departments.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to create department");
      return api.departments.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.departments.list.path, variables.orgId] });
      toast({ title: "Success", description: "Department created successfully" });
    },
  });
}
