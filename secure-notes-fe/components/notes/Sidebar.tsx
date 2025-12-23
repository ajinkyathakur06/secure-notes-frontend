'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-surface-light h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <span className="material-symbols-outlined text-primary text-3xl">lock</span>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">SecureNotes</h1>
          <p className="text-xs text-slate-500 font-medium">v2.4.0 Encrypted</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        <Link
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary transition-colors"
          href="/"
        >
          <span className="material-symbols-outlined fill-1">description</span>
          <span className="font-medium text-sm">Notes</span>
        </Link>
        <Link
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          href="/requests"
        >
          <span className="material-symbols-outlined">inbox</span>
          <span className="font-medium text-sm">Requests</span>
          <span className="ml-auto bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
            3
          </span>
        </Link>
        <Link
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          href="/trash"
        >
          <span className="material-symbols-outlined">delete</span>
          <span className="font-medium text-sm">Trash</span>
        </Link>

        <div className="pt-4 mt-4 border-t border-slate-100">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Labels
          </p>
          <Link
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            href="/label/personal"
          >
            <span className="material-symbols-outlined text-[20px]">label</span>
            <span className="font-medium text-sm">Personal</span>
          </Link>
          <Link
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            href="/label/work"
          >
            <span className="material-symbols-outlined text-[20px]">label</span>
            <span className="font-medium text-sm">Work</span>
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-200 relative">
        <button 
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-100 transition-colors text-left"
        >
          <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden relative flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-500">account_circle</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-slate-900 truncate">Alex Morgan</span>
            <span className="text-xs text-slate-500 truncate">alex.m@secure.net</span>
          </div>
          <span className="material-symbols-outlined ml-auto text-slate-400">
            {showProfileMenu ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {showProfileMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden py-1 z-50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 text-red-600 transition-colors"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="font-medium text-sm">Log out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
