import Note from "../model/NoteSchema.js";

const addNote = async (req, res) => {
    const { name, title, description } = req.body
    try {
        if (typeof name != "string" || typeof title != "string" || typeof description != "string") {
            return res.status(400).json({
                message: "Invalid Information!"
            })
        }
        if (!name.trim() || !title.trim() || !description.trim()) {
            return res.status(400).json({
                message: "All fields are required!"
            })
        }
        const note = await Note.create({
            name,
            title,
            description
        })
        return res.status(201).json({
            message: "Note added successfully!",
            Note: note
        })

    } catch (error) {
        console.log(error.message);

        return res.json(500).json({
            message: "Failed to add note!"
        })
    }
}

const getNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id)
        if (!note) {
            return res.json({
                message: "Note not found!"
            })
        }
        return res.json({
            message: "Note Found!",
            Note: note
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            message: "Failed to get note"
        })
    }
}

const getAllNotes= async (req,res) => {
    try {
        const notes = await Note.find()
        if(!notes){
            return res.status(401).json({
                message:"Failed to load notes!"
            })
        }
        res.json(notes)
    } catch (error) {
        res.status(500).json({
            message: "Error getting notes"
        });
    }
}

const deleteNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id)
        if (!note) {
            return res.status(404).json({
                message: "Unable to delete note!"
            })
        }
        return res.status(200).json({
            message: "Note deleted!",
        })

    } catch (error) {
        console.log("Error to delete the note: ", error.message);
        return res.status(500).json({
            message: "Failed to delete note!"
        })
    }

}

const updateNote = async (req, res) => {
    const { name, title, description } = req.body
    try {

        const note = await Note.findByIdAndUpdate(
            req.params.id,
            {
                name,
                title,
                description
            },
            { new: true, runValidators: true }
        )
        if (!note) {
            return res.status(404).json({
                message: "Unable to update note"
            })
        }
        return res.status(200).json({
            message: "Note Updated!",
            Note: note
        })

    } catch (error) {
        console.log("Updation error: ", error.message);
        return res.status(500).json({
            message: "Unable to update note!"
        })
    }
}
export { addNote, getNote, deleteNote , updateNote , getAllNotes }