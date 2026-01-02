import { Header } from '@/components/layout/header';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function OrdersLoading() {
  return (
    <>
      <div className="hidden md:block">
        <Header showSearch={false} />
      </div>
      <main className="container mx-auto px-4 pt-4 pb-24 md:pb-8">
        <Skeleton className="h-8 w-48 mb-4" />
        
        <div className="border-b mb-8">
            <div className="flex h-auto gap-8 justify-center w-full">
                {[...Array(5)].map((_,i) => (
                    <div key={i} className="flex flex-col gap-1 items-center pb-2 pt-3 px-1">
                        <Skeleton className="h-5 w-5 rounded-md" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                ))}
            </div>
        </div>

        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border rounded-[15px] p-4 space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Separator />
              <div className="flex gap-4">
                <Skeleton className="h-20 w-20 rounded-[15px]" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
              <Separator />
              <div className="flex justify-end items-center gap-4">
                 <Skeleton className="h-5 w-40" />
                 <Skeleton className="h-10 w-28 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
