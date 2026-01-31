
import { AccountHeader } from '@/components/layout/account-header';
import { Skeleton } from '@/components/ui/skeleton';

export default function VouchersLoading() {
  return (
    <>
      <AccountHeader title="My Vouchers" />
      <main className="container mx-auto px-4 pt-4 pb-24 md:pb-8">
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-[30px]" />
            ))}
        </div>
      </main>
    </>
  );
}
