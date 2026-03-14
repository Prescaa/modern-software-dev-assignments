import { Trash2 } from 'lucide-react';
import { type Note } from '../lib/storage';

interface NotesListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

export default function NotesList({
  notes,
  selectedNote,
  onSelectNote,
  onDeleteNote,
}: NotesListProps) {
  if (notes.length === 0) {
    return (
      <p className="text-slate-600 text-sm text-center py-10 border border-dashed border-slate-300 rounded-xl bg-white">
        No notes yet. Create your first note!
      </p>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
      {notes.map((note) => (
        <div
          key={note.id}
          className={`group relative flex flex-col rounded-xl border cursor-pointer transition-all duration-150 ${
            selectedNote?.id === note.id
              ? 'border-blue-500 bg-white shadow-lg shadow-blue-500/10'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
          }`}
          onClick={() => onSelectNote(note)}
        >
          <div className="flex-1 flex flex-col p-3.5">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3
                className={`text-sm font-semibold line-clamp-1 ${
                  selectedNote?.id === note.id ? 'text-slate-900' : 'text-slate-900'
                }`}
              >
                {note.title}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Delete this note?')) {
                    onDeleteNote(note.id);
                  }
                }}
                className="p-1 rounded-md text-slate-500 hover:text-red-600 hover:bg-slate-100 transition-colors"
                title="Delete note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {note.category && (
              <div className="mb-2">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full text-white font-medium"
                  style={{ backgroundColor: note.category.color }}
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/80" />
                  {note.category.name}
                </span>
              </div>
            )}

            <p className="mt-1 text-xs text-slate-400 line-clamp-3">
              {note.content}
            </p>

            <p className="mt-3 text-[11px] text-slate-500">
              Last updated {new Date(note.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
