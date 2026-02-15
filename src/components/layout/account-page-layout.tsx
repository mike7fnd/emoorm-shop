'use client';

import { ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { AccountHeader } from '@/components/layout/account-header';
import { DesktopAccountSidebar } from '@/components/layout/desktop-account-sidebar';

interface AccountPageLayoutProps {
  children: ReactNode;
  title: string;
  /** Hide the mobile AccountHeader (for pages that render their own mobile header) */
  hideMobileHeader?: boolean;
  /** Show Header's search bar on desktop (default: false) */
  showSearch?: boolean;
}

/**
 * Desktop: Header + sidebar + content in a two-column grid
 * Mobile: AccountHeader + content (preserved as-is)
 */
export function AccountPageLayout({
  children,
  title,
  hideMobileHeader = false,
  showSearch = false,
}: AccountPageLayoutProps) {
  return (
    <>
      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header showSearch={showSearch} />
      </div>

      {/* Mobile Header */}
      {!hideMobileHeader && (
        <div className="md:hidden">
          <AccountHeader title={title} />
        </div>
      )}

      {/* Content */}
      <main className="pb-24 md:pb-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 md:pt-6">
          {/* Desktop: two-column with sidebar */}
          <div className="md:flex md:gap-8 lg:gap-10">
            <DesktopAccountSidebar />
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
