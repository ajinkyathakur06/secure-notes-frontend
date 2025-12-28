"use client";

import React from "react";

interface DeleteNoteDialogProps {
  isOpen: boolean;
  isOwner: boolean;
  onClose: () => void;
  onDeleteForEveryone: () => void;
  onDeleteForMe: () => void;
}

export default function DeleteNoteDialog({
  isOpen,
  isOwner,
  onClose,
  onDeleteForEveryone,
  onDeleteForMe,
}: DeleteNoteDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 transition-opacity" 
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-lg max-w-sm w-full overflow-hidden scale-100 opacity-100 transition-all">
        <div className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Note</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            {isOwner 
              ? "Do you want to delete this note for everyone?" 
              : "Are you sure you want to delete this note?"}
          </p>
          
          <div className="flex flex-col gap-2">
            {isOwner ? (
                <>
                <button
                    onClick={() => {
                        onDeleteForEveryone();
                        onClose();
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                    Yes, Delete for Everyone
                </button>
                <button
                    onClick={() => {
                        onDeleteForMe();
                        onClose();
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                    No, Delete Only for Me
                </button>
                </>
            ) : (
                <button
                    onClick={() => {
                        onDeleteForMe(); // Just standard delete/remove for non-owners
                        onClose();
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                    Delete Note
                </button>
            )}
            
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors mt-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
