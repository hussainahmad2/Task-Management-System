import type { Express } from "express";
import type { Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { setupAuth, registerAuthRoutes } from "./integrations/auth";

import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertEmployeeSchema, insertTaskSchema } from "@shared/schema";
import { requirePermission, requireRole } from "./middleware/rbac";

// Configure Multer
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), "uploads", "profile_photos");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === 1. Setup Auth First ===
  console.log("Setting up auth...");
  await setupAuth(app);
  console.log("Auth setup complete");
  registerAuthRoutes(app);

  // Profile Photo Upload Route
  app.post("/api/user/profile-photo", upload.single("photo"), async (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `/uploads/profile_photos/${req.file.filename}`;

    try {
      // @ts-ignore
      await storage.updateUser(req.user.id, { profileImageUrl: fileUrl });
      res.json({ message: "Profile photo updated", imageUrl: fileUrl });
    } catch (error) {
      console.error("Profile upload error:", error);
      res.status(500).json({ message: "Failed to update profile photo" });
    }
  });

  app.get("/api/ping", (req, res) => {
    res.json({ message: "pong" });
  });

  // === RBAC Routes ===

  // Get current user permissions
  app.get("/api/auth/permissions", async (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const permissions = await storage.getUserPermissions((req.user as any).id);
    res.json(permissions);
  });

  // Get all available permissions (For CEO/CTO/CPO)
  app.get("/api/permissions", requireRole(["CEO", "CTO", "CPO"]), async (req, res) => {
    const perms = await storage.getAllPermissions();
    res.json(perms);
  });

  // Get permissions for a specific role
  app.get("/api/permissions/role/:role", requireRole(["CEO", "CTO", "CPO"]), async (req, res) => {
    const perms = await storage.getRolePermissions(req.params.role);
    res.json(perms);
  });

  // Update permissions for a role
  app.put("/api/permissions/role/:role", requirePermission("permissions.manage"), async (req, res) => {
    const { permissionIds } = req.body;
    if (!Array.isArray(permissionIds)) {
      return res.status(400).json({ message: "permissionIds must be an array" });
    }

    await storage.updateRolePermissions(req.params.role, permissionIds);
    res.json({ message: "Permissions updated successfully" });
  });

  // === 2. Register Integrations ===


  // === 3. Application Routes ===

  // Invoices
  app.get(api.invoices.list.path, async (req, res) => {
    const invoices = await storage.getInvoices(Number(req.params.orgId));
    res.json(invoices);
  });

  app.get(api.invoices.get.path, async (req, res) => {
    const invoice = await storage.getInvoice(Number(req.params.id));
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  });

  app.post(api.invoices.create.path, async (req, res) => {
    try {
      const user = req.user as any;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const employee = await storage.getEmployeeByUserId(user.claims.sub);
      if (!employee) return res.status(403).json({ message: "User is not an employee" });

      const input = api.invoices.create.input.parse(req.body);
      const invoice = await storage.createInvoice({
        ...input,
        orgId: Number(req.params.orgId),
        createdById: employee.id
      });
      res.status(201).json(invoice);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.patch(api.invoices.update.path, async (req, res) => {
    try {
      const input = api.invoices.update.input.parse(req.body);
      const invoice = await storage.updateInvoice(Number(req.params.id), input);
      if (!invoice) return res.status(404).json({ message: "Invoice not found" });
      res.json(invoice);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.delete(api.invoices.delete.path, async (req, res) => {
    await storage.deleteInvoice(Number(req.params.id));
    res.status(204).send();
  });

  // Leave Requests
  app.get(api.leaveRequests.list.path, async (req, res) => {
    const leaveRequests = await storage.getLeaveRequests(Number(req.params.employeeId));
    res.json(leaveRequests);
  });

  app.get(api.leaveRequests.get.path, async (req, res) => {
    const leaveRequest = await storage.getLeaveRequest(Number(req.params.id));
    if (!leaveRequest) return res.status(404).json({ message: "Leave request not found" });
    res.json(leaveRequest);
  });

  app.post(api.leaveRequests.create.path, async (req, res) => {
    try {
      const input = api.leaveRequests.create.input.parse(req.body);
      const leaveRequest = await storage.createLeaveRequest({
        ...input,
        employeeId: Number(req.params.employeeId)
      });
      res.status(201).json(leaveRequest);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.patch(api.leaveRequests.update.path, async (req, res) => {
    try {
      const input = api.leaveRequests.update.input.parse(req.body);
      const leaveRequest = await storage.updateLeaveRequest(Number(req.params.id), input);
      if (!leaveRequest) return res.status(404).json({ message: "Leave request not found" });
      res.json(leaveRequest);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post(api.leaveRequests.approve.path, async (req, res) => {
    try {
      const user = req.user as any;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const employee = await storage.getEmployeeByUserId(user.claims.sub);
      if (!employee) return res.status(403).json({ message: "User is not an employee" });

      // Check if this is a manager or HR approving
      const leaveRequest = await storage.getLeaveRequest(Number(req.params.id));
      if (!leaveRequest) return res.status(404).json({ message: "Leave request not found" });

      let updatedRequest;
      if (employee.role === 'HR Manager' || (employee.role && employee.role.includes('HR'))) {
        // HR approves
        updatedRequest = await storage.approveByHR(Number(req.params.id), employee.id, req.body.notes);
      } else if (employee.id === leaveRequest.employee.managerId || (employee.role && employee.role.includes('Manager'))) {
        // Manager approves
        updatedRequest = await storage.approveByManager(Number(req.params.id), employee.id, req.body.notes);
      } else {
        return res.status(403).json({ message: "Insufficient permissions to approve this leave request" });
      }

      res.json(updatedRequest);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Approval failed" });
    }
  });

  app.post(api.leaveRequests.reject.path, async (req, res) => {
    try {
      const input = api.leaveRequests.reject.input.parse(req.body);
      const user = req.user as any;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const employee = await storage.getEmployeeByUserId(user.claims.sub);
      if (!employee) return res.status(403).json({ message: "User is not an employee" });

      // Check if this is a manager or HR rejecting
      const leaveRequest = await storage.getLeaveRequest(Number(req.params.id));
      if (!leaveRequest) return res.status(404).json({ message: "Leave request not found" });

      let updatedRequest;
      if (employee.role === 'HR Manager' || (employee.role && employee.role.includes('HR'))) {
        // HR rejects
        updatedRequest = await storage.rejectByHR(Number(req.params.id), employee.id, input?.rejectionReason);
      } else if (employee.id === leaveRequest.employee.managerId || (employee.role && employee.role.includes('Manager'))) {
        // Manager rejects
        updatedRequest = await storage.rejectByManager(Number(req.params.id), employee.id, input?.rejectionReason);
      } else {
        return res.status(403).json({ message: "Insufficient permissions to reject this leave request" });
      }

      res.json(updatedRequest);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Rejection failed" });
    }
  });

  // Audit Logs
  app.get(api.auditLogs.list.path, async (req, res) => {
    const logs = await storage.getAuditLogs();
    res.json(logs);
  });

  app.get(api.auditLogs.get.path, async (req, res) => {
    const log = await storage.getAuditLog(Number(req.params.id));
    if (!log) return res.status(404).json({ message: "Audit log not found" });
    res.json(log);
  });

  app.post(api.auditLogs.create.path, async (req, res) => {
    try {
      const input = api.auditLogs.create.input.parse(req.body);
      const log = await storage.createAuditLog(input);
      res.status(201).json(log);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // Organizations
  app.get(api.organizations.list.path, async (req, res) => {
    const orgs = await storage.getAllOrganizations();
    res.json(orgs);
  });

  app.post(api.organizations.create.path, async (req, res) => {
    try {
      const input = api.organizations.create.input.parse(req.body);
      const org = await storage.createOrganization(input.name, input.slug);
      res.status(201).json(org);
    } catch (err) {
      if (err instanceof z.ZodError) res.status(400).json({ message: err.message });
      else res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Departments
  app.get(api.departments.list.path, async (req, res) => {
    const depts = await storage.getDepartments(Number(req.params.orgId));
    res.json(depts);
  });

  app.post(api.departments.create.path, async (req, res) => {
    try {
      const input = api.departments.create.input.parse(req.body);
      const dept = await storage.createDepartment(Number(req.params.orgId), input.name);
      res.status(201).json(dept);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // Employees
  app.get(api.employees.list.path, async (req, res) => {
    const emps = await storage.getEmployees(Number(req.params.orgId));
    res.json(emps);
  });

  app.get(api.employees.get.path, async (req, res) => {
    const emp = await storage.getEmployee(Number(req.params.id));
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json(emp);
  });

  app.post(api.employees.create.path, async (req, res) => {
    try {
      // Extract user data first (not part of employee schema)
      const userData = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      };

      // Remove user fields from body before validation
      const { username, password, email, firstName, lastName, ...employeeData } = req.body;

      // Create new object with converted date (don't mutate)
      const employeeDataWithDate = {
        ...employeeData,
        joiningDate: employeeData.joiningDate ? new Date(employeeData.joiningDate) : undefined
      };

      // Validate only employee schema fields
      const input = api.employees.create.input.parse(employeeDataWithDate);

      const emp = await storage.createEmployee({ ...input, orgId: Number(req.params.orgId) } as any, userData);

      res.status(201).json(emp);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: err.errors });
      } else {
        res.status(400).json({ message: err instanceof Error ? err.message : "Invalid input" });
      }
    }
  });

  // Tasks
  app.get(api.tasks.list.path, async (req, res) => {
    const filters = {
      assigneeId: req.query.assigneeId ? Number(req.query.assigneeId) : undefined,
      status: req.query.status as string,
      priority: req.query.priority as string,
    };
    const tasks = await storage.getTasks(Number(req.params.orgId), filters);
    res.json(tasks);
  });

  app.post(api.tasks.create.path, async (req, res) => {
    try {
      // In a real app, get createdById from authenticated user session
      // For now, we'll assume the request might send it or we default (dangerous in prod, ok for MVP demo)
      // Actually, better to look up employee by auth user id

      const user = req.user as any;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const employee = await storage.getEmployeeByUserId(user.claims.sub);
      if (!employee) return res.status(403).json({ message: "User is not an employee" });

      const input = api.tasks.create.input.parse(req.body);
      const task = await storage.createTask({
        ...input,
        orgId: Number(req.params.orgId),
        createdById: employee.id
      });
      res.status(201).json(task);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.patch(api.tasks.update.path, async (req, res) => {
    try {
      const input = api.tasks.update.input.parse(req.body);
      const task = await storage.updateTask(Number(req.params.id), input);
      if (!task) return res.status(404).json({ message: "Task not found" });
      res.json(task);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // Analytics
  app.get(api.analytics.dashboard.path, async (req, res) => {
    const stats = await storage.getOrgStats(Number(req.params.orgId));
    res.json(stats);
  });

  return httpServer;
}
