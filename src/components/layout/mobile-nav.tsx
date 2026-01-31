
'use client';

import { useState, useEffect } from 'react';
import { AuthBanner } from './auth-banner';
import { BottomNav } from './bottom-nav';

export function MobileNav() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
      <AuthBanner />
      <BottomNav />
    </div>
  );
}
