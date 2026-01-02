
'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { ProductView } from '@/components/products/product-view';
import { products, categories, brands, stores } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StoreCard } from '@/components/stores/store-card';
import { ProductGrid } from '@/components/products/product-grid';
import { HeroSection } from '@/components/home/hero-section';
import { cn } from '@/lib/utils';

const MAX_PRICE = 15000;

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // When the component mounts, update the URL if there's an initial search query
    // This is to keep the URL clean if the user navigates away and back.
    if (initialSearch) {
      const newUrl = `/?search=${encodeURIComponent(initialSearch)}`;
      // We use replaceState to not add a new entry to the browser history
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
    }
  }, [initialSearch]);


  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
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
  }, [selectedCategories, selectedBrands, priceRange, searchQuery]);

  const dealProducts = useMemo(() => products.slice(0, 4), []);

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

  const filterState = {
    brands,
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
          <div className="flex justify-center shadow-sm">
            <TabsList value={activeTab} className="rounded-none bg-transparent p-0 h-auto gap-8">
              <TabsTrigger
                value="shop"
                className="group flex flex-col gap-1 rounded-none border-b-2 border-transparent data-[state=active]:text-foreground -mb-px pt-3 px-3 pb-2 bg-transparent"
              >
                <div
                  className="relative h-10 w-10"
                  style={activeTab === 'shop' ? { filter: 'drop-shadow(0 0 0.5rem #facc15)' } : {}}
                >
                   <Image
                    src="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-DXDecT3Ip0rCJy8HyeBzAE9HvaqWDl.png"
                    alt="Shop Icon"
                    width={40}
                    height={40}
                    className="object-contain group-data-[state=active]:brightness-110 group-data-[state=active]:scale-125 transition-all"
                  />
                </div>
                <span className="text-xs">Shop</span>
              </TabsTrigger>
              <TabsTrigger
                value="stores"
                className="group flex flex-col gap-1 rounded-none border-b-2 border-transparent data-[state=active]:text-foreground -mb-px pt-3 px-3 pb-2 bg-transparent"
              >
                <div
                  className="relative h-10 w-10"
                  style={activeTab === 'stores' ? { filter: 'drop-shadow(0 0 0.5rem #facc15)' } : {}}
                >
                  <Image
                    src="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-l7EwBvYlsaQloF9UbdO2yIJVmdQLuK.png"
                    alt="Stores Icon"
                    width={40}
                    height={40}
                    className="object-contain group-data-[state=active]:brightness-110 group-data-[state=active]:scale-125 transition-all"
                  />
                </div>
                <span className="text-xs">Stores</span>
              </TabsTrigger>
              <TabsTrigger
                value="deals"
                className="group flex flex-col gap-1 rounded-none border-b-2 border-transparent data-[state=active]:text-foreground -mb-px pt-3 px-3 pb-2 bg-transparent"
              >
                <div
                  className="relative h-10 w-10 flex items-center justify-center"
                  style={activeTab === 'deals' ? { filter: 'drop-shadow(0 0 0.5rem #facc15)' } : {}}
                >
                  <Image
                    src="https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-c12bJfwU3bGXSu17QkqHYr7BSV5RKE.png&w=500&q=75"
                    alt="Deals Icon"
                    width={40}
                    height={40}
                    className="object-contain group-data-[state=active]:brightness-110 group-data-[state=active]:scale-125 transition-all"
                  />
                </div>
                <span className="text-xs">Deals</span>
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="shop">
            <HeroSection />
            <ProductView
              products={filteredProducts}
              categories={categories}
              brands={brands}
              filterState={filterState}
              isClient={isClient}
            />
          </TabsContent>
          <TabsContent value="stores">
            <div className="p-4 md:p-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {stores.map((store) => (
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
    </>
  );
}
