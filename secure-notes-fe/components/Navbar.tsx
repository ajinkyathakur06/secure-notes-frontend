import React from 'react';
import Link from 'next/link';

interface NavbarProps {
  showAuthLink?: boolean;
  authLinkText?: string;
  authLinkHref?: string;
  authButtonText?: string;
}

const Navbar: React.FC<NavbarProps> = () => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap px-10 py-4 lg:px-20 bg-white  shadow-sm">
      <Link href="/" className="flex items-center gap-3 text-[#111418] cursor-pointer select-none">
        <div className="size-8 text-primary">
          <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
          </svg>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Secure Notes</h2>
      </Link>

    </header>
  );
};

export default Navbar;
