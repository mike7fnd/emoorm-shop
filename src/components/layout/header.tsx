
"use client";

import Link from "next/link";
import { Search, Heart, User, ShoppingBag, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Filters } from "@/components/products/filters";
import { useIsMobile } from "@/hooks/use-mobile";

type FilterProps = {
  brands: string[];
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  priceRange: [number];
  setPriceRange: (range: [number]) => void;
  maxPrice: number;
  onClear: () => void;
  setSearchQuery: (query: string) => void;
  searchQuery?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
};


export function Header(props: Partial<FilterProps>) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const showSearch = props.showSearch !== false;
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-40 md:bg-background/95 md:backdrop-blur-sm">
      <div className="h-16 flex items-center justify-between gap-4 px-4 sm:px-6 relative">
        <Link href="/" className="hidden lg:flex items-center gap-2 mr-4">
          <ShoppingBag className="h-6 w-6" />
          <span className="text-lg font-semibold tracking-tight">Wink</span>
        </Link>

        {showSearch && props.setSearchQuery && (
          <div className="flex-1 md:w-auto flex justify-center">
            <div className="relative w-full max-w-md md:max-w-xl">
              <div
                data-state={isFilterOpen ? 'open' : 'closed'}
                className={cn(
                  "relative bg-background border border-border/20 z-20",
                  isFilterOpen ? 'rounded-t-[30px]' : 'rounded-[30px]',
                  !isFilterOpen && 'shadow-lg'
                )}
              >
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  type="search"
                  placeholder={props.searchPlaceholder || 'Search products...'}
                  className="pl-12 pr-12 w-full h-12 text-base bg-transparent border-0 shadow-none focus-visible:ring-0"
                  onChange={(e) => props.setSearchQuery!(e.target.value)}
                  defaultValue={props.searchQuery}
                  onFocus={() => setIsFilterOpen(true)}
                />
                <div 
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <ChevronDown className={cn("h-5 w-5 transition-transform text-muted-foreground", isFilterOpen && "rotate-180")} />
                </div>
              </div>
              
              <div
                data-state={isFilterOpen ? 'open' : 'closed'}
                className="absolute top-full left-0 right-0 z-10 grid transition-[grid-template-rows] duration-500 ease-in-out data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]"
              >
                <div className="overflow-hidden">
                    <div className={cn(
                      "bg-background rounded-b-[30px] shadow-lg border border-t-0 border-border/20 pt-2 pb-4 max-h-[60vh] overflow-y-auto"
                    )}>
                        {props.brands && (
                            <Filters
                                brands={props.brands}
                                selectedBrands={props.selectedBrands!}
                                setSelectedBrands={props.setSelectedBrands!}
                                priceRange={props.priceRange!}
                                setPriceRange={props.setPriceRange!}
                                maxPrice={props.maxPrice!}
                                onClear={() => {
                                  props.onClear!();
                                  setIsFilterOpen(false);
                                }}
                            />
                        )}
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className={cn(
          "hidden md:flex items-center gap-2",
          showSearch ? "ml-auto" : "ml-auto"
        )}>
          <Button variant="ghost" size="icon" aria-label="Wishlist" asChild>
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Cart" asChild>
             <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Account" asChild>
            <Link href="/account">
              <User className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
      {isMobile && (
        <div 
          className={cn(
            "fixed inset-0 bg-background/30 backdrop-blur-sm z-0 transition-opacity",
            isFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </header>
  );
}
