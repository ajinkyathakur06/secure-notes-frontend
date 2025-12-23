'use client'

import { useState, useEffect } from 'react';
import NotesHeader from '@/components/NotesHeader';
import CreateNoteInput from '@/components/notes/CreateNoteInput';
import SortControls from '@/components/notes/SortControls';
import NotesGrid from '@/components/notes/NotesGrid';
import MobileNav from '@/components/MobileNav';
import { Note } from '@/components/notes/NoteCard';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function NotesPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/auth/login');
  //   }
  // }, [isAuthenticated, router]);

  // Demo notes data
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Project Beta Ideas',
      content:
        'Launch strategy for Q4 involves three main phases. 1. Initial user testing. 2. Feedback loop integration. 3. Full scale marketing rollout with targeted campaigns.',
      isPinned: true,
      createdAt: new Date('2024-10-15'),
      updatedAt: new Date('2024-10-20'),
    },
    {
      id: '2',
      title: 'Wifi Passwords',
      content: 'Main Office: Secured_5G_v2\nGuest: WelcomeGuest2024!',
      isPinned: true,
      createdAt: new Date('2024-10-10'),
      updatedAt: new Date('2024-10-18'),
    },
    {
      id: '3',
      title: 'Meeting notes 10/24',
      content:
        'Discussed the roadmap for Q1. John brought up the issue with the legacy API endpoints. We agreed to deprecate v1 by March.',
      isPinned: false,
      createdAt: new Date('2024-10-24'),
      updatedAt: new Date('2024-10-24'),
    },
    {
      id: '4',
      title: 'Japan Trip 2025',
      content: 'Book flights by November. Check Airbnb in Kyoto. Must visit: Fushimi Inari, Arashiyama.',
      isPinned: false,
      createdAt: new Date('2024-10-12'),
      updatedAt: new Date('2024-10-22'),
    },
    {
      id: '5',
      title: 'Shopping List',
      content: 'Milk, Eggs, Bread, Coffee beans, Avocados, Tomatoes, Chicken breast',
      isPinned: false,
      createdAt: new Date('2024-10-25'),
      updatedAt: new Date('2024-10-25'),
    },
  ]);

  const handleTogglePin = (id: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === id ? { ...note, isPinned: !note.isPinned } : note))
    );
  };

  const handleArchive = (id: string) => {
    // TODO: Implement archive functionality
    console.log('Archive note:', id);
    // For now, just remove from list
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const handleUpdateNote = (updated: Note) => {
    setNotes((prevNotes) => prevNotes.map((n) => (n.id === updated.id ? updated : n)));
  };

  return (
    <main className="flex-1 flex flex-col h-full relative overflow-hidden">
      {/* Header */}
      <NotesHeader />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 md:px-8 md:pb-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* Create Note Input */}
          <CreateNoteInput />

          {/* Sort Controls */}
          <SortControls />

          {/* Notes Grid */}
          <NotesGrid
            notes={notes}
            onTogglePin={handleTogglePin}
            onArchive={handleArchive}
            onUpdateNote={handleUpdateNote}
          />
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </main>
  );
}
