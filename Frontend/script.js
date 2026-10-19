
const form = document.getElementById("notesForm");
const nameInput = document.getElementById("name");
const titleInput = document.getElementById("title");
const description = document.getElementById("description");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

if (form && nameInput && titleInput && description && saveBtn && cancelBtn) {
    const editor = new SimpleMDE({
        element: description,
        spellChecker: false
    });

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const note = {
            name: nameInput.value.trim(),
            title: titleInput.value.trim(),
            description: editor.value().trim()
        };

        if (!note.name || !note.title || !note.description) {
            alert("Please fill in all fields.");
            return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = "Saving...";

        try {
            const response = await fetch("/api/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(note)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to save note.");
            }

            alert("Note saved successfully!");

            form.reset();
            editor.value("");

        } catch (error) {
            console.error("Error saving note:", error);
            alert("Unable to save note. Check your backend server and MongoDB connection.");
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = "Save Note";
        }
    });

    cancelBtn.addEventListener("click", function () {
        form.reset();
        editor.value("");
    });
}
