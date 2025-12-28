'use client';

import { useState } from 'react';
import { Note } from './NoteCard';

interface TrashNoteCardProps {
  note: Note;
  onRestore: (id: string) => void;
  onDeleteForever: (id: string) => void;
}

export default function TrashNoteCard({ note, onRestore, onDeleteForever }: TrashNoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative flex flex-col bg-surface-light rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all hover:border-red-200 cursor-default opacity-90 hover:opacity-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-slate-700 text-lg flex-1 pr-2 line-through decoration-slate-400">{note.title}</h4>
        </div>

        <p className="text-slate-500 text-sm line-clamp-6 mb-3">{note.content}</p>

        <div
          className={`mt-auto pt-2 flex items-center gap-2 transition-opacity ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRestore(note.id);
            }}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 hover:text-primary transition-colors"
            title="Restore"
          >
            <span className="material-symbols-outlined text-[20px]">restore_from_trash</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteForever(note.id);
            }}
            className="p-1.5 hover:bg-red-50 rounded-full text-slate-500 hover:text-red-600 transition-colors ml-auto"
            title="Delete forever"
          >
            <span className="material-symbols-outlined text-[20px]">delete_forever</span>
          </button>
        </div>
      </div>
    </div>
  );
}
