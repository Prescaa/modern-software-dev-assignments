import { AlertCircle } from "lucide-react";
import type { Note } from "../types";
import { extractActionItemsFromText } from "../lib/actionItems";

interface ActionItemsListProps {
  notes: Note[];
}

export function ActionItemsList({ notes }: ActionItemsListProps) {
  const items = notes.flatMap((note) =>
    extractActionItemsFromText(note.content).map((content) => ({
      noteId: note.id,
      noteTitle: note.title,
      content,
    }))
  );

  return (
    <div className="glass-panel flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-400" />
          <p className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
            Action Items
          </p>
        </div>
        <p className="text-[11px] text-slate-500">
          {items.length} open
        </p>
      </div>
      <div className="flex-1 overflow-y-auto scroll-thin p-3 space-y-2">
        {items.length === 0 ? (
          <p className="text-xs text-slate-500">
            No action items found. Add lines beginning with{" "}
            <code className="text-[11px] text-slate-300">TODO:</code> or ending
            with <code className="text-[11px] text-slate-300">!</code> in your
            notes.
          </p>
        ) : (
          items.map((item, idx) => (
            <div
              key={`${item.noteId}-${idx}`}
              className="rounded-lg bg-slate-900/70 border border-slate-800 px-3 py-2 text-[11px]"
            >
              <p className="font-medium text-slate-200 mb-0.5">
                {item.content}
              </p>
              <p className="text-slate-500">
                from <span className="text-slate-300">{item.noteTitle}</span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

