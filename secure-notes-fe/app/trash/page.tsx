'use client';

import { useEffect, useState } from 'react';
import NotesHeader from '@/components/NotesHeader';
import MobileNav from '@/components/MobileNav';
import { Note } from '@/components/notes/NoteCard';
import TrashNoteCard from '@/components/notes/TrashNoteCard';
import { API } from '@/services/API';

export default function TrashPage() {
  const [trashNotes, setTrashNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrash();
  }, []);

  const fetchTrash = async () => {
    setIsLoading(true);
    try {
      const res = await API.notes.getTrash();
      // Map response to Note interface. Note that getTrash returns { note: { ... }, deletedAt: ... }
      const mapped = res.data.map((item: any) => ({
        id: item.note.note_id,
        title: item.note.title,
        content: item.note.content || '',
        isPinned: false,
        createdAt: new Date(item.note.updatedAt),
        updatedAt: new Date(item.note.updatedAt),
      }));
      setTrashNotes(mapped);
    } catch (err) {
      console.error("Failed to fetch trash", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await API.notes.restore(id);
      setTrashNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to restore note", err);
    }
  };

  const handleDeleteForever = async (id: string) => {
    if (confirm('Delete this note forever? This cannot be undone.')) {
      try {
        await API.notes.delete(id, 'all');
        setTrashNotes((prev) => prev.filter((n) => n.id !== id));
      } catch (err) {
        console.error("Failed to delete note forever", err);
      }
    }
  };

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="bg-slate-100 p-4 rounded-full mb-4">
        <span className="material-symbols-outlined text-slate-400 text-4xl">delete</span>
      </div>
      <h3 className="text-lg font-semibold text-slate-600 mb-2">Trash is empty</h3>
      <p className="text-sm text-slate-500 max-w-xs">
        Notes you move to trash will appear here. They are automatically deleted after 7 days.
      </p>
    </div>
  );

  return (
    <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-light">
      {/* Header */}
      <NotesHeader />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 md:px-8 md:pb-8">
        <div className="max-w-7xl mx-auto flex flex-col">
          
          {/* Trash Banner */}
          <div className="w-full flex items-center justify-center py-3 px-4 mb-6 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg border border-slate-200">
            <span className="material-symbols-outlined text-lg mr-2">info</span>
            Notes in Trash are deleted after 7 days
          </div>

          {!trashNotes.length ? (
            isLoading ? (
              <div className="flex justify-center py-24">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : emptyState
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {trashNotes.map((note) => (
                <TrashNoteCard
                  key={note.id}
                  note={note}
                  onRestore={handleRestore}
                  onDeleteForever={handleDeleteForever}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </main>
  );
}
