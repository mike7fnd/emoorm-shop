import { CheckoutHeader } from '@/components/layout/checkout-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function CheckoutLoading() {
  return (
    <>
      <CheckoutHeader />
      <main className="container mx-auto px-4 pt-4 pb-24 md:pb-8">
        <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-start">
          <div className="md:col-span-3 space-y-8">
            {/* Shipping Info Skeleton */}
            <div className="border rounded-[15px] p-6 space-y-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-2/3" />
                    </div>
                </div>
            </div>

            {/* Payment Method Skeleton */}
            <div className="border rounded-[15px] p-6 space-y-4">
              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
          
          {/* Order Summary Skeleton */}
          <div className="md:col-span-2">
             <div className="border rounded-[15px] p-6 space-y-4">
              <Skeleton className="h-7 w-36 mb-4" />
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-[15px]" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                 <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <Separator />
               <div className="flex justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-28" />
              </div>
              <Skeleton className="h-12 w-full rounded-full" />
               <Skeleton className="h-3 w-3/4 mx-auto" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
