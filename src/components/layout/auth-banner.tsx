
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/supabase/provider';

export function AuthBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { user, isLoading } = useUser();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if banner was dismissed or user is logged in
  useEffect(() => {
    if (isClient && !isLoading) {
      // Only show banner if user is NOT logged in and not still loading
      if (!user) {
        const dismissed = localStorage.getItem('auth-banner-dismissed');
        if (dismissed !== 'true') {
          setIsVisible(true);
        }
      } else {
        // User is logged in, hide the banner
        setIsVisible(false);
      }
    }
  }, [isClient, isLoading, user]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    localStorage.setItem('auth-banner-dismissed', 'true');
  };

  // Don't render if still loading or user is logged in or not visible
  if (!isClient || isLoading || !isVisible || user) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-2 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          <p className="font-semibold text-sm">Login for full experience</p>
          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className="rounded-full h-8 text-xs px-4 bg-white text-primary hover:bg-white/90"
            >
              <Link href="/account">
                <LogIn className="h-3 w-3 mr-1" />
                Login
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white"
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
