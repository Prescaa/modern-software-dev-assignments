const path = require("path");
const express = require("express");
const morgan = require("morgan");

const { getAllCategories, createCategory, deleteCategory } = require("./models/categoryModel");
const { getAllNotes, getNotesByCategory, getNoteById, createNote, deleteNote, updateNote } = require("./models/noteModel");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));

function extractActionItems(text) {
    if (!text) return [];
    const items = [];
    const lines = text.split(/\r?\n/);

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        const todoMatch = line.match(/TODO:\s*(.+)/i);
        if (todoMatch && todoMatch[1]) items.push(todoMatch[1].trim());

        const bangMatches = line.match(/([^.!?]*![^.!?]*)/g);
        if (bangMatches) {
            for (const segment of bangMatches) {
                const cleaned = segment.trim();
                if (cleaned) items.push(cleaned);
            }
        }
    }
    return Array.from(new Set(items));
}

function attachActionItemsToNotes(notes) {
    return notes.map((note) => ({
        ...note,
        actionItems: extractActionItems(note.content),
    }));
}

app.get("/", (req, res) => {
    const categoryId = req.query.category ? Number(req.query.category) : null;
    const categories = getAllCategories();
    const notes = categoryId ? getNotesByCategory(categoryId) : getAllNotes();
    const notesWithActions = attachActionItemsToNotes(notes);
    
    res.render("index", {
        pageTitle: "Developer Control Center",
        categories,
        notes: notesWithActions,
        selectedCategoryId: categoryId,
        stats: {
            totalNotes: notes.length,
            totalCategories: categories.length,
            totalActionItems: notesWithActions.reduce((sum, n) => sum + n.actionItems.length, 0),
        },
        error: null,
        form: {},
        note: null
    });
});

app.get("/notes/new", (req, res) => {
    res.render("note-form", {
        pageTitle: "New Note • DCC",
        categories: getAllCategories(),
        error: null,
        form: {},
        note: null
    });
});

app.post("/notes", (req, res) => {
    const { title, content, category_id } = req.body;
    if (!title || !content) {
        return res.status(400).render("note-form", {
            pageTitle: "New Note • DCC",
            categories: getAllCategories(),
            error: "Title and content are required.",
            form: req.body,
            note: null
        });
    }
    createNote({ title, content, category_id: category_id ? Number(category_id) : null });
    res.redirect("/");
});

app.post("/notes/update/:id", (req, res) => {
    const id = Number(req.params.id);
    const { title, content, category_id } = req.body;
    if (!title || !content) {
        const note = getNoteById(id);
        return res.status(400).render("note-form", {
            pageTitle: "Edit Note • DCC",
            categories: getAllCategories(),
            note,
            error: "Title and content are required.",
            form: req.body
        });
    }
    updateNote(id, { title, content, category_id: category_id ? Number(category_id) : null });
    res.redirect("/");
});

app.get("/notes/:id", (req, res) => {
    const id = Number(req.params.id);
    const note = getNoteById(id);
    if (!note) return res.status(404).send("Not Found");

    res.render("note-detail", {
        pageTitle: note.title,
        note: { ...note, actionItems: extractActionItems(note.content) },
        categories: getAllCategories(),
        error: null,
        form: {},
    });
});

app.get("/notes/edit/:id", (req, res) => {
    const id = Number(req.params.id);
    const note = getNoteById(id);
    if (!note) return res.status(404).send("Not Found");

    res.render("note-form", {
        pageTitle: "Edit Note • DCC",
        categories: getAllCategories(),
        note,
        error: null,
        form: {},
    });
});

app.post("/notes/:id/delete", (req, res) => {
    deleteNote(Number(req.params.id));
    res.redirect("/");
});

app.get("/categories", (req, res) => {
    res.render("categories", {
        pageTitle: "Categories • DCC",
        categories: getAllCategories(),
        error: null,
        form: {},
        note: null
    });
});

app.post("/categories", (req, res) => {
    const { name, color } = req.body;
    try {
        createCategory({ name: name.trim(), color: color || "#38bdf8" });
        res.redirect("/categories");
    } catch (err) {
        res.render("categories", {
            pageTitle: "Categories • DCC",
            categories: getAllCategories(),
            error: "Category name must be unique.",
            form: {},
            note: null
        });
    }
});

app.post("/categories/:id/delete", (req, res) => {
    deleteCategory(Number(req.params.id));
    res.redirect("/categories");
});

app.listen(PORT, () => {
    console.log(`🚀 Version 3 (JSON Monolith) running at http://localhost:${PORT}`);
});