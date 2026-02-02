import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "../../../shared/routes";

export function useLeaveRequests(employeeId: number | undefined) {
  return useQuery({
    queryKey: ["leaveRequests", employeeId],
    queryFn: async () => {
      if (!employeeId) throw new Error("Employee ID is required");
      const response = await fetch(buildUrl(api.leaveRequests.list.path, { employeeId }));
      if (!response.ok) throw new Error("Failed to fetch leave requests");
      return response.json();
    },
    enabled: !!employeeId,
  });
}

export function useLeaveRequest(id: number | undefined) {
  return useQuery({
    queryKey: ["leaveRequest", id],
    queryFn: async () => {
      if (!id) throw new Error("Leave request ID is required");
      const response = await fetch(buildUrl(api.leaveRequests.get.path, { id }));
      if (!response.ok) throw new Error("Failed to fetch leave request");
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/employees/${data.employeeId}/leave-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create leave request");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
    },
  });
}

export function useUpdateLeaveRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(`/api/leave-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update leave request");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
      queryClient.invalidateQueries({ queryKey: ["leaveRequest"] });
    },
  });
}

export function useApproveLeaveRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes?: string }) => {
      const response = await fetch(`/api/leave-requests/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (!response.ok) throw new Error("Failed to approve leave request");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
      queryClient.invalidateQueries({ queryKey: ["leaveRequest"] });
    },
  });
}

export function useRejectLeaveRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, rejectionReason }: { id: number; rejectionReason?: string }) => {
      const response = await fetch(`/api/leave-requests/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejectionReason }),
      });
      if (!response.ok) throw new Error("Failed to reject leave request");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
      queryClient.invalidateQueries({ queryKey: ["leaveRequest"] });
    },
  });
}