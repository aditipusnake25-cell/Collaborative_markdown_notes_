import mongoose from "mongoose";
import Note from "../model/NoteSchema.js";

const connectDB = async () => {
    try{
        mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB connected successfully!");
    }catch(error){
        console.log("Connection error: ",error.message);
    }
}

export default connectDB