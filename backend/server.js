import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./src/config/db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());


// ==============================
// HOME ROUTE
// ==============================

app.get("/", (req, res) => {
    res.json({
        message: "Guest House Booking Backend is running!"
    });
});


// ==============================
// DATABASE TEST ROUTE
// ==============================

app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT 1 AS result"
        );

        res.json({
            message: "Database connected successfully!",
            result: rows[0].result
        });

    } catch (error) {
        console.error("Database error:", error);

        res.status(500).json({
            message: "Database connection failed",
            error: error.message
        });
    }
});


// ==============================
// START SERVER + TEST DATABASE
// ==============================

const startServer = async () => {
    try {

        // Test MySQL connection
        await pool.query("SELECT 1");

        console.log("Database connected successfully!");

        // Start Express server
        app.listen(PORT, () => {
            console.log(
                `Server running on http://localhost:${PORT}`
            );
        });

    } catch (error) {

        console.error(
            "Database connection failed:",
            error.message
        );

        process.exit(1);
    }
};

startServer();
