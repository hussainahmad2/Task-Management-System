import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type User } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";

interface PermissionsContextType {
    permissions: string[];
    isLoading: boolean;
    hasPermission: (permission: string) => boolean;
    hasRole: (role: string | string[]) => boolean;
    refreshPermissions: () => void;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
    // Fetch permissions for current user
    const { data: permissions = [], isLoading, refetch, error: permissionsError } = useQuery<string[]>({
        queryKey: ["/api/auth/permissions"],
        queryFn: getQueryFn({ on401: "returnNull" }),
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Log errors for debugging
    if (permissionsError) {
        console.log("Permissions query error:", permissionsError);
    }

    // Handle case where permissions API returns null due to 401
    const safePermissions = permissions || [];

    // We also need access to the user object for role checking
    // Assuming there is an AuthContext or we fetch user separately. 
    // For now, let's fetch user again or rely on a separate query. 
    // Ideally this should integrate with AuthContext.
    const { data: user, error: userError } = useQuery<User>({
        queryKey: ["/api/auth/user"],
        queryFn: getQueryFn({ on401: "returnNull" }),
        retry: false,
    });

    // Log errors for debugging
    if (userError) {
        console.log("User query error:", userError);
    }

    // Handle case where user API returns null due to 401
    const safeUser = user || null;

    const hasPermission = (permission: string) => {
        return safePermissions.includes(permission);
    };

    const hasRole = (role: string | string[]) => {
        if (!safeUser) return false;
        if (Array.isArray(role)) {
            return role.includes(safeUser.role);
        }
        return safeUser.role === role;
    };

    return (
        <PermissionsContext.Provider
            value={{
                permissions: safePermissions,
                isLoading,
                hasPermission,
                hasRole,
                refreshPermissions: refetch
            }}
        >
            {children}
        </PermissionsContext.Provider>
    );
}

export function usePermissions() {
    const context = useContext(PermissionsContext);
    if (!context) {
        throw new Error("usePermissions must be used within a PermissionsProvider");
    }
    return context;
}
