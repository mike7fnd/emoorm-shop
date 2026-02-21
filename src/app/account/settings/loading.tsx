
import { AccountHeader } from '@/components/layout/account-header';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsLoading() {
  return (
    <>
      <AccountHeader title="Account Settings" />
      <main className="container mx-auto px-4 pt-4 pb-24 md:pb-8">
        <div className="rounded-[30px] p-0 bg-white">
            <div className="space-y-0 divide-y">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-6 w-6" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </div>
                        <Skeleton className="h-5 w-5" />
                    </div>
                ))}
            </div>
        </div>
        <Skeleton className="h-10 w-full mt-8" />
      </main>
    </>
  );
}
