"use client";

import { useEffect, useRef, useState } from "react";
import { Note } from "./NoteCard";
import { API } from "@/services/API";
import { useCollaboratorStore } from "@/store/useCollaboratorStore";
import mammoth from 'mammoth';

interface NoteModalProps {
  note: Note;
  initialRect?: DOMRect;
  onClose: () => void;
  onTogglePin: (id: string) => void;
  onSave: (updated: Note) => void;
  onDelete: (note: Note) => void;
}

export default function NoteModal({ note, initialRect, onClose, onTogglePin, onSave, onDelete }: NoteModalProps) {
  // Determine if user has edit permission (owner or EDIT permission)
  const canEdit = note.isOwned || note.permission === 'EDIT';
  
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

  const openPanel = useCollaboratorStore(state => state.openPanel);

  // Configure PDF.js worker (only on client side)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('pdfjs-dist').then((pdfjsLib) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      });
    }
  }, []);

  // Helper: Extract text from file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let extractedText = '';

      if (file.type === 'application/pdf') {
        // Extract from PDF - use dynamic import
        const pdfjsLib = await import('pdfjs-dist');
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;
        
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          extractedText += pageText + '\n';
        }
      } else if (file.type === 'text/plain') {
        // Extract from TXT
        extractedText = await file.text();
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                 file.name.endsWith('.docx')) {
        // Extract from DOCX
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
      } else if (file.name.endsWith('.doc')) {
        alert('Legacy .doc files are not supported. Please convert to .docx or use .txt/.pdf');
        return;
      } else {
        alert('Unsupported file type. Please use PDF, TXT, or DOCX files.');
        return;
      }

      // Append extracted text to content
      setContent(prev => prev + '\n\n' + extractedText);
      alert('Text extracted successfully!');
    } catch (error) {
      console.error('Error extracting text:', error);
      alert('Failed to extract text from file');
    }

    // Reset file input
    e.target.value = '';
  };

  // Helper: Download as TXT
  const handleDownloadTxt = () => {
    const txtContent = `${title}\n\n${content}`;
    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'note'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper: Delete note
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this note?')) {
      onDelete(note);
      handleClose();
    }
  };

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
            onChange={(e) => canEdit && setTitle(e.target.value)}
            className="flex-1 bg-transparent text-2xl font-bold outline-none"
            placeholder="Title"
            disabled={!canEdit}
            style={{ cursor: canEdit ? 'text' : 'default' }}
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
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => canEdit && setContent(e.target.value)}
              className="w-full h-full min-h-[300px] resize-none bg-transparent text-slate-700 text-base outline-none"
              placeholder={canEdit ? "Take a note..." : "Read-only note"}
              disabled={!canEdit}
              style={{ cursor: canEdit ? 'text' : 'default' }}
            />
          </div>
        </div>

        <footer className="p-4 border-t border-slate-200 flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-500">
            {/* Add Collaborators - All users can view, only owners can add */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openPanel(note.id);
              }}
              className="p-2 rounded hover:bg-slate-100"
              title="View collaborators"
            >
              <span className="material-symbols-outlined">person_add</span>
            </button>

            {/* Extract Text from File - Edit permission required */}
            {canEdit && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.docx"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded hover:bg-slate-100"
                  title="Extract text from file (PDF, TXT, DOCX)"
                >
                  <span className="material-symbols-outlined">upload_file</span>
                </button>
              </>
            )}

            {/* Download as TXT - Available to all */}
            <button
              onClick={handleDownloadTxt}
              className="p-2 rounded hover:bg-slate-100"
              title="Download as .txt"
            >
              <span className="material-symbols-outlined">download</span>
            </button>

            {/* Delete - Owner only */}
            {note.isOwned && (
              <button
                onClick={handleDelete}
                className="p-2 rounded hover:bg-slate-100 text-red-500 hover:text-red-700"
                title="Delete note"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            )}
          </div>

          <div className="ml-auto flex items-center gap-4 text-sm text-slate-500">
            <span>Edited {note.updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            {canEdit && <button onClick={handleSave} className="text-primary font-semibold">Save</button>}
            <button onClick={handleClose} className="text-slate-600">Close</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
