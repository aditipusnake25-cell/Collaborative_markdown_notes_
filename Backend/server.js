import dotenv from "dotenv"
import connectDB from "./config/db.js"
import express from 'express'
import path from 'path'
import { fileURLToPath } from "url"
import router from "./routes/noteRoutes.js"
import cors from "cors"

const app = express()

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

app.use(express.json())

app.use(express.static(path.resolve(__dirname, "../Frontend")))

const PORT = process.env.PORT || 6000

app.use("/api", router)


app.use(cors({
    origin: [
        "https://collaborative-markdown-notes.vercel.app",
        "https://collaborative-markdown-notes.onrender.com",
         "https://collaborative-markdown-notes-frontend.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

const startServer = async () => {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);
        })
    } catch (error) {
        console.log("Connection error: ",error);

    }
}

startServer()
