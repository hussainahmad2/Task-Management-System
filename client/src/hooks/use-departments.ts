import { useQuery, useMutation } from "@tanstack/react-query";
import { type Department, type CreateDepartmentRequest } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useDepartments(orgId?: number) {
    const { toast } = useToast();

    return useQuery<Department[]>({
        queryKey: [`/api/organizations/${orgId}/departments`],
        queryFn: async () => {
            if (!orgId) return [];
            const res = await apiRequest("GET", `/api/organizations/${orgId}/departments`);
            return res.json();
        },
        enabled: !!orgId,
    });
}

export function useCreateDepartment() {
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ orgId, data }: { orgId: number; data: CreateDepartmentRequest }) => {
            const res = await apiRequest("POST", `/api/organizations/${orgId}/departments`, data);
            return res.json();
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: [`/api/organizations/${variables.orgId}/departments`] });
            toast({
                title: "Department created",
                description: `Department ${data.name} has been created successfully.`,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Failed to create department",
                description: error.message,
                variant: "destructive",
            });
        },
    });
}
