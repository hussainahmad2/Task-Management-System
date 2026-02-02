import { db } from "./db";
import {
  organizations, departments, employees, tasks, timeLogs, performanceMetrics, permissions, rolePermissions,
  invoices, leaveRequests, auditLogs,
  type Organization, type Department, type Employee, type Task, type TimeLog, type PerformanceMetric, type Permission, type RolePermission,
  type CreateTaskRequest, type UpdateTaskRequest, type CreateEmployeeRequest,
  type CreateInvoiceRequest, type CreateLeaveRequestRequest, type CreateAuditLogRequest,
  users,
  chatRooms, messages, chatRoomParticipants
} from "@shared/schema";
import { eq, and, desc, sql, inArray, gte, lte } from "drizzle-orm";
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
  createEmployee(employee: Omit<CreateEmployeeRequest, 'userId'> & { orgId: number, userId?: string }, userData?: { username: string, password: string, email: string, firstName: string, lastName: string }): Promise<Employee>;
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

  // Invoices
  createInvoice(invoice: CreateInvoiceRequest & { orgId: number, createdById: number }): Promise<any>;
  getInvoices(orgId: number): Promise<any[]>;
  getInvoice(id: number): Promise<any>;
  updateInvoice(id: number, updates: Partial<CreateInvoiceRequest>): Promise<any>;
  deleteInvoice(id: number): Promise<void>;

  // Leave Requests
  createLeaveRequest(leaveRequest: CreateLeaveRequestRequest & { employeeId: number }): Promise<any>;
  getLeaveRequests(employeeId: number): Promise<any[]>;
  getLeaveRequest(id: number): Promise<any>;
  updateLeaveRequest(id: number, updates: Partial<CreateLeaveRequestRequest>): Promise<any>;
  requestManagerApproval(id: number, managerId: number): Promise<any>;
  approveByManager(id: number, managerId: number, notes?: string): Promise<any>;
  rejectByManager(id: number, managerId: number, notes?: string): Promise<any>;
  approveByHR(id: number, hrId: number, notes?: string): Promise<any>;
  rejectByHR(id: number, hrId: number, notes?: string): Promise<any>;
  deleteLeaveRequest(id: number): Promise<void>;

  // Audit Logs
  createAuditLog(log: CreateAuditLogRequest): Promise<any>;
  getAuditLogs(filters?: { userId?: string, tableName?: string, startDate?: Date, endDate?: Date }): Promise<any[]>;
  getAuditLog(id: number): Promise<any>;
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
  async createEmployee(employee: Omit<CreateEmployeeRequest, 'userId'> & { orgId: number, userId?: string }, userData?: { username: string, password: string, email: string, firstName: string, lastName: string }): Promise<Employee> {

    let userId = employee.userId;

    // If no userId provided but userData is, create the user
    if ((!userId || userId === "temp") && userData) {
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

    // Lookup roleId from roles table if not provided
    let roleId = (employee as any).roleId;
    if (!roleId && employee.role) {
      // Import roles table
      const { roles } = await import("@shared/schema");
      const roleSlug = employee.role.toLowerCase().replace(/\s+/g, '_');

      const [roleRecord] = await db.select().from(roles).where(eq(roles.slug, roleSlug));

      if (!roleRecord) {
        throw new Error(`Role "${employee.role}" not found in roles table. Please ensure the role exists.`);
      }
      roleId = roleRecord.id;
    }

    if (!roleId) {
      throw new Error("Role ID is required to create an employee");
    }

    const [res] = await db.insert(employees).values({ ...employee, userId, roleId });
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

  async getAllUsers(): Promise<any[]> {
    const usersList = await db.select().from(users);
    return usersList.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      role: user.role
    }));
  }

  // === Messaging Methods ===

  async getChatRooms(): Promise<any[]> {
    try {
      return await db.select().from(chatRooms);
    } catch (error) {
      console.error("Error getting chat rooms:", error);
      return [];
    }
  }

  async getChatRoomById(id: string): Promise<any> {
    try {
      const [room] = await db.select().from(chatRooms).where(eq(chatRooms.id, Number(id)));
      return room;
    } catch (error) {
      console.error("Error getting chat room:", error);
      return null;
    }
  }

  async createChatRoom(data: { name: string; type: string; description?: string; createdBy: string }): Promise<any> {
    try {
      const result = await db.insert(chatRooms).values({
        name: data.name,
        type: data.type as any,
        description: data.description,
        createdById: data.createdBy
      });
      
      // Get the last inserted ID from MySQL response
      const insertedId = (result as any)?.[0]?.insertId || (result as any)?.[1]?.[0]?.insertId;
      if (insertedId) {
        return { id: insertedId, name: data.name, type: data.type };
      }
      
      // Fallback: query the most recently created room
      const [newRoom] = await db.select().from(chatRooms)
        .orderBy(sql`id DESC`)
        .limit(1);
      return newRoom || { id: 0, name: data.name, type: data.type };
    } catch (error) {
      console.error("Error creating chat room:", error);
      throw error;
    }
  }

  async updateChatRoom(id: string, updates: Partial<any>): Promise<any> {
    try {
      await db.update(chatRooms)
        .set(updates)
        .where(eq(chatRooms.id, Number(id)));
      return { id, ...updates };
    } catch (error) {
      console.error("Error updating chat room:", error);
      throw error;
    }
  }

  async deleteChatRoom(id: string): Promise<void> {
    try {
      await db.delete(chatRooms).where(eq(chatRooms.id, Number(id)));
    } catch (error) {
      console.error("Error deleting chat room:", error);
      throw error;
    }
  }

  async getMessagesByChatRoom(chatRoomId: string): Promise<any[]> {
    try {
      return await db.select().from(messages).where(eq(messages.chatRoomId, Number(chatRoomId)));
    } catch (error) {
      console.error("Error getting messages:", error);
      return [];
    }
  }

  async getMessageById(id: string): Promise<any> {
    try {
      const [message] = await db.select().from(messages).where(eq(messages.id, Number(id)));
      return message;
    } catch (error) {
      console.error("Error getting message:", error);
      return null;
    }
  }

  async createMessage(data: { chatRoomId: string; senderId: string; content: string; messageType: string; mediaUrl?: string }): Promise<any> {
    try {
      const result = await db.insert(messages).values({
        chatRoomId: Number(data.chatRoomId),
        senderId: data.senderId,
        content: data.content,
        messageType: data.messageType as any,
        mediaUrl: data.mediaUrl
      });
      
      // Get the last inserted ID from MySQL response
      const insertedId = (result as any)?.[0]?.insertId || (result as any)?.[1]?.[0]?.insertId;
      if (insertedId) {
        return { 
          id: insertedId, 
          chatRoomId: data.chatRoomId, 
          senderId: data.senderId, 
          content: data.content,
          messageType: data.messageType
        };
      }
      
      // Fallback: query the most recently created message
      const [newMessage] = await db.select().from(messages)
        .where(eq(messages.chatRoomId, Number(data.chatRoomId)))
        .orderBy(sql`id DESC`)
        .limit(1);
      return newMessage || { 
        id: 0, 
        chatRoomId: data.chatRoomId, 
        senderId: data.senderId, 
        content: data.content,
        messageType: data.messageType
      };
    } catch (error) {
      console.error("Error creating message:", error);
      throw error;
    }
  }

  async updateMessage(id: string, updates: Partial<any>): Promise<any> {
    try {
      await db.update(messages)
        .set(updates)
        .where(eq(messages.id, Number(id)));
      return { id, ...updates };
    } catch (error) {
      console.error("Error updating message:", error);
      throw error;
    }
  }

  async deleteMessage(id: string, forEveryone: boolean): Promise<void> {
    try {
      if (forEveryone) {
        await db.update(messages)
          .set({ isDeleted: true, deletedForEveryone: true })
          .where(eq(messages.id, Number(id)));
      } else {
        await db.update(messages)
          .set({ isDeleted: true })
          .where(eq(messages.id, Number(id)));
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  }

  async addChatRoomParticipant(chatRoomId: string, userId: string): Promise<any> {
    try {
      await db.insert(chatRoomParticipants).values({
        chatRoomId: Number(chatRoomId),
        userId: userId
      });
      return { chatRoomId, userId };
    } catch (error) {
      console.error("Error adding participant:", error);
      throw error;
    }
  }

  // === RBAC Permissions ===

  async getUserPermissions(userId: string): Promise<string[]> {
    // 1. Get user to find their role
    const employee = await this.getEmployeeByUserId(userId);
    if (!employee || !employee.role) return [];

    // 2. Get permissions for that role
    const rolePerms = await db.select({
      permissionName: permissions.name
    })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.role, employee.role as any));

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

  // === Invoices ===
  async createInvoice(invoice: CreateInvoiceRequest & { orgId: number, createdById: number }): Promise<any> {
    const [res] = await db.insert(invoices).values(invoice);
    const [newInvoice] = await db.select().from(invoices).where(eq(invoices.id, res.insertId));
    return newInvoice!;
  }

  async getInvoices(orgId: number): Promise<any[]> {
    return await db.select().from(invoices).where(eq(invoices.orgId, orgId));
  }

  async getInvoice(id: number): Promise<any> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice;
  }

  async updateInvoice(id: number, updates: Partial<CreateInvoiceRequest>): Promise<any> {
    await db.update(invoices)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(invoices.id, id));

    const [updated] = await db.select().from(invoices).where(eq(invoices.id, id));
    return updated;
  }

  async deleteInvoice(id: number): Promise<void> {
    await db.delete(invoices).where(eq(invoices.id, id));
  }

  // === Leave Requests ===
  async createLeaveRequest(leaveRequest: CreateLeaveRequestRequest & { employeeId: number }): Promise<any> {
    const [res] = await db.insert(leaveRequests).values(leaveRequest);
    const [newLeaveRequest] = await db.select().from(leaveRequests).where(eq(leaveRequests.id, res.insertId));
    return newLeaveRequest!;
  }

  async getLeaveRequests(employeeId: number): Promise<any[]> {
    return await db.select().from(leaveRequests).where(eq(leaveRequests.employeeId, employeeId));
  }

  async getLeaveRequest(id: number): Promise<any> {
    const [leaveRequest] = await db.select().from(leaveRequests).where(eq(leaveRequests.id, id));
    return leaveRequest;
  }

  async updateLeaveRequest(id: number, updates: Partial<CreateLeaveRequestRequest>): Promise<any> {
    await db.update(leaveRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leaveRequests.id, id));

    const [updated] = await db.select().from(leaveRequests).where(eq(leaveRequests.id, id));
    return updated;
  }

  async requestManagerApproval(id: number, managerId: number): Promise<any> {
    await db.update(leaveRequests)
      .set({ 
        status: 'pending',
        managerApprovalStatus: 'pending',
        hrApprovalStatus: 'pending',
        updatedAt: new Date()
      })
      .where(eq(leaveRequests.id, id));

    const [updated] = await db.select().from(leaveRequests).where(eq(leaveRequests.id, id));
    return updated;
  }

  async approveByManager(id: number, managerId: number, notes?: string): Promise<any> {
    await db.update(leaveRequests)
      .set({ 
        managerApprovalStatus: 'approved',
        managerApprovedById: managerId,
        managerApprovalDate: new Date(),
        managerApprovalNotes: notes,
        updatedAt: new Date()
      })
      .where(eq(leaveRequests.id, id));

    // Check if HR also approved to set overall status to approved
    const [updatedRequest] = await db.select().from(leaveRequests).where(eq(leaveRequests.id, id));
    
    // If HR has also approved, then set the overall status to approved
    if (updatedRequest?.hrApprovalStatus === 'approved') {
      await db.update(leaveRequests)
        .set({ 
          status: 'approved',
          approvedById: managerId, // Use the manager who initiated the final approval
          approvalDate: new Date(),
          updatedAt: new Date()
        })
        .where(eq(leaveRequests.id, id));
    }

    const [finalUpdated] = await db.select().from(leaveRequests).where(eq(leaveRequests.id, id));
    return finalUpdated;
  }

  async rejectByManager(id: number, managerId: number, notes?: string): Promise<any> {
    await db.update(leaveRequests)
      .set({ 
        managerApprovalStatus: 'rejected',
        managerRejectedById: managerId,
        managerRejectionDate: new Date(),
        managerRejectionNotes: notes,
        status: 'rejected', // Overall status becomes rejected
        rejectionDate: new Date(),
        updatedAt: new Date()
      })
      .where(eq(leaveRequests.id, id));

    const [updated] = await db.select().from(leaveRequests).where(eq(leaveRequests.id, id));
    return updated;
  }

  async approveByHR(id: number, hrId: number, notes?: string): Promise<any> {
    await db.update(leaveRequests)
      .set({ 
        hrApprovalStatus: 'approved',
        hrApprovedById: hrId,
        hrApprovalDate: new Date(),
        hrApprovalNotes: notes,
        updatedAt: new Date()
      })
      .where(eq(leaveRequests.id, id));

    // Check if manager also approved to set overall status to approved
    const [updatedRequest] = await db.select().from(leaveRequests).where(eq(leaveRequests.id, id));
    
    // If manager has also approved, then set the overall status to approved
    if (updatedRequest?.managerApprovalStatus === 'approved') {
      await db.update(leaveRequests)
        .set({ 
          status: 'approved',
          approvedById: hrId, // Use the HR who initiated the final approval
          approvalDate: new Date(),
          updatedAt: new Date()
        })
        .where(eq(leaveRequests.id, id));
    }

    const [finalUpdated] = await db.select().from(leaveRequests).where(eq(leaveRequests.id, id));
    return finalUpdated;
  }

  async rejectByHR(id: number, hrId: number, notes?: string): Promise<any> {
    await db.update(leaveRequests)
      .set({ 
        hrApprovalStatus: 'rejected',
        hrRejectedById: hrId,
        hrRejectionDate: new Date(),
        hrRejectionNotes: notes,
        status: 'rejected', // Overall status becomes rejected
        rejectionDate: new Date(),
        updatedAt: new Date()
      })
      .where(eq(leaveRequests.id, id));

    const [updated] = await db.select().from(leaveRequests).where(eq(leaveRequests.id, id));
    return updated;
  }

  async deleteLeaveRequest(id: number): Promise<void> {
    await db.delete(leaveRequests).where(eq(leaveRequests.id, id));
  }

  // === Audit Logs ===
  async createAuditLog(log: CreateAuditLogRequest): Promise<any> {
    const [res] = await db.insert(auditLogs).values(log);
    const [newLog] = await db.select().from(auditLogs).where(eq(auditLogs.id, res.insertId));
    return newLog!;
  }

  async getAuditLogs(filters?: { userId?: string, tableName?: string, startDate?: Date, endDate?: Date }): Promise<any[]> {
    const conditions = [];
    
    if (filters?.userId) conditions.push(eq(auditLogs.userId, filters.userId));
    if (filters?.tableName) conditions.push(eq(auditLogs.tableName, filters.tableName));
    if (filters?.startDate || filters?.endDate) {
      if (filters.startDate && filters.endDate) {
        conditions.push(and(
          gte(auditLogs.createdAt, filters.startDate),
          lte(auditLogs.createdAt, filters.endDate)
        ));
      } else if (filters.startDate) {
        conditions.push(gte(auditLogs.createdAt, filters.startDate));
      } else if (filters.endDate) {
        conditions.push(lte(auditLogs.createdAt, filters.endDate));
      }
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    return await db.select().from(auditLogs)
      .where(whereClause)
      .orderBy(desc(auditLogs.createdAt));
  }

  async getAuditLog(id: number): Promise<any> {
    const [log] = await db.select().from(auditLogs).where(eq(auditLogs.id, id));
    return log;
  }
}

export const storage = new DatabaseStorage();


