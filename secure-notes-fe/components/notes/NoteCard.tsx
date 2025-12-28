'use client';

import { useState } from 'react';
import { CollaboratorButton } from '../collab/CollaboratorButton';

export interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  isOwned?: boolean; // Added isOwned field
}

interface NoteCardProps {
  note: Note;
  onTogglePin: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (note: Note) => void;
  onOpen?: (note: Note, rect?: DOMRect) => void;
}


export default function NoteCard({ note, onTogglePin, onArchive, onDelete, onOpen }: NoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className="group relative flex flex-col bg-surface-light rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) return;
        const el = e.currentTarget as HTMLElement;
        const rect = el.getBoundingClientRect();
        if (onOpen) onOpen(note, rect);
      }}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col flex-1 pr-2">
                 <div className="flex items-center gap-2 mb-1">
                    {/* Ownership Badge */}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        note.isOwned 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-indigo-100 text-indigo-700'
                    }`}>
                        {note.isOwned ? 'Owned' : 'Shared'}
                    </span>
                 </div>
                 <h4 className="font-bold text-slate-900 text-lg">{note.title}</h4>
            </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note.id);
            }}
            className={`p-1 hover:bg-slate-100 rounded-full transition-colors ${note.isPinned ? 'text-primary' : 'text-slate-400'
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
          className={`mt-auto pt-2 flex items-center gap-1 transition-opacity ${isHovered || showMenu ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <CollaboratorButton noteId={note.id} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchive(note.id);
            }}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500"
            title="Archive"
          >
            <span className="material-symbols-outlined text-[18px]">archive</span>
          </button>
          
          <div className="relative ml-auto">
            <button
                onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
                }}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500"
                title="More options"
            >
                <span className="material-symbols-outlined text-[18px]">more_vert</span>
            </button>
            
            {showMenu && (
                <>
                <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} />
                <div className="absolute right-0 bottom-full mb-1 w-32 bg-white rounded-lg shadow-lg border border-slate-100 z-20 py-1 flex flex-col">
                     <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(note);
                            setShowMenu(false);
                        }}
                        className="text-left px-3 py-2 text-sm text-red-600 hover:bg-slate-50 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                        Delete
                    </button>
                </div>
                </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
