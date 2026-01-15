import React from "react";
import { usePermissions } from "@/contexts/PermissionsContext";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredPermission?: string;
    requiredRole?: string | string[];
}

export function ProtectedRoute({
    children,
    requiredPermission,
    requiredRole
}: ProtectedRouteProps) {
    const { hasPermission, hasRole, isLoading } = usePermissions();
    const [, setLocation] = useLocation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-border" />
            </div>
        );
    }

    // Check role first (higher level)
    if (requiredRole && !hasRole(requiredRole)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-2">
                    Access Denied
                </h2>
                <p className="text-muted-foreground mb-4">
                    You don't have the required role ({Array.isArray(requiredRole) ? requiredRole.join(' or ') : requiredRole}) to view this page.
                </p>
                <button
                    onClick={() => setLocation('/')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    // Check specific permission
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-2">
                    Permission Denied
                </h2>
                <p className="text-muted-foreground mb-4">
                    You don't have the required permission ({requiredPermission}) to view this page.
                </p>
                <button
                    onClick={() => setLocation('/')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return <>{children}</>;
}
