'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Store } from '@/lib/data';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ChevronRight } from 'lucide-react';

type StoreCardProps = {
  store: Store;
};

export function StoreCard({ store }: StoreCardProps) {
  return (
    <Link href={`/stores/${store.id}`} className="group">
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative aspect-[4/3]">
          <Image
            src={store.image.src}
            alt={store.name}
            fill
            className="object-cover duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={store.image.hint}
          />
        </div>
        <CardContent className="p-4 flex-grow">
          <h3 className="text-lg font-semibold">{store.name}</h3>
          <div className="flex items-center text-muted-foreground mt-2">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <p className="text-sm line-clamp-1">{store.address}</p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button variant="outline" className="w-full rounded-[30px]">
            Visit Store <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
