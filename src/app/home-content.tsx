'use client';

import { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { ProductView } from '@/components/products/product-view';
import { products as staticProducts, categories as staticCategories, brands as staticBrands, stores as staticStores, type Product, type Store } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StoreCard } from '@/components/stores/store-card';
import { ProductGrid } from '@/components/products/product-grid';
import { HeroSection } from '@/components/home/hero-section';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { 
  Leaf, 
  UtensilsCrossed, 
  Palette, 
  Package, 
  Sparkles, 
  Home, 
  CupSoda, 
  Shirt,
  LayoutGrid
} from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { MoormyBot } from '@/components/chat/moormy-bot';
import { productService } from '@/supabase/services/products';
import { storeService } from '@/supabase/services/stores';
import { dbProductToProduct, storeViewToStore } from '@/lib/db-adapters';

const MAX_PRICE = 15000;

const categoryIcons: Record<string, any> = {
  'Fresh Produce': Leaf,
  'Local Delicacies': UtensilsCrossed,
  'Handicrafts': Palette,
  'Pantry Staples': Package,
  'Wellness & Herbs': Sparkles,
  'Home Decor': Home,
  'Beverages': CupSoda,
  'Native Fashion': Shirt,
};

export function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [activeTab, setActiveTab] = useState('shop');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number]>([MAX_PRICE]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isClient, setIsClient] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  // Real data state - merged static + DB
  const [allProducts, setAllProducts] = useState<Product[]>(staticProducts);
  const [allStores, setAllStores] = useState<Store[]>(staticStores);
  const [allCategories, setAllCategories] = useState<string[]>(staticCategories);
  const [allBrands, setAllBrands] = useState<string[]>(staticBrands);
  const [dbDataLoaded, setDbDataLoaded] = useState(false);

  // Load real data from Supabase on mount
  useEffect(() => {
    const loadDbData = async () => {
      try {
        const [dbProducts, dbStores] = await Promise.all([
          productService.getAllProducts(),
          storeService.getAllStores(),
        ]);

        // Merge DB products with static (DB first, then static as fallback)
        const dbConverted = dbProducts.map(dbProductToProduct);
        const mergedProducts = [...dbConverted, ...staticProducts];
        setAllProducts(mergedProducts);

        // Merge DB stores with static
        const dbStoresConverted = dbStores.map(storeViewToStore);
        const mergedStores = [...dbStoresConverted, ...staticStores];
        setAllStores(mergedStores);

        // Update categories and brands from merged data
        const cats = [...new Set(mergedProducts.map(p => p.category))];
        const brnds = [...new Set(mergedProducts.map(p => p.brand))];
        setAllCategories(cats);
        setAllBrands(brnds);
      } catch (error) {
        console.error('Failed to load DB data, using static fallback:', error);
      } finally {
        setDbDataLoaded(true);
      }
    };

    loadDbData();
  }, []);

  useEffect(() => {
    setIsClient(true);
    
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsShrunk(true);
      } else {
        setIsShrunk(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useLayoutEffect(() => {
    if (!tabContainerRef.current) return;

    const activeTrigger = tabContainerRef.current.querySelector(`[data-value="${activeTab}"]`);
    const activeIcon = activeTrigger?.querySelector('img');
    
    // Animate all icons to default state first
    gsap.to(tabContainerRef.current.querySelectorAll('img'), {
      filter: 'brightness(1)',
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });

    if (activeIcon) {
        gsap.to(activeIcon, { 
            duration: 0.4, 
            scale: 1, 
            filter: 'brightness(1.25)', 
            ease: "power2.out",
        });
    }

  }, [activeTab]);

  useEffect(() => {
    if (initialSearch) {
      const newUrl = `/?search=${encodeURIComponent(initialSearch)}`;
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
    }
  }, [initialSearch]);


  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);
      const brandMatch =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const priceMatch = product.price <= priceRange[0];
      const searchMatch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && brandMatch && priceMatch && searchMatch;
    });
  }, [allProducts, selectedCategories, selectedBrands, priceRange, searchQuery]);
  
  const dealProducts = useMemo(() => allProducts.filter(p => p.onSale).slice(0, 8), [allProducts]);

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([MAX_PRICE]);
    setSearchQuery('');
    router.replace('/', { scroll: false });
  };

  const handleSearch = (query: string) => {
      setSearchQuery(query);
      const newUrl = query ? `/?search=${encodeURIComponent(query)}` : '/';
      router.replace(newUrl, { scroll: false });
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const filterState = {
    brands: allBrands,
    selectedBrands,
    setSelectedBrands,
    priceRange,
    setPriceRange,
    maxPrice: MAX_PRICE,
    onClear: handleClearFilters,
    setSearchQuery: handleSearch,
    searchQuery,
    showSearch: true,
  };

  const searchPlaceholder =
    activeTab === 'stores' ? 'Search stores...' : 'Search products...';

  return (
    <>
      <Header {...filterState} searchPlaceholder={searchPlaceholder} />
      <main className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center shadow-sm md:sticky md:top-16 bg-background z-30 relative">
            <TabsList ref={tabContainerRef} value={activeTab} className="rounded-none bg-transparent p-0 h-auto gap-8">
              <TabsTrigger
                value="shop"
                className="group flex flex-col gap-1 rounded-none border-b-2 border-transparent data-[state=active]:text-foreground -mb-px pt-3 px-3 pb-2 bg-transparent transition-all duration-300"
              >
                <div className={cn(
                  "relative transition-all duration-300 ease-in-out h-10 w-10 overflow-hidden",
                  isShrunk ? "md:h-0 md:opacity-0 md:scale-95" : "md:h-10 md:opacity-100 md:scale-100"
                )}>
                   <Image
                    src="https://image2url.com/r2/default/images/1767355724970-94a23b61-9566-4738-b2a1-e0e1a7997053.png"
                    alt="Shop Icon"
                    width={40}
                    height={40}
                    className="object-contain transition-all"
                  />
                </div>
                <span className="text-xs transition-transform duration-300">Shop</span>
              </TabsTrigger>
              <TabsTrigger
                value="stores"
                className="group flex flex-col gap-1 rounded-none border-b-2 border-transparent data-[state=active]:text-foreground -mb-px pt-3 px-3 pb-2 bg-transparent transition-all duration-300"
              >
                <div className={cn(
                  "relative transition-all duration-300 ease-in-out h-10 w-10 overflow-hidden",
                  isShrunk ? "md:h-0 md:opacity-0 md:scale-95" : "md:h-10 md:opacity-100 md:scale-100"
                )}>
                  <Image
                    src="https://image2url.com/r2/default/images/1767356315406-b60c97a2-04ce-4137-8a55-6d1a8f51fef2.png"
                    alt="Stores Icon"
                    width={40}
                    height={40}
                    className="object-contain transition-all"
                  />
                </div>
                <span className="text-xs transition-transform duration-300">Stores</span>
              </TabsTrigger>
              <TabsTrigger
                value="deals"
                className="group flex flex-col gap-1 rounded-none border-b-2 border-transparent data-[state=active]:text-foreground -mb-px pt-3 px-3 pb-2 bg-transparent transition-all duration-300"
              >
                <div className={cn(
                  "relative transition-all duration-300 ease-in-out h-10 w-10 overflow-hidden",
                  isShrunk ? "md:h-0 md:opacity-0 md:scale-95" : "md:h-10 md:opacity-100 md:scale-100"
                )}>
                  <Image
                    src="https://image2url.com/r2/default/images/1767356441624-93799530-2fc0-474e-8dea-661b25e57bf4.png"
                    alt="Deals Icon"
                    width={40}
                    height={40}
                    className="object-contain transition-all"
                  />
                </div>
                <span className="text-xs transition-transform duration-300">Deals</span>
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="shop" className="m-0">
            <HeroSection />
            
            {/* Category Navigation - Hidden on Mobile */}
            <div className="hidden md:block bg-background py-6 shadow-sm border-b">
              <div className="px-4 md:px-6">
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex w-max space-x-4 pb-4">
                    <button
                      onClick={() => setSelectedCategories([])}
                      className={cn(
                        "flex flex-col items-center justify-center min-w-[72px] gap-2 transition-all",
                        selectedCategories.length === 0 ? "" : "opacity-60 grayscale"
                      )}
                    >
                      <div className={cn(
                        "h-14 w-14 rounded-full flex items-center justify-center shadow-lg transition-colors",
                        selectedCategories.length === 0 ? "bg-primary text-primary-foreground" : "bg-secondary"
                      )}>
                        <LayoutGrid className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-medium">All</span>
                    </button>
                    {allCategories.map((category) => {
                      const Icon = categoryIcons[category] || LayoutGrid;
                      const isSelected = selectedCategories.includes(category);
                      return (
                        <button
                          key={category}
                          onClick={() => toggleCategory(category)}
                          className={cn(
                            "flex flex-col items-center justify-center min-w-[72px] gap-2 transition-all",
                            isSelected ? "" : "opacity-60 grayscale"
                          )}
                        >
                          <div className={cn(
                            "h-14 w-14 rounded-full flex items-center justify-center shadow-lg transition-colors",
                            isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                          )}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <span className="text-xs font-medium">{category}</span>
                        </button>
                      );
                    })}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            </div>

            <ProductView
              products={filteredProducts}
              categories={allCategories}
              brands={allBrands}
              filterState={filterState}
              isClient={isClient}
            />
          </TabsContent>
          <TabsContent value="stores">
            <div className="p-4 md:p-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {allStores.map((store) => (
                  <StoreCard key={store.id} store={store} />
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="deals">
            <div className="p-4 md:p-6">
              <ProductGrid products={dealProducts} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <MoormyBot />
    </>
  );
}
