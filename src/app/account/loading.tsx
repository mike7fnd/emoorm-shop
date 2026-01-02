import { Header } from '@/components/layout/header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AccountLoading() {
  return (
    <>
      <div className="hidden md:block">
        <Header showSearch={false} />
      </div>
      <main className="container mx-auto px-4 pt-4 pb-24 md:pb-8">
        <div className="flex flex-col items-center md:items-start md:flex-row md:gap-8 mb-8">
            <Skeleton className="h-24 w-24 rounded-full mb-4 md:mb-0" />
            <div className="text-center md:text-left md:mt-4 space-y-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-5 w-56" />
            </div>
        </div>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-around">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <Skeleton className="h-6 w-36" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-center md:justify-start">
            <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </main>
    </>
  );
}
