import { useState } from 'react';
import {
  createCategory as addCategory,
  deleteCategory as removeCategory,
  type Category,
} from '../lib/storage';

interface CategoryManagerProps {
  categories: Category[];
  onUpdate: () => void;
  onClose: () => void;
}

export default function CategoryManager({
  categories,
  onUpdate,
}: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6');
  const [error, setError] = useState<string | null>(null);

  const colors = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b',
    '#ef4444', '#06b6d4', '#ec4899', '#14b8a6',
  ];

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      setError(null);
      addCategory(newCategoryName, newCategoryColor);
      setNewCategoryName('');
      setNewCategoryColor('#3b82f6');
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category');
    }
  };

  const handleDeleteCategory = (id: string) => {
    try {
      setError(null);
      removeCategory(id);
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  return (
    <div className="bg-white rounded-lg p-3 border border-slate-200">
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleAddCategory} className="mb-3">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Category name..."
          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
        />
        <div className="flex items-center gap-1.5 mb-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setNewCategoryColor(color)}
              className={`w-5 h-5 rounded-full transition-transform ${
                newCategoryColor === color ? 'ring-2 ring-slate-900/30 scale-110' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <button
          type="submit"
          className="w-full px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Category
        </button>
      </form>

      <div className="space-y-1 max-h-40 overflow-y-auto">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-2 bg-slate-50 rounded-md border border-slate-200"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm text-slate-800">{category.name}</span>
            </div>
            <button
              onClick={() => {
                if (confirm(`Delete "${category.name}"?`)) {
                  handleDeleteCategory(category.id);
                }
              }}
              className="text-slate-500 hover:text-red-600 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
