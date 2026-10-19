import dotenv from "dotenv"
import connectDB from "./config/db.js"
import express from 'express'
import path from 'path'
import { fileURLToPath } from "url"
import router from "./routes/noteRoutes.js"

const app = express()

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

app.use(express.json())

app.use(express.static(path.resolve(__dirname, "../Frontend")))

const PORT = process.env.PORT || 5000

app.use("/api", router)



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
