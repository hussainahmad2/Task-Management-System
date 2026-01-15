import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date, numeric } from "drizzle-orm/pg-core";
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
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  plan: text("plan").default("free"), // free, pro, enterprise
  createdAt: timestamp("created_at").defaultNow(),
});

// Departments
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  orgId: integer("org_id").notNull().references(() => organizations.id),
  managerId: integer("manager_id"), // Reference to employee
  createdAt: timestamp("created_at").defaultNow(),
});

// Employees - Links Auth User to Organization context
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id), // Link to auth user
  orgId: integer("org_id").notNull().references(() => organizations.id),
  departmentId: integer("department_id").references(() => departments.id),
  managerId: integer("manager_id"), // Self-reference for hierarchy
  
  // Profile
  designation: text("designation").notNull(), // e.g. "Senior Developer"
  role: text("role", { enum: userRoles }).notNull(), // Hierarchical role
  
  // Employment Details
  joiningDate: date("joining_date").notNull(),
  employmentType: text("employment_type", { enum: employmentType }).notNull(),
  workType: text("work_type", { enum: workType }).default("onsite"),
  salary: numeric("salary"),
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Tasks - ClickUp style
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", { enum: taskStatus }).default("todo"),
  priority: text("priority", { enum: taskPriority }).default("medium"),
  
  orgId: integer("org_id").notNull().references(() => organizations.id),
  assigneeId: integer("assignee_id").references(() => employees.id),
  createdById: integer("created_by_id").notNull().references(() => employees.id),
  parentTaskId: integer("parent_task_id"), // Subtasks
  
  dueDate: timestamp("due_date"),
  estimatedHours: numeric("estimated_hours"),
  actualHours: numeric("actual_hours").default("0"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Time Tracking
export const timeLogs = pgTable("time_logs", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull().references(() => tasks.id),
  employeeId: integer("employee_id").notNull().references(() => employees.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  durationMinutes: integer("duration_minutes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Performance Metrics - For Analytics
export const performanceMetrics = pgTable("performance_metrics", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull().references(() => employees.id),
  weekStartDate: date("week_start_date").notNull(),
  
  taskCompletionRate: numeric("task_completion_rate"), // %
  onTimeRate: numeric("on_time_rate"), // %
  attendanceScore: numeric("attendance_score"),
  totalScore: numeric("total_score"), // Calculated
  
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
