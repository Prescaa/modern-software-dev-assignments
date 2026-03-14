import { Plus, Tag } from "lucide-react";
import { useState } from "react";
import type { Category } from "../types";

interface CategoryManagerProps {
  categories: Category[];
  onCreateCategory: (payload: { name: string; color: string }) => Promise<void>;
}

const PRESET_COLORS = [
  "#6366f1",
  "#22c55e",
  "#f97316",
  "#e11d48",
  "#06b6d4",
  "#a855f7",
];

export function CategoryManager({
  categories,
  onCreateCategory,
}: CategoryManagerProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setIsSubmitting(true);
      await onCreateCategory({ name: name.trim(), color });
      setName("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="glass-panel flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-emerald-400" />
          <p className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
            Categories
          </p>
        </div>
        <p className="text-[11px] text-slate-500">
          {categories.length} configured
        </p>
      </div>
      <div className="p-3 space-y-3">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New category"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 rounded-lg bg-slate-900/80 border border-slate-800 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
            />
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="inline-flex items-center justify-center gap-1 rounded-lg bg-slate-100 text-slate-900 px-2.5 py-1.5 text-[11px] font-medium hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
          </div>
          <div className="flex items-center gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`h-4 w-4 rounded-full border border-slate-900/70 hover:scale-110 transition ${
                  color === c ? "ring-2 ring-slate-100/90" : ""
                }`}
                aria-label={`Use color ${c}`}
              />
            ))}
          </div>
        </form>
        <div className="border-t border-slate-800/80 pt-2">
          <p className="text-[11px] text-slate-500 mb-1.5">
            Existing categories
          </p>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((category) => (
              <span
                key={category.id}
                className="inline-flex items-center rounded-full bg-slate-900/80 border border-slate-800 px-2 py-0.5 text-[11px] text-slate-200 gap-1"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </span>
            ))}
            {categories.length === 0 && (
              <p className="text-[11px] text-slate-600">
                No categories yet. Create one above to organize your notes.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

