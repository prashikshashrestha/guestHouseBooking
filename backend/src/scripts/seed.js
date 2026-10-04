import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import pool from "../config/db.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        // Check which database Node is connected to
        const [database] = await pool.query(
            "SELECT DATABASE() AS db"
        );

        console.log("Connected database:", database[0].db);

        // Check whether admin already exists
        const [existingUsers] = await pool.execute(
            `
            SELECT id
            FROM users
            WHERE email = ?
            LIMIT 1
            `,
            ["admin@kalika.com"]
        );

        if (existingUsers.length > 0) {
            console.log("Admin user already exists.");
            return;
        }

        // Hash password
        const passwordHash = await bcrypt.hash(
            "Admin@123",
            12
        );

        // Create SUPER_ADMIN
        await pool.execute(
            `
            INSERT INTO users
                (
                    name,
                    email,
                    phone,
                    password_hash,
                    role,
                    status
                )
            VALUES
                (?, ?, ?, ?, ?, ?)
            `,
            [
                "Super Admin",
                "admin@kalika.com",
                "9800000000",
                passwordHash,
                "SUPER_ADMIN",
                "ACTIVE",
            ]
        );

        console.log("SUPER_ADMIN created successfully.");
        console.log("--------------------------------");
        console.log("Email:    admin@kalika.com");
        console.log("Password: Admin@123");
        console.log("--------------------------------");
    } catch (error) {
        console.error("Seed error:", error);
    } finally {
        await pool.end();
    }
};

seedAdmin();