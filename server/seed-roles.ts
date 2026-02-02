import { db } from './db';
import { roles } from '@shared/schema';
import { eq } from 'drizzle-orm';

async function seedRoles() {
  console.log('Seeding roles...');
  
  const defaultRoles = [
    { name: 'CEO', slug: 'ceo', description: 'Chief Executive Officer' },
    { name: 'CPO', slug: 'cpo', description: 'Chief Product Officer' },
    { name: 'CTO', slug: 'cto', description: 'Chief Technology Officer' },
    { name: 'CIO', slug: 'cio', description: 'Chief Information Officer' },
    { name: 'General Manager', slug: 'general_manager', description: 'General Manager' },
    { name: 'HR Manager', slug: 'hr_manager', description: 'Human Resources Manager' },
    { name: 'Finance Manager', slug: 'finance_manager', description: 'Finance Manager' },
    { name: 'Assistant Manager', slug: 'assistant_manager', description: 'Assistant Manager' },
    { name: 'Senior Employee', slug: 'senior_employee', description: 'Senior Employee' },
    { name: 'Junior Employee', slug: 'junior_employee', description: 'Junior Employee' },
    { name: 'Intern', slug: 'intern', description: 'Intern' },
  ];

  for (const role of defaultRoles) {
    const existing = await db.select().from(roles).where(eq(roles.slug, role.slug));
    if (existing.length === 0) {
      await db.insert(roles).values(role);
      console.log(`Created role: ${role.name}`);
    } else {
      console.log(`Role already exists: ${role.name}`);
    }
  }
  
  console.log('Role seeding complete!');
  process.exit(0);
}

seedRoles().catch(console.error);