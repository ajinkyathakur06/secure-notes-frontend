"use client";

import { useState } from 'react';
import NoteCard, { Note } from './NoteCard';
import NoteModal from './NoteModal';

interface NotesGridProps {
  notes: Note[];
  onTogglePin: (id: string) => void;
  onArchive: (id: string) => void;
  onUpdateNote: (updated: Note) => void;
  // now uses indices for precise insertion
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export default function NotesGrid({ notes, onTogglePin, onArchive, onUpdateNote, onReorder }: NotesGridProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [initialRect, setInitialRect] = useState<DOMRect | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [insertAfter, setInsertAfter] = useState<boolean>(false);

  const pinnedNotes = notes.filter((note) => note.isPinned);
  const otherNotes = notes.filter((note) => !note.isPinned);

  const handleOpen = (note: Note, rect?: DOMRect) => {
    setSelectedNote(note);
    setInitialRect(rect ?? null);
  };

  const handleClose = () => {
    setSelectedNote(null);
    setInitialRect(null);
  };

  const handleSave = (updated: Note) => {
    onUpdateNote(updated);
  };

  // Drag handlers
  const handleDragStart = (id: string) => setDraggedId(id);

  // compute whether we should insert after the hovered item based on mouse Y
  const handleDragOver = (id: string, e: React.DragEvent) => {
    setDragOverId(id);
    try {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const middleY = rect.top + rect.height / 2;
      setInsertAfter(e.clientY > middleY);
    } catch {
      setInsertAfter(false);
    }
  };

  const handleDrop = (targetId: string | 'END') => {
    if (!draggedId) return;
    if (targetId !== 'END' && draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const fromIndex = notes.findIndex((n) => n.id === draggedId);
    if (fromIndex === -1) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    let toIndex: number;
    if (targetId === 'END') {
      toIndex = notes.length - 1;
    } else {
      const targetIndex = notes.findIndex((n) => n.id === targetId);
      if (targetIndex === -1) {
        setDraggedId(null);
        setDragOverId(null);
        return;
      }
      toIndex = insertAfter ? targetIndex + 1 : targetIndex;
    }

    // normalize indices after removal
    let adjustedTo = toIndex;
    if (fromIndex < toIndex) adjustedTo = toIndex - 1;

    if (onReorder) onReorder(fromIndex, adjustedTo);
    setDraggedId(null);
    setDragOverId(null);
    setInsertAfter(false);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
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
              <div
                key={note.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  handleDragOver(note.id);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(note.id);
                }}
              >
                {draggedId && dragOverId === note.id && draggedId !== note.id && (
                  <div className="h-28 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50" />
                )}
                <NoteCard
                  note={note}
                  onTogglePin={onTogglePin}
                  onArchive={onArchive}
                  onOpen={handleOpen}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  isDragOver={dragOverId === note.id}
                  isDragging={draggedId === note.id}
                />
              </div>
            ))}
            {draggedId && !dragOverId && (
              <div className="h-28 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50" />
            )}
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
              <div
                key={note.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  handleDragOver(note.id);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(note.id);
                }}
              >
                {draggedId && dragOverId === note.id && draggedId !== note.id && (
                  <div className="h-28 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50" />
                )}
                <NoteCard
                  note={note}
                  onTogglePin={onTogglePin}
                  onArchive={onArchive}
                  onOpen={handleOpen}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  isDragOver={dragOverId === note.id}
                  isDragging={draggedId === note.id}
                />
              </div>
            ))}
            {draggedId && !dragOverId && (
              <div
                className="h-28 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop('END');
                }}
              />
            )}
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

      {selectedNote && (
        <NoteModal
          note={selectedNote}
          initialRect={initialRect ?? undefined}
          onClose={handleClose}
          onTogglePin={onTogglePin}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
