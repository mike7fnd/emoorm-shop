
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Heart, User, ShoppingBag, Filter, Package, ShoppingCart, MessageSquare, ArrowLeftRight, Settings, Store, MapPin, CreditCard, HelpCircle, Shield, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Filters } from "@/components/products/filters";
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchDropdown } from "./search-dropdown";
import { useSearchHistory } from "@/hooks/use-search-history";
import { type Product } from "@/lib/data";
import { useAllProducts } from "@/hooks/use-all-products";
import { useUser, useAuth } from "@/supabase/provider";
import { auth } from "@/supabase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const pathname = usePathname();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const showSearch = props.showSearch !== false;
  const isMobile = useIsMobile();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { searchHistory, addSearchTerm, clearSearchHistory } = useSearchHistory();
  const [localSearch, setLocalSearch] = useState(props.searchQuery || '');
  const { products } = useAllProducts();

  const isSellerMode = pathname.startsWith('/account/my-shop');
  const { user } = useUser();
  const supabase = useAuth();
  const [sellerProfileId, setSellerProfileId] = useState<string | null>(null);
  const [avatarSrc, setAvatarSrc] = useState('https://picsum.photos/seed/user/100/100');

  useEffect(() => {
    if (!user?.id) return;
    const loadUserData = async () => {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
        if (profileData?.avatar_url) setAvatarSrc(profileData.avatar_url);
      } catch {}
    };
    loadUserData();

    const handleAvatarUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      setAvatarSrc(customEvent.detail.newAvatar);
    };
    window.addEventListener('avatar-updated', handleAvatarUpdate);
    return () => window.removeEventListener('avatar-updated', handleAvatarUpdate);
  }, [user?.id, supabase]);

  useEffect(() => {
    if (!user?.id) return;
    const loadSellerId = async () => {
      try {
        const { data } = await supabase
          .from('seller_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();
        if (data) setSellerProfileId(data.id);
      } catch {}
    };
    loadSellerId();
  }, [user?.id, supabase]);

  const handleSignOut = async () => {
    await auth.signOut(supabase);
  };

  const userEmail = user?.email || 'User';
  const userName = user?.user_metadata?.name || userEmail.split('@')[0] || 'User';
  const userAvatar = user?.user_metadata?.avatar_url || avatarSrc;

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
}, [searchHistory, products]);

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
    <header className="sticky top-0 z-40 bg-white">
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
        
        {/* Seller mode: centered nav links */}
        {isSellerMode && (
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {[
              { href: '/account/my-shop', label: 'Dashboard' },
              { href: '/account/my-shop/products', label: 'Products' },
              { href: '/account/my-shop/orders', label: 'Orders' },
              { href: '/account/my-shop/messages', label: 'Messages' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium py-1 transition-colors",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Right side icons */}
        <div className={cn(
          "hidden md:flex items-center gap-2",
          "ml-auto"
        )}>
          {isSellerMode ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Seller menu">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {sellerProfileId && (
                  <DropdownMenuItem asChild>
                    <Link href={`/stores/${sellerProfileId}`} className="flex items-center gap-2 cursor-pointer">
                      <Store className="h-4 w-4" />
                      View Public Store
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/account" className="flex items-center gap-2 cursor-pointer">
                    <ArrowLeftRight className="h-4 w-4" />
                    Switch to Personal
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/my-shop/settings" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
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
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Account" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userAvatar} data-ai-hint="portrait" />
                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[220px] rounded-xl">
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold truncate">{userName}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="flex items-center gap-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={sellerProfileId ? '/account/my-shop' : '/account/seller-registration'} className="flex items-center gap-2 cursor-pointer">
                        <Store className="h-4 w-4" />
                        {sellerProfileId ? 'My Shop' : 'Be a Seller'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account/settings" className="flex items-center gap-2 cursor-pointer">
                        <Settings className="h-4 w-4" />
                        Account Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/address" className="flex items-center gap-2 cursor-pointer">
                        <MapPin className="h-4 w-4" />
                        Shipping Addresses
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/payment" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="h-4 w-4" />
                        Payment Methods
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account/help" className="flex items-center gap-2 cursor-pointer">
                        <HelpCircle className="h-4 w-4" />
                        Help Center
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/privacy" className="flex items-center gap-2 cursor-pointer">
                        <Shield className="h-4 w-4" />
                        Privacy Policy
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/switch" className="flex items-center gap-2 cursor-pointer">
                        <Users className="h-4 w-4" />
                        Switch Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="icon" aria-label="Account" asChild>
                  <Link href="/account">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              )}
            </>
          )}
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
