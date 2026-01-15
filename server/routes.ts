import type { Express } from "express";
import type { Server } from "http";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
import { registerAudioRoutes } from "./replit_integrations/audio/routes";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertEmployeeSchema, insertTaskSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === 1. Setup Auth First ===
  await setupAuth(app);
  registerAuthRoutes(app);
  
  // === 2. Register Integrations ===
  registerChatRoutes(app);
  registerImageRoutes(app);
  registerAudioRoutes(app);

  // === 3. Application Routes ===
  
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
      const input = api.employees.create.input.parse(req.body);
      const emp = await storage.createEmployee({ ...input, orgId: Number(req.params.orgId) });
      res.status(201).json(emp);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
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
