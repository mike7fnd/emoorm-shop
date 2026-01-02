import { Header } from '@/components/layout/header';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function StoreDetailLoading() {
  return (
    <>
      <Header showSearch={true} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="w-full h-48 md:h-64 rounded-[15px] mb-8" />

        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
        
        <Separator className="my-8" />

        <Skeleton className="h-7 w-56 mb-6" />
        
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
