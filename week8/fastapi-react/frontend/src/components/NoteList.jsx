import { useEffect, useState } from "react";
import { fetchNotes, deleteNote } from "../api";

export default function NoteList({ onEdit, refresh }) {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

  const load = async () => {
    const params = search ? { q: search } : {};
    const res = await fetchNotes(params);
    setNotes(res.data);
  };

  useEffect(() => {
    load();
  }, [refresh, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    await deleteNote(id);
    load();
  };

  return (
    <div className="note-list">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {notes.length === 0 && <p className="empty">No notes yet. Create one!</p>}

      {notes.map((note) => (
        <div key={note.id} className="note-card">
          <div className="note-header">
            <h3>{note.title}</h3>
            <span className="note-date">
              {new Date(note.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="note-content">{note.content}</p>
          {note.category_id && (
            <span className="note-category">Category #{note.category_id}</span>
          )}
          <div className="note-actions">
            <button className="btn btn-edit" onClick={() => onEdit(note)}>
              Edit
            </button>
            <button className="btn btn-delete" onClick={() => handleDelete(note.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
