
import { AccountHeader } from '@/components/layout/account-header';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationsLoading() {
  return (
    <>
      <AccountHeader title="Notifications" />
      <main className="container mx-auto px-4 pt-4 pb-24 md:pb-8">
        <div className="space-y-0 divide-y">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            ))}
        </div>
      </main>
    </>
  );
}
