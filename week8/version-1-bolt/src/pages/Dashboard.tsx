import { useState, useCallback } from 'react';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote as deleteNoteFromStorage,
  getCategories,
  getActionItems,
  createActionItems,
  toggleActionItem,
  deleteActionItemsByNoteId,
  type Note,
  type Category,
  type ActionItem,
} from '../lib/storage';
import { extractActionItems } from '../utils/actionItemExtractor';
import { Plus, FolderCog, StickyNote, ListTodo } from 'lucide-react';
import NotesList from '../components/NotesList';
import NoteEditor from '../components/NoteEditor';
import ActionItemsList from '../components/ActionItemsList';
import CategoryManager from '../components/CategoryManager';
import ErrorMessage from '../components/ErrorMessage';
import Toast, { type ToastData, type ToastType } from '../components/Toast';

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>(() => getNotes());
  const [categories, setCategories] = useState<Category[]>(() => getCategories());
  const [actionItems, setActionItems] = useState<ActionItem[]>(() => getActionItems());
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const refreshData = useCallback(() => {
    setNotes(getNotes());
    setCategories(getCategories());
    setActionItems(getActionItems());
  }, []);

  const showToast = (message: string, type: ToastType) => {
    setToasts((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2),
        message,
        type,
      },
    ]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleCreateNote = () => {
    setSelectedNote(null);
    setIsCreating(true);
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsCreating(false);
  };

  const handleSaveNote = (title: string, content: string, categoryId: string | null) => {
    if (!title.trim() || !content.trim()) {
      showToast('Please provide both a title and some content for your note.', 'error');
      return;
    }

    try {
      setError(null);
      let noteId: string;

      if (isCreating) {
        const newNote = createNote(title, content, categoryId);
        noteId = newNote.id;
      } else if (selectedNote) {
        updateNote(selectedNote.id, title, content, categoryId);
        noteId = selectedNote.id;
        deleteActionItemsByNoteId(noteId);
      } else {
        return;
      }

      const extracted = extractActionItems(content);
      if (extracted.length > 0) {
        createActionItems(noteId, extracted);
      } else {
        deleteActionItemsByNoteId(noteId);
      }

      refreshData();
      setIsCreating(false);
      setSelectedNote(null);
      showToast(isCreating ? 'Note created successfully.' : 'Note updated.', 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note');
      showToast('Failed to save note.', 'error');
    }
  };

  const handleDeleteNote = (id: string) => {
    try {
      setError(null);
      deleteNoteFromStorage(id);
      refreshData();
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
      showToast('Note deleted.', 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
      showToast('Failed to delete note.', 'error');
    }
  };

  const handleToggleActionItem = (id: string, completed: boolean) => {
    try {
      setError(null);
      toggleActionItem(id, completed);
      setActionItems(getActionItems());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update action item');
      showToast('Failed to update action item.', 'error');
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setSelectedNote(null);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={handleDismissToast} />
        ))}
      </div>

      {/* Sidebar: Manage Categories */}
      <aside className="w-80 flex-shrink-0 bg-slate-100 border-r border-slate-200 flex flex-col">
        <div className="px-5 pt-5 pb-4 border-b border-slate-200 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <StickyNote className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight">Developer Notes HQ</h1>
            <p className="text-[11px] text-slate-500">Categories &amp; taxonomy</p>
          </div>
        </div>

        <div className="px-5 pt-4 pb-3 border-b border-slate-200 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-600">
          <FolderCog className="w-3.5 h-3.5" />
          <span>Manage Categories</span>
        </div>

        <div className="px-4 py-3 overflow-y-auto">
          <CategoryManager
            categories={categories}
            onUpdate={refreshData}
            onClose={() => undefined}
          />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="px-6 pt-6 pb-4 border-b border-slate-200 bg-white flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">Notes Dashboard</h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 border border-slate-200">
                {notes.length} notes
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Capture ideas, tag them with categories, and track action items in one focused workspace.
            </p>
          </div>
          <button
            onClick={handleCreateNote}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </header>

        {error && (
          <div className="px-6 pt-4">
            <ErrorMessage message={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* Content */}
        <main className="flex-1 flex overflow-hidden">
          {/* Notes grid + editor */}
          <section className="flex-1 overflow-y-auto px-6 py-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-600">
                <ListTodo className="w-3.5 h-3.5" />
                <span>Notes</span>
              </div>
            </div>

            <NotesList
              notes={notes}
              selectedNote={selectedNote}
              onSelectNote={handleSelectNote}
              onDeleteNote={handleDeleteNote}
            />

            <div className="mt-6">
              <NoteEditor
                note={selectedNote}
                categories={categories}
                isCreating={isCreating}
                onSave={handleSaveNote}
                onCancel={handleCancel}
              />
            </div>
          </section>

          {/* Action Items panel */}
          <aside className="w-80 flex-shrink-0 border-l border-slate-200 bg-white overflow-y-auto p-5">
            <ActionItemsList
              actionItems={actionItems}
              notes={notes}
              onToggle={handleToggleActionItem}
            />
          </aside>
        </main>
      </div>
    </div>
  );
}
