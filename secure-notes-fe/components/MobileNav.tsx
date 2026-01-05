'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileNavProps {
  onCreateNote?: () => void;
}

export default function MobileNav({ onCreateNote }: MobileNavProps) {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    const baseClass = "flex flex-col items-center justify-center w-full h-full transition-colors";
    const activeClass = "text-primary";
    const inactiveClass = "text-slate-500 hover:bg-slate-50";

    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  return (
    <>
      {/* Mobile FAB */}
      {onCreateNote && (
        <button 
          onClick={onCreateNote}
          className="md:hidden fixed bottom-20 right-4 h-14 w-14 bg-primary text-white rounded-2xl shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors z-20"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-surface-light border-t border-slate-200 flex items-center justify-around z-30">
        <Link 
          className={getLinkClass('/')} 
          href="/"
        >
          <span className={`material-symbols-outlined mb-0.5 ${pathname === '/' ? 'fill-1' : ''}`}>description</span>
          <span className="text-[10px] font-medium">Notes</span>
        </Link>
        <Link
          className={getLinkClass('/requests')}
          href="/requests"
        >
          <span className={`material-symbols-outlined mb-0.5 ${pathname === '/requests' ? 'fill-1' : ''}`}>inbox</span>
          <span className="text-[10px] font-medium">Requests</span>
        </Link>
        <Link
          className={getLinkClass('/trash')}
          href="/trash"
        >
          <span className={`material-symbols-outlined mb-0.5 ${pathname === '/trash' ? 'fill-1' : ''}`}>delete</span>
          <span className="text-[10px] font-medium">Trash</span>
        </Link>
        <Link
          className={getLinkClass('/account')}
          href="/account"
        >
          <span className={`material-symbols-outlined mb-0.5 ${pathname === '/account' ? 'fill-1' : ''}`}>account_circle</span>
          <span className="text-[10px] font-medium">Account</span>
        </Link>
      </nav>

      {/* Gradient Overlay */}
      <div className="md:hidden fixed bottom-16 left-0 w-full h-4 bg-gradient-to-t from-background-light to-transparent pointer-events-none z-20"></div>
    </>
  );
}
