import { Header } from '@/components/layout/header';
import { Skeleton } from '@/components/ui/skeleton';

export default function AddressLoading() {
  return (
    <>
      <div className="hidden md:block">
        <Header showSearch={false} />
      </div>
      <main className="container mx-auto px-4 pt-4 pb-24 md:pb-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-[15px] p-4 space-y-3 shadow-card-shadow">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                </div>
                <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                 <div className="flex justify-end gap-2 pt-2">
                    <Skeleton className="h-9 w-20 rounded-full" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
