
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Star, Store, Heart, Gavel, Share2, ChevronLeft, MessageSquare, ShoppingCart } from 'lucide-react';
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
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/hooks/use-wishlist';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CountdownTimer } from '@/components/products/countdown-timer';
import { Input } from '@/components/ui/input';
import { ProductGrid } from '@/components/products/product-grid';

type ReviewSummary = {
    average: number;
    total: number;
    distribution: { stars: number; percentage: number }[];
};

type ProductDetailClientPageProps = {
  product: Product;
  reviewSummary: ReviewSummary;
  similarProducts: Product[];
};

export function ProductDetailClientPage({ product, reviewSummary, similarProducts }: ProductDetailClientPageProps) {
  const router = useRouter();
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const { toast } = useToast();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isInWishlist = wishlist.includes(product.id);
  const [headerBg, setHeaderBg] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 10) {
      setHeaderBg(true);
    } else {
      setHeaderBg(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
  
  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out this product: ${product.name}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Product link copied to clipboard.",
        });
      }
    } catch (error) {
      console.error("Error sharing", error);
      toast({
        variant: "destructive",
        title: "Could not share",
        description: "An error occurred while trying to share.",
      });
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
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
      <header className={cn(
        "sticky top-0 z-30 h-16 flex items-center justify-between gap-4 px-4 sm:px-6 transition-colors duration-300",
        headerBg ? "bg-background shadow-sm" : "bg-transparent"
      )}>
        <Button variant="ghost" size="icon" className="rounded-full bg-background/50 hover:bg-background" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Back</span>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-background/50 hover:bg-background" onClick={handleShare}>
            <Share2 className="h-5 w-5" />
            <span className="sr-only">Share</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-background/50 hover:bg-background" onClick={handleWishlistToggle}>
            <Heart className={cn("h-5 w-5", isInWishlist && "fill-destructive text-destructive")} />
            <span className="sr-only">Wishlist</span>
          </Button>
        </div>
      </header>

      <main className="pb-20 -mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
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
                  <div className="absolute bottom-4 right-4 z-10 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                    {current} / {count}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="relative">
                                    <Star className="w-4 h-4 text-muted fill-muted" />
                                    <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${Math.max(0, Math.min(1, reviewSummary.average - i)) * 100}%` }}>
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <span>{reviewSummary.average.toFixed(1)}</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div>{formatNumber(reviewSummary.total)} ratings</div>
                    <Separator orientation="vertical" className="h-4" />
                    <div>{formatNumber(product.sold)}+ Sold</div>
                </div>

                {product.isAuction && product.bidEndTime ? (
                  <Card className="my-4 bg-accent/50 shadow-card-shadow">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-muted-foreground">Current Bid</span>
                        <p className="text-2xl font-bold text-primary">
                          ₱{product.currentBid?.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-muted-foreground">Time Left</span>
                        <CountdownTimer endTime={product.bidEndTime} className="text-base font-bold text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <p className="text-2xl font-bold text-primary mb-4">
                    ₱{product.price.toFixed(2)}
                  </p>
                )}

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
                  </div>
                </div>
              </div>
            </div>

            <Separator className="mt-8 mb-12" />

            <Card>
                <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Product Description</h2>
                    <p className="text-sm text-muted-foreground">
                        {product.description}
                    </p>
                </CardContent>
            </Card>

            <Separator className="my-8"/>

            <Card>
                <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Product Specifications</h2>
                    <ul className="space-y-4 text-sm">
                        <li className="flex justify-between">
                            <span className="font-medium text-muted-foreground">Brand</span>
                            <span className="text-foreground">{product.brand}</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="font-medium text-muted-foreground">Category</span>
                            <span className="text-foreground">{product.category}</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="font-medium text-muted-foreground">Weight</span>
                            <span className="text-foreground">approx. 500g</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="font-medium text-muted-foreground">Dimensions</span>
                            <span className="text-foreground">10cm x 10cm x 15cm</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="font-medium text-muted-foreground">Country of Origin</span>
                            <span className="text-foreground">Philippines</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>

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
                      <Progress value={item.percentage} className="w-full" />
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
            
            <Separator className="my-12" />

            <div>
              <h2 className="text-xl font-bold mb-6">More Like This</h2>
              <ProductGrid products={similarProducts} />
            </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-30 bg-background border-t shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2">
          {product.isAuction ? (
            <div className="flex gap-2 w-full">
              <Input type="number" placeholder={`> ₱${product.currentBid?.toFixed(2)}`} className="h-12 text-base rounded-[30px] w-full"/>
              <Button size="lg" className="rounded-[30px] flex-shrink-0">
                <Gavel className="mr-2 h-5 w-5" />
                Bid
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full">
                <div className="flex-shrink-0 flex text-muted-foreground">
                    <Button variant="ghost" className="flex flex-col items-center justify-center h-full w-20 text-xs font-medium gap-1 hover:bg-transparent hover:text-primary">
                        <MessageSquare className="h-6 w-6" />
                        <span>Chat Now</span>
                    </Button>
                    <Button variant="ghost" className="flex flex-col items-center justify-center h-full w-20 text-xs font-medium gap-1 hover:bg-transparent hover:text-primary" onClick={handleAddToCart}>
                        <ShoppingCart className="h-7 w-7" />
                        <span>Add to Cart</span>
                    </Button>
                </div>
                <Button size="lg" className="rounded-[30px] w-full flex-grow">
                    Buy Now
                </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
