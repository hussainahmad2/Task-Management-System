import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { usePermissions } from "@/contexts/PermissionsContext";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { userRoles } from "@shared/schema";

export default function Permissions() {
    const { hasRole, hasPermission } = usePermissions();
    const [selectedRole, setSelectedRole] = useState<string>("Junior Employee");
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Get all available permissions
    const { data: allPermissions = [], isLoading: loadingPerms } = useQuery<any[]>({
        queryKey: ["/api/permissions"],
        // Only enabled if we can view permissions
        enabled: hasRole(["CEO", "CTO", "CPO"]),
    });

    // Get permissions for selected role
    const { data: rolePermissions = [], isLoading: loadingRolePerms } = useQuery<any[]>({
        queryKey: ["/api/permissions/role", selectedRole],
        enabled: !!selectedRole,
    });

    // Update permissions mutation
    const updatePermissionsMutation = useMutation({
        mutationFn: async (permissionIds: number[]) => {
            await apiRequest("PUT", `/api/permissions/role/${selectedRole}`, { permissionIds });
        },
        onSuccess: () => {
            toast({
                title: "Permissions Updated",
                description: `Permissions for ${selectedRole} have been updated successfully.`,
                variant: "default",
            });
            queryClient.invalidateQueries({ queryKey: ["/api/permissions/role", selectedRole] });
        },
        onError: (error) => {
            toast({
                title: "Update Failed",
                description: "Failed to update permissions. Please try again.",
                variant: "destructive",
            });
        },
    });

    // Toggle permission logic
    const handleTogglePermission = (permissionId: number, checked: boolean) => {
        const currentPermissionIds = rolePermissions.map(p => p.id);
        let newPermissionIds: number[];

        if (checked) {
            newPermissionIds = [...currentPermissionIds, permissionId];
        } else {
            newPermissionIds = currentPermissionIds.filter(id => id !== permissionId);
        }

        updatePermissionsMutation.mutate(newPermissionIds);
    };

    const isPermitted = (permissionId: number) => {
        return rolePermissions.some(p => p.id === permissionId);
    };

    if (!hasRole(["CEO", "CTO", "CPO"])) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center h-[50vh]">
                    <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
                    <p>You do not have permission to view this page.</p>
                </div>
            </Layout>
        );
    }

    // Group permissions by resource
    const permissionsByResource = allPermissions.reduce((acc, perm) => {
        if (!acc[perm.resource]) {
            acc[perm.resource] = [];
        }
        acc[perm.resource].push(perm);
        return acc;
    }, {} as Record<string, any[]>);

    const actionOrder = ["create", "read", "update", "delete", "view", "manage"];

    return (
        <Layout>
            <div className="container mx-auto p-4 md:p-8 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Shield className="h-8 w-8 text-primary" />
                            Permissions Management
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage role-based access control and feature permissions
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-card p-2 rounded-lg border shadow-sm">
                        <span className="text-sm font-medium whitespace-nowrap">Editing Role:</span>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                {userRoles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {loadingPerms || loadingRolePerms ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Permission Matrix</CardTitle>
                                <CardDescription>
                                    Configure granular access for <span className="font-semibold text-primary">{selectedRole}</span>.
                                    Changes are saved automatically.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[150px]">Feature / Resource</TableHead>
                                                {actionOrder.map(action => (
                                                    <TableHead key={action} className="text-center capitalize">{action}</TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {Object.keys(permissionsByResource).map((resource) => (
                                                <TableRow key={resource}>
                                                    <TableCell className="font-medium capitalize">{resource}</TableCell>
                                                    {actionOrder.map((action) => {
                                                        const permission = permissionsByResource[resource].find(
                                                            (p: any) => p.action === action
                                                        );

                                                        if (!permission) {
                                                            return <TableCell key={action} className="text-center bg-muted/20" />;
                                                        }

                                                        return (
                                                            <TableCell key={action} className="text-center">
                                                                <Checkbox
                                                                    checked={isPermitted(permission.id)}
                                                                    onCheckedChange={(checked) => handleTogglePermission(permission.id, checked as boolean)}
                                                                    disabled={updatePermissionsMutation.isPending || (selectedRole === "CEO")}
                                                                />
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </Layout>
    );
}
