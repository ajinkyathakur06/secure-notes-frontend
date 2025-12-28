'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { CollaboratorPanel } from '@/components/collab/CollaboratorPanel';
import { SocketProvider } from '@/contexts/SocketContext';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRestrictedPage = pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup');

  if (isRestrictedPage) {
    return <>{children}</>;
  }

  return (
    <SocketProvider>
      <div className="bg-background-light text-slate-900 h-screen flex overflow-hidden font-display transition-colors duration-200">
        <Sidebar />
        <CollaboratorPanel />
        {children}
      </div>
    </SocketProvider>
  );
}
