'use client';

import { usePathname } from 'next/navigation';
import { MobileNav } from './mobile-nav';
import { ReactNode } from 'react';

// The paths where the bottom navigation should be visible.
const mainNavPaths = ['/', '/wishlist', '/cart'];

export function MainLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Show nav if the current path is one of the exact main paths,
  // or if it's the account page or one of its sub-pages.
  const showNav = mainNavPaths.includes(pathname) || pathname.startsWith('/account');

  return (
    <>
      <div className={showNav ? "flex-1 pb-28 md:pb-0" : "flex-1"}>{children}</div>
      {showNav && <MobileNav />}
    </>
  );
}
