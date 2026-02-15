'use client';

import { ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { AccountHeader } from '@/components/layout/account-header';

interface SellerPageLayoutProps {
  children: ReactNode;
  title: string;
  /** Hide the mobile AccountHeader (for pages that render their own mobile header) */
  hideMobileHeader?: boolean;
}

/**
 * Desktop: Header (with centered seller nav) + content
 * Mobile: AccountHeader + content (preserved as-is)
 */
export function SellerPageLayout({
  children,
  title,
  hideMobileHeader = false,
}: SellerPageLayoutProps) {
  return (
    <>
      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header showSearch={false} />
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
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
