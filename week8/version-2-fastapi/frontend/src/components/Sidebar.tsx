import { Code2, Layers, ListTodo, Trash2 } from "lucide-react";
import type { Category } from "../types";

interface SidebarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  onDeleteCategory: (id: string) => void;
}

export function Sidebar({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onDeleteCategory,
}: SidebarProps) {
  return (
    <aside className="glass-panel w-72 flex flex-col p-5 gap-6">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-brand-soft/70 flex items-center justify-center">
          <Code2 className="h-5 w-5 text-slate-50" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Developer
          </p>
          <p className="font-semibold text-sm text-slate-50">
            Control Center
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-400 flex items-center gap-2 uppercase tracking-wide">
          <Layers className="h-3 w-3" />
          Categories
        </p>
        <nav className="space-y-1">
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition ${
              selectedCategoryId === null
                ? "bg-slate-800 text-slate-50"
                : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-100"
            }`}
          >
            <span>All Notes</span>
            <span className="text-[10px] uppercase tracking-wide">
              Overview
            </span>
          </button>

          {categories.map((category) => (
            <div
              key={category.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectCategory(category.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectCategory(category.id);
                }
              }}
              className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition cursor-pointer ${
                selectedCategoryId === category.id
                  ? "bg-slate-800 text-slate-50"
                  : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-100"
              }`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="truncate">{category.name}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCategory(category.id);
                }}
                className="ml-1 text-slate-500 hover:text-red-400 transition"
                aria-label={`Delete category ${category.name}`}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <ListTodo className="h-3 w-3" />
          <span>Use `TODO:` or `!` in notes to create action items.</span>
        </div>
      </div>
    </aside>
  );
}

