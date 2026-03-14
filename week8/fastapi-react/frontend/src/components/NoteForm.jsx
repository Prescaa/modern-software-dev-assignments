import { useEffect, useState } from "react";
import { createNote, updateNote, fetchCategories } from "../api";

export default function NoteForm({ editingNote, onSaved, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories().then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setCategoryId(editingNote.category_id ?? "");
    } else {
      setTitle("");
      setContent("");
      setCategoryId("");
    }
  }, [editingNote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = {
      title,
      content,
      category_id: categoryId ? Number(categoryId) : null,
    };

    try {
      if (editingNote) {
        await updateNote(editingNote.id, data);
      } else {
        await createNote(data);
      }
      setTitle("");
      setContent("");
      setCategoryId("");
      onSaved();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <h2>{editingNote ? "Edit Note" : "New Note"}</h2>

      {error && <p className="form-error">{error}</p>}

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        <option value="">No category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <div className="form-buttons">
        <button type="submit" className="btn btn-primary">
          {editingNote ? "Update" : "Create"}
        </button>
        {editingNote && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
