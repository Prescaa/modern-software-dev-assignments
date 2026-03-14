const db = require("./db");

const getAllCategories = () => {
    return db.read().categories.sort((a, b) => a.name.localeCompare(b.name));
};

const createCategory = ({ name, color }) => {
    const data = db.read();
    if (data.categories.find(c => c.name.toLowerCase() === name.toLowerCase())) {
        throw new Error("Unique constraint failed");
    }
    const newCategory = {
        id: Date.now(), // Pakai timestamp sebagai ID
        name,
        color,
        created_at: new Date().toISOString()
    };
    data.categories.push(newCategory);
    db.write(data);
    return newCategory;
};

const deleteCategory = (id) => {
    const data = db.read();
    data.categories = data.categories.filter(c => c.id !== id);
    // Jika kategori dihapus, set category_id di notes jadi null
    data.notes = data.notes.map(n => n.category_id === id ? { ...n, category_id: null } : n);
    db.write(data);
};

module.exports = { getAllCategories, createCategory, deleteCategory };