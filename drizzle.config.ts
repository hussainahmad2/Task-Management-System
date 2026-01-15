import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: ["./shared/schema.ts", "./shared/models/auth.ts", "./shared/models/chat.ts"],
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || "oms",
    port: Number(process.env.DB_PORT) || 3306,
  },
});
