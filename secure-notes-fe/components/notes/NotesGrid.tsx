import { useState } from 'react';
import NoteCard, { Note } from './NoteCard';
import { API } from '@/services/API';
import DeleteNoteDialog from './DeleteNoteDialog';

interface NotesGridProps {
  notes: Note[];
  onTogglePin: (id: string) => void;
  onUpdateNote: (updated: Note) => void;
  onOpen: (note: Note, rect?: DOMRect) => void;
  onRefresh: () => void; // Need refresh to update list after delete
}

export default function NotesGrid({ notes, onTogglePin, onUpdateNote, onOpen, onRefresh }: NotesGridProps) {
  const pinnedNotes = notes.filter((note) => note.isPinned);
  const otherNotes = notes.filter((note) => !note.isPinned);

  // Delete State
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  const handleDeleteRequest = (note: Note) => {
    setNoteToDelete(note);
  };

  const handleConfirmDelete = async (scope: 'me' | 'all') => {
    if (!noteToDelete) return;
    try {
        await API.notes.delete(noteToDelete.id, scope);
        onRefresh(); // Refresh list from parent
    } catch (error) {
        console.error("Failed to delete note", error);
        alert("Failed to delete note");
    } finally {
        setNoteToDelete(null);
    }
  };

  return (
    <div className="w-full">
      {/* Pinned Notes Section */}
      {pinnedNotes.length > 0 && (
        <div className="w-full mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">
            Pinned
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onTogglePin={onTogglePin}

                onDelete={handleDeleteRequest}
                onOpen={onOpen}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Notes Section */}
      {otherNotes.length > 0 && (
        <div className="w-full">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">
            Others
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {otherNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onTogglePin={onTogglePin}

                onDelete={handleDeleteRequest}
                onOpen={onOpen}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {notes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="material-symbols-outlined text-slate-300 text-6xl mb-4">description</span>
          <h3 className="text-lg font-semibold text-slate-600 mb-2">No notes yet</h3>
          <p className="text-sm text-slate-500">Click "Take a note..." above to get started</p>
        </div>
      )}

      {/* Delete Dialog */}
      <DeleteNoteDialog 
        isOpen={!!noteToDelete}
        isOwner={!!noteToDelete?.isOwned}
        onClose={() => setNoteToDelete(null)}
        onDeleteForEveryone={() => handleConfirmDelete('all')}
        onDeleteForMe={() => handleConfirmDelete('me')}
      />

    </div>
  );
}
