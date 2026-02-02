import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { auditLogs } from '@shared/schema';
import { eq } from 'drizzle-orm';

export interface AuditLogEntry {
  tableName: string;
  recordId: number;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  userId?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
}

export const auditMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Store the original send method to intercept responses
    const originalSend = res.send;
    
    res.send = function(body: any) {
      try {
        // Log successful operations after response is sent
        setTimeout(async () => {
          try {
            const user = req.user as { id: string }; // Assuming user is attached by auth middleware
            
            // Extract action from method and route
            let action: 'CREATE' | 'UPDATE' | 'DELETE' | null = null;
            if (req.method === 'POST') {
              action = 'CREATE';
            } else if (req.method === 'PUT' || req.method === 'PATCH') {
              action = 'UPDATE';
            } else if (req.method === 'DELETE') {
              action = 'DELETE';
            }
            
            if (!action) return; // Only log CRUD operations
            
            // Extract table name from route (this can be enhanced based on your routing)
            const route = req.route?.path || req.path;
            const tableName = extractTableNameFromRoute(route);
            
            if (!tableName) return; // Skip if we can't determine table
            
            // Get record ID from various possible sources
            const recordId = extractRecordId(req, res);
            
            if (recordId && tableName) {
              const auditEntry: AuditLogEntry = {
                tableName,
                recordId,
                action,
                userId: user?.id,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent') || '',
                newValue: req.body,
              };
              
              // If it's an update operation, we might need to capture old values
              if (action === 'UPDATE') {
                // This would require fetching the old record, which is implementation-specific
                // For now, we'll skip old value capture for simplicity
              }
              
              // Insert audit log entry
              await db.insert(auditLogs).values({
                tableName: auditEntry.tableName,
                recordId: auditEntry.recordId,
                action: auditEntry.action,
                userId: auditEntry.userId,
                oldValue: auditEntry.oldValue || null,
                newValue: auditEntry.newValue || null,
                ipAddress: auditEntry.ipAddress,
                userAgent: auditEntry.userAgent,
              });
            }
          } catch (error) {
            console.error('Audit logging failed:', error);
            // Don't throw error as this shouldn't affect the main request
          }
        }, 0);
      } catch (error) {
        console.error('Audit middleware error:', error);
      }
      
      return originalSend.call(this, body);
    };
    
    next();
  };
};

// Helper function to extract table name from route
function extractTableNameFromRoute(route: string): string | null {
  // This is a simplified implementation - you might need to adjust based on your routing structure
  const tableMap: { [key: string]: string } = {
    '/api/employees': 'employees',
    '/api/tasks': 'tasks',
    '/api/departments': 'departments',
    '/api/invoices': 'invoices',
    '/api/leave-requests': 'leave_requests',
    '/api/users': 'users',
    '/api/organizations': 'organizations',
  };
  
  // Find the matching route
  for (const [routePattern, tableName] of Object.entries(tableMap)) {
    if (route.startsWith(routePattern)) {
      return tableName;
    }
  }
  
  // Try to extract from path segments
  const pathSegments = route.split('/');
  for (const segment of pathSegments) {
    if (segment.startsWith(':')) continue; // Skip parameter placeholders
    if (['api', 'v1', ''].includes(segment)) continue; // Skip common segments
    
    // Convert plural to singular if needed
    if (segment.endsWith('s')) {
      return segment.slice(0, -1);
    }
    return segment;
  }
  
  return null;
}

// Helper function to extract record ID
function extractRecordId(req: Request, res: Response): number | null {
  // Check in params
  if (req.params.id) {
    const id = parseInt(req.params.id);
    if (!isNaN(id)) return id;
  }
  
  // Check in body for some operations
  if (req.body.id) {
    const id = parseInt(req.body.id);
    if (!isNaN(id)) return id;
  }
  
  // Check in response (for create operations that return the new ID)
  try {
    if (res.locals && res.locals.newRecordId) {
      return res.locals.newRecordId;
    }
    
    // Try to parse response body
    const contentTypeHeader = res.getHeaders()['content-type'];
    const contentType = Array.isArray(contentTypeHeader) ? contentTypeHeader[0] : contentTypeHeader;
    if (contentType && typeof contentType === 'string' && contentType.includes('application/json')) {
      // This is tricky since we'd need to parse the response body
      // We'll rely on res.locals or params for now
    }
  } catch (e) {
    // Ignore parsing errors
  }
  
  return null;
}

// Function to manually log audit events
export const logAuditEvent = async (entry: AuditLogEntry) => {
  try {
    await db.insert(auditLogs).values({
      tableName: entry.tableName,
      recordId: entry.recordId,
      action: entry.action,
      userId: entry.userId,
      oldValue: entry.oldValue || null,
      newValue: entry.newValue || null,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
    });
  } catch (error) {
    console.error('Manual audit logging failed:', error);
  }
};