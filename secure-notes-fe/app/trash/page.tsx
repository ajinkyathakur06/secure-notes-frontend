'use client';

import { useState } from 'react';
import NotesHeader from '@/components/NotesHeader';
import MobileNav from '@/components/MobileNav';
import { Note } from '@/components/notes/NoteCard';
import TrashNoteCard from '@/components/notes/TrashNoteCard';

export default function TrashPage() {
  // Demo trash data
  const [trashNotes, setTrashNotes] = useState<Note[]>([
    {
      id: '101',
      title: 'Old Grocery List',
      content: 'Apples, Bananas, Milk, Cereal. Need to buy these before the weekend.',
      isPinned: false,
      createdAt: new Date('2024-09-10'),
      updatedAt: new Date('2024-09-12'),
    },
    {
      id: '102',
      title: 'Scrapped Project Idea',
      content: 'An app that tracks water intake. Market research showed too many competitors.',
      isPinned: false,
      createdAt: new Date('2024-08-05'),
      updatedAt: new Date('2024-08-10'),
    },
    {
      id: '103',
      title: 'Meeting Notes - Aug',
      content: 'Topics: Q3 goals, hiring plan, office renovation. Action items completed.',
      isPinned: false,
      createdAt: new Date('2024-08-15'),
      updatedAt: new Date('2024-08-15'),
    },
  ]);

  const handleRestore = (id: string) => {
    // TODO: Implement restore functionality
    console.log('Restore note:', id);
    setTrashNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleDeleteForever = (id: string) => {
    // TODO: Implement permanent delete functionality
    if (confirm('Delete this note forever? This cannot be undone.')) {
      console.log('Delete forever:', id);
      setTrashNotes((prev) => prev.filter((n) => n.id !== id));
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
            emptyState
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
