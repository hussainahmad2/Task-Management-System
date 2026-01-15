import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type CreateTaskRequest, type UpdateTaskRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export interface TaskFilters {
  assigneeId?: string;
  status?: string;
  priority?: string;
}

export function useTasks(orgId: number | undefined, filters?: TaskFilters) {
  return useQuery({
    queryKey: [api.tasks.list.path, orgId, filters],
    enabled: !!orgId,
    queryFn: async () => {
      if (!orgId) return [];
      const url = buildUrl(api.tasks.list.path, { orgId });
      
      const queryParams = new URLSearchParams();
      if (filters?.assigneeId) queryParams.set("assigneeId", filters.assigneeId);
      if (filters?.status) queryParams.set("status", filters.status);
      if (filters?.priority) queryParams.set("priority", filters.priority);

      const res = await fetch(`${url}?${queryParams.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return api.tasks.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ orgId, data }: { orgId: number; data: Omit<CreateTaskRequest, 'orgId' | 'createdById'> }) => {
      const url = buildUrl(api.tasks.create.path, { orgId });
      const res = await fetch(url, {
        method: api.tasks.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to create task");
      return api.tasks.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path, variables.orgId] });
      toast({ title: "Success", description: "Task created successfully" });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateTaskRequest }) => {
      const url = buildUrl(api.tasks.update.path, { id });
      const res = await fetch(url, {
        method: api.tasks.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update task");
      return api.tasks.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      // We invalidate generically because we don't know the orgId easily here without passing it down
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path] });
      toast({ title: "Updated", description: "Task updated successfully" });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.tasks.delete.path, { id });
      const res = await fetch(url, { method: api.tasks.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete task");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path] });
      toast({ title: "Deleted", description: "Task removed" });
    },
  });
}
