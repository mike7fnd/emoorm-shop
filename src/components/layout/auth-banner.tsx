
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export function AuthBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const dismissed = localStorage.getItem('auth-banner-dismissed');
    // We'll assume the user is not logged in for this example.
    // In a real app, you would also check the user's authentication status.
    if (dismissed !== 'true') {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    localStorage.setItem('auth-banner-dismissed', 'true');
  };

  if (!isClient || !isVisible) {
    return null;
  }

  return (
    <div className="bg-accent text-accent-foreground p-1 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex gap-1.5 text-primary">
                <Heart className="h-4 w-4" />
                <ShoppingCart className="h-4 w-4" />
            </div>
             <p className="font-semibold text-xs">Login for a better experience</p>
          </div>
          <div className="flex items-center gap-1">
            <Button asChild size="sm" className="rounded-full h-6 text-xs px-3">
                <Link href="/account">Sign Up</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full flex-shrink-0"
              onClick={handleDismiss}
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
