'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useRequestsStore } from '@/store/useRequestsStore';
import { useRouter, usePathname } from 'next/navigation';

export default function Sidebar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const requests = useRequestsStore((state) => state.requests);
  const router = useRouter();
  const pathname = usePathname();

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    const baseClass = "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors";
    const activeClass = "bg-primary/10 text-primary";
    const inactiveClass = "text-slate-600 hover:bg-slate-100 hover:text-slate-900";
    
    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  const getLabelLinkClass = (path: string) => {
    const isActive = pathname === path;
    const baseClass = "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors";
    const activeClass = "bg-primary/10 text-primary";
    const inactiveClass = "text-slate-600 hover:bg-slate-100";
    
    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  }

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-surface-light h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <span className="material-symbols-outlined text-primary text-3xl">lock</span>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">SecureNotes</h1>
          {/* <p className="text-xs text-slate-500 font-medium">v2.4.0 Encrypted</p> */}
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        <Link
          className={getLinkClass('/')}
          href="/"
        >
          <span className={`material-symbols-outlined ${pathname === '/' ? 'fill-1' : ''}`}>description</span>
          <span className="font-medium text-sm">Notes</span>
        </Link>
        <Link
          className={getLinkClass('/requests')}
          href="/requests"
        >
          <span className={`material-symbols-outlined ${pathname === '/requests' ? 'fill-1' : ''}`}>inbox</span>
          <span className="font-medium text-sm">Requests</span>
          {pendingCount > 0 && (
            <span className="ml-auto bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {pendingCount}
            </span>
          )}
        </Link>
        <Link
          className={getLinkClass('/trash')}
          href="/trash"
        >
          <span className={`material-symbols-outlined ${pathname === '/trash' ? 'fill-1' : ''}`}>delete</span>
          <span className="font-medium text-sm">Trash</span>
        </Link>

        <div className="pt-4 mt-4 border-t border-slate-100">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Labels
          </p>
          <Link
            className={getLabelLinkClass('/label/personal')}
            href="/label/personal"
          >
            <span className={`material-symbols-outlined text-[20px] ${pathname === '/label/personal' ? 'fill-1' : ''}`}>label</span>
            <span className="font-medium text-sm">Personal</span>
          </Link>
          <Link
            className={getLabelLinkClass('/label/work')}
            href="/label/work"
          >
            <span className={`material-symbols-outlined text-[20px] ${pathname === '/label/work' ? 'fill-1' : ''}`}>label</span>
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
            <span className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Loading...'}</span>
            <span className="text-xs text-slate-500 truncate">{user?.email || ''}</span>
          </div>
          <span className="material-symbols-outlined ml-auto text-slate-400">
            {showProfileMenu ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {showProfileMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden py-1 z-50">
            <Link
              href="/account"
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 text-slate-700 transition-colors"
              onClick={() => setShowProfileMenu(false)}
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="font-medium text-sm">Settings</span>
            </Link>
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
