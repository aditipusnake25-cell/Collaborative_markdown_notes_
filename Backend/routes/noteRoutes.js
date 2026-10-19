import { addNote, getNote, deleteNote, updateNote ,getAllNotes } from "../Controller/noteController.js"

import express from 'express'

const router = express.Router()
router.get("/notes", getAllNotes)
router.post("/notes", addNote)

router.get("/notes/:id", getNote)

router.delete("/notes/:id", deleteNote)

router.put("/notes/:id", updateNote)

export default router;