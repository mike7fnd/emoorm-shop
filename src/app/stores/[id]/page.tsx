'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { stores, products } from '@/lib/data';
import { Header } from '@/components/layout/header';
import { ProductGrid } from '@/components/products/product-grid';
import { Button } from '@/components/ui/button';
import { UserPlus, MessageCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function StoreDetailPage() {
  const params = useParams<{ id: string }>();
  
  const store = stores.find((s) => s.id === params.id);

  if (!store) {
    notFound();
    return null;
  }

  // In our mock data, the store name and product brand are the same.
  const storeProducts = products.filter((p) => p.brand === store.name);

  return (
    <>
      <Header showSearch={true} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative w-full h-48 md:h-64 rounded-[15px] overflow-hidden mb-8">
          <Image
            src={store.image.src}
            alt={`${store.name} banner`}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            data-ai-hint={store.image.hint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white shadow-md">{store.name}</h1>
            <p className="text-sm text-white/90 shadow-sm">{store.address}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-8">
          <Button className="rounded-[30px]">
            <UserPlus className="mr-2 h-4 w-4" />
            Follow
          </Button>
          <Button variant="outline" className="rounded-[30px]">
            <MessageCircle className="mr-2 h-4 w-4" />
            Message
          </Button>
        </div>
        
        <Separator className="my-8" />

        <h2 className="text-xl font-bold mb-6">Products from {store.name}</h2>
        <ProductGrid products={storeProducts} />
      </main>
    </>
  );
}
