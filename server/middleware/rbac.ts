import type { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

// Extend Express Request to include user permissions
declare global {
    namespace Express {
        interface User {
            permissions?: string[];
        }
    }
}

/**
 * Middleware to check if user has required permission
 */
export function requirePermission(permission: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        try {
            // Get user permissions if not already loaded
            if (!req.user.permissions) {
                const user = req.user as any;
                req.user.permissions = await storage.getUserPermissions(user.id);
            }

            // Check if user has the required permission
            if (!req.user.permissions.includes(permission)) {
                return res.status(403).json({
                    message: "Forbidden",
                    required: permission,
                    details: "You don't have permission to perform this action"
                });
            }

            next();
        } catch (error) {
            console.error("Permission check error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
}

/**
 * Middleware to check if user has one of the required roles
 */
export function requireRole(roles: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = req.user as any;
        if (!roles.includes(user.role)) {
            return res.status(403).json({
                message: "Forbidden",
                required: roles,
                details: "Your role doesn't have access to this resource"
            });
        }

        next();
    };
}

/**
 * Utility to check if user has permission (for use in route handlers)
 */
export async function hasPermission(userId: string, permission: string): Promise<boolean> {
    const permissions = await storage.getUserPermissions(userId);
    return permissions.includes(permission);
}

/**
 * Utility to check if user has role
 */
export function hasRole(user: any, roles: string[]): boolean {
    return roles.includes(user.role);
}
