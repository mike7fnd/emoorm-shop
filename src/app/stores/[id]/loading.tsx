

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Share2, Heart, Expand } from 'lucide-react';

export default function StoreDetailLoading() {
  return (
    <>
      <header className="bg-background">
        <div className="h-16 flex items-center justify-between gap-4 px-4 sm:px-6 relative">
            <Button variant="ghost" size="icon" aria-label="Back">
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" aria-label="Share">
                    <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Favorite">
                    <Heart className="h-5 w-5" />
                </Button>
            </div>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-0">
        {/* Store Info Card Skeleton */}
        <div className="relative">
            <Skeleton className="h-48 md:h-64 w-full rounded-[30px]" />
            <div className="relative mx-auto -mt-20 max-w-md rounded-[30px] bg-card shadow-xl p-6">
                <div className="flex flex-col items-center text-center">
                    <Skeleton className="h-7 w-48 mb-2" />
                    <Skeleton className="h-4 w-32 mb-6" />

                     <div className="flex justify-around items-center w-full my-6">
                        <div className="flex flex-col items-center gap-1">
                            <Skeleton className="h-6 w-12" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                        <div className="h-10 w-px bg-border" />
                        <div className="flex flex-col items-center gap-1">
                           <Skeleton className="h-6 w-16" />
                           <Skeleton className="h-4 w-16" />
                        </div>
                         <div className="h-10 w-px bg-border" />
                        <div className="flex flex-col items-center gap-1">
                           <Skeleton className="h-6 w-14" />
                           <Skeleton className="h-4 w-14" />
                        </div>
                    </div>

                    <div className="flex w-full items-center gap-2">
                       <Skeleton className="h-10 w-full rounded-full" />
                       <Skeleton className="h-10 w-full rounded-full" />
                    </div>
                </div>
            </div>
        </div>


        <Separator className="my-8" />
        
        <div className="space-y-4">
          <Skeleton className="h-7 w-48 mb-6" />
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-32 rounded-full" />
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Store Photos Skeleton */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6">
            Store Photos
          </h2>
          <div className="grid grid-cols-2 grid-rows-2 sm:grid-cols-4 sm:grid-rows-2 gap-2 h-64 sm:h-96">
              <div className="sm:col-span-2 sm:row-span-2">
                <Skeleton className="w-full h-full rounded-[15px]" />
              </div>
              <div className="sm:col-span-1">
                 <Skeleton className="w-full h-full rounded-[15px]" />
              </div>
               <div className="sm:col-span-1">
                 <Skeleton className="w-full h-full rounded-[15px]" />
              </div>
               <div className="sm:col-span-2">
                 <Skeleton className="w-full h-full rounded-[15px]" />
              </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="mb-8">
          <Skeleton className="h-7 w-48 mb-6" />
          <div className="relative">
             <Skeleton className="h-80 w-full rounded-[15px]" />
             <div className="absolute top-2 right-2">
                <Skeleton className="h-8 w-8 rounded-full" />
             </div>
          </div>
        </div>

        <Separator className="my-8" />
        
        <div className="border-b mb-6">
            <div className="flex justify-center gap-8">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
            </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square rounded-[15px]" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-1/4" />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
