import { type ActionItem, type Note } from '../lib/supabase';

interface ActionItemsListProps {
  actionItems: ActionItem[];
  notes: Note[];
  onToggle: (id: string, completed: boolean) => void;
}

export default function ActionItemsList({
  actionItems,
  notes,
  onToggle,
}: ActionItemsListProps) {
  const getNoteTitle = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    return note?.title || 'Unknown Note';
  };

  const pendingItems = actionItems.filter((item) => !item.completed);
  const completedItems = actionItems.filter((item) => item.completed);

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-semibold text-slate-100 mb-4">Action Items</h2>

      <div className="space-y-6 max-h-[600px] overflow-y-auto">
        {actionItems.length === 0 ? (
          <p className="text-slate-400 text-center py-8">
            No action items yet. Add lines starting with "TODO:" or ending with "!" in your notes!
          </p>
        ) : (
          <>
            {pendingItems.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wide">
                  Pending ({pendingItems.length})
                </h3>
                <div className="space-y-2">
                  {pendingItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-700 rounded-lg hover:bg-slate-650 transition-colors duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={(e) => onToggle(item.id, e.target.checked)}
                          className="mt-1 w-5 h-5 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-100">{item.content}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            From: {getNoteTitle(item.note_id)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {completedItems.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wide">
                  Completed ({completedItems.length})
                </h3>
                <div className="space-y-2">
                  {completedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-700 rounded-lg hover:bg-slate-650 transition-colors duration-200 opacity-60"
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={(e) => onToggle(item.id, e.target.checked)}
                          className="mt-1 w-5 h-5 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-400 line-through">{item.content}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            From: {getNoteTitle(item.note_id)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
