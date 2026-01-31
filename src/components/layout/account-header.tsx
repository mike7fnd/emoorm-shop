
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

type AccountHeaderProps = {
    title: string;
}

export function AccountHeader({ title }: AccountHeaderProps) {
    const router = useRouter();

    return (
        <header className="sticky top-0 z-40 bg-background">
            <div className="h-16 flex items-center justify-between gap-4 px-4 sm:px-6 relative">
                <Button variant="ghost" size="icon" aria-label="Back" onClick={() => router.back()}>
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <div className="absolute left-1/2 -translate-x-1/2">
                    <h1 className="text-lg font-semibold">{title}</h1>
                </div>
            </div>
        </header>
    );
}
