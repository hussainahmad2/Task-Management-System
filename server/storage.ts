import { db } from "./db";
import {
  organizations, departments, employees, tasks, timeLogs, performanceMetrics, permissions, rolePermissions,
  type Organization, type Department, type Employee, type Task, type TimeLog, type PerformanceMetric, type Permission, type RolePermission,
  type CreateTaskRequest, type UpdateTaskRequest, type CreateEmployeeRequest,
  users
} from "@shared/schema";
import { eq, and, desc, sql, inArray } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Organizations
  createOrganization(name: string, slug: string): Promise<Organization>;
  getOrganization(id: number): Promise<Organization | undefined>;
  getAllOrganizations(): Promise<Organization[]>;

  // Departments
  createDepartment(orgId: number, name: string): Promise<Department>;
  getDepartments(orgId: number): Promise<Department[]>;

  // Employees
  createEmployee(employee: CreateEmployeeRequest & { orgId: number }, userData?: { username: string, password: string, email: string, firstName: string, lastName: string }): Promise<Employee>;
  getEmployees(orgId: number): Promise<(Employee & { user: any })[]>;
  getEmployee(id: number): Promise<(Employee & { user: any, department: any, manager: any }) | undefined>;
  getEmployeeByUserId(userId: string): Promise<Employee | undefined>;

  // Tasks
  createTask(task: CreateTaskRequest & { orgId: number, createdById: number }): Promise<Task>;
  getTasks(orgId: number, filters?: { assigneeId?: number, status?: string, priority?: string }): Promise<(Task & { assignee: any, creator: any })[]>;
  updateTask(id: number, updates: UpdateTaskRequest): Promise<Task | undefined>;
  deleteTask(id: number): Promise<void>;

  // Analytics
  getOrgStats(orgId: number): Promise<any>;
  getEmployeePerformance(employeeId: number): Promise<PerformanceMetric[]>;
  updateUser(id: string, updates: any): Promise<void>;

  // RBAC Permissions
  getUserPermissions(userId: string): Promise<string[]>;
  getRolePermissions(role: string): Promise<Permission[]>;
  updateRolePermissions(role: string, permissionIds: number[]): Promise<void>;
  getAllPermissions(): Promise<Permission[]>;
  seedDefaultPermissions(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // === Organizations ===
  async createOrganization(name: string, slug: string): Promise<Organization> {
    const [res] = await db.insert(organizations).values({ name, slug });
    const [org] = await db.select().from(organizations).where(eq(organizations.id, res.insertId));
    return org!;
  }

  async getOrganization(id: number): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org;
  }

  async getAllOrganizations(): Promise<Organization[]> {
    return await db.select().from(organizations);
  }

  // === Departments ===
  async createDepartment(orgId: number, name: string): Promise<Department> {
    const [res] = await db.insert(departments).values({ orgId, name });
    const [dept] = await db.select().from(departments).where(eq(departments.id, res.insertId));
    return dept!;
  }

  async getDepartments(orgId: number): Promise<Department[]> {
    return await db.select().from(departments).where(eq(departments.orgId, orgId));
  }

  // === Employees ===
  // === Employees ===
  async createEmployee(employee: CreateEmployeeRequest & { orgId: number }, userData?: { username: string, password: string, email: string, firstName: string, lastName: string }): Promise<Employee> {

    let userId = employee.userId;

    // If no userId provided but userData is, create the user
    if ((!userId || userId === "temp") && userData) {
      console.log("Creating new user for employee:", userData.username);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUserId = "user-" + Math.random().toString(36).substring(7); // Simple ID gen

      await db.insert(users).values({
        id: newUserId,
        username: userData.username,
        password: hashedPassword,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: employee.role as string,
        profileImageUrl: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}`
      });

      userId = newUserId;
    }

    if (!userId) {
      throw new Error("User ID is required to create an employee");
    }

    const [res] = await db.insert(employees).values({ ...employee, userId });
    const [emp] = await db.select().from(employees).where(eq(employees.id, res.insertId));
    return emp!;
  }

  async getEmployees(orgId: number): Promise<(Employee & { user: any })[]> {
    // Join with Auth User table
    return await db.query.employees.findMany({
      where: eq(employees.orgId, orgId),
      with: {
        user: true,
        department: true,
      }
    });
  }

  async getEmployee(id: number): Promise<(Employee & { user: any, department: any, manager: any }) | undefined> {
    return await db.query.employees.findFirst({
      where: eq(employees.id, id),
      with: {
        user: true,
        department: true,
        manager: {
          with: { user: true }
        }
      }
    });
  }

  async getEmployeeByUserId(userId: string): Promise<Employee | undefined> {
    return await db.query.employees.findFirst({
      where: eq(employees.userId, userId),
    });
  }

  // === Tasks ===
  async createTask(task: CreateTaskRequest & { orgId: number, createdById: number }): Promise<Task> {
    const [res] = await db.insert(tasks).values(task);
    const [newTask] = await db.select().from(tasks).where(eq(tasks.id, res.insertId));
    return newTask!;
  }

  async getTasks(orgId: number, filters?: { assigneeId?: number, status?: string, priority?: string }): Promise<(Task & { assignee: any, creator: any })[]> {
    const conditions = [eq(tasks.orgId, orgId)];

    if (filters?.assigneeId) conditions.push(eq(tasks.assigneeId, filters.assigneeId));
    if (filters?.status) conditions.push(eq(tasks.status, filters.status as any));
    if (filters?.priority) conditions.push(eq(tasks.priority, filters.priority as any));

    return await db.query.tasks.findMany({
      where: and(...conditions),
      with: {
        assignee: { with: { user: true } },
        creator: { with: { user: true } }
      },
      orderBy: desc(tasks.createdAt)
    });
  }

  async updateTask(id: number, updates: UpdateTaskRequest): Promise<Task | undefined> {
    await db.update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tasks.id, id));

    const [updated] = await db.select().from(tasks).where(eq(tasks.id, id));
    return updated;
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  // === Analytics ===
  async getOrgStats(orgId: number): Promise<any> {
    const [empCount] = await db.select({ count: sql<number>`count(*)` }).from(employees).where(eq(employees.orgId, orgId));
    const [taskStats] = await db.select({
      total: sql<number>`count(*)`,
      completed: sql<number>`sum(case when status = 'completed' then 1 else 0 end)`
    }).from(tasks).where(eq(tasks.orgId, orgId));

    // Simple completion rate
    const completionRate = taskStats.total > 0 ? (Number(taskStats.completed) / Number(taskStats.total)) * 100 : 0;

    return {
      totalEmployees: Number(empCount.count),
      activeTasks: Number(taskStats.total) - Number(taskStats.completed),
      completionRate: Math.round(completionRate),
      departmentStats: [] // Simplified for now
    };
  }

  async getEmployeePerformance(employeeId: number): Promise<PerformanceMetric[]> {
    return await db.select().from(performanceMetrics)
      .where(eq(performanceMetrics.employeeId, employeeId))
      .orderBy(desc(performanceMetrics.weekStartDate))
      .limit(12); // Last 12 weeks
  }

  async updateUser(id: string, updates: Partial<typeof users.$inferSelect>): Promise<void> {
    await db.update(users).set(updates).where(eq(users.id, id));
  }

  // === RBAC Permissions ===

  async getUserPermissions(userId: string): Promise<string[]> {
    // 1. Get user to find their role
    const employee = await this.getEmployeeByUserId(userId);
    if (!employee) return [];

    // 2. Get permissions for that role
    const rolePerms = await db.select({
      permissionName: permissions.name
    })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.role, employee.role));

    return rolePerms.map(p => p.permissionName);
  }

  async getRolePermissions(role: string): Promise<Permission[]> {
    const results = await db.select({
      permission: permissions
    })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.role, role as any));

    return results.map(r => r.permission);
  }

  async updateRolePermissions(role: string, permissionIds: number[]): Promise<void> {
    // Transaction ideally, but for now simple delete-insert
    await db.delete(rolePermissions).where(eq(rolePermissions.role, role as any));

    if (permissionIds.length > 0) {
      await db.insert(rolePermissions).values(
        permissionIds.map(pid => ({
          role: role as any,
          permissionId: pid
        }))
      );
    }
  }

  async getAllPermissions(): Promise<Permission[]> {
    return await db.select().from(permissions);
  }

  async seedDefaultPermissions(): Promise<void> {
    const existingPerms = await this.getAllPermissions();
    if (existingPerms.length > 0) return; // Already seeded

    console.log("Seeding default permissions...");

    const resources = ["tasks", "employees", "departments", "settings", "analytics", "permissions", "organizations"];
    const actions = ["create", "read", "update", "delete", "view", "manage"];

    const permsToCreate = [];

    // Generate basic CRUD permissions
    for (const resource of resources) {
      for (const action of actions) {
        // Skip some nonsensical combinations if needed
        permsToCreate.push({
          name: `${resource}.${action}`,
          resource,
          action,
          description: `Can ${action} ${resource}`
        });
      }
    }

    // specific granular permissions can be added here

    // Insert permissions
    for (const p of permsToCreate) {
      await db.insert(permissions).values(p as any);
    }

    // Assign full access to CEO/CTO
    const allPerms = await this.getAllPermissions();
    const adminRoles = ["CEO", "CTO", "CPO"];

    for (const role of adminRoles) {
      await this.updateRolePermissions(role, allPerms.map(p => p.id));
    }

    // Assign basic access to Employees
    const basicPerms = allPerms.filter(p =>
      (p.resource === "tasks" && ["read", "create", "update"].includes(p.action)) ||
      (p.resource === "employees" && ["read", "view"].includes(p.action))
    );

    await this.updateRolePermissions("Junior Employee", basicPerms.map(p => p.id));
    await this.updateRolePermissions("Senior Employee", basicPerms.map(p => p.id));

    console.log("Permissions seeded!");
  }
}

export const storage = new DatabaseStorage();
