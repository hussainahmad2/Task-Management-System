import { mysqlTable, text, int, boolean, timestamp, json, date, decimal, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth"; // Import auth user

// Re-export auth models
export * from "./models/auth";
export * from "./models/chat";

// === ENUMS ===
export const userRoles = ["CEO", "CPO", "CTO", "CIO", "General Manager", "HR Manager", "Finance Manager", "Assistant Manager", "Senior Employee", "Junior Employee", "Intern"] as const;
export const taskStatus = ["todo", "in_progress", "review", "completed", "archived"] as const;
export const taskPriority = ["low", "medium", "high", "critical"] as const;
export const employmentType = ["full-time", "part-time", "contract", "intern"] as const;
export const workType = ["remote", "onsite", "hybrid"] as const;
export const permissionActions = ["create", "read", "update", "delete", "view", "manage"] as const;
export const permissionResources = ["tasks", "employees", "departments", "settings", "analytics", "permissions", "organizations"] as const;


// === TABLES ===

// Organizations - Multi-tenant root
export const organizations = mysqlTable("organizations", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  plan: varchar("plan", { length: 50 }).default("free"), // free, pro, enterprise
  createdAt: timestamp("created_at").defaultNow(),
});

// Departments
export const departments = mysqlTable("departments", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  orgId: int("org_id").notNull().references(() => organizations.id),
  managerId: int("manager_id"), // Reference to employee
  createdAt: timestamp("created_at").defaultNow(),
});

// Roles - RBAC Role Definitions
export const roles = mysqlTable("roles", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Employees - Links Auth User to Organization context
export const employees = mysqlTable("employees", {
  id: int("id").primaryKey().autoincrement(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id), // Link to auth user
  orgId: int("org_id").references(() => organizations.id),
  departmentId: int("department_id").references(() => departments.id),
  managerId: int("manager_id"), // Self-reference for hierarchy

  // Profile
  designation: varchar("designation", { length: 255 }), // e.g. "Senior Developer"
  role: varchar("role", { length: 50, enum: userRoles }), // Hierarchical role (legacy string field)
  roleId: int("role_id").notNull().references(() => roles.id), // New FK to roles table

  // Employment Details
  joiningDate: date("joining_date"),
  employmentType: varchar("employment_type", { length: 50, enum: employmentType }),
  workType: varchar("work_type", { length: 50, enum: workType }).default("onsite"),
  salary: decimal("salary", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at").defaultNow(),
});

// Tasks - ClickUp style
export const tasks = mysqlTable("tasks", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50, enum: taskStatus }).default("todo"),
  priority: varchar("priority", { length: 50, enum: taskPriority }).default("medium"),

  orgId: int("org_id").notNull().references(() => organizations.id),
  assigneeId: int("assignee_id").references(() => employees.id),
  createdById: int("created_by_id").notNull().references(() => employees.id),
  parentTaskId: int("parent_task_id"), // Subtasks

  dueDate: timestamp("due_date"),
  estimatedHours: decimal("estimated_hours", { precision: 10, scale: 2 }),
  actualHours: decimal("actual_hours", { precision: 10, scale: 2 }).default("0"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Time Tracking
export const timeLogs = mysqlTable("time_logs", {
  id: int("id").primaryKey().autoincrement(),
  taskId: int("task_id").notNull().references(() => tasks.id),
  employeeId: int("employee_id").notNull().references(() => employees.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  durationMinutes: int("duration_minutes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Performance Metrics - For Analytics
export const performanceMetrics = mysqlTable("performance_metrics", {
  id: int("id").primaryKey().autoincrement(),
  employeeId: int("employee_id").notNull().references(() => employees.id),
  weekStartDate: date("week_start_date").notNull(),

  taskCompletionRate: decimal("task_completion_rate", { precision: 5, scale: 2 }), // %
  onTimeRate: decimal("on_time_rate", { precision: 5, scale: 2 }), // %
  attendanceScore: decimal("attendance_score", { precision: 5, scale: 2 }),
  totalScore: decimal("total_score", { precision: 5, scale: 2 }), // Calculated

  createdAt: timestamp("created_at").defaultNow(),
});

// Permissions - RBAC
export const permissions = mysqlTable("permissions", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull().unique(), // e.g., "tasks.create"
  resource: varchar("resource", { length: 50, enum: permissionResources }).notNull(),
  action: varchar("action", { length: 20, enum: permissionActions }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Role-Permission Junction
export const rolePermissions = mysqlTable("role_permissions", {
  id: int("id").primaryKey().autoincrement(),
  role: varchar("role", { length: 50, enum: userRoles }).notNull(),
  permissionId: int("permission_id").notNull().references(() => permissions.id),
  createdAt: timestamp("created_at").defaultNow(),
});


// Invoices
export const invoices = mysqlTable("invoices", {
  id: int("id").primaryKey().autoincrement(),
  orgId: int("org_id").notNull().references(() => organizations.id),
  invoiceNumber: varchar("invoice_number", { length: 50 }).notNull(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email"),
  clientAddress: text("client_address"),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  issueDate: date("issue_date"),
  dueDate: date("due_date"),
  status: varchar("status", { length: 50 }).default("draft"),
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentDate: date("payment_date"),
  notes: text("notes"),
  createdById: int("created_by").references(() => employees.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Leave Requests
export const leaveRequests = mysqlTable("leave_requests", {
  id: int("id").primaryKey().autoincrement(),
  employeeId: int("employee_id").notNull().references(() => employees.id),
  leaveType: varchar("leave_type", { length: 50 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  totalDays: int("total_days").notNull(),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  managerApprovalStatus: varchar("manager_approval_status", { length: 20 }).default("pending"), // pending, approved, rejected
  hrApprovalStatus: varchar("hr_approval_status", { length: 20 }).default("pending"), // pending, approved, rejected
  approvedById: int("approved_by").references(() => employees.id),
  rejectedById: int("rejected_by").references(() => employees.id),
  managerApprovedById: int("manager_approved_by").references(() => employees.id),
  managerRejectedById: int("manager_rejected_by").references(() => employees.id),
  hrApprovedById: int("hr_approved_by").references(() => employees.id),
  hrRejectedById: int("hr_rejected_by").references(() => employees.id),
  approvalDate: timestamp("approval_date"),
  rejectionDate: timestamp("rejection_date"),
  managerApprovalDate: timestamp("manager_approval_date"),
  managerRejectionDate: timestamp("manager_rejection_date"),
  hrApprovalDate: timestamp("hr_approval_date"),
  hrRejectionDate: timestamp("hr_rejection_date"),
  managerApprovalNotes: text("manager_approval_notes"),
  managerRejectionNotes: text("manager_rejection_notes"),
  hrApprovalNotes: text("hr_approval_notes"),
  hrRejectionNotes: text("hr_rejection_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Audit Logs
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").primaryKey().autoincrement(),
  tableName: varchar("table_name", { length: 100 }).notNull(),
  recordId: int("record_id").notNull(),
  action: varchar("action", { length: 20 }).notNull(), // CREATE, UPDATE, DELETE
  userId: varchar("user_id", { length: 255 }).references(() => users.id),
  oldValue: json("old_value"),
  newValue: json("new_value"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===
export const organizationsRelations = relations(organizations, ({ many }) => ({
  departments: many(departments),
  employees: many(employees),
  tasks: many(tasks),
  invoices: many(invoices),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  user: one(users, { fields: [employees.userId], references: [users.id] }),
  organization: one(organizations, { fields: [employees.orgId], references: [organizations.id] }),
  department: one(departments, { fields: [employees.departmentId], references: [departments.id] }),
  roleRef: one(roles, { fields: [employees.roleId], references: [roles.id] }),
  manager: one(employees, { fields: [employees.managerId], references: [employees.id], relationName: "reportsTo" }),
  subordinates: many(employees, { relationName: "reportsTo" }),
  assignedTasks: many(tasks, { relationName: "assignedTo" }),
  createdTasks: many(tasks, { relationName: "createdBy" }),
  timeLogs: many(timeLogs),
  performanceMetrics: many(performanceMetrics),
  createdInvoices: many(invoices, { relationName: "createdByInvoice" }),
  leaveRequests: many(leaveRequests),
  approvedLeaveRequests: many(leaveRequests, { relationName: "approvedBy" }),
  rejectedLeaveRequests: many(leaveRequests, { relationName: "rejectedBy" }),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  organization: one(organizations, { fields: [invoices.orgId], references: [organizations.id] }),
  createdBy: one(employees, { fields: [invoices.createdById], references: [employees.id], relationName: "createdByInvoice" }),
}));

export const leaveRequestsRelations = relations(leaveRequests, ({ one }) => ({
  employee: one(employees, { fields: [leaveRequests.employeeId], references: [employees.id] }),
  approvedBy: one(employees, { fields: [leaveRequests.approvedById], references: [employees.id], relationName: "approvedBy" }),
  rejectedBy: one(employees, { fields: [leaveRequests.rejectedById], references: [employees.id], relationName: "rejectedBy" }),
  managerApprovedBy: one(employees, { fields: [leaveRequests.managerApprovedById], references: [employees.id], relationName: "managerApprovedBy" }),
  managerRejectedBy: one(employees, { fields: [leaveRequests.managerRejectedById], references: [employees.id], relationName: "managerRejectedBy" }),
  hrApprovedBy: one(employees, { fields: [leaveRequests.hrApprovedById], references: [employees.id], relationName: "hrApprovedBy" }),
  hrRejectedBy: one(employees, { fields: [leaveRequests.hrRejectedById], references: [employees.id], relationName: "hrRejectedBy" }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  organization: one(organizations, { fields: [tasks.orgId], references: [organizations.id] }),
  assignee: one(employees, { fields: [tasks.assigneeId], references: [employees.id], relationName: "assignedTo" }),
  creator: one(employees, { fields: [tasks.createdById], references: [employees.id], relationName: "createdBy" }),
  parentTask: one(tasks, { fields: [tasks.parentTaskId], references: [tasks.id], relationName: "subtasks" }),
  subtasks: many(tasks, { relationName: "subtasks" }),
  timeLogs: many(timeLogs),
}));

// === SCHEMAS ===
export const insertOrganizationSchema = createInsertSchema(organizations).omit({ id: true, createdAt: true });
export const insertDepartmentSchema = createInsertSchema(departments).omit({ id: true, createdAt: true });
export const insertRoleSchema = createInsertSchema(roles).omit({ id: true, createdAt: true });
export const insertEmployeeSchema = createInsertSchema(employees, {
  roleId: z.number().optional(),
  userId: z.string().optional(),
}).omit({ id: true, createdAt: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, createdAt: true, updatedAt: true, actualHours: true });
export const insertTimeLogSchema = createInsertSchema(timeLogs).omit({ id: true, createdAt: true, durationMinutes: true });
export const insertPermissionSchema = createInsertSchema(permissions).omit({ id: true, createdAt: true });
export const insertRolePermissionSchema = createInsertSchema(rolePermissions).omit({ id: true, createdAt: true });
export const insertInvoiceSchema = createInsertSchema(invoices).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLeaveRequestSchema = createInsertSchema(leaveRequests).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });

// === EXPLICIT TYPES ===
export type Organization = typeof organizations.$inferSelect;
export type Department = typeof departments.$inferSelect;
export type Role = typeof roles.$inferSelect;
export type Employee = typeof employees.$inferSelect & {
  user?: typeof users.$inferSelect | null;
  department?: typeof departments.$inferSelect | null;
  manager?: (typeof employees.$inferSelect & { user?: typeof users.$inferSelect | null }) | null;
}; // Joined type helper
export type Task = typeof tasks.$inferSelect;
export type TimeLog = typeof timeLogs.$inferSelect;
export type PerformanceMetric = typeof performanceMetrics.$inferSelect;
export type Permission = typeof permissions.$inferSelect;
export type RolePermission = typeof rolePermissions.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;

export type CreateTaskRequest = z.infer<typeof insertTaskSchema>;
export type UpdateTaskRequest = Partial<CreateTaskRequest>;
export type CreateEmployeeRequest = z.infer<typeof insertEmployeeSchema>;
export type CreateDepartmentRequest = z.infer<typeof insertDepartmentSchema>;
export type CreatePermissionRequest = z.infer<typeof insertPermissionSchema>;
export type CreateRolePermissionRequest = z.infer<typeof insertRolePermissionSchema>;
export type CreateInvoiceRequest = z.infer<typeof insertInvoiceSchema>;
export type CreateLeaveRequestRequest = z.infer<typeof insertLeaveRequestSchema>;
export type CreateAuditLogRequest = z.infer<typeof insertAuditLogSchema>;
