import { useState, useEffect } from 'react';
import { type Note, type Category } from '../lib/supabase';

interface NoteEditorProps {
  note: Note | null;
  categories: Category[];
  isCreating: boolean;
  onSave: (title: string, content: string, categoryId: string | null) => void;
  onCancel: () => void;
}

export default function NoteEditor({
  note,
  categories,
  isCreating,
  onSave,
  onCancel,
}: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategoryId(note.category_id || '');
    } else if (isCreating) {
      setTitle('');
      setContent('');
      setCategoryId('');
    }
  }, [note, isCreating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title, content, categoryId || null);
  };

  if (!note && !isCreating) {
    return (
      <div className="bg-slate-800 rounded-lg shadow-xl p-6 flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-slate-400">Select a note to edit or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-semibold text-slate-100 mb-4">
        {isCreating ? 'Create Note' : 'Edit Note'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter note title..."
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">
            Category
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-slate-300 mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter your note content...&#10;&#10;Tip: Lines starting with 'TODO:' or ending with '!' will be extracted as action items!"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            {isCreating ? 'Create Note' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
