import mongoose from 'mongoose'

const notesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true })

const Note = new mongoose.model("Note", notesSchema)

export default Note;