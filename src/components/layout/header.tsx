
"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Heart, User, ShoppingBag, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Filters } from "@/components/products/filters";
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchDropdown } from "./search-dropdown";
import { useSearchHistory } from "@/hooks/use-search-history";
import { products, type Product } from "@/lib/data";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const showSearch = props.showSearch !== false;
  const isMobile = useIsMobile();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { searchHistory, addSearchTerm, clearSearchHistory } = useSearchHistory();
  const [localSearch, setLocalSearch] = useState(props.searchQuery || '');

  const suggestions = localSearch ? products.filter(p => p.name.toLowerCase().includes(localSearch.toLowerCase())).slice(0, 5) : [];

  const recommendedProducts = useMemo(() => {
    if (searchHistory.length === 0) return [];
    
    const recommendations: Product[] = [];
    const addedProductIds = new Set<string>();

    const recentSearchTerms = searchHistory.slice(0, 2);

    for (const term of recentSearchTerms) {
        const lowerCaseTerm = term.toLowerCase();
        
        // Find categories that match the search term
        const matchingProducts = products.filter(p => p.name.toLowerCase().includes(lowerCaseTerm));
        const matchingCategories = [...new Set(matchingProducts.map(p => p.category))];
        
        // Add products from those categories
        products.forEach(p => {
            if (matchingCategories.includes(p.category) && !addedProductIds.has(p.id) && recommendations.length < 6) {
                recommendations.push(p);
                addedProductIds.add(p.id);
            }
        });
    }

    // If not enough recommendations, fill with popular items
    if (recommendations.length < 6) {
        const popularProducts = [...products].sort((a,b) => b.popularity - a.popularity);
        popularProducts.forEach(p => {
            if (!addedProductIds.has(p.id) && recommendations.length < 6) {
                recommendations.push(p);
                addedProductIds.add(p.id);
            }
        });
    }

    return recommendations;
}, [searchHistory]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocalSearch(query);
    if (query) {
      if(props.setSearchQuery) props.setSearchQuery(query);
      setIsSearchOpen(true);
      setIsFilterOpen(false);
    } else {
      setIsSearchOpen(true); // Keep it open to show history
    }
  };

  const handleSuggestionClick = (query: string) => {
    setLocalSearch(query);
    if (props.setSearchQuery) {
      props.setSearchQuery(query);
    }
    addSearchTerm(query);
    setIsSearchOpen(false);
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(localSearch){
        addSearchTerm(localSearch);
    }
    setIsSearchOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const isDropdownOpen = isFilterOpen || isSearchOpen;

  return (
    <header className="sticky top-0 z-40 md:bg-background">
      <div className="h-16 md:h-20 flex items-center justify-between gap-4 px-4 sm:px-6 relative">
        <Link href="/" className="hidden md:flex items-center mr-2">
          <Image 
            src="https://image2url.com/r2/default/images/1769822813493-b3b30748-4fdb-4a02-b16a-f2d85a882941.png" 
            alt="E-Moorm Logo" 
            width={100} 
            height={100} 
            className="h-20 w-20 object-contain"
          />
        </Link>

        {showSearch && props.setSearchQuery && (
          <div className="flex-1 md:w-auto flex justify-center">
            <div className="relative w-full max-w-md md:max-w-2xl" ref={searchContainerRef}>
              <div
                data-state={isDropdownOpen ? 'open' : 'closed'}
                className={cn(
                  "relative bg-background z-20",
                  isDropdownOpen ? 'rounded-t-[30px] border-x border-t' : 'rounded-[30px] border shadow-lg'
                )}
              >
                <form onSubmit={handleFormSubmit}>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    type="search"
                    placeholder={props.searchPlaceholder || 'Search products...'}
                    className="pl-12 pr-12 w-full h-12 text-base bg-transparent border-0 shadow-none focus-visible:ring-0"
                    value={localSearch}
                    onChange={handleSearchChange}
                    onFocus={() => {
                        setIsSearchOpen(true);
                        setIsFilterOpen(false);
                    }}
                  />
                   <button type="submit" className="hidden" aria-label="Submit search" />
                </form>
                <div 
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-accent"
                  onClick={() => {
                      setIsFilterOpen(!isFilterOpen);
                      setIsSearchOpen(false);
                  }}
                  aria-label="Toggle filters"
                >
                  <Filter className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <div
                data-state={isDropdownOpen ? 'open' : 'closed'}
                className="absolute top-full left-0 right-0 z-10 grid transition-[grid-template-rows] duration-300 ease-in-out data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]"
              >
                <div className="overflow-hidden">
                    <div className={cn(
                      "bg-background rounded-b-[30px] shadow-lg border-x max-h-[60vh] overflow-y-auto"
                    )}>
                       {isSearchOpen && (
                           <SearchDropdown
                                suggestions={suggestions}
                                recentSearches={searchHistory}
                                recommendedProducts={recommendedProducts}
                                onSuggestionClick={handleSuggestionClick}
                                onClearHistory={clearSearchHistory}
                           />
                       )}
                       {isFilterOpen && props.brands && (
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
            "fixed inset-0 bg-background/30 z-0 transition-opacity",
            isDropdownOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => {
              setIsFilterOpen(false);
              setIsSearchOpen(false);
          }}
        />
      )}
    </header>
  );
}
