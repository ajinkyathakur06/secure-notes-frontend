'use client';

import NoteCard, { Note } from './NoteCard';

interface NotesGridProps {
  notes: Note[];
  onTogglePin: (id: string) => void;
  onArchive: (id: string) => void;
}

export default function NotesGrid({ notes, onTogglePin, onArchive }: NotesGridProps) {
  const pinnedNotes = notes.filter((note) => note.isPinned);
  const otherNotes = notes.filter((note) => !note.isPinned);

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
                onArchive={onArchive}
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
                onArchive={onArchive}
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
    </div>
  );
}
