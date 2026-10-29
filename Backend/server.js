import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/noteRoutes.js";
import cors from "cors";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration — must come before API routes
app.use(
    cors({
        origin: [
            "https://collaborative-markdown-notes.vercel.app",
            "https://collaborative-markdown-notes.onrender.com",
            "https://collaborative-markdown-notes-frontend.onrender.com"
        ],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

// Middleware
app.use(express.json());

// Serve frontend files
app.use(express.static(path.resolve(__dirname, "../Frontend")));

// API routes
app.use("/api", router);

// Server
const PORT = process.env.PORT || 6000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Connection error:", error);
    }
};

startServer();