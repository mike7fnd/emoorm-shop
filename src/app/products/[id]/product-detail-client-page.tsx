'use client';

import Image from 'next/image';
import type { Product } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Star, Store, Heart } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import React from 'react';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/hooks/use-wishlist';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';

type ReviewSummary = {
    average: number;
    total: number;
    distribution: { stars: number; percentage: number }[];
};

type ProductDetailClientPageProps = {
  product: Product;
  reviewSummary: ReviewSummary;
};

export function ProductDetailClientPage({ product, reviewSummary }: ProductDetailClientPageProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const { toast } = useToast();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isInWishlist = wishlist.includes(product.id);

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product.id);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleAddToCart = () => {
    addToCart(product.id);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  
  const totalSlides = 3;

  return (
    <>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="relative shadow-lg rounded-[15px] overflow-hidden">
              <Carousel className="w-full" setApi={setApi}>
                <CarouselContent>
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-square">
                        <Image
                          src={product.image.src}
                          alt={`${product.name} view ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          data-ai-hint={product.image.hint}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
            </div>
            <div className="flex justify-center items-center gap-2 mt-4">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    current === index + 1 ? 'w-4 bg-primary' : 'w-2 bg-accent'
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold mb-2">{product.name}</h1>
            <p className="text-xl font-medium text-muted-foreground mb-4">
              ₱{product.price.toFixed(2)}
            </p>
            <p className="text-muted-foreground mb-6">{product.description}</p>

            <div className="flex gap-2 w-full max-w-sm">
               <Button variant="outline" size="lg" className="rounded-[30px] w-full" onClick={handleAddToCart}>
                Add to Cart
              </Button>
               <Button size="lg" className="rounded-[30px] w-full">
                Buy Now
              </Button>
               <Button 
                variant={isInWishlist ? "default" : "outline"} 
                size="icon" 
                className="rounded-full flex-shrink-0"
                onClick={handleWishlistToggle}
                aria-label="Toggle Wishlist"
              >
                <Heart className={cn("h-5 w-5", isInWishlist && "fill-current")} />
              </Button>
            </div>

            <Separator className="my-8" />

            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="https://picsum.photos/seed/shop/100/100" />
                <AvatarFallback>
                  <Store />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-lg">{product.brand}</h2>
                <p className="text-sm text-muted-foreground">
                  Quezon City, Philippines
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mt-8 mb-12" />

        <div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start mb-8">
            <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-[15px]">
              <p className="text-6xl font-bold">
                {reviewSummary.average.toFixed(1)}
              </p>
              <div
                className="flex items-center text-yellow-500"
                style={{ filter: 'drop-shadow(0 0 0.25rem #facc15)' }}
              >
                {[...Array(Math.floor(reviewSummary.average))].map((_, i) => (
                  <Star key={i} className="w-7 h-7 fill-current" />
                ))}
                {reviewSummary.average % 1 !== 0 && (
                  <Star
                    className="w-7 h-7 text-yellow-500"
                    style={{
                      clipPath: `inset(0 ${
                        100 - (reviewSummary.average % 1) * 100
                      }% 0 0)`,
                    }}
                  />
                )}
                {[...Array(5 - Math.ceil(reviewSummary.average))].map((_, i) => (
                  <Star
                    key={i}
                    className="w-7 h-7 text-muted-foreground fill-muted"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {reviewSummary.total} reviews
              </p>
            </div>
            <div className="space-y-2 w-full">
              {reviewSummary.distribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {item.stars} star{item.stars > 1 ? 's' : ''}
                  </span>
                  <Progress value={item.percentage} className="w-2" />
                  <span className="text-sm text-muted-foreground w-10 text-right">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage src="https://picsum.photos/seed/user1/40/40" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Jane Doe</h3>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  This product is amazing! High quality and looks great. Would
                  definitely recommend.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage src="https://picsum.photos/seed/user2/40/40" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">John Smith</h3>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <Star className="w-4 h-4 text-muted-foreground fill-muted" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Good product, but the color was slightly different from the
                  pictures. Still happy with it.
                </p>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
