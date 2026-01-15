
import "dotenv/config";
import mysql from "mysql2/promise";

async function resetTable() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USERNAME || "root",
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE || "oms",
        port: Number(process.env.DB_PORT) || 3306,
    });

    try {
        console.log("Dropping users table...");
        await connection.execute("DROP TABLE IF EXISTS users");
        console.log("Users table dropped.");
    } catch (error) {
        console.error("Error dropping table:", error);
    } finally {
        await connection.end();
    }
}

resetTable();
