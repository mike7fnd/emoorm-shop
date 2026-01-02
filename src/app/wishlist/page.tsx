
'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/product-grid';
import { products } from '@/lib/data';
import type { Product } from '@/lib/data';
import { useWishlist } from '@/hooks/use-wishlist';
import Link from 'next/link';
import { Heart, Share2, ArrowUpDown, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';

type SortOption = 'date-desc' | 'price-asc' | 'price-desc';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const { toast } = useToast();

  const wishlistedProducts = useMemo(() => {
    const originalOrderProducts = wishlist.map(id => products.find(p => p.id === id)).filter((p): p is Product => !!p);

    switch (sortOption) {
      case 'price-asc':
        return [...originalOrderProducts].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...originalOrderProducts].sort((a, b) => b.price - a.price);
      case 'date-desc':
      default:
        return originalOrderProducts.reverse();
    }
  }, [wishlist, sortOption]);
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Your wishlist link has been copied to the clipboard.",
    });
  };

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case 'price-asc':
        return 'Price: Low to High';
      case 'price-desc':
        return 'Price: High to Low';
      case 'date-desc':
      default:
        return 'Date Added: Newest';
    }
  };

  return (
    <>
      <div className="hidden md:block">
        <Header showSearch={false} />
      </div>
      <main className="container mx-auto px-4 pt-4 pb-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg font-semibold">My Wishlist</h1>
          {wishlistedProducts.length > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="default" size="icon" onClick={handleShare} className="rounded-full">
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full md:w-auto md:px-3 md:justify-start">
                    <ArrowUpDown className="h-4 w-4 md:mr-2" />
                     <span className="hidden md:inline">{getSortLabel(sortOption)}</span>
                     <span className="sr-only">Sort products</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortOption('date-desc')}>
                    Date Added: Newest
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('price-asc')}>
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('price-desc')}>
                    Price: High to Low
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Rename Wishlist</DropdownMenuItem>
                  <DropdownMenuItem>Change Privacy</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                    Delete Wishlist
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        
        {wishlistedProducts.length > 0 ? (
          <ProductGrid products={wishlistedProducts} showMoveToCart={true} />
        ) : (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-24 h-24 bg-secondary rounded-full">
                    <Heart className="w-12 h-12 text-muted-foreground" />
                </div>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven’t added anything to your wishlist yet.</p>
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        )}
      </main>
    </>
  );
}
