import "dotenv/config";
import { db } from "../db";
import { users } from "@shared/models/auth";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function createAdmin() {
    const username = "hussain";
    const password = "hussain12";
    const role = "superadmin";

    console.log(`Checking if user '${username}' exists...`);

    const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);

    if (existingUser.length > 0) {
        console.log(`User '${username}' already exists. Updating password...`);
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.update(users)
            .set({ password: hashedPassword })
            .where(eq(users.username, username));
        console.log(`Password for '${username}' updated successfully.`);
        process.exit(0);
    }

    console.log(`Creating user '${username}'...`);
    const hashedPassword = await bcrypt.hash(password, 10);

    // ID is varchar(255), let's just use username or random string as ID for simplicity in this script, 
    // though typically we'd generate a UUID. For now, let's use a simple ID "admin-user-id".
    // Or better, let's generate a random one to mimic production.
    const id = "admin-" + Math.random().toString(36).substring(7);

    await db.insert(users).values({
        id,
        username,
        password: hashedPassword,
        role,
        firstName: "Hussain",
        lastName: "Admin",
        email: "hussain@example.com",
        profileImageUrl: "https://ui-avatars.com/api/?name=Hussain+Admin"
    });

    console.log(`User '${username}' created successfully with role '${role}'.`);
    process.exit(0);
}

createAdmin().catch((err) => {
    console.error("Error creating admin:", err);
    process.exit(1);
});
