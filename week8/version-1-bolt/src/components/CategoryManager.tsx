import { useState } from 'react';
import { supabase, type Category } from '../lib/supabase';

interface CategoryManagerProps {
  categories: Category[];
  onUpdate: () => void;
  onClose: () => void;
}

export default function CategoryManager({
  categories,
  onUpdate,
  onClose,
}: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6');
  const [error, setError] = useState<string | null>(null);

  const colors = [
    '#3b82f6',
    '#8b5cf6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#06b6d4',
    '#ec4899',
    '#14b8a6',
  ];

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setError(null);
      const { error: insertError } = await supabase
        .from('categories')
        .insert({ name: newCategoryName, color: newCategoryColor });

      if (insertError) throw insertError;

      setNewCategoryName('');
      setNewCategoryColor('#3b82f6');
      await onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-slate-100">Manage Categories</h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleAddCategory} className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name..."
            className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setNewCategoryColor(color)}
                className={`w-8 h-8 rounded-full transition-transform duration-200 ${
                  newCategoryColor === color ? 'ring-2 ring-white scale-110' : ''
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Add
          </button>
        </div>
      </form>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-3 bg-slate-700 rounded-lg group"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-slate-100">{category.name}</span>
            </div>
            <button
              onClick={() => {
                if (confirm(`Delete category "${category.name}"?`)) {
                  handleDeleteCategory(category.id);
                }
              }}
              className="text-slate-400 hover:text-red-400 transition-colors duration-200 opacity-0 group-hover:opacity-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
