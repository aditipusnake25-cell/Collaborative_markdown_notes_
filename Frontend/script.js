
const API_URL = "https://collaborative-markdown-notes.onrender.com";

const form = document.getElementById("notesForm");
const nameInput = document.getElementById("name");
const titleInput = document.getElementById("title");
const description = document.getElementById("description");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

async function apiRequest(url, options = {}) {
    let response;

    try {
        response = await fetch(url, options);
    } catch (error) {
        throw new Error(
            "Cannot connect to the server. Check your internet, backend URL, and server status."
        );
    }

    const text = await response.text();
    let result = {};

    if (text) {
        try {
            result = JSON.parse(text);
        } catch {
            throw new Error(
                `Server returned an invalid response (HTTP ${response.status}).`
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

if (
    form &&
    nameInput &&
    titleInput &&
    description &&
    saveBtn &&
    cancelBtn
) {
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
            await apiRequest(`${API_URL}/api/notes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(note)
            });

            alert("Note saved successfully!");

            form.reset();
            editor.value("");
        } catch (error) {
            console.error("Error saving note:", error);
            alert(error.message);
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
