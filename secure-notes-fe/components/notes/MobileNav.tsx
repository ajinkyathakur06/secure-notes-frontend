'use client';

import Link from 'next/link';

export default function MobileNav() {
  return (
    <>
      {/* Mobile FAB */}
      <button className="md:hidden fixed bottom-20 right-4 h-14 w-14 bg-primary text-white rounded-2xl shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors z-20">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-surface-light border-t border-slate-200 flex items-center justify-around z-30">
        <Link className="flex flex-col items-center justify-center w-full h-full text-primary" href="/">
          <span className="material-symbols-outlined fill-1 mb-0.5">description</span>
          <span className="text-[10px] font-medium">Notes</span>
        </Link>
        <Link
          className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:bg-slate-50"
          href="/requests"
        >
          <span className="material-symbols-outlined mb-0.5">inbox</span>
          <span className="text-[10px] font-medium">Requests</span>
        </Link>
        <Link
          className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:bg-slate-50"
          href="/trash"
        >
          <span className="material-symbols-outlined mb-0.5">delete</span>
          <span className="text-[10px] font-medium">Trash</span>
        </Link>
        <Link
          className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:bg-slate-50"
          href="/account"
        >
          <span className="material-symbols-outlined mb-0.5">account_circle</span>
          <span className="text-[10px] font-medium">Account</span>
        </Link>
      </nav>

      {/* Gradient Overlay */}
      <div className="md:hidden fixed bottom-16 left-0 w-full h-4 bg-gradient-to-t from-background-light to-transparent pointer-events-none z-20"></div>
    </>
  );
}
