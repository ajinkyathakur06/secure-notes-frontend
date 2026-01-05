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
import { useSocket } from '@/contexts/SocketContext';
import { useSearchStore } from '@/store/useSearchStore';

export default function NotesPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [initialRect, setInitialRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  // Notes state (initially empty or fetched)
  const [notes, setNotes] = useState<Note[]>([]);
  const { socket, isConnected } = useSocket();
  const { searchQuery, sortBy, sortOrder } = useSearchStore();

  // Filter and sort notes
  const filteredNotes = notes.filter(note => {
    const query = searchQuery.toLowerCase();
    return note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query);
  }).sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
    } else if (sortBy === 'created') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else { // modified
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Real-time dashboard updates
  useEffect(() => {
    if (!socket || !isConnected) return;

    const onDashboardUpdate = (data: { noteId: string; title: string; content: string; updatedBy: string; timestamp: string }) => {
        setNotes(prevNotes => prevNotes.map(n => {
            if (n.id === data.noteId) {
                return {
                    ...n,
                    title: data.title,
                    content: data.content,
                    updatedAt: new Date(data.timestamp)
                };
            }
            return n;
        }));
    };

    socket.on('dashboard-note-update', onDashboardUpdate);

    return () => {
        socket.off('dashboard-note-update', onDashboardUpdate);
    };
  }, [socket, isConnected]);

  // Fetch notes function
  const fetchNotes = () => {
      if (!isAuthenticated) return;
      
      API.notes.getAll()
          .then(res => {
              const ownedNotes = res.data.owned.map((n: any) => ({
                  id: n.note_id,
                  title: n.title,
                  content: n.content || '',
                  isPinned: false, // Default
                  createdAt: new Date(n.updatedAt),
                  updatedAt: new Date(n.updatedAt),
                  isOwned: true,
              }));

              const otherNotes = res.data.other.map((n: any) => ({
                  id: n.note_id,
                  title: n.title,
                  content: n.content || '',
                  isPinned: false, // Default
                  createdAt: new Date(n.updatedAt),
                  updatedAt: new Date(n.updatedAt),
                  isOwned: false,
                  permission: n.requests?.[0]?.permission || 'READ_ONLY',
              }));

              console.log('Shared Notes Debug:', res.data.other);
              console.log('Mapped Other Notes:', otherNotes);
              
              setNotes([...ownedNotes, ...otherNotes]);
          })
          .catch(err => console.error("Failed to fetch notes", err));
          
       // Also fetch requests
       useRequestsStore.getState().fetchRequests();
  };

  // Initial fetch
  useEffect(() => {
      fetchNotes();
  }, [isAuthenticated]);


  const handleCreateNote = async () => {
    try {
      const res = await API.notes.create({ title: 'Untitled', content: '' });
      const newNoteData = res.data;
      
      const newNote: Note = {
        id: newNoteData.note_id,
        title: newNoteData.title,
        content: newNoteData.content,
        isPinned: false,
        createdAt: new Date(newNoteData.createdAt || new Date()),
        updatedAt: new Date(newNoteData.updatedAt),
        isOwned: true,
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

          {/* Notes Grid */}
          <NotesGrid
            notes={filteredNotes}
            onTogglePin={handleTogglePin}
            onUpdateNote={handleUpdateNote}
            onRefresh={fetchNotes}
            onOpen={(note, rect) => {
                setInitialRect(rect ?? null);
                setSelectedNote(note);
            }}
          />
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
          onDelete={(note) => {
            // Remove from local state
            setNotes(prev => prev.filter(n => n.id !== note.id));
            setSelectedNote(null);
          }}
        />
      )}
    </main>
  );
}
