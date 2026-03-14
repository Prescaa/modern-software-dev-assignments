import { useEffect, useState } from "react";
import { Loader2, Save, Sparkles } from "lucide-react";
import type { Category, Note } from "../types";
import { extractActionItemsFromText } from "../lib/actionItems";

interface NoteEditorProps {
  categories: Category[];
  selectedNote: Note | null;
  onCreateNote: (payload: {
    title: string;
    content: string;
    category_id: string | null;
  }) => Promise<boolean>;
  onUpdateNote: (
    id: string,
    payload: {
      title: string;
      content: string;
      category_id: string | null;
    }
  ) => Promise<boolean>;
  isSaving: boolean;
}

export function NoteEditor({
  categories,
  selectedNote,
  onCreateNote,
  onUpdateNote,
  isSaving,
}: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
      setCategoryId(selectedNote.category_id);
    } else {
      setTitle("");
      setContent("");
      setCategoryId(null);
    }
  }, [selectedNote]);

  const actionItemsPreview = extractActionItemsFromText(content);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      title: title.trim() || "Untitled note",
      content: content.trim(),
      category_id: categoryId,
    };

    const ok = selectedNote
      ? await onUpdateNote(selectedNote.id, payload)
      : await onCreateNote(payload);

    if (ok) {
      // Clear form after a successful create or update
      setTitle("");
      setContent("");
      setCategoryId(null);
    }
  }

  return (
    <div className="glass-panel flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
            {selectedNote ? "Edit Note" : "New Note"}
          </p>
          <p className="text-[11px] text-slate-500">
            Capture ideas, experiments, and tasks.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setTitle("");
            setContent("");
            setCategoryId(null);
          }}
          className="text-[11px] text-slate-400 hover:text-slate-100 transition"
        >
          Reset
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-3 p-4">
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg bg-slate-900/80 border border-slate-800 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
        />

        <div className="flex gap-2">
          <select
            value={categoryId ?? ""}
            onChange={(e) =>
              setCategoryId(e.target.value === "" ? null : e.target.value)
            }
            className="w-40 rounded-lg bg-slate-900/80 border border-slate-800 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="flex-1 text-[11px] text-slate-500 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-brand" />
            <span>
              Lines starting with <code className="text-xs">TODO:</code> or
              ending with <code className="text-xs">!</code> become action
              items.
            </span>
          </div>
        </div>

        <textarea
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 min-h-[160px] resize-none rounded-lg bg-slate-900/80 border border-slate-800 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand scroll-thin"
        />

        {actionItemsPreview.length > 0 && (
          <div className="rounded-lg bg-slate-900/70 border border-slate-800 px-3 py-2">
            <p className="text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-brand" />
              Live action items preview
            </p>
            <ul className="space-y-0.5 text-[11px] text-slate-300">
              {actionItemsPreview.map((item, idx) => (
                <li key={`${item}-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-slate-50 shadow-subtle hover:bg-brand-soft focus:outline-none focus:ring-2 focus:ring-brand/70 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-3 w-3" />
                {selectedNote ? "Update Note" : "Create Note"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

