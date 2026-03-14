import { FileText, Trash2 } from "lucide-react";
import type { Note } from "../types";

interface NotesListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export function NotesList({
  notes,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
}: NotesListProps) {
  return (
    <div className="glass-panel flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-brand" />
          <p className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
            Notes
          </p>
        </div>
        <p className="text-[11px] text-slate-500">{notes.length} items</p>
      </div>
      <div className="flex-1 overflow-y-auto scroll-thin p-2 space-y-1">
        {notes.length === 0 ? (
          <p className="text-xs text-slate-500 px-2 py-4 text-center">
            No notes yet. Create your first note on the right.
          </p>
        ) : (
          notes.map((note) => (
            <button
              key={note.id}
              type="button"
              onClick={() => onSelectNote(note.id)}
              className={`group w-full flex items-start justify-between gap-2 rounded-lg px-3 py-2 text-left transition ${
                selectedNoteId === note.id
                  ? "bg-slate-800 text-slate-50"
                  : "text-slate-200 hover:bg-slate-900/70"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{note.title}</p>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                  {note.content || "No content"}
                </p>
                {note.category && (
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 mt-2 text-[10px] font-medium text-slate-900"
                    style={{ backgroundColor: note.category.color }}
                  >
                    {note.category.name}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition"
                aria-label="Delete note"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

