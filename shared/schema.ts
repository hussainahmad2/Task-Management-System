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

// Employees - Links Auth User to Organization context
export const employees = mysqlTable("employees", {
  id: int("id").primaryKey().autoincrement(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id), // Link to auth user
  orgId: int("org_id").notNull().references(() => organizations.id),
  departmentId: int("department_id").references(() => departments.id),
  managerId: int("manager_id"), // Self-reference for hierarchy

  // Profile
  designation: varchar("designation", { length: 255 }).notNull(), // e.g. "Senior Developer"
  role: varchar("role", { length: 50, enum: userRoles }).notNull(), // Hierarchical role

  // Employment Details
  joiningDate: date("joining_date").notNull(),
  employmentType: varchar("employment_type", { length: 50, enum: employmentType }).notNull(),
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

// === RELATIONS ===
export const organizationsRelations = relations(organizations, ({ many }) => ({
  departments: many(departments),
  employees: many(employees),
  tasks: many(tasks),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  user: one(users, { fields: [employees.userId], references: [users.id] }),
  organization: one(organizations, { fields: [employees.orgId], references: [organizations.id] }),
  department: one(departments, { fields: [employees.departmentId], references: [departments.id] }),
  manager: one(employees, { fields: [employees.managerId], references: [employees.id], relationName: "reportsTo" }),
  subordinates: many(employees, { relationName: "reportsTo" }),
  assignedTasks: many(tasks, { relationName: "assignedTo" }),
  createdTasks: many(tasks, { relationName: "createdBy" }),
  timeLogs: many(timeLogs),
  performanceMetrics: many(performanceMetrics),
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
export const insertEmployeeSchema = createInsertSchema(employees).omit({ id: true, createdAt: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, createdAt: true, updatedAt: true, actualHours: true });
export const insertTimeLogSchema = createInsertSchema(timeLogs).omit({ id: true, createdAt: true, durationMinutes: true });

// === EXPLICIT TYPES ===
export type Organization = typeof organizations.$inferSelect;
export type Department = typeof departments.$inferSelect;
export type Employee = typeof employees.$inferSelect & { user?: typeof users.$inferSelect }; // Joined type helper
export type Task = typeof tasks.$inferSelect;
export type TimeLog = typeof timeLogs.$inferSelect;
export type PerformanceMetric = typeof performanceMetrics.$inferSelect;

export type CreateTaskRequest = z.infer<typeof insertTaskSchema>;
export type UpdateTaskRequest = Partial<CreateTaskRequest>;
export type CreateEmployeeRequest = z.infer<typeof insertEmployeeSchema>;
export type CreateDepartmentRequest = z.infer<typeof insertDepartmentSchema>;
