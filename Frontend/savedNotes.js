const notesList = document.getElementById("notesList");
const refreshBtn = document.getElementById("refreshBtn");
const editSection = document.getElementById("edit-section");
const editForm = document.getElementById("editForm");
const editName = document.getElementById("editName");
const editTitle = document.getElementById("editTitle");
const editDescription = document.getElementById("editDescription");
const updateBtn = document.getElementById("updateBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

let editEditor = null;
let editingId = null;

if (editDescription) {
    editEditor = new SimpleMDE({
        element: editDescription,
        spellChecker: false
    });
}

async function loadNotes() {
    if (!notesList) return;

    notesList.textContent = "Loading notes...";
    const API_URL = "https://collaborative-markdown-notes.vercel.app/index.html"
    try {
        const response = await fetch(`${API_URL}/api/notes`);
        const notes = await response.json();

        if (!response.ok) {
            throw new Error(notes.message || "Failed to load notes.");
        }

        notesList.innerHTML = "";

        if (!Array.isArray(notes) || notes.length === 0) {
            notesList.textContent = "No saved notes found.";
            return;
        }

        notes.forEach(note => {
            const card = document.createElement("div");
            card.className = "note-card";

            const title = document.createElement("h3");
            title.textContent = note.title;

            const author = document.createElement("p");
            author.textContent = "Added by: " + note.name;

            const content = document.createElement("div");
            content.className = "note-content";
            content.textContent = note.description;

            const editBtn = document.createElement("button");
            editBtn.type = "button";
            editBtn.textContent = "Edit";
            editBtn.className = "edit-btn";

            editBtn.addEventListener("click", () => {
                if (!editSection || !editEditor) return;

                editingId = note._id;
                editName.value = note.name || "";
                editTitle.value = note.title || "";
                editEditor.value(note.description || "");

                editSection.hidden = false;
                editSection.scrollIntoView({ behavior: "smooth" });
                editEditor.codemirror.refresh();
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete-btn";

            deleteBtn.addEventListener("click", async () => {
                if (!confirm("Are you sure you want to delete this note?")) {
                    return;
                }

                try {
                    const response = await fetch(
                        `/api/notes/${note._id}`,
                        { method: "DELETE" }
                    );

                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(result.message || "Failed to delete note.");
                    }

                    if (editingId === note._id) {
                        editForm.reset();
                        editEditor.value("");
                        editingId = null;
                        editSection.hidden = true;
                    }

                    alert("Note deleted successfully!");
                    await loadNotes();
                } catch (error) {
                    console.error(error);
                    alert(error.message);
                }
            });

            card.append(title, author, content, editBtn, deleteBtn);
            notesList.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading notes:", error);
        notesList.textContent = "Failed to load notes. Check your server.";
    }
}

if (editForm) {
    editForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!editingId || !editEditor) return;

        const note = {
            name: editName.value.trim(),
            title: editTitle.value.trim(),
            description: editEditor.value().trim()
        };

        if (!note.name || !note.title || !note.description) {
            alert("Please fill in all fields.");
            return;
        }

        updateBtn.disabled = true;

        try {
            const response = await fetch(`/api/notes/${editingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(note)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to update note.");
            }

            alert("Note updated successfully!");

            editForm.reset();
            editEditor.value("");
            editingId = null;
            editSection.hidden = true;

            await loadNotes();
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            updateBtn.disabled = false;
        }
    });
}

if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
        editForm.reset();
        editEditor.value("");
        editingId = null;
        editSection.hidden = true;
    });
}

if (refreshBtn) {
    refreshBtn.addEventListener("click", loadNotes);
}

loadNotes();
