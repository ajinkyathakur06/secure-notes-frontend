'use client';

interface CreateNoteInputProps {
  onClick?: () => void;
}

export default function CreateNoteInput({ onClick }: CreateNoteInputProps) {
  return (
    <div className="w-full max-w-2xl mb-8" onClick={onClick}>
      <div className="relative group rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-surface-light border border-slate-200 overflow-hidden cursor-text">
        <div className="flex items-center p-3">
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-500 font-medium"
            placeholder="Take a note..."
            type="text"
            readOnly // Make readOnly to prevent typing before click triggers creation (optional, but ensures click is handled first)
          />
        </div>
      </div>
    </div>
  );
}
