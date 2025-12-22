'use client';

import { useState } from 'react';

export interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface NoteCardProps {
  note: Note;
  onTogglePin: (id: string) => void;
  onArchive: (id: string) => void;
}

export default function NoteCard({ note, onTogglePin, onArchive }: NoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative flex flex-col bg-surface-light rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all hover:border-primary/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-slate-900 text-lg flex-1 pr-2">{note.title}</h4>
          <button
            onClick={() => onTogglePin(note.id)}
            className={`p-1 hover:bg-slate-100 rounded-full transition-colors ${
              note.isPinned ? 'text-primary' : 'text-slate-400'
            }`}
            title={note.isPinned ? 'Unpin' : 'Pin'}
          >
            <span className={`material-symbols-outlined text-[18px] ${note.isPinned ? 'fill-1' : ''}`}>
              push_pin
            </span>
          </button>
        </div>

        <p className="text-slate-600 text-sm line-clamp-6 mb-3">{note.content}</p>

        <div
          className={`mt-auto pt-2 flex items-center gap-2 transition-opacity ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={() => onArchive(note.id)}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500"
            title="Archive"
          >
            <span className="material-symbols-outlined text-[18px]">archive</span>
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 ml-auto" title="More options">
            <span className="material-symbols-outlined text-[18px]">more_vert</span>
          </button>
        </div>
      </div>
    </div>
  );
}
