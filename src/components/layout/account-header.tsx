
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Bell } from 'lucide-react';

type AccountHeaderProps = {
  title: string;
}

export function AccountHeader({ title }: AccountHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
      <div className="h-14 flex items-center justify-between px-3">
        <Button variant="ghost" size="icon" aria-label="Back" onClick={() => router.back()} className="shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-base font-semibold truncate mx-2">{title}</h1>
        <Button variant="ghost" size="icon" aria-label="Notifications" asChild className="shrink-0">
          <Link href="/account/notifications">
            <Bell className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
