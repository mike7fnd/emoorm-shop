
import { AccountHeader } from '@/components/layout/account-header';
import { Skeleton } from '@/components/ui/skeleton';

export default function PaymentLoading() {
  return (
    <>
      <AccountHeader title="Payment Methods" />
      <main className="container mx-auto px-4 pt-4 pb-24 md:pb-8">
        <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-10 w-28" />
        </div>
        <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-[30px]" />
            ))}
        </div>
      </main>
    </>
  );
}
