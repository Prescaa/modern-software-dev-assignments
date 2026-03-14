import { useState } from "react";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import CategoryManager from "./components/CategoryManager";
import "./App.css";

export default function App() {
  const [editingNote, setEditingNote] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [tab, setTab] = useState("notes");

  const handleSaved = () => {
    setEditingNote(null);
    setRefresh((r) => r + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Developer Control Center</h1>
        <nav>
          <button
            className={tab === "notes" ? "tab active" : "tab"}
            onClick={() => setTab("notes")}
          >
            Notes
          </button>
          <button
            className={tab === "categories" ? "tab active" : "tab"}
            onClick={() => setTab("categories")}
          >
            Categories
          </button>
        </nav>
      </header>

      <main className="app-main">
        {tab === "notes" && (
          <div className="notes-layout">
            <aside className="sidebar">
              <NoteForm
                editingNote={editingNote}
                onSaved={handleSaved}
                onCancel={() => setEditingNote(null)}
              />
            </aside>
            <section className="content">
              <NoteList onEdit={setEditingNote} refresh={refresh} />
            </section>
          </div>
        )}

        {tab === "categories" && <CategoryManager />}
      </main>
    </div>
  );
}
