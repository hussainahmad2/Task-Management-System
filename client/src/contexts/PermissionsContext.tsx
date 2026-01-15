import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type User } from "@shared/schema";

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
    const { data: permissions = [], isLoading, refetch } = useQuery<string[]>({
        queryKey: ["/api/auth/permissions"],
        // Only fetch if we have a user (handled by parent AuthProvider usually, but safe to default empty)
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // We also need access to the user object for role checking
    // Assuming there is an AuthContext or we fetch user separately. 
    // For now, let's fetch user again or rely on a separate query. 
    // Ideally this should integrate with AuthContext.
    const { data: user } = useQuery<User>({
        queryKey: ["/api/auth/user"],
        retry: false,
    });

    const hasPermission = (permission: string) => {
        return permissions.includes(permission);
    };

    const hasRole = (role: string | string[]) => {
        if (!user) return false;
        if (Array.isArray(role)) {
            return role.includes(user.role);
        }
        return user.role === role;
    };

    return (
        <PermissionsContext.Provider
            value={{
                permissions,
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
