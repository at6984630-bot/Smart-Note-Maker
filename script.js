
// Get HTML Elements
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const addNoteBtn = document.getElementById("addNoteBtn");
const notesContainer = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");
const noteCount = document.getElementById("noteCount");
const emptyMessage = document.getElementById("emptyMessage");
const currentDate = document.getElementById("currentDate");

// Load notes from LocalStorage
let notes = JSON.parse(localStorage.getItem("myNotes")) || [];

// Edit note ID
let editId = null;

// Display current date
currentDate.textContent = new Date().toLocaleDateString(
    "en-IN",
    {
        day: "numeric",
        month: "long",
        year: "numeric"
    }
);

// Save notes in LocalStorage
function saveNotes() {
    localStorage.setItem("myNotes", JSON.stringify(notes));
}

// Display all notes
function displayNotes(filteredNotes = notes) {

    notesContainer.replaceChildren();

    noteCount.textContent =
        notes.length + (notes.length === 1 ? " Note" : " Notes");

    emptyMessage.style.display =
        filteredNotes.length === 0 ? "block" : "none";

    filteredNotes.forEach(function(note) {

        // Create note card
        const card = document.createElement("div");
        card.className = "note-card";

        // Note title
        const title = document.createElement("h3");
        title.textContent = note.title;

        // Note content
        const content = document.createElement("p");
        content.textContent = note.content;

        // Note date
        const date = document.createElement("div");
        date.className = "note-date";
        date.textContent = "Created: " + note.date;

        // Buttons
        const actions = document.createElement("div");
        actions.className = "note-actions";

        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function() {
            editNote(note.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            deleteNote(note.id);
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        card.appendChild(title);
        card.appendChild(content);
        card.appendChild(date);
        card.appendChild(actions);

        notesContainer.appendChild(card);
    });
}

// Add or Update Note
addNoteBtn.addEventListener("click", function() {

    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    // Check empty fields
    if (title === "" || content === "") {
        alert("Please enter both title and note content!");
        return;
    }

    if (editId !== null) {

        // Update existing note
        const note = notes.find(function(n) {
            return n.id === editId;
        });

        if (note) {
            note.title = title;
            note.content = content;
        }

        editId = null;
        addNoteBtn.textContent = "+ Add Note";

    } else {

        // Create new note
        const newNote = {
            id: Date.now(),
            title: title,
            content: content,
            date: new Date().toLocaleString("en-IN")
        };

        notes.unshift(newNote);
    }

    // Save and refresh
    saveNotes();

    noteTitle.value = "";
    noteContent.value = "";

    displayNotes();
});

// Edit Note Function
function editNote(id) {

    const note = notes.find(function(n) {
        return n.id === id;
    });

    if (!note) return;

    noteTitle.value = note.title;
    noteContent.value = note.content;

    editId = id;

    addNoteBtn.textContent = "Update Note";

    noteTitle.focus();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Delete Note Function
function deleteNote(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this note?"
    );

    if (confirmDelete) {

        notes = notes.filter(function(note) {
            return note.id !== id;
        });

        // Cancel editing if deleted note was being edited
        if (editId === id) {
            editId = null;
            noteTitle.value = "";
            noteContent.value = "";
            addNoteBtn.textContent = "+ Add Note";
        }

        saveNotes();
        displayNotes();
    }
}

// Search Notes Function
searchInput.addEventListener("input", function() {

    const searchText = searchInput.value.toLowerCase();

    const filteredNotes = notes.filter(function(note) {

        return (
            note.title.toLowerCase().includes(searchText) ||
            note.content.toLowerCase().includes(searchText)
        );

    });

    displayNotes(filteredNotes);
});

// Display notes when website opens
displayNotes();
