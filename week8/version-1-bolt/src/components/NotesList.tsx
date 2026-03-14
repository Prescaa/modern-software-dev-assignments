import { type Note } from '../lib/supabase';

interface NotesListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
}

export default function NotesList({
  notes,
  selectedNote,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
}: NotesListProps) {
  return (
    <div className="bg-slate-800 rounded-lg shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-slate-100">Notes</h2>
        <button
          onClick={onCreateNote}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          + New Note
        </button>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No notes yet. Create your first note!</p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-200 group ${
                selectedNote?.id === note.id
                  ? 'bg-blue-600 shadow-lg'
                  : 'bg-slate-700 hover:bg-slate-650'
              }`}
              onClick={() => onSelectNote(note)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium truncate ${
                    selectedNote?.id === note.id ? 'text-white' : 'text-slate-100'
                  }`}>
                    {note.title}
                  </h3>
                  {note.category && (
                    <span
                      className="inline-block mt-2 px-2 py-1 text-xs rounded-full text-white"
                      style={{ backgroundColor: note.category.color }}
                    >
                      {note.category.name}
                    </span>
                  )}
                  <p className={`text-sm mt-2 ${
                    selectedNote?.id === note.id ? 'text-blue-100' : 'text-slate-400'
                  }`}>
                    {new Date(note.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this note?')) {
                      onDeleteNote(note.id);
                    }
                  }}
                  className={`ml-2 p-2 rounded hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100 ${
                    selectedNote?.id === note.id ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
