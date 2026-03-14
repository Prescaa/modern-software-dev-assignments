import { useEffect, useMemo, useState } from "react";
import { api } from "./lib/api";
import type { Category, Note } from "./types";
import { Sidebar } from "./components/Sidebar";
import { NotesList } from "./components/NotesList";
import { NoteEditor } from "./components/NoteEditor";
import { ActionItemsList } from "./components/ActionItemsList";
import { CategoryManager } from "./components/CategoryManager";

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadInitialData();
  }, []);

  async function loadInitialData() {
    setIsLoading(true);
    setError(null);
    try {
      const [cats, nts] = await Promise.all([
        api.getCategories(),
        api.getNotes(),
      ]);
      setCategories(cats);
      setNotes(nts);
    } catch (err) {
      console.error(err);
      setError("Failed to load data from backend. Is the API running?");
    } finally {
      setIsLoading(false);
    }
  }

  const filteredNotes = useMemo(
    () =>
      selectedCategoryId
        ? notes.filter((n) => n.category_id === selectedCategoryId)
        : notes,
    [notes, selectedCategoryId]
  );

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedNoteId) ?? null,
    [notes, selectedNoteId]
  );

  async function handleCreateNote(payload: {
    title: string;
    content: string;
    category_id: string | null;
  }): Promise<boolean> {
    setIsSaving(true);
    setError(null);
    try {
      await api.createNote(payload);
      const allNotes = await api.getNotes();
      setNotes(allNotes);
      // Return to overview mode: no note selected
      setSelectedNoteId(null);
      return true;
    } catch (err) {
      console.error(err);
      setError("Failed to create note.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdateNote(
    id: string,
    payload: {
      title: string;
      content: string;
      category_id: string | null;
    }
  ): Promise<boolean> {
    setIsSaving(true);
    setError(null);
    try {
      await api.updateNote(id, payload);
      const allNotes = await api.getNotes();
      setNotes(allNotes);
      // Return to overview mode after editing
      setSelectedNoteId(null);
      return true;
    } catch (err) {
      console.error(err);
      setError("Failed to update note.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteNote(id: string) {
    setError(null);
    try {
      await api.deleteNote(id);
      const allNotes = await api.getNotes();
      setNotes(allNotes);
      if (selectedNoteId === id) {
        setSelectedNoteId(null);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete note.");
    }
  }

  async function handleCreateCategory(payload: {
    name: string;
    color: string;
  }) {
    setError(null);
    try {
      await api.createCategory(payload);
      const allCategories = await api.getCategories();
      setCategories(allCategories);
    } catch (err) {
      console.error(err);
      setError("Failed to create category. Maybe the name already exists?");
    }
  }

  async function handleDeleteCategory(id: string) {
    setError(null);
    try {
      await api.deleteCategory(id);
      const allCategories = await api.getCategories();
      setCategories(allCategories);
      if (selectedCategoryId === id) {
        setSelectedCategoryId(null);
      }
      // Reload notes so category references and action items stay in sync
      const allNotes = await api.getNotes();
      setNotes(allNotes);
    } catch (err) {
      console.error(err);
      setError("Failed to delete category.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-6 flex gap-5 h-screen">
        <Sidebar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={(id) => setSelectedCategoryId(id)}
          onDeleteCategory={handleDeleteCategory}
        />

        <main className="flex-1 flex flex-col gap-4">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Dashboard
              </p>
              <h1 className="text-xl font-semibold text-slate-50">
                Developer Control Center
              </h1>
              <p className="text-[11px] text-slate-500 mt-1">
                Centralize notes, experiments, and action items for your
                engineering work.
              </p>
            </div>
            {error && (
              <div className="max-w-xs rounded-lg border border-rose-500/60 bg-rose-950/60 px-3 py-2 text-[11px] text-rose-100">
                {error}
              </div>
            )}
          </header>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              Connecting to backend at{" "}
              <code className="ml-1 text-slate-200">
                http://localhost:8000
              </code>
              ...
            </div>
          ) : (
            <div className="flex-1 grid grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)] gap-4">
              <div className="flex flex-col gap-4">
                <NotesList
                  notes={filteredNotes}
                  selectedNoteId={selectedNoteId}
                  onSelectNote={setSelectedNoteId}
                  onDeleteNote={handleDeleteNote}
                />
                <CategoryManager
                  categories={categories}
                  onCreateCategory={handleCreateCategory}
                />
              </div>

              <div className="flex flex-col gap-4">
                <NoteEditor
                  categories={categories}
                  selectedNote={selectedNote}
                  onCreateNote={handleCreateNote}
                  onUpdateNote={handleUpdateNote}
                  isSaving={isSaving}
                />
                <ActionItemsList notes={notes} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

