"use client"

import { useState, useEffect } from 'react';
import NotesHeader from '@/components/NotesHeader';
import CreateNoteInput from '@/components/notes/CreateNoteInput';
import SortControls from '@/components/notes/SortControls';
import NotesGrid from '@/components/notes/NotesGrid';
import MobileNav from '@/components/MobileNav';
import NoteModal from '@/components/notes/NoteModal';
import { Note } from '@/components/notes/NoteCard';
import { useAuthStore } from '@/store/useAuthStore';
import { useRequestsStore } from '@/store/useRequestsStore';
import { useRouter } from 'next/navigation';
import { API } from '@/services/API';

export default function NotesPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [initialRect, setInitialRect] = useState<DOMRect | null>(null);

  // TEMPORARILY DISABLED FOR UI TESTING - UNCOMMENT BEFORE PRODUCTION
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  // Notes state (will be fetched from backend)
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notes and requests on mount
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      // Fetch both owned and shared notes
      Promise.all([
        API.notes.getOwned(),
        API.notes.getShared()
      ])
        .then(([ownedRes, sharedRes]) => {
          const ownedNotes = ownedRes.data.map((n: any) => ({
            id: n.note_id,
            title: n.title,
            content: n.content || '',
            isPinned: false,
            createdAt: new Date(n.updatedAt),
            updatedAt: new Date(n.updatedAt),
          }));

          const sharedNotes = sharedRes.data.map((n: any) => ({
            id: n.note_id,
            title: n.title,
            content: n.content || '',
            isPinned: false,
            createdAt: new Date(n.updatedAt),
            updatedAt: new Date(n.updatedAt),
          }));

          setNotes([...ownedNotes, ...sharedNotes]);
        })
        .catch(err => console.error("Failed to fetch notes", err))
        .finally(() => setIsLoading(false));

      // Fetch shared requests
      useRequestsStore.getState().fetchRequests();
    }
  }, [isAuthenticated]);


  const handleCreateNote = async () => {
    try {
      const res = await API.notes.create({ title: 'Untitled', content: ' ' });
      const newNoteData = res.data;

      const newNote: Note = {
        id: newNoteData.note_id,
        title: newNoteData.title,
        content: newNoteData.content,
        isPinned: false,
        createdAt: new Date(newNoteData.createdAt),
        updatedAt: new Date(newNoteData.updatedAt),
      };

      setNotes(prev => [newNote, ...prev]);
      setInitialRect(null); // No animation rect for new note creation
      setSelectedNote(newNote);

    } catch (error) {
      console.error("Failed to create note", error);
    }
  };

  const handleTogglePin = (id: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === id ? { ...note, isPinned: !note.isPinned } : note))
    );
  };

  const handleArchive = (id: string) => {
    console.log('Archive note:', id);
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const handleUpdateNote = async (updated: Note) => {
    // Optimistic update
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
          <CreateNoteInput onClick={handleCreateNote} />

          {/* Sort Controls */}
          <SortControls />

          {/* Loading Skeleton */}
          {isLoading ? (
            <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg border border-gray-200 p-4 h-40 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : (
            /* Notes Grid */
            <NotesGrid
              notes={notes}
              onTogglePin={handleTogglePin}
              onArchive={handleArchive}
              onUpdateNote={handleUpdateNote}
              onOpen={(note, rect) => {
                setInitialRect(rect ?? null);
                setSelectedNote(note);
              }}
            />
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Note Modal */}
      {selectedNote && (
        <NoteModal
          note={selectedNote}
          initialRect={initialRect ?? undefined}
          onClose={() => {
            setSelectedNote(null);
            setInitialRect(null);
          }}
          onTogglePin={handleTogglePin}
          onSave={handleUpdateNote}
        />
      )}
    </main>
  );
}
