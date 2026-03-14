import { useState, useEffect } from 'react';
import { supabase, type Note, type Category, type ActionItem } from '../lib/supabase';
import { extractActionItems } from '../utils/actionItemExtractor';
import NotesList from '../components/NotesList';
import NoteEditor from '../components/NoteEditor';
import ActionItemsList from '../components/ActionItemsList';
import CategoryManager from '../components/CategoryManager';
import ErrorMessage from '../components/ErrorMessage';

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([loadNotes(), loadCategories(), loadActionItems()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*, category:categories(*)')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    setNotes(data || []);
  };

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    setCategories(data || []);
  };

  const loadActionItems = async () => {
    const { data, error } = await supabase
      .from('action_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setActionItems(data || []);
  };

  const handleCreateNote = () => {
    setSelectedNote(null);
    setIsCreating(true);
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsCreating(false);
  };

  const handleSaveNote = async (title: string, content: string, categoryId: string | null) => {
    try {
      setError(null);

      if (isCreating) {
        const { data: newNote, error: insertError } = await supabase
          .from('notes')
          .insert({ title, content, category_id: categoryId })
          .select()
          .single();

        if (insertError) throw insertError;

        const extractedItems = extractActionItems(content);
        if (extractedItems.length > 0 && newNote) {
          await supabase
            .from('action_items')
            .insert(
              extractedItems.map(item => ({
                note_id: newNote.id,
                content: item,
              }))
            );
        }
      } else if (selectedNote) {
        const { error: updateError } = await supabase
          .from('notes')
          .update({ title, content, category_id: categoryId, updated_at: new Date().toISOString() })
          .eq('id', selectedNote.id);

        if (updateError) throw updateError;

        await supabase
          .from('action_items')
          .delete()
          .eq('note_id', selectedNote.id);

        const extractedItems = extractActionItems(content);
        if (extractedItems.length > 0) {
          await supabase
            .from('action_items')
            .insert(
              extractedItems.map(item => ({
                note_id: selectedNote.id,
                content: item,
              }))
            );
        }
      }

      await loadData();
      setIsCreating(false);
      setSelectedNote(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note');
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadData();
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
    }
  };

  const handleToggleActionItem = async (id: string, completed: boolean) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('action_items')
        .update({ completed })
        .eq('id', id);

      if (error) throw error;

      setActionItems(actionItems.map(item =>
        item.id === id ? { ...item, completed } : item
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update action item');
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setSelectedNote(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-slate-400 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-100 mb-2">Developer Control Center</h1>
              <p className="text-slate-400">Organize your notes and track action items</p>
            </div>
            <button
              onClick={() => setShowCategoryManager(!showCategoryManager)}
              className="px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors duration-200"
            >
              {showCategoryManager ? 'Hide Categories' : 'Manage Categories'}
            </button>
          </div>
        </header>

        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

        {showCategoryManager && (
          <CategoryManager
            categories={categories}
            onUpdate={loadCategories}
            onClose={() => setShowCategoryManager(false)}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <NotesList
              notes={notes}
              selectedNote={selectedNote}
              onSelectNote={handleSelectNote}
              onCreateNote={handleCreateNote}
              onDeleteNote={handleDeleteNote}
            />
          </div>

          <div className="lg:col-span-1">
            <NoteEditor
              note={selectedNote}
              categories={categories}
              isCreating={isCreating}
              onSave={handleSaveNote}
              onCancel={handleCancel}
            />
          </div>

          <div className="lg:col-span-1">
            <ActionItemsList
              actionItems={actionItems}
              notes={notes}
              onToggle={handleToggleActionItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
