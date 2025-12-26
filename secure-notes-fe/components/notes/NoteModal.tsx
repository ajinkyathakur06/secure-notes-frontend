"use client";

import { useEffect, useRef, useState } from "react";
import { Note } from "./NoteCard";
import { API } from "@/services/API";
import { CollaboratorButton } from "../collab/CollaboratorButton";

interface NoteModalProps {
  note: Note;
  initialRect?: DOMRect;
  onClose: () => void;
  onTogglePin: (id: string) => void;
  onSave: (updated: Note) => void;
}

export default function NoteModal({ note, initialRect, onClose, onTogglePin, onSave }: NoteModalProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [mounted, setMounted] = useState(false);
  const [animatingBack, setAnimatingBack] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-save logic
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only save if changes detected and title/content are not strictly equal to initial prop (though local state is what matters for "latest")
      // We can just save whatever is current state after delay
      if (title !== note.title || content !== note.content) {
        console.log("Auto-saving...");
        const updatedNote = { ...note, title, content, updatedAt: new Date() };

        // Call API
        API.notes.update(note.id, { title, content })
          .then(() => {
            console.log("Auto-save successful");
            onSave(updatedNote); // Update parent state
          })
          .catch(err => console.error("Auto-save failed", err));
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, content, note, onSave]);

  // attachments (file upload)
  const [attachments, setAttachments] = useState<File[]>([]);

  // format menu
  const [showFormatMenu, setShowFormatMenu] = useState(false);

  // inline style for the panel to animate from card rect
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties | undefined>(() => {
    if (!initialRect) return undefined;
    return {
      position: 'fixed',
      left: initialRect.left,
      top: initialRect.top,
      width: initialRect.width,
      height: initialRect.height,
      transform: 'none',
      borderRadius: 12,
      transition: 'all 240ms cubic-bezier(0.2,0.8,0.2,1)'
    } as React.CSSProperties;
  });

  useEffect(() => {
    // trigger mount animations
    setMounted(true);

    if (initialRect) {
      // allow a tick then expand to center
      requestAnimationFrame(() => {
        setPanelStyle({
          position: 'fixed',
          left: '50%',
          top: '50%',
          width: 'min(90vw, 960px)',
          height: '85vh',
          transform: 'translate(-50%, -50%)',
          borderRadius: 12,
          transition: 'all 240ms cubic-bezier(0.2,0.8,0.2,1)'
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = () => {
    // Manual save also calls API via onSave if parent implements it, but here parent just updates state
    // We should ensure API is called. Since we have auto-save, this might just be "Close" or "Force Save"
    // Let's force an immediate API call to be safe before closing
    const updatedNote = { ...note, title, content, updatedAt: new Date() };
    API.notes.update(note.id, { title, content })
      .then(() => {
        onSave(updatedNote);
        handleClose();
      })
      .catch(err => {
        console.error("Save failed", err);
        handleClose(); // Close anyway?
      });
  };

  // Formatting helpers: wrap selected text in textarea
  const wrapSelection = (before: string, after?: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = content.slice(start, end);
    const wrapAfter = after ?? before;
    const newContent = content.slice(0, start) + before + sel + wrapAfter + content.slice(end);
    setContent(newContent);
    // restore selection
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = start + before.length;
      ta.selectionEnd = start + before.length + sel.length;
    });
  };

  const handleFormat = (type: 'bold' | 'italic' | 'code') => {
    setShowFormatMenu(false);
    if (type === 'bold') wrapSelection('**');
    if (type === 'italic') wrapSelection('*');
    if (type === 'code') wrapSelection('`');
  };


  const handleClose = () => {
    if (initialRect && panelRef.current) {
      // animate back to the initial rect then close
      setAnimatingBack(true);
      setPanelStyle({
        position: 'fixed',
        left: initialRect.left,
        top: initialRect.top,
        width: initialRect.width,
        height: initialRect.height,
        transform: 'none',
        borderRadius: 12,
        transition: 'all 200ms cubic-bezier(0.2,0.8,0.2,1)'
      });

      // wait for animation to finish
      setTimeout(() => {
        onClose();
      }, 220);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${mounted && !animatingBack ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      <div
        ref={panelRef}
        style={panelStyle}
        className={`relative bg-surface-light rounded-xl shadow-lg overflow-hidden flex flex-col ${!panelStyle ? 'w-full max-w-4xl h-[85vh]' : ''}`}
      >
        <header className="p-6 flex items-start">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 bg-transparent text-2xl font-bold outline-none"
            placeholder="Title"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note.id);
            }}
            className={`ml-4 p-2 rounded-full hover:bg-slate-100 text-slate-600`}
            title={note.isPinned ? 'Unpin' : 'Pin'}
          >
            <span className="material-symbols-outlined">push_pin</span>
          </button>
        </header>

        <div className="px-6 pb-6 flex-1 overflow-auto">
          <div className="mb-3">
            {attachments.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-2">
                {attachments.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/60 border border-slate-200 rounded px-2 py-1 text-sm">
                    <span className="text-slate-700 max-w-[180px] truncate">{f.name}</span>
                    <button onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-slate-600">×</button>
                  </div>
                ))}
              </div>
            )}

            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full min-h-[300px] resize-none bg-transparent text-slate-700 text-base outline-none"
              placeholder="Take a note..."
            />
          </div>
        </div>

        <footer className="p-4 border-t border-slate-200 flex items-center gap-3">
          <div className="relative flex items-center gap-2 text-slate-500">
            <div className="relative">
              <button
                onClick={() => setShowFormatMenu((s) => !s)}
                className="p-2 rounded hover:bg-slate-100"
                title="Format"
              >
                <span className="material-symbols-outlined">format_align_left</span>
              </button>
              {showFormatMenu && (
                <div className="absolute left-0 mt-2 w-40 bg-white border rounded shadow p-2 z-30">
                  <button onClick={() => handleFormat('bold')} className="w-full text-left px-2 py-1 hover:bg-slate-50">Bold</button>
                  <button onClick={() => handleFormat('italic')} className="w-full text-left px-2 py-1 hover:bg-slate-50">Italic</button>
                  <button onClick={() => handleFormat('code')} className="w-full text-left px-2 py-1 hover:bg-slate-50">Inline code</button>
                </div>
              )}
            </div>

            {/* Color and lock buttons removed per request */}


            <CollaboratorButton noteId={note.id} />


            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => {
              const files = e.target.files;
              if (!files) return;
              setAttachments((prev) => [...prev, ...Array.from(files)]);
              e.currentTarget.value = '';
            }} />
            <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded hover:bg-slate-100" title="Attach file">
              <span className="material-symbols-outlined">attach_file</span>
            </button>
          </div>

          <div className="ml-auto flex items-center gap-4 text-sm text-slate-500">
            <span>Edited {note.updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <button onClick={handleSave} className="text-primary font-semibold">Save</button>
            <button onClick={handleClose} className="text-slate-600">Close</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
