'use client';

import { usePathname, useNavigation } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Loader from '@/components/Loader';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRestrictedPage = pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup');
  // `useNavigation` may not exist in older Next versions. Call it safely.
  const navigation = typeof useNavigation === 'function' ? useNavigation() : null;
  const isRouting = navigation?.state === 'loading';

  if (isRestrictedPage) {
    return <>{children}</>;
  }

  return (
    <div className="bg-background-light text-slate-900 h-screen flex overflow-hidden font-display transition-colors duration-200">
      <Sidebar />
      {children}
      {isRouting && <Loader fullScreen />}
    </div>
  );
}
