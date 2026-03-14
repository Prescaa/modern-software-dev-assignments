import { useEffect, useState } from "react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    const res = await fetchCategories();
    setCategories(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateCategory(editingId, { name });
      } else {
        await createCategory({ name });
      }
      setName("");
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await deleteCategory(id);
    load();
  };

  return (
    <div className="category-manager">
      <h2>Categories</h2>

      {error && <p className="form-error">{error}</p>}

      <form className="category-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn"
            onClick={() => {
              setEditingId(null);
              setName("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat.id}>
            <span>{cat.name}</span>
            <div>
              <button className="btn btn-sm" onClick={() => handleEdit(cat)}>
                Edit
              </button>
              <button
                className="btn btn-sm btn-delete"
                onClick={() => handleDelete(cat.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
