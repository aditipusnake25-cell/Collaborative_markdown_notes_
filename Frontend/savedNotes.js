
const API_URL = "https://collaborative-markdown-notes.onrender.com";

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

async function apiRequest(url, options = {}) {
    let response;

    try {
        response = await fetch(url, options);
    } catch {
        throw new Error(
            "Cannot connect to the server. Check the backend URL, internet, and CORS settings."
        );
    }

    const text = await response.text();
    let result = {};

    if (text) {
        try {
            result = JSON.parse(text);
        } catch {
            throw new Error(
                `Invalid server response (HTTP ${response.status}).`
            );
        }
    }

    if (!response.ok) {
        throw new Error(
            result.message ||
            result.error ||
            `Request failed with status ${response.status}.`
        );
    }

    return result;
}

if (editDescription) {
    editEditor = new SimpleMDE({
        element: editDescription,
        spellChecker: false
    });
}

async function loadNotes() {
    if (!notesList) return;

    notesList.textContent = "Loading notes...";

    try {
        const notes = await apiRequest(`${API_URL}/api/notes`);

        notesList.innerHTML = "";

        if (!Array.isArray(notes) || notes.length === 0) {
            notesList.textContent = "No saved notes found.";
            return;
        }

        notes.forEach((note) => {
            const card = document.createElement("div");
            card.className = "note-card";

            const title = document.createElement("h3");
            title.textContent = note.title || "";

            const author = document.createElement("p");
            author.textContent = "Added by: " + (note.name || "");

            const content = document.createElement("div");
            content.className = "note-content";
            content.textContent = note.description || "";

            const editBtn = document.createElement("button");
            editBtn.type = "button";
            editBtn.textContent = "Edit";
            editBtn.className = "edit-btn";

            editBtn.addEventListener("click", () => {
                if (
                    !editSection ||
                    !editEditor ||
                    !editForm ||
                    !editName ||
                    !editTitle
                ) {
                    return;
                }

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

                deleteBtn.disabled = true;

                try {
                    await apiRequest(
                        `${API_URL}/api/notes/${encodeURIComponent(note._id)}`,
                        { method: "DELETE" }
                    );

                    if (editingId === note._id) {
                        editForm?.reset();
                        editEditor?.value("");
                        editingId = null;

                        if (editSection) {
                            editSection.hidden = true;
                        }
                    }

                    alert("Note deleted successfully!");
                    await loadNotes();
                } catch (error) {
                    console.error("Error deleting note:", error);
                    alert(error.message);
                    deleteBtn.disabled = false;
                }
            });

            card.append(title, author, content, editBtn, deleteBtn);
            notesList.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading notes:", error);
        notesList.textContent = error.message;
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
        updateBtn.textContent = "Updating...";

        try {
            await apiRequest(
                `${API_URL}/api/notes/${encodeURIComponent(editingId)}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(note)
                }
            );

            alert("Note updated successfully!");

            editForm.reset();
            editEditor.value("");
            editingId = null;

            if (editSection) {
                editSection.hidden = true;
            }

            await loadNotes();
        } catch (error) {
            console.error("Error updating note:", error);
            alert(error.message);
        } finally {
            updateBtn.disabled = false;
            updateBtn.textContent = "Update Note";
        }
    });
}

if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
        editForm?.reset();
        editEditor?.value("");
        editingId = null;

        if (editSection) {
            editSection.hidden = true;
        }
    });
}

if (refreshBtn) {
    refreshBtn.addEventListener("click", loadNotes);
}

loadNotes();
