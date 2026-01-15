import { db } from "./db";
import { 
  organizations, departments, employees, tasks, timeLogs, performanceMetrics,
  type Organization, type Department, type Employee, type Task, type TimeLog, type PerformanceMetric,
  type CreateTaskRequest, type UpdateTaskRequest, type CreateEmployeeRequest
} from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Organizations
  createOrganization(name: string, slug: string): Promise<Organization>;
  getOrganization(id: number): Promise<Organization | undefined>;
  getAllOrganizations(): Promise<Organization[]>;
  
  // Departments
  createDepartment(orgId: number, name: string): Promise<Department>;
  getDepartments(orgId: number): Promise<Department[]>;
  
  // Employees
  createEmployee(employee: CreateEmployeeRequest & { orgId: number }): Promise<Employee>;
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
}

export class DatabaseStorage implements IStorage {
  // === Organizations ===
  async createOrganization(name: string, slug: string): Promise<Organization> {
    const [org] = await db.insert(organizations).values({ name, slug }).returning();
    return org;
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
    const [dept] = await db.insert(departments).values({ orgId, name }).returning();
    return dept;
  }

  async getDepartments(orgId: number): Promise<Department[]> {
    return await db.select().from(departments).where(eq(departments.orgId, orgId));
  }

  // === Employees ===
  async createEmployee(employee: CreateEmployeeRequest & { orgId: number }): Promise<Employee> {
    const [emp] = await db.insert(employees).values(employee).returning();
    return emp;
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
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async getTasks(orgId: number, filters?: { assigneeId?: number, status?: string, priority?: string }): Promise<(Task & { assignee: any, creator: any })[]> {
    const conditions = [eq(tasks.orgId, orgId)];
    
    if (filters?.assigneeId) conditions.push(eq(tasks.assigneeId, filters.assigneeId));
    if (filters?.status) conditions.push(eq(tasks.status, filters.status));
    if (filters?.priority) conditions.push(eq(tasks.priority, filters.priority));

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
    const [updated] = await db.update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
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
      completed: sql<number>`count(*) filter (where status = 'completed')` 
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
}

export const storage = new DatabaseStorage();
