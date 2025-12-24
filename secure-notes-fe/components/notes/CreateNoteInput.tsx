'use client';

import { useRef, useState } from 'react';
import NoteModal from './NoteModal';
import { Note } from './NoteCard';

interface CreateNoteInputProps {
  onCreateNote?: (note: Note) => void;
}

export default function CreateNoteInput({ onCreateNote }: CreateNoteInputProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [initialRect, setInitialRect] = useState<DOMRect | undefined>(undefined);

  const handleOpen = () => {
    const el = containerRef.current;
    if (el) setInitialRect(el.getBoundingClientRect());
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = (note: Note) => {
    // if parent provided handler, call it to add note
    if (onCreateNote) onCreateNote(note);
  };

  // create a blank note template for the modal
  const blankNote: Note = {
    id: `tmp-${Date.now()}`,
    title: '',
    content: '',
    isPinned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <div className="w-full max-w-2xl mb-8">
      <div
        ref={containerRef}
        onClick={handleOpen}
        className="relative group rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-surface-light border border-slate-200 overflow-hidden cursor-text"
      >
        <div className="flex items-center p-3">
          <input
            readOnly
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-500 font-medium cursor-text"
            placeholder="Take a note..."
            type="text"
          />
        </div>
      </div>

      {open && (
        <NoteModal
          note={blankNote}
          initialRect={initialRect}
          onClose={handleClose}
          onTogglePin={() => {}}
          onSave={(updated) => {
            // when saving a new note, if caller provided onCreateNote, give it the note with real id
            const realNote = { ...updated, id: String(Date.now()) };
            handleSave(realNote);
            handleClose();
          }}
        />
      )}
    </div>
  );
}
