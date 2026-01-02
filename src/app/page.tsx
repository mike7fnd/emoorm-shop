
'use client';

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/layout/header';
import { HomeContent } from './home-content';


function HomePageSkeleton() {
    return (
        <>
            <Header showSearch={false} />
            <main className="flex-1">
                <Skeleton className="h-[18vh] md:h-[20vh] w-full" />
                <div className="p-4 md:p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
                        {[...Array(10)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="aspect-square rounded-[15px]" />
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-5 w-1/4" />
                        </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
}

export default function Home() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
