"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Gavel, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { CountdownTimer } from "./countdown-timer";

type ProductCardProps = {
  product: Product;
  showMoveToCart?: boolean;
};

export function ProductCard({ product, showMoveToCart = false }: ProductCardProps) {
  const { toast } = useToast();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isInWishlist = wishlist.includes(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleMoveToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
    removeFromWishlist(product.id);
    toast({
      title: "Moved to Cart",
      description: `${product.name} has been moved to your cart.`,
    });
  };

  return (
    <div className="group">
      <div className="relative aspect-square rounded-[15px] overflow-hidden bg-white mb-2">
        <Link href={`/products/${product.id}`} className="block h-full w-full">
          <Image
            src={product.image.src}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            data-ai-hint={product.image.hint}
          />
        </Link>
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start">
          {product.isAuction && (
            <>
              <Badge variant="destructive" className="h-6 px-2 shadow-sm">
                <Gavel className="h-3 w-3 mr-1" />
                Bidding
              </Badge>
              {product.bidEndTime && (
                <Badge variant="secondary" className="h-6 px-2 bg-white/90 text-foreground shadow-sm">
                  <CountdownTimer
                    endTime={product.bidEndTime}
                    showIcon={false}
                    suffix="left"
                    className="text-foreground font-bold"
                  />
                </Badge>
              )}
            </>
          )}
          {product.onSale && !product.isAuction && (
            <Badge variant="destructive" className="h-6 px-2 shadow-sm">On Sale</Badge>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <Badge variant="secondary" className="h-6 px-2 shadow-sm">Low Stock</Badge>
          )}
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/70 hover:bg-background"
          aria-label="Add to wishlist"
          onClick={handleWishlistClick}
        >
          <Heart className={cn("h-4 w-4", isInWishlist && "fill-destructive text-destructive")} />
        </Button>
      </div>
      <div className="px-1">
        <h3 className="text-sm font-semibold leading-tight truncate">{product.name}</h3>
        {product.isAuction ? (
          <div className="mt-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Current Bid</p>
            <p className="text-sm font-bold text-primary">
              ₱{product.currentBid?.toFixed(2)}
            </p>
          </div>
        ) : (
          <>
            {product.rating && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
            )}
            <p className="text-sm font-medium text-muted-foreground mt-0.5">
              ₱{product.price.toFixed(2)}
            </p>
          </>
        )}
      </div>
      {showMoveToCart && !product.isAuction && (
        <Button
          variant="default"
          size="sm"
          className="w-full mt-3 rounded-[30px]"
          onClick={handleMoveToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Move to Cart
        </Button>
      )}
    </div>
  );
}
