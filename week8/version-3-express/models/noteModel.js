const db = require("./db");

const getAllNotes = () => {
    const data = db.read();
    return data.notes.map(note => {
        const category = data.categories.find(c => Number(c.id) === Number(note.category_id));
        return {
            ...note,
            category_name: category ? category.name : null,
            category_color: category ? category.color : null,
        };
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

const getNotesByCategory = (categoryId) => {
    const notes = getAllNotes();
    return notes.filter(n => Number(n.category_id) === Number(categoryId));
};

const getNoteById = (id) => {
    return getAllNotes().find(n => Number(n.id) === Number(id));
};

const createNote = ({ title, content, category_id }) => {
    const data = db.read();
    const newNote = {
        id: Date.now(),
        title,
        content,
        category_id: category_id ? Number(category_id) : null,
        created_at: new Date().toISOString()
    };
    data.notes.push(newNote);
    db.write(data);
    return newNote;
};

const deleteNote = (id) => {
    const data = db.read();
    data.notes = data.notes.filter(n => Number(n.id) !== Number(id));
    db.write(data);
};

const updateNote = (id, { title, content, category_id }) => {
    const data = db.read();
    const noteIndex = data.notes.findIndex(n => Number(n.id) === Number(id));
    if (noteIndex === -1) return null;
    data.notes[noteIndex] = {
        ...data.notes[noteIndex],
        title,
        content,
        category_id: category_id ? Number(category_id) : null,
    };
    db.write(data);
    return data.notes[noteIndex];
};

module.exports = { getAllNotes, getNotesByCategory, getNoteById, createNote, deleteNote, updateNote };