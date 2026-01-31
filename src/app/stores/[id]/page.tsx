'use client';

import { notFound, useParams, useRouter } from 'next/navigation';
import { stores, products, placeholderImageMap } from '@/lib/data';
import { ProductGrid } from '@/components/products/product-grid';
import { StoreInfoCard } from '@/components/stores/store-info-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Share2, Heart, Expand } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMemo, useState, createElement } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as LucideIcons from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';
import { MapDetailPanel } from '@/components/map/map-detail-panel';


const StoreMap = dynamic(() => import('@/components/map/store-map'), { 
    ssr: false,
    loading: () => <div className="h-80 w-full bg-muted rounded-[15px] animate-pulse" />
});

export default function StoreDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [isMapPanelOpen, setIsMapPanelOpen] = useState(false);
  
  const store = stores.find((s) => s.id === params.id);

  if (!store) {
    notFound();
    return null;
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: store.name,
          text: `Check out ${store.name} on E-Moorm!`,
          url: window.location.href,
        });
      } catch (error: any) {
        // Silently fail if the user cancels the share dialog.
        if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
            console.error('Error sharing:', error);
             toast({
                variant: "destructive",
                title: "Sharing failed",
                description: "Could not share at this moment.",
            });
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Store link has been copied to your clipboard.",
      });
    }
  };

  const storeProducts = products.filter((p) => p.brand === store.name);

  const newestProducts = useMemo(() => {
    return [...storeProducts].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
  }, [storeProducts]);

  const popularProducts = useMemo(() => {
    return [...storeProducts].sort((a, b) => b.popularity - a.popularity);
  }, [storeProducts]);
  
  const storePhotos = [
      placeholderImageMap.get('store-1'),
      placeholderImageMap.get('store-2'),
      placeholderImageMap.get('store-3'),
      placeholderImageMap.get('store-4'),
  ].filter(Boolean);

  return (
    <>
      <header className="bg-background">
        <div className="h-16 flex items-center justify-between gap-4 px-4 sm:px-6 relative">
            <Button variant="ghost" size="icon" aria-label="Back" onClick={() => router.back()}>
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" aria-label="Share" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Favorite">
                    <Heart className="h-5 w-5" />
                </Button>
            </div>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-0">

        <StoreInfoCard store={store} />
        
        <Separator className="my-8" />
        
        <div>
          <h2 className="text-xl font-bold mb-6">About {store.name}</h2>
          <p className="text-muted-foreground mb-6">{store.about}</p>
          <div className="flex flex-wrap gap-2">
            {store.genres.map((genre, index) => {
              const IconComponent = (LucideIcons as any)[genre.icon];
              return (
                <Badge key={index} variant="outline" className="py-1 px-3">
                  {IconComponent ? (
                    <IconComponent className="h-4 w-4 mr-1.5 text-primary" />
                  ) : (
                    <LucideIcons.ShoppingBasket className="h-4 w-4 mr-1.5 text-primary" />
                  )}
                  {genre.text}
                </Badge>
              );
            })}
          </div>
        </div>

        <Separator className="my-8" />
        
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-6">
                Store Photos
            </h2>
             <div className="grid grid-cols-2 grid-rows-2 sm:grid-cols-4 sm:grid-rows-2 gap-2 h-64 sm:h-96">
                {storePhotos.map((photo, index) => (
                    photo && (
                        <div 
                            key={index} 
                            className={cn(
                                "relative rounded-[15px] overflow-hidden shadow-lg",
                                index === 0 && "sm:col-span-2 sm:row-span-2",
                                index === 1 && "sm:col-span-1",
                                index === 2 && "sm:col-span-1",
                                index === 3 && "sm:col-span-2",
                            )}
                        >
                            <Image
                                src={photo.src}
                                alt={`Store photo ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                                data-ai-hint={photo.hint}
                            />
                        </div>
                    )
                ))}
            </div>
        </div>

        <Separator className="my-8" />

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6">Our Location</h2>
          <StoreMap 
            lat={store.lat} 
            lng={store.lng} 
            onExpand={() => setIsMapPanelOpen(true)} 
          />
        </div>

        <Separator className="my-8" />

        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center border-b mb-6">
            <TabsList className="bg-transparent p-0 h-auto gap-8">
              <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none -mb-px pt-3 px-1 pb-2">All Products</TabsTrigger>
              <TabsTrigger value="newest" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none -mb-px pt-3 px-1 pb-2">Newest</TabsTrigger>
              <TabsTrigger value="popular" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none -mb-px pt-3 px-1 pb-2">Popular</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all">
            <ProductGrid products={storeProducts} />
          </TabsContent>
          <TabsContent value="newest">
            <ProductGrid products={newestProducts} />
          </TabsContent>
          <TabsContent value="popular">
            <ProductGrid popularProducts={popularProducts} />
          </TabsContent>
        </Tabs>
        
      </main>

      <MapDetailPanel 
        isOpen={isMapPanelOpen}
        onOpenChange={setIsMapPanelOpen}
        store={store}
      />
    </>
  );
}
