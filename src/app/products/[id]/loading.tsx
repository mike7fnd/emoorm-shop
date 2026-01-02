import { Header } from '@/components/layout/header';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function ProductLoading() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="flex flex-col gap-4">
            <Skeleton className="relative aspect-square rounded-[15px] shadow-lg" />
            <div className="flex justify-center gap-2">
                <Skeleton className="h-2 w-4 rounded-full" />
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-2 w-2 rounded-full" />
            </div>
          </div>
          <div className="flex flex-col">
            <Skeleton className="h-7 w-3/4 mb-4" />
            <Skeleton className="h-7 w-1/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-6" />

            <div className="flex gap-2 w-full max-w-sm">
              <Skeleton className="h-12 w-full rounded-[30px]" />
              <Skeleton className="h-12 w-full rounded-[30px]" />
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>

            <Separator className="my-8" />

            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        <div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start mb-8">
            <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-[15px]">
              <Skeleton className="h-16 w-24 mb-2" />
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-32 mt-2" />
            </div>
            <div className="space-y-3 w-full">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-2 w-full rounded-full" />
                  <Skeleton className="h-4 w-10" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="w-full space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-12" />

        <div>
          <h2 className="text-xl font-bold mb-6">More Like This</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
            {[...Array(5)].map((_, i) => (
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
  );
}
