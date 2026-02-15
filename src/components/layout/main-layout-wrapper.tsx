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

  // Check if on seller path for shop nav
  const isSellerPath = pathname.startsWith('/account/my-shop');

  return (
    <>
      <div className={showNav ? isSellerPath ? "flex-1 pb-32 md:pb-0" : "flex-1 pb-32 md:pb-0" : "flex-1"}>{children}</div>
      {showNav && <MobileNav />}
    </>
  );
}
