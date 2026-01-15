import { z } from 'zod';
import {
  insertTaskSchema,
  insertEmployeeSchema,
  insertOrganizationSchema,
  insertDepartmentSchema,
  insertTimeLogSchema,
  tasks,
  employees,
  organizations,
  departments,
  performanceMetrics,
  timeLogs
} from './schema';

// Shared error schemas
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  // === Organization & Context ===
  organizations: {
    create: {
      method: 'POST' as const,
      path: '/api/organizations',
      input: insertOrganizationSchema,
      responses: {
        201: z.custom<typeof organizations.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/organizations',
      responses: {
        200: z.array(z.custom<typeof organizations.$inferSelect>()),
      }
    }
  },

  departments: {
    list: {
      method: 'GET' as const,
      path: '/api/organizations/:orgId/departments',
      responses: {
        200: z.array(z.custom<typeof departments.$inferSelect>()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/organizations/:orgId/departments',
      input: insertDepartmentSchema.omit({ orgId: true }),
      responses: {
        201: z.custom<typeof departments.$inferSelect>(),
      }
    }
  },

  // === Employees & Hierarchy ===
  employees: {
    list: {
      method: 'GET' as const,
      path: '/api/organizations/:orgId/employees',
      responses: {
        200: z.array(z.custom<typeof employees.$inferSelect & { user: any }>()),
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/employees/:id',
      responses: {
        200: z.custom<typeof employees.$inferSelect & { user: any, department: any, manager: any }>(),
        404: errorSchemas.notFound,
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/organizations/:orgId/employees',
      input: insertEmployeeSchema.omit({ orgId: true, userId: true, roleId: true }),
      responses: {
        201: z.custom<typeof employees.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    hierarchy: {
      method: 'GET' as const,
      path: '/api/organizations/:orgId/hierarchy',
      responses: {
        200: z.any(), // Tree structure
      }
    }
  },

  // === Tasks ===
  tasks: {
    list: {
      method: 'GET' as const,
      path: '/api/organizations/:orgId/tasks',
      input: z.object({
        assigneeId: z.string().optional(), // Filter by assignee
        status: z.string().optional(),
        priority: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof tasks.$inferSelect & { assignee: any, creator: any }>()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/organizations/:orgId/tasks',
      input: insertTaskSchema.omit({ orgId: true, createdById: true }), // Inferred from context
      responses: {
        201: z.custom<typeof tasks.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/tasks/:id',
      input: insertTaskSchema.partial(),
      responses: {
        200: z.custom<typeof tasks.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/tasks/:id',
      responses: {
        204: z.void(),
      }
    }
  },

  // === Analytics & Performance ===
  analytics: {
    dashboard: {
      method: 'GET' as const,
      path: '/api/organizations/:orgId/analytics/dashboard',
      responses: {
        200: z.object({
          totalEmployees: z.number(),
          activeTasks: z.number(),
          completionRate: z.number(),
          departmentStats: z.array(z.any()),
        }),
      }
    },
    employeePerformance: {
      method: 'GET' as const,
      path: '/api/employees/:id/performance',
      responses: {
        200: z.array(z.custom<typeof performanceMetrics.$inferSelect>()),
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
