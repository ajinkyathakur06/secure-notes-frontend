'use client';

import Link from 'next/link';

export default function NotesHeader() {
  return (
    <header className="flex items-center justify-between px-4 py-4 md:px-8 md:py-6 bg-background-light z-10">
      <div className="md:hidden mr-3">
         <Link href="/" className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
         </Link>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full">
        <label className="relative group flex items-center h-12 w-full shadow-sm focus-within:shadow-md transition-shadow rounded-lg bg-surface-light border border-slate-200">
          <div className="absolute left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400">search</span>
          </div>
          <input
            className="w-full h-full bg-transparent border-none text-slate-900 placeholder:text-slate-500 focus:ring-0 pl-12 pr-4 rounded-lg text-base"
            placeholder="Search your secure notes..."
            type="text"
          />
          <div className="absolute right-2 flex items-center gap-1">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </button>
          </div>
        </label>
      </div>

      <div className="hidden md:flex items-center gap-2 ml-4">
        <button
          className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-200 transition-colors"
          title="Grid View"
        >
          <span className="material-symbols-outlined">grid_view</span>
        </button>
        <Link
          href="/account"
          className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-200 transition-colors flex items-center justify-center"
          title="Settings"
        >
          <span className="material-symbols-outlined">settings</span>
        </Link>
      </div>

      {/* <button className="md:hidden p-1 ml-2 rounded-full border border-slate-200">
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
          <span className="material-symbols-outlined text-slate-500 text-[20px]">account_circle</span>
        </div>
      </button> */}
    </header>
  );
}
