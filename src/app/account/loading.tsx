
import { Header } from '@/components/layout/header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AccountLoading() {
  return (
    <>
      <div className="hidden md:block">
        <Header showSearch={false} />
      </div>
      <main className="pb-24 md:pb-8">
        <div className="md:hidden h-16 flex items-center justify-between px-4">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <div className="container mx-auto px-4 pt-0 md:pt-8 relative">
          <Card className="max-w-md mx-auto rounded-[30px]">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Skeleton className="h-24 w-24 rounded-full mb-4 border-4 border-background shadow-lg" />
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-5 w-56" />
              </div>
            </CardContent>
          </Card>

          <Card className="max-w-md mx-auto rounded-[30px] mt-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-around w-full">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <Skeleton className="h-7 w-7" />
                    <Skeleton className="h-3 w-16 mt-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="max-w-md mx-auto grid grid-cols-2 gap-4 mt-8">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-4">
                <Skeleton className="h-24 w-24" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-4">
                <Skeleton className="h-24 w-24" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
