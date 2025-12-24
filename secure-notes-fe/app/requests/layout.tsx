import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';

interface RequestsLayoutProps {
  children: ReactNode;
}

export default function RequestsLayout({ children }: RequestsLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}
