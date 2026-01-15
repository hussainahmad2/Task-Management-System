import { db } from "./db";
import { organizations, departments, employees, tasks, userRoles } from "@shared/schema";
import { storage } from "./storage";

async function seed() {
  console.log("Seeding database...");

  // Check if data exists
  const existingOrgs = await storage.getAllOrganizations();
  if (existingOrgs.length > 0) {
    console.log("Database already seeded.");
    return;
  }

  // 1. Create Organization
  const org = await storage.createOrganization("Acme Corp", "acme-corp");
  console.log("Created Org:", org.name);

  // 2. Create Departments
  const deptEngineering = await storage.createDepartment(org.id, "Engineering");
  const deptHR = await storage.createDepartment(org.id, "Human Resources");
  const deptSales = await storage.createDepartment(org.id, "Sales");
  console.log("Created Departments");

  // 3. Create Employees (Mocking Auth User connection for now)
  // In a real flow, these would be linked to actual auth users.
  // We will leave userId as a placeholder or create dummy users if needed by schema constraints.
  // Note: Schema has userId as reference to users.id. 
  // We need to create dummy users in auth schema first if we want to seed employees properly.
  
  // Let's rely on the app to create the first user, OR we can try to insert into users table if we import it.
  // But users table is in shared/models/auth.ts and is managed by Replit Auth.
  // We can't easily fake Replit Auth users.
  
  // Strategy: We will skip creating employees here to avoid Foreign Key constraint violations with non-existent auth users.
  // Instead, we will just have the Org and Departments ready.
  // The first user who logs in can be guided to create an employee profile or we can auto-provision.
  
  // However, to make the dashboard look good, maybe we can create tasks that are unassigned or assigned to a placeholder?
  // Tasks require createdById (employee).
  
  // Okay, let's create ONE dummy user and employee just for visualization if the schema allows.
  // The `users` table ID is a varchar (UUID).
  
  /*
  // This part is risky without real auth users. Let's skip deep seeding of employees/tasks 
  // and rely on the user to create them via the UI, OR just seed Org/Depts.
  // The user asked for "Implementation-ready", so empty state is better than broken state.
  */

  console.log("Seeding complete (Basic Structure).");
}

seed().catch(console.error);
